import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, CheckCircle2, Lock, Sun, Moon } from 'lucide-react';
import { useCrm } from '../../context/CrmContext';
import { DEMO_USERS } from '../../mockData';
import { User } from '../../types';
import { BrandLogo } from '../common/BrandLogo';

export const LoginView: React.FC = () => {
  const { login, theme, toggleTheme } = useCrm();
  const [email, setEmail] = useState('janakipawar2004@gmail.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const matchedUser = DEMO_USERS.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (matchedUser) {
      login(matchedUser);
    } else {
      // Create ad-hoc user if not in demo list
      const newUser: User = {
        id: `usr-${Date.now()}`,
        name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        email: email.trim(),
        role: 'sales',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        title: 'Sales Executive',
        department: 'Sales Team',
        phone: '+1 (555) 019-2834',
        preferences: {
          currency: 'USD',
          theme: 'dark',
          compactView: false,
          emailNotifications: true,
          taskReminders: true,
        },
      };
      login(newUser);
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setResetSuccess(true);
    setTimeout(() => {
      setIsForgotPassword(false);
      setResetSuccess(false);
    }, 2500);
  };

  return (
    <div className={`min-h-screen flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden transition-colors duration-200 ${
      theme === 'dark' ? 'bg-[#0A0D14] text-slate-100' : 'bg-[#F4F6FB] text-slate-900'
    }`}>
      {/* Top Right Theme Toggle */}
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#111625]/80 backdrop-blur-md text-slate-700 dark:text-slate-200 shadow-xs hover:scale-105 transition-all cursor-pointer flex items-center gap-2 text-xs font-semibold"
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-purple-600" />
              <span>Dark Mode</span>
            </>
          )}
        </button>
      </div>

      {/* Background ambient accents with Maverick colors */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/10 dark:bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/10 dark:bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-800/80 rounded-3xl shadow-2xl p-8 relative z-10">
        {/* TheMaverics Official Brand Logo */}
        <div className="flex flex-col items-center justify-center mb-6 pb-6 border-b border-slate-100 dark:border-slate-800/80 text-center">
          <BrandLogo size="lg" variant="full" />
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
            Next-Generation Enterprise CRM & Sales Suite
          </p>
        </div>

        {isForgotPassword ? (
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">Reset Password</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Enter your corporate email address to receive password reset instructions.
            </p>

            {resetSuccess ? (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                Password reset link sent to your email. Redirecting to login...
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Work Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#0E121E] border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                    placeholder="name@company.com"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-purple-900/20 cursor-pointer"
                >
                  Send Reset Link
                </button>
                <button
                  type="button"
                  onClick={() => setIsForgotPassword(false)}
                  className="w-full text-center text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer py-1"
                >
                  Back to Sign In
                </button>
              </form>
            )}
          </div>
        ) : (
          <div>
            <div className="mb-5 text-center">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Sign in to your account</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Select a role profile or enter credentials</p>
            </div>

            {/* Persona Quick Logins */}
            <div className="space-y-2 mb-5">
              <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
                Quick Role-Based Access
              </div>
              {DEMO_USERS.map((user) => (
                <button
                  key={user.id}
                  id={`quick-login-${user.role}`}
                  onClick={() => login(user)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-[#0E121E] dark:hover:bg-[#161D2F] border border-slate-200 dark:border-slate-800/80 hover:border-purple-500/40 transition-all text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-9 h-9 rounded-full object-cover border border-purple-500/40"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {user.name}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {user.title} • <span className="capitalize font-semibold text-purple-600 dark:text-purple-400">{user.role}</span>
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-500 group-hover:translate-x-0.5 transition-all" />
                </button>
              ))}
            </div>

            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-[#111625] px-2 text-slate-400 dark:text-slate-500 font-semibold text-[10px]">
                  Or sign in with email
                </span>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-600 dark:text-rose-400 text-xs mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleCustomLogin} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-[#0E121E] border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  placeholder="name@company.com"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Password</label>
                  <button
                    type="button"
                    onClick={() => setIsForgotPassword(true)}
                    className="text-xs text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-[#0E121E] border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                    placeholder="••••••••"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <button
                type="submit"
                id="submit-login-btn"
                className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-purple-900/25 active:scale-[0.98] cursor-pointer"
              >
                Sign In to TheMaverics CRM
              </button>
            </form>
          </div>
        )}

        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>TheMaverics Technologies Pvt. Ltd. Enterprise Security</span>
          </div>
        </div>
      </div>
    </div>
  );
};
