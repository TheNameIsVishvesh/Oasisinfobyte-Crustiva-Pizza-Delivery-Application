import Pizza from '../models/Pizza.js';
import Inventory from '../models/Inventory.js';
import User from '../models/User.js';

const seedIngredients = [
  // 5 Bases
  { name: 'Thin Crust', category: 'base', stock: 50, threshold: 10, unitPrice: 40 },
  { name: 'Thick Crust', category: 'base', stock: 50, threshold: 10, unitPrice: 50 },
  { name: 'Cheese Burst Crust', category: 'base', stock: 40, threshold: 8, unitPrice: 90 },
  { name: 'Gluten-Free Crust', category: 'base', stock: 35, threshold: 8, unitPrice: 70 },
  { name: 'Whole Wheat Crust', category: 'base', stock: 45, threshold: 10, unitPrice: 45 },

  // 5 Sauces
  { name: 'Classic Marinara Sauce', category: 'sauce', stock: 80, threshold: 15, unitPrice: 15 },
  { name: 'Spicy Schezwan Sauce', category: 'sauce', stock: 65, threshold: 15, unitPrice: 20 },
  { name: 'Creamy Alfredo White Sauce', category: 'sauce', stock: 50, threshold: 10, unitPrice: 30 },
  { name: 'Smokey BBQ Sauce', category: 'sauce', stock: 60, threshold: 10, unitPrice: 25 },
  { name: 'Pesto Basil Sauce', category: 'sauce', stock: 40, threshold: 8, unitPrice: 35 },

  // Cheeses
  { name: 'Mozzarella Cheese', category: 'cheese', stock: 100, threshold: 20, unitPrice: 40 },
  { name: 'Cheddar Cheese', category: 'cheese', stock: 70, threshold: 15, unitPrice: 50 },
  { name: 'Parmesan Cheese', category: 'cheese', stock: 50, threshold: 10, unitPrice: 60 },
  { name: 'Feta Cheese', category: 'cheese', stock: 45, threshold: 10, unitPrice: 55 },
  { name: 'Vegan Almond Cheese', category: 'cheese', stock: 30, threshold: 5, unitPrice: 75 },

  // Veggies
  { name: 'Sliced Mushrooms', category: 'veggies', stock: 60, threshold: 10, unitPrice: 20 },
  { name: 'Sweet Corn', category: 'veggies', stock: 80, threshold: 10, unitPrice: 15 },
  { name: 'Crisp Capsicum', category: 'veggies', stock: 70, threshold: 10, unitPrice: 15 },
  { name: 'Red Onions', category: 'veggies', stock: 90, threshold: 15, unitPrice: 10 },
  { name: 'Black Olives', category: 'veggies', stock: 50, threshold: 8, unitPrice: 25 },
  { name: 'Jalapenos', category: 'veggies', stock: 50, threshold: 8, unitPrice: 25 },

  // Meats
  { name: 'Spicy Pepperoni', category: 'meat', stock: 45, threshold: 8, unitPrice: 60 },
  { name: 'Smoked Chicken Tikka', category: 'meat', stock: 50, threshold: 8, unitPrice: 70 },
  { name: 'Italian Sausage', category: 'meat', stock: 40, threshold: 8, unitPrice: 80 },
  { name: 'BBQ Ham', category: 'meat', stock: 35, threshold: 5, unitPrice: 65 },
];

const seedPizzas = [
  {
    name: 'Margherita Premium',
    description: 'Classic melted Mozzarella on a premium Italian herb marinara sauce base, garnished with fresh basil oil.',
    price: 299,
    category: 'veg',
    image: '/src/assets/pizza-logo.svg',
    isCustomizable: true,
  },
  {
    name: 'Farmhouse Feast',
    description: 'A colorful medley of sliced mushrooms, sweet corn, crisp capsicum, and fresh red onions loaded on cheese.',
    price: 399,
    category: 'veg',
    image: '/src/assets/pizza-logo.svg',
    isCustomizable: true,
  },
  {
    name: 'Fiery Chicken Delight',
    description: 'Spicy chunks of smoked chicken tikka, sharp red onions, and fiery sliced jalapenos on a Schezwan base.',
    price: 499,
    category: 'non-veg',
    image: '/src/assets/pizza-logo.svg',
    isCustomizable: true,
  },
  {
    name: 'Pepperoni Overload',
    description: 'Double portion of genuine cured Italian pork pepperoni loaded edge-to-edge over bubbling mozzarella.',
    price: 549,
    category: 'non-veg',
    image: '/src/assets/pizza-logo.svg',
    isCustomizable: true,
  },
  {
    name: 'Pesto Feta Mushroom',
    description: 'Sauteed earthy mushrooms, rich feta crumbles, black olives, finished with a fresh basil pesto swirl.',
    price: 599,
    category: 'gourmet',
    image: '/src/assets/pizza-logo.svg',
    isCustomizable: true,
  },
];

export const seedDatabase = async () => {
  try {
    // 1. Seed Inventory Ingredients
    const ingredientCount = await Inventory.countDocuments({});
    if (ingredientCount === 0) {
      await Inventory.insertMany(seedIngredients);
      console.log('🌱 Successfully seeded baseline ingredients into Inventory collection.');
    }

    // 2. Seed Baseline Pizzas
    const pizzaCount = await Pizza.countDocuments({});
    if (pizzaCount === 0) {
      await Pizza.insertMany(seedPizzas);
      console.log('🌱 Successfully seeded baseline pizzas into Pizza collection.');
    }

    // 3. Create Default Administrator (for easy intern testing!)
    const adminEmail = 'admin@slicelife.com';
    const adminExists = await User.findOne({ email: adminEmail });
    if (!adminExists) {
      const defaultAdmin = new User({
        name: 'SliceLife Admin',
        email: adminEmail,
        password: 'adminpassword123',
        role: 'admin',
        isVerified: true,
      });
      await defaultAdmin.save();
      console.log('\n========================= [SEED ADMIN REGISTERED] =========================');
      console.log(`Email:    ${adminEmail}`);
      console.log('Password: adminpassword123 (Roles: admin, isVerified: true)');
      console.log('===========================================================================\n');
    }
  } catch (error) {
    console.error('❌ Database seeding failure:', error.message);
  }
};
