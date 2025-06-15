
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useOrderStatusManagement = (onRefresh: () => void) => {
  const { toast } = useToast();

  const updateOrderStatus = useCallback(async (orderId: string, newStatus: string) => {
    try {
      const updateData: any = { status: newStatus };
      
      // Auto-calculate commission when order is completed
      if (newStatus === 'completed') {
        const { data: orderData } = await supabase
          .from('orders')
          .select('total_amount, commission')
          .eq('id', orderId)
          .single();
        
        if (orderData && !orderData.commission) {
          updateData.commission = orderData.total_amount * 0.1; // 10% commission
        }
      }

      const { error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: `Order status changed to ${newStatus}`,
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
  }, [onRefresh, toast]);

  const verifyPayment = useCallback(async (orderId: string, verified: boolean) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          paid_amount: verified ? supabase.rpc('get_order_total', { order_id: orderId }) : 0,
          payment_verified: verified 
        })
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: verified ? "Payment Verified" : "Payment Rejected",
        description: verified ? "Payment has been verified" : "Payment has been rejected",
      });
      
      onRefresh();
    } catch (error) {
      console.error('Error verifying payment:', error);
      toast({
        title: "Error",
        description: "Failed to verify payment. Please try again.",
        variant: "destructive"
      });
    }
  }, [onRefresh, toast]);

  return {
    updateOrderStatus,
    verifyPayment,
  };
};
