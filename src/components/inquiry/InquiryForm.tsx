
import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { QuotationRequestSection } from "./QuotationRequestSection";
import { ShippingSection } from "./ShippingSection";
import { ContactInformationSection } from "./ContactInformationSection";

const quotationFormSchema = z.object({
  products: z.array(z.object({
    product_type: z.string().min(1, { message: "Product type is required" }),
    thickness: z.string().optional(),
    profile: z.string().optional(),
    color: z.string().optional(),
    length: z.string().optional(),
    quantity: z.coerce.number().min(1, { message: "Quantity is required" }),
    specifications: z.string().optional(),
  })).min(1, { message: "At least one product is required" }),
  needs_transport: z.boolean().default(false),
  delivery_address: z.string().optional(),
  contact_person: z.string().min(1, { message: "Contact person is required" }),
  phone_number: z.string().min(1, { message: "Phone number is required" }),
  project_name: z.string().min(1, { message: "Project name is required" }),
  project_description: z.string().min(10, { message: "Please provide a detailed project description (minimum 10 characters)" }),
});

type QuotationFormValues = z.infer<typeof quotationFormSchema>;

interface InquiryFormProps {
  onSubmit: (data: any) => Promise<void>;
  isSubmitting: boolean;
}

export function InquiryForm({ onSubmit, isSubmitting }: InquiryFormProps) {
  const form = useForm<QuotationFormValues>({
    resolver: zodResolver(quotationFormSchema),
    defaultValues: {
      products: [{
        product_type: "",
        thickness: "",
        profile: "",
        color: "",
        length: "",
        quantity: 1,
        specifications: "",
      }],
      needs_transport: false,
      delivery_address: "",
      contact_person: "",
      phone_number: "",
      project_name: "",
      project_description: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "products",
  });

  const handleFormSubmit = async (data: QuotationFormValues) => {
    // Transform data to match the original format expected by the backend
    const transformedData = {
      project_name: data.project_name,
      project_type: "Product Quotation", // Set a default project type
      total_amount: 0, // Will be calculated by admin
      expected_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
      delivery_address: data.delivery_address || "",
      needs_transport: data.needs_transport,
      products: data.products.map(product => 
        `${product.product_type}${product.thickness ? ` - ${product.thickness}` : ''}${product.profile ? ` - ${product.profile}` : ''}${product.color ? ` - ${product.color}` : ''}${product.length ? ` - ${product.length}` : ''} (Qty: ${product.quantity})${product.specifications ? ` - ${product.specifications}` : ''}`
      ),
      project_description: data.project_description,
      specifications: data.products.map(p => p.specifications).filter(Boolean).join('; ') || undefined,
      contact_person: data.contact_person,
      phone_number: data.phone_number,
    };

    await onSubmit(transformedData);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Request a Quotation</h1>
        <p className="text-gray-600">Get detailed pricing for your construction materials</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
          <QuotationRequestSection 
            control={form.control}
            fields={fields}
            append={append}
            remove={remove}
          />

          <ShippingSection control={form.control} />

          <ContactInformationSection control={form.control} />

          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-lg font-semibold"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Submitting Request...
              </>
            ) : (
              "Submit Request"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
