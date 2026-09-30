import React from 'react';
import { 
  UtensilsCrossed, 
  ShieldCheck, 
  Download, 
  CreditCard, 
  MessageSquare, 
  Sparkles, 
  PhoneCall, 
  Lock, 
  LogOut,
  SlidersHorizontal
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeDownloadsCount: number;
  isAdminAuthenticated?: boolean;
  onAdminClick?: () => void;
  onAdminLogout?: () => void;
  adminUser?: { email: string; role: string } | null;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  activeDownloadsCount,
  isAdminAuthenticated = false,
  onAdminClick,
  onAdminLogout,
  adminUser,
}) => {
  // Public navigation tabs ONLY (Master Key Generator & Admin Portal removed from public header)
  const navTabs = [
    { id: 'downloads', label: 'App Downloads (4 Stations)', icon: Download, badge: 'v2.4.2' },
    { id: 'banking', label: 'Corporate Banking & Ref', icon: CreditCard, badge: 'Zenith / Moniepoint' },
    { id: 'whatsapp', label: 'WhatsApp Payment Slip', icon: MessageSquare, badge: 'Direct wa.me' },
  ];

  const handleAdminTrigger = () => {
    if (onAdminClick) {
      onAdminClick();
    } else {
      setActiveTab('admin');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/95 border-b border-slate-200 shadow-sm">
      {/* Top Banner Ribbon */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 text-white text-[11px] font-medium py-1 px-4 text-center flex items-center justify-center gap-3">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          Kaylix Kitchen & Eatery Suite v2.4.2 Stable Release
        </span>
        <span className="hidden md:inline">•</span>
        <span className="hidden md:inline opacity-90">Corporate Banking Portals Active</span>
        <span className="hidden md:inline">•</span>
        <span className="hidden sm:flex items-center gap-1 font-semibold underline underline-offset-2">
          <PhoneCall className="w-3 h-3" /> Priority Tech Dispatch: +2348 06039 5329
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3.5 cursor-pointer" onClick={() => setActiveTab('downloads')}>
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/25 ring-2 ring-amber-400/40">
                <UtensilsCrossed className="w-6 h-6 text-slate-950 stroke-[2.5]" />
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-slate-950 flex items-center justify-center" title="Systems Online">
                <span className="w-2 h-2 rounded-full bg-emerald-100 animate-ping" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 flex items-center gap-1">
                  KAYLIX
                  <span className="text-amber-800 font-extrabold text-sm sm:text-base tracking-normal ml-1 px-2 py-0.5 rounded-md bg-amber-50 border border-amber-300">
                    Eatery Suite
                  </span>
                </h1>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Kitchen & Eatery Management Enterprise Portal
              </p>
            </div>
          </div>

          {/* Right Header: System Status & Admin Gateway Button */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-slate-500">Gateway Status:</span>
                <span className="text-emerald-700 font-semibold">99.98% Operational</span>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span className="text-slate-500">Cryptographic Engine:</span>
                <span className="text-slate-800 font-mono font-medium">4-5-5-2-4</span>
              </div>
            </div>

            {/* Admin Portal Gateway Trigger */}
            {!isAdminAuthenticated ? (
              <button
                type="button"
                onClick={handleAdminTrigger}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 text-xs font-semibold transition-all shadow-xs group"
                title="Protected Staff Login: Master Key Generator & Customer Database"
              >
                <div className="w-5 h-5 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                  <Lock className="w-3 h-3" />
                </div>
                <span>Admin Sign In</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 text-slate-600 hidden sm:inline">
                  Staff
                </span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAdminTrigger}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'admin'
                      ? 'bg-amber-100 border-amber-300 text-amber-900 ring-1 ring-amber-400 shadow-sm'
                      : 'bg-slate-50 text-slate-800 hover:bg-slate-100 border border-slate-200'
                  }`}
                  title="Open Admin Backend Dashboard"
                >
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="hidden sm:inline">Admin Backend</span>
                  <span className="sm:hidden">Admin</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-200 text-amber-900">
                    {adminUser?.email ? adminUser.email.split('@')[0] : 'Active'}
                  </span>
                </button>

                {onAdminLogout && (
                  <button
                    type="button"
                    onClick={onAdminLogout}
                    className="p-2 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 transition-colors shadow-xs"
                    title="Lock Admin Session & Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Tab Navigation (Public Customer Tabs Only) */}
        <div className="flex items-center justify-between pb-3 pt-1 border-t border-slate-100 sm:border-none">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none w-full">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md ring-1 ring-amber-400/50'
                      : 'bg-slate-50 text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-amber-600'}`} />
                  <span>{tab.label}</span>
                  {tab.id === 'downloads' && activeDownloadsCount > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 text-[10px] rounded-full bg-slate-950 text-amber-300 font-bold animate-pulse">
                      {activeDownloadsCount} downloading
                    </span>
                  )}
                  {tab.badge && (!activeDownloadsCount || tab.id !== 'downloads') && (
                    <span
                      className={`ml-1 text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                        isActive
                          ? 'bg-slate-950/20 text-slate-950'
                          : 'bg-slate-200 text-slate-700 border border-slate-300/60'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* When logged in as admin, provide a quick indicator pill in the tab row as well */}
            {isAdminAuthenticated && (
              <button
                onClick={handleAdminTrigger}
                className={`ml-auto hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'admin'
                    ? 'bg-amber-100 border-amber-400 text-amber-900'
                    : 'bg-slate-50 text-amber-800 hover:bg-slate-100 border border-amber-300'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
                <span>Backend Management Portal</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
