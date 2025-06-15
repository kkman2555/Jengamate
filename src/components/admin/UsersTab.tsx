
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DataTable } from '@/components/ui/data-table';
import { User } from '@/types/admin';
import { useUsersColumns } from '@/hooks/useUsersColumns';
import { useUserManagement } from '@/hooks/useUserManagement';
import UsersTabHeader from './UsersTabHeader';

interface UsersTabProps {
  users: User[];
  onRefresh: () => void;
}

const UsersTab = ({ users, onRefresh }: UsersTabProps) => {
  const {
    selectedIds,
    allSelected,
    handleSelectAll,
    handleSelectRow,
    toggleUserRole,
    handleBulkUpdateRole,
    handleExportCSV,
  } = useUserManagement(users, onRefresh);

  const columns = useUsersColumns(
    selectedIds,
    handleSelectRow,
    toggleUserRole,
    allSelected,
    handleSelectAll,
    users
  );

  const onExportCSV = () => {
    handleExportCSV(columns);
  };

  if (!users || users.length === 0) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>No Users Found</CardTitle>
          <CardDescription>There are currently no users in the system.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <UsersTabHeader
          selectedIdsCount={selectedIds.length}
          onBulkUpdateRole={handleBulkUpdateRole}
          onExportCSV={onExportCSV}
        />
        <CardDescription>
          Manage user accounts and permissions. Total users: {users.length}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={users}
          searchPlaceholder="Search users by name, email, or company..."
        />
      </CardContent>
    </Card>
  );
};

export default UsersTab;
