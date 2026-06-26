const SYSTEM_ROLE_CAPABILITIES = {
  operator: [
    "receipts-read",
    "receipt-write",
    "processings-read",
    "processing-write",
    "stocks-read",
    "deliveries-read",
    "delivery-write",
    "config-read"
  ],
  manager: [
    "receipts-read",
    "receipt-write",
    "processings-read",
    "processing-write",
    "stocks-read",
    "deliveries-read",
    "delivery-write",
    "complaints-read",
    "complaint-write",
    "finance",
    "finance-write",
    "opening-read",
    "reports",
    "audit",
    "config-read"
  ],
  accountant: [
    "receipts-read",
    "processings-read",
    "stocks-read",
    "deliveries-read",
    "complaints-read",
    "complaint-write",
    "complaint-invoice-adjust",
    "finance",
    "finance-write",
    "opening-read",
    "reports",
    "config-read",
    "nomenclator-read",
    "nomenclator-create"
  ],
  "accountant-sef": [
    "receipts-read",
    "processings-read",
    "stocks-read",
    "deliveries-read",
    "complaints-read",
    "complaint-write",
    "complaint-invoice-adjust",
    "complaint-stock-correct",
    "finance",
    "finance-write",
    "opening-read",
    "reports",
    "audit",
    "config-read",
    "nomenclator-read",
    "nomenclator-create"
  ],
  control: [
    "receipts-read",
    "processings-read",
    "stocks-read",
    "deliveries-read",
    "complaints-read",
    "reports",
    "audit",
    "config-read"
  ],
  admin: [
    "receipts-read",
    "receipt-write",
    "processings-read",
    "processing-write",
    "stocks-read",
    "deliveries-read",
    "delivery-write",
    "complaints-read",
    "complaint-write",
    "complaint-invoice-adjust",
    "complaint-stock-correct",
    "finance",
    "finance-write",
    "opening",
    "opening-read",
    "reports",
    "audit",
    "security-admin",
    "setup",
    "nomenclator-read",
    "nomenclator-create",
    "nomenclator-update",
    "config-read"
  ]
};

const SYSTEM_ROLES = [
  { id: 1, code: "operator", name: "Operator receptie", permissions: "receptie, procesare, livrari, stocuri", system: true },
  { id: 2, code: "manager", name: "Manager", permissions: "operations, finance, reports, audit", system: true },
  { id: 3, code: "accountant", name: "Contabil", permissions: "finance, complaints, invoice adjust, reports", system: true },
  { id: 4, code: "admin", name: "Administrator sistem", permissions: "setup, users, security, operations", system: true },
  { id: 5, code: "control", name: "Control / conducere", permissions: "reports, audit", system: true },
  { id: 6, code: "accountant-sef", name: "Contabil sef", permissions: "reclamatii, ajustari stoc, ajustari factura, audit", system: true }
];

const LEGACY_ROLE_ALIASES = {
  contabil: "accountant"
};

function normalizeRoleCode(roleCode) {
  const normalized = String(roleCode || "").trim().toLowerCase();
  return LEGACY_ROLE_ALIASES[normalized] || normalized;
}

function listSystemRoles() {
  return SYSTEM_ROLES.map((item) => ({ ...item }));
}

function getRolePermissions(roleCode) {
  return [...(SYSTEM_ROLE_CAPABILITIES[normalizeRoleCode(roleCode)] || [])];
}

function getRoleName(roleCode) {
  return SYSTEM_ROLES.find((item) => item.code === normalizeRoleCode(roleCode))?.name || "";
}

// Vizibilitatea documentelor ANULATE (sursa unica, folosita si pe server, si pe client):
//  - admin   → vede toate anulatele
//  - manager → vede doar anulatele facute de un manager (canceledByRole === "manager")
//  - restul  → nu vad documentele anulate
// Documentele ne-anulate raman vizibile normal.
function canRoleViewCanceled(doc, roleCode) {
  if (!doc || doc.status !== "Anulat") {
    return true;
  }
  const role = normalizeRoleCode(roleCode);
  if (role === "admin") {
    return true;
  }
  if (role === "manager") {
    return doc.canceledByRole === "manager";
  }
  return false;
}

function filterCanceledForRole(docs, roleCode) {
  if (!Array.isArray(docs)) {
    return docs;
  }
  return docs.filter((doc) => canRoleViewCanceled(doc, roleCode));
}

// Vizibilitatea TRANZACȚIILOR financiare anulate:
//  - admin + contabil-șef → văd anulatele
//  - restul (manager, contabil, control) → NU le văd
function canRoleViewCanceledTransaction(doc, roleCode) {
  if (!doc || doc.status !== "Anulat") {
    return true;
  }
  const role = normalizeRoleCode(roleCode);
  return role === "admin" || role === "accountant-sef";
}

function filterCanceledTransactionsForRole(docs, roleCode) {
  if (!Array.isArray(docs)) {
    return docs;
  }
  return docs.filter((doc) => canRoleViewCanceledTransaction(doc, roleCode));
}

module.exports = {
  canRoleViewCanceled,
  canRoleViewCanceledTransaction,
  filterCanceledForRole,
  filterCanceledTransactionsForRole,
  getRoleName,
  getRolePermissions,
  listSystemRoles,
  normalizeRoleCode
};
