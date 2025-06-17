import React, { useState } from 'react';
import { Plus, Search, ChefHat, Users, Scale, Save } from 'lucide-react';

const ProductionEntry: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data
  const recentProductions = [
    {
      id: '1',
      school: 'GS Ruhanga',
      date: '2024-01-15',
      starchKg: 180,
      vegetablesKg: 120,
      totalKg: 300,
      beneficiaries: 3750,
      costPerMeal: 435,
      totalCost: 1631250
    },
    {
      id: '2',
      school: 'GS Kagugu',
      date: '2024-01-15',
      starchKg: 150,
      vegetablesKg: 100,
      totalKg: 250,
      beneficiaries: 3745,
      costPerMeal: 435,
      totalCost: 1629075
    },
  ];

  const schools = [
    { id: '1', name: 'GS Ruhanga' },
    { id: '2', name: 'GS Kagugu' },
  ];

  const formatRWF = (value: number) => {
    return new Intl.NumberFormat('rw-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const AddProductionForm = () => (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-6 border w-full max-w-3xl shadow-lg rounded-xl bg-white">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Record Meal Production</h3>
          <p className="text-sm text-gray-600 mt-1">Log daily meal production and beneficiary data</p>
        </div>
        
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">School</label>
              <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-solid-red focus:border-solid-red">
                <option>Select School</option>
                {schools.map(school => (
                  <option key={school.id} value={school.id}>
                    {school.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Production Date</label>
              <input
                type="date"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-solid-red focus:border-solid-red"
                defaultValue={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Food Quantities</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Starch (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-solid-red focus:border-solid-red"
                  placeholder="0.0"
                />
                <p className="text-xs text-gray-500 mt-1">Rice, Kawunga, etc.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vegetables (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-solid-red focus:border-solid-red"
                  placeholder="0.0"
                />
                <p className="text-xs text-gray-500 mt-1">Beans, vegetables, etc.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Weight (kg)</label>
                <input
                  type="number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 focus:ring-2 focus:ring-solid-red focus:border-solid-red"
                  placeholder="Auto-calculated"
                  readOnly
                />
                <p className="text-xs text-gray-500 mt-1">Automatically calculated</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Portion Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Starch Portions/kg</label>
                <input
                  type="number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-solid-red focus:border-solid-red"
                  defaultValue="25"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vegetable Portions/kg</label>
                <input
                  type="number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-solid-red focus:border-solid-red"
                  defaultValue="30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Beneficiaries</label>
                <input
                  type="number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-solid-red focus:border-solid-red"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Production Notes</label>
            <textarea
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-solid-red focus:border-solid-red"
              placeholder="Any special notes about today's production..."
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
              Record Production
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
          <h1 className="text-3xl font-bold text-gray-900">Production Entry</h1>
          <p className="mt-2 text-lg text-gray-600">
            Record daily meal production and beneficiary data
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-solid-red hover:bg-solid-red-dark transition-colors shadow-sm"
        >
          <Plus className="h-5 w-5 mr-2" />
          Record Production
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
              <ChefHat className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Today's Meals</p>
              <p className="text-2xl font-bold text-gray-900">7,495</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Beneficiaries</p>
              <p className="text-2xl font-bold text-gray-900">7,495</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100">
              <Scale className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Food</p>
              <p className="text-2xl font-bold text-gray-900">550 kg</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
              <ChefHat className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Cost/Meal</p>
              <p className="text-2xl font-bold text-gray-900">435 RWF</p>
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
                placeholder="Search productions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-solid-red focus:border-solid-red"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <select className="px-4 py-3 border border-gray-300 text-sm rounded-lg focus:ring-2 focus:ring-solid-red focus:border-solid-red">
              <option>All Schools</option>
              {schools.map(school => (
                <option key={school.id}>{school.name}</option>
              ))}
            </select>
            <select className="px-4 py-3 border border-gray-300 text-sm rounded-lg focus:ring-2 focus:ring-solid-red focus:border-solid-red">
              <option>Today</option>
              <option>Yesterday</option>
              <option>This Week</option>
              <option>Last Week</option>
            </select>
          </div>
        </div>
      </div>

      {/* Recent Productions */}
      <div className="space-y-6">
        {recentProductions.map((production) => (
          <div key={production.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{production.school}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(production.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-solid-red">{production.costPerMeal} RWF</p>
                  <p className="text-sm text-gray-500">per meal</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Scale className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Starch</p>
                  <p className="text-xl font-bold text-gray-900">{production.starchKg} kg</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Scale className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Vegetables</p>
                  <p className="text-xl font-bold text-gray-900">{production.vegetablesKg} kg</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <Scale className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Total Weight</p>
                  <p className="text-xl font-bold text-gray-900">{production.totalKg} kg</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Beneficiaries</p>
                  <p className="text-xl font-bold text-gray-900">{production.beneficiaries.toLocaleString()}</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <ChefHat className="h-8 w-8 text-red-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Total Cost</p>
                  <p className="text-xl font-bold text-gray-900">{formatRWF(production.totalCost)}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddForm && <AddProductionForm />}
    </div>
  );
};

export default ProductionEntry;