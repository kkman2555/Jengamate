
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
    toggleUserRole: (userId: string, currentRole: string) => void,
    allSelected: boolean,
    handleSelectAll: (checked: boolean, users: User[]) => void,
    users: User[]
) => {
    const columns = useMemo(
        () => [
            {
                accessorKey: 'checkbox',
                header: () => (
                    <input
                        type="checkbox"
                        aria-label="Select all"
                        checked={allSelected}
                        onChange={(e) => handleSelectAll(e.target.checked, users)}
                        className="accent-blue-600 w-4 h-4"
                    />
                ),
                cell: ({ row }: { row: { original: User } }) => (
                    <input
                        type="checkbox"
                        aria-label="Select row"
                        checked={selectedIds.includes(row.original.id)}
                        onChange={(e) => handleSelectRow(e.target.checked, row.original.id)}
                        className="accent-blue-600 w-4 h-4"
                        onClick={e => e.stopPropagation()}
                    />
                ),
                enableSorting: false,
            },
            {
                accessorKey: 'full_name',
                header: 'Name',
                cell: ({ row }: { row: { original: User } }) => row.original.full_name || 'N/A',
            },
            {
                accessorKey: 'email',
                header: 'Email',
                cell: ({ row }: { row: { original: User } }) => row.original.email,
            },
            {
                accessorKey: 'company_name',
                header: 'Company',
                cell: ({ row }: { row: { original: User } }) => row.original.company_name || 'N/A',
            },
            {
                accessorKey: 'role',
                header: 'Role',
                cell: ({ row }: { row: { original: User } }) => (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleColors[row.original.role]}`}>
                        {row.original.role}
                    </span>
                )
            },
            {
                accessorKey: 'created_at',
                header: 'Joined',
                cell: ({ row }: { row: { original: User } }) => new Date(row.original.created_at).toLocaleDateString()
            },
            {
                accessorKey: 'actions',
                header: 'Actions',
                cell: ({ row }: { row: { original: User } }) => (
                    <Button
                        onClick={() => toggleUserRole(row.original.id, row.original.role)}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                    >
                        Make {row.original.role === 'admin' ? 'User' : 'Admin'}
                    </Button>
                ),
                enableSorting: false,
            },
        ],
        [selectedIds, handleSelectRow, toggleUserRole, allSelected, handleSelectAll, users]
    );

    return columns;
};
