
import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const inquiryFormSchema = z.object({
  project_name: z.string().min(1, { message: "Project name is required" }),
  project_type: z.string().min(1, { message: "Project type is required" }),
  total_amount: z.coerce.number().min(0, { message: "Amount must be a positive number" }),
  expected_date: z.string().refine(val => val && !isNaN(Date.parse(val)), { message: "A valid expected date is required" }),
  delivery_address: z.string().min(1, { message: "Delivery address is required" }),
  needs_transport: z.boolean().default(false),
  products: z.array(z.string()).min(1, { message: "At least one product/service is required" }),
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

const PROJECT_TYPES = [
  "Construction & Building",
  "Industrial Engineering",
  "Mechanical Engineering",
  "Electrical Engineering",
  "Civil Engineering",
  "Infrastructure",
  "Manufacturing",
  "Other"
];

export function InquiryForm({ onSubmit, isSubmitting }: InquiryFormProps) {
  const form = useForm<InquiryFormValues>({
    resolver: zodResolver(inquiryFormSchema),
    defaultValues: {
      project_name: "",
      project_type: "",
      total_amount: undefined,
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

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "products",
  });

  const addProduct = () => {
    append("");
  };

  const removeProduct = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Project Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <FormField
                control={form.control}
                name="project_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select project type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PROJECT_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="project_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide a detailed description of your project, including scope, requirements, and objectives..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Please include as much detail as possible to help us understand your needs.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Products & Services Required</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2 items-start">
                <FormField
                  control={form.control}
                  name={`products.${index}`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      {index === 0 && <FormLabel>Product/Service {index + 1}</FormLabel>}
                      <FormControl>
                        <Input
                          placeholder="e.g. 500 bags of cement, 2 tons of steel rebar, electrical installation..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeProduct(index)}
                    className="mt-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addProduct}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Another Product/Service
            </Button>
            
            <FormField
              control={form.control}
              name="specifications"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Technical Specifications (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Include any technical specifications, standards, or special requirements..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Any specific technical requirements, quality standards, or certifications needed.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="total_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estimated Budget (TSh)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g. 1000000" {...field} />
                    </FormControl>
                    <FormDescription>
                      Your estimated budget for this project
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="expected_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expected Completion Date</FormLabel>
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
                  <FormLabel>Project/Delivery Address</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 123 Nyerere Rd, Dar es Salaam" {...field} />
                  </FormControl>
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
                    <FormLabel>Transportation Required</FormLabel>
                    <FormDescription>
                      Check this if you need materials/equipment delivered to your site.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="contact_person"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Person</FormLabel>
                    <FormControl>
                      <Input placeholder="Full name of project contact" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+255 xxx xxx xxx" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

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
