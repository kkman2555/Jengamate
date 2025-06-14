
import React from 'react';
import { Users, FileText, ShoppingCart, LucideIcon } from 'lucide-react';

interface Tab {
  id: 'users' | 'inquiries' | 'orders';
  label: string;
  icon: LucideIcon;
}

interface AdminTabsProps {
  activeTab: string;
  onTabChange: (tabId: 'users' | 'inquiries' | 'orders') => void;
}

const AdminTabs = ({ activeTab, onTabChange }: AdminTabsProps) => {
  const tabs: Tab[] = [
    { id: 'users', label: 'Users', icon: Users },
    { id: 'inquiries', label: 'Inquiries', icon: FileText },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
  ];

  return (
    <div className="border-b">
      <nav className="-mb-px flex space-x-8" aria-label="Tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              flex items-center gap-2
              ${activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
              }
            `}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default AdminTabs;
