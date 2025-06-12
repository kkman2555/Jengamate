
import React from 'react';
import { Users, FileText, Package, LucideIcon } from 'lucide-react';

interface Tab {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface AdminTabsProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const AdminTabs = ({ activeTab, onTabChange }: AdminTabsProps) => {
  const tabs: Tab[] = [
    { id: 'users', label: 'Users', icon: Users },
    { id: 'inquiries', label: 'Inquiries', icon: FileText },
    { id: 'orders', label: 'Orders', icon: Package },
  ];

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4">
        <div className="flex space-x-8">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center space-x-2 py-4 px-3 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminTabs;
