import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Plus,
  ScanLine,
  Building2,
  Users,
  TrendingUp,
  RotateCcw,
  Sparkles,
  Sun,
  Moon,
  Menu,
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';
import { UserRole } from '../../types';
import { BrandLogo } from '../common/BrandLogo';

export const Header: React.FC = () => {
  const {
    currentUser,
    switchUserRole,
    accounts,
    contacts,
    opportunities,
    setIsOpportunityModalOpen,
    setEditingOpportunity,
    setIsAccountModalOpen,
    setEditingAccount,
    setIsContactModalOpen,
    setEditingContact,
    setIsOcrScannerOpen,
    setSelectedAccountIdFor360,
    setSelectedContactIdFor360,
    setSelectedOpportunityForDetail,
    resetAllData,
    theme,
    toggleTheme,
    setIsMobileSidebarOpen,
  } = useCrm();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredAccounts = searchQuery.trim()
    ? accounts.filter((a) => a.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3)
    : [];

  const filteredContacts = searchQuery.trim()
    ? contacts
        .filter(
          (c) =>
            `${c.firstName} ${c.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.email.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 3)
    : [];

  const filteredOpportunities = searchQuery.trim()
    ? opportunities
        .filter((o) => o.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .slice(0, 3)
    : [];

  const hasSearchResults =
    filteredAccounts.length > 0 || filteredContacts.length > 0 || filteredOpportunities.length > 0;

  return (
    <header
      id="crm-header"
      className="h-16 bg-white/95 dark:bg-[#0E121E]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 px-3 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs text-slate-800 dark:text-slate-100 transition-colors duration-200 gap-2 sm:gap-4"
    >
      {/* Mobile Hamburger & Brand Icon */}
      <div className="flex items-center gap-2 lg:hidden shrink-0">
        <button
          id="mobile-menu-toggle-btn"
          onClick={() => setIsMobileSidebarOpen(true)}
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/80 hover:bg-slate-200 dark:bg-[#151B2B] dark:hover:bg-[#1E263C] text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
          aria-label="Open mobile navigation"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden xs:block sm:hidden">
          <BrandLogo size="sm" variant="icon-only" />
        </div>
      </div>

      {/* Global Unified Search */}
      <div className="flex-1 max-w-xl relative min-w-0" ref={searchRef}>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="global-crm-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            placeholder="Search CRM..."
            className="w-full pl-9 pr-3 py-2 bg-slate-100/80 hover:bg-slate-100 focus:bg-white dark:bg-[#151B2B] dark:hover:bg-[#1A2236] dark:focus:bg-[#151B2B] border border-slate-200 dark:border-slate-800/80 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all truncate"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-1 font-medium"
            >
              Clear
            </button>
          )}
        </div>

        {/* Search Results Autocomplete Dropdown */}
        {isSearchOpen && searchQuery.trim().length > 0 && (
          <div
            id="global-search-results-dropdown"
            className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-[#151B2B] border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-2xl overflow-hidden z-50 divide-y divide-slate-100 dark:divide-slate-800/80 max-h-96 overflow-y-auto"
          >
            {!hasSearchResults ? (
              <div className="p-4 text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                No matching records found for "{searchQuery}"
              </div>
            ) : (
              <>
                {filteredAccounts.length > 0 && (
                  <div className="p-2">
                    <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2 py-1 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-blue-500" /> Accounts
                    </div>
                    {filteredAccounts.map((acc) => (
                      <button
                        key={acc.id}
                        onClick={() => {
                          setSelectedAccountIdFor360(acc.id);
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 flex items-center justify-between text-xs sm:text-sm transition-colors cursor-pointer"
                      >
                        <div className="min-w-0 pr-2">
                          <div className="font-semibold text-slate-900 dark:text-slate-100 truncate">{acc.name}</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            {acc.industry} • {acc.businessSegment}
                          </div>
                        </div>
                        <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-lg shrink-0">
                          ${(acc.annualRevenue / 1000000).toFixed(1)}M
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {filteredContacts.length > 0 && (
                  <div className="p-2">
                    <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2 py-1 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-purple-500" /> Contacts
                    </div>
                    {filteredContacts.map((cnt) => (
                      <button
                        key={cnt.id}
                        onClick={() => {
                          setSelectedContactIdFor360(cnt.id);
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 flex items-center justify-between text-xs sm:text-sm transition-colors cursor-pointer"
                      >
                        <div className="min-w-0 pr-2">
                          <div className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                            {cnt.salutation} {cnt.firstName} {cnt.lastName}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            {cnt.jobTitle} at {cnt.accountName}
                          </div>
                        </div>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate hidden sm:inline">{cnt.email}</span>
                      </button>
                    ))}
                  </div>
                )}

                {filteredOpportunities.length > 0 && (
                  <div className="p-2">
                    <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2 py-1 flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> Opportunities
                    </div>
                    {filteredOpportunities.map((opp) => (
                      <button
                        key={opp.id}
                        onClick={() => {
                          setSelectedOpportunityForDetail(opp);
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 flex items-center justify-between text-xs sm:text-sm transition-colors cursor-pointer"
                      >
                        <div className="min-w-0 pr-2">
                          <div className="font-semibold text-slate-900 dark:text-slate-100 truncate">{opp.name}</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            {opp.accountName} • Stage: {opp.stage}
                          </div>
                        </div>
                        <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg shrink-0">
                          ${opp.amount.toLocaleString()}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Header Right Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Theme Switcher Toggle Button (Light/Dark) */}
        <button
          id="header-theme-toggle-btn"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-100/80 hover:bg-slate-200 dark:bg-[#151B2B] dark:hover:bg-[#1E263C] text-slate-700 dark:text-slate-200 transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-semibold hidden xl:inline">Light</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-purple-600" />
              <span className="text-xs font-semibold hidden xl:inline">Dark</span>
            </>
          )}
        </button>

        {/* Role Switcher Pill */}
        <div className="hidden md:flex items-center bg-slate-100/90 dark:bg-[#151B2B] p-1 rounded-xl border border-slate-200 dark:border-slate-800/80 text-xs">
          <span className="text-slate-400 dark:text-slate-500 font-medium px-2 hidden lg:inline">Role:</span>
          {(['sales', 'admin', 'management'] as UserRole[]).map((r) => (
            <button
              key={r}
              id={`role-switch-${r}`}
              onClick={() => switchUserRole(r)}
              className={`px-2.5 py-1 rounded-lg capitalize font-medium transition-all cursor-pointer ${
                currentUser?.role === r
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Scan Visiting Card Shortcut Button */}
        <button
          id="header-scan-visiting-card-btn"
          onClick={() => setIsOcrScannerOpen(true)}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/25 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          title="Scan visiting card using AI OCR"
        >
          <ScanLine className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
          <span className="hidden md:inline">Scan Card</span>
          <Sparkles className="w-3 h-3 text-purple-600 dark:text-purple-400" />
        </button>

        {/* Create Entity Quick Actions */}
        <div className="flex items-center gap-1">
          <button
            id="header-create-opportunity-btn"
            onClick={() => {
              setEditingOpportunity(null);
              setIsOpportunityModalOpen(true);
            }}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-purple-900/20 transition-all active:scale-[0.98] cursor-pointer"
            title="Create Opportunity"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Opportunity</span>
            <span className="xs:hidden">Deal</span>
          </button>

          <button
            id="header-create-account-btn"
            onClick={() => {
              setEditingAccount(null);
              setIsAccountModalOpen(true);
            }}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-[#151B2B] dark:hover:bg-[#1E263C] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800/80 rounded-xl text-xs font-medium transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>Account</span>
          </button>

          <button
            id="header-create-contact-btn"
            onClick={() => {
              setEditingContact(null);
              setIsContactModalOpen(true);
            }}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-[#151B2B] dark:hover:bg-[#1E263C] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800/80 rounded-xl text-xs font-medium transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>Contact</span>
          </button>
        </div>

        {/* Reset Data demo button */}
        <button
          onClick={() => {
            if (window.confirm('Reset all demo CRM data back to initial seed state?')) {
              resetAllData();
            }
          }}
          title="Reset Seed Data"
          className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer hidden xs:block"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
