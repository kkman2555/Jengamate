
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Order } from '@/types/admin';

interface OrdersTabProps {
  orders: Order[];
  onRefresh: () => void;
}

const OrdersTab = ({ orders }: OrdersTabProps) => {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Order Management</CardTitle>
        <CardDescription>Showing {orders.length} orders.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Order management functionality will be implemented here.</p>
      </CardContent>
    </Card>
  );
};

export default OrdersTab;
