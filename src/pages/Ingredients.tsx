import React, { useState } from 'react';
import { Plus, Search, Package, Edit, Trash2, Save } from 'lucide-react';

const Ingredients: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data
  const ingredients = [
    {
      id: '1',
      name: 'Rice',
      unit: 'kg',
      category: 'Starch',
      avgPrice: 1200,
      lastPurchase: '2024-01-15',
      totalPurchased: 2000,
      createdAt: '2023-01-15'
    },
    {
      id: '2',
      name: 'Kawunga',
      unit: 'kg',
      category: 'Starch',
      avgPrice: 800,
      lastPurchase: '2024-01-15',
      totalPurchased: 1200,
      createdAt: '2023-01-15'
    },
    {
      id: '3',
      name: 'Dry Beans',
      unit: 'kg',
      category: 'Protein',
      avgPrice: 1500,
      lastPurchase: '2024-01-15',
      totalPurchased: 800,
      createdAt: '2023-01-15'
    },
    {
      id: '4',
      name: 'Cooking Oil',
      unit: 'ltr',
      category: 'Fat',
      avgPrice: 2500,
      lastPurchase: '2024-01-15',
      totalPurchased: 200,
      createdAt: '2023-01-15'
    },
    {
      id: '5',
      name: 'Salt',
      unit: 'kg',
      category: 'Seasoning',
      avgPrice: 600,
      lastPurchase: '2024-01-15',
      totalPurchased: 100,
      createdAt: '2023-01-15'
    },
  ];

  const categories = ['Starch', 'Protein', 'Fat', 'Seasoning', 'Vegetables', 'Other'];
  const units = ['kg', 'ltr', 'pcs'];

  const formatRWF = (value: number) => {
    return new Intl.NumberFormat('rw-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Starch': 'bg-blue-100 text-blue-800',
      'Protein': 'bg-green-100 text-green-800',
      'Fat': 'bg-yellow-100 text-yellow-800',
      'Seasoning': 'bg-purple-100 text-purple-800',
      'Vegetables': 'bg-green-100 text-green-800',
      'Other': 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || colors.Other;
  };

  const AddIngredientForm = () => (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-6 border w-full max-w-2xl shadow-lg rounded-xl bg-white">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Add New Ingredient</h3>
          <p className="text-sm text-gray-600 mt-1">Register a new ingredient for meal production</p>
        </div>
        
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ingredient Name</label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-solid-red focus:border-solid-red"
              placeholder="Enter ingredient name"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-solid-red focus:border-solid-red">
                <option>Select Category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Unit of Measurement</label>
              <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-solid-red focus:border-solid-red">
                <option>Select Unit</option>
                {units.map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Expected Price Range (RWF)</label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-solid-red focus:border-solid-red"
                placeholder="Min price"
              />
              <input
                type="number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-solid-red focus:border-solid-red"
                placeholder="Max price"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-solid-red focus:border-solid-red"
              placeholder="Additional details about the ingredient..."
            />
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 text-sm font-medium text-white bg-solid-red rounded-lg hover:bg-solid-red-dark transition-colors flex items-center"
            >
              <Save className="h-4 w-4 mr-2" />
              Add Ingredient
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ingredients Management</h1>
          <p className="mt-2 text-lg text-gray-600">
            Manage ingredients used in meal production
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-solid-red hover:bg-solid-red-dark transition-colors shadow-sm"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Ingredient
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Ingredients</p>
              <p className="text-2xl font-bold text-gray-900">{ingredients.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
              <Package className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Categories</p>
              <p className="text-2xl font-bold text-gray-900">{new Set(ingredients.map(i => i.category)).size}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100">
              <Package className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avg Price</p>
              <p className="text-2xl font-bold text-gray-900">1,320 RWF</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
              <Package className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Purchased</p>
              <p className="text-2xl font-bold text-gray-900">4,300 kg</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search ingredients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-solid-red focus:border-solid-red"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <select className="px-4 py-3 border border-gray-300 text-sm rounded-lg focus:ring-2 focus:ring-solid-red focus:border-solid-red">
              <option>All Categories</option>
              {categories.map(category => (
                <option key={category}>{category}</option>
              ))}
            </select>
            <select className="px-4 py-3 border border-gray-300 text-sm rounded-lg focus:ring-2 focus:ring-solid-red focus:border-solid-red">
              <option>All Units</option>
              {units.map(unit => (
                <option key={unit}>{unit}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Ingredients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ingredients.map((ingredient) => (
          <div key={ingredient.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-solid-red/10">
                  <Package className="h-5 w-5 text-solid-red" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{ingredient.name}</h3>
                  <p className="text-sm text-gray-500">per {ingredient.unit}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                  <Edit className="h-4 w-4" />
                </button>
                <button className="p-2 text-red-400 hover:text-red-600 rounded-lg hover:bg-red-50">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Category</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(ingredient.category)}`}>
                  {ingredient.category}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Avg Price</span>
                <span className="text-sm font-semibold text-gray-900">{formatRWF(ingredient.avgPrice)}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Purchased</span>
                <span className="text-sm font-semibold text-gray-900">{ingredient.totalPurchased} {ingredient.unit}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Last Purchase</span>
                <span className="text-sm text-gray-900">{new Date(ingredient.lastPurchase).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Added {new Date(ingredient.createdAt).toLocaleDateString()}</span>
                <span>ID: {ingredient.id}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddForm && <AddIngredientForm />}
    </div>
  );
};

export default Ingredients;