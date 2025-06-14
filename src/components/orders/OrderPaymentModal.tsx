
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface OrderPaymentModalProps {
  open: boolean;
  onClose: () => void;
  orderId: string;
  onSuccess: () => void;
}

export const OrderPaymentModal: React.FC<OrderPaymentModalProps> = ({ open, onClose, orderId, onSuccess }) => {
  const { toast } = useToast();
  const [files, setFiles] = useState<File[]>([]);
  const [reference, setReference] = useState("");
  const [date, setDate] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (files.length === 0 || !reference || !date) {
      toast({ title: "Error", description: "Please fill all fields and select at least one file", variant: "destructive" });
      return;
    }
    setUploading(true);

    try {
      // Upload files to bucket
      const uploadPromises = files.map(file => {
        const path = `${orderId}_${Date.now()}_${file.name.replace(/\s/g, '_')}`;
        return supabase.storage.from('order-receipts').upload(path, file);
      });

      const uploadResults = await Promise.all(uploadPromises);

      const urls: string[] = [];
      for (const result of uploadResults) {
        if (result.error) throw result.error;
        if (result.data) {
          const { data: publicUrlData } = supabase.storage.from('order-receipts').getPublicUrl(result.data.path);
          if (publicUrlData?.publicUrl) {
            urls.push(publicUrlData.publicUrl);
          }
        }
      }

      // Update order row
      const { error: updateError } = await supabase
        .from("orders")
        .update({ receipt_urls: urls, payment_reference: reference, payment_date: date })
        .eq("id", orderId);

      if (updateError) throw updateError;

      toast({ title: "Success", description: "Payment receipts submitted!" });
      setFiles([]);
      setReference("");
      setDate("");
      onClose();
      onSuccess();
    } catch (error: any) {
      toast({ title: "Upload Error", description: error?.message || "Could not upload receipts", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Submit Bank Payment Receipt</DialogTitle>
          <DialogDescription>
            Upload your receipt image(s) (jpg, png, or PDF), enter your transaction reference number and payment date. Admin will verify your payment.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Input type="file" accept="image/*,application/pdf" onChange={handleFileChange} multiple />
          </div>
          <div>
            <Input placeholder="Reference/UTR Number" value={reference} onChange={e => setReference(e.target.value)} />
          </div>
          <div>
            <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={uploading}>{uploading ? "Uploading..." : "Submit"}</Button>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
