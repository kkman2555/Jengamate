import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface DataTablesProps {
  recentOrders: any[];
  recentUsers: any[];
}

export const DataTables = ({ recentOrders, recentUsers }: DataTablesProps) => {
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
  );
};