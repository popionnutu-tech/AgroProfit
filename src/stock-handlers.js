const { getStockSummary, listStockCorrections } = require("./storage");

function sendJson(res, statusCode, payload) {
  if (typeof res.status === "function" && typeof res.json === "function") {
    return res.status(statusCode).json(payload);
  }

  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
}

async function getStockSummaryHandler(_req, res) {
  try {
    // Corectiile vin in ACELASI raspuns cu stocul. O cerere separata ar fi costat inca o
    // descarcare a blobului intreg (fiecare /api/* trece prin `reloadFromKv`), pentru cateva
    // zeci de KB — iar `loadStocks()` e apelat din zeci de locuri.
    const [summary, stockCorrections] = await Promise.all([
      getStockSummary(),
      listStockCorrections()
    ]);
    return sendJson(res, 200, { ...summary, stockCorrections });
  } catch (error) {
    console.error("Failed to load stock summary:", error.message);
    return sendJson(res, 500, { error: "Nu am putut incarca stocurile." });
  }
}

module.exports = {
  getStockSummaryHandler
};
