import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { 
  Search, SlidersHorizontal, ShoppingCart, Sparkles, 
  AlertTriangle, Star, Clock, Heart, Award, ArrowRight, 
  ChefHat, Flame, Leaf, UtensilsCrossed, ShieldCheck 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HomeDashboard() {
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [favorites, setFavorites] = useState([]);

  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPizzas = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await API.get('/api/pizzas');
        setPizzas(res.data.data);
      } catch (err) {
        console.error('❌ Failed to fetch pizzas:', err.message);
        setError('Failed to fetch the pizza catalog. Please check that the backend is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchPizzas();
  }, []);

  // Toggle favorite helper
  const toggleFavorite = (pizzaId, e) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(pizzaId) ? prev.filter(id => id !== pizzaId) : [...prev, pizzaId]
    );
  };

  // Filtering Logic
  const filteredPizzas = pizzas.filter((pizza) => {
    const matchesSearch = pizza.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          pizza.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || pizza.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleQuickAdd = (pizza) => {
    const defaultCustomization = {
      base: 'Thin Crust',
      sauce: 'Classic Marinara Sauce',
      cheese: 'Mozzarella Cheese',
      veggies: [],
      meat: [],
    };
    addToCart(pizza, defaultCustomization, 'Medium', 1);
    navigate('/cart');
  };

  // Fake review scores for products to look ultra realistic
  const getRating = (name) => {
    if (name.includes('Margherita')) return { score: '4.8', count: 142 };
    if (name.includes('Farmhouse')) return { score: '4.9', count: 218 };
    if (name.includes('Fiery Chicken')) return { score: '4.7', count: 98 };
    if (name.includes('Pepperoni')) return { score: '4.9', count: 304 };
    return { score: '4.8', count: 86 };
  };

  const getPrepTime = (name) => {
    if (name.includes('Pepperoni') || name.includes('Fiery')) return '18-20 min';
    return '12-15 min';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="min-h-screen bg-[#0F0B0A] text-[#F8F5F2] py-6 px-4 md:px-8 relative overflow-hidden">
      {/* Dynamic Background Glow Blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-pizza-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] left-[-15%] w-[450px] h-[450px] bg-pizza-gold/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-[400px] h-[400px] bg-pizza-secondary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16 z-10 relative">
        
        {/* ==================================================
            1. HERO SECTION (ULTRA PREMIUM)
           ================================================== */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-8">
          <div className="lg:col-span-7 space-y-8 text-left">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1A120F] border border-pizza-primary/20 text-xs font-black text-pizza-primary"
            >
              <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
              <span>THE ULTIMATE DOUGH EXPERIMENT</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-extrabold tracking-tight leading-none text-white font-sans"
            >
              Savor the <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-pizza-primary via-pizza-gold to-pizza-secondary">
                Masterpiece
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base md:text-lg text-pizza-gray leading-relaxed max-w-xl font-sans"
            >
              Indulge in <strong className="text-white">Crustiva's</strong> signature hot gourmet crusts, featuring authentic slow-fermented Italian sourdough, rich chef-crafted sauces, and bubbling premium cheese blends built live to your perfection.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-4 pt-2"
            >
              <button 
                onClick={() => {
                  const el = document.getElementById('catalog-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-4 bg-gradient-to-r from-pizza-primary to-pizza-secondary hover:shadow-glow text-white font-black rounded-2xl text-xs uppercase tracking-wider transition-all duration-300 flex items-center gap-2"
              >
                <span>Browse Menu</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button 
                onClick={() => navigate('/customizer?pizzaId=default')}
                className="px-8 py-4 bg-[#1A120F] border border-white/10 hover:border-pizza-primary/40 text-pizza-light font-black rounded-2xl text-xs uppercase tracking-wider transition-all duration-300 flex items-center gap-2"
              >
                <ChefHat className="w-4 h-4 text-pizza-gold" />
                <span>Live Pizza Customizer</span>
              </button>
            </motion.div>

            {/* Micro Highlights */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-3 gap-6 pt-4 border-t border-white/5 max-w-lg"
            >
              <div>
                <span className="block text-2xl font-black text-pizza-gold">10k+</span>
                <span className="text-[10px] text-pizza-subtle uppercase tracking-wider font-semibold">Crusts Served</span>
              </div>
              <div>
                <span className="block text-2xl font-black text-pizza-primary">4.9 ★</span>
                <span className="text-[10px] text-pizza-subtle uppercase tracking-wider font-semibold">Average Rating</span>
              </div>
              <div>
                <span className="block text-2xl font-black text-pizza-basil">30 min</span>
                <span className="text-[10px] text-pizza-subtle uppercase tracking-wider font-semibold">Guaranteed Delivery</span>
              </div>
            </motion.div>
          </div>

          {/* Right Hero: Floating Premium Pizza Illustration */}
          <div className="lg:col-span-5 flex justify-center items-center relative">
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="w-72 h-72 md:w-96 md:h-96 bg-gradient-to-tr from-pizza-primary/20 to-pizza-gold/20 rounded-full flex items-center justify-center p-10 border border-white/10 relative shadow-premium-hover"
            >
              <div className="absolute inset-4 rounded-full bg-[#1A120F] flex items-center justify-center border border-white/5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-56 h-56 md:w-76 md:h-76 transform rotate-[-15deg]">
                  <path d="M 50 85 A 35 35 0 0 1 19.14 32.5 L 50 15 Z" fill="#FFB627" />
                  <path d="M 50 80 A 30 30 0 0 1 23.64 35 L 50 20 Z" fill="#FFD54F" />
                  <circle cx="38" cy="45" r="5.5" fill="#FF4D4D" />
                  <circle cx="45" cy="65" r="4.5" fill="#FF4D4D" />
                  <circle cx="32" cy="60" r="5" fill="#FF4D4D" />
                  <circle cx="55" cy="55" r="5.5" fill="#FF4D4D" />
                  <path d="M 45 35 Q 48 32 45 30 Q 42 32 45 35 Z" fill="#35C26B" />
                  <path d="M 28 48 Q 31 45 28 43 Q 25 45 28 48 Z" fill="#35C26B" />
                  <ellipse cx="45" cy="52" rx="2" ry="4" fill="#FFB627" transform="rotate(-30 45 52)" />
                </svg>
              </div>
              <div className="absolute -top-4 -right-4 bg-pizza-secondary text-white font-black text-[10px] tracking-widest uppercase p-2 px-3.5 rounded-2xl border border-white/15 shadow-glow rotate-[15deg]">
                🔥 HOT & FRESH
              </div>
              <div className="absolute -bottom-4 -left-4 bg-[#1A120F] text-pizza-gold font-bold text-[10px] tracking-widest uppercase p-2 px-3.5 rounded-2xl border border-pizza-gold/20 shadow-premium flex items-center gap-1">
                <ChefHat className="w-3.5 h-3.5 text-pizza-gold" />
                <span>Woodfired Sourdough</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ==================================================
            2. CHEF'S SPECIALS / PROMOTIONS BANNER
           ================================================== */}
        <section className="bg-[#1A120F] border border-white/5 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden shadow-premium">
          <div className="absolute top-0 right-0 w-64 h-64 bg-pizza-primary/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8 space-y-4">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-pizza-gold/10 border border-pizza-gold/20 text-[10px] font-black uppercase text-pizza-gold tracking-widest">
                <Award className="w-3 h-3" />
                <span>Chef's Choice Recipe</span>
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white font-sans">
                Signature Truffle Pesto Mushroom
              </h2>
              <p className="text-sm text-pizza-gray leading-relaxed max-w-xl">
                Slow-simmered pesto basil paste, earthy white mushrooms, tangy Greek feta chunks, freshly handpicked baby spinach, and premium dark truffle olive oil splash.
              </p>
              <div className="flex gap-4 pt-2">
                <span className="text-2xl font-black text-pizza-primary">₹599</span>
                <span className="text-xs text-pizza-subtle line-through pt-2">₹749</span>
              </div>
            </div>
            <div className="md:col-span-4 flex justify-end">
              <button 
                onClick={() => navigate('/customizer?pizzaId=default')}
                className="w-full md:w-auto px-8 py-4 bg-pizza-primary hover:bg-pizza-primary/90 text-white font-black text-xs uppercase tracking-wider rounded-2xl transition-all shadow-glow flex items-center justify-center gap-2"
              >
                <span>Order Special</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* ==================================================
            3. PRODUCT CATALOG SEARCH & FILTER CONTROLS
           ================================================== */}
        <div id="catalog-section" className="space-y-8 scroll-mt-24">
          <div className="flex flex-col md:flex-row gap-6 justify-between items-center border-b border-white/5 pb-6">
            <div className="space-y-1.5 text-center md:text-left">
              <h3 className="text-3xl font-extrabold tracking-tight text-white font-sans">
                Our Signature Gourmet Menu
              </h3>
              <p className="text-xs text-pizza-subtle max-w-md">
                Select your base blueprint card or click customize to build your absolute fantasy combination.
              </p>
            </div>

            {/* Glowing Search Bar */}
            <div className="relative w-full md:max-w-sm">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-pizza-subtle" />
              <input
                type="text"
                placeholder="Search recipe catalog..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#1A120F] border border-white/10 rounded-2xl focus:border-pizza-primary focus:ring-1 focus:ring-pizza-primary outline-none transition-all duration-300 text-sm placeholder:text-pizza-subtle text-white shadow-premium"
              />
            </div>
          </div>

          {/* Premium Category Filters */}
          <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none justify-start md:justify-center">
            {[
              { id: 'all', label: 'All Crusts', icon: <UtensilsCrossed className="w-3.5 h-3.5" /> },
              { id: 'veg', label: '🟢 Veg Only', icon: <Leaf className="w-3.5 h-3.5 text-pizza-basil" /> },
              { id: 'non-veg', label: '🔴 Meat Lovers', icon: <Flame className="w-3.5 h-3.5 text-pizza-secondary" /> },
              { id: 'gourmet', label: '⭐ Gourmet Signature', icon: <Sparkles className="w-3.5 h-3.5 text-pizza-gold" /> }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-5 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-300 border flex items-center gap-2 ${
                  selectedCategory === cat.id 
                    ? 'bg-pizza-primary border-pizza-primary text-white shadow-glow' 
                    : 'bg-[#1A120F] border-white/5 text-pizza-gray hover:text-white hover:bg-pizza-charcoal'
                }`}
              >
                {cat.icon}
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-6 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-3xl flex items-center gap-4 max-w-md mx-auto">
            <AlertTriangle className="w-8 h-8 shrink-0 text-rose-400 animate-bounce" />
            <div>
              <span className="font-bold text-sm block">Database Query Failed</span>
              <span className="text-xs">{error}</span>
            </div>
          </div>
        )}

        {/* ==================================================
            4. PRODUCTS GRID (HIGHLY MODERN GOURMET CARDS)
           ================================================== */}
        {loading ? (
          // Skeletons
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((idx) => (
              <div key={idx} className="bg-[#1A120F] rounded-3xl p-6 border border-white/5 space-y-4 animate-pulse">
                <div className="w-full h-48 bg-pizza-charcoal rounded-2xl" />
                <div className="h-6 bg-pizza-charcoal rounded-md w-2/3" />
                <div className="h-4 bg-pizza-charcoal rounded-md w-full" />
                <div className="pt-4 flex justify-between items-center border-t border-white/5">
                  <div className="h-6 bg-pizza-charcoal rounded-md w-1/4" />
                  <div className="h-10 bg-pizza-charcoal rounded-xl w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredPizzas.length === 0 ? (
          <div className="text-center py-20 bg-[#1A120F] rounded-3xl border border-dashed border-white/10">
            <p className="text-pizza-gray text-sm">No recipes match your criteria. Try adjusting filters or searches.</p>
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredPizzas.map((pizza) => {
              const rating = getRating(pizza.name);
              const prepTime = getPrepTime(pizza.name);
              const isFav = favorites.includes(pizza._id);

              return (
                <motion.div 
                  key={pizza._id}
                  variants={itemVariants}
                  whileHover={{ y: -8 }}
                  className="bg-[#1A120F] rounded-[2rem] p-6 border border-white/5 hover:border-pizza-primary/20 hover:shadow-premium transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
                >
                  {/* Decorative Glowing Blur on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-pizza-primary/0 to-pizza-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  {/* Topping Category tag & Favorite Heart */}
                  <div className="flex justify-between items-center absolute top-4 left-4 right-4 z-10">
                    <span className={`text-[9px] uppercase font-black tracking-wider px-2.5 py-1 rounded-full ${
                      pizza.category === 'veg' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : pizza.category === 'non-veg' 
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                        : 'bg-amber-500/10 text-pizza-gold border border-amber-500/20'
                    }`}>
                      {pizza.category === 'veg' ? 'Veg' : pizza.category === 'non-veg' ? 'Meat' : 'Signature'}
                    </span>

                    <button 
                      onClick={(e) => toggleFavorite(pizza._id, e)}
                      className="p-2 bg-[#0F0B0A]/60 backdrop-blur-md rounded-full border border-white/10 hover:border-pizza-primary/30 transition-colors"
                    >
                      <Heart className={`w-3.5 h-3.5 transition-colors ${isFav ? 'fill-pizza-primary text-pizza-primary' : 'text-pizza-gray'}`} />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Handcrafted Visual Illustration Area */}
                    <div className="w-full h-44 bg-[#0F0B0A] rounded-2xl flex items-center justify-center p-6 border border-white/5 relative overflow-hidden group-hover:bg-[#1A120F] transition-colors duration-300">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 100 100" 
                        className="w-28 h-28 transform group-hover:rotate-12 transition-transform duration-500 drop-shadow-lg"
                      >
                        <path d="M 50 85 A 35 35 0 0 1 19.14 32.5 L 50 15 Z" fill="#FFB627" />
                        <path d="M 50 80 A 30 30 0 0 1 23.64 35 L 50 20 Z" fill="#FFD54F" />
                        {pizza.category === 'veg' ? (
                          <>
                            <circle cx="38" cy="45" r="4.5" fill="#35C26B" />
                            <circle cx="45" cy="65" r="4" fill="#FF6B35" />
                            <circle cx="32" cy="60" r="3.5" fill="#35C26B" />
                          </>
                        ) : (
                          <>
                            <circle cx="38" cy="45" r="5" fill="#FF4D4D" />
                            <circle cx="45" cy="65" r="4.5" fill="#FF4D4D" />
                            <circle cx="32" cy="60" r="4" fill="#FF4D4D" />
                          </>
                        )}
                        <path d="M 45 35 Q 48 32 45 30 Q 42 32 45 35 Z" fill="#35C26B" />
                        <path d="M 28 48 Q 31 45 28 43 Q 25 45 28 48 Z" fill="#35C26B" />
                      </svg>
                      
                      {/* Interactive visual tags inside the preview */}
                      <span className="absolute bottom-2.5 right-2.5 text-[9px] bg-pizza-charcoal px-2 py-0.5 rounded-md border border-white/5 text-pizza-gray flex items-center gap-1 font-bold">
                        <Clock className="w-2.5 h-2.5 text-pizza-gold" />
                        <span>{prepTime}</span>
                      </span>
                    </div>

                    {/* Product Typography & Badges */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="font-extrabold text-lg text-white group-hover:text-pizza-primary transition-colors font-sans">
                          {pizza.name}
                        </h4>
                        <div className="flex items-center gap-1 text-xs">
                          <Star className="w-3.5 h-3.5 fill-pizza-gold text-pizza-gold" />
                          <span className="font-black text-white">{rating.score}</span>
                          <span className="text-[10px] text-pizza-subtle">({rating.count})</span>
                        </div>
                      </div>
                      <p className="text-xs text-pizza-gray leading-relaxed min-h-10">{pizza.description}</p>
                    </div>

                    {/* Ingredient Chips (Making card feel ALIVE) */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="text-[9px] font-semibold bg-pizza-charcoal text-pizza-gray px-2 py-0.5 rounded-full">
                        Thin Crust
                      </span>
                      <span className="text-[9px] font-semibold bg-pizza-charcoal text-pizza-gray px-2 py-0.5 rounded-full">
                        Marinara Sauce
                      </span>
                      <span className="text-[9px] font-semibold bg-pizza-charcoal text-pizza-gray px-2 py-0.5 rounded-full">
                        Mozzarella
                      </span>
                    </div>
                  </div>

                  {/* Pricing and Action CTAs */}
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-5">
                    <div>
                      <span className="block text-[9px] text-pizza-subtle uppercase font-semibold">Starting at</span>
                      <span className="text-2xl font-black text-pizza-gold">₹{pizza.price}</span>
                    </div>

                    <div className="flex gap-2">
                      {pizza.isCustomizable ? (
                        <button
                          onClick={() => navigate(`/customizer?pizzaId=${pizza._id}`)}
                          className="px-4 py-2.5 bg-pizza-primary hover:bg-pizza-primary/90 hover:shadow-glow text-white font-black rounded-xl text-xs transition-all duration-300 flex items-center gap-1.5 uppercase tracking-wide"
                        >
                          <SlidersHorizontal className="w-3.5 h-3.5" />
                          <span>Customize</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleQuickAdd(pizza)}
                          className="px-4 py-2.5 bg-pizza-charcoal hover:bg-pizza-charcoal/80 text-white font-black rounded-xl text-xs transition-all duration-300 flex items-center gap-1.5 uppercase tracking-wide"
                        >
                          <ShoppingCart className="w-3.5 h-3.5 text-pizza-gold" />
                          <span>Quick Add</span>
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* ==================================================
            5. STATISTICS / WHY US SECTION
           ================================================== */}
        <section className="py-12 border-t border-b border-white/5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="w-12 h-12 bg-pizza-primary/10 border border-pizza-primary/20 rounded-full flex items-center justify-center mx-auto text-pizza-primary">
                <ChefHat className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-base text-white font-sans">Artisanal Sourdough</h4>
              <p className="text-xs text-pizza-subtle">Slow fermented for 48 hours for ultimate bubbly textures.</p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 bg-pizza-gold/10 border border-pizza-gold/20 rounded-full flex items-center justify-center mx-auto text-pizza-gold">
                <Flame className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-base text-white font-sans">450°C Woodfire Deck</h4>
              <p className="text-xs text-pizza-subtle">Cooked to absolute blistered leoparding spots in 90 seconds.</p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 bg-pizza-basil/10 border border-pizza-basil/20 rounded-full flex items-center justify-center mx-auto text-pizza-basil">
                <Leaf className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-base text-white font-sans">100% Fresh Toppings</h4>
              <p className="text-xs text-pizza-subtle">Hand-selected fresh garden produce and cured imports.</p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 bg-pizza-secondary/10 border border-pizza-secondary/20 rounded-full flex items-center justify-center mx-auto text-pizza-secondary">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-base text-white font-sans">Strict Safety Standards</h4>
              <p className="text-xs text-pizza-subtle">Double sealed eco-packaging with zero human contact delivery.</p>
            </div>
          </div>
        </section>

        {/* ==================================================
            6. TESTIMONIALS SLIDER SECTION
           ================================================== */}
        <section className="space-y-8 text-center max-w-4xl mx-auto">
          <div className="space-y-2">
            <span className="text-[10px] font-black text-pizza-primary uppercase tracking-widest block">FEEDBACKS</span>
            <h3 className="text-3xl font-extrabold text-white font-sans">What Gourmet Food Lovers Say</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#1A120F] border border-white/5 p-8 rounded-3xl text-left space-y-4 shadow-premium">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-pizza-gold text-pizza-gold" />)}
              </div>
              <p className="text-xs italic text-pizza-gray leading-relaxed">
                "The Live Customizer in Crustiva is phenomenal! I could visually add toppings layer by layer and order a personal thin crust cheese burst that arrived blazing hot. Truly elite UI/UX experience!"
              </p>
              <div>
                <span className="block font-extrabold text-xs text-white">Ananya Sen</span>
                <span className="text-[9px] text-pizza-subtle">Verified Food Blogger</span>
              </div>
            </div>

            <div className="bg-[#1A120F] border border-white/5 p-8 rounded-3xl text-left space-y-4 shadow-premium">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-pizza-gold text-pizza-gold" />)}
              </div>
              <p className="text-xs italic text-pizza-gray leading-relaxed">
                "Crustiva has changed the game in pizza delivery. The level of transparency in ingredient stocks, gorgeous microinteractions, and rapid doorstep delivery makes it my absolute go-to startup product!"
              </p>
              <div>
                <span className="block font-extrabold text-xs text-white">Vikram Malhotra</span>
                <span className="text-[9px] text-pizza-subtle">Startup Founder</span>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
