
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, DollarSign, Package, Phone, User } from 'lucide-react';

interface InquiryCardProps {
  inquiry: {
    id: string;
    inquiry_number: string;
    project_name: string;
    project_type?: string | null;
    status: string | null;
    total_amount: number | null;
    expected_date: string | null;
    delivery_address: string | null;
    needs_transport: boolean | null;
    products: string[];
    project_description?: string | null;
    contact_person?: string | null;
    phone_number?: string | null;
    created_at: string | null;
  };
}

export function InquiryCard({ inquiry }: InquiryCardProps) {
  const navigate = useNavigate();

  const getStatusVariant = (status: string): "default" | "destructive" | "outline" | "secondary" | null | undefined => {
    switch (status) {
      case 'Pending': return 'default';
      case 'Quoted': return 'outline';
      case 'Accepted': return 'secondary';
      case 'Rejected': return 'destructive';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'text-yellow-600 bg-yellow-50';
      case 'Quoted': return 'text-blue-600 bg-blue-50';
      case 'Accepted': return 'text-green-600 bg-green-50';
      case 'Rejected': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-lg">{inquiry.project_name}</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <span>#{inquiry.inquiry_number}</span>
              {inquiry.project_type && (
                <>
                  <span>•</span>
                  <span>{inquiry.project_type}</span>
                </>
              )}
            </CardDescription>
          </div>
          <Badge 
            variant={getStatusVariant(inquiry.status || 'Pending')} 
            className={getStatusColor(inquiry.status || 'Pending')}
          >
            {inquiry.status || 'Pending'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {inquiry.project_description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {inquiry.project_description}
          </p>
        )}
        
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span>TSh {inquiry.total_amount?.toLocaleString() || 0}</span>
          </div>
          
          {inquiry.expected_date && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{format(new Date(inquiry.expected_date), 'MMM dd, yyyy')}</span>
            </div>
          )}
          
          {inquiry.delivery_address && (
            <div className="flex items-center gap-2 col-span-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="truncate">{inquiry.delivery_address}</span>
            </div>
          )}
        </div>

        {inquiry.products && inquiry.products.length > 0 && (
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span>Products/Services:</span>
            </div>
            <div className="text-sm text-muted-foreground">
              {inquiry.products.slice(0, 2).map((product, index) => (
                <div key={index} className="truncate">• {product}</div>
              ))}
              {inquiry.products.length > 2 && (
                <div className="text-xs">...and {inquiry.products.length - 2} more</div>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center text-xs text-muted-foreground">
          {inquiry.contact_person && (
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span>{inquiry.contact_person}</span>
            </div>
          )}
          {inquiry.phone_number && (
            <div className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              <span>{inquiry.phone_number}</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground">
          {inquiry.created_at && `Submitted ${format(new Date(inquiry.created_at), 'PPP')}`}
        </span>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate(`/inquiries/${inquiry.id}`)}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
