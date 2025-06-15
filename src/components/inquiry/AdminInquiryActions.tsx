
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Inquiry = Database['public']['Tables']['inquiries']['Row'];

interface AdminInquiryActionsProps {
  inquiry: Inquiry;
  onUpdate: () => void;
}

const AdminInquiryActions = ({ inquiry, onUpdate }: AdminInquiryActionsProps) => {
  const [status, setStatus] = useState(inquiry.status || 'Pending');
  const [totalAmount, setTotalAmount] = useState(inquiry.total_amount || 0);
  const [commission, setCommission] = useState(inquiry.commission || 0);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setStatus(inquiry.status || 'Pending');
    setTotalAmount(inquiry.total_amount || 0);
    setCommission(inquiry.commission || 0);
  }, [inquiry]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from('inquiries')
      .update({
        status: status,
        total_amount: totalAmount,
        commission: commission,
        updated_at: new Date().toISOString(),
      })
      .eq('id', inquiry.id);

    setLoading(false);
    if (error) {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Inquiry Updated",
        description: "The inquiry details have been saved successfully.",
      });
      onUpdate();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Actions</CardTitle>
        <CardDescription>Update inquiry status and financial details.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="status">Inquiry Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Quoted">Quoted</SelectItem>
                <SelectItem value="Accepted">Accepted</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="totalAmount">Quotation Amount (TSh)</Label>
              <Input
                id="totalAmount"
                type="number"
                step="any"
                value={totalAmount}
                onChange={(e) => setTotalAmount(Number(e.target.value))}
                placeholder="Enter total amount"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="commission">Commission (TSh)</Label>
              <Input
                id="commission"
                type="number"
                step="any"
                value={commission}
                onChange={(e) => setCommission(Number(e.target.value))}
                placeholder="Enter commission amount"
              />
            </div>
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AdminInquiryActions;
