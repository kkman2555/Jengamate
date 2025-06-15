
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

interface InquiryDetailsCardProps {
  createdAt: string | null;
  expectedDate: string | null;
  totalAmount: number | null;
  deliveryAddress: string | null;
  needsTransport: boolean | null;
}

export function InquiryDetailsCard({
  createdAt,
  expectedDate,
  totalAmount,
  deliveryAddress,
  needsTransport
}: InquiryDetailsCardProps) {
  const renderDetail = (label: string, value: React.ReactNode) => (
    <div className="flex justify-between items-start py-3 border-b last:border-b-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-medium text-right break-words max-w-[60%]">{value}</span>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Inquiry Details</CardTitle>
      </CardHeader>
      <CardContent>
        {renderDetail("Submitted On", createdAt ? format(new Date(createdAt), 'PPP') : 'N/A')}
        {renderDetail("Expected Delivery", expectedDate ? format(new Date(expectedDate), 'PPP') : 'N/A')}
        {renderDetail("Estimated Amount", `TSh ${totalAmount?.toLocaleString() || 0}`)}
        {renderDetail("Delivery Address", deliveryAddress)}
        {renderDetail("Needs Transport", needsTransport ? "Yes" : "No")}
      </CardContent>
    </Card>
  );
}
