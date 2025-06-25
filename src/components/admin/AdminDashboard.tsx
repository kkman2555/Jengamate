
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Package, DollarSign, Activity, TrendingUp, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface DashboardProps {
  users: any[];
  inquiries: any[];
  orders: any[];
}

const AdminDashboard = ({ users, inquiries, orders }: DashboardProps) => {
  // Calculate metrics from real data
  const totalUsers = users.length;
  const totalProducts = 3; // Static for now, can be dynamic later
  const totalSales = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
  const platformEarnings = orders.reduce((sum, order) => sum + (order.commission || 0), 0);

  // Generate monthly sales data from actual orders
  const generateMonthlySalesData = () => {
    const monthlyData = [];
    for (let i = 11; i >= 0; i--) {
      const date = subMonths(new Date(), i);
      const monthStart = startOfMonth(date);
      const monthEnd = endOfMonth(date);
      
      const monthlyOrders = orders.filter(order => {
        const orderDate = new Date(order.created_at);
        return orderDate >= monthStart && orderDate <= monthEnd;
      });
      
      const monthlySales = monthlyOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
      
      monthlyData.push({
        month: format(date, 'MMM'),
        sales: monthlySales,
      });
    }
    return monthlyData;
  };

  // Generate user growth data from actual users
  const generateUserGrowthData = () => {
    const monthlyData = [];
    for (let i = 11; i >= 0; i--) {
      const date = subMonths(new Date(), i);
      const monthStart = startOfMonth(date);
      const monthEnd = endOfMonth(date);
      
      const monthlyUsers = users.filter(user => {
        const userDate = new Date(user.created_at);
        return userDate >= monthStart && userDate <= monthEnd;
      });
      
      monthlyData.push({
        month: format(date, 'MMM'),
        users: monthlyUsers.length,
      });
    }
    return monthlyData;
  };

  const monthlySalesData = generateMonthlySalesData();
  const userGrowthData = generateUserGrowthData();

  // Get recent orders and users (actual data, not sample)
  const recentOrders = orders.slice(0, 10);
  const recentUsers = users.slice(0, 10);

  const getStatusBadge = (status: string) => {
    const variants = {
      'Delivered': 'bg-green-100 text-green-700 border-green-200',
      'Confirmed': 'bg-blue-100 text-blue-700 border-blue-200',
      'Pending': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'Processing': 'bg-orange-100 text-orange-700 border-orange-200',
    };
    return variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getPaymentStatusBadge = (status: string) => {
    return status === 'Paid' 
      ? 'bg-green-100 text-green-700 border-green-200'
      : 'bg-red-100 text-red-700 border-red-200';
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening.</p>
        </div>
        <Button variant="default" className="bg-blue-600 hover:bg-blue-700">
          Generate Report
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
            <div className="p-2 bg-blue-50 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{totalUsers}</div>
            <div className="flex items-center mt-2">
              <Badge className="bg-green-100 text-green-700 border-green-200">Active</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Products</CardTitle>
            <div className="p-2 bg-orange-50 rounded-lg">
              <Package className="h-5 w-5 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{totalProducts}</div>
            <div className="flex items-center mt-2">
              <Badge className="bg-red-100 text-red-700 border-red-200">Low stock</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Sales</CardTitle>
            <div className="p-2 bg-green-50 rounded-lg">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">TZS {totalSales.toLocaleString()}</div>
            <div className="flex items-center mt-2">
              <Badge className="bg-blue-100 text-blue-700 border-blue-200">Last 365 days</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Platform Earnings</CardTitle>
            <div className="p-2 bg-purple-50 rounded-lg">
              <Activity className="h-5 w-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">TZS {platformEarnings.toLocaleString()}</div>
            <div className="flex items-center mt-2">
              <Badge className="bg-orange-100 text-orange-700 border-orange-200">TZS 100k commission</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Monthly Sales (2025)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlySalesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                />
                <YAxis 
                  tickFormatter={(value) => `TZS ${(value / 1000).toFixed(0)}K`}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                />
                <Tooltip 
                  formatter={(value) => [`TZS ${Number(value).toLocaleString()}`, 'Sales']}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#3b82f6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">User Growth (2025)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Bar dataKey="users" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders and Users Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">Recent Orders</CardTitle>
              <p className="text-sm text-gray-600 mt-1">Latest {recentOrders.length} orders</p>
            </div>
            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            {recentOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 uppercase">Order ID</th>
                      <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 uppercase">Payment Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order, index) => (
                      <tr key={order.id} className="border-b border-gray-50">
                        <td className="py-3 px-2 text-sm font-medium text-gray-900">
                          {order.order_number}
                        </td>
                        <td className="py-3 px-2 text-sm text-gray-600">
                          {format(new Date(order.created_at), "dd MMM yyyy")}
                        </td>
                        <td className="py-3 px-2 text-sm font-medium text-gray-900">
                          TZS {(order.total_amount || 0).toLocaleString()}
                        </td>
                        <td className="py-3 px-2">
                          <Badge className={getStatusBadge(order.status)}>
                            {order.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-2">
                          <Badge className={getPaymentStatusBadge(order.paid_amount >= order.total_amount ? 'Paid' : 'Pending')}>
                            {order.paid_amount >= order.total_amount ? 'Paid' : 'Pending'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">No orders yet</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">Recent Users</CardTitle>
              <p className="text-sm text-gray-600 mt-1">Latest {recentUsers.length} registrations</p>
            </div>
            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            {recentUsers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 uppercase">User</th>
                      <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 uppercase">Join Date</th>
                      <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 uppercase">Role</th>
                      <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentUsers.map((user, index) => (
                      <tr key={user.id} className="border-b border-gray-50">
                        <td className="py-3 px-2">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-blue-600">
                                {(user.full_name || user.email || 'U').charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {user.full_name || 'Unknown User'}
                              </div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-2 text-sm text-gray-600">
                          {format(new Date(user.created_at), "dd MMM yyyy")}
                        </td>
                        <td className="py-3 px-2">
                          <Badge className={user.role === 'admin' 
                            ? 'bg-purple-100 text-purple-700 border-purple-200' 
                            : 'bg-gray-100 text-gray-700 border-gray-200'
                          }>
                            {user.role === 'admin' ? 'Admin' : 'Customer'}
                          </Badge>
                        </td>
                        <td className="py-3 px-2">
                          <Badge className="bg-green-100 text-green-700 border-green-200">
                            Active
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">No users yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
