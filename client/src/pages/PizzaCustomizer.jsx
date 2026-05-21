import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { useCart } from '../context/CartContext';
import { 
  ChevronLeft, Info, HelpCircle, AlertCircle, ShoppingBag, 
  Check, Sparkles, Flame, Eye, Leaf, HelpCircle as HelpIcon 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Defined random scatter positions for topping visual representations
const veggieScatter = {
  'Sliced Mushrooms': [
    { x: -45, y: -30, rotate: 15 },
    { x: 35, y: -45, rotate: -25 },
    { x: -20, y: 40, rotate: 45 },
    { x: 45, y: 30, rotate: 90 },
    { x: 0, y: -10, rotate: 110 }
  ],
  'Sweet Corn': [
    { x: -30, y: -20, rotate: 0 },
    { x: 25, y: -35, rotate: 0 },
    { x: -35, y: 25, rotate: 0 },
    { x: 35, y: 35, rotate: 0 },
    { x: -10, y: 45, rotate: 0 },
    { x: 15, y: -10, rotate: 0 },
    { x: 40, y: -5, rotate: 0 }
  ],
  'Crisp Capsicum': [
    { x: -25, y: -45, rotate: 45 },
    { x: 45, y: -20, rotate: 135 },
    { x: -40, y: 15, rotate: 225 },
    { x: 20, y: 40, rotate: -45 },
    { x: -10, y: -25, rotate: 10 }
  ],
  'Red Onions': [
    { x: -50, y: -10, rotate: -15 },
    { x: 10, y: -50, rotate: 35 },
    { x: -15, y: 35, rotate: 95 },
    { x: 40, y: 10, rotate: 165 },
    { x: 25, y: -25, rotate: 75 }
  ],
  'Black Olives': [
    { x: -35, y: -35, rotate: 0 },
    { x: 35, y: -30, rotate: 12 },
    { x: -30, y: 30, rotate: -55 },
    { x: 30, y: 25, rotate: 88 },
    { x: 5, y: 20, rotate: 45 }
  ],
  'Jalapenos': [
    { x: -20, y: -35, rotate: 20 },
    { x: 40, y: -40, rotate: -30 },
    { x: -45, y: 5, rotate: 90 },
    { x: 15, y: 30, rotate: 120 },
    { x: -5, y: -5, rotate: -60 }
  ]
};

const meatScatter = {
  'Spicy Pepperoni': [
    { x: -40, y: -25 },
    { x: 30, y: -40 },
    { x: -30, y: 30 },
    { x: 35, y: 20 },
    { x: 0, y: -35 },
    { x: -5, y: 15 },
    { x: 45, y: -5 }
  ],
  'Smoked Chicken Tikka': [
    { x: -30, y: -35 },
    { x: 35, y: -25 },
    { x: -40, y: 15 },
    { x: 25, y: 35 },
    { x: -15, y: 45 },
    { x: 5, y: -15 }
  ],
  'Italian Sausage': [
    { x: -45, y: -15 },
    { x: 20, y: -45 },
    { x: -20, y: 25 },
    { x: 40, y: 30 },
    { x: -10, y: -40 }
  ],
  'BBQ Ham': [
    { x: -35, y: -30 },
    { x: 30, y: -35 },
    { x: -25, y: 35 },
    { x: 35, y: 15 },
    { x: 5, y: 5 }
  ]
};

export default function PizzaCustomizer() {
  const [searchParams] = useSearchParams();
  const pizzaId = searchParams.get('pizzaId');
  
  const [pizza, setPizza] = useState(null);
  const [options, setOptions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Customizer Selection
  const [selectedSize, setSelectedSize] = useState('Medium');
  const [selectedBase, setSelectedBase] = useState('');
  const [selectedSauce, setSelectedSauce] = useState('');
  const [selectedCheese, setSelectedCheese] = useState('');
  const [selectedVeggies, setSelectedVeggies] = useState([]);
  const [selectedMeats, setSelectedMeats] = useState([]);
  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const pRes = await API.get('/api/pizzas');
        let activePizza = null;

        // If 'default' or missing, load first customizable pizza in collection
        if (!pizzaId || pizzaId === 'default') {
          activePizza = pRes.data.data.find(p => p.isCustomizable) || pRes.data.data[0];
        } else {
          activePizza = pRes.data.data.find(p => p._id === pizzaId);
        }

        if (!activePizza) {
          setError('Pizza recipe not found.');
          setLoading(false);
          return;
        }
        setPizza(activePizza);

        // Fetch customizer options list
        const oRes = await API.get('/api/pizzas/customizer-options');
        const opts = oRes.data.data;
        setOptions(opts);

        // Prepopulate defaults
        const defaultBase = opts.bases.find(b => b.stock > 0)?.name || opts.bases[0]?.name;
        const defaultSauce = opts.sauces.find(s => s.stock > 0)?.name || opts.sauces[0]?.name;
        const defaultCheese = opts.cheeses.find(c => c.stock > 0)?.name || opts.cheeses[0]?.name;

        setSelectedBase(defaultBase);
        setSelectedSauce(defaultSauce);
        setSelectedCheese(defaultCheese);
      } catch (err) {
        console.error('❌ Customizer boot failed:', err.message);
        setError('Failed to load customizer resources. Please check your backend startup status.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pizzaId]);

  // Price Calculation Logic
  const calculateCurrentPrice = () => {
    if (!pizza || !options) return 0;
    
    let total = pizza.price;

    if (selectedSize === 'Medium') total += 60;
    if (selectedSize === 'Large') total += 120;

    const baseOpt = options.bases.find(o => o.name === selectedBase);
    const sauceOpt = options.sauces.find(o => o.name === selectedSauce);
    const cheeseOpt = options.cheeses.find(o => o.name === selectedCheese);

    if (baseOpt) total += baseOpt.unitPrice;
    if (sauceOpt) total += sauceOpt.unitPrice;
    if (cheeseOpt) total += cheeseOpt.unitPrice;

    selectedVeggies.forEach(vName => {
      const opt = options.veggies.find(o => o.name === vName);
      if (opt) total += opt.unitPrice;
    });

    selectedMeats.forEach(mName => {
      const opt = options.meats.find(o => o.name === mName);
      if (opt) total += opt.unitPrice;
    });

    return total;
  };

  const handleVeggieToggle = (vegName) => {
    setSelectedVeggies(prev => 
      prev.includes(vegName) ? prev.filter(v => v !== vegName) : [...prev, vegName]
    );
  };

  const handleMeatToggle = (meatName) => {
    setSelectedMeats(prev => 
      prev.includes(meatName) ? prev.filter(m => m !== meatName) : [...prev, meatName]
    );
  };

  const handleAddToCart = () => {
    if (!selectedBase || !selectedSauce || !selectedCheese) {
      alert('Please make sure to select a crust base, sauce and cheese blend.');
      return;
    }

    const dynamicPrice = calculateCurrentPrice();
    const customization = {
      base: selectedBase,
      sauce: selectedSauce,
      cheese: selectedCheese,
      veggies: selectedVeggies,
      meat: selectedMeats,
    };

    addToCart({ ...pizza, price: dynamicPrice }, customization, selectedSize, quantity);
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F0B0A] text-white">
        <div className="w-12 h-12 border-4 border-pizza-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !pizza || !options) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[#0F0B0A] text-white space-y-4 px-6 text-center">
        <AlertCircle className="w-16 h-16 text-rose-500" />
        <h3 className="text-2xl font-bold">Customizer Error</h3>
        <p className="text-sm text-pizza-gray max-w-sm">{error || 'Unable to boot visual model'}</p>
        <Link to="/" className="px-6 py-3 bg-pizza-primary text-white font-bold rounded-xl text-xs">Return to Catalog</Link>
      </div>
    );
  }

  const currentItemPrice = calculateCurrentPrice();

  return (
    <div className="min-h-screen bg-[#0F0B0A] text-[#F8F5F2] py-8 px-4 md:px-8 relative overflow-hidden">
      {/* Background blurs */}
      <div className="absolute top-[-5%] right-[-5%] w-[400px] h-[400px] bg-pizza-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] bg-pizza-gold/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-6 z-10 relative">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-pizza-gray hover:text-white transition-colors">
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Gourmet Catalog</span>
        </Link>

        {/* Header Title */}
        <div className="space-y-1">
          <span className="text-[10px] font-black text-pizza-primary tracking-widest uppercase block">BUILD ENGINE 2.0</span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white font-sans">
            Crustiva Live Pizza Customizer
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
          
          {/* ==================================================
              LEFT AREA: LIVE VISUAL PIZZA PREVIEW DECK
             ================================================== */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
            <div className="bg-[#1A120F] p-8 rounded-[2.5rem] border border-white/5 shadow-premium text-center space-y-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-pizza-primary via-pizza-gold to-pizza-secondary" />

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pizza-primary/10 border border-pizza-primary/20 text-xs font-black text-pizza-primary">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Base Recipe: {pizza.name}</span>
              </span>

              {/* THE LIVE BUILDING DECK */}
              <div className="w-72 h-72 md:w-80 md:h-80 bg-[#0F0B0A] rounded-full flex items-center justify-center mx-auto border border-white/5 relative shadow-premium overflow-hidden group">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-pizza-primary/5 via-transparent to-transparent pointer-events-none" />
                
                {/* Visual Crust Sizing Wrapper */}
                <motion.div 
                  animate={{ 
                    scale: selectedSize === 'Small' ? 0.8 : selectedSize === 'Medium' ? 0.92 : 1.05
                  }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-64 h-64 md:w-72 md:h-72 rounded-full relative flex items-center justify-center"
                >
                  {/* Layer 1: Crust Base selection rendering */}
                  <motion.div 
                    key={selectedBase}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 150 }}
                    className="absolute inset-0 rounded-full border-[10px] border-amber-600 flex items-center justify-center"
                    style={{
                      background: selectedBase === 'Whole Wheat Crust' 
                        ? '#8D6E63' 
                        : selectedBase === 'Gluten-Free Crust' 
                        ? '#A1887F' 
                        : '#FFB627',
                      borderColor: selectedBase === 'Whole Wheat Crust'
                        ? '#5D4037'
                        : selectedBase === 'Gluten-Free Crust'
                        ? '#795548'
                        : selectedBase === 'Cheese Burst Crust'
                        ? '#FF8F00'
                        : '#E65100',
                      boxShadow: selectedBase === 'Cheese Burst Crust'
                        ? '0 0 25px rgba(255, 143, 0, 0.4)'
                        : '0 0 15px rgba(0, 0, 0, 0.4)'
                    }}
                  >
                    {/* Inner dough indent */}
                    <div className="absolute inset-4 rounded-full bg-[#1A120F]/50 border border-white/5" />
                  </motion.div>

                  {/* Layer 2: Sauce Spread Transition */}
                  <AnimatePresence>
                    {selectedSauce && (
                      <motion.div 
                        key={selectedSauce}
                        initial={{ opacity: 0, scale: 0.1 }}
                        animate={{ opacity: 1, scale: 0.82 }}
                        exit={{ opacity: 0, scale: 0.1 }}
                        transition={{ type: "spring", stiffness: 120, damping: 14 }}
                        className="absolute inset-0 rounded-full z-10"
                        style={{
                          background: selectedSauce === 'Classic Marinara Sauce' 
                            ? 'radial-gradient(circle, #D84315 60%, #BF360C 90%)'
                            : selectedSauce === 'Spicy Schezwan Sauce'
                            ? 'radial-gradient(circle, #E64A19 50%, #9E0D0D 90%)'
                            : selectedSauce === 'Creamy Alfredo White Sauce'
                            ? 'radial-gradient(circle, #F8F5F2 60%, #EFEBE9 90%)'
                            : selectedSauce === 'Smokey BBQ Sauce'
                            ? 'radial-gradient(circle, #5D4037 60%, #3E2723 90%)'
                            : 'radial-gradient(circle, #4CAF50 60%, #2E7D32 90%)' // Pesto
                        }}
                      />
                    )}
                  </AnimatePresence>

                  {/* Layer 3: Melted Cheese Bubble Layer */}
                  <AnimatePresence>
                    {selectedCheese && (
                      <motion.div 
                        key={selectedCheese}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.75 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8 }}
                        className="absolute inset-0 rounded-full z-20 flex items-center justify-center p-6"
                      >
                        <div 
                          className="w-full h-full rounded-full animate-pulse-slow"
                          style={{
                            background: selectedCheese === 'Mozzarella Cheese'
                              ? 'radial-gradient(circle, #FFF59D 40%, #FFEE58 80%)'
                              : selectedCheese === 'Cheddar Cheese'
                              ? 'radial-gradient(circle, #FFB74D 40%, #FFA726 80%)'
                              : selectedCheese === 'Parmesan Cheese'
                              ? 'radial-gradient(circle, #FFF9C4 40%, #FFF59D 80%)'
                              : selectedCheese === 'Feta Cheese'
                              ? 'radial-gradient(circle, #FFFFFF 60%, #F5F5F5 90%)'
                              : 'radial-gradient(circle, #FFF9C4 30%, #E8F5E9 80%)' // Vegan Almond
                          }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Layer 4: Dynamic Veggies scattered via spring drop */}
                  {selectedVeggies.map((vegName) => {
                    const positions = veggieScatter[vegName] || [];
                    return positions.map((pos, idx) => (
                      <motion.div
                        key={`${vegName}_${idx}`}
                        initial={{ opacity: 0, y: -200, scale: 0 }}
                        animate={{ opacity: 1, y: pos.y, x: pos.x, scale: 1, rotate: pos.rotate }}
                        transition={{ type: "spring", stiffness: 120, damping: 10, delay: idx * 0.05 }}
                        className="absolute z-30 pointer-events-none"
                      >
                        {/* Mushrooms */}
                        {vegName === 'Sliced Mushrooms' && (
                          <div className="w-5 h-5 bg-[#A1887F] rounded-t-full border border-[#5D4037] relative">
                            <div className="absolute top-4 left-1.5 w-1.5 h-2 bg-[#A1887F]" />
                          </div>
                        )}
                        {/* Sweet Corn */}
                        {vegName === 'Sweet Corn' && (
                          <div className="w-2.5 h-2.5 bg-pizza-gold rounded-full border border-amber-600" />
                        )}
                        {/* Crisp Capsicum */}
                        {vegName === 'Crisp Capsicum' && (
                          <div className="w-4 h-2 bg-pizza-basil rounded-sm border border-emerald-800" />
                        )}
                        {/* Red Onions */}
                        {vegName === 'Red Onions' && (
                          <div className="w-5 h-3 border-2 border-fuchsia-600 rounded-b-full bg-fuchsia-950/40" />
                        )}
                        {/* Black Olives */}
                        {vegName === 'Black Olives' && (
                          <div className="w-3.5 h-3.5 bg-black border border-stone-800 rounded-full flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-[#1A120F] rounded-full" />
                          </div>
                        )}
                        {/* Jalapenos */}
                        {vegName === 'Jalapenos' && (
                          <div className="w-4 h-4 bg-emerald-600 border border-emerald-950 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-[#1A120F] rounded-full" />
                          </div>
                        )}
                      </motion.div>
                    ));
                  })}

                  {/* Layer 5: Dynamic Meats scattered via spring drop */}
                  {selectedMeats.map((meatName) => {
                    const positions = meatScatter[meatName] || [];
                    return positions.map((pos, idx) => (
                      <motion.div
                        key={`${meatName}_${idx}`}
                        initial={{ opacity: 0, y: -200, scale: 0 }}
                        animate={{ opacity: 1, y: pos.y, x: pos.x, scale: 1 }}
                        transition={{ type: "spring", stiffness: 140, damping: 10, delay: idx * 0.05 }}
                        className="absolute z-40 pointer-events-none"
                      >
                        {/* Pepperoni circular cured slices */}
                        {meatName === 'Spicy Pepperoni' && (
                          <div className="w-6 h-6 bg-gradient-to-br from-pizza-secondary to-rose-950 rounded-full border border-rose-900 flex items-center justify-center">
                            <div className="w-4 h-4 bg-rose-900/30 rounded-full border border-dashed border-rose-500/20" />
                          </div>
                        )}
                        {/* Smoked Chicken Tikka cubes */}
                        {meatName === 'Smoked Chicken Tikka' && (
                          <div className="w-4.5 h-4.5 bg-amber-800 border border-amber-950 rotate-[25deg] rounded" />
                        )}
                        {/* Italian Sausage chunks */}
                        {meatName === 'Italian Sausage' && (
                          <div className="w-5 h-4 bg-stone-700 border border-stone-900 rounded-full rotate-45" />
                        )}
                        {/* BBQ Ham blocks */}
                        {meatName === 'BBQ Ham' && (
                          <div className="w-5 h-5 bg-rose-400 border border-rose-600 rounded" />
                        )}
                      </motion.div>
                    ));
                  })}
                </motion.div>
              </div>

              {/* Specifications Description Area */}
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-white">{pizza.name}</h3>
                <p className="text-xs text-pizza-gray leading-relaxed px-4">{pizza.description}</p>
              </div>

              {/* Pricing, Quantity Counter, & Add to Cart button */}
              <div className="pt-6 border-t border-white/5 flex items-center justify-between px-2">
                <div className="text-left">
                  <span className="block text-[10px] text-pizza-subtle uppercase font-semibold">Dynamic Total Price</span>
                  <span className="text-3xl font-black text-pizza-gold">₹{currentItemPrice * quantity}</span>
                </div>

                <div className="flex items-center bg-pizza-charcoal border border-white/10 rounded-xl px-2 py-1 shadow-premium">
                  <button 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-8 h-8 flex items-center justify-center font-black text-pizza-gray hover:text-white transition-colors"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-sm font-black text-white">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-8 h-8 flex items-center justify-center font-black text-pizza-gray hover:text-white transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full py-4 bg-gradient-to-r from-pizza-primary to-pizza-secondary hover:shadow-glow text-white font-black rounded-2xl text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4.5 h-4.5" />
                <span>Add Customized Pizza to Basket</span>
              </button>
            </div>
          </div>

          {/* ==================================================
              RIGHT AREA: TOPPINGS PICKER GRID PANELS
             ================================================== */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. Size Picker */}
            <div className="bg-[#1A120F] p-6 rounded-3xl border border-white/5 space-y-4 shadow-premium">
              <h4 className="font-extrabold text-base text-pizza-primary flex items-center gap-2 uppercase tracking-wider font-sans">
                <span className="text-[10px] bg-pizza-primary/15 px-2.5 py-1 rounded-full text-pizza-primary">1</span>
                <span>Choose Sizing</span>
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { name: 'Small', details: 'Personal (6")', extra: '₹0' },
                  { name: 'Medium', details: 'Recommended (10")', extra: '+₹60' },
                  { name: 'Large', details: 'Family (12")', extra: '+₹120' }
                ].map(s => (
                  <button
                    key={s.name}
                    onClick={() => setSelectedSize(s.name)}
                    className={`p-4 rounded-2xl border text-center transition-all duration-300 ${
                      selectedSize === s.name 
                        ? 'bg-pizza-primary/10 border-pizza-primary text-white shadow-glow' 
                        : 'bg-[#0F0B0A] border-white/5 text-pizza-gray hover:border-white/10 hover:text-white'
                    }`}
                  >
                    <span className="block font-black text-sm">{s.name}</span>
                    <span className="block text-[9px] text-pizza-subtle mt-0.5">{s.details}</span>
                    <span className="block text-xs font-bold text-pizza-gold mt-2">{s.extra}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Base Selection */}
            <div className="bg-[#1A120F] p-6 rounded-3xl border border-white/5 space-y-4 shadow-premium">
              <h4 className="font-extrabold text-base text-pizza-primary flex items-center gap-2 uppercase tracking-wider font-sans">
                <span className="text-[10px] bg-pizza-primary/15 px-2.5 py-1 rounded-full text-pizza-primary">2</span>
                <span>Select Pizza Base Crust</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {options.bases.map(b => {
                  const isOutOfStock = b.stock <= 0;
                  return (
                    <button
                      key={b.name}
                      disabled={isOutOfStock}
                      onClick={() => setSelectedBase(b.name)}
                      className={`p-4 rounded-2xl border text-left flex justify-between items-center transition-all duration-300 ${
                        isOutOfStock 
                          ? 'opacity-30 cursor-not-allowed bg-[#0F0B0A] border-transparent'
                          : selectedBase === b.name 
                          ? 'bg-pizza-primary/10 border-pizza-primary text-white shadow-glow' 
                          : 'bg-[#0F0B0A] border-white/5 text-pizza-gray hover:border-white/10 hover:text-white'
                      }`}
                    >
                      <div>
                        <span className="font-black text-sm block">{b.name}</span>
                        <span className="text-[9px] text-pizza-subtle block mt-0.5">Premium: +₹{b.unitPrice}</span>
                      </div>
                      <span className="text-xs font-bold text-pizza-gold">
                        {isOutOfStock ? 'Sold Out' : selectedBase === b.name ? <Check className="w-4 h-4 text-pizza-primary" /> : ''}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Sauce Selection */}
            <div className="bg-[#1A120F] p-6 rounded-3xl border border-white/5 space-y-4 shadow-premium">
              <h4 className="font-extrabold text-base text-pizza-primary flex items-center gap-2 uppercase tracking-wider font-sans">
                <span className="text-[10px] bg-pizza-primary/15 px-2.5 py-1 rounded-full text-pizza-primary">3</span>
                <span>Select Sauce spread</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {options.sauces.map(s => {
                  const isOutOfStock = s.stock <= 0;
                  return (
                    <button
                      key={s.name}
                      disabled={isOutOfStock}
                      onClick={() => setSelectedSauce(s.name)}
                      className={`p-4 rounded-2xl border text-left flex justify-between items-center transition-all duration-300 ${
                        isOutOfStock 
                          ? 'opacity-30 cursor-not-allowed bg-[#0F0B0A] border-transparent'
                          : selectedSauce === s.name 
                          ? 'bg-pizza-primary/10 border-pizza-primary text-white shadow-glow' 
                          : 'bg-[#0F0B0A] border-white/5 text-pizza-gray hover:border-white/10 hover:text-white'
                      }`}
                    >
                      <div>
                        <span className="font-black text-sm block">{s.name}</span>
                        <span className="text-[9px] text-pizza-subtle block mt-0.5">Premium: +₹{s.unitPrice}</span>
                      </div>
                      <span className="text-xs font-bold text-pizza-gold">
                        {isOutOfStock ? 'Sold Out' : selectedSauce === s.name ? <Check className="w-4 h-4 text-pizza-primary" /> : ''}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Cheese Selection */}
            <div className="bg-[#1A120F] p-6 rounded-3xl border border-white/5 space-y-4 shadow-premium">
              <h4 className="font-extrabold text-base text-pizza-primary flex items-center gap-2 uppercase tracking-wider font-sans">
                <span className="text-[10px] bg-pizza-primary/15 px-2.5 py-1 rounded-full text-pizza-primary">4</span>
                <span>Choose Cheese blend</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {options.cheeses.map(c => {
                  const isOutOfStock = c.stock <= 0;
                  return (
                    <button
                      key={c.name}
                      disabled={isOutOfStock}
                      onClick={() => setSelectedCheese(c.name)}
                      className={`p-4 rounded-2xl border text-left flex justify-between items-center transition-all duration-300 ${
                        isOutOfStock 
                          ? 'opacity-30 cursor-not-allowed bg-[#0F0B0A] border-transparent'
                          : selectedCheese === c.name 
                          ? 'bg-pizza-primary/10 border-pizza-primary text-white shadow-glow' 
                          : 'bg-[#0F0B0A] border-white/5 text-pizza-gray hover:border-white/10 hover:text-white'
                      }`}
                    >
                      <div>
                        <span className="font-black text-sm block">{c.name}</span>
                        <span className="text-[9px] text-pizza-subtle block mt-0.5">Premium: +₹{c.unitPrice}</span>
                      </div>
                      <span className="text-xs font-bold text-pizza-gold">
                        {isOutOfStock ? 'Sold Out' : selectedCheese === c.name ? <Check className="w-4 h-4 text-pizza-primary" /> : ''}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5. Veggie Customizer */}
            <div className="bg-[#1A120F] p-6 rounded-3xl border border-white/5 space-y-4 shadow-premium">
              <h4 className="font-extrabold text-base text-pizza-primary flex items-center gap-2 uppercase tracking-wider font-sans">
                <span className="text-[10px] bg-pizza-primary/15 px-2.5 py-1 rounded-full text-pizza-primary">5</span>
                <span>Select Veggie Toppings</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {options.veggies.map(v => {
                  const isOutOfStock = v.stock <= 0;
                  const isSelected = selectedVeggies.includes(v.name);
                  return (
                    <button
                      key={v.name}
                      disabled={isOutOfStock}
                      onClick={() => handleVeggieToggle(v.name)}
                      className={`p-4 rounded-2xl border text-left flex justify-between items-center transition-all duration-300 ${
                        isOutOfStock 
                          ? 'opacity-30 cursor-not-allowed bg-[#0F0B0A] border-transparent'
                          : isSelected 
                          ? 'bg-pizza-primary/10 border-pizza-primary text-white shadow-glow' 
                          : 'bg-[#0F0B0A] border-white/5 text-pizza-gray hover:border-white/10 hover:text-white'
                      }`}
                    >
                      <div>
                        <span className="font-black text-sm block">{v.name}</span>
                        <span className="text-[9px] text-pizza-subtle block mt-0.5">Premium: +₹{v.unitPrice}</span>
                      </div>
                      <span className="text-xs font-bold text-pizza-gold">
                        {isOutOfStock ? 'Sold Out' : isSelected ? <Check className="w-4 h-4 text-pizza-primary" /> : '+ Add'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 6. Meat Toppings Pickers */}
            <div className="bg-[#1A120F] p-6 rounded-3xl border border-white/5 space-y-4 shadow-premium">
              <h4 className="font-extrabold text-base text-pizza-primary flex items-center gap-2 uppercase tracking-wider font-sans">
                <span className="text-[10px] bg-pizza-primary/15 px-2.5 py-1 rounded-full text-pizza-primary">6</span>
                <span>Select Meat Toppings (Optional)</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {options.meats.map(m => {
                  const isOutOfStock = m.stock <= 0;
                  const isSelected = selectedMeats.includes(m.name);
                  return (
                    <button
                      key={m.name}
                      disabled={isOutOfStock}
                      onClick={() => handleMeatToggle(m.name)}
                      className={`p-4 rounded-2xl border text-left flex justify-between items-center transition-all duration-300 ${
                        isOutOfStock 
                          ? 'opacity-30 cursor-not-allowed bg-[#0F0B0A] border-transparent'
                          : isSelected 
                          ? 'bg-pizza-primary/10 border-pizza-primary text-white shadow-glow' 
                          : 'bg-[#0F0B0A] border-white/5 text-pizza-gray hover:border-white/10 hover:text-white'
                      }`}
                    >
                      <div>
                        <span className="font-black text-sm block">{m.name}</span>
                        <span className="text-[9px] text-pizza-subtle block mt-0.5">Premium: +₹{m.unitPrice}</span>
                      </div>
                      <span className="text-xs font-bold text-pizza-gold">
                        {isOutOfStock ? 'Sold Out' : isSelected ? <Check className="w-4 h-4 text-pizza-primary" /> : '+ Add'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
