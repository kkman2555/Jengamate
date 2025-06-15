
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Calendar, User, Package, DollarSign, FileText, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { format } from "date-fns";
import { OrderStatusBadge } from '@/components/orders/OrderStatusBadge';
import { OrderActions } from '@/components/orders/OrderActions';
import { useToast } from '@/hooks/use-toast';

type OrderDetail = {
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
  delivery_date?: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
  inquiry_id?: string;
  profiles?: {
    full_name: string;
    email: string;
    company_name: string;
  };
};

export default function OrderDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isAdmin } = useUserRole();
  const { toast } = useToast();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrderDetails = async () => {
    if (!id) return;
    
    setLoading(true);
    
    let query = supabase
      .from('orders')
      .select(`
        id, order_number, project_name, status, total_amount, paid_amount,
        commission, commission_paid, receipt_urls, payment_reference, 
        payment_date, delivery_date, created_at, updated_at, user_id, inquiry_id,
        profiles:user_id(full_name, email, company_name)
      `)
      .eq('id', id);

    // If not admin, ensure user can only see their own orders
    if (!isAdmin && user) {
      query = query.eq('user_id', user.id);
    }

    const { data, error } = await query.single();

    if (error) {
      console.error('Error fetching order details:', error);
      toast({
        title: "Error",
        description: "Failed to load order details",
        variant: "destructive"
      });
      navigate('/orders');
      return;
    }

    setOrder(data);
    setLoading(false);
  };

  useEffect(() => {
    if (!user) return;
    fetchOrderDetails();
  }, [id, user, isAdmin]);

  // Set up real-time subscription for order updates
  useEffect(() => {
    if (!id || !user) return;

    const channelName = `order-detail-${id}-${Date.now()}`;
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${id}`
        },
        () => {
          fetchOrderDetails();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, user]);

  const getPaymentStatus = () => {
    if (!order) return { status: 'Unknown', color: 'text-gray-600' };
    if (order.paid_amount >= order.total_amount) return { status: 'Fully Paid', color: 'text-green-600' };
    if (order.receipt_urls && order.receipt_urls.length > 0) return { status: 'Payment Pending Verification', color: 'text-yellow-600' };
    if (order.paid_amount > 0) return { status: 'Partially Paid', color: 'text-blue-600' };
    return { status: 'Not Paid', color: 'text-red-600' };
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading order details...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!order) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold">Order not found</h2>
          <p className="text-muted-foreground mt-2">The order you're looking for doesn't exist or you don't have permission to view it.</p>
          <Button onClick={() => navigate('/orders')} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Button>
        </div>
      </AppLayout>
    );
  }

  const paymentStatus = getPaymentStatus();

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/orders')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Orders
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Order #{order.order_number}</h1>
              <p className="text-muted-foreground">{order.project_name}</p>
            </div>
          </div>
          <OrderActions order={order} onRefresh={fetchOrderDetails} />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Order Status and Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <OrderStatusBadge status={order.status} />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Order Date</p>
                  <p className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(order.created_at), "PPP")}
                  </p>
                </div>
              </div>
              
              {order.delivery_date && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Expected Delivery</p>
                  <p className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {format(new Date(order.delivery_date), "PPP")}
                  </p>
                </div>
              )}

              <Separator />

              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                <p className="text-2xl font-bold">TSh {order.total_amount.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {order.profiles && (
                <>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Name</p>
                    <p>{order.profiles.full_name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p>{order.profiles.email || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Company</p>
                    <p>{order.profiles.company_name || 'N/A'}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Payment Status</p>
                <Badge className={paymentStatus.color}>{paymentStatus.status}</Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Paid Amount</p>
                  <p className="font-semibold">TSh {order.paid_amount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Balance</p>
                  <p className="font-semibold">TSh {(order.total_amount - order.paid_amount).toLocaleString()}</p>
                </div>
              </div>

              {order.payment_reference && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Payment Reference</p>
                  <p className="font-mono text-sm">{order.payment_reference}</p>
                </div>
              )}

              {order.payment_date && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Payment Date</p>
                  <p>{format(new Date(order.payment_date), "PPP")}</p>
                </div>
              )}

              {order.receipt_urls && order.receipt_urls.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Payment Receipts</p>
                  <div className="space-y-2">
                    {order.receipt_urls.map((url, index) => (
                      <a
                        key={index}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-600 hover:underline"
                      >
                        <FileText className="h-4 w-4" />
                        Receipt {index + 1}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Commission Information (Admin only) */}
          {isAdmin && (
            <Card>
              <CardHeader>
                <CardTitle>Commission Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Commission Amount</p>
                  <p className="text-lg font-semibold">TSh {order.commission?.toLocaleString() || '0'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Commission Status</p>
                  <Badge variant={order.commission_paid ? "default" : "outline"}>
                    {order.commission_paid ? "Paid" : "Unpaid"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Order Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Order Timeline</CardTitle>
            <CardDescription>Track the progress of your order</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-medium">Order Created</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(order.created_at), "PPP 'at' p")}
                  </p>
                </div>
              </div>
              
              {order.updated_at !== order.created_at && (
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Last Updated</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(order.updated_at), "PPP 'at' p")}
                    </p>
                  </div>
                </div>
              )}

              {order.payment_date && (
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Payment Received</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(order.payment_date), "PPP 'at' p")}
                    </p>
                  </div>
                </div>
              )}

              {order.delivery_date && (
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <div>
                    <p className="font-medium">Expected Delivery</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(order.delivery_date), "PPP")}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
