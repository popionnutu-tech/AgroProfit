const { getDailyReport, getPeriodReport } = require("./storage");

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
    if (from || to) {
      const report = await getPeriodReport(from || to, to || from);
      return sendJson(res, 200, report);
    }
    const dateValue =
      String(req.query?.date || "").trim() || new Date().toISOString().slice(0, 10);
    const report = await getDailyReport(dateValue);
    return sendJson(res, 200, report);
  } catch (error) {
    console.error("Failed to load daily report:", error.message);
    return sendJson(res, 500, { error: "Nu am putut incarca raportul zilnic." });
  }
}

module.exports = {
  getDailyReportHandler
};
