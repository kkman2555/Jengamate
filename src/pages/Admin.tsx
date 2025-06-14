
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { useToast } from '@/hooks/use-toast';
import { useAdminData } from '@/hooks/useAdminData';
import { AppLayout } from '@/components/layout/AppLayout';
import AdminTabs from '@/components/admin/AdminTabs';
import UsersTab from '@/components/admin/UsersTab';
import InquiriesTab from '@/components/admin/InquiriesTab';
import OrdersTab from '@/components/admin/OrdersTab';
import { useLocation } from 'react-router-dom';

interface AdminProps {
  initialTab?: 'users' | 'inquiries' | 'orders';
}

const Admin = ({ initialTab }: AdminProps) => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { users, inquiries, orders, loading, refetch } = useAdminData();
  const location = useLocation();

  // Use tab from props, or fallback to tab in location.state, or default "users"
  const tabFromState = location.state && typeof location.state === "object" && "activeTab" in location.state
    ? location.state.activeTab
    : undefined;
  const [activeTab, setActiveTab] = useState<'users' | 'inquiries' | 'orders'>(
    initialTab || tabFromState || 'users'
  );

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!roleLoading && !isAdmin) {
      navigate('/');
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin dashboard.",
        variant: "destructive"
      });
    }
  }, [isAdmin, roleLoading, navigate, toast]);

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage users, inquiries, and orders across the platform
          </p>
        </div>

        <AdminTabs
          activeTab={activeTab}
          onTabChange={(tabId: 'users' | 'inquiries' | 'orders') => setActiveTab(tabId)}
        />

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading data...</p>
          </div>
        ) : (
          <>
            {activeTab === 'users' && (
              <UsersTab users={users} onRefresh={refetch} />
            )}
            {activeTab === 'inquiries' && (
              <InquiriesTab inquiries={inquiries} onRefresh={refetch} />
            )}
            {activeTab === 'orders' && (
              <OrdersTab orders={orders} onRefresh={refetch} />
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default Admin;
