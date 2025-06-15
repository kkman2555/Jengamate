import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { User, Inquiry, Order } from '@/types/admin';

export function useAdminData() {
  const {
    data: adminData,
    isLoading,
    refetch,
    error,
  } = useQuery({
    queryKey: ['adminData'],
    queryFn: async () => {
      const profilesQuery = supabase.from('profiles').select('*');
      const rolesQuery = supabase.from('user_roles').select('user_id, role');
      
      // Fetch inquiries and orders separately without joins
      const inquiriesQuery = supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });
        
      const ordersQuery = supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      const [
        { data: profilesData, error: profilesError },
        { data: rolesData, error: rolesError },
        { data: inquiriesData, error: inquiriesError },
        { data: ordersData, error: ordersError },
      ] = await Promise.all([profilesQuery, rolesQuery, inquiriesQuery, ordersQuery]);

      if (profilesError) throw new Error(`Profiles Error: ${profilesError.message}`);
      if (rolesError) throw new Error(`Roles Error: ${rolesError.message}`);
      if (inquiriesError) throw new Error(`Inquiries Error: ${inquiriesError.message}`);
      if (ordersError) throw new Error(`Orders Error: ${ordersError.message}`);

      // Create a profiles lookup map for efficient joining
      const profilesMap = new Map(
        (profilesData || []).map(profile => [profile.id, profile])
      );

      const users: User[] = (profilesData || []).map(profile => {
        const roleInfo = (rolesData || []).find(r => r.user_id === profile.id);
        return {
          ...profile,
          id: profile.id,
          role: roleInfo?.role || 'user',
          email: profile.email || undefined,
          full_name: profile.full_name || undefined,
          company_name: profile.company_name || undefined,
        };
      });

      // Manually join inquiries with profiles data
      const inquiries: Inquiry[] = (inquiriesData || []).map(inquiry => {
        const userProfile = profilesMap.get(inquiry.user_id);
        return {
          id: inquiry.id,
          inquiry_number: inquiry.inquiry_number,
          project_name: inquiry.project_name,
          status: inquiry.status || 'Pending',
          total_amount: inquiry.total_amount || 0,
          user_id: inquiry.user_id,
          created_at: inquiry.created_at || '',
          profiles: userProfile ? {
            full_name: userProfile.full_name,
            email: userProfile.email
          } : null,
        };
      });

      // Manually join orders with profiles data
      const orders: Order[] = (ordersData || []).map(order => {
        const userProfile = profilesMap.get(order.user_id);
        return {
          id: order.id,
          order_number: order.order_number,
          project_name: order.project_name,
          status: order.status || 'Pending',
          total_amount: order.total_amount,
          paid_amount: order.paid_amount || 0,
          commission: order.commission || 0,
          commission_paid: order.commission_paid || false,
          user_id: order.user_id,
          created_at: order.created_at || '',
          profiles: userProfile ? {
            full_name: userProfile.full_name,
            email: userProfile.email
          } : null,
        };
      });

      return {
        users,
        inquiries,
        orders,
      };
    },
  });

  if (error) {
    console.error("Error fetching admin data:", error);
  }

  return {
    users: adminData?.users || [],
    inquiries: adminData?.inquiries || [],
    orders: adminData?.orders || [],
    loading: isLoading,
    refetch,
  };
}
