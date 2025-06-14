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
                cell: (user: User) => (
                    <input
                        type="checkbox"
                        aria-label="Select row"
                        checked={selectedIds.includes(user.id)}
                        onChange={(e) => handleSelectRow(e.target.checked, user.id)}
                        className="accent-blue-600 w-4 h-4"
                        onClick={e => e.stopPropagation()}
                    />
                ),
                enableSorting: false,
            },
            {
                accessorKey: 'full_name',
                header: 'Name',
                cell: (user: User) => user.full_name || 'N/A',
            },
            {
                accessorKey: 'email',
                header: 'Email',
                cell: (user: User) => user.email,
            },
            {
                accessorKey: 'company_name',
                header: 'Company',
                cell: (user: User) => user.company_name || 'N/A',
            },
            {
                accessorKey: 'role',
                header: 'Role',
                cell: (user: User) => (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleColors[user.role]}`}>
                        {user.role}
                    </span>
                )
            },
            {
                accessorKey: 'created_at',
                header: 'Joined',
                cell: (user: User) => new Date(user.created_at).toLocaleDateString()
            },
            {
                accessorKey: 'actions',
                header: 'Actions',
                cell: (user: User) => (
                    <Button
                        onClick={() => toggleUserRole(user.id, user.role)}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                    >
                        Make {user.role === 'admin' ? 'User' : 'Admin'}
                    </Button>
                ),
                enableSorting: false,
            },
        ],
        [selectedIds, handleSelectRow, toggleUserRole, allSelected, handleSelectAll, users]
    );

    return columns;
};
