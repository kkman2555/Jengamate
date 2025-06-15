import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { useNavigate } from 'react-router-dom';
import { format } from "date-fns";
import { OrderPaymentModal } from "@/components/orders/OrderPaymentModal";
import { OrderStatusBadge } from '@/components/orders/OrderStatusBadge';

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
  const navigate = useNavigate();
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

  const getPaymentStatus = (order: BasicOrder) => {
    if (order.paid_amount >= order.total_amount) return { status: 'Verified', color: 'text-green-600' };
    if (order.receipt_urls && order.receipt_urls.length > 0) return { status: 'Pending Verification', color: 'text-yellow-600' };
    return { status: 'Not Paid', color: 'text-red-600' };
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
            <p className="text-muted-foreground">
              Track and manage your orders and payments
            </p>
            {isAdmin && (
              <div className="my-2 p-2 rounded bg-yellow-100 text-yellow-900 text-sm inline-flex items-center gap-2">
                <span>Admin Mode: Viewing all orders</span>
              </div>
            )}
          </div>
        </div>
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
            {loading ? (
              <p className="py-8 text-center text-muted-foreground">Loading orders...</p>
            ) : orders.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">No orders found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm border">
                  <thead>
                    <tr className="bg-muted">
                      <th className="px-3 py-2 border">Order #</th>
                      <th className="px-3 py-2 border">Project</th>
                      <th className="px-3 py-2 border">Status</th>
                      <th className="px-3 py-2 border">Total Amount</th>
                      <th className="px-3 py-2 border">Commission</th>
                      <th className="px-3 py-2 border">Payment Status</th>
                      <th className="px-3 py-2 border">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => {
                      const paymentStatus = getPaymentStatus(order);
                      return (
                        <tr key={order.id} className="border-b">
                          <td className="px-3 py-2 border font-medium">{order.order_number}</td>
                          <td className="px-3 py-2 border">{order.project_name}</td>
                          <td className="px-3 py-2 border">
                            <OrderStatusBadge status={order.status} />
                          </td>
                          <td className="px-3 py-2 border">TSh{order.total_amount?.toLocaleString()}</td>
                          <td className="px-3 py-2 border">TSh{order.commission?.toLocaleString()}</td>
                          <td className="px-3 py-2 border">
                            <div className="flex flex-col gap-1">
                              <span className={`text-xs font-medium ${paymentStatus.color}`}>
                                {paymentStatus.status}
                              </span>
                              {order.receipt_urls && order.receipt_urls.length > 0 && (
                                <>
                                  {order.receipt_urls.map((url, index) => (
                                    <a key={index} href={url} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline text-xs">
                                      View Receipt {index + 1}
                                    </a>
                                  ))}
                                  <span className="text-xs">Ref: {order.payment_reference || "--"}</span>
                                  <span className="text-xs">Date: {order.payment_date ? format(new Date(order.payment_date), "PPP") : "--"}</span>
                                </>
                              )}
                            </div>
                          </td>
                          <td className="px-3 py-2 border">
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => navigate(`/orders/${order.id}`)}
                              >
                                <Eye className="mr-1 h-3 w-3" />
                                View
                              </Button>
                              {(!order.receipt_urls || order.receipt_urls.length === 0) && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setOpenModal({ open: true, orderId: order.id })}
                                >
                                  Mark as Paid
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <OrderPaymentModal
                  open={openModal.open}
                  orderId={openModal.orderId || ""}
                  onClose={() => setOpenModal({ open: false })}
                  onSuccess={fetchOrders}
                />
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Bank Transfer Instructions</CardTitle>
            <CardDescription>After transferring payment, upload your receipt above.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-1">
              <div><b>Bank Name:</b> YOUR BANK NAME</div>
              <div><b>Account Number:</b> 1234567890</div>
              <div><b>Account Name:</b> ACME ENGINEERS LLP</div>
              <div><b>IFSC:</b> ABCD0123456</div>
              <div><b>Type:</b> Current</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Orders;
