import Order from '../models/Order.js';

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
