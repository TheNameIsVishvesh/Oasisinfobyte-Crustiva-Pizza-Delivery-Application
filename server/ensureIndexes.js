import mongoose from 'mongoose';
import dotenv from 'dotenv';
import './src/models/User.js';
import './src/models/Pizza.js';
import './src/models/Inventory.js';
import './src/models/Order.js';

dotenv.config();

async function run() {
  try {
    console.log('Connecting to MongoDB Atlas to build indexes...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected.');

    // Wait for Mongoose to build all indexes
    const models = Object.keys(mongoose.models);
    for (const modelName of models) {
      console.log(`Ensuring indexes for model: ${modelName}...`);
      await mongoose.model(modelName).ensureIndexes();
      console.log(`Indexes ensured for: ${modelName}`);
    }
    console.log('✅ All schema-defined indexes created/verified successfully on Atlas!');
  } catch (err) {
    console.error('❌ Error ensuring indexes:', err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

run();
