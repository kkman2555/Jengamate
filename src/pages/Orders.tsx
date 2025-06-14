
import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { format } from "date-fns";
import { OrderPaymentModal } from "@/components/orders/OrderPaymentModal";

type BasicOrder = {
  id: string;
  order_number: string;
  project_name: string;
  status: string;
  total_amount: number;
  paid_amount: number;
  commission: number;
  commission_paid: boolean;
  receipt_url?: string;
  payment_reference?: string;
  payment_date?: string | null;
  created_at: string;
};

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<BasicOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState<{ open: boolean, orderId?: string }>({ open: false });

  async function fetchOrders() {
    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select(`
        id, order_number, project_name, status, total_amount, paid_amount,
        commission, commission_paid, receipt_url, payment_reference, payment_date, created_at
      `)
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });

    if (error) {
      setLoading(false);
      return;
    }
    setOrders(data || []);
    setLoading(false);
  }

  useEffect(() => { if (user) fetchOrders(); }, [user]);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">
            Track and manage your orders and payments
          </p>
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
                      <th className="px-3 py-2 border">Payment</th>
                      <th className="px-3 py-2 border">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.id} className="border-b">
                        <td className="px-3 py-2 border font-medium">{order.order_number}</td>
                        <td className="px-3 py-2 border">{order.project_name}</td>
                        <td className="px-3 py-2 border">{order.status}</td>
                        <td className="px-3 py-2 border">₹{order.total_amount?.toLocaleString()}</td>
                        <td className="px-3 py-2 border">₹{order.commission?.toLocaleString()}</td>
                        <td className="px-3 py-2 border">
                          {order.receipt_url ? (
                            <div className="flex flex-col gap-1">
                              <a href={order.receipt_url} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline text-xs">
                                View Receipt
                              </a>
                              <span className="text-xs">Ref: {order.payment_reference || "--"}</span>
                              <span className="text-xs">Date: {order.payment_date ? format(new Date(order.payment_date), "PPP") : "--"}</span>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">Not paid</span>
                          )}
                        </td>
                        <td className="px-3 py-2 border">
                          {!order.receipt_url && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setOpenModal({ open: true, orderId: order.id })}
                            >
                              Mark as Paid
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
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
