import express from 'express';
import {
  createPaymentOrder,
  verifyPaymentAndCreateOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Access restrictions to authenticated profiles
router.use(protect);

router.post('/create-payment', createPaymentOrder);
router.post('/verify-payment', verifyPaymentAndCreateOrder);
router.get('/my-orders', getMyOrders);
router.get('/:id', getOrderById);

// Admin-only endpoints
router.get('/', authorize('admin'), getAllOrders);
router.put('/:id/status', authorize('admin'), updateOrderStatus);

export default router;
