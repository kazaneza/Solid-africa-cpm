import React from 'react';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  ChefHat,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const Dashboard: React.FC = () => {
  // Mock data for demonstration
  const weeklyData = [
    { day: 'Mon', cost: 2.45, meals: 1200 },
    { day: 'Tue', cost: 2.38, meals: 1180 },
    { day: 'Wed', cost: 2.52, meals: 1250 },
    { day: 'Thu', cost: 2.41, meals: 1190 },
    { day: 'Fri', cost: 2.47, meals: 1220 },
    { day: 'Sat', cost: 2.35, meals: 800 },
    { day: 'Sun', cost: 2.40, meals: 850 },
  ];

  const costBreakdown = [
    { name: 'Ingredients', value: 65, color: '#dc2626' },
    { name: 'Salaries', value: 20, color: '#ef4444' },
    { name: 'Transport', value: 10, color: '#f87171' },
    { name: 'Utilities', value: 5, color: '#fca5a5' },
  ];

  const stats = [
    {
      name: 'Total Meals This Week',
      value: '8,690',
      change: '+12%',
      changeType: 'positive',
      icon: ChefHat,
    },
    {
      name: 'Average Cost Per Meal',
      value: '$2.43',
      change: '-3%',
      changeType: 'positive',
      icon: DollarSign,
    },
    {
      name: 'Active Schools',
      value: '24',
      change: '+2',
      changeType: 'positive',
      icon: Users,
    },
    {
      name: 'Weekly Budget Usage',
      value: '87%',
      change: '+5%',
      changeType: 'negative',
      icon: TrendingUp,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Overview of your school feeding program performance
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white overflow-hidden rounded-lg shadow">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className="h-8 w-8 text-solid-red" />
                </div>
                <div className="ml-4 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {stat.value}
                      </div>
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                        stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Cost Per Meal Trend */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Cost Per Meal Trend</h3>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-500">Last 7 days</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value}`, 'Cost per meal']} />
              <Line 
                type="monotone" 
                dataKey="cost" 
                stroke="#dc2626" 
                strokeWidth={3}
                dot={{ fill: '#dc2626', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Cost Breakdown */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Cost Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={costBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {costBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-4">
            {costBreakdown.map((item) => (
              <div key={item.name} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-600">{item.name}: {item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity & Alerts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Meals */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Meal Productions</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {[
              { school: 'Kibera Primary School', meals: 450, cost: '$1,095', time: '2 hours ago' },
              { school: 'Mathare Secondary', meals: 320, cost: '$776', time: '4 hours ago' },
              { school: 'Eastlands Academy', meals: 280, cost: '$679', time: '6 hours ago' },
            ].map((item, index) => (
              <div key={index} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.school}</p>
                    <p className="text-sm text-gray-500">{item.meals} meals served</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{item.cost}</p>
                    <p className="text-xs text-gray-500">{item.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Alerts & Notifications</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {[
              { 
                type: 'warning', 
                message: 'Rice inventory running low at 3 schools',
                time: '1 hour ago'
              },
              { 
                type: 'info', 
                message: 'Weekly cost report ready for review',
                time: '3 hours ago'
              },
              { 
                type: 'success', 
                message: 'Cost per meal decreased by 3% this week',
                time: '1 day ago'
              },
            ].map((alert, index) => (
              <div key={index} className="p-4 hover:bg-gray-50">
                <div className="flex items-start">
                  <AlertCircle className={`h-5 w-5 mt-0.5 mr-3 ${
                    alert.type === 'warning' ? 'text-yellow-500' :
                    alert.type === 'success' ? 'text-green-500' : 'text-blue-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;