
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User, Inquiry, Order } from '@/types/admin';

export function useAdminData() {
  const [users, setUsers] = useState<User[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch users with roles
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select(`
          id,
          email,
          full_name,
          company_name,
          created_at
        `)
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;

      // Fetch user roles separately
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Combine users with their roles
      const formattedUsers = usersData?.map(user => {
        const userRole = rolesData?.find(role => role.user_id === user.id);
        return {
          ...user,
          role: userRole?.role || 'user'
        };
      }) || [];

      setUsers(formattedUsers);

      // Fetch inquiries
      const { data: inquiriesData, error: inquiriesError } = await supabase
        .from('inquiries')
        .select(`
          id,
          inquiry_number,
          project_name,
          status,
          total_amount,
          user_id,
          created_at
        `)
        .order('created_at', { ascending: false });

      if (inquiriesError) throw inquiriesError;

      // Get profile data for inquiries
      const inquiriesWithProfiles = await Promise.all(
        (inquiriesData || []).map(async (inquiry) => {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('full_name, email')
            .eq('id', inquiry.user_id)
            .single();

          return {
            ...inquiry,
            profiles: profileData || { full_name: '', email: '' }
          };
        })
      );

      setInquiries(inquiriesWithProfiles);

      // Fetch orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          id,
          order_number,
          project_name,
          status,
          total_amount,
          paid_amount,
          commission,
          commission_paid,
          user_id,
          created_at
        `)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      // Get profile data for orders
      const ordersWithProfiles = await Promise.all(
        (ordersData || []).map(async (order) => {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('full_name, email')
            .eq('id', order.user_id)
            .single();

          return {
            ...order,
            profiles: profileData || { full_name: '', email: '' }
          };
        })
      );

      setOrders(ordersWithProfiles);

    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch admin data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    users,
    inquiries,
    orders,
    loading,
    refetch: fetchData
  };
}
