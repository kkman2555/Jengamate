
import React from 'react';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { Button } from '@/components/ui/button';
import { MetricCards } from '@/components/dashboard/MetricCards';
import { ChartsSection } from '@/components/dashboard/ChartsSection';
import { DataTables } from '@/components/dashboard/DataTables';

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
      <MetricCards 
        totalUsers={totalUsers}
        totalProducts={totalProducts}
        totalSales={totalSales}
        platformEarnings={platformEarnings}
      />

      {/* Charts */}
      <ChartsSection 
        monthlySalesData={monthlySalesData}
        userGrowthData={userGrowthData}
      />

      {/* Recent Orders and Users Tables */}
      <DataTables 
        recentOrders={recentOrders}
        recentUsers={recentUsers}
      />
    </div>
  );
};

export default AdminDashboard;
