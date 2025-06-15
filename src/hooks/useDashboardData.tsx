
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { fetchDashboardData, DashboardData } from '@/services/dashboardService';
import { useEffect } from 'react';

export type { ActivityItem } from '@/services/dashboardService';

export function useDashboardData() {
  const { toast } = useToast();

  const { 
    data, 
    isLoading, 
    error,
    refetch 
  } = useQuery<DashboardData, Error>({
    queryKey: ['dashboardData'],
    queryFn: fetchDashboardData,
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: `Failed to fetch dashboard data: ${error.message}`,
        variant: "destructive"
      });
    }
  }, [error, toast]);

  return { data, loading: isLoading, error, refetch };
}

