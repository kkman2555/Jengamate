
import { supabase } from '@/integrations/supabase/client';
import { Inquiry, Order } from '@/types/admin';

type InquiryActivity = Inquiry & {
  type: 'inquiry';
  profiles: { full_name: string | null; email: string | null; };
};
type OrderActivity = Order & {
  type: 'order';
  profiles: { full_name: string | null; email: string | null; };
};
export type ActivityItem = InquiryActivity | OrderActivity;

export interface DashboardData {
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

export const fetchDashboardData = async (): Promise<DashboardData> => {
  const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();

  const results = await Promise.allSettled([
    supabase.from('inquiries').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }).not('status', 'eq', 'Completed'),
    supabase.from('orders').select('total_amount'),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('inquiries').select('id, inquiry_number, project_name, status, created_at, user_id, total_amount').order('created_at', { ascending: false }).limit(3),
    supabase.from('orders').select('id, order_number, project_name, status, created_at, user_id, total_amount, paid_amount, commission, commission_paid').order('created_at', { ascending: false }).limit(3),
    supabase.from('profiles').select('id, full_name, email'),
    supabase.from('orders').select('total_amount, commission, created_at').not('total_amount', 'is', null),
    supabase.from('orders').select('status').not('status', 'is', null),
    supabase.from('orders').select('total_amount, paid_amount').gt('total_amount', 0).not('paid_amount', 'is', null),
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'Completed').gte('created_at', firstDayOfMonth)
  ]);

  const rejectedPromises = results.filter(result => result.status === 'rejected');
  if (rejectedPromises.length > 0) {
    rejectedPromises.forEach(p => console.error('Dashboard data fetch failed:', (p as PromiseRejectedResult).reason));
    throw new Error('Failed to fetch some dashboard data. Check console for details.');
  }

  const [
    inquiriesCountResult,
    activeOrdersResult,
    ordersDataResult,
    activeUsersResult,
    recentInquiriesResult,
    recentOrdersResult,
    profilesResult,
    revenueByMonthResult,
    orderStatusResult,
    pendingPaymentsResult,
    completedThisMonthResult
  ] = results as PromiseFulfilledResult<any>[];

  const totalInquiries = inquiriesCountResult.value.count || 0;
  const activeOrders = activeOrdersResult.value.count || 0;
  const ordersData = ordersDataResult.value.data || [];
  const activeUsers = activeUsersResult.value.count || 0;
  const recentInquiriesData = recentInquiriesResult.value.data || [];
  const recentOrdersData = recentOrdersResult.value.data || [];
  const profilesData = profilesResult.value.data || [];
  const revenueByMonthData = revenueByMonthResult.value.data || [];
  const orderStatusData = orderStatusResult.value.data || [];
  const pendingPaymentsData = pendingPaymentsResult.value.data || [];
  const completedThisMonth = completedThisMonthResult.value.count || 0;

  const profilesMap = new Map(profilesData.map((p: any) => [p.id, p]));
  const totalRevenue = ordersData.reduce((sum: number, order: any) => sum + (order.total_amount || 0), 0);
  
  const pendingPayments = pendingPaymentsData.reduce((sum: number, order: any) => {
    const totalAmount = order.total_amount || 0;
    const paidAmount = order.paid_amount || 0;
    return totalAmount > paidAmount ? sum + (totalAmount - paidAmount) : sum;
  }, 0);

  const inquiriesWithType: ActivityItem[] = recentInquiriesData.map((i: Inquiry) => ({
      ...i,
      type: 'inquiry' as const,
      profiles: profilesMap.get(i.user_id) || { full_name: 'Unknown User', email: '' }
  }));
  
  const ordersWithType: ActivityItem[] = recentOrdersData.map((o: Order) => ({
      ...o,
      type: 'order' as const,
      profiles: profilesMap.get(o.user_id) || { full_name: 'Unknown User', email: '' }
  }));

  const recentActivity = [...inquiriesWithType, ...ordersWithType]
    .sort((a, b) => new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime())
    .slice(0, 5);

  return {
    totalInquiries,
    activeOrders,
    totalRevenue,
    pendingPayments,
    completedThisMonth,
    activeUsers,
    recentActivity,
    revenueTrends: processRevenueTrends(revenueByMonthData),
    orderStatusDistribution: processOrderStatus(orderStatusData),
  };
};

