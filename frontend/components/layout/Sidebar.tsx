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
  Sun,
  Moon,
  X,
} from 'lucide-react';
import { useCrm, NavTab } from '../../context/CrmContext';
import { BrandLogo } from '../common/BrandLogo';

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    currentUser,
    logout,
    setIsOcrScannerOpen,
    theme,
    toggleTheme,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
  } = useCrm();

  const navItems: { id: NavTab; label: string; icon: React.ElementType; badge?: string }[] = [
    { id: 'home', label: 'Home', icon: LayoutDashboard },
    { id: 'accounts', label: 'Accounts', icon: Building2 },
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'tools', label: 'Tools', icon: Wrench },
    { id: 'my-account', label: 'My Account', icon: UserCheck },
  ];

  const handleNavSelect = (id: NavTab) => {
    setActiveTab(id);
    setIsMobileSidebarOpen(false);
  };

  const renderNavContent = (isMobile = false) => (
    <div className="flex flex-col h-full w-full select-none">
      {/* Brand Header with TheMaverics Vector Logo */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/50 dark:bg-transparent">
        <div className="flex flex-col items-start gap-1">
          <BrandLogo size="md" variant="full" showSubtitle={true} />
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[10px] uppercase font-bold tracking-widest bg-purple-500/10 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded-md border border-purple-500/20">
              CRM Suite
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              v2.0 Enterprise
            </span>
          </div>
        </div>

        {isMobile && (
          <button
            onClick={() => setIsMobileSidebarOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Quick Action: Scan Business Card Banner */}
      <div className="px-3.5 pt-3.5 pb-1.5">
        <button
          id={isMobile ? 'mobile-sidebar-scan-btn' : 'sidebar-scan-visiting-card-btn'}
          onClick={() => {
            setIsOcrScannerOpen(true);
            if (isMobile) setIsMobileSidebarOpen(false);
          }}
          className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-medium text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-purple-900/20 active:scale-[0.98] cursor-pointer"
        >
          <ScanLine className="w-4 h-4 text-purple-100" />
          <span className="font-semibold">Scan Visiting Card</span>
          <span className="text-[10px] bg-white/20 text-white px-1.5 py-0.2 rounded font-semibold ml-auto flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5" /> AI
          </span>
        </button>
      </div>

      {/* Main Approved Navigation Items (Strict 6 Items) */}
      <div className="flex-1 py-2.5 px-3 space-y-1 overflow-y-auto">
        <div className="text-[10.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 mb-1.5">
          Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`sidebar-nav-${item.id}${isMobile ? '-mobile' : ''}`}
              onClick={() => handleNavSelect(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md shadow-purple-900/25 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60 font-medium'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-xs bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-full font-semibold">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Theme Switcher Quick Toggle in Sidebar */}
      <div className="px-3 py-2 border-t border-slate-200 dark:border-slate-800/80">
        <button
          id={isMobile ? 'mobile-sidebar-theme-toggle' : 'sidebar-theme-toggle-btn'}
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/60 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            {theme === 'dark' ? (
              <Moon className="w-4 h-4 text-purple-400" />
            ) : (
              <Sun className="w-4 h-4 text-amber-500" />
            )}
            <span>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
            {theme === 'dark' ? 'Maverick Dark' : 'Maverick Light'}
          </span>
        </button>
      </div>

      {/* Current User & Role Status */}
      {currentUser && (
        <div className="p-3 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-[#0B0F19]">
          <div className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-800/50 transition-colors">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover border border-purple-500/40"
            />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                {currentUser.name}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate flex items-center gap-1">
                <Shield className="w-3 h-3 text-purple-500 dark:text-purple-400 shrink-0" />
                <span className="capitalize">{currentUser.role}</span>
              </div>
            </div>
            <button
              id={isMobile ? 'mobile-sidebar-logout' : 'sidebar-logout-btn'}
              onClick={logout}
              title="Logout session"
              className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        id="crm-sidebar"
        className="hidden lg:flex w-64 bg-white dark:bg-[#0E121E] text-slate-800 dark:text-slate-200 flex-col shrink-0 border-r border-slate-200 dark:border-slate-800/80 select-none h-screen sticky top-0 transition-colors duration-200 z-30"
      >
        {renderNavContent(false)}
      </aside>

      {/* Mobile Overlay Sidebar Drawer */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setIsMobileSidebarOpen(false)}
          />

          {/* Slide-in Drawer */}
          <aside className="relative w-72 max-w-[85vw] bg-white dark:bg-[#0E121E] text-slate-800 dark:text-slate-200 h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200 border-r border-slate-200 dark:border-slate-800/80">
            {renderNavContent(true)}
          </aside>
        </div>
      )}
    </>
  );
};
