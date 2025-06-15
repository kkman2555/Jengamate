
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function BankTransferInfo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bank Transfer Instructions</CardTitle>
        <CardDescription>After transferring payment, upload your receipt above.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-sm space-y-1">
          <div><b>Bank Name:</b> YOUR BANK NAME</div>
          <div><b>Account Number:</b> 1234567890</div>
          <div><b>Account Name:</b> ACME ENGINEERS LLP</div>
          <div><b>IFSC:</b> ABCD0123456</div>
          <div><b>Type:</b> Current</div>
        </div>
      </CardContent>
    </Card>
  );
}
