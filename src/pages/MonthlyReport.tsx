import React, { useState } from 'react';
import { Calendar, Download, TrendingUp, Users, DollarSign, ChefHat } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const MonthlyReport: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState('2024-01');

  // Mock data
  const monthlyData = {
    month: 'January 2024',
    summary: {
      totalMeals: 149960,
      totalCost: 7872000,
      costPerMeal: 435,
      ingredientCost: 5120000,
      indirectCost: 2752000,
      weeks: 4,
    },
    weeklyTrend: [
      { week: 'Week 1', meals: 37490, cost: 435, totalCost: 1968000 },
      { week: 'Week 2', meals: 37490, cost: 428, totalCost: 1945000 },
      { week: 'Week 3', meals: 37490, cost: 441, totalCost: 1985000 },
      { week: 'Week 4', meals: 37490, cost: 439, totalCost: 1974000 },
    ],
    costBreakdown: [
      { name: 'Ingredients', value: 65, amount: 5120000, color: '#dc2626' },
      { name: 'Salaries', value: 30, amount: 2360000, color: '#ef4444' },
      { name: 'Transport', value: 3, amount: 236000, color: '#f87171' },
      { name: 'Other', value: 2, amount: 156000, color: '#fca5a5' },
    ],
    schoolComparison: [
      { school: 'GS Ruhanga', meals: 75000, cost: 3936000, efficiency: 98.5 },
      { school: 'GS Kagugu', meals: 74960, cost: 3936000, efficiency: 97.8 },
    ],
    ingredientTrends: [
      { ingredient: 'Rice', week1: 600000, week2: 595000, week3: 605000, week4: 600000 },
      { ingredient: 'Kawunga', week1: 240000, week2: 235000, week3: 245000, week4: 240000 },
      { ingredient: 'Dry Beans', week1: 300000, week2: 295000, week3: 305000, week4: 300000 },
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
          <h1 className="text-3xl font-bold text-gray-900">Monthly Report</h1>
          <p className="mt-2 text-lg text-gray-600">
            Comprehensive monthly analysis and trends
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select 
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-solid-red focus:border-solid-red"
          >
            <option value="2024-01">January 2024</option>
            <option value="2023-12">December 2023</option>
            <option value="2023-11">November 2023</option>
          </select>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Month Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">{monthlyData.month}</h2>
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-1" />
            {monthlyData.summary.weeks} weeks of operation
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <ChefHat className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Total Meals</p>
            <p className="text-2xl font-bold text-gray-900">{monthlyData.summary.totalMeals.toLocaleString()}</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Total Cost</p>
            <p className="text-2xl font-bold text-gray-900">{formatRWF(monthlyData.summary.totalCost)}</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <TrendingUp className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Avg Cost/Meal</p>
            <p className="text-2xl font-bold text-gray-900">{monthlyData.summary.costPerMeal} RWF</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Daily Average</p>
            <p className="text-2xl font-bold text-gray-900">{Math.round(monthlyData.summary.totalMeals / 20).toLocaleString()}</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <DollarSign className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Weekly Average</p>
            <p className="text-2xl font-bold text-gray-900">{formatRWF(monthlyData.summary.totalCost / 4)}</p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Trend */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Cost Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData.weeklyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="week" stroke="#6b7280" />
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

        {/* Cost Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Breakdown</h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={monthlyData.costBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {monthlyData.costBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name, props) => [
                    `${value}% (${formatRWF(props.payload.amount)})`, 
                    name
                  ]}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* School Comparison */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">School Performance Comparison</h3>
          <div className="space-y-6">
            {monthlyData.schoolComparison.map((school, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900">{school.school}</h4>
                  <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    {school.efficiency}% efficiency
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-sm text-gray-500">Meals Served</p>
                    <p className="text-lg font-semibold text-gray-900">{school.meals.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Cost</p>
                    <p className="text-lg font-semibold text-gray-900">{formatRWF(school.cost)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Cost/Meal</p>
                    <p className="text-lg font-semibold text-gray-900">{Math.round(school.cost / school.meals)} RWF</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Key Performance Indicators</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Cost Efficiency</p>
                <p className="text-lg font-semibold text-gray-900">98.2%</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-green-600">+2.1% vs last month</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Meal Consistency</p>
                <p className="text-lg font-semibold text-gray-900">99.8%</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-green-600">+0.3% vs last month</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Budget Utilization</p>
                <p className="text-lg font-semibold text-gray-900">94.5%</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-yellow-600">-1.2% vs target</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Quality Score</p>
                <p className="text-lg font-semibold text-gray-900">96.7%</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-green-600">+1.8% vs last month</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cost Breakdown Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Detailed Cost Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Direct Costs</h4>
            <div className="space-y-3">
              {monthlyData.costBreakdown.filter(item => item.name === 'Ingredients').map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">{item.name}</span>
                  <div className="text-right">
                    <span className="font-semibold text-gray-900">{formatRWF(item.amount)}</span>
                    <span className="text-sm text-gray-500 ml-2">({item.value}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Indirect Costs</h4>
            <div className="space-y-3">
              {monthlyData.costBreakdown.filter(item => item.name !== 'Ingredients').map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">{item.name}</span>
                  <div className="text-right">
                    <span className="font-semibold text-gray-900">{formatRWF(item.amount)}</span>
                    <span className="text-sm text-gray-500 ml-2">({item.value}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyReport;