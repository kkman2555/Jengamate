
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Users as UsersIcon, Download, ChevronDown } from 'lucide-react';

interface UsersTabHeaderProps {
    selectedIdsCount: number;
    onBulkUpdateRole: (role: 'admin' | 'user') => void;
    onExportCSV: () => void;
}

const UsersTabHeader = ({ selectedIdsCount, onBulkUpdateRole, onExportCSV }: UsersTabHeaderProps) => {
    return (
        <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <UsersIcon className="h-6 w-6 text-purple-600" />
                User Management
            </h2>
            <div className="flex items-center space-x-2">
                {selectedIdsCount > 0 && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                Bulk Actions ({selectedIdsCount})
                                <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => onBulkUpdateRole('admin')}>
                                Make Admin
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onBulkUpdateRole('user')}>
                                Make User
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
                <Button variant="outline" onClick={onExportCSV}>
                    <Download className="mr-2 h-4 w-4" />
                    Export CSV
                </Button>
            </div>
        </div>
    );
};

export default UsersTabHeader;
