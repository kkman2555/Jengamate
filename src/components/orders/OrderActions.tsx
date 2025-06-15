
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ArrowRight, MoreHorizontal, Check, X, DollarSign, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUserRole } from '@/hooks/useUserRole';
import { OrderStatusSelect } from './OrderStatusSelect';
import { useOrderStatusManagement } from '@/hooks/useOrderStatusManagement';

interface OrderActionsProps {
  order: any;
  onRefresh: () => void;
}

export function OrderActions({ order, onRefresh }: OrderActionsProps) {
  const navigate = useNavigate();
  const { isAdmin } = useUserRole();
  const { updateOrderStatus, verifyPayment } = useOrderStatusManagement(onRefresh);

  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => navigate(`/orders/${order.id}`)}
      >
        <Eye className="mr-1 h-3 w-3" />
        View
      </Button>

      {isAdmin && (
        <>
          <OrderStatusSelect
            currentStatus={order.status}
            onStatusChange={(status) => updateOrderStatus(order.id, status)}
          />
          
          {order.receipt_urls && order.receipt_urls.length > 0 && !order.payment_verified && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => verifyPayment(order.id, true)}>
                  <Check className="mr-2 h-3 w-3" />
                  Verify Payment
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => verifyPayment(order.id, false)}>
                  <X className="mr-2 h-3 w-3" />
                  Reject Payment
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {!order.commission_paid && order.commission && order.commission > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {/* handled in parent */}}
              className="text-xs"
            >
              <DollarSign className="mr-1 h-3 w-3" />
              Mark Paid
            </Button>
          )}
        </>
      )}
    </div>
  );
}
