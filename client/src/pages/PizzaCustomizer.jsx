import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { useCart } from '../context/CartContext';
import { ChevronLeft, Info, HelpCircle, AlertCircle, ShoppingBag, Check } from 'lucide-react';

export default function PizzaCustomizer() {
  const [searchParams] = useSearchParams();
  const pizzaId = searchParams.get('pizzaId');
  
  const [pizza, setPizza] = useState(null);
  const [options, setOptions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Customizer State Selection
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
        // Fetch specific pizza
        const pRes = await API.get('/api/pizzas');
        const activePizza = pRes.data.data.find(p => p._id === pizzaId);
        if (!activePizza) {
          setError('Pizza recipe not found.');
          setLoading(false);
          return;
        }
        setPizza(activePizza);

        // Fetch customizable options
        const oRes = await API.get('/api/pizzas/customizer-options');
        const opts = oRes.data.data;
        setOptions(opts);

        // Prepopulate default items (choosing first item in stock)
        const defaultBase = opts.bases.find(b => b.stock > 0)?.name || opts.bases[0]?.name;
        const defaultSauce = opts.sauces.find(s => s.stock > 0)?.name || opts.sauces[0]?.name;
        const defaultCheese = opts.cheeses.find(c => c.stock > 0)?.name || opts.cheeses[0]?.name;

        setSelectedBase(defaultBase);
        setSelectedSauce(defaultSauce);
        setSelectedCheese(defaultCheese);
      } catch (err) {
        console.error('❌ Customizer boot failed:', err.message);
        setError('Failed to load customizer resources. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (pizzaId) {
      fetchData();
    } else {
      setError('Invalid Customizer launch parameter.');
      setLoading(false);
    }
  }, [pizzaId]);

  // Compute live price
  const calculateCurrentPrice = () => {
    if (!pizza || !options) return 0;
    
    let total = pizza.price; // baseline pizza price

    // Add size flat rate additions
    if (selectedSize === 'Medium') total += 60;
    if (selectedSize === 'Large') total += 120;

    // Add customized base, sauce, cheese premiums
    const baseOpt = options.bases.find(o => o.name === selectedBase);
    const sauceOpt = options.sauces.find(o => o.name === selectedSauce);
    const cheeseOpt = options.cheeses.find(o => o.name === selectedCheese);

    if (baseOpt) total += baseOpt.unitPrice;
    if (sauceOpt) total += sauceOpt.unitPrice;
    if (cheeseOpt) total += cheeseOpt.unitPrice;

    // Add veggie premiums
    selectedVeggies.forEach(vName => {
      const opt = options.veggies.find(o => o.name === vName);
      if (opt) total += opt.unitPrice;
    });

    // Add meat premiums
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
      alert('Please select dough base, sauce, and cheese selections.');
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

    // We add to cart utilizing our custom calculated dynamic price!
    // This feeds the cart with exact topping math totals.
    addToCart({ ...pizza, price: dynamicPrice }, customization, selectedSize, quantity);
    navigate('/cart');
  };

  if (loading) {
    return (
      <div class="min-h-screen flex items-center justify-center bg-pizza-dark text-white">
        <div class="w-12 h-12 border-4 border-pizza-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div class="min-h-[80vh] flex flex-col items-center justify-center bg-pizza-dark text-white space-y-4 px-6 text-center">
        <AlertCircle class="w-16 h-16 text-rose-500" />
        <h3 class="text-2xl font-bold">Customizer Error</h3>
        <p class="text-sm text-white/50 max-w-sm">{error}</p>
        <Link to="/" class="px-6 py-3 bg-pizza-primary text-white font-bold rounded-xl text-xs">Return to Dashboard</Link>
      </div>
    );
  }

  const currentItemPrice = calculateCurrentPrice();

  return (
    <div class="min-h-screen bg-pizza-dark text-white py-12 px-6 relative overflow-hidden">
      <div class="absolute -right-24 -top-24 w-96 h-96 bg-pizza-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div class="absolute -left-24 -bottom-24 w-96 h-96 bg-pizza-accent/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div class="max-w-6xl mx-auto space-y-8 z-10 relative">
        <Link to="/" class="inline-flex items-center gap-1.5 text-xs text-white/60 hover:text-white transition-colors">
          <ChevronLeft class="w-4 h-4" />
          <span>Back to Catalog</span>
        </Link>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Area: Visual Pizza Preview & Specs */}
          <div class="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            <div class="glass-dark p-6 rounded-[2.5rem] border border-white/5 shadow-premium text-center space-y-6">
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pizza-accent/10 border border-pizza-accent/20 text-xs font-semibold text-pizza-accent">
                <Info class="w-3.5 h-3.5" />
                <span>Base Recipe: {pizza.name}</span>
              </span>

              <div class="w-64 h-64 bg-[#231e1a] rounded-full flex items-center justify-center p-8 mx-auto border border-white/5 relative shadow-premium">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="w-48 h-48 animate-spin-slow">
                  <path d="M 50 85 A 35 35 0 0 1 19.14 32.5 L 50 15 Z" fill="#FFB74D" />
                  <path d="M 50 80 A 30 30 0 0 1 23.64 35 L 50 20 Z" fill="#FFD54F" />
                  
                  {/* Visual bases representation */}
                  {selectedBase === 'Cheese Burst Crust' && (
                    <circle cx="50" cy="50" r="28" fill="none" stroke="#FFC107" stroke-width="3" stroke-dasharray="4,4" />
                  )}
                  {/* Visual toppings representation */}
                  {selectedVeggies.includes('Sliced Mushrooms') && <circle cx="38" cy="45" r="4.5" fill="#A1887F" />}
                  {selectedVeggies.includes('Sweet Corn') && <circle cx="45" cy="65" r="3" fill="#FFEE58" />}
                  {selectedVeggies.includes('Crisp Capsicum') && <circle cx="32" cy="60" r="4" fill="#66BB6A" />}
                  {selectedMeats.includes('Spicy Pepperoni') && <circle cx="55" cy="55" r="5" fill="#EF5350" />}
                  {selectedMeats.includes('Smoked Chicken Tikka') && <circle cx="42" cy="50" r="4" fill="#D84315" />}
                </svg>
              </div>

              <div class="space-y-2">
                <h3 class="text-2xl font-black">{pizza.name}</h3>
                <p class="text-xs text-white/50 leading-relaxed px-4">{pizza.description}</p>
              </div>

              <div class="pt-6 border-t border-white/5 flex items-center justify-between px-4">
                <div class="text-left">
                  <span class="block text-[10px] text-white/40 uppercase font-semibold">Dynamic Total Price</span>
                  <span class="text-3xl font-black text-pizza-accent">₹{currentItemPrice * quantity}</span>
                </div>

                <div class="flex items-center bg-white/5 border border-white/10 rounded-xl px-2 py-1">
                  <button 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    class="w-8 h-8 flex items-center justify-center font-bold text-white/60 hover:text-white"
                  >
                    -
                  </button>
                  <span class="w-8 text-center text-sm font-extrabold">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(q => q + 1)}
                    class="w-8 h-8 flex items-center justify-center font-bold text-white/60 hover:text-white"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                class="w-full py-4 bg-gradient-to-r from-pizza-primary to-pizza-secondary hover:shadow-glow text-white font-bold rounded-2xl text-sm transition-all duration-300 flex items-center justify-center gap-2"
              >
                <ShoppingBag class="w-4.5 h-4.5" />
                <span>Add Customized Pizza to Cart</span>
              </button>
            </div>
          </div>

          {/* Right Area: Toppings Picker Panels */}
          <div class="lg:col-span-7 space-y-6">
            {/* 1. Size Picker */}
            <div class="glass-dark p-6 rounded-3xl border border-white/5 space-y-4">
              <h4 class="font-bold text-lg text-pizza-primary flex items-center gap-2">
                <span class="text-xs bg-pizza-primary/10 px-2.5 py-1 rounded-full">1</span>
                <span>Choose Size</span>
              </h4>
              <div class="grid grid-cols-3 gap-4">
                {[
                  { name: 'Small', details: 'Personal (6")', extra: '₹0' },
                  { name: 'Medium', details: 'Recommended (10")', extra: '+₹60' },
                  { name: 'Large', details: 'Family (12")', extra: '+₹120' }
                ].map(s => (
                  <button
                    key={s.name}
                    onClick={() => setSelectedSize(s.name)}
                    class={`p-4 rounded-2xl border text-center transition-all duration-300 ${
                      selectedSize === s.name 
                        ? 'bg-pizza-primary/10 border-pizza-primary text-white' 
                        : 'bg-white/5 border-white/5 text-white/50 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span class="block font-bold text-sm">{s.name}</span>
                    <span class="block text-[10px] text-white/40 mt-1">{s.details}</span>
                    <span class="block text-xs font-semibold text-pizza-accent mt-2">{s.extra}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Base Selection */}
            <div class="glass-dark p-6 rounded-3xl border border-white/5 space-y-4">
              <h4 class="font-bold text-lg text-pizza-primary flex items-center gap-2">
                <span class="text-xs bg-pizza-primary/10 px-2.5 py-1 rounded-full">2</span>
                <span>Select Pizza Base</span>
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                {options.bases.map(b => {
                  const isOutOfStock = b.stock <= 0;
                  return (
                    <button
                      key={b.name}
                      disabled={isOutOfStock}
                      onClick={() => setSelectedBase(b.name)}
                      class={`p-4 rounded-2xl border text-left flex justify-between items-center transition-all duration-300 ${
                        isOutOfStock 
                          ? 'opacity-40 cursor-not-allowed bg-white/5 border-transparent'
                          : selectedBase === b.name 
                          ? 'bg-pizza-primary/10 border-pizza-primary text-white' 
                          : 'bg-white/5 border-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <div>
                        <span class="font-bold text-sm block">{b.name}</span>
                        <span class="text-[10px] text-white/40 block mt-0.5">Topping Premium: +₹{b.unitPrice}</span>
                      </div>
                      <span class="text-xs font-bold text-pizza-accent">
                        {isOutOfStock ? 'Sold Out' : selectedBase === b.name ? <Check class="w-4 h-4 text-pizza-primary" /> : ''}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Sauce Selection */}
            <div class="glass-dark p-6 rounded-3xl border border-white/5 space-y-4">
              <h4 class="font-bold text-lg text-pizza-primary flex items-center gap-2">
                <span class="text-xs bg-pizza-primary/10 px-2.5 py-1 rounded-full">3</span>
                <span>Select Sauce</span>
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                {options.sauces.map(s => {
                  const isOutOfStock = s.stock <= 0;
                  return (
                    <button
                      key={s.name}
                      disabled={isOutOfStock}
                      onClick={() => setSelectedSauce(s.name)}
                      class={`p-4 rounded-2xl border text-left flex justify-between items-center transition-all duration-300 ${
                        isOutOfStock 
                          ? 'opacity-40 cursor-not-allowed bg-white/5 border-transparent'
                          : selectedSauce === s.name 
                          ? 'bg-pizza-primary/10 border-pizza-primary text-white' 
                          : 'bg-white/5 border-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <div>
                        <span class="font-bold text-sm block">{s.name}</span>
                        <span class="text-[10px] text-white/40 block mt-0.5">Topping Premium: +₹{s.unitPrice}</span>
                      </div>
                      <span class="text-xs font-bold text-pizza-accent">
                        {isOutOfStock ? 'Sold Out' : selectedSauce === s.name ? <Check class="w-4 h-4 text-pizza-primary" /> : ''}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Cheese Selection */}
            <div class="glass-dark p-6 rounded-3xl border border-white/5 space-y-4">
              <h4 class="font-bold text-lg text-pizza-primary flex items-center gap-2">
                <span class="text-xs bg-pizza-primary/10 px-2.5 py-1 rounded-full">4</span>
                <span>Choose Cheese</span>
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                {options.cheeses.map(c => {
                  const isOutOfStock = c.stock <= 0;
                  return (
                    <button
                      key={c.name}
                      disabled={isOutOfStock}
                      onClick={() => setSelectedCheese(c.name)}
                      class={`p-4 rounded-2xl border text-left flex justify-between items-center transition-all duration-300 ${
                        isOutOfStock 
                          ? 'opacity-40 cursor-not-allowed bg-white/5 border-transparent'
                          : selectedCheese === c.name 
                          ? 'bg-pizza-primary/10 border-pizza-primary text-white' 
                          : 'bg-white/5 border-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <div>
                        <span class="font-bold text-sm block">{c.name}</span>
                        <span class="text-[10px] text-white/40 block mt-0.5">Topping Premium: +₹{c.unitPrice}</span>
                      </div>
                      <span class="text-xs font-bold text-pizza-accent">
                        {isOutOfStock ? 'Sold Out' : selectedCheese === c.name ? <Check class="w-4 h-4 text-pizza-primary" /> : ''}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5. Veggie Customizer Checkboxes */}
            <div class="glass-dark p-6 rounded-3xl border border-white/5 space-y-4">
              <h4 class="font-bold text-lg text-pizza-primary flex items-center gap-2">
                <span class="text-xs bg-pizza-primary/10 px-2.5 py-1 rounded-full">5</span>
                <span>Select Veggie Toppings</span>
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                {options.veggies.map(v => {
                  const isOutOfStock = v.stock <= 0;
                  const isSelected = selectedVeggies.includes(v.name);
                  return (
                    <button
                      key={v.name}
                      disabled={isOutOfStock}
                      onClick={() => handleVeggieToggle(v.name)}
                      class={`p-4 rounded-2xl border text-left flex justify-between items-center transition-all duration-300 ${
                        isOutOfStock 
                          ? 'opacity-40 cursor-not-allowed bg-white/5 border-transparent'
                          : isSelected 
                          ? 'bg-pizza-primary/10 border-pizza-primary text-white' 
                          : 'bg-white/5 border-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <div>
                        <span class="font-bold text-sm block">{v.name}</span>
                        <span class="text-[10px] text-white/40 block mt-0.5">Topping Premium: +₹{v.unitPrice}</span>
                      </div>
                      <span class="text-xs font-bold text-pizza-accent">
                        {isOutOfStock ? 'Sold Out' : isSelected ? <Check class="w-4 h-4 text-pizza-primary" /> : '+ Add'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 6. Meat Toppings Pickers */}
            <div class="glass-dark p-6 rounded-3xl border border-white/5 space-y-4">
              <h4 class="font-bold text-lg text-pizza-primary flex items-center gap-2">
                <span class="text-xs bg-pizza-primary/10 px-2.5 py-1 rounded-full">6</span>
                <span>Select Meat Toppings (Optional)</span>
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                {options.meats.map(m => {
                  const isOutOfStock = m.stock <= 0;
                  const isSelected = selectedMeats.includes(m.name);
                  return (
                    <button
                      key={m.name}
                      disabled={isOutOfStock}
                      onClick={() => handleMeatToggle(m.name)}
                      class={`p-4 rounded-2xl border text-left flex justify-between items-center transition-all duration-300 ${
                        isOutOfStock 
                          ? 'opacity-40 cursor-not-allowed bg-white/5 border-transparent'
                          : isSelected 
                          ? 'bg-pizza-primary/10 border-pizza-primary text-white' 
                          : 'bg-white/5 border-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <div>
                        <span class="font-bold text-sm block">{m.name}</span>
                        <span class="text-[10px] text-white/40 block mt-0.5">Topping Premium: +₹{m.unitPrice}</span>
                      </div>
                      <span class="text-xs font-bold text-pizza-accent">
                        {isOutOfStock ? 'Sold Out' : isSelected ? <Check class="w-4 h-4 text-pizza-primary" /> : '+ Add'}
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
