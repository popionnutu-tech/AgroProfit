const { createStockCorrection, listStockCorrections } = require("./storage");
const { getActorLabel } = require("./auth");

function sendJson(res, statusCode, payload) {
  if (typeof res.status === "function" && typeof res.json === "function") {
    return res.status(statusCode).json(payload);
  }
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
}

async function listStockCorrectionsHandler(_req, res) {
  try {
    return sendJson(res, 200, { stockCorrections: await listStockCorrections() });
  } catch (error) {
    console.error("Failed to load stock corrections:", error.message);
    return sendJson(res, 500, { error: "Nu am putut incarca corectiile de stoc." });
  }
}

// Corectie de inventar. `countedQuantity` vine in TONE (formularul imparte kg la 1000).
// Rolul vine din SESIUNE, nu din body.
async function createStockCorrectionHandler(req, res) {
  const body = req.body || {};
  try {
    const correction = await createStockCorrection({
      location: body.location,
      product: body.product,
      countedQuantity: body.countedQuantity,
      changeReason: body.changeReason || body.reason,
      changedBy: getActorLabel(req),
      currentUser: req.currentUser || {}
    });
    return sendJson(res, 201, correction);
  } catch (error) {
    console.error("Failed to create stock correction:", error.message);
    const status = error.statusCode || 400;
    return sendJson(res, status, { error: error.message || "Nu am putut salva corectia de stoc." });
  }
}

module.exports = {
  createStockCorrectionHandler,
  listStockCorrectionsHandler
};
