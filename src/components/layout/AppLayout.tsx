
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { Breadcrumbs } from './Breadcrumbs';
import { NotificationSystem } from '@/components/notifications/NotificationSystem';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <div className="border-b bg-background px-6 py-3">
            <div className="flex items-center justify-between">
              <Breadcrumbs />
              <NotificationSystem />
            </div>
          </div>
          <div className="flex-1 p-6">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
