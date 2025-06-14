import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FileText } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const Inquiries = () => {
  const navigate = useNavigate();
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Inquiries</h1>
            <p className="text-muted-foreground">
              Manage your project inquiries and quotations
            </p>
          </div>
          <Button className="gap-2" onClick={() => navigate("/inquiries/new")}>
            <Plus className="h-4 w-4" />
            New Inquiry
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Inquiry Management
            </CardTitle>
            <CardDescription>
              Create and manage inquiries for engineering projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground py-8">
              Inquiry management features will be implemented here.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Inquiries;
