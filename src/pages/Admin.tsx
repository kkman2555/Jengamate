import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, FileText, Package, DollarSign, Settings, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import UserMenu from '@/components/UserMenu';

interface User {
  id: string;
  email: string;
  full_name: string;
  company_name: string;
  role: string;
  created_at: string;
}

interface Inquiry {
  id: string;
  inquiry_number: string;
  project_name: string;
  status: string;
  total_amount: number;
  user_id: string;
  created_at: string;
  profiles: {
    full_name: string;
    email: string;
  };
}

interface Order {
  id: string;
  order_number: string;
  project_name: string;
  status: string;
  total_amount: number;
  paid_amount: number;
  commission: number;
  commission_paid: boolean;
  user_id: string;
  created_at: string;
  profiles: {
    full_name: string;
    email: string;
  };
}

const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState<User[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch users with roles
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select(`
          id,
          email,
          full_name,
          company_name,
          created_at,
          user_roles(role)
        `)
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;

      const formattedUsers = usersData?.map(user => ({
        ...user,
        role: user.user_roles?.[0]?.role || 'user'
      })) || [];

      setUsers(formattedUsers);

      // Fetch inquiries
      const { data: inquiriesData, error: inquiriesError } = await supabase
        .from('inquiries')
        .select(`
          id,
          inquiry_number,
          project_name,
          status,
          total_amount,
          user_id,
          created_at,
          profiles(full_name, email)
        `)
        .order('created_at', { ascending: false });

      if (inquiriesError) throw inquiriesError;
      setInquiries(inquiriesData || []);

      // Fetch orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          id,
          order_number,
          project_name,
          status,
          total_amount,
          paid_amount,
          commission,
          commission_paid,
          user_id,
          created_at,
          profiles(full_name, email)
        `)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;
      setOrders(ordersData || []);

    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch admin data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleUserRole = async (userId: string, currentRole: string) => {
    try {
      const newRole = currentRole === 'admin' ? 'user' : 'admin';
      
      if (newRole === 'admin') {
        // Add admin role
        const { error } = await supabase
          .from('user_roles')
          .upsert({ user_id: userId, role: 'admin' });
        
        if (error) throw error;
      } else {
        // Remove admin role, keep user role
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

      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: "Error",
        description: "Failed to update user role. Please try again.",
        variant: "destructive"
      });
    }
  };

  const updateInquiryStatus = async (inquiryId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('inquiries')
        .update({ status: newStatus })
        .eq('id', inquiryId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Inquiry status updated successfully",
      });

      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error updating inquiry status:', error);
      toast({
        title: "Error",
        description: "Failed to update inquiry status. Please try again.",
        variant: "destructive"
      });
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Order status updated successfully",
      });

      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: "Error",
        description: "Failed to update order status. Please try again.",
        variant: "destructive"
      });
    }
  };

  const toggleCommissionPaid = async (orderId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ commission_paid: !currentStatus })
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Commission marked as ${!currentStatus ? 'paid' : 'unpaid'}`,
      });

      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error updating commission status:', error);
      toast({
        title: "Error",
        description: "Failed to update commission status. Please try again.",
        variant: "destructive"
      });
    }
  };

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Quoted': return 'bg-blue-100 text-blue-800';
      case 'Accepted': return 'bg-green-100 text-green-800';
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Shipped': return 'bg-purple-100 text-purple-800';
      case 'Completed': return 'bg-gray-100 text-gray-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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
                onClick={() => navigate('/')}
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

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4">
          <div className="flex space-x-8">
            {[
              { id: 'users', label: 'Users', icon: Users },
              { id: 'inquiries', label: 'Inquiries', icon: FileText },
              { id: 'orders', label: 'Orders', icon: Package },
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-3 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="px-4 py-6 max-w-7xl mx-auto">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading data...</p>
          </div>
        ) : (
          <>
            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-900">User Management</h2>
                
                <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.full_name || 'N/A'}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.company_name || 'N/A'}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {user.role}
                            </span>
                          </TableCell>
                          <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Button
                              onClick={() => toggleUserRole(user.id, user.role)}
                              variant="outline"
                              size="sm"
                              className="text-xs"
                            >
                              Make {user.role === 'admin' ? 'User' : 'Admin'}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {/* Inquiries Tab */}
            {activeTab === 'inquiries' && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-900">Inquiry Management</h2>
                
                <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Inquiry #</TableHead>
                        <TableHead>Project</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {inquiries.map((inquiry) => (
                        <TableRow key={inquiry.id}>
                          <TableCell className="font-medium">{inquiry.inquiry_number}</TableCell>
                          <TableCell>{inquiry.project_name}</TableCell>
                          <TableCell>{inquiry.profiles?.full_name || inquiry.profiles?.email}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(inquiry.status)}`}>
                              {inquiry.status}
                            </span>
                          </TableCell>
                          <TableCell>${inquiry.total_amount?.toLocaleString() || 0}</TableCell>
                          <TableCell>{new Date(inquiry.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <select
                              value={inquiry.status}
                              onChange={(e) => updateInquiryStatus(inquiry.id, e.target.value)}
                              className="text-xs border rounded px-2 py-1"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Quoted">Quoted</option>
                              <option value="Accepted">Accepted</option>
                              <option value="Rejected">Rejected</option>
                            </select>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-900">Order Management</h2>
                
                <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order #</TableHead>
                        <TableHead>Project</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Paid</TableHead>
                        <TableHead>Commission</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.order_number}</TableCell>
                          <TableCell>{order.project_name}</TableCell>
                          <TableCell>{order.profiles?.full_name || order.profiles?.email}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </TableCell>
                          <TableCell>${order.total_amount?.toLocaleString()}</TableCell>
                          <TableCell>${order.paid_amount?.toLocaleString() || 0}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm">${order.commission?.toLocaleString() || 0}</span>
                              <Button
                                onClick={() => toggleCommissionPaid(order.id, order.commission_paid)}
                                variant="outline"
                                size="sm"
                                className={`text-xs ${
                                  order.commission_paid ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'
                                }`}
                              >
                                {order.commission_paid ? 'Paid' : 'Mark Paid'}
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>
                            <select
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                              className="text-xs border rounded px-2 py-1"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Paid">Paid</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Completed">Completed</option>
                            </select>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Admin;
