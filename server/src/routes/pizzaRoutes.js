import express from 'express';
import {
  getPizzas,
  getCustomizationOptions,
  createPizza,
  updatePizza,
  deletePizza,
} from '../controllers/pizzaController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getPizzas);
router.get('/customizer-options', getCustomizationOptions);

// Admin-only protected endpoints
router.post('/', protect, authorize('admin'), createPizza);
router.put('/:id', protect, authorize('admin'), updatePizza);
router.delete('/:id', protect, authorize('admin'), deletePizza);

export default router;
