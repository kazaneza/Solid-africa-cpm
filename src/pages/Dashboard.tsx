import React from 'react';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  ChefHat,
  Calendar,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const Dashboard: React.FC = () => {
  // Mock data for demonstration
  const weeklyData = [
    { day: 'Mon', cost: 434, meals: 7495 },
    { day: 'Tue', cost: 428, meals: 7520 },
    { day: 'Wed', cost: 441, meals: 7480 },
    { day: 'Thu', cost: 435, meals: 7505 },
    { day: 'Fri', cost: 439, meals: 7490 },
  ];

  const costBreakdown = [
    { name: 'Ingredients', value: 65, color: '#dc2626', amount: 1280000 },
    { name: 'Salaries', value: 30, color: '#ef4444', amount: 590000 },
    { name: 'Transport', value: 3, color: '#f87171', amount: 59000 },
    { name: 'Other', value: 2, color: '#fca5a5', amount: 39000 },
  ];

  const stats = [
    {
      name: 'Total Meals This Week',
      value: '37,490',
      change: '+2.1%',
      changeType: 'positive',
      icon: ChefHat,
      subtext: '7,498 avg/day'
    },
    {
      name: 'Cost Per Meal',
      value: '435 RWF',
      change: '-1.2%',
      changeType: 'positive',
      icon: DollarSign,
      subtext: 'Including overhead'
    },
    {
      name: 'Active Schools',
      value: '2',
      change: '0',
      changeType: 'neutral',
      icon: Users,
      subtext: 'GS Ruhanga, GS Kagugu'
    },
    {
      name: 'Weekly Budget Usage',
      value: '89%',
      change: '+3%',
      changeType: 'negative',
      icon: TrendingUp,
      subtext: '1.97M RWF spent'
    },
  ];

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
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-lg text-gray-600">
          Overview of your school feeding program performance
        </p>
        <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            Week of January 15-19, 2024
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            2 Schools Active
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white overflow-hidden rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-solid-red/10">
                    <stat.icon className="h-6 w-6 text-solid-red" />
                  </div>
                </div>
                <div className="ml-4 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-bold text-gray-900">
                        {stat.value}
                      </div>
                      {stat.change !== '0' && (
                        <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                          stat.changeType === 'positive' ? 'text-green-600' : 
                          stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-500'
                        }`}>
                          {stat.changeType === 'positive' ? (
                            <ArrowDownRight className="h-3 w-3 mr-1" />
                          ) : stat.changeType === 'negative' ? (
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                          ) : null}
                          {stat.change}
                        </div>
                      )}
                    </dd>
                    <dd className="text-xs text-gray-500 mt-1">{stat.subtext}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Cost Per Meal Trend */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Daily Cost Per Meal</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>This Week</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="day" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                formatter={(value) => [`${value} RWF`, 'Cost per meal']}
                labelStyle={{ color: '#374151' }}
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
                activeDot={{ r: 7, stroke: '#dc2626', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Cost Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Weekly Cost Breakdown</h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={costBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {costBreakdown.map((entry, index) => (
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
          <div className="mt-6 grid grid-cols-2 gap-4">
            {costBreakdown.map((item) => (
              <div key={item.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-3"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium text-gray-700">{item.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">{item.value}%</div>
                  <div className="text-xs text-gray-500">{formatRWF(item.amount)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity & Alerts */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Recent Productions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Recent Meal Productions</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {[
              { school: 'GS Ruhanga', meals: 3750, cost: formatRWF(1631250), time: '2 hours ago' },
              { school: 'GS Kagugu', meals: 3745, cost: formatRWF(1629075), time: '2 hours ago' },
              { school: 'GS Ruhanga', meals: 3760, cost: formatRWF(1635760), time: '1 day ago' },
            ].map((item, index) => (
              <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.school}</p>
                    <p className="text-sm text-gray-500">{item.meals.toLocaleString()} meals served</p>
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Alerts & Notifications</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {[
              { 
                type: 'warning', 
                message: 'Rice inventory running low - reorder needed',
                time: '1 hour ago'
              },
              { 
                type: 'info', 
                message: 'Weekly cost report ready for review',
                time: '3 hours ago'
              },
              { 
                type: 'success', 
                message: 'Cost per meal decreased by 1.2% this week',
                time: '1 day ago'
              },
            ].map((alert, index) => (
              <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
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