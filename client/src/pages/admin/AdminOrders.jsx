import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { PackageOpen, Clock, Loader, User, MapPin, Phone, RefreshCw, AlertTriangle, CheckCircle, CookingPot, Truck, Award } from 'lucide-react';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState('');

  const fetchOrders = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    setError('');
    try {
      const res = await API.get('/api/orders');
      setOrders(res.data.data);
    } catch (err) {
      console.error('❌ Failed to fetch orders:', err.message);
      setError('Failed to load system orders log.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId, nextStatus) => {
    setUpdatingId(orderId);
    try {
      await API.put(`/api/orders/${orderId}/status`, { status: nextStatus });
      fetchOrders(true);
    } catch (err) {
      alert('Failed to update order tracking status.');
    } finally {
      setUpdatingId('');
    }
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

      <div class="max-w-6xl mx-auto space-y-8 z-10 relative">
        <div class="flex justify-between items-center">
          <div>
            <h2 class="text-3xl font-extrabold tracking-tight">Kitchen Live Queue</h2>
            <p class="text-xs text-white/50 mt-1">Review active customizations and progress status logs</p>
          </div>

          <button 
            onClick={() => fetchOrders(true)}
            class="p-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors flex items-center gap-2 text-xs"
          >
            <RefreshCw class="w-4 h-4" />
            <span>Reload Logs</span>
          </button>
        </div>

        {error && (
          <div class="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl flex items-center gap-3 text-xs">
            <AlertTriangle class="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {orders.length === 0 ? (
          <div class="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10 text-white/40 space-y-3">
            <PackageOpen class="w-12 h-12 mx-auto text-white/20 animate-bounce" />
            <p class="text-sm">No orders registered in the pizzeria network yet.</p>
          </div>
        ) : (
          <div class="space-y-6">
            {orders.map((order) => (
              <div 
                key={order._id} 
                class={`glass-dark p-6 rounded-[2rem] border transition-all duration-300 ${
                  order.status === 'Delivered' 
                    ? 'border-white/5 opacity-60' 
                    : 'border-pizza-primary/20 shadow-premium'
                }`}
              >
                {/* Header */}
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-4 text-xs">
                  <div>
                    <span class="text-white/40 block">Order Reference</span>
                    <code class="text-sm font-extrabold text-pizza-accent">{order._id}</code>
                    <span class="text-[10px] text-white/30 block mt-1">Placed: {new Date(order.createdAt).toLocaleString()}</span>
                  </div>

                  <div class="flex flex-wrap items-center gap-4">
                    <div class="bg-white/5 p-3 rounded-2xl border border-white/5 space-y-1 text-left">
                      <div class="flex items-center gap-1.5 text-white/70 font-semibold">
                        <User class="w-3.5 h-3.5 text-pizza-primary" />
                        <span>{order.user?.name || 'Customer'} ({order.user?.email || 'N/A'})</span>
                      </div>
                      <div class="flex items-center gap-1.5 text-white/50 text-[10px]">
                        <MapPin class="w-3.5 h-3.5 text-white/30" />
                        <span>{order.deliveryAddress}</span>
                      </div>
                      <div class="flex items-center gap-1.5 text-white/50 text-[10px]">
                        <Phone class="w-3.5 h-3.5 text-white/30" />
                        <span>{order.deliveryPhone}</span>
                      </div>
                    </div>

                    <div class="text-right">
                      <span class="text-white/40 block">Grand Total</span>
                      <span class="text-xl font-black text-pizza-accent">₹{order.totalAmount}</span>
                    </div>
                  </div>
                </div>

                {/* Progress Control Actions */}
                <div class="py-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5">
                  <div>
                    <span class="text-[10px] text-white/40 uppercase font-semibold block mb-1">Active Pipeline Step</span>
                    <span class={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                      order.status === 'Delivered' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-pizza-primary/10 text-pizza-primary border border-pizza-primary/20 animate-pulse'
                    }`}>
                      {order.status}
                    </span>
                  </div>

                  <div class="flex flex-wrap gap-2">
                    {order.status === 'Order Received' && (
                      <button
                        onClick={() => handleUpdateStatus(order._id, 'In Kitchen')}
                        disabled={updatingId === order._id}
                        class="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-amber-950 font-black rounded-xl text-xs flex items-center gap-1.5 transition-all"
                      >
                        <CookingPot class="w-4 h-4" />
                        <span>Bake in Kitchen</span>
                      </button>
                    )}
                    {order.status === 'In Kitchen' && (
                      <button
                        onClick={() => handleUpdateStatus(order._id, 'Sent To Delivery')}
                        disabled={updatingId === order._id}
                        class="px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-blue-950 font-black rounded-xl text-xs flex items-center gap-1.5 transition-all"
                      >
                        <Truck class="w-4 h-4" />
                        <span>Dispatch to Delivery</span>
                      </button>
                    )}
                    {order.status === 'Sent To Delivery' && (
                      <button
                        onClick={() => handleUpdateStatus(order._id, 'Delivered')}
                        disabled={updatingId === order._id}
                        class="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-emerald-950 font-black rounded-xl text-xs flex items-center gap-1.5 transition-all"
                      >
                        <Award class="w-4 h-4" />
                        <span>Confirm Delivery Completion</span>
                      </button>
                    )}
                    {order.status === 'Delivered' && (
                      <div class="flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-500/5 px-4 py-2 rounded-xl border border-emerald-500/10">
                        <CheckCircle class="w-4 h-4" />
                        <span>Archived & Closed</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Items & Customization details lists */}
                <div class="pt-4 space-y-3">
                  <h4 class="text-[10px] text-white/40 uppercase font-semibold tracking-wider">Chef Recipe Cards:</h4>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} class="bg-white/5 rounded-2xl p-4 border border-white/5 text-xs space-y-2">
                        <div class="flex justify-between items-start">
                          <div>
                            <span class="font-extrabold text-sm text-white">{item.name}</span>
                            <span class="text-[10px] text-pizza-accent font-bold bg-pizza-accent/10 px-2 py-0.5 rounded-full ml-2">
                              {item.size}
                            </span>
                          </div>
                          <span class="text-white/40">Qty: x{item.quantity}</span>
                        </div>

                        <div class="text-[11px] leading-relaxed text-white/50 border-t border-white/5 pt-2 space-y-1">
                          <p><strong class="text-white/70">Dough:</strong> {item.customization.base}</p>
                          <p><strong class="text-white/70">Sauces:</strong> {item.customization.sauce}</p>
                          <p><strong class="text-white/70">Cheese:</strong> {item.customization.cheese}</p>
                          {item.customization.veggies.length > 0 && (
                            <p><strong class="text-white/70">Veggies:</strong> {item.customization.veggies.join(', ')}</p>
                          )}
                          {item.customization.meat.length > 0 && (
                            <p><strong class="text-white/70">Meat Toppings:</strong> {item.customization.meat.join(', ')}</p>
                          )}
                        </div>
                      </div>
                    ))}
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
