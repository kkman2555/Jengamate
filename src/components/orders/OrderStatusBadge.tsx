
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface OrderStatusBadgeProps {
  status: string;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const getStatusVariant = (status: string): "default" | "destructive" | "outline" | "secondary" => {
    switch (status.toLowerCase()) {
      case 'pending': return 'outline';
      case 'confirmed': return 'default';
      case 'processing': return 'secondary';
      case 'delivered': return 'secondary';
      case 'completed': return 'secondary';
      case 'cancelled': return 'destructive';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'pending': return 'text-yellow-600 border-yellow-300';
      case 'confirmed': return 'text-blue-600 border-blue-300';
      case 'processing': return 'text-purple-600 border-purple-300';
      case 'delivered': return 'text-green-600 border-green-300';
      case 'completed': return 'text-green-700 border-green-400';
      case 'cancelled': return 'text-red-600 border-red-300';
      default: return '';
    }
  };

  return (
    <Badge 
      variant={getStatusVariant(status)} 
      className={getStatusColor(status)}
    >
      {status}
    </Badge>
  );
}
