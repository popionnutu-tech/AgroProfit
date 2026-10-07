const {
  exportPaymentsFor1c,
  listPending1c,
  markSuppliersByFiscalCodes,
  setExported1c,
  exportPurchaseActsFor1c,
  exportSuppliersFor1c,
  markSuppliersExported1c,
  exportResourceAsCsv,
  getDashboardSnapshot,
  getDeliveryDefaults,
  getReceiptDefaults
} = require("./storage");
const { getActorLabel } = require("./auth");

function sendJson(res, statusCode, payload) {
  if (typeof res.status === "function" && typeof res.json === "function") {
    return res.status(statusCode).json(payload);
  }
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
}

async function getReceiptDefaultsHandler(req, res) {
  try {
    const { supplierId, productId } = req.query || {};
    const defaults = await getReceiptDefaults(supplierId, productId);
    return sendJson(res, 200, { defaults });
  } catch (error) {
    console.error("Failed to load receipt defaults:", error.message);
    return sendJson(res, 500, { error: "Nu am putut incarca valorile implicite." });
  }
}

async function getDeliveryDefaultsHandler(req, res) {
  try {
    const { customerId } = req.query || {};
    const defaults = await getDeliveryDefaults(customerId);
    return sendJson(res, 200, { defaults });
  } catch (error) {
    console.error("Failed to load delivery defaults:", error.message);
    return sendJson(res, 500, { error: "Nu am putut incarca valorile implicite." });
  }
}

async function getDashboardHandler(req, res) {
  try {
    const date = String(req.query?.date || new Date().toISOString().slice(0, 10));
    const dashboard = await getDashboardSnapshot(date);
    return sendJson(res, 200, dashboard);
  } catch (error) {
    console.error("Failed to load dashboard:", error.message);
    return sendJson(res, 500, { error: "Nu am putut incarca dashboard-ul." });
  }
}

// Export pentru 1C: acte de achizitie pe o perioada.
// `;` ca separator si BOM UTF-8: asa se deschide corect in Excel pe setarile ro/ru, fara
// „toate coloanele intr-una". Zecimala e PUNCT, ca 1C sa nu confunde separatorul de coloana
// cu cel zecimal.
// Acelasi plafon ca la marcare (`idUri1c`): altfel se descarca 600, se importa 600, iar
// marcarea cade cu „prea multe documente" -> re-descarcare -> DUBLU import in 1C.
const MAX_IDS_1C = 500;

// Ids-urile vin din CORPUL cererii (POST) sau din query (GET, pentru compatibilitate).
// In URL, „bifeaza tot" pe mii de documente depasea limita de antet a platformei si
// descarcarea cadea cu 414/431 — exact cand omul avea nevoie de ea.
function idsDinCerere(req) {
  const dinCorp = (req.body || {}).ids;
  if (Array.isArray(dinCorp)) return idsDinQuery(dinCorp.join(","));
  return idsDinQuery((req.query || {}).ids);
}

function idsDinQuery(valoare) {
  const ids = String(valoare || "").split(",").map(Number).filter(Boolean);
  if (ids.length > MAX_IDS_1C) {
    const e = new Error(
      `Prea multe documente intr-o singura descarcare (max ${MAX_IDS_1C}). Restrange selectia.`
    );
    e.statusCode = 400;
    throw e;
  }
  return ids;
}

function trimiteCsv1c(res, columns, rows, numeFisier) {
  // Antetul `X-Document-Ids` a fost SCOS: nimeni nu il citea (interfata are deja id-urile pe
  // care le-a trimis), se repeta per RAND la actele multi-linie, si neplafonat putea depasi
  // limita de antet a platformei — rupand descarcarea cu un 500 greu de explicat.
  rows = rows.map((r) => {
    const copie = { ...r };
    delete copie._id;
    return copie;
  });
  // INJECTIE DE FORMULE: o celula care incepe cu `= + - @`, TAB sau CR e interpretata de
  // Excel ca FORMULA, iar ghilimelele nu protejeaza. Fisierul e construit explicit pentru
  // Excel (BOM + `;`), deci va fi deschis acolo.
  // Nota receptiei e scrisa de OPERATOR si ajunge in coloana „Temei" — adica privilegiul cel
  // mai mic din sistem ar putea executa ceva pe statia contabilului
  // (`=cmd|' /C calc'!A0`, `=WEBSERVICE(...)` pentru exfiltrare).
  // Se neutralizeaza DOAR ce nu e numar: altfel s-ar strica valorile negative pe care 1C
  // le citeste ca numere.
  const celula = (v) => {
    const t = String(v === null || v === undefined ? "" : v);
    if (!t) return t;
    const esteNumar = /^-?\d+(?:[.,]\d+)?$/.test(t.trim());
    const periculos = /^[=+\-@\t\r]/.test(t);
    const sigur = !esteNumar && periculos ? `'${t}` : t;
    return /[";\n\r]/.test(sigur) ? `"${sigur.replace(/"/g, '""')}"` : sigur;
  };
  const linie = (valori) => valori.map(celula).join(";");
  const csv = [linie(columns), ...rows.map((r) => linie(columns.map((c) => r[c])))].join("\r\n");
  if (typeof res.setHeader === "function") {
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="${numeFisier}"`);
  }
  if (typeof res.status === "function") res.status(200);
  else res.statusCode = 200;
  res.end("\ufeff" + csv);
}

async function exportPurchaseActs1cHandler(req, res) {
  try {
    const q = req.query || {};
    const { columns, rows } = await exportPurchaseActsFor1c({
      from: q.from,
      to: q.to,
      onlyNew: !["1", "true"].includes(String(q.includeExported || "").toLowerCase()),
      receiptIds: idsDinCerere(req)
    });
    trimiteCsv1c(res, columns, rows, `acte-achizitie-1c-${new Date().toISOString().slice(0, 10)}.csv`);
  } catch (error) {
    console.error("Failed to export purchase acts for 1C:", error.message);
    return sendJson(res, error.statusCode || 400, {
      error: error.message || "Nu am putut exporta actele."
    });
  }
}

// Ordine de plata pe perioada. Se incarca in 1C DUPA acte: plata se leaga de furnizor si de
// contul contabil, iar actul justifica datoria.
async function exportPayments1cHandler(req, res) {
  try {
    const q = req.query || {};
    const { columns, rows } = await exportPaymentsFor1c({
      from: q.from,
      to: q.to,
      onlyNew: !["1", "true"].includes(String(q.includeExported || "").toLowerCase()),
      transactionIds: idsDinCerere(req)
    });
    trimiteCsv1c(res, columns, rows, `ordine-plata-1c-${new Date().toISOString().slice(0, 10)}.csv`);
  } catch (error) {
    console.error("Failed to export payments for 1C:", error.message);
    return sendJson(res, error.statusCode || 400, {
      error: error.message || "Nu am putut exporta platile."
    });
  }
}

// Furnizorii de pe actele din perioada. Se incarca in 1C INAINTEA actelor.
async function exportSuppliers1cHandler(req, res) {
  try {
    const { columns, rows } = await exportSuppliersFor1c({
      from: req.query && req.query.from,
      to: req.query && req.query.to,
      // `?all=1` -> toti furnizorii cu cod fiscal, nu doar cei din perioada.
      onlyFromActs: !["1", "true"].includes(String((req.query || {}).all || "").toLowerCase()),
      // `?includeExported=1` -> si cei deja marcati (pentru reincarcare, daca importul a cazut).
      onlyNew: !["1", "true"].includes(String((req.query || {}).includeExported || "").toLowerCase()),
      partnerIds: idsDinCerere(req)
    });
    trimiteCsv1c(res, columns, rows, `furnizori-1c-${new Date().toISOString().slice(0, 10)}.csv`);
  } catch (error) {
    console.error("Failed to export suppliers for 1C:", error.message);
    return sendJson(res, error.statusCode || 400, {
      error: error.message || "Nu am putut exporta furnizorii."
    });
  }
}

async function exportResourceHandler(req, res, resource) {
  try {
    const csv = await exportResourceAsCsv(resource, req.currentUser && req.currentUser.roleCode);
    const filename = `${resource}-${new Date().toISOString().slice(0, 10)}.csv`;
    if (typeof res.setHeader === "function") {
      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    }
    if (typeof res.status === "function") {
      res.status(200);
    } else {
      res.statusCode = 200;
    }
    res.end(csv);
  } catch (error) {
    console.error(`Failed to export ${resource}:`, error.message);
    return sendJson(res, 400, { error: error.message || "Nu am putut exporta." });
  }
}

// Marcheaza furnizorii ca incarcati in 1C. Apelat de om DUPA un import reusit.
async function markSuppliers1cHandler(req, res) {
  try {
    const rezultat = await markSuppliersExported1c({
      partnerIds: (req.body || {}).partnerIds,
      currentUser: req.currentUser || {},
      changedBy: getActorLabel(req)
    });
    return sendJson(res, 200, { ok: true, ...rezultat });
  } catch (error) {
    console.error("Failed to mark suppliers as exported:", error.message);
    return sendJson(res, error.statusCode || 400, {
      error: error.message || "Nu am putut marca furnizorii."
    });
  }
}

// Ce e de incarcat in 1C, pentru bifare in interfata.
async function listPending1cHandler(req, res) {
  try {
    const q = req.query || {};
    const items = await listPending1c({
      kind: q.kind,
      from: q.from,
      to: q.to,
      includeExported: ["1", "true"].includes(String(q.includeExported || "").toLowerCase())
    });
    return sendJson(res, 200, { ok: true, items });
  } catch (error) {
    console.error("Failed to list pending 1C documents:", error.message);
    return sendJson(res, 400, { error: error.message || "Nu am putut citi lista." });
  }
}

// Marcheaza / ANULEAZA marcajul „incarcat in 1C". Anularea e pentru reincarcarea unui
// document corectat — actiune deliberata, nu efect secundar.
async function setExported1cHandler(req, res) {
  try {
    const body = req.body || {};
    const rezultat = await setExported1c({
      kind: body.kind,
      ids: body.ids,
      reset: body.reset === true,
      currentUser: req.currentUser || {},
      changedBy: getActorLabel(req)
    });
    return sendJson(res, 200, { ok: true, ...rezultat });
  } catch (error) {
    console.error("Failed to set 1C export mark:", error.message);
    return sendJson(res, error.statusCode || 400, {
      error: error.message || "Nu am putut marca documentele."
    });
  }
}

// Potrivirea de PORNIRE cu lista de furnizori descarcata din 1C.
async function matchSuppliers1cHandler(req, res) {
  try {
    const rezultat = await markSuppliersByFiscalCodes({
      fiscalCodes: (req.body || {}).fiscalCodes,
      currentUser: req.currentUser || {},
      changedBy: getActorLabel(req)
    });
    return sendJson(res, 200, { ok: true, ...rezultat });
  } catch (error) {
    console.error("Failed to match suppliers with 1C list:", error.message);
    return sendJson(res, error.statusCode || 400, {
      error: error.message || "Nu am putut potrivi furnizorii."
    });
  }
}

module.exports = {
  listPending1cHandler,
  matchSuppliers1cHandler,
  setExported1cHandler,
  exportPayments1cHandler,
  markSuppliers1cHandler,
  exportPurchaseActs1cHandler,
  exportSuppliers1cHandler,
  exportResourceHandler,
  getDashboardHandler,
  getDeliveryDefaultsHandler,
  getReceiptDefaultsHandler
};
