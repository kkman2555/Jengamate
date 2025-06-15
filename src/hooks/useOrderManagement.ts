
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Order } from '@/types/admin';
import { exportToCSV } from '@/lib/csv';

export const useOrderManagement = (orders: Order[], onRefresh: () => void) => {
    const { toast } = useToast();

    const handleMarkCommissionPaid = useCallback(async (orderId: string) => {
        try {
            const { error } = await supabase
                .from('orders')
                .update({ commission_paid: true })
                .eq('id', orderId);

            if (error) throw error;

            toast({
                title: "Success",
                description: "Commission marked as paid",
            });
            onRefresh();
        } catch (error) {
            console.error('Error updating commission status:', error);
            toast({
                title: "Error",
                description: "Failed to update commission status. Please try again.",
                variant: "destructive"
            });
        }
    }, [onRefresh, toast]);

    const handleExportCSV = useCallback((columns: any[]) => {
        exportToCSV(orders, columns, "orders.csv");
        toast({
            title: "Exported",
            description: `Downloaded ${orders.length} orders as CSV.`,
        });
    }, [orders, toast]);

    return {
        handleMarkCommissionPaid,
        handleExportCSV,
    };
};
