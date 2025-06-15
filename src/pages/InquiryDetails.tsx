
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

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

  const getStatusVariant = (status: string): "default" | "destructive" | "outline" | "secondary" | null | undefined => {
    switch (status) {
      case 'Pending': return 'default';
      case 'Quoted': return 'outline';
      case 'Accepted': return 'secondary';
      case 'Rejected': return 'destructive';
      default: return 'default';
    }
  };

  const renderDetail = (label: string, value: React.ReactNode) => (
    <div className="flex justify-between items-start py-3 border-b last:border-b-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-medium text-right break-words max-w-[60%]">{value}</span>
    </div>
  );

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AppLayout>
    );
  }

  if (error || !inquiry) {
    return (
      <AppLayout>
        <div className="container mx-auto p-6">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertCircle />
                Error
              </CardTitle>
              <CardDescription>
                Could not load inquiry details. It may have been deleted or an error occurred.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{error ? error.message : "Inquiry not found."}</p>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto py-8">
        {/* Navigation Header */}
        <div className="flex justify-between items-center mb-6">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={!prevInquiry}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {allInquiries && currentIndex >= 0 
                ? `${currentIndex + 1} of ${allInquiries.length} inquiries`
                : 'Loading...'
              }
            </p>
          </div>

          <Button
            variant="outline"
            onClick={handleNext}
            disabled={!nextInquiry}
            className="flex items-center gap-2"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-3xl">{inquiry.project_name}</CardTitle>
                <CardDescription>Inquiry #{inquiry.inquiry_number}</CardDescription>
              </div>
              <Badge variant={getStatusVariant(inquiry.status || 'Pending')} className="text-base px-3 py-1">{inquiry.status}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="grid md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">Inquiry Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {renderDetail("Submitted On", inquiry.created_at ? format(new Date(inquiry.created_at), 'PPP') : 'N/A')}
                        {renderDetail("Expected Delivery", inquiry.expected_date ? format(new Date(inquiry.expected_date), 'PPP') : 'N/A')}
                        {renderDetail("Estimated Amount", `TSh ${inquiry.total_amount?.toLocaleString() || 0}`)}
                        {renderDetail("Delivery Address", inquiry.delivery_address)}
                        {renderDetail("Needs Transport", inquiry.needs_transport ? "Yes" : "No")}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">Client Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {profile ? (
                            <>
                                {renderDetail("Name", profile.full_name)}
                                {renderDetail("Email", profile.email)}
                            </>
                        ) : (
                            <p className="text-muted-foreground">Client details not available.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">Products / Description</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {Array.isArray(inquiry.products) && inquiry.products.length > 0 && typeof inquiry.products[0] === 'string' && inquiry.products[0] ? inquiry.products[0] : "No description provided."}
                    </p>
                </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default InquiryDetails;
