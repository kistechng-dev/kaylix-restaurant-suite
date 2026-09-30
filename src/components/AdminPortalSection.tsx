import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Search, 
  Filter, 
  Download, 
  Plus, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  KeyRound, 
  Building2, 
  CreditCard, 
  User, 
  Phone, 
  Mail, 
  ExternalLink, 
  Copy, 
  Check, 
  Trash2, 
  X,
  FileSpreadsheet,
  FileCode,
  ShieldCheck,
  Send,
  MessageSquare,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { AdminRecord } from '../types';
import { generateKaylixLicenseCode, VERSION_MAP, PERIOD_MAP } from '../utils/cryptoKey';

interface AdminPortalSectionProps {
  onShowToast: (type: 'success' | 'info' | 'error', title: string, message?: string) => void;
  onNavigateTab?: (tab: string) => void;
  adminToken?: string;
}

export const AdminPortalSection: React.FC<AdminPortalSectionProps> = ({
  onShowToast,
  onNavigateTab,
  adminToken,
}) => {
  const [records, setRecords] = useState<AdminRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedVersionFilter, setSelectedVersionFilter] = useState<string>('ALL');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');

  const effectiveToken = adminToken || (typeof localStorage !== 'undefined' ? localStorage.getItem('kaylix_admin_token') : null) || 'kyx_adm_master_2026_prod_session';

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [selectedRecordForDetail, setSelectedRecordForDetail] = useState<AdminRecord | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // New Record Form State
  const [newFullName, setNewFullName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRestaurant, setNewRestaurant] = useState('');
  const [newVersionCode, setNewVersionCode] = useState<'TRL' | 'BSC' | 'STD' | 'ENT' | 'MST'>('STD');
  const [newPeriodCode, setNewPeriodCode] = useState<'07D' | '30D' | '01Y' | '03Y' | 'LFT'>('01Y');
  const [newAmount, setNewAmount] = useState('₦20,000');
  const [newBank, setNewBank] = useState('Zenith Bank PLC (101 6978 239)');
  const [newRef, setNewRef] = useState(`KYX-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const [newNotes, setNewNotes] = useState('');

  // Fetch records from backend API
  const fetchRecords = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/records', {
        headers: {
          Authorization: `Bearer ${effectiveToken}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.records && Array.isArray(data.records)) {
          setRecords(data.records);
          localStorage.setItem('kaylix_admin_records_cache', JSON.stringify(data.records));
          setIsLoading(false);
          return;
        }
      }
    } catch {
      // offline or fallback to cache
    }

    // Fallback: Read from localStorage cache
    try {
      const cached = localStorage.getItem('kaylix_admin_records_cache');
      if (cached) {
        setRecords(JSON.parse(cached));
      } else {
        // Fallback seed
        const fallbackSeeds: AdminRecord[] = [
          {
            id: 'REC-20260927-101',
            type: 'REGISTRATION',
            fullName: 'Chief Emmanuel Okonkwo',
            phone: '+234 803 552 1904',
            email: 'e.okonkwo@kilimanjarogrill.ng',
            restaurantName: 'Kilimanjaro Grill House',
            cityBranch: 'Victoria Island, Lagos',
            version: 'Standard Version (Wi-Fi + Remote Director)',
            versionCode: 'STD',
            periodCode: '01Y',
            amount: '₦20,000',
            bankDetails: {
              bankName: 'Zenith Bank PLC',
              accountNumber: '101 6978 239',
              accountName: 'Kaylix Technology',
              paymentReference: 'KYX-2026-9281',
              transferDate: '2026-09-27T10:14:00.000Z',
            },
            licenseCode: 'STND-92K81-49C83-1Y-7C49',
            timestamp: '2026-09-27T10:14:32.000Z',
            status: 'VERIFIED',
            notes: '2 POS terminals and 1 Kitchen display commissioned.',
          },
          {
            id: 'REC-20260927-102',
            type: 'PAYMENT_SLIP',
            fullName: 'Mrs. Fatima Al-Hassan',
            phone: '+234 802 334 9912',
            email: 'fatima@arewafoodhub.com',
            restaurantName: 'Arewa Delicacies Express',
            cityBranch: 'Maitama, Abuja FCT',
            version: 'Enterprise Version (Omnichannel + Online Ordering)',
            versionCode: 'ENT',
            periodCode: '01Y',
            amount: '₦40,000',
            bankDetails: {
              bankName: 'Moniepoint Microfinance Bank',
              accountNumber: '808 9697 390',
              accountName: 'Alabi Kayode Felix',
              paymentReference: 'KYX-2026-4402',
              transferDate: '2026-09-27T11:42:00.000Z',
            },
            licenseCode: 'ENTR-B71K4-9D2F1-1Y-C83E',
            timestamp: '2026-09-27T11:45:10.000Z',
            status: 'VERIFIED',
            notes: 'Transfer verified via Moniepoint settlement slip. Sent to WhatsApp.',
          },
          {
            id: 'REC-20260927-103',
            type: 'REGISTRATION',
            fullName: 'Babatunde Balogun',
            phone: '+234 814 009 2311',
            email: 'tunde@citybites.ng',
            restaurantName: 'City Bites Quick Service',
            cityBranch: 'Ikeja City Mall, Lagos',
            version: '7-Day Trial Evaluation',
            versionCode: 'TRL',
            periodCode: '07D',
            amount: 'Free Trial',
            bankDetails: {
              bankName: 'N/A (Free Trial)',
              accountNumber: 'N/A',
              accountName: 'Kaylix Evaluation',
              paymentReference: 'TRL-EVAL-0927',
              transferDate: '2026-09-27T12:05:00.000Z',
            },
            licenseCode: 'TRAL-A91M5-82BC1-7D-KYLX',
            timestamp: '2026-09-27T12:05:44.000Z',
            status: 'DISPATCHED',
            notes: '7-Day evaluation period active. Telegram and WhatsApp copy transmitted.',
          },
          {
            id: 'REC-20260927-104',
            type: 'REGISTRATION',
            fullName: 'Dr. Chinedu Eze',
            phone: '+234 809 112 8844',
            email: 'chinedu@palmsdining.com',
            restaurantName: 'The Palms Bistro & Lounge',
            cityBranch: 'GRA Phase 2, Port Harcourt',
            version: 'Basic Version (Standalone Desktop)',
            versionCode: 'BSC',
            periodCode: '01Y',
            amount: '₦10,000',
            bankDetails: {
              bankName: 'Zenith Bank PLC',
              accountNumber: '101 6978 239',
              accountName: 'Kaylix Technology',
              paymentReference: 'KYX-2026-7819',
              transferDate: '2026-09-27T12:30:00.000Z',
            },
            licenseCode: 'BASC-4W8E9-7C491-1Y-8F2D',
            timestamp: '2026-09-27T12:31:02.000Z',
            status: 'PENDING',
            notes: 'Awaiting bank confirmation before terminal activation.',
          },
        ];
        setRecords(fallbackSeeds);
        localStorage.setItem('kaylix_admin_records_cache', JSON.stringify(fallbackSeeds));
      }
    } catch {
      // ignore
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // Re-generate or issue a license key for a record
  const handleGenerateKeyForRecord = async (record: AdminRecord) => {
    const newKey = generateKaylixLicenseCode({
      version: record.versionCode || 'STD',
      period: record.periodCode || '01Y',
    });

    try {
      const res = await fetch(`/api/records/${record.id}/generate-key`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${effectiveToken}`,
        },
        body: JSON.stringify({
          versionCode: record.versionCode,
          periodCode: record.periodCode,
        }),
      });

      if (res.ok) {
        fetchRecords();
        onShowToast('success', 'License Code Generated!', `New code: ${newKey}`);
        return;
      }
    } catch {
      // offline fallback
    }

    // Local state fallback update
    setRecords((prev) =>
      prev.map((r) =>
        r.id === record.id
          ? { ...r, licenseCode: newKey, status: 'VERIFIED' }
          : r
      )
    );
    onShowToast('success', 'License Code Generated (Local)!', `Code: ${newKey}`);
  };

  // Toggle or change status
  const handleUpdateStatus = async (record: AdminRecord, nextStatus: 'PENDING' | 'VERIFIED' | 'DISPATCHED') => {
    try {
      await fetch(`/api/records/${record.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${effectiveToken}`,
        },
        body: JSON.stringify({ status: nextStatus }),
      });
      fetchRecords();
    } catch {
      setRecords((prev) =>
        prev.map((r) => (r.id === record.id ? { ...r, status: nextStatus } : r))
      );
    }
    onShowToast('info', 'Status Updated', `${record.fullName} set to ${nextStatus}`);
  };

  // Delete Record
  const handleDeleteRecord = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete the record for ${name}?`)) {
      return;
    }

    try {
      await fetch(`/api/records/${id}`, { 
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${effectiveToken}`,
        },
      });
      fetchRecords();
    } catch {
      setRecords((prev) => prev.filter((r) => r.id !== id));
    }
    onShowToast('info', 'Record Deleted', `Record for ${name} removed from database.`);
  };

  // Create Manual Record
  const handleCreateRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName.trim() || !newPhone.trim() || !newEmail.trim()) {
      onShowToast('error', 'Incomplete Details', 'Please enter Full Name, Phone, and Email.');
      return;
    }

    const generatedKey = generateKaylixLicenseCode({
      version: newVersionCode,
      period: newPeriodCode,
    });

    const newRecordPayload: Partial<AdminRecord> = {
      fullName: newFullName.trim(),
      phone: newPhone.trim(),
      email: newEmail.trim(),
      restaurantName: newRestaurant.trim() || 'Restaurant Partner',
      version: VERSION_MAP[newVersionCode]?.name || 'Standard Version',
      versionCode: newVersionCode,
      periodCode: newPeriodCode,
      amount: newAmount,
      bankDetails: {
        bankName: newBank,
        accountNumber: newBank.includes('Moniepoint') ? '808 9697 390' : '101 6978 239',
        accountName: newBank.includes('Moniepoint') ? 'Alabi Kayode Felix' : 'Kaylix Technology',
        paymentReference: newRef,
        transferDate: new Date().toISOString(),
      },
      licenseCode: generatedKey,
      status: 'VERIFIED',
      notes: newNotes.trim() || 'Manual record created via Administrator Portal.',
    };

    try {
      const res = await fetch('/api/records', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${effectiveToken}`,
        },
        body: JSON.stringify(newRecordPayload),
      });
      if (res.ok) {
        fetchRecords();
        setIsAddModalOpen(false);
        onShowToast('success', 'Record Saved in Database!', `License Code: ${generatedKey}`);
        return;
      }
    } catch {
      // offline fallback
    }

    const createdRecord: AdminRecord = {
      id: `REC-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      type: 'REGISTRATION',
      fullName: newFullName.trim(),
      phone: newPhone.trim(),
      email: newEmail.trim(),
      restaurantName: newRestaurant.trim() || 'Restaurant Partner',
      version: VERSION_MAP[newVersionCode]?.name || 'Standard Version',
      versionCode: newVersionCode,
      periodCode: newPeriodCode,
      amount: newAmount,
      bankDetails: {
        bankName: newBank,
        accountNumber: newBank.includes('Moniepoint') ? '808 9697 390' : '101 6978 239',
        accountName: newBank.includes('Moniepoint') ? 'Alabi Kayode Felix' : 'Kaylix Technology',
        paymentReference: newRef,
        transferDate: new Date().toISOString(),
      },
      licenseCode: generatedKey,
      timestamp: new Date().toISOString(),
      status: 'VERIFIED',
      notes: newNotes.trim() || 'Manual record created via Administrator Portal.',
    };

    setRecords((prev) => [createdRecord, ...prev]);
    setIsAddModalOpen(false);
    onShowToast('success', 'Record Saved in Local Database!', `License Code: ${generatedKey}`);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(text);
    onShowToast('success', 'Copied!', `${label} copied to clipboard.`);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (records.length === 0) {
      onShowToast('info', 'No Records', 'There are no records to export.');
      return;
    }

    const headers = [
      'Record ID',
      'Type',
      'Full Name',
      'Phone',
      'Email',
      'Restaurant Name',
      'Version',
      'Version Code',
      'Period Code',
      'Amount',
      'Bank Name',
      'Account Number',
      'Payment Reference',
      'License Code (aaabbb-xxxx-7C49-C83E)',
      'Status',
      'Timestamp',
      'Notes'
    ];

    const rows = records.map((r) => [
      `"${r.id}"`,
      `"${r.type}"`,
      `"${r.fullName}"`,
      `"${r.phone}"`,
      `"${r.email}"`,
      `"${r.restaurantName || ''}"`,
      `"${r.version}"`,
      `"${r.versionCode}"`,
      `"${r.periodCode}"`,
      `"${r.amount}"`,
      `"${r.bankDetails?.bankName || ''}"`,
      `"${r.bankDetails?.accountNumber || ''}"`,
      `"${r.bankDetails?.paymentReference || ''}"`,
      `"${r.licenseCode}"`,
      `"${r.status}"`,
      `"${r.timestamp}"`,
      `"${r.notes || ''}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Kaylix_Database_Export_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    onShowToast('success', 'CSV Export Complete', 'Database spreadsheet downloaded.');
  };

  // Filter records
  const filteredRecords = records.filter((r) => {
    const s = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      r.fullName?.toLowerCase().includes(s) ||
      r.phone?.toLowerCase().includes(s) ||
      r.email?.toLowerCase().includes(s) ||
      r.restaurantName?.toLowerCase().includes(s) ||
      r.licenseCode?.toLowerCase().includes(s) ||
      r.bankDetails?.paymentReference?.toLowerCase().includes(s) ||
      r.bankDetails?.bankName?.toLowerCase().includes(s);

    const matchesVersion = selectedVersionFilter === 'ALL' || r.versionCode === selectedVersionFilter;
    const matchesType = selectedTypeFilter === 'ALL' || r.type === selectedTypeFilter;
    const matchesStatus = selectedStatusFilter === 'ALL' || r.status === selectedStatusFilter;

    return matchesSearch && matchesVersion && matchesType && matchesStatus;
  });

  // Calculate Metrics
  const totalSubmissions = records.length;
  const verifiedCount = records.filter((r) => r.status === 'VERIFIED').length;
  const pendingCount = records.filter((r) => r.status === 'PENDING').length;
  const trialCount = records.filter((r) => r.versionCode === 'TRL').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
              <Database className="w-3.5 h-3.5" />
              Backend Admin Portal & Persistent Database
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Submitted Forms & License Master Ledger
            </h2>
            <p className="text-slate-300 text-sm max-w-3xl">
              Centralized record-keeping database storing every client submission: visitor details, software version applied or bought, bank account details, timestamp, amount paid, and verified license keys formatted in <code className="text-amber-300 font-mono font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">aaabbb-xxxx-7C49-C83E</code>.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={fetchRecords}
              className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Refresh database records"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-amber-400' : ''}`} />
              <span>Sync DB</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-lg shadow-orange-950/40 transition-transform active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add Record</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-slate-400">Total Submissions</div>
            <div className="text-2xl font-black text-white mt-1">{totalSubmissions}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Forms recorded in database</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Database className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-slate-400">Verified & Paid</div>
            <div className="text-2xl font-black text-emerald-400 mt-1">{verifiedCount}</div>
            <div className="text-[11px] text-emerald-400/80 mt-0.5">Settlements validated</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-slate-400">Pending Verification</div>
            <div className="text-2xl font-black text-amber-400 mt-1">{pendingCount}</div>
            <div className="text-[11px] text-amber-400/80 mt-0.5">Awaiting bank check</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-slate-400">Trial Registrations</div>
            <div className="text-2xl font-black text-purple-400 mt-1">{trialCount}</div>
            <div className="text-[11px] text-purple-400/80 mt-0.5">7-Day evaluation passes</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <KeyRound className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-4 sm:p-5 shadow-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, phone, email, reference, license code, bank..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Version Filter */}
          <select
            value={selectedVersionFilter}
            onChange={(e) => setSelectedVersionFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-medium"
          >
            <option value="ALL">All Versions</option>
            <option value="TRL">Trial Version (TRL)</option>
            <option value="BSC">Basic Version (BSC)</option>
            <option value="STD">Standard Version (STD)</option>
            <option value="ENT">Enterprise Version (ENT)</option>
            <option value="MST">Master Suite (MST)</option>
          </select>

          {/* Type Filter */}
          <select
            value={selectedTypeFilter}
            onChange={(e) => setSelectedTypeFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-medium"
          >
            <option value="ALL">All Form Types</option>
            <option value="REGISTRATION">Sign-up Registrations</option>
            <option value="PAYMENT_SLIP">Payment Slip Submissions</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-medium"
          >
            <option value="ALL">All Statuses</option>
            <option value="VERIFIED">Verified / Settled</option>
            <option value="PENDING">Pending Verification</option>
            <option value="DISPATCHED">Dispatched</option>
          </select>
        </div>
      </div>

      {/* Database Records Table */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Database Records ({filteredRecords.length})</h3>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            Key Format: <strong className="text-amber-300">aaabbb-xxxx-7C49-C83E</strong>
          </span>
        </div>

        {filteredRecords.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <Database className="w-12 h-12 mx-auto text-slate-600 opacity-60" />
            <div className="text-sm font-semibold text-slate-300">No matching database records found</div>
            <p className="text-xs max-w-sm mx-auto text-slate-500">
              Try adjusting your search terms or filters, or add a manual record using the button above.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-mono uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-4">Timestamp & Type</th>
                  <th className="py-3 px-4">Visitor / Restaurant Details</th>
                  <th className="py-3 px-4">Version Applied / Bought</th>
                  <th className="py-3 px-4">Bank Details & Ref</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">License Code (aaabbb-xxxx-7C49-C83E)</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {filteredRecords.map((record) => {
                  const isTrial = record.versionCode === 'TRL' || record.version?.toLowerCase().includes('trial');
                  const cleanPhone = record.phone.replace(/[^0-9]/g, '');

                  return (
                    <tr 
                      key={record.id}
                      className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                      onClick={() => setSelectedRecordForDetail(record)}
                    >
                      {/* Timestamp & Type */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-mono text-slate-300 text-[11px]">
                          {new Date(record.timestamp).toLocaleDateString()}{' '}
                          <span className="text-slate-500 text-[10px]">
                            {new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase ${
                          record.type === 'PAYMENT_SLIP'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        }`}>
                          {record.type === 'PAYMENT_SLIP' ? 'Payment Slip' : 'Registration'}
                        </span>
                      </td>

                      {/* Visitor Details */}
                      <td className="py-3.5 px-4 max-w-[200px]">
                        <div className="font-bold text-white truncate">{record.fullName}</div>
                        {record.restaurantName && (
                          <div className="text-[11px] text-amber-400 truncate">{record.restaurantName}</div>
                        )}
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                          <a
                            href={`https://wa.me/${cleanPhone}`}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="hover:text-emerald-400 flex items-center gap-1 font-mono"
                            title="Message on WhatsApp"
                          >
                            <Phone className="w-3 h-3 text-emerald-400" />
                            {record.phone}
                          </a>
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">{record.email}</div>
                      </td>

                      {/* Version Applied / Bought */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                            record.versionCode === 'TRL'
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                              : record.versionCode === 'BSC'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : record.versionCode === 'STD'
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              : record.versionCode === 'ENT'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                          }`}>
                            {record.versionCode}
                          </span>
                          <span className="font-semibold text-slate-200 truncate">{record.version}</span>
                        </div>
                        <div className="text-[10px] font-mono text-slate-400 mt-1">
                          Period: {record.periodCode} ({PERIOD_MAP[record.periodCode]?.label || 'Annual'})
                        </div>
                      </td>

                      {/* Bank Details & Ref */}
                      <td className="py-3.5 px-4 max-w-[200px]">
                        <div className="text-slate-300 font-medium truncate">
                          {record.bankDetails?.bankName || 'Direct'}
                        </div>
                        {record.bankDetails?.accountNumber && record.bankDetails.accountNumber !== 'N/A' && (
                          <div className="text-[11px] font-mono text-slate-400">
                            Acc: {record.bankDetails.accountNumber}
                          </div>
                        )}
                        <div className="text-[11px] font-mono text-emerald-400 font-semibold mt-0.5">
                          Ref: {record.bankDetails?.paymentReference}
                        </div>
                      </td>

                      {/* Amount Paid */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-mono font-bold text-amber-400 text-sm">
                          {record.amount}
                        </span>
                      </td>

                      {/* License Code in format aaabbb-xxxx-7C49-C83E */}
                      <td className="py-3.5 px-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1.5">
                          <code className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono text-xs font-bold tracking-wider">
                            {record.licenseCode}
                          </code>
                          <button
                            onClick={() => copyToClipboard(record.licenseCode, 'License Key')}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                            title="Copy License Code"
                          >
                            {copiedKey === record.licenseCode ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono mt-1">
                          Format: aaabbb-xxxx-7C49-C83E
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => {
                            const next = record.status === 'VERIFIED' ? 'PENDING' : 'VERIFIED';
                            handleUpdateStatus(record, next);
                          }}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border transition-colors ${
                            record.status === 'VERIFIED'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : record.status === 'DISPATCHED'
                              ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                              : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          }`}
                          title="Click to toggle status"
                        >
                          ● {record.status}
                        </button>
                      </td>

                      {/* Action buttons */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleGenerateKeyForRecord(record)}
                            className="p-1.5 rounded-lg bg-purple-950/60 hover:bg-purple-900 border border-purple-500/40 text-purple-300 transition-colors"
                            title="Re-generate license key in aaabbb-xxxx-7C49-C83E format"
                          >
                            <KeyRound className="w-3.5 h-3.5" />
                          </button>

                          <a
                            href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                              `Hello ${record.fullName}, regarding your Kaylix CanteenPro ${record.version} order (Ref: ${record.bankDetails?.paymentReference}). Your official license key is: ${record.licenseCode}`
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 transition-colors"
                            title="Send Key to WhatsApp"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </a>

                          <button
                            onClick={() => handleDeleteRecord(record.id, record.fullName)}
                            className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 text-rose-300 transition-colors"
                            title="Delete Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal for Selected Record */}
      {selectedRecordForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-6 space-y-5 text-slate-100 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-amber-400">
                  {selectedRecordForDetail.id}
                </span>
                <h3 className="text-xl font-black text-white mt-1">
                  {selectedRecordForDetail.fullName}
                </h3>
                <div className="text-xs text-slate-400">{selectedRecordForDetail.restaurantName || 'Eatery Partner'}</div>
              </div>
              <button
                onClick={() => setSelectedRecordForDetail(null)}
                className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* License Code Highlight Box */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/40 space-y-2">
                <div className="text-[10px] uppercase font-mono font-bold text-amber-400 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5" />
                  Assigned License Master Key (aaabbb-xxxx-7C49-C83E)
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className="font-mono text-base sm:text-lg font-black text-white tracking-widest break-all">
                    {selectedRecordForDetail.licenseCode}
                  </div>
                  <button
                    onClick={() => copyToClipboard(selectedRecordForDetail.licenseCode, 'License Key')}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1 shrink-0"
                  >
                    {copiedKey === selectedRecordForDetail.licenseCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === selectedRecordForDetail.licenseCode ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="text-[11px] text-slate-400">
                  Version: <strong className="text-slate-200">{selectedRecordForDetail.versionCode}</strong> • Period: <strong className="text-slate-200">{selectedRecordForDetail.periodCode}</strong> • Signature: <strong className="text-purple-300 font-mono">7C49-C83E</strong>
                </div>
              </div>

              {/* Grid Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                <div>
                  <div className="text-slate-500">Contact Phone</div>
                  <div className="font-semibold text-white font-mono">{selectedRecordForDetail.phone}</div>
                </div>
                <div>
                  <div className="text-slate-500">Email Address</div>
                  <div className="font-semibold text-white">{selectedRecordForDetail.email}</div>
                </div>
                <div>
                  <div className="text-slate-500">Version Applied / Bought</div>
                  <div className="font-semibold text-amber-400">{selectedRecordForDetail.version}</div>
                </div>
                <div>
                  <div className="text-slate-500">Amount Paid</div>
                  <div className="font-bold text-emerald-400 font-mono text-sm">{selectedRecordForDetail.amount}</div>
                </div>
                <div>
                  <div className="text-slate-500">Payment Reference</div>
                  <div className="font-mono text-white font-semibold">{selectedRecordForDetail.bankDetails?.paymentReference}</div>
                </div>
                <div>
                  <div className="text-slate-500">Bank Transferred To</div>
                  <div className="font-semibold text-white">{selectedRecordForDetail.bankDetails?.bankName}</div>
                </div>
                <div>
                  <div className="text-slate-500">Timestamp</div>
                  <div className="font-mono text-slate-300">{new Date(selectedRecordForDetail.timestamp).toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-slate-500">Current Status</div>
                  <div className="font-bold text-emerald-400 font-mono">{selectedRecordForDetail.status}</div>
                </div>
              </div>

              {selectedRecordForDetail.notes && (
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
                  <div className="text-slate-500 font-medium mb-1">Operational Notes:</div>
                  <p>{selectedRecordForDetail.notes}</p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
              <button
                onClick={() => handleGenerateKeyForRecord(selectedRecordForDetail)}
                className="py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <KeyRound className="w-4 h-4" />
                <span>Reissue Key (aaabbb-xxxx-7C49-C83E)</span>
              </button>

              <button
                onClick={() => setSelectedRecordForDetail(null)}
                className="py-2.5 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Add Record Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden text-slate-100 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold">
                  <Plus className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Manual Record Insertion</h3>
                  <p className="text-xs text-slate-400">Add a client and synthesize their aaabbb-xxxx-7C49-C83E key</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRecord} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Full Names *</label>
                <input
                  type="text"
                  required
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  placeholder="e.g. Alabi Kayode Felix"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+234 806 039 5329"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="client@eatery.ng"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Restaurant / Brand Name</label>
                <input
                  type="text"
                  value={newRestaurant}
                  onChange={(e) => setNewRestaurant(e.target.value)}
                  placeholder="e.g. Mama Cass Deluxe Kitchen"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Version & Period Setup */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Version (aaa)</label>
                  <select
                    value={newVersionCode}
                    onChange={(e) => {
                      const v = e.target.value as any;
                      setNewVersionCode(v);
                      if (v === 'TRL') {
                        setNewAmount('Free Trial');
                        setNewPeriodCode('07D');
                      } else if (v === 'BSC') setNewAmount('₦10,000');
                      else if (v === 'STD') setNewAmount('₦20,000');
                      else if (v === 'ENT') setNewAmount('₦40,000');
                      else if (v === 'MST') setNewAmount('₦110,000');
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="TRL">Trial Version (TRL)</option>
                    <option value="BSC">Basic Version (BSC) - ₦10,000</option>
                    <option value="STD">Standard Version (STD) - ₦20,000</option>
                    <option value="ENT">Enterprise Version (ENT) - ₦40,000</option>
                    <option value="MST">Master Suite (MST) - ₦110,000</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Period (bbb)</label>
                  <select
                    value={newPeriodCode}
                    onChange={(e) => setNewPeriodCode(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="07D">7 Days (07D)</option>
                    <option value="30D">30 Days (30D)</option>
                    <option value="01Y">1 Year (01Y)</option>
                    <option value="03Y">3 Years (03Y)</option>
                    <option value="LFT">Lifetime (LFT)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Amount Paid</label>
                  <input
                    type="text"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono text-amber-400 font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Payment Reference</label>
                  <input
                    type="text"
                    value={newRef}
                    onChange={(e) => setNewRef(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Bank Destination</label>
                <select
                  value={newBank}
                  onChange={(e) => setNewBank(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Zenith Bank PLC (101 6978 239)">Zenith Bank PLC (101 6978 239 - Kaylix Technology)</option>
                  <option value="Moniepoint Microfinance Bank (808 9697 390)">Moniepoint (808 9697 390 - Alabi Kayode Felix)</option>
                  <option value="Cash / Cheque Direct">Cash / Cheque Direct</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Notes</label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Optional operational or terminal details..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="py-2.5 px-4 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold shadow-md shadow-orange-950/40"
                >
                  Save Record & Issue Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
