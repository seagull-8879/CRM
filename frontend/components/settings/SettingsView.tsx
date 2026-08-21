import React, { useState } from 'react';
import {
  Settings,
  Shield,
  DollarSign,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  Database,
  Sun,
  Moon,
  Palette,
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';
import { DEMO_USERS } from '../../mockData';
import { BrandLogo } from '../common/BrandLogo';

export const SettingsView: React.FC = () => {
  const { currentUser, login, resetToFactoryDefaults, theme, setTheme } = useCrm();

  const [currency, setCurrency] = useState('USD');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div id="crm-settings-view" className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header with TheMaverics Branding */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#111625] p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xs">
        <div className="flex items-center gap-4">
          <BrandLogo size="lg" variant="full" />
          <div className="border-l border-slate-200 dark:border-slate-800 pl-4 hidden md:block">
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Enterprise Configuration
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage appearance, roles, localization, and multimodal AI services
            </p>
          </div>
        </div>
        <span className="text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-500/10 border border-purple-500/20 px-3 py-1.5 rounded-xl self-start sm:self-center">
          TheMaverics CRM v2.0
        </span>
      </div>

      {savedSuccess && (
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>System preferences saved successfully!</span>
        </div>
      )}

      {/* 1. Theme & Appearance Switcher (TheMaverics Dark / Light) */}
      <div className="bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Theme & Appearance
            </h2>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Active: <strong className="text-purple-600 dark:text-purple-400 capitalize">{theme} Mode</strong>
          </span>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          Switch between TheMaverics signature Obsidian Dark mode and Glacier Slate Light mode.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Dark Mode Card */}
          <button
            id="settings-theme-dark-btn"
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden cursor-pointer flex flex-col gap-3 ${
              theme === 'dark'
                ? 'border-purple-500 bg-purple-950/20 ring-2 ring-purple-500/30'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50 dark:bg-[#0E121E]'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#0A0D14] border border-slate-700 flex items-center justify-center text-purple-400">
                  <Moon className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900 dark:text-slate-100">Maverick Dark Mode</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Obsidian Navy & Royal Blue</div>
                </div>
              </div>
              {theme === 'dark' && (
                <span className="text-[10px] font-bold bg-purple-500 text-white px-2 py-0.5 rounded-full">
                  ACTIVE
                </span>
              )}
            </div>

            {/* Dark Mode Mini Palette Preview */}
            <div className="flex items-center gap-1.5 p-2 rounded-lg bg-[#0A0D14] border border-slate-800">
              <div className="w-5 h-5 rounded-md bg-[#9333EA]" title="Maverick Purple" />
              <div className="w-5 h-5 rounded-md bg-[#2563EB]" title="Royal Blue" />
              <div className="w-5 h-5 rounded-md bg-[#111625]" title="Obsidian Surface" />
              <div className="w-5 h-5 rounded-md bg-[#0A0D14]" title="Background" />
              <span className="text-[10px] text-slate-400 ml-auto font-mono">#0A0D14</span>
            </div>
          </button>

          {/* Light Mode Card */}
          <button
            id="settings-theme-light-btn"
            onClick={() => setTheme('light')}
            className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden cursor-pointer flex flex-col gap-3 ${
              theme === 'light'
                ? 'border-purple-500 bg-purple-500/10 ring-2 ring-purple-500/30'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50 dark:bg-[#0E121E]'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-amber-500 shadow-xs">
                  <Sun className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900 dark:text-slate-100">Maverick Light Mode</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Glacier Ice & Slate</div>
                </div>
              </div>
              {theme === 'light' && (
                <span className="text-[10px] font-bold bg-purple-600 text-white px-2 py-0.5 rounded-full">
                  ACTIVE
                </span>
              )}
            </div>

            {/* Light Mode Mini Palette Preview */}
            <div className="flex items-center gap-1.5 p-2 rounded-lg bg-white border border-slate-200">
              <div className="w-5 h-5 rounded-md bg-[#9333EA]" title="Maverick Purple" />
              <div className="w-5 h-5 rounded-md bg-[#2563EB]" title="Royal Blue" />
              <div className="w-5 h-5 rounded-md bg-[#F4F6FB]" title="Glacier Surface" />
              <div className="w-5 h-5 rounded-md bg-[#FFFFFF]" title="White Card" />
              <span className="text-[10px] text-slate-600 ml-auto font-mono">#F4F6FB</span>
            </div>
          </button>
        </div>
      </div>

      {/* 2. Active Role & Persona Switching */}
      <div className="bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-xs p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3">
          <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Active Role Profile & RBAC Switcher
          </h2>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
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
                    ? 'border-purple-500 bg-purple-500/10 ring-2 ring-purple-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50 dark:bg-[#0E121E]'
                }`}
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover border border-purple-500/30 shrink-0"
                />
                <div className="min-w-0">
                  <div className="font-bold text-slate-900 dark:text-slate-100 text-xs truncate">{user.name}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">{user.title}</div>
                  <span
                    className={`inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full capitalize border ${
                      user.role === 'admin'
                        ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20'
                        : user.role === 'management'
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                        : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
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

      {/* 3. Localization & Currency */}
      <div className="bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-xs p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3">
          <DollarSign className="w-4 h-4 text-emerald-500" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Currency & Formatting</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Base Reporting Currency
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0E121E] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
            >
              <option value="USD">USD ($) - US Dollar</option>
              <option value="EUR">EUR (€) - Euro</option>
              <option value="GBP">GBP (£) - British Pound</option>
              <option value="INR">INR (₹) - Indian Rupee</option>
              <option value="JPY">JPY (¥) - Japanese Yen</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Date Format Display</label>
            <select className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0E121E] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500">
              <option value="YYYY-MM-DD">YYYY-MM-DD (ISO Enterprise Default)</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY (US Format)</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY (UK / EU Format)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. AI & Multimodal Services */}
      <div className="bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-xs p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3">
          <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Gemini Multimodal Intelligence Services
          </h2>
        </div>

        <div className="space-y-3 text-xs">
          <div className="p-3.5 bg-slate-50 dark:bg-[#0E121E] border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-900 dark:text-slate-100">Visiting Card Vision OCR (Gemini 3.7 Flash)</div>
              <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                High-speed visual extraction for physical & digital business cards
              </div>
            </div>
            <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 font-bold px-2 py-0.5 rounded-md text-[10px]">
              ONLINE
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-[#0E121E] border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-900 dark:text-slate-100">Opportunity Deal Coach & Win Predictor</div>
              <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                Automated deal health scoring, win factor analysis & next steps
              </div>
            </div>
            <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 font-bold px-2 py-0.5 rounded-md text-[10px]">
              ONLINE
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-[#0E121E] border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-900 dark:text-slate-100">Smart Sales Email Drafter</div>
              <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                Context-aware executive outreach and client communication generator
              </div>
            </div>
            <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 font-bold px-2 py-0.5 rounded-md text-[10px]">
              ONLINE
            </span>
          </div>
        </div>
      </div>

      {/* 5. Data Management & Factory Reset */}
      <div className="bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-xs p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3">
          <Database className="w-4 h-4 text-rose-500" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Data Management & Reset</h2>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-rose-500/5 dark:bg-rose-950/20 border border-rose-500/20 rounded-xl">
          <div>
            <div className="font-bold text-rose-700 dark:text-rose-300 text-xs">Reset to Factory Demo Seed Data</div>
            <p className="text-[11px] text-rose-600/80 dark:text-rose-400/80 mt-0.5">
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
          className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-purple-900/20 transition-all cursor-pointer"
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
};
