import React, { useState } from 'react';
import { 
  Database, 
  KeyRound, 
  LogOut, 
  ShieldCheck, 
  User, 
  ExternalLink, 
  Sparkles, 
  Lock, 
  ArrowLeft,
  Server,
  Layers
} from 'lucide-react';
import { AdminPortalSection } from './AdminPortalSection';
import { KeyGeneratorSection } from './KeyGeneratorSection';

interface AdminBackendContainerProps {
  adminToken: string;
  adminUser: { email: string; role: string };
  onLogout: () => void;
  onShowToast: (type: 'success' | 'info' | 'error', title: string, message?: string) => void;
  onNavigateTab: (tab: string) => void;
  initialSubTab?: 'database' | 'licensing';
}

export const AdminBackendContainer: React.FC<AdminBackendContainerProps> = ({
  adminToken,
  adminUser,
  onLogout,
  onShowToast,
  onNavigateTab,
  initialSubTab = 'database',
}) => {
  const [subTab, setSubTab] = useState<'database' | 'licensing'>(initialSubTab);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
      });
    } catch {
      // ignore
    }

    localStorage.removeItem('kaylix_admin_token');
    localStorage.removeItem('kaylix_admin_user');
    onLogout();
    onShowToast('info', 'Logged Out', 'Administrative session has been locked.');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Backend Top Command Bar */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-4 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Admin Identity Badge */}
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-red-600 flex items-center justify-center text-slate-950 shadow-lg shadow-orange-950/40 ring-2 ring-amber-400/40">
              <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-white">
                  Kaylix Administrator Backend
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Authenticated Session
                </span>
              </div>
              <div className="text-xs text-slate-300 font-medium flex items-center gap-2 mt-0.5">
                <span className="text-amber-400 font-mono font-semibold">{adminUser.email}</span>
                <span>•</span>
                <span className="text-slate-400">{adminUser.role || 'Super Administrator'}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons: Public view switch & Logout */}
          <div className="flex items-center gap-2.5 self-end md:self-auto">
            <button
              onClick={() => onNavigateTab('downloads')}
              className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5"
              title="Return to Customer App Downloads view"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />
              Public Customer View
            </button>

            <button
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-xs font-bold text-red-300 hover:text-red-200 transition-colors flex items-center gap-1.5"
              title="Lock backend and sign out"
            >
              <LogOut className="w-3.5 h-3.5" />
              Lock & Sign Out
            </button>
          </div>
        </div>

        {/* Backend Sub-navigation Tabs */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-2">
          <button
            onClick={() => setSubTab('database')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              subTab === 'database'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-indigo-950/40 ring-1 ring-blue-400/50'
                : 'bg-slate-950/70 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-slate-800'
            }`}
          >
            <Database className="w-4 h-4 text-blue-400" />
            <span>Admin Portal & Database Ledger</span>
          </button>

          <button
            onClick={() => setSubTab('licensing')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              subTab === 'licensing'
                ? 'bg-gradient-to-r from-purple-600 to-amber-600 text-white shadow-lg shadow-purple-950/40 ring-1 ring-purple-400/50'
                : 'bg-slate-950/70 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-slate-800'
            }`}
          >
            <KeyRound className="w-4 h-4 text-purple-400" />
            <span>Master Key Generator (4-5-5-2-4)</span>
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-amber-300 border border-slate-800">
              Backend
            </span>
          </button>
        </div>
      </div>

      {/* Sub-view Content */}
      {subTab === 'database' ? (
        <AdminPortalSection
          onShowToast={onShowToast}
          onNavigateTab={onNavigateTab}
          adminToken={adminToken}
        />
      ) : (
        <KeyGeneratorSection onShowToast={onShowToast} />
      )}
    </div>
  );
};
