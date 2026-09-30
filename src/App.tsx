import React, { useState, useEffect } from 'react';
import { 
  Download, 
  CreditCard, 
  MessageSquare, 
  KeyRound, 
  UtensilsCrossed, 
  ShieldCheck, 
  HelpCircle, 
  CheckCircle2, 
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Laptop,
  Database,
  Lock
} from 'lucide-react';
import { Header } from './components/Header';
import { DownloadsSection } from './components/DownloadsSection';
import { BankingSection } from './components/BankingSection';
import { WhatsAppSlipSection } from './components/WhatsAppSlipSection';
import { AdminSignInSection } from './components/AdminSignInSection';
import { AdminBackendContainer } from './components/AdminBackendContainer';
import { SystemRequirementsModal } from './components/SystemRequirementsModal';
import { ToastContainer, ToastMessage } from './components/Toast';
import { StationApp, DownloadTask } from './types';
import { generatePaymentReference } from './utils/referenceGenerator';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('downloads');
  const [modalApp, setModalApp] = useState<StationApp | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Admin Authentication State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return typeof localStorage !== 'undefined' && !!localStorage.getItem('kaylix_admin_token');
  });

  const [adminToken, setAdminToken] = useState<string>(() => {
    return (typeof localStorage !== 'undefined' && localStorage.getItem('kaylix_admin_token')) || '';
  });

  const [adminUser, setAdminUser] = useState<{ email: string; role: string } | null>(() => {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem('kaylix_admin_user');
      if (raw) {
        try {
          return JSON.parse(raw);
        } catch {
          return { email: 'admin@kaylix.ng', role: 'Super Administrator' };
        }
      }
    }
    return { email: 'admin@kaylix.ng', role: 'Super Administrator' };
  });

  // Verify session on mount if token exists
  useEffect(() => {
    const token = localStorage.getItem('kaylix_admin_token');
    if (token) {
      fetch('/api/admin/session', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.authenticated) {
            setIsAdminAuthenticated(true);
            if (data.user) setAdminUser(data.user);
          } else {
            // Expired or invalid
            localStorage.removeItem('kaylix_admin_token');
            localStorage.removeItem('kaylix_admin_user');
            setIsAdminAuthenticated(false);
          }
        })
        .catch(() => {
          // Keep offline state
        });
    }
  }, []);
  
  // Dynamic reference code state
  const [currentReference, setCurrentReference] = useState<string>(() => generatePaymentReference(2026));
  const [presetBank, setPresetBank] = useState<string>('Zenith Bank PLC');

  // Selected download version filter & trial code state
  const [selectedVersionOnly, setSelectedVersionOnly] = useState<string | null>(null);
  const [activeTrialCode, setActiveTrialCode] = useState<string | null>(null);

  // Simulated downloads state
  const [downloadTasks, setDownloadTasks] = useState<Record<string, DownloadTask>>({});

  const showToast = (type: 'success' | 'info' | 'error', title: string, message?: string) => {
    const id = `${Date.now()}-${Math.random()}`;
    const newToast: ToastMessage = { id, type, title, message };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const activeDownloadsCount = Object.values(downloadTasks).filter(
    (t) => t.status === 'downloading'
  ).length;

  const handleProceedToWhatsApp = (ref: string, bankName: string) => {
    setCurrentReference(ref);
    setPresetBank(bankName);
    setActiveTab('whatsapp');
    showToast('info', 'Switched to WhatsApp Slip', `Payment reference ${ref} applied.`);
  };

  const handleProceedToDownload = (editionId?: string) => {
    if (editionId) {
      setSelectedVersionOnly(editionId);
    }
    setActiveTab('downloads');
    showToast('success', 'Download Portal Active', `Displaying download for ${editionId || 'selected edition'}.`);
  };

  const handleAdminLoginSuccess = (token: string, user: { email: string; role: string }) => {
    setAdminToken(token);
    setAdminUser(user);
    setIsAdminAuthenticated(true);
    setActiveTab('admin');
  };

  const handleAdminLogout = () => {
    if (adminToken) {
      fetch('/api/admin/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
      }).catch(() => {});
    }
    localStorage.removeItem('kaylix_admin_token');
    localStorage.removeItem('kaylix_admin_user');
    setIsAdminAuthenticated(false);
    setAdminToken('');
    setAdminUser(null);
    showToast('info', 'Logged Out', 'Administrative session locked.');
    if (activeTab === 'admin' || activeTab === 'licensing') {
      setActiveTab('downloads');
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Header (Public tabs only: Downloads, Corporate Banking, WhatsApp Slip) */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeDownloadsCount={activeDownloadsCount}
        isAdminAuthenticated={isAdminAuthenticated}
        adminUser={adminUser}
        onAdminClick={() => setActiveTab('admin')}
        onAdminLogout={handleAdminLogout}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {activeTab === 'downloads' && (
          <DownloadsSection
            onShowToast={showToast}
            downloadTasks={downloadTasks}
            setDownloadTasks={setDownloadTasks}
            onNavigateTab={(tab) => setActiveTab(tab)}
            selectedVersionOnly={selectedVersionOnly}
            setSelectedVersionOnly={setSelectedVersionOnly}
            activeTrialCode={activeTrialCode}
            setActiveTrialCode={setActiveTrialCode}
          />
        )}

        {activeTab === 'banking' && (
          <BankingSection
            onShowToast={showToast}
            currentReference={currentReference}
            setCurrentReference={setCurrentReference}
            onProceedToWhatsApp={handleProceedToWhatsApp}
          />
        )}

        {activeTab === 'whatsapp' && (
          <WhatsAppSlipSection
            onShowToast={showToast}
            currentReference={currentReference}
            presetBank={presetBank}
            onNavigateToDownload={handleProceedToDownload}
          />
        )}

        {/* Protected Backend Views: Master Key Generator & Admin Portal Database */}
        {(activeTab === 'admin' || activeTab === 'licensing') && (
          !isAdminAuthenticated ? (
            <AdminSignInSection
              onLoginSuccess={handleAdminLoginSuccess}
              onShowToast={showToast}
              onBackToPublic={() => setActiveTab('downloads')}
            />
          ) : (
            <AdminBackendContainer
              adminToken={adminToken}
              adminUser={adminUser || { email: 'admin@kaylix.ng', role: 'Super Administrator' }}
              onLogout={handleAdminLogout}
              onShowToast={showToast}
              onNavigateTab={(tab) => setActiveTab(tab)}
              initialSubTab={activeTab === 'licensing' ? 'licensing' : 'database'}
            />
          )
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-slate-50 text-slate-600 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 to-red-600 flex items-center justify-center text-slate-950 font-bold">
                  <UtensilsCrossed className="w-4 h-4" />
                </div>
                <span className="font-black text-slate-900 tracking-tight text-sm">KAYLIX SYSTEMS</span>
              </div>
              <p className="text-slate-500 leading-relaxed text-[11px]">
                High-performance kitchen display systems, offline POS checkout terminals, and multi-branch management infrastructure for Nigeria and West Africa's leading eateries.
              </p>
            </div>

            <div className="space-y-2">
              <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Commercial Banking</div>
              <div className="space-y-1 text-[11px] text-slate-600">
                <div>Zenith Bank PLC: <span className="font-mono font-bold text-slate-800">101 6978 239</span></div>
                <div>Moniepoint MFB: <span className="font-mono font-bold text-slate-800">808 9697 390</span></div>
                <div>Sort Codes: 057150013 / 090405</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Corporate Offices</div>
              <div className="space-y-1 text-[11px] text-slate-600">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-amber-600 shrink-0" />
                  <span>Abuja HQ: Plot 482 Ahmadu Bello Way, FCT</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-orange-600 shrink-0" />
                  <span>Lagos Hub: Victoria Island Tech Hub, Lagos</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Support & Dispatch</div>
              <div className="space-y-1 text-[11px] text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3 h-3 text-emerald-600" />
                  <span>WhatsApp: +2348 06039 5329</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3 h-3 text-indigo-600" />
                  <span>licensing@kaylixsystems.com</span>
                </div>
                <div className="text-emerald-700 font-mono text-[10px] pt-1 flex items-center justify-between">
                  <span>Build: v2.4.2-2026.09</span>
                  <button
                    onClick={() => setActiveTab('admin')}
                    className="text-amber-700 hover:text-amber-800 underline underline-offset-2 flex items-center gap-1"
                  >
                    <Lock className="w-2.5 h-2.5" />
                    Admin Portal
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
            <div className="text-slate-500">
              © 2026 Kaylix Systems & Technologies Ltd. All rights reserved.
            </div>
            <div className="flex items-center gap-4 text-slate-400">
              <span>Security Protocols: ISO 27001 • NIBSS PCI-DSS</span>
              <span>•</span>
              <span>4-5-5-2-4 Cryptographic Key Format</span>
            </div>
          </div>
        </div>
      </footer>

      {/* System Requirements Modal */}
      <SystemRequirementsModal
        app={modalApp}
        onClose={() => setModalApp(null)}
        onDownload={(app) => {
          showToast('info', 'Download Started', `Starting package download for ${app.name}`);
        }}
      />

      {/* Toast Notification Layer */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
