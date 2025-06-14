import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/types/admin';
import { exportToCSV } from '@/lib/csv';

export const useUserManagement = (users: User[], onRefresh: () => void) => {
    const { toast } = useToast();
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const allSelected = selectedIds.length === users.length && users.length > 0;

    const handleSelectAll = useCallback((checked: boolean, visibleRows: User[]) => {
        if (checked) {
            setSelectedIds(visibleRows.map(row => row.id));
        } else {
            setSelectedIds([]);
        }
    }, []);

    const handleSelectRow = useCallback((checked: boolean, rowId: string) => {
        setSelectedIds((ids) =>
            checked ? [...ids, rowId] : ids.filter((id) => id !== rowId)
        );
    }, []);

    const toggleUserRole = useCallback(async (userId: string, currentRole: string) => {
        try {
            const newRole = currentRole === 'admin' ? 'user' : 'admin';
            
            if (newRole === 'admin') {
                const { error } = await supabase
                  .from('user_roles')
                  .upsert({ user_id: userId, role: 'admin' });
                if (error) throw error;
            } else {
                const { error } = await supabase
                  .from('user_roles')
                  .delete()
                  .eq('user_id', userId)
                  .eq('role', 'admin');
                if (error) throw error;
            }

            toast({
                title: "Success",
                description: `User role updated to ${newRole}`,
            });
            onRefresh();
        } catch (error) {
            console.error('Error updating user role:', error);
            toast({
                title: "Error",
                description: "Failed to update user role. Please try again.",
                variant: "destructive"
            });
        }
    }, [onRefresh, toast]);

    const handleBulkUpdateRole = useCallback(async (newRole: 'admin' | 'user') => {
        try {
            const usersToUpdate = users.filter(user => selectedIds.includes(user.id) && user.role !== newRole);

            if (usersToUpdate.length === 0) {
                toast({ title: "No changes needed", description: `All selected users already have the '${newRole}' role.` });
                return;
            }

            if (newRole === 'admin') {
                const records = usersToUpdate.map(u => ({ user_id: u.id, role: 'admin' as const }));
                const { error } = await supabase.from('user_roles').upsert(records, { onConflict: 'user_id, role' });
                if (error) throw error;
            } else { // newRole === 'user'
                const userIdsToDeleteRole = usersToUpdate.map(u => u.id);
                const { error } = await supabase.from('user_roles').delete().in('user_id', userIdsToDeleteRole).eq('role', 'admin');
                if (error) throw error;
            }

            toast({
                title: "Success",
                description: `${usersToUpdate.length} user role(s) updated to ${newRole}.`,
            });
            setSelectedIds([]);
            onRefresh();

        } catch (error) {
            console.error('Error bulk updating user roles:', error);
            toast({
                title: "Error",
                description: "Failed to update user roles. Please try again.",
                variant: "destructive"
            });
        }
    }, [users, selectedIds, onRefresh, toast]);
    
    const handleExportCSV = useCallback((columns: any[]) => {
        const rowsToExport = selectedIds.length
        ? users.filter(row => selectedIds.includes(row.id))
        : users;

        exportToCSV(rowsToExport, columns, "users.csv");

        toast({
            title: "Exported",
            description: `Downloaded ${rowsToExport.length} users as CSV.`,
        });
    }, [users, selectedIds, toast]);

    return {
        selectedIds,
        allSelected,
        handleSelectAll,
        handleSelectRow,
        toggleUserRole,
        handleBulkUpdateRole,
        handleExportCSV,
    };
};
