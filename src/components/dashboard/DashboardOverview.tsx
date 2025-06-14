
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, ShoppingCart, TrendingUp, Users, Plus, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MetricCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  trend?: string;
}

function MetricCard({ title, value, description, icon, trend }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">
          {trend && <span className="text-green-600">{trend}</span>} {description}
        </p>
      </CardContent>
    </Card>
  );
}

export function DashboardOverview() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your engineering commission management platform
          </p>
        </div>
        <Button onClick={() => navigate('/inquiries')} className="gap-2">
          <Plus className="h-4 w-4" />
          New Inquiry
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Inquiries"
          value="24"
          description="from last month"
          trend="+20.1%"
          icon={<FileText className="h-4 w-4 text-muted-foreground" />}
        />
        <MetricCard
          title="Active Orders"
          value="12"
          description="currently processing"
          trend="+15%"
          icon={<ShoppingCart className="h-4 w-4 text-muted-foreground" />}
        />
        <MetricCard
          title="Total Revenue"
          value="₹2,45,000"
          description="this month"
          trend="+25%"
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
        />
        <MetricCard
          title="Active Users"
          value="48"
          description="engineers registered"
          trend="+5%"
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full justify-start gap-2"
              onClick={() => navigate('/inquiries')}
            >
              <Plus className="h-4 w-4" />
              Create New Inquiry
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start gap-2"
              onClick={() => navigate('/orders')}
            >
              <Eye className="h-4 w-4" />
              View All Orders
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start gap-2"
              onClick={() => navigate('/admin')}
            >
              <Users className="h-4 w-4" />
              Admin Dashboard
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest system updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <div className="text-sm">
                  <p className="font-medium">New inquiry submitted</p>
                  <p className="text-muted-foreground">INQ-2025-001 - Steel Structure Project</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <div className="text-sm">
                  <p className="font-medium">Order payment received</p>
                  <p className="text-muted-foreground">SO-2025-012 - ₹85,000</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
                <div className="text-sm">
                  <p className="font-medium">Commission processed</p>
                  <p className="text-muted-foreground">₹12,500 for Engineer ID: ENG-001</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
