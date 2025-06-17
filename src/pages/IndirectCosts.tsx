import React, { useState } from 'react';
import { Plus, Search, Calculator, Users, Truck, Zap, Save } from 'lucide-react';

const IndirectCosts: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data
  const indirectCosts = [
    {
      id: '1',
      category: 'SALARIES',
      description: 'PC Staff Salaries',
      amount: 13113063,
      month: 1,
      year: 2024,
      date: '2024-01-01'
    },
    {
      id: '2',
      category: 'TRANSPORT',
      description: 'Staff delivery fees',
      amount: 540000,
      month: 1,
      year: 2024,
      date: '2024-01-01'
    },
  ];

  const categories = [
    { id: 'SALARIES', name: 'Salaries', icon: Users, color: 'blue' },
    { id: 'TRANSPORT', name: 'Transport', icon: Truck, color: 'green' },
    { id: 'UTILITIES', name: 'Utilities', icon: Zap, color: 'yellow' },
    { id: 'MAINTENANCE', name: 'Maintenance', icon: Calculator, color: 'purple' },
    { id: 'EQUIPMENT', name: 'Equipment', icon: Calculator, color: 'red' },
    { id: 'ADMINISTRATION', name: 'Administration', icon: Calculator, color: 'gray' },
    { id: 'OTHER', name: 'Other', icon: Calculator, color: 'indigo' },
  ];

  const formatRWF = (value: number) => {
    return new Intl.NumberFormat('rw-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getCategoryInfo = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId) || categories[categories.length - 1];
  };

  const totalMonthlyCosts = indirectCosts.reduce((sum, cost) => sum + cost.amount, 0);

  const AddCostForm = () => (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-6 border w-full max-w-2xl shadow-lg rounded-xl bg-white">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Add Indirect Cost</h3>
          <p className="text-sm text-gray-600 mt-1">Record monthly overhead and operational costs</p>
        </div>
        
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-solid-red focus:border-solid-red">
                <option>Select Category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Month/Year</label>
              <input
                type="month"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-solid-red focus:border-solid-red"
                defaultValue={`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-solid-red focus:border-solid-red"
              placeholder="Brief description of the cost"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Amount (RWF)</label>
            <input
              type="number"
              step="1"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-solid-red focus:border-solid-red"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
            <textarea
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-solid-red focus:border-solid-red"
              placeholder="Any additional details about this cost..."
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
              Save Cost
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
          <h1 className="text-3xl font-bold text-gray-900">Indirect Costs</h1>
          <p className="mt-2 text-lg text-gray-600">
            Manage overhead costs like salaries, transport, and utilities
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-solid-red hover:bg-solid-red-dark transition-colors shadow-sm"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Cost
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <Calculator className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Monthly Total</p>
              <p className="text-2xl font-bold text-gray-900">{formatRWF(totalMonthlyCosts)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Per Meal</p>
              <p className="text-2xl font-bold text-gray-900">364 RWF</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100">
              <Calculator className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Categories</p>
              <p className="text-2xl font-bold text-gray-900">2</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
              <Calculator className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">% of Total Cost</p>
              <p className="text-2xl font-bold text-gray-900">84%</p>
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
                placeholder="Search costs..."
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
                <option key={category.id}>{category.name}</option>
              ))}
            </select>
            <select className="px-4 py-3 border border-gray-300 text-sm rounded-lg focus:ring-2 focus:ring-solid-red focus:border-solid-red">
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Costs List */}
      <div className="space-y-4">
        {indirectCosts.map((cost) => {
          const categoryInfo = getCategoryInfo(cost.category);
          const IconComponent = categoryInfo.icon;
          
          return (
            <div key={cost.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-lg bg-${categoryInfo.color}-100`}>
                    <IconComponent className={`h-6 w-6 text-${categoryInfo.color}-600`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{cost.description}</h3>
                    <p className="text-sm text-gray-500">
                      {categoryInfo.name} • {new Date(cost.year, cost.month - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">{formatRWF(cost.amount)}</p>
                  <p className="text-sm text-gray-500">
                    {((cost.amount / totalMonthlyCosts) * 100).toFixed(1)}% of total
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showAddForm && <AddCostForm />}
    </div>
  );
};

export default IndirectCosts;