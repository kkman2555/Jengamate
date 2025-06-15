
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';

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

interface UsePaginatedOrdersReturn {
  orders: BasicOrder[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  setCurrentPage: (page: number) => void;
  refetch: () => void;
}

const ORDERS_PER_PAGE = 10;

export function usePaginatedOrders(): UsePaginatedOrdersReturn {
  const { user } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const [orders, setOrders] = useState<BasicOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchOrders = useCallback(async () => {
    if (!user || roleLoading) return;

    setLoading(true);
    try {
      // Get total count first
      let countQuery = supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });

      if (!isAdmin) {
        countQuery = countQuery.eq('user_id', user.id);
      }

      const { count } = await countQuery;
      setTotalCount(count || 0);

      // Get paginated data
      const from = (currentPage - 1) * ORDERS_PER_PAGE;
      const to = from + ORDERS_PER_PAGE - 1;

      let query = supabase
        .from('orders')
        .select(`
          id, order_number, project_name, status, total_amount, paid_amount,
          commission, commission_paid, receipt_urls, payment_reference, 
          payment_date, created_at, user_id
        `)
        .order('created_at', { ascending: false })
        .range(from, to);

      if (!isAdmin) {
        query = query.eq('user_id', user.id);
      }

      const { data, error } = await query;

      if (error) throw error;

      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [user, isAdmin, roleLoading, currentPage]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Set up real-time subscription
  useEffect(() => {
    if (!user) return;

    const channelName = `orders-realtime-${user.id}-${Date.now()}`;
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: isAdmin ? undefined : `user_id=eq.${user.id}`
        },
        () => {
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, isAdmin, fetchOrders]);

  const totalPages = Math.ceil(totalCount / ORDERS_PER_PAGE);

  return {
    orders,
    loading,
    currentPage,
    totalPages,
    totalCount,
    setCurrentPage,
    refetch: fetchOrders,
  };
}
