import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, ShoppingCart, TrendingUp, Users, Plus, Eye, CreditCard, CircleCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDashboardData, ActivityItem } from '@/hooks/useDashboardData';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { MetricCard } from './MetricCard';
import { RevenueTrendsChart } from './RevenueTrendsChart';
import { OrderStatusChart } from './OrderStatusChart';

const DashboardLoadingSkeleton = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-80 mt-2" />
      </div>
      <Skeleton className="h-10 w-36" />
    </div>
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-7 w-12 mb-2" />
            <Skeleton className="h-3 w-32" />
          </CardContent>
        </Card>
      ))}
    </div>
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader><Skeleton className="h-6 w-32" /></CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader><Skeleton className="h-6 w-32" /></CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </CardContent>
      </Card>
    </div>
  </div>
);

const RecentActivityItem = ({ activity }: { activity: ActivityItem }) => {
  const is_inquiry = activity.type === 'inquiry';
  const title = is_inquiry ? 'New inquiry submitted' : 'New order created';
  
  const description = is_inquiry 
    ? `${activity.inquiry_number} - ${activity.project_name}`
    : `${activity.order_number} - TSh${activity.total_amount?.toLocaleString() || 0}`;

  return (
    <div className="flex items-center space-x-4">
      <div className={`w-2 h-2 rounded-full ${is_inquiry ? 'bg-blue-600' : 'bg-green-600'}`}></div>
      <div className="text-sm flex-1">
        <p className="font-medium">{title}</p>
        <p className="text-muted-foreground truncate">{description}</p>
        <p className="text-xs text-muted-foreground">
          by {activity.profiles?.full_name || 'Unknown'} on {format(new Date(activity.created_at!), 'PPP')}
        </p>
      </div>
    </div>
  )
};

export function DashboardOverview() {
  const navigate = useNavigate();
  const { data, loading } = useDashboardData();

  if (loading || !data) {
    return <DashboardLoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your engineering commission management platform
          </p>
        </div>
        <Button onClick={() => navigate('/inquiries/new')} className="gap-2">
          <Plus className="h-4 w-4" />
          New Inquiry
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Revenue"
          value={`TSh${data.totalRevenue.toLocaleString()}`}
          description="from all orders"
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
        />
        <MetricCard
          title="Pending Payments"
          value={`TSh${data.pendingPayments.toLocaleString()}`}
          description="across all active orders"
          icon={<CreditCard className="h-4 w-4 text-muted-foreground" />}
        />
        <MetricCard
          title="Completed Orders"
          value={data.completedThisMonth}
          description="this month"
          icon={<CircleCheck className="h-4 w-4 text-muted-foreground" />}
        />
        <MetricCard
          title="Active Orders"
          value={data.activeOrders}
          description="currently processing"
          icon={<ShoppingCart className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <RevenueTrendsChart data={data.revenueTrends} />
        <OrderStatusChart data={data.orderStatusDistribution} />
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
              onClick={() => navigate('/inquiries/new')}
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
            {data.recentActivity.length > 0 ? (
              <div className="space-y-4">
                {data.recentActivity.map((activity) => (
                  <RecentActivityItem key={activity.id} activity={activity} />
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No recent activity to display.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
