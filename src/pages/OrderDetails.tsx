
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, User, CreditCard, DollarSign, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { OrderStatusBadge } from '@/components/orders/OrderStatusBadge';
import { OrderActions } from '@/components/orders/OrderActions';
import { format } from 'date-fns';

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
  created_at: string;
  updated_at: string;
  delivery_date?: string | null;
  user_id: string;
  profiles?: {
    full_name: string;
    email: string;
    company_name: string;
  } | null;
};

const OrderDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrderDetails = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *, 
          profiles:user_id (
            full_name,
            email,
            company_name
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      
      setOrder(data);
    } catch (error) {
      console.error('Error fetching order details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading order details...</p>
        </div>
      </AppLayout>
    );
  }

  if (!order) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/orders')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Orders
            </Button>
          </div>
          <p className="text-center text-muted-foreground">Order not found.</p>
        </div>
      </AppLayout>
    );
  }

  const getPaymentStatus = () => {
    if (order.paid_amount >= order.total_amount) return { status: 'Verified', color: 'text-green-600' };
    if (order.receipt_urls && order.receipt_urls.length > 0) return { status: 'Pending Verification', color: 'text-yellow-600' };
    return { status: 'Not Paid', color: 'text-red-600' };
  };

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
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <span className="font-medium">Name:</span> {order.profiles?.full_name || 'Not available'}
              </div>
              <div>
                <span className="font-medium">Email:</span> {order.profiles?.email || 'Not available'}
              </div>
              <div>
                <span className="font-medium">Company:</span> {order.profiles?.company_name || 'Not provided'}
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <span className="font-medium">Total Amount:</span> TSh{order.total_amount?.toLocaleString()}
              </div>
              <div>
                <span className="font-medium">Paid Amount:</span> TSh{order.paid_amount?.toLocaleString()}
              </div>
              <div>
                <span className="font-medium">Status:</span>
                <Badge className={`ml-2 ${paymentStatus.color}`}>
                  {paymentStatus.status}
                </Badge>
              </div>
              {order.payment_reference && (
                <div>
                  <span className="font-medium">Reference:</span> {order.payment_reference}
                </div>
              )}
              {order.payment_date && (
                <div>
                  <span className="font-medium">Payment Date:</span> {format(new Date(order.payment_date), "PPP")}
                </div>
              )}
              {order.receipt_urls && order.receipt_urls.length > 0 && (
                <div>
                  <span className="font-medium">Receipts:</span>
                  <div className="mt-1 space-y-1">
                    {order.receipt_urls.map((url, index) => (
                      <a
                        key={index}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-blue-600 hover:underline text-sm"
                      >
                        Receipt {index + 1}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Commission Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Commission Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <span className="font-medium">Commission:</span> TSh{order.commission?.toLocaleString() || '0'}
              </div>
              <div>
                <span className="font-medium">Commission Status:</span>
                <Badge className={`ml-2 ${order.commission_paid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {order.commission_paid ? 'Paid' : 'Pending'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Order Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Order Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <div className="font-medium">Order Created</div>
                  <div className="text-sm text-muted-foreground">
                    {format(new Date(order.created_at), "PPP 'at' p")}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <div className="font-medium">Current Status</div>
                  <div className="text-sm">
                    <OrderStatusBadge status={order.status} />
                  </div>
                </div>
              </div>
              {order.delivery_date && (
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <div className="font-medium">Expected Delivery</div>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(order.delivery_date), "PPP")}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default OrderDetails;
