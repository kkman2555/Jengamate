
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function NotificationSystem() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    // Listen for real-time order updates
    const orderChannel = supabase
      .channel('order-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          const { new: newOrder, old: oldOrder } = payload;
          
          if (newOrder.status !== oldOrder.status) {
            toast({
              title: "Order Status Updated",
              description: `Order ${newOrder.order_number} status changed to ${newOrder.status}`,
            });
          }
          
          if (newOrder.payment_verified && !oldOrder.payment_verified) {
            toast({
              title: "Payment Verified",
              description: `Payment for order ${newOrder.order_number} has been verified`,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(orderChannel);
    };
  }, [user, toast]);

  return (
    <div className="relative">
      <Button variant="ghost" size="sm" className="relative">
        <Bell className="h-4 w-4" />
        {notifications.length > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
            {notifications.length}
          </Badge>
        )}
      </Button>
    </div>
  );
}
