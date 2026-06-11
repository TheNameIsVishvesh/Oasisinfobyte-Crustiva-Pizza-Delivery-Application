import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import { 
  Landmark, ShoppingCart, BellRing, Users, Activity, 
  ChevronRight, Sparkles, ChefHat, LayoutGrid, Award, ClipboardList
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    lowStockCount: 0,
    activeOrders: 0,
  });
  const [pizzaStats, setPizzaStats] = useState({
    available: 0,
    outOfStock: 0,
    hidden: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);
  const [dailyRevenue, setDailyRevenue] = useState([]);
  const [pipelineCounts, setPipelineCounts] = useState({
    'Order Received': 0,
    'In Kitchen': 0,
    'Sent To Delivery': 0,
    'Delivered': 0
  });
  const [hoveredPoint, setHoveredPoint] = useState(null);

  useEffect(() => {
    const fetchAdminStats = async () => {
      setLoading(true);
      try {
        // Query orders
        const ordersRes = await API.get('/api/orders');
        const orders = ordersRes.data.data;

        // Query pizzas for status metrics
        const pizzasRes = await API.get('/api/pizzas');
        const pizzas = pizzasRes.data.data;
        const available = pizzas.filter(p => p.status === 'available').length;
        const outOfStock = pizzas.filter(p => p.status === 'out_of_stock').length;
        const hidden = pizzas.filter(p => p.status === 'hidden').length;
        setPizzaStats({ available, outOfStock, hidden });

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

        // Group counts by status
        const counts = { 'Order Received': 0, 'In Kitchen': 0, 'Sent To Delivery': 0, 'Delivered': 0 };
        orders.forEach(o => {
          if (counts[o.status] !== undefined) {
            counts[o.status]++;
          }
        });
        setPipelineCounts(counts);

        // Group last 7 days revenue
        const days = Array.from({ length: 7 }).map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - i);
          return d.toISOString().split('T')[0];
        }).reverse();

        const revenueData = days.map(date => {
          const dayAmount = orders
            .filter(o => o.createdAt && o.createdAt.startsWith(date))
            .reduce((sum, o) => sum + o.totalAmount, 0);
          
          // Format date as e.g. "Jun 8"
          const parsed = new Date(date);
          const label = parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          return { date, label, amount: dayAmount };
        });

        setDailyRevenue(revenueData);

      } catch (err) {
        console.error('❌ Failed to fetch admin metrics:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  // Compute SVG Points for Line Chart
  const svgWidth = 500;
  const svgHeight = 160;
  const maxAmount = dailyRevenue.length > 0 
    ? Math.max(...dailyRevenue.map(d => d.amount), 2000) 
    : 2000;

  const points = dailyRevenue.map((d, i) => {
    const x = (i * (svgWidth - 60)) / 6 + 30;
    // Scale height so it leaves padding at top and bottom
    const y = svgHeight - 20 - (d.amount / maxAmount) * (svgHeight - 40);
    return { x, y, label: d.label, amount: d.amount };
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = points.length > 0 
    ? `${linePath} L ${points[points.length - 1].x} ${svgHeight - 10} L ${points[0].x} ${svgHeight - 10} Z` 
    : '';

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

      <div className="max-w-7xl mx-auto space-y-8 z-10 relative">
        {/* Header Console */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/[0.06] pb-6">
          <div>
            <div className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-pizza-primary/10 border border-pizza-primary/20 text-[10px] font-bold text-pizza-primary uppercase tracking-widest mb-1.5 animate-pulse">
              <Sparkles className="w-3 h-3" />
              <span>Administrative Console</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight">Analytics & Kitchen Hub</h2>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link to="/admin/menu" className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-xl text-xs font-bold transition-all">
              Manage Pizza Menu
            </Link>
            <Link to="/admin/users" className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-xl text-xs font-bold transition-all">
              Manage User Profiles
            </Link>
            <Link to="/admin/inventory" className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-xl text-xs font-bold transition-all">
              Manage Inventory Stock
            </Link>
            <Link to="/admin/orders" className="px-4 py-2.5 bg-gradient-to-r from-pizza-primary to-pizza-secondary text-white rounded-xl text-xs font-black uppercase tracking-wider hover:shadow-glow transition-all">
              Open Live Orders Queue
            </Link>
          </div>
        </div>

        {/* Dynamic Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Total Revenue Generated', val: `₹${stats.totalSales.toLocaleString('en-IN')}`, desc: 'All completed orders', icon: Landmark, color: 'text-emerald-400 bg-emerald-400/10' },
            { label: 'Total Orders Handled', val: stats.totalOrders, desc: 'Sales conversions', icon: ShoppingCart, color: 'text-pizza-primary bg-pizza-primary/10' },
            { label: 'Low Stock Ingredients', val: stats.lowStockCount, desc: 'Need quick replenishment', icon: BellRing, color: stats.lowStockCount > 0 ? 'text-rose-400 bg-rose-400/10 border border-rose-500/20' : 'text-white/40 bg-white/5' },
            { label: 'Active Kitchen Queue', val: stats.activeOrders, desc: 'Orders in preparation', icon: ChefHat, color: 'text-pizza-gold bg-pizza-gold/10' }
          ].map((card, idx) => {
            const Icon = card.icon;
            return (
              <div key={idx} className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] p-6 rounded-3xl flex items-center gap-4 hover:border-white/10 transition-all shadow-premium">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${card.color}`}>
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

        {/* Pizza Availability Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Available Pizzas', val: pizzaStats.available, desc: 'Visible & orderable by customers', dot: 'bg-emerald-400' },
            { label: 'Out Of Stock Pizzas', val: pizzaStats.outOfStock, desc: 'Visible with badge, order disabled', dot: 'bg-rose-400' },
            { label: 'Hidden Pizzas', val: pizzaStats.hidden, desc: 'Temporarily hidden from customers', dot: 'bg-amber-400' }
          ].map((card, idx) => (
            <div key={idx} className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] p-5 rounded-2xl flex items-center justify-between hover:border-white/10 transition-all shadow-premium">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                  <div className={`w-2 h-2 rounded-full ${card.dot} animate-pulse`} />
                </div>
                <div>
                  <span className="block text-[10px] text-white/40 uppercase font-semibold">{card.label}</span>
                  <span className="block text-xl font-black mt-0.5">{card.val}</span>
                  <span className="block text-[10px] text-white/30 mt-0.5">{card.desc}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT AREA: Sales Chart & Kitchen Progress Pipeline */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* 1. Revenue Trends Interactive SVG Area Chart */}
            <div className="bg-white/[0.02] border border-white/[0.06] p-6 rounded-[2rem] shadow-premium space-y-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pizza-primary via-pizza-gold to-pizza-secondary" />
              <div className="flex justify-between items-center pb-2">
                <div>
                  <span className="text-[10px] text-pizza-primary uppercase font-bold tracking-widest block">Financial Report</span>
                  <h3 className="font-extrabold text-lg text-white">Daily Revenue Trend</h3>
                </div>
                <div className="text-right">
                  <span className="text-xs text-white/40 block">Last 7 Days</span>
                </div>
              </div>

              {/* SVG Area Chart Container */}
              <div className="relative w-full h-[180px] pt-4">
                {points.length > 0 ? (
                  <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} width="100%" height="100%" className="overflow-visible">
                    <defs>
                      <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#FF7A18" stopOpacity="0.28" />
                        <stop offset="100%" stopColor="#FF7A18" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Horizontal Guideline */}
                    <line x1="20" y1={svgHeight - 15} x2={svgWidth - 20} y2={svgHeight - 15} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                    <line x1="20" y1={svgHeight / 2} x2={svgWidth - 20} y2={svgHeight / 2} stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="3 3" />

                    {/* Area path */}
                    <path d={areaPath} fill="url(#areaGrad)" />

                    {/* Line path */}
                    <path d={linePath} fill="none" stroke="#FF7A18" strokeWidth="2.5" />

                    {/* Interactive Circles */}
                    {points.map((p, idx) => (
                      <g key={idx}>
                        <circle
                          cx={p.x}
                          cy={p.y}
                          r={hoveredPoint && hoveredPoint.idx === idx ? "6" : "4"}
                          fill={hoveredPoint && hoveredPoint.idx === idx ? "#FFD27F" : "#FF7A18"}
                          className="transition-all cursor-pointer"
                          onMouseEnter={() => setHoveredPoint({ idx, ...p })}
                          onMouseLeave={() => setHoveredPoint(null)}
                        />
                        <text
                          x={p.x}
                          y={svgHeight}
                          fontSize="9"
                          fill="rgba(255,255,255,0.4)"
                          textAnchor="middle"
                          fontWeight="bold"
                        >
                          {p.label}
                        </text>
                      </g>
                    ))}
                  </svg>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-white/30">
                    Insufficent data to plot revenue trend.
                  </div>
                )}

                {/* Float Tooltip */}
                <AnimatePresence>
                  {hoveredPoint && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="absolute top-1 right-2 bg-[#1A1310] border border-white/[0.08] p-2.5 rounded-xl text-center shadow-glow pointer-events-none"
                    >
                      <span className="block text-[8px] text-white/40 uppercase font-black">{hoveredPoint.label}</span>
                      <span className="text-sm font-black text-pizza-gold">₹{hoveredPoint.amount}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* 2. Kitchen Progress Pipeline Indicator */}
            <div className="bg-white/[0.02] border border-white/[0.06] p-6 rounded-[2rem] shadow-premium space-y-6">
              <div>
                <span className="text-[10px] text-pizza-primary uppercase font-bold tracking-widest block">Live Production Pipeline</span>
                <h3 className="font-extrabold text-lg text-white">Kitchen Queue Distribution</h3>
              </div>

              {/* Progress Pipeline Flow */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { stage: 'Order Received', count: pipelineCounts['Order Received'], color: 'border-blue-500/20 text-blue-400 bg-blue-500/5', dot: 'bg-blue-400' },
                  { stage: 'In Kitchen', count: pipelineCounts['In Kitchen'], color: 'border-pizza-primary/20 text-pizza-primary bg-pizza-primary/5', dot: 'bg-pizza-primary' },
                  { stage: 'Sent To Delivery', count: pipelineCounts['Sent To Delivery'], color: 'border-purple-500/20 text-purple-400 bg-purple-500/5', dot: 'bg-purple-400' },
                  { stage: 'Delivered', count: pipelineCounts['Delivered'], color: 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5', dot: 'bg-emerald-400' }
                ].map((s, idx) => (
                  <div key={idx} className={`p-3.5 border rounded-2xl flex flex-col items-center justify-center text-center space-y-1.5 transition-transform hover:scale-102 ${s.color}`}>
                    <span className="text-[10px] font-bold uppercase tracking-wider block">{s.stage}</span>
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${s.dot} animate-pulse`} />
                      <span className="text-2xl font-black">{s.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Orders log list */}
            <div className="bg-white/[0.02] border border-white/[0.06] p-6 rounded-[2rem] shadow-premium space-y-6">
              <div className="flex justify-between items-center border-b border-white/[0.06] pb-4">
                <h3 className="font-extrabold text-lg">Incoming Orders Activity Log</h3>
                <Link to="/admin/orders" className="text-xs text-pizza-gold hover:text-white transition-colors flex items-center gap-1">
                  <span>View Full Queue</span>
                  <ChevronRight className="w-4.5 h-4.5" />
                </Link>
              </div>

              <div className="divide-y divide-white/[0.06]">
                {recentOrders.length === 0 ? (
                  <p className="text-xs text-white/35 py-10 text-center">No orders registered in the system yet.</p>
                ) : (
                  recentOrders.map(order => (
                    <div key={order._id} className="py-4 flex justify-between items-center gap-4 first:pt-0 last:pb-0 text-xs">
                      <div>
                        <code className="text-pizza-gold font-bold block">{order._id.slice(-8).toUpperCase()}</code>
                        <span className="text-white/40 block mt-0.5">Placed by: {order.user?.name || 'Customer'}</span>
                      </div>

                      <div className="text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider ${
                          order.status === 'Delivered' 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : 'bg-pizza-primary/10 text-pizza-primary border border-pizza-primary/20 animate-pulse'
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

          </div>

          {/* RIGHT AREA: Control Panel & Status breakdown ring */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Action controls */}
            <div className="bg-white/[0.02] border border-white/[0.06] p-6 rounded-[2rem] shadow-premium space-y-4">
              <h4 className="font-extrabold text-base border-b border-white/[0.06] pb-3">Admin Panel Controls</h4>
              <div className="space-y-3">
                <Link to="/admin/menu" className="flex items-center justify-between p-3.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5 text-xs">
                  <div>
                    <span className="font-bold block">Gourmet Pizza Menu</span>
                    <span className="text-[10px] text-white/40 block mt-0.5">Edit status, prices, description & customizer</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/30" />
                </Link>
                <Link to="/admin/inventory" className="flex items-center justify-between p-3.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5 text-xs">
                  <div>
                    <span className="font-bold block">Ingredient Catalog</span>
                    <span className="text-[10px] text-white/40 block mt-0.5">Edit prices, replenish bases & sauces</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/30" />
                </Link>
                <Link to="/admin/orders" className="flex items-center justify-between p-3.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5 text-xs">
                  <div>
                    <span className="font-bold block">Kitchen Queue Tracker</span>
                    <span className="text-[10px] text-white/40 block mt-0.5">Update preparational order steps</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/30" />
                </Link>
                <Link to="/admin/users" className="flex items-center justify-between p-3.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5 text-xs">
                  <div>
                    <span className="font-bold block">User Accounts Log</span>
                    <span className="text-[10px] text-white/40 block mt-0.5">View user details and role privileges</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/30" />
                </Link>
              </div>
            </div>

            {/* Total distribution circle visual */}
            <div className="bg-white/[0.02] border border-white/[0.06] p-6 rounded-[2rem] shadow-premium text-center space-y-4">
              <h4 className="font-extrabold text-sm text-left text-white tracking-wide border-b border-white/[0.06] pb-3">Delivery Performance</h4>
              
              <div className="relative flex items-center justify-center h-32">
                {/* SVG Progress Ring */}
                {stats.totalOrders > 0 ? (
                  (() => {
                    const deliveredPct = Math.round((pipelineCounts.Delivered / stats.totalOrders) * 100);
                    const strokeDash = 2 * Math.PI * 45; // 282.7
                    const strokeOffset = strokeDash - (deliveredPct / 100) * strokeDash;
                    return (
                      <>
                        <svg className="w-32 h-32 transform -rotate-90">
                          <circle cx="64" cy="64" r="45" stroke="rgba(255,255,255,0.03)" strokeWidth="8" fill="transparent" />
                          <circle
                            cx="64"
                            cy="64"
                            r="45"
                            stroke="#FF7A18"
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={strokeDash}
                            strokeDashoffset={strokeOffset}
                            strokeLinecap="round"
                            className="transition-all duration-1000"
                          />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                          <span className="text-2xl font-black text-white">{deliveredPct}%</span>
                          <span className="text-[9px] text-white/40 uppercase font-bold">Fulfillment</span>
                        </div>
                      </>
                    );
                  })()
                ) : (
                  <div className="text-xs text-white/30">No order conversion records.</div>
                )}
              </div>

              <div className="text-xs text-white/40 leading-relaxed px-2">
                Fulfillment represents the ratio of completed deliveries to total placed orders. Keep queue processing active!
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
