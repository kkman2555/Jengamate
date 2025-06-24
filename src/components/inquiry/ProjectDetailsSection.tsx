
import React from "react";
import { Control } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface ProjectDetailsSectionProps {
  control: Control<any>;
}

export function ProjectDetailsSection({ control }: ProjectDetailsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
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
            control={control}
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
          control={control}
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
          control={control}
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
  );
}
