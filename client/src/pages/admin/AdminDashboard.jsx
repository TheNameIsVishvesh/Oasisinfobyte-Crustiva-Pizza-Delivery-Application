import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import { Landmark, ShoppingCart, BellRing, Users, Activity, ChevronRight, Sparkles, ChefHat, LayoutGrid } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    lowStockCount: 0,
    activeOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const fetchAdminStats = async () => {
      setLoading(true);
      try {
        // Query orders
        const ordersRes = await API.get('/api/orders');
        const orders = ordersRes.data.data;

        // Query inventory
        const invRes = await API.get('/api/inventory');
        const inventory = invRes.data.data;

        // Compute metrics
        const sales = orders.reduce((acc, curr) => acc + curr.totalAmount, 0);
        const lowStock = inventory.filter(item => item.stock <= item.threshold).length;
        const active = orders.filter(o => o.status !== 'Delivered').length;

        setStats({
          totalSales: sales,
          totalOrders: orders.length,
          lowStockCount: lowStock,
          activeOrders: active,
        });

        // Slice first 5 orders as recent logs
        setRecentOrders(orders.slice(0, 5));
      } catch (err) {
        console.error('❌ Failed to fetch admin metrics:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pizza-dark text-white">
        <div className="w-12 h-12 border-4 border-pizza-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pizza-dark text-white py-12 px-6 relative overflow-hidden">
      <div className="absolute -right-24 -top-24 w-96 h-96 bg-pizza-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute -left-24 -bottom-24 w-96 h-96 bg-pizza-accent/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto space-y-8 z-10 relative">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-pizza-primary/10 border border-pizza-primary/20 text-[10px] font-bold text-pizza-primary uppercase tracking-widest mb-1.5">
              <Sparkles className="w-3 h-3" />
              <span>Administrative Console</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight">Analytics & Kitchen Hub</h2>
          </div>

          <div className="flex gap-3">
            <Link to="/admin/users" className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-xl text-xs font-bold transition-all">
              Manage User Profiles
            </Link>
            <Link to="/admin/inventory" className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-xl text-xs font-bold transition-all">
              Manage Inventory Stock
            </Link>
            <Link to="/admin/orders" className="px-4 py-2 bg-pizza-primary hover:bg-pizza-primary/95 text-white rounded-xl text-xs font-bold hover:shadow-glow transition-all">
              Open Live Orders Queue
            </Link>
          </div>
        </div>

        {/* Dynamic Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Total Revenue Generated', val: `₹${stats.totalSales}`, desc: 'All completed orders', icon: Landmark, color: 'text-emerald-400 bg-emerald-400/10' },
            { label: 'Total Orders Handled', val: stats.totalOrders, desc: 'Sales conversions', icon: ShoppingCart, color: 'text-pizza-primary bg-pizza-primary/10' },
            { label: 'Low Stock Ingredients', val: stats.lowStockCount, desc: 'Need quick replenishment', icon: BellRing, color: stats.lowStockCount > 0 ? 'text-rose-400 bg-rose-400/10 border border-rose-500/20' : 'text-white/40 bg-white/5' },
            { label: 'Active Kitchen Queue', val: stats.activeOrders, desc: 'Orders in preparation', icon: ChefHat, color: 'text-pizza-accent bg-pizza-accent/10' }
          ].map((card, idx) => {
            const Icon = card.icon;
            return (
              <div key={idx} className="glass-dark p-6 rounded-3xl border border-white/5 flex items-center gap-4 hover:border-white/10 transition-all">
                <div class={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${card.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <span className="block text-[10px] text-white/40 uppercase font-semibold">{card.label}</span>
                  <span className="block text-2xl font-black mt-0.5">{card.val}</span>
                  <span className="block text-[10px] text-white/30 mt-1">{card.desc}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Recent Orders queue list */}
          <div className="lg:col-span-8 glass-dark p-6 rounded-[2rem] border border-white/5 space-y-6">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <h3 className="font-bold text-lg">Incoming Orders Activity Log</h3>
              <Link to="/admin/orders" className="text-xs text-pizza-accent hover:underline flex items-center gap-1">
                <span>View Full Queue</span>
                <ChevronRight className="w-4.5 h-4.5" />
              </Link>
            </div>

            <div className="divide-y divide-white/5">
              {recentOrders.length === 0 ? (
                <p className="text-xs text-white/35 py-10 text-center">No orders registered in the system yet.</p>
              ) : (
                recentOrders.map(order => (
                  <div key={order._id} className="py-4 flex justify-between items-center gap-4 first:pt-0 last:pb-0 text-xs">
                    <div>
                      <code className="text-pizza-accent font-bold block">{order._id.slice(-8).toUpperCase()}</code>
                      <span className="text-white/40 block mt-0.5">Placed by: {order.user?.name || 'Customer'}</span>
                    </div>

                    <div className="text-center">
                      <span class={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider ${
                        order.status === 'Delivered' 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-pizza-accent/10 text-pizza-accent border border-pizza-accent/20 animate-pulse'
                      }`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="font-black text-sm block">₹{order.totalAmount}</span>
                      <span className="text-white/40 text-[10px] block mt-0.5">{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick link navigation section */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass-dark p-6 rounded-[2rem] border border-white/5 space-y-4">
              <h4 className="font-bold text-base border-b border-white/5 pb-3">Admin Panel Controls</h4>
              <div className="space-y-3">
                <Link to="/admin/inventory" className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5 text-xs">
                  <div>
                    <span className="font-bold block">Ingredient Catalog</span>
                    <span className="text-[10px] text-white/40 block mt-0.5">Edit prices, replenish bases & sauces</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/30" />
                </Link>
                <Link to="/admin/orders" className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5 text-xs">
                  <div>
                    <span className="font-bold block">Kitchen Queue Tracker</span>
                    <span className="text-[10px] text-white/40 block mt-0.5">Update preparational order steps</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/30" />
                </Link>
                <Link to="/admin/users" className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5 text-xs">
                  <div>
                    <span className="font-bold block">User Accounts Log</span>
                    <span className="text-[10px] text-white/40 block mt-0.5">View user details and role privileges</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/30" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
