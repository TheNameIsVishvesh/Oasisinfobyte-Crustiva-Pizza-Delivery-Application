import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendVerificationEmail, sendForgotPasswordEmail } from '../utils/emailService.js';

// Helper: Generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ status: 'error', message: 'Please provide all required fields' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ status: 'error', message: 'User already exists with this email address' });
    }

    // Create User (isVerified is true by default)
    const user = await User.create({
      name,
      email,
      password,
      isVerified: true
    });

    res.status(201).json({
      status: 'success',
      message: 'Registration successful! You can now log in.',
      userId: user._id,
    });
  } catch (error) {
    console.error('❌ Registration Error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Server error during registration' });
  }
};

// @desc    Verify email token
// @route   GET /api/auth/verify/:token
// @access  Public
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ status: 'error', message: 'Invalid or expired email verification token' });
    }

    // Activate User
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpire = undefined;
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Email address successfully verified! You can now log in.',
    });
  } catch (error) {
    console.error('❌ Email Verification Error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Server error during verification' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: 'error', message: 'Please provide email and password' });
    }

    // Find User
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ status: 'error', message: 'Invalid email or password' });
    }

    // Check Password Match
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ status: 'error', message: 'Invalid email or password' });
    }

    // Check Verification Status (Bypassed)

    // Generate Authentication Token
    const token = generateToken(user._id, user.role);

    res.status(200).json({
      status: 'success',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('❌ Login Error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Server error during authentication' });
  }
};

// @desc    Request Password Reset Token
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ status: 'error', message: 'Please provide your email address' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'No account registered with this email address' });
    }

    // Generate Reset Token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetPasswordExpire = Date.now() + 60 * 60 * 1000; // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = resetPasswordExpire;
    await user.save();

    // Send Reset Email
    await sendForgotPasswordEmail(user.email, user.name, resetToken);

    res.status(200).json({
      status: 'success',
      message: 'Password reset link sent to your email address.',
    });
  } catch (error) {
    console.error('❌ Forgot Password Error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Server error during password recovery request' });
  }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password/:token
// @access  Public
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ status: 'error', message: 'Password must be at least 6 characters long' });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ status: 'error', message: 'Invalid or expired password recovery token' });
    }

    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Password reset successful! You can now log in with your new credentials.',
    });
  } catch (error) {
    console.error('❌ Reset Password Error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Server error during password reset' });
  }
};

// @desc    Get current logged in user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User profile not found' });
    }
    res.status(200).json({
      status: 'success',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('❌ Get Profile Error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Server error fetching user profile' });
  }
};

// @desc    Admin: Get all users
// @route   GET /api/auth/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    res.status(200).json({ status: 'success', data: users });
  } catch (error) {
    console.error('❌ Get Users Error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to retrieve system users log' });
  }
};

// @desc    Admin: Delete user
// @route   DELETE /api/auth/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User record not found' });
    }
    res.status(200).json({ status: 'success', message: 'User deleted successfully' });
  } catch (error) {
    console.error('❌ Delete User Error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to delete user' });
  }
};
