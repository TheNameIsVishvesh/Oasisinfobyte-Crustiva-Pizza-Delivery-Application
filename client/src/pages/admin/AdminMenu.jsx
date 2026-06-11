import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { ChefHat, Plus, Edit2, Trash2, AlertTriangle, Sparkles, Check, SlidersHorizontal, Eye, EyeOff, PackageX, DollarSign, Image } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminMenu() {
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedCategoryTab, setSelectedCategoryTab] = useState('all');

  // Form State: Add Pizza
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPrice, setNewPrice] = useState(300);
  const [newCategory, setNewCategory] = useState('veg');
  const [newImage, setNewImage] = useState('/src/assets/pizza-logo.svg');
  const [newIsCustomizable, setNewIsCustomizable] = useState(true);
  const [newStatus, setNewStatus] = useState('available');

  // Form State: Edit Pizza
  const [editingPizza, setEditingPizza] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPrice, setEditPrice] = useState(0);
  const [editCategory, setEditCategory] = useState('veg');
  const [editImage, setEditImage] = useState('');
  const [editIsCustomizable, setEditIsCustomizable] = useState(true);
  const [editStatus, setEditStatus] = useState('available');

  const fetchPizzas = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await API.get('/api/pizzas');
      setPizzas(res.data.data);
    } catch (err) {
      console.error('❌ Failed to fetch pizza catalog:', err.message);
      setError('Failed to fetch the pizza menu list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPizzas();
  }, []);

  const showSuccessMessage = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 4000);
  };

  const handleAddPizza = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!newName || !newDescription || !newPrice) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      const payload = {
        name: newName,
        description: newDescription,
        price: newPrice,
        category: newCategory,
        image: newImage,
        isCustomizable: newIsCustomizable,
        status: newStatus,
      };

      await API.post('/api/pizzas', payload);
      
      // Reset Form State
      setNewName('');
      setNewDescription('');
      setNewPrice(300);
      setNewCategory('veg');
      setNewImage('/src/assets/pizza-logo.svg');
      setNewIsCustomizable(true);
      setNewStatus('available');
      setShowAddForm(false);

      showSuccessMessage('Gourmet pizza recipe added to menu successfully!');
      fetchPizzas();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create pizza recipe.');
    }
  };

  const handleStartEdit = (pizza) => {
    setEditingPizza(pizza);
    setEditName(pizza.name);
    setEditDescription(pizza.description);
    setEditPrice(pizza.price);
    setEditCategory(pizza.category || 'veg');
    setEditImage(pizza.image || '/src/assets/pizza-logo.svg');
    setEditIsCustomizable(pizza.isCustomizable !== undefined ? pizza.isCustomizable : true);
    setEditStatus(pizza.status || 'available');
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingPizza) return;
    setError('');
    setSuccess('');

    try {
      const payload = {
        name: editName,
        description: editDescription,
        price: editPrice,
        category: editCategory,
        image: editImage,
        isCustomizable: editIsCustomizable,
        status: editStatus,
      };

      await API.put(`/api/pizzas/${editingPizza._id}`, payload);
      setEditingPizza(null);
      showSuccessMessage('Pizza recipe settings updated successfully!');
      fetchPizzas();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update pizza configuration.');
    }
  };

  const handleStatusChange = async (pizzaId, statusValue) => {
    setError('');
    setSuccess('');
    try {
      await API.put(`/api/pizzas/${pizzaId}`, { status: statusValue });
      showSuccessMessage(`Pizza status changed to ${statusValue} successfully.`);
      fetchPizzas();
    } catch (err) {
      setError('Failed to update pizza availability status.');
    }
  };

  const handleDeletePizza = async (pizzaId) => {
    if (!window.confirm('Are you absolutely sure you want to delete this gourmet pizza recipe from the menu?')) return;
    setError('');
    setSuccess('');

    try {
      await API.delete(`/api/pizzas/${pizzaId}`);
      showSuccessMessage('Pizza recipe removed from menu.');
      fetchPizzas();
    } catch (err) {
      setError('Failed to delete pizza recipe.');
    }
  };

  const filteredPizzas = selectedCategoryTab === 'all' 
    ? pizzas 
    : pizzas.filter(pizza => pizza.category === selectedCategoryTab);

  // Compute status summary counts
  const availableCount = pizzas.filter(p => p.status === 'available').length;
  const hiddenCount = pizzas.filter(p => p.status === 'hidden').length;
  const outOfStockCount = pizzas.filter(p => p.status === 'out_of_stock').length;

  return (
    <div className="min-h-screen bg-[#0F0B0A] text-white py-12 px-6 relative overflow-x-clip">
      {/* Background blurs */}
      <div className="absolute -right-24 -top-24 w-96 h-96 bg-pizza-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute -left-24 -bottom-24 w-96 h-96 bg-pizza-gold/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto space-y-8 z-10 relative">
        {/* Header Console */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/[0.06] pb-6">
          <div>
            <div className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-pizza-primary/10 border border-pizza-primary/20 text-[10px] font-bold text-pizza-primary uppercase tracking-widest mb-1.5">
              <ChefHat className="w-3.5 h-3.5" />
              <span>Menu Management Console</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight font-sans">Gourmet Pizza Menu</h2>
            <p className="text-xs text-white/50 mt-1">Manage pizzas, set availability status, and control pricing tiers</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-4 py-2.5 bg-gradient-to-r from-pizza-primary to-pizza-secondary text-white font-black uppercase tracking-wider rounded-xl text-xs hover:shadow-glow transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Pizza</span>
            </button>
          </div>
        </div>

        {/* Status Breakdown Mini Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white/[0.01] border border-white/[0.04] p-5 rounded-2xl flex items-center justify-between shadow-premium">
            <div>
              <span className="block text-[10px] text-white/40 uppercase font-semibold">Active Available Pizzas</span>
              <span className="block text-2xl font-black mt-0.5 text-emerald-400">{availableCount}</span>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
          <div className="bg-white/[0.01] border border-white/[0.04] p-5 rounded-2xl flex items-center justify-between shadow-premium">
            <div>
              <span className="block text-[10px] text-white/40 uppercase font-semibold">Temporarily Hidden Pizzas</span>
              <span className="block text-2xl font-black mt-0.5 text-amber-400">{hiddenCount}</span>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
          </div>
          <div className="bg-white/[0.01] border border-white/[0.04] p-5 rounded-2xl flex items-center justify-between shadow-premium">
            <div>
              <span className="block text-[10px] text-white/40 uppercase font-semibold">Out Of Stock Pizzas</span>
              <span className="block text-2xl font-black mt-0.5 text-rose-400">{outOfStockCount}</span>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl flex items-center gap-3 text-xs animate-shake">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl flex items-center gap-3 text-xs">
            <Check className="w-5 h-5 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Add Pizza Form overlay */}
        <AnimatePresence>
          {showAddForm && (
            <motion.form 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onSubmit={handleAddPizza} 
              className="bg-[#17100D] backdrop-blur-xl p-6 rounded-3xl border border-pizza-primary/20 space-y-4 max-w-4xl shadow-premium"
            >
              <h3 className="font-bold text-base text-pizza-primary flex items-center gap-1.5">
                <Plus className="w-4 h-4" />
                <span>Register New Pizza Recipe</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[10px] font-bold text-white/60 uppercase">Pizza Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Margherita Premium"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl focus:border-pizza-primary outline-none transition-all text-xs text-white"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-white/60 uppercase">Base Price (₹)</label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(parseInt(e.target.value))}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl focus:border-pizza-primary outline-none transition-all text-xs text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-white/60 uppercase">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-[#2c2520] border border-white/10 rounded-xl focus:border-pizza-primary outline-none transition-all text-xs text-white"
                  >
                    <option value="veg">Vegetarian</option>
                    <option value="non-veg">Non-Vegetarian</option>
                    <option value="gourmet">Gourmet Signature</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-white/60 uppercase">Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-[#2c2520] border border-white/10 rounded-xl focus:border-pizza-primary outline-none transition-all text-xs text-white"
                  >
                    <option value="available">🟢 Available</option>
                    <option value="hidden">🟡 Temporarily Hidden</option>
                    <option value="out_of_stock">🔴 Out Of Stock</option>
                  </select>
                </div>

                <div className="space-y-1.5 flex items-center pt-6 px-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-white/80 select-none">
                    <input
                      type="checkbox"
                      checked={newIsCustomizable}
                      onChange={(e) => setNewIsCustomizable(e.target.checked)}
                      className="w-4 h-4 rounded border-white/10 text-pizza-primary bg-white/5 accent-pizza-primary focus:ring-pizza-primary"
                    />
                    <span>Customizable by customer?</span>
                  </label>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-white/60 uppercase">Description</label>
                <textarea
                  placeholder="Describe the pizza recipe ingredients..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl focus:border-pizza-primary outline-none transition-all text-xs text-white h-20 resize-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-white/60 uppercase">Image Path (or Asset reference)</label>
                <input
                  type="text"
                  placeholder="/src/assets/margherita.png"
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl focus:border-pizza-primary outline-none transition-all text-xs text-white"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-xs font-bold transition-all">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2.5 bg-pizza-primary hover:bg-pizza-primary/95 text-white font-black rounded-xl text-xs uppercase tracking-wider">
                  Save Pizza
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Edit Pizza modal overlay */}
        <AnimatePresence>
          {editingPizza && (
            <motion.form 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSaveEdit} 
              className="bg-[#1A120F] backdrop-blur-xl p-6 rounded-3xl border border-pizza-gold/20 space-y-4 max-w-4xl shadow-premium"
            >
              <h3 className="font-bold text-base text-pizza-gold flex items-center gap-1.5">
                <Edit2 className="w-4 h-4" />
                <span>Edit Pizza Settings: {editingPizza.name}</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[10px] font-bold text-white/60 uppercase">Pizza Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl focus:border-pizza-primary outline-none transition-all text-xs text-white"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-white/60 uppercase">Price (₹)</label>
                  <input
                    type="number"
                    value={editPrice}
                    onChange={(e) => setEditPrice(parseInt(e.target.value))}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl focus:border-pizza-primary outline-none transition-all text-xs text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-white/60 uppercase">Category</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-[#2c2520] border border-white/10 rounded-xl focus:border-pizza-primary outline-none transition-all text-xs text-white"
                  >
                    <option value="veg">Vegetarian</option>
                    <option value="non-veg">Non-Vegetarian</option>
                    <option value="gourmet">Gourmet Signature</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-white/60 uppercase">Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-[#2c2520] border border-white/10 rounded-xl focus:border-pizza-primary outline-none transition-all text-xs text-white"
                  >
                    <option value="available">🟢 Available</option>
                    <option value="hidden">🟡 Temporarily Hidden</option>
                    <option value="out_of_stock">🔴 Out Of Stock</option>
                  </select>
                </div>

                <div className="space-y-1.5 flex items-center pt-6 px-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-white/80 select-none">
                    <input
                      type="checkbox"
                      checked={editIsCustomizable}
                      onChange={(e) => setEditIsCustomizable(e.target.checked)}
                      className="w-4 h-4 rounded border-white/10 text-pizza-primary bg-white/5 accent-pizza-primary focus:ring-pizza-primary"
                    />
                    <span>Customizable by customer?</span>
                  </label>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-white/60 uppercase">Description</label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl focus:border-pizza-primary outline-none transition-all text-xs text-white h-20 resize-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-white/60 uppercase">Image Path</label>
                <input
                  type="text"
                  value={editImage}
                  onChange={(e) => setEditImage(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl focus:border-pizza-primary outline-none transition-all text-xs text-white"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button type="button" onClick={() => setEditingPizza(null)} className="px-4 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-xs font-bold transition-all">
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
            { id: 'veg', label: 'Vegetarian' },
            { id: 'non-veg', label: 'Non-Vegetarian' },
            { id: 'gourmet', label: 'Gourmet' }
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

        {/* Table representation */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-pizza-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : filteredPizzas.length === 0 ? (
          <p className="text-center py-16 text-white/40 text-xs">No pizzas registered under this category.</p>
        ) : (
          <div className="bg-white/[0.01] backdrop-blur-xl rounded-[2rem] border border-white/[0.06] overflow-hidden shadow-premium">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 text-[10px] uppercase font-black tracking-widest text-white/50 border-b border-white/[0.06]">
                    <th className="py-4.5 px-6">Pizza Info</th>
                    <th className="py-4.5 px-6">Category</th>
                    <th className="py-4.5 px-6">Base Price</th>
                    <th className="py-4.5 px-6">Customization</th>
                    <th className="py-4.5 px-6">Status</th>
                    <th className="py-4.5 px-6">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05] text-xs text-white/80">
                  {filteredPizzas.map((pizzaItem) => (
                    <tr key={pizzaItem._id} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-pizza-charcoal rounded-xl flex items-center justify-center p-1.5 border border-white/5 shrink-0">
                            <img 
                              src={pizzaItem.image.includes('svg') ? '/src/assets/pizza-logo.svg' : pizzaItem.image} 
                              alt={pizzaItem.name} 
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                e.target.src = '/src/assets/pizza-logo.svg';
                              }}
                            />
                          </div>
                          <div>
                            <span className="font-extrabold text-white block">{pizzaItem.name}</span>
                            <span className="text-[10px] text-white/40 block mt-0.5 line-clamp-1 max-w-xs">{pizzaItem.description}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 uppercase tracking-wider text-[10px] text-white/40">
                        {pizzaItem.category === 'veg' ? '🟢 Veg' : pizzaItem.category === 'non-veg' ? '🔴 Non-Veg' : '⭐ Gourmet'}
                      </td>
                      <td className="py-4 px-6 font-extrabold text-pizza-gold">₹{pizzaItem.price}</td>
                      <td className="py-4 px-6 font-mono text-white/40">
                        {pizzaItem.isCustomizable ? (
                          <span className="text-[10px] font-bold text-pizza-primary bg-pizza-primary/10 px-2 py-0.5 rounded-full border border-pizza-primary/10">Customizable</span>
                        ) : (
                          <span className="text-[10px] font-bold text-white/30 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">Standard Only</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <select
                          value={pizzaItem.status || 'available'}
                          onChange={(e) => handleStatusChange(pizzaItem._id, e.target.value)}
                          className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold outline-none transition-all bg-[#0F0B0A]/80 border-white/10 ${
                            pizzaItem.status === 'available'
                              ? 'text-emerald-400 border-emerald-500/20'
                              : pizzaItem.status === 'hidden'
                              ? 'text-amber-400 border-amber-500/20'
                              : 'text-rose-400 border-rose-500/20'
                          }`}
                        >
                          <option value="available">🟢 Available</option>
                          <option value="hidden">🟡 Hidden</option>
                          <option value="out_of_stock">🔴 Out Of Stock</option>
                        </select>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleStartEdit(pizzaItem)}
                            className="p-1.5 bg-white/5 border border-white/10 rounded-lg hover:text-pizza-gold hover:border-pizza-gold/20 transition-all"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeletePizza(pizzaItem._id)}
                            className="p-1.5 bg-white/5 border border-white/10 rounded-lg hover:text-rose-500 hover:border-rose-500/20 transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
