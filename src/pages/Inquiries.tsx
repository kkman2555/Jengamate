
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Loader2, Search } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { useUserRole } from '@/hooks/useUserRole';
import { useInquiries } from '@/hooks/useInquiries';
import { InquiryCard } from '@/components/inquiry/InquiryCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Inquiries = () => {
  const navigate = useNavigate();
  const { isAdmin } = useUserRole();
  const { inquiries, isLoading: pageIsLoading } = useInquiries();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');

  // Filter inquiries based on search term and status
  const filteredInquiries = React.useMemo(() => {
    if (!inquiries) return [];
    
    return inquiries.filter(inquiry => {
      const matchesSearch = searchTerm === '' || 
        inquiry.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.inquiry_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (inquiry.project_type && inquiry.project_type.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = statusFilter === 'all' || inquiry.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [inquiries, searchTerm, statusFilter]);
  
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Project Inquiries</h1>
            <p className="text-muted-foreground">
              {isAdmin ? "Review and manage all user inquiries." : "Manage your project inquiries and quotations"}
            </p>
          </div>
          {!isAdmin && (
            <Button className="gap-2" onClick={() => navigate("/inquiries/new")}>
              <Plus className="h-4 w-4" />
              New Inquiry
            </Button>
          )}
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search inquiries by name, number, or type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Quoted">Quoted</SelectItem>
                  <SelectItem value="Accepted">Accepted</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {pageIsLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Loading inquiries...</p>
            </div>
          </div>
        ) : filteredInquiries && filteredInquiries.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredInquiries.map(inquiry => (
              <InquiryCard 
                key={inquiry.id} 
                inquiry={{
                  ...inquiry,
                  products: Array.isArray(inquiry.products) ? inquiry.products : []
                }} 
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {searchTerm || statusFilter !== 'all' ? 'No Matching Inquiries' : 'No Inquiries Found'}
              </CardTitle>
              <CardDescription>
                {searchTerm || statusFilter !== 'all' 
                  ? "Try adjusting your search terms or filters."
                  : isAdmin 
                    ? "There are no inquiries from any user yet." 
                    : "You haven't submitted any inquiries yet."
                }
              </CardDescription>
            </CardHeader>
            {!isAdmin && !searchTerm && statusFilter === 'all' && (
              <CardContent>
                <div className="text-center py-8">
                  <Button onClick={() => navigate("/inquiries/new")} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create Your First Inquiry
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default Inquiries;
