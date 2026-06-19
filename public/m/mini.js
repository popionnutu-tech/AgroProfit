/* ===========================================================
   AgroProfit+ Telegram Mini App — frontend logic
   =========================================================== */

const state = {
  user: null,
  tg: null,
  receipts: [],
  deliveries: [],
  processings: [],
  transfers: [],
  transactions: [],
  complaints: [],
  auditLogs: [],
  stocks: { totals: {}, byLocation: [] }
};

// --- DOM refs
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

const els = {
  login: $("#tg-login"),
  loginForm: $("#tg-login-form"),
  loginUser: $("#tg-username"),
  loginPass: $("#tg-password"),
  loginError: $("#tg-login-error"),
  shell: $("#tg-shell"),
  hiEyebrow: $("#tg-hi-eyebrow"),
  hiName: $("#tg-hi-name"),
  role: $("#tg-role"),
  stocValue: $("#tg-stoc-value"),
  stocMeta: $("#tg-stoc-meta"),
  actionsGrid: $("#tg-actions-grid"),
  kReceipts: $("#tg-k-receipts"),
  kDeliveries: $("#tg-k-deliveries"),
  kProcessings: $("#tg-k-processings"),
  kTransfers: $("#tg-k-transfers"),
  feedList: $("#tg-feed-list"),
  receiptsList: $("#tg-receipts-list"),
  deliveriesList: $("#tg-deliveries-list"),
  processingsList: $("#tg-processings-list"),
  transfersList: $("#tg-transfers-list"),
  stocksList: $("#tg-stocks-list"),
  transactionsList: $("#tg-transactions-list"),
  accountBtn: $("#tg-account-btn"),
  profileAvatar: $("#tg-profile-avatar"),
  profileName: $("#tg-profile-name"),
  profileRole: $("#tg-profile-role"),
  logoutBtn: $("#tg-logout-button"),
  navBtns: $$(".tg-nav-btn")
};

// --- Telegram WebApp integration
function initTelegram() {
  const tg = window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp : null;
  if (!tg) return null;
  try {
    tg.ready();
    tg.expand();
    // Apply theme colors if Telegram provides them
    if (tg.themeParams) {
      const root = document.documentElement;
      if (tg.themeParams.bg_color) root.style.setProperty("--bg", tg.themeParams.bg_color);
      if (tg.themeParams.secondary_bg_color) root.style.setProperty("--bg-paper", tg.themeParams.secondary_bg_color);
      // We keep our brand accent colors; only base background follows Telegram
    }
    // Set Telegram header / back button behavior
    if (tg.MainButton) tg.MainButton.hide();
    return tg;
  } catch (err) {
    console.error("Telegram WebApp init failed:", err);
    return null;
  }
}

// --- Formatting helpers
function formatNumber(n) {
  if (n === null || n === undefined || n === "") return "0";
  const num = Number(n);
  if (!isFinite(num)) return String(n);
  return new Intl.NumberFormat("ro-RO", {
    maximumFractionDigits: 2
  }).format(num);
}

function formatMoney(n) {
  const num = Number(n) || 0;
  return new Intl.NumberFormat("ro-RO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num) + " MDL";
}

function formatTime(iso) {
  if (!iso) return "—";
  const s = String(iso);
  return s.replace("T", " ").slice(5, 16);
}

function initials(name) {
  if (!name) return "—";
  return String(name)
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

// --- Permissions (mirror server-side roles)
const ROLE_PERMS = {
  admin: ["receipts-read", "receipts-write", "processings-read", "processing-write",
    "deliveries-read", "deliveries-write", "complaints-read", "complaints-write",
    "finance", "reports", "audit", "setup", "security-admin", "stocks-read"],
  manager: ["receipts-read", "processings-read", "processing-write", "deliveries-read",
    "complaints-read", "finance", "reports", "stocks-read", "audit"],
  accountant: ["receipts-read", "processings-read", "deliveries-read", "complaints-read",
    "finance", "reports", "stocks-read"],
  "accountant-sef": ["receipts-read", "processings-read", "deliveries-read",
    "complaints-read", "complaints-write", "finance", "reports", "stocks-read", "audit"],
  operator: ["receipts-read", "receipts-write", "processings-read", "processing-write",
    "deliveries-read", "deliveries-write", "stocks-read"],
  control: ["receipts-read", "processings-read", "deliveries-read", "complaints-read",
    "reports", "audit", "stocks-read"]
};

function canDo(cap) {
  if (!state.user) return false;
  const role = state.user.roleCode || state.user.role;
  const perms = ROLE_PERMS[role] || [];
  return perms.includes(cap);
}

// --- Token persistence (Telegram WebView blocks cookies, so we use Bearer)
const TOKEN_KEY = "agroprofit-mini-token";

function getStoredToken() {
  try { return localStorage.getItem(TOKEN_KEY) || ""; } catch (_) { return ""; }
}

function setStoredToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch (_) {}
}

// --- API helpers
async function api(path, opts) {
  opts = opts || {};
  const headers = Object.assign({}, opts.headers || {});
  const token = getStoredToken();
  if (token) headers["Authorization"] = "Bearer " + token;
  const res = await fetch(path, Object.assign({ credentials: "include" }, opts, { headers }));
  if (res.status === 401) {
    setStoredToken("");
  }
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      msg = body.error || msg;
    } catch (_) {}
    throw new Error(msg);
  }
  return res.json();
}

// --- Session
async function loadSession() {
  try {
    const data = await api("/api/auth/me");
    return data.user || data;
  } catch (err) {
    return null;
  }
}

async function loginWithCredentials(username, password) {
  const data = await api("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });
  if (data.token) setStoredToken(data.token);
  return data.user;
}

async function loginWithTelegram(initData) {
  const data = await api("/api/auth/telegram", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ initData })
  });
  if (data.token) setStoredToken(data.token);
  return data.user;
}

async function logout() {
  try {
    await api("/api/auth/logout", { method: "POST" });
  } catch (_) {}
  setStoredToken("");
  state.user = null;
  showLogin();
}

// --- View switching
function switchView(target) {
  els.navBtns.forEach((btn) => btn.classList.toggle("is-active", btn.dataset.target === target));
  $$(".tg-view").forEach((v) => v.classList.toggle("is-active", v.dataset.tgview === target));
  // Scroll to top on view switch
  const main = document.querySelector(".tg-main");
  if (main) main.scrollTop = 0;
}

// --- Render dashboard
function renderHeader() {
  if (!state.user) return;
  els.hiEyebrow.textContent = "SALUT";
  els.hiName.textContent = state.user.name || state.user.username;
  els.role.textContent = state.user.roleName || state.user.role || "—";
  els.profileAvatar.textContent = initials(state.user.name);
  els.profileName.textContent = state.user.name || "—";
  els.profileRole.textContent = state.user.roleName || state.user.role || "—";
}

function renderStocHero() {
  const stocks = state.stocks || {};
  const totals = stocks.totals || {};
  const capacityTotal = Number(totals.capacityTotal || 8000);
  const occupied = Number(totals.totalQuantity || 0);
  const pct = capacityTotal > 0 ? Math.min(100, Math.round((occupied / capacityTotal) * 100)) : 0;
  els.stocValue.textContent = `${pct}%`;
  els.stocMeta.textContent = `${formatNumber(occupied)} / ${formatNumber(capacityTotal)} t`;
}

function renderActions() {
  const actions = [];
  if (canDo("receipts-write")) {
    actions.push({ id: "new-receipt", label: "+ Recepție", primary: true,
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 14v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4"/><path d="M12 4v10"/><path d="m7 9 5 5 5-5"/></svg>'
    });
  }
  if (canDo("processing-write")) {
    actions.push({ id: "new-processing", label: "+ Procesare",
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>'
    });
    actions.push({ id: "new-transfer", label: "+ Transfer",
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m17 2 4 4-4 4"/><path d="M21 6H7"/><path d="m7 22-4-4 4-4"/><path d="M3 18h14"/></svg>'
    });
  }
  if (canDo("deliveries-write")) {
    actions.push({ id: "new-delivery", label: "+ Livrare",
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 16V6a1 1 0 0 1 1-1h10v11"/><path d="M14 9h4l3 3v4h-7"/><circle cx="7.5" cy="18.5" r="2"/><circle cx="16.5" cy="18.5" r="2"/></svg>'
    });
  }
  if (canDo("finance")) {
    actions.push({ id: "new-transaction", label: "+ Tranzacție",
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M14.8 9.3a3 3 0 0 0-5.3 1.6c0 1.4 1 2.3 3 2.8 2 .5 3 1.4 3 2.8a3 3 0 0 1-5.3 1.6"/></svg>'
    });
  }
  if (canDo("complaints-write") || canDo("complaints-read")) {
    actions.push({ id: "new-complaint", label: "+ Reclamație",
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.3 3.86 1.82 18a2 2 0 0 0 1.7 3h16.96a2 2 0 0 0 1.7-3L13.7 3.86a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>'
    });
  }
  if (canDo("reports")) {
    actions.push({ id: "reports", label: "Rapoarte",
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18"/><rect x="7" y="13" width="3" height="5"/><rect x="12" y="9" width="3" height="9"/><rect x="17" y="5" width="3" height="13"/></svg>'
    });
  }

  // Fallback if no actions allowed
  if (!actions.length) {
    actions.push({ id: "view-stoc", label: "Vezi stocul",
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 8 12 3 3 8v8l9 5 9-5V8Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>'
    });
  }

  els.actionsGrid.innerHTML = actions
    .slice(0, 6)
    .map((a) => `
      <button class="tg-action ${a.primary ? "is-primary" : ""}" data-action="${a.id}" type="button">
        ${a.icon}
        <span>${a.label}</span>
      </button>
    `)
    .join("");

  els.actionsGrid.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => handleAction(btn.dataset.action));
  });
}

function handleAction(actionId) {
  // For V1: open the full web app at the right page. We can build native
  // mini-app forms later for the most-used ones.
  const routes = {
    "new-receipt": "/?v=receptii",
    "new-processing": "/?v=procesare",
    "new-transfer": "/?v=transferuri",
    "new-delivery": "/?v=livrari",
    "new-transaction": "/?v=financiar",
    "new-complaint": "/?v=reclamatii",
    "reports": "/?v=rapoarte",
    "view-stoc": "/?v=stoc"
  };
  const url = routes[actionId] || "/";
  // If running in Telegram, openLink in external browser; otherwise navigate
  if (state.tg && typeof state.tg.openLink === "function") {
    state.tg.openLink(window.location.origin + url, { try_instant_view: false });
  } else {
    window.location.href = url;
  }
}

function renderTodayKPI() {
  const today = new Date().toISOString().slice(0, 10);
  const isToday = (iso) => String(iso || "").slice(0, 10) === today;

  const receiptsToday = state.receipts.filter((r) => isToday(r.createdAt || r.receivedAt)).length;
  const deliveriesToday = state.deliveries.filter((d) => isToday(d.createdAt || d.deliveredAt)).length;
  const processingsToday = state.processings.filter((p) => isToday(p.createdAt || p.processedAt)).length;
  const transfersToday = state.transfers.filter((t) => isToday(t.createdAt)).length;

  els.kReceipts.textContent = receiptsToday;
  els.kDeliveries.textContent = deliveriesToday;
  if (els.kProcessings) els.kProcessings.textContent = processingsToday;
  if (els.kTransfers) els.kTransfers.textContent = transfersToday;
}

function renderFeed() {
  const items = (state.auditLogs || []).slice(0, 6);
  if (!items.length) {
    els.feedList.innerHTML = '<p class="tg-muted">Nu sunt evenimente recente.</p>';
    return;
  }
  els.feedList.innerHTML = items.map((log) => {
    const action = String(log.action || "").toLowerCase();
    let cls = "";
    if (/delete|cancel|reject/.test(action)) cls = "red";
    else if (/update|edit|toggle|inactiv/.test(action)) cls = "gold";
    const entity = log.entityType || "—";
    const entityId = log.entityId ? ` #${log.entityId}` : "";
    const reason = (log.reason || log.action || `${entity}${entityId}`).toString().slice(0, 80);
    const when = formatTime(log.createdAt);
    const user = log.user || "—";
    return `
      <div class="tg-feed-item">
        <div class="tg-feed-dot ${cls}"></div>
        <div class="tg-feed-text">
          <div class="tg-feed-title">${reason}</div>
          <div class="tg-feed-meta">${when} · ${user}</div>
        </div>
      </div>
    `;
  }).join("");
}

function renderReceiptsList() {
  const items = (state.receipts || []).slice(0, 30);
  if (!items.length) {
    els.receiptsList.innerHTML = '<p class="tg-muted">Nu există recepții.</p>';
    return;
  }
  els.receiptsList.innerHTML = items.map((r) => `
    <article class="tg-list-card">
      <div class="tg-list-card-info">
        <div class="tg-list-card-title">#${r.id || "—"} · ${r.product || "—"}</div>
        <div class="tg-list-card-meta">${r.supplier || "—"} · ${formatTime(r.createdAt || r.receivedAt)}</div>
      </div>
      <div class="tg-list-card-amount">${formatNumber(r.netQuantity || r.quantity || 0)} t</div>
    </article>
  `).join("");
}

function renderDeliveriesList() {
  const items = (state.deliveries || []).slice(0, 30);
  if (!items.length) {
    els.deliveriesList.innerHTML = '<p class="tg-muted">Nu există livrări.</p>';
    return;
  }
  els.deliveriesList.innerHTML = items.map((d) => `
    <article class="tg-list-card">
      <div class="tg-list-card-info">
        <div class="tg-list-card-title">#${d.id || "—"} · ${d.product || "—"}</div>
        <div class="tg-list-card-meta">${d.customer || "—"} · ${formatTime(d.createdAt || d.deliveredAt)}</div>
      </div>
      <div class="tg-list-card-amount">${formatNumber(d.deliveredQuantity || d.quantity || 0)} t</div>
    </article>
  `).join("");
}

function renderProcessingsList() {
  const items = (state.processings || []).slice(0, 30);
  if (!items.length) {
    els.processingsList.innerHTML = '<p class="tg-muted">Nu există procesări.</p>';
    return;
  }
  els.processingsList.innerHTML = items.map((p) => {
    const inLucru = p.status === "In lucru" ? " · în lucru" : "";
    return `
    <article class="tg-list-card">
      <div class="tg-list-card-info">
        <div class="tg-list-card-title">#${p.id || "—"} · ${p.product || "—"}${inLucru}</div>
        <div class="tg-list-card-meta">${p.processingType || "—"} · ${p.sourceLocation || "—"} · ${formatTime(p.createdAt || p.processedAt)}</div>
      </div>
      <div class="tg-list-card-amount">${formatNumber(Math.round(Number(p.processedQuantity || 0) * 1000))} kg</div>
    </article>`;
  }).join("");
}

function renderTransfersList() {
  const items = (state.transfers || []).slice(0, 30);
  if (!items.length) {
    els.transfersList.innerHTML = '<p class="tg-muted">Nu există transferuri.</p>';
    return;
  }
  els.transfersList.innerHTML = items.map((t) => `
    <article class="tg-list-card">
      <div class="tg-list-card-info">
        <div class="tg-list-card-title">#${t.id || "—"} · ${t.product || "—"}</div>
        <div class="tg-list-card-meta">${t.fromLocation || "—"} → ${t.toLocation || "—"} · ${formatTime(t.createdAt)}</div>
      </div>
      <div class="tg-list-card-amount">${formatNumber(Math.round(Number(t.quantity || 0) * 1000))} kg</div>
    </article>
  `).join("");
}

function renderStocksList() {
  const items = ((state.stocks && state.stocks.byLocation) || []).filter((s) => Number(s.quantity || 0) > 0);
  if (!items.length) {
    els.stocksList.innerHTML = '<p class="tg-muted">Nu există stoc.</p>';
    return;
  }
  els.stocksList.innerHTML = items.map((s) => `
    <article class="tg-list-card">
      <div class="tg-list-card-info">
        <div class="tg-list-card-title">${s.location || "—"}</div>
        <div class="tg-list-card-meta">${s.product || "—"}</div>
      </div>
      <div class="tg-list-card-amount">${formatNumber(s.quantity || 0)} t</div>
    </article>
  `).join("");
}

function renderTransactionsList() {
  const items = (state.transactions || []).slice(0, 30);
  if (!items.length) {
    els.transactionsList.innerHTML = '<p class="tg-muted">Nu există tranzacții.</p>';
    return;
  }
  els.transactionsList.innerHTML = items.map((t) => {
    const dir = (t.direction || "").toLowerCase();
    const klass = dir === "collection" ? "is-credit" : dir === "payment" ? "is-debit" : "";
    const sign = dir === "collection" ? "+" : dir === "payment" ? "-" : "";
    return `
      <article class="tg-list-card">
        <div class="tg-list-card-info">
          <div class="tg-list-card-title">${t.partner || t.referenceType || "—"}</div>
          <div class="tg-list-card-meta">${t.referenceType || ""} · ${formatTime(t.createdAt || t.transactedAt)}</div>
        </div>
        <div class="tg-list-card-amount ${klass}">${sign}${formatMoney(t.amount || 0)}</div>
      </article>
    `;
  }).join("");
}

// --- Data loading
async function safeLoad(path, key, transform) {
  try {
    const data = await api(path, { credentials: "include" });
    state[key] = transform ? transform(data) : data;
  } catch (err) {
    console.warn(`Failed to load ${path}:`, err.message);
  }
}

async function loadAll() {
  // Incarcam DOAR resursele permise rolului — altfel un 401 ar sterge token-ul (vezi api()).
  await Promise.allSettled([
    canDo("receipts-read") && safeLoad("/api/receipts", "receipts", (d) => d.receipts || []),
    canDo("deliveries-read") && safeLoad("/api/deliveries", "deliveries", (d) => d.deliveries || []),
    canDo("processings-read") && safeLoad("/api/processings", "processings", (d) => d.processings || []),
    canDo("processings-read") && safeLoad("/api/transfers", "transfers", (d) => d.transfers || []),
    canDo("stocks-read") && safeLoad("/api/stocks", "stocks", (d) => d || {}),
    canDo("finance") && safeLoad("/api/transactions", "transactions", (d) => d.transactions || []),
    canDo("complaints-read") && safeLoad("/api/complaints", "complaints", (d) => d.complaints || []),
    canDo("audit") && safeLoad("/api/audit-logs", "auditLogs", (d) => d.auditLogs || [])
  ].filter(Boolean));
  renderStocHero();
  renderTodayKPI();
  renderFeed();
  renderReceiptsList();
  renderDeliveriesList();
  renderProcessingsList();
  renderTransfersList();
  renderStocksList();
  renderTransactionsList();
}

// --- UI state
function showLogin() {
  els.shell.hidden = true;
  els.login.hidden = false;
}

function showApp() {
  els.login.hidden = true;
  els.shell.hidden = false;
}

function setupNavigation() {
  els.navBtns.forEach((btn) => {
    btn.addEventListener("click", () => switchView(btn.dataset.target));
  });

  els.loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    els.loginError.textContent = "";
    try {
      const user = await loginWithCredentials(els.loginUser.value.trim(), els.loginPass.value);
      state.user = user;
      await afterLogin();
    } catch (err) {
      els.loginError.textContent = err.message || "Eroare la conectare.";
    }
  });

  if (els.logoutBtn) {
    els.logoutBtn.addEventListener("click", () => logout());
  }

  if (els.accountBtn) {
    els.accountBtn.addEventListener("click", () => switchView("cont"));
  }
}

async function afterLogin() {
  renderHeader();
  renderActions();
  showApp();
  await loadAll();
}

// --- Bootstrap
async function bootstrap() {
  state.tg = initTelegram();
  setupNavigation();

  // Try existing session first
  let user = await loadSession();

  // If no session and we're in Telegram, try Telegram auto-login
  if (!user && state.tg && state.tg.initData) {
    try {
      user = await loginWithTelegram(state.tg.initData);
    } catch (err) {
      console.warn("Telegram auto-login failed:", err.message);
    }
  }

  if (!user) {
    showLogin();
    return;
  }

  state.user = user;
  await afterLogin();
}

bootstrap();
