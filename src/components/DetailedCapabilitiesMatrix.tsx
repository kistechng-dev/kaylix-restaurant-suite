import React, { useState } from 'react';
import { 
  Check, 
  X, 
  Sparkles, 
  Download, 
  Layers, 
  Store, 
  Wifi, 
  ChefHat, 
  Cloud, 
  ShieldCheck, 
  HeartHandshake,
  ArrowRight,
  Smartphone,
  Columns3,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';

interface DetailedCapabilitiesMatrixProps {
  onSelectEdition?: (editionId: string) => void;
  onDownloadEdition?: (editionId: string) => void;
}

interface MatrixFeature {
  name: string;
  description: string;
  isEnterpriseHighlight?: boolean;
  trial: boolean | string;
  basic: boolean | string;
  standard: boolean | string;
  enterprise: boolean | string;
}

interface MatrixCategory {
  categoryName: string;
  categoryIcon: React.ElementType;
  categoryBadge: string;
  features: MatrixFeature[];
}

export const DetailedCapabilitiesMatrix: React.FC<DetailedCapabilitiesMatrixProps> = ({
  onSelectEdition,
  onDownloadEdition,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  // Phone/Mobile specific states
  const [mobileActivePackage, setMobileActivePackage] = useState<'trial' | 'basic' | 'standard' | 'enterprise'>('enterprise');
  const [mobileViewMode, setMobileViewMode] = useState<'package' | 'sideBySide'>('package');

  const categories: MatrixCategory[] = [
    {
      categoryName: 'Core POS & Floor Hardware',
      categoryIcon: Store,
      categoryBadge: 'Base Cashier System',
      features: [
        {
          name: '100% Offline-First Standalone Terminal',
          description: 'Zero internet required for cashiering, order taking, and billing',
          trial: '7-Day Full Access',
          basic: true,
          standard: true,
          enterprise: true,
        },
        {
          name: 'ESC/POS 58mm & 80mm Thermal Receipt Printing',
          description: 'Direct driverless printing via USB, LAN Ethernet, or Bluetooth',
          trial: true,
          basic: true,
          standard: true,
          enterprise: true,
        },
        {
          name: 'Recipe Costing, Daily Margin & Stock Tracker',
          description: 'Automatic ingredient deduction upon sales & daily discrepancy analysis',
          trial: true,
          basic: true,
          standard: true,
          enterprise: true,
        },
        {
          name: 'Cash Drawer RJ11 Trigger & USB Barcode Scales',
          description: 'Hardware kick control, butcher scales, and deli price barcode parsing',
          trial: true,
          basic: true,
          standard: true,
          enterprise: true,
        },
      ],
    },
    {
      categoryName: 'Multi-Device & Network Architecture',
      categoryIcon: Wifi,
      categoryBadge: 'LAN / Wi-Fi Sync',
      features: [
        {
          name: 'Staff Handheld Wi-Fi Mobile Terminals',
          description: 'Waiters use personal Android/iOS phones to take table orders over local Wi-Fi',
          trial: '1 Phone Only',
          basic: false,
          standard: 'Unlimited Wi-Fi Phones',
          enterprise: 'Unlimited Local + Remote',
        },
        {
          name: 'Kitchen Display Screen (KDS) Pass Display',
          description: 'Zero-lag kitchen line tickets with urgency timers mounted on chef tablets/screens',
          trial: 'Evaluation Demo',
          basic: false,
          standard: '1 Dedicated Pass Screen',
          enterprise: 'Multi-Station Line Displays',
        },
        {
          name: 'Director Remote Tunnel (ngrok / Custom Host)',
          description: 'View real-time sales and cash balances from home on any smartphone',
          trial: 'Evaluation Tunnel',
          basic: false,
          standard: true,
          enterprise: true,
        },
      ],
    },
    {
      categoryName: 'Multi-Store, Commissary & Supply Chain',
      categoryIcon: Cloud,
      categoryBadge: 'Enterprise Suite',
      features: [
        {
          name: 'Central Cloud HQ Portal with live consolidated multi-store analytics',
          description: 'Aggregate revenue, gross profit, and branch performance in real-time',
          isEnterpriseHighlight: true,
          trial: false,
          basic: false,
          standard: false,
          enterprise: 'Live Consolidated HQ Portal',
        },
        {
          name: 'Inter-branch stock requisition, dispatch & receiving workflow',
          description: 'Multi-outlet transfer requests, waybill dispatch, and transit verification',
          isEnterpriseHighlight: true,
          trial: false,
          basic: false,
          standard: false,
          enterprise: 'Full Inter-Branch Logistics',
        },
        {
          name: 'Central commissary production tracking & batch yield calculator',
          description: 'Central kitchen bulk recipe preparation, raw material batching & unit yields',
          isEnterpriseHighlight: true,
          trial: false,
          basic: false,
          standard: false,
          enterprise: 'Batch Yield & Commissary Engine',
        },
      ],
    },
    {
      categoryName: 'Customer VIP Loyalty & Omnichannel',
      categoryIcon: HeartHandshake,
      categoryBadge: 'Guest Engagement',
      features: [
        {
          name: 'Customer VIP loyalty program, WhatsApp digital receipts',
          description: 'Automated digital slip dispatch to customer WhatsApp & tiered loyalty points',
          isEnterpriseHighlight: true,
          trial: false,
          basic: false,
          standard: false,
          enterprise: 'VIP Loyalty & WhatsApp Slips',
        },
        {
          name: 'Remote Customer Online Shopping & Meal Ordering',
          description: 'Public customer self-service menu ordering without 3rd-party commissions',
          trial: false,
          basic: false,
          standard: false,
          enterprise: 'Full Customer Online Store',
        },
        {
          name: 'Digital QR tokens for express customer collection',
          description: 'Queue token management for express take-away and pick-up counters',
          trial: false,
          basic: false,
          standard: false,
          enterprise: 'Express QR Token System',
        },
      ],
    },
    {
      categoryName: 'Governance, Security & Audit Logs',
      categoryIcon: ShieldCheck,
      categoryBadge: 'Loss Prevention',
      features: [
        {
          name: 'Role-based permissions with audit log and anti-theft sensors',
          description: 'Discrepancy alerts, unauthorized discount alarms, and anti-theft cash audits',
          isEnterpriseHighlight: true,
          trial: 'Demo RBAC',
          basic: 'Single Owner / Manager',
          standard: 'Standard Staff Roles',
          enterprise: 'Granular RBAC + Anti-Theft Sensors',
        },
        {
          name: 'Cryptographic License Architecture',
          description: 'Structure Breakdown (4-5-5-2-4) offline tamper-resistant hardware lock keys',
          trial: 'TRAL-xxxxx-xxxxx-7D-xxxx',
          basic: 'BASC-xxxxx-xxxxx-1Y-xxxx',
          standard: 'STND-xxxxx-xxxxx-1Y-xxxx',
          enterprise: 'ENTR-xxxxx-xxxxx-1Y-xxxx',
        },
        {
          name: 'Annual Subscription Pricing',
          description: 'Affordable commercial yearly licensing with 3-year and Lifetime options',
          trial: 'Free 7-Day Evaluation',
          basic: 'From ₦10,000 / yr',
          standard: 'From ₦20,000 / yr',
          enterprise: 'From ₦40,000 / yr',
        },
      ],
    },
  ];

  const packages = [
    {
      id: 'trial' as const,
      name: 'Trial Version',
      badge: 'Evaluation',
      price: 'Free',
      period: '7 Days Full Access',
      theme: {
        border: 'border-amber-300',
        bg: 'bg-amber-50/60',
        badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
        text: 'text-amber-800',
        btn: 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm',
      },
    },
    {
      id: 'basic' as const,
      name: 'Basic Version',
      badge: 'Single Counter',
      price: '₦10,000',
      period: 'per year',
      theme: {
        border: 'border-blue-300',
        bg: 'bg-blue-50/60',
        badgeBg: 'bg-blue-100 text-blue-900 border-blue-300',
        text: 'text-blue-800',
        btn: 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm',
      },
    },
    {
      id: 'standard' as const,
      name: 'Standard Version',
      badge: 'Most Popular',
      price: '₦20,000',
      period: 'per year',
      theme: {
        border: 'border-emerald-300',
        bg: 'bg-emerald-50/60',
        badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
        text: 'text-emerald-800',
        btn: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm',
      },
    },
    {
      id: 'enterprise' as const,
      name: 'Enterprise Version',
      badge: 'Flagship Multi-Store',
      price: '₦40,000',
      period: 'per year',
      theme: {
        border: 'border-purple-300',
        bg: 'bg-purple-50/60',
        badgeBg: 'bg-purple-100 text-purple-900 border-purple-300',
        text: 'text-purple-800',
        btn: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-md shadow-purple-500/20',
      },
    },
  ];

  const handleSelect = (id: string) => {
    if (onDownloadEdition) {
      onDownloadEdition(id);
    } else if (onSelectEdition) {
      onSelectEdition(id);
    }
  };

  const renderCellContent = (val: boolean | string, isEnterpriseCol: boolean = false) => {
    if (typeof val === 'boolean') {
      if (val) {
        return (
          <div className="flex items-center justify-center">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isEnterpriseCol ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-700'}`}>
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          </div>
        );
      }
      return (
        <div className="flex items-center justify-center">
          <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
            <X className="w-3 h-3 stroke-[2]" />
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center">
        <span className={`text-[11px] font-semibold text-center leading-snug px-2 py-0.5 rounded-lg ${
          isEnterpriseCol 
            ? 'bg-purple-100 text-purple-900 border border-purple-200' 
            : 'bg-slate-100 text-slate-800 border border-slate-200'
        }`}>
          {val}
        </span>
      </div>
    );
  };

  const renderMobileBadge = (val: boolean | string, isEnterprise: boolean = false) => {
    if (typeof val === 'boolean') {
      if (val) {
        return (
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold ${
            isEnterprise ? 'bg-purple-100 text-purple-800 border border-purple-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
          }`}>
            <Check className="w-3 h-3 stroke-[2.5]" /> Included
          </span>
        );
      }
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-400 border border-slate-200">
          <X className="w-3 h-3 stroke-[2]" /> Not in tier
        </span>
      );
    }

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold ${
        isEnterprise ? 'bg-purple-100 text-purple-800 border border-purple-200' : 'bg-amber-50 text-amber-900 border border-amber-200'
      }`}>
        <Check className="w-3 h-3 stroke-[2.5]" /> {val}
      </span>
    );
  };

  const displayedCategories = filterCategory === 'ALL' 
    ? categories 
    : categories.filter((c) => c.categoryName.toLowerCase().includes(filterCategory.toLowerCase()));

  const activePkgObj = packages.find((p) => p.id === mobileActivePackage) || packages[3];

  return (
    <section id="detailed-capabilities-matrix" className="space-y-6 pt-6">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold tracking-wide">
          <Layers className="w-3.5 h-3.5 text-amber-700" />
          ENTERPRISE BENCHMARK & SPECIFICATIONS
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
          Detailed Capabilities Matrix
        </h2>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
          Compare all 4 packages side-by-side to find the ideal operational fit for your restaurant floor.
        </p>
      </div>

      {/* Category Filter Pills (Desktop and Tablet) */}
      <div className="hidden sm:flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setFilterCategory('ALL')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            filterCategory === 'ALL'
              ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All Capabilities
        </button>
        {categories.map((c) => (
          <button
            key={c.categoryName}
            onClick={() => setFilterCategory(c.categoryName)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              filterCategory === c.categoryName
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {c.categoryName}
          </button>
        ))}
      </div>

      {/* ============================================================ */}
      {/* PHONE VIEW (Rearranged specifically for mobile phone screens) */}
      {/* ============================================================ */}
      <div className="block md:hidden space-y-4">
        {/* Mobile View Mode Switcher */}
        <div className="flex items-center justify-between p-1.5 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-bold">
          <button
            onClick={() => setMobileViewMode('package')}
            className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              mobileViewMode === 'package'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Package Explorer</span>
          </button>
          <button
            onClick={() => setMobileViewMode('sideBySide')}
            className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              mobileViewMode === 'sideBySide'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Columns3 className="w-3.5 h-3.5" />
            <span>Side-by-Side Cards</span>
          </button>
        </div>

        {/* PACKAGE EXPLORER MODE (PHONE) */}
        {mobileViewMode === 'package' && (
          <div className="space-y-4">
            {/* 4 Package Segmented Switcher for Phone */}
            <div className="grid grid-cols-2 gap-2">
              {packages.map((pkg) => {
                const isActive = mobileActivePackage === pkg.id;
                return (
                  <button
                    key={pkg.id}
                    onClick={() => setMobileActivePackage(pkg.id)}
                    className={`p-3 rounded-2xl border text-left transition-all relative ${
                      isActive
                        ? `${pkg.theme.border} ${pkg.theme.bg} ring-2 ring-amber-400/50 shadow-sm`
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {pkg.id === 'enterprise' && (
                      <span className="absolute -top-2 right-2 px-1.5 py-0.2 rounded bg-purple-600 text-white text-[9px] font-black uppercase shadow-xs">
                        Flagship
                      </span>
                    )}
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider block text-slate-500">
                      {pkg.badge}
                    </span>
                    <span className="text-sm font-black text-slate-900 block mt-0.5">
                      {pkg.name}
                    </span>
                    <div className="text-xs font-black text-amber-700 mt-1">
                      {pkg.price} <span className="text-[10px] text-slate-500 font-normal">({pkg.period})</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Package Banner with Quick CTA */}
            <div className={`p-4 rounded-2xl border ${activePkgObj.theme.border} ${activePkgObj.theme.bg} flex items-center justify-between gap-3 shadow-sm`}>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Currently Viewing:
                </span>
                <div className="text-base font-black text-slate-900">
                  {activePkgObj.name} ({activePkgObj.price})
                </div>
              </div>
              <button
                onClick={() => handleSelect(activePkgObj.id)}
                className={`py-2 px-3.5 rounded-xl font-black text-xs flex items-center gap-1.5 active:scale-95 transition-transform ${activePkgObj.theme.btn}`}
              >
                <Download className="w-3.5 h-3.5" />
                <span>Select Edition</span>
              </button>
            </div>

            {/* Categories & Features for the Active Package */}
            <div className="space-y-4">
              {categories.map((cat, cIdx) => (
                <div key={cIdx} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <cat.categoryIcon className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-black uppercase tracking-wide text-slate-800">
                      {cat.categoryName}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {cat.features.map((feat, fIdx) => {
                      const val = feat[mobileActivePackage];
                      const isIncluded = typeof val === 'boolean' ? val : true;

                      return (
                        <div
                          key={fIdx}
                          className={`p-3 rounded-xl border transition-all ${
                            feat.isEnterpriseHighlight && mobileActivePackage === 'enterprise'
                              ? 'bg-purple-50/70 border-purple-200'
                              : isIncluded
                              ? 'bg-slate-50/70 border-slate-200/80'
                              : 'bg-white border-slate-100 opacity-60'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              {feat.isEnterpriseHighlight && (
                                <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-purple-100 text-purple-900 border border-purple-200 mb-1">
                                  Enterprise Feature
                                </span>
                              )}
                              <div className="text-xs font-bold text-slate-900 leading-snug">
                                {feat.name}
                              </div>
                              <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                                {feat.description}
                              </p>
                            </div>
                          </div>

                          <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                            <span className="text-[10px] uppercase font-bold text-slate-400">
                              Status in {activePkgObj.name}:
                            </span>
                            {renderMobileBadge(val, mobileActivePackage === 'enterprise')}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SIDE-BY-SIDE MOBILE COMPARISON MODE (PHONE) */}
        {mobileViewMode === 'sideBySide' && (
          <div className="space-y-4">
            <div className="text-xs text-slate-500 px-1">
              Comparing all 4 packages across each floor capability:
            </div>

            {categories.map((cat, cIdx) => (
              <div key={cIdx} className="space-y-3">
                <div className="flex items-center gap-2 pt-2">
                  <cat.categoryIcon className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                    {cat.categoryName}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                    {cat.categoryBadge}
                  </span>
                </div>

                {cat.features.map((feat, fIdx) => (
                  <div
                    key={fIdx}
                    className={`p-4 rounded-2xl bg-white border ${
                      feat.isEnterpriseHighlight ? 'border-purple-300 shadow-purple-500/5' : 'border-slate-200'
                    } shadow-sm space-y-3`}
                  >
                    <div>
                      {feat.isEnterpriseHighlight && (
                        <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-purple-100 text-purple-900 border border-purple-200 mb-1">
                          Enterprise Flagship Capability
                        </span>
                      )}
                      <h4 className="text-xs font-black text-slate-900 leading-snug">
                        {feat.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                        {feat.description}
                      </p>
                    </div>

                    {/* 4-Tier Matrix Grid on Phone (2x2 Grid) */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {/* Trial */}
                      <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-center">
                        <span className="text-[10px] font-bold uppercase text-slate-500 block">
                          Trial (Free)
                        </span>
                        <div className="mt-1">
                          {renderMobileBadge(feat.trial, false)}
                        </div>
                      </div>

                      {/* Basic */}
                      <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-center">
                        <span className="text-[10px] font-bold uppercase text-slate-500 block">
                          Basic (₦10k)
                        </span>
                        <div className="mt-1">
                          {renderMobileBadge(feat.basic, false)}
                        </div>
                      </div>

                      {/* Standard */}
                      <div className="p-2 rounded-xl bg-emerald-50/70 border border-emerald-200 text-center">
                        <span className="text-[10px] font-bold uppercase text-emerald-800 block">
                          Standard (₦20k)
                        </span>
                        <div className="mt-1">
                          {renderMobileBadge(feat.standard, false)}
                        </div>
                      </div>

                      {/* Enterprise */}
                      <div className="p-2 rounded-xl bg-purple-50/70 border border-purple-200 text-center">
                        <span className="text-[10px] font-bold uppercase text-purple-800 block">
                          Enterprise (₦40k)
                        </span>
                        <div className="mt-1">
                          {renderMobileBadge(feat.enterprise, true)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* DESKTOP & TABLET VIEW (Side-by-Side 5-Column Pristine Table)   */}
      {/* ============================================================ */}
      <div className="hidden md:block rounded-3xl bg-white border border-slate-200 shadow-xl overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300">
          <table className="w-full text-left border-collapse min-w-[760px] lg:min-w-full">
            {/* Table Header: 4 Package Columns */}
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="p-4 sm:p-5 w-[32%] text-xs font-black uppercase tracking-wider text-slate-500">
                  Feature / Capability
                </th>
                {packages.map((pkg) => (
                  <th
                    key={pkg.id}
                    className={`p-4 sm:p-5 w-[17%] text-center border-l border-slate-200 ${pkg.theme.bg} relative`}
                  >
                    {pkg.id === 'enterprise' && (
                      <span className="absolute -top-0 right-4 px-2 py-0.5 rounded-b-md bg-purple-600 text-[9px] font-black uppercase text-white shadow-xs">
                        Flagship
                      </span>
                    )}
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider block text-slate-500">
                      {pkg.badge}
                    </span>
                    <span className={`text-base font-black block mt-0.5 ${pkg.theme.text}`}>
                      {pkg.name}
                    </span>
                    <div className="mt-1">
                      <span className="text-lg font-black text-slate-900">{pkg.price}</span>
                      <span className="text-[10px] text-slate-500 block -mt-0.5">{pkg.period}</span>
                    </div>

                    <button
                      onClick={() => handleSelect(pkg.id)}
                      className={`mt-3 w-full py-1.5 px-2.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1 active:scale-95 ${pkg.theme.btn}`}
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Select</span>
                    </button>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {displayedCategories.map((cat, cIdx) => (
                <React.Fragment key={cIdx}>
                  {/* Category Section Header Row */}
                  <tr className="bg-slate-100/90 border-y border-slate-200">
                    <td
                      colSpan={5}
                      className="py-3 px-4 sm:px-5 text-xs font-bold text-slate-800"
                    >
                      <div className="flex items-center gap-2">
                        <cat.categoryIcon className="w-4 h-4 text-amber-600" />
                        <span className="uppercase tracking-wider font-extrabold">{cat.categoryName}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                          {cat.categoryBadge}
                        </span>
                      </div>
                    </td>
                  </tr>

                  {/* Feature Rows */}
                  {cat.features.map((feat, fIdx) => (
                    <tr
                      key={fIdx}
                      className={`border-b border-slate-100 transition-colors ${
                        feat.isEnterpriseHighlight 
                          ? 'bg-purple-50/40 hover:bg-purple-50/70' 
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      {/* Feature Name & Description */}
                      <td className="p-3.5 sm:p-4 align-middle">
                        <div className="flex items-start gap-2">
                          {feat.isEnterpriseHighlight && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-purple-100 border border-purple-300 text-purple-900 shrink-0 mt-0.5">
                              Enterprise Add-on
                            </span>
                          )}
                          <div>
                            <div className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                              {feat.name}
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                              {feat.description}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Trial Cell */}
                      <td className="p-3.5 sm:p-4 text-center border-l border-slate-100 align-middle">
                        {renderCellContent(feat.trial)}
                      </td>

                      {/* Basic Cell */}
                      <td className="p-3.5 sm:p-4 text-center border-l border-slate-100 align-middle">
                        {renderCellContent(feat.basic)}
                      </td>

                      {/* Standard Cell */}
                      <td className="p-3.5 sm:p-4 text-center border-l border-slate-100 align-middle bg-emerald-50/30">
                        {renderCellContent(feat.standard)}
                      </td>

                      {/* Enterprise Cell */}
                      <td className="p-3.5 sm:p-4 text-center border-l border-slate-100 align-middle bg-purple-50/30 font-medium">
                        {renderCellContent(feat.enterprise, true)}
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Guidance Strip */}
        <div className="bg-slate-50 p-4 sm:p-5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <span>
              All versions include complete offline standalone SQLite architecture and offline thermal printing.
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono text-slate-500">
              Need custom multi-branch consultation?
            </span>
            <a
              href="https://wa.me/2348060395329?text=Hello%20Kaylix,%20I%20need%20assistance%20choosing%20the%20right%20software%20package."
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-amber-700 hover:text-amber-800 underline underline-offset-2 flex items-center gap-1"
            >
              Chat on WhatsApp <ArrowRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
