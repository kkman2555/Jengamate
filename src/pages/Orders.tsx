
import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart } from 'lucide-react';
import { OrdersHeader } from '@/components/orders/OrdersHeader';
import { OrdersTable } from '@/components/orders/OrdersTable';
import { OrdersPagination } from '@/components/orders/OrdersPagination';
import { BankTransferInfo } from '@/components/orders/BankTransferInfo';
import { usePaginatedOrders } from '@/hooks/usePaginatedOrders';
import { OrdersFilters } from '@/components/orders/OrdersFilters';

const Orders = () => {
  const {
    orders,
    loading,
    currentPage,
    totalPages,
    totalCount,
    setCurrentPage,
    refetch,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    paymentStatusFilter,
    setPaymentStatusFilter,
  } = usePaginatedOrders();
  
  const [openModal, setOpenModal] = useState<{ open: boolean, orderId?: string }>({ open: false });

  return (
    <AppLayout>
      <div className="space-y-6">
        <OrdersHeader />
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Order Management
              {totalCount > 0 && (
                <span className="text-sm font-normal text-muted-foreground">
                  ({totalCount} total)
                </span>
              )}
            </CardTitle>
            <CardDescription>
              View and manage all your orders and payment receipts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OrdersFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
              paymentStatusFilter={paymentStatusFilter}
              onPaymentStatusChange={setPaymentStatusFilter}
            />
            <OrdersTable
              orders={orders}
              loading={loading}
              openModal={openModal}
              setOpenModal={setOpenModal}
              onRefresh={refetch}
            />
            <OrdersPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </CardContent>
        </Card>
        <BankTransferInfo />
      </div>
    </AppLayout>
  );
};

export default Orders;
