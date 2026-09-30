import React, { useState } from 'react';
import { 
  Download, 
  Monitor, 
  Wifi, 
  Printer, 
  Globe2, 
  CheckCircle2, 
  Copy, 
  Check, 
  ExternalLink, 
  FileCode2, 
  FolderDown, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  MessageSquare, 
  HelpCircle,
  Play,
  Terminal,
  Store,
  Layers,
  PhoneCall,
  Laptop,
  KeyRound,
  ChefHat,
  Smartphone,
  Activity,
  TrendingUp,
  ArrowDown,
  Clock
} from 'lucide-react';
import { SoftwareEdition, DownloadTask, RegistrationRecord } from '../types';
import { KAYLIX_SOFTWARE_VERSIONS, OFFICIAL_LICENSE_PAYMENT_ACCOUNTS } from '../data/portalData';
import { RegistrationModal } from './RegistrationModal';
import { DetailedCapabilitiesMatrix } from './DetailedCapabilitiesMatrix';

interface DownloadsSectionProps {
  onShowToast: (type: 'success' | 'info' | 'error', title: string, message?: string) => void;
  downloadTasks: Record<string, DownloadTask>;
  setDownloadTasks: React.Dispatch<React.SetStateAction<Record<string, DownloadTask>>>;
  onNavigateTab?: (tab: string) => void;
  selectedVersionOnly?: string | null;
  setSelectedVersionOnly?: (id: string | null) => void;
  activeTrialCode?: string | null;
  setActiveTrialCode?: (code: string | null) => void;
}

export const DownloadsSection: React.FC<DownloadsSectionProps> = ({
  onShowToast,
  downloadTasks,
  setDownloadTasks,
  onNavigateTab,
  selectedVersionOnly,
  setSelectedVersionOnly,
  activeTrialCode,
  setActiveTrialCode,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [registeringEdition, setRegisteringEdition] = useState<SoftwareEdition | {
    id: string;
    name: string;
    fileSize: string;
    fileName: string;
    priceTag: string;
    batchScript: string;
  } | null>(null);

  const handleDownloadClick = (edition: SoftwareEdition) => {
    // Intercept direct download to mandate sign-up/registration
    setRegisteringEdition(edition);
  };

  const handleRegistrationComplete = (record: RegistrationRecord) => {
    const isTrial = record.selectedEditionId === 'trial' || record.selectedEditionName.toLowerCase().includes('trial');

    setRegisteringEdition(null);

    if (isTrial) {
      // ONLY TRIAL gets code when form submitted as he goes ahead to download page. Download is NOT automatic!
      if (setActiveTrialCode && record.trialLicenseCode) {
        setActiveTrialCode(record.trialLicenseCode);
      }
      if (setSelectedVersionOnly) {
        setSelectedVersionOnly('trial');
      }

      onShowToast(
        'success',
        'Trial License Code Generated!',
        `Your code: ${record.trialLicenseCode}. Check your WhatsApp/Telegram/Email for your license code.`
      );

      // Smoothly scroll down to the trial card on download page
      setTimeout(() => {
        const el = document.getElementById('choose-software-version-section');
        el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 350);
    } else {
      // OTHERWISE: Take user to account detail page "Corporate Banking & Ref...", page to download selected version only
      if (setSelectedVersionOnly) {
        setSelectedVersionOnly(record.selectedEditionId);
      }

      onShowToast(
        'info',
        'Registration Submitted!',
        'Copy sent to WhatsApp & Telegram (+2348 06039 5329). Redirecting to Corporate Banking details...'
      );

      setTimeout(() => {
        if (onNavigateTab) {
          onNavigateTab('banking');
        }
      }, 600);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    onShowToast('success', 'Copied to Clipboard!', `${label} (${text})`);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const startEditionDownload = (edition: SoftwareEdition) => {
    if (downloadTasks[edition.id]?.status === 'downloading') {
      onShowToast('info', 'Download in Progress', `${edition.name} is currently downloading...`);
      return;
    }

    onShowToast('info', 'Download Initiated', `Connecting to Kaylix CDN for ${edition.name} (${edition.fileSize})...`);

    setDownloadTasks((prev) => ({
      ...prev,
      [edition.id]: {
        appId: edition.id,
        appName: edition.name,
        fileName: edition.fileName,
        fileSize: edition.fileSize,
        progress: 8,
        speed: '18.4 MB/s',
        status: 'downloading',
      },
    }));

    let progress = 8;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 18) + 10;
      if (progress >= 100) {
        clearInterval(interval);
        setDownloadTasks((prev) => ({
          ...prev,
          [edition.id]: {
            ...prev[edition.id],
            progress: 100,
            speed: 'Done',
            status: 'completed',
          },
        }));

        triggerBatchDownload(edition);

        onShowToast(
          'success',
          'Download Complete!',
          `${edition.fileName} package and ${edition.batchScript} ready to run!`
        );
      } else {
        const speeds = ['17.4 MB/s', '21.8 MB/s', '19.2 MB/s', '24.5 MB/s', '18.9 MB/s'];
        const randomSpeed = speeds[Math.floor(Math.random() * speeds.length)];
        setDownloadTasks((prev) => ({
          ...prev,
          [edition.id]: {
            ...prev[edition.id],
            progress: Math.min(progress, 99),
            speed: randomSpeed,
            status: 'downloading',
          },
        }));
      }
    }, 280);
  };

  const startMasterBundleDownload = (type: 'master' | 'marketing') => {
    const id = type === 'master' ? 'master-suite' : 'marketing-site';
    const name = type === 'master' ? 'Complete Master Suite Bundle (All 4 Versions)' : 'Kaylix Marketing Website Pack';
    const fileName = type === 'master' ? 'Kaylix_CanteenPro_MasterSuite_v2.4.2.zip' : 'Kaylix_Marketing_Website_Dist.zip';
    const size = type === 'master' ? '110 MB' : '15 MB';

    if (downloadTasks[id]?.status === 'downloading') {
      onShowToast('info', 'Download in Progress', `${name} is downloading...`);
      return;
    }

    onShowToast('info', 'Starting Download', `Downloading ${name} (${size})...`);

    setDownloadTasks((prev) => ({
      ...prev,
      [id]: {
        appId: id,
        appName: name,
        fileName,
        fileSize: size,
        progress: 10,
        speed: '25.6 MB/s',
        status: 'downloading',
      },
    }));

    let progress = 10;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 20) + 12;
      if (progress >= 100) {
        clearInterval(interval);
        setDownloadTasks((prev) => ({
          ...prev,
          [id]: {
            ...prev[id],
            progress: 100,
            speed: 'Done',
            status: 'completed',
          },
        }));

        triggerCustomFileDownload(fileName, `=====================================================
KAYLIX KITCHEN & EATERY MANAGEMENT SYSTEM v2.4.2
PACKAGE: ${name}
FILE: ${fileName}
SIZE: ${size}
RELEASE: Official Production Stable (Windows 10 & 11 64-bit)
=====================================================
INCLUDED PACKAGES:
1. Trial Version (1_CLICK_START_TRIAL.bat)
2. Basic Version (1_CLICK_START_BASIC.bat)
3. Standard Version (1_CLICK_START_STANDARD.bat)
4. Enterprise Version (1_CLICK_START_ENTERPRISE.bat)
5. Documentation & Thermal Printer Configuration Guide.pdf

QUICK START:
1. Extract to C:\\CanteenPro
2. Double-click 1_CLICK_START.bat
3. Open browser at http://localhost:3000
4. Technical Support Hotline: ${OFFICIAL_LICENSE_PAYMENT_ACCOUNTS.supportWhatsApp}
=====================================================`);

        onShowToast('success', 'Download Complete!', `${fileName} downloaded successfully.`);
      } else {
        setDownloadTasks((prev) => ({
          ...prev,
          [id]: {
            ...prev[id],
            progress: Math.min(progress, 99),
            speed: '24.2 MB/s',
            status: 'downloading',
          },
        }));
      }
    }, 280);
  };

  const triggerBatchDownload = (edition: SoftwareEdition) => {
    try {
      const batContent = `@echo off
title Kaylix CanteenPro ${edition.name} - 1-Click Launch
color 0A
echo =====================================================================
echo  KAYLIX KITCHEN ^& EATERY MANAGEMENT SYSTEM v2.4.2
echo  EDITION: ${edition.name.toUpperCase()}
echo =====================================================================
echo [INFO] Initializing SQLite offline database...
echo [INFO] Binding local network port 3000...
echo [INFO] Connecting local Wi-Fi staff hub...
echo.
echo Launching local cashier portal at http://localhost:3000
start http://localhost:3000
echo.
echo =====================================================================
echo  SYSTEM ACTIVE - Press any key to stop the server
echo =====================================================================
pause > nul
`;
      const blob = new Blob([batContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = edition.batchScript;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch {
      // headless fallback
    }
  };

  const triggerCustomFileDownload = (fileName: string, content: string) => {
    try {
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName.replace('.zip', '_Package_Manifest.txt');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      {/* Top Bar matching screenshot */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center font-black text-slate-950 text-xs shadow-md">
            K
          </div>
          <div>
            <div className="text-sm font-extrabold text-white tracking-tight flex items-center gap-1.5">
              <span>KaylixTech</span>
              <span className="text-[11px] text-slate-400 font-normal hidden sm:inline">• Kitchen & Eatery Operating System</span>
            </div>
          </div>
        </div>

        <a
          href={`https://wa.me/${OFFICIAL_LICENSE_PAYMENT_ACCOUNTS.supportWhatsAppRaw}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
          <span>WhatsApp: {OFFICIAL_LICENSE_PAYMENT_ACCOUNTS.supportWhatsApp}</span>
        </a>
      </div>

      {/* Main Hero Header Graphic Showcase */}
      <div className="relative rounded-3xl bg-gradient-to-b from-amber-500/10 via-orange-500/5 to-white border-2 border-amber-300/70 p-6 sm:p-10 shadow-xl overflow-hidden">
        {/* Subtle decorative background watermark grid */}
        <div 
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #d97706 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }}
        />

        {/* Ambient Top Glow Orbs */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/4 -right-20 w-64 h-64 bg-orange-400/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 text-center max-w-4xl mx-auto space-y-5">
          {/* Top System Certification Ribbon */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold shadow-xs">
              <Laptop className="w-3.5 h-3.5 text-amber-700" />
              Windows 10 & 11 (64-Bit Desktop)
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              100% Offline Standalone POS
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 border border-blue-300 text-blue-900 text-xs font-mono font-bold shadow-xs">
              <Activity className="w-3.5 h-3.5 text-blue-700" />
              v2.4.2 Production
            </span>
          </div>

          {/* Eyebrow Label */}
          <div className="text-xs font-mono font-black uppercase tracking-widest text-amber-700 flex items-center justify-center gap-2">
            <span className="w-8 h-[2px] bg-amber-400/80 inline-block" />
            ENTERPRISE RESTAURANT OPERATING SYSTEM
            <span className="w-8 h-[2px] bg-amber-400/80 inline-block" />
          </div>

          {/* Graphic Typography Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
            Download{' '}
            <span className="relative inline-block px-1">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-500 to-rose-600">
                Kaylix Kitchen & Eatery
              </span>
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-amber-500/40" viewBox="0 0 100 20" preserveAspectRatio="none">
                <path d="M0,12 Q50,0 100,12" stroke="currentColor" strokeWidth="5" fill="transparent" />
              </svg>
            </span>
            <br className="hidden sm:inline" />
            <span className="text-slate-800"> Management App</span>
          </h1>

          {/* Core Benefit Narrative */}
          <p className="text-slate-700 text-sm sm:text-base leading-relaxed max-w-3xl mx-auto font-medium">
            The sovereign offline-first software suite engineered for fast food, university canteens, bakeries, and busy eateries. Runs 100% offline without internet, prints thermal receipts, connects kitchen line display screens, and allows staff smartphones over local Wi-Fi.
          </p>

          {/* Graphical Floor Ecosystem Showcase Preview */}
          <div className="pt-2 pb-1">
            <div className="rounded-2xl bg-white border border-amber-200/80 shadow-md p-4 max-w-3xl mx-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs text-slate-500">
                <div className="flex items-center gap-2 font-mono font-bold text-slate-800">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>KAYLIX RESTAURANT FLOOR HARDWARE NETWORK</span>
                </div>
                <span className="text-[11px] font-mono bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-md">
                  Active Stations: 4 of 4
                </span>
              </div>

              {/* 4 Interactive Graphic Floor Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 text-left">
                {/* Station 1: Cashier POS */}
                <div className="p-3 rounded-xl bg-slate-900 text-white shadow-sm space-y-2 relative overflow-hidden group">
                  <div className="flex items-center justify-between text-[10px] font-mono text-amber-400">
                    <span className="flex items-center gap-1"><Monitor className="w-3 h-3" /> Station 1</span>
                    <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300">Offline POS</span>
                  </div>
                  <div>
                    <div className="text-xs font-black text-white">Cashier Checkout</div>
                    <div className="text-[10px] text-slate-300">Order #1042 • ₦8,400</div>
                  </div>
                  <div className="text-[9px] font-mono text-emerald-400 flex items-center gap-1">
                    <Printer className="w-2.5 h-2.5" /> Thermal 80mm Printed
                  </div>
                </div>

                {/* Station 2: Kitchen Display */}
                <div className="p-3 rounded-xl bg-orange-950/80 border border-orange-800/40 text-white shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-mono text-orange-400">
                    <span className="flex items-center gap-1"><ChefHat className="w-3 h-3" /> Station 2</span>
                    <span className="px-1.5 py-0.2 rounded bg-orange-500/20 text-orange-300">Live KDS</span>
                  </div>
                  <div>
                    <div className="text-xs font-black text-white">Kitchen Line Pass</div>
                    <div className="text-[10px] text-slate-300">3 Tickets • 4m 12s</div>
                  </div>
                  <div className="text-[9px] font-mono text-amber-400 flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" /> Zero-Lag Screen Sync
                  </div>
                </div>

                {/* Station 3: Waiter Phone */}
                <div className="p-3 rounded-xl bg-blue-950/80 border border-blue-800/40 text-white shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-mono text-blue-400">
                    <span className="flex items-center gap-1"><Smartphone className="w-3 h-3" /> Station 3</span>
                    <span className="px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300">Wi-Fi Phone</span>
                  </div>
                  <div>
                    <div className="text-xs font-black text-white">Waiter Mobile</div>
                    <div className="text-[10px] text-slate-300">Table 04 • Chidi</div>
                  </div>
                  <div className="text-[9px] font-mono text-blue-400 flex items-center gap-1">
                    <Wifi className="w-2.5 h-2.5" /> Direct Local LAN
                  </div>
                </div>

                {/* Station 4: Director Cloud */}
                <div className="p-3 rounded-xl bg-purple-950/80 border border-purple-800/40 text-white shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-mono text-purple-400">
                    <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Station 4</span>
                    <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300">Live HQ</span>
                  </div>
                  <div>
                    <div className="text-xs font-black text-white">Director Tunnel</div>
                    <div className="text-[10px] text-slate-300">₦1,420,500 Sales</div>
                  </div>
                  <div className="text-[9px] font-mono text-purple-300 flex items-center gap-1">
                    <Globe2 className="w-2.5 h-2.5" /> Smartphone Web View
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Primary Call to Action Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => {
                const el = document.getElementById('choose-software-version-section');
                el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="px-8 py-3.5 rounded-2xl text-sm sm:text-base font-black bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 shadow-lg shadow-orange-500/30 transition-all active:scale-95 flex items-center gap-2.5 group"
            >
              <span>Choose Your Software Version</span>
              <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('detailed-capabilities-matrix');
                el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold bg-white text-slate-700 hover:text-slate-900 border border-slate-300 hover:bg-slate-50 transition-all flex items-center gap-1.5 shadow-xs"
            >
              <Layers className="w-4 h-4 text-amber-600" />
              <span>Compare Capabilities Matrix</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0">
            <Monitor className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">Standalone Desktop</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Zero cloud dependency needed</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 border border-blue-300 flex items-center justify-center shrink-0">
            <Wifi className="w-5 h-5 text-blue-700" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">Local Wi-Fi Hub</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Connects phones & kiosks</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center shrink-0">
            <Printer className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">Thermal Printing</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Supports 58mm & 80mm rolls</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 border border-purple-300 flex items-center justify-center shrink-0">
            <Globe2 className="w-5 h-5 text-purple-700" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">Director Tunnel</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Monitor sales from anywhere</div>
          </div>
        </div>
      </div>

      {/* Active Trial Code Banner (Generated after Trial Registration) */}
      {activeTrialCode && (
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-emerald-950/90 via-slate-900 to-amber-950/80 border-2 border-emerald-500/60 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1.5 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
              <KeyRound className="w-4 h-4 text-emerald-400" />
              Active 7-Day Trial License Code Issued
            </div>
            <div className="text-xl sm:text-2xl font-mono font-black text-amber-300 tracking-wider selection:bg-amber-400 selection:text-slate-950">
              {activeTrialCode}
            </div>
            <div className="text-xs text-slate-300">
              <span className="font-bold underline text-amber-300">Note:</span> check your whatsapp/telepram/email for your license code. Download the Trial version below when you are ready.
            </div>
          </div>

          <button
            onClick={() => copyToClipboard(activeTrialCode, 'Trial License Code')}
            className="px-4 py-2.5 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center gap-1.5 shadow-md shadow-emerald-950/40 shrink-0 transition-transform active:scale-95"
          >
            {copiedKey === 'Trial License Code' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copiedKey === 'Trial License Code' ? 'Copied' : 'Copy Trial Code'}</span>
          </button>
        </div>
      )}

      {/* Software Versions 2x2 Grid matching screenshot */}
      <div id="choose-software-version-section" className="pt-2 space-y-6 scroll-mt-28">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Choose Your Software Version
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Pre-configured with automated 1-click batch startup scripts (.bat) and step-by-step setup guides.
          </p>

          {selectedVersionOnly && (
            <div className="mt-3 inline-flex items-center gap-3 px-4 py-1.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs">
              <span className="text-amber-300 font-semibold">
                Authorized Edition Ready: <strong className="text-white font-mono uppercase">{selectedVersionOnly}</strong>
              </span>
              <button
                onClick={() => setSelectedVersionOnly && setSelectedVersionOnly(null)}
                className="text-slate-400 hover:text-white underline text-[11px]"
              >
                Show All 4 Editions
              </button>
            </div>
          )}
        </div>

        {/* The Version Cards (Displays selected version or all) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(selectedVersionOnly && KAYLIX_SOFTWARE_VERSIONS.some(v => v.id === selectedVersionOnly)
            ? KAYLIX_SOFTWARE_VERSIONS.filter((v) => v.id === selectedVersionOnly)
            : KAYLIX_SOFTWARE_VERSIONS
          ).map((edition) => {
            const task = downloadTasks[edition.id];
            const isDownloading = task?.status === 'downloading';
            const isCompleted = task?.status === 'completed';

            return (
              <div
                key={edition.id}
                className={`relative flex flex-col justify-between rounded-3xl bg-white border-2 ${edition.theme.border} p-6 sm:p-7 shadow-lg transition-all duration-300 hover:scale-[1.01]`}
              >
                <div>
                  {/* Top Badge Row */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${edition.theme.badgeBg}`}>
                      {edition.badge}
                    </span>
                    <span className="text-xs font-bold font-mono text-slate-800">
                      {edition.pricing.isFree ? (
                        <span className="text-amber-700 font-bold">Free Evaluation</span>
                      ) : (
                        <span>{edition.priceTag}</span>
                      )}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                    {edition.name}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {edition.description}
                  </p>

                  {/* Notice Box for ngrok/hosting plan */}
                  <div className="my-4 p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 leading-relaxed italic">
                    {edition.hostNote}
                  </div>

                  {/* Features List */}
                  <div className="space-y-2 mb-6">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      {edition.name} features:
                    </div>
                    {edition.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                        <CheckCircle2 className={`w-4 h-4 ${edition.theme.accentText} shrink-0 mt-0.5`} />
                        <span className="leading-snug">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  {/* Download Progress Indicator if active */}
                  {task && (
                    <div className="mb-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                          {isDownloading ? (
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          )}
                          {isDownloading ? `Downloading ${task.fileName}...` : `Downloaded & Batch Script Ready!`}
                        </span>
                        <span className="font-mono font-bold text-amber-600">{task.progress}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-500 transition-all duration-200"
                          style={{ width: `${task.progress}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] font-mono text-slate-500">
                        <span>Speed: {task.speed}</span>
                        <span>{task.fileSize}</span>
                      </div>
                    </div>
                  )}

                  {/* Primary Download Button (Triggers Registration & Telegram dispatch first) */}
                  <button
                    onClick={() => handleDownloadClick(edition)}
                    disabled={isDownloading}
                    className={`w-full py-3.5 px-4 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-md transition-all active:scale-98 ${
                      isCompleted
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        : isDownloading
                        ? 'bg-slate-200 text-slate-500 cursor-wait'
                        : edition.theme.btnBg
                    }`}
                  >
                    <Download className="w-4 h-4 stroke-[2.5]" />
                    <span>Download {edition.name} ({edition.fileSize} .ZIP)</span>
                  </button>

                  {/* Bottom Subtext / Pricing Breakdown */}
                  <div className="mt-3 text-center text-xs text-slate-500">
                    {edition.pricing.isFree ? (
                      <span className="text-[11px] font-mono text-slate-500">
                        Includes {edition.batchScript} • Auto-verification code
                      </span>
                    ) : (
                      <div className="flex items-center justify-between text-[11px] font-mono px-1">
                        <span>1yr: {edition.pricing.yr1} • 3yrs: {edition.pricing.yr3}</span>
                        <span className="text-amber-800 font-bold">Lifetime: {edition.pricing.lifetime}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed Capabilities Matrix (Compare all 4 packages side-by-side) */}
        <DetailedCapabilitiesMatrix
          onSelectEdition={(id) => {
            if (setSelectedVersionOnly) setSelectedVersionOnly(id);
          }}
          onDownloadEdition={(id) => {
            const ed = KAYLIX_SOFTWARE_VERSIONS.find((v) => v.id === id);
            if (ed) handleDownloadClick(ed);
          }}
        />
      </div>

      {/* How to Install & Run in 3 Easy Steps */}
      <div className="space-y-4">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <h3 className="text-xl sm:text-2xl font-black text-slate-900">
            How to Install & Run in 3 Easy Steps
          </h3>
          <p className="text-xs text-slate-500">
            No technical or server configuration required. Pre-configured for Windows 10 & 11.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 relative overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-amber-100 border border-amber-300 text-amber-800 font-mono font-black text-sm flex items-center justify-center">
              1
            </div>
            <div className="text-base font-bold text-slate-900">Download & Extract</div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Download your chosen edition ZIP file and extract it to <code className="bg-slate-100 px-1 py-0.5 rounded text-amber-800 font-mono">C:\CanteenPro</code> or your desktop.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 relative overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-blue-100 border border-blue-300 text-blue-800 font-mono font-black text-sm flex items-center justify-center">
              2
            </div>
            <div className="text-base font-bold text-slate-900">1-Click Launch</div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Double-click the <code className="bg-slate-100 px-1 py-0.5 rounded text-blue-800 font-mono">1_CLICK_START.bat</code> file. It starts the local POS engine immediately.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 relative overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-800 font-mono font-black text-sm flex items-center justify-center">
              3
            </div>
            <div className="text-base font-bold text-slate-900">Start Selling</div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Open Chrome or Edge at <code className="bg-slate-100 px-1 py-0.5 rounded text-emerald-800 font-mono">http://localhost:3000</code> or open from phones via your local Wi-Fi IP address!
            </p>
          </div>
        </div>
      </div>

      {/* Support & Assistance Helpline Banner */}
      <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs shadow-sm">
        <div className="space-y-1 text-center md:text-left">
          <div className="font-bold text-slate-900 flex items-center justify-center md:justify-start gap-2">
            <HelpCircle className="w-4 h-4 text-amber-600" />
            Need Installation Assistance or License Purchase?
          </div>
          <div className="text-slate-600 text-[11px]">
            Official Technical Support & Activation Helpline: <span className="font-bold text-slate-900 font-mono">{OFFICIAL_LICENSE_PAYMENT_ACCOUNTS.supportWhatsApp}</span>
          </div>
          <div className="text-slate-500 text-[10px]">
            Accounts: 1. Kaylix Technology (Zenith Bank: 101 6978 239) • 2. Alabi Kayode Felix (Moniepoint: 808 9697 390)
          </div>
        </div>

        <a
          href={`https://wa.me/${OFFICIAL_LICENSE_PAYMENT_ACCOUNTS.supportWhatsAppRaw}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2.5 rounded-xl font-bold bg-[#25D366] hover:bg-[#20BD5A] text-slate-950 flex items-center gap-2 shadow-sm shrink-0 transition-transform active:scale-95"
        >
          <MessageSquare className="w-4 h-4 fill-slate-950" />
          <span>Chat on WhatsApp</span>
        </a>
      </div>

      {/* Mandatory Sign-up & Registration Modal */}
      <RegistrationModal
        edition={registeringEdition}
        onClose={() => setRegisteringEdition(null)}
        onSubmit={handleRegistrationComplete}
      />
    </div>
  );
};
