import React from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/types/admin';

interface UsersTabProps {
  users: User[];
  onRefresh: () => void;
}

const UsersTab = ({ users, onRefresh }: UsersTabProps) => {
  const { toast } = useToast();

  const toggleUserRole = async (userId: string, currentRole: string) => {
    try {
      const newRole = currentRole === 'admin' ? 'user' : 'admin';
      
      if (newRole === 'admin') {
        // Add admin role
        const { error } = await supabase
          .from('user_roles')
          .upsert({ user_id: userId, role: 'admin' });
        
        if (error) throw error;
      } else {
        // Remove admin role, keep user role
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
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900">User Management</h2>
      
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.full_name || 'N/A'}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.company_name || 'N/A'}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.role}
                  </span>
                </TableCell>
                <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => toggleUserRole(user.id, user.role)}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                  >
                    Make {user.role === 'admin' ? 'User' : 'Admin'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UsersTab;
