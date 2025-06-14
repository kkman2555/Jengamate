
import React from 'react';
import { DataTable } from '@/components/ui/data-table';
import { User } from '@/types/admin';
import { useUserManagement } from '@/hooks/useUserManagement';
import { useUsersColumns } from '@/hooks/useUsersColumns';
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

  const columns = useUsersColumns(selectedIds, handleSelectRow, toggleUserRole);

  return (
    <div className="space-y-6">
      <UsersTabHeader 
        selectedIdsCount={selectedIds.length}
        onBulkUpdateRole={handleBulkUpdateRole}
        onExportCSV={() => handleExportCSV(columns)}
      />

      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        {users.length > 0 && (
          <div className="flex items-center px-4 py-2 border-b">
            <input
              type="checkbox"
              aria-label="Select all"
              onChange={(e) => handleSelectAll(e.target.checked, users)}
              checked={allSelected}
              className="accent-blue-600 w-4 h-4 mr-2"
            />
            <span className="text-xs text-muted-foreground">Select All</span>
          </div>
        )}
        <DataTable
          columns={columns}
          data={users}
          searchPlaceholder="Search by name, email, company, role, etc..."
        />
        {users.length === 0 && (
          <div className="py-8 text-center text-muted-foreground">
            No users found.
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersTab;
