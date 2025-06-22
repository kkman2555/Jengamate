
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Users,
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
  FileText,
  Building,
  Star,
  CreditCard,
  User,
  UserCheck,
  Shield,
  ChevronDown,
  Database,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface MenuGroup {
  title: string;
  items: MenuItem[];
}

interface MenuItem {
  title: string;
  path: string;
  icon: React.ComponentType<any>;
  badge?: string;
  subItems?: MenuItem[];
}

const AdminSidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const menuGroups: MenuGroup[] = [
    {
      title: "MAIN MENU",
      items: [
        {
          title: "Dashboard",
          path: "/admin",
          icon: Home
        }
      ]
    },
    {
      title: "USER MANAGEMENT",
      items: [
        {
          title: "User Management",
          path: "/admin/users",
          icon: Users
        }
      ]
    },
    {
      title: "SERVICE MANAGEMENT",
      items: [
        {
          title: "Service Category",
          path: "/admin/service-category",
          icon: Building
        },
        {
          title: "Service Sub Category",
          path: "/admin/service-sub-category",
          icon: Package
        },
        {
          title: "Services",
          path: "/admin/services",
          icon: Star
        },
        {
          title: "Service Requests",
          path: "/admin/service-requests",
          icon: FileText
        }
      ]
    },
    {
      title: "PRODUCT MANAGEMENT",
      items: [
        {
          title: "Product Brand",
          path: "/admin/product-brand",
          icon: Building
        },
        {
          title: "Product Category",
          path: "/admin/product-category",
          icon: Package
        },
        {
          title: "Product Sub Category",
          path: "/admin/product-sub-category",
          icon: Package
        },
        {
          title: "Product Unit",
          path: "/admin/product-unit",
          icon: Database
        },
        {
          title: "Products",
          path: "/admin/products",
          icon: Package
        },
        {
          title: "Orders",
          path: "/admin/orders",
          icon: ShoppingCart
        }
      ]
    },
    {
      title: "COMMISSION SYSTEM",
      items: [
        {
          title: "Commissions",
          path: "/admin/commissions",
          icon: CreditCard
        },
        {
          title: "Referrals",
          path: "/admin/referrals",
          icon: UserCheck
        },
        {
          title: "Withdrawals",
          path: "/admin/withdrawals",
          icon: CreditCard
        }
      ]
    },
    {
      title: "ANALYTICS & REPORTS",
      items: [
        {
          title: "View Reports",
          path: "/admin/reports",
          icon: BarChart3
        },
        {
          title: "Ratings",
          path: "/admin/ratings",
          icon: Star
        }
      ]
    },
    {
      title: "SETTINGS",
      items: [
        {
          title: "System Settings",
          path: "/admin/system-settings",
          icon: Settings
        },
        {
          title: "Role And Permission",
          path: "/admin/roles-permissions",
          icon: Shield
        }
      ]
    }
  ];

  const isActive = (path: string) => currentPath === path;

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-800">Admin Panel</h2>
      </div>
      
      <nav className="p-4 space-y-6">
        {menuGroups.map((group, groupIndex) => (
          <div key={groupIndex}>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              {group.title}
            </h3>
            <div className="space-y-1">
              {group.items.map((item, itemIndex) => (
                <div key={itemIndex}>
                  {item.subItems ? (
                    <Collapsible>
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="ghost"
                          className="w-full justify-between text-left"
                        >
                          <div className="flex items-center">
                            <item.icon className="mr-3 h-4 w-4" />
                            {item.title}
                          </div>
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="ml-7 space-y-1">
                        {item.subItems.map((subItem, subIndex) => (
                          <Link
                            key={subIndex}
                            to={subItem.path}
                            className={`block px-3 py-2 text-sm rounded-md transition-colors ${
                              isActive(subItem.path)
                                ? 'bg-purple-100 text-purple-700'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            {subItem.title}
                          </Link>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <Link
                      to={item.path}
                      className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                        isActive(item.path)
                          ? 'bg-purple-100 text-purple-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <item.icon className="mr-3 h-4 w-4" />
                      {item.title}
                      {item.badge && (
                        <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
};

export default AdminSidebar;
