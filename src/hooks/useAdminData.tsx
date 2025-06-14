
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
      const inquiriesQuery = supabase.from('inquiries').select('*, profiles(full_name, email)').order('created_at', { ascending: false });
      const ordersQuery = supabase.from('orders').select('*, profiles(full_name, email)').order('created_at', { ascending: false });

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

      return {
        users,
        inquiries: (inquiriesData as Inquiry[]) || [],
        orders: (ordersData as Order[]) || [],
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
