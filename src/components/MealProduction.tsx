import React, { useState } from 'react';
import { Plus, Search, Filter, ChefHat, Users, DollarSign } from 'lucide-react';

const MealProduction: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data
  const mealProductions = [
    {
      id: '1',
      school: 'Kibera Primary School',
      mealType: 'lunch',
      studentsServed: 450,
      productionDate: '2024-01-15',
      directCost: 540.00,
      indirectCost: 135.00,
      totalCost: 675.00,
      costPerMeal: 1.50,
      ingredients: [
        { name: 'Rice', quantity: 15, unit: 'kg', cost: 18.00 },
        { name: 'Beans', quantity: 8, unit: 'kg', cost: 20.00 },
        { name: 'Cooking Oil', quantity: 2, unit: 'liters', cost: 7.60 },
      ]
    },
    {
      id: '2',
      school: 'Mathare Secondary',
      mealType: 'lunch',
      studentsServed: 320,
      productionDate: '2024-01-15',
      directCost: 384.00,
      indirectCost: 96.00,
      totalCost: 480.00,
      costPerMeal: 1.50,
      ingredients: [
        { name: 'Rice', quantity: 12, unit: 'kg', cost: 14.40 },
        { name: 'Beans', quantity: 6, unit: 'kg', cost: 15.00 },
        { name: 'Vegetables', quantity: 4, unit: 'kg', cost: 8.00 },
      ]
    },
  ];

  const AddMealForm = () => (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Record Meal Production</h3>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">School</label>
                <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-solid-red focus:ring-solid-red">
                  <option>Select School</option>
                  <option>Kibera Primary School</option>
                  <option>Mathare Secondary</option>
                  <option>Eastlands Academy</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Meal Type</label>
                <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-solid-red focus:ring-solid-red">
                  <option>Select Meal Type</option>
                  <option>breakfast</option>
                  <option>lunch</option>
                  <option>dinner</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Students Served</label>
                <input
                  type="number"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-solid-red focus:ring-solid-red"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Production Date</label>
                <input
                  type="date"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-solid-red focus:ring-solid-red"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ingredients Used</label>
              <div className="space-y-3">
                {[1, 2, 3].map((index) => (
                  <div key={index} className="grid grid-cols-4 gap-2">
                    <select className="rounded-md border-gray-300 shadow-sm focus:border-solid-red focus:ring-solid-red">
                      <option>Select Ingredient</option>
                      <option>Rice</option>
                      <option>Beans</option>
                      <option>Cooking Oil</option>
                    </select>
                    <input
                      type="number"
                      placeholder="Quantity"
                      className="rounded-md border-gray-300 shadow-sm focus:border-solid-red focus:ring-solid-red"
                    />
                    <input
                      type="text"
                      placeholder="Unit"
                      className="rounded-md border-gray-300 shadow-sm focus:border-solid-red focus:ring-solid-red"
                    />
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Cost ($)"
                      className="rounded-md border-gray-300 shadow-sm focus:border-solid-red focus:ring-solid-red"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Indirect Cost Allocation ($)</label>
              <input
                type="number"
                step="0.01"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-solid-red focus:ring-solid-red"
                placeholder="0.00"
              />
              <p className="mt-1 text-xs text-gray-500">
                Portion of salaries, transport, and other overhead costs for this meal
              </p>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-solid-red rounded-md hover:bg-solid-red-dark"
              >
                Record Meal Production
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meal Production</h1>
          <p className="mt-1 text-sm text-gray-600">
            Record and track meal production across all schools
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-solid-red hover:bg-solid-red-dark"
        >
          <Plus className="h-4 w-4 mr-2" />
          Record Meal
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <ChefHat className="h-8 w-8 text-solid-red" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Today's Meals</p>
              <p className="text-2xl font-bold text-gray-900">1,240</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-solid-red" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Students Fed</p>
              <p className="text-2xl font-bold text-gray-900">1,240</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-solid-red" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Cost</p>
              <p className="text-2xl font-bold text-gray-900">$1,860</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-solid-red" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avg Cost/Meal</p>
              <p className="text-2xl font-bold text-gray-900">$1.50</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search meal productions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-solid-red focus:border-solid-red"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select className="px-3 py-2 border border-gray-300 text-sm rounded-md focus:ring-solid-red focus:border-solid-red">
              <option>All Schools</option>
              <option>Kibera Primary School</option>
              <option>Mathare Secondary</option>
              <option>Eastlands Academy</option>
            </select>
            <select className="px-3 py-2 border border-gray-300 text-sm rounded-md focus:ring-solid-red focus:border-solid-red">
              <option>All Meal Types</option>
              <option>Breakfast</option>
              <option>Lunch</option>
              <option>Dinner</option>
            </select>
          </div>
        </div>
      </div>

      {/* Meal Productions List */}
      <div className="space-y-4">
        {mealProductions.map((meal) => (
          <div key={meal.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{meal.school}</h3>
                  <p className="text-sm text-gray-500">
                    {meal.mealType.charAt(0).toUpperCase() + meal.mealType.slice(1)} • {meal.productionDate}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-solid-red">${meal.costPerMeal.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">per meal</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Students Served</p>
                  <p className="text-xl font-semibold text-gray-900">{meal.studentsServed}</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Direct Cost</p>
                  <p className="text-xl font-semibold text-gray-900">${meal.directCost.toFixed(2)}</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Indirect Cost</p>
                  <p className="text-xl font-semibold text-gray-900">${meal.indirectCost.toFixed(2)}</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Total Cost</p>
                  <p className="text-xl font-semibold text-solid-red">${meal.totalCost.toFixed(2)}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Ingredients Used</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {meal.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-sm text-gray-900">
                        {ingredient.name} ({ingredient.quantity} {ingredient.unit})
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        ${ingredient.cost.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddForm && <AddMealForm />}
    </div>
  );
};

export default MealProduction;