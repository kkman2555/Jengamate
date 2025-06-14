
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { User } from '@/types/admin';

interface UsersTabProps {
  users: User[];
  onRefresh: () => void;
}

const UsersTab = ({ users }: UsersTabProps) => {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <CardDescription>Showing {users.length} users.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>User management functionality will be implemented here.</p>
      </CardContent>
    </Card>
  );
};

export default UsersTab;
