
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';

const routeNames: Record<string, string> = {
  '/': 'Dashboard',
  '/auth': 'Authentication',
  '/admin': 'Admin Dashboard',
  '/admin/users': 'User Management',
  '/inquiries': 'Inquiries',
  '/orders': 'Orders',
  '/analytics': 'Analytics',
};

export function Breadcrumbs() {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  
  // Build breadcrumb items from path segments
  const breadcrumbItems = pathSegments.reduce((acc, segment, index) => {
    const path = '/' + pathSegments.slice(0, index + 1).join('/');
    const name = routeNames[path] || segment.charAt(0).toUpperCase() + segment.slice(1);
    
    acc.push({
      path,
      name,
      isLast: index === pathSegments.length - 1
    });
    
    return acc;
  }, [] as Array<{ path: string; name: string; isLast: boolean }>);

  // Always include home if not already there
  if (location.pathname !== '/') {
    breadcrumbItems.unshift({
      path: '/',
      name: 'Dashboard',
      isLast: false
    });
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={item.path}>
            <BreadcrumbItem>
              {item.isLast ? (
                <BreadcrumbPage>{item.name}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link to={item.path}>{item.name}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {!item.isLast && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
