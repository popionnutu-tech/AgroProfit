// Shim defensiv: daca i18n-ru.js nu s-a incarcat, bi()/setBilingual()/applyBilingualDom()
// raman functii inofensive (identitate), ca sa nu arunce ReferenceError si sa sparga randarea.
if (typeof window.bi !== "function") {
  window.bi = function (text) { return text; };
  window.setBilingual = function () {};
  window.applyBilingualDom = function () {};
}

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
const pendingWeighingPanel = document.getElementById("pending-weighing-panel");
const pendingWeighingBody = document.getElementById("pending-weighing-body");
const pendingWeighingCount = document.getElementById("pending-weighing-count");
const completeWeighingForm = document.getElementById("complete-weighing-form");
const completeWeighingTitle = document.getElementById("complete-weighing-title");
const completeTareInput = document.getElementById("complete-tare-input");
const completeWeighingCancel = document.getElementById("complete-weighing-cancel");
const closeDayButton = document.getElementById("close-day-button");
const closeDayStatus = document.getElementById("close-day-status");
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
const supplierSearchInput = document.getElementById("supplier-search");
const supplierIdInput = document.getElementById("supplier-id");
const supplierSuggestionsEl = document.getElementById("supplier-suggestions");
const newSupplierWrap = document.getElementById("new-supplier-wrap");
const newSupplierNameInput = document.getElementById("new-supplier-name");
const productSelect = document.getElementById("product-select");
const locationSelect = document.getElementById("location-select");
const userSelect = document.getElementById("user-select");
const unitInput = document.getElementById("unit-input");
const grossWeightInput = document.getElementById("gross-weight-input");
const tareWeightInput = document.getElementById("tare-weight-input");
const netQtyHintEl = document.getElementById("net-qty-hint");
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
const processingProductSelect = document.getElementById("processing-product-select");
const processingSourceSelect = document.getElementById("processing-source-select");
const processingDestSelect = document.getElementById("processing-dest-select");
const processingTypeSelect = document.getElementById("processing-type-select");
const processingUserSelect = document.getElementById("processing-user-select");
const processedQuantityInput = document.getElementById("processed-quantity-input");
const confirmedWasteInput = document.getElementById("confirmed-waste-input");
const processingInitialHumidityInput = document.getElementById("processing-initial-humidity");
const processingFinalHumidityInput = document.getElementById("processing-final-humidity");
const processingAvailableEl = document.getElementById("processing-available");
const processingWaterEl = document.getElementById("processing-water");
const processingFinalNetEl = document.getElementById("processing-final-net");
const processingInlucruBtn = document.getElementById("processing-inlucru-btn");
const processingFinalizeBanner = document.getElementById("processing-finalize-banner");
const processingFinalizeText = document.getElementById("processing-finalize-text");
const processingFinalizeCancel = document.getElementById("processing-finalize-cancel");
const processingInlucruPanel = document.getElementById("processing-inlucru-panel");
const processingInlucruBody = document.getElementById("processing-inlucru-body");
const processingInlucruCount = document.getElementById("processing-inlucru-count");
// Id-ul procesarii "in lucru" pe care o finalizam (reincarcata in formular). null = procesare noua.
let finalizeProcessingId = null;
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
const receiptSupplierFilterEl = document.getElementById("receipt-supplier-filter");
const receiptPaymentFilterEl = document.getElementById("receipt-payment-filter");
const receiptDateFromEl = document.getElementById("receipt-date-from");
const receiptDateToEl = document.getElementById("receipt-date-to");
const receiptsFootEl = document.getElementById("receipts-foot");
const unprocessedStockBodyEl = document.getElementById("unprocessed-stock-body");
const eodBanner = document.getElementById("eod-processing-banner");
const eodConfirmBtn = document.getElementById("eod-confirm-btn");
const processingTypeFilterEl = document.getElementById("processing-type-filter");
const processingProductFilterEl = document.getElementById("processing-product-filter");
const processingDateFromEl = document.getElementById("processing-date-from");
const processingDateToEl = document.getElementById("processing-date-to");
const processingsFootEl = document.getElementById("processings-foot");
const deliveryDateFromEl = document.getElementById("delivery-date-from");
const deliveryDateToEl = document.getElementById("delivery-date-to");
const deliveryCustomerFilterEl = document.getElementById("delivery-customer-filter");
const deliveryProductFilterEl2 = document.getElementById("delivery-product-filter");
const deliveryPaidFilterEl = document.getElementById("delivery-paid-filter");
const deliveriesFootEl = document.getElementById("deliveries-foot");
const transactionDateFromEl = document.getElementById("transaction-date-from");
const transactionDateToEl = document.getElementById("transaction-date-to");
const transactionPartnerFilterEl = document.getElementById("transaction-partner-filter");
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
const deliveryProductSelect = document.getElementById("delivery-product-select");
const deliverySourceSelect = document.getElementById("delivery-source-select");
const deliveryCustomerSelect = document.getElementById("delivery-customer-select");
const deliveryGrossInput = document.getElementById("delivery-gross-input");
const deliveryTareInput = document.getElementById("delivery-tare-input");
const deliveryVehicleSelect = document.getElementById("delivery-vehicle-select");
const deliveryTrailerSelect = document.getElementById("delivery-trailer-select");
const deliveryAvailableEl = document.getElementById("delivery-available");
const deliveryNetEl = document.getElementById("delivery-net");
const deliveryStatusPreviewEl = document.getElementById("delivery-status");
const deliveriesBodyEl = document.getElementById("deliveries-body");
const deliveryBillingDialog = document.getElementById("delivery-billing-dialog");
const deliveryBillingForm = document.getElementById("delivery-billing-form");
const complaintFormEl = document.getElementById("complaint-form");
const complaintCustomerSelect = document.getElementById("complaint-customer-select");
const complaintProductSelect = document.getElementById("complaint-product-select");
const complaintProductFilterEl = document.getElementById("complaint-product-filter");
const complaintsFootEl = document.getElementById("complaints-foot");
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
const dailyReportFromEl = document.getElementById("daily-report-from");
const dailyReportToEl = document.getElementById("daily-report-to");
const dailyReportSummaryEl = document.getElementById("daily-report-summary");
const dailyReportReceiptsEl = document.getElementById("daily-report-receipts");
const dailyReportProcessingsEl = document.getElementById("daily-report-processings");
const dailyReportDeliveriesEl = document.getElementById("daily-report-deliveries");
const dailyReportTransactionsEl = document.getElementById("daily-report-transactions");
const dailyReportReceiptsFootEl = document.getElementById("daily-report-receipts-foot");
const dailyReportDeliveriesFootEl = document.getElementById("daily-report-deliveries-foot");
const dailyReportTransactionsFootEl = document.getElementById("daily-report-transactions-foot");
const dailyReportComplaintsEl = document.getElementById("daily-report-complaints");
const dailyReportCanceledEl = document.getElementById("daily-report-canceled");
const dailyReportCanceledCountEl = document.getElementById("daily-report-canceled-count");
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
  labReports: "Date laborator",
  companies: "Companiile mele",
  fields: "Campuri"
};

let currentConfig = null;
let partnerFilters = { q: "", role: "", fiscal: "", status: "" };
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
  // Interfata bilingva RO + RU se activeaza automat pentru operator (vorbitor de rusa).
  if (typeof window.setBilingual === "function") {
    window.setBilingual(currentSessionUser?.roleCode === "operator");
  }
  // La schimbarea sesiunii (mai ales logout, pe terminal partajat): golește panoul admin-only
  // „Activitate utilizatori", ca datele randate de un admin anterior să nu rămână în DOM și să
  // apară următorului utilizator (cu drepturi mai mici) la login. renderUserActivity le re-pune
  // doar dacă noul utilizator are dreptul.
  const uaBody = document.getElementById("user-activity-body");
  const uaCount = document.getElementById("user-activity-count");
  const uaPanel = document.getElementById("user-activity-panel");
  if (uaBody) uaBody.innerHTML = "";
  if (uaCount) uaCount.textContent = "";
  if (uaPanel) uaPanel.hidden = true;
}

function canAccess(capability) {
  if (!currentSessionUser?.roleCode) {
    return false;
  }

  return Array.isArray(currentSessionUser.permissions) && currentSessionUser.permissions.includes(capability);
}

// Vizibilitatea documentelor ANULATE:
//  - admin   → vede toate anulatele
//  - manager → vede doar anulatele facute de un manager
//  - restul  → nu vad documentele anulate
// Documentele ne-anulate raman vizibile normal (dupa drepturile de view).
function canViewCanceled(item) {
  if (!item || item.status !== "Anulat") {
    return true;
  }
  const role = currentSessionUser?.roleCode;
  if (role === "admin") {
    return true;
  }
  if (role === "manager") {
    return item.canceledByRole === "manager";
  }
  return false;
}

// Statusuri „confirmat-sau-mai-departe": odată ce un document ajunge aici, schimbarea
// statutului e rezervata manager+admin (sursa de adevar duplicata si in backend —
// TINE SINCRON cu STATUS_CONFIRMED_PLUS din src/local-storage.js).
const CONFIRMED_PLUS = ["Confirmat", "Procesata", "Inchis", "Redeschis", "Finalizata", "Livrat", "Verificata"];

// Cine poate ANULA documente (status „Anulat"): DOAR admin.
function canCancelDocuments() {
  return currentSessionUser?.roleCode === "admin";
}

// Cine poate schimba statutul unui document deja confirmat: manager + admin.
function canEditConfirmedStatus() {
  const role = currentSessionUser?.roleCode;
  return role === "admin" || role === "manager";
}

// Butoane pe rand: „Anulează" (admin/manager) + „Comentariu" (admin). Pentru documentele
// deja anulate arata eticheta „Anulat" + motivul (tooltip). kind ∈ receipt/delivery/transfer.
function docActionsCell(kind, item) {
  if (item.status === "Anulat") {
    const tip = item.cancelReason ? ` title="Motiv: ${escapeComboHtml(item.cancelReason)}"` : "";
    const who = item.canceledByRole ? ` (${escapeComboHtml(item.canceledByRole)})` : "";
    return `<span class="status-badge badge-anulat"${tip}>Anulat${who}</span>`;
  }
  let html = "";
  if (canCancelDocuments()) {
    html += `<button type="button" class="cell-btn cell-btn-danger" data-action="doc-cancel" data-kind="${kind}" data-id="${item.id}" title="Anulează (rămâne în listă, fără mișcări)">Anulează</button>`;
  }
  if (currentSessionUser?.roleCode === "admin") {
    html += ` <button type="button" class="cell-btn" data-action="doc-note" data-kind="${kind}" data-id="${item.id}" data-note="${escapeComboHtml(item.note || "")}" title="Comentariu / data reală">💬</button>`;
  }
  return html;
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
  // Traduce textul static bilingv RO + RU (activ doar pentru operator; idempotent).
  if (typeof window.applyBilingualDom === "function") {
    window.applyBilingualDom();
  }
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

// ---- Fotografii (dovada informativa la receptii/livrari) ----
const photoFields = {};

// Extensii de imagine acceptate (unele telefoane Android nu setează deloc tipul MIME).
// Se potrivesc cu ce știe serverul să valideze prin sniff (JPEG/PNG/WEBP/HEIC/HEIF).
const IMG_EXT_RE = /\.(jpe?g|png|webp|heic|heif)$/i;

// Un fisier arata a poza daca: MIME image/*, SAU tip gol (Android nu-l pune, dar input-ul e accept="image/*"),
// SAU extensia e de imagine. Serverul verifica oricum octetii reali (sniff), deci nu acceptam gunoi.
function looksLikeImage(f) {
  if (!f) return false;
  if (f.type && f.type.startsWith("image/")) return true;
  if (!f.type) return true;
  return IMG_EXT_RE.test(f.name || "");
}

// Deseneaza o sursa (bitmap sau <img>) pe canvas, redimensionata la max 1280px, si o da ca JPEG 0.7.
function drawToJpeg(source, srcW, srcH) {
  const maxDim = 1280;
  let w = srcW;
  let h = srcH;
  if (w > maxDim || h > maxDim) {
    const s = maxDim / Math.max(w, h);
    w = Math.round(w * s);
    h = Math.round(h * s);
  }
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  canvas.getContext("2d").drawImage(source, 0, 0, w, h);
  return new Promise((res) => canvas.toBlob(res, "image/jpeg", 0.7));
}

// Comprima o imagine la max ~1280px / JPEG 0.7 inainte de upload (rapid pe date mobile).
// 3 incercari: createImageBitmap -> <img> -> (daca nu se poate, ex. HEIC pe Chrome) urca originalul.
async function compressImage(file) {
  if (!file) return file;
  // 1) rapid, cand formatul e suportat
  try {
    const bitmap = await createImageBitmap(file);
    try {
      const blob = await drawToJpeg(bitmap, bitmap.width, bitmap.height);
      if (blob) return blob;
    } finally {
      if (bitmap.close) bitmap.close();
    }
  } catch (_) {}
  // 2) fallback prin <img> (unele formate pe care createImageBitmap nu le accepta)
  try {
    const blob = await new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = async () => {
        try {
          const b = await drawToJpeg(img, img.naturalWidth || img.width, img.naturalHeight || img.height);
          URL.revokeObjectURL(url);
          resolve(b);
        } catch (e) {
          URL.revokeObjectURL(url);
          reject(e);
        }
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("decode"));
      };
      img.src = url;
    });
    if (blob) return blob;
  } catch (_) {}
  // 3) nu am putut converti (ex. HEIC pe Chrome): urcam originalul, serverul il accepta si stocheaza
  return file;
}

// Urca imagini -> array de cai stocate.
async function uploadPhotos(files) {
  const all = Array.from(files || []).filter(Boolean);
  const list = all.filter(looksLikeImage);
  if (!list.length) {
    if (all.length) throw new Error("Fisierul selectat nu pare o poza. Incearca din nou, direct din camera.");
    return [];
  }
  const fd = new FormData();
  for (const f of list) {
    const blob = await compressImage(f);
    const name = blob && blob.type === "image/jpeg"
      ? (f.name || "poza").replace(/\.[^.]+$/, "") + ".jpg"
      : (f.name || "poza.jpg");
    fd.append("photos", blob, name);
  }
  const res = await fetch("/api/uploads", { method: "POST", body: fd });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Nu am putut incarca pozele.");
  }
  const data = await res.json().catch(() => ({}));
  return Array.isArray(data.paths) ? data.paths : [];
}

function photoUrl(p) {
  const pathStr = typeof p === "string" ? p : (p && p.path) || "";
  return `/api/photos?path=${encodeURIComponent(pathStr)}`;
}

function renderPhotoThumbs(previewEl, paths) {
  if (!previewEl) return;
  previewEl.innerHTML = (paths || [])
    .map((p, i) => `
      <span class="photo-thumb">
        <a href="${photoUrl(p)}" target="_blank" rel="noopener"><img src="${photoUrl(p)}" alt="poza" loading="lazy" /></a>
        <button type="button" class="photo-thumb-x" data-i="${i}" title="Sterge">×</button>
      </span>`)
    .join("");
}

// Leaga un input foto de o zona de previzualizare; pastreaza caile in photoFields[inputId].paths.
function setupPhotoField(inputId, previewId, kind) {
  const input = document.getElementById(inputId);
  const preview = document.getElementById(previewId);
  if (!input || !preview) return null;
  const state = { paths: [], preview, kind: kind || "altul" };
  photoFields[inputId] = state;
  input.addEventListener("change", async () => {
    if (!input.files || !input.files.length) return;
    input.disabled = true;
    try {
      const added = await uploadPhotos(input.files);
      state.paths.push(...added);
      renderPhotoThumbs(preview, state.paths);
    } catch (e) {
      window.alert(e.message || "Eroare la incarcarea pozelor.");
    } finally {
      input.disabled = false;
      input.value = "";
    }
  });
  preview.addEventListener("click", (e) => {
    const x = e.target.closest(".photo-thumb-x");
    if (!x) return;
    state.paths.splice(Number(x.dataset.i), 1);
    renderPhotoThumbs(preview, state.paths);
  });
  return state;
}

function photoPathsFor(inputId) {
  const state = photoFields[inputId];
  if (!state) return [];
  return state.paths.map((p) => ({
    path: typeof p === "string" ? p : (p && p.path) || "",
    kind: state.kind
  }));
}

// Aduna pozele din mai multe sloturi (fiecare cu kind-ul lui: brut/neto/masina).
function gatherPhotos(...inputIds) {
  return inputIds.flatMap((id) => photoPathsFor(id));
}

function resetPhotoField(inputId) {
  const state = photoFields[inputId];
  if (!state) return;
  state.paths = [];
  renderPhotoThumbs(state.preview, []);
}

// Strip mic de thumbnails pentru tabelele „recente".
function photosMini(photos) {
  if (!Array.isArray(photos) || !photos.length) return "";
  const thumbs = photos
    .slice(0, 3)
    .map((ph) => `<a href="${photoUrl(ph)}" target="_blank" rel="noopener" class="photo-mini"><img src="${photoUrl(ph)}" alt="poza" loading="lazy" /></a>`)
    .join("");
  const extra = photos.length > 3 ? `<span class="photo-more">+${photos.length - 3}</span>` : "";
  return ` <span class="photos-mini">${thumbs}${extra}</span>`;
}

setupPhotoField("receipt-photo-brut", "receipt-photo-brut-preview", "brut");
setupPhotoField("receipt-photo-masina", "receipt-photo-masina-preview", "masina");
setupPhotoField("receipt-photo-neto", "receipt-photo-neto-preview", "neto");
setupPhotoField("delivery-photo-brut", "delivery-photo-brut-preview", "brut");
setupPhotoField("delivery-photo-neto", "delivery-photo-neto-preview", "neto");
setupPhotoField("delivery-photo-masina", "delivery-photo-masina-preview", "masina");
setupPhotoField("complete-neto-photo", "complete-neto-photo-preview", "neto");

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

  // Memorăm view-ul curent pentru alerta de procesare (OP-1)
  currentActiveView = view;
  if (typeof checkEndOfDayProcessing === "function") {
    checkEndOfDayProcessing();
  }

  // La deschiderea paginii „Documente de tipar", populăm selectoarele cu datele curente.
  if (view === "documente" && typeof fillPrintDocPanel === "function") {
    fillPrintDocPanel();
  }
  // Selectoarele „Firmă pe documente/antet" (Livrări + Act de verificare) — populate cu companiile curente.
  if (typeof fillHeaderCompanySelects === "function") {
    fillHeaderCompanySelects();
  }

  try {
    window.localStorage.setItem("active-view", view);
  } catch (_err) {
    // localStorage blocked — ignore
  }
}

let currentActiveView = "acasa";

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
  // Cantitate = stocul curent la momentul de fata (nu suma istorica a receptiilor).
  setDashText("dash-value-quantity", formatNumber(stats.stockTotal ?? stats.totalQuantity ?? 0));
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
          <td>${formatNumber(Math.round(Number(item.quantity || 0) * 1000))} kg (${formatNumber(Number(item.quantity || 0))} t)</td>
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

// Lista documentelor de sold inițial salvate (admin) — cu ștergere, pentru a corecta intrări greșite.
function renderOpeningDocsList() {
  const body = document.getElementById("opening-docs-list-body");
  if (!body) return;
  const docs = openingDocumentsCache || [];
  if (!docs.length) {
    body.innerHTML = `<tr><td colspan="4" class="rd-empty">Niciun document.</td></tr>`;
    return;
  }
  body.innerHTML = docs
    .map((doc) => {
      const stocuri = (doc.stockItems || [])
        .map((s) => `${escapeComboHtml(s.product)} @ ${escapeComboHtml(s.location)}: ${formatNumber(Math.round(Number(s.quantity || 0) * 1000))} kg`)
        .join("<br>");
      const datorii = (doc.debtItems || [])
        .map((d) => `${escapeComboHtml(d.partner || "")}: ${currency.format(Number(d.amount || 0))} (${d.direction === "collection" ? "încasare" : "plată"})`)
        .join("<br>");
      const continut = [stocuri, datorii].filter(Boolean).join("<br>") || "—";
      return `
        <tr>
          <td>#${doc.id}</td>
          <td>${formatDateShort(doc.documentDate || doc.createdAt)}</td>
          <td>${continut}</td>
          <td><button type="button" class="cell-btn cell-btn-danger" data-action="delete-opening" data-id="${doc.id}">Șterge</button></td>
        </tr>
      `;
    })
    .join("");
}

document.getElementById("opening-docs-list-body")?.addEventListener("click", async (event) => {
  const btn = event.target.closest('[data-action="delete-opening"]');
  if (!btn) return;
  if (!window.confirm("Sigur ștergi acest document de sold inițial? Stocul se recalculează.")) return;
  try {
    const res = await fetch(`/api/opening-documents/${btn.dataset.id}`, { method: "DELETE" });
    if (!res.ok) {
      const e = await res.json().catch(() => ({}));
      throw new Error(e.error || "Nu am putut șterge documentul.");
    }
    await Promise.all([loadOpeningDocuments(), loadReceipts(), loadStocks()]);
  } catch (e) {
    window.alert(e.message);
  }
});

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
  if (stats.audit) {
    setDashText("dash-meta-modifications", formatNumber(stats.audit.recentAuditLogs || 0));
  }
  // Lenta de activitate se afiseaza si pentru rolurile fara audit (ex: operator).
  renderDashFeed();
}

// Activitate din ultimele 24h construita din datele pe care le vede utilizatorul
// (receptii / procesari / livrari). Folosita cand nu exista jurnal de audit (ex: operator).
function buildRecentActivity() {
  const cutoff = Date.now() - 24 * 60 * 60 * 1000;
  const within = (d) => {
    const t = Date.parse(d || "");
    return !Number.isNaN(t) && t >= cutoff;
  };
  const events = [];
  (Array.isArray(receiptsCache) ? receiptsCache : []).forEach((r) => {
    if (!within(r.createdAt)) return;
    events.push({
      action: "create",
      entityType: "Recepție",
      entityId: r.id,
      reason: `Recepție · ${r.product || ""} ${formatQtyByEntry(r.provisionalNetQuantity || r.quantity, r)}`.trim(),
      createdAt: r.createdAt,
      user: r.supplier || r.receivedBy || ""
    });
  });
  (Array.isArray(processingsCache) ? processingsCache : []).forEach((p) => {
    if (!within(p.createdAt)) return;
    events.push({
      action: "update",
      entityType: "Procesare",
      entityId: p.id,
      reason: `Procesare · ${p.product || ""} ${p.processingType || ""}`.trim(),
      createdAt: p.createdAt,
      user: p.operator || ""
    });
  });
  (Array.isArray(deliveriesCache) ? deliveriesCache : []).forEach((d) => {
    if (!within(d.createdAt)) return;
    events.push({
      action: /anul/i.test(d.status || "") ? "cancel" : "create",
      entityType: "Livrare",
      entityId: d.id,
      reason: `Livrare · ${d.product || ""} (${d.status || ""})`.trim(),
      createdAt: d.createdAt,
      user: d.customer || ""
    });
  });
  return events
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);
}

// Render the activity feed in dashboard from audit logs cache
function renderDashFeed() {
  const body = document.getElementById("dash-feed-body");
  if (!body) return;
  let items = (Array.isArray(auditLogsCache) ? auditLogsCache : []).slice(0, 6);
  // Operatorul nu are acces la jurnalul de audit -> aratam activitatea reala din ultimele 24h.
  if (!items.length) items = buildRecentActivity();
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
            <div class="dash-feed-title">${escapeComboHtml(reason || `${entity}${entityId} · ${log.action || ""}`)}</div>
            <div class="dash-feed-meta">${when} · ${escapeComboHtml(user)}</div>
          </div>
        </div>
      `;
    })
    .join("");
}

function isSunflowerProduct(name) {
  return /floar/i.test(String(name || ""));
}

function getLocationCapacity(loc) {
  // O singura capacitate pe locatie, stocata in KG in nomenclator -> o intoarcem in TONE
  // (÷1000) ca sa se potriveasca cu stocul (tinut intern in tone).
  return Number(loc?.capacity || 0) / 1000;
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

  const activeLocs = (currentConfig?.storageLocations || [])
    .filter((loc) => loc.active !== false)
    .sort((a, b) => Number(a.id) - Number(b.id));
  const cylinders = activeLocs.filter((loc) => String(loc.type || "").toLowerCase() === "cilindru");
  // Rândul 2: restul locațiilor active (gropi de primire etc.).
  const pits = activeLocs.filter((loc) => String(loc.type || "").toLowerCase() !== "cilindru");

  // „Cilindru 7" — îl căutăm după NUME în TOATE locațiile active (poate fi configurat cu alt tip
  // decât „cilindru", ex. groapă). Stă primul pe rândul 2, dar NU se micșorează ca gropile propriu-zise.
  const c7 = activeLocs.find((c) => {
    const n = String(c.name || "").toLowerCase();
    return n.includes("cilindru") && /(^|\D)0*7(\D|$)/.test(n);
  });

  // Header dinamic (reflectă numărul real de cilindri + capacitatea totală)
  const titleEl = document.getElementById("silos-title");
  const subEl = document.getElementById("silos-sub");
  if (titleEl && subEl) {
    const n = cylinders.length;
    const totalCap = cylinders.reduce((s, c) => s + Number(c.capacity || 0), 0) / 1000;
    titleEl.textContent = `${n} ${n === 1 ? "cilindru" : "cilindri"} · ${formatNumber(totalCap)} t`;
    subEl.textContent = `Capacitate totală ${formatNumber(totalCap)} t`;
  }

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

  const siloCard = (cyl) => {
      const state = byLocation.get(cyl.name) || { items: [], total: 0 };
      const productList = state.items
        .filter((i) => Number(i.quantity || 0) > 0)
        .sort((a, b) => Number(b.quantity || 0) - Number(a.quantity || 0));
      const dominantProduct = (productList[0] || {}).product || "";
      const productsLabel = productList.map((i) => escapeComboHtml(i.product)).join(", ");
      const productsTooltip = productList.map((i) => `${escapeComboHtml(i.product)}: ${formatNumber(i.quantity)}t`).join(" · ");
      const capacity = getLocationCapacity(cyl, dominantProduct);
      const filled = Math.max(0, state.total);
      const pct = capacity > 0 ? Math.min(100, (filled / capacity) * 100) : 0;
      const pctDisplay = capacity > 0 ? (filled / capacity) * 100 : 0;
      const over = capacity > 0 && filled > capacity + 1e-6;
      const overBy = over ? filled - capacity : 0;
      const free = Math.max(capacity - filled, 0);
      const pctClass = over ? "is-over" : pct >= 95 ? "is-crit" : pct >= 80 ? "is-warn" : "";
      const palette = getProductPalette(dominantProduct);
      const fillH = Math.max(0, Math.min(120, (pct / 100) * 120));
      const fillY = 28 + (120 - fillH);
      const isEmpty = filled <= 0;
      const ringClass = over ? " is-over-ring" : pct >= 95 ? " is-crit-ring" : pct >= 80 ? " is-warn-ring" : "";
      const tonsLabel = filled.toFixed(3).replace(".", ",");
      const productHead = dominantProduct
        ? `<span class="silo-product" style="color:${palette.edge};" title="${productsTooltip}"><span class="silo-product-dot" style="background:${palette.fill};border-color:${palette.edge};"></span>${productsLabel}</span>`
        : '<span class="silo-product silo-product-empty">gol</span>';

      // Gropile de primire (orice locație care nu e cilindru) primesc un aspect distinct:
      // verzi (clasa silo-card--pit). Gropile propriu-zise (fără „Cilindru 7") sunt și mai mici, ~80%
      // (clasa silo-card--pit-sm). „Cilindru 7" rămâne la mărimea normală de groapă.
      const isPit = String(cyl.type || "").toLowerCase() !== "cilindru";
      const isSmallPit = isPit && cyl !== c7;
      return `
        <article class="silo-card${ringClass}${isPit ? " silo-card--pit" : ""}${isSmallPit ? " silo-card--pit-sm" : ""}" data-id="${escapeComboHtml(String(cyl.id))}" title="${escapeComboHtml(cyl.name)} · ${formatNumber(filled)}/${formatNumber(capacity)} t · ${productsTooltip || 'gol'}">
          <div class="silo-card-head">
            <span class="silo-name">${escapeComboHtml(cyl.name)}</span>
            ${productHead}
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
              <text x="50" y="${isEmpty ? 92 : Math.max(fillY + 14, 42)}" font-family="DM Mono, monospace" font-size="9" font-weight="700" text-anchor="middle" fill="${isEmpty ? '#0F3D27' : (pct >= 25 ? palette.label : '#0F3D27')}">${isEmpty ? '' : tonsLabel + ' t'}</text>
            </svg>
          </div>
          <div class="silo-stored-line">
            <span class="silo-stored-qty">${tonsLabel} t</span>
            <span class="silo-stored-pct ${pctClass}">${pctDisplay.toFixed(0)}%</span>
          </div>
          <div class="silo-meta">
            ${over
              ? `<span class="silo-over">⚠ Peste capacitate cu ${formatNumber(Number(overBy.toFixed(3)))} t</span>`
              : `<span>Liber <b>${formatNumber(free)}t</b></span>`}
          </div>
        </article>
      `;
  };
  // Randăm două grupuri: rândul 1 = cilindri, rândul 2 = gropi de primire (fiecare pe rândul lui).
  const group = (locs, label) => {
    if (!locs.length) return "";
    const head = label ? `<div class="silo-row-label">${label}</div>` : "";
    return `${head}<div class="silo-row" style="--cols:${Math.min(8, Math.max(1, locs.length))}">${locs.map(siloCard).join("")}</div>`;
  };
  // Rândul 2 începe cu „Cilindru 7" (detectat mai sus), apoi gropile de primire. Rândul 1 = ceilalți cilindri.
  const row1 = cylinders.filter((c) => c !== c7);
  const row2 = [...(c7 ? [c7] : []), ...pits.filter((p) => p !== c7)];
  silosGridEl.innerHTML = group(row1, "Cilindri") + group(row2, "");

  // Aggregate stock per product across all cylinders (Etapa 3)
  renderStockByProduct(data);
}

function renderStockByProduct(data) {
  const el = document.getElementById("stock-by-product");
  if (!el) return;

  // O linie per LOCAȚIE (produs + locație + cantitate), nu agregat pe produs.
  const items = (data.byLocation || [])
    .filter((i) => Number(i.quantity || 0) > 0 && String(i.product || "").trim())
    .sort((a, b) => {
      const locCmp = String(a.location || "").localeCompare(String(b.location || ""), "ro", { numeric: true });
      return locCmp !== 0 ? locCmp : Number(b.quantity || 0) - Number(a.quantity || 0);
    });
  const grandTotal = items.reduce((sum, i) => sum + Number(i.quantity || 0), 0);

  if (!items.length) {
    el.innerHTML = "";
    return;
  }

  const rows = items
    .map((i) => {
      const product = String(i.product || "").trim();
      const palette = getProductPalette(product);
      const qty = Number(i.quantity || 0);
      return `
        <tr>
          <td>${escapeComboHtml(i.location || "—")}</td>
          <td><span class="sbp-dot" style="background:${palette.fill};border-color:${palette.edge};"></span>${escapeComboHtml(product)}</td>
          <td>${formatNumber(qty)} t</td>
          <td>${formatNumber(qty * 1000)} kg</td>
        </tr>
      `;
    })
    .join("");

  el.innerHTML = `
    <div class="sbp-head">
      <h3>Stoc pe locație</h3>
      <span class="sbp-total">Total: <b>${formatNumber(grandTotal)} t</b> · ${formatNumber(grandTotal * 1000)} kg</span>
    </div>
    <div class="table-wrap">
      <table>
        <thead>
          <tr><th>Locație</th><th>Produs</th><th>Cantitate (t)</th><th>Cantitate (kg)</th></tr>
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
    .filter((item) => Number(item.quantity || 0) > 0)
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

  renderTransferStockTable(summary);
}

// Tabel stoc pe cilindru pentru pagina Transferuri (text, fara desene de cilindri).
function renderTransferStockTable(summary) {
  const el = document.getElementById("transfer-stock-body");
  if (!el) return;
  const data = summary || lastStockSummary || { byLocation: [] };
  const rows = (data.byLocation || [])
    .filter((i) => Number(i.quantity || 0) > 0)
    .sort((a, b) => String(a.location || "").localeCompare(String(b.location || ""), "ro", { numeric: true }))
    .map((i) => {
      const palette = getProductPalette(i.product);
      return `
        <tr>
          <td>${escapeComboHtml(i.location || "—")}</td>
          <td><span class="sbp-dot" style="background:${palette.fill};border-color:${palette.edge};"></span>${escapeComboHtml(i.product || "—")}</td>
          <td>${formatNumber(Number(i.quantity || 0))} t</td>
          <td>${formatNumber(Number(i.quantity || 0) * 1000)} kg</td>
        </tr>`;
    })
    .join("");
  el.innerHTML = rows || '<tr><td colspan="4">Niciun stoc.</td></tr>';
}

// Modul F: mișcarea stocului pe perioadă (stoc inițial / recepții / livrări / stoc final)
// Populează filtrul de produs al raportului de pierderi (o dată la încărcarea nomenclatorului).
function populateLossesProductFilter() {
  const el = document.getElementById("losses-product");
  if (!el) return;
  const prev = el.value;
  const prods = (currentConfig?.products || []).map((p) => p.name).filter(Boolean);
  el.innerHTML = '<option value="">Toate produsele</option>' +
    prods.map((p) => `<option value="${escapeComboHtml(p)}">${escapeComboHtml(p)}</option>`).join("");
  if (prev) el.value = prev;
}

// Raport „Activitate utilizatori" (doar admin): câți utilizatori sunt și cine are puțină/nicio
// mișcare, pe baza jurnalului de audit (auditLogsCache) + lista de utilizatori (currentConfig.users).
// Doar afișare/agregare client-side; nu scrie nimic.
function renderUserActivity() {
  const panel = document.getElementById("user-activity-panel");
  const body = document.getElementById("user-activity-body");
  const countEl = document.getElementById("user-activity-count");
  if (!panel || !body) return;
  // Activitatea utilizatorilor e sensibilă → doar admin vede panoul.
  // Golim ÎNTÂI conținutul (nu doar ascundem panoul): pe un terminal partajat, după logout-ul
  // adminului, un rol mai mic care intră pe Rapoarte nu trebuie să vadă nici o clipă tabelul vechi.
  const canSee = canAccess("security-admin");
  if (!canSee) {
    body.innerHTML = "";
    if (countEl) countEl.textContent = "";
    panel.hidden = true;
    return;
  }
  panel.hidden = false;

  const norm = (s) => String(s || "").trim().toLowerCase();
  const roleName = (code) =>
    (currentConfig?.roles || []).find((r) => r.code === code)?.name || code || "";
  const LOW = 5; // prag pentru „activitate redusă"
  const users = (currentConfig?.users || []).slice();
  const logs = Array.isArray(auditLogsCache) ? auditLogsCache : [];

  // Un singur pass peste jurnal: grupăm pe autor (normalizat) → {total, logins, ultimele date}.
  // Astfel randarea e O(loguri + utilizatori), nu O(utilizatori × loguri).
  const byAuthor = new Map();
  for (const e of logs) {
    const k = norm(e.user);
    let a = byAuthor.get(k);
    if (!a) { a = { total: 0, logins: 0, lastLogin: "", lastAction: "" }; byAuthor.set(k, a); }
    a.total += 1;
    if (e.createdAt > a.lastAction) a.lastAction = e.createdAt;
    if (e.action === "login-success") {
      a.logins += 1;
      if (e.createdAt > a.lastLogin) a.lastLogin = e.createdAt;
    }
  }
  const rows = users
    .map((u) => {
      // Jurnalul stochează autorul ca username (login) SAU ca nume (operații) → însumăm ambele chei.
      const keys = [norm(u.username), norm(u.name)].filter(Boolean);
      const seen = new Set();
      let total = 0, logins = 0, lastLogin = "", lastAction = "";
      for (const k of keys) {
        if (seen.has(k)) continue;
        seen.add(k);
        const a = byAuthor.get(k);
        if (!a) continue;
        total += a.total;
        logins += a.logins;
        if (a.lastAction > lastAction) lastAction = a.lastAction;
        if (a.lastLogin > lastLogin) lastLogin = a.lastLogin;
      }
      return {
        name: u.name || u.username || "-",
        role: roleName(u.roleCode),
        active: u.active !== false,
        logins,
        total,
        lastLogin,
        lastAction
      };
    })
    .sort((a, b) => a.total - b.total || String(a.name).localeCompare(String(b.name), "ro"));

  const noAct = rows.filter((r) => r.total === 0).length;
  const lowAct = rows.filter((r) => r.total > 0 && r.total < LOW).length;
  if (countEl) countEl.textContent = `(${rows.length} utilizatori · ${noAct} fără activitate · ${lowAct} activitate redusă)`;

  const fmt = (iso) => (iso ? String(iso).replace("T", " ").slice(0, 16) : "—");
  body.innerHTML = rows
    .map((r) => {
      let badge, style;
      if (r.total === 0) { badge = "Fără activitate"; style = "color:#b42318;background:#fee4e2"; }
      else if (r.total < LOW) { badge = "Activitate redusă"; style = "color:#8a6d00;background:#fff6d6"; }
      else { badge = "Activ"; style = "color:#0a7d33;background:#e6f4ea"; }
      return `
        <tr>
          <td>${escapeComboHtml(r.name)}${r.active ? "" : ' <span style="color:#b42318">(dezactivat)</span>'}</td>
          <td>${escapeComboHtml(r.role)}</td>
          <td>${r.logins}</td>
          <td>${r.total}</td>
          <td>${fmt(r.lastLogin)}</td>
          <td>${fmt(r.lastAction)}</td>
          <td><span style="padding:2px 8px;border-radius:10px;font-size:12px;${style}">${badge}</span></td>
        </tr>`;
    })
    .join("");
}

// Raport „pierderi cantitative" pe produs: primit → procesare → livrat, cu diferența necontabilizată.
// Doar afișare (agregă recepții/procesări/livrări existente); nu atinge stocul/financiarul.
function renderLossesReport() {
  const body = document.getElementById("losses-report-body");
  const foot = document.getElementById("losses-report-foot");
  if (!body) return;
  const from = (document.getElementById("losses-from") || {}).value || "";
  const to = (document.getElementById("losses-to") || {}).value || "";
  const prodFilter = (document.getElementById("losses-product") || {}).value || "";
  const inRange = (iso) => printDocInRange(iso, from, to);

  const byProduct = new Map();
  const bucket = (p) => {
    const key = p || "—";
    if (!byProduct.has(key)) byProduct.set(key, { received: 0, waterRecv: 0, waste: 0, waterDry: 0, delivered: 0, waterDeliv: 0 });
    return byProduct.get(key);
  };

  // Câmpul de dată prioritar = `createdAt` (ca ecranele Recepții/Procesări/Livrări), ca raportul
  // să se reconcilieze cu ele; fallback pe data reală a operației.
  (receiptsCache || []).forEach((r) => {
    if (r.status === "Anulat" || (prodFilter && r.product !== prodFilter) || !inRange(r.createdAt || r.receivedAt)) return;
    const g = bucket(r.product);
    g.received += Number(r.provisionalNetQuantity || r.quantity || 0);
    g.waterRecv += Number(r.estimatedWaterLoss || 0);
  });
  (processingsCache || []).forEach((p) => {
    if (p.status === "Anulat" || (prodFilter && p.product !== prodFilter) || !inRange(p.createdAt || p.processedAt)) return;
    const g = bucket(p.product);
    g.waste += Number(p.confirmedWaste || 0);
    g.waterDry += Number(p.waterRemoved || 0);
  });
  const humIdx = buildReceiptHumidityIndex();
  (deliveriesCache || []).forEach((d) => {
    if (d.status === "Anulat" || (prodFilter && d.product !== prodFilter) || !inRange(d.createdAt || d.deliveredAt)) return;
    const g = bucket(d.product);
    g.delivered += deliveryDisplayQuantity(d);
    const w = deliveryWaterKg(d, humIdx);
    if (w !== null) g.waterDeliv += w / 1000; // kg -> tone
  });

  const rows = Array.from(byProduct.entries()).sort((a, b) => String(a[0]).localeCompare(String(b[0]), "ro"));
  if (!rows.length) {
    body.innerHTML = '<tr><td colspan="8" class="empty-state">Fără date pentru filtrul ales.</td></tr>';
    if (foot) foot.innerHTML = "";
    return;
  }
  const tot = { received: 0, waterRecv: 0, waste: 0, waterDry: 0, delivered: 0, waterDeliv: 0, diff: 0 };
  body.innerHTML = rows
    .map(([prod, g]) => {
      const diff = g.received - g.waste - g.waterDry - g.delivered;
      tot.received += g.received; tot.waterRecv += g.waterRecv; tot.waste += g.waste;
      tot.waterDry += g.waterDry; tot.delivered += g.delivered; tot.waterDeliv += g.waterDeliv; tot.diff += diff;
      return `<tr>
        <td>${escapeComboHtml(prod)}</td>
        <td>${formatNumber(g.received)}</td>
        <td>${formatNumber(g.waterRecv)}</td>
        <td>${formatNumber(g.waste)}</td>
        <td>${formatNumber(g.waterDry)}</td>
        <td>${formatNumber(g.delivered)}</td>
        <td>${formatNumber(g.waterDeliv)}</td>
        <td><b>${formatNumber(diff)}</b></td>
      </tr>`;
    })
    .join("");
  if (foot) {
    foot.innerHTML = `<tr class="totals-row">
      <td>TOTAL</td>
      <td>${formatNumber(tot.received)}</td>
      <td>${formatNumber(tot.waterRecv)}</td>
      <td>${formatNumber(tot.waste)}</td>
      <td>${formatNumber(tot.waterDry)}</td>
      <td>${formatNumber(tot.delivered)}</td>
      <td>${formatNumber(tot.waterDeliv)}</td>
      <td><b>${formatNumber(tot.diff)}</b></td>
    </tr>`;
  }
}

// Raport „Roadă pe câmp" — grupează recepțiile (cu câmp completat) pe câmp, în perioada aleasă.
function renderFieldYield() {
  const body = document.getElementById("field-yield-body");
  const foot = document.getElementById("field-yield-foot");
  if (!body) return;
  const from = (document.getElementById("field-yield-from") || {}).value || "";
  const to = (document.getElementById("field-yield-to") || {}).value || "";
  const inRange = (iso) => printDocInRange(iso, from, to);
  const byField = new Map();
  (receiptsCache || []).forEach((r) => {
    if (r.status === "Anulat" || !r.fieldName || !inRange(r.createdAt || r.receivedAt)) return;
    const key = r.fieldName;
    if (!byField.has(key)) byField.set(key, { qty: 0, byProduct: new Map() });
    const g = byField.get(key);
    const q = Number(r.provisionalNetQuantity || r.quantity || 0);
    g.qty += q;
    const pk = r.product || "—";
    g.byProduct.set(pk, (g.byProduct.get(pk) || 0) + q);
  });
  const rows = Array.from(byField.entries()).sort((a, b) => String(a[0]).localeCompare(String(b[0]), "ro"));
  if (!rows.length) {
    body.innerHTML = '<tr><td colspan="4" class="empty-state">Fără recepții cu câmp pentru filtrul ales.</td></tr>';
    if (foot) foot.innerHTML = "";
    return;
  }
  let total = 0;
  body.innerHTML = rows.map(([name, g]) => {
    total += g.qty;
    const field = (currentConfig?.fields || []).find((f) => f.name === name);
    const ha = field && Number(field.area) > 0 ? Number(field.area) : 0;
    const perHa = ha > 0 ? Math.round((g.qty * 1000) / ha) : null;
    const products = Array.from(g.byProduct.entries())
      .map(([p, q]) => `${escapeComboHtml(p)}: ${formatNumber(q)} t`).join(", ");
    return `<tr>
      <td>${escapeComboHtml(name)}</td>
      <td>${products}</td>
      <td>${formatNumber(g.qty)}</td>
      <td>${ha > 0 ? formatNumber(ha) + " ha · " + formatNumber(perHa) + " kg/ha" : "—"}</td>
    </tr>`;
  }).join("");
  if (foot) foot.innerHTML = `<tr class="totals-row"><td>TOTAL</td><td></td><td><b>${formatNumber(total)}</b></td><td></td></tr>`;
}

// Tipărește un tabel de raport EXACT cum e afișat (cu filtrele aplicate). Butoane: .table-print-btn.
function printReportTable(tableId, title) {
  const table = document.getElementById(tableId);
  if (!table) return;
  const html = `<div class="doc-title">${escapeComboHtml(title || "Raport")}</div>
    <div class="doc-subtitle">Tipărit: ${new Date().toLocaleString("ro-RO")}</div>
    <table class="doc-table">${table.innerHTML}</table>`;
  openPrintWindow(html, title || "Raport");
}
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".table-print-btn");
  if (!btn) return;
  printReportTable(btn.dataset.table, btn.dataset.title || "Raport");
});

function renderStockPeriod() {
  const body = document.getElementById("stock-period-body");
  if (!body) return;
  const fromEl = document.getElementById("stock-period-from");
  const toEl = document.getElementById("stock-period-to");
  const from = fromEl && fromEl.value ? fromEl.value : "";
  const to = toEl && toEl.value ? toEl.value : "";

  const dayOf = (iso) => String(iso || "").slice(0, 10);
  const products = new Set();

  // Opening stock (counts as stoc inițial, always before any period).
  // Sursa: summary-ul de stoc (openingByProduct), independent de rol — astfel „stoc inițial"
  // apare la TOȚI cei cu drept de stoc (inclusiv operatorul). Nu folosim openingDocumentsCache,
  // care e gol pentru cine nu are opening-read (financiar).
  const opening = {};
  const openingByProduct = (lastStockSummary && lastStockSummary.openingByProduct) || {};
  Object.keys(openingByProduct).forEach((p) => {
    products.add(p);
    opening[p] = (opening[p] || 0) + Number(openingByProduct[p] || 0);
  });

  const inPeriod = (day) => (!from || day >= from) && (!to || day <= to);
  const recBefore = {}, recIn = {};
  const procBefore = {}, procIn = {};
  const delBefore = {}, delIn = {};
  const bucket = (beforeObj, inObj, p, day, qty) => {
    if (!(qty > 0)) return;
    if (from && day < from) beforeObj[p] = (beforeObj[p] || 0) + qty;
    else if (inPeriod(day)) inObj[p] = (inObj[p] || 0) + qty;
  };

  // Receptii (cantitate bruta de intrare) + pierderi de la procesarile vechi (receptie procesata)
  (receiptsCache || []).forEach((r) => {
    if (r.status === "Anulat") return;
    const p = r.product || "—";
    products.add(p);
    const provNet = Number(r.provisionalNetQuantity || r.quantity || 0);
    const day = dayOf(r.createdAt || r.receivedAt);
    bucket(recBefore, recIn, p, day, provNet);
    const finalNet = r.finalNetQuantity != null ? Number(r.finalNetQuantity) : provNet;
    bucket(procBefore, procIn, p, day, Math.max(provNet - finalNet, 0));
  });

  // Livrari: doar ce a iesit REAL din stoc (deliveredQuantity = statut Livrat),
  // ca sa coincida cu stocul real.
  (deliveriesCache || []).forEach((d) => {
    if (d.status === "Anulat") return;
    const p = d.product || "—";
    products.add(p);
    bucket(delBefore, delIn, p, dayOf(d.deliveredAt || d.createdAt), Number(d.deliveredQuantity || 0));
  });

  // Pierderi la procesarile noi (model miscare): intrare − iesire = deseu + apa.
  (processingsCache || []).forEach((pr) => {
    if (!pr || pr.movement !== true) return;
    if (pr.status === "Anulat" || pr.status === "In lucru") return;
    const p = pr.product || "—";
    products.add(p);
    const loss = Math.max(Number(pr.processedQuantity || 0) - Number(pr.outputQuantity ?? pr.finalNetQuantity ?? 0), 0);
    bucket(procBefore, procIn, p, dayOf(pr.createdAt), loss);
  });

  const prodFilterEl = document.getElementById("stock-period-product");
  const prodFilter = prodFilterEl ? prodFilterEl.value : "";
  const rows = Array.from(products)
    .filter((p) => !prodFilter || p === prodFilter)
    .sort((a, b) => String(a).localeCompare(String(b), "ro"));
  if (!rows.length) {
    body.innerHTML = '<tr><td colspan="6" class="empty-state">Nu există date pentru perioada aleasă.</td></tr>';
    return;
  }
  let tInit = 0, tRec = 0, tProc = 0, tDel = 0, tFin = 0;
  body.innerHTML = rows.map((p) => {
    const init = (opening[p] || 0) + (recBefore[p] || 0) - (delBefore[p] || 0) - (procBefore[p] || 0);
    const rec = recIn[p] || 0;
    const proc = procIn[p] || 0;
    const del = delIn[p] || 0;
    const fin = init + rec - proc - del;
    tInit += init; tRec += rec; tProc += proc; tDel += del; tFin += fin;
    return `<tr>
      <td>${p}</td>
      <td>${formatNumber(init)}</td>
      <td>${formatNumber(rec)}</td>
      <td>${formatNumber(proc)}</td>
      <td>${formatNumber(del)}</td>
      <td><b>${formatNumber(fin)}</b></td>
    </tr>`;
  }).join("") + `
    <tr class="totals-row">
      <td>TOTAL</td>
      <td>${formatNumber(tInit)}</td>
      <td>${formatNumber(tRec)}</td>
      <td>${formatNumber(tProc)}</td>
      <td>${formatNumber(tDel)}</td>
      <td>${formatNumber(tFin)}</td>
    </tr>`;
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

function statusOptions(current, allowCancel = canCancelDocuments()) {
  // „Anulat" apare doar pentru cine poate anula (admin). Pastram „Anulat" daca documentul
  // e deja anulat, ca sa nu se piarda valoarea curenta din select.
  return ["Draft", "Confirmat", "Procesata", "Inchis", "Anulat", "Redeschis", "Noua", "Verificata", "Finalizata"]
    .filter((status) => status !== "Anulat" || allowCancel || current === "Anulat")
    .map((status) => {
      const selected = current === status ? "selected" : "";
      return `<option value="${status}" ${selected}>${bi(status)}</option>`;
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
  const canEditAmount = canAccess("finance-write");
  // Operatorul nu vede coloanele de plata (plata preliminara, data platii).
  const receiptsTable = document.getElementById("receipts-table");
  if (receiptsTable) {
    receiptsTable.classList.toggle("hide-fin", !canAccess("finance"));
  }
  // Populează filtrul de furnizori (fiecare o singură dată, fără duplicate)
  if (receiptSupplierFilterEl) {
    const sups = Array.from(new Set(receipts.map((r) => r.supplier).filter(Boolean))).sort((a, b) =>
      String(a).localeCompare(String(b), "ro")
    );
    const prevSup = receiptSupplierFilterEl.value;
    receiptSupplierFilterEl.innerHTML =
      '<option value="">Toti furnizorii</option>' +
      sups.map((s) => `<option value="${s}">${s}</option>`).join("");
    if (prevSup) receiptSupplierFilterEl.value = prevSup;
  }
  const payFilter = receiptPaymentFilterEl ? receiptPaymentFilterEl.value : "";
  const supplierFilter = receiptSupplierFilterEl ? receiptSupplierFilterEl.value : "";
  const filteredReceipts = receipts.filter((item) => {
    const statusMatch = !receiptStatusFilterEl.value || item.status === receiptStatusFilterEl.value;
    const productMatch = !receiptProductFilterEl.value || item.product === receiptProductFilterEl.value;
    const supplierMatch = !supplierFilter || item.supplier === supplierFilter;
    const dateMatch = withinDateRange(item, ["createdAt", "receivedAt"], receiptDateFromEl, receiptDateToEl);
    let payMatch = true;
    if (payFilter === "restanta") payMatch = item.paymentStatus !== "Achitat";
    else if (payFilter) payMatch = item.paymentStatus === payFilter;
    // Anulat receipts don't owe money — hide them from payment filters
    if (payFilter && item.status === "Anulat") payMatch = false;
    return statusMatch && productMatch && supplierMatch && dateMatch && payMatch && canViewCanceled(item);
  });

  bodyEl.innerHTML = filteredReceipts
    .map((item) => {
      const valoare = Number(item.amountToPay ?? item.preliminaryPayableAmount ?? 0);
      const achitat = Number(item.paidAmount || 0);
      const rest = Number(item.soldRestant ?? Math.max(valoare - achitat, 0));
      const isCanceled = item.status === "Anulat";
      const payBadge = isCanceled
        ? '<span class="pay-badge pay-anulat">—</span>'
        : paymentBadge(item.paymentStatus);
      const canPay = canAccess("finance") && !isCanceled && rest > 0;
      // Cantar in 2 pasi: recepțiile „In descarcare" apar in lista, dar READ-ONLY (badge in loc de select,
      // cantitatea inca necunoscuta) — se finalizeaza din panoul „Recepții în descărcare".
      const isPendingWeighing = item.status === "In descarcare";
      const qtyCell = isPendingWeighing
        ? "—"
        : formatQtyByEntry(item.provisionalNetQuantity || item.quantity, item);
      const statusCell = isPendingWeighing
        ? `<span class="status-badge badge-warn" title="Așteaptă a doua cântărire (tara)">În descărcare</span>`
        : `<select class="status" data-id="${item.id}" ${(CONFIRMED_PLUS.includes(item.status) ? canEditConfirmedStatus() : canEditStatuses) ? "" : "disabled"}>${statusOptions(item.status).join("")}</select>`;
      const actionCell = isPendingWeighing
        ? "—"
        : canPay
          ? `<button type="button" class="cell-btn cell-btn-primary achita-btn" data-achita="${item.id}">Achită</button>`
          : "-";
      return `
        <tr class="${isPendingWeighing ? "row-pending" : ""}">
          <td>#${item.id}</td>
          <td>${formatDateShort(item.createdAt || item.receivedAt)}</td>
          <td class="supplier-cell" data-id="${item.id}">
            <span class="supplier-name">${item.supplier}</span>
            ${canChangeSupplier ? `<button type="button" class="cell-btn change-supplier-btn" data-action="change-supplier" data-id="${item.id}" title="Schimbă furnizorul">✎</button>` : ""}
          </td>
          <td>${item.product}${photosMini(item.photos)}</td>
          <td>${qtyCell}</td>
          <td title="Apă eliminată la recepție (din umiditatea în exces)">${isPendingWeighing || !(Number(item.estimatedWaterLoss) > 0) ? "—" : formatNumber(Math.round(Number(item.estimatedWaterLoss) * 1000)) + " kg"}</td>
          <td>${item.grossWeight > 0 ? formatNumber(Number(item.grossWeight)) + " kg" : "—"}</td>
          <td>${item.tareWeight > 0 ? formatNumber(Number(item.tareWeight)) + " kg" : "—"}</td>
          <td>${item.location || "-"}</td>
          <td class="col-fin">${currency.format(valoare)}${canEditAmount && !isCanceled ? ` <button type="button" class="cell-btn change-amount-btn" data-action="adjust-amount" data-id="${item.id}" title="Ajustează valoarea recepției">✎</button>` : ""}</td>
          <td class="col-fin">${achitat > 0 ? currency.format(achitat) : "-"}</td>
          <td class="col-fin"><b>${rest > 0 ? currency.format(rest) : "0"}</b></td>
          <td class="col-fin">${formatDateShort(item.lastPaymentDate)}</td>
          <td class="col-fin">${payBadge}</td>
          <td>${statusCell}</td>
          <td><button type="button" class="cell-btn cell-btn-details" data-action="receipt-details" data-id="${item.id}">Detalii</button> ${docActionsCell("receipt", item)}</td>
          <td class="col-fin">${actionCell}</td>
        </tr>
      `;
    })
    .join("");

  // Totals footer (grouped by product)
  if (receiptsFootEl) {
    renderReceiptTotals(filteredReceipts);
  }

  renderPendingWeighing(receipts);
  renderCloseDayStatus();
}

// Receptii in descarcare (cantar in 2 pasi): brut introdus, asteapta tara.
function renderPendingWeighing(receipts) {
  if (!pendingWeighingBody || !pendingWeighingPanel) {
    return;
  }
  const pending = (receipts || []).filter((item) => item.status === "In descarcare");
  if (pendingWeighingCount) {
    pendingWeighingCount.textContent = pending.length ? String(pending.length) : "";
  }
  pendingWeighingPanel.hidden = pending.length === 0;
  pendingWeighingBody.innerHTML = pending
    .map(
      (item) => `
        <tr>
          <td>#${item.id}</td>
          <td>${item.vehicle ? escapeComboHtml(item.vehicle) : "—"}</td>
          <td>${item.supplier ? escapeComboHtml(item.supplier) : "—"}</td>
          <td>${escapeComboHtml(item.product || "")}</td>
          <td>${formatNumber(Number(item.grossWeight || 0))} kg</td>
          <td>
            <button type="button" class="cell-btn cell-btn-primary" data-action="complete-weighing" data-id="${item.id}" data-gross="${Number(item.grossWeight || 0)}">Completează tara</button>
            <button type="button" class="cell-btn cell-btn-details" data-action="receipt-details" data-id="${item.id}">Detalii</button>
          </td>
        </tr>
      `
    )
    .join("");
}

async function handleCompleteWeighing(id, grossWeight) {
  const input = window.prompt(
    `Tara (kg) — masa camionului gol.\nMasă brută = ${formatNumber(Number(grossWeight || 0))} kg.`
  );
  if (input === null) {
    return;
  }
  const tareWeight = Number(String(input).replace(",", ".").trim());
  if (!(tareWeight > 0)) {
    window.alert("Tara trebuie să fie un număr mai mare ca zero.");
    return;
  }
  if (tareWeight >= Number(grossWeight || 0)) {
    window.alert("Tara trebuie să fie mai mică decât masa brută.");
    return;
  }
  try {
    const response = await fetch(`/api/receipts/${id}/complete-weighing`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tareWeight })
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || "Nu am putut finaliza cântărirea.");
    }
    // Afisare optimista (ca la creare): folosim recepatia finalizata din raspuns, ca sa apara
    // instant ca finalizata in "Receptii recente" si sa iasa din "in descarcare", fara refresh.
    const updated = await response.json().catch(() => null);
    if (updated && updated.id) {
      receiptsCache = (Array.isArray(receiptsCache) ? receiptsCache : []).map(
        (r) => (r.id === updated.id ? updated : r)
      );
      renderReceipts(receiptsCache);
      if (typeof renderPendingWeighing === "function") renderPendingWeighing(receiptsCache);
    }
    await Promise.all([loadStocks(), loadDailyReport()]);
  } catch (error) {
    window.alert(error.message);
  }
}

// A doua cantarire: formular mic (tara + poza neto) in loc de window.prompt.
let completeWeighingCtx = null;
function openCompleteWeighing(id, grossWeight) {
  if (!completeWeighingForm) {
    return handleCompleteWeighing(id, grossWeight);
  }
  completeWeighingCtx = { id, gross: Number(grossWeight || 0) };
  if (completeWeighingTitle) {
    completeWeighingTitle.textContent = `Recepție #${id} · brut ${formatNumber(Number(grossWeight || 0))} kg`;
  }
  if (completeTareInput) completeTareInput.value = "";
  resetPhotoField("complete-neto-photo");
  completeWeighingForm.hidden = false;
  if (completeTareInput) completeTareInput.focus();
}
function closeCompleteWeighing() {
  completeWeighingCtx = null;
  if (completeWeighingForm) completeWeighingForm.hidden = true;
  resetPhotoField("complete-neto-photo");
}
async function submitCompleteWeighing() {
  if (!completeWeighingCtx) return;
  const { id, gross } = completeWeighingCtx;
  const tareWeight = Number(String(completeTareInput ? completeTareInput.value : "").replace(",", ".").trim());
  if (!(tareWeight > 0)) {
    window.alert("Tara trebuie să fie un număr mai mare ca zero.");
    return;
  }
  if (tareWeight >= gross) {
    window.alert("Tara trebuie să fie mai mică decât masa brută.");
    return;
  }
  try {
    const response = await fetch(`/api/receipts/${id}/complete-weighing`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tareWeight, photos: gatherPhotos("complete-neto-photo") })
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || "Nu am putut finaliza cântărirea.");
    }
    const updated = await response.json().catch(() => null);
    if (updated && updated.id) {
      receiptsCache = (Array.isArray(receiptsCache) ? receiptsCache : []).map(
        (r) => (r.id === updated.id ? updated : r)
      );
      renderReceipts(receiptsCache);
      if (typeof renderPendingWeighing === "function") renderPendingWeighing(receiptsCache);
    }
    await Promise.all([loadStocks(), loadDailyReport()]);
    closeCompleteWeighing();
  } catch (error) {
    window.alert(error.message);
  }
}

if (completeWeighingForm) {
  completeWeighingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    submitCompleteWeighing();
  });
}
if (completeWeighingCancel) {
  completeWeighingCancel.addEventListener("click", () => closeCompleteWeighing());
}

if (pendingWeighingBody) {
  pendingWeighingBody.addEventListener("click", (event) => {
    const btn = event.target.closest('[data-action="complete-weighing"]');
    if (!btn) {
      return;
    }
    openCompleteWeighing(btn.dataset.id, Number(btn.dataset.gross || 0));
  });
}

// #4 Inchiderea zilei: memento + warn-but-allow. Nu blocheaza, doar avertizeaza constient.
function renderCloseDayStatus() {
  const today = new Date().toISOString().slice(0, 10);
  const isToday = (r) => String(r.createdAt || r.receivedAt || "").slice(0, 10) === today;

  // „Azi primit" = net total primit azi (exclude anulate si cele inca in descarcare, fara masa neta).
  const todayEl = document.getElementById("today-received");
  if (todayEl) {
    const todayDone = receiptsCache.filter(
      (r) => isToday(r) && r.status !== "Anulat" && r.status !== "In descarcare"
    );
    const totalTons = todayDone.reduce(
      (s, r) => s + Number(r.finalNetQuantity ?? r.provisionalNetQuantity ?? r.quantity ?? 0),
      0
    );
    todayEl.textContent = `Azi primit: ${formatNumber(totalTons)} t · ${todayDone.length} recepții`;
  }

  if (!closeDayStatus) {
    return;
  }
  // „Neterminat" = doar recepatiile „In descarcare" (cantarite brut, fara masa neta inca).
  const pending = receiptsCache.filter((r) => r.status === "In descarcare").length;
  if (pending > 0) {
    closeDayStatus.textContent = `⚠ ${pending} în descărcare (fără masă netă)`;
    closeDayStatus.className = "eod-status eod-warn";
    return;
  }
  let stampIso = "";
  try {
    stampIso = window.localStorage.getItem("agro:dayClosedAt") || "";
  } catch (e) {
    stampIso = "";
  }
  if (stampIso.slice(0, 10) === today) {
    const d = new Date(stampIso);
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    closeDayStatus.textContent = `✅ Ziua închisă la ${hh}:${mm}`;
  } else {
    closeDayStatus.textContent = "Toate recepțiile au masă netă";
  }
  closeDayStatus.className = "eod-status eod-ok";
}

function handleCloseDay() {
  // „Neterminat" la inchiderea zilei = doar recepatiile „In descarcare" (fara masa neta).
  const pending = receiptsCache.filter((r) => r.status === "In descarcare");
  if (pending.length > 0) {
    const lines = pending
      .slice(0, 10)
      .map((r) => `   #${r.id} ${r.vehicle || ""} ${r.supplier || ""}`.trimEnd());
    const ok = window.confirm(
      `⚠ Ai ${pending.length} recepții în descărcare (fără masă netă):\n\n${lines.join("\n")}\n\nÎnchizi ziua oricum? Acestea rămân pentru mâine — le completezi tara când iese camionul.`
    );
    if (!ok) {
      return;
    }
  }
  try {
    window.localStorage.setItem("agro:dayClosedAt", new Date().toISOString());
  } catch (e) {
    /* localStorage indisponibil — ignoram */
  }
  renderCloseDayStatus();
  window.alert(
    pending.length > 0
      ? `Ziua a fost închisă cu ${pending.length} recepții în descărcare. Le completezi tara mâine din panoul „În descărcare".`
      : "Ziua a fost închisă. Toate recepțiile au masă netă. ✅"
  );
}

if (closeDayButton) {
  closeDayButton.addEventListener("click", handleCloseDay);
}

function paymentBadge(status) {
  const map = {
    Neachitat: { cls: "pay-neachitat", label: "Neachitat" },
    Partial: { cls: "pay-partial", label: "Parțial" },
    Achitat: { cls: "pay-achitat", label: "Achitat" }
  };
  const s = map[status] || map.Neachitat;
  return `<span class="pay-badge ${s.cls}">${bi(s.label)}</span>`;
}

// "Achită" button: jump to Financiar with the payment pre-filled (Modul Achitări)
function prefillReceiptPayment(receiptId) {
  const receipt = (receiptsCache || []).find((r) => String(r.id) === String(receiptId));
  if (!receipt) return;
  setView("financiar");
  const navBtn = document.querySelector('.view-tab[data-view="financiar"]');
  if (navBtn) navBtn.classList.add("is-active");
  // Set reference to this receipt
  if (transactionReferenceTypeSelect) {
    transactionReferenceTypeSelect.value = "receipt";
  }
  renderTransactionReferenceOptions();
  setSelectValue(transactionReferenceSelect, [String(receiptId)]);
  if (typeof syncTransactionDirection === "function") syncTransactionDirection();
  // Pre-fill amount = sold restant
  const rest = Number(receipt.soldRestant ?? Math.max(Number(receipt.amountToPay || receipt.preliminaryPayableAmount || 0) - Number(receipt.paidAmount || 0), 0));
  if (transactionFormEl && transactionFormEl.elements.amount) {
    transactionFormEl.elements.amount.value = rest > 0 ? rest.toFixed(2) : "";
    transactionFormEl.elements.amount.focus();
  }
  transactionFormEl?.scrollIntoView({ behavior: "smooth", block: "center" });
}

function renderReceiptTotals(rows) {
  if (!rows.length) {
    receiptsFootEl.innerHTML = "";
    return;
  }
  // Total PE COLOANĂ, aliniat sub fiecare coloană: Cantitate / Apă / Valoare / Achitat / Rest.
  // (Anulatele nu intră în totaluri.)
  let totalNet = 0, totalWater = 0, totalPay = 0, totalPaid = 0, totalRest = 0;
  rows.forEach((item) => {
    if (item.status === "Anulat") return;
    const valoare = Number(item.amountToPay ?? item.preliminaryPayableAmount ?? 0);
    const achitat = Number(item.paidAmount || 0);
    totalNet += Number(item.provisionalNetQuantity || item.quantity || 0);
    totalWater += Number(item.estimatedWaterLoss || 0);
    totalPay += valoare;
    totalPaid += achitat;
    totalRest += Number(item.soldRestant ?? Math.max(valoare - achitat, 0));
  });
  const waterKg = Math.round(totalWater * 1000);
  const qtyCell = `<b>${formatNumber(totalNet)} t</b><br><small>${formatNumber(totalNet * 1000)} kg</small>`;
  // 17 coloane: ID,Data,Furnizor,Produs | Cantitate | Apă | Masă brută | Tara | Locatie |
  //             Valoare | Achitat | Rest | Data plată | Stare | Status | Detalii | Acțiuni
  receiptsFootEl.innerHTML = `
    <tr class="totals-row">
      <td colspan="4">TOTAL · ${rows.length} recepții</td>
      <td>${qtyCell}</td>
      <td>${waterKg > 0 ? "<b>" + formatNumber(waterKg) + " kg</b>" : "—"}</td>
      <td></td>
      <td></td>
      <td></td>
      <td class="col-fin"><b>${currency.format(totalPay)}</b></td>
      <td class="col-fin">${currency.format(totalPaid)}</td>
      <td class="col-fin"><b>${currency.format(totalRest)}</b></td>
      <td class="col-fin"></td>
      <td class="col-fin"></td>
      <td></td>
      <td></td>
      <td class="col-fin"></td>
    </tr>
  `;
}

// Alertă operator: au fost recepții azi dar nicio procesare. (OP-1)
// Rămâne pe ecran (Recepție/Procesare) până când operatorul confirmă SAU închide manual.
// NU dispare automat la reîncărcarea datelor.
function checkEndOfDayProcessing() {
  if (!eodBanner) return;
  // Se afișează doar pe ecranele Recepție și Procesare
  const onRelevantView = currentActiveView === "receptii" || currentActiveView === "procesare";
  if (!onRelevantView) {
    eodBanner.hidden = true;
    return;
  }
  const today = new Date().toISOString().slice(0, 10);
  let dismissed = false;
  try {
    // Confirmat pentru toată ziua, sau închis manual în sesiunea curentă
    dismissed = window.localStorage.getItem(`eod-no-processing-${today}`) === "1"
      || window.sessionStorage.getItem(`eod-closed-${today}`) === "1";
  } catch (_e) {
    dismissed = false;
  }
  const todaysReceipts = receiptsCache.filter(
    (r) => String(r.createdAt || r.receivedAt || "").slice(0, 10) === today && r.status !== "Anulat"
  );
  const todaysProcessings = processingsCache.filter(
    (p) => String(p.createdAt || p.processedAt || "").slice(0, 10) === today
  );
  eodBanner.hidden = !(todaysReceipts.length > 0 && todaysProcessings.length === 0 && !dismissed);
}

// Stoc neprocesat pe produs: receptii care inca nu au fost procesate.
// Stoc neprocesat = cat s-a receptionat minus cat s-a dat la procesare, pe produs.
function renderUnprocessedStock() {
  if (!unprocessedStockBodyEl) return;
  const received = {};
  const counts = {};
  receiptsCache.forEach((r) => {
    if (r.status === "Anulat") return;
    const key = r.product || "—";
    received[key] = (received[key] || 0) + Number(r.provisionalNetQuantity ?? r.quantity ?? 0);
    counts[key] = (counts[key] || 0) + 1;
  });
  const processed = {};
  (processingsCache || []).forEach((p) => {
    if (!p || p.status === "Anulat" || p.status === "In lucru") return;
    const key = p.product || "—";
    processed[key] = (processed[key] || 0) + Number(p.processedQuantity || 0);
  });
  const rows = Object.keys(received)
    .map((prod) => ({
      prod,
      tons: Math.max(received[prod] - (processed[prod] || 0), 0),
      count: counts[prod] || 0
    }))
    .filter((r) => r.tons > 0.0001)
    .sort((a, b) => b.tons - a.tons);
  if (!rows.length) {
    unprocessedStockBodyEl.innerHTML = '<tr><td colspan="4">Tot stocul recepționat este procesat.</td></tr>';
    return;
  }
  unprocessedStockBodyEl.innerHTML = rows
    .map(
      (v) =>
        `<tr><td>${v.prod}</td><td>${formatNumber(v.tons)} t</td><td>${formatNumber(v.tons * 1000)} kg</td><td>${v.count}</td></tr>`
    )
    .join("");
}

function renderProcessings(processings) {
  // Procesarea afisata aici (non-„In lucru") e deja confirmata → schimbarea statutului e
  // rezervata manager+admin; optiunea „Anulat" doar admin.
  const canEditStatuses = canEditConfirmedStatus();
  const filteredProcessings = processings.filter((item) => {
    const typeMatch =
      !processingTypeFilterEl.value || item.processingType === processingTypeFilterEl.value;
    const productMatch =
      !processingProductFilterEl || !processingProductFilterEl.value || item.product === processingProductFilterEl.value;
    const dateMatch = withinDateRange(item, ["createdAt", "processedAt"], processingDateFromEl, processingDateToEl);
    // Documentele anulate: vizibile doar celor cu drept (admin); operatorul nu le vede (ca la receptii/livrari).
    return typeMatch && productMatch && dateMatch && canViewCanceled(item);
  });

  processingsBodyEl.innerHTML = filteredProcessings
    .map(
      (item) => `
        <tr>
          <td>#${item.id}</td>
          <td>${formatDateShort(item.createdAt || item.processedAt)}</td>
          <td>${item.product}</td>
          <td>${item.sourceLocation || "-"}</td>
          <td>${item.destLocation || item.sourceLocation || "-"}</td>
          <td>${item.processingType}</td>
          <td>${formatNumber(item.processedQuantity)}</td>
          <td>${formatNumber(item.confirmedWaste)}</td>
          <td>
            <div>${formatNumber(item.outputQuantity ?? item.finalNetQuantity)}</div>
            ${item.status === "In lucru"
              ? `<span class="badge-inlucru" title="Se finalizează din panoul „Procesări în lucru» de mai sus">${bi("În lucru")}</span>`
              : `<select class="processing-status" data-id="${item.id}" ${canEditStatuses ? "" : "disabled"}>
                  ${["Confirmat", "Inchis", "Anulat", "Redeschis"]
                    .filter((status) => status !== "Anulat" || canCancelDocuments() || item.status === "Anulat")
                    .map((status) => {
                    const selected = item.status === status ? "selected" : "";
                    return `<option value="${status}" ${selected}>${bi(status)}</option>`;
                  }).join("")}
                </select>`}
          </td>
          <td><button type="button" class="cell-btn cell-btn-details" data-action="processing-details" data-id="${item.id}">Detalii</button></td>
        </tr>
      `
    )
    .join("");

  if (processingsFootEl) {
    renderProcessingTotals(filteredProcessings);
  }

  // Panou separat „Procesări în lucru" (oglinda „Recepții în descărcare"): TOATE procesarile
  // in lucru, independent de filtrele tabelului de mai jos, ca sa fie clar ce mai trebuie finalizat.
  renderProcessingInlucru(processings);
}

// Panou „Procesări în lucru" — todo de finalizat, cu actiuni (Finalizează / Anulează).
function renderProcessingInlucru(processings) {
  if (!processingInlucruBody || !processingInlucruPanel) {
    return;
  }
  const canEdit = canAccess("processing-write");
  const inLucru = (processings || []).filter((item) => item.status === "In lucru");
  if (processingInlucruCount) {
    processingInlucruCount.textContent = inLucru.length ? String(inLucru.length) : "";
  }
  processingInlucruPanel.hidden = inLucru.length === 0;
  processingInlucruBody.innerHTML = inLucru
    .map(
      (item) => `
        <tr class="row-pending">
          <td>#${item.id}</td>
          <td>${formatDateShort(item.createdAt || item.processedAt)}</td>
          <td>${escapeComboHtml(item.product || "")}</td>
          <td>${escapeComboHtml(item.sourceLocation || "-")}</td>
          <td>${escapeComboHtml(item.processingType || "-")}</td>
          <td>${formatNumber(Math.round(Number(item.processedQuantity || 0) * 1000))} kg</td>
          <td>
            ${canEdit
              ? `<div class="proc-inlucru-actions">
                   <button type="button" class="cell-btn cell-btn-primary processing-finalize-btn" data-id="${item.id}">Finalizează</button>
                   ${canCancelDocuments()
                     ? `<button type="button" class="cell-btn cell-btn-danger processing-cancel-btn" data-id="${item.id}">Anulează</button>`
                     : ""}
                 </div>`
              : `<span class="badge-inlucru">În lucru</span>`}
          </td>
        </tr>
      `
    )
    .join("");
}

function renderProcessingTotals(rows) {
  if (!rows.length) {
    processingsFootEl.innerHTML = "";
    return;
  }
  // Total per product: processed, waste, remaining (Modul C)
  const byProduct = {};
  let totProcessed = 0;
  let totWaste = 0;
  let totFinal = 0;
  rows.forEach((item) => {
    if (item.status === "Anulat") return; // procesarea anulata nu intra in totaluri
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

  // Cantitate neprocesată = net recepționat (fără Anulat) − procesat, pe produs
  const receivedByProduct = {};
  (receiptsCache || []).forEach((r) => {
    if (r.status === "Anulat") return;
    const key = r.product || "—";
    receivedByProduct[key] = (receivedByProduct[key] || 0) + Number(r.provisionalNetQuantity || r.quantity || 0);
  });

  // General total row
  let html = `
    <tr class="totals-row">
      <td colspan="5">TOTAL GENERAL (${rows.length} procesări)</td>
      <td>${formatNumber(totProcessed)}</td>
      <td>${formatNumber(totWaste)}</td>
      <td>${formatNumber(totFinal)}</td>
    </tr>`;
  // One row per product
  Object.entries(byProduct).forEach(([prod, v]) => {
    html += `
      <tr class="totals-row totals-sub">
        <td colspan="5">${prod}</td>
        <td>${formatNumber(v.proc)}</td>
        <td>${formatNumber(v.waste)}</td>
        <td>${formatNumber(v.fin)}</td>
      </tr>`;
  });
  // Neprocesat row(s)
  const neprocList = Object.entries(receivedByProduct)
    .map(([prod, received]) => {
      const procesat = (byProduct[prod] && byProduct[prod].proc) || 0;
      const neproc = Math.max(received - procesat, 0);
      return neproc > 0.001 ? `${prod}: ${formatNumber(neproc)} t` : null;
    })
    .filter(Boolean)
    .join(" · ");
  if (neprocList) {
    html += `
      <tr class="totals-row totals-neproc">
        <td colspan="8">Neprocesat (recepționat dar încă neprocesat): ${neprocList}</td>
      </tr>`;
  }
  processingsFootEl.innerHTML = html;
}

// Standingul curent al referinței unei tranzacții — sursa de adevăr e recepția / livrarea / soldul inițial,
// pe care backendul le actualizează cumulativ (paidAmount/collectedAmount/settledAmount + status).
function buildTxStanding(target, paid, statusStr) {
  const remaining = Math.max(Number(target || 0) - Number(paid || 0), 0);
  const s = String(statusStr || "").toLowerCase();
  let label = "Neachitat";
  let css = "badge-alert";
  if (s === "achitat" || s === "incasat") { label = "Achitat integral"; css = "badge-ok"; }
  else if (s.includes("partial")) { label = "Achitat parțial"; css = "badge-warn"; }
  else if (s === "neincasat") { label = "Neîncasat"; css = "badge-alert"; }
  return { remaining, label, css };
}

function transactionReferenceStanding(item) {
  if (item.referenceType === "receipt") {
    const r = (receiptsCache || []).find((x) => Number(x.id) === Number(item.receiptId));
    if (r) return buildTxStanding(r.amountToPay ?? r.preliminaryPayableAmount ?? 0, r.paidAmount || 0, r.paymentStatus);
  } else if (item.referenceType === "delivery") {
    const d = (deliveriesCache || []).find((x) => Number(x.id) === Number(item.deliveryId));
    if (d) {
      const qty = Number(d.deliveredQuantity || d.netWeight || 0);
      return buildTxStanding(Number(d.contractPrice || 0) * qty, d.collectedAmount || 0, d.collectionStatus);
    }
  } else if (item.referenceType === "opening-debt") {
    for (const doc of (openingDocumentsCache || [])) {
      const di = (doc.debtItems || []).find((x) => String(x.openingDebtId) === String(item.openingDebtId));
      if (di) return buildTxStanding(di.amount || 0, di.settledAmount || 0, di.status);
    }
  }
  return null;
}

function renderTransactions(transactions) {
  // Statutul plății îl pot schimba DOAR admin + contabil-șef.
  const role = currentSessionUser?.roleCode;
  const canEditStatuses = role === "admin" || role === "accountant-sef";
  // Tranzacțiile anulate sunt vizibile doar contabilului-șef + admin (restul nu le văd).
  const canSeeCanceledTx = role === "admin" || role === "accountant-sef";
  // Filtru pe partener (alfabetic), pe lângă filtrul de perioadă existent.
  if (transactionPartnerFilterEl) {
    const partners = Array.from(new Set(transactions.map((t) => t.partner).filter(Boolean)))
      .sort((a, b) => String(a).localeCompare(String(b), "ro", { sensitivity: "base" }));
    const prev = transactionPartnerFilterEl.value;
    transactionPartnerFilterEl.innerHTML =
      '<option value="">Toți partenerii</option>' +
      partners.map((p) => `<option value="${escapeComboHtml(p)}">${escapeComboHtml(p)}</option>`).join("");
    if (prev) transactionPartnerFilterEl.value = prev;
  }
  const partnerFilter = transactionPartnerFilterEl ? transactionPartnerFilterEl.value : "";
  const filtered = transactions.filter((item) =>
    withinDateRange(item, ["createdAt", "transactedAt"], transactionDateFromEl, transactionDateToEl) &&
    (!partnerFilter || item.partner === partnerFilter) &&
    (item.status !== "Anulat" || canSeeCanceledTx)
  );
  transactionsBodyEl.innerHTML = filtered
    .map(
      (item) => `
        <tr>
          <td>#${item.id}</td>
          <td>${formatDateShort(item.createdAt || item.transactedAt)}</td>
          <td>${item.referenceType === "delivery" ? `Livrare #${item.deliveryId}` : item.referenceType === "opening-debt" ? `Datorie inițială` : `Receptie #${item.receiptId}`}</td>
          <td>${escapeComboHtml(item.partner || "")}</td>
          <td>${item.direction === "collection" ? "Incasare" : "Plata"}</td>
          <td>
            <div>${item.paymentType || "-"}</div>
            <select class="transaction-status" data-id="${item.id}" ${canEditStatuses ? "" : "disabled"}>
              ${["Confirmat", "Inchis", "Anulat", "Redeschis"].map((status) => {
                const selected = item.status === status ? "selected" : "";
                return `<option value="${status}" ${selected}>${bi(status)}</option>`;
              }).join("")}
            </select>
          </td>
          <td>${currency.format(Number(item.amount || 0))}</td>
          ${(() => {
            const st = transactionReferenceStanding(item);
            const rest = st ? currency.format(st.remaining) : "-";
            const badge = st ? `<span class="status-badge ${st.css}">${st.label}</span>` : "-";
            return `<td>${rest}</td><td>${badge}</td>`;
          })()}
          <td><button type="button" class="cell-btn cell-btn-details" data-action="transaction-details" data-id="${item.id}">Detalii</button></td>
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
  let serviceTotal = 0;
  rows.forEach((item) => {
    const amt = Number(item.amount || 0);
    if (item.direction === "collection") totalCollections += amt;
    else totalPayments += amt;
    const pt = String(item.paymentType || "").toLowerCase();
    if (pt.includes("numerar") || pt.includes("cash")) cashTotal += amt;
    else if (pt.includes("transfer")) transferTotal += amt;
    else if (pt.includes("servici")) serviceTotal += amt;
  });
  transactionsFootEl.innerHTML = `
    <tr class="totals-row">
      <td colspan="10">TOTAL (${rows.length}) &nbsp;·&nbsp; Numerar: <b>${currency.format(cashTotal)}</b> · Transfer: <b>${currency.format(transferTotal)}</b> · Servicii (barter): <b>${currency.format(serviceTotal)}</b> &nbsp;·&nbsp; Încasări: <b>${currency.format(totalCollections)}</b> · Plăți: <b>${currency.format(totalPayments)}</b></td>
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
  return `<span class="status-badge ${classMap[status] || "badge-neutral"}">${bi(label)}</span>`;
}

// Cantitatea afisata: greutatea neta reala daca s-a livrat, altfel cantitatea livrata,
// altfel cantitatea planificata (cea introdusa de operator). Evita afisarea "0"/"-0".
function deliveryDisplayQuantity(item) {
  if (Number(item.netWeight) > 0) return Number(item.netWeight);
  if (Number(item.deliveredQuantity) > 0) return Number(item.deliveredQuantity);
  return Number(item.plannedQuantity || 0);
}

// Sumele de pe factură — convenție de business cu DOUĂ unități de preț, în funcție de valută:
//  • Preț în MDL            = lei / KG    → total lei = kg × preț      (ex: 23.950 kg × 4,09 = 97.955,50 lei)
//  • Preț în valută (EUR/USD/RON) = valută / TONĂ → total valută = tone × preț; total lei = total valută × curs
//    (ex: 26,16 t × 175 EUR × 20,1152 = 92.087,39 lei)
// Un SINGUR loc de adevăr pentru sume — folosit în tabel, totaluri, factura tipărită și formularul de facturare.
function deliveryInvoiceTotals(item) {
  const tonnes = deliveryDisplayQuantity(item);
  const kg = tonnes * 1000;
  const cur = item.currency || "MDL";
  const isForeign = cur !== "MDL" && Number(item.priceForeign) > 0;
  if (isForeign) {
    const unitForeign = Number(item.priceForeign || 0); // valută / tonă
    const rate = Number(item.exchangeRate || 0);
    const totalForeign = tonnes * unitForeign;
    return { cur, isForeign, tonnes, kg, unitForeign, unitLei: unitForeign * rate, totalForeign, totalLei: totalForeign * rate };
  }
  const unitLei = Number(item.priceLei || 0); // lei / kg
  return { cur, isForeign, tonnes, kg, unitForeign: 0, unitLei, totalForeign: 0, totalLei: kg * unitLei };
}

// Indici pentru umiditatea de depozitare (construiți O(recepții) O DATĂ per randare, ca să nu
// scanăm receiptsCache per rând de livrare — altfel O(livrări × recepții)).
const normLocKey = (s) => String(s || "").trim().toLowerCase();
function buildReceiptHumidityIndex() {
  const receiptById = new Map();
  const humAgg = new Map(); // "produs|locatie" -> { totQty, totHumQty }
  for (const r of (receiptsCache || [])) {
    if (r && r.id != null) receiptById.set(Number(r.id), r);
    if (!r || r.status === "Anulat" || !(Number(r.humidity) > 0)) continue;
    const key = r.product + "|" + normLocKey(r.location);
    const q = Number(r.provisionalNetQuantity || r.quantity || 0) || 1;
    const acc = humAgg.get(key) || { totQty: 0, totHumQty: 0 };
    acc.totQty += q;
    acc.totHumQty += q * Number(r.humidity || 0);
    humAgg.set(key, acc);
  }
  return { receiptById, humAgg };
}

// Umiditatea „de depozitare" a unei livrări: din recepția-sursă (dacă e legată), altfel media
// ponderată (pe cantitate) a recepțiilor active cu același produs + locație — ce e în cilindru.
// `idx` (opțional) = indecșii de mai sus; dacă lipsește, se construiesc pe loc (apel unic).
function deliveryStorageHumidity(item, idx) {
  const index = idx || buildReceiptHumidityIndex();
  if (item.receiptId) {
    const r = index.receiptById.get(Number(item.receiptId));
    if (r && Number(r.humidity) > 0) return Number(r.humidity);
  }
  const acc = index.humAgg.get(item.product + "|" + normLocKey(item.location));
  return acc && acc.totQty > 0 ? acc.totHumQty / acc.totQty : 0;
}

// Apa (kg, cu semn) la livrare = cantitate livrată × (umid. depozitare − umid. livrare)/100.
// Pozitiv = apă pierdută (s-a uscat); negativ = livrat mai umed. null dacă lipsesc datele.
function deliveryWaterKg(item, idx) {
  const dh = Number(item.deliveryHumidity || 0);
  const sh = deliveryStorageHumidity(item, idx);
  if (!(dh > 0) || !(sh > 0)) return null;
  return Math.round((deliveryDisplayQuantity(item) * 1000) * ((sh - dh) / 100));
}

function renderDeliveries(deliveries) {
  // Livrarea e „Livrat" (confirmata) din momentul crearii → schimbarea statutului
  // (Inchis/Redeschis) e rezervata manager+admin. Anularea (admin) e separat, in docActionsCell.
  const canEditStatuses = canEditConfirmedStatus();
  // Financial columns (vanzator, masina, pret) hidden for operators (no finance access)
  const deliveriesTable = document.getElementById("deliveries-table");
  if (deliveriesTable) {
    deliveriesTable.classList.toggle("hide-fin", !canAccess("finance"));
  }
  // Populează filtrele cumpărător/produs (o singură dată per valoare)
  if (deliveryCustomerFilterEl) {
    const custs = Array.from(new Set(deliveries.map((d) => d.customer).filter(Boolean))).sort((a, b) => String(a).localeCompare(String(b), "ro"));
    const prev = deliveryCustomerFilterEl.value;
    deliveryCustomerFilterEl.innerHTML = '<option value="">Toți</option>' + custs.map((c) => `<option value="${c}">${c}</option>`).join("");
    if (prev) deliveryCustomerFilterEl.value = prev;
  }
  if (deliveryProductFilterEl2) {
    const prods = Array.from(new Set(deliveries.map((d) => d.product).filter(Boolean))).sort((a, b) => String(a).localeCompare(String(b), "ro"));
    const prev = deliveryProductFilterEl2.value;
    deliveryProductFilterEl2.innerHTML = '<option value="">Toate</option>' + prods.map((p) => `<option value="${p}">${p}</option>`).join("");
    if (prev) deliveryProductFilterEl2.value = prev;
  }
  const custFilter = deliveryCustomerFilterEl ? deliveryCustomerFilterEl.value : "";
  const prodFilter = deliveryProductFilterEl2 ? deliveryProductFilterEl2.value : "";
  const paidFilter = deliveryPaidFilterEl ? deliveryPaidFilterEl.value : "";

  const filtered = deliveries.filter((item) => {
    if (!withinDateRange(item, ["createdAt", "deliveredAt"], deliveryDateFromEl, deliveryDateToEl)) return false;
    if (custFilter && item.customer !== custFilter) return false;
    if (prodFilter && item.product !== prodFilter) return false;
    if (paidFilter === "paid" && !item.invoicePaid) return false;
    if (paidFilter === "unpaid" && item.invoicePaid) return false;
    if (!canViewCanceled(item)) return false;
    return true;
  });
  const waterIdx = buildReceiptHumidityIndex(); // construit o dată, folosit de toate rândurile
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
      const money = deliveryInvoiceTotals(item);
      const priceLabel = money.isForeign
        ? `${formatNumber(money.unitForeign)} ${money.cur}/t`
        : (money.unitLei ? `${formatNumber(money.unitLei)} MDL/kg` : "-");
      const totalFactura = money.totalLei;
      const canBill = canAccess("finance");
      const paidSelect = canBill
        ? `<select class="delivery-paid-select" data-id="${item.id}">
             <option value="false" ${!item.invoicePaid ? "selected" : ""}>Neachitată</option>
             <option value="true" ${item.invoicePaid ? "selected" : ""}>Achitată</option>
           </select>`
        : (item.invoicePaid ? "Achitată" : "Neachitată");
      return `
        <tr>
          <td>#${item.id}</td>
          <td>${formatDateShort(item.createdAt || item.deliveredAt)}</td>
          <td>${item.location || (item.receiptId ? `#${item.receiptId}` : "-")}</td>
          <td>${item.customer}</td>
          <td class="col-fin">${item.seller || "-"}</td>
          <td>${item.product}${photosMini(item.photos)}</td>
          <td>${formatQtyByEntry(qty, item)}</td>
          <td title="Apă = cantitate × (umid. depozitare − umid. livrare)/100. Pozitiv = pierdută (uscat); negativ = livrat mai umed.">${(() => { const w = deliveryWaterKg(item, waterIdx); return w === null ? "—" : (w >= 0 ? formatNumber(w) : "−" + formatNumber(Math.abs(w))) + " kg"; })()}</td>
          <td>${escapeComboHtml(item.vehicle || "-")}${item.trailer ? ` <span class="trailer-badge">+ ${escapeComboHtml(item.trailer)}</span>` : ""}</td>
          <td class="col-fin">${priceLabel}</td>
          <td class="col-fin">${totalFactura > 0 ? currency.format(totalFactura) : "-"}</td>
          <td class="col-fin pay-cell ${item.invoicePaid ? "is-paid" : "is-unpaid"}">${paidSelect}</td>
          <td>
            <div class="col-fin">${item.invoiceNumber || "-"}</div>
            ${item.note ? `<div class="row-note">${escapeComboHtml(item.note)}</div>` : ""}
            <div>${deliveryStatusBadge(status)}</div>
            <div class="action-row">${buttons}</div>
            <div class="action-row">${docActionsCell("delivery", item)}</div>
            ${canAccess("finance") ? `<div class="doc-print-row">
              <button type="button" class="cell-btn cell-btn-primary" data-action="edit-billing" data-id="${item.id}">Date factură</button>
              <details class="print-menu">
                <summary class="doc-print-btn">Tipar ▾</summary>
                <div class="print-menu-list">
                  <button type="button" class="doc-print-btn" data-print="bon" data-id="${item.id}">Bon de cântar</button>
                  <button type="button" class="doc-print-btn" data-print="certificate" data-id="${item.id}">Certificat calitate</button>
                  <button type="button" class="doc-print-btn" data-print="cmr" data-id="${item.id}">CMR</button>
                  <button type="button" class="doc-print-btn" data-print="invoice" data-id="${item.id}">Invoice</button>
                  <button type="button" class="doc-print-btn" data-print="imputernicire" data-id="${item.id}">Împuternicire</button>
                  <button type="button" class="doc-print-btn" data-print="declaratie" data-id="${item.id}">Declarație</button>
                  <button type="button" class="doc-print-btn" data-print="act" data-id="${item.id}">Act achiziție</button>
                </div>
              </details>
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
  // Totaluri: cantitate (tone), sumă factură (lei + valută pe monedă).
  let totalQty = 0;
  let totalLei = 0;
  const totalForeignByCur = {};
  rows.forEach((item) => {
    if (item.status === "Anulat") return; // livrarea anulată nu intră în totaluri
    const money = deliveryInvoiceTotals(item);
    totalQty += money.tonnes;
    totalLei += money.totalLei;
    if (money.cur !== "MDL") totalForeignByCur[money.cur] = (totalForeignByCur[money.cur] || 0) + money.totalForeign;
  });
  // Apă totală pe livrări (sumă kg, ignorând valorile necunoscute). Index construit o dată.
  const waterIdx = buildReceiptHumidityIndex();
  let totalWaterKg = 0;
  rows.forEach((item) => {
    if (item.status === "Anulat") return;
    const w = deliveryWaterKg(item, waterIdx);
    if (w !== null) totalWaterKg += w;
  });
  const foreignStr = Object.entries(totalForeignByCur).map(([c, v]) => `${formatNumber(v)} ${c}`).join(" + ");
  const facturaCell = `<b>${currency.format(totalLei)}</b>${foreignStr ? `<br><small>${foreignStr}</small>` : ""}`;
  // 13 coloane: ID,Data,Sursă,Cumpărător | Vânzător | Produs | Cantitate | Apă | Mașina |
  //             Preț | Sumă factură | Achitată | Status
  deliveriesFootEl.innerHTML = `
    <tr class="totals-row">
      <td colspan="4">TOTAL · ${rows.length} livrări</td>
      <td class="col-fin"></td>
      <td></td>
      <td><b>${formatNumber(totalQty)} t</b></td>
      <td>${totalWaterKg !== 0 ? "<b>" + (totalWaterKg >= 0 ? formatNumber(Math.round(totalWaterKg)) : "−" + formatNumber(Math.abs(Math.round(totalWaterKg)))) + " kg</b>" : "—"}</td>
      <td></td>
      <td class="col-fin"></td>
      <td class="col-fin">${facturaCell}</td>
      <td class="col-fin"></td>
      <td></td>
    </tr>
  `;
}

function renderComplaints(complaints) {
  const canEditStatuses = canAccess("complaint-write");

  // Populează filtrul de produs (o singură dată per produs)
  if (complaintProductFilterEl) {
    const prods = Array.from(new Set(complaints.map((c) => c.product).filter(Boolean)))
      .sort((a, b) => String(a).localeCompare(String(b), "ro"));
    const prev = complaintProductFilterEl.value;
    complaintProductFilterEl.innerHTML = '<option value="">Toate produsele</option>' +
      prods.map((p) => `<option value="${p}">${p}</option>`).join("");
    if (prev) complaintProductFilterEl.value = prev;
  }

  const productFilter = complaintProductFilterEl ? complaintProductFilterEl.value : "";
  const filtered = complaints.filter((c) => !productFilter || c.product === productFilter);

  complaintsBodyEl.innerHTML = filtered
    .map(
      (item) => {
        const deducted = Number(item.deductedAmount || 0);
        const deliveryTotal = Number(item.deliveryTotal || 0);
        const initialQty = Number(item.deliveryQuantity || 0);
        const deductedCell = deducted > 0
          ? `<span class="complaint-minus">−${currency.format(deducted)}</span>`
          : "-";
        return `
        <tr class="${deducted > 0 ? "complaint-row-minus" : ""}">
          <td>#${item.id}</td>
          <td>${item.customer}</td>
          <td>${item.product || "-"}</td>
          <td>${item.complaintType}</td>
          <td>${deliveryTotal > 0 ? currency.format(deliveryTotal) : "-"}</td>
          <td>${initialQty > 0 ? formatNumber(initialQty) + " t" : "-"}</td>
          <td>${formatNumber(item.contestedQuantity)}</td>
          <td>${deductedCell}</td>
          <td>
            <select class="complaint-status" data-id="${item.id}" ${canEditStatuses ? "" : "disabled"}>
              ${["Deschisa", "Acceptata", "Respinsa", "Inchisa", "Redeschisa"].map((status) => {
                const selected = item.status === status ? "selected" : "";
                return `<option value="${status}" ${selected}>${bi(status)}</option>`;
              }).join("")}
            </select>
          </td>
          <td><button type="button" class="cell-btn cell-btn-details" data-action="complaint-details" data-id="${item.id}">Detalii</button></td>
        </tr>
      `;
      }
    )
    .join("");

  // Footer: total cantitate reclamată (+ pe produs) și total sumă diminuată
  if (complaintsFootEl) {
    if (!filtered.length) {
      complaintsFootEl.innerHTML = "";
    } else {
      const byProduct = {};
      let totalQty = 0;
      let totalDeducted = 0;
      filtered.forEach((c) => {
        const q = Number(c.contestedQuantity || 0);
        totalQty += q;
        totalDeducted += Number(c.deductedAmount || 0);
        const key = c.product || "—";
        byProduct[key] = (byProduct[key] || 0) + q;
      });
      const perProduct = Object.entries(byProduct).map(([p, q]) => `${p}: ${formatNumber(q)}`).join(" · ");
      complaintsFootEl.innerHTML = `
        <tr class="totals-row">
          <td colspan="10">TOTAL reclamat: <b>${formatNumber(totalQty)}</b> &nbsp;·&nbsp; Sumă diminuată: <b>${currency.format(totalDeducted)}</b> &nbsp;·&nbsp; ${perProduct}</td>
        </tr>`;
    }
  }
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
    if (item.status === "Anulat") return false; // livrarea anulata nu mai e de incasat
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
          <td>${escapeComboHtml(item.entityType || "")}${item.entityId ? ` #${escapeComboHtml(String(item.entityId))}` : ""}</td>
          <td>${escapeComboHtml(item.action || "")}</td>
          <td>${escapeComboHtml(item.user || "-")}</td>
          <td>${escapeComboHtml(item.reason || "")}</td>
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

// Rând de total sub un tabel de raport. cells: [{colspan?, value}] în ordinea coloanelor.
function setReportFoot(el, cells) {
  if (!el) return;
  el.innerHTML = `<tr class="totals-row">${cells
    .map((c) => `<td${c.colspan ? ` colspan="${c.colspan}"` : ""}>${c.value ?? ""}</td>`)
    .join("")}</tr>`;
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

  const receiptValueOf = (r) => Number(r.amountToPay ?? r.preliminaryPayableAmount ?? 0);
  // Tabelele principale arata doar operatiunile REALE (ne-anulate); cele anulate merg in
  // tabelul dedicat „Operatiuni anulate" de mai jos, ca sa nu se amestece cu cele reale.
  const activeReceipts = report.receipts.filter((r) => r.status !== "Anulat");
  dailyReportReceiptsEl.innerHTML = activeReceipts
    .map(
      (item) => `
        <tr>
          <td>#${item.id}</td>
          <td>${formatDateShort(item.createdAt)}</td>
          <td>${escapeComboHtml(item.supplier)}</td>
          <td>${escapeComboHtml(item.product)}</td>
          <td>${formatNumber(item.grossQuantity || item.quantity)}</td>
          <td>${formatNumber(item.provisionalNetQuantity || item.quantity)}</td>
          <td>${currency.format(receiptValueOf(item))}</td>
          <td>${paymentBadge(item.paymentStatus)}</td>
        </tr>
      `
    )
    .join("");
  setReportFoot(dailyReportReceiptsFootEl, [
    { colspan: 6, value: `TOTAL (${activeReceipts.length})` },
    { value: currency.format(activeReceipts.reduce((s, r) => s + receiptValueOf(r), 0)) },
    { value: "" }
  ]);

  dailyReportProcessingsEl.innerHTML = report.processings
    .map(
      (item) => `
        <tr>
          <td>#${item.id}</td>
          <td>${formatDateShort(item.createdAt)}</td>
          <td>#${item.receiptId}</td>
          <td>${escapeComboHtml(item.processingType)}</td>
          <td>${formatNumber(item.processedQuantity)}</td>
          <td>${formatNumber(item.confirmedWaste)}</td>
        </tr>
      `
    )
    .join("");

  const activeTransactions = report.transactions.filter((t) => t.status !== "Anulat");
  dailyReportTransactionsEl.innerHTML = activeTransactions
    .map(
      (item) => `
        <tr>
          <td>#${item.id}</td>
          <td>${formatDateShort(item.createdAt)}</td>
          <td>${escapeComboHtml(item.partner)}</td>
          <td>${item.direction === "collection" ? "Incasare" : "Plata"}</td>
          <td>${escapeComboHtml(item.paymentType || "-")}</td>
          <td>${currency.format(Number(item.amount || 0))}</td>
        </tr>
      `
    )
    .join("");
  {
    const inc = activeTransactions.filter((t) => t.direction === "collection").reduce((s, t) => s + Number(t.amount || 0), 0);
    const pla = activeTransactions.filter((t) => t.direction !== "collection").reduce((s, t) => s + Number(t.amount || 0), 0);
    setReportFoot(dailyReportTransactionsFootEl, [
      { colspan: 5, value: `TOTAL (${activeTransactions.length}) · Plăți: ${currency.format(pla)} · Încasări: ${currency.format(inc)}` },
      { value: currency.format(inc + pla) }
    ]);
  }

  const allDeliveries = report.deliveries || [];
  const deliveries = allDeliveries.filter((d) => d.status !== "Anulat");
  dailyReportDeliveriesEl.innerHTML = deliveries
    .map(
      (item) => `
        <tr>
          <td>#${item.id}</td>
          <td>${formatDateShort(item.createdAt)}</td>
          <td>${escapeComboHtml(item.customer)}</td>
          <td>${escapeComboHtml(item.product)}</td>
          <td>${formatNumber(item.deliveredQuantity)}</td>
          <td>${currency.format(deliveryInvoiceTotals(item).totalLei)}</td>
          <td>${escapeComboHtml(item.invoiceNumber || "-")}</td>
        </tr>
      `
    )
    .join("");
  setReportFoot(dailyReportDeliveriesFootEl, [
    { colspan: 4, value: `TOTAL (${deliveries.length})` },
    { value: formatNumber(deliveries.reduce((s, d) => s + Number(d.deliveredQuantity || 0), 0)) },
    { value: currency.format(deliveries.reduce((s, d) => s + deliveryInvoiceTotals(d).totalLei, 0)) },
    { value: "" }
  ]);

  dailyReportComplaintsEl.innerHTML = (report.complaints || [])
    .map(
      (item) => `
        <tr>
          <td>#${item.id}</td>
          <td>${formatDateShort(item.createdAt)}</td>
          <td>${item.deliveryId ? "#" + item.deliveryId : escapeComboHtml(item.customer || "—")}</td>
          <td>${escapeComboHtml(item.complaintType)}</td>
          <td>${formatNumber(item.contestedQuantity)}</td>
          <td>${escapeComboHtml(item.status)}</td>
        </tr>
      `
    )
    .join("");

  // --- Operatiuni anulate (tabel dedicat, ca sa nu se amestece cu cele reale) ---
  // Recepțiile/livrările anulate vin deja filtrate pe SERVER după rol (filterCanceledForRole).
  // Tranzacțiile anulate vin filtrate pe server (doar admin/contabil-șef le primesc); gătuim
  // și aici la afișare ca a doua linie de apărare.
  const role = currentSessionUser?.roleCode;
  const canSeeCanceledTx = role === "admin" || role === "accountant-sef";
  const canceledRows = [
    ...report.receipts
      .filter((r) => r.status === "Anulat")
      .map((r) => ({
        tip: "Recepție",
        id: r.id,
        date: r.canceledAt || r.createdAt,
        partner: r.supplier,
        product: r.product,
        qty: Number(r.grossQuantity || r.quantity || 0),
        by: r.canceledBy,
        reason: r.cancelReason
      })),
    ...allDeliveries
      .filter((d) => d.status === "Anulat")
      .map((d) => ({
        tip: "Livrare",
        id: d.id,
        date: d.canceledAt || d.createdAt,
        partner: d.customer,
        product: d.product,
        qty: Number(d.deliveredQuantity || 0),
        by: d.canceledBy,
        reason: d.cancelReason
      })),
    ...(canSeeCanceledTx
      ? report.transactions
          .filter((t) => t.status === "Anulat")
          .map((t) => ({
            tip: t.direction === "collection" ? "Încasare" : "Plată",
            id: t.id,
            date: t.canceledAt || t.createdAt,
            partner: t.partner,
            product: "—",
            qty: null,
            amount: Number(t.amount || 0),
            by: t.canceledBy,
            reason: t.cancelReason || t.changeReason
          }))
      : [])
  ].sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));

  if (dailyReportCanceledEl) {
    dailyReportCanceledEl.innerHTML = canceledRows.length
      ? canceledRows
          .map(
            (row) => `
        <tr>
          <td>${escapeComboHtml(row.tip)}</td>
          <td>#${escapeComboHtml(String(row.id))}</td>
          <td>${formatDateShort(row.date)}</td>
          <td>${escapeComboHtml(row.partner || "—")}</td>
          <td>${escapeComboHtml(row.product || "—")}</td>
          <td>${row.qty == null ? currency.format(row.amount || 0) : formatNumber(row.qty) + " t"}</td>
          <td>${escapeComboHtml(row.by || "—")}</td>
          <td>${escapeComboHtml(row.reason || "—")}</td>
        </tr>
      `
          )
          .join("")
      : `<tr><td colspan="8" style="text-align:center;color:#94a3b8">Nicio operațiune anulată în perioadă.</td></tr>`;
  }
  if (dailyReportCanceledCountEl) {
    dailyReportCanceledCountEl.textContent = canceledRows.length ? `(${canceledRows.length})` : "";
  }
}

function renderSelectOptions(select, items, mapLabel, placeholder, mapValue = (item) => item.id || item.code) {
  // Ordine alfabetică după eticheta afișată (cerință: filtrele/listele să fie sortate).
  const sorted = [...items].sort((a, b) =>
    String(mapLabel(a)).localeCompare(String(mapLabel(b)), "ro", { numeric: true, sensitivity: "base" })
  );
  const options = [
    `<option value="" disabled selected>${placeholder}</option>`,
    ...sorted.map((item) => `<option value="${mapValue(item)}">${mapLabel(item)}</option>`)
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

// --- Combobox furnizor (type-to-search, optimizat telefon): filtru "contine" + persoana fizica + lasa gol ---
function normalizeComboText(value) {
  return String(value ?? "")
    .toLocaleLowerCase("ro")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();
}

function escapeComboHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

let supplierComboItems = [];
let supplierActiveIndex = -1;

function setSupplierComboItems(suppliers) {
  supplierComboItems = (suppliers || []).map((s) => ({ id: String(s.id), name: String(s.name) }));
}

function closeSupplierSuggestions() {
  supplierSuggestionsEl.hidden = true;
  supplierSuggestionsEl.innerHTML = "";
  supplierSearchInput.setAttribute("aria-expanded", "false");
  supplierActiveIndex = -1;
}

function renderSupplierSuggestions() {
  const raw = supplierSearchInput.value;
  const q = normalizeComboText(raw);
  const matches = q
    ? supplierComboItems.filter((s) => normalizeComboText(s.name).includes(q))
    : supplierComboItems.slice(0, 50);
  const exact = q && supplierComboItems.some((s) => normalizeComboText(s.name) === q);

  const rows = [
    '<li class="combobox-item combobox-empty" role="option" data-action="clear">Lasă gol (completează contabilul)</li>'
  ];
  matches.forEach((s) => {
    rows.push(`<li class="combobox-item" role="option" data-id="${s.id}">${escapeComboHtml(s.name)}</li>`);
  });
  if (raw.trim() && !exact && canAccess("receipt-write")) {
    const safe = escapeComboHtml(raw.trim());
    rows.push(
      `<li class="combobox-item combobox-new" role="option" data-action="new" data-name="${safe}">➕ Adaugă «${safe}» ca persoană fizică</li>`
    );
  }

  supplierSuggestionsEl.innerHTML = rows.join("");
  supplierSuggestionsEl.hidden = false;
  supplierSearchInput.setAttribute("aria-expanded", "true");
  supplierActiveIndex = -1;
}

function chooseSupplier({ id = "", name = "", isNew = false }) {
  if (isNew) {
    supplierIdInput.value = "__new__";
    supplierSearchInput.value = name;
    if (newSupplierNameInput) newSupplierNameInput.value = name;
  } else if (id) {
    supplierIdInput.value = id;
    supplierSearchInput.value = name;
    if (newSupplierNameInput) newSupplierNameInput.value = "";
  } else {
    supplierIdInput.value = "";
    supplierSearchInput.value = "";
    if (newSupplierNameInput) newSupplierNameInput.value = "";
  }
  closeSupplierSuggestions();
  toggleNewSupplierInput();
  renderReceiptEstimate();
}

function handleSuggestionPick(li) {
  if (li.dataset.action === "clear") {
    chooseSupplier({ id: "", name: "" });
  } else if (li.dataset.action === "new") {
    chooseSupplier({ isNew: true, name: li.dataset.name });
  } else if (li.dataset.id) {
    const found = supplierComboItems.find((s) => s.id === li.dataset.id);
    chooseSupplier({ id: li.dataset.id, name: found ? found.name : "" });
  }
}

function restoreSupplierSelection(preferredId) {
  const match = supplierComboItems.find((s) => s.id === String(preferredId));
  if (match) {
    supplierIdInput.value = match.id;
    supplierSearchInput.value = match.name;
  } else {
    supplierIdInput.value = "";
    supplierSearchInput.value = "";
  }
  if (newSupplierNameInput) newSupplierNameInput.value = "";
  toggleNewSupplierInput();
}

function updateActiveSuggestion() {
  const items = Array.from(supplierSuggestionsEl.querySelectorAll(".combobox-item"));
  items.forEach((el, i) => el.classList.toggle("is-active", i === supplierActiveIndex));
  if (items[supplierActiveIndex]) {
    items[supplierActiveIndex].scrollIntoView({ block: "nearest" });
  }
}

function renderReceiptSelectors(config) {
  const currentSelections = {
    supplierId: supplierIdInput.value,
    productId: productSelect.value,
    locationId: locationSelect.value,
    receivedBy: userSelect.value,
    processingProduct: processingProductSelect.value,
    processingSource: processingSourceSelect.value,
    processingDest: processingDestSelect.value,
    processingType: processingTypeSelect.value,
    processingUserId: processingUserSelect.value,
    paymentType: transactionPaymentTypeSelect.value,
    deliveryProduct: deliveryProductSelect.value,
    deliverySource: deliverySourceSelect.value,
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

  setSupplierComboItems(suppliers);
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

  restoreSupplierSelection(currentSelections.supplierId);
  setSelectValue(productSelect, [currentSelections.productId, config.products[0]?.id]);
  setSelectValue(locationSelect, [currentSelections.locationId, config.storageLocations[0]?.id]);
  setSelectValue(userSelect, [currentSessionUser?.id, currentSelections.receivedBy, operators[0]?.id]);
  setSelectValue(openingStockProductEl, [openingStockProductEl.value, config.products[0]?.id]);
  setSelectValue(openingStockLocationEl, [openingStockLocationEl.value, config.storageLocations[0]?.id]);
  setSelectValue(openingDebtPartnerEl, [openingDebtPartnerEl.value, config.partners[0]?.id]);
  syncUnitByProduct();

  // Procesare pe produs: produs + cilindru sursa + cilindru destinatie (1-4).
  const cylinders = config.storageLocations.filter(
    (item) => String(item.type || "").toLowerCase() === "cilindru"
  );
  renderSelectOptions(
    processingProductSelect,
    config.products,
    (item) => item.name,
    "Selecteaza produs",
    (item) => item.name
  );
  renderSelectOptions(
    processingSourceSelect,
    config.storageLocations,
    (item) => item.name,
    "Din cilindru / locatie",
    (item) => item.name
  );
  renderSelectOptions(
    processingDestSelect,
    cylinders,
    (item) => item.name,
    "Rămâne în sursă",
    (item) => item.name
  );
  // Optiunea goala = produsul ramane in cilindrul sursa (ex: la curatire fara mutare).
  const destPlaceholder = processingDestSelect.querySelector('option[value=""]');
  if (destPlaceholder) destPlaceholder.disabled = false;
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
  // Livrare pe PRODUS + cilindru sursa (#14): nu mai pe lot de receptie.
  renderSelectOptions(
    deliveryProductSelect,
    config.products,
    (item) => item.name,
    "Selecteaza produs",
    (item) => item.name
  );
  renderSelectOptions(
    deliverySourceSelect,
    config.storageLocations,
    (item) => item.name,
    "Din cilindru / locatie",
    (item) => item.name
  );
  renderSelectOptions(
    deliveryCustomerSelect,
    customers,
    (item) => item.name,
    "Selecteaza cumparator"
  );
  // Reclamații: cumpărători UNICI (firma o singură dată) + produs separat
  if (complaintCustomerSelect) {
    const uniqueCustomers = (config.partners || []).filter(
      (p) => p.role === "cumparator" || p.role === "ambele"
    );
    renderSelectOptions(complaintCustomerSelect, uniqueCustomers, (item) => item.name, "Selectează firma", (item) => item.id);
  }
  if (complaintProductSelect) {
    renderSelectOptions(complaintProductSelect, config.products, (item) => item.name, "Selectează produsul", (item) => item.name);
  }
  renderSelectOptions(
    complaintDeliverySelect,
    deliveriesCache,
    (item) => `#${item.id} - ${item.customer} - ${item.product}`,
    "— fără livrare anume —"
  );

  const activePaymentType = config.paymentTypes.find((item) => item.active);
  setSelectValue(processingProductSelect, [currentSelections.processingProduct, config.products[0]?.name]);
  setSelectValue(processingSourceSelect, [currentSelections.processingSource, config.storageLocations[0]?.name]);
  setSelectValue(processingDestSelect, [currentSelections.processingDest]);
  renderProcessingEstimate();
  setSelectValue(
    processingTypeSelect,
    [currentSelections.processingType, config.processingTypes.find((item) => item.active)?.name]
  );
  updateProcessingTypeUI();
  setSelectValue(processingUserSelect, [currentSelections.processingUserId, currentSessionUser?.id, operators[0]?.id]);
  setSelectValue(transactionPaymentTypeSelect, [currentSelections.paymentType, activePaymentType?.name]);
  setSelectValue(deliveryProductSelect, [currentSelections.deliveryProduct, config.products[0]?.name]);
  setSelectValue(deliverySourceSelect, [currentSelections.deliverySource, config.storageLocations[0]?.name]);
  updateDeliverySourceOptions();
  renderDeliveryPreview();
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
    // Optiuni pentru filtrele de pe pagina Transferuri (produs + cilindru), pastrand selectia.
    const tProdFilter = document.getElementById("transfer-product-filter");
    if (tProdFilter) {
      const prev = tProdFilter.value;
      tProdFilter.innerHTML =
        '<option value="">Toate produsele</option>' +
        config.products.map((p) => `<option value="${escapeComboHtml(p.name)}">${escapeComboHtml(p.name)}</option>`).join("");
      tProdFilter.value = prev;
    }
    const tLocFilter = document.getElementById("transfer-loc-filter");
    if (tLocFilter) {
      const prev = tLocFilter.value;
      tLocFilter.innerHTML =
        '<option value="">Toate locatiile</option>' +
        cylinders.map((l) => `<option value="${escapeComboHtml(l.name)}">${escapeComboHtml(l.name)}</option>`).join("");
      tLocFilter.value = prev;
    }
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

  receiptProductFilterEl.innerHTML = [
    '<option value="">Toate produsele</option>',
    ...productNames.map((name) => `<option value="${name}">${name}</option>`)
  ].join("");

  processingTypeFilterEl.innerHTML = [
    '<option value="">Toate procesarile</option>',
    ...processingTypes.map((name) => `<option value="${name}">${name}</option>`)
  ].join("");

  // Filtru dupa produs la procesare (Modul C) — produse din procesari sau din receptii
  if (processingProductFilterEl) {
    const procProducts = Array.from(
      new Set([...processingsCache.map((p) => p.product), ...productNames].filter(Boolean))
    ).sort((a, b) => String(a).localeCompare(String(b), "ro"));
    processingProductFilterEl.innerHTML = [
      '<option value="">Toate produsele</option>',
      ...procProducts.map((name) => `<option value="${name}">${name}</option>`)
    ].join("");
  }

  // #15a: filtru dupa produs la "Miscare stoc pe perioada".
  const stockPeriodProductEl = document.getElementById("stock-period-product");
  if (stockPeriodProductEl) {
    const prev = stockPeriodProductEl.value;
    stockPeriodProductEl.innerHTML = [
      '<option value="">Toate produsele</option>',
      ...productNames.map((name) => `<option value="${name}">${name}</option>`)
    ].join("");
    stockPeriodProductEl.value = productNames.includes(prev) ? prev : "";
  }
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
  fields: [
    { key: "name", label: "Denumire câmp" },
    { key: "area", label: "Suprafață (ha)", format: "number" },
    { key: "note", label: "Observații" }
  ],
  companies: [
    { key: "name", label: "Denumire" },
    { key: "series", label: "Serie" },
    { key: "idno", label: "IDNO" },
    { key: "vatCode", label: "Cod TVA" },
    { key: "address", label: "Adresa" },
    { key: "iban", label: "IBAN" },
    { key: "admin", label: "Administrator" }
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
    { key: "lossMethod", label: "Calcul pierdere", format: "lossMethod" },
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
  if (format === "lossMethod") {
    if (value === "umiditate") return "Uscare (umiditate)";
    if (value === "deseu") return "Curățire (deșeu)";
    if (value === "fara") return "Fără pierdere";
    return String(value);
  }
  if (format === "number" && typeof formatNumber === "function") return formatNumber(value);
  return escapeComboHtml(String(value));
}

function getCellValue(item, col) {
  let val = item[col.key];
  if ((val === undefined || val === null || val === "") && col.fallback) {
    val = item[col.fallback];
  }
  return formatCellValue(val, col.format);
}

// #3 Filtru parteneri: nume/IDNO/telefon (fara diacritice) + rol + statut fiscal + stare.
function applyPartnerFilters(items) {
  const norm = (v) =>
    typeof normalizeComboText === "function"
      ? normalizeComboText(v || "")
      : String(v || "").toLowerCase().trim();
  const q = norm(partnerFilters.q);
  return items.filter((p) => {
    if (partnerFilters.role && String(p.role || "") !== partnerFilters.role) return false;
    if (partnerFilters.fiscal && String(p.fiscalProfile || "") !== partnerFilters.fiscal) return false;
    if (partnerFilters.status === "temporar" && p.status !== "temporar") return false;
    if (partnerFilters.status === "validat" && p.status === "temporar") return false;
    if (q && !norm(`${p.name || ""} ${p.idno || ""} ${p.phone || ""}`).includes(q)) return false;
    return true;
  });
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

  // Parteneri: afisare alfabetica dupa nume (ro). Nu mutam sursa currentConfig.
  const displayItems =
    entity === "partners"
      ? [...items].sort((a, b) =>
          String(a.name || "").localeCompare(String(b.name || ""), "ro", { sensitivity: "base" })
        )
      : items;

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
  const hasStatus = displayItems.some((it) => Object.prototype.hasOwnProperty.call(it, "active"));
  const statusHeader = hasStatus ? "<th>Status</th>" : "";

  // Admin poate modifica orice nomenclator; contabilul poate edita/valida partenerii.
  const canModify =
    canAccess("nomenclator-update") || (entity === "partners" && canAccess("nomenclator-create"));
  const rowSource = entity === "partners" ? applyPartnerFilters(displayItems) : displayItems;
  if (entity === "partners") {
    const cEl = document.getElementById("partner-filter-count");
    if (cEl) cEl.textContent = `${rowSource.length} / ${displayItems.length}`;
  }
  const rows = rowSource
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
      const canDelete = entity === "partners" && canAccess("nomenclator-update");
      const deleteBtn = canDelete
        ? `<button class="cell-btn cell-btn-danger" type="button" data-action="delete" data-entity="${entity}" data-id="${item.id}" title="Sterge partener">Șterge</button>`
        : "";
      const actionsCell = canModify
        ? `<td class="cell-actions">${editBtn}${toggleBtn}${deleteBtn}</td>`
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
    "labReports",
    "companies",
    "fields"
  ].forEach((entity) => renderMiniList(entity, config[entity] || []));
}

function renderSetupSelectors(config) {
  fiscalProfileOptions.innerHTML = config.fiscalProfiles
    .map((item) => `<option value="${item.name}">${item.name}</option>`)
    .join("");

  // #3 Optiuni statut fiscal in filtrul de parteneri (pastreaza selectia curenta).
  const partnerFiscalFilter = document.getElementById("partner-filter-fiscal");
  if (partnerFiscalFilter) {
    const prev = partnerFilters.fiscal;
    partnerFiscalFilter.innerHTML =
      '<option value="">Toate statuturile fiscale</option>' +
      config.fiscalProfiles
        .map((item) => `<option value="${item.name}">${item.name}</option>`)
        .join("");
    partnerFiscalFilter.value = prev || "";
  }

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
  // Select „Câmp" la recepție (din nomenclatorul Câmpuri); gol = fără câmp.
  const receiptFieldSelect = document.getElementById("receipt-field-select");
  if (receiptFieldSelect) {
    const prevF = receiptFieldSelect.value;
    receiptFieldSelect.innerHTML =
      `<option value="">— fără câmp —</option>` +
      (config.fields || [])
        .filter((f) => f.active !== false)
        .map((f) => {
          const ha = Number(f.area) > 0 ? ` (${formatNumber(f.area)} ha)` : "";
          return `<option value="${escapeComboHtml(String(f.id))}">${escapeComboHtml(f.name)}${ha}</option>`;
        })
        .join("");
    if (prevF) receiptFieldSelect.value = prevF;
  }
  // Select mașină la livrare (din nomenclator); gol = mașina cumpărătorului (la observații).
  if (deliveryVehicleSelect) {
    const prevV = deliveryVehicleSelect.value;
    deliveryVehicleSelect.innerHTML =
      `<option value="">Mașina cumpărătorului (notează la Observații)</option>` +
      (config.vehicles || [])
        .filter((v) => v.active !== false)
        .map((v) => {
          const extra = [v.series, v.driver].filter(Boolean).join(" · ");
          return `<option value="${escapeComboHtml(v.number)}">${escapeComboHtml(v.number)}${extra ? " — " + escapeComboHtml(extra) : ""}</option>`;
        })
        .join("");
    if (prevV) deliveryVehicleSelect.value = prevV;
  }
  // Select remorcă la livrare (din acelasi nomenclator Masini); gol = fara remorca.
  if (deliveryTrailerSelect) {
    const prevT = deliveryTrailerSelect.value;
    deliveryTrailerSelect.innerHTML =
      `<option value="">Fără remorcă</option>` +
      (config.vehicles || [])
        .filter((v) => v.active !== false)
        .map((v) => {
          const extra = [v.series, v.driver].filter(Boolean).join(" · ");
          return `<option value="${escapeComboHtml(v.number)}">${escapeComboHtml(v.number)}${extra ? " — " + escapeComboHtml(extra) : ""}</option>`;
        })
        .join("");
    if (prevT) deliveryTrailerSelect.value = prevT;
  }

  // Populate supplier select for Act de verificare (Etapa 7)
  const statementPartnerSelect = document.getElementById("statement-partner-select");
  if (statementPartnerSelect) {
    // Toți partenerii (furnizori ȘI cumpărători), alfabetic — actul de verificare e universal.
    const partners = (config.partners || [])
      .slice()
      .sort((a, b) => String(a.name || "").localeCompare(String(b.name || ""), "ro", { sensitivity: "base" }));
    const prev = statementPartnerSelect.value;
    statementPartnerSelect.innerHTML =
      '<option value="">Selectează partenerul</option>' +
      partners.map((p) => `<option value="${p.id}">${escapeComboHtml(p.name || "")}</option>`).join("");
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
    fields: {
      title: "Editare câmp",
      copy: "Câmpul agricol de unde se recoltează roada (pentru alegere la recepție și analiză).",
      fields: [
        { name: "name", label: "Denumire câmp", type: "text" },
        { name: "area", label: "Suprafață (ha)", type: "number", step: "0.01" },
        { name: "note", label: "Observații", type: "text" },
        commonActiveField
      ]
    },
    companies: {
      title: "Editare companie",
      copy: "Datele companiei care emite documentele de tipar (act de achiziție, contract, ordin de plată).",
      fields: [
        { name: "name", label: "Denumire completă", type: "text" },
        { name: "shortName", label: "Denumire scurtă", type: "text" },
        { name: "series", label: "Serie documente (ex. PAT, AGR)", type: "text" },
        { name: "idno", label: "IDNO", type: "text" },
        { name: "vatCode", label: "Cod TVA", type: "text" },
        { name: "address", label: "Adresa", type: "text" },
        { name: "iban", label: "IBAN", type: "text" },
        { name: "bank", label: "Banca", type: "text" },
        { name: "bic", label: "BIC / cod bancă", type: "text" },
        { name: "admin", label: "Administrator", type: "text" },
        { name: "phone", label: "Telefon / fax", type: "text" },
        { name: "email", label: "Email", type: "text" },
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
        { name: "grainType", label: "Tipul", type: "text" },
        { name: "subtype", label: "Subtipul", type: "text" },
        { name: "grainClass", label: "Clasa", type: "text" },
        { name: "quality", label: "Calitatea", type: "text" },
        { name: "color", label: "Culoare", type: "text" },
        { name: "smell", label: "Miros", type: "text" },
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
        { name: "cmrDescription", label: "Descriere CMR (caseta 9)", type: "text" },
        { name: "invoiceName", label: "Denumire pentru invoice/certificat", type: "text" },
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

  // La parolă: oprim autocompletarea browserului (altfel umple câmpul cu o parolă salvată,
  // posibil slabă/scurtă, care apoi pică politica strictă și blochează toată editarea).
  // Gol = parola NU se schimbă.
  const passwordAttrs =
    field.type === "password"
      ? ' autocomplete="new-password" placeholder="Lasă gol ca să NU schimbi parola"'
      : "";
  return `
    <label>
      ${field.label}
      <input
        name="${field.name}"
        type="${field.type || "text"}"
        value="${safeValue.replace(/"/g, "&quot;")}"
        ${passwordAttrs}
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
    (item) => String(item.id) === String(supplierIdInput.value)
  );
  const fiscalProfile = currentConfig.fiscalProfiles.find(
    (item) => item.name === selectedPartner?.fiscalProfile
  );
  // Cantarire in 2 pasi: net (kg) = brut − tara; calculul intern (servicii, stoc) e in tone.
  const grossKg = Number(grossWeightInput.value || 0);
  const tareKg = Number(tareWeightInput.value || 0);
  const quantity = Math.max(grossKg - tareKg, 0) / 1000;
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
  const preliminaryMerchandiseValue = provisionalNetQuantity * 1000 * price; // kg × lei/kg
  // Aceeasi regula ca in backend (computeReceiptEstimate): costul marfii ramane BRUT, iar impozitul
  // retinut la sursa se scade din datoria catre furnizor. Serviciile NU se scad (barter, plati).
  const withholdingPercent = Number(fiscalProfile?.withholdingPercent || 0);
  const withholdingAmount = preliminaryMerchandiseValue * (withholdingPercent / 100);
  const preliminaryPayableAmount = Math.max(preliminaryMerchandiseValue - withholdingAmount, 0);

  return {
    humidityNorm,
    impurityNorm,
    provisionalNetQuantity,
    preliminaryServicesTotal,
    preliminaryMerchandiseValue,
    withholdingPercent,
    withholdingAmount,
    preliminaryPayableAmount
  };
}

function toggleNewSupplierInput() {
  const isNew = supplierIdInput.value === "__new__";
  if (newSupplierWrap) {
    newSupplierWrap.hidden = !isNew;
  }
  if (newSupplierNameInput) {
    newSupplierNameInput.required = isNew;
    // Numele e setat de chooseSupplier() din textul tastat; nu golim/focusam aici
    // (focus() ar muta tastatura de pe combobox pe telefon).
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

  // Hint sub tara: net = brut - tara. Daca tara goala -> receptie "in descarcare".
  if (netQtyHintEl) {
    const grossKg = Number(grossWeightInput.value || 0);
    const tareKg = Number(tareWeightInput.value || 0);
    if (grossKg > 0 && tareKg > 0) {
      const netKg = Math.max(grossKg - tareKg, 0);
      netQtyHintEl.textContent = "Net: " + formatNumber(netKg) + " kg = " + formatNumber(netKg / 1000) + " tone";
    } else if (grossKg > 0) {
      netQtyHintEl.textContent = "Fara tara -> se salveaza \u00abin descarcare\u00bb";
    } else {
      netQtyHintEl.textContent = " ";
    }
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
  renderDashFeed();
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
  updateDeliverySourceOptions();
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
  const fProd = document.getElementById("transfer-product-filter")?.value || "";
  const fLoc = document.getElementById("transfer-loc-filter")?.value || "";
  const dFrom = document.getElementById("transfer-date-from");
  const dTo = document.getElementById("transfer-date-to");
  const filtered = (transfers || []).filter(
    (t) =>
      (!fProd || t.product === fProd) &&
      (!fLoc || t.fromLocation === fLoc || t.toLocation === fLoc) &&
      withinDateRange(t, ["createdAt"], dFrom, dTo) &&
      canViewCanceled(t)
  );
  transfersBodyEl.innerHTML = filtered
    .map(
      (item) => `
        <tr>
          <td>#${item.id}</td>
          <td>${formatDateShort(item.createdAt)}</td>
          <td>${item.product}</td>
          <td>${item.fromLocation}</td>
          <td>${item.toLocation}</td>
          <td>${formatNumber(Math.round(Number(item.quantity || 0) * 1000))} kg</td>
          <td>${item.operator || "-"}</td>
          <td>${docActionsCell("transfer", item) || "—"}</td>
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
    (item) => sameLocation(item.location, fromLoc.name) && item.product === product.name
  );
  const available = Number(row?.quantity || 0);
  // Stoc disponibil afisat sub selectul "Din cilindru".
  const fromHintEl = document.getElementById("transfer-from-hint");
  if (fromHintEl) {
    fromHintEl.innerHTML = `Disponibil: ${formatNumber(Math.round(available * 1000))} kg (${formatNumber(available)} t)`;
  }
  // #12: avertizare destinatie (sub Cantitate) — alt produs in cilindru sau capacitate.
  let html = "&nbsp;";
  const toLoc = currentConfig.storageLocations.find(
    (item) => String(item.id) === String(transferToSelect.value)
  );
  if (toLoc) {
    const destItems = (lastStockSummary.byLocation || []).filter(
      (item) => sameLocation(item.location, toLoc.name) && Number(item.quantity || 0) > 0
    );
    const other = String(toLoc.type || "").toLowerCase() === "cilindru"
      ? destItems.find((item) => item.product !== product.name)
      : null;
    const destCurrent = destItems.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
    const cap = Number(toLoc.capacity || 0) / 1000; // kg -> tone
    if (other) {
      html = `<span class="transfer-warn">⚠ În ${escapeComboHtml(toLoc.name)} este deja ${escapeComboHtml(other.product)} — o locație = un singur produs.</span>`;
    } else if (cap > 0) {
      const liber = Math.max(cap - destCurrent, 0);
      html = `<span class="field-hint">Mai încap în ${escapeComboHtml(toLoc.name)}: ${formatNumber(Math.round(liber * 1000))} kg (${formatNumber(liber)} t)</span>`;
    }
  }
  transferAvailableHintEl.innerHTML = html;
}

// Produsul aflat deja in cilindrul ales, daca difera de cel care intra (sau null).
// Citeste din ultimul stoc incarcat (lastStockSummary). Regula "un produs / cilindru".
// Compara doua nume de locatie ignorand litere mari/mici si spatii (locatiile cu duplicat de
// caz sunt unite in stoc; potrivirile pe locatie trebuie sa fie la fel ca in backend).
function sameLocation(a, b) {
  return String(a || "").trim().toLowerCase() === String(b || "").trim().toLowerCase();
}

function cylinderConflictProduct(locationName, productName) {
  const loc = (currentConfig?.storageLocations || []).find((l) => l.name === locationName);
  // Regula un-produs se aplica oriunde NU e "multiProduct" (cilindri + groapa etc.).
  if (!loc || loc.multiProduct === true) return null;
  const other = ((lastStockSummary && lastStockSummary.byLocation) || [])
    .filter((i) => sameLocation(i.location, locationName) && Number(i.quantity || 0) > 0)
    .find((i) => i.product !== productName);
  return other ? other.product : null;
}

// Hint sub selectorul de locatie la RECEPTIE: arata ce contine cilindrul ales si
// avertizeaza rosu daca produsul receptionat difera (o locație = un singur produs).
function updateReceiptLocationHint() {
  const hintEl = document.getElementById("receipt-location-hint");
  if (!hintEl || !currentConfig) return;
  const loc = currentConfig.storageLocations.find((l) => String(l.id) === String(locationSelect.value));
  const product = currentConfig.products.find((p) => String(p.id) === String(productSelect.value));
  if (!loc || loc.multiProduct === true || !lastStockSummary) {
    hintEl.innerHTML = "";
    return;
  }
  const items = (lastStockSummary.byLocation || []).filter(
    (i) => sameLocation(i.location, loc.name) && Number(i.quantity || 0) > 0
  );
  if (!items.length) {
    hintEl.innerHTML = `<span class="field-hint">${escapeComboHtml(loc.name)}: gol</span>`;
    return;
  }
  const other = product ? items.find((i) => i.product !== product.name) : null;
  if (other) {
    hintEl.innerHTML = `<span class="transfer-warn">⚠ ${escapeComboHtml(loc.name)} conține deja ${escapeComboHtml(other.product)} — o locație = un singur produs.</span>`;
  } else {
    const content = items
      .map((i) => `${escapeComboHtml(i.product)} (${formatNumber(Number(i.quantity || 0))} t)`)
      .join(", ");
    hintEl.innerHTML = `<span class="field-hint">${escapeComboHtml(loc.name)} conține: ${content}</span>`;
  }
}

// Hint la PROCESARE (cilindru destinatie): avertizare rosie daca cilindrul are alt produs.
function updateProcessingDestHint() {
  const hintEl = document.getElementById("processing-dest-hint");
  if (!hintEl || !currentConfig) return;
  const loc = currentConfig.storageLocations.find((l) => l.name === processingDestSelect.value);
  const productName = processingProductSelect.value;
  if (!loc || loc.multiProduct === true || !lastStockSummary) {
    hintEl.innerHTML = "";
    return;
  }
  const other = (lastStockSummary.byLocation || [])
    .filter((i) => sameLocation(i.location, loc.name) && Number(i.quantity || 0) > 0)
    .find((i) => i.product !== productName);
  hintEl.innerHTML = other
    ? `<span class="transfer-warn">⚠ ${escapeComboHtml(loc.name)} conține deja ${escapeComboHtml(other.product)} — o locație = un singur produs.</span>`
    : "";
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
  renderDashFeed();
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
  // Citirea soldurilor inițiale e necesară în Achitări/Încasări (toți cei cu finanțe),
  // dar introducerea ecranului „Sold inițial" rămâne doar la admin (capabilitatea "opening").
  if (!canAccess("opening-read")) {
    openingDocumentsCache = [];
    renderOpenJournal();
    return;
  }
  const response = await fetch("/api/opening-documents");
  const data = await response.json();
  openingDocumentsCache = data.openingDocuments;
  renderOpenJournal();
  renderOpeningDocsList();
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
  const today = new Date().toISOString().slice(0, 10);
  const from = dailyReportFromEl?.value || today;
  const to = dailyReportToEl?.value || from;
  const response = await fetch(
    `/api/reports/daily?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`
  );
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

// Prima zi a lunii curente, format "YYYY-MM-01" (pentru filtrele de perioadă).
function firstDayOfCurrentMonthISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
}

// Implicit, tabelele „recente" (recepții, procesări, transferuri, plăți, livrări) arată LUNA
// CURENTĂ — filtrul „De la" se pune pe 1 ale lunii. Pentru a vedea istoric, utilizatorul schimbă
// filtrul. Se aplică la fiecare autentificare (loadDashboard); în timpul sesiunii filtrele rămân
// cum le pune utilizatorul.
function applyCurrentMonthDefaults() {
  const from = firstDayOfCurrentMonthISO();
  ["receipt-date-from", "processing-date-from", "transfer-date-from", "transaction-date-from", "delivery-date-from"]
    .forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.value = from;
    });
}

async function loadDashboard() {
  const reportToday = new Date().toISOString().slice(0, 10);
  if (dailyReportFromEl) dailyReportFromEl.value = reportToday;
  if (dailyReportToEl) dailyReportToEl.value = reportToday;
  openingDocumentDateEl.value = new Date().toISOString().slice(0, 10);
  // Tabelele „recente" pornesc pe luna curentă (istoricul se vede schimbând filtrul „De la").
  applyCurrentMonthDefaults();
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
  // La bootstrap (jurnalul de audit e deja încărcat mai sus): randează panoul „Activitate
  // utilizatori" dacă vederea implicită e Rapoarte — pentru admin cu date, pentru restul golit+ascuns.
  renderUserActivity();
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

  const grossKg = Number(formData.get("grossWeightKg") || 0);
  const tareKg = Number(formData.get("tareWeightKg") || 0);
  const isPending = !(tareKg > 0); // fara tara -> receptie "in descarcare" (asteapta a 2-a cantarire)
  const netKg = Math.max(grossKg - tareKg, 0);

  // Valoarea NU se trimite stocata: se deriva mereu din cantitate(kg) × pret(lei/kg) la afisare
  // (receiptPayableValue), ca sa fie consecventa si pentru receptiile vechi. Contabilul o poate
  // suprascrie manual cu ✎.
  const payload = {
    supplierId: supplierId,
    supplier: partner?.name || "",
    productId: formData.get("productId"),
    product: product?.name || "",
    quantity: String(isPending ? 0 : netKg / 1000),
    grossWeight: String(grossKg),
    tareWeight: String(isPending ? 0 : tareKg),
    enteredUnit: "kg",
    unit: product?.unit || formData.get("unit"),
    price: formData.get("price") || "0",
    humidity: formData.get("humidity") || String(selectedProduct?.humidityNorm ?? 0),
    impurity: formData.get("impurity") || String(selectedProduct?.impurityNorm ?? 0),
    vehicle: formData.get("vehicle"),
    note: formData.get("note"),
    photos: gatherPhotos("receipt-photo-brut", "receipt-photo-neto", "receipt-photo-masina"),
    locationId: formData.get("locationId"),
    location: location?.name || "",
    receivedBy: receiver?.name || currentSessionUser?.name || "",
    source: "dashboard",
    status: isPending ? "In descarcare" : "Draft"
  };

  // Câmpul agricol (opțional) de unde e roada — trimitem id + denumire pentru analiză.
  const selectedField = (currentConfig.fields || []).find((f) => String(f.id) === String(formData.get("fieldId")));
  if (selectedField) {
    payload.fieldId = selectedField.id;
    payload.fieldName = selectedField.name;
  }

  // Avertizare "un produs / cilindru": daca cilindrul ales are deja alt produs, confirma.
  const receiptConflict = cylinderConflictProduct(location?.name, product?.name);
  if (receiptConflict) {
    const ok = window.confirm(
      `Atenție! Recepționezi ${product?.name || "produsul"} în ${location?.name}, dar acolo este deja ${receiptConflict}.\nO locație ar trebui să aibă un singur produs. Continui?`
    );
    if (!ok) {
      const cancelErr = new Error("Recepție anulată — cilindru cu alt produs.");
      cancelErr.cancelled = true;
      throw cancelErr;
    }
    payload.allowMixedProduct = true;
  }

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

  // Afisare optimista: folosim recepatia creata din raspuns si o punem direct in lista.
  // Pe serverless, un GET imediat dupa POST poate citi KV-ul inca nesincronizat (flush dupa
  // raspuns), deci recepatia "lipsea" pana la refresh. Asa apare instant, fara re-fetch.
  const createdReceipt = await response.json().catch(() => null);
  if (createdReceipt && createdReceipt.id) {
    receiptsCache = [
      createdReceipt,
      ...(Array.isArray(receiptsCache) ? receiptsCache.filter((r) => r.id !== createdReceipt.id) : [])
    ];
    renderReceipts(receiptsCache);
  }
  ["receipt-photo-brut", "receipt-photo-neto", "receipt-photo-masina"].forEach((id) => resetPhotoField(id));
}

function validateReceiptForm(formData) {
  // Defensive: bail out early if config is still loading
  if (!currentConfig || !Array.isArray(currentConfig.partners) || !currentConfig.partners.length) {
    return "Configurarea încă se încarcă. Mai încearcă în câteva secunde.";
  }

  const supplierId = formData.get("supplierId");
  // Furnizorul e OPTIONAL: poate fi lasat gol (contabilul completeaza ulterior).
  if (supplierId === "__new__") {
    // Furnizor nou (persoana fizica) introdus pe loc de operator
    if (!String(formData.get("newSupplierName") || "").trim()) {
      return "Scrie numele furnizorului nou.";
    }
  } else if (supplierId) {
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

  const grossKg = Number(formData.get("grossWeightKg") || 0);
  const tareKg = Number(formData.get("tareWeightKg") || 0);
  if (!(grossKg > 0)) {
    return "Introdu masa brută (camion plin).";
  }
  if (tareKg > 0 && tareKg >= grossKg) {
    return "Tara trebuie să fie mai mică decât masa brută.";
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
  if (!formData.get("product")) {
    return "Selecteaza produsul de livrat.";
  }

  if (!formData.get("sourceLocation")) {
    return "Selecteaza cilindrul / locatia sursa.";
  }

  if (!formData.get("customerId")) {
    return "Selecteaza cumparatorul.";
  }

  const gross = Number(formData.get("grossWeight") || 0);
  const tare = Number(formData.get("tareWeight") || 0);
  const net = gross > 0 ? Math.max(gross - tare, 0) : Number(formData.get("deliveredQuantity") || 0);
  if (net <= 0) {
    return "Introdu masa (brut > tară) sau cantitatea livrată.";
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
    supplierId: preserveContext ? supplierIdInput.value : "",
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
    restoreSupplierSelection(preservedValues.supplierId);
    setSelectValue(productSelect, [preservedValues.productId]);
    setSelectValue(locationSelect, [preservedValues.locationId]);
    setSelectValue(userSelect, [preservedValues.receivedBy, currentSessionUser?.id]);
  }

  formEl.elements.price.value = preservedValues.price || "";
  humidityInput.value = preservedValues.humidity || "";
  impurityInput.value = preservedValues.impurity || "";
  if (grossWeightInput) grossWeightInput.value = "";
  if (tareWeightInput) tareWeightInput.value = "";
  formEl.elements.vehicle.value = "";
  formEl.elements.note.value = "";
  syncUnitByProduct();
  if (grossWeightInput) grossWeightInput.focus();
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
    product: preserveContext ? deliveryProductSelect.value : "",
    sourceLocation: preserveContext ? deliverySourceSelect.value : "",
    customerId: preserveContext ? deliveryCustomerSelect.value : "",
    contractNumber: preserveContext ? fieldValue("contractNumber") : "",
    contractDate: preserveContext ? fieldValue("contractDate") : ""
  };

  deliveryFormEl.reset();
  if (currentConfig) {
    renderReceiptSelectors(currentConfig);
  }

  if (preserveContext) {
    setSelectValue(deliveryProductSelect, [preservedValues.product]);
    setSelectValue(deliverySourceSelect, [preservedValues.sourceLocation]);
    setSelectValue(deliveryCustomerSelect, [preservedValues.customerId]);
    setField("contractNumber", preservedValues.contractNumber || "");
    setField("contractDate", preservedValues.contractDate || "");
  }

  setField("grossWeight", "");
  setField("tareWeight", "");
  setField("vehicle", "");
  setField("invoiceNumber", "");
  setField("note", "");
  renderDeliveryPreview();
  const grossEl = deliveryFormEl.elements.grossWeight;
  if (grossEl) grossEl.focus();
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

function getProcessingAvailable() {
  const product = processingProductSelect.value;
  const source = processingSourceSelect.value;
  if (!product || !source || !lastStockSummary) return 0;
  const row = (lastStockSummary.byLocation || []).find(
    (i) => sameLocation(i.location, source) && i.product === product
  );
  return Number(row?.quantity || 0);
}

const PROCESSING_LOSS_METHODS = ["umiditate", "deseu", "fara"];
// Oglinda backend-ului (src/local-storage.js): categoria de calcul a pierderii
// pentru un tip de procesare. Date vechi fara lossMethod -> deducem din nume.
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
function selectedProcessingLossMethod() {
  const name = processingTypeSelect?.value || "";
  const list = (currentConfig && currentConfig.processingTypes) || [];
  return resolveLossMethod(list.find((t) => t.name === name) || { name });
}
// Arata/ascunde rândul de umiditate + cardul de apa dupa tipul ales. La non-uscare
// goleste umiditatile (sa nu ramana valori stale) si reseteaza estimatul.
function updateProcessingTypeUI() {
  const method = selectedProcessingLossMethod();
  const usesHumidity = method === "umiditate";
  const usesWaste = method === "deseu";
  const humidityRow = document.getElementById("processing-humidity-row");
  const waterCard = document.getElementById("processing-water-card");
  const wasteField = document.getElementById("processing-waste-field");
  if (humidityRow) humidityRow.style.display = usesHumidity ? "" : "none";
  if (waterCard) waterCard.style.display = usesHumidity ? "" : "none";
  // "Deseu confirmat" apare doar la curatire; la uscare/ventilare/pastrare se ascunde.
  if (wasteField) wasteField.style.display = usesWaste ? "" : "none";
  if (!usesHumidity) {
    if (processingInitialHumidityInput) processingInitialHumidityInput.value = "";
    if (processingFinalHumidityInput) processingFinalHumidityInput.value = "";
  } else {
    autofillProcessingInitialHumidity();
  }
  if (!usesWaste && confirmedWasteInput) confirmedWasteInput.value = "";
  renderProcessingEstimate();
}

function renderProcessingEstimate() {
  // Inputurile sunt in KG (ca la recepții și livrări); stocul intern e in tone.
  const availableT = getProcessingAvailable();
  const availableKg = availableT * 1000;
  const processedKg = Number(processedQuantityInput.value || 0);
  const wasteKg = Number(confirmedWasteInput.value || 0);
  const usesHumidity = selectedProcessingLossMethod() === "umiditate";
  const initialHum = usesHumidity ? Number(processingInitialHumidityInput?.value || 0) : 0;
  const finalHum = usesHumidity ? Number(processingFinalHumidityInput?.value || 0) : 0;
  // Apa se scade DOAR la uscare; la curatire/pastrare umiditatile se ignora.
  const humidityInverted = usesHumidity && initialHum > 0 && finalHum > initialHum;
  const waterKg =
    usesHumidity && initialHum > 0 && finalHum > 0 && !humidityInverted
      ? Math.max((processedKg * (initialHum - finalHum)) / 100, 0)
      : 0;
  const finalNetKg = Math.max(processedKg - wasteKg - waterKg, 0);

  if (processingAvailableEl) {
    processingAvailableEl.textContent = `${formatNumber(availableKg)} kg (${formatNumber(availableT)} t)`;
    processingAvailableEl.style.color =
      Math.round(processedKg) > Math.round(availableKg) ? "#b3261e" : "";
  }
  if (processingWaterEl) {
    processingWaterEl.textContent = humidityInverted
      ? "finală > inițială"
      : `${formatNumber(Number(waterKg.toFixed(1)))} kg`;
    processingWaterEl.style.color = humidityInverted ? "#b3261e" : "";
  }
  if (processingFinalNetEl) {
    processingFinalNetEl.textContent = `${formatNumber(Number(finalNetKg.toFixed(1)))} kg`;
    // Avertizare vizuală dacă net rămas ar fi 0 (deșeu/apă mai mari decât cantitatea)
    processingFinalNetEl.style.color = processedKg > 0 && finalNetKg <= 0 ? "#b3261e" : "";
  }
}

// Prefill umiditate initiala din ultima receptie a produsului in locatia sursa.
function autofillProcessingInitialHumidity() {
  if (!processingInitialHumidityInput || processingInitialHumidityInput.value) return;
  const product = processingProductSelect.value;
  const source = processingSourceSelect.value;
  if (!product || !source) return;
  const match = receiptsCache
    .filter((r) => r.product === product && r.location === source && r.status !== "Anulat")
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
  if (match && Number(match.humidity) > 0) {
    processingInitialHumidityInput.value = match.humidity;
  }
}

async function createProcessing(formData, status) {
  const operator = currentConfig.users.find(
    (item) => String(item.id) === String(formData.get("operator"))
  );

  // Inputurile sunt in KG; stocul intern e in tone → împărțim la 1000.
  const processedKg = Number(formData.get("processedQuantity") || 0);
  const wasteKg = Number(formData.get("confirmedWaste") || 0);
  // Umiditatile se trimit DOAR la uscare; altfel backend-ul oricum le ignora.
  const usesHumidity =
    resolveLossMethod(
      (currentConfig?.processingTypes || []).find(
        (t) => t.name === formData.get("processingType")
      ) || { name: formData.get("processingType") }
    ) === "umiditate";
  const payload = {
    product: formData.get("product"),
    sourceLocation: formData.get("sourceLocation"),
    destLocation: formData.get("destLocation") || "",
    processingType: formData.get("processingType"),
    processedQuantity: String(processedKg / 1000),
    confirmedWaste: String(wasteKg / 1000),
    initialHumidity: usesHumidity ? formData.get("initialHumidity") : "",
    finalHumidity: usesHumidity ? formData.get("finalHumidity") : "",
    enteredUnit: "kg",
    operator: operator?.name || "",
    note: formData.get("note"),
    status: status === "In lucru" ? "In lucru" : "Confirmat"
  };

  // Avertizare "un produs / cilindru" pe cilindrul destinatie.
  const procDestName = formData.get("destLocation") || formData.get("sourceLocation");
  const procConflict = cylinderConflictProduct(procDestName, formData.get("product"));
  if (procConflict) {
    const ok = window.confirm(
      `Atenție! Pui ${formData.get("product")} în ${procDestName}, dar acolo este deja ${procConflict}.\nO locație ar trebui să aibă un singur produs. Continui?`
    );
    if (!ok) {
      const cancelErr = new Error("Procesare anulată — cilindru cu alt produs.");
      cancelErr.cancelled = true;
      throw cancelErr;
    }
    payload.allowMixedProduct = true;
  }

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
  return await response.json().catch(() => null);
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

function getDeliveryAvailable() {
  const product = deliveryProductSelect.value;
  const source = deliverySourceSelect.value;
  if (!product || !source || !lastStockSummary) return 0;
  const row = (lastStockSummary.byLocation || []).find(
    (i) => sameLocation(i.location, source) && i.product === product
  );
  return Number(row?.quantity || 0);
}

// La LIVRARE, sursa = doar locatiile unde produsul ales e in stoc (din ultimul stoc incarcat).
function updateDeliverySourceOptions() {
  if (!deliverySourceSelect || !currentConfig) return;
  const productName = deliveryProductSelect?.value || "";
  const prev = deliverySourceSelect.value;
  let rows = [];
  if (productName && lastStockSummary && Array.isArray(lastStockSummary.byLocation)) {
    rows = lastStockSummary.byLocation
      .filter((i) => i.product === productName && Number(i.quantity || 0) > 0)
      .map((i) => ({ name: i.location, qty: Number(i.quantity || 0) }));
  }
  if (rows.length) {
    deliverySourceSelect.innerHTML = rows
      .map(
        (r) =>
          `<option value="${escapeComboHtml(r.name)}">${escapeComboHtml(r.name)} (${formatNumber(r.qty)} t)</option>`
      )
      .join("");
  } else {
    // Stoc neincarcat sau produs fara stoc: aratam toate locatiile ca fallback.
    deliverySourceSelect.innerHTML =
      `<option value="">Din cilindru / locatie</option>` +
      (currentConfig.storageLocations || [])
        .map((l) => `<option value="${escapeComboHtml(l.name)}">${escapeComboHtml(l.name)}</option>`)
        .join("");
  }
  if (prev && [...deliverySourceSelect.options].some((o) => o.value === prev)) {
    deliverySourceSelect.value = prev;
  }
}

// Calculează în timp real „Rest de plată" = țintă − deja achitat − suma curentă; semnalează și avansul (surplus).
function updateTransactionRemaining(target, alreadyPaid) {
  const el = document.getElementById("transaction-remaining");
  const hintEl = document.getElementById("transaction-partial-hint");
  const amt = Number(document.getElementById("transaction-amount")?.value || 0);
  const outstanding = Math.max(Number(target || 0) - Number(alreadyPaid || 0), 0);
  const remaining = Math.max(outstanding - amt, 0);
  const surplus = Math.max(amt - outstanding, 0);
  if (el) el.textContent = currency.format(remaining);
  if (!hintEl) return;
  const checked = document.getElementById("transaction-partial-check")?.checked;
  if (amt <= 0) {
    hintEl.textContent = "";
    hintEl.className = "field-hint";
  } else if (surplus > 0) {
    hintEl.textContent = `Avans (surplus): ${currency.format(surplus)} se înregistrează ca avans al partenerului.`;
    hintEl.className = "field-hint hint-info";
  } else if (remaining > 0) {
    hintEl.textContent = checked
      ? `Plată parțială — rest de achitat: ${currency.format(remaining)}.`
      : `Mai rămâne ${currency.format(remaining)} neachitat. Bifează «Plată parțială / Avans» dacă e intenționat.`;
    hintEl.className = checked ? "field-hint hint-info" : "field-hint hint-warn";
  } else {
    hintEl.textContent = "Se achită integral ✓";
    hintEl.className = "field-hint hint-ok";
  }
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
    updateTransactionRemaining(0, 0);
    return;
  }

  const direction = transactionDirectionSelect.value;

  if (referenceType === "delivery" && delivery) {
    const targetAmount = Number(delivery.contractPrice || 0) * Number(delivery.deliveredQuantity || 0);
    transactionPartnerEl.textContent = delivery.customer || "-";
    transactionTargetEl.textContent = currency.format(targetAmount);
    transactionStatusEl.textContent =
      direction === "collection" ? delivery.collectionStatus || "Neincasat" : "N/A";
    updateTransactionRemaining(targetAmount, Number(delivery.collectedAmount || 0));
    return;
  }

  if (referenceType === "opening-debt" && openingDebt) {
    transactionPartnerEl.textContent = openingDebt.partner || "-";
    transactionTargetEl.textContent = currency.format(Number(openingDebt.amount || 0));
    transactionStatusEl.textContent = openingDebt.status || "Neachitat";
    updateTransactionRemaining(Number(openingDebt.amount || 0), Number(openingDebt.settledAmount || 0));
    return;
  }

  const targetAmount = Number(receipt.amountToPay ?? receipt.preliminaryPayableAmount ?? 0);

  transactionPartnerEl.textContent = receipt.supplier || "-";
  transactionTargetEl.textContent = currency.format(targetAmount);
  transactionStatusEl.textContent = receipt.paymentStatus || "Neachitat";
  updateTransactionRemaining(targetAmount, Number(receipt.paidAmount || 0));
}

function renderDeliveryPreview() {
  const available = getDeliveryAvailable();
  const gross = Number(deliveryGrossInput?.value || 0);
  const tare = Number(deliveryTareInput?.value || 0);
  const netKg = Math.max(gross - tare, 0);
  if (deliveryAvailableEl) {
    deliveryAvailableEl.textContent = `${formatNumber(available)} t (${formatNumber(available * 1000)} kg)`;
    deliveryAvailableEl.style.color = netKg / 1000 > available ? "#b3261e" : "";
  }
  if (deliveryNetEl) deliveryNetEl.textContent = `${formatNumber(netKg)} kg`;
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
  // Masa (brut/tara) se introduce in kg; intern (stoc) e in tone. Net = brut − tara.
  if (payload.grossWeight) {
    payload.grossWeight = String(Number(payload.grossWeight || 0) / 1000);
  }
  if (payload.tareWeight) {
    payload.tareWeight = String(Number(payload.tareWeight || 0) / 1000);
  }
  if (payload.deliveredQuantity) {
    payload.deliveredQuantity = String(Number(payload.deliveredQuantity || 0) / 1000);
  }
  payload.enteredUnit = "kg";
  payload.photos = gatherPhotos("delivery-photo-brut", "delivery-photo-neto", "delivery-photo-masina");
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
  ["delivery-photo-brut", "delivery-photo-neto", "delivery-photo-masina"].forEach((id) => resetPhotoField(id));
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
    // Arătăm motivul REAL de la server (ex. „Parola trebuie sa aiba minim 10 caractere"),
    // nu doar un mesaj generic — altfel utilizatorul nu știe de ce a eșuat.
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || `Nu am putut actualiza: ${entityLabels[entity] || entity}`);
  }
}

function formatPartnerRefs(r) {
  const parts = [];
  if (r.receipts) parts.push(`${r.receipts} recepții`);
  if (r.transactions) parts.push(`${r.transactions} tranzacții`);
  if (r.deliveriesCustomer) parts.push(`${r.deliveriesCustomer} livrări (cumpărător)`);
  if (r.deliveriesSeller) parts.push(`${r.deliveriesSeller} livrări (vânzător)`);
  if (r.complaints) parts.push(`${r.complaints} reclamații`);
  if (r.advances) parts.push(`${r.advances} avansuri`);
  if (r.openingDebts) parts.push(`${r.openingDebts} datorii sold inițial`);
  if (r.tariffsByName) parts.push(`${r.tariffsByName} tarife (pe nume)`);
  return parts.join(", ") || "referințe";
}

function askPartnerReassignTarget(item, references) {
  return new Promise((resolve) => {
    const others = (currentConfig.partners || [])
      .filter((p) => Number(p.id) !== Number(item.id))
      .sort((a, b) =>
        String(a.name || "").localeCompare(String(b.name || ""), "ro", { sensitivity: "base" })
      );

    if (!others.length) {
      window.alert("Nu exista alt partener catre care sa reatribui. Adauga intai un partener.");
      resolve(null);
      return;
    }

    const dialog = document.createElement("dialog");
    dialog.className = "partner-merge-dialog";
    const options = others
      .map((p) => `<option value="${escapeComboHtml(String(p.id))}">${escapeComboHtml(p.name)}${p.idno ? ` (${escapeComboHtml(p.idno)})` : ""}</option>`)
      .join("");
    dialog.innerHTML = `
      <form method="dialog" class="mini-form">
        <h3>Reatribuie și șterge „${item.name}"</h3>
        <p>Partenerul are ${formatPartnerRefs(references)}. Alege partenerul către care se mută aceste referințe, apoi se șterge:</p>
        <label>Reatribuie către
          <select id="partner-merge-target">${options}</select>
        </label>
        <div class="editor-actions">
          <button type="submit" value="confirm" class="cell-btn cell-btn-danger">Reatribuie și șterge</button>
          <button type="submit" value="cancel" class="ghost-button">Renunță</button>
        </div>
      </form>
    `;
    document.body.appendChild(dialog);
    const select = dialog.querySelector("#partner-merge-target");
    dialog.addEventListener("close", () => {
      const value = dialog.returnValue === "confirm" && select ? Number(select.value) : null;
      dialog.remove();
      resolve(value);
    });
    dialog.showModal();
  });
}

async function handlePartnerDelete(item) {
  if (!window.confirm(`Stergi partenerul „${item.name}"?`)) {
    return;
  }
  try {
    let response = await fetch(`/api/config/partners/${item.id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({})
    });

    if (response.status === 409) {
      const data = await response.json().catch(() => ({}));
      const reassignTo = await askPartnerReassignTarget(item, data.references || {});
      if (!reassignTo) {
        return;
      }
      response = await fetch(`/api/config/partners/${item.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reassignTo })
      });
    }

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || "Nu am putut sterge partenerul.");
    }

    await Promise.all([
      loadConfig(),
      loadReceipts(),
      loadTransactions(),
      loadDeliveries(),
      loadComplaints(),
      loadOpeningDocuments(),
      loadAuditLogs()
    ]);
  } catch (error) {
    window.alert(error.message);
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
  const doc = `<!DOCTYPE html><html lang="ro"><head><meta charset="utf-8"><title>${escapeComboHtml(title)}</title>
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
  #of-doc.editing { outline:2px dashed #1B5E3F; outline-offset:6px; background:#fffdf2; }
  #of-doc:focus, #of-doc [contenteditable]:focus { outline:none; }
  @media print { .no-print { display:none; } #of-doc.editing { outline:none !important; background:#fff !important; } }
</style></head><body>
<div id="of-doc">${bodyHtml}</div>
<div class="no-print" style="text-align:center;margin-top:24px;">
  <button id="of-edit-btn" type="button" style="padding:10px 22px;font-size:14px;background:#fff;color:#1B5E3F;border:2px solid #1B5E3F;border-radius:6px;cursor:pointer;margin-right:8px;">✏️ Editează text</button>
  <button onclick="window.print()" style="padding:10px 24px;font-size:14px;background:#1B5E3F;color:#fff;border:0;border-radius:6px;cursor:pointer;">Printează</button>
  <div id="of-edit-hint" style="margin-top:8px;font-size:12px;color:#555;">Apasă „Editează text", apoi dă click oriunde în document și scrie ce ai nevoie. Textul se tipărește, dar nu se salvează în program.</div>
</div>
<div class="doc-foot">Generat de AgroProfit+ · ${new Date().toLocaleString("ro-RO")}</div>
<script>
  (function () {
    var doc = document.getElementById("of-doc");
    var btn = document.getElementById("of-edit-btn");
    var on = false;
    btn.addEventListener("click", function () {
      on = !on;
      doc.contentEditable = on ? "true" : "false";
      doc.classList.toggle("editing", on);
      btn.textContent = on ? "✓ Gata editarea" : "✏️ Editează text";
      btn.style.background = on ? "#1B5E3F" : "#fff";
      btn.style.color = on ? "#fff" : "#1B5E3F";
      if (on) doc.focus();
    });
  })();
</script>
</body></html>`;
  win.document.write(doc);
  win.document.close();
}

// Antetul documentelor „interne". Implicit = AgroProfit+ (ca până acum). Dacă se alege una din
// companiile utilizatorului, antetul afișează firma respectivă (denumire, IDNO, adresă).
function docHeader(company) {
  const co = company && (company.name || company.shortName) ? company : null;
  const dateStr = new Date().toLocaleDateString("ro-RO");
  if (!co) {
    return `<div class="doc-head">
      <div class="doc-brand">AgroProfit+<small>Partenerul tău în agricultură</small></div>
      <div style="text-align:right;font-size:11px;color:#666;">Data: ${dateStr}</div>
    </div>`;
  }
  const sub = [co.idno ? "IDNO " + co.idno : "", co.vatCode ? "Cod TVA " + co.vatCode : ""].filter(Boolean).join(" · ");
  return `<div class="doc-head">
    <div class="doc-brand" style="font-size:17px;">${escapeComboHtml(co.name || co.shortName)}${sub ? `<small>${escapeComboHtml(sub)}</small>` : ""}</div>
    <div style="text-align:right;font-size:11px;color:#666;">${co.address ? escapeComboHtml(co.address) + "<br>" : ""}Data: ${dateStr}</div>
  </div>`;
}

// Compania aleasă pentru antetul documentelor de tipar. Gol → null → antetul implicit AgroProfit+.
// ATENȚIE: NU contopi cu resolveCompany(). Semantica de fallback e intenționat diferită:
// resolveCompany întoarce mereu o firmă (pt. documentele OFICIALE: contract/ordin de plată),
// iar aici întoarcem null când nu s-a ales nimic, tocmai ca antetul „intern" să rămână AgroProfit+.
function printHeaderCompany(companyId) {
  if (companyId == null || companyId === "") return null;
  return (currentConfig?.companies || []).find((c) => Number(c.id) === Number(companyId)) || null;
}

// Opțiunile pentru un selector de companie-antet: prima = „AgroProfit+ (implicit)" (valoare goală).
function companyHeaderOptionsHtml(selectedId) {
  const sel = selectedId == null ? "" : String(selectedId);
  const companies = (currentConfig?.companies || []).filter((c) => c.active !== false);
  const opts = [`<option value=""${sel === "" ? " selected" : ""}>AgroProfit+ (implicit)</option>`]
    .concat(companies.map((c) => `<option value="${escapeComboHtml(String(c.id))}"${sel === String(c.id) ? " selected" : ""}>${escapeComboHtml(c.shortName || c.name)}</option>`));
  return opts.join("");
}

// Populează toate selectoarele de companie-antet din pagină (Livrări + Act de verificare).
function fillHeaderCompanySelects() {
  document.querySelectorAll("select.doc-header-company").forEach((el) => {
    const prev = el.value;
    el.innerHTML = companyHeaderOptionsHtml(prev);
    if (prev) el.value = prev;
  });
}

function moneyRo(n) {
  return new Intl.NumberFormat("ro-RO", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(n) || 0);
}

function buildStatementPrintHtml(data, company) {
  const p = data.partner;
  const t = data.totals;
  const receiptRows = data.receipts.map((r) => `
    <tr><td>${formatDateShort(r.date)}</td><td>${escapeComboHtml(r.product || "")}</td><td>${formatNumber(r.quantity * 1000)} kg</td><td>${moneyRo(r.price)}/kg</td><td>${moneyRo(r.amount)}</td></tr>`).join("");
  const paymentRows = data.payments.map((pm) => `
    <tr><td>${formatDateShort(pm.date)}</td><td>${escapeComboHtml(pm.paymentType || "-")}</td><td>${escapeComboHtml(pm.note || "")}</td><td>${escapeComboHtml(pm.reference || "-")}</td><td>${moneyRo(pm.amount)}</td></tr>`).join("");
  const deliveries = data.deliveries || [];
  const collections = data.collections || [];
  const deliveryRows = deliveries.map((d) => `
    <tr><td>${formatDateShort(d.date)}</td><td>${escapeComboHtml(d.product || "")}</td><td>${formatNumber(d.quantity * 1000)} kg</td><td>${moneyRo(d.amount)}</td></tr>`).join("");
  const collectionRows = collections.map((c) => `
    <tr><td>${formatDateShort(c.date)}</td><td>${escapeComboHtml(c.paymentType || "-")}</td><td>${escapeComboHtml(c.note || "")}</td><td>${escapeComboHtml(c.reference || "-")}</td><td>${moneyRo(c.amount)}</td></tr>`).join("");
  const balanceText = t.balance > 0
    ? `Noi datorăm partenerului: ${moneyRo(t.balance)} MDL`
    : t.balance < 0 ? `Partenerul ne datorează: ${moneyRo(Math.abs(t.balance))} MDL` : "Achitat integral";
  const periodText = data.period.from || data.period.to
    ? `Perioada: ${data.period.from || "început"} — ${data.period.to || "azi"}` : "Toată perioada";
  const customerSide = (deliveries.length || collections.length) ? `
    <h4 style="color:#1B5E3F;">Livrări (partenerul cumpără)</h4>
    <table class="doc-table">
      <thead><tr><th>Data</th><th>Produs</th><th>Cantitate</th><th>Sumă</th></tr></thead>
      <tbody>${deliveryRows || '<tr><td colspan="4">Nicio livrare</td></tr>'}</tbody>
      <tfoot><tr><td colspan="2">TOTAL</td><td>${formatNumber((t.totalDeliveredQuantity || 0) * 1000)} kg</td><td>${moneyRo(t.totalDeliveries || 0)} MDL</td></tr></tfoot>
    </table>
    <h4 style="color:#1B5E3F;">Încasări</h4>
    <table class="doc-table">
      <thead><tr><th>Data</th><th>Tip</th><th>Comentariu</th><th>Referință</th><th>Sumă</th></tr></thead>
      <tbody>${collectionRows || '<tr><td colspan="5">Nicio încasare</td></tr>'}</tbody>
      <tfoot><tr><td colspan="4">TOTAL ÎNCASAT</td><td>${moneyRo(t.totalCollected || 0)} MDL</td></tr></tfoot>
    </table>` : "";
  return `${docHeader(company)}
    <div class="doc-title">Act de verificare</div>
    <div class="doc-subtitle">${periodText}</div>
    <div class="doc-party" style="margin-bottom:14px;">
      <h4>Partener</h4>
      <div><b>${escapeComboHtml(p.name || "")}</b></div>
      ${p.idno ? `<div>IDNO: ${escapeComboHtml(p.idno)}</div>` : ""}
      ${p.address ? `<div>Adresa: ${escapeComboHtml(p.address)}</div>` : ""}
      ${p.bankName ? `<div>Banca: ${escapeComboHtml(p.bankName)}</div>` : ""}
      ${p.iban ? `<div>IBAN: ${escapeComboHtml(p.iban)}</div>` : ""}
    </div>
    <h4 style="color:#1B5E3F;">Recepții (partenerul furnizează)</h4>
    <table class="doc-table">
      <thead><tr><th>Data</th><th>Produs</th><th>Cantitate</th><th>Preț</th><th>Sumă</th></tr></thead>
      <tbody>${receiptRows || '<tr><td colspan="5">Nicio recepție</td></tr>'}</tbody>
      <tfoot><tr><td colspan="2">TOTAL</td><td>${formatNumber(t.totalQuantity * 1000)} kg</td><td></td><td>${moneyRo(t.totalReceipts)} MDL</td></tr></tfoot>
    </table>
    <h4 style="color:#1B5E3F;">Achitări (către partener)</h4>
    <table class="doc-table">
      <thead><tr><th>Data</th><th>Tip plată</th><th>Comentariu</th><th>Referință</th><th>Sumă</th></tr></thead>
      <tbody>${paymentRows || '<tr><td colspan="5">Nicio achitare</td></tr>'}</tbody>
      <tfoot><tr><td colspan="4">TOTAL ACHITAT</td><td>${moneyRo(t.totalPaid)} MDL</td></tr></tfoot>
    </table>
    ${customerSide}
    <div class="doc-total">SOLD FINAL: ${balanceText}</div>
    <div class="doc-sign"><div>Partener</div><div>Reprezentant AgroProfit+</div></div>`;
}

// ============================================================================
// Documente contabile tiparite pentru furnizor (Act de achizitie, Contract, Ordin de plata).
// Operatorul NU le vede — panoul e sub data-access="finance". Reutilizeaza openPrintWindow/
// docHeader/moneyRo/escapeComboHtml. Datele se CITESC din operatii; nu ating banii/soldurile.
// ============================================================================

// Compania emitenta se ALEGE la tipar (nomenclatorul „Companiile mele", Setari). Fallback minim
// daca nu exista nicio companie configurata.
const DEFAULT_COMPANY = { name: "", shortName: "", idno: "", vatCode: "", address: "", iban: "", bank: "", bic: "", admin: "", phone: "", email: "" };

function resolveCompany(companyId) {
  const list = currentConfig?.companies || [];
  const byId = companyId != null && companyId !== "" ? list.find((c) => Number(c.id) === Number(companyId)) : null;
  return byId || list.find((c) => c.active !== false) || list[0] || DEFAULT_COMPANY;
}

// Fereastra de tipar „oficiala" — reproduce fidel formularele originale (fara branding AgroProfit,
// fara subsol). Alb-negru, Times New Roman, format A4. Fiecare builder isi aduce structura proprie.
function openOfficialDocWindow(bodyHtml, title) {
  const win = window.open("", "_blank");
  if (!win) {
    alert("Permite ferestrele pop-up pentru a printa documentul.");
    return;
  }
  const doc = `<!DOCTYPE html><html lang="ro"><head><meta charset="utf-8"><title>${escapeComboHtml(title)}</title>
<style>
  /* Marginea paginii = 0, iar marginile fizice le dam din padding-ul body-ului. Astfel browserul
     nu mai are loc sa tipareasca antetul/subsolul propriu (data, ora, titlul paginii, URL-ul). */
  @page { size: A4; margin: 0; }
  * { box-sizing: border-box; }
  body { font-family: 'Times New Roman', Georgia, serif; color:#000; font-size:12px; line-height:1.32; margin:0; padding:12mm 14mm; }
  .of-title { text-align:center; font-weight:bold; font-size:15px; text-transform:uppercase; margin:4px 0 2px; }
  .of-title small { display:block; font-size:10px; font-weight:400; text-transform:none; }
  .of-ru { font-style:italic; font-size:9px; font-weight:400; }
  .of-cap { font-size:8px; font-style:italic; text-align:center; }
  .of-row { margin:5px 0; }
  .of-fill { border-bottom:1px solid #000; display:inline-block; min-width:80px; padding:0 4px; }
  .of-b { font-weight:bold; }
  .of-c { text-align:center; }
  .of-r { text-align:right; }
  table.of-tbl { width:100%; border-collapse:collapse; margin:6px 0; }
  table.of-tbl td, table.of-tbl th { border:1px solid #000; padding:3px 5px; font-size:11px; vertical-align:top; }
  table.of-tbl th { font-weight:bold; text-align:center; }
  .of-sign { display:flex; justify-content:space-between; margin-top:22px; font-size:11px; gap:20px; }
  .of-sign .col { flex:1; }
  .of-sign .ln { border-top:1px solid #000; padding-top:3px; margin-top:18px; }
  .of-just { text-align:justify; margin:4px 0; font-size:11px; }
  .of-hr { border:0; border-top:1px solid #000; margin:8px 0; }
  /* Editare directă pe foaie (contenteditable): fundal ușor + contur, doar în modul editare. */
  #of-doc:focus, #of-doc [contenteditable]:focus { outline:none; }
  #of-doc.editing { outline:2px dashed #1B5E3F; outline-offset:6px; background:#fffdf2; }
  #of-doc.editing:focus-within :focus { outline:1px dotted #1B5E3F; }
  @media print {
    .no-print { display:none; }
    #of-doc.editing { outline:none !important; background:#fff !important; }
  }
</style></head><body>
<div id="of-doc">${bodyHtml}</div>
<div class="no-print" style="text-align:center;margin-top:20px;">
  <button id="of-edit-btn" type="button" style="padding:9px 22px;font-size:14px;background:#fff;color:#1B5E3F;border:2px solid #1B5E3F;border-radius:6px;cursor:pointer;margin-right:8px;">✏️ Editează text</button>
  <button onclick="window.print()" style="padding:9px 22px;font-size:14px;background:#1B5E3F;color:#fff;border:0;border-radius:6px;cursor:pointer;">Printează</button>
  <div id="of-edit-hint" style="margin-top:8px;font-size:12px;color:#555;">Apasă „Editează text", apoi dă click oriunde în document și scrie ce ai nevoie. Textul se tipărește, dar nu se salvează în program.</div>
</div>
<script>
  (function () {
    var doc = document.getElementById("of-doc");
    var btn = document.getElementById("of-edit-btn");
    var on = false;
    btn.addEventListener("click", function () {
      on = !on;
      doc.contentEditable = on ? "true" : "false";
      doc.classList.toggle("editing", on);
      btn.textContent = on ? "✓ Gata editarea" : "✏️ Editează text";
      btn.style.background = on ? "#1B5E3F" : "#fff";
      btn.style.color = on ? "#fff" : "#1B5E3F";
      if (on) doc.focus();
    });
  })();
</script>
</body></html>`;
  win.document.write(doc);
  win.document.close();
}

// Suma in litere (lei + bani), in limba romana. Pentru randurile „in litere / прописью".
function intToWordsRo(num) {
  num = Math.floor(Math.abs(Number(num) || 0));
  if (num === 0) return "zero";
  const U = ["zero", "unu", "doi", "trei", "patru", "cinci", "sase", "sapte", "opt", "noua"];
  const UF = ["zero", "una", "doua", "trei", "patru", "cinci", "sase", "sapte", "opt", "noua"];
  const TEENS = ["zece", "unsprezece", "doisprezece", "treisprezece", "paisprezece", "cincisprezece", "saisprezece", "saptesprezece", "optsprezece", "nouasprezece"];
  const TENS = ["", "", "douazeci", "treizeci", "patruzeci", "cincizeci", "saizeci", "saptezeci", "optzeci", "nouazeci"];
  function below1000(x, fem) {
    if (x === 0) return "";
    const parts = [];
    const h = Math.floor(x / 100);
    const rest = x % 100;
    if (h === 1) parts.push("o suta");
    else if (h >= 2) parts.push(UF[h] + " sute");
    if (rest > 0) {
      if (rest < 10) parts.push((fem ? UF : U)[rest]);
      else if (rest < 20) parts.push(TEENS[rest - 10]);
      else {
        const t = Math.floor(rest / 10);
        const u = rest % 10;
        parts.push(u === 0 ? TENS[t] : TENS[t] + " si " + (fem ? UF : U)[u]);
      }
    }
    return parts.join(" ");
  }
  const parts = [];
  const millions = Math.floor(num / 1000000);
  const thousands = Math.floor((num % 1000000) / 1000);
  const rest = num % 1000;
  if (millions > 0) parts.push(millions === 1 ? "un milion" : below1000(millions, true) + " milioane");
  if (thousands > 0) parts.push(thousands === 1 ? "o mie" : below1000(thousands, true) + " mii");
  if (rest > 0) parts.push(below1000(rest, false));
  return parts.join(" ").trim();
}

function numberToWordsRo(amount) {
  const cents = Math.round((Number(amount) || 0) * 100);
  const lei = Math.floor(cents / 100);
  const bani = cents % 100;
  return `${intToWordsRo(lei)} lei ${String(bani).padStart(2, "0")} bani`;
}

// Net in KG dintr-o receptie: greutatea neta reala (kg) daca exista, altfel net (tone) × 1000.
function receiptNetKg(receipt) {
  const net = Number(receipt.netWeight);
  if (net > 0) return net;
  return Number(receipt.provisionalNetQuantity || receipt.quantity || 0) * 1000;
}

function receiptPrintValue(receipt) {
  const stored = Number(receipt.amountToPay || receipt.preliminaryPayableAmount || 0);
  if (stored > 0) return stored;
  return receiptNetKg(receipt) * (Number(receipt.price) || 0);
}


// 1) ACT DE ACHIZITIE A MARFURILOR — fidel formularului oficial bilingv RO/RU (dintr-o receptie).
// Impozitul retinut la sursa: procentul din nomenclatorul „Statut fiscal" dupa statutul partenerului
// (ex. persoana fizica = 6%). Persoana juridica = 0.
function partnerWithholdingPercent(partner) {
  const name = String((partner && partner.fiscalProfile) || "").trim().toLowerCase();
  const profile = (currentConfig?.fiscalProfiles || []).find(
    (f) => String(f.name || "").trim().toLowerCase() === name
  );
  return profile ? Number(profile.withholdingPercent) || 0 : 0;
}

// Cantitate (kg) + valoare (bruta) + pret derivat pentru o receptie, pe act (cantitate × pret = valoare).
function actReceiptFigures(receipt) {
  // Cantitatea = aceeași bază ca in tabelul Recepții (net provizoriu × 1000 = kg).
  const netKg = Number(receipt.provisionalNetQuantity || receipt.quantity || 0) * 1000
    || Number(receipt.netWeight) || 0;
  // Prețul = EXACT cel introdus la recepție (lei/kg), NU derivat din valoare ÷ cantitate.
  const price = Number(receipt.price) || 0;
  // Valoarea (brută, cost) = cantitate × preț, exact — ca „col.5 = col.3 × col.4" să iasă perfect.
  // Doar dacă lipsește prețul, cădem pe valoarea brută stocată.
  const value = price > 0 && netKg > 0
    ? Number((netKg * price).toFixed(2))
    : Number(receipt.preliminaryMerchandiseValue) || 0;
  return { netKg, price, value };
}

// ACT DE ACHIZITIE — una sau mai multe receptii ale aceluiasi furnizor (un rand per receptie).
// Impozitul la buget = valoare × procent (din nomenclator); Total de plata = valoare − impozit.
// Numar cu separator de mii = SPATIU (ex. „8 220", „49 320,00") — fara echivoc pe actul oficial,
// ca sa nu para 8220 kg drept 8,22 (in ro-RO punctul e separator de mii). Zecimala ramane virgula.
function actNum(n, dec) {
  return new Intl.NumberFormat("ro-RO", { minimumFractionDigits: dec, maximumFractionDigits: dec })
    .format(Number(n) || 0)
    .replace(/\./g, " ");
}

function buildPurchaseActHtml(receipts, partner, company) {
  const p = partner || {};
  const co = company || DEFAULT_COMPANY;
  const rows = (receipts || []).filter(Boolean).map((r) => ({ r, ...actReceiptFigures(r) }));
  const totalKg = rows.reduce((s, x) => s + x.netKg, 0);
  const value = Number(rows.reduce((s, x) => s + x.value, 0).toFixed(2));
  const taxPercent = partnerWithholdingPercent(p);
  const tax = Number(((value * taxPercent) / 100).toFixed(2));
  const netPay = Number((value - tax).toFixed(2));
  const nr = "____";
  const words = escapeComboHtml(numberToWordsRo(value));
  const dates = rows.map((x) => x.r.receivedAt || x.r.createdAt).filter(Boolean).sort();
  const dateText = dates.length
    ? (dates[0] === dates[dates.length - 1]
      ? formatDateShort(dates[0])
      : `${formatDateShort(dates[0])} — ${formatDateShort(dates[dates.length - 1])}`)
    : "____";
  const bodyRows = rows.map((x) => `
        <tr>
          <td>${escapeComboHtml(x.r.product || "")}</td>
          <td class="of-c">kg</td>
          <td class="of-r">${actNum(x.netKg, 2)}</td>
          <td class="of-r">${actNum(x.price, 2)}</td>
          <td class="of-r">${actNum(x.value, 2)}</td>
        </tr>`).join("");
  return `
    <table style="width:100%;border-collapse:collapse;"><tr>
      <td style="width:60px;text-align:center;font-size:16px;">◯</td>
      <td><div class="of-title">Act de achiziție a mărfurilor<small class="of-ru">Акт закупки товаров</small></div></td>
      <td style="width:150px;font-size:11px;">Seria <span class="of-fill">${escapeComboHtml(co.series || co.shortName || "")}</span><br>Nr. <span class="of-fill">${escapeComboHtml(nr)}</span></td>
    </tr></table>
    <div class="of-row of-c">din <span class="of-fill">${dateText}</span></div>

    <div class="of-row"><span class="of-fill" style="min-width:340px;">${escapeComboHtml(co.name || "")}</span>, IDNO <span class="of-fill">${escapeComboHtml(co.idno || "")}</span>
      <div class="of-cap">Denumirea și rechizitele întreprinderii, adresa / Наименование, реквизиты предприятия, адрес</div></div>
    <div class="of-row">${escapeComboHtml(co.address || "")}${co.vatCode ? " · Cod TVA " + escapeComboHtml(co.vatCode) : ""}</div>
    <div class="of-row">Conducătorul unității: <span class="of-fill">${escapeComboHtml(co.admin || "")}</span> <span class="of-cap">/ Руководитель</span></div>

    <div class="of-row">Primit marfa <span class="of-fill" style="min-width:260px;">${escapeComboHtml(co.admin || "")}</span>
      <div class="of-cap">numele, prenumele / Принял товар — фамилия, имя</div></div>
    <div class="of-row">Predat marfa <span class="of-fill" style="min-width:260px;">${escapeComboHtml(p.name || "")}</span>
      <div class="of-cap">numele, prenumele / Сдал товар — фамилия, имя</div></div>
    <div class="of-row">Codul personal / IDNP, datele buletinului de identitate, adresa:
      <span class="of-fill" style="min-width:340px;">${escapeComboHtml([p.idno, p.address].filter(Boolean).join(", "))}</span></div>

    <table class="of-tbl">
      <thead>
        <tr>
          <th>Denumirea mărfurilor<br><span class="of-ru">Наименование товаров</span></th>
          <th>Unit. de măsură<br><span class="of-ru">Единица измерения</span></th>
          <th>Cantitate<br><span class="of-ru">Количество</span></th>
          <th>Preț unitar, lei<br><span class="of-ru">Цена единицы, лей</span></th>
          <th>Valoare, lei<br><span class="of-ru">Стоимость, лей</span></th>
        </tr>
        <tr><td class="of-c">1</td><td class="of-c">2</td><td class="of-c">3</td><td class="of-c">4</td><td class="of-c">5 = 3 × 4</td></tr>
      </thead>
      <tbody>${bodyRows}
      </tbody>
      <tfoot>
        <tr><td class="of-b">Total / Итого</td><td class="of-c">×</td><td class="of-r of-b">${actNum(totalKg, 2)}</td><td class="of-c">×</td><td class="of-r of-b">${actNum(value, 2)}</td></tr>
      </tfoot>
    </table>

    <div class="of-row"><span class="of-b">Valoarea totală / Общая стоимость:</span> <span class="of-fill" style="min-width:320px;">${words}</span>
      <div class="of-cap">în litere / прописью</div></div>
    <div class="of-row of-b">Rețineri / Удержания:</div>
    <div class="of-row">— la buget / в бюджет${taxPercent > 0 ? ` (${formatNumber(taxPercent)}%)` : ""}:
      <span class="of-fill" style="min-width:260px;">${escapeComboHtml(numberToWordsRo(tax))}</span> <span class="of-fill" style="min-width:110px;">${actNum(tax, 2)}</span>
      <div class="of-cap">în litere / прописью &nbsp;·&nbsp; în cifre / цифрами</div></div>
    <div class="of-row">— avansuri achitate / уплаченные авансы: <span class="of-fill" style="min-width:230px;"></span> <span class="of-fill" style="min-width:110px;"></span>
      <div class="of-cap">în litere / прописью &nbsp;·&nbsp; în cifre / цифрами</div></div>
    <div class="of-row"><span class="of-b">Total de plată / Общая сумма к оплате:</span>
      <span class="of-fill" style="min-width:270px;">${escapeComboHtml(numberToWordsRo(netPay))}</span> <span class="of-fill" style="min-width:110px;">${actNum(netPay, 2)}</span>
      <div class="of-cap">în litere / прописью &nbsp;·&nbsp; în cifre / цифрами</div></div>

    <p class="of-just" style="margin-top:8px;">Declarația pe propria răspundere a persoanei fizice care a predat mărfurile: confirm că marfa îmi aparține, este liberă de sarcini și corespunde cantității și calității indicate. / Декларация под собственную ответственность физического лица, передавшего товары.</p>
    <div class="of-sign">
      <div class="col">Predat marfa / Сдал товар<div class="ln of-cap">semnătura / подпись</div></div>
      <div class="col">Primit marfa / Принял товар<div class="ln of-cap">semnătura / подпись</div></div>
    </div>`;
}

// 2) CONTRACT de cumparare-vanzare cereale — text integral, cadru, per furnizor.
function buildSaleContractHtml(partner, company) {
  const p = partner || {};
  const co = company || DEFAULT_COMPANY;
  const fill = (v, min) => `<span class="of-fill" style="min-width:${min || 120}px;">${escapeComboHtml(v || "")}</span>`;
  // Fiecare punct al contractului pe rand nou (paragraf propriu, indent atarnat pe numar).
  const pt = (t) => `<p class="of-just" style="margin:2px 0 2px 16px;text-indent:-16px;">${t}</p>`;
  const series = String(co.series || co.shortName || "").trim();
  return `
    <div class="of-title" style="line-height:1.15;margin-bottom:2px;">CONTRACT<span style="display:block;font-size:12px;font-weight:bold;text-transform:none;">de cumpărare-vânzare</span></div>
    <table style="width:100%;margin-top:6px;"><tr>
      <td style="font-size:11px;">Nr. ${escapeComboHtml(series ? series + "-" : "")}<span class="of-fill">________</span></td>
      <td style="font-size:11px;text-align:right;">r. Briceni, <span class="of-fill">______________</span></td>
    </tr></table>
    <p class="of-just of-b" style="text-align:center;margin-top:10px;">1. PĂRȚILE CONTRACTANTE</p>
    <p class="of-just">1.1. ${fill(p.name, 240)}, identificat prin IDNO/IDNP ${fill(p.idno, 130)}, cu sediul în ${fill(p.address, 200)}, denumit în continuare <b>vânzător</b>; și</p>
    <p class="of-just">1.2. <b>${escapeComboHtml(co.name || "")}</b>, identificată prin IDNO ${escapeComboHtml(co.idno || "")}, cu sediul în ${escapeComboHtml(co.address || "")}, reprezentată de administratorul ${escapeComboHtml(co.admin || "")}, denumită în continuare <b>cumpărător</b>, au convenit să încheie prezentul contract de vânzare-cumpărare a mărfurilor cu respectarea clauzelor acestuia.</p>
    <p class="of-just of-b" style="text-align:center;">2. OBIECTUL CONTRACTULUI ȘI ACHITAREA</p>
    ${pt("2.1. Obiectul material al contractului îl reprezintă vânzarea/cumpărarea produsului cerealier; cantitatea și suma totală sunt conform actelor de achiziție emise.")}
    ${pt("2.2. Achitarea se face după recepția mărfii și prezentarea de către Vânzător a documentelor necesare; prin numerar sau prin transfer, în lei (MDL).")}
    ${pt("2.3. La achiziția de la persoane fizice, Cumpărătorul reține și transferă la buget impozitul pe venit <b>conform legislației în vigoare</b>, achitând Vânzătorului suma netă.")}
    ${pt("2.4. Cumpărătorul are dreptul să rețină din prețul mărfii contravaloarea serviciilor prestate (uscare, curățare, depozitare) și impozitul reținut la sursă, achitând Vânzătorului diferența.")}
    ${pt("2.5. Data achitării este data parvenirii mijloacelor bănești la contul Vânzătorului.")}
    <p class="of-just of-b" style="text-align:center;">3. VALORI CANTITATIV-CALITATIVE, TERMENE ȘI MODALITĂȚI DE FURNIZARE</p>
    ${pt("3.1. Cantitatea și calitatea mărfii (masă, umiditate, impurități, corpuri străine) se determină la cântarul și în laboratorul Cumpărătorului, iar rezultatele acestora sunt <b>definitorii</b> pentru părți.")}
    ${pt("3.2. Prețul se ajustează conform baremurilor Cumpărătorului pentru abaterile de umiditate și impurități față de normă.")}
    ${pt("3.3. Marfa se predă la masa utilă fizică, sănătoasă, liberă de boli, dăunători și insecte vii, cu parametri conform standardelor în vigoare: umiditate ________.")}
    ${pt("3.4. Dreptul de proprietate și riscul pieirii trec la Cumpărător <b>după recepția mărfii la depozit și verificarea calității</b>.")}
    ${pt("3.5. Vânzătorul asigură încărcarea mărfii; livrarea se face la depozitul Cumpărătorului cu transportul Vânzătorului.")}
    <p class="of-just of-b" style="text-align:center;">4. DREPTURILE ȘI OBLIGAȚIUNILE VÂNZĂTORULUI</p>
    ${pt("4.1. Vânzătorul <b>garantează</b> că marfa îi aparține, este liberă de gaj și sechestru, dobândită legal, nu conține contaminanți (micotoxine/aflatoxine, reziduuri de pesticide peste limitele admise, metale, corpuri străine) și corespunde normelor sanitare; despăgubește Cumpărătorul pentru orice prejudiciu cauzat de vicii ascunse sau neconformități depistate ulterior.")}
    ${pt("4.2. Să elibereze toate documentele de însoțire pentru partida livrată.")}
    ${pt("4.3. Să prezinte documentele necesare: copia buletinului de identitate și IDNP (persoană fizică) sau extrasul (persoană juridică) și declarația de proveniență a mărfii.")}
    ${pt("4.4. Marfa să corespundă normelor ISCC EU, însoțită de autodeclarația ISCC EU semnată de vânzător.")}
    <p class="of-just of-b" style="text-align:center;">5. DREPTURILE ȘI OBLIGAȚIILE CUMPĂRĂTORULUI</p>
    ${pt("5.1. Să preia și să achite marfa conformă.")}
    ${pt("5.2. Cumpărătorul are dreptul <b>să refuze sau să returneze, pe cheltuiala Vânzătorului</b> (transport, depozitare), marfa care nu corespunde parametrilor de calitate sau normelor sanitare.")}
    ${pt("5.3. Să desemneze o persoană responsabilă de recepția și controlul cantității și calității mărfii primite.")}
    <p class="of-just of-b" style="text-align:center;">6. RECLAMAȚII ȘI NOTIFICĂRI</p>
    ${pt("6.1. Reclamațiile se notifică în timp de 14 zile după recepția mărfii; Cumpărătorul informează Vânzătorul despre abaterile cantitativ-calitative determinate de elevatorul gazdă. Orice reclamație ulterioară se consideră nulă.")}
    <p class="of-just of-b" style="text-align:center;">7. ÎNCETAREA CONTRACTULUI</p>
    ${pt("7.1. Contractul încetează de plin drept la neexecutarea unei obligații esențiale sau la insolvabilitatea uneia dintre părți; poate fi reziliat prin înțelegere scrisă sau unilateral de către Cumpărător, cu preaviz de 15 zile calendaristice.")}
    ${pt("7.2. Contractul <b>nu poate fi cesionat</b> fără acordul scris al Cumpărătorului.")}
    ${pt("7.3. Părțile sunt exonerate de răspundere în caz de <b>forță majoră</b>, dovedită conform legii.")}
    <p class="of-just of-b" style="text-align:center;">8. SOLUȚIONAREA LITIGIILOR ȘI ALTE CLAUZE FINALE</p>
    ${pt("8.1. Neînțelegerile se rezolvă pe cale amiabilă, iar în caz contrar de instanța competentă, conform legislației Republicii Moldova.")}
    ${pt("8.2. Contractul este întocmit în două exemplare, câte unul pentru fiecare parte, cu aceeași valoare juridică.")}
    ${pt("8.3. Prezentul contract are aceeași valoare juridică pentru orice livrare efectuată de Vânzător, indiferent de actele de întocmire a livrării (anexă la contract, act de primire-predare, factură fiscală, act de verificare etc.).")}
    <table style="width:100%;margin-top:16px;border-collapse:collapse;font-size:11px;"><tr>
      <td style="width:50%;vertical-align:top;padding-right:10px;">
        <div class="of-b">CUMPĂRĂTOR</div>
        <div>${escapeComboHtml(co.name || "")}</div>
        <div>${escapeComboHtml(co.address || "")}</div>
        <div>IDNO: ${escapeComboHtml(co.idno || "")}${co.vatCode ? " · Cod/TVA: " + escapeComboHtml(co.vatCode) : ""}</div>
        <div>IBAN: ${escapeComboHtml(co.iban || "")}</div>
        <div>${escapeComboHtml(co.bank || "")}${co.bic ? "; BIC " + escapeComboHtml(co.bic) : ""}</div>
        <div>Tel/fax: ${escapeComboHtml(co.phone || "")}</div>
        <div style="margin-top:14px;">Administrator – ${escapeComboHtml(co.admin || "")}</div>
      </td>
      <td style="width:50%;vertical-align:top;padding-left:10px;">
        <div class="of-b">VÂNZĂTOR</div>
        <div>${escapeComboHtml(p.name || "____________")}</div>
        <div>${escapeComboHtml(p.address || "____________")}</div>
        <div>IDNO/IDNP: ${escapeComboHtml(p.idno || "____________")}</div>
        <div>IBAN: ${escapeComboHtml(p.iban || "____________")}</div>
        <div>${escapeComboHtml(p.bankName || "____________")}</div>
        <div>Tel: ${escapeComboHtml(p.phone || "____________")}</div>
        <div style="margin-top:14px;">Semnătura ____________</div>
      </td>
    </tr></table>
    <div class="of-c" style="margin-top:16px;font-size:10px;letter-spacing:2px;">SECRET COMERCIAL</div>
    <div class="of-c" style="margin-top:6px;font-size:8px;font-style:italic;color:#333;">Model orientativ — a se valida juridic înainte de utilizare.</div>`;
}

// 3) ORDIN DE PLATA / Dispozitie de plata de casa (Расходный кассовый ордер) — dintr-o plata.
function buildCashPaymentOrderHtml(transaction, partner, company) {
  const p = partner || {};
  const co = company || DEFAULT_COMPANY;
  const amount = Number(transaction.amount) || 0;
  const nr = "____"; // numarul de ordine il completeaza contabilul manual
  const dateStr = formatDateShort(transaction.createdAt || transaction.transactedAt);
  const refText = transaction.receiptId ? `Act de achiziție / recepția #${transaction.receiptId}` : (transaction.note || "achitare furnizor");
  return `
    <div style="font-size:12px;"><b>${escapeComboHtml(co.shortName || co.name || "")}</b></div>
    <div style="font-size:11px;">Cod fiscal ${escapeComboHtml(co.idno || "")} <span class="of-ru">/ Фискальный код</span></div>
    <div class="of-title" style="margin-top:8px;">Dispoziție de plată de casă Nr. ${escapeComboHtml(nr)}<small class="of-ru">Расходный кассовый ордер № ${escapeComboHtml(nr)}</small></div>

    <table class="of-tbl">
      <thead>
        <tr>
          <th>Nr. document<br><span class="of-ru">Номер документа</span></th>
          <th>Data întocmirii<br><span class="of-ru">Дата составления</span></th>
          <th>Cont corespondent<br><span class="of-ru">Корреспондирующий счет</span></th>
          <th>Simbol de evidenţă analitică<br><span class="of-ru">Код аналитического учета</span></th>
          <th>Suma<br><span class="of-ru">Сумма</span></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="of-c">${escapeComboHtml(nr)}</td>
          <td class="of-c">${dateStr}</td>
          <td class="of-c">544</td>
          <td class="of-c">241</td>
          <td class="of-r of-b">${moneyRo(amount)}</td>
        </tr>
      </tbody>
    </table>

    <div class="of-row">A elibera / Выдать: <span class="of-fill" style="min-width:320px;">${escapeComboHtml(p.name || transaction.partner || "")}</span></div>
    <div class="of-row">În baza / Основание: <span class="of-fill" style="min-width:340px;">${escapeComboHtml(refText)}</span></div>
    <div class="of-row">Suma / Сумма: <span class="of-fill" style="min-width:340px;">${escapeComboHtml(numberToWordsRo(amount))}</span>
      <div class="of-cap">în litere / прописью</div></div>
    <div class="of-row">Anexă / Приложение: <span class="of-fill" style="min-width:340px;"></span></div>

    <div class="of-sign">
      <div class="col">Conducător / Руководитель<div class="ln">${escapeComboHtml(co.admin || "")}</div></div>
      <div class="col">Contabil-șef / Главный бухгалтер<div class="ln of-cap">semnătura / подпись</div></div>
    </div>
    <div class="of-row" style="margin-top:18px;">Am primit / Получил: <span class="of-fill" style="min-width:300px;"></span></div>
    <div class="of-row">„____" ____________ 20____ &nbsp;&nbsp; Semnătura / Подпись <span class="of-fill" style="min-width:150px;"></span></div>
    <div class="of-row">Actul de identitate / По документу: <span class="of-fill" style="min-width:280px;">${escapeComboHtml(p.idno || "")}</span></div>`;
}

// Gaseste partenerul unei receptii/tranzactii dupa id (apoi dupa nume, ca fallback).
function findPartnerById(id) {
  if (id == null) return null;
  return (currentConfig?.partners || []).find((p) => Number(p.id) === Number(id)) || null;
}

// Dispatcher: rezolva compania emitenta, aloca numarul (unde e cazul) si deschide tiparul completat.
function printDocInRange(iso, from, to) {
  const d = String(iso || "").slice(0, 10);
  if (!d) return false;
  if (from && d < from) return false;
  if (to && d > to) return false;
  return true;
}

async function printAccountingDocument(docType, refId, companyId) {
  try {
    const company = resolveCompany(companyId);
    if (docType === "purchaseAct") {
      // refId = furnizorul; adunam recepțiile lui din perioada aleasă (gol = toate).
      const partner = findPartnerById(refId);
      if (!partner) { alert("Selectează furnizorul."); return; }
      const from = (document.getElementById("print-doc-from") || {}).value || "";
      const to = (document.getElementById("print-doc-to") || {}).value || "";
      const receipts = (receiptsCache || [])
        .filter((r) => Number(r.supplierId) === Number(partner.id) && r.status !== "Anulat")
        .filter((r) => printDocInRange(r.receivedAt || r.createdAt, from, to))
        .sort((a, b) => new Date(a.receivedAt || a.createdAt) - new Date(b.receivedAt || b.createdAt));
      if (!receipts.length) { alert("Nu există recepții pentru acest furnizor în perioada aleasă."); return; }
      openOfficialDocWindow(buildPurchaseActHtml(receipts, partner, company), `Act de achizitie ${partner.name}`);
    } else if (docType === "paymentOrder") {
      const tx = (transactionsCache || []).find((t) => Number(t.id) === Number(refId));
      if (!tx) { alert("Plata nu a fost găsită."); return; }
      const partner = findPartnerById(tx.partnerId) || findPartnerByName(tx.partner);
      openOfficialDocWindow(buildCashPaymentOrderHtml(tx, partner, company), `Ordin de plata ${tx.id}`);
    } else if (docType === "saleContract") {
      const partner = findPartnerById(refId);
      if (!partner) { alert("Selectează un furnizor."); return; }
      openOfficialDocWindow(buildSaleContractHtml(partner, company), `Contract ${partner.name}`);
    } else if (docType.startsWith("delivery")) {
      // Formele de livrare folosesc datele livrării (vânzător/cumpărător) — reutilizăm
      // printDeliveryDocument, care le tipărește deja în fereastra oficială.
      const map = { deliveryInvoice: "invoice", deliveryCertificate: "certificate", deliveryCmr: "cmr", deliveryImputernicire: "imputernicire" };
      const dt = map[docType];
      if (!dt) return;
      if (!refId) { alert("Selectează livrarea."); return; }
      printDeliveryDocument(refId, dt);
    }
  } catch (error) {
    alert(error.message || "Nu am putut genera documentul.");
  }
}

// Cere serverului un numar oficial (crescator, per companie+tip). Idempotent: acelasi document -> acelasi numar.
async function allocatePrintNumber(docType, refId, companyId) {
  const res = await fetch("/api/print-docs/allocate-number", {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ docType, refId, companyId })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Nu am putut aloca numărul documentului.");
  }
  return res.json();
}

// Build invoice / certificate / purchase act from a delivery + config
function findPartnerByName(name) {
  return (currentConfig?.partners || []).find((p) => String(p.name).trim().toLowerCase() === String(name || "").trim().toLowerCase()) || null;
}

// Denumirea produsului pentru documentele de tipar (invoice/certificat), completată în Nomenclator → Produse.
// Dacă lipsește, se folosește denumirea normală a produsului.
function productInvoiceName(productName) {
  const p = (currentConfig?.products || []).find((x) => String(x.name).trim().toLowerCase() === String(productName || "").trim().toLowerCase());
  return (p && p.invoiceName) ? String(p.invoiceName).trim() : "";
}

function buildInvoicePrintHtml(delivery) {
  const seller = getSellerPartner(delivery);
  const buyer = getBuyerPartner(delivery);
  const money = deliveryInvoiceTotals(delivery);
  const cur = money.cur;
  // Pe factură (ca în modelul de export): greutate în tone, preț/tonă și sumă în valuta facturii.
  const totalLei = money.totalLei;
  const tnQty = money.tonnes;
  const unitPerTn = money.isForeign ? money.unitForeign : (tnQty > 0 ? totalLei / tnQty : 0);
  const sumCur = money.isForeign ? money.totalForeign : totalLei;
  // withBank=true → adaugă banca + IBAN pe rânduri separate (pentru VANZATOR și CUMPARATOR).
  // EXPORTATOR/DESTINATAR rămân scurte (doar denumire, IDNO, adresă), ca în model.
  const party = (partner, nameFallback, withBank) => {
    if (!partner && !nameFallback) return `<span class="of-fill" style="min-width:320px;"></span>`;
    const lines = [`<b>${escapeComboHtml(nameFallback || partner?.name || "")}</b>`];
    const idAddr = [
      partner?.idno ? `IDNO ${escapeComboHtml(partner.idno)}` : "",
      partner?.address ? escapeComboHtml(partner.address) : ""
    ].filter(Boolean).join(", ");
    if (idAddr) lines.push(idAddr);
    if (withBank) {
      if (partner?.bankName) lines.push(`banca: ${escapeComboHtml(partner.bankName)}`);
      if (partner?.iban) lines.push(`IBAN: ${escapeComboHtml(partner.iban)}`);
    }
    return lines.join("<br>");
  };
  const auto = `${delivery.vehicle || ""}${delivery.trailer ? " + " + delivery.trailer : ""}`.trim();
  const esc = (v) => escapeComboHtml(v == null ? "" : String(v));
  const dateInv = formatDateShort(delivery.invoiceDate || delivery.createdAt);
  return `
  <style>
    .invx { font-family:'Times New Roman', Georgia, serif; color:#000; font-size:13px; }
    .invx table { width:100%; border-collapse:collapse; table-layout:fixed; }
    .invx .ibox td { border:1px solid #000; padding:6px 8px; vertical-align:top; word-wrap:break-word; }
    .invx .igoods td, .invx .igoods th { border:1px solid #000; padding:6px 8px; word-wrap:break-word; }
    .invx .igoods th { font-weight:bold; text-align:center; vertical-align:middle; }
    .invx .lbl { font-weight:bold; }
    .invx .val { font-weight:normal; margin-top:5px; line-height:1.4; }
    .invx .r { text-align:right; }
    .invx .c { text-align:center; }
    .invx .itotal { text-align:center; font-weight:bold; font-size:15px; margin:8px 0 4px; }
    .invx .idecl { font-style:italic; font-size:11.5px; text-align:justify; margin:12px 0 4px; line-height:1.4; }
    .invx .iplace { font-style:italic; font-size:12px; }
    .invx .isign { margin-top:52px; font-size:13px; }
    .invx .iline { border-bottom:1px solid #000; display:inline-block; min-width:230px; }
  </style>
  <div class="invx">
    <table class="ibox">
      <tr>
        <td style="width:50%">
          <div><span class="lbl">Invoice P №</span> ${esc(delivery.invoiceNumber)}</div>
          <div><span class="lbl">Data:</span> ${dateInv}</div>
        </td>
        <td style="width:50%"><span class="lbl">Contract Nr.</span> ${esc(delivery.contractNumber)} <span class="lbl">din</span> ${delivery.contractDate ? formatDateShort(delivery.contractDate) : ""}</td>
      </tr>
      <tr>
        <td style="height:130px"><span class="lbl">VANZATOR:</span><div class="val">${party(seller, delivery.seller, true)}</div></td>
        <td><span class="lbl">CUMPARATOR:</span><div class="val">${party(buyer, delivery.customer, true)}</div></td>
      </tr>
      <tr>
        <td style="height:130px"><span class="lbl">EXPORTATOR:</span><div class="val">${party(seller, delivery.seller, true)}</div></td>
        <td><span class="lbl">DESTINATAR:</span><div class="val">${party(buyer, delivery.customer, true)}</div></td>
      </tr>
      <tr>
        <td style="height:44px"><span class="lbl">Conditii de livrare</span><div class="val">${esc(delivery.unloadingPlace || delivery.deliveryTerms)}</div></td>
        <td><span class="lbl">AUTO:</span> ${esc(auto)}</td>
      </tr>
    </table>
    <table class="igoods">
      <tr>
        <th style="width:28%">Denumirea marfii</th>
        <th style="width:16%">Ambalajul</th>
        <th style="width:19%">Greutatea, tn</th>
        <th style="width:18%">Pretul in ${esc(cur)}</th>
        <th style="width:19%">Suma in ${esc(cur)}</th>
      </tr>
      <tr>
        <td style="height:40px">${esc(productInvoiceName(delivery.product) || delivery.product)}</td>
        <td class="c">In vrac</td>
        <td class="r">${actNum(tnQty, 3)}</td>
        <td class="r">${actNum(unitPerTn, 2)}</td>
        <td class="r">${actNum(sumCur, 2)}</td>
      </tr>
    </table>
    <div class="itotal">Total: ${actNum(sumCur, 2)} ${esc(cur)}</div>
    ${money.isForeign ? `<div class="r" style="font-size:10px;">Echivalent în lei (curs ${actNum(delivery.exchangeRate || 0, 4)}): ${actNum(totalLei, 2)} lei</div>` : ""}
    <p class="idecl">"Exportatorul produselor ce fac obiectul acestui document declară că, exceptînd cazul în care în mod expres este indicat altfel, aceste produse sînt de origine preferenţială Republica Moldova"</p>
    <div class="iplace">Or.Briceni, Republica Moldova</div>
    <div style="margin-top:6px;"><span class="lbl">Data:</span> ${dateInv}</div>
    <div class="isign">Administrator&nbsp;&nbsp;&nbsp;<span class="iline">&nbsp;</span></div>
  </div>`;
}

function buildPurchaseActPrintHtml(delivery, company) {
  // Act de achizitie is based on the source receipt's supplier
  const receipt = (receiptsCache || []).find((r) => Number(r.id) === Number(delivery.receiptId));
  const supplier = receipt ? findPartnerByName(receipt.supplier) : null;
  // Actul de achizitie reflecta RECEPTIA (cumpararea de la furnizor): cantitate neta + pret lei/kg.
  const qty = Number(
    receipt?.provisionalNetQuantity || receipt?.quantity ||
    (delivery.netWeight > 0 ? delivery.netWeight : delivery.deliveredQuantity) || 0
  ); // tone
  if (!receipt) {
    alert("Recepția sursă nu a fost găsită — reîncarcă pagina și încearcă din nou.");
    return "";
  }
  const priceRaw = Number(receipt.price || 0); // lei/kg
  // Aceeasi regula ca la actul din pagina „Documente tipar": randul arata valoarea BRUTA
  // (cantitate × pret), iar „Total de plata" e datoria REALA din registru (neta, dupa impozitul
  // retinut la sursa). Reținerea se deduce ca diferenta, deci documentul se inchide aritmetic.
  const gross = Number(receipt.preliminaryMerchandiseValue) || Number((qty * 1000 * priceRaw).toFixed(2));
  const netPay = Number(receipt.amountToPay ?? gross);
  const tax = Math.max(Number((gross - netPay).toFixed(2)), 0);
  // Pretul afisat se derivă din brut, ca „cantitate × preț = Sumă" să iasă exact pe hârtie.
  const price = qty > 0 ? Number((gross / (qty * 1000)).toFixed(4)) : priceRaw;
  return `${docHeader(company)}
    <div class="doc-title">Act de achiziție</div>
    <div class="doc-subtitle">${formatDateShort(delivery.createdAt)} · Recepție #${escapeComboHtml(String(delivery.receiptId))}</div>
    <div class="doc-party" style="margin-bottom:14px;">
      <h4>Furnizor</h4>
      <div><b>${escapeComboHtml(receipt?.supplier || "-")}</b></div>
      ${supplier?.idno ? `<div>IDNO: ${escapeComboHtml(supplier.idno)}</div>` : ""}
      ${supplier?.address ? `<div>${escapeComboHtml(supplier.address)}</div>` : ""}
      ${supplier?.bankName ? `<div>Banca: ${escapeComboHtml(supplier.bankName)} · IBAN: ${escapeComboHtml(supplier.iban || "-")}</div>` : ""}
    </div>
    <table class="doc-table">
      <thead><tr><th>Produs</th><th>Cantitate</th><th>Preț</th><th>Sumă</th></tr></thead>
      <tbody><tr><td>${escapeComboHtml(delivery.product || "")}</td><td>${formatNumber(qty * 1000)} kg</td><td>${moneyRo(price)}/kg</td><td>${moneyRo(gross)}</td></tr></tbody>
      <tfoot><tr><td colspan="3">VALOARE TOTALĂ</td><td>${moneyRo(gross)} MDL</td></tr></tfoot>
    </table>
    ${tax > 0 ? `<div class="doc-grid"><div><b>Rețineri la buget:</b> ${moneyRo(tax)} MDL</div></div>` : ""}
    <div class="doc-total">TOTAL DE PLATĂ: ${moneyRo(netPay)} MDL</div>
    <div class="doc-sign"><div>Furnizor</div><div>Achizitor AgroProfit+</div></div>`;
}

function buildCertificatePrintHtml(delivery) {
  // Cel mai recent raport de laborator care se POTRIVEȘTE la produsul livrat. Fără fallback pe alt
  // produs: dacă produsul (ex. porumb) nu are raport, certificatul rămâne cu câmpurile goale + notă.
  const lab = (currentConfig?.labReports || [])
    .filter((l) => l.active !== false && String(l.product).trim().toLowerCase() === String(delivery.product).trim().toLowerCase())
    .sort((a, b) => new Date(b.reportDate || 0) - new Date(a.reportDate || 0))[0];
  const seller = getSellerPartner(delivery);
  const buyer = getBuyerPartner(delivery);
  const L = lab || {};
  const money = deliveryInvoiceTotals(delivery);
  const kg = money.kg || Math.round(deliveryQtyTonnes(delivery) * 1000);
  const fl = (v, min) => `<span class="of-fill" style="min-width:${min || 90}px;">${escapeComboHtml(v === 0 || v ? String(v) : "")}</span>`;
  const auto = `${delivery.vehicle || ""}${delivery.trailer ? " + " + delivery.trailer : ""}`.trim();
  const afla = L.aflatoxinB1 ? escapeComboHtml(L.aflatoxinB1) : "nu s-a depistat";
  // Numărul certificatului = numărul facturii + „-CC" (crescător, legat de invoice); data = data facturii.
  const certNr = delivery.invoiceNumber ? `${delivery.invoiceNumber}-CC` : (L.reportNumber || "");
  const certDate = delivery.invoiceDate ? formatDateShort(delivery.invoiceDate) : (L.reportDate ? formatDateShort(L.reportDate) : "");
  // Denumirea produsului: din Nomenclator → Produse („Denumire pentru invoice/certificat"), altfel cea normală.
  const prodName = productInvoiceName(delivery.product) || L.product || delivery.product;
  return `
    <table style="width:100%;border-collapse:collapse;font-size:11px;"><tr>
      <td style="width:58%;vertical-align:top;">
        <div class="of-row">Cod Fiscal: ${fl(seller?.idno, 200)}</div>
        <div class="of-row">Denumirea companiei: ${fl(delivery.seller || seller?.name, 240)}</div>
      </td>
      <td style="vertical-align:top;text-align:center;font-size:10px;line-height:1.4;">
        Aprobat<br>Ministerul Economiei, Comerțului și<br>Agriculturii Moldovei<br>05 Aprilie 2021 nr. 72s<br>Forma tipică Nr. 42
      </td>
    </tr></table>
    <div class="of-title" style="margin-top:10px;">CERTIFICAT<small style="text-transform:none;font-weight:400;">Despre calitatea cerealelor</small></div>
    <div class="of-row of-c">Nr. ${fl(certNr, 120)} &nbsp; din ${fl(certDate, 120)}</div>

    <div class="of-row">Denumirea produsului: ${fl(prodName, 260)}</div>
    <div class="of-row">Țara de Origine: R. Moldova</div>
    <div class="of-row">Anul recoltei ${fl(L.harvestYear, 80)} &nbsp; Tipul ${fl(L.grainType, 110)} &nbsp; Subtipul ${fl(L.subtype, 120)}</div>
    <div class="of-row">Clasa ${fl(L.grainClass, 120)} &nbsp; Umiditatea ${fl(L.humidity, 60)} % &nbsp; Calitatea ${fl(L.quality, 120)}</div>
    <div class="of-row">Culoare ${fl(L.color, 120)} &nbsp; Miros ${fl(L.smell, 120)} &nbsp; Aflatoxina B1 ${afla}</div>
    <div class="of-row">Impurități totale ${fl(L.impuritiesTotal, 60)} % &nbsp; impurități diverse ${fl(L.impuritiesDiverse, 60)} %</div>
    <div class="of-row">Boabe sparte ${fl(L.brokenGrains, 60)} % &nbsp; boabe încolțite ${fl(L.sproutedGrains, 60)} %</div>
    <div class="of-row">Boabe defecte ${fl(L.defectiveGrains, 60)} %</div>
    <div class="of-row">RAPORT DE ÎNCERCĂRI NR. ${fl(L.reportNumber, 160)}</div>
    <div class="of-row">Destinația Produsului: ${fl(L.destination, 320)}</div>
    <div class="of-row">Exportator: ${fl(delivery.seller || seller?.name, 280)}</div>
    <div class="of-row">Importator: ${fl(delivery.customer || buyer?.name, 280)}</div>
    <div class="of-row">Cantitate ${fl(kg ? formatNumber(kg) : "", 140)} kg</div>
    <div class="of-row">Auto: ${fl(auto, 240)}</div>
    <div class="of-row">Factura nr. ${fl(delivery.invoiceNumber, 130)} din ${fl(delivery.invoiceDate ? formatDateShort(delivery.invoiceDate) : "", 120)}</div>
    ${!lab ? `<div class="of-row of-cap" style="text-align:left;font-size:9px;">* Nu există date de laborator pentru „${escapeComboHtml(delivery.product || "")}" — câmpurile de calitate rămân goale (completează în Nomenclator → Date laborator).</div>` : ""}
    <div class="of-sign" style="margin-top:26px;">
      <div class="col">Director<div class="ln of-cap">semnătura</div></div>
      <div class="col"></div>
    </div>`;
}

// Helpers for delivery print docs (Modul E)
function getSellerPartner(delivery) {
  if (delivery.sellerId) {
    const byId = (currentConfig?.partners || []).find((p) => Number(p.id) === Number(delivery.sellerId));
    if (byId) return byId;
  }
  return findPartnerByName(delivery.seller);
}
function getBuyerPartner(delivery) {
  if (delivery.customerId) {
    const byId = (currentConfig?.partners || []).find((p) => Number(p.id) === Number(delivery.customerId));
    if (byId) return byId;
  }
  return findPartnerByName(delivery.customer);
}
function deliveryQtyTonnes(delivery) {
  return Number(delivery.netWeight > 0 ? delivery.netWeight : delivery.deliveredQuantity || delivery.plannedQuantity || 0);
}

function buildBonCantarHtml(delivery, company) {
  const seller = getSellerPartner(delivery);
  const buyer = getBuyerPartner(delivery);
  const qty = deliveryQtyTonnes(delivery);
  return `${docHeader(company)}
    <div class="doc-title">Bon de cântar</div>
    <div class="doc-subtitle">Nr. ${delivery.id} · ${formatDateShort(delivery.invoiceDate || delivery.createdAt)}</div>
    <div class="doc-parties">
      <div class="doc-party"><h4>Furnizor (vânzător)</h4><div><b>${delivery.seller || seller?.name || "-"}</b></div>${seller?.idno ? `<div>IDNO: ${seller.idno}</div>` : ""}</div>
      <div class="doc-party"><h4>Client</h4><div><b>${delivery.customer || buyer?.name || "-"}</b></div>${buyer?.idno ? `<div>IDNO: ${buyer.idno}</div>` : ""}</div>
    </div>
    <div class="doc-grid">
      <div><b>Autovehicul:</b> ${delivery.vehicle || "-"}${delivery.trailer ? " + remorcă " + delivery.trailer : ""}</div>
      <div><b>Produs:</b> ${delivery.product}</div>
      <div><b>Masă brută:</b> ${formatNumber(delivery.grossWeight || 0)} t</div>
      <div><b>Masă camion (tară):</b> ${formatNumber(delivery.tareWeight || 0)} t</div>
      <div><b>Masă netă:</b> ${formatNumber(qty)} t</div>
      <div><b>Data:</b> ${formatDateShort(delivery.invoiceDate || delivery.createdAt)}</div>
    </div>
    <div class="doc-sign"><div>Cântăritor</div><div>Șofer</div></div>`;
}

// CMR — formular DESENAT (nu suprapus peste scanare): fiecare casetă are numărul + eticheta
// (RO / RU / EN, ca pe formularul oficial), iar datele noastre stau CLAR în interiorul casetei
// corecte. Reprodus după modelul dat (formular „Statistica", 29 casete).
function buildCmrHtml(delivery) {
  const seller = getSellerPartner(delivery);
  const buyer = getBuyerPartner(delivery);
  const money = deliveryInvoiceTotals(delivery);
  // Caseta 11 „Вес брутто" = greutatea MĂRFII (la cereale în vrac, brut marfă = net marfă),
  // consecventă cu factura. NU masa camionului încărcat (delivery.grossWeight = camion + marfă).
  const grossKg = money.kg || Math.round(deliveryQtyTonnes(delivery) * 1000);
  const esc = (val) => escapeComboHtml(val == null ? "" : String(val));
  const dateLoad = formatDateShort(delivery.invoiceDate || delivery.createdAt);
  // Caseta 1 — Expeditor (vânzătorul din livrare).
  const senderVal = [seller?.name || delivery.seller, seller?.address, seller?.idno ? "IDNO " + seller.idno : "", "R. MOLDOVA"]
    .filter(Boolean).map(esc).join("<br>");
  // Caseta 2 — Destinatar (cumpărătorul).
  const consigneeVal = [buyer?.name || delivery.customer, buyer?.address, buyer?.idno ? "IDNO " + buyer.idno : ""]
    .filter(Boolean).map(esc).join("<br>");
  // Caseta 5 — „Invoice {nr} din {data}" + (opțional) documente/calitate introduse pe livrare.
  const invLine = delivery.invoiceNumber ? "INVOICE: " + esc(delivery.invoiceNumber) + " din " + dateLoad : "";
  const docsVal = [invLine, esc(delivery.cmrDocuments)].filter(Boolean).join("<br>");
  // Caseta 9 — descrierea CMR din nomenclatorul produsului (dacă e completată), altfel denumirea.
  const prod = (currentConfig?.products || []).find(
    (x) => String(x.name).trim().toLowerCase() === String(delivery.product || "").trim().toLowerCase()
  );
  const goodsVal = esc(prod?.cmrDescription || delivery.product).replace(/\n/g, "<br>");
  // Locuri de încărcare/descărcare (per livrare); țara încărcării implicit R. Moldova.
  const loadPlace = esc(delivery.loadingPlace);
  const loadCountry = esc(delivery.loadingCountry || (delivery.loadingPlace ? "R. MOLDOVA" : ""));
  const unloadPlace = esc(delivery.unloadingPlace);
  const unloadCountry = esc(delivery.unloadingCountry);
  const vehicle = esc(delivery.vehicle);
  const trailer = esc(delivery.trailer);

  // Helper: o casetă cu număr + etichetă trilingvă + valoarea noastră (dacă există).
  // n=nr casetă, ro/ru/en = etichete, val=continut, o={grow:umple spatiul, rule:linii orizontale}
  const box = (n, ro, ru, en, val, o = {}) => `
    <div class="cx-box${o.grow ? " cx-grow" : ""}${o.rule ? " cx-rule" : ""}" style="${o.style || ""}">
      <div class="cx-hd">${n ? `<span class="cx-n">${n}</span>` : ""}<span class="cx-l">${ro}${ru ? `<br><i>${ru}</i>` : ""}${en ? `<br><span class="cx-en">${en}</span>` : ""}</span></div>
      ${val ? `<div class="cx-v" style="${o.vStyle || ""}">${val}</div>` : ""}
    </div>`;

  // Sub-rând pentru casetele 3 și 4 (Localitate / Țară / Dată) — etichetă mică + valoare.
  const subRow = (ro, ru, en, val) => `
    <div class="cx-sub"><span class="cx-subl">${ro} / <i>${ru}</i> / ${en}</span><span class="cx-subv">${val || ""}</span></div>`;

  // Înălțimea utilă a paginii A4 = 297mm − marginile fizice date de padding-ul body-ului
  // (12mm sus+jos în openOfficialDocWindow). Formularul umple EXACT această înălțime.
  return `
  <style>
    .cmrx { width:100%; font-family:Arial,Helvetica,sans-serif; color:#000; font-size:9.5px; }
    .cmrx * { box-sizing:border-box; }
    /* Formularul umple exact pagina A4: coloană flexibilă pe toată înălțimea utilă, fără gol jos. */
    .cmrx .cx-outer { border:1.5px solid #000; height:272mm; display:flex; flex-direction:column; overflow:hidden; }
    .cmrx .cx-outer > table { flex:0 0 auto; }
    .cmrx .cx-outer > table.cx-fill { flex:1 1 auto; height:100%; }
    .cmrx table { width:100%; border-collapse:collapse; table-layout:fixed; }
    .cmrx td { border:1px solid #000; padding:0; vertical-align:top; }
    /* Coloanele antetului (1–5 stânga / 16–18 dreapta) se întind pe toată înălțimea blocului. */
    .cmrx .cx-col { display:flex; flex-direction:column; height:100%; }
    .cmrx .cx-box { padding:2px 5px 3px; display:flex; flex-direction:column; }
    .cmrx .cx-box + .cx-box { border-top:1px solid #000; }
    .cmrx .cx-grow { flex:1 1 auto; }
    /* Linii orizontale (rânduri de completat) în casetele goale — ca pe formularul oficial. */
    .cmrx .cx-rule { background-image:repeating-linear-gradient(to bottom, transparent 0, transparent 15px, #cfcfcf 15px, #cfcfcf 16px); background-position:0 22px; }
    .cmrx .cx-hd { display:flex; gap:4px; align-items:flex-start; }
    .cmrx .cx-n { font-weight:bold; font-size:12px; min-width:15px; }
    .cmrx .cx-l { font-size:7px; line-height:1.14; color:#111; }
    .cmrx .cx-l i { font-style:italic; }
    .cmrx .cx-en { color:#333; }
    .cmrx .cx-v { margin-top:3px; font-size:10.5px; font-weight:bold; line-height:1.3; white-space:normal; }
    .cmrx .cx-sub { display:flex; justify-content:space-between; gap:6px; border-top:1px solid #000; padding:2px 5px; min-height:16px; }
    .cmrx .cx-subl { font-size:6.5px; color:#111; line-height:1.1; padding-top:1px; }
    .cmrx .cx-subv { font-size:10.5px; font-weight:bold; text-align:right; }
    .cmrx .cx-title { text-align:center; font-size:8px; line-height:1.25; padding:4px 3px; border-bottom:1px solid #000; }
    .cmrx .cx-title b { font-size:9px; }
    .cmrx .cx-cmr { text-align:center; font-weight:bold; font-size:17px; letter-spacing:1px; margin-top:3px; }
    .cmrx .cx-goods td { padding:2px 3px; font-size:6.5px; line-height:1.12; }
    /* Rândul cu denumirile casetelor 6–12 = exact cât textul (fără spațiu în plus). */
    .cmrx .cx-ghead td { padding:1px 3px 2px; line-height:1.05; }
    .cmrx .cx-gnum { font-weight:bold; font-size:10px; }
    .cmrx .cx-gval { font-size:10.5px; font-weight:bold; }
    /* Antet dreapta: rândul „Seria MD Nr." cu emblema CMR ovală + disclaimerul trilingv. */
    .cmrx .cx-seria { display:flex; align-items:center; gap:6px; padding:3px 6px; border-bottom:1px solid #000; }
    .cmrx .cx-cmr-oval { border:1.5px solid #000; border-radius:50%; padding:1px 8px; font-weight:bold; font-size:11px; letter-spacing:1px; }
    .cmrx .cx-seria-t { font-size:10px; white-space:nowrap; }
    .cmrx .cx-seria-t b { font-size:14px; }
    .cmrx .cx-seria-nr { flex:1; border-bottom:1px solid #000; min-height:13px; font-weight:bold; font-size:12px; text-align:center; letter-spacing:2px; }
    .cmrx .cx-disc { display:flex; gap:6px; padding:2px 5px; border-bottom:1px solid #000; font-size:5.6px; line-height:1.16; text-align:justify; }
    .cmrx .cx-disc > div { flex:1; }
    .cmrx .cx-disc .cx-en { color:#333; }
    /* Caseta 19 — grila de plată (Preț transport, Reduceri, Sold ... × Expeditor/Valuta/Destinatar). */
    .cmrx .cx-pay { height:100%; }
    .cmrx .cx-pay td { border:1px solid #000; font-size:5.8px; line-height:1.06; padding:1px 2px; vertical-align:top; }
    .cmrx .cx-pay .cx-pay-h { text-align:center; }
    .cmrx .cx-pay .cx-pay-lbl { width:44%; }
    /* Caseta 14 — bifele Franco / Nu franco. */
    .cmrx .cx-fr { display:flex; flex-direction:column; gap:1px; font-size:6.5px; margin-top:2px; }
  </style>
  <div class="cmrx">
    <div class="cx-outer">
      <!-- ANTET: stânga casete 1–5, dreapta titlu + casete 16–18.
           Acest bloc absoarbe spațiul liber al paginii (cx-fill) => casetele 1,2 și
           16,17,18 sunt MARI (loc pentru ștampile), ca pe formularul original. -->
      <table class="cx-fill">
        <tr>
          <td style="width:60%;padding:0;">
            <div class="cx-col">
              ${box("1", "Expeditor (nume, adresă, țara)", "Отправитель (наименование, адрес, страна)", "Sender (name, address, country)", senderVal, { grow: true, rule: true })}
              ${box("2", "Destinatar (nume, adresă, țara)", "Получатель (наименование, адрес, страна)", "Consignee (name, address, country)", consigneeVal, { grow: true, rule: true })}
              <div class="cx-box" style="flex:1 1 auto;">
                <div class="cx-hd"><span class="cx-n">3</span><span class="cx-l">Locul prevăzut pentru livrarea mărfii<br><i>Место разгрузки груза</i><br><span class="cx-en">Place of delivery of the goods</span></span></div>
                ${subRow("Localitatea", "Место", "Place", unloadPlace)}
                ${subRow("Țara", "Страна", "Country", unloadCountry)}
                ${subRow("Data", "Дата", "Date", "")}
              </div>
              <div class="cx-box" style="flex:1 1 auto;">
                <div class="cx-hd"><span class="cx-n">4</span><span class="cx-l">Locul și data încărcării mărfii<br><i>Место и дата погрузки груза</i><br><span class="cx-en">Place and date of loading of the goods</span></span></div>
                ${subRow("Localitatea", "Место", "Place", loadPlace)}
                ${subRow("Țara", "Страна", "Country", loadCountry)}
                ${subRow("Data", "Дата", "Date", dateLoad)}
              </div>
              ${box("5", "Documente anexate", "Прилагаемые документы", "Documents attached", docsVal, { grow: true })}
            </div>
          </td>
          <td style="width:40%;padding:0;">
            <div class="cx-col">
              <div class="cx-title">
                <b>SCRISOARE DE TRANSPORT INTERNAȚIONAL</b><br>
                <i>МЕЖДУНАРОДНАЯ ТОВАРОТРАНСПОРТНАЯ НАКЛАДНАЯ</i><br>
                INTERNATIONAL CONSIGNMENT NOTE
              </div>
              <div class="cx-seria">
                <span class="cx-cmr-oval">CMR</span>
                <span class="cx-seria-t">Seria <b>MD</b> Nr.</span>
                <span class="cx-seria-nr">${esc(delivery.cmrSeries || "")}</span>
              </div>
              <div class="cx-disc">
                <div>Acest transport este supus, indiferent de orice clauză contrară, convenției relative la contractul de transport internațional de mărfuri pe șosele (C.M.R.)</div>
                <div class="cx-en"><i>Данная перевозка, несмотря ни на какие противоречащие оговорки, осуществляется в соответствии с условиями Конвенции о договоре международной дорожной перевозки грузов (КДПГ).</i><br>This carriage is notwithstanding any clause to the contrary, subject to the Convention on the contract for the international carriage of goods by road (CMR)</div>
              </div>
              ${box("16", "Transportator (nume, adresă, țara)", "Перевозчик (наименование, адрес, страна)", "Carrier (name, address, country)", "", { rule: true, style: "flex:1 1 0" })}
              ${box("17", "Transportatori succesivi (nume, adresă, țara)", "Последующий перевозчик", "Successive carriers", "", { rule: true, style: "flex:1 1 0" })}
              ${box("18", "Rezerve și observații ale transportatorilor", "Оговорки и замечания перевозчика", "Carrier's reservations and observations", "", { rule: true, style: "flex:1 1 0" })}
            </div>
          </td>
        </tr>
      </table>

      <!-- CASETELE MĂRFII 6–12 — înălțime FIXĂ, mai scurtă (nu mai umple pagina) -->
      <table class="cx-goods">
        <tr class="cx-ghead">
          <td style="width:12%"><span class="cx-gnum">6</span> Mărci și numere<br><i>Знаки и номера</i><br>Marks and Nos</td>
          <td style="width:10%"><span class="cx-gnum">7</span> Nr. de colete<br><i>Количество мест</i><br>Number of packages</td>
          <td style="width:12%"><span class="cx-gnum">8</span> Mod de ambalare<br><i>Род упаковки</i><br>Method of packing</td>
          <td style="width:32%"><span class="cx-gnum">9</span> Natura mărfii<br><i>Наименование груза</i><br>Nature of the goods</td>
          <td style="width:12%"><span class="cx-gnum">10</span> Nr. statistic<br><i>Статист. №</i><br>Statistical number</td>
          <td style="width:12%"><span class="cx-gnum">11</span> Greutate brută, kg<br><i>Вес брутто, кг</i><br>Gross weight in kg</td>
          <td style="width:10%"><span class="cx-gnum">12</span> Cubaj, m³<br><i>Объем, м³</i><br>Volume in m³</td>
        </tr>
        <tr>
          <td class="cx-rule" style="height:120px"></td>
          <td class="cx-rule"></td>
          <td class="cx-gval cx-rule" style="text-align:center;">${delivery.product ? "în vrac" : ""}</td>
          <td class="cx-gval cx-rule">${goodsVal}</td>
          <td class="cx-rule"></td>
          <td class="cx-gval" style="text-align:right;">${actNum(grossKg, 0)}</td>
          <td class="cx-rule"></td>
        </tr>
        <tr>
          <td style="font-size:6px;height:16px">Clasa / <i>Класс</i> / Class</td>
          <td style="font-size:6px">Cifra / <i>Цифра</i> / Number</td>
          <td style="font-size:6px">Litera / <i>Буква</i> / Letter</td>
          <td style="font-size:6px" colspan="4">(ADR*) / ДОПОГ</td>
        </tr>
      </table>

      <!-- 13 + 19 (instrucțiuni / plată) -->
      <table>
        <tr>
          <td style="width:60%">
            <div class="cx-box" style="min-height:88px;">
              <div class="cx-hd"><span class="cx-n">13</span><span class="cx-l">Instrucțiunile expeditorului (formalități vamale și oficiale)<br><i>Указания отправителя (таможенная и прочая обработка)</i><br><span class="cx-en">Sender's instructions (custom's and official formalities)</span></span></div>
              <div class="cx-grow cx-rule" style="min-height:26px;"></div>
              <div class="cx-l" style="border-top:1px solid #000;padding-top:2px;">Prețul declarat al mărfii<br><i>Объявленная стоимость груза</i><br><span class="cx-en">Avowed prices of goods</span></div>
              <div class="cx-l" style="border-top:1px solid #000;padding-top:2px;font-size:6px;">(La trecerea limitei de împuternicire conform cap. IV, art. 23. al. 3, plata anterioară p-u fraht se va preciza după primirea acordului)<br><i>(При превышении предела ответственности, предусмотренного гл. IV, ст. 23, п. 3 указывается только после согласования дополнительной платы к фрахту)</i></div>
            </div>
          </td>
          <td style="width:40%;padding:0;vertical-align:top;">
            <table class="cx-pay">
              <tr>
                <td class="cx-pay-lbl"><span class="cx-n">19</span> De plată<br><i>Подлежит оплате</i><br><span class="cx-en">To be paid by</span></td>
                <td class="cx-pay-h">Expeditor<br><i>Отправитель</i><br><span class="cx-en">Sender</span></td>
                <td class="cx-pay-h">Valuta<br><i>Валюта</i><br><span class="cx-en">Currency</span></td>
                <td class="cx-pay-h">Destinatar<br><i>Получатель</i><br><span class="cx-en">Consignee</span></td>
              </tr>
              <tr><td class="cx-pay-lbl">Preț transport / <i>Ставка</i> / Carriage charges</td><td></td><td></td><td></td></tr>
              <tr><td class="cx-pay-lbl">Reduceri / <i>Скидки</i> / Reductions</td><td></td><td></td><td></td></tr>
              <tr><td class="cx-pay-lbl">Sold / <i>Разность</i> / Balance</td><td></td><td></td><td></td></tr>
              <tr><td class="cx-pay-lbl">Sporuri / <i>Надбавки</i> / Supplem. charges</td><td></td><td></td><td></td></tr>
              <tr><td class="cx-pay-lbl">Accesorii / <i>Дополнительные сборы</i></td><td></td><td></td><td></td></tr>
              <tr><td class="cx-pay-lbl">Diverse / <i>Прочие</i> / Others</td><td></td><td></td><td></td></tr>
              <tr><td class="cx-pay-lbl">Total de plată / <i>Итого к оплате</i> / Total</td><td></td><td></td><td></td></tr>
            </table>
          </td>
        </tr>
        <tr>
          <td>
            <div class="cx-box" style="min-height:30px;">
              <div class="cx-hd"><span class="cx-n">14</span><span class="cx-l">Prescripții de francare / <i>Указания оплаты фрахта</i> / Instructions as to payment for carriage</span></div>
              <div class="cx-fr"><span>☐ Franco / <i>Франко</i> / Carriage paid</span><span>☐ Nu franco / <i>Нефранко</i> / Carriage forward</span></div>
            </div>
            <div class="cx-box" style="min-height:16px;border-top:1px solid #000;">
              <div class="cx-hd"><span class="cx-n">15</span><span class="cx-l">Rambursare / <i>Возврат</i> / Cash on delivery</span></div>
            </div>
          </td>
          <td>${box("20", "Convenții speciale", "Особые согласованные условия", "Special agreements", "", { style: "min-height:46px", rule: true })}</td>
        </tr>
      </table>

      <!-- 21 (încheiat) / 24 (recepția) -->
      <table>
        <tr>
          <td style="width:66%" colspan="2">
            <div class="cx-box" style="min-height:40px;">
              <div class="cx-hd"><span class="cx-n">21</span><span class="cx-l">Încheiat în<br><i>Составлена в</i><br>Established in</span></div>
              ${subRow("Localitatea", "Место", "Place", loadPlace)}
              ${subRow("Data", "Дата", "Date", dateLoad)}
            </div>
          </td>
          <td style="width:34%">
            <div class="cx-box" style="min-height:40px;">
              <div class="cx-hd"><span class="cx-n">24</span><span class="cx-l">Recepția mărfii<br><i>Груз получен</i><br>Goods received</span></div>
              ${subRow("Localitatea", "Место", "Place", "")}
              ${subRow("Data", "Дата", "Date", "")}
            </div>
          </td>
        </tr>
        <!-- 22 (sosiri) / 23 (foaie de parcurs) / 24 (sosire descărcare) -->
        <tr>
          <td style="width:33%">
            <div class="cx-box" style="min-height:38px;">
              <div class="cx-hd"><span class="cx-n">22</span><span class="cx-l">Sosirea la încărcare / <i>Прибытие под погрузку</i> / Arrive to loading</span></div>
              ${subRow("Sosirea / ora", "Прибытие / час", "Arrival", "")}
              ${subRow("Plecarea / ora", "Убытие / час", "Departure", "")}
            </div>
          </td>
          <td style="width:33%">
            <div class="cx-box" style="min-height:38px;">
              <div class="cx-hd"><span class="cx-n">23</span><span class="cx-l">Foaie de parcurs nr. / <i>Путевой лист №</i> / Waybill No</span></div>
              ${subRow("Numele șoferilor", "Фамилии водителей", "Name of drivers", "")}
            </div>
          </td>
          <td style="width:34%">
            <div class="cx-box cx-rule" style="min-height:38px;">
              <div class="cx-hd"><span class="cx-l">Sosirea la descărcare / <i>Прибытие под разгрузку</i> / Arrive to unloading<br>Plecarea / <i>Убытие</i> / Departure — ora / час</span></div>
            </div>
          </td>
        </tr>
        <!-- Semnături: expeditor / transportator / beneficiar -->
        <tr>
          <td>${box("", "Semnătura și ștampila expeditorului", "Подпись и штамп отправителя", "Signature and stamp of the consignor", "", { style: "min-height:40px" })}</td>
          <td>${box("", "Semnătura și ștampila transportatorului", "Подпись и штамп перевозчика", "Signature and stamp of the carrier", "", { style: "min-height:40px" })}</td>
          <td>${box("", "Semnătura și ștampila beneficiarului", "Подпись и штамп получателя", "Signature and stamp of the consignee", "", { style: "min-height:40px" })}</td>
        </tr>
      </table>

      <!-- 25 / 26 / 27 — numere de înmatriculare, marca, tarif -->
      <table>
        <tr>
          <td style="width:28%;padding:2px 5px 3px;">
            <div class="cx-hd"><span class="cx-n">25</span><span class="cx-l">Nr. înmatriculare / <i>Регистрац. номер</i> / Registered number</span></div>
            <div style="display:flex;margin-top:2px;">
              <div style="flex:1;border:1px solid #000;padding:1px 3px;"><div style="font-size:6px;color:#111;">Tractor / <i>Тягач</i></div><div class="cx-v">${vehicle}</div></div>
              <div style="flex:1;border:1px solid #000;border-left:0;padding:1px 3px;"><div style="font-size:6px;color:#111;">Semirem. / <i>Полуприцеп</i></div><div class="cx-v">${trailer}</div></div>
            </div>
          </td>
          <td style="width:22%;padding:2px 5px 3px;">
            <div class="cx-hd"><span class="cx-n">26</span><span class="cx-l">Marca / <i>Марка</i> / Mark</span></div>
            <div style="display:flex;margin-top:2px;">
              <div style="flex:1;border:1px solid #000;padding:1px 3px;min-height:20px;font-size:6px;color:#111;">Tractor / <i>Тягач</i></div>
              <div style="flex:1;border:1px solid #000;border-left:0;padding:1px 3px;min-height:20px;font-size:6px;color:#111;">Semirem. / <i>Полуприцеп</i></div>
            </div>
          </td>
          <td style="width:50%;padding:2px 5px 3px;">
            <div class="cx-hd"><span class="cx-n">27</span><span class="cx-l">Tarif I / <i>Тариф I за 1 км</i> · Distanța tarifară / <i>Тарифное расстояние</i> · % utilizare / <i>Поясной коэфф.</i> · Alte suplimente / <i>Прочие доплаты</i> · Sumă / <i>Сумма</i></span></div>
          </td>
        </tr>
      </table>

      <!-- 28 / 29 — grila tarifară (se completează de transportator) -->
      <table class="cx-goods">
        <tr>
          <td style="width:6%"><span class="cx-gnum">28</span></td>
          <td>Distanța / <i>Тарифное расстояние, км</i></td>
          <td>Схема</td>
          <td>Тарифный вес, т</td>
          <td>Тариф за 1 т</td>
          <td>Надбавки</td>
          <td>Скидки</td>
          <td>Прочие доплаты</td>
          <td>К оплате</td>
          <td style="width:16%">Отчисления</td>
        </tr>
        <tr>
          <td style="height:26px">Тариф II</td>
          <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
          <td>Оплачено заказчиком</td>
        </tr>
        <tr>
          <td style="height:26px"><span class="cx-gnum">29</span> Тариф III</td>
          <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
          <td>К оплате</td>
          <td>Валюта / Код плательщика</td>
        </tr>
      </table>
    </div>
  </div>`;
}

function buildImputernicireHtml(delivery) {
  const seller = getSellerPartner(delivery);
  const buyer = getBuyerPartner(delivery);
  const qty = deliveryQtyTonnes(delivery);
  const auto = `${delivery.vehicle || ""}${delivery.trailer ? " + " + delivery.trailer : ""}`.trim();
  const fill = (v, min) => `<span class="of-fill" style="min-width:${min || 160}px;">${escapeComboHtml(v || "")}</span>`;
  return `
    <div class="of-title" style="margin-bottom:16px;">ÎMPUTERNICIRE</div>
    <p class="of-just" style="line-height:1.9;">Subscrisa, ${fill(delivery.seller || seller?.name, 300)}, reprezentată, în calitate de administrator, declară că împuternicește societatea ${fill(delivery.customer || buyer?.name, 300)}, reprezentată de ${fill("", 200)}, în calitate de administrator, să reprezinte pe teritoriul Uniunii Europene în vederea comercializării cerealelor, pentru unitatea de transport ${fill(auto, 180)} — cantitate ${fill(qty ? formatNumber(qty) : "", 90)} tn. Origine Republica Moldova.</p>
    <div class="of-row" style="margin-top:26px;">Data ${fill("", 180)}</div>
    <div class="of-sign" style="margin-top:26px;">
      <div class="col">Administrator<div class="ln of-cap">semnătura</div></div>
      <div class="col"></div>
    </div>`;
}

function buildDeclaratieHtml(delivery, company) {
  const seller = getSellerPartner(delivery);
  const buyer = getBuyerPartner(delivery);
  return `${docHeader(company)}
    <div class="doc-title">Declarație</div>
    <div class="doc-subtitle">${formatDateShort(delivery.invoiceDate || delivery.createdAt)}</div>
    <p style="font-size:13px;line-height:1.7;margin:16px 0;">
      Subscrisa <b>${escapeComboHtml(delivery.seller || seller?.name || "________________")}</b>${seller?.idno ? ` (IDNO ${escapeComboHtml(seller.idno)})` : ""}${seller?.address ? `, cu sediul în ${escapeComboHtml(seller.address)}` : ""},
      declară că marfa <b>${escapeComboHtml(delivery.product || "")}</b> livrată conform contractului nr. <b>${escapeComboHtml(delivery.contractNumber || "______")}</b>
      către <b>${escapeComboHtml(delivery.customer || buyer?.name || "________________")}</b>${buyer?.idno ? ` (IDNO ${escapeComboHtml(buyer.idno)})` : ""}
      corespunde condițiilor de calitate și provine din surse legale.
    </p>
    <div class="doc-sign"><div>Vânzător</div><div></div></div>`;
}

function printDeliveryDocument(deliveryId, docType) {
  const delivery = (deliveriesCache || []).find((d) => Number(d.id) === Number(deliveryId));
  if (!delivery) return;
  // Compania de antet aleasă în pagina Livrări (gol → AgroProfit+ implicit). Se aplică documentelor
  // „interne" cu antet de firmă (Bon, Act de achiziție, Declarație).
  const headerCompany = printHeaderCompany(document.getElementById("delivery-doc-company")?.value);
  let html = "";
  let title = "";
  if (docType === "invoice") { html = buildInvoicePrintHtml(delivery); title = `Factura ${delivery.invoiceNumber || delivery.id}`; }
  else if (docType === "act") {
    // Actul de achizitie documenteaza cumpararea de la un furnizor (receptie). Livrarile pe
    // produs nu au o receptie/furnizor unic, deci documentul nu se poate genera.
    if (!delivery.receiptId) {
      alert("Actul de achiziție este disponibil doar pentru livrări legate de o recepție (cu furnizor).");
      return;
    }
    html = buildPurchaseActPrintHtml(delivery, headerCompany); title = `Act achizitie ${delivery.id}`;
  }
  else if (docType === "certificate") { html = buildCertificatePrintHtml(delivery); title = `Certificat calitate ${delivery.id}`; }
  else if (docType === "bon") { html = buildBonCantarHtml(delivery, headerCompany); title = `Bon cantar ${delivery.id}`; }
  else if (docType === "cmr") { html = buildCmrHtml(delivery); title = `CMR ${delivery.id}`; }
  else if (docType === "imputernicire") { html = buildImputernicireHtml(delivery); title = `Imputernicire ${delivery.id}`; }
  else if (docType === "declaratie") { html = buildDeclaratieHtml(delivery, headerCompany); title = `Declaratie ${delivery.id}`; }
  // Formele refăcute fidel modelelor originale se tipăresc alb-negru, fără antet AgroProfit.
  const officialDocs = ["invoice", "certificate", "cmr", "imputernicire"];
  if (html) {
    if (officialDocs.includes(docType)) openOfficialDocWindow(html, title);
    else openPrintWindow(html, title);
  }
  // Close the print dropdown after choosing
  document.querySelectorAll(".print-menu[open]").forEach((d) => d.removeAttribute("open"));
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
          <td>${formatNumber(r.quantity * 1000)} kg</td>
          <td>${currency.format(r.price)}/kg</td>
          <td>${currency.format(r.amount)}</td>
        </tr>`).join("")
    : '<tr><td colspan="6" class="empty-state">Nicio recepție în perioadă.</td></tr>';

  const paymentRows = data.payments.length
    ? data.payments.map((pm) => `
        <tr>
          <td>#${pm.id}</td>
          <td>${formatDateShort(pm.date)}</td>
          <td>${escapeComboHtml(pm.paymentType || "-")}</td>
          <td>${escapeComboHtml(pm.note || "")}</td>
          <td>${escapeComboHtml(pm.reference || "-")}</td>
          <td>${currency.format(pm.amount)}</td>
        </tr>`).join("")
    : '<tr><td colspan="6" class="empty-state">Nicio achitare în perioadă.</td></tr>';

  const deliveries = data.deliveries || [];
  const collections = data.collections || [];
  const hasCustomerSide = deliveries.length > 0 || collections.length > 0;

  const deliveryRows = deliveries.length
    ? deliveries.map((d) => `
        <tr>
          <td>#${d.id}</td>
          <td>${formatDateShort(d.date)}</td>
          <td>${escapeComboHtml(d.product || "")}</td>
          <td>${formatNumber(d.quantity * 1000)} kg</td>
          <td>${currency.format(d.amount)}</td>
        </tr>`).join("")
    : '<tr><td colspan="5" class="empty-state">Nicio livrare în perioadă.</td></tr>';

  const collectionRows = collections.length
    ? collections.map((c) => `
        <tr>
          <td>#${c.id}</td>
          <td>${formatDateShort(c.date)}</td>
          <td>${escapeComboHtml(c.paymentType || "-")}</td>
          <td>${escapeComboHtml(c.note || "")}</td>
          <td>${escapeComboHtml(c.reference || "-")}</td>
          <td>${currency.format(c.amount)}</td>
        </tr>`).join("")
    : '<tr><td colspan="6" class="empty-state">Nicio încasare în perioadă.</td></tr>';

  const balanceColor = t.balance > 0 ? "var(--danger)" : t.balance < 0 ? "var(--accent-bright)" : "var(--muted)";
  const balanceText = t.balance > 0
    ? `Noi datorăm partenerului: ${currency.format(t.balance)}`
    : t.balance < 0
      ? `Partenerul ne datorează: ${currency.format(Math.abs(t.balance))}`
      : "Sold zero — achitat integral";

  const customerSide = hasCustomerSide ? `
    <h4 class="statement-sub">Livrări (partenerul cumpără)</h4>
    <div class="table-wrap">
      <table>
        <thead><tr><th>ID</th><th>Data</th><th>Produs</th><th>Cantitate</th><th>Sumă</th></tr></thead>
        <tbody>${deliveryRows}</tbody>
        <tfoot><tr class="totals-row"><td colspan="3">TOTAL livrări (${deliveries.length})</td><td>${formatNumber((t.totalDeliveredQuantity || 0) * 1000)} kg</td><td>${currency.format(t.totalDeliveries || 0)}</td></tr></tfoot>
      </table>
    </div>

    <h4 class="statement-sub">Încasări</h4>
    <div class="table-wrap">
      <table>
        <thead><tr><th>ID</th><th>Data</th><th>Tip</th><th>Comentariu</th><th>Referință</th><th>Sumă</th></tr></thead>
        <tbody>${collectionRows}</tbody>
        <tfoot><tr class="totals-row"><td colspan="5">TOTAL încasat (${collections.length})</td><td>${currency.format(t.totalCollected || 0)}</td></tr></tfoot>
      </table>
    </div>` : "";

  resultEl.innerHTML = `
    <div class="statement-partner">
      <h3>${escapeComboHtml(p.name || "")}</h3>
      <div class="statement-partner-meta">
        ${p.idno ? `IDNO: ${escapeComboHtml(p.idno)} · ` : ""}${escapeComboHtml(p.fiscalProfile || "")}
        ${p.address ? `<br>Adresa: ${escapeComboHtml(p.address)}` : ""}
        ${p.bankName || p.iban ? `<br>Banca: ${escapeComboHtml(p.bankName || "-")} · IBAN: ${escapeComboHtml(p.iban || "-")}` : ""}
      </div>
    </div>

    <h4 class="statement-sub">Recepții (partenerul furnizează)</h4>
    <div class="table-wrap">
      <table>
        <thead><tr><th>ID</th><th>Data</th><th>Produs</th><th>Cantitate</th><th>Preț</th><th>Sumă</th></tr></thead>
        <tbody>${receiptRows}</tbody>
        <tfoot><tr class="totals-row"><td colspan="3">TOTAL recepții (${data.receipts.length})</td><td>${formatNumber(t.totalQuantity * 1000)} kg</td><td></td><td>${currency.format(t.totalReceipts)}</td></tr></tfoot>
      </table>
    </div>

    <h4 class="statement-sub">Achitări (către partener)</h4>
    <div class="table-wrap">
      <table>
        <thead><tr><th>ID</th><th>Data</th><th>Tip plată</th><th>Comentariu</th><th>Referință</th><th>Sumă</th></tr></thead>
        <tbody>${paymentRows}</tbody>
        <tfoot><tr class="totals-row"><td colspan="5">TOTAL achitat (${data.payments.length})</td><td>${currency.format(t.totalPaid)}</td></tr></tfoot>
      </table>
    </div>
    ${customerSide}

    <div class="statement-balance" style="border-color:${balanceColor};color:${balanceColor};">
      <span>SOLD FINAL</span>
      <strong>${balanceText}</strong>
    </div>
  `;
}

function printSupplierStatement() {
  if (!lastStatement) return;
  const headerCompany = printHeaderCompany(document.getElementById("statement-doc-company")?.value);
  const html = buildStatementPrintHtml(lastStatement, headerCompany);
  openPrintWindow(html, `Act de verificare - ${lastStatement.partner.name}`);
}

// Refresh the data behind a view so lists are always fresh on open
async function refreshViewData(view) {
  try {
    if (view === "receptii") {
      await Promise.all([loadReceipts(), loadDailyReport()]);
    } else if (view === "procesare") {
      await Promise.all([loadProcessings(), loadReceipts(), loadStocks(), loadTransfers()]);
    } else if (view === "transferuri") {
      await Promise.all([loadStocks(), loadTransfers()]);
    } else if (view === "livrari") {
      await Promise.all([loadDeliveries(), loadReceipts()]);
    } else if (view === "reclamatii") {
      await Promise.all([loadComplaints(), loadDeliveries()]);
    } else if (view === "financiar") {
      await Promise.all([loadTransactions(), loadReceipts(), loadDeliveries()]);
    } else if (view === "stoc") {
      await Promise.all([loadStocks(), loadReceipts(), loadDeliveries()]);
      renderStockPeriod();
    } else if (view === "rapoarte") {
      // SINCRON, înainte de orice fetch: golește+ascunde panoul de activitate pentru non-admin,
      // ca setView (care afișează după data-view) să nu lase vizibil nicio clipă tabelul vechi.
      renderUserActivity();
      // Ecranul Rapoarte conține și raportul zilnic (panoul lui) — îl reîmprospătăm la deschidere.
      const rapoarteLoads = [loadReceipts(), loadProcessings(), loadDeliveries(), loadDailyReport()];
      // Jurnalul de audit (posibil mare) se aduce DOAR pentru admin — singurul care vede
      // panoul „Activitate utilizatori". Celelalte roluri nu-l descarcă degeaba.
      if (canAccess("security-admin")) rapoarteLoads.push(loadAuditLogs());
      await Promise.all(rapoarteLoads);
      populateLossesProductFilter();
      renderLossesReport();
      renderUserActivity();
      renderFieldYield();
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

// Butonul „✕" din antetul sidebar-ului (vizibil doar in modul drawer, pe ecrane mici).
const sidebarCloseEl = document.getElementById("sidebar-close");
if (sidebarCloseEl) {
  sidebarCloseEl.addEventListener("click", closeSidebarDrawer);
}

// Butonul „Meniu" din bara de jos (telefon): deschide lista completa (drawer).
const bottomNavMoreEl = document.getElementById("bottom-nav-more");
if (bottomNavMoreEl) {
  bottomNavMoreEl.addEventListener("click", openSidebarDrawer);
}

productSelect.addEventListener("change", () => {
  humidityInput.value = "";
  impurityInput.value = "";
  syncUnitByProduct();
});
supplierSearchInput.addEventListener("input", () => {
  // Orice editare manuala invalideaza selectia anterioara (forteaza alegere constienta)
  const hadSupplier = supplierIdInput.value !== "";
  supplierIdInput.value = "";
  if (newSupplierNameInput) newSupplierNameInput.value = "";
  toggleNewSupplierInput();
  renderSupplierSuggestions();
  // Recalculam estimate-ul DOAR cand chiar s-a golit o selectie (nu la fiecare tasta).
  if (hadSupplier) renderReceiptEstimate();
});
supplierSearchInput.addEventListener("focus", () => {
  renderSupplierSuggestions();
});
supplierSearchInput.addEventListener("blur", () => {
  // mic delay ca pointerdown/mousedown pe sugestie sa apuce sa ruleze
  window.setTimeout(closeSupplierSuggestions, 120);
});
supplierSearchInput.addEventListener("keydown", (event) => {
  if (supplierSuggestionsEl.hidden) return;
  const items = Array.from(supplierSuggestionsEl.querySelectorAll(".combobox-item"));
  if (!items.length) return;
  if (event.key === "ArrowDown") {
    event.preventDefault();
    supplierActiveIndex = Math.min(supplierActiveIndex + 1, items.length - 1);
    updateActiveSuggestion();
  } else if (event.key === "ArrowUp") {
    event.preventDefault();
    supplierActiveIndex = Math.max(supplierActiveIndex - 1, 0);
    updateActiveSuggestion();
  } else if (event.key === "Enter") {
    if (supplierActiveIndex >= 0 && items[supplierActiveIndex]) {
      event.preventDefault();
      handleSuggestionPick(items[supplierActiveIndex]);
    }
  } else if (event.key === "Escape") {
    closeSupplierSuggestions();
  }
});
// Selectie touch/mouse: pointerdown + preventDefault ca blur sa nu inchida lista inainte de alegere.
supplierSuggestionsEl.addEventListener("pointerdown", (event) => {
  const li = event.target.closest(".combobox-item");
  if (!li) return;
  event.preventDefault();
  handleSuggestionPick(li);
});
supplierSuggestionsEl.addEventListener("mousedown", (event) => {
  if (window.PointerEvent) return;
  const li = event.target.closest(".combobox-item");
  if (!li) return;
  event.preventDefault();
  handleSuggestionPick(li);
});
humidityInput.addEventListener("input", renderReceiptEstimate);
impurityInput.addEventListener("input", renderReceiptEstimate);
grossWeightInput.addEventListener("input", renderReceiptEstimate);
tareWeightInput.addEventListener("input", renderReceiptEstimate);
formEl.elements.price.addEventListener("input", renderReceiptEstimate);
receiptStatusFilterEl.addEventListener("change", () => renderReceipts(receiptsCache));
receiptProductFilterEl.addEventListener("change", () => renderReceipts(receiptsCache));
receiptSupplierFilterEl?.addEventListener("change", () => renderReceipts(receiptsCache));
receiptPaymentFilterEl?.addEventListener("change", () => renderReceipts(receiptsCache));
receiptDateFromEl?.addEventListener("change", () => renderReceipts(receiptsCache));
receiptDateToEl?.addEventListener("change", () => renderReceipts(receiptsCache));

// #3 Filtru parteneri (toolbar static -> re-randeaza doar lista, focusul ramane pe input).
const partnerFilterQ = document.getElementById("partner-filter-q");
const partnerFilterRole = document.getElementById("partner-filter-role");
const partnerFilterFiscal = document.getElementById("partner-filter-fiscal");
const partnerFilterStatus = document.getElementById("partner-filter-status");
function rerenderPartners() {
  renderMiniList("partners", (currentConfig && currentConfig.partners) || []);
}
partnerFilterQ?.addEventListener("input", () => {
  partnerFilters.q = partnerFilterQ.value;
  rerenderPartners();
});
partnerFilterRole?.addEventListener("change", () => {
  partnerFilters.role = partnerFilterRole.value;
  rerenderPartners();
});
partnerFilterFiscal?.addEventListener("change", () => {
  partnerFilters.fiscal = partnerFilterFiscal.value;
  rerenderPartners();
});
partnerFilterStatus?.addEventListener("change", () => {
  partnerFilters.status = partnerFilterStatus.value;
  rerenderPartners();
});

// "Achită" buttons in receipts table (Modul Achitări)
bodyEl?.addEventListener("click", (event) => {
  const btn = event.target.closest(".achita-btn");
  if (!btn) return;
  prefillReceiptPayment(btn.dataset.achita);
});

// ----- Detalii recepție: vedere completă (date operator + observații + poze) -----
const receiptDetailsDialog = document.getElementById("receipt-details-dialog");

function rdRow(label, value) {
  if (value === undefined || value === null || value === "" || value === "—" || value === "-") return "";
  return `<div class="rd-row"><span class="rd-label">${label}</span><span class="rd-value">${value}</span></div>`;
}

function rdPhotoGroup(title, photos) {
  if (!photos.length) return "";
  const thumbs = photos
    .map((p) => `<a href="${photoUrl(p)}" target="_blank" rel="noopener" class="rd-photo"><img src="${photoUrl(p)}" alt="${escapeComboHtml(title)}" loading="lazy" /></a>`)
    .join("");
  return `<div class="rd-photo-group"><span class="rd-photo-title">${title}</span><div class="rd-photo-row">${thumbs}</div></div>`;
}

function openReceiptDetails(id) {
  if (!receiptDetailsDialog) return;
  const item = receiptsCache.find((r) => String(r.id) === String(id));
  if (!item) {
    window.alert("Recepția nu a fost găsită.");
    return;
  }
  const fin = canAccess("finance");
  const titleEl = document.getElementById("receipt-details-title");
  if (titleEl) titleEl.textContent = `Recepție #${item.id} — ${item.product || ""}`.trim();

  // Poze grupate pe categorie (brut / neto / mașină / altul)
  const groups = { brut: [], neto: [], masina: [], altul: [] };
  (Array.isArray(item.photos) ? item.photos : []).forEach((p) => {
    const kind = p && typeof p === "object" && p.kind ? p.kind : "altul";
    (groups[kind] || groups.altul).push(p);
  });
  const hasPhotos = Object.values(groups).some((g) => g.length);
  const photosHtml = hasPhotos
    ? rdPhotoGroup("Masă brută", groups.brut) +
      rdPhotoGroup("Masă netă", groups.neto) +
      rdPhotoGroup("Nr. mașină", groups.masina) +
      rdPhotoGroup("Alte poze", groups.altul)
    : `<p class="rd-empty">Fără poze atașate.</p>`;

  const valoare = Number(item.amountToPay ?? item.preliminaryPayableAmount ?? 0);
  const achitat = Number(item.paidAmount || 0);
  const rest = Number(item.soldRestant ?? Math.max(valoare - achitat, 0));
  const net = item.provisionalNetQuantity || item.quantity;
  const kg = (v) => (Number(v) > 0 ? formatNumber(Number(v)) + " kg" : "—");

  const finBlock = fin
    ? `<div class="rd-section"><h4>Financiar</h4>
        ${rdRow("Preț / kg", Number(item.price) > 0 ? currency.format(Number(item.price)) : "—")}
        ${rdRow("Valoare preliminară", currency.format(valoare))}
        ${rdRow("Achitat", currency.format(achitat))}
        ${rdRow("Rest", currency.format(rest))}
        ${rdRow("Stare plată", escapeComboHtml(item.paymentStatus || "—"))}
        ${rdRow("Ultima plată", formatDateShort(item.lastPaymentDate))}
        ${item.amountNote ? rdRow("Corectare valoare", escapeComboHtml(item.amountNote)) : ""}
      </div>`
    : "";

  const body = document.getElementById("receipt-details-body");
  body.innerHTML = `
    <div class="rd-section">
      <h4>General</h4>
      ${rdRow("Status", escapeComboHtml(item.status || "—"))}
      ${rdRow("Data recepției", formatDateShort(item.createdAt || item.receivedAt))}
      ${rdRow("Furnizor", escapeComboHtml(item.supplier || "—"))}
      ${rdRow("Produs", escapeComboHtml(item.product || "—"))}
      ${rdRow("Locație", escapeComboHtml(item.location || "—"))}
      ${rdRow("Vehicul", escapeComboHtml(item.vehicle || "—"))}
      ${rdRow("Recepționat de", escapeComboHtml(item.receivedBy || "—"))}
    </div>
    <div class="rd-section">
      <h4>Cântar & cantitate</h4>
      ${rdRow("Masă brută", kg(item.grossWeight))}
      ${rdRow("Tara", kg(item.tareWeight))}
      ${rdRow("Masă netă", kg(item.netWeight))}
      ${rdRow("Cantitate", Number(net) > 0 ? formatNumber(Number(net)) + " t" : "—")}
      ${rdRow("Apă eliminată (recepție)", Number(item.estimatedWaterLoss) > 0 ? formatNumber(Math.round(Number(item.estimatedWaterLoss) * 1000)) + " kg" : "—")}
    </div>
    <div class="rd-section">
      <h4>Calitate</h4>
      ${rdRow("Umiditate", item.humidity != null && item.humidity !== "" ? item.humidity + " %" : "—")}
      ${rdRow("Impurități", item.impurity != null && item.impurity !== "" ? item.impurity + " %" : "—")}
      ${rdRow("Normă umiditate", item.humidityNorm ? item.humidityNorm + " %" : "")}
      ${rdRow("Normă impurități", item.impurityNorm ? item.impurityNorm + " %" : "")}
    </div>
    ${finBlock}
    <div class="rd-section">
      <h4>Observații operator</h4>
      ${item.note ? `<p class="rd-note">${escapeComboHtml(item.note)}</p>` : `<p class="rd-empty">Fără observații.</p>`}
    </div>
    <div class="rd-section">
      <h4>Poze</h4>
      ${photosHtml}
    </div>
  `;
  receiptDetailsDialog.showModal();
}

// Buton „Detalii" pe rânduri (recepții recente + în descărcare)
function onReceiptDetailsClick(event) {
  const trigger = event.target.closest('[data-action="receipt-details"]');
  if (!trigger) return;
  openReceiptDetails(trigger.dataset.id);
}
bodyEl?.addEventListener("click", onReceiptDetailsClick);
pendingWeighingBody?.addEventListener("click", onReceiptDetailsClick);
document.getElementById("receipt-details-close")?.addEventListener("click", () => receiptDetailsDialog?.close());
document.getElementById("receipt-details-close-2")?.addEventListener("click", () => receiptDetailsDialog?.close());

// ----- Detalii reclamație (oglinda „Detalii" de la recepții) -----
const complaintDetailsDialog = document.getElementById("complaint-details-dialog");
function openComplaintDetails(id) {
  if (!complaintDetailsDialog) return;
  const item = (complaintsCache || []).find((c) => String(c.id) === String(id));
  if (!item) { window.alert("Reclamația nu a fost găsită."); return; }
  const titleEl = document.getElementById("complaint-details-title");
  if (titleEl) titleEl.textContent = `Reclamație #${item.id} — ${item.customer || ""}`.trim();
  const t = (v, suf = "") => (Number(v) > 0 ? formatNumber(Number(v)) + suf : "—");
  const lei = (v) => (Number(v) > 0 ? currency.format(Number(v)) : "—");
  document.getElementById("complaint-details-body").innerHTML = `
    <div class="rd-section"><h4>General</h4>
      ${rdRow("Status", escapeComboHtml(item.status || "—"))}
      ${rdRow("Data", formatDateShort(item.createdAt))}
      ${rdRow("Client", escapeComboHtml(item.customer || "—"))}
      ${rdRow("Produs", escapeComboHtml(item.product || "—"))}
      ${rdRow("Tip reclamație", escapeComboHtml(item.complaintType || "—"))}
      ${rdRow("Livrare asociată", item.deliveryId ? "#" + item.deliveryId : "—")}
    </div>
    <div class="rd-section"><h4>Cantități & sume</h4>
      ${rdRow("Cantitate livrată inițial", t(item.deliveryQuantity, " t"))}
      ${rdRow("Cantitate reclamată", t(item.contestedQuantity, " t"))}
      ${rdRow("Valoare livrare", lei(item.deliveryTotal))}
      ${rdRow("Sumă diminuată", lei(item.deductedAmount))}
      ${rdRow("Mod rezolvare", escapeComboHtml(item.resolutionType || "—"))}
    </div>
    <div class="rd-section"><h4>Procesare</h4>
      ${rdRow("Acceptată de", escapeComboHtml(item.acceptedBy || "—"))}
      ${rdRow("Data acceptării", formatDateShort(item.acceptedAt))}
      ${rdRow("Închisă de", escapeComboHtml(item.closedBy || "—"))}
      ${rdRow("Data închiderii", formatDateShort(item.closedAt))}
    </div>
    <div class="rd-section"><h4>Observații</h4>
      ${item.note ? `<p class="rd-note">${escapeComboHtml(item.note)}</p>` : `<p class="rd-empty">Fără observații.</p>`}
    </div>`;
  complaintDetailsDialog.showModal();
}
complaintsBodyEl?.addEventListener("click", (e) => {
  const trigger = e.target.closest('[data-action="complaint-details"]');
  if (trigger) openComplaintDetails(trigger.dataset.id);
});
document.getElementById("complaint-details-close")?.addEventListener("click", () => complaintDetailsDialog?.close());
document.getElementById("complaint-details-close-2")?.addEventListener("click", () => complaintDetailsDialog?.close());

// ----- Detalii procesare (+ corectare pentru administrator) -----
const processingDetailsDialog = document.getElementById("processing-details-dialog");
function openProcessingDetails(id) {
  if (!processingDetailsDialog) return;
  const item = (processingsCache || []).find((p) => String(p.id) === String(id));
  if (!item) { window.alert("Procesarea nu a fost găsită."); return; }
  const isAdmin = currentSessionUser?.roleCode === "admin";
  const titleEl = document.getElementById("processing-details-title");
  if (titleEl) titleEl.textContent = `Procesare #${item.id} — ${item.product || ""}`.trim();
  const t = (v) => (Number(v) > 0 ? formatNumber(Number(v)) + " t" : "—");
  const pct = (v) => (v != null && v !== "" && Number(v) > 0 ? Number(v) + " %" : "—");
  const view = `
    <div class="rd-section"><h4>General</h4>
      ${rdRow("Status", escapeComboHtml(item.status || "—"))}
      ${rdRow("Data", formatDateShort(item.createdAt || item.processedAt))}
      ${rdRow("Produs", escapeComboHtml(item.product || "—"))}
      ${rdRow("Tip procesare", escapeComboHtml(item.processingType || "—"))}
      ${rdRow("Locație sursă", escapeComboHtml(item.sourceLocation || "—"))}
      ${rdRow("Locație destinație", escapeComboHtml(item.destLocation || item.sourceLocation || "—"))}
      ${rdRow("Operator", escapeComboHtml(item.operator || "—"))}
    </div>
    <div class="rd-section"><h4>Cantități</h4>
      ${rdRow("Cantitate procesată", t(item.processedQuantity))}
      ${rdRow("Deșeu", t(item.confirmedWaste))}
      ${rdRow("Apă eliminată", t(item.waterRemoved))}
      ${rdRow("Net final (output)", t(item.outputQuantity ?? item.finalNetQuantity))}
    </div>
    <div class="rd-section"><h4>Umiditate</h4>
      ${rdRow("Umiditate inițială", pct(item.initialHumidity))}
      ${rdRow("Umiditate finală", pct(item.finalHumidity))}
    </div>
    <div class="rd-section"><h4>Observații</h4>
      ${item.note ? `<p class="rd-note">${escapeComboHtml(item.note)}</p>` : `<p class="rd-empty">Fără observații.</p>`}
    </div>`;
  // Corectare — DOAR administrator, și doar pentru procesări finalizate (nu „In lucru").
  let editHtml = "";
  if (isAdmin && item.status !== "In lucru") {
    const num = (v) => ((Number(v) || 0) === 0 ? "" : String(Number(v)));
    editHtml = `
      <div class="rd-section" id="proc-correct">
        <h4>Corectare (administrator)</h4>
        <p class="field-hint">Corectează valorile greșite. Stocul se recalculează automat.</p>
        <label>Produs<input id="pc-product" value="${escapeComboHtml(item.product || "")}"></label>
        <div class="split">
          <label>Locație sursă<input id="pc-source" value="${escapeComboHtml(item.sourceLocation || "")}"></label>
          <label>Locație destinație<input id="pc-dest" value="${escapeComboHtml(item.destLocation || "")}"></label>
        </div>
        <div class="split">
          <label>Cantitate procesată (t)<input id="pc-processed" type="text" inputmode="decimal" value="${num(item.processedQuantity)}"></label>
          <label>Deșeu (t)<input id="pc-waste" type="text" inputmode="decimal" value="${num(item.confirmedWaste)}"></label>
        </div>
        <div class="split">
          <label>Umiditate inițială (%)<input id="pc-hi" type="text" inputmode="decimal" value="${num(item.initialHumidity)}"></label>
          <label>Umiditate finală (%)<input id="pc-hf" type="text" inputmode="decimal" value="${num(item.finalHumidity)}"></label>
        </div>
        <label>Data<input id="pc-date" type="date" value="${escapeComboHtml(String(item.processedAt || item.createdAt || "").slice(0, 10))}"></label>
        <label>Observații<input id="pc-note" value="${escapeComboHtml(item.note || "")}"></label>
        <div class="form-actions">
          <button type="button" id="pc-save" data-id="${item.id}">Salvează corectarea</button>
        </div>
      </div>`;
  }
  const body = document.getElementById("processing-details-body");
  body.innerHTML = view + editHtml;
  const msg = document.getElementById("processing-details-message");
  if (msg) msg.textContent = "";
  processingDetailsDialog.showModal();
}
processingsBodyEl?.addEventListener("click", (e) => {
  const trigger = e.target.closest('[data-action="processing-details"]');
  if (trigger) openProcessingDetails(trigger.dataset.id);
});
document.getElementById("processing-details-close")?.addEventListener("click", () => processingDetailsDialog?.close());
document.getElementById("processing-details-close-2")?.addEventListener("click", () => processingDetailsDialog?.close());
document.getElementById("processing-details-body")?.addEventListener("click", async (e) => {
  const btn = e.target.closest("#pc-save");
  if (!btn) return;
  const msg = document.getElementById("processing-details-message");
  const val = (x) => (document.getElementById(x)?.value || "").trim();
  try {
    const changeReason = requestChangeReason("Motivul corectării procesării:");
    if (msg) msg.textContent = "Se salvează...";
    await updateProcessingEntry(btn.dataset.id, {
      correction: true,
      product: val("pc-product"),
      sourceLocation: val("pc-source"),
      destLocation: val("pc-dest"),
      processedQuantity: val("pc-processed"),
      confirmedWaste: val("pc-waste"),
      initialHumidity: val("pc-hi"),
      finalHumidity: val("pc-hf"),
      processedAt: val("pc-date"),
      note: val("pc-note"),
      changeReason,
      changedBy: "dashboard"
    });
    processingDetailsDialog?.close();
    await Promise.all([loadProcessings(), loadAuditLogs(), loadDailyReport()]);
  } catch (error) {
    if (msg) msg.textContent = error.message;
  }
});

// ----- Detalii tranzacție financiară -----
const transactionDetailsDialog = document.getElementById("transaction-details-dialog");
function openTransactionDetails(id) {
  if (!transactionDetailsDialog) return;
  const item = (transactionsCache || []).find((x) => String(x.id) === String(id));
  if (!item) { window.alert("Tranzacția nu a fost găsită."); return; }
  const titleEl = document.getElementById("transaction-details-title");
  if (titleEl) titleEl.textContent = `Tranzacție #${item.id}`;
  const ref = item.referenceType === "delivery" ? `Livrare #${item.deliveryId}`
    : item.referenceType === "opening-debt" ? `Datorie inițială ${item.openingDebtId || ""}`.trim()
    : `Recepție #${item.receiptId}`;
  const st = typeof transactionReferenceStanding === "function" ? transactionReferenceStanding(item) : null;
  const lei = (v) => (Number(v) > 0 ? currency.format(Number(v)) : "—");
  document.getElementById("transaction-details-body").innerHTML = `
    <div class="rd-section"><h4>General</h4>
      ${rdRow("Status", escapeComboHtml(item.status || "—"))}
      ${rdRow("Data", formatDateShort(item.createdAt || item.transactedAt))}
      ${rdRow("Referință", escapeComboHtml(ref))}
      ${rdRow("Partener", escapeComboHtml(item.partner || "—"))}
      ${rdRow("Direcție", item.direction === "collection" ? "Încasare" : "Plată")}
      ${rdRow("Tip plată", escapeComboHtml(item.paymentType || "—"))}
    </div>
    <div class="rd-section"><h4>Sume</h4>
      ${rdRow("Sumă", currency.format(Number(item.amount || 0)))}
      ${rdRow("Aplicat la datorie", lei(item.appliedAmount))}
      ${rdRow("Avans creat", lei(item.advanceAmount))}
      ${st ? rdRow("Rest de plată (referință)", currency.format(st.remaining)) : ""}
    </div>
    ${item.canceledByRole ? `<div class="rd-section"><h4>Anulare</h4>
      ${rdRow("Anulat de (rol)", escapeComboHtml(item.canceledByRole))}
      ${rdRow("Data anulării", formatDateShort(item.canceledAt))}
    </div>` : ""}
    <div class="rd-section"><h4>Observații</h4>
      ${item.note ? `<p class="rd-note">${escapeComboHtml(item.note)}</p>` : `<p class="rd-empty">Fără observații.</p>`}
    </div>`;
  transactionDetailsDialog.showModal();
}
transactionsBodyEl?.addEventListener("click", (e) => {
  const trigger = e.target.closest('[data-action="transaction-details"]');
  if (trigger) openTransactionDetails(trigger.dataset.id);
});
document.getElementById("transaction-details-close")?.addEventListener("click", () => transactionDetailsDialog?.close());
document.getElementById("transaction-details-close-2")?.addEventListener("click", () => transactionDetailsDialog?.close());

// ----- Anulare document (admin/manager) + editare comentariu (admin) -----
async function cancelDocumentRequest(kind, id, reason) {
  const url =
    kind === "transfer" ? `/api/transfers/${id}/cancel`
    : kind === "receipt" ? `/api/receipts/${id}/cancel`
    : `/api/deliveries/${id}/cancel`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reason })
  });
  if (!res.ok) {
    const e = await res.json().catch(() => ({}));
    throw new Error(e.error || "Nu am putut anula documentul.");
  }
  return res.json();
}

async function editDocumentNoteRequest(entity, id, note) {
  const res = await fetch(`/api/documents/${entity}/${id}/note`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ note })
  });
  if (!res.ok) {
    const e = await res.json().catch(() => ({}));
    throw new Error(e.error || "Nu am putut salva comentariul.");
  }
  return res.json();
}

async function reloadAfterDocChange() {
  await Promise.all([loadReceipts(), loadDeliveries(), loadTransfers(), loadStocks(), loadAuditLogs()]);
}

// Handler global: butoanele „Anulează" și „Comentariu" de pe rânduri (data-action + data-kind + data-id).
document.addEventListener("click", async (event) => {
  const cancelBtn = event.target.closest('[data-action="doc-cancel"]');
  if (cancelBtn) {
    const kind = cancelBtn.dataset.kind;
    const id = cancelBtn.dataset.id;
    const reason = window.prompt("Motivul anulării (obligatoriu) — apare în lista adminului:");
    if (reason === null) return;
    if (!reason.trim()) {
      window.alert("Motivul este obligatoriu.");
      return;
    }
    try {
      await cancelDocumentRequest(kind, id, reason.trim());
      await reloadAfterDocChange();
    } catch (e) {
      window.alert(e.message);
    }
    return;
  }
  const noteBtn = event.target.closest('[data-action="doc-note"]');
  if (noteBtn) {
    const entity = noteBtn.dataset.kind;
    const id = noteBtn.dataset.id;
    const current = noteBtn.dataset.note || "";
    const note = window.prompt("Comentariu / observații (ex.: data reală a operației):", current);
    if (note === null) return;
    try {
      await editDocumentNoteRequest(entity, id, note);
      await reloadAfterDocChange();
    } catch (e) {
      window.alert(e.message);
    }
    return;
  }
});

// Toggle formular „Recepție nouă" — ascuns implicit, se deschide la apăsare
(function setupReceiptNewToggle() {
  const toggle = document.getElementById("receipt-new-toggle");
  if (!toggle || !formEl) return;
  toggle.addEventListener("click", () => {
    const willOpen = formEl.classList.contains("collapsed");
    formEl.classList.toggle("collapsed", !willOpen);
    toggle.setAttribute("aria-expanded", String(willOpen));
    toggle.classList.toggle("is-open", willOpen);
    toggle.innerHTML = willOpen
      ? '<span class="rnb-icon">✕</span> Închide formularul'
      : '<span class="rnb-icon">＋</span> Recepție nouă';
    if (willOpen) {
      formEl.scrollIntoView({ behavior: "smooth", block: "start" });
      const firstField = document.getElementById("supplier-search");
      if (firstField) setTimeout(() => firstField.focus(), 200);
    }
  });
})();

// Toggle formular „Livrare nouă" — ascuns implicit, se deschide la apăsare (ca la Recepții).
(function setupDeliveryNewToggle() {
  const toggle = document.getElementById("delivery-new-toggle");
  if (!toggle || !deliveryFormEl) return;
  toggle.addEventListener("click", () => {
    const willOpen = deliveryFormEl.classList.contains("collapsed");
    deliveryFormEl.classList.toggle("collapsed", !willOpen);
    toggle.setAttribute("aria-expanded", String(willOpen));
    toggle.classList.toggle("is-open", willOpen);
    toggle.innerHTML = willOpen
      ? '<span class="rnb-icon">✕</span> Închide formularul'
      : '<span class="rnb-icon">＋</span> Livrare nouă';
    if (willOpen) {
      deliveryFormEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
})();

// Financiar: formularul de plată e ascuns implicit, se deschide cu butonul „Plată".
(function setupTransactionNewToggle() {
  const toggle = document.getElementById("transaction-new-toggle");
  if (!toggle || !transactionFormEl) return;
  toggle.addEventListener("click", () => {
    const willOpen = transactionFormEl.classList.contains("collapsed");
    transactionFormEl.classList.toggle("collapsed", !willOpen);
    toggle.setAttribute("aria-expanded", String(willOpen));
    toggle.classList.toggle("is-open", willOpen);
    toggle.innerHTML = willOpen
      ? '<span class="rnb-icon">✕</span> Închide formularul'
      : '<span class="rnb-icon">＋</span> Plată';
    if (willOpen) {
      transactionFormEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
})();

// Panou „Tipar documente" (Financiar, doar contabil/admin): alegi tipul + operatia, tipareste.
// Populeaza selectorul de referinta (receptie/furnizor/plata) in functie de tipul ales.
function fillPrintDocRef() {
  const typeEl = document.getElementById("print-doc-type");
  const refEl = document.getElementById("print-doc-ref");
  const labelEl = document.getElementById("print-doc-ref-label");
  if (!typeEl || !refEl) return;
  const type = typeEl.value;
  // Câmpurile de perioadă apar doar la Actul de achiziție (mai multe recepții pe un act).
  const fromWrap = document.getElementById("print-doc-from-wrap");
  const toWrap = document.getElementById("print-doc-to-wrap");
  const showPeriod = type === "purchaseAct";
  if (fromWrap) fromWrap.hidden = !showPeriod;
  if (toWrap) toWrap.hidden = !showPeriod;
  // Compania emitentă nu se aplică formelor de livrare (folosesc vânzătorul din livrare) — o ascundem.
  const companyWrap = document.getElementById("print-doc-company")?.closest("label");
  if (companyWrap) companyWrap.hidden = type.startsWith("delivery");
  let options = [];
  if (type === "purchaseAct") {
    if (labelEl) labelEl.textContent = "Furnizorul";
    // Actul aduna recepțiile unui furnizor -> alegi FURNIZORUL, apoi perioada.
    options = (currentConfig?.partners || [])
      .filter((p) => p.role === "furnizor" || p.role === "ambele")
      .slice()
      .sort((a, b) => String(a.name).localeCompare(String(b.name), "ro"))
      .map((p) => ({ value: p.id, label: p.name }));
  } else if (type === "saleContract") {
    if (labelEl) labelEl.textContent = "Furnizorul";
    options = (currentConfig?.partners || [])
      .filter((p) => p.role === "furnizor" || p.role === "ambele")
      .slice()
      .sort((a, b) => String(a.name).localeCompare(String(b.name), "ro"))
      .map((p) => ({ value: p.id, label: p.name }));
  } else if (type === "paymentOrder") {
    if (labelEl) labelEl.textContent = "Plata";
    options = (transactionsCache || [])
      .filter((t) => t.direction === "payment" && t.status !== "Anulat")
      .slice()
      .sort((a, b) => new Date(b.createdAt || b.transactedAt) - new Date(a.createdAt || a.transactedAt))
      .map((t) => ({ value: t.id, label: `#${t.id} · ${formatDateShort(t.createdAt || t.transactedAt)} · ${t.partner || "-"} · ${moneyRo(t.amount)} lei` }));
  } else if (type.startsWith("delivery")) {
    // Formele de livrare (Invoice/Certificat/CMR/Împuternicire): alegi LIVRAREA.
    if (labelEl) labelEl.textContent = "Livrarea";
    options = (deliveriesCache || [])
      .slice()
      .sort((a, b) => new Date(b.invoiceDate || b.createdAt) - new Date(a.invoiceDate || a.createdAt))
      .map((d) => ({ value: d.id, label: `#${d.id} · ${formatDateShort(d.invoiceDate || d.createdAt)} · ${d.customer || "-"} · ${d.product || "-"}` }));
  }
  refEl.innerHTML = options.length
    ? options.map((o) => `<option value="${escapeComboHtml(String(o.value))}">${escapeComboHtml(o.label)}</option>`).join("")
    : '<option value="">— nimic disponibil —</option>';
}

// Populeaza selectorul de companie emitenta + referinta (apelat la deschiderea paginii).
function fillPrintDocPanel() {
  const companyEl = document.getElementById("print-doc-company");
  if (companyEl) {
    const companies = (currentConfig?.companies || []).filter((c) => c.active !== false);
    const prev = companyEl.value;
    companyEl.innerHTML = companies.length
      ? companies.map((c) => `<option value="${escapeComboHtml(String(c.id))}">${escapeComboHtml(c.shortName || c.name)}</option>`).join("")
      : '<option value="">— nicio companie —</option>';
    if (prev) companyEl.value = prev;
  }
  fillPrintDocRef();
}

(function setupPrintDocsPanel() {
  const typeEl = document.getElementById("print-doc-type");
  const refEl = document.getElementById("print-doc-ref");
  const btnEl = document.getElementById("print-doc-generate");
  const companyEl = document.getElementById("print-doc-company");
  if (!typeEl || !refEl || !btnEl) return;

  typeEl.addEventListener("change", fillPrintDocRef);
  btnEl.addEventListener("click", () => {
    const refId = refEl.value;
    if (!refId) { alert("Nu există niciun document de tipărit pentru tipul ales."); return; }
    const companyId = companyEl ? companyEl.value : "";
    printAccountingDocument(typeEl.value, refId, companyId);
  });
})();

// Stock period filter (Modul F)
document.getElementById("stock-period-from")?.addEventListener("change", renderStockPeriod);
document.getElementById("stock-period-to")?.addEventListener("change", renderStockPeriod);
document.getElementById("stock-period-product")?.addEventListener("change", renderStockPeriod);
document.getElementById("losses-report-form")?.addEventListener("submit", (e) => { e.preventDefault(); renderLossesReport(); });
["losses-from", "losses-to", "losses-product"].forEach((id) => document.getElementById(id)?.addEventListener("change", renderLossesReport));
document.getElementById("field-yield-form")?.addEventListener("submit", (e) => { e.preventDefault(); renderFieldYield(); });
["field-yield-from", "field-yield-to"].forEach((id) => document.getElementById(id)?.addEventListener("change", renderFieldYield));
processingTypeFilterEl.addEventListener("change", () => renderProcessings(processingsCache));
processingProductFilterEl?.addEventListener("change", () => renderProcessings(processingsCache));
processingDateFromEl?.addEventListener("change", () => renderProcessings(processingsCache));
processingDateToEl?.addEventListener("change", () => renderProcessings(processingsCache));
deliveryDateFromEl?.addEventListener("change", () => renderDeliveries(deliveriesCache));
deliveryDateToEl?.addEventListener("change", () => renderDeliveries(deliveriesCache));
deliveryCustomerFilterEl?.addEventListener("change", () => renderDeliveries(deliveriesCache));
deliveryProductFilterEl2?.addEventListener("change", () => renderDeliveries(deliveriesCache));
deliveryPaidFilterEl?.addEventListener("change", () => renderDeliveries(deliveriesCache));

// Status achitare factură per livrare (FACT) — contabilul bifează Achitată/Neachitată.
// UI optimist: actualizăm doar celula + cache, fără reîncărcarea întregii liste (perf).
deliveriesBodyEl.addEventListener("change", async (event) => {
  const sel = event.target.closest(".delivery-paid-select");
  if (!sel) return;
  const id = sel.dataset.id;
  const invoicePaid = sel.value === "true";
  const cell = sel.closest(".pay-cell");
  const cached = (deliveriesCache || []).find((d) => String(d.id) === String(id));
  const prev = cached ? cached.invoicePaid : undefined;
  // Optimist
  if (cached) cached.invoicePaid = invoicePaid;
  if (cell) cell.classList.toggle("is-paid", invoicePaid), cell.classList.toggle("is-unpaid", !invoicePaid);
  try {
    await updateDeliveryEntry(id, { invoicePaid, changeReason: "Marcare achitare factură" });
  } catch (error) {
    // Rollback la eroare
    if (cached) cached.invoicePaid = prev;
    sel.value = prev ? "true" : "false";
    if (cell) cell.classList.toggle("is-paid", !!prev), cell.classList.toggle("is-unpaid", !prev);
    alert(error.message);
  }
});

transactionDateFromEl?.addEventListener("change", () => renderTransactions(transactionsCache));
transactionDateToEl?.addEventListener("change", () => renderTransactions(transactionsCache));
transactionPartnerFilterEl?.addEventListener("change", () => renderTransactions(transactionsCache));
processingProductSelect.addEventListener("change", () => {
  autofillProcessingInitialHumidity();
  renderProcessingEstimate();
});
processingSourceSelect.addEventListener("change", () => {
  autofillProcessingInitialHumidity();
  renderProcessingEstimate();
});
processingDestSelect.addEventListener("change", renderProcessingEstimate);
processedQuantityInput.addEventListener("input", renderProcessingEstimate);
confirmedWasteInput.addEventListener("input", renderProcessingEstimate);
processingInitialHumidityInput.addEventListener("input", renderProcessingEstimate);
processingFinalHumidityInput.addEventListener("input", renderProcessingEstimate);
processingTypeSelect.addEventListener("change", updateProcessingTypeUI);
processingDestSelect.addEventListener("change", updateProcessingDestHint);
processingProductSelect.addEventListener("change", updateProcessingDestHint);
locationSelect.addEventListener("change", updateReceiptLocationHint);
productSelect.addEventListener("change", updateReceiptLocationHint);
transactionReferenceTypeSelect.addEventListener("change", () => {
  renderTransactionReferenceOptions();
  syncTransactionDirection();
  renderTransactionPreview();
});
transactionReferenceSelect.addEventListener("change", () => {
  syncTransactionDirection();
  renderTransactionPreview();
});
// Recalcul „Rest de plată" live la schimbarea sumei sau a bifei plată parțială/avans
document.getElementById("transaction-amount")?.addEventListener("input", renderTransactionPreview);
document.getElementById("transaction-partial-check")?.addEventListener("change", renderTransactionPreview);
openReceiptStatusFilterEl.addEventListener("change", renderOpenJournal);
openDeliveryStatusFilterEl.addEventListener("change", renderOpenJournal);
openPartnerFilterEl.addEventListener("input", renderOpenJournal);
deliveryProductSelect.addEventListener("change", () => {
  updateDeliverySourceOptions();
  renderDeliveryPreview();
});
deliverySourceSelect.addEventListener("change", renderDeliveryPreview);
deliveryGrossInput.addEventListener("input", renderDeliveryPreview);
deliveryTareInput.addEventListener("input", renderDeliveryPreview);
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
    // Formularul primește KG (ca recepție/livrare); stocul intern e în TONE → ÷1000.
    quantity: quantity / 1000,
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
  // Cantitatea (net) din formular = brut − tara (kg); receptiile stocate sunt in tone.
  const grossKg = Number(formData.get("grossWeightKg") || 0);
  const tareKg = Number(formData.get("tareWeightKg") || 0);
  const quantity = Math.max(grossKg - tareKg, 0) / 1000;
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
    // NU reincarcam receptiile aici: afisarea optimista din createReceipt le-a pus deja in
    // lista (evitam cursa KV pe serverless care le-ar sterge la loc). Restul datelor derivate
    // (stoc, rapoarte) se reincarca normal — se ajusteaza si la urmatoarea navigare.
    await Promise.all([
      loadProcessings(),
      loadStocks(),
      loadTransactions(),
      loadDeliveries(),
      loadComplaints(),
      loadAuditLogs(),
      loadDailyReport()
    ]);
    // Auto-afișare: derulează la "Recepții recente" și evidențiază rândul nou salvat,
    // ca operatorul să vadă imediat că s-a salvat (fără refresh / re-navigare).
    const recentReceiptsTable = document.getElementById("receipts-table");
    if (recentReceiptsTable) {
      recentReceiptsTable.scrollIntoView({ behavior: "smooth", block: "start" });
      const newRow = document.querySelector("#receipts-body tr");
      if (newRow) {
        newRow.classList.add("row-flash");
        setTimeout(() => newRow.classList.remove("row-flash"), 2400);
      }
    }
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

// Enter intr-un camp NU mai salveaza procesarea din greseala (doar butonul Salveaza procesarea).
processingFormEl.addEventListener("keydown", (event) => {
  if (
    event.key === "Enter" &&
    event.target.tagName !== "TEXTAREA" &&
    event.target.tagName !== "BUTTON"
  ) {
    event.preventDefault();
  }
});

// Validare la FINALIZARE (status Confirmat). La "in lucru" nu se cere nimic.
function validateFinalizeFields() {
  const method = selectedProcessingLossMethod();
  const needsDest = method === "umiditate" || method === "deseu";
  if (needsDest && !processingDestSelect.value) {
    return "Alege cilindrul destinație pentru a finaliza procesarea.";
  }
  if (method === "umiditate") {
    const ih = Number(processingInitialHumidityInput?.value || 0);
    const fh = Number(processingFinalHumidityInput?.value || 0);
    if (!(ih > 0) || !(fh > 0)) {
      return "La uscare, completează umiditatea inițială și finală pentru a finaliza.";
    }
    if (fh > ih) {
      return "Umiditatea finală nu poate fi mai mare decât cea inițială.";
    }
  } else if (method === "deseu") {
    if (confirmedWasteInput.value === "" || confirmedWasteInput.value == null) {
      return "La curățire, introdu deșeul confirmat (poate fi 0) pentru a finaliza.";
    }
  }
  return null;
}

// Reincarca o procesare "in lucru" in formular pentru a fi finalizata.
function startFinalizeProcessing(id) {
  const p = (processingsCache || []).find((x) => x.id === Number(id));
  if (!p) return;
  finalizeProcessingId = p.id;
  setView("procesare");
  const method = resolveLossMethod(
    (currentConfig?.processingTypes || []).find((t) => t.name === p.processingType) || { name: p.processingType }
  );
  if (processingTypeSelect) processingTypeSelect.value = p.processingType || "";
  if (processingProductSelect) processingProductSelect.value = p.product || "";
  if (processingSourceSelect) processingSourceSelect.value = p.sourceLocation || "";
  if (processingDestSelect) {
    processingDestSelect.value = p.destLocation && p.destLocation !== p.sourceLocation ? p.destLocation : "";
  }
  if (processedQuantityInput) processedQuantityInput.value = Math.round(Number(p.processedQuantity || 0) * 1000);
  if (confirmedWasteInput) {
    confirmedWasteInput.value = method === "deseu" && Number(p.confirmedWaste) > 0 ? Math.round(Number(p.confirmedWaste) * 1000) : "";
  }
  if (processingInitialHumidityInput) {
    processingInitialHumidityInput.value = method === "umiditate" && Number(p.initialHumidity) > 0 ? p.initialHumidity : "";
  }
  if (processingFinalHumidityInput) {
    processingFinalHumidityInput.value = method === "umiditate" && Number(p.finalHumidity) > 0 ? p.finalHumidity : "";
  }
  updateProcessingTypeUI();
  updateProcessingDestHint();
  renderProcessingEstimate();
  if (processingFinalizeText) {
    const ce = method === "umiditate" ? "umiditatea finală" : method === "deseu" ? "deșeul confirmat" : "datele";
    processingFinalizeText.textContent = `Finalizezi procesarea #${p.id} — completează ${ce} + cilindrul destinație, apoi „Salveaza procesarea".`;
  }
  if (processingFinalizeBanner) processingFinalizeBanner.hidden = false;
  if (processingInlucruBtn) processingInlucruBtn.style.display = "none";
  if (processingFormEl && processingFormEl.scrollIntoView) {
    processingFormEl.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  const focusEl = method === "umiditate" ? processingFinalHumidityInput : method === "deseu" ? confirmedWasteInput : processingDestSelect;
  if (focusEl && focusEl.focus) setTimeout(() => focusEl.focus(), 200);
}

function cancelFinalizeProcessing(opts = {}) {
  finalizeProcessingId = null;
  if (processingFinalizeBanner) processingFinalizeBanner.hidden = true;
  if (processingInlucruBtn) processingInlucruBtn.style.display = "";
  if (!opts.silent) {
    processingFormEl.reset();
    renderProcessingEstimate();
    updateProcessingTypeUI();
    if (processingMessageEl) processingMessageEl.textContent = "";
  }
}

// Finalizeaza o procesare "in lucru" existenta (PATCH), nu creeaza una noua.
async function finalizeExistingProcessing(formData) {
  const product = formData.get("product");
  const destLocation = formData.get("destLocation") || "";
  const method = resolveLossMethod(
    (currentConfig?.processingTypes || []).find((t) => t.name === formData.get("processingType")) || { name: formData.get("processingType") }
  );
  const wasteKg = Number(formData.get("confirmedWaste") || 0);
  const payload = {
    status: "Confirmat",
    destLocation,
    confirmedWaste: method === "deseu" ? String(wasteKg / 1000) : "0",
    initialHumidity: method === "umiditate" ? formData.get("initialHumidity") || "" : "",
    finalHumidity: method === "umiditate" ? formData.get("finalHumidity") || "" : "",
    changeReason: "Finalizare procesare",
    changedBy: "dashboard"
  };
  // Avertizare "un produs / cilindru" pe cilindrul destinatie.
  const conflict = cylinderConflictProduct(destLocation, product);
  if (conflict) {
    const ok = window.confirm(
      `Atenție! Pui ${product} în ${destLocation}, dar acolo este deja ${conflict}.\nO locație ar trebui să aibă un singur produs. Continui?`
    );
    if (!ok) {
      const e = new Error("Finalizare anulată — cilindru cu alt produs.");
      e.cancelled = true;
      throw e;
    }
    payload.allowMixedProduct = true;
  }
  const response = await fetch(`/api/processings/${finalizeProcessingId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || "Nu am putut finaliza procesarea.");
  }
  return await response.json().catch(() => null);
}

async function saveProcessing(status) {
  if (finalizeProcessingId) status = "Confirmat"; // finalizarea e mereu "Confirmat"
  if (status !== "In lucru") {
    const err = validateFinalizeFields();
    if (err) {
      processingMessageEl.textContent = err;
      return;
    }
  }
  processingMessageEl.textContent = "Se salveaza...";
  const wasFinalize = !!finalizeProcessingId;
  try {
    const saved = wasFinalize
      ? await finalizeExistingProcessing(new FormData(processingFormEl))
      : await createProcessing(new FormData(processingFormEl), status);
    cancelFinalizeProcessing({ silent: true });
    processingFormEl.reset();
    renderProcessingEstimate();
    updateProcessingTypeUI();
    processingMessageEl.textContent =
      status === "In lucru"
        ? "Procesarea a fost salvata «in lucru». Reia mai tarziu pentru a finaliza."
        : wasFinalize
          ? "Procesarea a fost finalizată."
          : "Procesarea a fost salvata.";
    // Afisare optimista din raspuns (evita cursa KV pe serverless).
    if (saved && saved.id) {
      const idx = processingsCache.findIndex((p) => p.id === saved.id);
      if (idx >= 0) processingsCache[idx] = saved;
      else processingsCache = [saved, ...processingsCache];
      renderProcessings(processingsCache);
      if (typeof renderFilterOptions === "function") renderFilterOptions();
      if (typeof checkEndOfDayProcessing === "function") checkEndOfDayProcessing();
      if (typeof renderDashFeed === "function") renderDashFeed();
    }
    // NU reincarcam loadProcessings imediat: pe serverless GET-ul de dupa scriere poate citi
    // date vechi (cursa KV) si ar suprascrie randul optimist. Restul datelor se reincarca.
    await Promise.all([
      loadReceipts(),
      loadStocks(),
      loadTransactions(),
      loadDeliveries(),
      loadComplaints(),
      loadAuditLogs(),
      loadDailyReport()
    ]);
  } catch (error) {
    processingMessageEl.textContent = error.cancelled ? "Procesare anulată." : error.message;
  }
}

processingFormEl.addEventListener("submit", (event) => {
  event.preventDefault();
  saveProcessing("Confirmat");
});

if (processingInlucruBtn) {
  processingInlucruBtn.addEventListener("click", () => {
    if (!processingFormEl.reportValidity()) return;
    saveProcessing("In lucru");
  });
}

if (processingFinalizeCancel) {
  processingFinalizeCancel.addEventListener("click", () => cancelFinalizeProcessing());
}

// Confirmarea de la finele zilei ca nu s-a procesat nimic (rămâne confirmat toată ziua)
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

// Închidere manuală (×): ascunde alerta doar pentru sesiunea curentă, reapare la reîncărcare
const eodCloseBtn = document.getElementById("eod-close-btn");
if (eodCloseBtn) {
  eodCloseBtn.addEventListener("click", () => {
    const today = new Date().toISOString().slice(0, 10);
    try {
      window.sessionStorage.setItem(`eod-closed-${today}`, "1");
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
  transferToSelect.addEventListener("change", updateTransferAvailableHint);
  document.getElementById("transfer-product-filter")?.addEventListener("change", () => renderTransfers(transfersCache));
  document.getElementById("transfer-loc-filter")?.addEventListener("change", () => renderTransfers(transfersCache));
  document.getElementById("transfer-date-from")?.addEventListener("change", () => renderTransfers(transfersCache));
  document.getElementById("transfer-date-to")?.addEventListener("change", () => renderTransfers(transfersCache));

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
    // Cantitatea se introduce in KG (ca la receptii/procesare/livrari); stocul intern e in tone.
    payload.quantity = String(Number(payload.quantity || 0) / 1000);

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

// Enter pe un câmp nu trebuie să trimită formularul (evită plăți dublate — ca la livrări).
transactionFormEl.addEventListener("keydown", (event) => {
  if (event.key !== "Enter") return;
  const el = event.target;
  const tag = (el.tagName || "").toLowerCase();
  if (tag === "textarea" || tag === "button" || el.type === "submit") return;
  event.preventDefault();
});

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

// Enter în câmpurile formularului de livrare NU trebuie să trimită formularul.
// Model „livrare imediată": un submit accidental (Enter) crea o livrare FINALIZATĂ în plus
// (duplicate). Doar butonul „Salveaza" trimite. Enter pe input → nu face nimic (rămâi în câmp).
deliveryFormEl.addEventListener("keydown", (event) => {
  if (event.key !== "Enter") return;
  const el = event.target;
  const tag = (el.tagName || "").toLowerCase();
  // Lasă Enter pentru textarea (linii noi) și pentru butoane (acțiunea lor proprie).
  if (tag === "textarea" || tag === "button" || el.type === "submit") return;
  event.preventDefault();
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

// Enter NU mai salvează reclamația din greșeală — trece la următorul câmp (REC)
complaintFormEl.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && event.target.tagName !== "TEXTAREA" && event.target.tagName !== "BUTTON") {
    event.preventDefault();
    // Mută focusul pe următorul câmp completabil
    const fields = Array.from(complaintFormEl.querySelectorAll("input, select, textarea"))
      .filter((el) => !el.disabled && el.type !== "hidden");
    const idx = fields.indexOf(event.target);
    if (idx >= 0 && idx < fields.length - 1) fields[idx + 1].focus();
  }
});

// Filtru produs pe reclamații recente
complaintProductFilterEl?.addEventListener("change", () => renderComplaints(complaintsCache));

function validateComplaintForm(formData) {
  if (!formData.get("customerId")) return "Selectează firma (cumpărătorul).";
  if (!formData.get("product")) return "Selectează produsul reclamat.";
  if (!String(formData.get("complaintType") || "").trim()) return "Selectează tipul reclamației.";
  if (Number(formData.get("contestedQuantity") || 0) <= 0) return "Cantitatea contestată trebuie să fie mai mare ca zero.";
  return null;
}

complaintFormEl.addEventListener("submit", async (event) => {
  event.preventDefault();
  // Reclamația se salvează DOAR pe butonul Salvează, după validarea câmpurilor obligatorii (REC)
  const formData = new FormData(complaintFormEl);
  const validationError = validateComplaintForm(formData);
  if (validationError) {
    complaintMessageEl.textContent = validationError;
    return;
  }
  complaintMessageEl.textContent = "Se salveaza...";
  try {
    await createComplaint(formData);
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
    // Populate seller select from nomenclator (partners)
    const sellerSelect = document.getElementById("billing-seller-select");
    if (sellerSelect) {
      const partners = (currentConfig?.partners || []);
      sellerSelect.innerHTML = '<option value="">— alege vânzător —</option>' +
        partners.map((p) => `<option value="${escapeComboHtml(String(p.id))}">${escapeComboHtml(p.name)}</option>`).join("");
      if (delivery.sellerId) sellerSelect.value = String(delivery.sellerId);
    }
    f.elements.id.value = delivery.id;
    f.elements.invoiceNumber.value = delivery.invoiceNumber || "";
    f.elements.invoiceDate.value = delivery.invoiceDate || "";
    f.elements.contractNumber.value = delivery.contractNumber || "";
    f.elements.contractDate.value = delivery.contractDate || "";
    f.elements.priceForeign.value = delivery.priceForeign || "";
    f.elements.exchangeRate.value = delivery.exchangeRate || "";
    f.elements.currency.value = delivery.currency || "MDL";
    f.elements.vehicle.value = delivery.vehicle || "";
    if (f.elements.trailer) f.elements.trailer.value = delivery.trailer || "";
    if (f.elements.loadingPlace) f.elements.loadingPlace.value = delivery.loadingPlace || "";
    if (f.elements.loadingCountry) f.elements.loadingCountry.value = delivery.loadingCountry || "";
    if (f.elements.unloadingPlace) f.elements.unloadingPlace.value = delivery.unloadingPlace || "";
    if (f.elements.unloadingCountry) f.elements.unloadingCountry.value = delivery.unloadingCountry || "";
    if (f.elements.cmrDocuments) f.elements.cmrDocuments.value = delivery.cmrDocuments || "";
    if (f.elements.deliveryHumidity) f.elements.deliveryHumidity.value = delivery.deliveryHumidity || "";
    f.elements.note.value = delivery.note || "";
    if (f.elements.vatRate) f.elements.vatRate.value = delivery.vatRate !== undefined && delivery.vatRate !== null ? String(delivery.vatRate) : "-";
    billingDelivery = delivery; // memorăm livrarea pentru calculul TVA (cantitate)
    billingWaterIdx = buildReceiptHumidityIndex(); // o dată la deschidere, refolosit la fiecare tastă
    updateBillingWaterHint(); // după ce billingDelivery + billingWaterIdx sunt setate
    updateBillingPriceLei();
    const idLabel = document.getElementById("billing-delivery-id");
    if (idLabel) idLabel.textContent = `#${delivery.id}`;
    const msg = document.getElementById("billing-message");
    if (msg) msg.textContent = "";
    deliveryBillingDialog.showModal();
  });

  // Live calculation: preț lei = preț valută × curs + totaluri TVA
  const billingPriceForeign = document.getElementById("billing-price-foreign");
  const billingExchangeRate = document.getElementById("billing-exchange-rate");
  const billingCurrencySelect = document.getElementById("billing-currency-select");
  const billingVatSelect = document.getElementById("billing-vat-select");
  billingPriceForeign?.addEventListener("input", updateBillingPriceLei);
  billingExchangeRate?.addEventListener("input", updateBillingPriceLei);
  billingCurrencySelect?.addEventListener("change", updateBillingPriceLei);
  billingVatSelect?.addEventListener("change", updateBillingPriceLei);
  deliveryBillingForm?.elements?.deliveryHumidity?.addEventListener("input", updateBillingWaterHint);

  const billingCancelBtn = document.getElementById("billing-cancel-btn");
  if (billingCancelBtn) {
    billingCancelBtn.addEventListener("click", () => deliveryBillingDialog.close());
  }

  deliveryBillingForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const f = deliveryBillingForm;
    const id = f.elements.id.value;
    const sellerSelect = document.getElementById("billing-seller-select");
    const sellerId = sellerSelect ? sellerSelect.value : "";
    const sellerName = sellerSelect && sellerSelect.selectedIndex >= 0
      ? sellerSelect.options[sellerSelect.selectedIndex].text.replace("— alege vânzător —", "")
      : "";
    const payload = {
      sellerId: sellerId || null,
      seller: sellerName,
      invoiceNumber: f.elements.invoiceNumber.value,
      invoiceDate: f.elements.invoiceDate.value,
      contractNumber: f.elements.contractNumber.value,
      contractDate: f.elements.contractDate.value,
      priceForeign: f.elements.priceForeign.value,
      exchangeRate: f.elements.exchangeRate.value,
      currency: f.elements.currency.value,
      vatRate: f.elements.vatRate ? f.elements.vatRate.value : "-",
      vehicle: f.elements.vehicle.value,
      trailer: f.elements.trailer ? f.elements.trailer.value : "",
      loadingPlace: f.elements.loadingPlace ? f.elements.loadingPlace.value : "",
      loadingCountry: f.elements.loadingCountry ? f.elements.loadingCountry.value : "",
      unloadingPlace: f.elements.unloadingPlace ? f.elements.unloadingPlace.value : "",
      unloadingCountry: f.elements.unloadingCountry ? f.elements.unloadingCountry.value : "",
      cmrDocuments: f.elements.cmrDocuments ? f.elements.cmrDocuments.value : "",
      deliveryHumidity: f.elements.deliveryHumidity ? f.elements.deliveryHumidity.value : "",
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
      // După salvare → generăm automat factura (FACT)
      if (typeof printDeliveryDocument === "function") {
        printDeliveryDocument(id, "invoice");
      }
    } catch (error) {
      if (msg) msg.textContent = error.message;
    }
  });
}

let billingDelivery = null;
let billingWaterIdx = null; // index umiditate construit o dată la deschiderea dialogului de facturare

// Parsează un număr cu separator zecimal românesc (virgulă): "4,09" -> 4.09.
// Backend-ul (sanitizeNumber) face la fel; aici e pentru calculul live din dialog.
function parseDecimal(value) {
  if (value === null || value === undefined || value === "") return 0;
  let s = String(value).trim().replace(/\s/g, "");
  if (s.includes(",") && !s.includes(".")) s = s.replace(",", ".");
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
}

// Arată în dialogul de facturare umiditatea de depozitare (auto) și apa calculată la livrare.
function updateBillingWaterHint() {
  const hintEl = document.getElementById("billing-water-hint");
  if (!hintEl) return;
  if (!billingDelivery) { hintEl.textContent = ""; return; }
  const sh = deliveryStorageHumidity(billingDelivery, billingWaterIdx);
  if (!(sh > 0)) {
    hintEl.textContent = "Umiditate depozitare: necunoscută (nu există recepții cu umiditate pentru acest produs/locație).";
    return;
  }
  const input = deliveryBillingForm && deliveryBillingForm.elements.deliveryHumidity;
  const dh = parseDecimal(input ? input.value : "");
  const parts = [`Umiditate depozitare (auto): ${formatNumber(sh)}%`];
  if (dh > 0) {
    const kg = Math.round((deliveryDisplayQuantity(billingDelivery) * 1000) * ((sh - dh) / 100));
    parts.push(kg >= 0 ? `→ apă pierdută ${formatNumber(kg)} kg` : `→ apă adăugată ${formatNumber(Math.abs(kg))} kg`);
  }
  hintEl.textContent = parts.join(" · ");
}

function updateBillingPriceLei() {
  const pf = parseDecimal(document.getElementById("billing-price-foreign")?.value);
  const rate = parseDecimal(document.getElementById("billing-exchange-rate")?.value);
  const cur = document.getElementById("billing-currency-select")?.value || "MDL";
  const isForeign = cur !== "MDL";
  // Preț pe unitate în lei: MDL → lei/kg (= pf);  valută → lei/tonă (= pf × curs)
  const leiPerUnit = isForeign ? pf * rate : pf;
  const unitLabel = isForeign ? "tonă" : "kg";
  // Etichete dinamice: câmpul de preț (kg pentru MDL, tonă pentru valută) și sufixul liniei calculate
  const fieldLabel = document.getElementById("billing-price-field-label");
  if (fieldLabel) fieldLabel.textContent = isForeign ? `Preț pe tonă (${cur})` : "Preț pe kg (lei)";
  const unitSuffix = document.getElementById("billing-price-lei-unit");
  if (unitSuffix) unitSuffix.textContent = " / " + unitLabel;
  const el = document.getElementById("billing-price-lei");
  if (el) {
    if (isForeign && pf > 0 && rate <= 0) {
      el.innerHTML = `<span style="color:var(--danger);">Introdu cursul valutar pentru ${cur}!</span>`;
    } else {
      el.textContent = currency.format(leiPerUnit || 0);
    }
  }

  // Totaluri factură cu TVA (FACT). Prețul este considerat CU TVA inclus.
  //  MDL: total = cantitate(kg) × preț/kg.  Valută: total lei = cantitate(tone) × preț/tonă × curs.
  //  ATENȚIE: aceeași formulă ca în `deliveryInvoiceTotals` — aici se calculează din valorile LIVE
  //  din formular (încă nesalvate pe livrare). Dacă schimbi formula, schimb-o în AMBELE locuri.
  const baseEl = document.getElementById("billing-base");
  const vatEl = document.getElementById("billing-vat");
  const totalEl = document.getElementById("billing-total");
  if (baseEl && vatEl && totalEl) {
    const tonnes = billingDelivery ? deliveryDisplayQuantity(billingDelivery) : 0;
    const totalCuTva = isForeign ? tonnes * pf * rate : tonnes * 1000 * pf;
    const vatRaw = document.getElementById("billing-vat-select")?.value ?? "-";
    const cota = vatRaw === "-" ? null : Number(vatRaw);
    if (cota === null || cota === 0) {
      // Fără TVA (sau 0%): baza = totalul, TVA = 0
      baseEl.textContent = formatNumber(Number(totalCuTva.toFixed(2)));
      vatEl.textContent = "0,00";
      totalEl.textContent = formatNumber(Number(totalCuTva.toFixed(2)));
    } else {
      const baza = totalCuTva / (1 + cota / 100);
      const tva = totalCuTva - baza;
      baseEl.textContent = formatNumber(Number(baza.toFixed(2)));
      vatEl.textContent = formatNumber(Number(tva.toFixed(2)));
      totalEl.textContent = formatNumber(Number(totalCuTva.toFixed(2)));
    }
  }
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

async function handleProcessingActionClick(event) {
  const finalizeBtn = event.target.closest(".processing-finalize-btn");
  if (finalizeBtn) {
    startFinalizeProcessing(finalizeBtn.dataset.id);
    return;
  }
  const cancelBtn = event.target.closest(".processing-cancel-btn");
  if (cancelBtn) {
    if (!window.confirm("Anulezi această procesare în lucru?")) return;
    try {
      await updateProcessingEntry(cancelBtn.dataset.id, {
        status: "Anulat",
        changeReason: "Anulare procesare in lucru",
        changedBy: "dashboard"
      });
      await Promise.all([loadProcessings(), loadStocks(), loadAuditLogs(), loadDailyReport()]);
    } catch (error) {
      window.alert(error.message);
    }
    return;
  }
}
// Acelasi handler pe tabelul „recente" (compat) si pe panoul nou „Procesări în lucru".
processingsBodyEl.addEventListener("click", handleProcessingActionClick);
if (processingInlucruBody) {
  processingInlucruBody.addEventListener("click", handleProcessingActionClick);
}

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

// Contabilul ajusteaza valoarea (suma) unei receptii — ex. pretul nu a fost completat de operator.
bodyEl.addEventListener("click", async (event) => {
  const trigger = event.target.closest('[data-action="adjust-amount"]');
  if (!trigger) return;
  const id = trigger.dataset.id;
  const receipt = receiptsCache.find((r) => String(r.id) === String(id));
  const current = Number(receipt?.amountToPay ?? receipt?.preliminaryPayableAmount ?? 0);
  const input = window.prompt("Valoarea totală a recepției (MDL):", current ? String(current) : "");
  if (input === null) return; // anulat
  const value = parseDecimal(input);
  if (!(value >= 0)) {
    window.alert("Introdu o valoare numerică validă (ex. 14340 sau 14340,50).");
    return;
  }
  const comment = window.prompt("Comentariu pentru această corectare (obligatoriu — de ce se ajustează suma):", "");
  if (comment === null) return; // anulat
  if (!String(comment).trim()) {
    window.alert("Comentariul este obligatoriu la corectarea sumei.");
    return;
  }
  try {
    const res = await fetch(`/api/receipts/${id}/amount`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: value, note: comment })
    });
    if (!res.ok) {
      const e = await res.json().catch(() => ({}));
      throw new Error(e.error || "Nu am putut ajusta valoarea.");
    }
    await loadReceipts();
  } catch (err) {
    window.alert(err.message);
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

      if (action === "delete" && entity === "partners") {
        await handlePartnerDelete(item);
        return;
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

// ============================================================================
// Autocomplete peste liste native: „imbraca" un <select> cu un camp de tastare.
// Selectul ramane SURSA valorii (nu schimbam cum se completeaza/citeste) — la alegere
// setam select.value + declansam „change", deci toate handler-ele existente merg neatinse.
// ============================================================================
function enhanceSelectWithSearch(select, opts = {}) {
  if (!select || select.dataset.searchEnhanced === "1") return;
  select.dataset.searchEnhanced = "1";

  const wrap = document.createElement("div");
  wrap.className = "combobox combobox-select";
  select.parentNode.insertBefore(wrap, select);
  wrap.appendChild(select);
  select.classList.add("combobox-native");
  // Validarea „required" o mutam pe fluxul de submit (selectul ascuns nu poate primi focus).
  if (select.hasAttribute("required")) {
    select.dataset.wasRequired = "1";
    select.removeAttribute("required");
  }

  const input = document.createElement("input");
  input.type = "text";
  input.className = "combobox-input";
  input.setAttribute("autocomplete", "off");
  input.setAttribute("role", "combobox");
  input.setAttribute("aria-expanded", "false");
  input.placeholder = opts.placeholder || "Caută (tastează primele litere)…";
  wrap.appendChild(input);

  const list = document.createElement("ul");
  list.className = "combobox-list";
  list.setAttribute("role", "listbox");
  list.hidden = true;
  wrap.appendChild(list);

  let activeIndex = -1;
  let filtered = [];
  const MAX_RESULTS = 50; // liste mari: afisam primele 50, restul se ingusteaza tastand

  const readOptions = () =>
    Array.from(select.options)
      .filter((o) => !o.disabled) // exclude placeholderele „Selectează…" (disabled); „Toți" ramane (nu e disabled)
      .map((o) => ({ value: o.value, text: (o.textContent || "").trim() }))
      .filter((o) => o.text !== "");

  const syncInputFromSelect = () => {
    const sel = select.options[select.selectedIndex];
    input.value = sel && sel.value !== "" ? (sel.textContent || "").trim() : "";
  };

  const render = () => {
    const q = normalizeComboText(input.value);
    const all = readOptions().filter((o) => !q || normalizeComboText(o.text).includes(q));
    filtered = all.slice(0, MAX_RESULTS); // afisam + navigam doar setul vizibil (consistent cu activeIndex/pick)
    input.setAttribute("aria-expanded", "true");
    if (!filtered.length) {
      list.innerHTML = `<li class="combobox-empty">Niciun rezultat</li>`;
    } else {
      const more = all.length - filtered.length;
      const hint = more > 0
        ? `<li class="combobox-empty">Încă ${more} ${more === 1 ? "rezultat" : "rezultate"} — continuă să tastezi…</li>`
        : "";
      list.innerHTML = filtered
        .map(
          (o, i) =>
            `<li class="combobox-item${i === activeIndex ? " is-active" : ""}" role="option" data-value="${escapeComboHtml(o.value)}">${escapeComboHtml(o.text)}</li>`
        )
        .join("") + hint;
    }
    list.hidden = false;
  };

  const close = () => {
    list.hidden = true;
    activeIndex = -1;
    input.setAttribute("aria-expanded", "false");
  };

  const pick = (value, text) => {
    select.value = value;
    select.dispatchEvent(new Event("change", { bubbles: true }));
    input.value = text;
    close();
  };

  input.addEventListener("focus", () => { activeIndex = -1; render(); });
  input.addEventListener("input", () => { activeIndex = -1; render(); });
  input.addEventListener("blur", () => setTimeout(() => { close(); syncInputFromSelect(); }, 140));
  input.addEventListener("keydown", (e) => {
    if (list.hidden && e.key === "ArrowDown") { render(); return; }
    if (e.key === "ArrowDown") { activeIndex = Math.min(activeIndex + 1, filtered.length - 1); render(); e.preventDefault(); }
    else if (e.key === "ArrowUp") { activeIndex = Math.max(activeIndex - 1, 0); render(); e.preventDefault(); }
    else if (e.key === "Enter") { if (activeIndex >= 0 && filtered[activeIndex]) { pick(filtered[activeIndex].value, filtered[activeIndex].text); e.preventDefault(); } }
    else if (e.key === "Escape") { close(); }
  });
  list.addEventListener("mousedown", (e) => {
    const li = e.target.closest("[data-value]");
    if (!li) return;
    e.preventDefault();
    const found = filtered.find((x) => String(x.value) === li.dataset.value);
    pick(li.dataset.value, found ? found.text : (li.textContent || "").trim());
  });

  // Cand selectul e re-populat (innerHTML) sau i se restaureaza valoarea, resincronizam textul afisat.
  select.addEventListener("change", syncInputFromSelect);
  new MutationObserver(() => setTimeout(syncInputFromSelect, 0)).observe(select, { childList: true });
  syncInputFromSelect();
}

// Aplica autocomplete-ul la toate listele de partener/furnizor/cumparator + referinta financiara.
(function setupPartnerSearchComboboxes() {
  const targets = [
    ["transaction-reference-select", "Caută recepția/livrarea (nume partener)…"],
    ["delivery-customer-select", "Caută cumpărătorul…"],
    ["complaint-customer-select", "Caută cumpărătorul…"],
    ["opening-debt-partner", "Caută partenerul…"],
    ["statement-partner-select", "Caută partenerul…"],
    ["print-doc-ref", "Caută…"],
    ["receipt-supplier-filter", "Caută furnizorul…"],
    ["transaction-partner-filter", "Caută partenerul…"],
    ["delivery-customer-filter", "Caută cumpărătorul…"]
  ];
  targets.forEach(([id, placeholder]) => {
    try {
      const el = document.getElementById(id);
      if (el) enhanceSelectWithSearch(el, { placeholder });
    } catch (err) {
      console.error("Autocomplete init failed for", id, err);
    }
  });
})();

bootstrap();
