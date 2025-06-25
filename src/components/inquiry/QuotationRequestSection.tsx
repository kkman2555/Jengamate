
import React from "react";
import { Control, FieldArrayWithId, UseFieldArrayAppend, UseFieldArrayRemove } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const PRODUCT_TYPES = [
  "Roofing Sheet",
  "Steel Bars",
  "Cement",
  "Tiles",
  "Pipes",
  "Blocks",
  "Wire Mesh",
  "Other"
];

const THICKNESS_OPTIONS = ["28 G", "30 G", "32 G", "0.5mm", "0.7mm", "1.0mm"];
const PROFILE_OPTIONS = ["IT4", "IBR", "Corrugated", "Flat"];
const COLOR_OPTIONS = ["Black", "White", "Red", "Blue", "Green", "Grey"];

interface QuotationRequestSectionProps {
  control: Control<any>;
  fields: FieldArrayWithId<any, "products", "id">[];
  append: UseFieldArrayAppend<any, "products">;
  remove: UseFieldArrayRemove;
}

export function QuotationRequestSection({ control, fields, append, remove }: QuotationRequestSectionProps) {
  const addProduct = () => {
    append({
      product_type: "",
      thickness: "",
      profile: "",
      color: "",
      length: "",
      quantity: 1,
      specifications: "",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Product Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {fields.map((field, index) => (
          <div key={field.id} className="border rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg">Product {index + 1}</h3>
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => remove(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            <FormField
              control={control}
              name={`products.${index}.product_type`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select product type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PRODUCT_TYPES.map((type) => (
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

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <FormField
                control={control}
                name={`products.${index}.thickness`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thickness</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {THICKNESS_OPTIONS.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`products.${index}.profile`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PROFILE_OPTIONS.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`products.${index}.color`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {COLOR_OPTIONS.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`products.${index}.length`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Length (m)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 3.0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={control}
              name={`products.${index}.quantity`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Enter quantity" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`products.${index}.specifications`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Specifications (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Any special requirements or notes..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={addProduct}
          className="w-full border-2 border-dashed border-blue-300 text-blue-600 hover:bg-blue-50"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Another Product
        </Button>

        <div className="space-y-4">
          <FormField
            control={control}
            name="project_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Residential Building Construction" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="project_description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Provide details about your project and how you plan to use these materials..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
