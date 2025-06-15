
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export function OrdersTableSkeleton() {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm border">
        <thead>
          <tr className="bg-muted">
            <th className="px-3 py-2 border">Order #</th>
            <th className="px-3 py-2 border">Project</th>
            <th className="px-3 py-2 border">Status</th>
            <th className="px-3 py-2 border">Total Amount</th>
            <th className="px-3 py-2 border">Commission</th>
            <th className="px-3 py-2 border">Payment Status</th>
            <th className="px-3 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {[...Array(5)].map((_, index) => (
            <tr key={index} className="border-b">
              <td className="px-3 py-2 border">
                <Skeleton className="h-4 w-20" />
              </td>
              <td className="px-3 py-2 border">
                <Skeleton className="h-4 w-32" />
              </td>
              <td className="px-3 py-2 border">
                <Skeleton className="h-6 w-16" />
              </td>
              <td className="px-3 py-2 border">
                <Skeleton className="h-4 w-24" />
              </td>
              <td className="px-3 py-2 border">
                <Skeleton className="h-4 w-24" />
              </td>
              <td className="px-3 py-2 border">
                <div className="flex flex-col gap-1">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </td>
              <td className="px-3 py-2 border">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
