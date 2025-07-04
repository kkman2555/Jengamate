import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Order } from '@/types/admin';
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Download, DollarSign } from 'lucide-react';
import { useOrderManagement } from '@/hooks/useOrderManagement';
import { OrderStatusBadge } from '@/components/orders/OrderStatusBadge';
import { OrderActions } from '@/components/orders/OrderActions';

interface OrdersTabProps {
  orders: Order[];
  onRefresh: () => void;
}

const OrdersTab = ({ orders, onRefresh }: OrdersTabProps) => {
  const navigate = useNavigate();
  const { handleExportCSV, handleMarkCommissionPaid } = useOrderManagement(orders, onRefresh);

  const columns = [
    {
      accessorKey: 'order_number',
      header: 'Order #',
      cell: (order: Order) => (
        <span className="font-medium">{order.order_number}</span>
      ),
    },
    {
      accessorKey: 'project_name',
      header: 'Project Name',
      cell: (order: Order) => order.project_name,
    },
    {
      accessorKey: 'profiles',
      header: 'Customer',
      cell: (order: Order) => order.profiles?.full_name || 'N/A',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: (order: Order) => <OrderStatusBadge status={order.status} />,
    },
    {
      accessorKey: 'total_amount',
      header: 'Total Amount',
      cell: (order: Order) => (
        <span className="font-medium">TSh{order.total_amount.toLocaleString()}</span>
      ),
    },
    {
      accessorKey: 'paid_amount',
      header: 'Paid Amount',
      cell: (order: Order) => (
        <span className="text-green-600 font-medium">
          TSh{(order.paid_amount || 0).toLocaleString()}
        </span>
      ),
    },
    {
      accessorKey: 'commission',
      header: 'Commission',
      cell: (order: Order) => (
        <div className="flex items-center gap-2">
          <span className="font-medium">TSh{(order.commission || 0).toLocaleString()}</span>
          {order.commission_paid ? (
            <OrderStatusBadge status="Paid" />
          ) : (
            <OrderStatusBadge status="Pending" />
          )}
        </div>
      ),
    },
    {
      accessorKey: 'created_at',
      header: 'Order Date',
      cell: (order: Order) => format(new Date(order.created_at), "dd MMM yyyy"),
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      cell: (order: Order) => (
        <OrderActions 
          order={order} 
          onRefresh={onRefresh}
        />
      ),
      enableSorting: false,
    },
  ];

  if (!orders || orders.length === 0) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-muted-foreground" />
            No Orders
          </CardTitle>
          <CardDescription>There are currently no orders in the system.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const totalRevenue = orders.reduce((sum, order) => sum + order.total_amount, 0);
  const totalCommission = orders.reduce((sum, order) => sum + (order.commission || 0), 0);
  const paidCommission = orders
    .filter(order => order.commission_paid)
    .reduce((sum, order) => sum + (order.commission || 0), 0);

  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-purple-600" />
              Order Management
            </CardTitle>
            <CardDescription>
              Track and manage all orders. Total orders: {orders.length}
            </CardDescription>
          </div>
          <Button variant="outline" onClick={() => handleExportCSV(columns)}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-blue-600">Total Revenue</div>
            <div className="text-2xl font-bold text-blue-900">TSh{totalRevenue.toLocaleString()}</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-green-600">Total Commission</div>
            <div className="text-2xl font-bold text-green-900">TSh{totalCommission.toLocaleString()}</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-orange-600">Pending Commission</div>
            <div className="text-2xl font-bold text-orange-900">
              TSh{(totalCommission - paidCommission).toLocaleString()}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={orders}
          searchPlaceholder="Search orders by number, project, or customer..."
        />
      </CardContent>
    </Card>
  );
};

export default OrdersTab;
