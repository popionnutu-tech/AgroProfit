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
// statutului e rezervata manager+admin (sursa de adevar duplicata si in backend).
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

// Comprima o imagine la max ~1280px / JPEG 0.7 inainte de upload (rapid pe date mobile).
async function compressImage(file) {
  if (!file || !file.type || !file.type.startsWith("image/")) return file;
  try {
    const bitmap = await createImageBitmap(file);
    const maxDim = 1280;
    let w = bitmap.width;
    let h = bitmap.height;
    if (w > maxDim || h > maxDim) {
      const s = maxDim / Math.max(w, h);
      w = Math.round(w * s);
      h = Math.round(h * s);
    }
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    canvas.getContext("2d").drawImage(bitmap, 0, 0, w, h);
    const blob = await new Promise((res) => canvas.toBlob(res, "image/jpeg", 0.7));
    if (bitmap.close) bitmap.close();
    return blob || file;
  } catch (_) {
    return file;
  }
}

// Urca imagini -> array de cai stocate.
async function uploadPhotos(files) {
  const list = Array.from(files || []).filter((f) => f && f.type && f.type.startsWith("image/"));
  if (!list.length) return [];
  const fd = new FormData();
  for (const f of list) {
    const blob = await compressImage(f);
    fd.append("photos", blob, (f.name || "poza").replace(/\.[^.]+$/, "") + ".jpg");
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

  const cylinders = (currentConfig?.storageLocations || [])
    .filter((loc) => loc.active !== false && String(loc.type || "").toLowerCase() === "cilindru")
    .sort((a, b) => Number(a.id) - Number(b.id));

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

      return `
        <article class="silo-card${ringClass}" data-id="${cyl.id}" title="${cyl.name} · ${formatNumber(filled)}/${formatNumber(capacity)} t · ${productsTooltip || 'gol'}">
          <div class="silo-card-head">
            <span class="silo-name">${cyl.name}</span>
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
    // Numai locatiile cu stoc real (qty>0) — ca lista sa coincida cu silozurile de sus.
    if (item.location && qty > 0) existing.locations.add(item.location);
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
      const locNames = Array.from(info.locations).sort((a, b) =>
        String(a).localeCompare(String(b), "ro", { numeric: true })
      );
      const locLabel = locNames.length ? locNames.join(", ") : "—";
      return `
        <tr>
          <td><span class="sbp-dot" style="background:${palette.fill};border-color:${palette.edge};"></span>${product}</td>
          <td>${formatNumber(info.qty)} t</td>
          <td>${formatNumber(info.qty * 1000)} kg</td>
          <td title="${locNames.length} ${locNames.length === 1 ? "cilindru" : "cilindri"}">${locLabel}</td>
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
function renderStockPeriod() {
  const body = document.getElementById("stock-period-body");
  if (!body) return;
  const fromEl = document.getElementById("stock-period-from");
  const toEl = document.getElementById("stock-period-to");
  const from = fromEl && fromEl.value ? fromEl.value : "";
  const to = toEl && toEl.value ? toEl.value : "";

  const dayOf = (iso) => String(iso || "").slice(0, 10);
  const products = new Set();

  // Opening stock (counts as stoc inițial, always before any period)
  const opening = {};
  (openingDocumentsCache || []).forEach((doc) => {
    (doc.stockItems || []).forEach((s) => {
      const p = s.product || "—";
      products.add(p);
      opening[p] = (opening[p] || 0) + Number(s.quantity || 0);
    });
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
          <td>${item.grossWeight > 0 ? formatNumber(Number(item.grossWeight)) + " kg" : "—"}</td>
          <td>${item.tareWeight > 0 ? formatNumber(Number(item.tareWeight)) + " kg" : "—"}</td>
          <td>${item.location || "-"}</td>
          <td class="col-fin">${currency.format(valoare)}</td>
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
  return `<span class="pay-badge ${s.cls}">${s.label}</span>`;
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
  // Totals per product: cantitate / sumă către plată / sumă achitată
  const byProduct = {};
  let totalNet = 0;
  let totalPay = 0;
  let totalPaid = 0;
  rows.forEach((item) => {
    if (item.status === "Anulat") return;
    const net = Number(item.provisionalNetQuantity || item.quantity || 0);
    const pay = Number(item.amountToPay ?? item.preliminaryPayableAmount ?? 0);
    const paid = Number(item.paidAmount || 0);
    totalNet += net;
    totalPay += pay;
    totalPaid += paid;
    const key = item.product || "—";
    if (!byProduct[key]) byProduct[key] = { net: 0, pay: 0, paid: 0 };
    byProduct[key].net += net;
    byProduct[key].pay += pay;
    byProduct[key].paid += paid;
  });
  const fin = canAccess("finance");
  const perProduct = Object.entries(byProduct)
    .map(([prod, v]) => fin
      ? `${prod}: ${formatNumber(v.net)} t (${formatNumber(v.net * 1000)} kg) / plată ${currency.format(v.pay)} / achitat ${currency.format(v.paid)}`
      : `${prod}: ${formatNumber(v.net)} t (${formatNumber(v.net * 1000)} kg)`)
    .join("<br>");
  const finPart = fin
    ? `&nbsp;·&nbsp; Plată: <b>${currency.format(totalPay)}</b> · Achitat: <b>${currency.format(totalPaid)}</b> · Rest: <b>${currency.format(Math.max(totalPay - totalPaid, 0))}</b>`
    : "";
  receiptsFootEl.innerHTML = `
    <tr class="totals-row">
      <td colspan="16">TOTAL (${rows.length} recepții) &nbsp;·&nbsp; Net: <b>${formatNumber(totalNet)} t (${formatNumber(totalNet * 1000)} kg)</b>${finPart}<br>${perProduct}</td>
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
    return typeMatch && productMatch && dateMatch;
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
              ? `<span class="badge-inlucru" title="Se finalizează din panoul „Procesări în lucru» de mai sus">În lucru</span>`
              : `<select class="processing-status" data-id="${item.id}" ${canEditStatuses ? "" : "disabled"}>
                  ${["Confirmat", "Inchis", "Anulat", "Redeschis"].map((status) => {
                    const selected = item.status === status ? "selected" : "";
                    return `<option value="${status}" ${selected}>${status}</option>`;
                  }).join("")}
                </select>`}
          </td>
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
                   <button type="button" class="cell-btn cell-btn-danger processing-cancel-btn" data-id="${item.id}">Anulează</button>
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
          ${(() => {
            const st = transactionReferenceStanding(item);
            const rest = st ? currency.format(st.remaining) : "-";
            const badge = st ? `<span class="status-badge ${st.css}">${st.label}</span>` : "-";
            return `<td>${rest}</td><td>${badge}</td>`;
          })()}
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
      <td colspan="9">TOTAL (${rows.length}) &nbsp;·&nbsp; Numerar: <b>${currency.format(cashTotal)}</b> · Transfer: <b>${currency.format(transferTotal)}</b> &nbsp;·&nbsp; Încasări: <b>${currency.format(totalCollections)}</b> · Plăți: <b>${currency.format(totalPayments)}</b></td>
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
          <td>${item.vehicle || "-"}</td>
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
  // Modul B: totaluri cu sumă în valută și în lei, pe produs
  const byProduct = {};
  let totalQty = 0;
  let totalLei = 0;
  const totalForeignByCur = {};
  rows.forEach((item) => {
    if (item.status === "Anulat") return; // livrarea anulată nu intră în totaluri
    const money = deliveryInvoiceTotals(item);
    const qty = money.tonnes;
    totalQty += qty;
    const lei = money.totalLei;
    const cur = money.cur;
    const foreign = money.totalForeign;
    totalLei += lei;
    if (cur !== "MDL") totalForeignByCur[cur] = (totalForeignByCur[cur] || 0) + foreign;
    const key = item.product || "—";
    if (!byProduct[key]) byProduct[key] = { qty: 0, lei: 0, foreign: {} };
    byProduct[key].qty += qty;
    byProduct[key].lei += lei;
    if (cur !== "MDL") byProduct[key].foreign[cur] = (byProduct[key].foreign[cur] || 0) + foreign;
  });
  const fin = canAccess("finance");
  const foreignStr = Object.entries(totalForeignByCur).map(([c, v]) => `${formatNumber(v)} ${c}`).join(" + ");
  const perProduct = Object.entries(byProduct)
    .map(([prod, v]) => {
      const fStr = Object.entries(v.foreign).map(([c, val]) => `${formatNumber(val)} ${c}`).join(" + ");
      return fin
        ? `${prod}: ${formatNumber(v.qty)} t${fStr ? " / " + fStr : ""} / ${currency.format(v.lei)}`
        : `${prod}: ${formatNumber(v.qty)} t`;
    })
    .join("  ·  ");
  const finPart = fin
    ? `&nbsp;·&nbsp; ${foreignStr ? "Valută: <b>" + foreignStr + "</b> · " : ""}Lei: <b>${currency.format(totalLei)}</b>`
    : "";
  deliveriesFootEl.innerHTML = `
    <tr class="totals-row">
      <td colspan="12">TOTAL (${rows.length} livrări) &nbsp;·&nbsp; Cantitate: <b>${formatNumber(totalQty)} t</b>${finPart}<br>${perProduct}</td>
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
                return `<option value="${status}" ${selected}>${status}</option>`;
              }).join("")}
            </select>
          </td>
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
          <td colspan="9">TOTAL reclamat: <b>${formatNumber(totalQty)}</b> &nbsp;·&nbsp; Sumă diminuată: <b>${currency.format(totalDeducted)}</b> &nbsp;·&nbsp; ${perProduct}</td>
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
          <td>${formatDateShort(item.createdAt)}</td>
          <td>${escapeComboHtml(item.supplier)}</td>
          <td>${escapeComboHtml(item.product)}</td>
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
          <td>${formatDateShort(item.createdAt)}</td>
          <td>#${item.receiptId}</td>
          <td>${escapeComboHtml(item.processingType)}</td>
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
          <td>${formatDateShort(item.createdAt)}</td>
          <td>${escapeComboHtml(item.partner)}</td>
          <td>${item.direction === "collection" ? "Incasare" : "Plata"}</td>
          <td>${escapeComboHtml(item.paymentType || "-")}</td>
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
          <td>${formatDateShort(item.createdAt)}</td>
          <td>${escapeComboHtml(item.customer)}</td>
          <td>${escapeComboHtml(item.product)}</td>
          <td>${formatNumber(item.deliveredQuantity)}</td>
          <td>${escapeComboHtml(item.invoiceNumber || "-")}</td>
        </tr>
      `
    )
    .join("");

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
  return String(value);
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
    "labReports"
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

async function loadDashboard() {
  const reportToday = new Date().toISOString().slice(0, 10);
  if (dailyReportFromEl) dailyReportFromEl.value = reportToday;
  if (dailyReportToEl) dailyReportToEl.value = reportToday;
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

  const grossKg = Number(formData.get("grossWeightKg") || 0);
  const tareKg = Number(formData.get("tareWeightKg") || 0);
  const isPending = !(tareKg > 0); // fara tara -> receptie "in descarcare" (asteapta a 2-a cantarire)
  const netKg = Math.max(grossKg - tareKg, 0);

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

  const targetAmount =
    direction === "collection"
      ? Number(receipt.preliminaryMerchandiseValue || receipt.preliminaryPayableAmount || 0)
      : Number(receipt.preliminaryPayableAmount || 0);

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
    throw new Error(`Nu am putut actualiza: ${entityLabels[entity] || entity}`);
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
      .map((p) => `<option value="${p.id}">${p.name}${p.idno ? ` (${p.idno})` : ""}</option>`)
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
  const seller = getSellerPartner(delivery);
  const buyer = getBuyerPartner(delivery);
  const money = deliveryInvoiceTotals(delivery);
  const cur = money.cur;
  // Pe factură: MDL → kg × lei/kg;  valută → tone × preț/tonă (cum se scrie în contractul de export)
  const qtyDisplay = money.isForeign ? money.tonnes : money.kg;
  const qtyUnit = money.isForeign ? "tone" : "kg";
  const priceUnit = money.isForeign ? "tonă" : "kg";
  const unitPrice = money.isForeign ? money.unitForeign : money.unitLei;
  const total = money.isForeign ? money.totalForeign : money.totalLei;
  const totalLei = money.totalLei;
  const code = getProductCode(delivery.product);
  return `${docHeader()}
    <div class="doc-title">Invoice / Factură</div>
    <div class="doc-subtitle">Nr. ${delivery.invoiceNumber || "—"} · ${formatDateShort(delivery.invoiceDate || delivery.createdAt)}${delivery.contractNumber ? " · Contract " + delivery.contractNumber : ""}</div>
    <div class="doc-parties">
      <div class="doc-party"><h4>Exportator (vânzător)</h4><div><b>${delivery.seller || seller?.name || "-"}</b></div>${seller?.idno ? `<div>IDNO: ${seller.idno}</div>` : ""}${seller?.address ? `<div>${seller.address}</div>` : ""}${seller?.iban ? `<div>IBAN: ${seller.iban}</div>` : ""}</div>
      <div class="doc-party"><h4>Destinatar (cumpărător)</h4><div><b>${delivery.customer || buyer?.name || "-"}</b></div>${buyer?.idno ? `<div>IDNO: ${buyer.idno}</div>` : ""}${buyer?.address ? `<div>${buyer.address}</div>` : ""}</div>
    </div>
    <div class="doc-grid"><div><b>AUTO (mașină):</b> ${delivery.vehicle || "-"}</div><div><b>Valuta:</b> ${cur}</div></div>
    <table class="doc-table">
      <thead><tr><th>Denumirea mărfii</th><th>Greutate (${qtyUnit})</th><th>Preț/${priceUnit} în ${cur}</th><th>Sumă în ${cur}</th></tr></thead>
      <tbody><tr><td>${code ? code + " - " : ""}${delivery.product}</td><td>${formatNumber(qtyDisplay)}</td><td>${moneyRo(unitPrice)}</td><td>${moneyRo(total)}</td></tr></tbody>
      <tfoot><tr><td colspan="3">TOTAL pe invoice</td><td>${moneyRo(total)} ${cur}</td></tr></tfoot>
    </table>
    ${buildInvoiceVatBlock(delivery, totalLei)}
    ${money.isForeign ? `<div style="font-size:12px;text-align:right;">Echivalent în lei (curs ${moneyRo(delivery.exchangeRate || 0)}): <b>${moneyRo(totalLei)} lei</b></div>` : ""}
    <div class="doc-sign"><div>Vânzător</div><div>Cumpărător</div></div>`;
}

// Bloc TVA pe factură (FACT): valoare fără TVA / sumă TVA / total, în lei.
function buildInvoiceVatBlock(delivery, totalLei) {
  const vatRaw = delivery.vatRate;
  if (vatRaw === undefined || vatRaw === null || vatRaw === "-") {
    return `<div style="font-size:13px;text-align:right;margin-top:8px;">Total factură: <b>${moneyRo(totalLei)} lei</b> (fără TVA)</div>`;
  }
  const cota = Number(vatRaw);
  if (cota === 0) {
    return `<div style="font-size:13px;text-align:right;margin-top:8px;">Valoare fără TVA: <b>${moneyRo(totalLei)} lei</b> · TVA 0%: 0,00 lei · Total: <b>${moneyRo(totalLei)} lei</b></div>`;
  }
  const baza = totalLei / (1 + cota / 100);
  const tva = totalLei - baza;
  return `<div style="font-size:13px;text-align:right;margin-top:8px;line-height:1.6;">
    Valoare totală fără TVA: <b>${moneyRo(baza)} lei</b><br>
    Suma totală TVA (${cota}%): <b>${moneyRo(tva)} lei</b><br>
    Total factură: <b>${moneyRo(totalLei)} lei</b>
  </div>`;
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
function getProductCode(productName) {
  const p = (currentConfig?.products || []).find((x) => String(x.name).trim().toLowerCase() === String(productName || "").trim().toLowerCase());
  return p?.code || "";
}
function deliveryQtyTonnes(delivery) {
  return Number(delivery.netWeight > 0 ? delivery.netWeight : delivery.deliveredQuantity || delivery.plannedQuantity || 0);
}

function buildBonCantarHtml(delivery) {
  const seller = getSellerPartner(delivery);
  const buyer = getBuyerPartner(delivery);
  const qty = deliveryQtyTonnes(delivery);
  return `${docHeader()}
    <div class="doc-title">Bon de cântar</div>
    <div class="doc-subtitle">Nr. ${delivery.id} · ${formatDateShort(delivery.invoiceDate || delivery.createdAt)}</div>
    <div class="doc-parties">
      <div class="doc-party"><h4>Furnizor (vânzător)</h4><div><b>${delivery.seller || seller?.name || "-"}</b></div>${seller?.idno ? `<div>IDNO: ${seller.idno}</div>` : ""}</div>
      <div class="doc-party"><h4>Client</h4><div><b>${delivery.customer || buyer?.name || "-"}</b></div>${buyer?.idno ? `<div>IDNO: ${buyer.idno}</div>` : ""}</div>
    </div>
    <div class="doc-grid">
      <div><b>Autovehicul:</b> ${delivery.vehicle || "-"}</div>
      <div><b>Produs:</b> ${delivery.product}</div>
      <div><b>Masă brută:</b> ${formatNumber(delivery.grossWeight || 0)} t</div>
      <div><b>Masă camion (tară):</b> ${formatNumber(delivery.tareWeight || 0)} t</div>
      <div><b>Masă netă:</b> ${formatNumber(qty)} t</div>
      <div><b>Data:</b> ${formatDateShort(delivery.invoiceDate || delivery.createdAt)}</div>
    </div>
    <div class="doc-sign"><div>Cântăritor</div><div>Șofer</div></div>`;
}

function buildCmrHtml(delivery) {
  const seller = getSellerPartner(delivery);
  const buyer = getBuyerPartner(delivery);
  const qty = deliveryQtyTonnes(delivery);
  return `${docHeader()}
    <div class="doc-title">CMR — Scrisoare de transport</div>
    <div class="doc-subtitle">Nr. ${delivery.invoiceNumber || delivery.id} · ${formatDateShort(delivery.invoiceDate || delivery.createdAt)}</div>
    <div class="doc-parties">
      <div class="doc-party"><h4>Expeditor (vânzător)</h4><div><b>${delivery.seller || seller?.name || "-"}</b></div>${seller?.address ? `<div>${seller.address}</div>` : ""}</div>
      <div class="doc-party"><h4>Destinatar (cumpărător)</h4><div><b>${delivery.customer || buyer?.name || "-"}</b></div>${buyer?.address ? `<div>${buyer.address}</div>` : ""}</div>
    </div>
    <div class="doc-grid">
      <div><b>Marfă:</b> ${getProductCode(delivery.product) ? getProductCode(delivery.product) + " - " : ""}${delivery.product}</div>
      <div><b>Greutate netă:</b> ${formatNumber(qty)} t</div>
      <div><b>Autovehicul:</b> ${delivery.vehicle || "-"}</div>
      <div><b>Contract:</b> ${delivery.contractNumber || "-"}</div>
    </div>
    <div class="doc-sign"><div>Expeditor</div><div>Transportator</div></div>
    <div class="doc-sign" style="margin-top:20px;"><div>Destinatar</div><div></div></div>`;
}

function buildImputernicireHtml(delivery) {
  const seller = getSellerPartner(delivery);
  const buyer = getBuyerPartner(delivery);
  const qty = deliveryQtyTonnes(delivery);
  return `${docHeader()}
    <div class="doc-title">Împuternicire</div>
    <div class="doc-subtitle">${formatDateShort(delivery.invoiceDate || delivery.createdAt)}</div>
    <p style="font-size:13px;line-height:1.7;margin:16px 0;">
      Subscrisa <b>${delivery.seller || seller?.name || "________________"}</b>${seller?.idno ? ` (IDNO ${seller.idno})` : ""},
      reprezentată prin administrator <b>________________________</b>,
      împuternicește societatea <b>${delivery.customer || buyer?.name || "________________"}</b>${buyer?.idno ? ` (IDNO ${buyer.idno})` : ""},
      reprezentată prin administrator <b>________________________</b>,
      pentru transportul mărfii conform unității de transport <b>${delivery.vehicle || "____________"}</b>,
      în cantitate de <b>${formatNumber(qty)} tone</b> de <b>${delivery.product}</b>,
      conform datelor din invoice nr. ${delivery.invoiceNumber || "______"} din ${formatDateShort(delivery.invoiceDate || delivery.createdAt)}.
    </p>
    <div class="doc-sign"><div>Administrator vânzător</div><div>Administrator cumpărător</div></div>`;
}

function buildDeclaratieHtml(delivery) {
  const seller = getSellerPartner(delivery);
  const buyer = getBuyerPartner(delivery);
  return `${docHeader()}
    <div class="doc-title">Declarație</div>
    <div class="doc-subtitle">${formatDateShort(delivery.invoiceDate || delivery.createdAt)}</div>
    <p style="font-size:13px;line-height:1.7;margin:16px 0;">
      Subscrisa <b>${delivery.seller || seller?.name || "________________"}</b>${seller?.idno ? ` (IDNO ${seller.idno})` : ""}${seller?.address ? `, cu sediul în ${seller.address}` : ""},
      declară că marfa <b>${delivery.product}</b> livrată conform contractului nr. <b>${delivery.contractNumber || "______"}</b>
      către <b>${delivery.customer || buyer?.name || "________________"}</b>${buyer?.idno ? ` (IDNO ${buyer.idno})` : ""}
      corespunde condițiilor de calitate și provine din surse legale.
    </p>
    <div class="doc-sign"><div>Vânzător</div><div></div></div>`;
}

function printDeliveryDocument(deliveryId, docType) {
  const delivery = (deliveriesCache || []).find((d) => Number(d.id) === Number(deliveryId));
  if (!delivery) return;
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
    html = buildPurchaseActPrintHtml(delivery); title = `Act achizitie ${delivery.id}`;
  }
  else if (docType === "certificate") { html = buildCertificatePrintHtml(delivery); title = `Certificat calitate ${delivery.id}`; }
  else if (docType === "bon") { html = buildBonCantarHtml(delivery); title = `Bon cantar ${delivery.id}`; }
  else if (docType === "cmr") { html = buildCmrHtml(delivery); title = `CMR ${delivery.id}`; }
  else if (docType === "imputernicire") { html = buildImputernicireHtml(delivery); title = `Imputernicire ${delivery.id}`; }
  else if (docType === "declaratie") { html = buildDeclaratieHtml(delivery); title = `Declaratie ${delivery.id}`; }
  if (html) openPrintWindow(html, title);
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
        ${rdRow("Preț / tonă", Number(item.price) > 0 ? currency.format(Number(item.price)) : "—")}
        ${rdRow("Valoare preliminară", currency.format(valoare))}
        ${rdRow("Achitat", currency.format(achitat))}
        ${rdRow("Rest", currency.format(rest))}
        ${rdRow("Stare plată", escapeComboHtml(item.paymentStatus || "—"))}
        ${rdRow("Ultima plată", formatDateShort(item.lastPaymentDate))}
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

// Stock period filter (Modul F)
document.getElementById("stock-period-from")?.addEventListener("change", renderStockPeriod);
document.getElementById("stock-period-to")?.addEventListener("change", renderStockPeriod);
document.getElementById("stock-period-product")?.addEventListener("change", renderStockPeriod);
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
        partners.map((p) => `<option value="${p.id}">${p.name}</option>`).join("");
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
    f.elements.note.value = delivery.note || "";
    if (f.elements.vatRate) f.elements.vatRate.value = delivery.vatRate !== undefined && delivery.vatRate !== null ? String(delivery.vatRate) : "-";
    billingDelivery = delivery; // memorăm livrarea pentru calculul TVA (cantitate)
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

function updateBillingPriceLei() {
  const pf = Number(document.getElementById("billing-price-foreign")?.value || 0);
  const rate = Number(document.getElementById("billing-exchange-rate")?.value || 0);
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

bootstrap();
