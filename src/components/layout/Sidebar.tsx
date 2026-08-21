import React from 'react';
import {
  LayoutDashboard,
  Building2,
  Users,
  BarChart3,
  Wrench,
  UserCheck,
  LogOut,
  ScanLine,
  Sparkles,
  Shield,
  Briefcase,
} from 'lucide-react';
import { useCrm, NavTab } from '../../context/CrmContext';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, currentUser, logout, setIsOcrScannerOpen } = useCrm();

  const navItems: { id: NavTab; label: string; icon: React.ElementType; badge?: string }[] = [
    { id: 'home', label: 'Home', icon: LayoutDashboard },
    { id: 'accounts', label: 'Accounts', icon: Building2 },
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'tools', label: 'Tools', icon: Wrench },
    { id: 'my-account', label: 'My Account', icon: UserCheck },
  ];

  return (
    <aside
      id="crm-sidebar"
      className="w-64 bg-[#161619] text-zinc-200 flex flex-col shrink-0 border-r border-zinc-800 select-none h-screen sticky top-0"
    >
      {/* Brand Header */}
      <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-900/30 text-white font-bold text-xl tracking-wider">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-semibold text-zinc-100 tracking-tight text-base leading-tight flex items-center gap-1.5">
              CRM MVP
              <span className="text-[10px] uppercase font-bold tracking-widest bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/30">
                v1.1
              </span>
            </div>
            <div className="text-xs text-zinc-400">Enterprise Sales Suite</div>
          </div>
        </div>
      </div>

      {/* Quick Action: Scan Business Card Banner */}
      <div className="px-4 pt-4 pb-2">
        <button
          id="sidebar-scan-visiting-card-btn"
          onClick={() => setIsOcrScannerOpen(true)}
          className="w-full py-2.5 px-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-xs flex items-center justify-center gap-2 transition-all shadow-sm shadow-blue-600/30 active:scale-[0.98] cursor-pointer"
        >
          <ScanLine className="w-4 h-4 text-blue-200" />
          <span>Scan Visiting Card</span>
          <span className="text-[10px] bg-white/20 text-white px-1.5 py-0.2 rounded font-semibold ml-auto flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5" /> AI
          </span>
        </button>
      </div>

      {/* Main Approved Navigation Items (Strict 6 Items) */}
      <div className="flex-1 py-3 px-3 space-y-1 overflow-y-auto">
        <div className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider px-3 mb-2">
          Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`sidebar-nav-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-xs bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-full font-semibold">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Current User & Role Status */}
      {currentUser && (
        <div className="p-3 border-t border-zinc-800 bg-[#121215]">
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-800/50 transition-colors">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-9 h-9 rounded-full object-cover border border-zinc-700"
            />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-zinc-100 truncate flex items-center gap-1.5">
                {currentUser.name}
              </div>
              <div className="text-xs text-zinc-400 truncate flex items-center gap-1">
                <Shield className="w-3 h-3 text-blue-400 shrink-0" />
                <span className="capitalize">{currentUser.role}</span>
              </div>
            </div>
            <button
              id="sidebar-logout-btn"
              onClick={logout}
              title="Logout session"
              className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};
