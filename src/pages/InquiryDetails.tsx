
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { InquiryNavigation } from '@/components/inquiry/InquiryNavigation';
import { InquiryHeader } from '@/components/inquiry/InquiryHeader';
import { InquiryDetailsCard } from '@/components/inquiry/InquiryDetailsCard';
import { ClientInfoCard } from '@/components/inquiry/ClientInfoCard';
import { ProductDescriptionCard } from '@/components/inquiry/ProductDescriptionCard';

const InquiryDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: inquiry, isLoading: isLoadingInquiry, error: inquiryError } = useQuery({
    queryKey: ['inquiry', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error("Error fetching inquiry details:", error);
        throw new Error(error.message);
      }
      return data;
    },
    enabled: !!id,
  });

  const { data: profile, isLoading: isLoadingProfile, error: profileError } = useQuery({
    queryKey: ['profile', inquiry?.user_id],
    queryFn: async () => {
      if (!inquiry?.user_id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', inquiry.user_id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile:", error);
        throw new Error(error.message);
      }
      return data;
    },
    enabled: !!inquiry?.user_id,
  });

  const { data: allInquiries } = useQuery({
    queryKey: ['allInquiries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inquiries')
        .select('id, inquiry_number')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching all inquiries:", error);
        throw new Error(error.message);
      }
      return data;
    },
  });

  const isLoading = isLoadingInquiry || isLoadingProfile;
  const error = inquiryError || profileError;

  const currentIndex = allInquiries?.findIndex(inq => inq.id === id) ?? -1;
  const nextInquiry = allInquiries && currentIndex >= 0 && currentIndex < allInquiries.length - 1 
    ? allInquiries[currentIndex + 1] 
    : null;
  const prevInquiry = allInquiries && currentIndex > 0 
    ? allInquiries[currentIndex - 1] 
    : null;

  const handleNext = () => {
    if (nextInquiry) {
      navigate(`/inquiries/${nextInquiry.id}`);
    }
  };

  const handlePrevious = () => {
    if (prevInquiry) {
      navigate(`/inquiries/${prevInquiry.id}`);
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <LoadingSpinner size="lg" text="Loading inquiry details..." />
      </AppLayout>
    );
  }

  if (error || !inquiry) {
    return (
      <AppLayout>
        <div className="container mx-auto p-6">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="h-12 w-12 text-destructive mb-4" />
              <h3 className="text-lg font-semibold mb-2">Error</h3>
              <p className="text-muted-foreground mb-4">
                Could not load inquiry details. It may have been deleted or an error occurred.
              </p>
              <p className="text-muted-foreground">{error ? error.message : "Inquiry not found."}</p>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  // Convert Json products to the expected format
  const processedProducts = Array.isArray(inquiry.products) ? inquiry.products : null;

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto py-8">
        <InquiryNavigation
          onPrevious={handlePrevious}
          onNext={handleNext}
          canGoPrevious={!!prevInquiry}
          canGoNext={!!nextInquiry}
          currentIndex={currentIndex}
          totalCount={allInquiries?.length || 0}
        />

        <Card>
          <InquiryHeader
            projectName={inquiry.project_name}
            inquiryNumber={inquiry.inquiry_number}
            status={inquiry.status || 'Pending'}
          />
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <InquiryDetailsCard
                createdAt={inquiry.created_at}
                expectedDate={inquiry.expected_date}
                totalAmount={inquiry.total_amount}
                deliveryAddress={inquiry.delivery_address}
                needsTransport={inquiry.needs_transport}
              />
              <ClientInfoCard profile={profile} />
            </div>
            
            <ProductDescriptionCard products={processedProducts} />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default InquiryDetails;
