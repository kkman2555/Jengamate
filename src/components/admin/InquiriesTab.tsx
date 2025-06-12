
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Inquiry } from '@/types/admin';

interface InquiriesTabProps {
  inquiries: Inquiry[];
  onRefresh: () => void;
}

const InquiriesTab = ({ inquiries, onRefresh }: InquiriesTabProps) => {
  const { toast } = useToast();

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

      onRefresh();
    } catch (error) {
      console.error('Error updating inquiry status:', error);
      toast({
        title: "Error",
        description: "Failed to update inquiry status. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Quoted': return 'bg-blue-100 text-blue-800';
      case 'Accepted': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
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
  );
};

export default InquiriesTab;
