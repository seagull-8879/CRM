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
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';
import { UserRole } from '../../types';

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
      className="h-16 bg-[#121215] border-b border-zinc-800 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs text-zinc-100"
    >
      {/* Global Unified Search */}
      <div className="flex-1 max-w-xl relative" ref={searchRef}>
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="global-crm-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            placeholder="Search accounts, contacts, deals, notes..."
            className="w-full pl-10 pr-4 py-2 bg-[#18181B] hover:bg-[#202024] focus:bg-[#18181B] border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-200 px-1"
            >
              Clear
            </button>
          )}
        </div>

        {/* Search Results Autocomplete Dropdown */}
        {isSearchOpen && searchQuery.trim().length > 0 && (
          <div
            id="global-search-results-dropdown"
            className="absolute top-full left-0 right-0 mt-1.5 bg-[#18181B] border border-zinc-800 rounded-xl shadow-2xl overflow-hidden z-50 divide-y divide-zinc-800/80 max-h-96 overflow-y-auto"
          >
            {!hasSearchResults ? (
              <div className="p-4 text-center text-sm text-zinc-500">
                No matching records found for "{searchQuery}"
              </div>
            ) : (
              <>
                {filteredAccounts.length > 0 && (
                  <div className="p-2">
                    <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider px-2 py-1 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-blue-400" /> Accounts
                    </div>
                    {filteredAccounts.map((acc) => (
                      <button
                        key={acc.id}
                        onClick={() => {
                          setSelectedAccountIdFor360(acc.id);
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-zinc-800/80 flex items-center justify-between text-sm transition-colors cursor-pointer"
                      >
                        <div>
                          <div className="font-medium text-zinc-100">{acc.name}</div>
                          <div className="text-xs text-zinc-400">
                            {acc.industry} • {acc.businessSegment}
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded">
                          ${(acc.annualRevenue / 1000000).toFixed(1)}M
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {filteredContacts.length > 0 && (
                  <div className="p-2">
                    <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider px-2 py-1 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-indigo-400" /> Contacts
                    </div>
                    {filteredContacts.map((cnt) => (
                      <button
                        key={cnt.id}
                        onClick={() => {
                          setSelectedContactIdFor360(cnt.id);
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-zinc-800/80 flex items-center justify-between text-sm transition-colors cursor-pointer"
                      >
                        <div>
                          <div className="font-medium text-zinc-100">
                            {cnt.salutation} {cnt.firstName} {cnt.lastName}
                          </div>
                          <div className="text-xs text-zinc-400">
                            {cnt.jobTitle} at {cnt.accountName}
                          </div>
                        </div>
                        <span className="text-xs text-zinc-400">{cnt.email}</span>
                      </button>
                    ))}
                  </div>
                )}

                {filteredOpportunities.length > 0 && (
                  <div className="p-2">
                    <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider px-2 py-1 flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Opportunities
                    </div>
                    {filteredOpportunities.map((opp) => (
                      <button
                        key={opp.id}
                        onClick={() => {
                          setSelectedOpportunityForDetail(opp);
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-zinc-800/80 flex items-center justify-between text-sm transition-colors cursor-pointer"
                      >
                        <div>
                          <div className="font-medium text-zinc-100">{opp.name}</div>
                          <div className="text-xs text-zinc-400">
                            {opp.accountName} • Stage: {opp.stage}
                          </div>
                        </div>
                        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
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
      <div className="flex items-center gap-3">
        {/* Role Switcher Pill for Demo */}
        <div className="flex items-center bg-[#18181B] p-1 rounded-lg border border-zinc-800 text-xs">
          <span className="text-zinc-400 font-medium px-2 hidden sm:inline">Role:</span>
          {(['sales', 'admin', 'management'] as UserRole[]).map((r) => (
            <button
              key={r}
              id={`role-switch-${r}`}
              onClick={() => switchUserRole(r)}
              className={`px-2.5 py-1 rounded-md capitalize font-medium transition-all cursor-pointer ${
                currentUser?.role === r
                  ? 'bg-blue-600 text-white shadow-xs font-semibold'
                  : 'text-zinc-400 hover:text-zinc-100'
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
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          title="Scan visiting card using AI OCR"
        >
          <ScanLine className="w-3.5 h-3.5 text-indigo-400" />
          <span>Scan Card</span>
          <Sparkles className="w-3 h-3 text-indigo-400" />
        </button>

        {/* Create Entity Quick Actions */}
        <div className="flex items-center gap-1.5">
          <button
            id="header-create-opportunity-btn"
            onClick={() => {
              setEditingOpportunity(null);
              setIsOpportunityModalOpen(true);
            }}
            className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-xs shadow-blue-500/20 transition-all active:scale-[0.98] cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Opportunity</span>
          </button>

          <button
            id="header-create-account-btn"
            onClick={() => {
              setEditingAccount(null);
              setIsAccountModalOpen(true);
            }}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 bg-[#18181B] hover:bg-[#222226] text-zinc-200 border border-zinc-800 rounded-lg text-xs font-medium transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-zinc-400" />
            <span>Account</span>
          </button>

          <button
            id="header-create-contact-btn"
            onClick={() => {
              setEditingContact(null);
              setIsContactModalOpen(true);
            }}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 bg-[#18181B] hover:bg-[#222226] text-zinc-200 border border-zinc-800 rounded-lg text-xs font-medium transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-zinc-400" />
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
          className="p-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
