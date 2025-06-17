import React, { useState } from 'react';
import { Calendar, Download, TrendingUp, Users, DollarSign, ChefHat } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const WeeklyReport: React.FC = () => {
  const [selectedWeek, setSelectedWeek] = useState('2024-W03');

  // Mock data
  const weeklyData = {
    week: 'Week 3, 2024',
    startDate: '2024-01-15',
    endDate: '2024-01-19',
    summary: {
      totalMeals: 37490,
      totalCost: 1968000,
      costPerMeal: 435,
      ingredientCost: 1280000,
      indirectCost: 688000,
    },
    dailyBreakdown: [
      { day: 'Monday', meals: 7495, cost: 435, ingredientCost: 256000, indirectCost: 137600 },
      { day: 'Tuesday', meals: 7520, cost: 428, ingredientCost: 258000, indirectCost: 137600 },
      { day: 'Wednesday', meals: 7480, cost: 441, ingredientCost: 255000, indirectCost: 137600 },
      { day: 'Thursday', meals: 7505, cost: 435, ingredientCost: 256500, indirectCost: 137600 },
      { day: 'Friday', meals: 7490, cost: 439, ingredientCost: 254500, indirectCost: 137600 },
    ],
    schoolBreakdown: [
      { school: 'GS Ruhanga', meals: 18750, cost: 8156250, percentage: 50.1 },
      { school: 'GS Kagugu', meals: 18740, cost: 8151900, percentage: 49.9 },
    ],
    ingredientBreakdown: [
      { ingredient: 'Rice', quantity: 500, cost: 600000, percentage: 46.9 },
      { ingredient: 'Kawunga', quantity: 300, cost: 240000, percentage: 18.8 },
      { ingredient: 'Dry Beans', quantity: 200, cost: 300000, percentage: 23.4 },
      { ingredient: 'Cooking Oil', quantity: 50, cost: 125000, percentage: 9.8 },
      { ingredient: 'Salt', quantity: 25, cost: 15000, percentage: 1.2 },
    ]
  };

  const formatRWF = (value: number) => {
    return new Intl.NumberFormat('rw-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Weekly Report</h1>
          <p className="mt-2 text-lg text-gray-600">
            Detailed analysis of weekly meal production and costs
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select 
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-solid-red focus:border-solid-red"
          >
            <option value="2024-W03">Week 3, 2024</option>
            <option value="2024-W02">Week 2, 2024</option>
            <option value="2024-W01">Week 1, 2024</option>
          </select>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Week Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">{weeklyData.week}</h2>
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-1" />
            {new Date(weeklyData.startDate).toLocaleDateString()} - {new Date(weeklyData.endDate).toLocaleDateString()}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <ChefHat className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Total Meals</p>
            <p className="text-2xl font-bold text-gray-900">{weeklyData.summary.totalMeals.toLocaleString()}</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Total Cost</p>
            <p className="text-2xl font-bold text-gray-900">{formatRWF(weeklyData.summary.totalCost)}</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <TrendingUp className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Cost Per Meal</p>
            <p className="text-2xl font-bold text-gray-900">{weeklyData.summary.costPerMeal} RWF</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Daily Average</p>
            <p className="text-2xl font-bold text-gray-900">{Math.round(weeklyData.summary.totalMeals / 5).toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Daily Meals Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Meal Production</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData.dailyBreakdown}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="day" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                formatter={(value) => [value.toLocaleString(), 'Meals']}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="meals" fill="#dc2626" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Daily Cost Trend */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Cost Per Meal</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyData.dailyBreakdown}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="day" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                formatter={(value) => [`${value} RWF`, 'Cost per meal']}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="cost" 
                stroke="#dc2626" 
                strokeWidth={3}
                dot={{ fill: '#dc2626', strokeWidth: 2, r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* School Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">School Performance</h3>
          <div className="space-y-4">
            {weeklyData.schoolBreakdown.map((school, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{school.school}</p>
                  <p className="text-sm text-gray-500">{school.meals.toLocaleString()} meals ({school.percentage}%)</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{formatRWF(school.cost)}</p>
                  <p className="text-sm text-gray-500">{Math.round(school.cost / school.meals)} RWF/meal</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ingredient Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ingredient Costs</h3>
          <div className="space-y-4">
            {weeklyData.ingredientBreakdown.map((ingredient, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{ingredient.ingredient}</p>
                  <p className="text-sm text-gray-500">{ingredient.quantity} kg ({ingredient.percentage}%)</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{formatRWF(ingredient.cost)}</p>
                  <p className="text-sm text-gray-500">{formatRWF(ingredient.cost / ingredient.quantity)}/kg</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cost Analysis */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Cost Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Direct Costs (Ingredients)</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Ingredient Cost</span>
                <span className="font-semibold">{formatRWF(weeklyData.summary.ingredientCost)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Per Meal</span>
                <span className="font-semibold">{Math.round(weeklyData.summary.ingredientCost / weeklyData.summary.totalMeals)} RWF</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">% of Total Cost</span>
                <span className="font-semibold">{Math.round((weeklyData.summary.ingredientCost / weeklyData.summary.totalCost) * 100)}%</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Indirect Costs (Overhead)</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Indirect Cost</span>
                <span className="font-semibold">{formatRWF(weeklyData.summary.indirectCost)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Per Meal</span>
                <span className="font-semibold">{Math.round(weeklyData.summary.indirectCost / weeklyData.summary.totalMeals)} RWF</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">% of Total Cost</span>
                <span className="font-semibold">{Math.round((weeklyData.summary.indirectCost / weeklyData.summary.totalCost) * 100)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyReport;