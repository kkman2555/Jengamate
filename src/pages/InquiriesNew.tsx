
import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AppLayout } from "@/components/layout/AppLayout";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";

const inquiryFormSchema = z.object({
  project_name: z.string().min(1, { message: "Project name is required" }),
  total_amount: z.coerce.number().min(0, { message: "Amount must be a positive number" }),
  expected_date: z.string().refine(val => val && !isNaN(Date.parse(val)), { message: "A valid expected date is required" }),
  delivery_address: z.string().min(1, { message: "Delivery address is required" }),
  needs_transport: z.boolean().default(false),
  products: z.string().optional(),
});

type InquiryFormValues = z.infer<typeof inquiryFormSchema>;


const InquiriesNew = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<InquiryFormValues>({
    resolver: zodResolver(inquiryFormSchema),
    defaultValues: {
      project_name: "",
      total_amount: undefined,
      expected_date: "",
      delivery_address: "",
      needs_transport: false,
      products: "",
    },
  });
  
  const { isSubmitting } = form.formState;

  const onSubmit = async (data: InquiryFormValues) => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) {
      toast({ title: "Error", description: "You must be logged in to create an inquiry.", variant: "destructive" });
      return;
    }

    const inquiry_number = "INQ-" + Date.now();
    const { error } = await supabase.from("inquiries").insert([{
      inquiry_number,
      project_name: data.project_name,
      total_amount: data.total_amount,
      expected_date: data.expected_date,
      delivery_address: data.delivery_address,
      needs_transport: data.needs_transport,
      products: data.products ? [data.products] : [],
      user_id: user.id,
      status: "Pending"
    }]);

    if (error) {
      toast({ title: "Error creating inquiry", description: error.message, variant: "destructive" });
      return;
    }
    
    toast({ title: "Inquiry Created", description: "Your inquiry was submitted successfully!" });
    navigate("/inquiries");
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>New Project Inquiry</CardTitle>
            <CardDescription>Fill out the form below to submit an inquiry for your project.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="project_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Downtown Apartment Complex" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="total_amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Estimated Amount (TSh)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g. 1,000,000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="expected_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expected Delivery Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="delivery_address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Delivery Address</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 123 Nyerere Rd, Dar es Salaam" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="products"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Products / Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="List the products or services your project needs (e.g., 500 bags of cement, 2 tons of steel rebar, etc.)"
                          {...field}
                        />
                      </FormControl>
                       <FormDescription>
                        Provide a brief description of what you need.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="needs_transport"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                       <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Transportation Required
                        </FormLabel>
                        <FormDescription>
                          Check this box if you require delivery to your site.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Inquiry"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default InquiriesNew;
