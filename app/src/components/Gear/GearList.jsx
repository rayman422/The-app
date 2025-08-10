import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Plus, Edit, Trash2, Search, Filter, GitPullRequest, Ruler, DollarSign, Calendar } from 'lucide-react';

// Sample gear categories
const gearCategories = [
  'Rods',
  'Reels', 
  'Lures',
  'Baits',
  'Lines',
  'Hooks',
  'Tackle Box',
  'Clothing',
  'Accessories'
];

// Sample gear data
const sampleGear = [
  {
    id: 1,
    name: 'Shimano Stradic FL 3000',
    category: 'Reels',
    brand: 'Shimano',
    model: 'Stradic FL 3000',
    condition: 'Excellent',
    purchaseDate: '2023-03-15',
    purchasePrice: 199.99,
    notes: 'Great for light tackle fishing',
    image: 'https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=400&h=300&fit=crop'
  },
  {
    id: 2,
    name: 'Ugly Stik Elite 7ft Medium',
    category: 'Rods',
    brand: 'Ugly Stik',
    model: 'Elite 7ft Medium',
    condition: 'Good',
    purchaseDate: '2022-08-20',
    purchasePrice: 89.99,
    notes: 'Durable and reliable',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
  },
  {
    id: 3,
    name: 'Rapala Original Floating',
    category: 'Lures',
    brand: 'Rapala',
    model: 'Original Floating F11',
    condition: 'New',
    purchaseDate: '2024-01-10',
    purchasePrice: 12.99,
    notes: 'Classic lure for bass and pike',
    image: 'https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=400&h=300&fit=crop'
  }
];

export const GearList = ({ setPage, fishingDB, userId }) => {
  const [gear, setGear] = useState(sampleGear);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingGear, setEditingGear] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const filteredGear = gear
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.brand.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'category':
          return a.category.localeCompare(b.category);
        case 'condition':
          return a.condition.localeCompare(b.condition);
        case 'price':
          return b.purchasePrice - a.purchasePrice;
        case 'date':
          return new Date(b.purchaseDate) - new Date(a.purchaseDate);
        default:
          return 0;
      }
    });

  const addGear = (newGear) => {
    const gearWithId = { ...newGear, id: Date.now() };
    setGear([...gear, gearWithId]);
    setShowAddForm(false);
  };

  const updateGear = (updatedGear) => {
    setGear(gear.map(item => item.id === updatedGear.id ? updatedGear : item));
    setEditingGear(null);
  };

  const deleteGear = (gearId) => {
    setGear(gear.filter(item => item.id !== gearId));
  };

  const getTotalValue = () => {
    return gear.reduce((total, item) => total + (item.purchasePrice || 0), 0);
  };

  const getCategoryCount = (category) => {
    return gear.filter(item => item.category === category).length;
  };

  return (
    <div className="bg-slate-900 p-4 min-h-screen pb-20">
      {/* Header */}
      <div className="flex items-center text-white mb-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setPage('profile')}
          className="p-2 -ml-2 rounded-lg hover:bg-slate-800"
        >
          <ChevronLeft size={24} />
        </motion.button>
        <h1 className="flex-1 text-center text-xl font-bold">Your Gear</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddForm(true)}
          className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-700"
        >
          <Plus size={20} />
        </motion.button>
      </div>

      {/* Stats */}
      <div className="bg-slate-800 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-emerald-400">{gear.length}</div>
            <div className="text-gray-400 text-sm">Total Items</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-400">${getTotalValue().toFixed(2)}</div>
            <div className="text-gray-400 text-sm">Total Value</div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search gear..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-800 text-white rounded-lg border border-slate-700 focus:border-emerald-500 focus:outline-none"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {['all', ...gearCategories].map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
              }`}
            >
              {category === 'all' ? 'All Categories' : `${category} (${getCategoryCount(category)})`}
            </button>
          ))}
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full px-4 py-3 bg-slate-800 text-white rounded-lg border border-slate-700 focus:border-emerald-500 focus:outline-none"
        >
          <option value="name">Sort by Name</option>
          <option value="category">Sort by Category</option>
          <option value="condition">Sort by Condition</option>
          <option value="price">Sort by Price (High to Low)</option>
          <option value="date">Sort by Date (Newest)</option>
        </select>
      </div>

      {/* Gear List */}
      <AnimatePresence mode="wait">
        {showAddForm || editingGear ? (
          <GearForm
            gear={editingGear}
            onSave={editingGear ? updateGear : addGear}
            onCancel={() => {
              setShowAddForm(false);
              setEditingGear(null);
            }}
            categories={gearCategories}
          />
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-3"
          >
            {filteredGear.length === 0 ? (
              <div className="text-center py-20">
                <GitPullRequest size={64} className="mx-auto text-gray-500 mb-4" />
                <h2 className="text-white text-xl font-semibold mb-2">No gear found</h2>
                <p className="text-gray-400">Add your first piece of gear to get started!</p>
              </div>
            ) : (
              filteredGear.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-slate-800 rounded-lg p-4"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-white font-semibold">{item.name}</h3>
                      <p className="text-gray-400 text-sm">{item.brand} {item.model}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          item.condition === 'New' ? 'bg-green-600 text-white' :
                          item.condition === 'Excellent' ? 'bg-blue-600 text-white' :
                          item.condition === 'Good' ? 'bg-yellow-600 text-white' :
                          'bg-red-600 text-white'
                        }`}>
                          {item.condition}
                        </span>
                        <span className="text-gray-500 text-xs">${item.purchasePrice}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => setEditingGear(item)}
                        className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-gray-300"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => deleteGear(item.id)}
                        className="p-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Gear Form Component
const GearForm = ({ gear, onSave, onCancel, categories }) => {
  const [formData, setFormData] = useState({
    name: gear?.name || '',
    category: gear?.category || categories[0],
    brand: gear?.brand || '',
    model: gear?.model || '',
    condition: gear?.condition || 'Good',
    purchaseDate: gear?.purchaseDate || new Date().toISOString().split('T')[0],
    purchasePrice: gear?.purchasePrice || '',
    notes: gear?.notes || '',
    image: gear?.image || 'https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=400&h=300&fit=crop'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...formData, purchasePrice: parseFloat(formData.purchasePrice) || 0 });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-slate-800 rounded-lg p-4"
    >
      <h2 className="text-white text-xl font-bold mb-4">
        {gear ? 'Edit Gear' : 'Add New Gear'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-emerald-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-emerald-500 focus:outline-none"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Brand</label>
            <input
              type="text"
              value={formData.brand}
              onChange={(e) => setFormData({...formData, brand: e.target.value})}
              className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Model</label>
            <input
              type="text"
              value={formData.model}
              onChange={(e) => setFormData({...formData, model: e.target.value})}
              className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Condition</label>
            <select
              value={formData.condition}
              onChange={(e) => setFormData({...formData, condition: e.target.value})}
              className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-emerald-500 focus:outline-none"
            >
              <option value="New">New</option>
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Poor">Poor</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Purchase Price ($)</label>
            <input
              type="number"
              step="0.01"
              value={formData.purchasePrice}
              onChange={(e) => setFormData({...formData, purchasePrice: e.target.value})}
              className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">Purchase Date</label>
          <input
            type="date"
            value={formData.purchaseDate}
            onChange={(e) => setFormData({...formData, purchaseDate: e.target.value})}
            className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">Notes</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
            rows="3"
            className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-emerald-500 focus:outline-none"
            placeholder="Any additional notes about this gear..."
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
          >
            {gear ? 'Update Gear' : 'Add Gear'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-slate-700 text-white py-3 rounded-lg font-medium hover:bg-slate-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </motion.div>
  );
};