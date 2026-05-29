const loginScreenEl = document.getElementById("login-screen");
const pageShellEl = document.getElementById("page-shell");
const loginFormEl = document.getElementById("login-form");
const loginMessageEl = document.getElementById("login-message");
const currentUserNameEl = document.getElementById("current-user-name");
const currentUserRoleEl = document.getElementById("current-user-role");
const logoutButtonEl = document.getElementById("logout-button");
const changePasswordButtonEl = document.getElementById("change-password-button");
const passwordPanelEl = document.getElementById("password-panel");
const changePasswordFormEl = document.getElementById("change-password-form");
const changePasswordMessageEl = document.getElementById("change-password-message");
const cancelPasswordButtonEl = document.getElementById("cancel-password-button");
const statsEl = document.getElementById("stats");
const bodyEl = document.getElementById("receipts-body");
const openingDocumentFormEl = document.getElementById("opening-document-form");
const openingDocumentDateEl = document.getElementById("opening-document-date");
const openingDocumentMessageEl = document.getElementById("opening-document-message");
const openingStockProductEl = document.getElementById("opening-stock-product");
const openingStockLocationEl = document.getElementById("opening-stock-location");
const openingStockQuantityEl = document.getElementById("opening-stock-quantity");
const addOpeningStockButton = document.getElementById("add-opening-stock");
const openingStockBodyEl = document.getElementById("opening-stock-body");
const openingDebtPartnerEl = document.getElementById("opening-debt-partner");
const openingDebtDirectionEl = document.getElementById("opening-debt-direction");
const openingDebtAmountEl = document.getElementById("opening-debt-amount");
const openingDebtNoteEl = document.getElementById("opening-debt-note");
const addOpeningDebtButton = document.getElementById("add-opening-debt");
const openingDebtBodyEl = document.getElementById("opening-debt-body");
const processingsBodyEl = document.getElementById("processings-body");
const formEl = document.getElementById("receipt-form");
const processingFormEl = document.getElementById("processing-form");
const messageEl = document.getElementById("form-message");
const processingMessageEl = document.getElementById("processing-message");
const configSummaryEl = document.getElementById("config-summary");
const supplierSelect = document.getElementById("supplier-select");
const newSupplierWrap = document.getElementById("new-supplier-wrap");
const newSupplierNameInput = document.getElementById("new-supplier-name");
const productSelect = document.getElementById("product-select");
const locationSelect = document.getElementById("location-select");
const userSelect = document.getElementById("user-select");
const unitInput = document.getElementById("unit-input");
const quantityTonsHintEl = document.getElementById("quantity-tons-hint");
const humidityInput = document.getElementById("humidity-input");
const impurityInput = document.getElementById("impurity-input");
const fiscalProfileOptions = document.getElementById("fiscal-profile-options");
const roleOptions = document.getElementById("role-options");
const systemSettingsForm = document.getElementById("system-settings-form");
const settingsMessageEl = document.getElementById("settings-message");
const editorTitleEl = document.getElementById("editor-title");
const editorCopyEl = document.getElementById("editor-copy");
const editorForm = document.getElementById("editor-form");
const editorFieldsEl = document.getElementById("editor-fields");
const editorEmptyEl = document.getElementById("editor-empty");
const editorMessageEl = document.getElementById("editor-message");
const editorSaveButton = document.getElementById("editor-save");
const editorCancelButton = document.getElementById("editor-cancel");
const lockoutsBodyEl = document.getElementById("lockouts-body");
const automationStatusSummaryEl = document.getElementById("automation-status-summary");
const automationAudienceBodyEl = document.getElementById("automation-audience-body");
const automationMessageEl = document.getElementById("automation-message");
const runCloseOfDayButtonEl = document.getElementById("run-close-of-day-button");
const criticalAlertsSummaryEl = document.getElementById("critical-alerts-summary");
const criticalAlertsBodyEl = document.getElementById("critical-alerts-body");
const criticalAlertsMessageEl = document.getElementById("critical-alerts-message");
const runCriticalAlertsCheckButtonEl = document.getElementById("run-critical-alerts-check-button");
const estimateHumidityNormEl = document.getElementById("estimate-humidity-norm");
const estimateImpurityNormEl = document.getElementById("estimate-impurity-norm");
const estimateNetEl = document.getElementById("estimate-net");
const estimateServicesEl = document.getElementById("estimate-services");
const estimatePayableEl = document.getElementById("estimate-payable");
const processingReceiptSelect = document.getElementById("processing-receipt-select");
const processingTypeSelect = document.getElementById("processing-type-select");
const processingUserSelect = document.getElementById("processing-user-select");
const processedQuantityInput = document.getElementById("processed-quantity-input");
const confirmedWasteInput = document.getElementById("confirmed-waste-input");
const processingSourceEl = document.getElementById("processing-source");
const processingProvisionalNetEl = document.getElementById("processing-provisional-net");
const processingFinalNetEl = document.getElementById("processing-final-net");
const processingLotInput = document.getElementById("processing-lot-input");
const transferFormEl = document.getElementById("transfer-form");
const transferProductSelect = document.getElementById("transfer-product-select");
const transferFromSelect = document.getElementById("transfer-from-select");
const transferToSelect = document.getElementById("transfer-to-select");
const transferUserSelect = document.getElementById("transfer-user-select");
const transferQuantityInput = document.getElementById("transfer-quantity-input");
const transferAvailableHintEl = document.getElementById("transfer-available-hint");
const transferMessageEl = document.getElementById("transfer-message");
const transfersBodyEl = document.getElementById("transfers-body");
let transfersCache = [];
const stocksBodyEl = document.getElementById("stocks-body");
const stockSummaryEl = document.getElementById("stock-summary");
const silosGridEl = document.getElementById("silos-grid");
const receiptStatusFilterEl = document.getElementById("receipt-status-filter");
const receiptProductFilterEl = document.getElementById("receipt-product-filter");
const receiptDateFromEl = document.getElementById("receipt-date-from");
const receiptDateToEl = document.getElementById("receipt-date-to");
const receiptsFootEl = document.getElementById("receipts-foot");
const unprocessedStockBodyEl = document.getElementById("unprocessed-stock-body");
const eodBanner = document.getElementById("eod-processing-banner");
const eodConfirmBtn = document.getElementById("eod-confirm-btn");
const processingTypeFilterEl = document.getElementById("processing-type-filter");
const processingReceiptFilterEl = document.getElementById("processing-receipt-filter");
const processingDateFromEl = document.getElementById("processing-date-from");
const processingDateToEl = document.getElementById("processing-date-to");
const processingsFootEl = document.getElementById("processings-foot");
const deliveryDateFromEl = document.getElementById("delivery-date-from");
const deliveryDateToEl = document.getElementById("delivery-date-to");
const deliveriesFootEl = document.getElementById("deliveries-foot");
const transactionDateFromEl = document.getElementById("transaction-date-from");
const transactionDateToEl = document.getElementById("transaction-date-to");
const transactionsFootEl = document.getElementById("transactions-foot");
const transactionsBodyEl = document.getElementById("transactions-body");
const transactionFormEl = document.getElementById("transaction-form");
const transactionMessageEl = document.getElementById("transaction-message");
const transactionReferenceTypeSelect = document.getElementById("transaction-reference-type-select");
const transactionReferenceSelect = document.getElementById("transaction-reference-select");
const transactionDirectionSelect = document.getElementById("transaction-direction-select");
const transactionDirectionChipEl = document.getElementById("transaction-direction-chip");
const transactionPaymentTypeSelect = document.getElementById("transaction-payment-type-select");
const transactionPartnerEl = document.getElementById("transaction-partner");
const transactionTargetEl = document.getElementById("transaction-target");
const transactionStatusEl = document.getElementById("transaction-status");
const deliveryFormEl = document.getElementById("delivery-form");
const deliveryMessageEl = document.getElementById("delivery-message");
const deliveryReceiptSelect = document.getElementById("delivery-receipt-select");
const deliveryCustomerSelect = document.getElementById("delivery-customer-select");
const deliveryQuantityInput = document.getElementById("delivery-quantity-input");
const deliveryLocationEl = document.getElementById("delivery-location");
const deliveryAvailableEl = document.getElementById("delivery-available");
const deliveryStatusPreviewEl = document.getElementById("delivery-status");
const deliveriesBodyEl = document.getElementById("deliveries-body");
const deliveryBillingDialog = document.getElementById("delivery-billing-dialog");
const deliveryBillingForm = document.getElementById("delivery-billing-form");
const complaintFormEl = document.getElementById("complaint-form");
const complaintMessageEl = document.getElementById("complaint-message");
const complaintDeliverySelect = document.getElementById("complaint-delivery-select");
const complaintsBodyEl = document.getElementById("complaints-body");
const openReceiptStatusFilterEl = document.getElementById("open-receipt-status-filter");
const openDeliveryStatusFilterEl = document.getElementById("open-delivery-status-filter");
const openPartnerFilterEl = document.getElementById("open-partner-filter");
const openReceiptsBodyEl = document.getElementById("open-receipts-body");
const openDeliveriesBodyEl = document.getElementById("open-deliveries-body");
const auditBodyEl = document.getElementById("audit-body");
const dailyReportFormEl = document.getElementById("daily-report-form");
const dailyReportDateEl = document.getElementById("daily-report-date");
const dailyReportSummaryEl = document.getElementById("daily-report-summary");
const dailyReportReceiptsEl = document.getElementById("daily-report-receipts");
const dailyReportProcessingsEl = document.getElementById("daily-report-processings");
const dailyReportDeliveriesEl = document.getElementById("daily-report-deliveries");
const dailyReportTransactionsEl = document.getElementById("daily-report-transactions");
const dailyReportComplaintsEl = document.getElementById("daily-report-complaints");
const receiptSaveNewButton = document.getElementById("receipt-save-new-button");
const transactionSaveNewButton = document.getElementById("transaction-save-new-button");
const deliverySaveNewButton = document.getElementById("delivery-save-new-button");

const entityLabels = {
  partners: "Parteneri",
  products: "Produse",
  storageLocations: "Locatii",
  tariffs: "Tarife",
  roles: "Roluri",
  users: "Utilizatori",
  paymentTypes: "Tipuri plata",
  fiscalProfiles: "Statut fiscal",
  processingTypes: "Tipuri procesare",
  vehicles: "Masini",
  labReports: "Date laborator"
};

let currentConfig = null;
let currentEditor = null;
let openingDocumentsCache = [];
let openingStockDraft = [];
let openingDebtDraft = [];
let receiptsCache = [];
let processingsCache = [];
let transactionsCache = [];
let deliveriesCache = [];
let complaintsCache = [];
let auditLogsCache = [];
let lockoutsCache = [];
let automationStatusCache = null;
let criticalAlertsStatusCache = null;
let currentSessionUser = null;
let automationRefreshTimer = null;

const nativeFetch = window.fetch.bind(window);

const currency = new Intl.NumberFormat("ro-RO", {
  style: "currency",
  currency: "MDL",
  maximumFractionDigits: 2
});

function formatNumber(value) {
  let n = Number(value || 0);
  // Evita afisarea "-0": normalizeaza zero negativ si negativele mici care se rotunjesc la zero.
  if (Object.is(n, -0) || (n < 0 && n > -0.005)) {
    n = 0;
  }
  return new Intl.NumberFormat("ro-RO", {
    maximumFractionDigits: 2
  }).format(n);
}

// Valoarea e stocata intern in tone. O afisam in kg DOAR daca inregistrarea a fost
// introdusa in kg (camp enteredUnit === "kg"). Datele vechi (fara camp) raman in tone.
function formatQtyByEntry(valueTons, rec) {
  const v = Number(valueTons || 0);
  return rec && rec.enteredUnit === "kg"
    ? `${formatNumber(v * 1000)} kg`
    : `${formatNumber(v)} t`;
}

function setCurrentUser(user) {
  currentSessionUser = user || null;
  currentUserNameEl.textContent = currentSessionUser?.name || "-";
  currentUserRoleEl.textContent = currentSessionUser?.roleName || currentSessionUser?.roleCode || "-";
}

function canAccess(capability) {
  if (!currentSessionUser?.roleCode) {
    return false;
  }

  return Array.isArray(currentSessionUser.permissions) && currentSessionUser.permissions.includes(capability);
}

function getDefaultView() {
  const candidates = [
    "acasa",
    "receptii",
    "procesare",
    "stoc",
    "livrari",
    "reclamatii",
    "financiar",
    "deschidere",
    "rapoarte",
    "audit",
    "nom-parteneri"
  ];
  let saved = (function () {
    try { return window.localStorage.getItem("active-view"); } catch (_err) { return null; }
  })();
  // Migrate legacy "configurare" stored view to the first nomenclator sub-page
  if (saved === "configurare") saved = "nom-parteneri";
  if (saved && canAccessView(saved)) {
    return saved;
  }
  for (const v of candidates) {
    if (canAccessView(v)) return v;
  }
  return "acasa";
}

function canAccessView(view) {
  // Match the sidebar button with this data-view; inherit its data-access if any
  const btn = document.querySelector(`.view-tab[data-view="${view}"]`);
  if (!btn) return false;
  const cap = btn.dataset.access;
  return !cap || canAccess(cap);
}

function applyRoleAccess() {
  document.querySelectorAll("[data-access]").forEach((element) => {
    const capability = element.dataset.access;
    element.hidden = !canAccess(capability);
  });

  setView(getDefaultView());
}

function showLoginScreen(message = "") {
  pageShellEl.hidden = true;
  loginScreenEl.hidden = false;
  passwordPanelEl.hidden = true;
  if (message !== undefined) {
    loginMessageEl.textContent = message;
  }
  loginFormEl.reset();
  document.getElementById("login-username").focus();
}

function showDashboardShell() {
  loginScreenEl.hidden = true;
  pageShellEl.hidden = false;
}

function togglePasswordPanel(show) {
  passwordPanelEl.hidden = !show;
  if (!show) {
    changePasswordFormEl.reset();
    changePasswordMessageEl.textContent = "";
  }
}

function stopAutomationRefreshLoop() {
  if (automationRefreshTimer) {
    window.clearInterval(automationRefreshTimer);
    automationRefreshTimer = null;
  }
}

function startAutomationRefreshLoop() {
  stopAutomationRefreshLoop();

  if (!canAccess("setup")) {
    return;
  }

  automationRefreshTimer = window.setInterval(async () => {
    if (!currentSessionUser || !canAccess("setup")) {
      stopAutomationRefreshLoop();
      return;
    }

    try {
      await Promise.all([loadAutomationStatus(), loadCriticalAlertsStatus()]);
    } catch (error) {
      console.error("Automation refresh failed:", error.message);
    }
  }, 60 * 1000);
}

async function apiFetch(input, init = {}) {
  const response = await nativeFetch(input, {
    credentials: "same-origin",
    ...init,
    headers: {
      ...(init.headers || {})
    }
  });

  if (response.status === 401) {
    setCurrentUser(null);
    showLoginScreen("Sesiunea a expirat sau nu esti autentificat.");
    throw new Error("Autentificare necesara.");
  }

  if (response.status === 403) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error || "Nu ai drepturi pentru aceasta operatiune.");
  }

  return response;
}

window.fetch = apiFetch;

async function loadSession() {
  const response = await nativeFetch("/api/auth/me", {
    credentials: "same-origin"
  });

  if (!response.ok) {
    return null;
  }

  const payload = await response.json();
  return payload.user || null;
}

async function login(username, password) {
  const response = await nativeFetch("/api/auth/login", {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, password })
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error || "Autentificarea a esuat.");
  }

  return payload.user;
}

function getTelegramWebApp() {
  const tg = typeof window !== "undefined" ? window.Telegram?.WebApp : null;
  if (!tg || !tg.initData) {
    return null;
  }
  return tg;
}

async function telegramLogin(initData) {
  const response = await nativeFetch("/api/auth/telegram", {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ initData })
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error || "Autentificarea Telegram a esuat.");
  }

  return payload.user;
}

async function logout() {
  await nativeFetch("/api/auth/logout", {
    method: "POST",
    credentials: "same-origin"
  });
}

async function changePassword(payload) {
  const response = await apiFetch("/api/auth/change-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Nu am putut schimba parola.");
  }

  return data.user;
}

function setView(view) {
  document.querySelectorAll(".view-tab").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.view === view);
  });

  // Legacy view-section wrappers (few remain)
  document.querySelectorAll(".view-section").forEach((section) => {
    section.classList.toggle("is-active", section.dataset.viewPanel === view);
  });

  // New per-panel data-view gating (Faza 2 sidebar redesign)
  document.querySelectorAll("[data-view]").forEach((el) => {
    if (el.classList.contains("view-tab")) return; // sidebar buttons
    const allowed = String(el.dataset.view || "")
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
    el.hidden = allowed.length > 0 && !allowed.includes(view);
  });

  // Keep parent group open when any sub-view is active
  if (typeof syncSidebarGroups === "function") {
    syncSidebarGroups(view);
  }

  try {
    window.localStorage.setItem("active-view", view);
  } catch (_err) {
    // localStorage blocked — ignore
  }
}

// Helper to safely set text on a dashboard cell (no-op if element missing)
function setDashText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function renderStats(stats) {
  setDashText("dash-hero-value", currency.format(stats.totalValue || 0));
  const totalReceipts = Number(stats.totalReceipts || 0);
  const newReceipts = Number((stats.byStatus && stats.byStatus.Noua) || 0);
  setDashText("dash-value-receipts", formatNumber(totalReceipts));
  setDashText("dash-meta-receipts", formatNumber(newReceipts));
  setDashText("dash-value-quantity", formatNumber(stats.totalQuantity || 0));
  // dash-hero-delta: simple textual hint
  const deltaEl = document.getElementById("dash-hero-delta");
  if (deltaEl) {
    deltaEl.textContent = totalReceipts > 0 ? `▲ ${totalReceipts} recepții active` : "○ stoc inactiv";
  }
}

function renderConfigSummary(summary) {
  const cards = [
    ["Parteneri", summary.partners],
    ["Produse", summary.products],
    ["Locatii", summary.storageLocations],
    ["Tarife", summary.tariffs],
    ["Roluri", summary.roles],
    ["Utilizatori", summary.users]
  ];

  configSummaryEl.innerHTML = cards
    .map(
      ([label, value]) => `
        <article class="stat">
          <span class="stat-label">${label}</span>
          <strong class="stat-value">${value}</strong>
        </article>
      `
    )
    .join("");
}

function renderOpeningDrafts() {
  openingStockBodyEl.innerHTML = openingStockDraft
    .map(
      (item) => `
        <tr>
          <td>${item.product}</td>
          <td>${item.location}</td>
          <td>${formatNumber(item.quantity)}</td>
        </tr>
      `
    )
    .join("");

  openingDebtBodyEl.innerHTML = openingDebtDraft
    .map(
      (item) => `
        <tr>
          <td>${item.partner}</td>
          <td>${item.direction === "collection" ? "Incasare" : "Plata"}</td>
          <td>${currency.format(Number(item.amount || 0))}</td>
        </tr>
      `
    )
    .join("");
}

function renderProcessingStats(stats) {
  if (!stats.processing) return;
  setDashText("dash-value-processing", formatNumber(stats.processing.totalProcessings || 0));
  setDashText("dash-meta-processing", `${formatNumber(stats.processing.totalProcessedQuantity || 0)} t`);
  setDashText("dash-value-waste", formatNumber(stats.processing.totalConfirmedWaste || 0));
}

function renderFinanceStats(stats) {
  if (!stats.finance) return;
  setDashText("dash-value-collections", currency.format(stats.finance.totalCollections || 0));
  setDashText("dash-value-payments", currency.format(stats.finance.totalPayments || 0));
  setDashText("dash-meta-transactions", formatNumber(stats.finance.totalTransactions || 0));
}

function renderDeliveryStats(stats) {
  if (!stats.deliveries || !stats.complaints) return;
  setDashText("dash-value-deliveries", formatNumber(stats.deliveries.totalDeliveries || 0));
  setDashText("dash-meta-deliveries", `${formatNumber(stats.deliveries.totalDeliveredQuantity || 0)} t`);
  setDashText("dash-value-complaints", formatNumber(stats.complaints.openComplaints || 0));
}

function renderAuditStats(stats) {
  if (!stats.audit) return;
  setDashText("dash-meta-modifications", formatNumber(stats.audit.recentAuditLogs || 0));
  renderDashFeed();
}

// Render the activity feed in dashboard from audit logs cache
function renderDashFeed() {
  const body = document.getElementById("dash-feed-body");
  if (!body) return;
  const items = (Array.isArray(auditLogsCache) ? auditLogsCache : []).slice(0, 6);
  if (!items.length) {
    body.innerHTML = '<p class="dash-feed-empty">Nu sunt evenimente recente.</p>';
    return;
  }
  body.innerHTML = items
    .map((log) => {
      const action = String(log.action || "").toLowerCase();
      let dot = "";
      if (/delete|cancel|reject/.test(action)) dot = "red";
      else if (/update|edit|toggle|inactiv/.test(action)) dot = "gold";
      const entity = log.entityType || "—";
      const entityId = log.entityId ? ` #${log.entityId}` : "";
      const reason = (log.reason || log.action || "").toString().slice(0, 80);
      const when = String(log.createdAt || "").replace("T", " ").slice(5, 16);
      const user = log.user || "—";
      return `
        <div class="dash-feed-item">
          <div class="dash-feed-dot ${dot}"></div>
          <div class="dash-feed-body-text">
            <div class="dash-feed-title">${reason || `${entity}${entityId} · ${log.action || ""}`}</div>
            <div class="dash-feed-meta">${when} · ${user}</div>
          </div>
        </div>
      `;
    })
    .join("");
}

function isSunflowerProduct(name) {
  return /floar/i.test(String(name || ""));
}

function getLocationCapacity(loc, productName) {
  const base = Number(loc?.capacity || 0);
  const sunCap = Number(loc?.capacitySunflower || 0);
  if (productName && isSunflowerProduct(productName) && sunCap > 0) {
    return sunCap;
  }
  return base;
}

// Brand colours per product type. Returns { fill, edge, label } palette for SVG.
function getProductPalette(name) {
  const n = String(name || "").toLowerCase();
  if (/grau|grâu|wheat|gri/i.test(n)) {
    return { fill: "#D4B262", edge: "#8B6B1F", label: "#11211A" }; // wheat gold
  }
  if (/porumb|corn|maiz/i.test(n)) {
    return { fill: "#E8A33B", edge: "#A66515", label: "#11211A" }; // corn deep orange
  }
  if (/floar|soarelui|sunflower/i.test(n)) {
    return { fill: "#3A2F1F", edge: "#1A130A", label: "#FBF8EE" }; // sunflower seed dark
  }
  if (/soia|soy/i.test(n)) {
    return { fill: "#C9B373", edge: "#7F6E3C", label: "#11211A" }; // soybean pale tan
  }
  if (/rapit|rapese|rapeseed|colza/i.test(n)) {
    return { fill: "#4A6B2F", edge: "#2A3F1C", label: "#FBF8EE" }; // rapeseed olive
  }
  if (/orz|barley/i.test(n)) {
    return { fill: "#B89669", edge: "#6F5638", label: "#11211A" }; // barley tan
  }
  if (/ovaz|ovăz|oats|oat/i.test(n)) {
    return { fill: "#CFAE7B", edge: "#7B5F32", label: "#11211A" }; // oats
  }
  if (/secara|secară|rye/i.test(n)) {
    return { fill: "#9C8050", edge: "#5D4823", label: "#FBF8EE" }; // rye
  }
  // default neutral grain
  return { fill: "#A8956A", edge: "#5C4D2E", label: "#11211A" };
}

let lastStockSummary = null;

function renderSilosGrid(summary) {
  if (!silosGridEl) return;
  if (summary) lastStockSummary = summary;
  const data = summary || lastStockSummary || { byLocation: [] };

  const cylinders = (currentConfig?.storageLocations || [])
    .filter((loc) => loc.active !== false && String(loc.type || "").toLowerCase() === "cilindru")
    .sort((a, b) => Number(a.id) - Number(b.id));

  if (!cylinders.length) {
    silosGridEl.innerHTML = '<p class="hero-copy" style="grid-column:1/-1;color:var(--muted);">Niciun cilindru configurat. Configurează în Setari → Locatii.</p>';
    return;
  }

  const byLocation = new Map();
  for (const item of data.byLocation || []) {
    const key = String(item.location || "").trim();
    if (!key) continue;
    const existing = byLocation.get(key) || { items: [], total: 0 };
    existing.items.push(item);
    existing.total += Number(item.quantity || 0);
    byLocation.set(key, existing);
  }

  silosGridEl.innerHTML = cylinders
    .map((cyl) => {
      const state = byLocation.get(cyl.name) || { items: [], total: 0 };
      const productList = state.items
        .filter((i) => Number(i.quantity || 0) > 0)
        .sort((a, b) => Number(b.quantity || 0) - Number(a.quantity || 0));
      const dominantProduct = (productList[0] || {}).product || "";
      const productsLabel = productList.map((i) => i.product).join(", ");
      const productsTooltip = productList.map((i) => `${i.product}: ${formatNumber(i.quantity)}t`).join(" · ");
      const capacity = getLocationCapacity(cyl, dominantProduct);
      const filled = Math.max(0, state.total);
      const pct = capacity > 0 ? Math.min(100, (filled / capacity) * 100) : 0;
      const free = Math.max(capacity - filled, 0);
      const pctClass = pct >= 95 ? "is-crit" : pct >= 80 ? "is-warn" : "";
      const palette = getProductPalette(dominantProduct);
      const fillH = Math.max(0, Math.min(120, (pct / 100) * 120));
      const fillY = 28 + (120 - fillH);
      const isEmpty = filled <= 0;
      const ringClass = pct >= 95 ? " is-crit-ring" : pct >= 80 ? " is-warn-ring" : "";

      return `
        <article class="silo-card${ringClass}" data-id="${cyl.id}" title="${cyl.name} · ${formatNumber(filled)}/${formatNumber(capacity)} t · ${productsTooltip || 'gol'}">
          <div class="silo-card-head">
            <span class="silo-name">${cyl.name}</span>
            <span class="silo-pct ${pctClass}">${pct.toFixed(0)}%</span>
          </div>
          <div class="silo-visual">
            <svg viewBox="0 0 100 180" preserveAspectRatio="xMidYMax meet">
              <!-- conical roof -->
              <path d="M14 28 L50 6 L86 28 Z" fill="#D4B262" stroke="#0F3D27" stroke-width="1.2"/>
              <!-- silo body -->
              <rect x="14" y="28" width="72" height="120" rx="2" fill="#F4EFE0" stroke="#0F3D27" stroke-width="1.2"/>
              <!-- shadow on left side -->
              <rect x="14" y="28" width="10" height="120" fill="#0F3D27" opacity="0.12"/>
              <!-- ribs (horizontal) -->
              <line x1="14" y1="58" x2="86" y2="58" stroke="#0F3D27" stroke-width="0.5" opacity="0.35"/>
              <line x1="14" y1="88" x2="86" y2="88" stroke="#0F3D27" stroke-width="0.5" opacity="0.35"/>
              <line x1="14" y1="118" x2="86" y2="118" stroke="#0F3D27" stroke-width="0.5" opacity="0.35"/>
              <!-- fill (grain inside) -->
              <clipPath id="silo-clip-${cyl.id}">
                <rect x="16" y="30" width="68" height="116" rx="1"/>
              </clipPath>
              ${isEmpty ? '' : `<g clip-path="url(#silo-clip-${cyl.id})">
                <rect x="14" y="${fillY}" width="72" height="${fillH}" fill="${palette.fill}"/>
                <rect x="14" y="${fillY}" width="10" height="${fillH}" fill="#0F3D27" opacity="0.18"/>
                <ellipse cx="50" cy="${fillY}" rx="36" ry="3" fill="${palette.edge}" opacity="0.55"/>
                <ellipse cx="50" cy="${fillY}" rx="32" ry="2" fill="${palette.fill}" opacity="0.9"/>
              </g>`}
              <!-- base door -->
              <rect x="46" y="142" width="8" height="6" fill="#0F3D27"/>
              <!-- ground line -->
              <line x1="6" y1="150" x2="94" y2="150" stroke="#D4B262" stroke-width="1.5"/>
              <!-- pct label inside -->
              <text x="50" y="${isEmpty ? 92 : Math.max(fillY + 14, 42)}" font-family="DM Mono, monospace" font-size="11" font-weight="700" text-anchor="middle" fill="${isEmpty ? '#0F3D27' : (pct >= 25 ? palette.label : '#0F3D27')}">${pct.toFixed(0)}%</text>
            </svg>
          </div>
          <div class="silo-stored-line">
            <span class="silo-stored-qty">${formatNumber(filled)} t</span>
            <span class="silo-stored-kg">${formatNumber(filled * 1000)} kg</span>
          </div>
          <div class="silo-meta">
            <span>Liber <b>${formatNumber(free)}t</b></span>
            ${dominantProduct
              ? `<span class="silo-product" style="color:${palette.edge};" title="${productsTooltip}"><span class="silo-product-dot" style="background:${palette.fill};border-color:${palette.edge};"></span>${productsLabel}</span>`
              : '<span class="silo-product silo-product-empty">gol</span>'}
          </div>
        </article>
      `;
    })
    .join("");

  // Aggregate stock per product across all cylinders (Etapa 3)
  renderStockByProduct(data);
}

function renderStockByProduct(data) {
  const el = document.getElementById("stock-by-product");
  if (!el) return;

  const byProduct = new Map();
  let grandTotal = 0;
  for (const item of data.byLocation || []) {
    const product = String(item.product || "").trim();
    if (!product) continue;
    const qty = Number(item.quantity || 0);
    grandTotal += qty;
    const existing = byProduct.get(product) || { qty: 0, locations: new Set() };
    existing.qty += qty;
    if (item.location) existing.locations.add(item.location);
    byProduct.set(product, existing);
  }

  if (!byProduct.size) {
    el.innerHTML = "";
    return;
  }

  const rows = Array.from(byProduct.entries())
    .sort((a, b) => b[1].qty - a[1].qty)
    .map(([product, info]) => {
      const palette = getProductPalette(product);
      return `
        <tr>
          <td><span class="sbp-dot" style="background:${palette.fill};border-color:${palette.edge};"></span>${product}</td>
          <td>${formatNumber(info.qty)} t</td>
          <td>${formatNumber(info.qty * 1000)} kg</td>
          <td>${info.locations.size} ${info.locations.size === 1 ? "cilindru" : "cilindri"}</td>
        </tr>
      `;
    })
    .join("");

  el.innerHTML = `
    <div class="sbp-head">
      <h3>Stoc total pe produs</h3>
      <span class="sbp-total">Total: <b>${formatNumber(grandTotal)} t</b> · ${formatNumber(grandTotal * 1000)} kg</span>
    </div>
    <div class="table-wrap">
      <table>
        <thead>
          <tr><th>Produs</th><th>Cantitate (t)</th><th>Cantitate (kg)</th><th>Locatii</th></tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

function renderStockSummary(summary) {
  renderSilosGrid(summary);
  const cards = [
    ["Cantitate stoc", formatNumber(summary.totals.totalQuantity)],
    ["Locatii active", summary.totals.totalLocations],
    ["Produse in stoc", summary.totals.totalProducts]
  ];

  stockSummaryEl.innerHTML = cards
    .map(
      ([label, value]) => `
        <article class="stat stat-secondary">
          <span class="stat-label">${label}</span>
          <strong class="stat-value">${value}</strong>
        </article>
      `
    )
    .join("");

  stocksBodyEl.innerHTML = summary.byLocation
    .map(
      (item) => `
        <tr>
          <td>${item.location}</td>
          <td>${item.product}</td>
          <td>${formatNumber(item.quantity)} t</td>
          <td>${formatNumber(item.quantity * 1000)} kg</td>
        </tr>
      `
    )
    .join("");
}

function renderAutomationStatus(status) {
  if (!automationStatusSummaryEl || !automationAudienceBodyEl) {
    return;
  }

  if (!status) {
    automationStatusSummaryEl.innerHTML = "";
    automationAudienceBodyEl.innerHTML = "";
    return;
  }

  const cards = [
    ["Bot Telegram", status.botReady ? "Activ" : "Inactiv"],
    ["Ultima trimitere", status.lastSentDate || "-"],
    ["Programata azi", status.dueNow ? "Da" : "Nu"],
    ["Destinatari activi", String((status.linkedRecipients || []).length)]
  ];

  automationStatusSummaryEl.innerHTML = cards
    .map(
      ([label, value]) => `
        <article class="estimate-card">
          <span>${label}</span>
          <strong>${value}</strong>
        </article>
      `
    )
    .join("");

  automationAudienceBodyEl.innerHTML = (status.resolvedAudience || [])
    .map(
      (item) => `
        <tr>
          <td>${item.name}</td>
          <td>${item.roleCode || "-"}</td>
          <td>${item.channel || "-"}</td>
          <td>${item.canReceiveTelegram ? "Legat" : "Lipsa legare"}</td>
          <td>${item.lastSeenAt ? new Date(item.lastSeenAt).toLocaleString("ro-RO") : "-"}</td>
        </tr>
      `
    )
    .join("");
}

function renderCriticalAlertsStatus(status) {
  if (!criticalAlertsSummaryEl || !criticalAlertsBodyEl) {
    return;
  }

  if (!status) {
    criticalAlertsSummaryEl.innerHTML = "";
    criticalAlertsBodyEl.innerHTML = "";
    return;
  }

  const cards = [
    ["Bot Telegram", status.botReady ? "Activ" : "Inactiv"],
    ["Alerte urmarite", String(status.totalTrackedAlerts || 0)],
    ["Alerte critice deschise", String(status.criticalOpenAlerts || 0)],
    ["Escaladate", String(status.escalatedAlerts || 0)]
  ];

  criticalAlertsSummaryEl.innerHTML = cards
    .map(
      ([label, value]) => `
        <article class="estimate-card">
          <span>${label}</span>
          <strong>${value}</strong>
        </article>
      `
    )
    .join("");

  criticalAlertsBodyEl.innerHTML = (status.criticalAlerts || [])
    .map(
      (item) => `
        <tr>
          <td>${item.date}</td>
          <td>${item.status}</td>
          <td>${item.workflowStatus}</td>
          <td>${item.lastReason || "-"}</td>
          <td>V:${item.viewedCount} | L:${item.inProgressCount} | R:${item.resolvedCount}</td>
          <td>
            Vazuta: ${item.viewedActors || "-"}<br />
            In lucru: ${item.inProgressActors || "-"}<br />
            Rezolvata: ${item.resolvedActors || "-"}
          </td>
          <td>${item.escalatedAt ? `${item.escalationCount} / ${new Date(item.escalatedAt).toLocaleString("ro-RO")} / ${item.escalationReason || "-"}` : "-"}</td>
          <td>${item.lastAlertAt ? new Date(item.lastAlertAt).toLocaleString("ro-RO") : "-"}</td>
        </tr>
      `
    )
    .join("");
}

function statusOptions(current) {
  return ["Draft", "Confirmat", "Procesata", "Inchis", "Anulat", "Redeschis", "Noua", "Verificata", "Finalizata"].map((status) => {
    const selected = current === status ? "selected" : "";
    return `<option value="${status}" ${selected}>${status}</option>`;
  });
}

// ---- Date-range filtering + totals helpers (Etapa 2) ----
function formatDateShort(iso) {
  if (!iso) return "-";
  const s = String(iso);
  // yyyy-mm-dd -> dd.mm.yyyy
  const datePart = s.slice(0, 10);
  const m = datePart.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return m ? `${m[3]}.${m[2]}.${m[1]}` : datePart;
}

function withinDateRange(item, dateFields, fromEl, toEl) {
  const from = fromEl && fromEl.value ? fromEl.value : "";
  const to = toEl && toEl.value ? toEl.value : "";
  if (!from && !to) return true;
  // Find the first available date field on the item
  let raw = "";
  for (const f of dateFields) {
    if (item[f]) { raw = String(item[f]); break; }
  }
  const day = raw.slice(0, 10);
  if (!day) return true; // no date on record — don't hide it
  if (from && day < from) return false;
  if (to && day > to) return false;
  return true;
}

function renderReceipts(receipts) {
  const canEditStatuses = canAccess("receipt-write");
  const canChangeSupplier = canAccess("finance");
  // Operatorul nu vede coloanele de plata (plata preliminara, data platii).
  const receiptsTable = document.getElementById("receipts-table");
  if (receiptsTable) {
    receiptsTable.classList.toggle("hide-fin", !canAccess("finance"));
  }
  const filteredReceipts = receipts.filter((item) => {
    const statusMatch = !receiptStatusFilterEl.value || item.status === receiptStatusFilterEl.value;
    const productMatch = !receiptProductFilterEl.value || item.product === receiptProductFilterEl.value;
    const dateMatch = withinDateRange(item, ["createdAt", "receivedAt"], receiptDateFromEl, receiptDateToEl);
    return statusMatch && productMatch && dateMatch;
  });

  bodyEl.innerHTML = filteredReceipts
    .map((item) => {
      return `
        <tr>
          <td>#${item.id}</td>
          <td>${formatDateShort(item.createdAt || item.receivedAt)}</td>
          <td>${item.product}</td>
          <td class="supplier-cell" data-id="${item.id}">
            <span class="supplier-name">${item.supplier}</span>
            ${canChangeSupplier ? `<button type="button" class="cell-btn change-supplier-btn" data-action="change-supplier" data-id="${item.id}" title="Schimbă furnizorul">✎</button>` : ""}
          </td>
          <td>${formatQtyByEntry(item.grossQuantity || item.quantity, item)} / ${formatQtyByEntry(item.provisionalNetQuantity || item.quantity, item)}</td>
          <td>${item.location || "-"}</td>
          <td class="col-fin">${currency.format(Number(item.preliminaryPayableAmount || 0))}</td>
          <td class="col-fin">${formatDateShort(item.paymentDate || item.paidAt)}</td>
          <td>
            <select class="status" data-id="${item.id}" ${canEditStatuses ? "" : "disabled"}>
              ${statusOptions(item.status).join("")}
            </select>
          </td>
          <td>${item.source}</td>
        </tr>
      `;
    })
    .join("");

  // Totals footer (grouped by product)
  if (receiptsFootEl) {
    renderReceiptTotals(filteredReceipts);
  }
}

function renderReceiptTotals(rows) {
  if (!rows.length) {
    receiptsFootEl.innerHTML = "";
    return;
  }
  const byProduct = {};
  let totalNet = 0;
  let totalPay = 0;
  rows.forEach((item) => {
    const net = Number(item.provisionalNetQuantity || item.quantity || 0);
    const pay = Number(item.preliminaryPayableAmount || 0);
    totalNet += net;
    totalPay += pay;
    const key = item.product || "—";
    byProduct[key] = (byProduct[key] || 0) + net;
  });
  const perProduct = Object.entries(byProduct)
    .map(([prod, qty]) => `${prod}: ${formatNumber(qty)} t`)
    .join(" · ");
  const payPart = canAccess("finance")
    ? `&nbsp;·&nbsp; Plată prelim: <b>${currency.format(totalPay)}</b> `
    : "";
  receiptsFootEl.innerHTML = `
    <tr class="totals-row">
      <td colspan="10">TOTAL (${rows.length} recepții) &nbsp;·&nbsp; Net: <b>${formatNumber(totalNet)} t</b> ${payPart}&nbsp;·&nbsp; ${perProduct}</td>
    </tr>
  `;
}

// La finele zilei: daca au fost receptii azi dar nicio procesare, atentioneaza operatorul.
function checkEndOfDayProcessing() {
  if (!eodBanner) return;
  const today = new Date().toISOString().slice(0, 10);
  let confirmed = false;
  try {
    confirmed = window.localStorage.getItem(`eod-no-processing-${today}`) === "1";
  } catch (_e) {
    confirmed = false;
  }
  const todaysReceipts = receiptsCache.filter(
    (r) => String(r.createdAt || r.receivedAt || "").slice(0, 10) === today && r.status !== "Anulat"
  );
  const todaysProcessings = processingsCache.filter(
    (p) => String(p.createdAt || p.processedAt || "").slice(0, 10) === today
  );
  eodBanner.hidden = !(todaysReceipts.length > 0 && todaysProcessings.length === 0 && !confirmed);
}

// Stoc neprocesat pe produs: receptii care inca nu au fost procesate.
function renderUnprocessedStock() {
  if (!unprocessedStockBodyEl) return;
  const byProduct = {};
  receiptsCache.forEach((r) => {
    if (r.status === "Procesata" || r.status === "Anulat") return;
    const net = Number(r.provisionalNetQuantity ?? r.quantity ?? 0);
    const key = r.product || "—";
    if (!byProduct[key]) byProduct[key] = { tons: 0, count: 0 };
    byProduct[key].tons += net;
    byProduct[key].count += 1;
  });
  const rows = Object.entries(byProduct).sort((a, b) => b[1].tons - a[1].tons);
  if (!rows.length) {
    unprocessedStockBodyEl.innerHTML = '<tr><td colspan="4">Tot stocul recepționat este procesat.</td></tr>';
    return;
  }
  unprocessedStockBodyEl.innerHTML = rows
    .map(
      ([prod, v]) =>
        `<tr><td>${prod}</td><td>${formatNumber(v.tons)} t</td><td>${formatNumber(v.tons * 1000)} kg</td><td>${v.count}</td></tr>`
    )
    .join("");
}

function renderProcessings(processings) {
  const canEditStatuses = canAccess("processing-write");
  const filteredProcessings = processings.filter((item) => {
    const typeMatch =
      !processingTypeFilterEl.value || item.processingType === processingTypeFilterEl.value;
    const receiptMatch =
      !processingReceiptFilterEl.value || String(item.receiptId) === processingReceiptFilterEl.value;
    const dateMatch = withinDateRange(item, ["createdAt", "processedAt"], processingDateFromEl, processingDateToEl);
    return typeMatch && receiptMatch && dateMatch;
  });

  processingsBodyEl.innerHTML = filteredProcessings
    .map(
      (item) => `
        <tr>
          <td>#${item.id}</td>
          <td>${formatDateShort(item.createdAt || item.processedAt)}</td>
          <td>${item.product}</td>
          <td>${item.lot || "-"}</td>
          <td>#${item.receiptId}</td>
          <td>${item.processingType}</td>
          <td>${formatNumber(item.processedQuantity)}</td>
          <td>${formatNumber(item.confirmedWaste)}</td>
          <td>
            <div>${formatNumber(item.finalNetQuantity)}</div>
            <select class="processing-status" data-id="${item.id}" ${canEditStatuses ? "" : "disabled"}>
              ${["Confirmat", "Inchis", "Anulat", "Redeschis"].map((status) => {
                const selected = item.status === status ? "selected" : "";
                return `<option value="${status}" ${selected}>${status}</option>`;
              }).join("")}
            </select>
          </td>
        </tr>
      `
    )
    .join("");

  if (processingsFootEl) {
    renderProcessingTotals(filteredProcessings);
  }
}

function renderProcessingTotals(rows) {
  if (!rows.length) {
    processingsFootEl.innerHTML = "";
    return;
  }
  // Total per product: processed, waste, remaining (final net)
  const byProduct = {};
  let totProcessed = 0;
  let totWaste = 0;
  let totFinal = 0;
  rows.forEach((item) => {
    const proc = Number(item.processedQuantity || 0);
    const waste = Number(item.confirmedWaste || 0);
    const fin = Number(item.finalNetQuantity || 0);
    totProcessed += proc;
    totWaste += waste;
    totFinal += fin;
    const key = item.product || "—";
    if (!byProduct[key]) byProduct[key] = { proc: 0, waste: 0, fin: 0 };
    byProduct[key].proc += proc;
    byProduct[key].waste += waste;
    byProduct[key].fin += fin;
  });
  const perProduct = Object.entries(byProduct)
    .map(([prod, v]) => `${prod}: ${formatNumber(v.proc)} proc / ${formatNumber(v.waste)} deșeu / ${formatNumber(v.fin)} rămas`)
    .join("  ·  ");
  processingsFootEl.innerHTML = `
    <tr class="totals-row">
      <td colspan="9">TOTAL (${rows.length}) &nbsp;·&nbsp; Procesat: <b>${formatNumber(totProcessed)}</b> · Deșeu: <b>${formatNumber(totWaste)}</b> · Rămas: <b>${formatNumber(totFinal)}</b> &nbsp;·&nbsp; ${perProduct}</td>
    </tr>
  `;
}

function renderTransactions(transactions) {
  const canEditStatuses = canAccess("finance-write");
  const filtered = transactions.filter((item) =>
    withinDateRange(item, ["createdAt", "transactedAt"], transactionDateFromEl, transactionDateToEl)
  );
  transactionsBodyEl.innerHTML = filtered
    .map(
      (item) => `
        <tr>
          <td>#${item.id}</td>
          <td>${formatDateShort(item.createdAt || item.transactedAt)}</td>
          <td>${item.referenceType === "delivery" ? `Livrare #${item.deliveryId}` : `Receptie #${item.receiptId}`}</td>
          <td>${item.partner}</td>
          <td>${item.direction === "collection" ? "Incasare" : "Plata"}</td>
          <td>
            <div>${item.paymentType || "-"}</div>
            <select class="transaction-status" data-id="${item.id}" ${canEditStatuses ? "" : "disabled"}>
              ${["Confirmat", "Inchis", "Anulat", "Redeschis"].map((status) => {
                const selected = item.status === status ? "selected" : "";
                return `<option value="${status}" ${selected}>${status}</option>`;
              }).join("")}
            </select>
          </td>
          <td>${currency.format(Number(item.amount || 0))}</td>
        </tr>
      `
    )
    .join("");

  if (transactionsFootEl) {
    renderTransactionTotals(filtered);
  }
}

function renderTransactionTotals(rows) {
  if (!rows.length) {
    transactionsFootEl.innerHTML = "";
    return;
  }
  let totalCollections = 0;
  let totalPayments = 0;
  let cashTotal = 0;
  let transferTotal = 0;
  rows.forEach((item) => {
    const amt = Number(item.amount || 0);
    if (item.direction === "collection") totalCollections += amt;
    else totalPayments += amt;
    const pt = String(item.paymentType || "").toLowerCase();
    if (pt.includes("numerar") || pt.includes("cash")) cashTotal += amt;
    else if (pt.includes("transfer")) transferTotal += amt;
  });
  transactionsFootEl.innerHTML = `
    <tr class="totals-row">
      <td colspan="7">TOTAL (${rows.length}) &nbsp;·&nbsp; Numerar: <b>${currency.format(cashTotal)}</b> · Transfer: <b>${currency.format(transferTotal)}</b> &nbsp;·&nbsp; Încasări: <b>${currency.format(totalCollections)}</b> · Plăți: <b>${currency.format(totalPayments)}</b></td>
    </tr>
  `;
}

const DELIVERY_TRANSITIONS = {
  Proiect: ["Confirmat", "Anulat"],
  Confirmat: ["Livrat", "Anulat"],
  Livrat: ["Inchis", "Redeschis"],
  Inchis: ["Redeschis"],
  Redeschis: ["Livrat", "Inchis", "Anulat"],
  Anulat: []
};

function deliveryStatusBadge(status) {
  const classMap = {
    Proiect: "badge-neutral",
    Confirmat: "badge-warn",
    Livrat: "badge-ok",
    Inchis: "badge-neutral",
    Anulat: "badge-alert",
    Redeschis: "badge-warn"
  };
  const label = status === "Confirmat" ? "Confirmat (Rezervat)" : status || "Proiect";
  return `<span class="status-badge ${classMap[status] || "badge-neutral"}">${label}</span>`;
}

// Cantitatea afisata: greutatea neta reala daca s-a livrat, altfel cantitatea livrata,
// altfel cantitatea planificata (cea introdusa de operator). Evita afisarea "0"/"-0".
function deliveryDisplayQuantity(item) {
  if (Number(item.netWeight) > 0) return Number(item.netWeight);
  if (Number(item.deliveredQuantity) > 0) return Number(item.deliveredQuantity);
  return Number(item.plannedQuantity || 0);
}

function renderDeliveries(deliveries) {
  const canEditStatuses = canAccess("delivery-write");
  // Financial columns (vanzator, masina, pret) hidden for operators (no finance access)
  const deliveriesTable = document.getElementById("deliveries-table");
  if (deliveriesTable) {
    deliveriesTable.classList.toggle("hide-fin", !canAccess("finance"));
  }
  const filtered = deliveries.filter((item) =>
    withinDateRange(item, ["createdAt", "deliveredAt"], deliveryDateFromEl, deliveryDateToEl)
  );
  deliveriesBodyEl.innerHTML = filtered
    .map((item) => {
      const status = item.status || "Proiect";
      const allowed = DELIVERY_TRANSITIONS[status] || [];
      const buttons = canEditStatuses
        ? allowed
            .map(
              (next) => `<button type="button" class="delivery-action" data-id="${item.id}" data-action="${next}">${next}</button>`
            )
            .join(" ")
        : "";
      const qty = deliveryDisplayQuantity(item);
      const priceLabel = item.priceForeign && item.currency && item.currency !== "MDL"
        ? `${formatNumber(item.priceForeign)} ${item.currency}`
        : (item.priceLei ? `${formatNumber(item.priceLei)} MDL` : "-");
      return `
        <tr>
          <td>#${item.id}</td>
          <td>${formatDateShort(item.createdAt || item.deliveredAt)}</td>
          <td>#${item.receiptId}</td>
          <td>${item.customer}</td>
          <td class="col-fin">${item.seller || "-"}</td>
          <td>${item.product}</td>
          <td>${formatQtyByEntry(qty, item)}</td>
          <td class="col-fin">${item.vehicle || "-"}</td>
          <td class="col-fin">${priceLabel}</td>
          <td>
            <div>${item.invoiceNumber || "-"}</div>
            ${item.note ? `<div class="row-note">${item.note}</div>` : ""}
            <div>${deliveryStatusBadge(status)}</div>
            <div class="action-row">${buttons}</div>
            ${canAccess("finance") ? `<div class="doc-print-row">
              <button type="button" class="cell-btn cell-btn-primary" data-action="edit-billing" data-id="${item.id}">Date factură</button>
              <button type="button" class="doc-print-btn" data-print="invoice" data-id="${item.id}">Factură</button>
              <button type="button" class="doc-print-btn" data-print="certificate" data-id="${item.id}">Certificat</button>
              <button type="button" class="doc-print-btn" data-print="act" data-id="${item.id}">Act achiziție</button>
            </div>` : ""}
          </td>
        </tr>
      `;
    })
    .join("");

  if (deliveriesFootEl) {
    renderDeliveryTotals(filtered);
  }
}

function renderDeliveryTotals(rows) {
  if (!rows.length) {
    deliveriesFootEl.innerHTML = "";
    return;
  }
  const byProduct = {};
  let totalQty = 0;
  rows.forEach((item) => {
    const qty = deliveryDisplayQuantity(item);
    totalQty += qty;
    const key = item.product || "—";
    byProduct[key] = (byProduct[key] || 0) + qty;
  });
  const perProduct = Object.entries(byProduct)
    .map(([prod, qty]) => `${prod}: ${formatNumber(qty)} t`)
    .join(" · ");
  deliveriesFootEl.innerHTML = `
    <tr class="totals-row">
      <td colspan="10">TOTAL (${rows.length} livrări) &nbsp;·&nbsp; Cantitate: <b>${formatNumber(totalQty)} t</b> &nbsp;·&nbsp; ${perProduct}</td>
    </tr>
  `;
}

function renderComplaints(complaints) {
  const canEditStatuses = canAccess("complaint-write");
  complaintsBodyEl.innerHTML = complaints
    .map(
      (item) => `
        <tr>
          <td>#${item.id}</td>
          <td>#${item.deliveryId}</td>
          <td>${item.customer}</td>
          <td>${item.complaintType}</td>
          <td>${formatNumber(item.contestedQuantity)}</td>
          <td>
            <select class="complaint-status" data-id="${item.id}" ${canEditStatuses ? "" : "disabled"}>
              ${["Deschisa", "Acceptata", "Respinsa", "Inchisa", "Redeschisa"].map((status) => {
                const selected = item.status === status ? "selected" : "";
                return `<option value="${status}" ${selected}>${status}</option>`;
              }).join("")}
            </select>
          </td>
        </tr>
      `
    )
    .join("");
}

function renderOpenJournal() {
  const partnerFilter = String(openPartnerFilterEl.value || "").trim().toLowerCase();
  const receiptStatusFilter = openReceiptStatusFilterEl.value;
  const deliveryStatusFilter = openDeliveryStatusFilterEl.value;

  const openReceipts = receiptsCache.filter((item) => {
    const status = item.paymentStatus || "Neachitat";
    const statusMatch = !receiptStatusFilter || status === receiptStatusFilter;
    const partnerMatch = !partnerFilter || String(item.supplier || "").toLowerCase().includes(partnerFilter);
    return statusMatch && partnerMatch;
  });
  const openingPaymentDebts = openingDocumentsCache
    .flatMap((item) => item.debtItems || [])
    .filter((item) => item.direction === "payment")
    .filter((item) => {
      const statusMatch = !receiptStatusFilter || (item.status || "Neachitat") === receiptStatusFilter;
      const partnerMatch =
        !partnerFilter || String(item.partner || "").toLowerCase().includes(partnerFilter);
      return statusMatch && partnerMatch;
    });

  const openDeliveries = deliveriesCache.filter((item) => {
    const status = item.collectionStatus || "Neincasat";
    const statusMatch = !deliveryStatusFilter || status === deliveryStatusFilter;
    const partnerMatch = !partnerFilter || String(item.customer || "").toLowerCase().includes(partnerFilter);
    return statusMatch && partnerMatch;
  });
  const openingCollectionDebts = openingDocumentsCache
    .flatMap((item) => item.debtItems || [])
    .filter((item) => item.direction === "collection")
    .filter((item) => {
      const statusMatch = !deliveryStatusFilter || (item.status || "Neincasat") === deliveryStatusFilter;
      const partnerMatch =
        !partnerFilter || String(item.partner || "").toLowerCase().includes(partnerFilter);
      return statusMatch && partnerMatch;
    });

  openReceiptsBodyEl.innerHTML = [...openingPaymentDebts, ...openReceipts]
    .map(
      (item) => `
        <tr>
          <td>${item.id ? `#${item.id}` : "Sold initial"}</td>
          <td>${item.supplier || item.partner}</td>
          <td>${currency.format(Number(item.preliminaryPayableAmount || item.amount || 0))}</td>
          <td>${currency.format(Number(item.paidAmount || item.settledAmount || 0))}</td>
          <td>${item.paymentStatus || item.status || "Neachitat"}</td>
        </tr>
      `
    )
    .join("");

  openDeliveriesBodyEl.innerHTML = [...openingCollectionDebts, ...openDeliveries]
    .map(
      (item) => `
        <tr>
          <td>${item.id ? `#${item.id}` : "Sold initial"}</td>
          <td>${item.customer || item.partner}</td>
          <td>${currency.format(Number(item.contractPrice || 0) * Number(item.deliveredQuantity || 0) || Number(item.amount || 0))}</td>
          <td>${currency.format(Number(item.collectedAmount || item.settledAmount || 0))}</td>
          <td>${item.collectionStatus || item.status || "Neincasat"}</td>
        </tr>
      `
    )
    .join("");
}

function renderAuditLogs(auditLogs) {
  auditBodyEl.innerHTML = auditLogs
    .slice(0, 20)
    .map(
      (item) => `
        <tr>
          <td>#${item.id}</td>
          <td>${item.entityType}${item.entityId ? ` #${item.entityId}` : ""}</td>
          <td>${item.action}</td>
          <td>${item.user || "-"}</td>
          <td>${item.reason}</td>
          <td>${String(item.createdAt || "").replace("T", " ").slice(0, 16)}</td>
        </tr>
      `
    )
    .join("");
}

function renderLockouts(lockouts) {
  if (!lockoutsBodyEl) {
    return;
  }

  if (!lockouts.length) {
    lockoutsBodyEl.innerHTML = `
      <tr>
        <td colspan="4">Nu exista utilizatori blocati in acest moment.</td>
      </tr>
    `;
    return;
  }

  lockoutsBodyEl.innerHTML = lockouts
    .map(
      (item) => `
        <tr>
          <td>${item.username}</td>
          <td>${String(item.blockedUntil || "").replace("T", " ").slice(0, 16)}</td>
          <td>${Math.max(Math.ceil(Number(item.retryAfterMs || 0) / 60000), 1)} min</td>
          <td>
            <button class="ghost-button unlock-user-button" type="button" data-username="${item.username}">
              Deblocheaza
            </button>
          </td>
        </tr>
      `
    )
    .join("");
}

function renderDailyReport(report) {
  const cards = [
    ["Receptii", report.summary.receiptsCount],
    ["Brut intrat", formatNumber(report.summary.grossQuantity)],
    ["Net provizoriu", formatNumber(report.summary.provisionalNetQuantity)],
    ["Procesat", formatNumber(report.summary.processedQuantity)],
    ["Livrat", formatNumber(report.summary.deliveredQuantity || 0)],
    ["Deseu", formatNumber(report.summary.confirmedWaste)],
    ["Plati", currency.format(report.summary.paymentsTotal || 0)],
    ["Incasari", currency.format(report.summary.collectionsTotal || 0)],
    ["Reclamatii deschise", report.summary.openComplaints || 0],
    ["Stoc total", formatNumber(report.summary.stockTotal)]
  ];

  dailyReportSummaryEl.innerHTML = cards
    .map(
      ([label, value]) => `
        <article class="stat stat-secondary">
          <span class="stat-label">${label}</span>
          <strong class="stat-value">${value}</strong>
        </article>
      `
    )
    .join("");

  dailyReportReceiptsEl.innerHTML = report.receipts
    .map(
      (item) => `
        <tr>
          <td>#${item.id}</td>
          <td>${item.supplier}</td>
          <td>${item.product}</td>
          <td>${formatNumber(item.grossQuantity || item.quantity)}</td>
          <td>${formatNumber(item.provisionalNetQuantity || item.quantity)}</td>
        </tr>
      `
    )
    .join("");

  dailyReportProcessingsEl.innerHTML = report.processings
    .map(
      (item) => `
        <tr>
          <td>#${item.id}</td>
          <td>#${item.receiptId}</td>
          <td>${item.processingType}</td>
          <td>${formatNumber(item.processedQuantity)}</td>
          <td>${formatNumber(item.confirmedWaste)}</td>
        </tr>
      `
    )
    .join("");

  dailyReportTransactionsEl.innerHTML = report.transactions
    .map(
      (item) => `
        <tr>
          <td>#${item.id}</td>
          <td>${item.partner}</td>
          <td>${item.direction === "collection" ? "Incasare" : "Plata"}</td>
          <td>${item.paymentType || "-"}</td>
          <td>${currency.format(Number(item.amount || 0))}</td>
        </tr>
      `
    )
    .join("");

  dailyReportDeliveriesEl.innerHTML = (report.deliveries || [])
    .map(
      (item) => `
        <tr>
          <td>#${item.id}</td>
          <td>${item.customer}</td>
          <td>${item.product}</td>
          <td>${formatNumber(item.deliveredQuantity)}</td>
          <td>${item.invoiceNumber || "-"}</td>
        </tr>
      `
    )
    .join("");

  dailyReportComplaintsEl.innerHTML = (report.complaints || [])
    .map(
      (item) => `
        <tr>
          <td>#${item.id}</td>
          <td>#${item.deliveryId}</td>
          <td>${item.complaintType}</td>
          <td>${formatNumber(item.contestedQuantity)}</td>
          <td>${item.status}</td>
        </tr>
      `
    )
    .join("");
}

function renderSelectOptions(select, items, mapLabel, placeholder, mapValue = (item) => item.id || item.code) {
  const options = [
    `<option value="" disabled selected>${placeholder}</option>`,
    ...items.map((item) => `<option value="${mapValue(item)}">${mapLabel(item)}</option>`)
  ];

  select.innerHTML = options.join("");
}

function setSelectValue(select, preferredValues = []) {
  const availableValues = Array.from(select.options)
    .filter((option) => !option.disabled)
    .map((option) => String(option.value));
  const matchedValue = preferredValues.find((value) =>
    value !== undefined &&
    value !== null &&
    value !== "" &&
    availableValues.includes(String(value))
  );

  select.value = matchedValue !== undefined ? String(matchedValue) : availableValues[0] || "";
  return select.value;
}

function renderReceiptSelectors(config) {
  const currentSelections = {
    supplierId: supplierSelect.value,
    productId: productSelect.value,
    locationId: locationSelect.value,
    receivedBy: userSelect.value,
    processingReceiptId: processingReceiptSelect.value,
    processingType: processingTypeSelect.value,
    processingUserId: processingUserSelect.value,
    paymentType: transactionPaymentTypeSelect.value,
    deliveryReceiptId: deliveryReceiptSelect.value,
    deliveryCustomerId: deliveryCustomerSelect.value,
    complaintDeliveryId: complaintDeliverySelect.value
  };
  const suppliers = config.partners
    .filter((item) => item.role === "furnizor" || item.role === "ambele")
    .sort((a, b) => String(a.name).localeCompare(String(b.name), "ro", { sensitivity: "base" }));
  const customers = config.partners
    .filter((item) => item.role === "cumparator" || item.role === "ambele")
    .sort((a, b) => String(a.name).localeCompare(String(b.name), "ro", { sensitivity: "base" }));
  const operators = config.users.filter((item) =>
    ["operator", "manager", "admin"].includes(item.roleCode)
  );

  renderSelectOptions(supplierSelect, suppliers, (item) => item.name, "Selecteaza furnizor");
  // Operatorul poate adauga pe loc un furnizor nou (persoana fizica) daca nu e in lista
  if (canAccess("receipt-write")) {
    supplierSelect.insertAdjacentHTML(
      "beforeend",
      '<option value="__new__">➕ Furnizor nou (persoană fizică)</option>'
    );
  }
  renderSelectOptions(productSelect, config.products, (item) => `${item.name} (${item.code})`, "Selecteaza produs");
  renderSelectOptions(locationSelect, config.storageLocations, (item) => item.name, "Selecteaza locatie");
  renderSelectOptions(userSelect, operators, (item) => item.name, "Selecteaza utilizator");
  renderSelectOptions(
    openingStockProductEl,
    config.products,
    (item) => `${item.name} (${item.code})`,
    "Selecteaza produs"
  );
  renderSelectOptions(
    openingStockLocationEl,
    config.storageLocations,
    (item) => item.name,
    "Selecteaza locatie"
  );
  renderSelectOptions(
    openingDebtPartnerEl,
    config.partners,
    (item) => item.name,
    "Selecteaza partener"
  );

  setSelectValue(supplierSelect, [currentSelections.supplierId, suppliers[0]?.id]);
  setSelectValue(productSelect, [currentSelections.productId, config.products[0]?.id]);
  setSelectValue(locationSelect, [currentSelections.locationId, config.storageLocations[0]?.id]);
  setSelectValue(userSelect, [currentSessionUser?.id, currentSelections.receivedBy, operators[0]?.id]);
  setSelectValue(openingStockProductEl, [openingStockProductEl.value, config.products[0]?.id]);
  setSelectValue(openingStockLocationEl, [openingStockLocationEl.value, config.storageLocations[0]?.id]);
  setSelectValue(openingDebtPartnerEl, [openingDebtPartnerEl.value, config.partners[0]?.id]);
  syncUnitByProduct();

  const processingReceiptOptions = receiptsCache.filter((item) => item.status !== "Procesata");
  renderSelectOptions(
    processingReceiptSelect,
    processingReceiptOptions,
    (item) => `#${item.id} - ${item.product} - ${item.supplier}`,
    processingReceiptOptions.length ? "Selecteaza receptia" : "Nu există recepții disponibile — adaugă mai întâi o recepție"
  );
  if (processingReceiptSelect) {
    processingReceiptSelect.disabled = !processingReceiptOptions.length;
    processingReceiptSelect.title = processingReceiptOptions.length
      ? "Alege lotul de recepție pe care îl procesezi"
      : "Mai întâi creează o recepție din meniul Recepții";
  }
  renderSelectOptions(
    processingTypeSelect,
    config.processingTypes.filter((item) => item.active),
    (item) => item.name,
    "Selecteaza procesarea",
    (item) => item.name
  );
  renderSelectOptions(
    processingUserSelect,
    operators,
    (item) => item.name,
    "Selecteaza operator"
  );
  renderSelectOptions(
    transactionPaymentTypeSelect,
    config.paymentTypes.filter((item) => item.active),
    (item) => item.name,
    "Selecteaza tipul de plata",
    (item) => item.name
  );
  renderSelectOptions(
    deliveryReceiptSelect,
    receiptsCache.filter(
      (item) =>
        Number(
          item.availableQuantity ??
            item.finalNetQuantity ??
            item.provisionalNetQuantity ??
            item.quantity
        ) > 0
    ),
    (item) => `#${item.id} - ${item.product} - ${item.location || "-"}`,
    "Selecteaza receptia"
  );
  renderSelectOptions(
    deliveryCustomerSelect,
    customers,
    (item) => item.name,
    "Selecteaza cumparator"
  );
  renderSelectOptions(
    complaintDeliverySelect,
    deliveriesCache,
    (item) => `#${item.id} - ${item.customer} - ${item.product}`,
    "Selecteaza livrarea"
  );

  const activePaymentType = config.paymentTypes.find((item) => item.active);
  setSelectValue(processingReceiptSelect, [currentSelections.processingReceiptId, processingReceiptOptions[0]?.id]);
  autofillProcessingLot();
  setSelectValue(
    processingTypeSelect,
    [currentSelections.processingType, config.processingTypes.find((item) => item.active)?.name]
  );
  setSelectValue(processingUserSelect, [currentSelections.processingUserId, currentSessionUser?.id, operators[0]?.id]);
  setSelectValue(transactionPaymentTypeSelect, [currentSelections.paymentType, activePaymentType?.name]);
  setSelectValue(
    deliveryReceiptSelect,
    [
      currentSelections.deliveryReceiptId,
      receiptsCache.find(
        (item) =>
          Number(
            item.availableQuantity ??
              item.finalNetQuantity ??
              item.provisionalNetQuantity ??
              item.quantity
          ) > 0
      )?.id
    ]
  );
  setSelectValue(deliveryCustomerSelect, [currentSelections.deliveryCustomerId, customers[0]?.id]);
  setSelectValue(complaintDeliverySelect, [currentSelections.complaintDeliveryId, deliveriesCache[0]?.id]);

  // Transfer intre cilindri / locatii de stoc (toate locatiile active)
  if (transferProductSelect) {
    const cylinders = config.storageLocations.filter((item) => item.active !== false);
    const prevProd = transferProductSelect.value;
    const prevFrom = transferFromSelect.value;
    const prevTo = transferToSelect.value;
    renderSelectOptions(transferProductSelect, config.products, (item) => `${item.name} (${item.code})`, "Selecteaza produs");
    renderSelectOptions(transferFromSelect, cylinders, (item) => item.name, "Din cilindru");
    renderSelectOptions(transferToSelect, cylinders, (item) => item.name, "In cilindru");
    renderSelectOptions(transferUserSelect, operators, (item) => item.name, "Selecteaza operator");
    setSelectValue(transferProductSelect, [prevProd, config.products[0]?.id]);
    setSelectValue(transferFromSelect, [prevFrom, cylinders[0]?.id]);
    setSelectValue(transferToSelect, [prevTo, cylinders[1]?.id || cylinders[0]?.id]);
    setSelectValue(transferUserSelect, [currentSessionUser?.id, operators[0]?.id]);
    updateTransferAvailableHint();
  }

  renderTransactionReferenceOptions();
  syncTransactionDirection();
  renderTransactionPreview();
  renderDeliveryPreview();
}

function renderFilterOptions() {
  const productNames = Array.from(new Set(receiptsCache.map((item) => item.product))).sort((a, b) =>
    a.localeCompare(b, "ro")
  );
  const processingTypes = Array.from(
    new Set(processingsCache.map((item) => item.processingType))
  ).sort((a, b) => a.localeCompare(b, "ro"));
  const processingReceipts = Array.from(new Set(processingsCache.map((item) => item.receiptId))).sort(
    (a, b) => a - b
  );

  receiptProductFilterEl.innerHTML = [
    '<option value="">Toate produsele</option>',
    ...productNames.map((name) => `<option value="${name}">${name}</option>`)
  ].join("");

  processingTypeFilterEl.innerHTML = [
    '<option value="">Toate procesarile</option>',
    ...processingTypes.map((name) => `<option value="${name}">${name}</option>`)
  ].join("");

  processingReceiptFilterEl.innerHTML = [
    '<option value="">Toate receptiile</option>',
    ...processingReceipts.map((id) => `<option value="${id}">#${id}</option>`)
  ].join("");
}

// Column schema for each Nomenclator entity (Excel/1C-style table view)
const ENTITY_COLUMNS = {
  partners: [
    { key: "name", label: "Nume" },
    { key: "status", label: "Stare", format: "supplierStatus" },
    { key: "role", label: "Rol" },
    { key: "fiscalProfile", label: "Statut fiscal" },
    { key: "idno", label: "IDNO" },
    { key: "phone", label: "Telefon" },
    { key: "address", label: "Adresa" },
    { key: "contract", label: "Contract" },
    { key: "bankName", label: "Banca" },
    { key: "iban", label: "IBAN" }
  ],
  vehicles: [
    { key: "number", label: "Nr. mașină" },
    { key: "series", label: "Serie" },
    { key: "driver", label: "Șofer" }
  ],
  labReports: [
    { key: "reportNumber", label: "Nr. raport" },
    { key: "reportDate", label: "Data" },
    { key: "product", label: "Produs" },
    { key: "humidity", label: "Umiditate %" },
    { key: "impuritiesTotal", label: "Impurități %" },
    { key: "harvestYear", label: "An recoltă" },
    { key: "destination", label: "Destinație" }
  ],
  products: [
    { key: "code", label: "Cod" },
    { key: "name", label: "Nume" },
    { key: "unit", label: "Unitate" },
    { key: "humidityNorm", label: "Umiditate %" },
    { key: "impurityNorm", label: "Impuritati %" }
  ],
  storageLocations: [
    { key: "name", label: "Nume" },
    { key: "type", label: "Tip" },
    { key: "capacity", label: "Capacitate", format: "number" },
    { key: "costCategory", label: "Categorie cost" }
  ],
  tariffs: [
    { key: "service", label: "Serviciu" },
    { key: "product", label: "Produs" },
    { key: "partner", label: "Partener" },
    { key: "fiscalProfile", label: "Statut" },
    { key: "calculation", label: "Mod calcul" },
    { key: "value", label: "Valoare" },
    { key: "validFrom", label: "Valabil din" }
  ],
  roles: [
    { key: "name", label: "Nume" },
    { key: "code", label: "Cod" },
    { key: "permissions", label: "Permisii" }
  ],
  users: [
    { key: "name", label: "Nume" },
    { key: "username", label: "Username" },
    { key: "roleName", label: "Rol", fallback: "roleCode" },
    { key: "channel", label: "Canal" }
  ],
  paymentTypes: [
    { key: "name", label: "Tip plata" }
  ],
  fiscalProfiles: [
    { key: "name", label: "Statut" },
    { key: "withholdingPercent", label: "Retinere %" },
    { key: "vat", label: "TVA", format: "bool" }
  ],
  processingTypes: [
    { key: "name", label: "Tip" },
    { key: "resource", label: "Resursa" },
    { key: "consumptionNorm", label: "Norma consum" }
  ]
};

function formatCellValue(value, format) {
  if (format === "supplierStatus") {
    return value === "temporar"
      ? '<span class="status-badge badge-warn">Temporar</span>'
      : '<span class="status-badge badge-ok">Validat</span>';
  }
  if (value === null || value === undefined || value === "") return "—";
  if (format === "bool") return value ? "Da" : "Nu";
  if (format === "number" && typeof formatNumber === "function") return formatNumber(value);
  return String(value);
}

function getCellValue(item, col) {
  let val = item[col.key];
  if ((val === undefined || val === null || val === "") && col.fallback) {
    val = item[col.fallback];
  }
  return formatCellValue(val, col.format);
}

function renderMiniList(entity, items) {
  const target = document.getElementById(`${entity}-list`);
  if (!target) {
    return;
  }

  if (!items.length) {
    target.innerHTML = `<p class="empty-state">Nu exista elemente inca.</p>`;
    return;
  }

  const cols = ENTITY_COLUMNS[entity];
  // Fallback to legacy card view if entity is unknown
  if (!cols) {
    target.innerHTML = items
      .map((item) => {
        const detail = getItemDetails(entity, item);
        const canToggle = Object.prototype.hasOwnProperty.call(item, "active");
        return `
          <article class="list-item">
            <div>
              <strong>${getItemTitle(entity, item)}</strong>
              <p>${detail}</p>
            </div>
            <div class="list-actions">
              <button class="ghost-button" type="button" data-action="edit" data-entity="${entity}" data-id="${item.id}">
                Editeaza
              </button>
              ${
                canToggle
                  ? `<button class="ghost-button" type="button" data-action="toggle" data-entity="${entity}" data-id="${item.id}">
                      ${item.active ? "Dezactiveaza" : "Activeaza"}
                    </button>`
                  : ""
              }
            </div>
          </article>
        `;
      })
      .join("");
    return;
  }

  const headerCells = cols
    .map((col) => `<th>${col.label}</th>`)
    .join("");
  // Status + actions are always last
  const hasStatus = items.some((it) => Object.prototype.hasOwnProperty.call(it, "active"));
  const statusHeader = hasStatus ? "<th>Status</th>" : "";

  // Admin poate modifica orice nomenclator; contabilul poate edita/valida partenerii.
  const canModify =
    canAccess("nomenclator-update") || (entity === "partners" && canAccess("nomenclator-create"));
  const rows = items
    .map((item) => {
      const cells = cols.map((col) => `<td>${getCellValue(item, col)}</td>`).join("");
      const canToggle = Object.prototype.hasOwnProperty.call(item, "active");
      const statusCell = hasStatus
        ? `<td class="cell-status ${item.active === false ? "is-off" : "is-on"}">${
            canToggle ? (item.active ? "Activ" : "Inactiv") : "—"
          }</td>`
        : "";
      const editBtn = canModify
        ? `<button class="cell-btn cell-btn-primary" type="button" data-action="edit" data-entity="${entity}" data-id="${item.id}">Editează</button>`
        : "";
      const toggleBtn = canModify && canToggle
        ? `<button class="cell-btn" type="button" data-action="toggle" data-entity="${entity}" data-id="${item.id}" title="${item.active ? "Dezactiveaza" : "Activeaza"}">${item.active ? "Off" : "On"}</button>`
        : "";
      const actionsCell = canModify
        ? `<td class="cell-actions">${editBtn}${toggleBtn}</td>`
        : `<td class="cell-actions"><span class="cell-locked" title="Doar admin poate modifica">—</span></td>`;
      return `
        <tr>
          ${cells}
          ${statusCell}
          ${actionsCell}
        </tr>
      `;
    })
    .join("");

  target.innerHTML = `
    <table class="nom-table">
      <thead>
        <tr>
          ${headerCells}
          ${statusHeader}
          <th class="cell-actions">Acțiuni</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function getItemTitle(entity, item) {
  switch (entity) {
    case "tariffs":
      return `${item.service} - ${item.value}`;
    default:
      return item.name || item.code || `#${item.id}`;
  }
}

function getItemDetails(entity, item) {
  switch (entity) {
    case "partners":
      return `${item.role} | ${item.fiscalProfile} | ${item.phone || "fara telefon"}`;
    case "products":
      return `${item.unit} | umiditate ${item.humidityNorm}% | impuritati ${item.impurityNorm}%`;
    case "storageLocations":
      return `${item.type} | cap. ${formatNumber(item.capacity)} | cost ${item.costCategory}`;
    case "tariffs":
      return `${item.product} | ${item.calculation} | valabil din ${item.validFrom} | ${item.active ? "activ" : "inactiv"}`;
    case "roles":
      return `${item.code} | ${item.permissions}${item.system ? " | sistem" : ""}`;
    case "users":
      return `${item.username || "-"} | ${item.roleName || item.roleCode} | ${item.channel} | ${item.active === false ? "inactiv" : "activ"}`;
    case "paymentTypes":
      return item.active ? "activ" : "inactiv";
    case "fiscalProfiles":
      return `retinere ${item.withholdingPercent}% | TVA ${item.vat ? "da" : "nu"}`;
    case "processingTypes":
      return `${item.resource} | norma ${item.consumptionNorm}`;
    default:
      return "";
  }
}

function renderSetupLists(config) {
  [
    "partners",
    "products",
    "storageLocations",
    "tariffs",
    "roles",
    "users",
    "paymentTypes",
    "fiscalProfiles",
    "processingTypes",
    "vehicles",
    "labReports"
  ].forEach((entity) => renderMiniList(entity, config[entity] || []));
}

function renderSetupSelectors(config) {
  fiscalProfileOptions.innerHTML = config.fiscalProfiles
    .map((item) => `<option value="${item.name}">${item.name}</option>`)
    .join("");

  roleOptions.innerHTML = config.roles
    .map((item) => `<option value="${item.code}">${item.name}</option>`)
    .join("");

  systemSettingsForm.elements.closeOfDayHour.value = config.systemSettings.closeOfDayHour;
  systemSettingsForm.elements.reportChannel.value = config.systemSettings.reportChannel;
  systemSettingsForm.elements.reportAudience.value = config.systemSettings.reportAudience;
  systemSettingsForm.elements.defaultCurrency.value = config.systemSettings.defaultCurrency;

  // Populate vehicles datalist for the delivery form (Etapa 5)
  const vehiclesDatalist = document.getElementById("vehicles-datalist");
  if (vehiclesDatalist) {
    vehiclesDatalist.innerHTML = (config.vehicles || [])
      .filter((v) => v.active !== false)
      .map((v) => {
        const extra = [v.series, v.driver].filter(Boolean).join(" · ");
        return `<option value="${v.number}">${v.number}${extra ? " — " + extra : ""}</option>`;
      })
      .join("");
  }

  // Populate supplier select for Act de verificare (Etapa 7)
  const statementPartnerSelect = document.getElementById("statement-partner-select");
  if (statementPartnerSelect) {
    const suppliers = (config.partners || []).filter(
      (p) => p.role === "furnizor" || p.role === "ambele"
    );
    const prev = statementPartnerSelect.value;
    statementPartnerSelect.innerHTML =
      '<option value="">Selecteaza furnizor</option>' +
      suppliers.map((p) => `<option value="${p.id}">${p.name}</option>`).join("");
    if (prev) statementPartnerSelect.value = prev;
  }
}

function getEditorSchema(entity) {
  const commonActiveField = {
    name: "active",
    label: "Status",
    type: "select",
    options: [
      { value: "true", label: "Activ" },
      { value: "false", label: "Inactiv" }
    ]
  };

  const schemas = {
    partners: {
      title: "Editare partener",
      copy: "Completeaza datele oficiale (IDNP, contract, adresa) si valideaza furnizorul temporar.",
      fields: [
        { name: "name", label: "Denumire", type: "text" },
        { name: "idno", label: "IDNO / IDNP", type: "text" },
        { name: "phone", label: "Telefon", type: "text" },
        { name: "address", label: "Adresa", type: "text" },
        { name: "contract", label: "Contract", type: "text" },
        { name: "bankName", label: "Banca", type: "text" },
        { name: "iban", label: "IBAN / cont", type: "text" },
        {
          name: "role",
          label: "Rol",
          type: "select",
          options: [
            { value: "furnizor", label: "Furnizor" },
            { value: "cumparator", label: "Cumparator" },
            { value: "ambele", label: "Ambele" }
          ]
        },
        {
          name: "fiscalProfile",
          label: "Statut fiscal",
          type: "select",
          options: () => currentConfig.fiscalProfiles.map((item) => ({ value: item.name, label: item.name }))
        },
        {
          name: "status",
          label: "Stare furnizor",
          type: "select",
          options: [
            { value: "validat", label: "Validat" },
            { value: "temporar", label: "Temporar (de completat)" }
          ]
        }
      ]
    },
    vehicles: {
      title: "Editare mașină",
      copy: "Actualizează numărul, seria și șoferul.",
      fields: [
        { name: "number", label: "Nr. mașină", type: "text" },
        { name: "series", label: "Serie", type: "text" },
        { name: "driver", label: "Șofer", type: "text" },
        commonActiveField
      ]
    },
    labReports: {
      title: "Editare raport laborator",
      copy: "Date din raportul de laborator pentru certificatul de calitate.",
      fields: [
        { name: "reportNumber", label: "Nr. raport", type: "text" },
        { name: "reportDate", label: "Data raportului", type: "date" },
        { name: "issuedBy", label: "Eliberat de", type: "text" },
        { name: "contactPhone", label: "Telefon contact", type: "text" },
        { name: "product", label: "Produs", type: "text" },
        { name: "originCountry", label: "Țara de origine", type: "text" },
        { name: "harvestYear", label: "An recoltă", type: "text" },
        { name: "humidity", label: "Umiditate %", type: "number", step: "0.01" },
        { name: "aflatoxinB1", label: "Aflatoxina B1", type: "text" },
        { name: "impuritiesTotal", label: "Impurități totale %", type: "number", step: "0.01" },
        { name: "impuritiesDiverse", label: "Impurități diverse %", type: "number", step: "0.01" },
        { name: "brokenGrains", label: "Boabe sparte %", type: "number", step: "0.01" },
        { name: "sproutedGrains", label: "Boabe încolțite %", type: "number", step: "0.01" },
        { name: "defectiveGrains", label: "Boabe defecte %", type: "number", step: "0.01" },
        { name: "destination", label: "Destinație", type: "text" },
        commonActiveField
      ]
    },
    products: {
      title: "Editare produs",
      copy: "Modifica parametrii de baza pentru produs.",
      fields: [
        { name: "name", label: "Denumire", type: "text" },
        { name: "code", label: "Cod", type: "text" },
        { name: "unit", label: "Unitate", type: "text" },
        { name: "humidityNorm", label: "Norma umiditate", type: "number", step: "0.01" },
        { name: "impurityNorm", label: "Norma impuritati", type: "number", step: "0.01" },
        commonActiveField
      ]
    },
    storageLocations: {
      title: "Editare locatie de stoc",
      copy: "Actualizeaza tipul, capacitatea si categoria de cost.",
      fields: [
        { name: "name", label: "Denumire", type: "text" },
        {
          name: "type",
          label: "Tip locatie",
          type: "select",
          options: [
            { value: "groapa", label: "Groapa" },
            { value: "tampon", label: "Tampon" },
            { value: "cilindru", label: "Cilindru" },
            { value: "depozit", label: "Depozit" }
          ]
        },
        { name: "capacity", label: "Capacitate", type: "number", step: "0.01" },
        {
          name: "costCategory",
          label: "Categorie cost",
          type: "select",
          options: [
            { value: "neprocesat", label: "Neprocesat" },
            { value: "procesat", label: "Procesat" }
          ]
        },
        commonActiveField
      ]
    },
    tariffs: {
      title: "Editare tarif",
      copy: "Actualizeaza valoarea si regula comerciala pentru tarif.",
      fields: [
        { name: "service", label: "Serviciu", type: "text" },
        { name: "product", label: "Produs", type: "text" },
        { name: "partner", label: "Partener", type: "text" },
        { name: "fiscalProfile", label: "Statut fiscal", type: "text" },
        { name: "calculation", label: "Mod calcul", type: "text" },
        { name: "value", label: "Valoare", type: "number", step: "0.01" },
        { name: "validFrom", label: "Valabil din", type: "date" },
        commonActiveField
      ]
    },
    roles: {
      title: "Editare rol",
      copy: "Actualizeaza denumirea rolului si lista de permisiuni.",
      fields: [
        { name: "name", label: "Nume rol", type: "text" },
        { name: "code", label: "Cod rol", type: "text" },
        { name: "permissions", label: "Permisiuni", type: "text" }
      ]
    },
    users: {
      title: "Editare utilizator",
      copy: "Actualizeaza username-ul, rolul si parola utilizatorului.",
      fields: [
        { name: "name", label: "Nume", type: "text" },
        { name: "username", label: "Username", type: "text" },
        {
          name: "roleCode",
          label: "Rol",
          type: "select",
          options: () => currentConfig.roles.map((item) => ({ value: item.code, label: item.name }))
        },
        {
          name: "channel",
          label: "Canal",
          type: "select",
          options: [
            { value: "web", label: "web" },
            { value: "web+telegram", label: "web+telegram" },
            { value: "telegram", label: "telegram" }
          ]
        },
        commonActiveField,
        { name: "password", label: "Parola noua", type: "password" }
      ]
    },
    paymentTypes: {
      title: "Editare tip plata",
      copy: "Actualizeaza denumirea si disponibilitatea tipului de plata.",
      fields: [{ name: "name", label: "Denumire", type: "text" }, commonActiveField]
    },
    fiscalProfiles: {
      title: "Editare statut fiscal",
      copy: "Actualizeaza retinerea si regimul TVA.",
      fields: [
        { name: "name", label: "Denumire", type: "text" },
        { name: "withholdingPercent", label: "Retinere %", type: "number", step: "0.01" },
        {
          name: "vat",
          label: "TVA",
          type: "select",
          options: [
            { value: "true", label: "Cu TVA" },
            { value: "false", label: "Fara TVA" }
          ]
        },
        commonActiveField
      ]
    },
    processingTypes: {
      title: "Editare tip procesare",
      copy: "Actualizeaza norma de consum si resursa folosita.",
      fields: [
        { name: "name", label: "Denumire", type: "text" },
        { name: "consumptionNorm", label: "Norma consum", type: "number", step: "0.01" },
        { name: "resource", label: "Resursa", type: "text" },
        commonActiveField
      ]
    }
  };

  return schemas[entity] || null;
}

function fieldOptions(field) {
  if (typeof field.options === "function") {
    return field.options();
  }

  return field.options || [];
}

function renderEditorField(field, item) {
  const value = item[field.name];
  const safeValue =
    field.type === "password"
      ? ""
      : value === undefined || value === null
        ? ""
        : String(value);

  if (field.type === "select") {
    const options = fieldOptions(field)
      .map((option) => {
        const selected = String(option.value) === safeValue ? "selected" : "";
        return `<option value="${option.value}" ${selected}>${option.label}</option>`;
      })
      .join("");

    return `
      <label>
        ${field.label}
        <select name="${field.name}">
          ${options}
        </select>
      </label>
    `;
  }

  return `
    <label>
      ${field.label}
      <input
        name="${field.name}"
        type="${field.type || "text"}"
        value="${safeValue.replace(/"/g, "&quot;")}"
        ${field.step ? `step="${field.step}"` : ""}
      />
    </label>
  `;
}

function resetEditor() {
  currentEditor = null;
  editorTitleEl.textContent = "Editor configurare";
  editorCopyEl.textContent =
    "Selecteaza un element din listele de mai sus pentru editare controlata in pagina.";
  editorFieldsEl.innerHTML = "";
  editorEmptyEl.hidden = false;
  editorSaveButton.disabled = true;
  editorCancelButton.disabled = true;
  editorMessageEl.textContent = "";
}

function openEditor(entity, item) {
  const schema = getEditorSchema(entity);
  if (!schema) {
    return;
  }

  currentEditor = {
    entity,
    id: item.id
  };

  editorTitleEl.textContent = schema.title;
  editorCopyEl.textContent = schema.copy;
  editorFieldsEl.innerHTML = schema.fields.map((field) => renderEditorField(field, item)).join("");
  editorEmptyEl.hidden = true;
  editorSaveButton.disabled = false;
  editorCancelButton.disabled = false;
  editorMessageEl.textContent = "";
}

function syncUnitByProduct() {
  const selectedProduct = currentConfig.products.find(
    (item) => String(item.id) === String(productSelect.value)
  );

  unitInput.value = selectedProduct ? selectedProduct.unit : "";
  if (selectedProduct) {
    if (!String(humidityInput.value || "").trim()) {
      humidityInput.value = String(selectedProduct.humidityNorm ?? 0);
    }

    if (!String(impurityInput.value || "").trim()) {
      impurityInput.value = String(selectedProduct.impurityNorm ?? 0);
    }
  }
  renderReceiptEstimate();
}

function getActiveTariff(serviceName) {
  return (
    currentConfig.tariffs.find(
      (item) => item.active && item.service.toLowerCase() === serviceName.toLowerCase()
    ) || null
  );
}

function getReceiptEstimate() {
  const selectedProduct = currentConfig.products.find(
    (item) => String(item.id) === String(productSelect.value)
  );
  const selectedPartner = currentConfig.partners.find(
    (item) => String(item.id) === String(supplierSelect.value)
  );
  const fiscalProfile = currentConfig.fiscalProfiles.find(
    (item) => item.name === selectedPartner?.fiscalProfile
  );
  // Cantitatea se introduce in kg; calculul intern (net, servicii, stoc) e in tone.
  const quantity = Number(formEl.elements.quantity.value || 0) / 1000;
  const price = Number(formEl.elements.price.value || 0);
  const humidity = Number(humidityInput.value || 0);
  const impurity = Number(impurityInput.value || 0);
  const humidityNorm = Number(selectedProduct?.humidityNorm || 0);
  const impurityNorm = Number(selectedProduct?.impurityNorm || 0);
  const excessHumidity = Math.max(humidity - humidityNorm, 0);
  const excessImpurity = Math.max(impurity - impurityNorm, 0);
  const estimatedWaterLoss = quantity * (excessHumidity / 100);
  const estimatedImpurityLoss = quantity * (excessImpurity / 100);
  const provisionalNetQuantity = Math.max(
    quantity - estimatedWaterLoss - estimatedImpurityLoss,
    0
  );
  const cleaningTariff = Number(getActiveTariff("Curatire")?.value || 0);
  const dryingTariff = Number(getActiveTariff("Uscare")?.value || 0);
  // Services are charged ONLY for the % above norma.
  //   uscare   = tarif_uscare   × (umiditate − norma_umiditate)   × kg
  //   curatare = tarif_curatare × (impuritati − norma_impuritati) × kg
  // If umiditate ≤ norma AND impuritati ≤ norma → 0 (no services).
  const cleaningServiceTotal = quantity * excessImpurity * cleaningTariff;
  const dryingServiceTotal = quantity * excessHumidity * dryingTariff;
  const preliminaryServicesTotal = cleaningServiceTotal + dryingServiceTotal;
  const preliminaryMerchandiseValue = provisionalNetQuantity * price;
  const withholdingPercent = Number(fiscalProfile?.withholdingPercent || 0);
  const withholdingAmount =
    Math.max(preliminaryMerchandiseValue - preliminaryServicesTotal, 0) *
    (withholdingPercent / 100);
  const preliminaryPayableAmount = Math.max(
    preliminaryMerchandiseValue - preliminaryServicesTotal - withholdingAmount,
    0
  );

  return {
    humidityNorm,
    impurityNorm,
    provisionalNetQuantity,
    preliminaryServicesTotal,
    preliminaryPayableAmount
  };
}

function toggleNewSupplierInput() {
  const isNew = supplierSelect.value === "__new__";
  if (newSupplierWrap) {
    newSupplierWrap.hidden = !isNew;
  }
  if (newSupplierNameInput) {
    newSupplierNameInput.required = isNew;
    if (!isNew) {
      newSupplierNameInput.value = "";
    } else {
      newSupplierNameInput.focus();
    }
  }
}

function renderReceiptEstimate() {
  if (!currentConfig) {
    return;
  }

  const estimate = getReceiptEstimate();
  estimateHumidityNormEl.textContent = `${formatNumber(estimate.humidityNorm)}%`;
  estimateImpurityNormEl.textContent = `${formatNumber(estimate.impurityNorm)}%`;
  // Net provizoriu afisat in kg (calculul e in tone)
  estimateNetEl.textContent = `${formatNumber((estimate.provisionalNetQuantity || 0) * 1000)} kg`;
  estimateServicesEl.textContent = currency.format(estimate.preliminaryServicesTotal || 0);
  estimatePayableEl.textContent = currency.format(estimate.preliminaryPayableAmount || 0);

  // Hint sub cantitate: echivalentul in tone
  if (quantityTonsHintEl) {
    const kg = Number(formEl.elements.quantity.value || 0);
    quantityTonsHintEl.textContent = kg > 0 ? `= ${formatNumber(kg / 1000)} tone` : " ";
  }
}

async function loadReceipts() {
  if (!canAccess("receipts-read")) {
    receiptsCache = [];
    renderReceipts([]);
    return;
  }
  const response = await fetch("/api/receipts");
  const data = await response.json();
  receiptsCache = data.receipts;
  renderStats(data.stats);
  renderProcessingStats(data.stats);
  renderFinanceStats(data.stats);
  renderDeliveryStats(data.stats);
  renderAuditStats(data.stats);
  renderReceipts(data.receipts);
  renderUnprocessedStock();
  renderOpenJournal();
  if (currentConfig) {
    renderReceiptSelectors(currentConfig);
    renderProcessingEstimate();
  }
  renderFilterOptions();
}

async function loadProcessings() {
  if (!canAccess("processings-read")) {
    processingsCache = [];
    renderProcessings([]);
    return;
  }
  const response = await fetch("/api/processings");
  const data = await response.json();
  processingsCache = data.processings;
  renderProcessings(data.processings);
  renderFilterOptions();
  checkEndOfDayProcessing();
}

async function loadStocks() {
  if (!canAccess("stocks-read")) {
    renderStockSummary({ byLocation: [], totals: { totalQuantity: 0, totalLocations: 0, totalProducts: 0 } });
    return;
  }
  const response = await fetch("/api/stocks");
  const data = await response.json();
  renderStockSummary(data);
  updateTransferAvailableHint();
}

async function loadTransfers() {
  if (!transfersBodyEl || !canAccess("processings-read")) {
    transfersCache = [];
    renderTransfers([]);
    return;
  }
  const response = await fetch("/api/transfers");
  const data = await response.json();
  transfersCache = data.transfers || [];
  renderTransfers(transfersCache);
}

function renderTransfers(transfers) {
  if (!transfersBodyEl) return;
  transfersBodyEl.innerHTML = transfers
    .map(
      (item) => `
        <tr>
          <td>#${item.id}</td>
          <td>${formatDateShort(item.createdAt)}</td>
          <td>${item.product}</td>
          <td>${item.fromLocation}</td>
          <td>${item.toLocation}</td>
          <td>${formatNumber(item.quantity)} ${item.unit || ""}</td>
          <td>${item.operator || "-"}</td>
        </tr>
      `
    )
    .join("");
}

// Arata cat stoc e in cilindrul sursa pentru produsul ales (din ultimul stoc incarcat).
function updateTransferAvailableHint() {
  if (!transferAvailableHintEl || !transferProductSelect || !currentConfig) return;
  const product = currentConfig.products.find(
    (item) => String(item.id) === String(transferProductSelect.value)
  );
  const fromLoc = currentConfig.storageLocations.find(
    (item) => String(item.id) === String(transferFromSelect.value)
  );
  if (!product || !fromLoc || !lastStockSummary) {
    transferAvailableHintEl.textContent = " ";
    return;
  }
  const row = (lastStockSummary.byLocation || []).find(
    (item) => item.location === fromLoc.name && item.product === product.name
  );
  const available = Number(row?.quantity || 0);
  transferAvailableHintEl.textContent = `Disponibil în ${fromLoc.name}: ${formatNumber(available)} ${product.unit || "tone"}`;
}

async function loadTransactions() {
  if (!canAccess("finance")) {
    transactionsCache = [];
    renderTransactions([]);
    return;
  }
  const response = await fetch("/api/transactions");
  const data = await response.json();
  transactionsCache = data.transactions;
  renderTransactions(data.transactions);
  renderTransactionPreview();
}

async function loadDeliveries() {
  if (!canAccess("deliveries-read")) {
    deliveriesCache = [];
    renderDeliveries([]);
    return;
  }
  const response = await fetch("/api/deliveries");
  const data = await response.json();
  deliveriesCache = data.deliveries;
  renderDeliveries(data.deliveries);
  renderOpenJournal();
  if (currentConfig) {
    renderReceiptSelectors(currentConfig);
  }
}

async function loadComplaints() {
  if (!canAccess("complaints-read")) {
    complaintsCache = [];
    renderComplaints([]);
    return;
  }
  const response = await fetch("/api/complaints");
  const data = await response.json();
  complaintsCache = data.complaints;
  renderComplaints(data.complaints);
  if (currentConfig) {
    renderReceiptSelectors(currentConfig);
  }
}

async function loadAuditLogs() {
  if (!canAccess("audit")) {
    auditLogsCache = [];
    renderAuditLogs([]);
    renderDashFeed();
    return;
  }
  const response = await fetch("/api/audit-logs");
  const data = await response.json();
  auditLogsCache = data.auditLogs;
  renderAuditLogs(data.auditLogs);
  renderDashFeed();
}

async function loadLockouts() {
  if (!canAccess("security-admin")) {
    lockoutsCache = [];
    renderLockouts([]);
    return;
  }

  const response = await fetch("/api/security/lockouts");
  const data = await response.json();
  lockoutsCache = data.lockouts || [];
  renderLockouts(lockoutsCache);
}

async function loadAutomationStatus() {
  if (!canAccess("setup") || !automationStatusSummaryEl) {
    automationStatusCache = null;
    renderAutomationStatus(null);
    return;
  }

  const response = await fetch("/api/automation/close-of-day/status");
  const data = await response.json();
  automationStatusCache = data;
  renderAutomationStatus(data);
}

async function loadCriticalAlertsStatus() {
  if (!canAccess("setup") || !criticalAlertsSummaryEl) {
    criticalAlertsStatusCache = null;
    renderCriticalAlertsStatus(null);
    return;
  }

  const response = await fetch("/api/automation/critical-alerts/status");
  const data = await response.json();
  criticalAlertsStatusCache = data;
  renderCriticalAlertsStatus(data);
}

async function loadOpeningDocuments() {
  if (!canAccess("opening")) {
    openingDocumentsCache = [];
    renderOpenJournal();
    return;
  }
  const response = await fetch("/api/opening-documents");
  const data = await response.json();
  openingDocumentsCache = data.openingDocuments;
  renderOpenJournal();
}

async function loadDailyReport() {
  if (!canAccess("reports")) {
    renderDailyReport({
      summary: {
        receiptsCount: 0,
        grossQuantity: 0,
        provisionalNetQuantity: 0,
        processedQuantity: 0,
        deliveredQuantity: 0,
        confirmedWaste: 0,
        paymentsTotal: 0,
        collectionsTotal: 0,
        openComplaints: 0,
        stockTotal: 0
      },
      receipts: [],
      processings: [],
      transactions: [],
      deliveries: [],
      complaints: []
    });
    return;
  }
  const dateValue = dailyReportDateEl.value || new Date().toISOString().slice(0, 10);
  const response = await fetch(`/api/reports/daily?date=${encodeURIComponent(dateValue)}`);
  const data = await response.json();
  renderDailyReport(data);
}

async function loadConfig() {
  if (!canAccess("config-read")) {
    return;
  }
  const response = await fetch("/api/config");
  const data = await response.json();
  const pendingEditor = currentEditor ? { ...currentEditor } : null;
  currentConfig = data;
  renderConfigSummary(data.summary);
  renderReceiptSelectors(data);
  renderSetupLists(data);
  renderSetupSelectors(data);
  renderSilosGrid(null);
  renderReceiptEstimate();
  applyRoleAccess();

  if (pendingEditor) {
    const refreshedItem = getEntityItem(pendingEditor.entity, pendingEditor.id);
    if (refreshedItem) {
      openEditor(pendingEditor.entity, refreshedItem);
    } else {
      resetEditor();
    }
  }
}

async function loadDashboard() {
  dailyReportDateEl.value = new Date().toISOString().slice(0, 10);
  openingDocumentDateEl.value = new Date().toISOString().slice(0, 10);
  // Config first — silos panel and many other widgets depend on storageLocations + products.
  await loadConfig();
  await Promise.all([
    loadOpeningDocuments(),
    loadReceipts(),
    loadProcessings(),
    loadStocks(),
    loadTransfers(),
    loadTransactions(),
    loadDeliveries(),
    loadComplaints(),
    loadAuditLogs(),
    loadLockouts(),
    loadAutomationStatus(),
    loadCriticalAlertsStatus(),
    loadDailyReport()
  ]);
}

async function createReceipt(formData) {
  let supplierId = formData.get("supplierId");

  // Furnizor nou (persoana fizica) introdus pe loc: il cream intai ca furnizor temporar
  if (supplierId === "__new__") {
    const newName = String(formData.get("newSupplierName") || "").trim();
    const quickResponse = await fetch("/api/partners/quick-supplier", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName })
    });
    if (!quickResponse.ok) {
      const err = await quickResponse.json().catch(() => ({}));
      throw new Error(err.error || "Nu am putut adauga furnizorul nou.");
    }
    const newPartner = await quickResponse.json();
    supplierId = String(newPartner.id);
    await loadConfig();
  }

  const product = currentConfig.products.find((item) => String(item.id) === formData.get("productId"));
  const partner = currentConfig.partners.find((item) => String(item.id) === String(supplierId));
  const location = currentConfig.storageLocations.find(
    (item) => String(item.id) === formData.get("locationId")
  );
  const receiver = currentConfig.users.find((item) => String(item.id) === formData.get("receivedBy"));
  const selectedProduct = currentConfig.products.find(
    (item) => String(item.id) === String(formData.get("productId"))
  );

  const payload = {
    supplierId: supplierId,
    supplier: partner?.name || "",
    productId: formData.get("productId"),
    product: product?.name || "",
    quantity: String(Number(formData.get("quantity") || 0) / 1000),
    enteredUnit: "kg",
    unit: product?.unit || formData.get("unit"),
    price: formData.get("price") || "0",
    humidity: formData.get("humidity") || String(selectedProduct?.humidityNorm ?? 0),
    impurity: formData.get("impurity") || String(selectedProduct?.impurityNorm ?? 0),
    vehicle: formData.get("vehicle"),
    note: formData.get("note"),
    locationId: formData.get("locationId"),
    location: location?.name || "",
    receivedBy: receiver?.name || currentSessionUser?.name || "",
    source: "dashboard"
  };

  const response = await fetch("/api/receipts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Eroare la salvare.");
  }
}

function validateReceiptForm(formData) {
  // Defensive: bail out early if config is still loading
  if (!currentConfig || !Array.isArray(currentConfig.partners) || !currentConfig.partners.length) {
    return "Configurarea încă se încarcă. Mai încearcă în câteva secunde.";
  }

  const supplierId = formData.get("supplierId");
  if (!supplierId) {
    return "Selecteaza furnizorul.";
  }

  // Furnizor nou (persoana fizica) introdus pe loc de operator
  if (supplierId === "__new__") {
    if (!String(formData.get("newSupplierName") || "").trim()) {
      return "Scrie numele furnizorului nou.";
    }
  } else {
    // Verify the selected supplier actually exists in our cached config
    const supplierExists = currentConfig.partners.some(
      (item) => String(item.id) === String(supplierId)
    );
    if (!supplierExists) {
      return "Furnizorul nu a fost găsit. Reîncarcă pagina și încearcă din nou.";
    }
  }

  if (!formData.get("productId")) {
    return "Selecteaza produsul.";
  }

  if (Number(formData.get("quantity") || 0) <= 0) {
    return "Cantitatea trebuie sa fie mai mare ca zero.";
  }

  if (Number(formData.get("price") || 0) < 0) {
    return "Pretul nu poate fi negativ.";
  }

  if (Number(formData.get("humidity") || 0) < 0 || Number(formData.get("impurity") || 0) < 0) {
    return "Umiditatea si impuritatile trebuie sa fie valori pozitive.";
  }

  return "";
}

function validateTransactionForm(formData) {
  if (!formData.get("referenceId")) {
    return "Selecteaza referinta pentru plata sau incasare.";
  }

  if (Number(formData.get("amount") || 0) <= 0) {
    return "Suma trebuie sa fie mai mare ca zero.";
  }

  return "";
}

function validateDeliveryForm(formData) {
  if (!formData.get("receiptId")) {
    return "Selecteaza receptia sursa.";
  }

  if (!formData.get("customerId")) {
    return "Selecteaza cumparatorul.";
  }

  if (Number(formData.get("deliveredQuantity") || 0) <= 0) {
    return "Cantitatea livrata trebuie sa fie mai mare ca zero.";
  }

  return "";
}

function getFormSubmitMode(form) {
  const mode = form.dataset.submitMode === "save-new" ? "save-new" : "save";
  form.dataset.submitMode = "save";
  return mode;
}

function resetReceiptForm(mode = "save") {
  const preserveContext = mode !== "save-new";
  const preservedValues = {
    supplierId: preserveContext ? supplierSelect.value : "",
    productId: preserveContext ? productSelect.value : "",
    locationId: preserveContext ? locationSelect.value : "",
    receivedBy: preserveContext ? userSelect.value : "",
    price: preserveContext ? formEl.elements.price.value : "",
    humidity: preserveContext ? humidityInput.value : "",
    impurity: preserveContext ? impurityInput.value : ""
  };

  formEl.reset();
  if (currentConfig) {
    renderReceiptSelectors(currentConfig);
  }

  if (preserveContext) {
    setSelectValue(supplierSelect, [preservedValues.supplierId]);
    setSelectValue(productSelect, [preservedValues.productId]);
    setSelectValue(locationSelect, [preservedValues.locationId]);
    setSelectValue(userSelect, [preservedValues.receivedBy, currentSessionUser?.id]);
  }

  formEl.elements.price.value = preservedValues.price || "";
  humidityInput.value = preservedValues.humidity || "";
  impurityInput.value = preservedValues.impurity || "";
  formEl.elements.quantity.value = "";
  formEl.elements.vehicle.value = "";
  formEl.elements.note.value = "";
  syncUnitByProduct();
  formEl.elements.quantity.focus();
}

function resetTransactionForm(mode = "save") {
  const preserveContext = mode !== "save-new";
  const preservedValues = {
    referenceType: preserveContext ? transactionReferenceTypeSelect.value : "",
    referenceId: preserveContext ? transactionReferenceSelect.value : "",
    paymentType: preserveContext ? transactionPaymentTypeSelect.value : ""
  };

  transactionFormEl.reset();
  if (preserveContext && preservedValues.referenceType) {
    transactionReferenceTypeSelect.value = preservedValues.referenceType;
  }

  renderTransactionReferenceOptions();
  syncTransactionDirection();

  if (preserveContext) {
    setSelectValue(transactionReferenceSelect, [preservedValues.referenceId]);
    setSelectValue(transactionPaymentTypeSelect, [preservedValues.paymentType]);
  }

  transactionFormEl.elements.amount.value = "";
  transactionFormEl.elements.note.value = "";
  renderTransactionPreview();
  transactionFormEl.elements.amount.focus();
}

function resetDeliveryForm(mode = "save") {
  const preserveContext = mode !== "save-new";
  const fieldValue = (name) => {
    const el = deliveryFormEl.elements[name];
    return el ? el.value : "";
  };
  const setField = (name, value) => {
    const el = deliveryFormEl.elements[name];
    if (el) el.value = value;
  };
  const preservedValues = {
    receiptId: preserveContext ? deliveryReceiptSelect.value : "",
    customerId: preserveContext ? deliveryCustomerSelect.value : "",
    contractNumber: preserveContext ? fieldValue("contractNumber") : "",
    contractDate: preserveContext ? fieldValue("contractDate") : ""
  };

  deliveryFormEl.reset();
  if (currentConfig) {
    renderReceiptSelectors(currentConfig);
  }

  if (preserveContext) {
    setSelectValue(deliveryReceiptSelect, [preservedValues.receiptId]);
    setSelectValue(deliveryCustomerSelect, [preservedValues.customerId]);
    setField("contractNumber", preservedValues.contractNumber || "");
    setField("contractDate", preservedValues.contractDate || "");
  }

  setField("deliveredQuantity", "");
  setField("vehicle", "");
  setField("invoiceNumber", "");
  setField("note", "");
  renderDeliveryPreview();
  const qtyEl = deliveryFormEl.elements.deliveredQuantity;
  if (qtyEl) qtyEl.focus();
}

async function createOpeningDocument(formData) {
  const payload = {
    documentDate: formData.get("documentDate"),
    note: formData.get("note"),
    stockItems: openingStockDraft,
    debtItems: openingDebtDraft,
    createdBy: "dashboard"
  };

  const response = await fetch("/api/opening-documents", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Nu am putut salva soldul initial.");
  }
}

function getSelectedReceiptForProcessing() {
  return receiptsCache.find(
    (item) => String(item.id) === String(processingReceiptSelect.value)
  );
}

function renderProcessingEstimate() {
  const receipt = getSelectedReceiptForProcessing();
  const processedQuantity = Number(processedQuantityInput.value || 0);
  const confirmedWaste = Number(confirmedWasteInput.value || 0);
  const finalNet = Math.max(processedQuantity - confirmedWaste, 0);

  processingSourceEl.textContent = receipt?.location || "-";
  processingProvisionalNetEl.textContent = formatNumber(receipt?.provisionalNetQuantity || 0);
  processingFinalNetEl.textContent = formatNumber(finalNet);
}

// Completeaza lotul automat din produs + data primirii (editabil de operator).
let lastAutoProcessingLot = "";
function autofillProcessingLot() {
  if (!processingLotInput) return;
  const receipt = getSelectedReceiptForProcessing();
  if (!receipt) return;
  const auto = `${receipt.product || ""} ${formatDateShort(receipt.createdAt || receipt.receivedAt)}`.trim();
  if (!processingLotInput.value || processingLotInput.value === lastAutoProcessingLot) {
    processingLotInput.value = auto;
  }
  lastAutoProcessingLot = auto;
}

async function createProcessing(formData) {
  const receipt = getSelectedReceiptForProcessing();
  const operator = currentConfig.users.find(
    (item) => String(item.id) === String(formData.get("operator"))
  );

  const payload = {
    receiptId: formData.get("receiptId"),
    product: receipt?.product || "",
    lot: formData.get("lot") || "",
    processingType: formData.get("processingType"),
    processedQuantity: formData.get("processedQuantity"),
    confirmedWaste: formData.get("confirmedWaste"),
    finalHumidity: formData.get("finalHumidity"),
    operator: operator?.name || "",
    note: formData.get("note"),
    sourceLocation: receipt?.location || ""
  };

  const response = await fetch("/api/processings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Eroare la salvarea procesarii.");
  }
}

function getTransactionReferenceType() {
  return transactionReferenceTypeSelect.value === "delivery"
    ? "delivery"
    : transactionReferenceTypeSelect.value === "opening-debt"
      ? "opening-debt"
      : "receipt";
}

function renderTransactionReferenceOptions() {
  const referenceType = getTransactionReferenceType();
  const currentReferenceValue = transactionReferenceSelect.value;

  if (referenceType === "delivery") {
    renderSelectOptions(
      transactionReferenceSelect,
      deliveriesCache,
      (item) => `#${item.id} - ${item.customer} - ${item.product}`,
      "Selecteaza livrarea"
    );

    setSelectValue(transactionReferenceSelect, [currentReferenceValue, deliveriesCache[0]?.id]);

    return;
  }

  if (referenceType === "opening-debt") {
    const openingDebtItems = openingDocumentsCache.flatMap((item) => item.debtItems || []);
    renderSelectOptions(
      transactionReferenceSelect,
      openingDebtItems,
      (item) =>
        `${item.openingDebtId} - ${item.partner} - ${item.direction === "collection" ? "Incasare" : "Plata"}`,
      "Selecteaza datoria initiala",
      (item) => item.openingDebtId
    );

    setSelectValue(
      transactionReferenceSelect,
      [currentReferenceValue, openingDebtItems[0]?.openingDebtId]
    );

    return;
  }

  renderSelectOptions(
    transactionReferenceSelect,
    receiptsCache,
    (item) => `#${item.id} - ${item.supplier} - ${item.product}`,
    "Selecteaza receptia"
  );

  setSelectValue(transactionReferenceSelect, [currentReferenceValue, receiptsCache[0]?.id]);
}

function getTransactionDirectionLabel(direction) {
  return direction === "collection" ? "Incasare" : "Plata";
}

function syncTransactionDirection() {
  const referenceType = getTransactionReferenceType();
  let direction = "payment";

  if (referenceType === "delivery") {
    direction = "collection";
  } else if (referenceType === "opening-debt") {
    const openingDebt = getSelectedOpeningDebtForTransaction();
    direction = openingDebt?.direction === "collection" ? "collection" : "payment";
  }

  transactionDirectionSelect.value = direction;
  if (transactionDirectionChipEl) {
    transactionDirectionChipEl.textContent = getTransactionDirectionLabel(direction);
  }
}

function getSelectedReceiptForTransaction() {
  if (getTransactionReferenceType() !== "receipt") {
    return null;
  }

  return receiptsCache.find((item) => String(item.id) === String(transactionReferenceSelect.value));
}

function getSelectedOpeningDebtForTransaction() {
  if (getTransactionReferenceType() !== "opening-debt") {
    return null;
  }

  return openingDocumentsCache
    .flatMap((item) => item.debtItems || [])
    .find((item) => String(item.openingDebtId) === String(transactionReferenceSelect.value));
}

function getSelectedDeliveryForTransaction() {
  if (getTransactionReferenceType() !== "delivery") {
    return null;
  }

  return deliveriesCache.find((item) => String(item.id) === String(transactionReferenceSelect.value));
}

function getSelectedReceiptForDelivery() {
  return receiptsCache.find(
    (item) => String(item.id) === String(deliveryReceiptSelect.value)
  );
}

function renderTransactionPreview() {
  const referenceType = getTransactionReferenceType();
  const receipt = getSelectedReceiptForTransaction();
  const delivery = getSelectedDeliveryForTransaction();
  const openingDebt = getSelectedOpeningDebtForTransaction();

  if (!receipt && !delivery && !openingDebt) {
    transactionPartnerEl.textContent = "-";
    transactionTargetEl.textContent = currency.format(0);
    transactionStatusEl.textContent = "Neachitat";
    return;
  }

  const direction = transactionDirectionSelect.value;

  if (referenceType === "delivery" && delivery) {
    const targetAmount = Number(delivery.contractPrice || 0) * Number(delivery.deliveredQuantity || 0);
    transactionPartnerEl.textContent = delivery.customer || "-";
    transactionTargetEl.textContent = currency.format(targetAmount);
    transactionStatusEl.textContent =
      direction === "collection" ? delivery.collectionStatus || "Neincasat" : "N/A";
    return;
  }

  if (referenceType === "opening-debt" && openingDebt) {
    transactionPartnerEl.textContent = openingDebt.partner || "-";
    transactionTargetEl.textContent = currency.format(Number(openingDebt.amount || 0));
    transactionStatusEl.textContent = openingDebt.status || "Neachitat";
    return;
  }

  const targetAmount =
    direction === "collection"
      ? Number(receipt.preliminaryMerchandiseValue || receipt.preliminaryPayableAmount || 0)
      : Number(receipt.preliminaryPayableAmount || 0);

  transactionPartnerEl.textContent = receipt.supplier || "-";
  transactionTargetEl.textContent = currency.format(targetAmount);
  transactionStatusEl.textContent = receipt.paymentStatus || "Neachitat";
}

function renderDeliveryPreview() {
  const receipt = getSelectedReceiptForDelivery();

  if (!receipt) {
    deliveryLocationEl.textContent = "-";
    deliveryAvailableEl.textContent = `${formatNumber(0)} kg`;
    deliveryStatusPreviewEl.textContent = "Nelivrat";
    return;
  }

  const availableQuantity = Number(
    receipt.availableQuantity ??
      receipt.finalNetQuantity ??
      receipt.provisionalNetQuantity ??
      receipt.quantity ??
      0
  );

  deliveryLocationEl.textContent = receipt.location || "-";
  // Disponibil: in kg daca receptia sursa a fost introdusa in kg, altfel in tone
  deliveryAvailableEl.textContent = formatQtyByEntry(availableQuantity, receipt);
  deliveryStatusPreviewEl.textContent = receipt.deliveryStatus || "Nelivrat";

  if (!deliveryQuantityInput.value) {
    deliveryQuantityInput.value = availableQuantity > 0 ? String(availableQuantity) : "";
  }
}

async function createTransaction(formData) {
  const referenceType =
    formData.get("referenceType") === "delivery"
      ? "delivery"
      : formData.get("referenceType") === "opening-debt"
        ? "opening-debt"
        : "receipt";
  const referenceId = formData.get("referenceId");
  const payload = {
    referenceType,
    receiptId: referenceType === "receipt" ? referenceId : "",
    deliveryId: referenceType === "delivery" ? referenceId : "",
    openingDebtId: referenceType === "opening-debt" ? referenceId : "",
    direction: formData.get("direction"),
    paymentType: formData.get("paymentType"),
    amount: formData.get("amount"),
    note: formData.get("note")
  };

  const response = await fetch("/api/transactions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Eroare la salvarea tranzactiei.");
  }
}

async function createDelivery(formData) {
  const payload = Object.fromEntries(formData.entries());
  // Cantitatea livrata se introduce in kg; intern (stoc, disponibil) e in tone.
  if (payload.deliveredQuantity) {
    payload.deliveredQuantity = String(Number(payload.deliveredQuantity || 0) / 1000);
  }
  payload.enteredUnit = "kg";
  const response = await fetch("/api/deliveries", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Eroare la salvarea livrarii.");
  }
}

async function createComplaint(formData) {
  const payload = Object.fromEntries(formData.entries());
  const response = await fetch("/api/complaints", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Eroare la salvarea reclamatiei.");
  }
}

async function updateDeliveryEntry(id, payload) {
  const response = await fetch(`/api/deliveries/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Nu am putut actualiza livrarea.");
  }
}

async function updateComplaintEntry(id, payload) {
  const response = await fetch(`/api/complaints/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Nu am putut actualiza reclamatia.");
  }
}

async function updateProcessingEntry(id, payload) {
  const response = await fetch(`/api/processings/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Nu am putut actualiza procesarea.");
  }
}

async function updateTransactionEntry(id, payload) {
  const response = await fetch(`/api/transactions/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Nu am putut actualiza tranzactia.");
  }
}

async function unlockLockedUsername(username) {
  const response = await fetch(`/api/security/lockouts/${encodeURIComponent(username)}/unlock`, {
    method: "POST"
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Nu am putut debloca utilizatorul.");
  }
}

async function updateStatus(id, status) {
  const changeReason = window.prompt("Introdu mentiunea pentru modificarea statusului:");
  if (!changeReason || !changeReason.trim()) {
    throw new Error("Mentiunea este obligatorie pentru modificare.");
  }

  await fetch(`/api/receipts/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ status, changeReason, changedBy: "dashboard" })
  });
}

async function createConfigEntry(entity, payload) {
  const response = await fetch(`/api/config/${entity}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || `Nu am putut salva: ${entityLabels[entity] || entity}`);
  }
}

async function updateConfigEntry(entity, id, payload) {
  const response = await fetch(`/api/config/${entity}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Nu am putut actualiza: ${entityLabels[entity] || entity}`);
  }
}

async function saveSystemSettings(payload) {
  const response = await fetch("/api/system-settings", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error("Nu am putut salva setarile sistemului.");
  }
}

function requestChangeReason(message) {
  const value = window.prompt(message);
  if (!value || !value.trim()) {
    throw new Error("Mentiunea este obligatorie pentru modificare.");
  }

  return value.trim();
}

function getEntityItem(entity, id) {
  return currentConfig[entity].find((item) => String(item.id) === String(id));
}

// ============================================================
//  Documente de tipar (Etapa 6) — print engine + builders
// ============================================================
function openPrintWindow(bodyHtml, title) {
  const win = window.open("", "_blank");
  if (!win) {
    alert("Permite ferestrele pop-up pentru a printa documentul.");
    return;
  }
  const doc = `<!DOCTYPE html><html lang="ro"><head><meta charset="utf-8"><title>${title}</title>
<style>
  @page { size: A4; margin: 18mm 16mm; }
  * { box-sizing: border-box; }
  body { font-family: 'Times New Roman', Georgia, serif; color: #111; font-size: 13px; line-height: 1.45; margin: 0; }
  .doc-head { display:flex; justify-content:space-between; align-items:flex-start; border-bottom:2px solid #1B5E3F; padding-bottom:10px; margin-bottom:16px; }
  .doc-brand { font-size:20px; font-weight:800; color:#1B5E3F; letter-spacing:-0.5px; }
  .doc-brand small { display:block; font-size:10px; font-weight:400; color:#666; letter-spacing:2px; text-transform:uppercase; }
  .doc-title { text-align:center; font-size:18px; font-weight:700; margin:14px 0 4px; text-transform:uppercase; }
  .doc-subtitle { text-align:center; font-size:12px; color:#555; margin-bottom:18px; }
  .doc-parties { display:flex; gap:24px; margin-bottom:18px; }
  .doc-party { flex:1; border:1px solid #ccc; border-radius:6px; padding:10px 12px; }
  .doc-party h4 { margin:0 0 6px; font-size:11px; text-transform:uppercase; letter-spacing:1px; color:#1B5E3F; }
  .doc-party div { font-size:12px; margin:2px 0; }
  table.doc-table { width:100%; border-collapse:collapse; margin:12px 0; }
  table.doc-table th { background:#1B5E3F; color:#fff; font-size:11px; text-transform:uppercase; letter-spacing:0.5px; padding:7px 8px; text-align:left; }
  table.doc-table td { border:1px solid #ccc; padding:6px 8px; font-size:12px; }
  table.doc-table tfoot td { font-weight:700; background:#f0ece0; }
  .doc-grid { display:grid; grid-template-columns:1fr 1fr; gap:6px 20px; margin:10px 0; }
  .doc-grid div { font-size:12px; padding:3px 0; border-bottom:1px dotted #ddd; }
  .doc-grid b { display:inline-block; min-width:140px; color:#444; }
  .doc-total { text-align:right; font-size:15px; font-weight:700; margin:12px 0; }
  .doc-sign { display:flex; justify-content:space-between; margin-top:40px; }
  .doc-sign div { width:45%; border-top:1px solid #333; padding-top:6px; font-size:11px; text-align:center; color:#555; }
  .doc-foot { margin-top:30px; font-size:10px; color:#999; text-align:center; border-top:1px solid #eee; padding-top:8px; }
  @media print { .no-print { display:none; } }
</style></head><body>
${bodyHtml}
<div class="no-print" style="text-align:center;margin-top:24px;">
  <button onclick="window.print()" style="padding:10px 24px;font-size:14px;background:#1B5E3F;color:#fff;border:0;border-radius:6px;cursor:pointer;">Printează</button>
</div>
<div class="doc-foot">Generat de AgroProfit+ · ${new Date().toLocaleString("ro-RO")}</div>
</body></html>`;
  win.document.write(doc);
  win.document.close();
}

function docHeader() {
  return `<div class="doc-head">
    <div class="doc-brand">AgroProfit+<small>Partenerul tău în agricultură</small></div>
    <div style="text-align:right;font-size:11px;color:#666;">Data: ${new Date().toLocaleDateString("ro-RO")}</div>
  </div>`;
}

function moneyRo(n) {
  return new Intl.NumberFormat("ro-RO", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(n) || 0);
}

function buildStatementPrintHtml(data) {
  const p = data.partner;
  const t = data.totals;
  const receiptRows = data.receipts.map((r) => `
    <tr><td>${formatDateShort(r.date)}</td><td>${r.product}</td><td>${formatNumber(r.quantity)} ${r.unit}</td><td>${moneyRo(r.price)}</td><td>${moneyRo(r.amount)}</td></tr>`).join("");
  const paymentRows = data.payments.map((pm) => `
    <tr><td>${formatDateShort(pm.date)}</td><td>${pm.paymentType || "-"}</td><td>${pm.reference || "-"}</td><td>${moneyRo(pm.amount)}</td></tr>`).join("");
  const balanceText = t.balance > 0
    ? `Datorie către furnizor: ${moneyRo(t.balance)} MDL`
    : t.balance < 0 ? `Avans: ${moneyRo(Math.abs(t.balance))} MDL` : "Achitat integral";
  const periodText = data.period.from || data.period.to
    ? `Perioada: ${data.period.from || "început"} — ${data.period.to || "azi"}` : "Toată perioada";
  return `${docHeader()}
    <div class="doc-title">Act de verificare</div>
    <div class="doc-subtitle">${periodText}</div>
    <div class="doc-party" style="margin-bottom:14px;">
      <h4>Furnizor</h4>
      <div><b>${p.name}</b></div>
      ${p.idno ? `<div>IDNO: ${p.idno}</div>` : ""}
      ${p.address ? `<div>Adresa: ${p.address}</div>` : ""}
      ${p.bankName ? `<div>Banca: ${p.bankName}</div>` : ""}
      ${p.iban ? `<div>IBAN: ${p.iban}</div>` : ""}
    </div>
    <h4 style="color:#1B5E3F;">Recepții</h4>
    <table class="doc-table">
      <thead><tr><th>Data</th><th>Produs</th><th>Cantitate</th><th>Preț</th><th>Sumă</th></tr></thead>
      <tbody>${receiptRows || '<tr><td colspan="5">Nicio recepție</td></tr>'}</tbody>
      <tfoot><tr><td colspan="2">TOTAL</td><td>${formatNumber(t.totalQuantity)}</td><td></td><td>${moneyRo(t.totalReceipts)} MDL</td></tr></tfoot>
    </table>
    <h4 style="color:#1B5E3F;">Achitări</h4>
    <table class="doc-table">
      <thead><tr><th>Data</th><th>Tip plată</th><th>Referință</th><th>Sumă</th></tr></thead>
      <tbody>${paymentRows || '<tr><td colspan="4">Nicio achitare</td></tr>'}</tbody>
      <tfoot><tr><td colspan="3">TOTAL ACHITAT</td><td>${moneyRo(t.totalPaid)} MDL</td></tr></tfoot>
    </table>
    <div class="doc-total">SOLD FINAL: ${balanceText}</div>
    <div class="doc-sign"><div>Furnizor</div><div>Reprezentant AgroProfit+</div></div>`;
}

// Build invoice / certificate / purchase act from a delivery + config
function findPartnerByName(name) {
  return (currentConfig?.partners || []).find((p) => String(p.name).trim().toLowerCase() === String(name || "").trim().toLowerCase()) || null;
}

function buildInvoicePrintHtml(delivery) {
  const buyer = findPartnerByName(delivery.customer);
  const qty = Number(delivery.netWeight > 0 ? delivery.netWeight : delivery.deliveredQuantity || 0);
  const unitPrice = Number(delivery.priceLei || 0);
  const total = qty * unitPrice;
  const cur = delivery.currency && delivery.currency !== "MDL" ? delivery.currency : "MDL";
  const unitPriceForeign = Number(delivery.priceForeign || 0);
  return `${docHeader()}
    <div class="doc-title">Factură / Invoice</div>
    <div class="doc-subtitle">Nr. ${delivery.invoiceNumber || "—"} · ${formatDateShort(delivery.createdAt || delivery.deliveredAt)}</div>
    <div class="doc-parties">
      <div class="doc-party"><h4>Vânzător</h4><div><b>${delivery.seller || "AgroProfit+"}</b></div></div>
      <div class="doc-party"><h4>Cumpărător</h4><div><b>${delivery.customer || "-"}</b></div>${buyer?.idno ? `<div>IDNO: ${buyer.idno}</div>` : ""}${buyer?.address ? `<div>${buyer.address}</div>` : ""}</div>
    </div>
    <table class="doc-table">
      <thead><tr><th>Produs</th><th>Cantitate</th><th>Preț (lei)</th>${cur !== "MDL" ? `<th>Preț (${cur})</th>` : ""}<th>Total (lei)</th></tr></thead>
      <tbody><tr><td>${delivery.product}</td><td>${formatNumber(qty)} t</td><td>${moneyRo(unitPrice)}</td>${cur !== "MDL" ? `<td>${moneyRo(unitPriceForeign)} ${cur}</td>` : ""}<td>${moneyRo(total)}</td></tr></tbody>
      <tfoot><tr><td colspan="${cur !== "MDL" ? 4 : 3}">TOTAL</td><td>${moneyRo(total)} MDL</td></tr></tfoot>
    </table>
    ${delivery.contractNumber ? `<div style="font-size:12px;">Contract: ${delivery.contractNumber} ${delivery.contractDate ? "din " + formatDateShort(delivery.contractDate) : ""}</div>` : ""}
    ${delivery.vehicle ? `<div style="font-size:12px;">Mașină: ${delivery.vehicle}</div>` : ""}
    <div class="doc-sign"><div>Vânzător</div><div>Cumpărător</div></div>`;
}

function buildPurchaseActPrintHtml(delivery) {
  // Act de achizitie is based on the source receipt's supplier
  const receipt = (receiptsCache || []).find((r) => Number(r.id) === Number(delivery.receiptId));
  const supplier = receipt ? findPartnerByName(receipt.supplier) : null;
  const qty = Number(delivery.netWeight > 0 ? delivery.netWeight : delivery.deliveredQuantity || 0);
  const price = Number(receipt?.price || 0);
  const total = Number(receipt?.preliminaryPayableAmount || qty * price);
  return `${docHeader()}
    <div class="doc-title">Act de achiziție</div>
    <div class="doc-subtitle">${formatDateShort(delivery.createdAt)} · Recepție #${delivery.receiptId}</div>
    <div class="doc-party" style="margin-bottom:14px;">
      <h4>Furnizor</h4>
      <div><b>${receipt?.supplier || "-"}</b></div>
      ${supplier?.idno ? `<div>IDNO: ${supplier.idno}</div>` : ""}
      ${supplier?.address ? `<div>${supplier.address}</div>` : ""}
      ${supplier?.bankName ? `<div>Banca: ${supplier.bankName} · IBAN: ${supplier.iban || "-"}</div>` : ""}
    </div>
    <table class="doc-table">
      <thead><tr><th>Produs</th><th>Cantitate</th><th>Preț</th><th>Sumă</th></tr></thead>
      <tbody><tr><td>${delivery.product}</td><td>${formatNumber(qty)} t</td><td>${moneyRo(price)}</td><td>${moneyRo(total)}</td></tr></tbody>
      <tfoot><tr><td colspan="3">TOTAL</td><td>${moneyRo(total)} MDL</td></tr></tfoot>
    </table>
    <div class="doc-sign"><div>Furnizor</div><div>Achizitor AgroProfit+</div></div>`;
}

function buildCertificatePrintHtml(delivery) {
  // Find the most relevant lab report for the product
  const lab = (currentConfig?.labReports || [])
    .filter((l) => l.active !== false && String(l.product).trim().toLowerCase() === String(delivery.product).trim().toLowerCase())
    .sort((a, b) => new Date(b.reportDate || 0) - new Date(a.reportDate || 0))[0]
    || (currentConfig?.labReports || [])[0];
  if (!lab) {
    return `${docHeader()}<div class="doc-title">Certificat de calitate</div>
      <p style="text-align:center;color:#b00;">Nu există date de laborator pentru produsul „${delivery.product}". Adaugă-le în Nomenclator → Date laborator.</p>`;
  }
  const rows = [
    ["Denumirea produsului", lab.product],
    ["Țara de origine", lab.originCountry],
    ["Anul recoltei", lab.harvestYear],
    ["Umiditate, %", lab.humidity],
    ["Aflatoxina B1", lab.aflatoxinB1],
    ["Impurități totale, %", lab.impuritiesTotal],
    ["Impurități diverse, %", lab.impuritiesDiverse],
    ["Boabe sparte, %", lab.brokenGrains],
    ["Boabe încolțite, %", lab.sproutedGrains],
    ["Boabe defecte, %", lab.defectiveGrains],
    ["Destinația produsului", lab.destination]
  ].filter(([, v]) => v !== "" && v !== undefined && v !== null)
   .map(([k, v]) => `<div><b>${k}:</b> ${v}</div>`).join("");
  return `${docHeader()}
    <div class="doc-title">Certificat de calitate</div>
    <div class="doc-subtitle">Raport de încercări nr. ${lab.reportNumber || "—"}${lab.reportDate ? " din " + formatDateShort(lab.reportDate) : ""}</div>
    <div class="doc-grid">${rows}</div>
    ${lab.issuedBy ? `<div style="margin-top:14px;font-size:12px;">Eliberat de: <b>${lab.issuedBy}</b>${lab.contactPhone ? " · tel: " + lab.contactPhone : ""}</div>` : ""}
    <div class="doc-sign"><div>Laborator</div><div>AgroProfit+</div></div>`;
}

function printDeliveryDocument(deliveryId, docType) {
  const delivery = (deliveriesCache || []).find((d) => Number(d.id) === Number(deliveryId));
  if (!delivery) return;
  let html = "";
  let title = "";
  if (docType === "invoice") { html = buildInvoicePrintHtml(delivery); title = `Factura ${delivery.invoiceNumber || delivery.id}`; }
  else if (docType === "act") { html = buildPurchaseActPrintHtml(delivery); title = `Act achizitie ${delivery.id}`; }
  else if (docType === "certificate") { html = buildCertificatePrintHtml(delivery); title = `Certificat calitate ${delivery.id}`; }
  if (html) openPrintWindow(html, title);
}

// ---- Act de verificare furnizor (Etapa 7) ----
let lastStatement = null;

async function generateSupplierStatement() {
  const partnerSelect = document.getElementById("statement-partner-select");
  const fromEl = document.getElementById("statement-date-from");
  const toEl = document.getElementById("statement-date-to");
  const resultEl = document.getElementById("statement-result");
  const actionsEl = document.getElementById("statement-actions");
  if (!partnerSelect || !resultEl) return;

  const partnerId = partnerSelect.value;
  if (!partnerId) {
    resultEl.innerHTML = '<p class="empty-state">Selecteaza un furnizor.</p>';
    if (actionsEl) actionsEl.hidden = true;
    return;
  }

  resultEl.innerHTML = '<p class="empty-state">Se generează…</p>';
  const params = new URLSearchParams({ partnerId });
  if (fromEl && fromEl.value) params.set("from", fromEl.value);
  if (toEl && toEl.value) params.set("to", toEl.value);

  try {
    const res = await fetch(`/api/reports/supplier-statement?${params.toString()}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Eroare la generare.");
    }
    const data = await res.json();
    lastStatement = data;
    renderSupplierStatement(data);
    if (actionsEl) actionsEl.hidden = false;
  } catch (err) {
    resultEl.innerHTML = `<p class="empty-state">${err.message}</p>`;
    if (actionsEl) actionsEl.hidden = true;
  }
}

function renderSupplierStatement(data) {
  const resultEl = document.getElementById("statement-result");
  if (!resultEl) return;
  const t = data.totals;
  const p = data.partner;

  const receiptRows = data.receipts.length
    ? data.receipts.map((r) => `
        <tr>
          <td>#${r.id}</td>
          <td>${formatDateShort(r.date)}</td>
          <td>${r.product}</td>
          <td>${formatNumber(r.quantity)} ${r.unit}</td>
          <td>${currency.format(r.price)}</td>
          <td>${currency.format(r.amount)}</td>
        </tr>`).join("")
    : '<tr><td colspan="6" class="empty-state">Nicio recepție în perioadă.</td></tr>';

  const paymentRows = data.payments.length
    ? data.payments.map((pm) => `
        <tr>
          <td>#${pm.id}</td>
          <td>${formatDateShort(pm.date)}</td>
          <td>${pm.paymentType || "-"}</td>
          <td>${pm.reference || "-"}</td>
          <td>${currency.format(pm.amount)}</td>
        </tr>`).join("")
    : '<tr><td colspan="5" class="empty-state">Nicio achitare în perioadă.</td></tr>';

  const balanceColor = t.balance > 0 ? "var(--danger)" : t.balance < 0 ? "var(--accent-bright)" : "var(--muted)";
  const balanceText = t.balance > 0
    ? `Datorie către furnizor: ${currency.format(t.balance)}`
    : t.balance < 0
      ? `Avans (furnizorul ne datorează): ${currency.format(Math.abs(t.balance))}`
      : "Sold zero — achitat integral";

  resultEl.innerHTML = `
    <div class="statement-partner">
      <h3>${p.name}</h3>
      <div class="statement-partner-meta">
        ${p.idno ? `IDNO: ${p.idno} · ` : ""}${p.fiscalProfile || ""}
        ${p.address ? `<br>Adresa: ${p.address}` : ""}
        ${p.bankName || p.iban ? `<br>Banca: ${p.bankName || "-"} · IBAN: ${p.iban || "-"}` : ""}
      </div>
    </div>

    <h4 class="statement-sub">Recepții</h4>
    <div class="table-wrap">
      <table>
        <thead><tr><th>ID</th><th>Data</th><th>Produs</th><th>Cantitate</th><th>Preț</th><th>Sumă</th></tr></thead>
        <tbody>${receiptRows}</tbody>
        <tfoot><tr class="totals-row"><td colspan="3">TOTAL recepții (${data.receipts.length})</td><td>${formatNumber(t.totalQuantity)}</td><td></td><td>${currency.format(t.totalReceipts)}</td></tr></tfoot>
      </table>
    </div>

    <h4 class="statement-sub">Achitări</h4>
    <div class="table-wrap">
      <table>
        <thead><tr><th>ID</th><th>Data</th><th>Tip plată</th><th>Referință</th><th>Sumă</th></tr></thead>
        <tbody>${paymentRows}</tbody>
        <tfoot><tr class="totals-row"><td colspan="4">TOTAL achitat (${data.payments.length})</td><td>${currency.format(t.totalPaid)}</td></tr></tfoot>
      </table>
    </div>

    <div class="statement-balance" style="border-color:${balanceColor};color:${balanceColor};">
      <span>SOLD FINAL</span>
      <strong>${balanceText}</strong>
    </div>
  `;
}

function printSupplierStatement() {
  if (!lastStatement) return;
  const html = buildStatementPrintHtml(lastStatement);
  openPrintWindow(html, `Act de verificare - ${lastStatement.partner.name}`);
}

// Refresh the data behind a view so lists are always fresh on open
async function refreshViewData(view) {
  try {
    if (view === "receptii") {
      await Promise.all([loadReceipts(), loadDailyReport()]);
    } else if (view === "procesare") {
      await Promise.all([loadProcessings(), loadReceipts(), loadStocks(), loadTransfers()]);
    } else if (view === "livrari") {
      await Promise.all([loadDeliveries(), loadReceipts()]);
    } else if (view === "reclamatii") {
      await Promise.all([loadComplaints(), loadDeliveries()]);
    } else if (view === "financiar") {
      await Promise.all([loadTransactions(), loadReceipts(), loadDeliveries()]);
    } else if (view === "stoc") {
      await loadStocks();
    } else if (view === "acasa") {
      await Promise.all([loadDailyReport(), loadAuditLogs()]);
    } else if (view === "audit") {
      await loadAuditLogs();
    }
  } catch (err) {
    console.warn("refreshViewData failed:", err && err.message);
  }
}

document.querySelectorAll(".view-tab").forEach((button) => {
  button.addEventListener("click", () => {
    setView(button.dataset.view);
    closeSidebarDrawer();
    // Always pull fresh data when the user opens a section
    refreshViewData(button.dataset.view);
  });
});

// Act de verificare buttons (Etapa 7)
document.getElementById("statement-generate-btn")?.addEventListener("click", generateSupplierStatement);
document.getElementById("statement-print-btn")?.addEventListener("click", printSupplierStatement);

// Delivery document print buttons (Etapa 6) — event delegation
document.getElementById("deliveries-body")?.addEventListener("click", (event) => {
  const btn = event.target.closest(".doc-print-btn");
  if (!btn) return;
  printDeliveryDocument(btn.dataset.id, btn.dataset.print);
});

// Expand/collapse sidebar groups (e.g. Nomenclator)
document.querySelectorAll(".sidebar-group-toggle").forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const group = toggle.closest(".sidebar-group");
    if (!group) return;
    const isOpen = group.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });
});

// Keep a sidebar group expanded whenever one of its sub-views is active
function syncSidebarGroups(view) {
  document.querySelectorAll(".sidebar-group").forEach((group) => {
    const subviews = Array.from(group.querySelectorAll(".sidebar-subitem"))
      .map((el) => el.dataset.view);
    const hasActive = subviews.includes(view);
    if (hasActive) {
      group.classList.add("is-open");
      group.querySelector(".sidebar-group-toggle")?.setAttribute("aria-expanded", "true");
    }
  });
}

const sidebarEl = document.getElementById("sidebar");
const sidebarToggleEl = document.getElementById("sidebar-toggle");
const sidebarBackdropEl = document.getElementById("sidebar-backdrop");

function openSidebarDrawer() {
  sidebarEl?.classList.add("is-open");
  sidebarBackdropEl?.classList.add("is-open");
}

function closeSidebarDrawer() {
  sidebarEl?.classList.remove("is-open");
  sidebarBackdropEl?.classList.remove("is-open");
}

if (sidebarToggleEl) {
  sidebarToggleEl.addEventListener("click", () => {
    if (sidebarEl?.classList.contains("is-open")) {
      closeSidebarDrawer();
    } else {
      openSidebarDrawer();
    }
  });
}

if (sidebarBackdropEl) {
  sidebarBackdropEl.addEventListener("click", closeSidebarDrawer);
}

productSelect.addEventListener("change", () => {
  humidityInput.value = "";
  impurityInput.value = "";
  syncUnitByProduct();
});
supplierSelect.addEventListener("change", () => {
  toggleNewSupplierInput();
  renderReceiptEstimate();
});
humidityInput.addEventListener("input", renderReceiptEstimate);
impurityInput.addEventListener("input", renderReceiptEstimate);
formEl.elements.quantity.addEventListener("input", renderReceiptEstimate);
formEl.elements.price.addEventListener("input", renderReceiptEstimate);
receiptStatusFilterEl.addEventListener("change", () => renderReceipts(receiptsCache));
receiptProductFilterEl.addEventListener("change", () => renderReceipts(receiptsCache));
receiptDateFromEl?.addEventListener("change", () => renderReceipts(receiptsCache));
receiptDateToEl?.addEventListener("change", () => renderReceipts(receiptsCache));
processingTypeFilterEl.addEventListener("change", () => renderProcessings(processingsCache));
processingReceiptFilterEl.addEventListener("change", () => renderProcessings(processingsCache));
processingDateFromEl?.addEventListener("change", () => renderProcessings(processingsCache));
processingDateToEl?.addEventListener("change", () => renderProcessings(processingsCache));
deliveryDateFromEl?.addEventListener("change", () => renderDeliveries(deliveriesCache));
deliveryDateToEl?.addEventListener("change", () => renderDeliveries(deliveriesCache));
transactionDateFromEl?.addEventListener("change", () => renderTransactions(transactionsCache));
transactionDateToEl?.addEventListener("change", () => renderTransactions(transactionsCache));
processingReceiptSelect.addEventListener("change", () => {
  autofillProcessingLot();
  renderProcessingEstimate();
});
processedQuantityInput.addEventListener("input", renderProcessingEstimate);
confirmedWasteInput.addEventListener("input", renderProcessingEstimate);
transactionReferenceTypeSelect.addEventListener("change", () => {
  renderTransactionReferenceOptions();
  syncTransactionDirection();
  renderTransactionPreview();
});
transactionReferenceSelect.addEventListener("change", () => {
  syncTransactionDirection();
  renderTransactionPreview();
});
openReceiptStatusFilterEl.addEventListener("change", renderOpenJournal);
openDeliveryStatusFilterEl.addEventListener("change", renderOpenJournal);
openPartnerFilterEl.addEventListener("input", renderOpenJournal);
deliveryReceiptSelect.addEventListener("change", () => {
  deliveryQuantityInput.value = "";
  renderDeliveryPreview();
});
addOpeningStockButton.addEventListener("click", () => {
  const product = currentConfig.products.find(
    (item) => String(item.id) === String(openingStockProductEl.value)
  );
  const location = currentConfig.storageLocations.find(
    (item) => String(item.id) === String(openingStockLocationEl.value)
  );
  const quantity = Number(openingStockQuantityEl.value || 0);

  if (!product || !location || quantity <= 0) {
    window.alert("Completeaza produsul, locatia si cantitatea pentru stocul initial.");
    return;
  }

  openingStockDraft.push({
    product: product.name,
    productId: product.id,
    location: location.name,
    locationId: location.id,
    quantity,
    unit: product.unit
  });
  openingStockQuantityEl.value = "";
  renderOpeningDrafts();
});
addOpeningDebtButton.addEventListener("click", () => {
  const partner = currentConfig.partners.find(
    (item) => String(item.id) === String(openingDebtPartnerEl.value)
  );
  const amount = Number(openingDebtAmountEl.value || 0);

  if (!partner || amount <= 0) {
    window.alert("Completeaza partenerul si suma pentru datoria initiala.");
    return;
  }

  openingDebtDraft.push({
    partner: partner.name,
    partnerId: partner.id,
    direction: openingDebtDirectionEl.value,
    amount,
    note: openingDebtNoteEl.value || "",
    status: openingDebtDirectionEl.value === "collection" ? "Neincasat" : "Neachitat"
  });
  openingDebtAmountEl.value = "";
  openingDebtNoteEl.value = "";
  renderOpeningDrafts();
});

// Cauta o receptie identica de AZI (acelasi furnizor + produs + cantitate),
// ca sa intrebam operatorul daca nu cumva o introduce a doua oara din greseala.
function findDuplicateReceiptToday(formData) {
  const supplierId = formData.get("supplierId");
  const supplierName =
    supplierId === "__new__"
      ? String(formData.get("newSupplierName") || "").trim().toLowerCase()
      : String(
          currentConfig.partners.find((p) => String(p.id) === String(supplierId))?.name || ""
        ).toLowerCase();
  const product = currentConfig.products.find(
    (p) => String(p.id) === String(formData.get("productId"))
  );
  const productName = String(product?.name || "").toLowerCase();
  // Cantitatea din formular e in kg; receptiile stocate sunt in tone.
  const quantity = Number(formData.get("quantity") || 0) / 1000;
  const today = new Date().toISOString().slice(0, 10);

  return receiptsCache.find((r) => {
    const created = String(r.createdAt || r.receivedAt || "").slice(0, 10);
    return (
      created === today &&
      String(r.supplier || "").toLowerCase() === supplierName &&
      String(r.product || "").toLowerCase() === productName &&
      Number(r.grossQuantity || r.quantity || 0) === quantity
    );
  });
}

// Enter intr-un camp NU mai salveaza receptia din greseala (doar butonul Salveaza).
// In bot nu exista problema; pe calculator Enter trimitea formularul si disparea cantitatea.
formEl.addEventListener("keydown", (event) => {
  if (
    event.key === "Enter" &&
    event.target.tagName !== "TEXTAREA" &&
    event.target.tagName !== "BUTTON"
  ) {
    event.preventDefault();
  }
});

formEl.addEventListener("submit", async (event) => {
  event.preventDefault();
  messageEl.textContent = "Se salveaza...";
  const submitMode = getFormSubmitMode(formEl);
  const formData = new FormData(formEl);
  const validationError = validateReceiptForm(formData);

  if (validationError) {
    messageEl.textContent = validationError;
    return;
  }

  const duplicate = findDuplicateReceiptToday(formData);
  if (duplicate) {
    const ok = window.confirm(
      `Pare ca ai introdus deja azi o receptie identica:\n` +
        `#${duplicate.id} — ${duplicate.supplier}, ${duplicate.product}, ` +
        `${formatNumber((duplicate.grossQuantity || duplicate.quantity) * 1000)} kg.\n\n` +
        `Sigur adaugi inca una?`
    );
    if (!ok) {
      messageEl.textContent = "Adaugare anulata.";
      return;
    }
  }

  try {
    await createReceipt(formData);
    resetReceiptForm(submitMode);
    messageEl.textContent = "Receptia a fost salvata.";
    await Promise.all([
      loadReceipts(),
      loadProcessings(),
      loadStocks(),
      loadTransactions(),
      loadDeliveries(),
      loadComplaints(),
      loadAuditLogs(),
      loadDailyReport()
    ]);
  } catch (error) {
    messageEl.textContent = error.message;
  }
});

openingDocumentFormEl.addEventListener("submit", async (event) => {
  event.preventDefault();
  openingDocumentMessageEl.textContent = "Se salveaza...";

  try {
    await createOpeningDocument(new FormData(openingDocumentFormEl));
    openingStockDraft = [];
    openingDebtDraft = [];
    renderOpeningDrafts();
    openingDocumentFormEl.reset();
    openingDocumentDateEl.value = new Date().toISOString().slice(0, 10);
    openingDocumentMessageEl.textContent = "Documentul de sold initial a fost salvat.";
    await Promise.all([loadOpeningDocuments(), loadStocks(), loadAuditLogs()]);
    if (currentConfig) {
      renderReceiptSelectors(currentConfig);
    }
  } catch (error) {
    openingDocumentMessageEl.textContent = error.message;
  }
});

processingFormEl.addEventListener("submit", async (event) => {
  event.preventDefault();
  processingMessageEl.textContent = "Se salveaza...";

  try {
    await createProcessing(new FormData(processingFormEl));
    processingFormEl.reset();
    renderProcessingEstimate();
    processingMessageEl.textContent = "Procesarea a fost salvata.";
    await Promise.all([
      loadReceipts(),
      loadProcessings(),
      loadStocks(),
      loadTransactions(),
      loadDeliveries(),
      loadComplaints(),
      loadAuditLogs(),
      loadDailyReport()
    ]);
  } catch (error) {
    processingMessageEl.textContent = error.message;
  }
});

// Confirmarea de la finele zilei ca nu s-a procesat nimic
if (eodConfirmBtn) {
  eodConfirmBtn.addEventListener("click", () => {
    const today = new Date().toISOString().slice(0, 10);
    try {
      window.localStorage.setItem(`eod-no-processing-${today}`, "1");
    } catch (_e) {
      /* ignore */
    }
    if (eodBanner) eodBanner.hidden = true;
  });
}

// Transfer intre cilindri
if (transferFormEl) {
  transferProductSelect.addEventListener("change", updateTransferAvailableHint);
  transferFromSelect.addEventListener("change", updateTransferAvailableHint);

  transferFormEl.addEventListener("keydown", (event) => {
    if (
      event.key === "Enter" &&
      event.target.tagName !== "TEXTAREA" &&
      event.target.tagName !== "BUTTON"
    ) {
      event.preventDefault();
    }
  });

  transferFormEl.addEventListener("submit", async (event) => {
    event.preventDefault();
    transferMessageEl.textContent = "Se salveaza...";
    const payload = Object.fromEntries(new FormData(transferFormEl).entries());

    try {
      const response = await fetch("/api/transfers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || "Nu am putut salva transferul.");
      }
      transferQuantityInput.value = "";
      transferMessageEl.textContent = "Transferul a fost salvat.";
      await Promise.all([loadStocks(), loadTransfers(), loadDailyReport()]);
    } catch (error) {
      transferMessageEl.textContent = error.message;
    }
  });
}

transactionFormEl.addEventListener("submit", async (event) => {
  event.preventDefault();
  transactionMessageEl.textContent = "Se salveaza...";
  const submitMode = getFormSubmitMode(transactionFormEl);
  const formData = new FormData(transactionFormEl);
  const validationError = validateTransactionForm(formData);

  if (validationError) {
    transactionMessageEl.textContent = validationError;
    return;
  }

  try {
    await createTransaction(formData);
    resetTransactionForm(submitMode);
    transactionMessageEl.textContent = "Tranzactia a fost salvata.";
    await Promise.all([
      loadOpeningDocuments(),
      loadReceipts(),
      loadTransactions(),
      loadDailyReport(),
      loadConfig(),
      loadAuditLogs()
    ]);
  } catch (error) {
    transactionMessageEl.textContent = error.message;
  }
});

deliveryFormEl.addEventListener("submit", async (event) => {
  event.preventDefault();
  deliveryMessageEl.textContent = "Se salveaza...";
  const submitMode = getFormSubmitMode(deliveryFormEl);
  const formData = new FormData(deliveryFormEl);
  const validationError = validateDeliveryForm(formData);

  if (validationError) {
    deliveryMessageEl.textContent = validationError;
    return;
  }

  try {
    await createDelivery(formData);
    resetDeliveryForm(submitMode);
    deliveryMessageEl.textContent = "Livrarea a fost salvata.";
    await Promise.all([
      loadReceipts(),
      loadStocks(),
      loadDeliveries(),
      loadComplaints(),
      loadAuditLogs(),
      loadDailyReport(),
      loadConfig()
    ]);
  } catch (error) {
    deliveryMessageEl.textContent = error.message;
  }
});

receiptSaveNewButton.addEventListener("click", () => {
  formEl.dataset.submitMode = "save-new";
  formEl.requestSubmit();
});

transactionSaveNewButton.addEventListener("click", () => {
  transactionFormEl.dataset.submitMode = "save-new";
  transactionFormEl.requestSubmit();
});

deliverySaveNewButton.addEventListener("click", () => {
  deliveryFormEl.dataset.submitMode = "save-new";
  deliveryFormEl.requestSubmit();
});

complaintFormEl.addEventListener("submit", async (event) => {
  event.preventDefault();
  complaintMessageEl.textContent = "Se salveaza...";

  try {
    await createComplaint(new FormData(complaintFormEl));
    complaintFormEl.reset();
    complaintMessageEl.textContent = "Reclamatia a fost salvata.";
    await Promise.all([loadReceipts(), loadDeliveries(), loadComplaints(), loadDailyReport(), loadConfig(), loadAuditLogs()]);
  } catch (error) {
    complaintMessageEl.textContent = error.message;
  }
});

async function transitionDelivery(id, action, payload) {
  const endpointMap = {
    Confirmat: "confirm",
    Livrat: "deliver",
    Inchis: "close",
    Anulat: "cancel",
    Redeschis: "reopen"
  };
  const endpoint = endpointMap[action];
  if (!endpoint) {
    throw new Error(`Tranzitie necunoscuta: ${action}`);
  }
  const response = await fetch(`/api/deliveries/${id}/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || `Nu am putut aplica tranzitia ${action}.`);
  }
  return response.json();
}

deliveriesBodyEl.addEventListener("click", async (event) => {
  const target = event.target;
  if (!target.matches(".delivery-action")) {
    return;
  }
  const action = target.dataset.action;
  const id = target.dataset.id;

  try {
    const payload = {};
    if (action === "Livrat") {
      const grossRaw = window.prompt("Greutate bruto (kg):");
      if (grossRaw === null) return;
      const tareRaw = window.prompt("Greutate tara (kg):", "0");
      if (tareRaw === null) return;
      const gross = Number(grossRaw);
      const tare = Number(tareRaw);
      if (!Number.isFinite(gross) || gross <= 0) {
        window.alert("Greutate bruto invalida.");
        return;
      }
      if (!Number.isFinite(tare) || tare < 0) {
        window.alert("Greutate tara invalida.");
        return;
      }
      // Cantarul e in kg; intern stocam in tone.
      payload.grossWeight = gross / 1000;
      payload.tareWeight = tare / 1000;
    }
    const needsReason = action === "Anulat" || action === "Redeschis" || action === "Inchis";
    if (needsReason) {
      payload.changeReason = requestChangeReason(`Motivul pentru ${action}:`);
    } else {
      payload.changeReason = `Tranzitie ${action}`;
    }
    await transitionDelivery(id, action, payload);
    await Promise.all([loadDeliveries(), loadReceipts(), loadAuditLogs(), loadDailyReport()]);
  } catch (error) {
    window.alert(error.message);
    await loadDeliveries();
  }
});

// Contabilul completeaza datele de factura pe o livrare introdusa de operator.
if (deliveryBillingDialog && deliveryBillingForm) {
  deliveriesBodyEl.addEventListener("click", (event) => {
    const trigger = event.target.closest('[data-action="edit-billing"]');
    if (!trigger) return;
    const id = trigger.dataset.id;
    const delivery = deliveriesCache.find((item) => String(item.id) === String(id));
    if (!delivery) return;
    const f = deliveryBillingForm;
    f.elements.id.value = delivery.id;
    f.elements.seller.value = delivery.seller || "";
    f.elements.invoiceNumber.value = delivery.invoiceNumber || "";
    f.elements.contractNumber.value = delivery.contractNumber || "";
    f.elements.contractDate.value = delivery.contractDate || "";
    f.elements.priceLei.value = delivery.priceLei || "";
    f.elements.priceForeign.value = delivery.priceForeign || "";
    f.elements.currency.value = delivery.currency || "MDL";
    f.elements.vehicle.value = delivery.vehicle || "";
    f.elements.note.value = delivery.note || "";
    const idLabel = document.getElementById("billing-delivery-id");
    if (idLabel) idLabel.textContent = `#${delivery.id}`;
    const msg = document.getElementById("billing-message");
    if (msg) msg.textContent = "";
    deliveryBillingDialog.showModal();
  });

  const billingCancelBtn = document.getElementById("billing-cancel-btn");
  if (billingCancelBtn) {
    billingCancelBtn.addEventListener("click", () => deliveryBillingDialog.close());
  }

  deliveryBillingForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const f = deliveryBillingForm;
    const id = f.elements.id.value;
    const payload = {
      seller: f.elements.seller.value,
      invoiceNumber: f.elements.invoiceNumber.value,
      contractNumber: f.elements.contractNumber.value,
      contractDate: f.elements.contractDate.value,
      priceLei: f.elements.priceLei.value,
      priceForeign: f.elements.priceForeign.value,
      currency: f.elements.currency.value,
      vehicle: f.elements.vehicle.value,
      note: f.elements.note.value,
      changeReason: "Completare date factura",
      changedBy: "dashboard"
    };
    const msg = document.getElementById("billing-message");
    if (msg) msg.textContent = "Se salveaza...";
    try {
      await updateDeliveryEntry(id, payload);
      deliveryBillingDialog.close();
      await Promise.all([loadDeliveries(), loadAuditLogs(), loadDailyReport()]);
    } catch (error) {
      if (msg) msg.textContent = error.message;
    }
  });
}

complaintsBodyEl.addEventListener("change", async (event) => {
  const target = event.target;
  if (!target.matches(".complaint-status")) {
    return;
  }

  try {
    const newStatus = target.value;
    const changeReason = requestChangeReason("Introdu mentiunea pentru modificarea reclamatiei:");
    const payload = {
      status: newStatus,
      changeReason,
      changedBy: "dashboard"
    };

    if (newStatus === "Acceptata") {
      const tip = window.prompt(
        "Tip rezolutie: 'factura' (invoice adjustment), 'stoc' (stock correction), 'ambele' sau 'niciuna':",
        "niciuna"
      );
      if (tip === null) return;
      const resolution = String(tip).trim().toLowerCase();
      if (resolution === "factura" || resolution === "ambele") {
        const amtRaw = window.prompt("Suma ajustare factura (MDL, negativ pentru reducere):", "-100");
        if (amtRaw === null) return;
        const amt = Number(amtRaw);
        if (!Number.isFinite(amt) || amt === 0) {
          window.alert("Suma ajustare invalida.");
          return;
        }
        const note = window.prompt("Nota ajustare factura:", "Ajustare din reclamatie") || "";
        payload.invoiceAdjustment = { type: "adjust", amount: amt, note };
      }
      if (resolution === "stoc" || resolution === "ambele") {
        const delRaw = window.prompt("ID livrare pentru corectie stoc:");
        if (delRaw === null) return;
        const deltaRaw = window.prompt("Delta cantitate (kg, negativ = scadere):", "-50");
        if (deltaRaw === null) return;
        const deliveryId = Number(delRaw);
        const deltaQuantity = Number(deltaRaw);
        if (!Number.isFinite(deliveryId) || deliveryId <= 0) {
          window.alert("ID livrare invalid.");
          return;
        }
        if (!Number.isFinite(deltaQuantity) || deltaQuantity === 0) {
          window.alert("Delta cantitate invalida.");
          return;
        }
        const note = window.prompt("Nota corectie stoc:", "Corectie din reclamatie") || "";
        payload.stockCorrection = { deliveryId, deltaQuantity, note };
      }
    }

    await updateComplaintEntry(target.dataset.id, payload);
    await Promise.all([loadComplaints(), loadDeliveries(), loadReceipts(), loadAuditLogs(), loadDailyReport()]);
  } catch (error) {
    window.alert(error.message);
    await loadComplaints();
  }
});

processingsBodyEl.addEventListener("change", async (event) => {
  const target = event.target;
  if (!target.matches(".processing-status")) {
    return;
  }

  try {
    const changeReason = requestChangeReason("Introdu mentiunea pentru modificarea procesarii:");
    await updateProcessingEntry(target.dataset.id, {
      status: target.value,
      changeReason,
      changedBy: "dashboard"
    });
    await Promise.all([loadProcessings(), loadAuditLogs(), loadDailyReport()]);
  } catch (error) {
    window.alert(error.message);
    await loadProcessings();
  }
});

transactionsBodyEl.addEventListener("change", async (event) => {
  const target = event.target;
  if (!target.matches(".transaction-status")) {
    return;
  }

  try {
    const changeReason = requestChangeReason("Introdu mentiunea pentru modificarea tranzactiei:");
    await updateTransactionEntry(target.dataset.id, {
      status: target.value,
      changeReason,
      changedBy: "dashboard"
    });
    await Promise.all([loadTransactions(), loadAuditLogs(), loadDailyReport()]);
  } catch (error) {
    window.alert(error.message);
    await loadTransactions();
  }
});

dailyReportFormEl.addEventListener("submit", async (event) => {
  event.preventDefault();
  await loadDailyReport();
});

bodyEl.addEventListener("change", async (event) => {
  const target = event.target;
  if (!target.matches(".status")) {
    return;
  }

  try {
    await updateStatus(target.dataset.id, target.value);
    await Promise.all([loadReceipts(), loadAuditLogs()]);
  } catch (error) {
    window.alert(error.message);
    await loadReceipts();
  }
});

// Contabilul schimba DOAR furnizorul unei receptii (inline, in lista Receptii recente)
bodyEl.addEventListener("click", (event) => {
  const trigger = event.target.closest('[data-action="change-supplier"]');
  if (!trigger) {
    return;
  }
  const receiptId = trigger.dataset.id;
  const cell = trigger.closest(".supplier-cell");
  if (!cell) {
    return;
  }

  const suppliers = (currentConfig.partners || [])
    .filter((item) => item.role === "furnizor" || item.role === "ambele")
    .sort((a, b) => String(a.name).localeCompare(String(b.name), "ro", { sensitivity: "base" }));
  const receipt = receiptsCache.find((item) => String(item.id) === String(receiptId));
  const currentId = receipt ? receipt.supplierId : "";
  const optionsHtml = suppliers
    .map(
      (item) =>
        `<option value="${item.id}" ${String(item.id) === String(currentId) ? "selected" : ""}>${item.name}${item.status === "temporar" ? " (temporar)" : ""}</option>`
    )
    .join("");

  cell.innerHTML = `
    <select class="supplier-change-select">${optionsHtml}</select>
    <button type="button" class="cell-btn cell-btn-primary" data-action="save-supplier" data-id="${receiptId}" title="Salvează">✓</button>
    <button type="button" class="cell-btn" data-action="cancel-supplier" title="Renunță">✗</button>
  `;
});

bodyEl.addEventListener("click", async (event) => {
  const cancelBtn = event.target.closest('[data-action="cancel-supplier"]');
  if (cancelBtn) {
    renderReceipts(receiptsCache);
    return;
  }

  const saveBtn = event.target.closest('[data-action="save-supplier"]');
  if (!saveBtn) {
    return;
  }
  const receiptId = saveBtn.dataset.id;
  const cell = saveBtn.closest(".supplier-cell");
  const select = cell ? cell.querySelector(".supplier-change-select") : null;
  const supplierId = select ? select.value : "";
  if (!supplierId) {
    return;
  }

  try {
    const response = await fetch(`/api/receipts/${receiptId}/supplier`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ supplierId })
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || "Nu am putut schimba furnizorul.");
    }
    await Promise.all([loadReceipts(), loadAuditLogs()]);
  } catch (error) {
    window.alert(error.message);
    renderReceipts(receiptsCache);
  }
});

document.querySelectorAll("[data-entity-form]").forEach((form) => {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const entity = form.dataset.entityForm;
    const payload = Object.fromEntries(new FormData(form).entries());

    try {
      await createConfigEntry(entity, payload);
      form.reset();
      if (entity === "products") {
        form.elements.unit.value = "tone";
        form.elements.active.value = "true";
      }
      await loadConfig();
    } catch (error) {
      window.alert(error.message);
    }
  });
});

document.querySelectorAll(".list-block").forEach((container) => {
  container.addEventListener("click", async (event) => {
    const target = event.target.closest("[data-action]");
    if (!target) {
      return;
    }

    const { action, entity, id } = target.dataset;
    const item = getEntityItem(entity, id);
    if (!item) {
      return;
    }

    try {
      if (action === "edit" && entity !== "roles") {
        openEditor(entity, item);
      }

      if (action === "toggle" && entity !== "roles" && Object.prototype.hasOwnProperty.call(item, "active")) {
        const changeReason = requestChangeReason("Introdu mentiunea pentru activare/dezactivare:");
        await updateConfigEntry(entity, id, {
          ...item,
          active: !item.active,
          changeReason,
          changedBy: "dashboard"
        });
      }

      await Promise.all([loadConfig(), loadAuditLogs()]);
    } catch (error) {
      window.alert(error.message);
    }
  });
});

if (lockoutsBodyEl) {
  lockoutsBodyEl.addEventListener("click", async (event) => {
    const target = event.target.closest(".unlock-user-button");
    if (!target) {
      return;
    }

    try {
      await unlockLockedUsername(target.dataset.username);
      await Promise.all([loadLockouts(), loadAuditLogs()]);
    } catch (error) {
      window.alert(error.message);
    }
  });
}

editorForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!currentEditor) {
    return;
  }

  editorMessageEl.textContent = "Se salveaza...";
  const payload = Object.fromEntries(new FormData(editorForm).entries());
  const currentItem = getEntityItem(currentEditor.entity, currentEditor.id);

  try {
    const changeReason = requestChangeReason("Introdu mentiunea pentru modificare:");
    await updateConfigEntry(currentEditor.entity, currentEditor.id, {
      ...currentItem,
      ...payload,
      changeReason,
      changedBy: "dashboard"
    });
    editorMessageEl.textContent = "Modificarile au fost salvate.";
    await Promise.all([loadConfig(), loadAuditLogs()]);
  } catch (error) {
    editorMessageEl.textContent = error.message;
  }
});

editorCancelButton.addEventListener("click", resetEditor);

systemSettingsForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  settingsMessageEl.textContent = "Se salveaza...";

  try {
    const changeReason = requestChangeReason("Introdu mentiunea pentru modificarea setarilor:");
    await saveSystemSettings({
      ...Object.fromEntries(new FormData(systemSettingsForm).entries()),
      changeReason,
      changedBy: "dashboard"
    });
    settingsMessageEl.textContent = "Setarile au fost actualizate.";
    await Promise.all([loadConfig(), loadAuditLogs(), loadAutomationStatus()]);
  } catch (error) {
    settingsMessageEl.textContent = error.message;
  }
});

if (runCloseOfDayButtonEl) {
  runCloseOfDayButtonEl.addEventListener("click", async () => {
    automationMessageEl.textContent = "Se ruleaza...";

    try {
      const response = await fetch("/api/automation/close-of-day/run", {
        method: "POST"
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Nu am putut rula automatizarea.");
      }

      automationMessageEl.textContent = payload.sent
        ? `Raport trimis catre ${payload.recipients} destinatar(i).`
        : `Automatizarea nu a trimis nimic: ${payload.reason}.`;
      await Promise.all([loadAutomationStatus(), loadAuditLogs()]);
    } catch (error) {
      automationMessageEl.textContent = error.message;
    }
  });
}

if (runCriticalAlertsCheckButtonEl) {
  runCriticalAlertsCheckButtonEl.addEventListener("click", async () => {
    criticalAlertsMessageEl.textContent = "Verific alertarea critica...";

    try {
      const response = await fetch("/api/automation/critical-alerts/check", {
        method: "POST"
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Nu am putut rula verificarea alertelor critice.");
      }

      criticalAlertsMessageEl.textContent = `Verificare finalizata: alerta ${data.checkResult?.reason || "-"}, escaladare ${data.escalationResult?.reason || "-"}.`;
      criticalAlertsStatusCache = data.status || null;
      renderCriticalAlertsStatus(criticalAlertsStatusCache);
      await loadAuditLogs();
    } catch (error) {
      criticalAlertsMessageEl.textContent = error.message;
    }
  });
}

loginFormEl.addEventListener("submit", async (event) => {
  event.preventDefault();
  loginMessageEl.textContent = "Se verifica accesul...";

  try {
    const user = await login(
      loginFormEl.elements.username.value,
      loginFormEl.elements.password.value
    );
    setCurrentUser(user);
    showDashboardShell();
    loginMessageEl.textContent = "";
    await loadDashboard();
    startAutomationRefreshLoop();
  } catch (error) {
    loginMessageEl.textContent = error.message;
  }
});

logoutButtonEl.addEventListener("click", async () => {
  stopAutomationRefreshLoop();
  await logout();
  setCurrentUser(null);
  showLoginScreen("Sesiunea a fost inchisa.");
});

changePasswordButtonEl.addEventListener("click", () => {
  togglePasswordPanel(passwordPanelEl.hidden);
});

cancelPasswordButtonEl.addEventListener("click", () => {
  togglePasswordPanel(false);
});

changePasswordFormEl.addEventListener("submit", async (event) => {
  event.preventDefault();
  changePasswordMessageEl.textContent = "Se salveaza...";

  try {
    const formData = new FormData(changePasswordFormEl);
    const user = await changePassword({
      currentPassword: formData.get("currentPassword"),
      newPassword: formData.get("newPassword"),
      confirmPassword: formData.get("confirmPassword")
    });
    setCurrentUser(user || currentSessionUser);
    changePasswordMessageEl.textContent = "Parola a fost schimbata.";
    togglePasswordPanel(false);
  } catch (error) {
    changePasswordMessageEl.textContent = error.message;
  }
});

async function bootstrap() {
  resetEditor();
  togglePasswordPanel(false);
  stopAutomationRefreshLoop();

  const tg = getTelegramWebApp();
  if (tg) {
    try {
      tg.ready();
      tg.expand();
      document.body.classList.add("telegram-webapp");
    } catch (tgError) {
      console.error("Telegram WebApp init failed:", tgError.message);
    }
  }

  try {
    let user = await loadSession();

    if (!user && tg) {
      try {
        user = await telegramLogin(tg.initData);
      } catch (telegramError) {
        console.error("Telegram auto-login failed:", telegramError.message);
      }
    }

    if (!user) {
      showLoginScreen();
      return;
    }

    setCurrentUser(user);
    showDashboardShell();
    await loadDashboard();
    startAutomationRefreshLoop();
  } catch (error) {
    console.error("Bootstrap failed:", error.message);
    stopAutomationRefreshLoop();
    setCurrentUser(null);
    showLoginScreen("Nu am putut initializa sesiunea.");
  }
}

bootstrap();
