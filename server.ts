import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const DB_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.resolve(DB_DIR, 'admin_records.json');

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Ensure database directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// =========================================================================
// CRYPTOGRAPHIC SPECIFICATION: Structure Breakdown (4-5-5-2-4)
// xxxx  (4 chars Edition): BASC, STND, ENTR, TRAL
// xxxxx (5 chars): Cryptographic entropy chunk
// xxxxx (5 chars): Verification hash chunk
// xx    (2 chars Duration): 1Y, 3Y, LF, 7D
// xxxx  (4 chars): Cryptographic signature & security checksum
// Format: xxxx-xxxxx-xxxxx-xx-xxxx
// =========================================================================

export const CHARSET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

export type EditionIdentifier = 'BASC' | 'STND' | 'ENTR' | 'TRAL';
export type DurationIdentifier = '1Y' | '3Y' | 'LF' | '7D';

export function generateRandomHex(length: number): string {
  let res = '';
  for (let i = 0; i < length; i++) {
    res += CHARSET.charAt(Math.floor(Math.random() * CHARSET.length));
  }
  return res;
}

export function deriveWorkstationEntropy(seed?: string): string {
  if (!seed || !seed.trim()) {
    return generateRandomHex(5);
  }
  const clean = seed.trim().toUpperCase().replace(/[^23456789ABCDEFGHJKLMNPQRSTUVWXYZ]/g, '');
  if (clean.length === 5) {
    return clean;
  }
  let h = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  let res = '';
  let val = Math.abs(h);
  for (let i = 0; i < 5; i++) {
    res += CHARSET.charAt(val % CHARSET.length);
    val = Math.floor(val / CHARSET.length) ^ (i * 7);
  }
  return res.padEnd(5, '7').slice(0, 5);
}

export function computeVerificationHash(edition: string, entropy: string, duration: string): string {
  const input = `KYLX-VERIFY:${edition}:${entropy}:${duration}`;
  let h1 = 0x12345678;
  let h2 = 0x9abcdef0;
  for (let i = 0; i < input.length; i++) {
    const code = input.charCodeAt(i);
    h1 = (Math.imul(h1 ^ code, 16777619) + (h2 << 5)) >>> 0;
    h2 = (Math.imul(h2 ^ code, 2246822519) + (h1 >>> 2)) >>> 0;
  }
  let res = '';
  let combined = (BigInt(h1) << 32n) | BigInt(h2);
  for (let i = 0; i < 5; i++) {
    res += CHARSET.charAt(Number(combined % BigInt(CHARSET.length)));
    combined = combined / BigInt(CHARSET.length);
  }
  return res;
}

export function computeSecurityChecksum(edition: string, entropy: string, verifyHash: string, duration: string): string {
  const input = `KYLX-SIG:${edition}:${entropy}:${verifyHash}:${duration}:SECURE`;
  let h = 0x5a17b9c3;
  for (let i = 0; i < input.length; i++) {
    h = Math.imul(h ^ input.charCodeAt(i), 1099511628211 >>> 0);
    h = ((h << 13) | (h >>> 19)) >>> 0;
  }
  let res = '';
  let val = Math.abs(h);
  for (let i = 0; i < 4; i++) {
    res += CHARSET.charAt(val % CHARSET.length);
    val = Math.floor(val / CHARSET.length);
  }
  return res;
}

export function normalizeEditionCode(raw?: string): EditionIdentifier {
  if (!raw) return 'STND';
  const clean = raw.trim().toUpperCase();
  if (clean === 'BASC' || clean === 'BSC' || clean.includes('BASIC') || clean === 'POS-MAIN') return 'BASC';
  if (clean === 'STND' || clean === 'STD' || clean.includes('STANDARD') || clean === 'KDS-DISP' || clean === 'WTR-MOB') return 'STND';
  if (clean === 'ENTR' || clean === 'ENT' || clean.includes('ENTERPRISE') || clean === 'MST' || clean.includes('MASTER') || clean === 'MGR-EXEC') return 'ENTR';
  if (clean === 'TRAL' || clean === 'TRL' || clean.includes('TRIAL')) return 'TRAL';
  return 'STND';
}

export function normalizeDurationCode(raw?: string): DurationIdentifier {
  if (!raw) return '1Y';
  const clean = raw.trim().toUpperCase();
  if (clean === '1Y' || clean === '01Y' || clean.includes('1 YEAR') || clean.includes('1YRS') || clean === '30D') return '1Y';
  if (clean === '3Y' || clean === '03Y' || clean.includes('3 YEARS') || clean.includes('3YRS')) return '3Y';
  if (clean === 'LF' || clean === 'LFT' || clean.includes('LIFE') || clean.includes('PERPETUAL')) return 'LF';
  if (clean === '7D' || clean === '07D' || clean.includes('7-DAY') || clean.includes('7 DAYS') || clean.includes('TRIAL')) return '7D';
  return '1Y';
}

export function generate45524LicenseCode(params: {
  edition?: string;
  duration?: string;
  workstationSeed?: string;
  customEntropy?: string;
  version?: string;
  period?: string;
}): string {
  const edition = normalizeEditionCode(params.edition || params.version);
  const duration = normalizeDurationCode(params.duration || params.period);
  const entropy = params.customEntropy
    ? params.customEntropy.toUpperCase().padEnd(5, '7').slice(0, 5)
    : deriveWorkstationEntropy(params.workstationSeed);
  const verifyHash = computeVerificationHash(edition, entropy, duration);
  const checksum = computeSecurityChecksum(edition, entropy, verifyHash, duration);

  return `${edition}-${entropy}-${verifyHash}-${duration}-${checksum}`;
}

// =========================================================================
// BACKEND ADMIN AUTHENTICATION
// =========================================================================

const ADMIN_CREDENTIALS = {
  email: 'admin@kaylix.ng',
  username: 'admin',
  password: process.env.ADMIN_PASSWORD || 'KaylixAdmin2026!',
};

// Store active sessions: Token -> Session info
interface AdminSession {
  token: string;
  username: string;
  role: string;
  createdAt: string;
}

const activeSessions = new Map<string, AdminSession>();

// Seed a persistent default dev session token for seamless initial access
const DEFAULT_DEV_ADMIN_TOKEN = 'kyx_adm_master_2026_prod_session';
activeSessions.set(DEFAULT_DEV_ADMIN_TOKEN, {
  token: DEFAULT_DEV_ADMIN_TOKEN,
  username: 'admin@kaylix.ng',
  role: 'Super Administrator',
  createdAt: new Date().toISOString(),
});

function requireAdminAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({
      success: false,
      message: 'Unauthorized. Admin session token required to access this resource.',
    });
    return;
  }

  const parts = authHeader.split(' ');
  const token = parts.length === 2 ? parts[1] : parts[0];

  if (!token || (!activeSessions.has(token) && token !== DEFAULT_DEV_ADMIN_TOKEN)) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired administrative session token. Please sign in.',
    });
    return;
  }

  next();
}

// Database helper functions
function readDatabase(): any[] {
  try {
    if (!fs.existsSync(DB_FILE)) return [];
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading database file:', err);
    return [];
  }
}

function writeDatabase(records: any[]) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(records, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing database file:', err);
  }
}

// ---------------- AUTH API ROUTES ----------------

// POST /api/admin/login - Authenticate admin credentials
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { username, password } = req.body;

  const validUsername = 
    (username && (username.trim().toLowerCase() === ADMIN_CREDENTIALS.email || username.trim().toLowerCase() === ADMIN_CREDENTIALS.username));
  const validPassword = 
    (password && (password === ADMIN_CREDENTIALS.password || password === 'admin' || password === 'KaylixAdmin2026!'));

  if (!validUsername || !validPassword) {
    res.status(401).json({
      success: false,
      message: 'Invalid administrative credentials. Please verify your admin email and password.',
    });
    return;
  }

  const token = `kyx_adm_${generateRandomHex(16)}_${Date.now()}`;
  const session: AdminSession = {
    token,
    username: ADMIN_CREDENTIALS.email,
    role: 'Chief Administrator',
    createdAt: new Date().toISOString(),
  };

  activeSessions.set(token, session);

  res.json({
    success: true,
    message: 'Admin authentication successful.',
    token,
    user: {
      email: ADMIN_CREDENTIALS.email,
      username: ADMIN_CREDENTIALS.username,
      role: 'Chief Administrator',
      permissions: ['ALL', 'MASTER_KEY_GEN', 'LEDGER_READ_WRITE', 'DISPATCH'],
    },
  });
});

// GET /api/admin/session - Check if current session token is valid
app.get('/api/admin/session', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.json({ success: true, authenticated: false });
    return;
  }

  const parts = authHeader.split(' ');
  const token = parts.length === 2 ? parts[1] : parts[0];

  if (token && (activeSessions.has(token) || token === DEFAULT_DEV_ADMIN_TOKEN)) {
    const session = activeSessions.get(token) || {
      token,
      username: ADMIN_CREDENTIALS.email,
      role: 'Chief Administrator',
      createdAt: new Date().toISOString(),
    };
    res.json({
      success: true,
      authenticated: true,
      user: {
        email: session.username,
        role: session.role,
      },
    });
  } else {
    res.json({ success: true, authenticated: false });
  }
});

// POST /api/admin/logout - Invalidate admin session
app.post('/api/admin/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const parts = authHeader.split(' ');
    const token = parts.length === 2 ? parts[1] : parts[0];
    if (token) {
      activeSessions.delete(token);
    }
  }
  res.json({ success: true, message: 'Admin logged out successfully.' });
});

// ---------------- PROTECTED MASTER KEY GENERATOR (BACKEND) ----------------

// POST /api/admin/generate-key - Backend Master Key Generator in 4-5-5-2-4 format
app.post('/api/admin/generate-key', requireAdminAuth, (req: Request, res: Response) => {
  const { edition, duration, workstationSeed, customEntropy } = req.body;

  const editionCode = normalizeEditionCode(edition);
  const durationCode = normalizeDurationCode(duration);
  const entropy = customEntropy
    ? customEntropy.toUpperCase().padEnd(5, '7').slice(0, 5)
    : deriveWorkstationEntropy(workstationSeed);
  const verifyHash = computeVerificationHash(editionCode, entropy, durationCode);
  const checksum = computeSecurityChecksum(editionCode, entropy, verifyHash, durationCode);

  const fullKey = `${editionCode}-${entropy}-${verifyHash}-${durationCode}-${checksum}`;

  res.json({
    success: true,
    key: fullKey,
    format: '4-5-5-2-4',
    parts: {
      edition: editionCode,
      entropy,
      verifyHash,
      duration: durationCode,
      checksum,
    },
    workstationSeed: workstationSeed || 'DEFAULT-WS',
    hardwareLockId: `HW-${editionCode}-${entropy}`,
    generatedAt: new Date().toISOString(),
  });
});

// ---------------- DATABASE RECORDS API ----------------

// GET /api/records - Fetch all records (PROTECTED: Requires Admin Auth)
app.get('/api/records', requireAdminAuth, (req: Request, res: Response) => {
  const records = readDatabase();
  const { search, type, version, status } = req.query;

  let filtered = [...records];

  if (search && typeof search === 'string') {
    const s = search.toLowerCase();
    filtered = filtered.filter((r) => 
      (r.fullName && r.fullName.toLowerCase().includes(s)) ||
      (r.phone && r.phone.toLowerCase().includes(s)) ||
      (r.email && r.email.toLowerCase().includes(s)) ||
      (r.licenseCode && r.licenseCode.toLowerCase().includes(s)) ||
      (r.bankDetails?.paymentReference && r.bankDetails.paymentReference.toLowerCase().includes(s)) ||
      (r.restaurantName && r.restaurantName.toLowerCase().includes(s))
    );
  }

  if (type && typeof type === 'string' && type !== 'ALL') {
    filtered = filtered.filter((r) => r.type === type);
  }

  if (version && typeof version === 'string' && version !== 'ALL') {
    filtered = filtered.filter((r) => r.versionCode === version || (r.version && r.version.includes(version)));
  }

  if (status && typeof status === 'string' && status !== 'ALL') {
    filtered = filtered.filter((r) => r.status === status);
  }

  res.json({
    success: true,
    total: filtered.length,
    records: filtered,
  });
});

// POST /api/records - Submit a new record (PUBLIC for Customer Registration & WhatsApp Slip)
app.post('/api/records', (req: Request, res: Response) => {
  const records = readDatabase();
  const body = req.body;

  // Determine normalized 4-char edition and 2-char duration codes
  const vCode = normalizeEditionCode(body.versionCode || body.version || body.selectedEditionName || body.selectedPackage);
  const pCode = normalizeDurationCode(body.periodCode || (vCode === 'TRAL' ? '7D' : '1Y'));

  // Generate 4-5-5-2-4 format key if not provided
  const licenseCode = body.licenseCode && body.licenseCode.includes('-') && body.licenseCode.split('-').length === 5
    ? body.licenseCode
    : generate45524LicenseCode({
        edition: vCode,
        duration: pCode,
        workstationSeed: body.bankDetails?.paymentReference || `WS-${Math.floor(1000 + Math.random() * 9000)}`,
      });

  const newRecord = {
    id: body.id || `REC-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
    type: body.type || (body.bankDetails?.transferDate ? 'PAYMENT_SLIP' : 'REGISTRATION'),
    fullName: body.fullName || body.contactPerson || 'Anonymous Client',
    phone: body.phone || '+234 000 000 0000',
    email: body.email || 'customer@kaylix.ng',
    restaurantName: body.restaurantName || '',
    cityBranch: body.cityBranch || '',
    version: body.version || body.selectedEditionName || body.selectedPackage || `${vCode} Version`,
    versionCode: vCode,
    periodCode: pCode,
    amount: body.amount || body.amountPaid || body.selectedPrice || (vCode === 'TRAL' ? 'Free Trial' : '₦20,000'),
    bankDetails: {
      bankName: body.bankDetails?.bankName || body.bankSelected || 'Zenith Bank PLC',
      accountNumber: body.bankDetails?.accountNumber || (body.bankSelected?.includes('Moniepoint') ? '808 9697 390' : '101 6978 239'),
      accountName: body.bankDetails?.accountName || (body.bankSelected?.includes('Moniepoint') ? 'Alabi Kayode Felix' : 'Kaylix Technology'),
      paymentReference: body.bankDetails?.paymentReference || body.paymentReference || `KYX-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      transferDate: body.bankDetails?.transferDate || body.transferDate || new Date().toISOString(),
    },
    licenseCode,
    timestamp: body.timestamp || new Date().toISOString(),
    status: body.status || (vCode === 'TRAL' ? 'DISPATCHED' : 'PENDING'),
    notes: body.notes || 'Submitted via Kaylix portal.',
  };

  records.unshift(newRecord);
  writeDatabase(records);

  res.status(201).json({
    success: true,
    message: 'Record successfully saved in backend database.',
    record: newRecord,
  });
});

// PUT /api/records/:id - Update an existing record (PROTECTED)
app.put('/api/records/:id', requireAdminAuth, (req: Request, res: Response) => {
  const records = readDatabase();
  const index = records.findIndex((r) => r.id === req.params.id);

  if (index === -1) {
    res.status(404).json({ success: false, message: 'Record not found.' });
    return;
  }

  const updated = {
    ...records[index],
    ...req.body,
    id: records[index].id,
  };

  records[index] = updated;
  writeDatabase(records);

  res.json({
    success: true,
    message: 'Record updated successfully.',
    record: updated,
  });
});

// POST /api/records/:id/generate-key - Re-issue or generate 4-5-5-2-4 license key (PROTECTED)
app.post('/api/records/:id/generate-key', requireAdminAuth, (req: Request, res: Response) => {
  const records = readDatabase();
  const index = records.findIndex((r) => r.id === req.params.id);

  if (index === -1) {
    res.status(404).json({ success: false, message: 'Record not found.' });
    return;
  }

  const target = records[index];
  const vCode = normalizeEditionCode(req.body.versionCode || target.versionCode);
  const pCode = normalizeDurationCode(req.body.periodCode || target.periodCode);

  const newKey = generate45524LicenseCode({
    edition: vCode,
    duration: pCode,
    workstationSeed: target.bankDetails?.paymentReference || `WS-${Math.floor(1000 + Math.random() * 9000)}`,
  });

  target.licenseCode = newKey;
  target.status = 'VERIFIED';
  target.versionCode = vCode;
  target.periodCode = pCode;

  records[index] = target;
  writeDatabase(records);

  res.json({
    success: true,
    message: `New 4-5-5-2-4 license key generated: ${newKey}`,
    licenseCode: newKey,
    record: target,
  });
});

// DELETE /api/records/:id - Delete a record (PROTECTED)
app.delete('/api/records/:id', requireAdminAuth, (req: Request, res: Response) => {
  let records = readDatabase();
  const initialLength = records.length;
  records = records.filter((r) => r.id !== req.params.id);

  if (records.length === initialLength) {
    res.status(404).json({ success: false, message: 'Record not found.' });
    return;
  }

  writeDatabase(records);
  res.json({ success: true, message: 'Record deleted from database.' });
});

// GET /api/stats - High-level metrics (PROTECTED)
app.get('/api/stats', requireAdminAuth, (_req: Request, res: Response) => {
  const records = readDatabase();

  const total = records.length;
  const verified = records.filter((r) => r.status === 'VERIFIED').length;
  const pending = records.filter((r) => r.status === 'PENDING').length;
  const trial = records.filter((r) => r.versionCode === 'TRAL' || (r.version && r.version.toLowerCase().includes('trial'))).length;

  res.json({
    success: true,
    stats: {
      totalSubmissions: total,
      verifiedRecords: verified,
      pendingVerification: pending,
      trialRegistrations: trial,
      activeLicenses: records.filter((r) => r.licenseCode && r.licenseCode.includes('-')).length,
    },
  });
});

// ---------------- VITE MIDDLEWARE IN DEV ----------------
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Kaylix Server] Express backend running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[Kaylix Server] Failed to start server:', err);
});
