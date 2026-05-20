import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useCart } from '../context/CartContext';
import { Search, SlidersHorizontal, Eye, ShoppingCart, Sparkles, AlertTriangle } from 'lucide-react';

export default function HomeDashboard() {
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { addToCart } = useCart();
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

  // Filtering Logic
  const filteredPizzas = pizzas.filter((pizza) => {
    const matchesSearch = pizza.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          pizza.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || pizza.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleQuickAdd = (pizza) => {
    // Add default baseline configuration
    const defaultCustomization = {
      base: 'Thin Crust',
      sauce: 'Classic Marinara Sauce',
      cheese: 'Mozzarella Cheese',
      veggies: [],
      meat: [],
    };
    addToCart(pizza, defaultCustomization, 'Medium', 1);
    
    // Quick redirect to cart or show alert
    navigate('/cart');
  };

  return (
    <div class="min-h-screen bg-pizza-dark text-white py-12 px-6 relative overflow-hidden">
      {/* Decorative blurs */}
      <div class="absolute -right-24 -top-24 w-96 h-96 bg-pizza-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div class="absolute -left-24 -bottom-24 w-96 h-96 bg-pizza-accent/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div class="max-w-7xl mx-auto space-y-10 z-10 relative">
        {/* Banner area */}
        <div class="text-center space-y-3 max-w-2xl mx-auto">
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pizza-primary/10 border border-pizza-primary/20 text-xs font-semibold text-pizza-primary">
            <Sparkles class="w-3.5 h-3.5" />
            <span>Gourmet Pizzeria Dashboard</span>
          </div>
          <h2 class="text-4xl lg:text-5xl font-extrabold tracking-tight">Craft Your Pizza Masterpiece</h2>
          <p class="text-sm text-white/50 leading-relaxed">
            Select one of our baseline house recipes or choose the Customizer to select your preferred dough, rich slow-simmered sauces, and fresh toppings.
          </p>
        </div>

        {/* Filter controls */}
        <div class="glass-dark p-4 rounded-2xl border border-white/5 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div class="relative w-full md:max-w-sm">
            <Search class="w-4 h-4 absolute left-3.5 top-3.5 text-white/40" />
            <input
              type="text"
              placeholder="Search recipes (Margherita, Farmhouse...)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              class="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:border-pizza-primary focus:ring-1 focus:ring-pizza-primary outline-none transition-all duration-300 text-sm placeholder:text-white/20"
            />
          </div>

          <div class="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            {['all', 'veg', 'non-veg', 'gourmet'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                class={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-300 border ${
                  selectedCategory === cat 
                    ? 'bg-pizza-primary border-pizza-primary text-white shadow-glow' 
                    : 'bg-white/5 border-white/5 text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                {cat === 'all' ? 'All Recipes' : cat === 'veg' ? '🟢 Veg Only' : cat === 'non-veg' ? '🔴 Meat Lovers' : '⭐ Gourmet Premium'}
              </button>
            ))}
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div class="p-6 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-3xl flex items-center gap-4 max-w-md mx-auto">
            <AlertTriangle class="w-8 h-8 shrink-0 text-rose-400 animate-bounce" />
            <div>
              <span class="font-bold text-sm block">Database Query Failed</span>
              <span class="text-xs">{error}</span>
            </div>
          </div>
        )}

        {/* Cards Catalog */}
        {loading ? (
          // Loading Skeletons
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5].map((idx) => (
              <div key={idx} class="glass-dark rounded-3xl p-6 border border-white/5 space-y-4 animate-pulse">
                <div class="w-full h-44 bg-white/5 rounded-2xl"></div>
                <div class="h-6 bg-white/5 rounded-md w-2/3"></div>
                <div class="h-4 bg-white/5 rounded-md w-full"></div>
                <div class="h-4 bg-white/5 rounded-md w-5/6"></div>
                <div class="pt-4 flex justify-between items-center border-t border-white/5">
                  <div class="h-6 bg-white/5 rounded-md w-1/4"></div>
                  <div class="h-10 bg-white/5 rounded-xl w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredPizzas.length === 0 ? (
          <div class="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
            <p class="text-white/40 text-sm">No recipes match your criteria. Try adjusting filters or searches.</p>
          </div>
        ) : (
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPizzas.map((pizza) => (
              <div 
                key={pizza._id} 
                class="glass-dark rounded-3xl p-6 border border-white/5 hover:border-pizza-primary/20 hover:shadow-premium transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Topping Category tag */}
                <span class={`absolute right-4 top-4 text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full ${
                  pizza.category === 'veg' 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                    : pizza.category === 'non-veg' 
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                    : 'bg-amber-500/10 text-pizza-accent border border-amber-500/20'
                }`}>
                  {pizza.category === 'veg' ? 'Veg' : pizza.category === 'non-veg' ? 'Non-Veg' : 'Gourmet'}
                </span>

                <div class="space-y-4">
                  {/* Decorative SVG Graphic Icon wrapper */}
                  <div class="w-full h-44 bg-[#231e1a] rounded-2xl flex items-center justify-center p-6 border border-white/5 relative overflow-hidden group-hover:bg-[#2c2621] transition-colors duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="w-28 h-28 transform group-hover:rotate-12 transition-transform duration-500">
                      {/* Crust outer layer */}
                      <path d="M 50 85 A 35 35 0 0 1 19.14 32.5 L 50 15 Z" fill="#FFB74D" />
                      {/* Cheese base */}
                      <path d="M 50 80 A 30 30 0 0 1 23.64 35 L 50 20 Z" fill="#FFD54F" />
                      {/* Veg pepperonis */}
                      {pizza.category === 'veg' ? (
                        <>
                          <circle cx="38" cy="45" r="4" fill="#4CAF50" />
                          <circle cx="45" cy="65" r="4" fill="#E65100" />
                          <circle cx="32" cy="60" r="3.5" fill="#4CAF50" />
                        </>
                      ) : (
                        <>
                          <circle cx="38" cy="45" r="5" fill="#C62828" />
                          <circle cx="45" cy="65" r="4.5" fill="#C62828" />
                          <circle cx="32" cy="60" r="4" fill="#C62828" />
                        </>
                      )}
                      <path d="M 45 35 Q 48 32 45 30 Q 42 32 45 35 Z" fill="#2E7D32" />
                      <path d="M 28 48 Q 31 45 28 43 Q 25 45 28 48 Z" fill="#2E7D32" />
                    </svg>
                  </div>

                  <div class="space-y-1.5">
                    <h4 class="font-extrabold text-xl group-hover:text-pizza-primary transition-colors duration-300">{pizza.name}</h4>
                    <p class="text-xs text-white/50 leading-relaxed min-h-12">{pizza.description}</p>
                  </div>
                </div>

                <div class="pt-6 border-t border-white/5 flex items-center justify-between mt-6">
                  <div>
                    <span class="block text-[10px] text-white/40 uppercase font-semibold">Starting at</span>
                    <span class="text-2xl font-black text-pizza-accent">₹{pizza.price}</span>
                  </div>

                  <div class="flex gap-2">
                    {/* If customizable, route directly to Customizer Page */}
                    {pizza.isCustomizable ? (
                      <button
                        onClick={() => navigate(`/customizer?pizzaId=${pizza._id}`)}
                        class="px-4 py-2.5 bg-pizza-primary hover:bg-pizza-primary/95 hover:shadow-glow text-white font-bold rounded-xl text-xs transition-all duration-300 flex items-center gap-1.5"
                      >
                        <SlidersHorizontal class="w-3.5 h-3.5" />
                        <span>Customize</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleQuickAdd(pizza)}
                        class="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs transition-all duration-300 flex items-center gap-1.5"
                      >
                        <ShoppingCart class="w-3.5 h-3.5" />
                        <span>Add Quick</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
