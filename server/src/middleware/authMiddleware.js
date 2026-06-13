import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Protect routes - Verify JWT token and lock down private endpoints
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token from Bearer string
      token = req.headers.authorization.split(' ')[1];

      // Decode and verify token signature
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch user profile and attach to request
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({ status: 'error', message: 'User account no longer exists' });
      }

      next();
    } catch (error) {
      console.error('❌ Token Verification Error:', error.message);
      return res.status(401).json({ status: 'error', message: 'Not authorized, token verification failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ status: 'error', message: 'Not authorized, no token provided' });
  }
};

// Grant access to specific list of roles (e.g., admin-only routes)
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: `Forbidden: User role '${req.user?.role || 'anonymous'}' is not authorized to access this resource`,
      });
    }
    next();
  };
};
