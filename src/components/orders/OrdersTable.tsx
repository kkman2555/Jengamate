import React from 'react';
import { format } from "date-fns";
import { OrderActions } from './OrderActions';
import { useNavigate } from 'react-router-dom';
import { OrderStatusBadge } from './OrderStatusBadge';
import { OrderPaymentModal } from './OrderPaymentModal';
import { OrdersTableSkeleton } from './OrdersTableSkeleton';

type BasicOrder = {
  id: string;
  order_number: string;
  project_name: string;
  status: string;
  total_amount: number;
  paid_amount: number;
  commission: number;
  commission_paid: boolean;
  receipt_urls?: string[];
  payment_reference?: string;
  payment_date?: string | null;
  created_at: string;
};

interface OrdersTableProps {
  orders: BasicOrder[];
  loading: boolean;
  openModal: { open: boolean, orderId?: string };
  setOpenModal: (modal: { open: boolean, orderId?: string }) => void;
  onRefresh: () => void;
}

export function OrdersTable({ orders, loading, openModal, setOpenModal, onRefresh }: OrdersTableProps) {
  const navigate = useNavigate();

  const getPaymentStatus = (order: BasicOrder) => {
    if (order.paid_amount >= order.total_amount) return { status: 'Verified', color: 'text-green-600' };
    if (order.receipt_urls && order.receipt_urls.length > 0) return { status: 'Pending Verification', color: 'text-yellow-600' };
    return { status: 'Not Paid', color: 'text-red-600' };
  };

  if (loading) {
    return <OrdersTableSkeleton />;
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No orders found.</p>
        <p className="text-sm text-muted-foreground mt-2">Orders will appear here once they are created.</p>
      </div>
    );
  }

  return (
    <>
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
            {orders.map(order => {
              const paymentStatus = getPaymentStatus(order);
              return (
                <tr key={order.id} className="border-b hover:bg-muted/50 transition-colors">
                  <td className="px-3 py-2 border font-medium">{order.order_number}</td>
                  <td className="px-3 py-2 border max-w-[200px] truncate" title={order.project_name}>
                    {order.project_name}
                  </td>
                  <td className="px-3 py-2 border">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="px-3 py-2 border">TSh{order.total_amount?.toLocaleString()}</td>
                  <td className="px-3 py-2 border">TSh{order.commission?.toLocaleString()}</td>
                  <td className="px-3 py-2 border">
                    <div className="flex flex-col gap-1">
                      <span className={`text-xs font-medium ${paymentStatus.color}`}>
                        {paymentStatus.status}
                      </span>
                      {order.receipt_urls && order.receipt_urls.length > 0 && (
                        <>
                          {order.receipt_urls.map((url, index) => (
                            <a key={index} href={url} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 underline text-xs">
                              Receipt {index + 1}
                            </a>
                          ))}
                          <span className="text-xs text-muted-foreground">Ref: {order.payment_reference || "--"}</span>
                          <span className="text-xs text-muted-foreground">Date: {order.payment_date ? format(new Date(order.payment_date), "PPP") : "--"}</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2 border">
                    <OrderActions
                      order={order}
                      onRefresh={onRefresh}
                      setOpenModal={setOpenModal}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <OrderPaymentModal
        open={openModal.open}
        orderId={openModal.orderId || ""}
        onClose={() => setOpenModal({ open: false })}
        onSuccess={onRefresh}
      />
    </>
  );
}
