import Pizza from '../models/Pizza.js';
import Inventory from '../models/Inventory.js';

// @desc    Get all available pizzas
// @route   GET /api/pizzas
// @access  Public
export const getPizzas = async (req, res) => {
  try {
    const pizzas = await Pizza.find({ isAvailable: true });
    res.status(200).json({ status: 'success', data: pizzas });
  } catch (error) {
    console.error('❌ Get Pizzas Error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to retrieve pizza list' });
  }
};

// @desc    Get customizer ingredients mapped dynamically from Inventory
// @route   GET /api/pizzas/customizer-options
// @access  Public
export const getCustomizationOptions = async (req, res) => {
  try {
    const ingredients = await Inventory.find({});
    
    // Categorize options for easy UI consumption
    const options = {
      bases: ingredients.filter(i => i.category === 'base'),
      sauces: ingredients.filter(i => i.category === 'sauce'),
      cheeses: ingredients.filter(i => i.category === 'cheese'),
      veggies: ingredients.filter(i => i.category === 'veggies'),
      meats: ingredients.filter(i => i.category === 'meat'),
    };

    res.status(200).json({ status: 'success', data: options });
  } catch (error) {
    console.error('❌ Get Customizer Options Error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to retrieve dynamic customizer choices' });
  }
};

// @desc    Admin: Create new pizza
// @route   POST /api/pizzas
// @access  Private/Admin
export const createPizza = async (req, res) => {
  try {
    const { name, description, price, category, image, isCustomizable } = req.body;

    if (!name || !description || price === undefined) {
      return res.status(400).json({ status: 'error', message: 'Please provide pizza name, description, and price' });
    }

    const pizza = await Pizza.create({
      name,
      description,
      price,
      category,
      image,
      isCustomizable,
    });

    res.status(201).json({ status: 'success', message: 'Pizza created successfully', data: pizza });
  } catch (error) {
    console.error('❌ Create Pizza Error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Failed to create pizza record' });
  }
};

// @desc    Admin: Update pizza
// @route   PUT /api/pizzas/:id
// @access  Private/Admin
export const updatePizza = async (req, res) => {
  try {
    const pizza = await Pizza.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!pizza) {
      return res.status(404).json({ status: 'error', message: 'Pizza record not found' });
    }

    res.status(200).json({ status: 'success', message: 'Pizza updated successfully', data: pizza });
  } catch (error) {
    console.error('❌ Update Pizza Error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Failed to update pizza record' });
  }
};

// @desc    Admin: Delete pizza
// @route   DELETE /api/pizzas/:id
// @access  Private/Admin
export const deletePizza = async (req, res) => {
  try {
    const pizza = await Pizza.findByIdAndDelete(req.params.id);
    
    if (!pizza) {
      return res.status(404).json({ status: 'error', message: 'Pizza record not found' });
    }

    res.status(200).json({ status: 'success', message: 'Pizza deleted successfully' });
  } catch (error) {
    console.error('❌ Delete Pizza Error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to delete pizza record' });
  }
};
