import crypto from 'crypto';
import razorpay from '../config/razorpay.js';
import Order from '../models/Order.js';
import Pizza from '../models/Pizza.js';
import Inventory from '../models/Inventory.js';
import User from '../models/User.js';
import { sendLowStockEmail, sendOrderConfirmationEmail } from '../utils/emailService.js';

// @desc    Create Razorpay Order
// @route   POST /api/payments/create-order
// @access  Private
export const createRazorpayOrder = async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ status: 'error', message: 'Please provide items for checkout' });
    }

    // 1. Perform stock checks and calculate dynamic grand total securely on the backend
    let calculatedGrandTotal = 0;

    for (const item of items) {
      // Find the pizza in database
      const dbPizza = await Pizza.findById(item.pizzaId);
      if (!dbPizza) {
        return res.status(404).json({ status: 'error', message: `Pizza recipe with ID '${item.pizzaId}' not found` });
      }

      const isCustomized = item.isCustomized === true;
      let itemBaseCost = dbPizza.price;

      if (isCustomized) {
        if (item.size === 'Medium') itemBaseCost += 60;
        if (item.size === 'Large') itemBaseCost += 120;

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
          
          itemBaseCost += dbItem.unitPrice;
        }
      }

      // Perform stock checks for all ingredients in the customization (for both custom and original)
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

      calculatedGrandTotal += itemBaseCost * item.quantity;
    }

    // 2. Create Razorpay Payment Order with backend-calculated amount
    const options = {
      amount: Math.round(calculatedGrandTotal * 100), // Razorpay operates in paisa (1 INR = 100 paisa)
      currency: 'INR',
      receipt: `receipt_payment_${Date.now()}`,
    };

    const rpOrder = await razorpay.orders.create(options);

    res.status(200).json({
      status: 'success',
      data: {
        order_id: rpOrder.id,
        amount: rpOrder.amount,
        currency: rpOrder.currency,
        keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_Sykxiyt7GHDV0v'
      },
    });
  } catch (error) {
    console.error('❌ Create Payment Order Error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Payment server failed to initialize checkout' });
  }
};

// @desc    Verify Payment Signature and Save Order
// @route   POST /api/payments/verify
// @access  Private
export const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      items,
      deliveryAddress,
      deliveryPhone,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !items || !deliveryAddress || !deliveryPhone) {
      return res.status(400).json({ status: 'error', message: 'Incomplete transaction details' });
    }

    // 1. Verify payment signature authenticity using HMAC SHA256
    const keySecret = process.env.RAZORPAY_KEY_SECRET || 'FAfY9h3LXPWC7fGleSzuxup5';
    const hmac = crypto.createHmac('sha256', keySecret);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ status: 'error', message: 'Cryptographic signature mismatch. Transaction untrusted.' });
    }

    // 2. Perform Stock Deductions & Securely Calculate Item Pricing
    const itemsList = [];
    let calculatedGrandTotal = 0;

    for (const item of items) {
      // Find pizza in DB
      const dbPizza = await Pizza.findById(item.pizzaId);
      if (!dbPizza) {
        return res.status(404).json({ status: 'error', message: `Pizza recipe with ID '${item.pizzaId}' not found` });
      }

      const isCustomized = item.isCustomized === true;
      let calculatedItemPrice = dbPizza.price;

      if (isCustomized) {
        if (item.size === 'Medium') calculatedItemPrice += 60;
        if (item.size === 'Large') calculatedItemPrice += 120;

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
          if (dbItem) {
            calculatedItemPrice += dbItem.unitPrice;
          }
        }
      }

      // Always decrement stock for customization ingredients
      const customization = item.customization;
      const ingredients = [
        { name: customization.base, field: 'base' },
        { name: customization.sauce, field: 'sauce' },
        { name: customization.cheese, field: 'cheese' },
        ...(customization.veggies || []).map(v => ({ name: v, field: 'veggies' })),
        ...(customization.meat || []).map(m => ({ name: m, field: 'meat' })),
      ];

      for (const ingredient of ingredients) {
        if (!ingredient.name) continue;
        
        // Find and decrement stock
        const dbItem = await Inventory.findOneAndUpdate(
          { name: ingredient.name },
          { $inc: { stock: -item.quantity } },
          { new: true }
        );

        if (dbItem) {
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

      calculatedGrandTotal += calculatedItemPrice * item.quantity;

      itemsList.push({
        name: item.name,
        size: item.size || 'Medium',
        quantity: item.quantity,
        price: calculatedItemPrice,
        isCustomized,
        customization: {
          base: customization.base,
          sauce: customization.sauce,
          cheese: customization.cheese,
          veggies: customization.veggies || [],
          meat: customization.meat || [],
        },
      });
    }

    // 3. Save order record in MongoDB
    const order = await Order.create({
      user: req.user.id,
      items: itemsList,
      totalAmount: calculatedGrandTotal, // use the securely calculated grand total
      paymentStatus: 'Paid',
      status: 'Order Received',
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
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
