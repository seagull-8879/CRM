import React, { useState } from 'react';
import {
  Building2,
  Plus,
  Search,
  Filter,
  Users,
  TrendingUp,
  Globe,
  Phone,
  Edit2,
  Trash2,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';

export const AccountsView: React.FC = () => {
  const {
    accounts,
    contacts,
    opportunities,
    setIsAccountModalOpen,
    setEditingAccount,
    setSelectedAccountIdFor360,
    deleteAccount,
  } = useCrm();

  const [searchQuery, setSearchQuery] = useState('');
  const [industryFilter, setIndustryFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [ratingFilter, setRatingFilter] = useState('ALL');

  const filteredAccounts = accounts.filter((acc) => {
    const matchesSearch =
      acc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (acc.industry && acc.industry.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (acc.website && acc.website.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (acc.billingCity && acc.billingCity.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesIndustry = industryFilter === 'ALL' || acc.industry === industryFilter;
    const matchesType = typeFilter === 'ALL' || acc.type === typeFilter;
    const matchesRating = ratingFilter === 'ALL' || acc.rating === ratingFilter;

    return matchesSearch && matchesIndustry && matchesType && matchesRating;
  });

  const totalEnterpriseRev = accounts.reduce((sum, a) => sum + a.annualRevenue, 0);

  const industries = Array.from(new Set(accounts.map((a) => a.industry)));

  return (
    <div id="crm-accounts-view" className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">Client Accounts</h1>
            <span className="text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 rounded-full">
              {accounts.length} Total Companies
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Central repository for client companies, parent organizations, and corporate portfolios
          </p>
        </div>

        <button
          id="create-new-account-btn"
          onClick={() => {
            setEditingAccount(null);
            setIsAccountModalOpen(true);
          }}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm shadow-blue-600/20 transition-all active:scale-[0.98] cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Account</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[#161619] p-4 border border-zinc-800 rounded-2xl shadow-xs flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search accounts by name, industry, city..."
            className="w-full pl-9 pr-3 py-2 bg-[#121215] border border-zinc-800 rounded-lg text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <select
          value={industryFilter}
          onChange={(e) => setIndustryFilter(e.target.value)}
          className="px-3 py-2 bg-[#121215] border border-zinc-800 rounded-lg text-xs text-zinc-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="ALL">All Industries</option>
          {industries.map((ind) => (
            <option key={ind} value={ind}>
              {ind}
            </option>
          ))}
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 bg-[#121215] border border-zinc-800 rounded-lg text-xs text-zinc-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="ALL">All Account Types</option>
          <option value="Customer">Customer</option>
          <option value="Prospect">Prospect</option>
          <option value="Partner">Partner</option>
          <option value="Vendor">Vendor</option>
        </select>

        <select
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value)}
          className="px-3 py-2 bg-[#121215] border border-zinc-800 rounded-lg text-xs text-zinc-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="ALL">All Ratings</option>
          <option value="Hot">Hot</option>
          <option value="Warm">Warm</option>
          <option value="Cold">Cold</option>
        </select>
      </div>

      {/* Account Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAccounts.length === 0 ? (
          <div className="col-span-full py-12 text-center text-zinc-500 bg-[#161619] border border-dashed border-zinc-800 rounded-2xl">
            No accounts found matching your filter query.
          </div>
        ) : (
          filteredAccounts.map((acc) => {
            const accContacts = contacts.filter((c) => c.accountId === acc.id);
            const accOpps = opportunities.filter((o) => o.accountId === acc.id);
            const openPipe = accOpps
              .filter((o) => o.status === 'Open')
              .reduce((sum, o) => sum + o.amount, 0);

            return (
              <div
                key={acc.id}
                onClick={() => setSelectedAccountIdFor360(acc.id)}
                className="p-5 bg-[#161619] hover:bg-[#1C1C20] border border-zinc-800 hover:border-zinc-700 rounded-2xl shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between group relative"
              >
                <div>
                  {/* Card Top */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center font-bold text-sm shrink-0">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-zinc-100 group-hover:text-blue-400 transition-colors text-sm line-clamp-1">
                          {acc.name}
                        </h3>
                        <div className="text-[11px] text-zinc-400 mt-0.5">
                          {acc.industry} • {acc.businessSegment}
                        </div>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 border ${
                        acc.rating === 'Hot'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          : acc.rating === 'Warm'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                      }`}
                    >
                      {acc.type}
                    </span>
                  </div>

                  {/* Location & Website */}
                  <div className="mt-4 space-y-1 text-xs text-zinc-400">
                    {acc.billingCity && (
                      <div className="flex items-center gap-1.5 text-zinc-300">
                        <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                        <span>
                          {acc.billingCity}, {acc.billingState || acc.billingCountry}
                        </span>
                      </div>
                    )}
                    {acc.website && (
                      <div className="flex items-center gap-1.5 text-blue-400 truncate">
                        <Globe className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                        <span className="truncate">{acc.website.replace('https://', '')}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Bottom Stats */}
                <div className="mt-5 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3 text-zinc-400 text-[11px]">
                    <span className="flex items-center gap-1 font-medium">
                      <Users className="w-3.5 h-3.5 text-zinc-500" /> {accContacts.length} Contacts
                    </span>
                    <span className="flex items-center gap-1 font-medium">
                      <TrendingUp className="w-3.5 h-3.5 text-zinc-500" /> {accOpps.length} Deals
                    </span>
                  </div>

                  <div className="font-bold text-zinc-100">
                    ${(acc.annualRevenue / 1000000).toFixed(1)}M Rev
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
