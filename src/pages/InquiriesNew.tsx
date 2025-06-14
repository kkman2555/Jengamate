
import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AppLayout } from "@/components/layout/AppLayout";

type InquiryFormValues = {
  project_name: string;
  total_amount: number;
  expected_date: string;
  delivery_address: string;
  needs_transport: boolean;
  products: string;
};

const InquiriesNew = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<InquiryFormValues>();

  const onSubmit = async (data: InquiryFormValues) => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) {
      toast({ title: "Error", description: "You must be logged in to create an inquiry.", variant: "destructive" });
      return;
    }
    // Auto-generate an inquiry_number based on timestamp
    const inquiry_number = "INQ-" + Date.now();
    const result = await supabase.from("inquiries").insert([{
      inquiry_number,
      project_name: data.project_name,
      total_amount: Number(data.total_amount) || 0,
      expected_date: data.expected_date,
      delivery_address: data.delivery_address,
      needs_transport: data.needs_transport,
      products: data.products ? [data.products] : [],
      user_id: user.id,
      status: "Pending"
    }]);
    if (result.error) {
      toast({ title: "Error", description: result.error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Inquiry Created", description: "Your inquiry was submitted successfully!" });
    navigate("/inquiries");
  };

  return (
    <AppLayout>
      <div className="max-w-xl mx-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>New Inquiry</CardTitle>
              <CardDescription>Fill out the form to submit an inquiry for your project.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Project Name</label>
                <Input
                  {...register("project_name", { required: "Project name is required" })}
                  placeholder="e.g. Apartment Complex Build"
                  disabled={isSubmitting}
                />
                {errors.project_name && <p className="text-red-600 text-sm">{errors.project_name.message}</p>}
              </div>
              <div>
                <label className="block font-medium mb-1">Total Estimated Amount (TSh)</label>
                <Input
                  type="number"
                  step="1"
                  min="0"
                  {...register("total_amount", { required: "Amount is required", valueAsNumber: true })}
                  placeholder="1000000"
                  disabled={isSubmitting}
                />
                {errors.total_amount && <p className="text-red-600 text-sm">{errors.total_amount.message}</p>}
              </div>
              <div>
                <label className="block font-medium mb-1">Expected Delivery Date</label>
                <Input
                  type="date"
                  {...register("expected_date", { required: "Expected date is required" })}
                  disabled={isSubmitting}
                />
                {errors.expected_date && <p className="text-red-600 text-sm">{errors.expected_date.message}</p>}
              </div>
              <div>
                <label className="block font-medium mb-1">Delivery Address</label>
                <Input
                  {...register("delivery_address", { required: "Address is required" })}
                  placeholder="e.g. 123 Nyerere Rd, Dar es Salaam"
                  disabled={isSubmitting}
                />
                {errors.delivery_address && <p className="text-red-600 text-sm">{errors.delivery_address.message}</p>}
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="needsTransportCheckbox"
                  type="checkbox"
                  {...register("needs_transport")}
                  className="accent-blue-600 w-4 h-4 rounded border border-input"
                  disabled={isSubmitting}
                />
                <label htmlFor="needsTransportCheckbox" className="text-sm">Needs Transportation</label>
              </div>
              <div>
                <label className="block font-medium mb-1">Products / Description (optional)</label>
                <Textarea
                  {...register("products")}
                  placeholder="What products or services does your project need?"
                  disabled={isSubmitting}
                />
              </div>
            </CardContent>
            <CardContent>
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Inquiry"}
              </Button>
            </CardContent>
          </Card>
        </form>
      </div>
    </AppLayout>
  );
};

export default InquiriesNew;
