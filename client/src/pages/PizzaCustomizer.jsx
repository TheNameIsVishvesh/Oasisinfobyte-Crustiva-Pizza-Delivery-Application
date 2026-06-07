import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { useCart } from '../context/CartContext';
import { 
  ChevronLeft, Info, HelpCircle, AlertCircle, ShoppingBag, 
  Check, Sparkles, Flame, Eye, Leaf, X, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import CrustSvg from '../assets/pizza/CrustSvg';
import CheeseLayer from '../assets/pizza/CheeseLayer';
import ToppingIcon, { veggieScatter, meatScatter } from '../assets/pizza/ToppingIcon';

// Organic speckle details for Pesto and Schezwan sauces
const Speckles = ({ color, count }) => {
  const dots = Array.from({ length: count });
  return (
    <svg className="absolute inset-0 w-full h-full opacity-45 pointer-events-none">
      {dots.map((_, i) => {
        const angle = (i * (360 / count) * Math.PI) / 180;
        const radius = 10 + (Math.sin(i * 13) * 0.5 + 0.5) * 32; // stay within radius
        const x = 50 + Math.cos(angle) * radius;
        const y = 50 + Math.sin(angle) * radius;
        return (
          <circle
            key={i}
            cx={`${x}%`}
            cy={`${y}%`}
            r={1.2 + (i % 3) * 0.4}
            fill={color}
          />
        );
      })}
    </svg>
  );
};

// Web Audio API Synthesizer pop
const playSynthPop = (frequency = 600, duration = 0.1, type = 'sine') => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(frequency * 1.5, ctx.currentTime + duration);
    
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // Fail silently on browsers that block early audio
  }
};

// Main visual Deck container (Atmospheric effects, Steam, Embers, Pizza layers)
const VisualPizzaDeck = ({
  pizza,
  selectedSize,
  selectedBase,
  selectedSauce,
  selectedCheese,
  selectedVeggies,
  selectedMeats,
  embers,
  deckRef
}) => {
  const getSauceGradient = (sauce) => {
    switch (sauce) {
      case 'Classic Marinara Sauce':
        return 'radial-gradient(circle, #D84315 45%, #C62828 78%, #9E0D0D 95%)';
      case 'Spicy Schezwan Sauce':
        return 'radial-gradient(circle, #D84315 35%, #9E0D0D 72%, #6A000A 95%)';
      case 'Creamy Alfredo White Sauce':
        return 'radial-gradient(circle, #FFFDE7 50%, #F5F5F5 80%, #D7CCC8 95%)';
      case 'Smokey BBQ Sauce':
        return 'radial-gradient(circle, #5D4037 45%, #3E2723 78%, #1A0C08 95%)';
      default: // Pesto / green
        return 'radial-gradient(circle, #4CAF50 40%, #2E7D32 75%, #1B5E20 95%)';
    }
  };

  return (
    <div 
      ref={deckRef}
      className="w-72 h-72 md:w-80 md:h-80 bg-[#0A0706] rounded-full flex items-center justify-center mx-auto border border-white/5 relative shadow-premium overflow-hidden group"
    >
      {/* 1. Oven Glow Backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-pizza-primary/20 via-transparent to-transparent pointer-events-none" />

      {/* 2. Baking Convection Embers */}
      {embers.map(e => (
        <motion.div
          key={e.id}
          className="absolute bottom-0 bg-gradient-to-t from-pizza-primary to-pizza-gold rounded-full opacity-40 pointer-events-none"
          style={{
            left: `${e.left}%`,
            width: e.size,
            height: e.size,
            filter: 'blur(1px)',
          }}
          animate={{
            y: [-10, -320],
            x: [0, Math.sin(e.id) * 35, Math.cos(e.id) * 45],
            opacity: [0, 0.7, 0.3, 0],
            scale: [1, 1.4, 0.7]
          }}
          transition={{
            duration: e.duration,
            delay: e.delay,
            repeat: Infinity,
            ease: "easeOut"
          }}
        />
      ))}

      {/* 3. Rising Steam Convection */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-40 opacity-70" viewBox="0 0 100 100" preserveAspectRatio="none">
        <motion.path
          d="M 32,85 Q 22,55 42,35 T 32,10"
          fill="none"
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth="2.2"
          strokeLinecap="round"
          animate={{
            strokeDasharray: ["0, 100", "100, 0"],
            strokeDashoffset: [0, -100],
            opacity: [0, 0.5, 0]
          }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path
          d="M 68,85 Q 78,55 58,35 T 68,10"
          fill="none"
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth="2.2"
          strokeLinecap="round"
          animate={{
            strokeDasharray: ["0, 100", "100, 0"],
            strokeDashoffset: [0, -100],
            opacity: [0, 0.5, 0]
          }}
          transition={{ duration: 5.2, delay: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>

      {/* 4. Active Pizza layers with Heat displacement filter */}
      <motion.div
        animate={{
          scale: selectedSize === 'Small' ? 0.78 : selectedSize === 'Medium' ? 0.90 : 1.02
        }}
        transition={{ type: "spring", stiffness: 220, damping: 16 }}
        style={{ filter: 'url(#heat-shimmer-filter)' }}
        className="w-[88%] h-[88%] rounded-full relative flex items-center justify-center will-change-transform"
      >
        {/* Layer A: Base Crust */}
        <div className="absolute inset-0 z-0">
          <CrustSvg base={selectedBase} />
        </div>

        {/* Layer B: Sauce Spread */}
        <AnimatePresence mode="wait">
          {selectedSauce && (
            <motion.div
              key={selectedSauce}
              initial={{ scale: 0.08, opacity: 0 }}
              animate={{ scale: 0.88, opacity: 1 }}
              exit={{ scale: 0.08, opacity: 0 }}
              transition={{ type: "spring", stiffness: 110, damping: 15 }}
              className="absolute inset-0 rounded-full z-10 overflow-hidden"
              style={{
                background: getSauceGradient(selectedSauce),
                boxShadow: 'inset 0 0 16px rgba(0,0,0,0.3)',
              }}
            >
              {/* Glossy shine glaze */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent pointer-events-none rounded-full" />
              {/* Spice flakes for Schezwan/Pesto */}
              {selectedSauce === 'Spicy Schezwan Sauce' && <Speckles color="#3E000C" count={30} />}
              {selectedSauce === 'Pesto Sauce' && <Speckles color="#1B5E20" count={30} />}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Layer C: Melted Cheese */}
        <CheeseLayer cheese={selectedCheese} />

        {/* Layer D: scattered Veggie elements */}
        <AnimatePresence>
          {selectedVeggies.flatMap((vegName) => {
            const positions = veggieScatter[vegName] || [];
            return positions.map((pos, idx) => (
              <motion.div
                key={`${vegName}_${idx}`}
                initial={{ opacity: 0, y: -220, scale: 0, rotate: -45 }}
                animate={{ opacity: 1, y: pos.y * 1.3, x: pos.x * 1.3, scale: 1, rotate: pos.rotate }}
                exit={{ opacity: 0, scale: 0, y: 150, rotate: 180, transition: { duration: 0.45 } }}
                transition={{ type: "spring", stiffness: 130, damping: 11, delay: idx * 0.02 }}
                className="absolute z-30 pointer-events-none"
              >
                <ToppingIcon name={vegName} />
              </motion.div>
            ));
          })}
        </AnimatePresence>

        {/* Layer E: scattered Meat elements */}
        <AnimatePresence>
          {selectedMeats.flatMap((meatName) => {
            const positions = meatScatter[meatName] || [];
            return positions.map((pos, idx) => (
              <motion.div
                key={`${meatName}_${idx}`}
                initial={{ opacity: 0, y: -220, scale: 0, rotate: -45 }}
                animate={{ opacity: 1, y: pos.y * 1.3, x: pos.x * 1.3, scale: 1, rotate: pos.rotate }}
                exit={{ opacity: 0, scale: 0, y: 150, rotate: 180, transition: { duration: 0.45 } }}
                transition={{ type: "spring", stiffness: 150, damping: 11, delay: idx * 0.02 }}
                className="absolute z-35 pointer-events-none"
              >
                <ToppingIcon name={meatName} />
              </motion.div>
            ));
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default function PizzaCustomizer() {
  const [searchParams] = useSearchParams();
  const pizzaId = searchParams.get('pizzaId');
  
  const [pizza, setPizza] = useState(null);
  const [options, setOptions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Selection states
  const [selectedSize, setSelectedSize] = useState('Medium');
  const [selectedBase, setSelectedBase] = useState('');
  const [selectedSauce, setSelectedSauce] = useState('');
  const [selectedCheese, setSelectedCheese] = useState('');
  const [selectedVeggies, setSelectedVeggies] = useState([]);
  const [selectedMeats, setSelectedMeats] = useState([]);
  const [quantity, setQuantity] = useState(1);

  // Interaction fly state & refs
  const [flyingToppings, setFlyingToppings] = useState([]);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const pizzaDeckRef = useRef(null);
  const mobilePizzaDeckRef = useRef(null);

  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Embers generator
  const [embers] = useState(() => 
    Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 3 + 2,
      delay: Math.random() * 6,
      duration: Math.random() * 3.5 + 4,
    }))
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const pRes = await API.get('/api/pizzas');
        let activePizza = null;

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

        // Fetch options
        const oRes = await API.get('/api/pizzas/customizer-options');
        const opts = oRes.data.data;
        setOptions(opts);

        // Prepopulate
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

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileDrawerOpen]);

  // Price math
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

  const currentItemPrice = calculateCurrentPrice();

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

  // Fly-to-pizza animation trigger
  const triggerFlyAnimation = (toppingName, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;
    const id = `${toppingName}-${Date.now()}`;
    
    setFlyingToppings(prev => [
      ...prev,
      { id, name: toppingName, startX, startY }
    ]);
  };

  const getPizzaCenter = () => {
    const activeDeck = mobileDrawerOpen ? mobilePizzaDeckRef.current : pizzaDeckRef.current;
    if (activeDeck) {
      const rect = activeDeck.getBoundingClientRect();
      return { x: rect.left + rect.width / 2 - 12, y: rect.top + rect.height / 2 - 12 };
    }
    return { x: window.innerWidth / 3, y: window.innerHeight / 2 };
  };

  const handleAddToCart = () => {
    if (!selectedBase || !selectedSauce || !selectedCheese) {
      alert('Please select a crust base, sauce and cheese blend.');
      return;
    }

    // Play baking C major cascade
    playSynthPop(523.25, 0.15, 'sine'); // C5
    setTimeout(() => playSynthPop(659.25, 0.15, 'sine'), 80); // E5
    setTimeout(() => playSynthPop(783.99, 0.25, 'sine'), 160); // G5

    const customization = {
      base: selectedBase,
      sauce: selectedSauce,
      cheese: selectedCheese,
      veggies: selectedVeggies,
      meat: selectedMeats,
    };

    addToCart({ ...pizza, price: currentItemPrice }, customization, selectedSize, quantity);
    
    if (mobileDrawerOpen) setMobileDrawerOpen(false);
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

  return (
    <div className="min-h-screen bg-[#0F0B0A] text-[#F8F5F2] py-8 px-4 md:px-8 relative overflow-hidden font-sans">
      
      {/* 1. Global Defs for Pizza rendering */}
      <svg className="absolute w-0 h-0 pointer-events-none" style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <radialGradient id="pepperoniGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#E53935" />
            <stop offset="70%" stopColor="#C62828" />
            <stop offset="100%" stopColor="#7F0000" />
          </radialGradient>
          {/* displacement filter for heat wave convection shimmer */}
          <filter id="heat-shimmer-filter">
            <feTurbulence type="fractalNoise" baseFrequency="0.04 0.08" numOctaves="1" result="noise">
              <animate attributeName="baseFrequency" dur="12s" values="0.04 0.08; 0.05 0.09; 0.04 0.08" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      {/* Background blurs */}
      <div className="absolute top-[-5%] right-[-5%] w-[400px] h-[400px] bg-pizza-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] bg-pizza-gold/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Fly animation elements portal */}
      <AnimatePresence>
        {flyingToppings.map(ft => {
          const center = getPizzaCenter();
          return (
            <motion.div
              key={ft.id}
              className="fixed z-[999] pointer-events-none"
              initial={{ x: ft.startX - 12, y: ft.startY - 12, scale: 1.6, opacity: 1 }}
              animate={{
                x: center.x,
                y: center.y,
                scale: 0.9,
                rotate: 360,
                opacity: [1, 1, 0.7, 0]
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              onAnimationComplete={() => {
                setFlyingToppings(prev => prev.filter(item => item.id !== ft.id));
              }}
            >
              <ToppingIcon name={ft.name} />
            </motion.div>
          );
        })}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto space-y-6 z-10 relative">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-pizza-gray hover:text-white transition-colors">
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Gourmet Catalog</span>
        </Link>

        {/* Header Title */}
        <div className="space-y-1">
          <span className="text-[10px] font-black text-pizza-primary tracking-widest uppercase block">BUILD ENGINE 2.0</span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
            Crustiva Live Pizza Customizer
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2 relative pb-16">
          
          {/* ==================================================
              DESKTOP LEFT AREA: STICKY VISUAL PREVIEW
             ================================================== */}
          <div className="hidden lg:block lg:col-span-5 lg:sticky lg:top-[100px] h-fit pr-1">
            <div className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.06] p-8 rounded-[2.5rem] shadow-premium text-center space-y-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pizza-primary via-pizza-gold to-pizza-secondary" />

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pizza-primary/10 border border-pizza-primary/20 text-xs font-black text-pizza-primary">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Base Recipe: {pizza.name}</span>
              </span>

              {/* Pizza Visual deck */}
              <VisualPizzaDeck
                pizza={pizza}
                selectedSize={selectedSize}
                selectedBase={selectedBase}
                selectedSauce={selectedSauce}
                selectedCheese={selectedCheese}
                selectedVeggies={selectedVeggies}
                selectedMeats={selectedMeats}
                embers={embers}
                deckRef={pizzaDeckRef}
              />

              {/* Description */}
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-white">{pizza.name}</h3>
                <p className="text-xs text-pizza-gray leading-relaxed px-4">{pizza.description}</p>
              </div>

              {/* Dynamic Footer Pricing, Counters, Checkout */}
              <div className="pt-6 border-t border-white/[0.06] flex items-center justify-between px-2">
                <div className="text-left">
                  <span className="block text-[10px] text-pizza-subtle uppercase font-semibold">Total Price</span>
                  <span className="text-3xl font-black text-pizza-gold">₹{currentItemPrice * quantity}</span>
                </div>

                <div className="flex items-center bg-[#16100D] border border-white/[0.08] rounded-xl px-2 py-1 shadow-premium">
                  <button 
                    onClick={() => {
                      playSynthPop(300, 0.08, 'triangle');
                      setQuantity(q => Math.max(1, q - 1));
                    }}
                    className="w-8 h-8 flex items-center justify-center font-black text-pizza-gray hover:text-white transition-colors"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-sm font-black text-white">{quantity}</span>
                  <button 
                    onClick={() => {
                      playSynthPop(350, 0.08, 'triangle');
                      setQuantity(q => q + 1);
                    }}
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
              MOBILE STATIC TOP DRAWER TRIGGER (Hidden on Desktop)
             ================================================== */}
          <div className="lg:hidden w-full bg-white/[0.02] backdrop-blur-xl border border-white/[0.06] p-6 rounded-3xl text-center space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pizza-primary/10 border border-pizza-primary/20 text-xs font-black text-pizza-primary">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gourmet Recipe: {pizza.name}</span>
            </span>

            <VisualPizzaDeck
              pizza={pizza}
              selectedSize={selectedSize}
              selectedBase={selectedBase}
              selectedSauce={selectedSauce}
              selectedCheese={selectedCheese}
              selectedVeggies={selectedVeggies}
              selectedMeats={selectedMeats}
              embers={embers}
              deckRef={pizzaDeckRef}
            />

            <div className="space-y-1">
              <h3 className="text-xl font-black text-white">{pizza.name}</h3>
              <p className="text-xs text-pizza-gray leading-relaxed px-4">{pizza.description}</p>
            </div>

            <button
              onClick={() => {
                playSynthPop(500, 0.12, 'sine');
                setMobileDrawerOpen(true);
              }}
              className="w-full py-3 bg-[#1A120F] hover:bg-white/[0.04] border border-white/[0.08] text-pizza-gold font-bold rounded-xl text-xs flex items-center justify-center gap-2"
            >
              <span>Expand Mobile Live Visualizer</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* ==================================================
              RIGHT CUSTOMIZER SELECTION SCROLLABLE PANEL
             ================================================== */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. Size Picker */}
            <div className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.06] p-6 rounded-3xl space-y-4 shadow-premium">
              <h4 className="font-extrabold text-sm text-pizza-primary flex items-center gap-2 uppercase tracking-wider font-sans">
                <span className="text-[10px] bg-pizza-primary/15 px-2.5 py-1 rounded-full text-pizza-primary">1</span>
                <span>Select Dimensions</span>
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { name: 'Small', details: 'Personal (6")', extra: '₹0' },
                  { name: 'Medium', details: 'Recommended (10")', extra: '+₹60' },
                  { name: 'Large', details: 'Family (12")', extra: '+₹120' }
                ].map(s => (
                  <button
                    key={s.name}
                    onClick={() => {
                      playSynthPop(400, 0.1, 'sine');
                      setSelectedSize(s.name);
                    }}
                    className={`p-4 rounded-2xl border text-center transition-all duration-300 ${
                      selectedSize === s.name 
                        ? 'bg-gradient-to-r from-pizza-primary/15 to-pizza-gold/5 border-pizza-primary text-white shadow-glow' 
                        : 'bg-[#0A0706]/40 border-white/[0.05] text-pizza-gray hover:border-white/[0.12] hover:bg-white/[0.06] hover:text-white'
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
            <div className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.06] p-6 rounded-3xl space-y-4 shadow-premium">
              <h4 className="font-extrabold text-sm text-pizza-primary flex items-center gap-2 uppercase tracking-wider font-sans">
                <span className="text-[10px] bg-pizza-primary/15 px-2.5 py-1 rounded-full text-pizza-primary">2</span>
                <span>Crust Base Selection</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {options.bases.map(b => {
                  const isOutOfStock = b.stock <= 0;
                  const isSelected = selectedBase === b.name;
                  return (
                    <button
                      key={b.name}
                      disabled={isOutOfStock}
                      onClick={() => {
                        playSynthPop(300, 0.12, 'triangle');
                        setSelectedBase(b.name);
                      }}
                      className={`p-4 rounded-2xl border text-left flex justify-between items-center transition-all duration-300 ${
                        isOutOfStock 
                          ? 'opacity-25 cursor-not-allowed bg-[#0A0706]/20 border-transparent'
                          : isSelected 
                          ? 'bg-gradient-to-r from-pizza-primary/15 to-pizza-gold/5 border-pizza-primary text-white shadow-glow' 
                          : 'bg-[#0A0706]/40 border-white/[0.05] text-pizza-gray hover:border-white/[0.12] hover:bg-white/[0.06] hover:text-white'
                      }`}
                    >
                      <div>
                        <span className="font-black text-sm block">{b.name}</span>
                        <span className="text-[9px] text-pizza-subtle block mt-0.5">Premium: +₹{b.unitPrice}</span>
                      </div>
                      <span className="text-xs font-bold text-pizza-gold">
                        {isOutOfStock ? 'Sold Out' : isSelected ? <Check className="w-4 h-4 text-pizza-primary" /> : ''}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Sauce Selection */}
            <div className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.06] p-6 rounded-3xl space-y-4 shadow-premium">
              <h4 className="font-extrabold text-sm text-pizza-primary flex items-center gap-2 uppercase tracking-wider font-sans">
                <span className="text-[10px] bg-pizza-primary/15 px-2.5 py-1 rounded-full text-pizza-primary">3</span>
                <span>Sauce Spread Blend</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {options.sauces.map(s => {
                  const isOutOfStock = s.stock <= 0;
                  const isSelected = selectedSauce === s.name;
                  return (
                    <button
                      key={s.name}
                      disabled={isOutOfStock}
                      onClick={() => {
                        playSynthPop(250, 0.25, 'sine');
                        setSelectedSauce(s.name);
                      }}
                      className={`p-4 rounded-2xl border text-left flex justify-between items-center transition-all duration-300 ${
                        isOutOfStock 
                          ? 'opacity-25 cursor-not-allowed bg-[#0A0706]/20 border-transparent'
                          : isSelected 
                          ? 'bg-gradient-to-r from-pizza-primary/15 to-pizza-gold/5 border-pizza-primary text-white shadow-glow' 
                          : 'bg-[#0A0706]/40 border-white/[0.05] text-pizza-gray hover:border-white/[0.12] hover:bg-white/[0.06] hover:text-white'
                      }`}
                    >
                      <div>
                        <span className="font-black text-sm block">{s.name}</span>
                        <span className="text-[9px] text-pizza-subtle block mt-0.5">Premium: +₹{s.unitPrice}</span>
                      </div>
                      <span className="text-xs font-bold text-pizza-gold">
                        {isOutOfStock ? 'Sold Out' : isSelected ? <Check className="w-4 h-4 text-pizza-primary" /> : ''}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Cheese Selection */}
            <div className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.06] p-6 rounded-3xl space-y-4 shadow-premium">
              <h4 className="font-extrabold text-sm text-pizza-primary flex items-center gap-2 uppercase tracking-wider font-sans">
                <span className="text-[10px] bg-pizza-primary/15 px-2.5 py-1 rounded-full text-pizza-primary">4</span>
                <span>Select Cheese Blend</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {options.cheeses.map(c => {
                  const isOutOfStock = c.stock <= 0;
                  const isSelected = selectedCheese === c.name;
                  return (
                    <button
                      key={c.name}
                      disabled={isOutOfStock}
                      onClick={() => {
                        playSynthPop(750, 0.1, 'sine');
                        setSelectedCheese(c.name);
                      }}
                      className={`p-4 rounded-2xl border text-left flex justify-between items-center transition-all duration-300 ${
                        isOutOfStock 
                          ? 'opacity-25 cursor-not-allowed bg-[#0A0706]/20 border-transparent'
                          : isSelected 
                          ? 'bg-gradient-to-r from-pizza-primary/15 to-pizza-gold/5 border-pizza-primary text-white shadow-glow' 
                          : 'bg-[#0A0706]/40 border-white/[0.05] text-pizza-gray hover:border-white/[0.12] hover:bg-white/[0.06] hover:text-white'
                      }`}
                    >
                      <div>
                        <span className="font-black text-sm block">{c.name}</span>
                        <span className="text-[9px] text-pizza-subtle block mt-0.5">Premium: +₹{c.unitPrice}</span>
                      </div>
                      <span className="text-xs font-bold text-pizza-gold">
                        {isOutOfStock ? 'Sold Out' : isSelected ? <Check className="w-4 h-4 text-pizza-primary" /> : ''}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5. Veggie Customizer */}
            <div className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.06] p-6 rounded-3xl space-y-4 shadow-premium">
              <h4 className="font-extrabold text-sm text-pizza-primary flex items-center gap-2 uppercase tracking-wider font-sans">
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
                      onClick={(e) => {
                        if (isOutOfStock) return;
                        playSynthPop(450, 0.12, 'sine');
                        if (!isSelected) {
                          triggerFlyAnimation(v.name, e);
                        }
                        handleVeggieToggle(v.name);
                      }}
                      className={`p-4 rounded-2xl border text-left flex justify-between items-center transition-all duration-300 relative group overflow-hidden ${
                        isOutOfStock 
                          ? 'opacity-25 cursor-not-allowed bg-[#0A0706]/20 border-transparent'
                          : isSelected 
                          ? 'bg-gradient-to-r from-pizza-primary/15 to-pizza-gold/5 border-pizza-primary text-white shadow-glow' 
                          : 'bg-[#0A0706]/40 border-white/[0.05] text-pizza-gray hover:border-white/[0.12] hover:bg-white/[0.06] hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="opacity-70 group-hover:scale-110 transition-transform duration-300">
                          <ToppingIcon name={v.name} />
                        </div>
                        <div>
                          <span className="font-black text-sm block">{v.name}</span>
                          <span className="text-[9px] text-pizza-subtle block mt-0.5">Premium: +₹{v.unitPrice}</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-pizza-gold z-10 relative">
                        {isOutOfStock ? 'Sold Out' : isSelected ? <Check className="w-4 h-4 text-pizza-primary animate-scale-up" /> : '+ Add'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 6. Meat Toppings Pickers */}
            <div className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.06] p-6 rounded-3xl space-y-4 shadow-premium">
              <h4 className="font-extrabold text-sm text-pizza-primary flex items-center gap-2 uppercase tracking-wider font-sans">
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
                      onClick={(e) => {
                        if (isOutOfStock) return;
                        playSynthPop(480, 0.12, 'sine');
                        if (!isSelected) {
                          triggerFlyAnimation(m.name, e);
                        }
                        handleMeatToggle(m.name);
                      }}
                      className={`p-4 rounded-2xl border text-left flex justify-between items-center transition-all duration-300 relative group overflow-hidden ${
                        isOutOfStock 
                          ? 'opacity-25 cursor-not-allowed bg-[#0A0706]/20 border-transparent'
                          : isSelected 
                          ? 'bg-gradient-to-r from-pizza-primary/15 to-pizza-gold/5 border-pizza-primary text-white shadow-glow' 
                          : 'bg-[#0A0706]/40 border-white/[0.05] text-pizza-gray hover:border-white/[0.12] hover:bg-white/[0.06] hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="opacity-70 group-hover:scale-110 transition-transform duration-300">
                          <ToppingIcon name={m.name} />
                        </div>
                        <div>
                          <span className="font-black text-sm block">{m.name}</span>
                          <span className="text-[9px] text-pizza-subtle block mt-0.5">Premium: +₹{m.unitPrice}</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-pizza-gold z-10 relative">
                        {isOutOfStock ? 'Sold Out' : isSelected ? <Check className="w-4 h-4 text-pizza-primary animate-scale-up" /> : '+ Add'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ==================================================
          MOBILE BOTTOM FLOATING CIRCULAR BADGE
         ================================================== */}
      {!mobileDrawerOpen && (
        <motion.button
          onClick={() => {
            playSynthPop(500, 0.12, 'sine');
            setMobileDrawerOpen(true);
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="fixed bottom-6 right-6 z-50 lg:hidden flex items-center justify-center p-0 rounded-full border border-pizza-primary/30 shadow-glow bg-[#120C0A]"
          style={{ width: 84, height: 84 }}
        >
          <div className="relative w-full h-full flex items-center justify-center rounded-full overflow-hidden">
            {/* Spinning background halo */}
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-pizza-gold/20 animate-spin" style={{ animationDuration: '20s' }} />
            
            {/* Mini scaled down Pizza visualizer */}
            <div className="w-[66px] h-[66px] rounded-full scale-[0.24] origin-center flex items-center justify-center pointer-events-none">
              <div className="scale-[4.2]">
                <VisualPizzaDeck
                  pizza={pizza}
                  selectedSize={selectedSize}
                  selectedBase={selectedBase}
                  selectedSauce={selectedSauce}
                  selectedCheese={selectedCheese}
                  selectedVeggies={selectedVeggies}
                  selectedMeats={selectedMeats}
                  embers={[]}
                  deckRef={null}
                />
              </div>
            </div>

            {/* Price overlay flag */}
            <span className="absolute bottom-1 bg-pizza-primary text-[8px] font-black text-white px-1.5 py-0.5 rounded-full border border-white/10 uppercase tracking-tighter">
              ₹{currentItemPrice}
            </span>
          </div>
        </motion.button>
      )}

      {/* ==================================================
          MOBILE FULLSCREEN DRAWER OVERLAY
         ================================================== */}
      <AnimatePresence>
        {mobileDrawerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] lg:hidden bg-black/85 backdrop-blur-md flex flex-col justify-end"
          >
            {/* Slide up panel container */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="bg-[#0F0B0A] border-t border-white/[0.08] w-full max-h-[85vh] rounded-t-[2.5rem] flex flex-col overflow-hidden relative shadow-premium"
            >
              {/* Close button */}
              <button
                onClick={() => {
                  playSynthPop(300, 0.08, 'sine');
                  setMobileDrawerOpen(false);
                }}
                className="absolute top-5 right-5 w-9 h-9 flex items-center justify-center bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] text-white rounded-full z-50 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 pt-12 flex flex-col items-center">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-pizza-primary/10 border border-pizza-primary/20 text-[10px] font-black text-pizza-primary">
                  <Sparkles className="w-3 h-3" />
                  <span>Interactive Craft Deck</span>
                </span>

                {/* Main Visualizer */}
                <div className="py-4">
                  <VisualPizzaDeck
                    pizza={pizza}
                    selectedSize={selectedSize}
                    selectedBase={selectedBase}
                    selectedSauce={selectedSauce}
                    selectedCheese={selectedCheese}
                    selectedVeggies={selectedVeggies}
                    selectedMeats={selectedMeats}
                    embers={embers}
                    deckRef={mobilePizzaDeckRef}
                  />
                </div>

                <div className="text-center space-y-1 max-w-sm px-4">
                  <h3 className="text-2xl font-black text-white">{pizza.name}</h3>
                  <p className="text-xs text-pizza-gray leading-relaxed">{pizza.description}</p>
                </div>

                {/* Customized Summary tags */}
                <div className="w-full max-w-md bg-white/[0.02] border border-white/[0.04] p-4 rounded-2xl flex flex-wrap gap-2 justify-center">
                  <span className="text-[9px] px-2 py-0.5 rounded-md bg-[#16100D] border border-white/[0.04] font-medium text-pizza-gray">
                    Size: {selectedSize}
                  </span>
                  <span className="text-[9px] px-2 py-0.5 rounded-md bg-[#16100D] border border-white/[0.04] font-medium text-pizza-gray">
                    Base: {selectedBase}
                  </span>
                  <span className="text-[9px] px-2 py-0.5 rounded-md bg-[#16100D] border border-white/[0.04] font-medium text-pizza-gray">
                    Sauce: {selectedSauce}
                  </span>
                  <span className="text-[9px] px-2 py-0.5 rounded-md bg-[#16100D] border border-white/[0.04] font-medium text-pizza-gray">
                    Cheese: {selectedCheese}
                  </span>
                  {selectedVeggies.map(v => (
                    <span key={v} className="text-[9px] px-2 py-0.5 rounded-md bg-[#16100D] border border-white/[0.04] font-medium text-pizza-gold">
                      + {v}
                    </span>
                  ))}
                  {selectedMeats.map(m => (
                    <span key={m} className="text-[9px] px-2 py-0.5 rounded-md bg-[#16100D] border border-white/[0.04] font-medium text-pizza-secondary">
                      + {m}
                    </span>
                  ))}
                </div>
              </div>

              {/* Checkout / Quantity Section */}
              <div className="bg-[#16100D] border-t border-white/[0.06] p-6 space-y-4">
                <div className="flex justify-between items-center max-w-md mx-auto">
                  <div className="text-left">
                    <span className="block text-[9px] text-pizza-subtle uppercase font-bold">Checkout Price</span>
                    <span className="text-3xl font-black text-pizza-gold">₹{currentItemPrice * quantity}</span>
                  </div>

                  <div className="flex items-center bg-[#0F0B0A] border border-white/[0.08] rounded-xl px-2 py-1 shadow-premium">
                    <button 
                      onClick={() => {
                        playSynthPop(300, 0.08, 'triangle');
                        setQuantity(q => Math.max(1, q - 1));
                      }}
                      className="w-8 h-8 flex items-center justify-center font-black text-pizza-gray hover:text-white transition-colors"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-sm font-black text-white">{quantity}</span>
                    <button 
                      onClick={() => {
                        playSynthPop(350, 0.08, 'triangle');
                        setQuantity(q => q + 1);
                      }}
                      className="w-8 h-8 flex items-center justify-center font-black text-pizza-gray hover:text-white transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="w-full max-w-md mx-auto py-4 bg-gradient-to-r from-pizza-primary to-pizza-secondary hover:shadow-glow text-white font-black rounded-2xl text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4.5 h-4.5" />
                  <span>Confirm and Checkout</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
