
import React from "react";
import { Control } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ShippingSectionProps {
  control: Control<any>;
}

export function ShippingSection({ control }: ShippingSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Shipping Service</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={control}
          name="needs_transport"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Do you need delivery service?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={(value) => field.onChange(value === "yes")}
                  value={field.value ? "yes" : "no"}
                  className="flex space-x-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="yes" />
                    <label htmlFor="yes" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Yes
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="no" />
                    <label htmlFor="no" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      No
                    </label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="delivery_address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Delivery Address (if applicable)</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter full delivery address including city and region"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
