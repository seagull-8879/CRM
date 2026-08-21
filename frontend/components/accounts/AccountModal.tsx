import React, { useState, useEffect } from 'react';
import { X, Building2, AlertTriangle } from 'lucide-react';
import { useCrm } from '../../context/CrmContext';
import {
  AccountType,
  IndustryType,
  OwnershipType,
  RatingType,
  BusinessSegment,
  CustomerStatus,
} from '../../types';

export const AccountModal: React.FC = () => {
  const {
    isAccountModalOpen,
    setIsAccountModalOpen,
    editingAccount,
    setEditingAccount,
    currentUser,
    addAccount,
    updateAccount,
    checkDuplicateAccount,
  } = useCrm();

  const [name, setName] = useState('');
  const [type, setType] = useState<AccountType>('Customer');
  const [accountNumber, setAccountNumber] = useState('');
  const [website, setWebsite] = useState('');
  const [phone, setPhone] = useState('');
  const [industry, setIndustry] = useState<IndustryType>('Technology');
  const [ownership, setOwnership] = useState<OwnershipType>('Private');
  const [rating, setRating] = useState<RatingType>('Hot');
  const [annualRevenue, setAnnualRevenue] = useState<number>(50000000);
  const [employees, setEmployees] = useState<number>(250);
  const [businessSegment, setBusinessSegment] = useState<BusinessSegment>('Enterprise');
  const [customerStatus, setCustomerStatus] = useState<CustomerStatus>('Active');
  const [leadSource, setLeadSource] = useState('Direct');

  // Billing
  const [billingStreet, setBillingStreet] = useState('');
  const [billingCity, setBillingCity] = useState('');
  const [billingState, setBillingState] = useState('');
  const [billingPostalCode, setBillingPostalCode] = useState('');
  const [billingCountry, setBillingCountry] = useState('United States');

  // Shipping
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [shippingStreet, setShippingStreet] = useState('');
  const [shippingCity, setShippingCity] = useState('');
  const [shippingState, setShippingState] = useState('');
  const [shippingPostalCode, setShippingPostalCode] = useState('');
  const [shippingCountry, setShippingCountry] = useState('United States');

  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingAccount) {
      setName(editingAccount.name);
      setType(editingAccount.type);
      setAccountNumber(editingAccount.accountNumber || '');
      setWebsite(editingAccount.website || '');
      setPhone(editingAccount.phone || '');
      setIndustry(editingAccount.industry);
      setOwnership(editingAccount.ownership);
      setRating(editingAccount.rating);
      setAnnualRevenue(editingAccount.annualRevenue);
      setEmployees(editingAccount.employees);
      setBusinessSegment(editingAccount.businessSegment);
      setCustomerStatus(editingAccount.customerStatus);
      setLeadSource(editingAccount.leadSource || 'Direct');

      setBillingStreet(editingAccount.billingStreet || '');
      setBillingCity(editingAccount.billingCity || '');
      setBillingState(editingAccount.billingState || '');
      setBillingPostalCode(editingAccount.billingPostalCode || '');
      setBillingCountry(editingAccount.billingCountry || 'United States');

      setSameAsBilling(editingAccount.sameAsBilling ?? true);
      setShippingStreet(editingAccount.shippingStreet || '');
      setShippingCity(editingAccount.shippingCity || '');
      setShippingState(editingAccount.shippingState || '');
      setShippingPostalCode(editingAccount.shippingPostalCode || '');
      setShippingCountry(editingAccount.shippingCountry || 'United States');

      setDescription(editingAccount.description || '');
      setNotes(editingAccount.notes || '');
    } else {
      setName('');
      setType('Prospect');
      setAccountNumber(`ACC-${Math.floor(10000 + Math.random() * 90000)}`);
      setWebsite('');
      setPhone('');
      setIndustry('Technology');
      setOwnership('Private');
      setRating('Warm');
      setAnnualRevenue(25000000);
      setEmployees(180);
      setBusinessSegment('Mid-Market');
      setCustomerStatus('Pending');
      setLeadSource('Direct');

      setBillingStreet('100 Main Street');
      setBillingCity('San Francisco');
      setBillingState('CA');
      setBillingPostalCode('94105');
      setBillingCountry('United States');

      setSameAsBilling(true);
      setShippingStreet('');
      setShippingCity('');
      setShippingState('');
      setShippingPostalCode('');
      setShippingCountry('United States');

      setDescription('');
      setNotes('');
    }
    setDuplicateWarning(null);
    setError('');
  }, [editingAccount, isAccountModalOpen]);

  if (!isAccountModalOpen) return null;

  const handleNameChange = (val: string) => {
    setName(val);
    if (val.trim()) {
      const dup = checkDuplicateAccount(val, editingAccount?.id);
      if (dup) {
        setDuplicateWarning(`Warning: An account named "${dup.name}" already exists (${dup.industry}). Check for duplicates (FR-011).`);
      } else {
        setDuplicateWarning(null);
      }
    } else {
      setDuplicateWarning(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Account Name is mandatory (BR-02)');
      return;
    }

    const payload = {
      name: name.trim(),
      ownerId: currentUser?.id || 'usr-1',
      ownerName: currentUser?.name || 'Janaki Pawar',
      type,
      accountNumber,
      website,
      phone,
      industry,
      ownership,
      rating,
      annualRevenue: Number(annualRevenue) || 0,
      employees: Number(employees) || 0,
      businessSegment,
      customerStatus,
      leadSource,
      billingStreet,
      billingCity,
      billingState,
      billingPostalCode,
      billingCountry,
      sameAsBilling,
      shippingStreet: sameAsBilling ? billingStreet : shippingStreet,
      shippingCity: sameAsBilling ? billingCity : shippingCity,
      shippingState: sameAsBilling ? billingState : shippingState,
      shippingPostalCode: sameAsBilling ? billingPostalCode : shippingPostalCode,
      shippingCountry: sameAsBilling ? billingCountry : shippingCountry,
      description,
      notes,
    };

    if (editingAccount) {
      updateAccount(editingAccount.id, payload);
    } else {
      addAccount(payload);
    }

    setIsAccountModalOpen(false);
    setEditingAccount(null);
  };

  const industries: IndustryType[] = [
    'Technology',
    'Financial Services',
    'Healthcare & Life Sciences',
    'Manufacturing',
    'Retail & eCommerce',
    'Consulting & Services',
    'Energy & Utilities',
    'Other',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-[#111625] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-3xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-[#0E121E] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-600 text-white flex items-center justify-center shadow-xs">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {editingAccount ? 'Edit Account' : 'Create Client Account'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Maintain enterprise client company profiles and billing details
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsAccountModalOpen(false);
              setEditingAccount(null);
            }}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1 text-xs text-slate-700 dark:text-slate-300">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-700 dark:text-rose-400 font-medium">
              {error}
            </div>
          )}

          {duplicateWarning && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-700 dark:text-amber-300 font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>{duplicateWarning}</span>
            </div>
          )}

          {/* Section 1: Account Information */}
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
              1. Account Information
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Account Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Apex Global Technologies"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0E121E] border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Account Owner *</label>
                <input
                  type="text"
                  readOnly
                  value={currentUser?.name || 'Janaki Pawar'}
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-500 dark:text-slate-400 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Account Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as AccountType)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0E121E] border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                >
                  <option value="Prospect">Prospect</option>
                  <option value="Customer">Customer</option>
                  <option value="Partner">Partner</option>
                  <option value="Vendor">Vendor</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Industry *</label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value as IndustryType)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0E121E] border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                >
                  {industries.map((ind) => (
                    <option key={ind} value={ind}>
                      {ind}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Website URL</label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0E121E] border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Company Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (415) 555-0100"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0E121E] border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Business & Financial Profile */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
              2. Business & Financial Profile
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Annual Revenue ($ USD)
                </label>
                <input
                  type="number"
                  min="0"
                  step="100000"
                  value={annualRevenue}
                  onChange={(e) => setAnnualRevenue(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0E121E] border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-semibold text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Employee Count</label>
                <input
                  type="number"
                  min="1"
                  value={employees}
                  onChange={(e) => setEmployees(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0E121E] border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Business Segment</label>
                <select
                  value={businessSegment}
                  onChange={(e) => setBusinessSegment(e.target.value as BusinessSegment)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0E121E] border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                >
                  <option value="Enterprise">Enterprise (1000+)</option>
                  <option value="Mid-Market">Mid-Market (200-999)</option>
                  <option value="SMB">SMB (&lt;200)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Account Rating</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(e.target.value as RatingType)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0E121E] border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                >
                  <option value="Hot">Hot (High Priority)</option>
                  <option value="Warm">Warm (Engaged)</option>
                  <option value="Cold">Cold (Low Activity)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Ownership</label>
                <select
                  value={ownership}
                  onChange={(e) => setOwnership(e.target.value as OwnershipType)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0E121E] border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                >
                  <option value="Private">Private</option>
                  <option value="Public">Public</option>
                  <option value="Subsidiary">Subsidiary</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Customer Status</label>
                <select
                  value={customerStatus}
                  onChange={(e) => setCustomerStatus(e.target.value as CustomerStatus)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0E121E] border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                >
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Churned">Churned</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Billing & Shipping Address */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
              3. Billing and Shipping Address (FR-010)
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Billing */}
              <div className="space-y-2.5 p-3.5 bg-slate-50 dark:bg-[#0E121E] border border-slate-200 dark:border-slate-800 rounded-xl">
                <div className="font-bold text-slate-900 dark:text-slate-100 text-xs">Billing Address</div>
                <div>
                  <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-0.5">Street Address</label>
                  <input
                    type="text"
                    value={billingStreet}
                    onChange={(e) => setBillingStreet(e.target.value)}
                    placeholder="100 Main St, Suite 400"
                    className="w-full px-2.5 py-1.5 bg-white dark:bg-[#121215] border border-slate-200 dark:border-slate-800 rounded-md text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:border-purple-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-0.5">City</label>
                    <input
                      type="text"
                      value={billingCity}
                      onChange={(e) => setBillingCity(e.target.value)}
                      placeholder="San Francisco"
                      className="w-full px-2.5 py-1.5 bg-white dark:bg-[#121215] border border-slate-200 dark:border-slate-800 rounded-md text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-0.5">State / Province</label>
                    <input
                      type="text"
                      value={billingState}
                      onChange={(e) => setBillingState(e.target.value)}
                      placeholder="CA"
                      className="w-full px-2.5 py-1.5 bg-white dark:bg-[#121215] border border-slate-200 dark:border-slate-800 rounded-md text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:border-purple-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-0.5">Postal Code</label>
                    <input
                      type="text"
                      value={billingPostalCode}
                      onChange={(e) => setBillingPostalCode(e.target.value)}
                      placeholder="94105"
                      className="w-full px-2.5 py-1.5 bg-white dark:bg-[#121215] border border-slate-200 dark:border-slate-800 rounded-md text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-0.5">Country</label>
                    <input
                      type="text"
                      value={billingCountry}
                      onChange={(e) => setBillingCountry(e.target.value)}
                      placeholder="United States"
                      className="w-full px-2.5 py-1.5 bg-white dark:bg-[#121215] border border-slate-200 dark:border-slate-800 rounded-md text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping */}
              <div className="space-y-2.5 p-3.5 bg-slate-50 dark:bg-[#0E121E] border border-slate-200 dark:border-slate-800 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-slate-900 dark:text-slate-100 text-xs">Shipping Address</div>
                  <label className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sameAsBilling}
                      onChange={(e) => setSameAsBilling(e.target.checked)}
                      className="accent-purple-600 rounded"
                    />
                    <span>Same as billing</span>
                  </label>
                </div>

                {!sameAsBilling && (
                  <>
                    <div>
                      <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-0.5">Street Address</label>
                      <input
                        type="text"
                        value={shippingStreet}
                        onChange={(e) => setShippingStreet(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white dark:bg-[#121215] border border-slate-200 dark:border-slate-800 rounded-md text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:border-purple-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-0.5">City</label>
                        <input
                          type="text"
                          value={shippingCity}
                          onChange={(e) => setShippingCity(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white dark:bg-[#121215] border border-slate-200 dark:border-slate-800 rounded-md text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:border-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-0.5">State</label>
                        <input
                          type="text"
                          value={shippingState}
                          onChange={(e) => setShippingState(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white dark:bg-[#121215] border border-slate-200 dark:border-slate-800 rounded-md text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:border-purple-500"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-0.5">Postal Code</label>
                        <input
                          type="text"
                          value={shippingPostalCode}
                          onChange={(e) => setShippingPostalCode(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white dark:bg-[#121215] border border-slate-200 dark:border-slate-800 rounded-md text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:border-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-0.5">Country</label>
                        <input
                          type="text"
                          value={shippingCountry}
                          onChange={(e) => setShippingCountry(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white dark:bg-[#121215] border border-slate-200 dark:border-slate-800 rounded-md text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:border-purple-500"
                        />
                      </div>
                    </div>
                  </>
                )}
                {sameAsBilling && (
                  <div className="py-8 text-center text-xs text-slate-400">
                    Shipping address is synced with Billing address.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 4: Description & Notes */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
              4. Company Description & Relationship Notes
            </div>
            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Company Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Overview of business model, market position, key initiatives..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0E121E] border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => {
                setIsAccountModalOpen(false);
                setEditingAccount(null);
              }}
              className="px-4 py-2 font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="save-account-submit-btn"
              className="px-5 py-2 font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-lg shadow-sm transition-all active:scale-[0.98] cursor-pointer"
            >
              {editingAccount ? 'Save Account Changes' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
