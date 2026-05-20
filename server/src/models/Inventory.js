import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide an ingredient name'],
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please provide an ingredient category'],
      enum: ['base', 'sauce', 'cheese', 'veggies', 'meat'],
    },
    stock: {
      type: Number,
      required: [true, 'Please specify active stock quantity'],
      min: [0, 'Stock cannot be negative'],
      default: 50,
    },
    threshold: {
      type: Number,
      required: [true, 'Please specify low-stock trigger threshold'],
      min: [0, 'Threshold cannot be negative'],
      default: 10,
    },
    unitPrice: {
      type: Number,
      required: [true, 'Please specify customized unit price additions'],
      min: [0, 'Topping cost cannot be negative'],
      default: 20,
    },
  },
  {
    timestamps: true,
  }
);

const Inventory = mongoose.model('Inventory', inventorySchema);
export default Inventory;
