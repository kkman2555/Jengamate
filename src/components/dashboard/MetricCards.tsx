import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Package, DollarSign, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface MetricCardsProps {
  totalUsers: number;
  totalProducts: number;
  totalSales: number;
  platformEarnings: number;
}

export const MetricCards = ({ totalUsers, totalProducts, totalSales, platformEarnings }: MetricCardsProps) => {
  return (
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
  );
};