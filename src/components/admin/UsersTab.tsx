
import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/types/admin';
import { Users as UsersIcon, Download } from 'lucide-react';

interface UsersTabProps {
  users: User[];
  onRefresh: () => void;
}

const roleColors: Record<string, string> = {
  admin: 'bg-purple-100 text-purple-800',
  user: 'bg-gray-100 text-gray-800'
};

// CSV export helper
function toCSV(rows: any[], columns: any[]) {
  const escapeCSV = (val: any) =>
    `"${String(val ?? '').replace(/"/g, '""')}"`;
  const header = columns.map((c) => escapeCSV(c.header)).join(',');
  const body = rows
    .map((row) =>
      columns
        .map((col) =>
          escapeCSV(col.cell ? col.cell(row) : row[col.accessorKey])
        )
        .join(',')
    )
    .join('\n');
  return header + '\n' + body;
}

const UsersTab = ({ users, onRefresh }: UsersTabProps) => {
  const { toast } = useToast();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Bulk selection
  const allSelected = selectedIds.length === users.length && users.length > 0;

  const handleSelectAll = (checked: boolean, visibleRows: User[]) => {
    if (checked) {
      setSelectedIds(visibleRows.map(row => row.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (checked: boolean, rowId: string) => {
    setSelectedIds((ids) =>
      checked ? [...ids, rowId] : ids.filter((id) => id !== rowId)
    );
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'checkbox',
        header: '', // No label for checkbox column
        cell: (row: User) => (
          <input
            type="checkbox"
            aria-label="Select row"
            checked={selectedIds.includes(row.id)}
            onChange={(e) => handleSelectRow(e.target.checked, row.id)}
            className="accent-blue-600 w-4 h-4"
            onClick={e => e.stopPropagation()}
          />
        ),
      },
      {
        accessorKey: 'full_name',
        header: 'Name',
        cell: (row: User) => row.full_name || 'N/A',
      },
      {
        accessorKey: 'email',
        header: 'Email',
        cell: (row: User) => row.email,
      },
      {
        accessorKey: 'company_name',
        header: 'Company',
        cell: (row: User) => row.company_name || 'N/A',
      },
      {
        accessorKey: 'role',
        header: 'Role',
        cell: (row: User) => (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleColors[row.role]}`}>
            {row.role}
          </span>
        )
      },
      {
        accessorKey: 'created_at',
        header: 'Joined',
        cell: (row: User) => new Date(row.created_at).toLocaleDateString()
      },
      {
        accessorKey: 'actions',
        header: 'Actions',
        cell: (row: User) => (
          <Button
            onClick={() => toggleUserRole(row.id, row.role)}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            Make {row.role === 'admin' ? 'User' : 'Admin'}
          </Button>
        ),
      },
    ],
    [users, selectedIds]
  );

  const toggleUserRole = async (userId: string, currentRole: string) => {
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
  };

  const handleExportCSV = () => {
    const filterRows = selectedIds.length
      ? users.filter(row => selectedIds.includes(row.id))
      : users;

    const coreColumns = columns.filter(
      (col) =>
        !["checkbox", "actions"].includes(
          typeof col.accessorKey === "string" ? col.accessorKey : ""
        )
    );
    const csv = toCSV(filterRows, coreColumns);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "users.csv";
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Exported",
      description: `Downloaded ${filterRows.length} users as CSV.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <UsersIcon className="h-6 w-6 text-purple-600" />
          User Management
        </h2>
        <Button variant="outline" onClick={handleExportCSV}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        {/* Custom select all checkbox above the table if users exist */}
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
