const { getDailyReport, getPeriodReport } = require("./storage");
const { filterCanceledForRole, filterCanceledTransactionsForRole } = require("./permissions");

// Filtreaza documentele anulate din raport dupa rol (admin toate / manager pe ale lui / restul niciuna).
function filterReportForRole(report, roleCode) {
  if (!report) return report;
  if (Array.isArray(report.receipts)) {
    report.receipts = filterCanceledForRole(report.receipts, roleCode);
  }
  if (Array.isArray(report.deliveries)) {
    report.deliveries = filterCanceledForRole(report.deliveries, roleCode);
  }
  // Tranzactiile ANULATE (storno) le vad in raport DOAR admin + contabil-sef; celelalte roluri
  // nu trebuie sa le primeasca nici macar in payload. Totalurile de plati/incasari sunt deja
  // calculate pe tranzactii active in local-storage, deci filtrarea de aici nu le atinge.
  if (Array.isArray(report.transactions)) {
    report.transactions = filterCanceledTransactionsForRole(report.transactions, roleCode);
  }
  return report;
}

function sendJson(res, statusCode, payload) {
  if (typeof res.status === "function" && typeof res.json === "function") {
    return res.status(statusCode).json(payload);
  }

  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
}

async function getDailyReportHandler(req, res) {
  try {
    const from = String(req.query?.from || "").trim();
    const to = String(req.query?.to || "").trim();
    // Daca vine interval (from/to) -> raport pe perioada; altfel raport pe o singura zi.
    const role = req.currentUser && req.currentUser.roleCode;
    if (from || to) {
      const report = await getPeriodReport(from || to, to || from);
      return sendJson(res, 200, filterReportForRole(report, role));
    }
    const dateValue =
      String(req.query?.date || "").trim() || new Date().toISOString().slice(0, 10);
    const report = await getDailyReport(dateValue);
    return sendJson(res, 200, filterReportForRole(report, role));
  } catch (error) {
    console.error("Failed to load daily report:", error.message);
    return sendJson(res, 500, { error: "Nu am putut incarca raportul zilnic." });
  }
}

module.exports = {
  getDailyReportHandler
};
