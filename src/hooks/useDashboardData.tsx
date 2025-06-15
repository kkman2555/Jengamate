
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Inquiry, Order } from '@/types/admin';

export type ActivityItem = (Inquiry & { type: 'inquiry' }) | (Order & { type: 'order' });

interface DashboardData {
  totalInquiries: number;
  activeOrders: number;
  totalRevenue: number;
  pendingPayments: number;
  completedThisMonth: number;
  activeUsers: number;
  recentActivity: ActivityItem[];
  revenueTrends: Array<{
    month: string;
    revenue: number;
    commission: number;
  }>;
  orderStatusDistribution: Array<{
    status: string;
    count: number;
    fill: string;
  }>;
}

const processRevenueTrends = (data: any[]) => {
  const monthlyData = new Map();
  
  data.forEach(order => {
    const date = new Date(order.created_at);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    
    if (!monthlyData.has(monthKey)) {
      monthlyData.set(monthKey, {
        month: monthName,
        revenue: 0,
        commission: 0,
      });
    }
    
    const existing = monthlyData.get(monthKey);
    existing.revenue += order.total_amount || 0;
    existing.commission += order.commission || 0;
  });
  
  return Array.from(monthlyData.values()).slice(-6);
};

const processOrderStatus = (data: any[]) => {
  const statusCounts = new Map();
  const statusColors = {
    'Pending': 'hsl(var(--chart-1))',
    'Confirmed': 'hsl(var(--chart-2))',
    'Processing': 'hsl(var(--chart-3))',
    'Completed': 'hsl(var(--chart-4))',
  };
  
  data.forEach(order => {
    const status = order.status || 'Pending';
    statusCounts.set(status, (statusCounts.get(status) || 0) + 1);
  });
  
  return Array.from(statusCounts.entries()).map(([status, count]) => ({
    status,
    count,
    fill: statusColors[status as keyof typeof statusColors] || 'hsl(var(--chart-1))',
  }));
};

export function useDashboardData() {
  const [rawData, setRawData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const data = useMemo(() => {
    if (!rawData) return null;

    return {
      ...rawData,
      revenueTrends: processRevenueTrends(rawData.revenueByMonthData || []),
      orderStatusDistribution: processOrderStatus(rawData.orderStatusData || []),
    };
  }, [rawData]);

  const fetchData = async () => {
    try {
      setLoading(true);

      const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();

      console.log('Starting dashboard data fetch...');

      // Execute queries one by one to identify which one is failing
      console.log('Fetching total inquiries...');
      const { count: totalInquiries, error: inquiriesCountError } = await supabase
        .from('inquiries')
        .select('*', { count: 'exact', head: true });
      
      if (inquiriesCountError) {
        console.error('Error fetching inquiries count:', inquiriesCountError);
        throw inquiriesCountError;
      }

      console.log('Fetching active orders...');
      const { count: activeOrders, error: activeOrdersError } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .not('status', 'eq', 'Completed');
      
      if (activeOrdersError) {
        console.error('Error fetching active orders:', activeOrdersError);
        throw activeOrdersError;
      }

      console.log('Fetching orders for revenue...');
      const { data: ordersData, error: revenueError } = await supabase
        .from('orders')
        .select('total_amount');
      
      if (revenueError) {
        console.error('Error fetching revenue data:', revenueError);
        throw revenueError;
      }

      console.log('Fetching active users...');
      const { count: activeUsers, error: usersError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      
      if (usersError) {
        console.error('Error fetching users:', usersError);
        throw usersError;
      }

      console.log('Fetching recent inquiries...');
      const { data: recentInquiriesData, error: inquiriesError } = await supabase
        .from('inquiries')
        .select('id, inquiry_number, project_name, status, created_at, user_id, total_amount')
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (inquiriesError) {
        console.error('Error fetching recent inquiries:', inquiriesError);
        throw inquiriesError;
      }

      console.log('Fetching recent orders...');
      const { data: recentOrdersData, error: ordersError } = await supabase
        .from('orders')
        .select('id, order_number, project_name, status, created_at, user_id, total_amount, paid_amount, commission, commission_paid')
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (ordersError) {
        console.error('Error fetching recent orders:', ordersError);
        throw ordersError;
      }

      console.log('Fetching profiles...');
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, email');
      
      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }

      console.log('Fetching revenue by month...');
      const { data: revenueByMonthData, error: revenueByMonthError } = await supabase
        .from('orders')
        .select('total_amount, commission, created_at')
        .not('total_amount', 'is', null);
      
      if (revenueByMonthError) {
        console.error('Error fetching revenue by month:', revenueByMonthError);
        throw revenueByMonthError;
      }

      console.log('Fetching order status data...');
      const { data: orderStatusData, error: orderStatusError } = await supabase
        .from('orders')
        .select('status')
        .not('status', 'is', null);
      
      if (orderStatusError) {
        console.error('Error fetching order status:', orderStatusError);
        throw orderStatusError;
      }

      console.log('Fetching pending payments data...');
      const { data: pendingPaymentsData, error: pendingPaymentsError } = await supabase
        .from('orders')
        .select('total_amount, paid_amount')
        .gt('total_amount', 0)
        .not('paid_amount', 'is', null);
      
      if (pendingPaymentsError) {
        console.error('Error fetching pending payments:', pendingPaymentsError);
        throw pendingPaymentsError;
      }

      console.log('Fetching completed this month...');
      const { count: completedThisMonth, error: completedThisMonthError } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Completed')
        .gte('created_at', firstDayOfMonth);
      
      if (completedThisMonthError) {
        console.error('Error fetching completed this month:', completedThisMonthError);
        throw completedThisMonthError;
      }

      console.log('All queries completed successfully');

      const profilesMap = new Map(profilesData?.map(p => [p.id, p]));
      const totalRevenue = ordersData?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;
      
      // Calculate pending payments from the fetched data by filtering in JavaScript
      const pendingPayments = pendingPaymentsData?.reduce((sum, order) => {
        const totalAmount = order.total_amount || 0;
        const paidAmount = order.paid_amount || 0;
        return totalAmount > paidAmount ? sum + (totalAmount - paidAmount) : sum;
      }, 0) || 0;

      const inquiriesWithType: ActivityItem[] = (recentInquiriesData || []).map(i => ({
          ...i,
          type: 'inquiry',
          profiles: profilesMap.get(i.user_id) || { full_name: 'Unknown User', email: '' }
      }));
      
      const ordersWithType: ActivityItem[] = (recentOrdersData || []).map(o => ({
          ...o,
          type: 'order',
          profiles: profilesMap.get(o.user_id) || { full_name: 'Unknown User', email: '' }
      }));

      const recentActivity = [...inquiriesWithType, ...ordersWithType]
        .sort((a, b) => new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime())
        .slice(0, 5);

      setRawData({
        totalInquiries: totalInquiries || 0,
        activeOrders: activeOrders || 0,
        totalRevenue,
        pendingPayments,
        completedThisMonth: completedThisMonth || 0,
        activeUsers: activeUsers || 0,
        recentActivity,
        revenueByMonthData,
        orderStatusData,
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch dashboard data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, refetch: fetchData };
}
