import React from 'react';
import {
  LayoutDashboard,
  Building2,
  Users,
  BarChart3,
  Wrench,
  UserCheck,
  ScanLine,
} from 'lucide-react';
import { useCrm, NavTab } from '../../context/CrmContext';

export const MobileBottomNav: React.FC = () => {
  const { activeTab, setActiveTab, setIsOcrScannerOpen } = useCrm();

  const navTabs: { id: NavTab; label: string; icon: React.ElementType }[] = [
    { id: 'home', label: 'Home', icon: LayoutDashboard },
    { id: 'accounts', label: 'Accounts', icon: Building2 },
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'tools', label: 'Tools', icon: Wrench },
    { id: 'my-account', label: 'Profile', icon: UserCheck },
  ];

  return (
    <nav
      id="mobile-bottom-nav"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0E121E]/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800/80 px-2 py-1.5 shadow-lg transition-colors"
      aria-label="Mobile Navigation"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`mobile-bottom-tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer min-w-[50px] ${
                isActive
                  ? 'text-purple-600 dark:text-purple-400 font-bold scale-105'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium'
              }`}
            >
              <div
                className={`p-1 rounded-lg ${
                  isActive ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400' : ''
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[10px] tracking-tight mt-0.5 leading-none">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
