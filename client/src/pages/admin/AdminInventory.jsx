import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { BellRing, Plus, Edit2, Trash2, ArrowUpRight, RotateCcw, AlertTriangle, Sparkles, Check, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminInventory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategoryTab, setSelectedCategoryTab] = useState('all');
  const [reseeding, setReseeding] = useState(false);

  // Form State: Add Ingredient
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('base');
  const [newStock, setNewStock] = useState(50);
  const [newThreshold, setNewThreshold] = useState(10);
  const [newPrice, setNewPrice] = useState(20);

  // Form State: Edit Ingredient
  const [editingItem, setEditingItem] = useState(null);
  const [editStock, setEditStock] = useState(0);
  const [editThreshold, setEditThreshold] = useState(0);
  const [editPrice, setEditPrice] = useState(0);

  const fetchInventory = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await API.get('/api/inventory');
      setItems(res.data.data);
    } catch (err) {
      console.error('❌ Failed to fetch inventory catalog:', err.message);
      setError('Failed to fetch the inventory list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleAddIngredient = async (e) => {
    e.preventDefault();
    setError('');

    if (!newName) return;

    try {
      const payload = {
        name: newName,
        category: newCategory,
        stock: newStock,
        threshold: newThreshold,
        unitPrice: newPrice,
      };

      await API.post('/api/inventory', payload);
      
      // Reset Form State
      setNewName('');
      setNewStock(50);
      setNewThreshold(10);
      setNewPrice(20);
      setShowAddForm(false);

      fetchInventory();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add ingredient.');
    }
  };

  const handleStartEdit = (item) => {
    setEditingItem(item);
    setEditStock(item.stock);
    setEditThreshold(item.threshold);
    setEditPrice(item.unitPrice);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      const payload = {
        stock: editStock,
        threshold: editThreshold,
        unitPrice: editPrice,
      };

      await API.put(`/api/inventory/${editingItem._id}`, payload);
      setEditingItem(null);
      fetchInventory();
    } catch (err) {
      setError('Failed to update ingredient settings.');
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Are you absolutely sure you want to delete this customizer ingredient?')) return;

    try {
      await API.delete(`/api/inventory/${itemId}`);
      fetchInventory();
    } catch (err) {
      setError('Failed to delete ingredient.');
    }
  };

  const handleReseed = async () => {
    if (!window.confirm("WARNING: Reseeding will clear the entire inventory and restore it to default seeding parameters. This action cannot be undone. Do you wish to continue?")) {
      return;
    }
    setReseeding(true);
    setError('');
    try {
      await API.post('/api/inventory/reseed');
      fetchInventory();
      alert("Inventory successfully reseeded to luxury defaults!");
    } catch (err) {
      console.error(err);
      setError("Failed to reseed database inventory. Ensure server side configuration matches dbSeeder.js");
    } finally {
      setReseeding(false);
    }
  };

  // Filter items
  const filteredItems = selectedCategoryTab === 'all' 
    ? items 
    : items.filter(item => item.category === selectedCategoryTab);

  return (
    <div className="min-h-screen bg-[#0F0B0A] text-white py-12 px-6 relative overflow-x-clip">
      <div className="absolute -right-24 -top-24 w-96 h-96 bg-pizza-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute -left-24 -bottom-24 w-96 h-96 bg-pizza-gold/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto space-y-8 z-10 relative">
        
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/[0.06] pb-6">
          <div>
            <div className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-pizza-primary/10 border border-pizza-primary/20 text-[10px] font-bold text-pizza-primary uppercase tracking-widest mb-1.5">
              <Sparkles className="w-3 h-3" />
              <span>Catalog & Warehouse</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight">Ingredient Inventory</h2>
            <p className="text-xs text-white/50 mt-1">Manage active stock thresholds, customizer options, and prices</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleReseed}
              disabled={reseeding}
              className="px-4 py-2.5 bg-rose-500/10 hover:bg-rose-500/15 border border-rose-500/20 disabled:opacity-40 text-rose-400 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${reseeding ? 'animate-spin' : ''}`} />
              <span>Reseed Baseline Inventory</span>
            </button>

            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-4 py-2.5 bg-gradient-to-r from-pizza-primary to-pizza-secondary text-white font-black uppercase tracking-wider rounded-xl text-xs hover:shadow-glow transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Topping</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl flex items-center gap-3 text-xs">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Overlay: Add Ingredient */}
        <AnimatePresence>
          {showAddForm && (
            <motion.form 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onSubmit={handleAddIngredient} 
              className="bg-white/[0.02] backdrop-blur-xl p-6 rounded-3xl border border-pizza-primary/20 space-y-4 max-w-4xl shadow-premium"
            >
              <h3 className="font-bold text-base text-pizza-primary flex items-center gap-1.5">
                <Plus className="w-4 h-4" />
                <span>Register New Ingredient</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-white/60 uppercase">Ingredient Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Sliced Mushrooms"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl focus:border-pizza-primary outline-none transition-all text-xs text-white"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-white/60 uppercase">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-[#2c2520] border border-white/10 rounded-xl focus:border-pizza-primary outline-none transition-all text-xs text-white"
                  >
                    <option value="base">Base Dough</option>
                    <option value="sauce">Pizza Sauce</option>
                    <option value="cheese">Cheese variety</option>
                    <option value="veggies">Veggie Topping</option>
                    <option value="meat">Meat Topping</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-white/60 uppercase">Stock Level (Units)</label>
                  <input
                    type="number"
                    value={newStock}
                    onChange={(e) => setNewStock(parseInt(e.target.value))}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl focus:border-pizza-primary outline-none transition-all text-xs text-white"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-white/60 uppercase">Warning Threshold</label>
                  <input
                    type="number"
                    value={newThreshold}
                    onChange={(e) => setNewThreshold(parseInt(e.target.value))}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl focus:border-pizza-primary outline-none transition-all text-xs text-white"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-white/60 uppercase">Topping Price (₹)</label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(parseInt(e.target.value))}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl focus:border-pizza-primary outline-none transition-all text-xs text-white"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-xs font-bold transition-all">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2.5 bg-pizza-primary hover:bg-pizza-primary/95 text-white font-black rounded-xl text-xs uppercase tracking-wider">
                  Save Ingredient
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Form Modal: Edit Ingredient overlay */}
        <AnimatePresence>
          {editingItem && (
            <motion.form 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSaveEdit} 
              className="bg-white/[0.02] backdrop-blur-xl p-6 rounded-3xl border border-pizza-gold/20 space-y-4 max-w-4xl shadow-premium"
            >
              <h3 className="font-bold text-base text-pizza-gold flex items-center gap-1.5">
                <Edit2 className="w-4 h-4" />
                <span>Edit Ingredient Settings: {editingItem.name}</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-white/60 uppercase">Stock Level (Units)</label>
                  <input
                    type="number"
                    value={editStock}
                    onChange={(e) => setEditStock(parseInt(e.target.value))}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl focus:border-pizza-primary outline-none transition-all text-xs text-white"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-white/60 uppercase">Warning Threshold</label>
                  <input
                    type="number"
                    value={editThreshold}
                    onChange={(e) => setEditThreshold(parseInt(e.target.value))}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl focus:border-pizza-primary outline-none transition-all text-xs text-white"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-white/60 uppercase">Topping Price (₹)</label>
                  <input
                    type="number"
                    value={editPrice}
                    onChange={(e) => setEditPrice(parseInt(e.target.value))}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl focus:border-pizza-primary outline-none transition-all text-xs text-white"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button type="button" onClick={() => setEditingItem(null)} className="px-4 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-xs font-bold transition-all">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2.5 bg-pizza-gold hover:bg-pizza-gold/95 text-pizza-dark font-black rounded-xl text-xs uppercase tracking-wider">
                  Apply Updates
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Category Filters Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-white/[0.04]">
          <SlidersHorizontal className="w-4 h-4 text-pizza-gray shrink-0 mr-1" />
          {[
            { id: 'all', label: 'Show All' },
            { id: 'base', label: 'Crust Bases' },
            { id: 'sauce', label: 'Pizza Sauces' },
            { id: 'cheese', label: 'Cheese Blends' },
            { id: 'veggies', label: 'Veggie Toppings' },
            { id: 'meat', label: 'Meat Toppings' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategoryTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 ${
                selectedCategoryTab === tab.id
                  ? 'bg-gradient-to-r from-pizza-primary/15 to-pizza-gold/5 border-pizza-primary text-white shadow-glow'
                  : 'bg-white/5 border-white/5 text-pizza-gray hover:text-white hover:border-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tabular stock listing */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-pizza-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : filteredItems.length === 0 ? (
          <p className="text-center py-16 text-white/40 text-xs">No ingredients found under this category.</p>
        ) : (
          <div className="bg-white/[0.01] backdrop-blur-xl rounded-[2rem] border border-white/[0.06] overflow-hidden shadow-premium">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 text-[10px] uppercase font-black tracking-widest text-white/50 border-b border-white/[0.06]">
                    <th className="py-4.5 px-6">Ingredient Name</th>
                    <th className="py-4.5 px-6">Category</th>
                    <th className="py-4.5 px-6">Active Stock</th>
                    <th className="py-4.5 px-6">Safety Threshold</th>
                    <th className="py-4.5 px-6">Topping Price</th>
                    <th className="py-4.5 px-6">Status Alerts</th>
                    <th className="py-4.5 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05] text-xs text-white/80">
                  {filteredItems.map((item) => {
                    const isLowStock = item.stock <= item.threshold;
                    return (
                      <tr key={item._id} className={`hover:bg-white/5 transition-colors ${isLowStock ? 'bg-rose-500/5' : ''}`}>
                        <td className="py-4 px-6 font-extrabold text-white">{item.name}</td>
                        <td className="py-4 px-6 uppercase tracking-wider text-[10px] text-white/40">
                          {item.category === 'base' ? 'Crust' : item.category === 'sauce' ? 'Sauce' : item.category === 'cheese' ? 'Cheese' : item.category}
                        </td>
                        <td className="py-4 px-6 font-mono font-bold">{item.stock} units</td>
                        <td className="py-4 px-6 font-mono text-white/40">{item.threshold} units</td>
                        <td className="py-4 px-6 font-extrabold text-pizza-gold">₹{item.unitPrice}</td>
                        <td className="py-4 px-6">
                          {isLowStock ? (
                            <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 rounded-full animate-pulse">
                              <BellRing className="w-3.5 h-3.5" />
                              <span>Low Stock Warning</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                              <Check className="w-3 h-3" />
                              <span>Fully Primed</span>
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleStartEdit(item)}
                              className="p-1.5 bg-white/5 border border-white/10 rounded-lg hover:text-pizza-gold hover:border-pizza-gold/20 transition-all"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item._id)}
                              className="p-1.5 bg-white/5 border border-white/10 rounded-lg hover:text-rose-500 hover:border-rose-500/20 transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
