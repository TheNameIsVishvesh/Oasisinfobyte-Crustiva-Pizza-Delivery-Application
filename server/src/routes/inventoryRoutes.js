import express from 'express';
import {
  getInventory,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  reseedInventory,
} from '../controllers/inventoryController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// All inventory routes are restricted to administrators
router.use(protect);
router.use(authorize('admin'));

router.post('/reseed', reseedInventory);

router.route('/')
  .get(getInventory)
  .post(createInventoryItem);

router.route('/:id')
  .put(updateInventoryItem)
  .delete(deleteInventoryItem);

export default router;
