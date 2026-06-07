import mongoose from 'mongoose';

const pizzaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a pizza name'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide baseline pricing'],
      min: [0, 'Price cannot be negative'],
    },
    category: {
      type: String,
      enum: ['veg', 'non-veg', 'gourmet'],
      default: 'veg',
      index: true,
    },
    image: {
      type: String,
      default: '/src/assets/pizza-logo.svg',
    },
    isCustomizable: {
      type: Boolean,
      default: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const Pizza = mongoose.model('Pizza', pizzaSchema);
export default Pizza;
