import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { 
  PackageOpen, Clock, Loader, User, MapPin, Phone, RefreshCw, 
  AlertTriangle, CheckCircle, CookingPot, Truck, Award, Sparkles, SlidersHorizontal 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState('');
  const [selectedStatusTab, setSelectedStatusTab] = useState('all');

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

  const filteredOrders = selectedStatusTab === 'all'
    ? orders
    : orders.filter(order => order.status === selectedStatusTab);

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
      <div className="min-h-screen flex items-center justify-center bg-[#0F0B0A] text-white">
        <div className="w-12 h-12 border-4 border-pizza-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0B0A] text-white py-12 px-6 relative overflow-x-clip">
      <div className="absolute -right-24 -top-24 w-96 h-96 bg-pizza-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute -left-24 -bottom-24 w-96 h-96 bg-pizza-gold/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto space-y-8 z-10 relative">
        
        {/* Header Console */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/[0.06] pb-6">
          <div>
            <div className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-pizza-primary/10 border border-pizza-primary/20 text-[10px] font-bold text-pizza-primary uppercase tracking-widest mb-1.5 animate-pulse">
              <Sparkles className="w-3 h-3" />
              <span>Production Pipeline</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight">Kitchen Live Queue</h2>
            <p className="text-xs text-white/50 mt-1">Review active customizations and progress status logs</p>
          </div>

          <button 
            onClick={() => fetchOrders(true)}
            className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors flex items-center gap-2 text-xs font-bold"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reload Logs</span>
          </button>
        </div>

        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl flex items-center gap-3 text-xs">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Status Filters Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-white/[0.04]">
          <SlidersHorizontal className="w-4 h-4 text-pizza-gray shrink-0 mr-1" />
          {[
            { id: 'all', label: 'Show All Orders' },
            { id: 'Order Received', label: 'Received' },
            { id: 'In Kitchen', label: 'In Kitchen' },
            { id: 'Sent To Delivery', label: 'Sent To Delivery' },
            { id: 'Delivered', label: 'Completed' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedStatusTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 ${
                selectedStatusTab === tab.id
                  ? 'bg-gradient-to-r from-pizza-primary/15 to-pizza-gold/5 border-pizza-primary text-white shadow-glow'
                  : 'bg-white/5 border-white/5 text-pizza-gray hover:text-white hover:border-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl flex items-center gap-3 text-xs">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {filteredOrders.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10 text-white/40 space-y-3">
            <PackageOpen className="w-12 h-12 mx-auto text-white/20 animate-bounce" />
            <p className="text-sm">No orders found matching the filter criteria.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div 
                key={order._id} 
                className={`bg-white/[0.01] p-6 rounded-[2rem] border transition-all duration-300 ${
                  order.status === 'Delivered' 
                    ? 'border-white/5 opacity-60' 
                    : 'border-white/[0.06] shadow-premium'
                }`}
              >
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/[0.06] pb-4 text-xs">
                  <div>
                    <span className="text-white/40 block">Order Reference</span>
                    <code className="text-sm font-extrabold text-pizza-gold">{order._id}</code>
                    <span className="text-[10px] text-white/30 block mt-1">Placed: {new Date(order.createdAt).toLocaleString()}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <div className="bg-white/5 p-3 rounded-2xl border border-white/5 space-y-1 text-left">
                      <div className="flex items-center gap-1.5 text-white/70 font-semibold">
                        <User className="w-3.5 h-3.5 text-pizza-primary" />
                        <span>{order.user?.name || 'Customer'} ({order.user?.email || 'N/A'})</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-white/50 text-[10px]">
                        <MapPin className="w-3.5 h-3.5 text-white/30" />
                        <span>{order.deliveryAddress}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-white/50 text-[10px]">
                        <Phone className="w-3.5 h-3.5 text-white/30" />
                        <span>{order.deliveryPhone}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-white/40 block">Grand Total</span>
                      <span className="text-xl font-black text-pizza-gold">₹{order.totalAmount}</span>
                    </div>
                  </div>
                </div>

                {/* Progress Control Actions */}
                <div className="py-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5">
                  <div>
                    <span className="text-[10px] text-white/40 uppercase font-semibold block mb-1">Active Pipeline Step</span>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                      order.status === 'Delivered' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-pizza-primary/10 text-pizza-primary border border-pizza-primary/20 animate-pulse'
                    }`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex flex-col gap-1 text-left">
                      <label className="text-[10px] font-bold text-white/40 uppercase">Change Status</label>
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                        disabled={updatingId === order._id}
                        className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-pizza-primary outline-none transition-all cursor-pointer font-bold"
                      >
                        <option value="Order Received" className="bg-[#1A1310] text-white">Received</option>
                        <option value="In Kitchen" className="bg-[#1A1310] text-white">In Kitchen</option>
                        <option value="Sent To Delivery" className="bg-[#1A1310] text-white">Sent To Delivery</option>
                        <option value="Delivered" className="bg-[#1A1310] text-white">Delivered</option>
                      </select>
                    </div>

                    <div className="h-8 w-px bg-white/10 hidden md:block"></div>

                    <div className="flex flex-wrap gap-2">
                      {order.status === 'Order Received' && (
                        <button
                          onClick={() => handleUpdateStatus(order._id, 'In Kitchen')}
                          disabled={updatingId === order._id}
                          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-amber-950 font-black rounded-xl text-xs flex items-center gap-1.5 transition-all"
                        >
                          <CookingPot className="w-4 h-4" />
                          <span>Bake in Kitchen</span>
                        </button>
                      )}
                      {order.status === 'In Kitchen' && (
                        <button
                          onClick={() => handleUpdateStatus(order._id, 'Sent To Delivery')}
                          disabled={updatingId === order._id}
                          className="px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-blue-950 font-black rounded-xl text-xs flex items-center gap-1.5 transition-all"
                        >
                          <Truck className="w-4 h-4" />
                          <span>Dispatch to Delivery</span>
                        </button>
                      )}
                      {order.status === 'Sent To Delivery' && (
                        <button
                          onClick={() => handleUpdateStatus(order._id, 'Delivered')}
                          disabled={updatingId === order._id}
                          className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-emerald-950 font-black rounded-xl text-xs flex items-center gap-1.5 transition-all"
                        >
                          <Award className="w-4 h-4" />
                          <span>Confirm Delivery Completion</span>
                        </button>
                      )}
                      {order.status === 'Delivered' && (
                        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-500/5 px-4 py-2 rounded-xl border border-emerald-500/10">
                          <CheckCircle className="w-4 h-4" />
                          <span>Archived & Closed</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Items & Customization details lists */}
                <div className="pt-4 space-y-3">
                  <h4 className="text-[10px] text-white/40 uppercase font-semibold tracking-wider">Chef Recipe Cards:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="bg-white/5 rounded-2xl p-4 border border-white/5 text-xs space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-extrabold text-sm text-white">{item.name}</span>
                            <span className="text-[10px] text-pizza-gold font-bold bg-pizza-gold/10 px-2 py-0.5 rounded-full ml-2">
                              {item.size}
                            </span>
                          </div>
                          <span className="text-white/40">Qty: x{item.quantity}</span>
                        </div>

                        <div className="text-[11px] leading-relaxed text-white/50 border-t border-white/5 pt-2 space-y-1">
                          <p><strong className="text-white/70">Dough:</strong> {item.customization.base}</p>
                          <p><strong className="text-white/70">Sauces:</strong> {item.customization.sauce}</p>
                          <p><strong className="text-white/70">Cheese:</strong> {item.customization.cheese}</p>
                          {item.customization.veggies.length > 0 && (
                            <p><strong className="text-white/70">Veggies:</strong> {item.customization.veggies.join(', ')}</p>
                          )}
                          {item.customization.meat.length > 0 && (
                            <p><strong className="text-white/70">Meat Toppings:</strong> {item.customization.meat.join(', ')}</p>
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
