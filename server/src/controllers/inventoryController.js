import Inventory from '../models/Inventory.js';

// @desc    Admin: Get all inventory items
// @route   GET /api/inventory
// @access  Private/Admin
export const getInventory = async (req, res) => {
  try {
    const items = await Inventory.find({}).sort({ category: 1, name: 1 });
    res.status(200).json({ status: 'success', data: items });
  } catch (error) {
    console.error('❌ Get Inventory Error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to retrieve inventory items' });
  }
};

// @desc    Admin: Add new ingredient item
// @route   POST /api/inventory
// @access  Private/Admin
export const createInventoryItem = async (req, res) => {
  try {
    const { name, category, stock, threshold, unitPrice } = req.body;

    if (!name || !category || stock === undefined || threshold === undefined || unitPrice === undefined) {
      return res.status(400).json({ status: 'error', message: 'Please provide all required fields' });
    }

    const itemExists = await Inventory.findOne({ name });
    if (itemExists) {
      return res.status(400).json({ status: 'error', message: `Ingredient '${name}' already exists in inventory` });
    }

    const item = await Inventory.create({
      name,
      category,
      stock,
      threshold,
      unitPrice,
    });

    res.status(201).json({ status: 'success', message: 'Ingredient added successfully', data: item });
  } catch (error) {
    console.error('❌ Create Inventory Item Error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Failed to add ingredient' });
  }
};

// @desc    Admin: Update stock level directly
// @route   PUT /api/inventory/:id
// @access  Private/Admin
export const updateInventoryItem = async (req, res) => {
  try {
    const { stock, threshold, unitPrice } = req.body;

    const item = await Inventory.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ status: 'error', message: 'Ingredient not found' });
    }

    if (stock !== undefined) item.stock = stock;
    if (threshold !== undefined) item.threshold = threshold;
    if (unitPrice !== undefined) item.unitPrice = unitPrice;

    await item.save();

    res.status(200).json({ status: 'success', message: 'Ingredient updated successfully', data: item });
  } catch (error) {
    console.error('❌ Update Inventory Item Error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Failed to update ingredient' });
  }
};

// @desc    Admin: Delete ingredient
export const deleteInventoryItem = async (req, res) => {
  try {
    const item = await Inventory.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ status: 'error', message: 'Ingredient not found' });
    }
    res.status(200).json({ status: 'success', message: 'Ingredient removed from inventory' });
  } catch (error) {
    console.error('❌ Delete Inventory Item Error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to delete ingredient' });
  }
};

// @desc    Admin: Reseed baseline inventory and pizzas
// @route   POST /api/inventory/reseed
// @access  Private/Admin
import { seedIngredients, seedPizzas } from '../config/dbSeeder.js';
import Pizza from '../models/Pizza.js';

export const reseedInventory = async (req, res) => {
  try {
    // Clear inventory and pizza tables
    await Inventory.deleteMany({});
    await Pizza.deleteMany({});

    // Reseed collections
    await Inventory.insertMany(seedIngredients);
    await Pizza.insertMany(seedPizzas);

    res.status(200).json({
      status: 'success',
      message: 'Baseline inventory and pizza catalog reseeded successfully!'
    });
  } catch (error) {
    console.error('❌ Reseed Inventory Error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Failed to reseed inventory database' });
  }
};
