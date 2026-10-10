const { cautaAuditLogs } = require("./storage");

function sendJson(res, statusCode, payload) {
  if (typeof res.status === "function" && typeof res.json === "function") {
    return res.status(statusCode).json(payload);
  }

  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
}

async function listAuditLogsHandler(req, res) {
  try {
    const q = (req && req.query) || {};
    // Filtrele pleaca spre magazie: la 3 ani, jurnalul intreg inseamna zeci de MB catre
    // browser pentru 20 de randuri afisate.
    const rezultat = await cautaAuditLogs({
      from: q.from,
      to: q.to,
      q: q.q,
      limit: q.limit
    });
    return sendJson(res, 200, rezultat);
  } catch (error) {
    console.error("Failed to load audit logs:", error.message);
    return sendJson(res, 500, { error: "Nu am putut incarca jurnalul de modificari." });
  }
}

module.exports = {
  listAuditLogsHandler
};
