
import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { ProjectInformationSection } from "./ProjectInformationSection";
import { ProductsServicesSection } from "./ProductsServicesSection";
import { ProjectDetailsSection } from "./ProjectDetailsSection";
import { ContactInformationSection } from "./ContactInformationSection";

const inquiryFormSchema = z.object({
  project_name: z.string().min(1, { message: "Project name is required" }),
  project_type: z.string().min(1, { message: "Project type is required" }),
  total_amount: z.coerce.number().min(0, { message: "Amount must be a positive number" }),
  expected_date: z.string().refine(val => val && !isNaN(Date.parse(val)), { message: "A valid expected date is required" }),
  delivery_address: z.string().min(1, { message: "Delivery address is required" }),
  needs_transport: z.boolean().default(false),
  products: z.array(z.string().min(1, { message: "Product/service cannot be empty" })).min(1, { message: "At least one product/service is required" }),
  project_description: z.string().min(10, { message: "Please provide a detailed project description (minimum 10 characters)" }),
  specifications: z.string().optional(),
  contact_person: z.string().min(1, { message: "Contact person is required" }),
  phone_number: z.string().min(1, { message: "Phone number is required" }),
});

type InquiryFormValues = z.infer<typeof inquiryFormSchema>;

interface InquiryFormProps {
  onSubmit: (data: InquiryFormValues) => Promise<void>;
  isSubmitting: boolean;
}

export function InquiryForm({ onSubmit, isSubmitting }: InquiryFormProps) {
  const form = useForm<InquiryFormValues>({
    resolver: zodResolver(inquiryFormSchema),
    defaultValues: {
      project_name: "",
      project_type: "",
      total_amount: 0,
      expected_date: "",
      delivery_address: "",
      needs_transport: false,
      products: [""],
      project_description: "",
      specifications: "",
      contact_person: "",
      phone_number: "",
    },
  });

  const { fields, append, remove } = useFieldArray<InquiryFormValues, "products", "id">({
    control: form.control,
    name: "products",
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <ProjectInformationSection control={form.control} />
        
        <ProductsServicesSection 
          control={form.control}
          fields={fields}
          append={append}
          remove={remove}
        />

        <ProjectDetailsSection control={form.control} />

        <ContactInformationSection control={form.control} />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting Inquiry...
            </>
          ) : (
            "Submit Project Inquiry"
          )}
        </Button>
      </form>
    </Form>
  );
}
