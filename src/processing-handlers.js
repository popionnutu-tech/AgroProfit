const {
  createProcessing,
  getConfig,
  listProcessings,
  updateProcessing
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

function getBody(req) {
  return req.body || {};
}

async function listProcessingsHandler(_req, res) {
  try {
    const processings = await listProcessings();
    return sendJson(res, 200, { processings });
  } catch (error) {
    console.error("Failed to load processings:", error.message);
    return sendJson(res, 500, { error: "Nu am putut incarca procesarile." });
  }
}

async function createProcessingHandler(req, res) {
  const body = getBody(req);
  const actor = getActorLabel(req);

  const hasProduct = body.product || body.productId;
  const hasSource = body.sourceLocation || body.sourceLocationId;
  if (!hasProduct || !hasSource || !body.processingType || !body.processedQuantity) {
    return sendJson(res, 400, {
      error: "Campurile produs, locatie sursa, tip procesare si cantitate sunt obligatorii."
    });
  }

  try {
    const config = await getConfig();
    const processingType = config.processingTypes.find(
      (item) => item.name === body.processingType && item.active
    );

    if (!processingType) {
      return sendJson(res, 400, { error: "Tipul de procesare nu este valid." });
    }

    const processing = await createProcessing({
      ...body,
      createdBy: actor
    });

    return sendJson(res, 201, processing);
  } catch (error) {
    console.error("Failed to create processing:", error.message);
    return sendJson(res, 400, { error: error.message || "Nu am putut salva procesarea." });
  }
}

async function updateProcessingHandler(req, res, id) {
  try {
    const processing = await updateProcessing(id, {
      ...getBody(req),
      actorRole: req.currentUser && req.currentUser.roleCode,
      changedBy: getActorLabel(req)
    });

    if (!processing) {
      return sendJson(res, 404, { error: "Procesarea nu a fost gasita." });
    }

    return sendJson(res, 200, processing);
  } catch (error) {
    if (error.forbidden) {
      return sendJson(res, 403, { error: error.message });
    }
    console.error("Failed to update processing:", error.message);
    return sendJson(res, 400, { error: error.message || "Nu am putut actualiza procesarea." });
  }
}

module.exports = {
  createProcessingHandler,
  listProcessingsHandler,
  updateProcessingHandler
};
