import React, { useState } from 'react';
import {
  Settings,
  User as UserIcon,
  Shield,
  DollarSign,
  Layers,
  RotateCcw,
  CheckCircle2,
  Bell,
  Sparkles,
  Database,
  Lock,
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';
import { DEMO_USERS } from '../../mockData';

export const SettingsView: React.FC = () => {
  const { currentUser, login, resetToFactoryDefaults } = useCrm();

  const [currency, setCurrency] = useState('USD');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [taskReminders, setTaskReminders] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div id="crm-settings-view" className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">System & User Settings</h1>
            <span className="text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 rounded-full">
              Enterprise Configuration
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Manage user roles, pipeline stages, currency formats, and application preferences
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-800/80 rounded-xl text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Settings saved successfully!</span>
        </div>
      )}

      {/* 1. Active Role & Persona Switching (FR-001, FR-002) */}
      <div className="bg-[#161619] border border-zinc-800 rounded-2xl shadow-xs p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
          <Shield className="w-4 h-4 text-blue-400" />
          <h2 className="text-sm font-bold text-zinc-100">
            Active Role Profile & RBAC Switcher
          </h2>
        </div>

        <p className="text-xs text-zinc-400">
          Switch user profiles to test permission boundaries between Sales Representatives, Sales Managers, and System Administrators.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          {DEMO_USERS.map((user) => {
            const isSelected = currentUser?.id === user.id;
            return (
              <button
                key={user.id}
                onClick={() => login(user)}
                className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                  isSelected
                    ? 'border-blue-500 bg-blue-500/10 ring-2 ring-blue-500/20'
                    : 'border-zinc-800 hover:border-zinc-700 bg-[#121215] hover:bg-[#1C1C20]'
                }`}
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover border border-zinc-700 shrink-0"
                />
                <div className="min-w-0">
                  <div className="font-bold text-zinc-100 text-xs truncate">{user.name}</div>
                  <div className="text-[11px] text-zinc-400">{user.title}</div>
                  <span
                    className={`inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full capitalize border ${
                      user.role === 'admin'
                        ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                        : user.role === 'management'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    }`}
                  >
                    {user.role} Role
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Localization & Currency */}
      <div className="bg-[#161619] border border-zinc-800 rounded-2xl shadow-xs p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
          <DollarSign className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-bold text-zinc-100">Currency & Formatting Preferences</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-zinc-300 mb-1">
              Base Reporting Currency
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-3 py-2 bg-[#121215] border border-zinc-800 rounded-lg text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="USD">USD ($) - US Dollar</option>
              <option value="EUR">EUR (€) - Euro</option>
              <option value="GBP">GBP (£) - British Pound</option>
              <option value="INR">INR (₹) - Indian Rupee</option>
              <option value="JPY">JPY (¥) - Japanese Yen</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-zinc-300 mb-1">Date Format Display</label>
            <select className="w-full px-3 py-2 bg-[#121215] border border-zinc-800 rounded-lg text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
              <option value="YYYY-MM-DD">YYYY-MM-DD (ISO Enterprise Default)</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY (US Format)</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY (UK / EU Format)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. AI & Automation Services */}
      <div className="bg-[#161619] border border-zinc-800 rounded-2xl shadow-xs p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <h2 className="text-sm font-bold text-zinc-100">
            Gemini Multimodal AI & Intelligence Services
          </h2>
        </div>

        <div className="space-y-3 text-xs">
          <div className="p-3.5 bg-[#121215] border border-zinc-800 rounded-xl flex items-center justify-between">
            <div>
              <div className="font-bold text-zinc-100">Visiting Card Vision OCR (Gemini 3.7 Flash)</div>
              <div className="text-zinc-400 text-[11px]">
                High-speed visual extraction for printed and digital business cards
              </div>
            </div>
            <span className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 font-bold px-2 py-0.5 rounded text-[10px]">
              ONLINE
            </span>
          </div>

          <div className="p-3.5 bg-[#121215] border border-zinc-800 rounded-xl flex items-center justify-between">
            <div>
              <div className="font-bold text-zinc-100">Opportunity Deal Coach & Win Predictor</div>
              <div className="text-zinc-400 text-[11px]">
                Automated risk scoring, win factors, and tactical next-best actions
              </div>
            </div>
            <span className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 font-bold px-2 py-0.5 rounded text-[10px]">
              ONLINE
            </span>
          </div>

          <div className="p-3.5 bg-[#121215] border border-zinc-800 rounded-xl flex items-center justify-between">
            <div>
              <div className="font-bold text-zinc-100">Smart Sales Email Drafter</div>
              <div className="text-zinc-400 text-[11px]">
                Context-aware executive follow-up and proposal summary generator
              </div>
            </div>
            <span className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 font-bold px-2 py-0.5 rounded text-[10px]">
              ONLINE
            </span>
          </div>
        </div>
      </div>

      {/* 4. Data Management & Factory Reset */}
      <div className="bg-[#161619] border border-zinc-800 rounded-2xl shadow-xs p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
          <Database className="w-4 h-4 text-rose-400" />
          <h2 className="text-sm font-bold text-zinc-100">Data Management & Reset</h2>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-rose-950/20 border border-rose-900/40 rounded-xl">
          <div>
            <div className="font-bold text-rose-300 text-xs">Reset to Factory Demo Seed Data</div>
            <p className="text-[11px] text-rose-400/80 mt-0.5">
              Restores initial seed accounts, contacts, opportunities, and activities.
            </p>
          </div>

          <button
            onClick={() => {
              if (confirm('Are you sure you want to reset CRM data to initial demo state?')) {
                resetToFactoryDefaults();
                alert('CRM reset to initial demo state.');
              }
            }}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          onClick={handleSave}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-600/20 transition-all cursor-pointer"
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
};
