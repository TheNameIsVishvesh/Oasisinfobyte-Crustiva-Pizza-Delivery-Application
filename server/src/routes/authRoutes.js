import express from 'express';
import {
  registerUser,
  verifyEmail,
  loginUser,
  forgotPassword,
  resetPassword,
  getMe,
  getAllUsers,
  deleteUser,
} from '../controllers/authController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.get('/verify/:token', verifyEmail);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// Protected customer routes
router.get('/me', protect, getMe);

// Admin-only endpoints
router.get('/users', protect, authorize('admin'), getAllUsers);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);

export default router;
