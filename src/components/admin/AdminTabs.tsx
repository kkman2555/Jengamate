
import React from 'react';
import { Users, FileText, ShoppingCart, LucideIcon } from 'lucide-react';

interface Tab {
  id: 'users' | 'inquiries' | 'orders';
  label: string;
  icon: LucideIcon;
  count?: number;
}

interface AdminTabsProps {
  activeTab: string;
  onTabChange: (tabId: 'users' | 'inquiries' | 'orders') => void;
  userCount?: number;
  inquiryCount?: number;
  orderCount?: number;
}

const AdminTabs = ({ 
  activeTab, 
  onTabChange, 
  userCount = 0, 
  inquiryCount = 0, 
  orderCount = 0 
}: AdminTabsProps) => {
  const tabs: Tab[] = [
    { id: 'users', label: 'Users', icon: Users, count: userCount },
    { id: 'inquiries', label: 'Inquiries', icon: FileText, count: inquiryCount },
    { id: 'orders', label: 'Orders', icon: ShoppingCart, count: orderCount },
  ];

  return (
    <div className="border-b bg-white rounded-lg shadow-sm mb-6">
      <nav className="flex space-x-8 px-6" aria-label="Tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              relative whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              flex items-center gap-2 transition-colors
              ${activeTab === tab.id
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
            {tab.count !== undefined && (
              <span className={`
                ml-2 px-2 py-1 text-xs rounded-full
                ${activeTab === tab.id 
                  ? 'bg-purple-100 text-purple-800' 
                  : 'bg-gray-100 text-gray-600'
                }
              `}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default AdminTabs;
