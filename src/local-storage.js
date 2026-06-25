const fs = require("fs");
const path = require("path");
const { createPasswordRecord } = require("./auth");
const {
  getRoleName,
  getRolePermissions,
  listSystemRoles,
  normalizeRoleCode
} = require("./permissions");
const { backupRuntimeData } = require("./runtime-backup");
const { writeJsonAtomic } = require("./atomic-write");
const { isSafeStoredPath } = require("./photo-store");
const { filterCanceledForRole } = require("./permissions");

const dataDir = path.join(process.cwd(), ".runtime-data");
const legacyDataDir = path.join(process.cwd(), "data");
const receiptsFile = path.join(dataDir, "receipts.json");
const configFile = path.join(dataDir, "config.json");

const USE_SUPABASE = (process.env.STORAGE_DRIVER || "").trim().toLowerCase() === "supabase";
let kvBackend = null;
if (USE_SUPABASE) {
  try {
    kvBackend = require("./supabase-state-kv");
  } catch (error) {
    console.error("Failed to load Supabase KV backend:", error.message);
  }
}

let receiptsCache = null;
let configCache = null;
let initPromise = null;

const CURRENT_MIGRATION_VERSION = "tranșa-a-b-v1";

const defaultReceiptsState = {
  openingDocuments: [],
  receipts: [],
  processings: [],
  transactions: [],
  deliveries: [],
  complaints: [],
  auditLogs: [],
  partnerAdvances: [],
  lastId: 0
};

const defaultConfigState = {
  nextIds: {
    roles: 6,
    users: 5,
    partners: 2,
    products: 2,
    storageLocations: 6,
    tariffs: 2,
    paymentTypes: 2,
    fiscalProfiles: 3,
    processingTypes: 3,
    vehicles: 0,
    labReports: 0
  },
  roles: listSystemRoles(),
  users: [
    { id: 1, name: "Administrator", username: "admin", roleCode: "admin", channel: "web", active: true }
  ],
  partners: [
    {
      id: 1,
      name: "Agro Nord",
      idno: "100260000001",
      address: "Balti",
      phone: "+37360000001",
      role: "furnizor",
      fiscalProfile: "Persoana fizica",
      bankName: "",
      iban: ""
    },
    {
      id: 2,
      name: "Export Grain",
      idno: "100260000002",
      address: "Chisinau",
      phone: "+37360000002",
      role: "cumparator",
      fiscalProfile: "Persoana juridica platitor TVA",
      bankName: "",
      iban: ""
    }
  ],
  products: [
    { id: 1, name: "Grau", code: "GRAU", unit: "tone", humidityNorm: 14, impurityNorm: 2, active: true },
    { id: 2, name: "Porumb", code: "PORUMB", unit: "tone", humidityNorm: 14, impurityNorm: 2, active: true }
  ],
  storageLocations: [
    { id: 1, name: "Cilindru 1", type: "cilindru", capacity: 2000000, capacitySunflower: 1100000, costCategory: "procesat", active: true },
    { id: 2, name: "Cilindru 2", type: "cilindru", capacity: 2000000, capacitySunflower: 1100000, costCategory: "procesat", active: true },
    { id: 3, name: "Cilindru 3", type: "cilindru", capacity: 2000000, capacitySunflower: 1100000, costCategory: "procesat", active: true },
    { id: 4, name: "Cilindru 4", type: "cilindru", capacity: 2000000, capacitySunflower: 1100000, costCategory: "procesat", active: true }
  ],
  tariffs: [
    {
      id: 1,
      service: "Curatire",
      product: "General",
      partner: "General",
      fiscalProfile: "General",
      calculation: "pe tona",
      value: 120,
      validFrom: "2026-01-01",
      active: true
    },
    {
      id: 2,
      service: "Uscare",
      product: "General",
      partner: "General",
      fiscalProfile: "General",
      calculation: "pe tona si procent",
      value: 250,
      validFrom: "2026-01-01",
      active: true
    }
  ],
  paymentTypes: [
    { id: 1, name: "Numerar", active: true },
    { id: 2, name: "Transfer", active: true }
  ],
  fiscalProfiles: [
    { id: 1, name: "Persoana fizica", withholdingPercent: 7, vat: false, active: true },
    { id: 2, name: "Persoana juridica platitor TVA", withholdingPercent: 0, vat: true, active: true },
    { id: 3, name: "Persoana juridica neplatitor TVA", withholdingPercent: 0, vat: false, active: true }
  ],
  processingTypes: [
    { id: 1, name: "Curatire", consumptionNorm: 0.5, resource: "energie", lossMethod: "deseu", active: true },
    { id: 2, name: "Uscare", consumptionNorm: 1.2, resource: "gaz", lossMethod: "umiditate", active: true },
    { id: 3, name: "Pastrare", consumptionNorm: 0, resource: "spatiu", lossMethod: "fara", active: true }
  ],
  vehicles: [],
  labReports: [],
  systemSettings: {
    closeOfDayHour: 17,
    reportChannel: "telegram",
    reportAudience: "manager,control",
    defaultCurrency: "MDL",
    migrationVersion: ""
  }
};

const configEntities = [
  "roles",
  "users",
  "partners",
  "products",
  "storageLocations",
  "tariffs",
  "paymentTypes",
  "fiscalProfiles",
  "processingTypes",
  "vehicles",
  "labReports"
];

const defaultUserPassword = process.env.DEFAULT_USER_PASSWORD || "Agro2026!";

const DELIVERY_STATUSES = ["Proiect", "Confirmat", "Livrat", "Inchis", "Anulat", "Redeschis"];
const RECEIPT_STATUSES = ["Proiect", "In descarcare", "Draft", "Procesata", "Confirmat", "Inchis", "Anulat", "Redeschis"];
const COMPLAINT_STATUSES = ["Deschisa", "Acceptata", "Respinsa", "Inchisa"];

const DELIVERY_TRANSITIONS = {
  Proiect: ["Confirmat", "Anulat"],
  Confirmat: ["Livrat", "Anulat"],
  Livrat: ["Inchis", "Redeschis"],
  Inchis: ["Redeschis"],
  Redeschis: ["Livrat", "Inchis", "Anulat"],
  Anulat: []
};

function slugifyUsername(value) {
  const normalized = String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/(^\.+|\.+$)/g, "");

  return normalized || "utilizator";
}

function buildUniqueUsername(users, preferredUsername, excludeId = null) {
  const base = slugifyUsername(preferredUsername);
  let candidate = base;
  let counter = 2;

  while (
    users.some(
      (item) =>
        item.id !== excludeId &&
        String(item.username || "").trim().toLowerCase() === candidate.toLowerCase()
    )
  ) {
    candidate = `${base}.${counter}`;
    counter += 1;
  }

  return candidate;
}

function sanitizeUserForClient(user) {
  const roleCode = normalizeRoleCode(user.roleCode);
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    roleCode,
    roleName: getRoleName(roleCode),
    permissions: getRolePermissions(roleCode),
    channel: user.channel,
    active: user.active !== false,
    requirePasswordChange: user.requirePasswordChange === true,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}

function normalizeReportAudience(value) {
  return Array.from(
    new Set(
      String(value || "")
        .split(",")
        .map((item) => String(item || "").trim().toLowerCase())
        .filter(Boolean)
        .map((item) => (item === "control" ? "manager" : item))
    )
  ).join(",");
}

function ensureSystemRoles(roles = []) {
  const currentByCode = new Map(roles.map((item) => [normalizeRoleCode(item.code), item]));
  let changed = false;
  const normalizedRoles = listSystemRoles().map((role) => {
    const existing = currentByCode.get(role.code);
    if (!existing) {
      changed = true;
      return role;
    }

    if (
      String(existing.name || "") !== role.name ||
      String(existing.permissions || "") !== role.permissions ||
      existing.system !== true ||
      normalizeRoleCode(existing.code) !== role.code
    ) {
      changed = true;
    }

    return {
      ...role,
      createdAt: existing.createdAt || undefined,
      updatedAt: existing.updatedAt || undefined
    };
  });

  return { roles: normalizedRoles, changed };
}

function ensureUserSecurityState(users = []) {
  let changed = false;
  const normalizedUsers = [];

  for (const user of users) {
    const nextUser = { ...user };
    const normalizedRole = normalizeRoleCode(nextUser.roleCode);

    if (normalizedRole !== nextUser.roleCode) {
      nextUser.roleCode = normalizedRole;
      changed = true;
    }

    if (!nextUser.username) {
      nextUser.username = buildUniqueUsername(
        [...users, ...normalizedUsers],
        nextUser.name || "utilizator",
        nextUser.id
      );
      changed = true;
    }

    if (!nextUser.channel) {
      nextUser.channel = "web";
      changed = true;
    }

    if (nextUser.active === undefined) {
      nextUser.active = true;
      changed = true;
    }

    if (!nextUser.passwordSalt || !nextUser.passwordHash) {
      const passwordRecord = createPasswordRecord(defaultUserPassword, { mode: "lenient" });
      nextUser.passwordSalt = passwordRecord.salt;
      nextUser.passwordHash = passwordRecord.hash;
      if (nextUser.requirePasswordChange === undefined) {
        nextUser.requirePasswordChange = true;
      }
      changed = true;
    }

    if (nextUser.requirePasswordChange === undefined) {
      nextUser.requirePasswordChange = false;
      changed = true;
    }

    normalizedUsers.push(nextUser);
  }

  return { users: normalizedUsers, changed };
}

function ensureBootstrapAdmin(users = []) {
  if (users.some((item) => item.active !== false && normalizeRoleCode(item.roleCode) === "admin")) {
    return { users, changed: false };
  }

  const nextUsers = [...users];
  const passwordRecord = createPasswordRecord(defaultUserPassword);
  nextUsers.push({
    id: nextUsers.reduce((max, item) => Math.max(max, Number(item.id || 0)), 0) + 1,
    name: "Administrator",
    username: buildUniqueUsername(nextUsers, "admin"),
    roleCode: "admin",
    channel: "web",
    active: true,
    passwordSalt: passwordRecord.salt,
    passwordHash: passwordRecord.hash,
    createdAt: new Date().toISOString()
  });

  return { users: nextUsers, changed: true };
}

function ensureDir() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

function ensureStorage() {
  if (USE_SUPABASE) return;
  ensureDir();

  if (!fs.existsSync(receiptsFile)) {
    const legacyReceiptsFile = path.join(legacyDataDir, "receipts.json");
    const initialReceiptsState = fs.existsSync(legacyReceiptsFile)
      ? JSON.parse(fs.readFileSync(legacyReceiptsFile, "utf8"))
      : defaultReceiptsState;

    writeJsonAtomic(receiptsFile, initialReceiptsState);
  }

  if (!fs.existsSync(configFile)) {
    writeJsonAtomic(configFile, defaultConfigState);
  }
}

async function initStorage() {
  if (receiptsCache && configCache) {
    return { receiptsCache, configCache };
  }

  if (USE_SUPABASE) {
    if (!kvBackend) {
      throw new Error("Supabase KV backend not loaded — check SUPABASE_URL/KEY env vars.");
    }
    const [receipts, config] = await Promise.all([
      kvBackend.loadKv("receipts", null),
      kvBackend.loadKv("config", null)
    ]);
    receiptsCache = receipts || JSON.parse(JSON.stringify(defaultReceiptsState));
    configCache = config || JSON.parse(JSON.stringify(defaultConfigState));
  } else {
    ensureStorage();
    receiptsCache = JSON.parse(fs.readFileSync(receiptsFile, "utf8"));
    configCache = JSON.parse(fs.readFileSync(configFile, "utf8"));
  }

  return { receiptsCache, configCache };
}

function ensureInitialized() {
  if (receiptsCache === null || configCache === null) {
    if (USE_SUPABASE) {
      throw new Error("Storage not initialized. Call await initStorage() before any read/write.");
    }
    ensureStorage();
    receiptsCache = JSON.parse(fs.readFileSync(receiptsFile, "utf8"));
    configCache = JSON.parse(fs.readFileSync(configFile, "utf8"));
  }
}

function persistReceipts(state) {
  if (USE_SUPABASE) {
    if (kvBackend) kvBackend.queueSave("receipts", state);
  } else {
    ensureDir();
    backupRuntimeData();
    writeJsonAtomic(receiptsFile, state);
  }
}

function persistConfig(state) {
  if (USE_SUPABASE) {
    if (kvBackend) kvBackend.queueSave("config", state);
  } else {
    ensureDir();
    backupRuntimeData();
    writeJsonAtomic(configFile, state);
  }
}

// Pe serverless (Vercel), instanta poate ingheta imediat dupa raspuns, inainte ca
// salvarea debounce-uita in Supabase KV sa apuce sa ruleze => scrierea se pierde.
// De aceea fortam flush-ul salvarilor in asteptare inainte ca functia sa se incheie.
async function flushPendingWrites() {
  if (USE_SUPABASE && kvBackend && typeof kvBackend.flushAndWait === "function") {
    await kvBackend.flushAndWait();
  }
}

// Pe serverless (Vercel) fiecare instanta isi tine propriul cache in memorie si nu-l
// reincarca, deci instantele "calde" servesc date vechi. La fiecare cerere reincarcam
// starea din Supabase KV ca citirile sa fie mereu proaspete (consistenta intre instante).
async function reloadFromKv() {
  if (!USE_SUPABASE || !kvBackend) return;
  const [receipts, config] = await Promise.all([
    kvBackend.loadKv("receipts", null),
    kvBackend.loadKv("config", null)
  ]);
  if (receipts) receiptsCache = receipts;
  if (config) configCache = config;
}

function readReceiptsState() {
  ensureInitialized();
  const state = { ...defaultReceiptsState, ...receiptsCache };
  if (!Array.isArray(state.partnerAdvances)) {
    state.partnerAdvances = [];
  }
  return state;
}

function writeReceiptsState(state) {
  receiptsCache = state;
  persistReceipts(state);
}

function readConfigState() {
  ensureInitialized();
  const state = { ...defaultConfigState, ...configCache };

  for (const entity of configEntities) {
    if (!Array.isArray(state[entity])) {
      state[entity] = [...defaultConfigState[entity]];
    } else if (state[entity].length === 0 && defaultConfigState[entity].length > 0) {
      state[entity] = [...defaultConfigState[entity]];
    }
  }

  // Backfill lossMethod pe tipurile de procesare vechi (salvate inainte de
  // introducerea categoriei de calcul). Cloneaza obiectele ca sa nu mutam cache-ul.
  state.processingTypes = (state.processingTypes || []).map((item) => ({
    ...item,
    lossMethod: resolveLossMethod(item)
  }));

  // Asigura tipul "Ventilare" (fara pierdere cantitativa, iesire = intrare) — sa fie mereu
  // disponibil pentru operator, inclusiv pe datele live. Idempotent (verificare dupa nume).
  if (
    !state.processingTypes.some(
      (t) => String((t && t.name) || "").trim().toLowerCase() === "ventilare"
    )
  ) {
    state.processingTypes = [
      ...state.processingTypes,
      {
        id: nextId(state.processingTypes),
        name: "Ventilare",
        consumptionNorm: 0,
        resource: "aer",
        lossMethod: "fara",
        active: true
      }
    ];
  }

  // Orice locatie de tip "parcare" (ex. Parcare afara) permite mai multe produse — singura
  // exceptie de la regula un-produs. Fortat (robust la editari din nomenclator), conform cerintei.
  state.storageLocations = (state.storageLocations || []).map((loc) => {
    const n = String((loc && loc.name) || "")
      .trim()
      .toLowerCase()
      .replace(/[ăâ]/g, "a");
    const isParcare = n.includes("parcare") || String((loc && loc.type) || "").toLowerCase() === "parcare";
    if (isParcare && loc.multiProduct !== true) {
      return { ...loc, multiProduct: true };
    }
    return loc;
  });

  state.nextIds = { ...defaultConfigState.nextIds, ...(state.nextIds || {}) };
  state.systemSettings = {
    ...defaultConfigState.systemSettings,
    ...(state.systemSettings || {}),
    reportAudience: normalizeReportAudience(
      state.systemSettings?.reportAudience || defaultConfigState.systemSettings.reportAudience
    )
  };

  const systemRolesState = ensureSystemRoles(state.roles);
  state.roles = systemRolesState.roles;

  if (!state.roles.some((item) => item.code === "accountant-sef")) {
    const maxRoleId = state.roles.reduce((max, item) => Math.max(max, Number(item.id || 0)), 0);
    state.roles.push({
      id: maxRoleId + 1,
      name: "Contabil sef",
      code: "accountant-sef",
      permissions: "reclamatii, ajustari stoc, ajustari factura, audit"
    });
  }

  for (const entity of configEntities) {
    const maxId = state[entity].reduce((max, item) => Math.max(max, Number(item.id || 0)), 0);
    state.nextIds[entity] = Math.max(Number(state.nextIds[entity] || 0), maxId);
  }

  const userSecurityState = ensureUserSecurityState(state.users);
  const bootstrapAdminState = ensureBootstrapAdmin(userSecurityState.users);
  state.users = bootstrapAdminState.users;

  if (systemRolesState.changed || userSecurityState.changed || bootstrapAdminState.changed) {
    state.nextIds.roles = 4;
    state.nextIds.users = Math.max(
      Number(state.nextIds.users || 0),
      state.users.reduce((max, item) => Math.max(max, Number(item.id || 0)), 0)
    );
    configCache = state;
    persistConfig(state);
  } else {
    configCache = state;
  }

  return state;
}

function writeConfigState(state) {
  configCache = state;
  persistConfig(state);
}

function sanitizeBoolean(value) {
  if (typeof value === "boolean") {
    return value;
  }

  return value === "true" || value === "1" || value === 1;
}

function sanitizeNumber(value) {
  if (value === null || value === undefined || value === "") {
    return 0;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

// Pastreaza doar referintele valide de poze (cai sigure generate de photo-store).
// Accepta string (cale) sau { path, kind }. Max 12 poze / inregistrare.
function sanitizePhotos(value) {
  if (!Array.isArray(value)) return [];
  const out = [];
  for (const item of value) {
    const raw = typeof item === "string" ? { path: item } : (item && typeof item === "object" ? item : null);
    if (!raw) continue;
    const p = String(raw.path || "");
    if (!isSafeStoredPath(p)) continue;
    out.push({
      path: p,
      kind: ["brut", "neto", "masina", "altul"].includes(raw.kind) ? raw.kind : "altul",
      uploadedAt: typeof raw.uploadedAt === "string" ? raw.uploadedAt : new Date().toISOString()
    });
    if (out.length >= 12) break;
  }
  return out;
}

// Generate a collision-proof next id based on the highest existing id,
// NOT on array length (length+1 collides after deletions and causes
// records to overwrite each other in the UI).
function nextId(list) {
  if (!Array.isArray(list) || !list.length) {
    return 1;
  }
  let max = 0;
  for (const item of list) {
    const id = Number(item && item.id);
    if (Number.isFinite(id) && id > max) {
      max = id;
    }
  }
  return max + 1;
}

function requiredText(value, label) {
  const normalized = String(value || "").trim();

  if (!normalized) {
    throw new Error(`${label} este obligatoriu.`);
  }

  return normalized;
}

function createReceiptSummary(receipts) {
  // KPI-urile cantitative/valorice exclud receptiile anulate (la fel ca livrarile).
  const active = (receipts || []).filter((item) => item.status !== "Anulat");
  const totalReceipts = active.length;
  const totalQuantity = active.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  const totalValue = active.reduce(
    (sum, item) => {
      const fallbackValue = Number(item.quantity || 0) * Number(item.price || 0);
      return sum + Number(item.preliminaryPayableAmount ?? fallbackValue);
    },
    0
  );

  const byStatus = receipts.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {});

  return {
    totalReceipts,
    totalQuantity,
    totalValue,
    byStatus
  };
}

function createProcessingSummary(processings) {
  // Numaram doar procesarile care afecteaza stocul (nu Anulat, nu In lucru).
  const active = (processings || []).filter(
    (item) => item.status !== "Anulat" && item.status !== "In lucru"
  );
  return {
    totalProcessings: active.length,
    totalProcessedQuantity: active.reduce(
      (sum, item) => sum + Number(item.processedQuantity || 0),
      0
    ),
    totalConfirmedWaste: active.reduce(
      (sum, item) => sum + Number(item.confirmedWaste || 0),
      0
    )
  };
}

function createTransactionSummary(transactions) {
  const supplierPayments = transactions.filter((item) => item.direction === "payment");
  const customerCollections = transactions.filter((item) => item.direction === "collection");

  return {
    totalPayments: supplierPayments.reduce((sum, item) => sum + Number(item.amount || 0), 0),
    totalCollections: customerCollections.reduce((sum, item) => sum + Number(item.amount || 0), 0),
    totalTransactions: transactions.length
  };
}

function createDeliverySummary(deliveries) {
  const active = (deliveries || []).filter((item) => item.status !== "Anulat");
  return {
    totalDeliveries: active.length,
    totalDeliveredQuantity: active.reduce(
      (sum, item) => sum + Number(item.deliveredQuantity || 0),
      0
    )
  };
}

function createComplaintSummary(complaints) {
  return {
    totalComplaints: complaints.length,
    openComplaints: complaints.filter((item) => item.status === "Deschisa").length,
    acceptedQuantity: complaints
      .filter((item) => item.status === "Acceptata")
      .reduce((sum, item) => sum + Number(item.contestedQuantity || 0), 0)
  };
}

function createAuditSummary(auditLogs) {
  return {
    totalAuditLogs: auditLogs.length,
    recentAuditLogs: auditLogs.filter((item) => {
      const createdAt = new Date(item.createdAt).getTime();
      return Date.now() - createdAt <= 1000 * 60 * 60 * 24;
    }).length
  };
}

function createPartnerAdvanceSummary(partnerAdvances = []) {
  const totalAdvance = partnerAdvances.reduce(
    (sum, item) => sum + Number(item.remainingAmount || 0),
    0
  );
  const byPartner = {};
  for (const advance of partnerAdvances) {
    const key = advance.partnerId || advance.partner || "necunoscut";
    byPartner[key] = (byPartner[key] || 0) + Number(advance.remainingAmount || 0);
  }
  return {
    totalAdvance,
    totalEntries: partnerAdvances.length,
    byPartner
  };
}

function createOpeningSummary(openingDocuments) {
  const stockItems = openingDocuments.flatMap((item) => item.stockItems || []);
  const debtItems = openingDocuments.flatMap((item) => item.debtItems || []);

  return {
    totalOpeningDocuments: openingDocuments.length,
    openingStockQuantity: stockItems.reduce((sum, item) => sum + Number(item.quantity || 0), 0),
    openingDebtPayments: debtItems
      .filter((item) => item.direction === "payment")
      .reduce((sum, item) => sum + Number(item.amount || 0), 0),
    openingDebtCollections: debtItems
      .filter((item) => item.direction === "collection")
      .reduce((sum, item) => sum + Number(item.amount || 0), 0)
  };
}

function normalizeOpeningDocuments(openingDocuments = []) {
  return openingDocuments.map((document) => ({
    ...document,
    stockItems: (document.stockItems || []).map((item, index) => ({
      ...item,
      openingStockId: item.openingStockId || `OS-${document.id}-${index + 1}`
    })),
    debtItems: (document.debtItems || []).map((item, index) => ({
      ...item,
      openingDebtId: item.openingDebtId || `OD-${document.id}-${index + 1}`,
      settledAmount: Number(item.settledAmount || 0),
      status:
        item.status ||
        (item.direction === "collection" ? "Neincasat" : "Neachitat")
    }))
  }));
}

function listOpeningDebtItemsFromDocuments(openingDocuments = []) {
  return normalizeOpeningDocuments(openingDocuments).flatMap((item) => item.debtItems || []);
}

function createStockSummary(receipts, deliveries = [], openingDocuments = [], transfers = [], processings = []) {
  const stockByLocation = new Map();
  const openingStockItems = openingDocuments.flatMap((item) => item.stockItems || []);

  for (const item of openingStockItems) {
    const location = item.location || "Fara locatie";
    const key = `${location}::${item.product}`;
    const existing = stockByLocation.get(key) || {
      location,
      product: item.product,
      quantity: 0,
      unit: item.unit || "tone",
      costCategory: item.locationId || null
    };

    existing.quantity += Number(item.quantity || 0);
    stockByLocation.set(key, existing);
  }

  for (const item of receipts) {
    // Anulat (canceled) si "In descarcare" (asteapta a 2-a cantarire) NU intra in stoc.
    if (item.status === "Anulat" || item.status === "In descarcare") continue;
    const location = item.location || "Fara locatie";
    const key = `${location}::${item.product}`;
    const fallbackQuantity = Number(item.quantity || 0);
    const quantity = Number(item.finalNetQuantity ?? item.provisionalNetQuantity ?? fallbackQuantity);
    const existing = stockByLocation.get(key) || {
      location,
      product: item.product,
      quantity: 0,
      unit: item.unit,
      costCategory: item.locationId || null
    };

    existing.quantity += quantity;
    stockByLocation.set(key, existing);
  }

  // Transferuri intre cilindri: scad din locatia sursa, adaug in destinatie.
  for (const item of transfers) {
    // Transferul anulat nu mai produce mișcare de stoc între cilindri.
    if (item.status === "Anulat") continue;
    const product = item.product;
    const unit = item.unit || "tone";
    const qty = Number(item.quantity || 0);
    if (!product || qty <= 0) continue;

    const fromLocation = item.fromLocation || "Fara locatie";
    const toLocation = item.toLocation || "Fara locatie";
    const fromKey = `${fromLocation}::${product}`;
    const toKey = `${toLocation}::${product}`;

    const fromExisting = stockByLocation.get(fromKey) || {
      location: fromLocation,
      product,
      quantity: 0,
      unit,
      costCategory: item.fromLocationId || null
    };
    fromExisting.quantity -= qty;
    stockByLocation.set(fromKey, fromExisting);

    const toExisting = stockByLocation.get(toKey) || {
      location: toLocation,
      product,
      quantity: 0,
      unit,
      costCategory: item.toLocationId || null
    };
    toExisting.quantity += qty;
    stockByLocation.set(toKey, toExisting);
  }

  // Procesari pe produs (model "miscare"): scad cantitatea de intrare din locatia
  // sursa si adaug cantitatea de iesire in destinatie. Diferenta (deseu + apa la uscare)
  // dispare din stoc. Doar procesarile noi (movement===true); cele vechi sunt deja
  // reflectate prin finalNetQuantity-ul receptiei, deci nu le numaram din nou.
  for (const item of processings) {
    if (!item || item.movement !== true) continue;
    if (item.status === "Anulat" || item.status === "In lucru") continue;
    const product = item.product;
    if (!product) continue;
    const input = Number(item.processedQuantity || 0);
    const output = Number(
      item.outputQuantity ??
        Math.max(input - Number(item.confirmedWaste || 0) - Number(item.waterRemoved || 0), 0)
    );
    const src = item.sourceLocation || "Fara locatie";
    const dest = item.destLocation || src;

    if (input > 0) {
      const fromKey = `${src}::${product}`;
      const fromExisting = stockByLocation.get(fromKey) || {
        location: src,
        product,
        quantity: 0,
        unit: "tone",
        costCategory: null
      };
      fromExisting.quantity -= input;
      stockByLocation.set(fromKey, fromExisting);
    }

    if (output > 0) {
      const toKey = `${dest}::${product}`;
      const toExisting = stockByLocation.get(toKey) || {
        location: dest,
        product,
        quantity: 0,
        unit: "tone",
        costCategory: null
      };
      toExisting.quantity += output;
      stockByLocation.set(toKey, toExisting);
    }
  }

  const normLoc = (s) => String(s || "Fara locatie").trim().toLowerCase();
  const rawByLocation = Array.from(stockByLocation.values()).map((item) => ({
    ...item,
    quantity: Number(item.quantity || 0),
    deliveredQuantity: 0
  }));
  // Unim locatiile duplicate care difera doar prin litere mari/mici sau spatii
  // (ex. "Groapa primire" vs "Groapa Primire"). Pastram prima denumire intalnita.
  const mergedMap = new Map();
  for (const item of rawByLocation) {
    const mk = `${normLoc(item.location)}::${item.product}`;
    const existingMerge = mergedMap.get(mk);
    if (existingMerge) {
      existingMerge.quantity += Number(item.quantity || 0);
    } else {
      mergedMap.set(mk, item);
    }
  }
  const byLocation = Array.from(mergedMap.values());

  // Scadem fiecare livrare livrata: intai din locatia aleasa la livrare, apoi din
  // celelalte locatii ale produsului (cele mai pline intai) daca acolo nu ajunge —
  // astfel poarta (pe locatie) si scaderea coincid, dar ramane robust daca produsul
  // a fost mutat intre timp prin procesare/transfer.
  for (const d of deliveries) {
    // Livrarea anulată nu mai produce mișcare de stoc (anularea întoarce marfa).
    if (d.status === "Anulat") continue;
    let remaining = Number(d.deliveredQuantity || 0);
    if (remaining <= 0) continue;
    const product = d.product;
    const primary = byLocation.find((i) => normLoc(i.location) === normLoc(d.location) && i.product === product);
    if (primary && primary.quantity > 0) {
      const take = Math.min(primary.quantity, remaining);
      primary.quantity -= take;
      primary.deliveredQuantity += take;
      remaining -= take;
    }
    if (remaining > 0) {
      const others = byLocation
        .filter((i) => i.product === product && i !== primary && i.quantity > 0)
        .sort((a, b) => b.quantity - a.quantity);
      for (const loc of others) {
        if (remaining <= 0) break;
        const take = Math.min(loc.quantity, remaining);
        loc.quantity -= take;
        loc.deliveredQuantity += take;
        remaining -= take;
      }
    }
  }

  byLocation
    .forEach((item) => { item.quantity = Math.max(Number(item.quantity || 0), 0); });
  byLocation.sort((a, b) => {
    if (a.location === b.location) {
      return a.product.localeCompare(b.product, "ro");
    }
    return a.location.localeCompare(b.location, "ro");
  });

  const totals = {
    totalQuantity: byLocation.reduce((sum, item) => sum + Number(item.quantity || 0), 0),
    totalLocations: new Set(byLocation.map((item) => item.location)).size,
    totalProducts: new Set(byLocation.map((item) => item.product)).size
  };

  return {
    byLocation,
    totals
  };
}

function createConfigSummary(config) {
  return {
    partners: config.partners.length,
    products: config.products.length,
    storageLocations: config.storageLocations.length,
    tariffs: config.tariffs.length,
    roles: config.roles.length,
    users: config.users.length
  };
}

function requiredChangeReason(value) {
  return requiredText(value, "Mentiunea modificarii");
}

const SENSITIVE_FIELDS = new Set([
  "password",
  "passwordSalt",
  "passwordHash",
  "token",
  "sessionToken",
  "apiKey",
  "secret"
]);

function maskSensitiveFields(value) {
  if (value === null || value === undefined) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => maskSensitiveFields(item));
  }

  if (typeof value === "object") {
    const out = {};
    for (const key of Object.keys(value)) {
      if (SENSITIVE_FIELDS.has(key)) {
        out[key] = "***";
      } else {
        out[key] = maskSensitiveFields(value[key]);
      }
    }
    return out;
  }

  return value;
}

function createAuditEntry(state, payload) {
  if (!Array.isArray(state.auditLogs)) {
    state.auditLogs = [];
  }

  const entry = {
    id: nextId(state.auditLogs),
    entityType: payload.entityType,
    entityId: payload.entityId ? Number(payload.entityId) : null,
    action: payload.action,
    reason: payload.reason,
    user: payload.user || "dashboard",
    oldValue: maskSensitiveFields(payload.oldValue || null),
    newValue: maskSensitiveFields(payload.newValue || null),
    createdAt: new Date().toISOString()
  };

  state.auditLogs.push(entry);
  return entry;
}

async function appendAuditLog(payload) {
  const state = readReceiptsState();
  const entry = createAuditEntry(state, payload);
  writeReceiptsState(state);
  return entry;
}

function computeReservedQuantity(state, receiptId) {
  return (state.deliveries || [])
    .filter((item) => item.receiptId === Number(receiptId))
    .filter((item) => item.status === "Confirmat" || item.status === "Livrat" || item.status === "Redeschis")
    .reduce((sum, item) => {
      if (item.status === "Livrat" || item.status === "Redeschis") {
        return sum + Number(item.deliveredQuantity || item.netWeight || item.plannedQuantity || 0);
      }
      return sum + Number(item.plannedQuantity || item.deliveredQuantity || 0);
    }, 0);
}

function computeDeliveredQuantity(state, receiptId) {
  return (state.deliveries || [])
    .filter((item) => item.receiptId === Number(receiptId))
    .filter((item) => item.status === "Livrat" || item.status === "Inchis")
    .reduce((sum, item) => sum + Number(item.deliveredQuantity || item.netWeight || 0), 0);
}

function getReceiptBaseQuantity(receipt) {
  return Number(
    receipt.finalNetQuantity ?? receipt.provisionalNetQuantity ?? receipt.quantity ?? 0
  );
}

function getReceiptAvailableQuantity(state, receiptId) {
  const receipt = state.receipts.find((item) => item.id === Number(receiptId));
  if (!receipt) {
    return null;
  }

  const baseQuantity = getReceiptBaseQuantity(receipt);
  const reserved = computeReservedQuantity(state, receiptId);
  return Math.max(baseQuantity - reserved, 0);
}

function recalcReceiptDeliveryState(state, receiptId) {
  const receipt = state.receipts.find((item) => item.id === Number(receiptId));
  if (!receipt) {
    return;
  }

  const base = getReceiptBaseQuantity(receipt);
  const reserved = computeReservedQuantity(state, receiptId);
  const delivered = computeDeliveredQuantity(state, receiptId);

  receipt.reservedQuantity = reserved;
  receipt.deliveredQuantity = delivered;
  receipt.availableQuantity = Math.max(base - reserved, 0);

  let deliveryStatus = "Nelivrat";
  if (delivered > 0 && delivered >= base) {
    deliveryStatus = "Livrat complet";
  } else if (delivered > 0) {
    deliveryStatus = "Livrat partial";
  } else if (reserved > 0 && reserved >= base) {
    deliveryStatus = "Rezervat complet";
  } else if (reserved > 0) {
    deliveryStatus = "Rezervat partial";
  }
  receipt.deliveryStatus = deliveryStatus;
  receipt.updatedAt = new Date().toISOString();
}

function recalcReceiptComplaintFlag(state, receiptId) {
  const receipt = state.receipts.find((item) => item.id === Number(receiptId));
  if (!receipt) {
    return;
  }

  const relatedDeliveryIds = new Set(
    (state.deliveries || [])
      .filter((item) => item.receiptId === Number(receiptId))
      .map((item) => item.id)
  );

  receipt.hasOpenComplaint = (state.complaints || []).some(
    (complaint) =>
      relatedDeliveryIds.has(complaint.deliveryId) && complaint.status === "Deschisa"
  );
  receipt.updatedAt = new Date().toISOString();
}

function filterByDate(items, dateValue) {
  if (!dateValue) {
    return items;
  }

  return items.filter((item) => String(item.createdAt || "").slice(0, 10) === dateValue);
}

// Filtru pe interval [from, to] inclusiv (datele ISO YYYY-MM-DD se compara ca text).
function filterByDateRange(items, from, to) {
  const f = String(from || "").slice(0, 10);
  const t = String(to || "").slice(0, 10);
  if (!f && !t) return items;
  return items.filter((item) => {
    const d = String(item.createdAt || "").slice(0, 10);
    if (!d) return false;
    if (f && d < f) return false;
    if (t && d > t) return false;
    return true;
  });
}

function createDailyReport(dateValue, receipts, processings, transactions, stockSummary) {
  const dailyReceipts = filterByDate(receipts, dateValue);
  const dailyProcessings = filterByDate(processings, dateValue).filter(
    (item) => item.status !== "Anulat" && item.status !== "In lucru"
  );
  const dailyTransactions = filterByDate(transactions, dateValue);
  // Sumarul cantitativ exclude receptiile anulate (lista le pastreaza pentru afisare).
  const activeDailyReceipts = dailyReceipts.filter((item) => item.status !== "Anulat");

  return {
    date: dateValue,
    summary: {
      receiptsCount: activeDailyReceipts.length,
      grossQuantity: activeDailyReceipts.reduce((sum, item) => sum + Number(item.grossQuantity || item.quantity || 0), 0),
      provisionalNetQuantity: activeDailyReceipts.reduce(
        (sum, item) => sum + Number(item.provisionalNetQuantity || item.quantity || 0),
        0
      ),
      processedQuantity: dailyProcessings.reduce(
        (sum, item) => sum + Number(item.processedQuantity || 0),
        0
      ),
      confirmedWaste: dailyProcessings.reduce(
        (sum, item) => sum + Number(item.confirmedWaste || 0),
        0
      ),
      paymentsTotal: dailyTransactions
        .filter((item) => item.direction === "payment")
        .reduce((sum, item) => sum + Number(item.amount || 0), 0),
      collectionsTotal: dailyTransactions
        .filter((item) => item.direction === "collection")
        .reduce((sum, item) => sum + Number(item.amount || 0), 0),
      stockTotal: stockSummary.totals.totalQuantity
    },
    receipts: dailyReceipts,
    processings: dailyProcessings,
    transactions: dailyTransactions
  };
}

function normalizeEntityPayload(entity, payload) {
  switch (entity) {
    case "partners":
      return {
        name: requiredText(payload.name, "Denumirea partenerului"),
        idno: String(payload.idno || "").trim(),
        address: String(payload.address || "").trim(),
        phone: String(payload.phone || "").trim(),
        contract: String(payload.contract || "").trim(),
        role: requiredText(payload.role || "furnizor", "Rolul partenerului"),
        fiscalProfile: requiredText(
          payload.fiscalProfile || "Persoana fizica",
          "Statutul fiscal"
        ),
        bankName: String(payload.bankName || "").trim(),
        iban: String(payload.iban || "").trim(),
        status: payload.status === "temporar" ? "temporar" : "validat"
      };
    case "vehicles":
      return {
        number: requiredText(payload.number, "Numarul masinii"),
        series: String(payload.series || "").trim(),
        driver: String(payload.driver || "").trim(),
        active: sanitizeBoolean(payload.active ?? true)
      };
    case "labReports":
      return {
        reportNumber: requiredText(payload.reportNumber, "Numarul raportului"),
        reportDate: String(payload.reportDate || "").trim(),
        issuedBy: String(payload.issuedBy || "").trim(),
        contactPhone: String(payload.contactPhone || "").trim(),
        product: requiredText(payload.product, "Denumirea produsului"),
        originCountry: String(payload.originCountry || "").trim(),
        harvestYear: String(payload.harvestYear || "").trim(),
        humidity: sanitizeNumber(payload.humidity),
        aflatoxinB1: String(payload.aflatoxinB1 || "").trim(),
        impuritiesTotal: sanitizeNumber(payload.impuritiesTotal),
        impuritiesDiverse: sanitizeNumber(payload.impuritiesDiverse),
        brokenGrains: sanitizeNumber(payload.brokenGrains),
        sproutedGrains: sanitizeNumber(payload.sproutedGrains),
        defectiveGrains: sanitizeNumber(payload.defectiveGrains),
        destination: String(payload.destination || "").trim(),
        active: sanitizeBoolean(payload.active ?? true)
      };
    case "products":
      return {
        name: requiredText(payload.name, "Denumirea produsului"),
        code: requiredText(payload.code, "Codul produsului"),
        unit: requiredText(payload.unit || "tone", "Unitatea de masura"),
        humidityNorm: sanitizeNumber(payload.humidityNorm),
        impurityNorm: sanitizeNumber(payload.impurityNorm),
        active: sanitizeBoolean(payload.active ?? true)
      };
    case "storageLocations":
      return {
        name: requiredText(payload.name, "Denumirea locatiei"),
        type: requiredText(payload.type || "cilindru", "Tipul locatiei"),
        capacity: sanitizeNumber(payload.capacity),
        costCategory: requiredText(
          payload.costCategory || "neprocesat",
          "Categoria de cost"
        ),
        // "Permite mai multe produse": doar aici (ex. Parcare afara) NU se aplica regula un-produs.
        multiProduct: sanitizeBoolean(payload.multiProduct ?? false),
        active: sanitizeBoolean(payload.active ?? true)
      };
    case "roles":
      return {
        name: requiredText(payload.name, "Numele rolului"),
        code: normalizeRoleCode(requiredText(payload.code, "Codul rolului")),
        permissions: String(payload.permissions || "").trim(),
        system: true
      };
    case "users":
      return {
        name: requiredText(payload.name, "Numele utilizatorului"),
        username: requiredText(
          payload.username || slugifyUsername(payload.name),
          "Utilizatorul"
        ).toLowerCase(),
        roleCode: normalizeRoleCode(requiredText(payload.roleCode, "Rolul utilizatorului")),
        channel: requiredText(payload.channel || "web", "Canalul utilizatorului"),
        active: sanitizeBoolean(payload.active ?? true),
        password: String(payload.password || "").trim()
      };
    case "tariffs":
      return {
        service: requiredText(payload.service, "Serviciul"),
        product: requiredText(payload.product || "General", "Produsul"),
        partner: requiredText(payload.partner || "General", "Partenerul"),
        fiscalProfile: requiredText(
          payload.fiscalProfile || "General",
          "Statutul fiscal"
        ),
        calculation: requiredText(payload.calculation, "Modul de calcul"),
        value: sanitizeNumber(payload.value),
        validFrom: requiredText(
          payload.validFrom || new Date().toISOString().slice(0, 10),
          "Data de inceput"
        ),
        active: sanitizeBoolean(payload.active ?? true)
      };
    case "paymentTypes":
      return {
        name: requiredText(payload.name, "Tipul de plata"),
        active: sanitizeBoolean(payload.active ?? true)
      };
    case "fiscalProfiles":
      return {
        name: requiredText(payload.name, "Statutul fiscal"),
        withholdingPercent: sanitizeNumber(payload.withholdingPercent),
        vat: sanitizeBoolean(payload.vat),
        active: sanitizeBoolean(payload.active ?? true)
      };
    case "processingTypes":
      return {
        name: requiredText(payload.name, "Tipul de procesare"),
        consumptionNorm: sanitizeNumber(payload.consumptionNorm),
        resource: requiredText(payload.resource, "Resursa"),
        lossMethod: resolveLossMethod({ lossMethod: payload.lossMethod, name: payload.name }),
        active: sanitizeBoolean(payload.active ?? true)
      };
    default:
      throw new Error("Unknown config entity.");
  }
}

function assertEntity(entity) {
  if (!configEntities.includes(entity)) {
    throw new Error("Config entity is not supported.");
  }
}

async function listReceipts() {
  const state = readReceiptsState();
  // Recompute payment state from transactions on the fly so cifrele coincid mereu
  const paidByReceipt = new Map();
  const lastPaymentByReceipt = new Map();
  for (const t of state.transactions || []) {
    if (t.referenceType !== "receipt" || t.direction !== "payment") continue;
    if (t.stornata === true) continue; // storned payments don't count
    const rid = Number(t.receiptId);
    if (!rid) continue;
    const applied = Number(t.appliedAmount ?? t.amount ?? 0);
    paidByReceipt.set(rid, (paidByReceipt.get(rid) || 0) + applied);
    const when = t.createdAt || t.transactedAt || "";
    const prev = lastPaymentByReceipt.get(rid);
    if (!prev || String(when) > String(prev)) lastPaymentByReceipt.set(rid, when);
  }
  const enriched = state.receipts.map((r) => {
    const target = Number(r.preliminaryPayableAmount || 0);
    const paid = Number(paidByReceipt.get(Number(r.id)) || 0);
    const soldRestant = Math.max(target - paid, 0);
    const paymentStatus = paid <= 0 ? "Neachitat" : paid < target ? "Partial" : "Achitat";
    return {
      ...r,
      amountToPay: target,
      paidAmount: paid,
      soldRestant,
      paymentStatus,
      lastPaymentDate: lastPaymentByReceipt.get(Number(r.id)) || ""
    };
  });
  return enriched.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

async function listOpeningDocuments() {
  const state = readReceiptsState();
  return normalizeOpeningDocuments(state.openingDocuments || []).sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
}

async function deleteOpeningDocument(id, payload = {}) {
  const state = readReceiptsState();
  const idx = (state.openingDocuments || []).findIndex((d) => Number(d.id) === Number(id));
  if (idx < 0) {
    return null;
  }
  const removed = state.openingDocuments[idx];
  state.openingDocuments.splice(idx, 1);
  createAuditEntry(state, {
    entityType: "opening-document",
    entityId: Number(id),
    action: "delete",
    reason: payload.changeReason || "Stergere document sold initial",
    user: payload.changedBy || "dashboard",
    oldValue: { ...removed }
  });
  writeReceiptsState(state);
  return removed;
}

async function listOpeningDebtItems() {
  const openingDocuments = await listOpeningDocuments();
  return listOpeningDebtItemsFromDocuments(openingDocuments);
}

async function listPartnerAdvances() {
  const state = readReceiptsState();
  return (state.partnerAdvances || []).sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
}

async function createOpeningDocument(payload) {
  const state = readReceiptsState();
  const documentId = nextId(state.openingDocuments);
  const openingDocument = {
    id: documentId,
    documentDate: requiredText(payload.documentDate, "Data documentului"),
    note: String(payload.note || "").trim(),
    stockItems: (payload.stockItems || []).map((item, index) => ({
      id: index + 1,
      openingStockId: `OS-${documentId}-${index + 1}`,
      product: requiredText(item.product, "Produs sold initial"),
      productId: item.productId ? Number(item.productId) : null,
      location: requiredText(item.location, "Locatie sold initial"),
      locationId: item.locationId ? Number(item.locationId) : null,
      quantity: sanitizeNumber(item.quantity),
      unit: requiredText(item.unit || "tone", "Unitate sold initial")
    })),
    debtItems: (payload.debtItems || []).map((item, index) => ({
      id: index + 1,
      openingDebtId: `OD-${documentId}-${index + 1}`,
      partner: requiredText(item.partner, "Partener datorie"),
      partnerId: item.partnerId ? Number(item.partnerId) : null,
      direction: item.direction === "collection" ? "collection" : "payment",
      amount: sanitizeNumber(item.amount),
      settledAmount: 0,
      note: String(item.note || "").trim(),
      status:
        item.direction === "collection"
          ? item.status || "Neincasat"
          : item.status || "Neachitat"
    })),
    createdAt: new Date().toISOString()
  };

  if (!openingDocument.stockItems.length && !openingDocument.debtItems.length) {
    throw new Error("Documentul de sold initial trebuie sa contina stocuri sau datorii.");
  }

  if (!Array.isArray(state.openingDocuments)) {
    state.openingDocuments = [];
  }

  state.openingDocuments.push(openingDocument);
  createAuditEntry(state, {
    entityType: "opening-document",
    entityId: openingDocument.id,
    action: "create",
    reason: "Creare sold initial",
    user: payload.createdBy || "dashboard",
    newValue: { ...openingDocument }
  });
  writeReceiptsState(state);
  return openingDocument;
}

// Compara doua nume de locatie ignorand litere mari/mici si spatii. Locatiile cu duplicat de
// caz (ex. "Groapa primire" vs "Groapa Primire") sunt unite in createStockSummary, deci toate
// verificarile de stoc disponibil trebuie sa potriveasca la fel (case-insensitive).
function sameLocation(a, b) {
  return String(a || "").trim().toLowerCase() === String(b || "").trim().toLowerCase();
}

// Detecteaza daca o locatie contine deja ALT produs decat cel care intra. Intoarce numele
// produsului in conflict (sau null daca e gol / acelasi produs / locatie multiProduct).
// Sursa unica pentru regula "un produs / locatie" (receptie, procesare, transfer).
function findCylinderConflict(summary, toLocation, productName) {
  if (!toLocation) return null;
  // Regula "un produs / locatie" se aplica peste tot, EXCEPTAND locatiile marcate explicit
  // "multiProduct" (ex. Parcare afara). Acopera cilindrii + groapa de primire etc.
  if (toLocation.multiProduct === true) return null;
  const destItems = ((summary && summary.byLocation) || []).filter(
    (item) => sameLocation(item.location, toLocation.name) && Number(item.quantity || 0) > 0
  );
  const other = destItems.find((item) => item.product !== productName);
  return other ? other.product : null;
}

async function createReceipt(payload) {
  const state = readReceiptsState();
  const grossWeight = sanitizeNumber(payload.grossWeight);
  const tareWeight = sanitizeNumber(payload.tareWeight);
  const rawNetWeight = sanitizeNumber(payload.netWeight);
  const netWeight = rawNetWeight > 0 ? rawNetWeight : Math.max(grossWeight - tareWeight, 0);

  // Garda soft "un produs / cilindru": daca locatia aleasa e un cilindru care contine
  // deja alt produs, cerem confirmare explicita (allowMixedProduct) din interfata.
  const receiptConfig = readConfigState();
  const receiptLocation = payload.locationId
    ? receiptConfig.storageLocations.find((l) => Number(l.id) === Number(payload.locationId))
    : receiptConfig.storageLocations.find((l) => l.name === payload.location);
  let mixedProductConfirmed = false;
  // Regula "un produs / locatie" se aplica oriunde NU e bifat "Permite mai multe produse"
  // (cilindri + groapa de primire etc.); doar Parcare afara (multiProduct) e exceptata.
  if (receiptLocation && receiptLocation.multiProduct !== true) {
    const conflict = findCylinderConflict(await getStockSummary(), receiptLocation, payload.product || "");
    if (conflict) {
      if (!payload.allowMixedProduct) {
        throw new Error(
          `Locația ${receiptLocation.name} conține deja ${conflict} (o locație = un singur produs). Confirmă pe ecran sau reîncarcă pagina.`
        );
      }
      mixedProductConfirmed = true;
    }
  }

  const receipt = {
    id: state.lastId + 1,
    supplier: payload.supplier,
    supplierId: payload.supplierId ? Number(payload.supplierId) : null,
    product: payload.product,
    productId: payload.productId ? Number(payload.productId) : null,
    quantity: Number(payload.quantity),
    grossQuantity: Number(payload.grossQuantity ?? payload.quantity),
    grossWeight,
    tareWeight,
    netWeight,
    unit: payload.unit,
    // Marcaj: receptia a fost introdusa in kg (afisare in kg). Vechile receptii nu au acest camp -> afisate in tone.
    enteredUnit: payload.enteredUnit === "kg" ? "kg" : "tone",
    price: Number(payload.price),
    humidity: sanitizeNumber(payload.humidity),
    impurity: sanitizeNumber(payload.impurity),
    humidityNorm: sanitizeNumber(payload.humidityNorm),
    impurityNorm: sanitizeNumber(payload.impurityNorm),
    excessHumidity: sanitizeNumber(payload.excessHumidity),
    excessImpurity: sanitizeNumber(payload.excessImpurity),
    estimatedWaterLoss: sanitizeNumber(payload.estimatedWaterLoss),
    estimatedImpurityLoss: sanitizeNumber(payload.estimatedImpurityLoss),
    provisionalNetQuantity: sanitizeNumber(payload.provisionalNetQuantity),
    cleaningServiceTotal: sanitizeNumber(payload.cleaningServiceTotal),
    dryingServiceTotal: sanitizeNumber(payload.dryingServiceTotal),
    preliminaryServicesTotal: sanitizeNumber(payload.preliminaryServicesTotal),
    preliminaryMerchandiseValue: sanitizeNumber(payload.preliminaryMerchandiseValue),
    withholdingPercent: sanitizeNumber(payload.withholdingPercent),
    withholdingAmount: sanitizeNumber(payload.withholdingAmount),
    preliminaryPayableAmount: sanitizeNumber(payload.preliminaryPayableAmount),
    vehicle: payload.vehicle || "",
    note: payload.note || "",
    photos: sanitizePhotos(payload.photos),
    source: payload.source || "dashboard",
    status: payload.status || "Draft",
    receivedBy: payload.receivedBy || "",
    location: payload.location || "",
    locationId: payload.locationId ? Number(payload.locationId) : null,
    mixedProductConfirmed,
    reservedQuantity: 0,
    deliveredQuantity: 0,
    availableQuantity: 0,
    deliveryStatus: "Nelivrat",
    hasOpenComplaint: false,
    createdAt: new Date().toISOString()
  };

  receipt.availableQuantity = getReceiptBaseQuantity(receipt);

  state.lastId = receipt.id;
  state.receipts.push(receipt);
  createAuditEntry(state, {
    entityType: "receipt",
    entityId: receipt.id,
    action: "create",
    reason: "Creare receptie",
    user: payload.createdBy || "dashboard",
    newValue: { ...receipt }
  });
  writeReceiptsState(state);
  return receipt;
}

// Cantar in 2 pasi: finalizeaza o receptie "In descarcare" cu tara (a 2-a cantarire).
// Estimate-ul (umiditate/impuritati/withholding) e calculat de handler pe cantitatea neta si trimis aici.
async function completeReceiptWeighing(id, payload = {}) {
  const state = readReceiptsState();
  const receipt = state.receipts.find((item) => item.id === Number(id));
  if (!receipt) {
    throw new Error("Receptia nu a fost gasita.");
  }
  if (receipt.status !== "In descarcare") {
    throw new Error("Receptia nu este in descarcare.");
  }

  const oldValue = { tareWeight: receipt.tareWeight, quantity: receipt.quantity, status: receipt.status };
  const ESTIMATE_FIELDS = [
    "grossQuantity", "humidity", "impurity", "humidityNorm", "impurityNorm",
    "excessHumidity", "excessImpurity", "estimatedWaterLoss", "estimatedImpurityLoss",
    "provisionalNetQuantity", "cleaningServiceTotal", "dryingServiceTotal",
    "preliminaryServicesTotal", "preliminaryMerchandiseValue", "withholdingPercent",
    "withholdingAmount", "preliminaryPayableAmount"
  ];

  receipt.tareWeight = sanitizeNumber(payload.tareWeight);
  receipt.netWeight = sanitizeNumber(payload.netWeight);
  receipt.quantity = sanitizeNumber(payload.quantity);
  for (const field of ESTIMATE_FIELDS) {
    if (payload[field] !== undefined) {
      receipt[field] = sanitizeNumber(payload[field]);
    }
  }
  // A doua cantarire poate aduce poza "neto" — o adaugam la pozele existente (brut/masina).
  if (payload.photos !== undefined) {
    const existing = Array.isArray(receipt.photos) ? receipt.photos : [];
    receipt.photos = sanitizePhotos([...existing, ...(Array.isArray(payload.photos) ? payload.photos : [])]);
  }

  receipt.status = "Draft";
  receipt.availableQuantity = getReceiptBaseQuantity(receipt);
  receipt.updatedAt = new Date().toISOString();

  createAuditEntry(state, {
    entityType: "receipt",
    entityId: receipt.id,
    action: "receipt-complete-weighing",
    reason: "A doua cantarire (tara) - finalizare receptie",
    user: payload.changedBy || "dashboard",
    oldValue,
    newValue: { tareWeight: receipt.tareWeight, quantity: receipt.quantity, status: "Draft" }
  });
  writeReceiptsState(state);
  return receipt;
}

async function listProcessings() {
  const state = readReceiptsState();
  return (state.processings || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

async function listTransactions() {
  const state = readReceiptsState();
  return (state.transactions || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

async function listDeliveries() {
  const state = readReceiptsState();
  return (state.deliveries || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

async function listComplaints() {
  const state = readReceiptsState();
  return (state.complaints || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

async function listAuditLogs() {
  const state = readReceiptsState();
  return (state.auditLogs || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

// Act de verificare: full statement for one supplier (Etapa 7)
async function getSupplierStatement(partnerId, fromDate, toDate) {
  const state = readReceiptsState();
  const config = readConfigState();
  const partner = (config.partners || []).find((p) => Number(p.id) === Number(partnerId));
  if (!partner) {
    throw new Error("Furnizorul selectat nu exista.");
  }

  const from = fromDate ? String(fromDate).slice(0, 10) : "";
  const to = toDate ? String(toDate).slice(0, 10) : "";
  const inRange = (iso) => {
    const day = String(iso || "").slice(0, 10);
    if (!day) return true;
    if (from && day < from) return false;
    if (to && day > to) return false;
    return true;
  };

  // Receptii de la acest furnizor
  const receipts = (state.receipts || [])
    .filter((r) => r.status !== "Anulat") // receptia anulata nu intra in extrasul de cont
    .filter((r) => Number(r.supplierId) === Number(partnerId))
    .filter((r) => inRange(r.createdAt || r.receivedAt))
    .map((r) => {
      const net = Number(r.provisionalNetQuantity ?? r.quantity ?? 0);
      const price = Number(r.price ?? r.unitPrice ?? 0);
      const amount = Number(r.preliminaryPayableAmount ?? net * price);
      return {
        id: r.id,
        date: r.createdAt || r.receivedAt || "",
        product: r.product || "",
        quantity: net,
        unit: r.unit || "t",
        price,
        amount
      };
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  // Plati catre acest furnizor (dupa nume sau dupa supplierId pe tranzactie)
  const payments = (state.transactions || [])
    .filter((t) => t.direction === "payment")
    .filter((t) => {
      const byId = t.supplierId && Number(t.supplierId) === Number(partnerId);
      const byName = t.partner && partner.name && String(t.partner).trim().toLowerCase() === String(partner.name).trim().toLowerCase();
      return byId || byName;
    })
    .filter((t) => inRange(t.createdAt || t.transactedAt))
    .map((t) => ({
      id: t.id,
      date: t.createdAt || t.transactedAt || "",
      amount: Number(t.amount || 0),
      paymentType: t.paymentType || "",
      reference: t.receiptId ? `Receptie #${t.receiptId}` : (t.referenceType || "")
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const totalReceipts = receipts.reduce((s, r) => s + r.amount, 0);
  const totalQuantity = receipts.reduce((s, r) => s + r.quantity, 0);
  const totalPaid = payments.reduce((s, p) => s + p.amount, 0);
  const balance = totalReceipts - totalPaid; // >0 datorie catre furnizor, <0 avans

  // Totals per product
  const byProduct = {};
  receipts.forEach((r) => {
    const key = r.product || "—";
    if (!byProduct[key]) byProduct[key] = { quantity: 0, amount: 0 };
    byProduct[key].quantity += r.quantity;
    byProduct[key].amount += r.amount;
  });

  return {
    partner: {
      id: partner.id,
      name: partner.name,
      idno: partner.idno || "",
      address: partner.address || "",
      phone: partner.phone || "",
      fiscalProfile: partner.fiscalProfile || "",
      bankName: partner.bankName || "",
      iban: partner.iban || ""
    },
    period: { from, to },
    receipts,
    payments,
    byProduct,
    totals: {
      totalReceipts,
      totalQuantity,
      totalPaid,
      balance,
      balanceLabel: balance > 0 ? "datorie" : balance < 0 ? "avans" : "achitat"
    }
  };
}

// Categoria de calcul a pierderii pentru un tip de procesare:
//   "umiditate" (uscare)  -> scade apa din umiditate (initiala - finala)
//   "deseu" (curatire)    -> pierderea = doar deseul confirmat (masurat fizic)
//   "fara" (pastrare/alt) -> fara pierdere automata
// Pentru tipuri vechi fara lossMethod salvat, se deduce din nume (compat).
const PROCESSING_LOSS_METHODS = ["umiditate", "deseu", "fara"];
function resolveLossMethod(type) {
  const explicit = type && type.lossMethod;
  if (PROCESSING_LOSS_METHODS.includes(explicit)) return explicit;
  const name = String((type && type.name) || "")
    .toLowerCase()
    .replace(/[ăâ]/g, "a")
    .replace(/[îí]/g, "i")
    .replace(/[șş]/g, "s")
    .replace(/[țţ]/g, "t");
  if (name.includes("uscare") || name.includes("usca")) return "umiditate";
  if (name.includes("curat")) return "deseu";
  return "fara";
}

// Procesare pe PRODUS (model "miscare"): operatorul alege produs + cilindru sursa
// (+ cilindru destinatie la uscare) si cantitatea. Stocul se actualizeaza prin
// miscarea din createStockSummary (movement===true), nu prin editarea receptiei.
async function createProcessing(payload) {
  const config = readConfigState();

  const productName =
    payload.product ||
    (config.products.find((p) => Number(p.id) === Number(payload.productId)) || {}).name ||
    "";
  if (!productName) {
    throw new Error("Selecteaza produsul de procesat.");
  }

  const sourceLocation =
    payload.sourceLocation ||
    (config.storageLocations.find((l) => Number(l.id) === Number(payload.sourceLocationId)) || {}).name ||
    "";
  if (!sourceLocation) {
    throw new Error("Selecteaza locatia (cilindrul) sursa.");
  }

  const destLocation =
    payload.destLocation ||
    (config.storageLocations.find((l) => Number(l.id) === Number(payload.destLocationId)) || {}).name ||
    "";

  const processedQuantity = sanitizeNumber(payload.processedQuantity);
  if (processedQuantity <= 0) {
    throw new Error("Cantitatea procesata trebuie sa fie mai mare ca zero.");
  }

  const confirmedWaste = sanitizeNumber(payload.confirmedWaste);

  // Apa se scade DOAR la tipurile de tip "uscare" (lossMethod === "umiditate").
  // La curatire/pastrare umiditatile se ignora complet (pierderea = doar deseul
  // confirmat, masurat fizic), chiar daca au fost tastate din greseala.
  const lossMethod = resolveLossMethod(
    config.processingTypes.find((t) => t.name === (payload.processingType || "")) || {
      name: payload.processingType
    }
  );
  const usesHumidity = lossMethod === "umiditate";
  const initialHumidity = usesHumidity ? sanitizeNumber(payload.initialHumidity) : 0;
  const finalHumidity = usesHumidity ? sanitizeNumber(payload.finalHumidity) : 0;

  // Garda: la uscare, umiditatea finala nu poate depasi cea initiala (apa negativa).
  if (usesHumidity && initialHumidity > 0 && finalHumidity > initialHumidity) {
    throw new Error("Umiditatea final\u0103 nu poate fi mai mare dec\u00e2t cea ini\u021bial\u0103 la uscare.");
  }

  // #10 uscare: apa eliminata = cantitate \u00d7 (umiditate initiala \u2212 finala) %.
  const humidityDrop = Math.max(initialHumidity - finalHumidity, 0);
  const waterRemoved =
    usesHumidity && initialHumidity > 0 && finalHumidity > 0
      ? Number(((processedQuantity * humidityDrop) / 100).toFixed(3))
      : 0;

  const outputQuantity = Math.max(processedQuantity - confirmedWaste - waterRemoved, 0);

  // Protecție: deșeul + apa nu pot fi mai mari decât cantitatea procesată (altfel
  // cilindrul destinație ar rămâne pe 0 din greșeală de unitate).
  if (confirmedWaste + waterRemoved >= processedQuantity) {
    throw new Error(
      `Deșeu (${(confirmedWaste * 1000).toFixed(0)} kg) + apă (${(waterRemoved * 1000).toFixed(0)} kg) depășesc cantitatea procesată (${(processedQuantity * 1000).toFixed(0)} kg). Verifică valorile.`
    );
  }

  // #8: nu se poate procesa mai mult decat exista in stoc (produs + locatie sursa).
  const summary = await getStockSummary();
  const available = Number(
    (summary.byLocation.find(
      (i) => sameLocation(i.location, sourceLocation) && i.product === productName
    ) || {}).quantity || 0
  );
  // Comparam in kg rotunjit (la fel ca afisarea) ca "proceseaza tot stocul" sa nu pice din zecimale.
  if (Math.round(processedQuantity * 1000) > Math.round(available * 1000)) {
    throw new Error(
      `Stoc insuficient pentru ${productName} in ${sourceLocation}: disponibil ${Math.round(available * 1000)} kg, cerut ${Math.round(processedQuantity * 1000)} kg.`
    );
  }

  // Garda soft "un produs / cilindru" pe cilindrul destinatie (reutilizam summary-ul de mai sus).
  const destName = destLocation || sourceLocation;
  const destConflict = findCylinderConflict(
    summary,
    config.storageLocations.find((l) => l.name === destName),
    productName
  );
  let mixedProductConfirmed = false;
  if (destConflict) {
    if (!payload.allowMixedProduct) {
      throw new Error(
        `Locația ${destName} conține deja ${destConflict} (o locație = un singur produs). Confirmă pe ecran sau reîncarcă pagina.`
      );
    }
    mixedProductConfirmed = true;
  }

  const status = payload.status === "In lucru" ? "In lucru" : payload.status || "Confirmat";

  const state = readReceiptsState();
  if (!Array.isArray(state.processings)) {
    state.processings = [];
  }

  const processing = {
    id: nextId(state.processings),
    movement: true,
    receiptId: payload.receiptId ? Number(payload.receiptId) : null,
    product: productName,
    lot: payload.lot || "",
    sourceLocation,
    destLocation: destLocation || sourceLocation,
    processingType: payload.processingType || "",
    lossMethod,
    mixedProductConfirmed,
    processedQuantity,
    confirmedWaste,
    initialHumidity,
    finalHumidity,
    waterRemoved,
    outputQuantity,
    finalNetQuantity: outputQuantity,
    operator: payload.operator || "",
    status,
    note: payload.note || "",
    createdAt: new Date().toISOString()
  };

  state.processings.push(processing);

  createAuditEntry(state, {
    entityType: "processing",
    entityId: processing.id,
    action: "create",
    reason: "Creare procesare pe produs",
    user: payload.createdBy || "dashboard",
    newValue: { ...processing }
  });

  writeReceiptsState(state);
  return processing;
}

async function createTransaction(payload) {
  const state = readReceiptsState();
  const transaction = {
    id: nextId(state.transactions),
    referenceType:
      payload.referenceType === "delivery"
        ? "delivery"
        : payload.referenceType === "opening-debt"
          ? "opening-debt"
          : "receipt",
    receiptId: payload.receiptId ? Number(payload.receiptId) : null,
    deliveryId: payload.deliveryId ? Number(payload.deliveryId) : null,
    openingDebtId: payload.openingDebtId || "",
    partnerId: Number(payload.partnerId),
    partner: payload.partner,
    direction: payload.direction,
    status: payload.status || "Confirmat",
    amount: sanitizeNumber(payload.amount),
    appliedAmount: 0,
    advanceAmount: 0,
    source: payload.source || "direct",
    complaintId: payload.complaintId ? Number(payload.complaintId) : null,
    paymentType: payload.paymentType || "",
    note: payload.note || "",
    createdAt: new Date().toISOString()
  };

  if (!Array.isArray(state.transactions)) {
    state.transactions = [];
  }

  state.transactions.push(transaction);

  if (transaction.referenceType === "receipt") {
    const receipt = state.receipts.find((item) => item.id === transaction.receiptId);
    if (receipt) {
      const relatedTransactions = state.transactions.filter(
        (item) =>
          item.referenceType === "receipt" &&
          item.receiptId === receipt.id &&
          item.id !== transaction.id
      );
      const previouslyPaid = relatedTransactions.reduce(
        (sum, item) => sum + Number(item.appliedAmount || item.amount || 0),
        0
      );
      const targetAmount = Number(receipt.preliminaryPayableAmount || 0);
      const outstanding = Math.max(targetAmount - previouslyPaid, 0);
      const rawAmount = Number(transaction.amount || 0);

      if (rawAmount >= 0 && targetAmount > 0 && rawAmount > outstanding) {
        transaction.appliedAmount = outstanding;
        transaction.advanceAmount = rawAmount - outstanding;

        if (transaction.advanceAmount > 0) {
          if (!Array.isArray(state.partnerAdvances)) {
            state.partnerAdvances = [];
          }
          const advanceId = nextId(state.partnerAdvances);
          state.partnerAdvances.push({
            id: advanceId,
            partnerId: transaction.partnerId,
            partner: transaction.partner,
            transactionId: transaction.id,
            amount: transaction.advanceAmount,
            remainingAmount: transaction.advanceAmount,
            source: "overpayment",
            note: `Surplus din tranzactia #${transaction.id}`,
            createdAt: new Date().toISOString()
          });
          createAuditEntry(state, {
            entityType: "partner-advance",
            entityId: advanceId,
            action: "create",
            reason: `Avans creat din supra-plata tranzactie #${transaction.id}`,
            user: payload.createdBy || "dashboard",
            newValue: { partnerId: transaction.partnerId, amount: transaction.advanceAmount }
          });
        }
      } else {
        transaction.appliedAmount = rawAmount;
        transaction.advanceAmount = 0;
      }

      const totalApplied =
        previouslyPaid + Number(transaction.appliedAmount || 0);
      receipt.paidAmount = totalApplied;
      receipt.paymentStatus =
        totalApplied <= 0
          ? "Neachitat"
          : totalApplied < targetAmount
            ? "Partial"
            : "Achitat";
      receipt.updatedAt = new Date().toISOString();
    }
  }

  if (transaction.referenceType === "delivery") {
    transaction.appliedAmount = Number(transaction.amount || 0);
    const delivery = (state.deliveries || []).find((item) => item.id === transaction.deliveryId);
    if (delivery) {
      const relatedTransactions = state.transactions.filter(
        (item) => item.referenceType === "delivery" && item.deliveryId === delivery.id
      );
      const totalCollected = relatedTransactions.reduce(
        (sum, item) => sum + Number(item.amount || 0),
        0
      );
      const qty = Number(delivery.deliveredQuantity || delivery.netWeight || 0);
      const targetAmount = Number(delivery.contractPrice || 0) * qty;
      delivery.collectedAmount = totalCollected;
      delivery.collectionStatus =
        totalCollected <= 0 ? "Neincasat" : totalCollected < targetAmount ? "Partial incasat" : "Incasat";
      delivery.updatedAt = new Date().toISOString();
    }
  }

  if (transaction.referenceType === "opening-debt") {
    transaction.appliedAmount = Number(transaction.amount || 0);
    const openingDocuments = state.openingDocuments || [];
    const matchedDocument = openingDocuments.find((document) =>
      (document.debtItems || []).some((item) => item.openingDebtId === transaction.openingDebtId)
    );
    const debtItem = matchedDocument?.debtItems?.find(
      (item) => item.openingDebtId === transaction.openingDebtId
    );

    if (debtItem) {
      debtItem.settledAmount = Number(debtItem.settledAmount || 0) + Number(transaction.amount || 0);
      const targetAmount = Number(debtItem.amount || 0);
      debtItem.status =
        debtItem.direction === "collection"
          ? debtItem.settledAmount <= 0
            ? "Neincasat"
            : debtItem.settledAmount < targetAmount
              ? "Partial incasat"
              : "Incasat"
          : debtItem.settledAmount <= 0
            ? "Neachitat"
            : debtItem.settledAmount < targetAmount
              ? "Partial"
              : "Achitat";
    }
  }

  createAuditEntry(state, {
    entityType: "transaction",
    entityId: transaction.id,
    action: "create",
    reason: "Creare tranzactie",
    user: payload.createdBy || "dashboard",
    newValue: { ...transaction }
  });

  writeReceiptsState(state);
  return transaction;
}

async function applyAdvanceCredit(payload = {}) {
  const state = readReceiptsState();
  const partnerId = Number(payload.partnerId);
  const targetReceiptId = payload.targetReceiptId ? Number(payload.targetReceiptId) : null;
  const amountRequested = sanitizeNumber(payload.amount);
  const currentUser = payload.currentUser || {};

  if (!partnerId) {
    throw new Error("partnerId este obligatoriu.");
  }
  if (!targetReceiptId) {
    throw new Error("targetReceiptId este obligatoriu.");
  }
  if (amountRequested <= 0) {
    throw new Error("Suma pentru aplicare avans trebuie sa fie mai mare ca zero.");
  }

  const receipt = state.receipts.find((item) => item.id === targetReceiptId);
  if (!receipt) {
    throw new Error("Receptia tinta nu exista.");
  }

  const availableAdvances = (state.partnerAdvances || [])
    .filter((item) => Number(item.partnerId) === partnerId && Number(item.remainingAmount || 0) > 0)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  const totalAvailable = availableAdvances.reduce(
    (sum, item) => sum + Number(item.remainingAmount || 0),
    0
  );

  if (totalAvailable < amountRequested) {
    throw new Error(
      `Avans insuficient pentru partener. Disponibil: ${totalAvailable.toFixed(2)}, cerut: ${amountRequested.toFixed(2)}.`
    );
  }

  let remaining = amountRequested;
  const consumed = [];
  for (const advance of availableAdvances) {
    if (remaining <= 0) break;
    const take = Math.min(Number(advance.remainingAmount || 0), remaining);
    advance.remainingAmount = Number(advance.remainingAmount || 0) - take;
    advance.updatedAt = new Date().toISOString();
    consumed.push({ advanceId: advance.id, amount: take });
    remaining -= take;
  }

  const transaction = {
    id: nextId(state.transactions),
    referenceType: "receipt",
    receiptId: targetReceiptId,
    deliveryId: null,
    openingDebtId: "",
    partnerId,
    partner: receipt.supplier,
    direction: "payment",
    status: "Confirmat",
    amount: amountRequested,
    appliedAmount: amountRequested,
    advanceAmount: 0,
    source: "advance-applied",
    consumedAdvances: consumed,
    paymentType: "avans",
    note: `Aplicare avans pentru receptie #${targetReceiptId}`,
    createdAt: new Date().toISOString()
  };

  state.transactions.push(transaction);

  const relatedTransactions = state.transactions.filter(
    (item) => item.referenceType === "receipt" && item.receiptId === receipt.id
  );
  const totalApplied = relatedTransactions.reduce(
    (sum, item) => sum + Number(item.appliedAmount || item.amount || 0),
    0
  );
  const targetAmount = Number(receipt.preliminaryPayableAmount || 0);
  receipt.paidAmount = totalApplied;
  receipt.paymentStatus =
    totalApplied <= 0
      ? "Neachitat"
      : totalApplied < targetAmount
        ? "Partial"
        : "Achitat";
  receipt.updatedAt = new Date().toISOString();

  createAuditEntry(state, {
    entityType: "transaction",
    entityId: transaction.id,
    action: "apply-advance",
    reason: `Aplicare avans ${amountRequested} pentru receptie #${targetReceiptId}`,
    user: currentUser.name || currentUser.username || payload.createdBy || "dashboard",
    newValue: { ...transaction }
  });

  writeReceiptsState(state);
  return { transaction, consumed };
}

async function updateProcessing(id, payload = {}) {
  const state = readReceiptsState();
  const processing = (state.processings || []).find((item) => item.id === Number(id));

  if (!processing) {
    return null;
  }

  const reason = requiredChangeReason(payload.changeReason);
  const oldValue = {
    status: processing.status,
    note: processing.note
  };

  if (payload.status !== undefined) {
    const newStatus = requiredText(payload.status, "Status procesare");
    const oldStatus = processing.status;
    const wasInactive = oldStatus === "In lucru" || oldStatus === "Anulat";
    const willAffectStock = newStatus !== "In lucru" && newStatus !== "Anulat";
    // #8 re-verificat: la activarea unei procesari (model miscare) trebuie sa existe stoc.
    if (processing.movement === true && wasInactive && willAffectStock) {
      const summary = await getStockSummary();
      const available = Number(
        (summary.byLocation.find(
          (i) => sameLocation(i.location, processing.sourceLocation) && i.product === processing.product
        ) || {}).quantity || 0
      );
      const requestedQty = Number(processing.processedQuantity || 0);
      if (Math.round(requestedQty * 1000) > Math.round(available * 1000)) {
        throw new Error(
          `Stoc insuficient pentru ${processing.product} in ${processing.sourceLocation}: disponibil ${Math.round(available * 1000)} kg, necesar ${Math.round(requestedQty * 1000)} kg.`
        );
      }
    }

    // FINALIZARE procesare "in lucru": recalculam outputul cu parametrii finali
    // (deseu la curatire / umiditate la uscare) si aplicam cilindrul destinatie + regula un-produs.
    const isFinalizing =
      oldStatus === "In lucru" &&
      willAffectStock &&
      (payload.destLocation !== undefined ||
        payload.confirmedWaste !== undefined ||
        payload.finalHumidity !== undefined ||
        payload.initialHumidity !== undefined);
    if (isFinalizing) {
      const cfg = readConfigState();
      const lossMethod = resolveLossMethod(
        cfg.processingTypes.find((t) => t.name === processing.processingType) || {
          name: processing.processingType
        }
      );
      const usesHumidity = lossMethod === "umiditate";
      const destLocation =
        (payload.destLocation && String(payload.destLocation)) ||
        processing.destLocation ||
        processing.sourceLocation;
      if (
        (lossMethod === "umiditate" || lossMethod === "deseu") &&
        !payload.destLocation &&
        (!processing.destLocation || processing.destLocation === processing.sourceLocation)
      ) {
        throw new Error("Alege cilindrul destinatie pentru a finaliza procesarea.");
      }
      const processedQuantity = Number(processing.processedQuantity || 0);
      const confirmedWaste = lossMethod === "deseu" ? sanitizeNumber(payload.confirmedWaste) : 0;
      const initialHumidity = usesHumidity ? sanitizeNumber(payload.initialHumidity) : 0;
      const finalHumidity = usesHumidity ? sanitizeNumber(payload.finalHumidity) : 0;
      if (usesHumidity && (!(initialHumidity > 0) || !(finalHumidity > 0))) {
        throw new Error("La uscare, completeaza umiditatea initiala si finala pentru a finaliza.");
      }
      if (usesHumidity && initialHumidity > 0 && finalHumidity > initialHumidity) {
        throw new Error("Umiditatea finala nu poate fi mai mare decat cea initiala la uscare.");
      }
      const humidityDrop = Math.max(initialHumidity - finalHumidity, 0);
      const waterRemoved =
        usesHumidity && initialHumidity > 0 && finalHumidity > 0
          ? Number(((processedQuantity * humidityDrop) / 100).toFixed(3))
          : 0;
      if (confirmedWaste + waterRemoved >= processedQuantity) {
        throw new Error(
          `Deseu (${(confirmedWaste * 1000).toFixed(0)} kg) + apa (${(waterRemoved * 1000).toFixed(0)} kg) depasesc cantitatea procesata (${(processedQuantity * 1000).toFixed(0)} kg). Verifica valorile.`
        );
      }
      const outputQuantity = Math.max(processedQuantity - confirmedWaste - waterRemoved, 0);
      const finalizeSummary = await getStockSummary();
      const destConflict = findCylinderConflict(
        finalizeSummary,
        cfg.storageLocations.find((l) => l.name === destLocation),
        processing.product
      );
      if (destConflict && !payload.allowMixedProduct) {
        throw new Error(
          `Locația ${destLocation} contine deja ${destConflict} (o locație = un singur produs). Confirma pe ecran sau reincarca pagina.`
        );
      }
      processing.destLocation = destLocation;
      processing.lossMethod = lossMethod;
      processing.confirmedWaste = confirmedWaste;
      processing.initialHumidity = initialHumidity;
      processing.finalHumidity = finalHumidity;
      processing.waterRemoved = waterRemoved;
      processing.outputQuantity = outputQuantity;
      processing.finalNetQuantity = outputQuantity;
      processing.mixedProductConfirmed = !!destConflict;
    }

    processing.status = newStatus;
  }

  if (payload.note !== undefined) {
    processing.note = String(payload.note || "").trim();
  }

  processing.updatedAt = new Date().toISOString();

  createAuditEntry(state, {
    entityType: "processing",
    entityId: processing.id,
    action: "update",
    reason,
    user: payload.changedBy || "dashboard",
    oldValue,
    newValue: {
      status: processing.status,
      note: processing.note
    }
  });

  writeReceiptsState(state);
  return processing;
}

async function updateTransaction(id, payload = {}) {
  const state = readReceiptsState();
  const transaction = (state.transactions || []).find((item) => item.id === Number(id));

  if (!transaction) {
    return null;
  }

  const reason = requiredChangeReason(payload.changeReason);
  const oldValue = {
    status: transaction.status,
    note: transaction.note,
    paymentType: transaction.paymentType
  };

  if (payload.status !== undefined) {
    transaction.status = requiredText(payload.status, "Status tranzactie");
  }

  if (payload.note !== undefined) {
    transaction.note = String(payload.note || "").trim();
  }

  if (payload.paymentType !== undefined) {
    transaction.paymentType = String(payload.paymentType || "").trim();
  }

  transaction.updatedAt = new Date().toISOString();

  createAuditEntry(state, {
    entityType: "transaction",
    entityId: transaction.id,
    action: "update",
    reason,
    user: payload.changedBy || "dashboard",
    oldValue,
    newValue: {
      status: transaction.status,
      note: transaction.note,
      paymentType: transaction.paymentType
    }
  });

  writeReceiptsState(state);
  return transaction;
}

async function createDelivery(payload) {
  const state = readReceiptsState();

  // Doua moduri: pe receptie (vechi) sau pe PRODUS + cilindru sursa (nou, #14).
  const receipt = payload.receiptId
    ? state.receipts.find((item) => item.id === Number(payload.receiptId))
    : null;
  if (payload.receiptId && !receipt) {
    throw new Error("Receptia selectata nu exista.");
  }
  if (receipt && receipt.status === "Inchis") {
    throw new Error("Receptia este inchisa. Nu se poate crea livrare.");
  }

  const config = readConfigState();
  const productName = receipt
    ? receipt.product
    : payload.product ||
      (config.products.find((p) => Number(p.id) === Number(payload.productId)) || {}).name ||
      "";
  const sourceLocation = receipt
    ? receipt.location || ""
    : payload.sourceLocation ||
      (config.storageLocations.find((l) => Number(l.id) === Number(payload.sourceLocationId)) || {}).name ||
      "";

  if (!productName) {
    throw new Error("Selecteaza produsul de livrat.");
  }
  if (!sourceLocation) {
    throw new Error("Selecteaza cilindrul / locatia sursa.");
  }

  // Masa: brut − tara = net (daca sunt introduse), altfel cantitatea directa.
  const grossWeight = sanitizeNumber(payload.grossWeight);
  const tareWeight = sanitizeNumber(payload.tareWeight);
  const netFromMass = grossWeight > 0 ? Math.max(grossWeight - tareWeight, 0) : 0;
  const plannedQuantity = sanitizeNumber(
    payload.plannedQuantity ?? (netFromMass > 0 ? netFromMass : payload.deliveredQuantity)
  );

  if (plannedQuantity <= 0) {
    throw new Error("Cantitatea de livrare trebuie sa fie mai mare ca zero.");
  }

  if (receipt) {
    const availableQuantity = getReceiptAvailableQuantity(state, payload.receiptId);
    if (plannedQuantity > availableQuantity) {
      throw new Error("Cantitatea planificata depaseste stocul disponibil pentru receptie.");
    }
  } else {
    // #14: plafon pe stocul produsului in locatia sursa.
    const summary = await getStockSummary();
    const inStock = Number(
      (summary.byLocation.find(
        (i) => sameLocation(i.location, sourceLocation) && i.product === productName
      ) || {}).quantity || 0
    );
    // Rezervare: livrarile pe produs inca nelivrate (deliveredQuantity 0) nu au scazut
    // inca stocul, dar sunt deja promise — le scadem ca sa nu promitem mai mult decat exista.
    // NOTA (model "livrare imediata"): orice livrare se creeaza acum direct "Livrat" cu
    // deliveredQuantity > 0, iar getStockSummary scade deja aceste cantitati din `inStock`.
    // Deci reservedPending e de regula 0 — ramane ca plasa de siguranta pentru livrari
    // ramase (legacy/edge) cu deliveredQuantity === 0. inStock proaspat la fiecare cerere
    // previne supra-vanzarea (serverless: stare reincarcata din KV per request).
    const reservedPending = (state.deliveries || [])
      .filter(
        (d) =>
          !d.receiptId &&
          d.product === productName &&
          sameLocation(d.location, sourceLocation) &&
          Number(d.deliveredQuantity || 0) === 0 &&
          ["Proiect", "Confirmat", "Redeschis"].includes(d.status)
      )
      .reduce((sum, d) => sum + Number(d.plannedQuantity || 0), 0);
    const available = inStock - reservedPending;
    if (Math.round(plannedQuantity * 1000) > Math.round(available * 1000)) {
      throw new Error(
        `Stoc insuficient pentru ${productName} in ${sourceLocation}: disponibil ${Math.round(available * 1000)} kg (din ${Math.round(inStock * 1000)} kg, rezervat ${Math.round(reservedPending * 1000)} kg), cerut ${Math.round(plannedQuantity * 1000)} kg.`
      );
    }
  }

  const delivery = {
    id: nextId(state.deliveries),
    receiptId: receipt ? Number(payload.receiptId) : null,
    customerId: payload.customerId ? Number(payload.customerId) : null,
    customer: payload.customer || "",
    product: productName,
    location: sourceLocation,
    vehicle: payload.vehicle || "",
    contractNumber: payload.contractNumber || "",
    contractDate: payload.contractDate || "",
    contractPrice: sanitizeNumber(payload.contractPrice),
    // Câmpuri de facturare (introduse de contabil) — Etapa 4 + Modul B
    seller: payload.seller || "",
    sellerId: payload.sellerId ? Number(payload.sellerId) : null,
    priceForeign: sanitizeNumber(payload.priceForeign),
    currency: String(payload.currency || "MDL").trim().toUpperCase() || "MDL",
    exchangeRate: sanitizeNumber(payload.exchangeRate) || (String(payload.currency || "MDL").toUpperCase() === "MDL" ? 1 : 0),
    // priceLei calculat din preț valută × curs (sau direct dacă MDL)
    priceLei: sanitizeNumber(payload.priceForeign) * (sanitizeNumber(payload.exchangeRate) || (String(payload.currency || "MDL").toUpperCase() === "MDL" ? 1 : 0)) || sanitizeNumber(payload.priceLei),
    invoiceDate: payload.invoiceDate || "",
    plannedQuantity,
    // Livrare imediată: scade stocul pe loc (operatorul se așteaptă ca livrarea =
    // ieșire reală din stoc, nu doar rezervare). Astfel dashboard-ul se actualizează
    // și nu se acumulează rezervări fantomă.
    deliveredQuantity: plannedQuantity,
    grossWeight,
    tareWeight,
    netWeight: netFromMass > 0 ? netFromMass : plannedQuantity,
    quantityAtDelivery: plannedQuantity,
    // Marcaj: livrarea a fost introdusa in kg. Vechile livrari nu au acest camp -> afisate in tone.
    enteredUnit: payload.enteredUnit === "kg" ? "kg" : "tone",
    invoiceNumber: payload.invoiceNumber || "",
    note: payload.note || "",
    photos: sanitizePhotos(payload.photos),
    status: "Livrat",
    confirmedAt: new Date().toISOString(),
    deliveredAt: new Date().toISOString(),
    closedAt: null,
    canceledAt: null,
    changedBy: payload.createdBy || "dashboard",
    complaintStatus: null,
    createdAt: new Date().toISOString()
  };

  if (!Array.isArray(state.deliveries)) {
    state.deliveries = [];
  }

  state.deliveries.push(delivery);
  if (receipt) recalcReceiptDeliveryState(state, receipt.id);

  createAuditEntry(state, {
    entityType: "delivery",
    entityId: delivery.id,
    action: "create",
    reason: "Creare livrare",
    user: payload.createdBy || "dashboard",
    newValue: { ...delivery }
  });

  writeReceiptsState(state);
  return delivery;
}

async function transitionDelivery(id, newStatus, payload = {}) {
  const state = readReceiptsState();
  const delivery = (state.deliveries || []).find((item) => item.id === Number(id));

  if (!delivery) {
    return null;
  }

  if (!DELIVERY_STATUSES.includes(newStatus)) {
    throw new Error(`Status livrare invalid: ${newStatus}.`);
  }

  const currentStatus = delivery.status || "Proiect";
  const allowedNext = DELIVERY_TRANSITIONS[currentStatus] || [];
  if (!allowedNext.includes(newStatus)) {
    throw new Error(
      `Tranzitie invalida: ${currentStatus} -> ${newStatus}. Permise: ${allowedNext.join(", ") || "niciuna"}.`
    );
  }

  const receipt = state.receipts.find((item) => item.id === delivery.receiptId);

  if (receipt && receipt.status === "Inchis" && newStatus !== "Redeschis") {
    throw new Error("Receptia este inchisa. Nu se poate schimba statusul livrarii.");
  }

  const currentUser = payload.currentUser || {};
  const changedBy = payload.changedBy || currentUser.name || currentUser.username || "dashboard";
  const requireReason =
    newStatus === "Anulat" || newStatus === "Redeschis" || newStatus === "Inchis";
  const reason = requireReason
    ? requiredChangeReason(payload.changeReason)
    : String(payload.changeReason || "Tranzitie livrare").trim() || "Tranzitie livrare";

  const oldValue = { status: currentStatus, deliveredQuantity: delivery.deliveredQuantity };
  const now = new Date().toISOString();

  if (newStatus === "Livrat") {
    const grossWeight = sanitizeNumber(payload.grossWeight ?? delivery.grossWeight);
    const tareWeight = sanitizeNumber(payload.tareWeight ?? delivery.tareWeight);
    const providedNet = sanitizeNumber(payload.netWeight);
    const netWeight = providedNet > 0 ? providedNet : grossWeight - tareWeight;

    if (grossWeight <= 0) {
      throw new Error("grossWeight obligatoriu la livrare (> 0).");
    }
    if (tareWeight < 0) {
      throw new Error("tareWeight trebuie sa fie >= 0.");
    }
    if (netWeight <= 0) {
      throw new Error("netWeight trebuie sa fie > 0 (gross - tara).");
    }

    delivery.grossWeight = grossWeight;
    delivery.tareWeight = tareWeight;
    delivery.netWeight = netWeight;
    delivery.quantityAtDelivery = netWeight;
    delivery.deliveredQuantity = netWeight;
    delivery.deliveredAt = now;
  }

  if (newStatus === "Confirmat") {
    delivery.confirmedAt = now;
  }

  if (newStatus === "Inchis") {
    delivery.closedAt = now;
  }

  if (newStatus === "Anulat") {
    delivery.canceledAt = now;
    delivery.cancelReason = String(payload.changeReason || payload.reason || "").trim();
    delivery.canceledByRole = (payload.currentUser && payload.currentUser.roleCode) || "";
  }

  delivery.status = newStatus;
  delivery.changedBy = changedBy;
  delivery.updatedAt = now;

  if (receipt) {
    recalcReceiptDeliveryState(state, receipt.id);
  }

  createAuditEntry(state, {
    entityType: "delivery",
    entityId: delivery.id,
    action: `transition-${newStatus.toLowerCase()}`,
    reason,
    user: changedBy,
    oldValue,
    newValue: {
      status: delivery.status,
      deliveredQuantity: delivery.deliveredQuantity,
      netWeight: delivery.netWeight
    }
  });

  writeReceiptsState(state);
  return delivery;
}

async function createComplaint(payload) {
  const state = readReceiptsState();
  // Livrarea e OPȚIONALĂ acum: reclamația se leagă de firmă + produs (REC).
  const delivery = payload.deliveryId
    ? (state.deliveries || []).find((item) => item.id === Number(payload.deliveryId))
    : null;

  // Determinăm firma (cumpărător) și produsul: din livrare dacă există, altfel din payload.
  let customer = delivery ? delivery.customer : (payload.customer || "");
  const product = delivery ? delivery.product : requiredText(payload.product, "Produsul reclamat");
  if (!customer && payload.customerId) {
    const config = readConfigState();
    const partner = (config.partners || []).find((p) => Number(p.id) === Number(payload.customerId));
    customer = partner ? partner.name : "";
  }
  if (!customer) {
    throw new Error("Selectează firma (cumpărătorul).");
  }

  // Suma totală a livrării (informativ) + cantitatea inițială (doar dacă există livrare)
  const deliveryQty = delivery
    ? Number(delivery.netWeight > 0 ? delivery.netWeight : delivery.deliveredQuantity || delivery.plannedQuantity || 0)
    : 0;
  // Suma totală a livrării — aceeași convenție ca pe factură:
  //  MDL → kg × lei/kg;  valută (EUR/USD/RON) → tone × preț/tonă × curs.
  const deliveryTotal = delivery
    ? (String(delivery.currency || "MDL") !== "MDL" && Number(delivery.priceForeign) > 0
        ? deliveryQty * Number(delivery.priceForeign) * Number(delivery.exchangeRate || 0)
        : deliveryQty * 1000 * Number(delivery.priceLei || 0))
    : 0;

  const complaint = {
    id: nextId(state.complaints),
    deliveryId: delivery ? Number(payload.deliveryId) : null,
    customerId: payload.customerId ? Number(payload.customerId) : (delivery ? delivery.customerId : null),
    customer,
    product,
    contestedQuantity: sanitizeNumber(payload.contestedQuantity),
    // Modul D: reclamația NU modifică stocul — doar suma de încasat
    deductedAmount: sanitizeNumber(payload.deductedAmount),
    deliveryQuantity: deliveryQty,
    deliveryTotal,
    complaintType: requiredText(payload.complaintType, "Tipul reclamatiei"),
    status: payload.status || "Deschisa",
    resolutionType: payload.resolutionType || "",
    invoiceAdjustment: null,
    stockCorrection: null,
    acceptedBy: null,
    acceptedAt: null,
    closedBy: null,
    closedAt: null,
    exportedTo1C: false,
    note: payload.note || "",
    createdAt: new Date().toISOString()
  };

  if (!Array.isArray(state.complaints)) {
    state.complaints = [];
  }

  state.complaints.push(complaint);
  if (delivery) {
    delivery.complaintStatus = complaint.status;
    delivery.updatedAt = new Date().toISOString();
    recalcReceiptComplaintFlag(state, delivery.receiptId);
  }

  createAuditEntry(state, {
    entityType: "complaint",
    entityId: complaint.id,
    action: "create",
    reason: "Creare reclamatie",
    user: payload.createdBy || "dashboard",
    newValue: { ...complaint }
  });

  writeReceiptsState(state);
  return complaint;
}

async function updateDelivery(id, payload = {}) {
  const state = readReceiptsState();
  const delivery = (state.deliveries || []).find((item) => item.id === Number(id));

  if (!delivery) {
    return null;
  }

  const reason = requiredChangeReason(payload.changeReason);
  const oldValue = {
    note: delivery.note,
    invoiceNumber: delivery.invoiceNumber,
    seller: delivery.seller,
    priceLei: delivery.priceLei,
    priceForeign: delivery.priceForeign,
    currency: delivery.currency,
    contractNumber: delivery.contractNumber,
    contractDate: delivery.contractDate,
    vehicle: delivery.vehicle
  };

  if (payload.note !== undefined) {
    delivery.note = String(payload.note || "").trim();
  }
  if (payload.photos !== undefined) {
    delivery.photos = sanitizePhotos(payload.photos);
  }
  if (payload.invoiceNumber !== undefined) {
    delivery.invoiceNumber = String(payload.invoiceNumber || "").trim();
  }
  // Câmpuri de facturare editabile de contabil — Etapa 4
  if (payload.seller !== undefined) {
    delivery.seller = String(payload.seller || "").trim();
  }
  if (payload.priceLei !== undefined) {
    delivery.priceLei = sanitizeNumber(payload.priceLei);
  }
  if (payload.priceForeign !== undefined) {
    delivery.priceForeign = sanitizeNumber(payload.priceForeign);
  }
  if (payload.currency !== undefined) {
    delivery.currency = String(payload.currency || "MDL").trim().toUpperCase() || "MDL";
  }
  if (payload.exchangeRate !== undefined) {
    delivery.exchangeRate = sanitizeNumber(payload.exchangeRate);
  }
  if (payload.sellerId !== undefined) {
    delivery.sellerId = payload.sellerId ? Number(payload.sellerId) : null;
  }
  // Cotă TVA: "-" (fără TVA) sau număr (0/8/20)
  if (payload.vatRate !== undefined) {
    delivery.vatRate = payload.vatRate === "-" || payload.vatRate === null || payload.vatRate === "" ? "-" : Number(payload.vatRate);
  }
  // Status achitare factură de către cumpărător (FACT)
  if (payload.invoicePaid !== undefined) {
    delivery.invoicePaid = payload.invoicePaid === true || payload.invoicePaid === "true" || payload.invoicePaid === "Achitată";
  }
  if (payload.invoiceDate !== undefined) {
    delivery.invoiceDate = String(payload.invoiceDate || "").trim();
  }
  if (payload.contractNumber !== undefined) {
    delivery.contractNumber = String(payload.contractNumber || "").trim();
  }
  if (payload.contractDate !== undefined) {
    delivery.contractDate = String(payload.contractDate || "").trim();
  }
  if (payload.vehicle !== undefined) {
    delivery.vehicle = String(payload.vehicle || "").trim();
  }
  // Recompute priceLei = preț valută × curs (if both present)
  if (payload.priceForeign !== undefined || payload.exchangeRate !== undefined) {
    const pf = Number(delivery.priceForeign || 0);
    const rate = Number(delivery.exchangeRate || (delivery.currency === "MDL" ? 1 : 0));
    if (pf > 0 && rate > 0) {
      delivery.priceLei = pf * rate;
    } else if (payload.priceLei !== undefined) {
      delivery.priceLei = sanitizeNumber(payload.priceLei);
    }
  } else if (payload.priceLei !== undefined) {
    delivery.priceLei = sanitizeNumber(payload.priceLei);
  }

  delivery.updatedAt = new Date().toISOString();

  createAuditEntry(state, {
    entityType: "delivery",
    entityId: delivery.id,
    action: "update",
    reason,
    user: payload.changedBy || "dashboard",
    oldValue,
    newValue: {
      note: delivery.note,
      invoiceNumber: delivery.invoiceNumber,
      seller: delivery.seller,
      priceLei: delivery.priceLei,
      priceForeign: delivery.priceForeign,
      currency: delivery.currency,
      contractNumber: delivery.contractNumber,
      contractDate: delivery.contractDate,
      vehicle: delivery.vehicle
    }
  });

  writeReceiptsState(state);
  return delivery;
}

async function updateComplaint(id, payload = {}) {
  const state = readReceiptsState();
  const complaint = (state.complaints || []).find((item) => item.id === Number(id));

  if (!complaint) {
    return null;
  }

  const reason = requiredChangeReason(payload.changeReason);
  const currentUser = payload.currentUser || {};
  const roleCode = currentUser.roleCode || payload.roleCode || "";
  const changedBy = payload.changedBy || currentUser.name || currentUser.username || "dashboard";

  const stockCorrection = payload.stockCorrection || null;
  const invoiceAdjustment = payload.invoiceAdjustment || null;

  const canStockCorrect = ["accountant-sef", "manager", "admin"].includes(roleCode);
  const canInvoiceAdjust = ["accountant-sef", "accountant", "manager", "admin"].includes(roleCode);

  if (stockCorrection && !canStockCorrect) {
    const err = new Error("Nu ai drepturi pentru corectie de stoc.");
    err.statusCode = 403;
    throw err;
  }

  if (invoiceAdjustment && !canInvoiceAdjust) {
    const err = new Error("Nu ai drepturi pentru ajustare factura.");
    err.statusCode = 403;
    throw err;
  }

  const oldValue = {
    status: complaint.status,
    resolutionType: complaint.resolutionType,
    note: complaint.note,
    invoiceAdjustment: complaint.invoiceAdjustment,
    stockCorrection: complaint.stockCorrection
  };

  const now = new Date().toISOString();
  const newStatus = payload.status !== undefined ? requiredText(payload.status, "Status reclamatie") : complaint.status;

  if (!COMPLAINT_STATUSES.includes(newStatus)) {
    throw new Error(`Status reclamatie invalid: ${newStatus}.`);
  }

  let stockDelta = 0;
  let compensatoryTransactionId = null;

  if (newStatus === "Acceptata" && stockCorrection) {
    const targetDeliveryId = Number(stockCorrection.deliveryId || complaint.deliveryId);
    const delta = sanitizeNumber(stockCorrection.deltaQuantity);
    const delivery = (state.deliveries || []).find((item) => item.id === targetDeliveryId);
    if (!delivery) {
      throw new Error("Livrarea pentru corectie de stoc nu exista.");
    }
    const nextDelivered = Number(delivery.deliveredQuantity || 0) + delta;
    if (nextDelivered < 0) {
      throw new Error("Corectia de stoc ar rezulta in cantitate negativa.");
    }
    delivery.deliveredQuantity = nextDelivered;
    if (delivery.netWeight !== undefined) {
      delivery.netWeight = Math.max(Number(delivery.netWeight || 0) + delta, 0);
    }
    delivery.updatedAt = now;
    recalcReceiptDeliveryState(state, delivery.receiptId);
    stockDelta = delta;
    complaint.stockCorrection = {
      deliveryId: targetDeliveryId,
      deltaQuantity: delta,
      note: String(stockCorrection.note || "").trim()
    };
  }

  if (newStatus === "Acceptata" && invoiceAdjustment) {
    const amount = sanitizeNumber(invoiceAdjustment.amount);
    if (amount === 0) {
      throw new Error("Suma ajustarii facturii nu poate fi zero.");
    }
    const delivery = (state.deliveries || []).find((item) => item.id === complaint.deliveryId);
    const receipt = delivery ? state.receipts.find((item) => item.id === delivery.receiptId) : null;

    const compensatory = {
      id: nextId(state.transactions),
      referenceType: receipt ? "receipt" : "delivery",
      receiptId: receipt ? receipt.id : null,
      deliveryId: delivery ? delivery.id : null,
      openingDebtId: "",
      partnerId: receipt ? receipt.supplierId : delivery ? delivery.customerId : null,
      partner: receipt ? receipt.supplier : delivery ? delivery.customer : "",
      direction: "payment",
      status: "Confirmat",
      amount,
      appliedAmount: amount,
      advanceAmount: 0,
      source: "complaint-adjustment",
      complaintId: complaint.id,
      paymentType: "",
      note: `Ajustare factura reclamatie #${complaint.id}: ${invoiceAdjustment.type || "adjust"}`,
      createdAt: now
    };

    if (!Array.isArray(state.transactions)) {
      state.transactions = [];
    }
    state.transactions.push(compensatory);
    compensatoryTransactionId = compensatory.id;

    complaint.invoiceAdjustment = {
      type: String(invoiceAdjustment.type || "adjust").trim(),
      amount,
      invoiceRef: String(invoiceAdjustment.invoiceRef || "").trim(),
      note: String(invoiceAdjustment.note || "").trim(),
      compensatoryTransactionId
    };

    createAuditEntry(state, {
      entityType: "transaction",
      entityId: compensatory.id,
      action: "create",
      reason: `Ajustare compensatorie reclamatie #${complaint.id}`,
      user: changedBy,
      newValue: { ...compensatory }
    });
  }

  if (newStatus !== complaint.status) {
    complaint.status = newStatus;
    if (newStatus === "Acceptata") {
      complaint.acceptedAt = now;
      complaint.acceptedBy = changedBy;
    }
    if (newStatus === "Inchisa") {
      complaint.closedAt = now;
      complaint.closedBy = changedBy;
    }
  }

  if (payload.resolutionType !== undefined) {
    complaint.resolutionType = String(payload.resolutionType || "").trim();
  }

  if (payload.note !== undefined) {
    complaint.note = String(payload.note || "").trim();
  }

  if (payload.exportedTo1C !== undefined) {
    complaint.exportedTo1C = sanitizeBoolean(payload.exportedTo1C);
  }

  complaint.updatedAt = now;

  const delivery = (state.deliveries || []).find((item) => item.id === complaint.deliveryId);
  if (delivery) {
    delivery.complaintStatus = complaint.status;
    delivery.updatedAt = now;
    recalcReceiptComplaintFlag(state, delivery.receiptId);
  }

  createAuditEntry(state, {
    entityType: "complaint",
    entityId: complaint.id,
    action: "update",
    reason,
    user: changedBy,
    oldValue,
    newValue: {
      status: complaint.status,
      resolutionType: complaint.resolutionType,
      note: complaint.note,
      stockDelta,
      stockCorrection: complaint.stockCorrection,
      invoiceAdjustment: complaint.invoiceAdjustment,
      compensatoryTransactionId
    }
  });

  writeReceiptsState(state);
  return complaint;
}

// Cantar in 2 pasi: nu se intra manual in "In descarcare" si nu se iese din ea prin schimbarea
// generica de status (finalizarea se face prin completeReceiptWeighing). Exceptie permisa: anulare.
function assertReceiptStatusTransition(currentStatus, nextStatus) {
  if (nextStatus === "In descarcare") {
    throw new Error("Statusul \"In descarcare\" se seteaza doar la prima cantarire.");
  }
  if (currentStatus === "In descarcare" && nextStatus !== "Anulat") {
    throw new Error("Receptia in descarcare se finalizeaza prin a doua cantarire (tara) sau se anuleaza.");
  }
}

async function updateReceiptStatus(id, status) {
  const state = readReceiptsState();
  const receipt = state.receipts.find((item) => item.id === Number(id));

  if (!receipt) {
    return null;
  }

  assertReceiptStatusTransition(receipt.status, status);
  receipt.status = status;
  receipt.updatedAt = new Date().toISOString();
  writeReceiptsState(state);
  return receipt;
}

async function updateReceiptStatusWithAudit(id, status, payload = {}) {
  const state = readReceiptsState();
  const receipt = state.receipts.find((item) => item.id === Number(id));

  if (!receipt) {
    return null;
  }

  const reason = requiredChangeReason(payload.changeReason);
  const oldValue = { status: receipt.status };

  assertReceiptStatusTransition(receipt.status, status);
  receipt.status = status;
  receipt.updatedAt = new Date().toISOString();

  createAuditEntry(state, {
    entityType: "receipt",
    entityId: receipt.id,
    action: "status-update",
    reason,
    user: payload.changedBy || "dashboard",
    oldValue,
    newValue: { status: receipt.status }
  });

  writeReceiptsState(state);
  return receipt;
}

// Furnizor temporar adaugat rapid de operator la receptie (doar numele).
// Contabilul il completeaza ulterior in Nomenclator -> Parteneri si il valideaza.
async function createQuickSupplier(name, changedBy) {
  const cleanName = String(name || "").trim();
  if (!cleanName) {
    throw new Error("Introdu numele furnizorului nou.");
  }
  return createConfigEntry("partners", {
    name: cleanName,
    role: "furnizor",
    fiscalProfile: "Persoana fizica",
    status: "temporar",
    allowDuplicateName: true,
    changeReason: "Furnizor temporar adaugat de operator la receptie",
    changedBy: changedBy || "operator"
  });
}

// Contabilul poate corecta DOAR furnizorul unei receptii deja introduse.
// Restul datelor din receptie raman neschimbate.
async function updateReceiptSupplier(id, partnerId, changedBy) {
  const state = readReceiptsState();
  const receipt = state.receipts.find((item) => item.id === Number(id));
  if (!receipt) {
    throw new Error("Receptia nu a fost gasita.");
  }

  const config = readConfigState();
  const partner = (config.partners || []).find((item) => item.id === Number(partnerId));
  if (!partner) {
    throw new Error("Furnizorul selectat nu exista.");
  }

  const oldValue = { supplier: receipt.supplier, supplierId: receipt.supplierId };
  receipt.supplier = partner.name;
  receipt.supplierId = partner.id;
  receipt.updatedAt = new Date().toISOString();

  createAuditEntry(state, {
    entityType: "receipt",
    entityId: receipt.id,
    action: "receipt-change-supplier",
    reason: "Corectare furnizor de catre contabil",
    user: changedBy || "dashboard",
    oldValue,
    newValue: { supplier: receipt.supplier, supplierId: receipt.supplierId }
  });

  writeReceiptsState(state);
  return receipt;
}

// --- Stergere partener cu reatribuire referinte (merge duplicat) ---
function countPartnerReferences(partnerId) {
  const pid = Number(partnerId);
  const state = readReceiptsState();
  const config = readConfigState();
  const partner = (config.partners || []).find((item) => Number(item.id) === pid);
  const name = partner ? String(partner.name || "").trim().toLowerCase() : "";

  const receipts = (state.receipts || []).filter((r) => Number(r.supplierId) === pid).length;
  const transactions = (state.transactions || []).filter((t) => Number(t.partnerId) === pid).length;
  const deliveriesCustomer = (state.deliveries || []).filter((d) => Number(d.customerId) === pid).length;
  const deliveriesSeller = (state.deliveries || []).filter((d) => Number(d.sellerId) === pid).length;
  const complaints = (state.complaints || []).filter((c) => Number(c.customerId) === pid).length;
  const advances = (state.partnerAdvances || []).filter((a) => Number(a.partnerId) === pid).length;
  const openingDebts = (state.openingDocuments || []).reduce(
    (sum, doc) => sum + (doc.debtItems || []).filter((it) => Number(it.partnerId) === pid).length,
    0
  );
  const tariffsByName = name
    ? (config.tariffs || []).filter((t) => String(t.partner || "").trim().toLowerCase() === name).length
    : 0;

  const hardTotal =
    receipts + transactions + deliveriesCustomer + deliveriesSeller + complaints + advances + openingDebts;
  return {
    receipts,
    transactions,
    deliveriesCustomer,
    deliveriesSeller,
    complaints,
    advances,
    openingDebts,
    tariffsByName,
    hardTotal
  };
}

function reassignPartnerReferences(oldId, newId, changedBy) {
  const from = Number(oldId);
  const to = Number(newId);
  if (from === to) {
    throw new Error("Partenerul de reatribuire trebuie sa fie diferit.");
  }

  const config = readConfigState();
  const target = (config.partners || []).find((p) => Number(p.id) === to);
  if (!target) {
    throw new Error("Partenerul de reatribuire nu exista.");
  }
  const source = (config.partners || []).find((p) => Number(p.id) === from);
  const oldName = source ? String(source.name || "") : "";
  const newName = String(target.name || "");

  const state = readReceiptsState();
  const counts = {
    receipts: 0,
    transactions: 0,
    deliveriesCustomer: 0,
    deliveriesSeller: 0,
    complaints: 0,
    advances: 0,
    openingDebts: 0
  };

  for (const r of state.receipts || []) {
    if (Number(r.supplierId) === from) {
      r.supplierId = to;
      r.supplier = newName;
      counts.receipts += 1;
    }
  }
  for (const t of state.transactions || []) {
    if (Number(t.partnerId) === from) {
      t.partnerId = to;
      t.partner = newName;
      counts.transactions += 1;
    }
    // Defensiv: camp legacy folosit la potrivire in getSupplierStatement.
    if (Number(t.supplierId) === from) {
      t.supplierId = to;
    }
  }
  for (const d of state.deliveries || []) {
    if (Number(d.customerId) === from) {
      d.customerId = to;
      d.customer = newName;
      counts.deliveriesCustomer += 1;
    }
    if (Number(d.sellerId) === from) {
      d.sellerId = to;
      d.seller = newName;
      counts.deliveriesSeller += 1;
    }
  }
  for (const c of state.complaints || []) {
    if (Number(c.customerId) === from) {
      c.customerId = to;
      c.customer = newName;
      counts.complaints += 1;
    }
  }
  for (const a of state.partnerAdvances || []) {
    if (Number(a.partnerId) === from) {
      a.partnerId = to;
      a.partner = newName;
      counts.advances += 1;
    }
  }
  for (const doc of state.openingDocuments || []) {
    for (const it of doc.debtItems || []) {
      if (Number(it.partnerId) === from) {
        it.partnerId = to;
        it.partner = newName;
        counts.openingDebts += 1;
      }
    }
  }

  createAuditEntry(state, {
    entityType: "partner",
    entityId: from,
    action: "partner-merge",
    reason: `Reatribuire referinte partener #${from} -> #${to}`,
    user: changedBy || "dashboard",
    oldValue: { partnerId: from, name: oldName },
    newValue: { partnerId: to, name: newName, counts }
  });
  writeReceiptsState(state);

  if (oldName) {
    const oldNameKey = oldName.trim().toLowerCase();
    let touched = 0;
    for (const tariff of config.tariffs || []) {
      if (String(tariff.partner || "").trim().toLowerCase() === oldNameKey) {
        tariff.partner = newName;
        touched += 1;
      }
    }
    if (touched) {
      writeConfigState(config);
    }
  }
  return counts;
}

async function deletePartner(id, payload = {}) {
  const pid = Number(id);
  const config = readConfigState();
  const exists = (config.partners || []).some((p) => Number(p.id) === pid);
  if (!exists) {
    return { status: "not-found" };
  }

  const refs = countPartnerReferences(pid);
  const reassignTo = payload.reassignTo ? Number(payload.reassignTo) : null;

  if (refs.hardTotal > 0 && !reassignTo) {
    return { status: "has-references", references: refs };
  }
  if (refs.hardTotal > 0 && reassignTo) {
    if (reassignTo === pid) {
      throw new Error("Nu poti reatribui partenerul catre el insusi.");
    }
    if (!(config.partners || []).some((p) => Number(p.id) === reassignTo)) {
      throw new Error("Partenerul de reatribuire nu exista.");
    }
    reassignPartnerReferences(pid, reassignTo, payload.changedBy);
  }

  const fresh = readConfigState();
  const removeIdx = (fresh.partners || []).findIndex((p) => Number(p.id) === pid);
  if (removeIdx < 0) {
    return { status: "not-found" };
  }
  const removed = fresh.partners[removeIdx];
  fresh.partners.splice(removeIdx, 1);
  writeConfigState(fresh);

  const receiptsState = readReceiptsState();
  createAuditEntry(receiptsState, {
    entityType: "partners",
    entityId: pid,
    action: "config-delete",
    reason: payload.changeReason || "Stergere partener",
    user: payload.changedBy || "dashboard",
    oldValue: { ...removed },
    newValue: reassignTo ? { reassignedTo: reassignTo } : null
  });
  writeReceiptsState(receiptsState);

  return { status: "deleted", removed, reassignedTo: reassignTo || null };
}

async function closeReceipt(id, payload = {}) {
  const state = readReceiptsState();
  const receipt = state.receipts.find((item) => item.id === Number(id));

  if (!receipt) {
    return null;
  }

  if (receipt.status === "Inchis") {
    return receipt;
  }

  if (receipt.status !== "Procesata" && receipt.status !== "Confirmat") {
    throw new Error(
      `Receptia trebuie sa fie in stare 'Procesata' sau 'Confirmat' pentru inchidere (actual: ${receipt.status}).`
    );
  }

  recalcReceiptComplaintFlag(state, receipt.id);
  if (receipt.hasOpenComplaint) {
    throw new Error("Reclamatie deschisa pe receptie. Nu se poate inchide.");
  }

  const reason = requiredChangeReason(payload.changeReason);
  const changedBy = payload.changedBy || payload.currentUser?.name || "dashboard";
  const oldValue = { status: receipt.status };

  receipt.status = "Inchis";
  receipt.closedAt = new Date().toISOString();
  receipt.closedBy = changedBy;
  receipt.updatedAt = new Date().toISOString();

  createAuditEntry(state, {
    entityType: "receipt",
    entityId: receipt.id,
    action: "close",
    reason,
    user: changedBy,
    oldValue,
    newValue: { status: receipt.status }
  });

  writeReceiptsState(state);
  return receipt;
}

async function reopenReceipt(id, payload = {}) {
  const state = readReceiptsState();
  const receipt = state.receipts.find((item) => item.id === Number(id));

  if (!receipt) {
    return null;
  }

  if (receipt.status !== "Inchis") {
    throw new Error(`Doar receptiile inchise pot fi redeschise (actual: ${receipt.status}).`);
  }

  const reason = requiredChangeReason(payload.changeReason);
  const changedBy = payload.changedBy || payload.currentUser?.name || "dashboard";
  const oldValue = { status: receipt.status };

  receipt.status = "Redeschis";
  receipt.reopenedAt = new Date().toISOString();
  receipt.reopenedBy = changedBy;
  receipt.updatedAt = new Date().toISOString();

  createAuditEntry(state, {
    entityType: "receipt",
    entityId: receipt.id,
    action: "reopen",
    reason,
    user: changedBy,
    oldValue,
    newValue: { status: receipt.status }
  });

  writeReceiptsState(state);
  return receipt;
}

async function getStats() {
  const openingDocuments = await listOpeningDocuments();
  const receipts = await listReceipts();
  const processings = await listProcessings();
  const transactions = await listTransactions();
  const deliveries = await listDeliveries();
  const complaints = await listComplaints();
  const auditLogs = await listAuditLogs();
  const partnerAdvances = await listPartnerAdvances();
  const transfers = await listTransfers();
  // Stoc curent (la momentul de fata), nu suma istorica a receptiilor.
  const stockSummary = createStockSummary(receipts, deliveries, openingDocuments, transfers, processings);
  return {
    ...createReceiptSummary(receipts),
    stockTotal: stockSummary.totals.totalQuantity,
    opening: createOpeningSummary(openingDocuments),
    processing: createProcessingSummary(processings),
    finance: createTransactionSummary(transactions),
    deliveries: createDeliverySummary(deliveries),
    complaints: createComplaintSummary(complaints),
    audit: createAuditSummary(auditLogs),
    advances: createPartnerAdvanceSummary(partnerAdvances)
  };
}

async function getStockSummary() {
  const openingDocuments = await listOpeningDocuments();
  const receipts = await listReceipts();
  const deliveries = await listDeliveries();
  const transfers = await listTransfers();
  const processings = await listProcessings();
  return createStockSummary(receipts, deliveries, openingDocuments, transfers, processings);
}

async function listTransfers() {
  const state = readReceiptsState();
  return (state.transfers || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

// Transfer de produs intre cilindri (mutare stoc dintr-o locatie in alta).
async function createTransfer(payload) {
  const config = readConfigState();
  const fromLocation = (config.storageLocations || []).find(
    (item) => Number(item.id) === Number(payload.fromLocationId)
  );
  const toLocation = (config.storageLocations || []).find(
    (item) => Number(item.id) === Number(payload.toLocationId)
  );
  const product = (config.products || []).find(
    (item) => Number(item.id) === Number(payload.productId)
  );
  const quantity = sanitizeNumber(payload.quantity);

  if (!product) {
    throw new Error("Selecteaza produsul de transferat.");
  }
  if (!fromLocation) {
    throw new Error("Selecteaza cilindrul sursa.");
  }
  if (!toLocation) {
    throw new Error("Selecteaza cilindrul destinatie.");
  }
  if (Number(fromLocation.id) === Number(toLocation.id)) {
    throw new Error("Cilindrul sursa si cel destinatie trebuie sa fie diferite.");
  }
  if (quantity <= 0) {
    throw new Error("Cantitatea de transfer trebuie sa fie mai mare ca zero.");
  }

  // Verificam ca exista suficient stoc in cilindrul sursa pentru acest produs.
  const summary = await getStockSummary();
  const available = Number(
    (summary.byLocation.find(
      (item) => sameLocation(item.location, fromLocation.name) && item.product === product.name
    ) || {}).quantity || 0
  );
  // Comparam in kg rotunjit (la fel ca afisarea) ca "muta tot" sa nu pice din zecimale.
  if (Math.round(quantity * 1000) > Math.round(available * 1000)) {
    throw new Error(
      `Stoc insuficient in ${fromLocation.name}: disponibil ${Math.round(available * 1000)} kg, cerut ${Math.round(quantity * 1000)} kg.`
    );
  }

  // #12: continutul curent al cilindrului destinatie (doar produse cu stoc real).
  const destItems = summary.byLocation.filter(
    (item) => sameLocation(item.location, toLocation.name) && Number(item.quantity || 0) > 0
  );

  // #12: intr-un cilindru poate fi un singur produs (regula comuna cu receptia/procesarea).
  const transferConflict = findCylinderConflict(summary, toLocation, product.name);
  if (transferConflict) {
    throw new Error(
      `Operatiune gresita: in ${toLocation.name} se afla deja ${transferConflict}. O locatie poate avea un singur produs.`
    );
  }

  // #12: capacitatea maxima a locatiei destinatie (ex: cilindru = 2000 t = 2.000.000 kg).
  const destCurrent = destItems.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  const capacity = Number(toLocation.capacity || 0) / 1000; // kg -> tone
  if (capacity > 0 && Math.round((destCurrent + quantity) * 1000) > Math.round(capacity * 1000)) {
    const liber = Math.max(capacity - destCurrent, 0);
    throw new Error(
      `Capacitate depasita in ${toLocation.name}: maxim ${Math.round(capacity * 1000)} kg, ocupat ${Math.round(destCurrent * 1000)} kg, mai incap ${Math.round(liber * 1000)} kg.`
    );
  }

  const state = readReceiptsState();
  if (!Array.isArray(state.transfers)) {
    state.transfers = [];
  }

  const transfer = {
    id: nextId(state.transfers),
    product: product.name,
    productId: product.id,
    unit: product.unit || "tone",
    fromLocation: fromLocation.name,
    fromLocationId: fromLocation.id,
    toLocation: toLocation.name,
    toLocationId: toLocation.id,
    quantity,
    operator: payload.operator || "",
    note: payload.note || "",
    status: "Activ",
    createdAt: new Date().toISOString()
  };

  state.transfers.push(transfer);

  createAuditEntry(state, {
    entityType: "transfer",
    entityId: transfer.id,
    action: "create",
    reason: "Transfer intre cilindri",
    user: payload.createdBy || "dashboard",
    newValue: { ...transfer }
  });

  writeReceiptsState(state);
  return transfer;
}

// Anulare transfer (admin/manager). Transferul ramane in lista ca „Anulat" (cu motiv),
// dar nu mai misca stocul intre cilindri (vezi skip-ul din createStockSummary).
async function cancelTransfer(id, options = {}) {
  const state = readReceiptsState();
  const transfer = (state.transfers || []).find((item) => item.id === Number(id));
  if (!transfer) {
    return null;
  }
  if (transfer.status === "Anulat") {
    return transfer;
  }
  const reason = String(options.reason || "").trim();
  if (!reason) {
    throw new Error("Motivul anularii este obligatoriu.");
  }
  const currentUser = options.currentUser || {};
  const before = { status: transfer.status || "Activ" };
  transfer.status = "Anulat";
  transfer.cancelReason = reason;
  transfer.canceledBy = currentUser.name || options.changedBy || "";
  transfer.canceledByRole = currentUser.roleCode || "";
  transfer.canceledAt = new Date().toISOString();
  createAuditEntry(state, {
    entityType: "transfer",
    entityId: transfer.id,
    action: "cancel",
    reason,
    user: transfer.canceledBy || "admin",
    oldValue: before,
    newValue: { status: "Anulat", cancelReason: reason }
  });
  writeReceiptsState(state);
  return transfer;
}

// Anulare receptie (admin/manager). Receptia anulata e deja exclusa din stoc.
// Blocata daca are livrari active (altfel ar lasa stocul inconsistent).
async function cancelReceipt(id, options = {}) {
  const state = readReceiptsState();
  const receipt = state.receipts.find((item) => item.id === Number(id));
  if (!receipt) {
    return null;
  }
  if (receipt.status === "Anulat") {
    return receipt;
  }
  const reason = String(options.reason || "").trim();
  if (!reason) {
    throw new Error("Motivul anularii este obligatoriu.");
  }
  const activeDeliveries = (state.deliveries || []).filter(
    (d) => d.receiptId === Number(id) && d.status !== "Anulat"
  );
  if (activeDeliveries.length > 0) {
    throw new Error("Receptia are livrari active. Anuleaza intai livrarile, apoi receptia.");
  }
  const currentUser = options.currentUser || {};
  const now = new Date().toISOString();
  const before = { status: receipt.status };
  receipt.status = "Anulat";
  receipt.cancelReason = reason;
  receipt.canceledBy = currentUser.name || options.changedBy || "";
  receipt.canceledByRole = currentUser.roleCode || "";
  receipt.canceledAt = now;
  receipt.updatedAt = now;
  createAuditEntry(state, {
    entityType: "receipt",
    entityId: receipt.id,
    action: "cancel",
    reason,
    user: receipt.canceledBy || "admin",
    oldValue: before,
    newValue: { status: "Anulat", cancelReason: reason }
  });
  writeReceiptsState(state);
  return receipt;
}

// Anulare livrare (admin/manager) — override: functioneaza din ORICE status (inclusiv „Livrat",
// care prin tranzitia normala nu permite Anulat). Livrarea ramane in lista ca „Anulat" (cu motiv),
// iar marfa se intoarce in stoc (createStockSummary sare peste „Anulat").
async function cancelDelivery(id, options = {}) {
  const state = readReceiptsState();
  const delivery = (state.deliveries || []).find((item) => item.id === Number(id));
  if (!delivery) {
    return null;
  }
  if (delivery.status === "Anulat") {
    return delivery;
  }
  const reason = String(options.reason || "").trim();
  if (!reason) {
    throw new Error("Motivul anularii este obligatoriu.");
  }
  const currentUser = options.currentUser || {};
  const now = new Date().toISOString();
  const before = { status: delivery.status, deliveredQuantity: delivery.deliveredQuantity };
  delivery.status = "Anulat";
  delivery.canceledAt = now;
  delivery.cancelReason = reason;
  delivery.canceledBy = currentUser.name || options.changedBy || "";
  delivery.canceledByRole = currentUser.roleCode || "";
  delivery.changedBy = currentUser.name || options.changedBy || delivery.changedBy;
  delivery.updatedAt = now;
  createAuditEntry(state, {
    entityType: "delivery",
    entityId: delivery.id,
    action: "cancel",
    reason,
    user: delivery.canceledBy || "admin",
    oldValue: before,
    newValue: { status: "Anulat", cancelReason: reason }
  });
  if (delivery.receiptId) {
    recalcReceiptDeliveryState(state, delivery.receiptId);
  }
  writeReceiptsState(state);
  return delivery;
}

// Editare comentariu (note) pe un document existent (admin). Ex.: data reala a operatiei.
async function updateEntityNote(entityType, id, note, options = {}) {
  const state = readReceiptsState();
  const collectionByType = {
    receipt: state.receipts,
    delivery: state.deliveries,
    transfer: state.transfers
  };
  const collection = collectionByType[entityType];
  if (!collection) {
    throw new Error("Tip de document necunoscut.");
  }
  const item = collection.find((x) => x.id === Number(id));
  if (!item) {
    return null;
  }
  const currentUser = options.currentUser || {};
  const before = item.note || "";
  item.note = String(note || "").trim();
  item.updatedAt = new Date().toISOString();
  createAuditEntry(state, {
    entityType,
    entityId: item.id,
    action: "note-update",
    reason: "Editare comentariu",
    user: currentUser.name || options.changedBy || "admin",
    oldValue: { note: before },
    newValue: { note: item.note }
  });
  writeReceiptsState(state);
  return item;
}

async function getConfig() {
  const config = readConfigState();
  const clientConfig = {
    ...config,
    users: config.users.map(sanitizeUserForClient)
  };
  return {
    ...clientConfig,
    summary: createConfigSummary(clientConfig)
  };
}

async function findUserByUsername(username) {
  const config = readConfigState();
  const normalizedUsername = String(username || "").trim().toLowerCase();

  if (!normalizedUsername) {
    return null;
  }

  return (
    config.users.find(
      (item) => String(item.username || "").trim().toLowerCase() === normalizedUsername
    ) || null
  );
}

async function updateUserPasswordById(userId, password) {
  const state = readConfigState();
  const user = state.users.find((item) => item.id === Number(userId));

  if (!user) {
    return null;
  }

  const normalizedPassword = String(password || "").trim();
  if (!normalizedPassword) {
    throw new Error("Parola noua este obligatorie.");
  }

  const passwordRecord = createPasswordRecord(normalizedPassword);
  user.passwordSalt = passwordRecord.salt;
  user.passwordHash = passwordRecord.hash;
  user.requirePasswordChange = false;
  user.updatedAt = new Date().toISOString();
  writeConfigState(state);
  return sanitizeUserForClient(user);
}

async function getDailyReport(dateValue = new Date().toISOString().slice(0, 10)) {
  const [receipts, processings, transactions, deliveries, complaints, stockSummary] = await Promise.all([
    listReceipts(),
    listProcessings(),
    listTransactions(),
    listDeliveries(),
    listComplaints(),
    getStockSummary()
  ]);

  const report = createDailyReport(dateValue, receipts, processings, transactions, stockSummary);
  report.deliveries = filterByDate(deliveries, dateValue);
  report.complaints = filterByDate(complaints, dateValue);
  report.summary.deliveredQuantity = report.deliveries.reduce(
    (sum, item) => sum + (item.status === "Anulat" ? 0 : Number(item.deliveredQuantity || 0)),
    0
  );
  report.summary.openComplaints = report.complaints.filter((item) => item.status === "Deschisa").length;
  return report;
}

// Raport pe interval [from, to] — aceleasi 5 tabele ca raportul zilnic, dar pe perioada.
async function getPeriodReport(from, to) {
  const [receipts, processings, transactions, deliveries, complaints, stockSummary] = await Promise.all([
    listReceipts(),
    listProcessings(),
    listTransactions(),
    listDeliveries(),
    listComplaints(),
    getStockSummary()
  ]);

  const periodReceipts = filterByDateRange(receipts, from, to);
  const periodProcessings = filterByDateRange(processings, from, to).filter(
    (item) => item.status !== "Anulat" && item.status !== "In lucru"
  );
  const periodTransactions = filterByDateRange(transactions, from, to);
  const periodDeliveries = filterByDateRange(deliveries, from, to);
  const periodComplaints = filterByDateRange(complaints, from, to);
  // Sumarul cantitativ exclude receptiile anulate.
  const activePeriodReceipts = periodReceipts.filter((item) => item.status !== "Anulat");

  return {
    from: String(from || "").slice(0, 10),
    to: String(to || "").slice(0, 10),
    summary: {
      receiptsCount: activePeriodReceipts.length,
      grossQuantity: activePeriodReceipts.reduce((sum, item) => sum + Number(item.grossQuantity || item.quantity || 0), 0),
      provisionalNetQuantity: activePeriodReceipts.reduce(
        (sum, item) => sum + Number(item.provisionalNetQuantity || item.quantity || 0),
        0
      ),
      processedQuantity: periodProcessings.reduce((sum, item) => sum + Number(item.processedQuantity || 0), 0),
      confirmedWaste: periodProcessings.reduce((sum, item) => sum + Number(item.confirmedWaste || 0), 0),
      paymentsTotal: periodTransactions
        .filter((item) => item.direction === "payment")
        .reduce((sum, item) => sum + Number(item.amount || 0), 0),
      collectionsTotal: periodTransactions
        .filter((item) => item.direction === "collection")
        .reduce((sum, item) => sum + Number(item.amount || 0), 0),
      deliveredQuantity: periodDeliveries.reduce((sum, item) => sum + (item.status === "Anulat" ? 0 : Number(item.deliveredQuantity || 0)), 0),
      openComplaints: periodComplaints.filter((item) => item.status === "Deschisa").length,
      stockTotal: stockSummary.totals.totalQuantity
    },
    receipts: periodReceipts,
    processings: periodProcessings,
    transactions: periodTransactions,
    deliveries: periodDeliveries,
    complaints: periodComplaints
  };
}

async function createConfigEntry(entity, payload) {
  assertEntity(entity);
  if (entity === "roles") {
    throw new Error("Rolurile sistem sunt fixe in versiunea curenta.");
  }
  const state = readConfigState();
  const normalized = normalizeEntityPayload(entity, payload);
  const reason = requiredChangeReason(payload.changeReason);
  const changedBy = String(payload.changedBy || "dashboard").trim() || "dashboard";

  if (entity === "products" && state.products.some((item) => item.code === normalized.code)) {
    throw new Error("Exista deja un produs cu acest cod.");
  }

  // Nu permitem doi furnizori/parteneri cu acelasi nume.
  // IDNO-ul diferentiaza persoane reale cu acelasi nume.
  // Exceptie: operatorul poate adauga rapid o persoana fizica temporara la receptie
  // chiar daca exista deja un nume identic (contabilul diferentiaza/uneste mai tarziu).
  if (entity === "partners" && !payload.allowDuplicateName) {
    const sameName = state.partners.filter(
      (item) =>
        String(item.name || "").trim().toLowerCase() ===
        String(normalized.name || "").trim().toLowerCase()
    );
    if (sameName.length) {
      const newIdno = String(normalized.idno || "").trim();
      if (newIdno) {
        if (sameName.some((item) => String(item.idno || "").trim() === newIdno)) {
          throw new Error(
            `Exista deja un partener "${normalized.name}" cu acelasi IDNO (${newIdno}).`
          );
        }
        // acelasi nume dar IDNO diferit => persoana diferita, permitem
      } else {
        throw new Error(
          `Exista deja un partener cu numele "${normalized.name}". Alege-l din lista sau adauga IDNO-ul daca e alta persoana.`
        );
      }
    }
  }

  if (entity === "roles" && state.roles.some((item) => item.code === normalized.code)) {
    throw new Error("Exista deja un rol cu acest cod.");
  }

  if (
    entity === "users" &&
    state.users.some(
      (item) => String(item.username || "").trim().toLowerCase() === normalized.username.toLowerCase()
    )
  ) {
    throw new Error("Exista deja un utilizator cu acest username.");
  }

  if (
    entity === "users" &&
    !state.roles.some((item) => item.code === normalized.roleCode)
  ) {
    throw new Error("Rolul selectat pentru utilizator nu exista.");
  }

  const passwordExplicit = entity === "users" && normalized.password;
  const passwordRecord =
    entity === "users"
      ? createPasswordRecord(
          normalized.password || defaultUserPassword,
          { mode: passwordExplicit ? "strict" : "lenient" }
        )
      : null;

  const entry = {
    id: state.nextIds[entity] + 1,
    ...normalized,
    ...(entity === "users"
      ? {
          passwordSalt: passwordRecord.salt,
          passwordHash: passwordRecord.hash,
          requirePasswordChange: !passwordExplicit
        }
      : {}),
    createdAt: new Date().toISOString()
  };

  if (entity === "users") {
    delete entry.password;
  }

  state.nextIds[entity] = entry.id;
  state[entity].push(entry);
  writeConfigState(state);

  const receiptsState = readReceiptsState();
  createAuditEntry(receiptsState, {
    entityType: entity,
    entityId: entry.id,
    action: "config-create",
    reason,
    user: changedBy,
    newValue: entity === "users" ? sanitizeUserForClient(entry) : { ...entry }
  });
  writeReceiptsState(receiptsState);

  return entity === "users" ? sanitizeUserForClient(entry) : entry;
}

async function updateConfigEntry(entity, id, payload) {
  assertEntity(entity);
  if (entity === "roles") {
    throw new Error("Rolurile sistem sunt fixe in versiunea curenta.");
  }
  const state = readConfigState();
  const list = state[entity];
  const existing = list.find((item) => item.id === Number(id));

  if (!existing) {
    return null;
  }

  const reason = requiredChangeReason(payload.changeReason);
  const user = String(payload.changedBy || "dashboard").trim() || "dashboard";
  const oldValue = entity === "users" ? sanitizeUserForClient(existing) : { ...existing };

  const normalized = normalizeEntityPayload(entity, { ...existing, ...payload });

  if (
    entity === "products" &&
    state.products.some((item) => item.id !== Number(id) && item.code === normalized.code)
  ) {
    throw new Error("Exista deja un produs cu acest cod.");
  }

  if (
    entity === "roles" &&
    state.roles.some((item) => item.id !== Number(id) && item.code === normalized.code)
  ) {
    throw new Error("Exista deja un rol cu acest cod.");
  }

  if (
    entity === "users" &&
    state.users.some(
      (item) =>
        item.id !== Number(id) &&
        String(item.username || "").trim().toLowerCase() === normalized.username.toLowerCase()
    )
  ) {
    throw new Error("Exista deja un utilizator cu acest username.");
  }

  if (
    entity === "users" &&
    normalizeRoleCode(existing.roleCode) === "admin" &&
    (!normalized.active || normalizeRoleCode(normalized.roleCode) !== "admin") &&
    state.users.filter(
      (item) => item.id !== Number(id) && item.active !== false && normalizeRoleCode(item.roleCode) === "admin"
    ).length === 0
  ) {
    throw new Error("Trebuie sa ramana cel putin un administrator activ.");
  }

  const adminResetPassword = entity === "users" && normalized.password;

  Object.assign(existing, normalized, {
    updatedAt: new Date().toISOString()
  });

  if (adminResetPassword) {
    const passwordRecord = createPasswordRecord(normalized.password);
    existing.passwordSalt = passwordRecord.salt;
    existing.passwordHash = passwordRecord.hash;
    existing.requirePasswordChange = true;
  }

  if (entity === "users") {
    delete existing.password;
  }

  writeConfigState(state);
  const receiptsState = readReceiptsState();
  createAuditEntry(receiptsState, {
    entityType: entity,
    entityId: existing.id,
    action: "config-update",
    reason,
    user,
    oldValue,
    newValue: entity === "users" ? sanitizeUserForClient(existing) : { ...existing }
  });
  writeReceiptsState(receiptsState);
  return entity === "users" ? sanitizeUserForClient(existing) : existing;
}

async function listUsers() {
  const config = readConfigState();
  return config.users
    .map(sanitizeUserForClient)
    .sort((left, right) => String(left.name || "").localeCompare(String(right.name || ""), "ro"));
}

async function createUser(payload) {
  return createConfigEntry("users", payload);
}

async function updateUserById(id, payload) {
  return updateConfigEntry("users", id, payload);
}

async function updateSystemSettings(payload) {
  const state = readConfigState();
  const reason = requiredChangeReason(payload.changeReason);
  const user = String(payload.changedBy || "dashboard").trim() || "dashboard";
  const oldValue = { ...state.systemSettings };
  state.systemSettings = {
    ...state.systemSettings,
    closeOfDayHour: sanitizeNumber(payload.closeOfDayHour ?? state.systemSettings.closeOfDayHour),
    reportChannel: String(payload.reportChannel || state.systemSettings.reportChannel).trim(),
    reportAudience: normalizeReportAudience(payload.reportAudience || state.systemSettings.reportAudience),
    defaultCurrency: String(payload.defaultCurrency || state.systemSettings.defaultCurrency).trim()
  };
  writeConfigState(state);
  const receiptsState = readReceiptsState();
  createAuditEntry(receiptsState, {
    entityType: "system-settings",
    entityId: 1,
    action: "settings-update",
    reason,
    user,
    oldValue,
    newValue: { ...state.systemSettings }
  });
  writeReceiptsState(receiptsState);
  return state.systemSettings;
}

async function getReceiptDefaults(supplierId, productId) {
  const state = readReceiptsState();
  const matches = (state.receipts || [])
    .filter(
      (item) =>
        (!supplierId || Number(item.supplierId) === Number(supplierId)) &&
        (!productId || Number(item.productId) === Number(productId))
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const last = matches[0];
  if (!last) {
    return null;
  }

  return {
    price: Number(last.price || 0),
    humidity: Number(last.humidity || 0),
    impurity: Number(last.impurity || 0),
    location: last.location || "",
    locationId: last.locationId || null,
    vehicle: last.vehicle || "",
    unit: last.unit || "tone"
  };
}

async function getDeliveryDefaults(customerId) {
  const state = readReceiptsState();
  const matches = (state.deliveries || [])
    .filter((item) => !customerId || Number(item.customerId) === Number(customerId))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const last = matches[0];
  if (!last) {
    return null;
  }

  return {
    vehicle: last.vehicle || "",
    contractPrice: Number(last.contractPrice || 0),
    product: last.product || "",
    receiptId: last.receiptId || null
  };
}

async function getDashboardSnapshot(dateValue = new Date().toISOString().slice(0, 10)) {
  const [receipts, deliveries, processings, transactions, complaints, auditLogs, stockSummary, partnerAdvances] =
    await Promise.all([
      listReceipts(),
      listDeliveries(),
      listProcessings(),
      listTransactions(),
      listComplaints(),
      listAuditLogs(),
      getStockSummary(),
      listPartnerAdvances()
    ]);

  const outstandingPayments = receipts.reduce((sum, item) => {
    if (item.status === "Anulat") return sum; // recepția anulată nu mai e de plătit
    const target = Number(item.preliminaryPayableAmount || 0);
    const paid = Number(item.paidAmount || 0);
    return sum + Math.max(target - paid, 0);
  }, 0);

  const outstandingCollections = deliveries.reduce((sum, item) => {
    if (item.status === "Anulat") return sum; // livrarea anulată nu mai e de încasat
    const qty = Number(item.deliveredQuantity || item.netWeight || 0);
    const target = Number(item.contractPrice || 0) * qty;
    const collected = Number(item.collectedAmount || 0);
    return sum + Math.max(target - collected, 0);
  }, 0);

  const dayReceipts = filterByDate(receipts, dateValue);
  const dayDeliveries = filterByDate(deliveries, dateValue);
  const dayProcessings = filterByDate(processings, dateValue);
  const dayAudit = filterByDate(auditLogs, dateValue);

  return {
    date: dateValue,
    stock: {
      total: stockSummary.totals.totalQuantity,
      byLocation: stockSummary.byLocation
    },
    outstanding: {
      payments: outstandingPayments,
      collections: outstandingCollections,
      advancesAvailable: createPartnerAdvanceSummary(partnerAdvances).totalAdvance
    },
    activity: {
      receipts: dayReceipts.length,
      deliveries: dayDeliveries.length,
      processings: dayProcessings.length,
      auditEvents: dayAudit.length
    },
    alerts: {
      openComplaints: complaints.filter((item) => item.status === "Deschisa").length,
      openReceipts: receipts.filter(
        (item) => item.hasOpenComplaint === true || item.status === "Proiect" || item.status === "Procesata"
      ).length
    }
  };
}

function toCsvField(value) {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

async function exportResourceAsCsv(resource, roleCode) {
  const mapping = {
    receipts: { list: listReceipts, fields: ["id", "supplier", "product", "quantity", "status", "paymentStatus", "createdAt"] },
    deliveries: { list: listDeliveries, fields: ["id", "receiptId", "customer", "product", "plannedQuantity", "deliveredQuantity", "status", "createdAt"] },
    transactions: { list: listTransactions, fields: ["id", "referenceType", "partner", "direction", "amount", "appliedAmount", "advanceAmount", "source", "createdAt"] },
    complaints: { list: listComplaints, fields: ["id", "deliveryId", "customer", "product", "status", "complaintType", "contestedQuantity", "createdAt"] },
    "audit-logs": { list: listAuditLogs, fields: ["id", "entityType", "entityId", "action", "user", "reason", "createdAt"] },
    "partner-advances": { list: listPartnerAdvances, fields: ["id", "partner", "partnerId", "amount", "remainingAmount", "source", "createdAt"] }
  };

  const config = mapping[resource];
  if (!config) {
    throw new Error(`Resursa necunoscuta: ${resource}.`);
  }

  let rows = await config.list();
  // Documentele anulate sunt filtrate dupa rol si in export (nu doar in UI).
  if (resource === "receipts" || resource === "deliveries") {
    rows = filterCanceledForRole(rows, roleCode);
  }
  const header = config.fields.join(",");
  const body = rows
    .map((row) => config.fields.map((field) => toCsvField(row[field])).join(","))
    .join("\n");
  return `${header}\n${body}`;
}

function runMigrationIfNeeded() {
  try {
    const config = readConfigState();
    const currentVersion = config.systemSettings?.migrationVersion || "";
    if (currentVersion === CURRENT_MIGRATION_VERSION) {
      return { migrated: false, version: currentVersion };
    }

    if (!USE_SUPABASE) {
      backupRuntimeData({ force: true, suffix: "pre-tran-a-b" });
    }

    const state = readReceiptsState();
    if (!Array.isArray(state.partnerAdvances)) {
      state.partnerAdvances = [];
    }

    let changed = false;

    for (const delivery of state.deliveries || []) {
      if (!delivery.status || delivery.status === "Livrata") {
        delivery.status = "Livrat";
        changed = true;
      }
      if (delivery.plannedQuantity === undefined) {
        delivery.plannedQuantity = Number(delivery.deliveredQuantity || 0);
        changed = true;
      }
      if (delivery.netWeight === undefined) delivery.netWeight = 0;
      if (delivery.grossWeight === undefined) delivery.grossWeight = 0;
      if (delivery.tareWeight === undefined) delivery.tareWeight = 0;
    }

    for (const receipt of state.receipts || []) {
      if (receipt.reservedQuantity === undefined) {
        receipt.reservedQuantity = Number(receipt.deliveredQuantity || 0);
        changed = true;
      }
      if (receipt.grossWeight === undefined) receipt.grossWeight = 0;
      if (receipt.tareWeight === undefined) receipt.tareWeight = 0;
      if (receipt.netWeight === undefined) receipt.netWeight = 0;
    }

    for (const transaction of state.transactions || []) {
      if (transaction.appliedAmount === undefined) {
        transaction.appliedAmount = Number(transaction.amount || 0);
        changed = true;
      }
      if (transaction.advanceAmount === undefined) {
        transaction.advanceAmount = 0;
        changed = true;
      }
      if (transaction.source === undefined) transaction.source = "direct";
    }

    for (const complaint of state.complaints || []) {
      if (complaint.invoiceAdjustment === undefined) complaint.invoiceAdjustment = null;
      if (complaint.stockCorrection === undefined) complaint.stockCorrection = null;
      if (complaint.exportedTo1C === undefined) complaint.exportedTo1C = false;
    }

    if (changed) {
      createAuditEntry(state, {
        entityType: "migration",
        entityId: null,
        action: "backfill",
        reason: CURRENT_MIGRATION_VERSION,
        user: "sistem",
        newValue: {
          deliveries: (state.deliveries || []).length,
          receipts: (state.receipts || []).length,
          transactions: (state.transactions || []).length,
          complaints: (state.complaints || []).length
        }
      });
    }
    writeReceiptsState(state);

    config.systemSettings.migrationVersion = CURRENT_MIGRATION_VERSION;
    writeConfigState(config);

    return { migrated: true, version: CURRENT_MIGRATION_VERSION };
  } catch (error) {
    console.error("Migration failed:", error.message);
    return { migrated: false, error: error.message };
  }
}

module.exports = {
  defaultReceiptsState,
  initStorage,
  flushPendingWrites,
  reloadFromKv,
  applyAdvanceCredit,
  appendAuditLog,
  cancelDelivery,
  cancelReceipt,
  cancelTransfer,
  closeReceipt,
  createConfigEntry,
  createComplaint,
  createDelivery,
  createOpeningDocument,
  createProcessing,
  createQuickSupplier,
  createReceipt,
  createTransaction,
  createTransfer,
  createUser,
  updateEntityNote,
  exportResourceAsCsv,
  findUserByUsername,
  getConfig,
  getDailyReport,
  getPeriodReport,
  getDashboardSnapshot,
  getDeliveryDefaults,
  getReceiptDefaults,
  getStats,
  getStockSummary,
  getSupplierStatement,
  listAuditLogs,
  listComplaints,
  listDeliveries,
  listOpeningDebtItems,
  listOpeningDocuments,
  deleteOpeningDocument,
  deletePartner,
  countPartnerReferences,
  reassignPartnerReferences,
  listPartnerAdvances,
  listProcessings,
  listReceipts,
  listTransactions,
  listTransfers,
  listUsers,
  reopenReceipt,
  runMigrationIfNeeded,
  transitionDelivery,
  updateComplaint,
  updateConfigEntry,
  updateDelivery,
  updateProcessing,
  updateReceiptStatus,
  updateReceiptStatusWithAudit,
  completeReceiptWeighing,
  updateReceiptSupplier,
  updateSystemSettings,
  updateTransaction,
  updateUserById,
  updateUserPasswordById
};
