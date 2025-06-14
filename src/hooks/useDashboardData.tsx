
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Inquiry, Order } from '@/types/admin';

export type ActivityItem = (Inquiry & { type: 'inquiry' }) | (Order & { type: 'order' });

interface DashboardData {
  totalInquiries: number;
  activeOrders: number;
  totalRevenue: number;
  activeUsers: number;
  recentActivity: ActivityItem[];
}

export function useDashboardData() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      setLoading(true);

      const inquiriesCountPromise = supabase
        .from('inquiries')
        .select('*', { count: 'exact', head: true });

      const activeOrdersCountPromise = supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .not('status', 'eq', 'Completed');

      const ordersDataPromise = supabase
        .from('orders')
        .select('total_amount');

      const usersCountPromise = supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
        
      const recentInquiriesPromise = supabase
        .from('inquiries')
        .select('id, inquiry_number, project_name, status, created_at, user_id, total_amount')
        .order('created_at', { ascending: false })
        .limit(3);

      const recentOrdersPromise = supabase
        .from('orders')
        .select('id, order_number, project_name, status, created_at, user_id, total_amount')
        .order('created_at', { ascending: false })
        .limit(3);
      
      const profilesPromise = supabase.from('profiles').select('id, full_name, email');

      const [
        { count: totalInquiries },
        { count: activeOrders },
        { data: ordersData, error: revenueError },
        { count: activeUsers },
        { data: recentInquiriesData, error: inquiriesError },
        { data: recentOrdersData, error: ordersError },
        { data: profilesData, error: profilesError }
      ] = await Promise.all([
        inquiriesCountPromise,
        activeOrdersCountPromise,
        ordersDataPromise,
        usersCountPromise,
        recentInquiriesPromise,
        recentOrdersPromise,
        profilesPromise,
      ]);

      if (revenueError) throw revenueError;
      if (inquiriesError) throw inquiriesError;
      if (ordersError) throw ordersError;
      if (profilesError) throw profilesError;
      
      const profilesMap = new Map(profilesData?.map(p => [p.id, p]));
      const totalRevenue = ordersData?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;

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

      setData({
        totalInquiries: totalInquiries || 0,
        activeOrders: activeOrders || 0,
        totalRevenue,
        activeUsers: activeUsers || 0,
        recentActivity,
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
