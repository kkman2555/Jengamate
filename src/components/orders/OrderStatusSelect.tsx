
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface OrderStatusSelectProps {
  currentStatus: string;
  onStatusChange: (status: string) => void;
  disabled?: boolean;
}

const statusOptions = [
  { value: 'pending', label: 'Pending', description: 'Order received, awaiting confirmation' },
  { value: 'confirmed', label: 'Confirmed', description: 'Order confirmed, preparing for processing' },
  { value: 'processing', label: 'Processing', description: 'Order is being processed' },
  { value: 'delivered', label: 'Delivered', description: 'Order has been delivered' },
  { value: 'completed', label: 'Completed', description: 'Order completed successfully' },
  { value: 'cancelled', label: 'Cancelled', description: 'Order cancelled' }
];

export function OrderStatusSelect({ currentStatus, onStatusChange, disabled }: OrderStatusSelectProps) {
  return (
    <Select value={currentStatus} onValueChange={onStatusChange} disabled={disabled}>
      <SelectTrigger className="w-40">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {statusOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            <div className="flex flex-col">
              <span className="font-medium">{option.label}</span>
              <span className="text-xs text-muted-foreground">{option.description}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
