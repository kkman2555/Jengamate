
import { useMemo } from 'react';
import { User } from '@/types/admin';
import { Button } from '@/components/ui/button';

const roleColors: Record<string, string> = {
  admin: 'bg-purple-100 text-purple-800',
  user: 'bg-gray-100 text-gray-800'
};

export const useUsersColumns = (
    selectedIds: string[],
    handleSelectRow: (checked: boolean, rowId: string) => void,
    toggleUserRole: (userId: string, currentRole: string) => void
) => {
    const columns = useMemo(
        () => [
            {
                accessorKey: 'checkbox',
                header: '',
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
                enableSorting: false,
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
                enableSorting: false,
            },
        ],
        [selectedIds, handleSelectRow, toggleUserRole]
    );

    return columns;
};
