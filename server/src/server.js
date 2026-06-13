import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Import route modules
import authRoutes from './routes/authRoutes.js';
import pizzaRoutes from './routes/pizzaRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

// Import DB seeder
import { seedDatabase } from './config/dbSeeder.js';

// Load environment variables
dotenv.config();

// Critical environment variables check
const criticalEnvVars = ['MONGO_URI', 'JWT_SECRET'];
const missingCritical = criticalEnvVars.filter((v) => !process.env[v]);
if (missingCritical.length > 0) {
  console.error(`❌ Critical Error: Environment variables missing: ${missingCritical.join(', ')}`);
  console.error('Server shutting down. Please configure them in your environment.');
  process.exit(1);
}

// Warning for integration services
const serviceEnvVars = ['RAZORPAY_KEY_ID', 'RAZORPAY_KEY_SECRET', 'RESEND_API_KEY'];
const missingServices = serviceEnvVars.filter((v) => !process.env[v] || process.env[v].includes('placeholder'));
if (missingServices.length > 0) {
  console.warn(`⚠️ Warning: Missing or placeholder values for: ${missingServices.join(', ')}`);
  console.warn('Razorpay checkouts or Resend email delivery will not function properly.');
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount Routing Handlers
app.use('/api/auth', authRoutes);
app.use('/api/pizzas', pizzaRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);

// Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Pizza Delivery API is fully functional!',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
    dbState: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Database Connection
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('✅ Successfully connected to MongoDB Atlas.');
    // Trigger automatic baseline seeding
    await seedDatabase();
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:');
    console.error(err.message);
    process.exit(1);
  });

// Start Server
const server = app.listen(PORT, () => {
  console.log(`🍕 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`❌ Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
