
import React from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Order } from '@/types/admin';

interface OrdersTabProps {
  orders: Order[];
  onRefresh: () => void;
}

const OrdersTab = ({ orders, onRefresh }: OrdersTabProps) => {
  const { toast } = useToast();

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Order status updated successfully",
      });

      onRefresh();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: "Error",
        description: "Failed to update order status. Please try again.",
        variant: "destructive"
      });
    }
  };

  const toggleCommissionPaid = async (orderId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ commission_paid: !currentStatus })
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Commission marked as ${!currentStatus ? 'paid' : 'unpaid'}`,
      });

      onRefresh();
    } catch (error) {
      console.error('Error updating commission status:', error);
      toast({
        title: "Error",
        description: "Failed to update commission status. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Shipped': return 'bg-purple-100 text-purple-800';
      case 'Completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900">Order Management</h2>
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order #</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Paid</TableHead>
              <TableHead>Commission</TableHead>
              <TableHead>Receipt</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.order_number}</TableCell>
                <TableCell>{order.project_name}</TableCell>
                <TableCell>{order.profiles?.full_name || order.profiles?.email}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </TableCell>
                <TableCell>₹{order.total_amount?.toLocaleString()}</TableCell>
                <TableCell>₹{order.paid_amount?.toLocaleString() || 0}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">₹{order.commission?.toLocaleString() || 0}</span>
                    <Button
                      onClick={() => toggleCommissionPaid(order.id, order.commission_paid)}
                      variant="outline"
                      size="sm"
                      className={`text-xs ${
                        order.commission_paid ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'
                      }`}
                    >
                      {order.commission_paid ? 'Paid' : 'Mark Paid'}
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  {order.receipt_url ? (
                    <div className="flex flex-col gap-1 text-xs">
                      <a href={order.receipt_url} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline">
                        View
                      </a>
                      <div>Ref: {order.payment_reference || "--"}</div>
                      <div>Date: {order.payment_date ? order.payment_date : "--"}</div>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">Not uploaded</span>
                  )}
                </TableCell>
                <TableCell>
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    className="text-xs border rounded px-2 py-1"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Completed">Completed</option>
                  </select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default OrdersTab;
