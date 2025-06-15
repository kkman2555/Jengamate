
import React from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Inquiry } from "@/types/admin";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { FileText, ArrowRight } from 'lucide-react';

interface InquiriesTabProps {
  inquiries: Inquiry[];
  onRefresh: () => void;
}

const InquiriesTab = ({ inquiries }: InquiriesTabProps) => {
  const navigate = useNavigate();

  const getStatusVariant = (status: string): "default" | "destructive" | "outline" | "secondary" => {
    switch (status) {
      case 'Pending': return 'default';
      case 'Quoted': return 'outline';
      case 'Accepted': return 'secondary';
      case 'Rejected': return 'destructive';
      default: return 'default';
    }
  };

  if (!inquiries || inquiries.length === 0) {
    return (
      <Card className="mt-6">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-muted-foreground"/>
                No Inquiries
            </CardTitle>
            <CardDescription>There are currently no inquiries from any user.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>All Inquiries</CardTitle>
        <CardDescription>A list of all inquiries submitted by users.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>Total inquiries: {inquiries.length}</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Inquiry #</TableHead>
              <TableHead>Project Name</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount (TSh)</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inquiries.map((inquiry) => (
              <TableRow key={inquiry.id}>
                <TableCell className="font-medium">{inquiry.inquiry_number}</TableCell>
                <TableCell>{inquiry.project_name}</TableCell>
                <TableCell>{inquiry.profiles?.full_name || 'N/A'}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(inquiry.status)}>{inquiry.status}</Badge>
                </TableCell>
                <TableCell className="text-right">{inquiry.total_amount.toLocaleString()}</TableCell>
                <TableCell>{format(new Date(inquiry.created_at), "dd MMM yyyy")}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/inquiries/${inquiry.id}`)}>
                    View
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default InquiriesTab;
