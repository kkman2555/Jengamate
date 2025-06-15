
import React from 'react';
import { useUserRole } from '@/hooks/useUserRole';

export function OrdersHeader() {
  const { isAdmin } = useUserRole();

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground">
          Track and manage your orders and payments
        </p>
        {isAdmin && (
          <div className="my-2 p-2 rounded bg-yellow-100 text-yellow-900 text-sm inline-flex items-center gap-2">
            <span>Admin Mode: Viewing all orders</span>
          </div>
        )}
      </div>
    </div>
  );
}
