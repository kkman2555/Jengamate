
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { useToast } from '@/hooks/use-toast';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { InquiryHeader } from '@/components/inquiry/InquiryHeader';
import { ClientInfoCard } from '@/components/inquiry/ClientInfoCard';
import { InquiryDetailsCard } from '@/components/inquiry/InquiryDetailsCard';
import { ProductDescriptionCard } from '@/components/inquiry/ProductDescriptionCard';
import AdminInquiryActions from '@/components/inquiry/AdminInquiryActions';
import { Skeleton } from '@/components/ui/skeleton';
import { Shield } from 'lucide-react';

const AdminInquiryDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const { toast } = useToast();

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
        description: "You don't have permission to view this page.",
        variant: "destructive",
      });
    }
  }, [isAdmin, roleLoading, navigate, toast]);

  const fetchInquiryDetails = async () => {
    if (!id) throw new Error("Inquiry ID is missing");
    
    const { data, error } = await supabase
      .from('inquiries')
      .select(`
        *,
        client:profiles (
          full_name,
          email
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // Not found
        navigate('/404');
        return null;
      }
      throw new Error(error.message);
    }
    return data;
  };

  const { data: inquiry, isLoading, error, refetch } = useQuery({
    queryKey: ['inquiry', id],
    queryFn: fetchInquiryDetails,
    enabled: !!id && !roleLoading && isAdmin,
  });

  if (authLoading || roleLoading || (isLoading && !inquiry)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Loading inquiry details...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
      return (
          <AppLayout>
              <div className="text-red-500">Error: {error.message}</div>
          </AppLayout>
      )
  }

  if (!inquiry) {
      return (
          <AppLayout>
              <div>Inquiry not found.</div>
          </AppLayout>
      )
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <Card>
          <InquiryHeader
            projectName={inquiry.project_name || "N/A"}
            inquiryNumber={inquiry.inquiry_number || "N/A"}
            status={inquiry.status || "N/A"}
          />
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            <div className="md:col-span-2 space-y-6">
              <ProductDescriptionCard products={inquiry.products} />
              <AdminInquiryActions inquiry={inquiry} onUpdate={refetch} />
            </div>
            <div className="space-y-6">
              <ClientInfoCard profile={inquiry.client} />
              <InquiryDetailsCard
                createdAt={inquiry.created_at}
                expectedDate={inquiry.expected_date}
                totalAmount={inquiry.total_amount}
                deliveryAddress={inquiry.delivery_address}
                needsTransport={inquiry.needs_transport}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default AdminInquiryDetails;

