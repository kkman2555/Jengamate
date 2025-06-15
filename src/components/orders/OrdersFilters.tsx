
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

interface OrdersFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  paymentStatusFilter: string;
  onPaymentStatusChange: (value: string) => void;
}

const statusOptions = [
  { value: 'all', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'processing', label: 'Processing' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' }
];

const paymentStatusOptions = [
  { value: 'all', label: 'All Payment' },
  { value: 'unpaid', label: 'Unpaid' },
  { value: 'partially_paid', label: 'Partially Paid' },
  { value: 'paid', label: 'Paid' }
];

export function OrdersFilters({ 
  searchTerm, 
  onSearchChange, 
  statusFilter, 
  onStatusChange, 
  paymentStatusFilter, 
  onPaymentStatusChange 
}: OrdersFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 mb-4">
      <div className="relative flex-grow md:flex-grow-0 md:w-full md:max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by Order # or Project..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <Select value={statusFilter || 'all'} onValueChange={(value) => onStatusChange(value === 'all' ? '' : value)}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={paymentStatusFilter || 'all'} onValueChange={(value) => onPaymentStatusChange(value === 'all' ? '' : value)}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Filter by payment" />
        </SelectTrigger>
        <SelectContent>
          {paymentStatusOptions.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
