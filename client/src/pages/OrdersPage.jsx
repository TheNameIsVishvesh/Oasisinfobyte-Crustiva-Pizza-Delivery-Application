import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { ShoppingBag, Loader, PackageCheck, Truck, ChefHat, CheckCircle2, RefreshCw, AlertCircle } from 'lucide-react';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);
    
    setError('');
    try {
      const res = await API.get('/api/orders/my-orders');
      setOrders(res.data.data);
    } catch (err) {
      console.error('❌ Failed to fetch user orders:', err.message);
      setError('Failed to fetch orders log.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Polling Mechanism: If there is at least one active order in progress,
  // query the backend every 5 seconds silent-refetch to reflect live admin changes immediately!
  useEffect(() => {
    const hasActiveOrders = orders.some(o => o.status !== 'Delivered' && o.paymentStatus === 'Paid');
    if (!hasActiveOrders) return;

    console.log('⏰ Active orders detected. Booting status tracking polling...');
    const intervalId = setInterval(() => {
      fetchOrders(true);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [orders]);

  const getStatusStepIndex = (status) => {
    const steps = ['Order Received', 'In Kitchen', 'Sent To Delivery', 'Delivered'];
    return steps.indexOf(status);
  };

  if (loading) {
    return (
      <div class="min-h-screen flex items-center justify-center bg-pizza-dark text-white">
        <div class="w-12 h-12 border-4 border-pizza-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div class="min-h-screen bg-pizza-dark text-white py-12 px-6 relative overflow-hidden">
      <div class="absolute -right-24 -top-24 w-96 h-96 bg-pizza-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div class="absolute -left-24 -bottom-24 w-96 h-96 bg-pizza-accent/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div class="max-w-5xl mx-auto space-y-8 z-10 relative">
        <div class="flex justify-between items-center">
          <div>
            <h2 class="text-3xl font-extrabold tracking-tight">Order Tracking Dashboard</h2>
            <p class="text-xs text-white/50 mt-1">Status changes sync automatically every 5s</p>
          </div>

          <button 
            onClick={() => fetchOrders(true)}
            disabled={refreshing}
            class="p-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors flex items-center gap-2 text-xs"
          >
            <RefreshCw class={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {error && (
          <div class="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl flex items-center gap-3 text-xs">
            <AlertCircle class="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {orders.length === 0 ? (
          <div class="text-center py-20 bg-white/5 rounded-[2rem] border border-dashed border-white/10 text-white/40 space-y-4">
            <ShoppingBag class="w-12 h-12 mx-auto text-white/20 animate-bounce" />
            <p class="text-sm">You haven't placed any gourmet orders yet.</p>
            <Link to="/" class="inline-block px-6 py-2.5 bg-pizza-primary text-white text-xs font-bold rounded-xl hover:shadow-glow transition-all">
              Order Your First Slice
            </Link>
          </div>
        ) : (
          <div class="space-y-6">
            {orders.map((order) => {
              const currentStep = getStatusStepIndex(order.status);
              
              return (
                <div key={order._id} class="glass-dark p-6 rounded-[2rem] border border-white/5 space-y-6">
                  {/* Card Header details */}
                  <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-4">
                    <div>
                      <span class="text-xs text-white/40 block">Order Reference ID</span>
                      <code class="text-sm font-extrabold text-pizza-accent">{order._id}</code>
                    </div>

                    <div class="flex items-center gap-4">
                      <div>
                        <span class="text-xs text-white/40 block text-right">Payment Status</span>
                        <span class="text-xs text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                          {order.paymentStatus} (Paid via Razorpay)
                        </span>
                      </div>
                      <div class="text-right">
                        <span class="text-xs text-white/40 block">Grand Total</span>
                        <span class="text-lg font-black text-pizza-primary">₹{order.totalAmount}</span>
                      </div>
                    </div>
                  </div>

                  {/* Stepper Status tracker */}
                  <div class="py-4">
                    <div class="relative flex items-center justify-between">
                      {/* Connection Progress Bar Background */}
                      <div class="absolute left-0 right-0 h-1 bg-white/5 top-1/2 -translate-y-1/2 z-0 rounded-full"></div>
                      {/* Connection Active Progress Fill */}
                      <div 
                        class="absolute left-0 h-1 bg-pizza-primary top-1/2 -translate-y-1/2 z-0 rounded-full transition-all duration-1000"
                        style={{ width: `${(currentStep / 3) * 100}%` }}
                      ></div>

                      {[
                        { label: 'Order Received', icon: PackageCheck },
                        { label: 'In Kitchen', icon: ChefHat },
                        { label: 'Sent To Delivery', icon: Truck },
                        { label: 'Delivered', icon: CheckCircle2 }
                      ].map((step, idx) => {
                        const StepIcon = step.icon;
                        const isPast = idx < currentStep;
                        const isCurrent = idx === currentStep;
                        
                        return (
                          <div key={idx} class="relative z-10 flex flex-col items-center">
                            <div 
                              class={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-500 ${
                                isPast 
                                  ? 'bg-pizza-primary border-pizza-primary text-white shadow-glow' 
                                  : isCurrent 
                                  ? 'bg-pizza-dark border-pizza-accent text-pizza-accent animate-pulse shadow-glow' 
                                  : 'bg-[#231e1a] border-white/5 text-white/30'
                              }`}
                            >
                              <StepIcon class="w-5 h-5" />
                            </div>
                            <span 
                              class={`text-[10px] uppercase tracking-wider font-extrabold mt-2.5 hidden sm:block ${
                                isCurrent ? 'text-pizza-accent font-black' : isPast ? 'text-white/80' : 'text-white/30'
                              }`}
                            >
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    {/* Responsive Status Label for Mobile */}
                    <div class="text-center sm:hidden mt-4">
                      <span class="text-xs uppercase tracking-widest font-black text-pizza-accent bg-pizza-accent/10 border border-pizza-accent/20 px-3 py-1 rounded-full">
                        Status: {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Items expansion */}
                  <div class="bg-white/5 rounded-2xl p-4 border border-white/5 space-y-3">
                    <h5 class="text-xs font-semibold text-white/50 uppercase">Ingredients List & Specs:</h5>
                    <div class="divide-y divide-white/5 text-xs">
                      {order.items.map((item, idx) => (
                        <div key={idx} class="py-2.5 first:pt-0 last:pb-0 flex justify-between items-start gap-4">
                          <div>
                            <span class="font-extrabold text-sm text-white/85">{item.name}</span>{' '}
                            <span class="text-[10px] text-pizza-accent font-bold bg-pizza-accent/10 px-2 py-0.5 rounded-full">{item.size}</span>
                            <span class="block text-[10px] text-white/40 mt-1">
                              Base: {item.customization.base} | Sauce: {item.customization.sauce} | Cheese: {item.customization.cheese}
                              {item.customization.veggies.length > 0 && ` | Veggies: ${item.customization.veggies.join(', ')}`}
                              {item.customization.meat.length > 0 && ` | Meat: ${item.customization.meat.join(', ')}`}
                            </span>
                          </div>
                          <div class="text-right">
                            <span class="text-white/50 block">Qty: x{item.quantity}</span>
                            <span class="font-bold text-white/80">₹{item.price * item.quantity}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
