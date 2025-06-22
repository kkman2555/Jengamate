
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Package, ShoppingCart, DollarSign, TrendingUp, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface DashboardProps {
  users: any[];
  inquiries: any[];
  orders: any[];
}

const AdminDashboard = ({ users, inquiries, orders }: DashboardProps) => {
  // Calculate metrics
  const totalUsers = users.length;
  const totalInquiries = inquiries.length;
  const totalSales = orders.reduce((sum, order) => sum + order.total_amount, 0);
  const platformEarnings = orders.reduce((sum, order) => sum + (order.commission || 0), 0);

  // Sample data for charts
  const monthlySalesData = [
    { month: 'Jan', sales: 1200000 },
    { month: 'Feb', sales: 1100000 },
    { month: 'Mar', sales: 1300000 },
    { month: 'Apr', sales: 1500000 },
    { month: 'May', sales: 1800000 },
    { month: 'Jun', sales: 1600000 },
    { month: 'Jul', sales: 1400000 },
    { month: 'Aug', sales: 1200000 },
    { month: 'Sep', sales: 1100000 },
    { month: 'Oct', sales: 900000 },
    { month: 'Nov', sales: 800000 },
    { month: 'Dec', sales: 700000 }
  ];

  const userGrowthData = [
    { month: 'Jan', users: 2 },
    { month: 'Feb', users: 3 },
    { month: 'Mar', users: 4 },
    { month: 'Apr', users: 6 },
    { month: 'May', users: 8 },
    { month: 'Jun', users: 10 },
    { month: 'Jul', users: 12 },
    { month: 'Aug', users: 15 },
    { month: 'Sep', users: 18 },
    { month: 'Oct', users: 20 },
    { month: 'Nov', users: 22 },
    { month: 'Dec', users: 25 }
  ];

  const recentOrders = orders.slice(0, 5);
  const recentUsers = users.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <div className="text-xs text-green-600 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              Active
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInquiries}</div>
            <div className="text-xs text-red-600">
              Low on stock
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">TZS {totalSales.toLocaleString()}</div>
            <div className="text-xs text-blue-600">
              Low risk assets
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform Earnings</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">TZS {platformEarnings.toLocaleString()}</div>
            <div className="text-xs text-orange-600">
              TZS 150K HHI commitment
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Sales (2025)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlySalesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `TZS ${(value / 1000000).toFixed(1)}M`} />
                <Tooltip formatter={(value) => [`TZS ${Number(value).toLocaleString()}`, 'Sales']} />
                <Line type="monotone" dataKey="sales" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Growth (2025)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="users" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders and Users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <div className="text-sm text-muted-foreground">View All</div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order, index) => (
                <div key={order.id} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <div className="font-medium">{order.order_number}</div>
                    <div className="text-sm text-muted-foreground">{order.project_name}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">TZS {order.total_amount.toLocaleString()}</div>
                    <div className={`text-xs px-2 py-1 rounded ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {order.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
            <div className="text-sm text-muted-foreground">View All</div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsers.map((user, index) => (
                <div key={user.id} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <div className="font-medium">{user.full_name || 'N/A'}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">{new Date(user.created_at).toLocaleDateString()}</div>
                    <div className={`text-xs px-2 py-1 rounded ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {user.role}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
