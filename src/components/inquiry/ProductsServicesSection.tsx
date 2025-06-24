
import React from "react";
import { Control, FieldArrayWithId, UseFieldArrayAppend, UseFieldArrayRemove } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

interface ProductsServicesSectionProps {
  control: Control<any>;
  fields: FieldArrayWithId<any, "products", "id">[];
  append: UseFieldArrayAppend<any, "products">;
  remove: UseFieldArrayRemove;
}

export function ProductsServicesSection({ control, fields, append, remove }: ProductsServicesSectionProps) {
  const addProduct = () => {
    append("");
  };

  const removeProduct = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Products & Services Required</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-2 items-start">
            <FormField
              control={control}
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
          control={control}
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
  );
}
