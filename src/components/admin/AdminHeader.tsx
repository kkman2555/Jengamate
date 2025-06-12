
import React from 'react';
import { Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import UserMenu from '@/components/UserMenu';

interface AdminHeaderProps {
  onBackToApp: () => void;
}

const AdminHeader = ({ onBackToApp }: AdminHeaderProps) => {
  return (
    <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg">
      <div className="px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="h-10 w-10" />
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-purple-100 text-sm">ConstructMate Management</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              onClick={onBackToApp}
              variant="ghost"
              className="text-white hover:bg-purple-600"
            >
              Back to App
            </Button>
            <UserMenu />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
