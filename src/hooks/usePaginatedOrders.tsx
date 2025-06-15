
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
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  paymentStatusFilter: string;
  setPaymentStatusFilter: (status: string) => void;
}

const ORDERS_PER_PAGE = 10;

export function usePaginatedOrders(): UsePaginatedOrdersReturn {
  const { user } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const [orders, setOrders] = useState<BasicOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('');

  // Debounce search term to avoid excessive queries
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms delay

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Reset to first page on search or filter change
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [debouncedSearchTerm, statusFilter, paymentStatusFilter]);

  const fetchOrders = useCallback(async () => {
    if (!user || roleLoading) return;

    setLoading(true);
    try {
      // Base query
      let query = supabase.from('orders');
      
      const buildQuery = (isCount: boolean) => {
        let q = isCount 
          ? query.select('*', { count: 'exact', head: true })
          : query.select(`
              id, order_number, project_name, status, total_amount, paid_amount,
              commission, commission_paid, receipt_urls, payment_reference, 
              payment_date, created_at, user_id
            `);

        if (!isAdmin) {
          q = q.eq('user_id', user.id);
        }
        if (statusFilter) {
          q = q.eq('status', statusFilter);
        }
        if (debouncedSearchTerm) {
          q = q.or(`order_number.ilike.%${debouncedSearchTerm}%,project_name.ilike.%${debouncedSearchTerm}%`);
        }
        
        if (paymentStatusFilter) {
          if (paymentStatusFilter === 'unpaid') {
            q = q.eq('paid_amount', 0);
          } else if (paymentStatusFilter === 'partially_paid') {
            q = q.gt('paid_amount', 0).filter('paid_amount', 'lt', 'total_amount');
          } else if (paymentStatusFilter === 'paid') {
            q = q.gte('paid_amount', 'total_amount');
          }
        }
        return q;
      };
      
      const countQuery = buildQuery(true);
      const { count, error: countError } = await countQuery;
      if (countError) throw countError;
      setTotalCount(count || 0);

      const from = (currentPage - 1) * ORDERS_PER_PAGE;
      const to = from + ORDERS_PER_PAGE - 1;

      const dataQuery = buildQuery(false)
        .order('created_at', { ascending: false })
        .range(from, to);
        
      const { data, error } = await dataQuery;

      if (error) throw error;

      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [user, isAdmin, roleLoading, currentPage, debouncedSearchTerm, statusFilter, paymentStatusFilter]);

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
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    paymentStatusFilter,
    setPaymentStatusFilter,
  };
}
