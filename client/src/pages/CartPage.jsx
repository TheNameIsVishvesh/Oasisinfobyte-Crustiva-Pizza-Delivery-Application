import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { Trash2, CreditCard, ShoppingBag, MapPin, Phone, AlertTriangle, CheckCircle2, Lock, Key, ShieldCheck, Sparkles } from 'lucide-react';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const { user, isAuthenticated } = useAuth();
  
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryPhone, setDeliveryPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  // Load Razorpay Standard Checkout Script Utility
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (cart.length === 0) {
      setError('Your shopping cart is empty.');
      return;
    }

    if (!deliveryAddress || !deliveryPhone) {
      setError('Please provide your complete delivery address and phone contact.');
      return;
    }

    setLoading(true);

    try {
      // 1. Load Razorpay script dynamically
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setLoading(false);
        setError('Failed to load Razorpay payment SDK. Check your internet connection.');
        return;
      }

      // 2. Request backend to create transaction order and perform ingredient safety checks
      const orderPayload = {
        items: cart,
        deliveryAddress,
        deliveryPhone,
      };

      const res = await API.post('/api/orders/create-payment', orderPayload);
      const { razorpayOrderId, amount, currency } = res.data.data;

      // 3. Configure Razorpay modal configuration settings
      const options = {
        key: 'rzp_test_placeholder', // Fallback to client standard test mode
        amount,
        currency,
        name: 'Crustiva Gourmet Pizzeria',
        description: `Order checkout for ${user?.name || 'Customer'}`,
        image: '/src/assets/pizza-logo.svg',
        order_id: razorpayOrderId,
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: deliveryPhone,
        },
        notes: {
          address: deliveryAddress,
        },
        theme: {
          color: '#FF6B35', // Brand color matching Crustiva premium orange
        },
        handler: async (response) => {
          setLoading(true);
          try {
            // 4. Submit verification signature payload to backend
            const verifyPayload = {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              items: cart,
              deliveryAddress,
              deliveryPhone,
            };

            const verificationRes = await API.post('/api/orders/verify-payment', verifyPayload);
            
            setSuccess('Payment verified successfully! Creating order...');
            clearCart();
            
            // Navigate directly to live orders status screen
            setTimeout(() => {
              navigate('/orders');
            }, 1500);
          } catch (err) {
            console.error('❌ Verification Endpoint Refused:', err);
            setError(err.response?.data?.message || 'Payment verification failed. Please contact support.');
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            setError('Checkout payment was dismissed by user.');
          },
        },
      };

      const rzpInstance = new window.Razorpay(options);
      rzpInstance.open();
    } catch (err) {
      console.error('❌ Checkout Failed:', err);
      setError(err.response?.data?.message || 'Checkout failed. An ingredient might be sold out.');
      setLoading(false);
    }
  };

  const subtotal = getCartTotal();

  if (cart.length === 0) {
    return (
      <div class="min-h-[80vh] flex flex-col items-center justify-center bg-pizza-dark text-white space-y-6 px-6 text-center">
        <div class="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center text-white/30 border border-white/5">
          <ShoppingBag class="w-10 h-10" />
        </div>
        <div class="space-y-2">
          <h3 class="text-2xl font-black">Your Cart is Empty</h3>
          <p class="text-xs text-white/40 max-w-xs mx-auto">Build your custom dough base, slow-cooked sauce, and gourmet cheeses now!</p>
        </div>
        <Link to="/" class="px-8 py-3.5 bg-gradient-to-r from-pizza-primary to-pizza-secondary text-white font-bold rounded-xl text-xs hover:shadow-glow transition-all duration-300">
          Open Pizza Catalog
        </Link>
      </div>
    );
  }

  return (
    <div class="min-h-screen bg-pizza-dark text-white py-12 px-6 relative overflow-hidden">
      <div class="absolute -right-24 -top-24 w-96 h-96 bg-pizza-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div class="absolute -left-24 -bottom-24 w-96 h-96 bg-pizza-accent/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div class="max-w-6xl mx-auto space-y-8 z-10 relative">
        <h2 class="text-3xl font-extrabold tracking-tight">Your Order Checkout</h2>

        {error && (
          <div class="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl flex items-start gap-3 text-xs leading-relaxed animate-shake">
            <AlertTriangle class="w-5 h-5 shrink-0 text-rose-400" />
            <div>
              <span class="font-bold block">Checkout Blocked</span>
              {error}
            </div>
          </div>
        )}

        {success && (
          <div class="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl flex items-start gap-3 text-xs leading-relaxed">
            <CheckCircle2 class="w-5 h-5 shrink-0 text-emerald-400" />
            <div>
              <span class="font-bold block">Success</span>
              {success}
            </div>
          </div>
        )}

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Cart Items List */}
          <div class="lg:col-span-7 space-y-6">
            <div class="glass-dark p-6 rounded-[2rem] border border-white/5 space-y-6">
              <h3 class="font-bold text-lg border-b border-white/5 pb-4">Itemized Basket</h3>
              <div class="divide-y divide-white/5">
                {cart.map((item) => (
                  <div key={item.cartItemId} class="py-6 flex gap-4 first:pt-0 last:pb-0">
                    <div class="w-20 h-20 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-center p-3">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="w-12 h-12">
                        <path d="M 50 85 A 35 35 0 0 1 19.14 32.5 L 50 15 Z" fill="#FFB74D" />
                        <path d="M 50 80 A 30 30 0 0 1 23.64 35 L 50 20 Z" fill="#FFD54F" />
                      </svg>
                    </div>

                    <div class="flex-1 space-y-2">
                      <div class="flex justify-between items-start">
                        <div>
                          <h4 class="font-bold text-base">{item.name}</h4>
                          <span class="text-xs text-pizza-primary bg-pizza-primary/10 border border-pizza-primary/20 px-2 py-0.5 rounded-full inline-block mt-1 font-bold">
                            Size: {item.size}
                          </span>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.cartItemId)}
                          class="text-white/40 hover:text-rose-500 transition-colors p-1.5 hover:bg-white/5 rounded-lg"
                        >
                          <Trash2 class="w-4 h-4" />
                        </button>
                      </div>

                      <div class="bg-white/5 p-3 rounded-xl border border-white/5 text-[11px] leading-relaxed text-white/60 space-y-1">
                        <p><strong class="text-white/80">Base Dough:</strong> {item.customization.base}</p>
                        <p><strong class="text-white/80">Sauce Spread:</strong> {item.customization.sauce}</p>
                        <p><strong class="text-white/80">Cheese Blend:</strong> {item.customization.cheese}</p>
                        {item.customization.veggies.length > 0 && (
                          <p><strong class="text-white/80">Veggies:</strong> {item.customization.veggies.join(', ')}</p>
                        )}
                        {item.customization.meat && item.customization.meat.length > 0 && (
                          <p><strong class="text-white/80">Meat:</strong> {item.customization.meat.join(', ')}</p>
                        )}
                      </div>

                      <div class="flex justify-between items-center pt-2">
                        <div class="flex items-center bg-white/5 border border-white/5 rounded-lg px-1.5 py-0.5">
                          <button 
                            onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                            class="w-6 h-6 flex items-center justify-center font-bold text-white/60 hover:text-white"
                          >
                            -
                          </button>
                          <span class="w-6 text-center text-xs font-bold">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                            class="w-6 h-6 flex items-center justify-center font-bold text-white/60 hover:text-white"
                          >
                            +
                          </button>
                        </div>

                        <span class="text-lg font-black text-pizza-accent">₹{item.price * item.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Address Form & Summary or Auth Locked prompt */}
          <div class="lg:col-span-5 space-y-6">
            {isAuthenticated ? (
              /* Delivery address details form for signed-in users */
              <form onSubmit={handleCheckout} class="glass-dark p-6 rounded-[2rem] border border-white/5 space-y-5 shadow-premium">
                <h3 class="font-bold text-lg border-b border-white/5 pb-4">Delivery & Contact</h3>
                
                <div class="space-y-1.5">
                  <label class="text-xs font-semibold text-white/70 tracking-wide uppercase flex items-center gap-1.5">
                    <MapPin class="w-3.5 h-3.5 text-pizza-primary" />
                    <span>Delivery Address</span>
                  </label>
                  <textarea
                    placeholder="Enter complete house address, building/floor numbers, street details, landmark..."
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-pizza-primary focus:ring-1 focus:ring-pizza-primary outline-none transition-all duration-300 text-sm placeholder:text-white/20 min-h-24 resize-none"
                    required
                  ></textarea>
                </div>

                <div class="space-y-1.5">
                  <label class="text-xs font-semibold text-white/70 tracking-wide uppercase flex items-center gap-1.5">
                    <Phone class="w-3.5 h-3.5 text-pizza-primary" />
                    <span>Contact Phone Number</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="10-digit mobile contact number"
                    value={deliveryPhone}
                    onChange={(e) => setDeliveryPhone(e.target.value)}
                    class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-pizza-primary focus:ring-1 focus:ring-pizza-primary outline-none transition-all duration-300 text-sm placeholder:text-white/20"
                    required
                  />
                </div>

                {/* Order total math summary */}
                <div class="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-3 text-xs">
                  <div class="flex justify-between">
                    <span class="text-white/50">Subtotal:</span>
                    <span class="font-bold">₹{subtotal}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-white/50">Custom Topping Premium:</span>
                    <span class="font-bold text-emerald-400">Included</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-white/50">Express Delivery Charge:</span>
                    <span class="font-bold text-emerald-400">FREE</span>
                  </div>
                  <div class="flex justify-between pt-3 border-t border-white/5 text-sm">
                    <span class="font-bold text-white/80">Grand Total:</span>
                    <span class="text-xl font-black text-pizza-accent">₹{subtotal}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  class="w-full py-4 bg-gradient-to-r from-pizza-primary to-pizza-secondary hover:shadow-glow text-white font-bold rounded-xl text-sm transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <CreditCard class="w-4 h-4" />
                      <span>Proceed to Razorpay (Test Mode)</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* Gorgeous, premium auth locked screen for guest users */
              <div class="glass-dark p-6 rounded-[2rem] border border-white/5 space-y-6 shadow-premium relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-pizza-primary/10 rounded-full blur-2xl pointer-events-none" />
                
                <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                  <div className="w-10 h-10 bg-pizza-primary/10 border border-pizza-primary/20 rounded-xl flex items-center justify-center text-pizza-primary">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">Checkout is Locked</h3>
                    <p className="text-[10px] text-pizza-subtle uppercase tracking-wider font-semibold">Crustiva Shield Active</p>
                  </div>
                </div>

                <p className="text-xs text-pizza-gray leading-relaxed">
                  Please log in or register a customer account to unlock live doorstep tracking, secure Razorpay checkout, and personal order logs.
                </p>

                {/* Seeded Developer Credentials Display */}
                <div className="bg-[#0F0B0A] border border-white/5 p-4 rounded-2xl space-y-3">
                  <span className="text-[9px] font-black text-pizza-gold uppercase tracking-wider flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-pizza-gold" />
                    <span>DEMO DEV CREDENTIALS</span>
                  </span>
                  
                  <div className="space-y-2 text-[11px] text-white/70">
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span className="text-pizza-gray">Customer:</span>
                      <span className="font-bold text-pizza-light font-mono select-all">user@crustiva.com / userpassword123</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-pizza-gray">Admin Dashboard:</span>
                      <span className="font-bold text-pizza-light font-mono select-all">admin@crustiva.com / adminpassword123</span>
                    </div>
                  </div>
                </div>

                {/* Basket pricing summary visible to guest */}
                <div class="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-3 text-xs">
                  <div class="flex justify-between pt-1 text-sm">
                    <span class="font-bold text-white/80">Grand Total:</span>
                    <span class="text-xl font-black text-pizza-gold">₹{subtotal}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Link
                    to="/login?redirect=cart"
                    className="w-full py-3.5 bg-gradient-to-r from-pizza-primary to-pizza-secondary hover:shadow-glow text-white font-bold rounded-xl text-xs uppercase tracking-wider text-center transition-all duration-300 flex items-center justify-center gap-1.5"
                  >
                    <Key className="w-3.5 h-3.5" />
                    <span>Log In to Checkout</span>
                  </Link>

                  <Link
                    to="/register"
                    className="w-full py-3.5 bg-pizza-charcoal hover:bg-pizza-charcoal/80 text-white font-bold rounded-xl text-xs uppercase tracking-wider text-center transition-all duration-300 border border-white/10"
                  >
                    Register Account
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
