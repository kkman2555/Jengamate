
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProductDescriptionCardProps {
  products: any | null;
}

export function ProductDescriptionCard({ products }: ProductDescriptionCardProps) {
  const getProductDescription = () => {
    if (Array.isArray(products) && products.length > 0 && typeof products[0] === 'string' && products[0]) {
      return products[0];
    }
    if (typeof products === 'string' && products) {
      return products;
    }
    return "No description provided.";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Products / Description</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
          {getProductDescription()}
        </p>
      </CardContent>
    </Card>
  );
}
