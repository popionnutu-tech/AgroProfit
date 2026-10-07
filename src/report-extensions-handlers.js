const {
  exportPaymentsFor1c,
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
function trimiteCsv1c(res, columns, rows, numeFisier) {
  const linie = (valori) =>
    valori
      .map((v) => {
        const t = String(v === null || v === undefined ? "" : v);
        return /[";\n\r]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t;
      })
      .join(";");
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
    const { columns, rows } = await exportPurchaseActsFor1c({
      from: req.query && req.query.from,
      to: req.query && req.query.to
    });
    trimiteCsv1c(res, columns, rows, `acte-achizitie-1c-${new Date().toISOString().slice(0, 10)}.csv`);
  } catch (error) {
    console.error("Failed to export purchase acts for 1C:", error.message);
    return sendJson(res, 400, { error: error.message || "Nu am putut exporta actele." });
  }
}

// Ordine de plata pe perioada. Se incarca in 1C DUPA acte: plata se leaga de furnizor si de
// contul contabil, iar actul justifica datoria.
async function exportPayments1cHandler(req, res) {
  try {
    const { columns, rows } = await exportPaymentsFor1c({
      from: req.query && req.query.from,
      to: req.query && req.query.to
    });
    trimiteCsv1c(res, columns, rows, `ordine-plata-1c-${new Date().toISOString().slice(0, 10)}.csv`);
  } catch (error) {
    console.error("Failed to export payments for 1C:", error.message);
    return sendJson(res, 400, { error: error.message || "Nu am putut exporta platile." });
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
      onlyNew: !["1", "true"].includes(String((req.query || {}).includeExported || "").toLowerCase())
    });
    // Id-urile ajung in antet, nu in CSV: 1C n-are ce face cu ele, dar interfata are nevoie
    // de ele ca sa poata marca exact furnizorii descarcati.
    if (typeof res.setHeader === "function") {
      res.setHeader("X-Supplier-Ids", rows.map((r) => r._id).join(","));
    }
    const curate = rows.map((r) => {
      const copie = { ...r };
      delete copie._id;
      return copie;
    });
    trimiteCsv1c(res, columns, curate, `furnizori-1c-${new Date().toISOString().slice(0, 10)}.csv`);
  } catch (error) {
    console.error("Failed to export suppliers for 1C:", error.message);
    return sendJson(res, 400, { error: error.message || "Nu am putut exporta furnizorii." });
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

module.exports = {
  exportPayments1cHandler,
  markSuppliers1cHandler,
  exportPurchaseActs1cHandler,
  exportSuppliers1cHandler,
  exportResourceHandler,
  getDashboardHandler,
  getDeliveryDefaultsHandler,
  getReceiptDefaultsHandler
};
