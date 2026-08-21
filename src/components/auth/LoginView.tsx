import React, { useState } from 'react';
import { Briefcase, ArrowRight, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';
import { useCrm } from '../../context/CrmContext';
import { DEMO_USERS } from '../../mockData';
import { User } from '../../types';

export const LoginView: React.FC = () => {
  const { login } = useCrm();
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
          theme: 'light',
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
    <div className="min-h-screen bg-[#0F0F11] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background ambient accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-[#161619] border border-zinc-800 rounded-2xl shadow-2xl p-8 relative z-10">
        {/* Brand */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/10 text-white">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-zinc-100 tracking-tight">CRM MVP</h1>
            <p className="text-xs text-zinc-400">Salesforce-Inspired Workspace</p>
          </div>
        </div>

        {isForgotPassword ? (
          <div>
            <h2 className="text-lg font-semibold text-zinc-100 mb-2">Reset Password</h2>
            <p className="text-xs text-zinc-400 mb-6">
              Enter your corporate email address to receive password reset instructions.
            </p>

            {resetSuccess ? (
              <div className="p-4 bg-emerald-950/60 border border-emerald-800/80 rounded-xl text-emerald-300 text-xs flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                Password reset link sent to your email. Redirecting to login...
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">Work Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#121215] border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    placeholder="name@company.com"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold transition-all cursor-pointer"
                >
                  Send Reset Link
                </button>
                <button
                  type="button"
                  onClick={() => setIsForgotPassword(false)}
                  className="w-full text-center text-xs text-zinc-400 hover:text-zinc-200 cursor-pointer py-1"
                >
                  Back to Sign In
                </button>
              </form>
            )}
          </div>
        ) : (
          <div>
            <div className="mb-6 text-center">
              <h2 className="text-lg font-semibold text-zinc-100">Sign in to your account</h2>
              <p className="text-xs text-zinc-400 mt-1">Select a role profile or enter credentials</p>
            </div>

            {/* Persona Quick Logins */}
            <div className="space-y-2 mb-6">
              <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                Quick Persona Access
              </div>
              {DEMO_USERS.map((user) => (
                <button
                  key={user.id}
                  id={`quick-login-${user.role}`}
                  onClick={() => login(user)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#121215] hover:bg-[#1C1C20] border border-zinc-800 hover:border-zinc-700 transition-all text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-9 h-9 rounded-full object-cover border border-zinc-700"
                    />
                    <div>
                      <div className="text-sm font-semibold text-zinc-100 group-hover:text-blue-400 transition-colors">
                        {user.name}
                      </div>
                      <div className="text-xs text-zinc-400">
                        {user.title} • <span className="capitalize font-medium text-blue-400">{user.role}</span>
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
                </button>
              ))}
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#161619] px-2 text-zinc-500">Or sign in with email</span>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-rose-950/60 border border-rose-800/80 rounded-xl text-rose-300 text-xs mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleCustomLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-[#121215] border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  placeholder="name@company.com"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-zinc-300">Password</label>
                  <button
                    type="button"
                    onClick={() => setIsForgotPassword(true)}
                    className="text-xs text-blue-400 hover:text-blue-300 cursor-pointer"
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
                    className="w-full px-3 py-2 bg-[#121215] border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    placeholder="••••••••"
                  />
                  <Lock className="w-4 h-4 text-zinc-500 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <button
                type="submit"
                id="submit-login-btn"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold transition-all shadow-md shadow-blue-600/30 active:scale-[0.98] cursor-pointer"
              >
                Sign In to CRM
              </button>
            </form>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-zinc-800 text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Role-Based Access Control • BRD v1.1 Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
};
