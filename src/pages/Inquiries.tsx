
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Loader2 } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { useUserRole } from '@/hooks/useUserRole';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useInquiries } from '@/hooks/useInquiries';

const Inquiries = () => {
  const navigate = useNavigate();
  const { isAdmin } = useUserRole();
  const { inquiries, isLoading: pageIsLoading } = useInquiries();

  const getStatusVariant = (status: string): "default" | "destructive" | "outline" | "secondary" | null | undefined => {
    switch (status) {
      case 'Pending': return 'default';
      case 'Quoted': return 'outline';
      case 'Accepted': return 'secondary';
      case 'Rejected': return 'destructive';
      default: return 'default';
    }
  };
  
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Inquiries</h1>
            <p className="text-muted-foreground">
              {isAdmin ? "Review and manage all user inquiries." : "Manage your project inquiries and quotations"}
            </p>
          </div>
          <Button className="gap-2" onClick={() => navigate("/inquiries/new")}>
            <Plus className="h-4 w-4" />
            New Inquiry
          </Button>
        </div>

        {pageIsLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : inquiries && inquiries.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {inquiries.map(inquiry => (
              <Card key={inquiry.id}>
                <CardHeader>
                  <CardTitle>{inquiry.project_name}</CardTitle>
                  <CardDescription>Inquiry #{inquiry.inquiry_number}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Status</span>
                    <Badge variant={getStatusVariant(inquiry.status || 'Pending')}>{inquiry.status}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount</span>
                    <span className="font-medium">TSh {inquiry.total_amount?.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Submitted</span>
                    <span className="font-medium">{inquiry.created_at ? format(new Date(inquiry.created_at), 'PPP') : 'N/A'}</span>
                  </div>
                </CardContent>
                <CardFooter>
                    <Button variant="outline" className="w-full" onClick={() => navigate(`/inquiries/${inquiry.id}`)}>View Details</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                No Inquiries Found
              </CardTitle>
              <CardDescription>
                {isAdmin ? "There are no inquiries from any user yet." : "You haven't submitted any inquiries yet."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                <p>{isAdmin ? "" : 'Click "New Inquiry" to get started.'}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default Inquiries;
