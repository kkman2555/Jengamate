
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function NotificationSystem() {
  const { user } = useAuth();
  const { isAdmin } = useUserRole();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    const channelName = `order-notifications-${user.id}-${Date.now()}`;
    
    // Listen for real-time order updates
    const orderChannel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*', // Listen for all changes
          schema: 'public',
          table: 'orders',
          filter: isAdmin ? undefined : `user_id=eq.${user.id}`
        },
        (payload) => {
          const { new: newOrder, old: oldOrder, eventType } = payload;
          
          if (eventType === 'INSERT') {
            toast({
              title: "New Order Created",
              description: `Order ${newOrder.order_number} has been placed.`,
            });
            return;
          }

          if (eventType === 'UPDATE' && oldOrder) {
            if (newOrder.status !== oldOrder.status) {
              toast({
                title: "Order Status Updated",
                description: `Order ${newOrder.order_number} status changed to ${newOrder.status}`,
              });
            }
            
            if (newOrder.paid_amount > oldOrder.paid_amount) {
              toast({
                title: "Payment Updated",
                description: `Payment for order ${newOrder.order_number} has been updated`,
              });
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(orderChannel);
    };
  }, [user, toast, isAdmin]);

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
