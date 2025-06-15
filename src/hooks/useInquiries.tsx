
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { Database } from '@/integrations/supabase/types';

type Inquiry = Database['public']['Tables']['inquiries']['Row'];

export function useInquiries() {
  const { user } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();

  const { data: inquiries, isLoading, error } = useQuery<Inquiry[], Error>({
    queryKey: ['inquiries', user?.id, isAdmin],
    queryFn: async () => {
        if (!user) return [];
        
        let query = supabase
            .from('inquiries')
            .select('*');

        if (!isAdmin) {
            query = query.eq('user_id', user.id);
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching inquiries:", error);
            throw new Error(error.message);
        }
        return data;
    },
    enabled: !!user && !roleLoading,
  });

  return { 
    inquiries: inquiries || [], 
    isLoading: isLoading || roleLoading,
    error 
  };
}
