
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AppLayout } from "@/components/layout/AppLayout";
import { InquiryForm } from "@/components/inquiry/InquiryForm";

const InquiriesNew = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) {
        toast({ 
          title: "Error", 
          description: "You must be logged in to create an inquiry.", 
          variant: "destructive" 
        });
        return;
      }

      const inquiry_number = "INQ-" + Date.now();
      
      // Prepare the data for insertion
      const insertData = {
        inquiry_number,
        project_name: data.project_name,
        total_amount: data.total_amount,
        expected_date: data.expected_date,
        delivery_address: data.delivery_address,
        needs_transport: data.needs_transport,
        products: data.products.filter((p: string) => p.trim() !== ""), // Remove empty products
        user_id: user.id,
        status: "Pending",
        // Additional fields for the enhanced form
        project_type: data.project_type,
        project_description: data.project_description,
        specifications: data.specifications || null,
        contact_person: data.contact_person,
        phone_number: data.phone_number,
      };

      const { error } = await supabase.from("inquiries").insert([insertData]);

      if (error) {
        console.error("Error creating inquiry:", error);
        toast({ 
          title: "Error creating inquiry", 
          description: error.message, 
          variant: "destructive" 
        });
        return;
      }
      
      toast({ 
        title: "Success!", 
        description: "Your inquiry has been submitted successfully. We'll review it and get back to you soon." 
      });
      navigate("/inquiries");
    } catch (error) {
      console.error("Unexpected error:", error);
      toast({ 
        title: "Error", 
        description: "An unexpected error occurred. Please try again.", 
        variant: "destructive" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto py-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">Submit New Project Inquiry</CardTitle>
            <CardDescription className="text-base">
              Fill out this comprehensive form to submit an inquiry for your engineering project. 
              Our team will review your requirements and provide you with a detailed quotation.
            </CardDescription>
          </CardHeader>
        </Card>
        
        <InquiryForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </AppLayout>
  );
};

export default InquiriesNew;
