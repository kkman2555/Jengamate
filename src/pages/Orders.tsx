
import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { OrdersHeader } from '@/components/orders/OrdersHeader';
import { OrdersTable } from '@/components/orders/OrdersTable';
import { BankTransferInfo } from '@/components/orders/BankTransferInfo';

type BasicOrder = {
  id: string;
  order_number: string;
  project_name: string;
  status: string;
  total_amount: number;
  paid_amount: number;
  commission: number;
  commission_paid: boolean;
  receipt_urls?: string[];
  payment_reference?: string;
  payment_date?: string | null;
  created_at: string;
};

const Orders = () => {
  const { user } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const [orders, setOrders] = useState<BasicOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState<{ open: boolean, orderId?: string }>({ open: false });

  async function fetchOrders() {
    setLoading(true);

    // If admin, fetch all orders. If regular user, only fetch own orders.
    let query = supabase
      .from('orders')
      .select(`
        id, order_number, project_name, status, total_amount, paid_amount,
        commission, commission_paid, receipt_urls, payment_reference, 
        payment_date, created_at, user_id
      `)
      .order('created_at', { ascending: false });

    if (!isAdmin && user) {
      query = query.eq('user_id', user.id);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
      return;
    }
    setOrders(data || []);
    setLoading(false);
  }

  useEffect(() => {
    if (!user || roleLoading) return;
    fetchOrders();
  }, [user, isAdmin, roleLoading]);

  // Set up real-time subscription for order updates
  useEffect(() => {
    if (!user) return;

    const channelName = `orders-realtime-${user.id}-${Date.now()}`;
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: isAdmin ? undefined : `user_id=eq.${user.id}`
        },
        () => {
          fetchOrders(); // Refresh orders when any change occurs
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, isAdmin]);

  return (
    <AppLayout>
      <div className="space-y-6">
        <OrdersHeader />
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Order Management
            </CardTitle>
            <CardDescription>
              View and manage all your orders and payment receipts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OrdersTable
              orders={orders}
              loading={loading}
              openModal={openModal}
              setOpenModal={setOpenModal}
              onRefresh={fetchOrders}
            />
          </CardContent>
        </Card>
        <BankTransferInfo />
      </div>
    </AppLayout>
  );
};

export default Orders;
