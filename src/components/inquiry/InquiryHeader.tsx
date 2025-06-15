
import React from 'react';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface InquiryHeaderProps {
  projectName: string;
  inquiryNumber: string;
  status: string;
}

export function InquiryHeader({ projectName, inquiryNumber, status }: InquiryHeaderProps) {
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
    <CardHeader>
      <div className="flex justify-between items-start">
        <div>
          <CardTitle className="text-3xl">{projectName}</CardTitle>
          <CardDescription>Inquiry #{inquiryNumber}</CardDescription>
        </div>
        <Badge variant={getStatusVariant(status)} className="text-base px-3 py-1">
          {status}
        </Badge>
      </div>
    </CardHeader>
  );
}
