import crypto from 'crypto';
import Razorpay from 'razorpay';
import Order from '../models/Order.js';
import Inventory from '../models/Inventory.js';
import User from '../models/User.js';
import { sendLowStockEmail, sendOrderConfirmationEmail } from '../utils/emailService.js';

// Initialize Razorpay SDK using keys
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret',
});

// @desc    Initiate Razorpay checkout order with stock safety checks
// @route   POST /api/orders/create-payment
// @access  Private
export const createPaymentOrder = async (req, res) => {
  try {
    const { items, deliveryAddress, deliveryPhone } = req.body;

    if (!items || items.length === 0 || !deliveryAddress || !deliveryPhone) {
      return res.status(400).json({ status: 'error', message: 'Please provide all details' });
    }

    // 1. Perform detailed stock checks before capturing payment
    for (const item of items) {
      const customization = item.customization;
      
      const ingredients = [
        customization.base,
        customization.sauce,
        customization.cheese,
        ...(customization.veggies || []),
        ...(customization.meat || []),
      ];

      for (const ingredientName of ingredients) {
        if (!ingredientName) continue;
        
        const dbItem = await Inventory.findOne({ name: ingredientName });
        if (!dbItem) {
          return res.status(404).json({ status: 'error', message: `Ingredient '${ingredientName}' not found in inventory` });
        }
        
        if (dbItem.stock < item.quantity) {
          return res.status(400).json({ 
            status: 'error', 
            message: `Sorry, we are out of stock for '${ingredientName}'. Please customize your pizza with other options.` 
          });
        }
      }
    }

    // 2. Calculate dynamic grand total
    let calculatedTotal = 0;
    for (const item of items) {
      let itemCost = item.price; // baseline pizza price
      const customization = item.customization;

      // Add customizable topping premium values
      const base = await Inventory.findOne({ name: customization.base });
      const sauce = await Inventory.findOne({ name: customization.sauce });
      const cheese = await Inventory.findOne({ name: customization.cheese });
      
      if (base) itemCost += base.unitPrice;
      if (sauce) itemCost += sauce.unitPrice;
      if (cheese) itemCost += cheese.unitPrice;

      for (const veg of (customization.veggies || [])) {
        const vItem = await Inventory.findOne({ name: veg });
        if (vItem) itemCost += vItem.unitPrice;
      }
      for (const m of (customization.meat || [])) {
        const mItem = await Inventory.findOne({ name: m });
        if (mItem) itemCost += mItem.unitPrice;
      }

      calculatedTotal += itemCost * item.quantity;
    }

    // 3. Create Razorpay Payment Order
    const options = {
      amount: Math.round(calculatedTotal * 100), // Razorpay operates in paisa (1 INR = 100 paisa)
      currency: 'INR',
      receipt: `receipt_pizza_${Date.now()}`,
    };

    const rpOrder = await razorpay.orders.create(options);

    res.status(200).json({
      status: 'success',
      data: {
        razorpayOrderId: rpOrder.id,
        amount: rpOrder.amount,
        currency: rpOrder.currency,
        calculatedTotal,
      },
    });
  } catch (error) {
    console.error('❌ Create Payment Order Error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Payment server failed to initialize checkout' });
  }
};

// @desc    Verify payment and trigger stock deductions + emails
// @route   POST /api/orders/verify-payment
// @access  Private
export const verifyPaymentAndCreateOrder = async (req, res) => {
  try {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      items,
      deliveryAddress,
      deliveryPhone,
    } = req.body;

    if (!razorpayOrderId || !razorpayPaymentId || !items || !deliveryAddress || !deliveryPhone) {
      return res.status(400).json({ status: 'error', message: 'Incomplete transaction details' });
    }

    // 1. Verify payment signature authenticity
    const isPlaceholderKeys = process.env.RAZORPAY_KEY_ID === 'rzp_test_placeholder' || !process.env.RAZORPAY_KEY_SECRET;
    
    if (!isPlaceholderKeys && razorpaySignature) {
      const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
      hmac.update(`${razorpayOrderId}|${razorpayPaymentId}`);
      const generatedSignature = hmac.digest('hex');

      if (generatedSignature !== razorpaySignature) {
        return res.status(400).json({ status: 'error', message: 'Cryptographic signature mismatch. Transaction untrusted.' });
      }
    } else {
      console.log('⚠️ Running in Test/Developer Mode - Signature validation skipped.');
    }

    // 2. Perform Stock Deductions & Trigger Low Stock Emails
    let grandTotal = 0;
    const itemsList = [];

    for (const item of items) {
      const customization = item.customization;
      
      const ingredients = [
        { name: customization.base, field: 'base' },
        { name: customization.sauce, field: 'sauce' },
        { name: customization.cheese, field: 'cheese' },
        ...(customization.veggies || []).map(v => ({ name: v, field: 'veggies' })),
        ...(customization.meat || []).map(m => ({ name: m, field: 'meat' })),
      ];

      let toppingPriceAdditions = 0;

      for (const ingredient of ingredients) {
        if (!ingredient.name) continue;
        
        // Find and decrement stock
        const dbItem = await Inventory.findOneAndUpdate(
          { name: ingredient.name },
          { $inc: { stock: -item.quantity } },
          { new: true }
        );

        if (dbItem) {
          toppingPriceAdditions += dbItem.unitPrice;

          // Check if item went below low stock threshold
          if (dbItem.stock <= dbItem.threshold) {
            console.log(`⚠️ LOW STOCK TRIGGERED: '${dbItem.name}' stock is ${dbItem.stock}`);
            
            // Find system administrators to notify
            const admins = await User.find({ role: 'admin' });
            const adminEmail = admins.length > 0 ? admins[0].email : process.env.EMAIL_FROM || 'admin@crustiva.com';
            
            // Fire email alert asynchronously
            sendLowStockEmail(adminEmail, dbItem.name, dbItem.stock, dbItem.threshold)
              .catch(err => console.error('❌ Failed to deliver stock alert email:', err.message));
          }
        }
      }

      const totalItemPrice = item.price + toppingPriceAdditions;
      grandTotal += totalItemPrice * item.quantity;

      itemsList.push({
        name: item.name,
        size: item.size || 'Medium',
        quantity: item.quantity,
        price: totalItemPrice,
        customization: {
          base: customization.base,
          sauce: customization.sauce,
          cheese: customization.cheese,
          veggies: customization.veggies || [],
          meat: customization.meat || [],
        },
      });
    }

    // 3. Save order record in MongoDB Atlas
    const order = await Order.create({
      user: req.user.id,
      items: itemsList,
      totalAmount: grandTotal,
      paymentStatus: 'Paid',
      status: 'Order Received',
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature: razorpaySignature || 'test_signature_bypassed',
      deliveryAddress,
      deliveryPhone,
    });

    // 4. Send email receipt to customer using Resend
    sendOrderConfirmationEmail(req.user.email, req.user.name, order._id.toString(), order.totalAmount, order.items)
      .catch(err => console.error('❌ Failed to deliver order confirmation email:', err.message));

    res.status(201).json({
      status: 'success',
      message: 'Payment verified and order initialized successfully!',
      data: order,
    });
  } catch (error) {
    console.error('❌ Verify Payment Error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Failed to complete order checkout' });
  }
};

// @desc    Get user order list
// @route   GET /api/orders/my-orders
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ status: 'success', data: orders });
  } catch (error) {
    console.error('❌ Get User Orders Error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to retrieve order history' });
  }
};

// @desc    Get single order details
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    
    if (!order) {
      return res.status(404).json({ status: 'error', message: 'Order record not found' });
    }

    // Authorization checks: users can only view their own orders
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ status: 'error', message: 'Forbidden: unauthorized access to order' });
    }

    res.status(200).json({ status: 'success', data: order });
  } catch (error) {
    console.error('❌ Get Order Details Error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to retrieve order details' });
  }
};

// @desc    Admin: Get all system orders
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
    res.status(200).json({ status: 'success', data: orders });
  } catch (error) {
    console.error('❌ Get System Orders Error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to retrieve system order catalog' });
  }
};

// @desc    Admin: Update order progress status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Order Received', 'In Kitchen', 'Sent To Delivery', 'Delivered'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ status: 'error', message: 'Invalid order tracking status' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ status: 'error', message: 'Order record not found' });
    }

    res.status(200).json({ status: 'success', message: `Order status updated to '${status}'`, data: order });
  } catch (error) {
    console.error('❌ Update Order Status Error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to update order tracking status' });
  }
};
