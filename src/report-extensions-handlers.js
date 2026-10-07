const {
  exportPurchaseActsFor1c,
  exportResourceAsCsv,
  getDashboardSnapshot,
  getDeliveryDefaults,
  getReceiptDefaults
} = require("./storage");

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
async function exportPurchaseActs1cHandler(req, res) {
  try {
    const { columns, rows } = await exportPurchaseActsFor1c({
      from: req.query && req.query.from,
      to: req.query && req.query.to
    });
    const linie = (valori) =>
      valori
        .map((v) => {
          const t = String(v === null || v === undefined ? "" : v);
          return /[";\n\r]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t;
        })
        .join(";");
    const csv = [linie(columns), ...rows.map((r) => linie(columns.map((c) => r[c])))].join("\r\n");

    const nume = `acte-achizitie-1c-${new Date().toISOString().slice(0, 10)}.csv`;
    if (typeof res.setHeader === "function") {
      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader("Content-Disposition", `attachment; filename="${nume}"`);
    }
    if (typeof res.status === "function") res.status(200);
    else res.statusCode = 200;
    res.end("\ufeff" + csv);
  } catch (error) {
    console.error("Failed to export purchase acts for 1C:", error.message);
    return sendJson(res, 400, { error: error.message || "Nu am putut exporta actele." });
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

module.exports = {
  exportPurchaseActs1cHandler,
  exportResourceHandler,
  getDashboardHandler,
  getDeliveryDefaultsHandler,
  getReceiptDefaultsHandler
};
