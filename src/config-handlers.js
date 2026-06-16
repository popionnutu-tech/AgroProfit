const {
  createConfigEntry,
  deletePartner,
  getConfig,
  updateConfigEntry,
  updateSystemSettings
} = require("./storage");
const { getActorLabel } = require("./auth");
const { triggerCriticalManagementAlert } = require("./critical-alerts");

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

async function getConfigHandler(_req, res) {
  try {
    const config = await getConfig();
    return sendJson(res, 200, config);
  } catch (error) {
    console.error("Failed to load config:", error.message);
    return sendJson(res, 500, { error: "Nu am putut incarca configurarile." });
  }
}

async function createConfigEntryHandler(req, res, entity) {
  try {
    const body = getBody(req);
    const entry = await createConfigEntry(entity, {
      ...body,
      changeReason: body.changeReason || `Adaugare ${entity} prin dashboard`,
      changedBy: getActorLabel(req)
    });
    return sendJson(res, 201, entry);
  } catch (error) {
    console.error(`Failed to create config entry for ${entity}:`, error.message);
    return sendJson(res, 400, { error: error.message || "Nu am putut salva elementul de configurare." });
  }
}

async function updateConfigEntryHandler(req, res, entity, id) {
  try {
    const body = getBody(req);
    const entry = await updateConfigEntry(entity, id, {
      ...body,
      changeReason: body.changeReason || `Modificare ${entity} prin dashboard`,
      changedBy: getActorLabel(req)
    });

    if (!entry) {
      return sendJson(res, 404, { error: "Elementul nu a fost gasit." });
    }

    return sendJson(res, 200, entry);
  } catch (error) {
    console.error(`Failed to update config entry for ${entity}:`, error.message);
    return sendJson(res, 400, { error: error.message || "Nu am putut actualiza elementul." });
  }
}

async function updateSystemSettingsHandler(req, res) {
  try {
    const actor = getActorLabel(req);
    const settings = await updateSystemSettings({
      ...getBody(req),
      changedBy: actor
    });
    const response = sendJson(res, 200, settings);
    triggerCriticalManagementAlert({
      trigger: "system-settings-updated",
      actor
    });
    return response;
  } catch (error) {
    console.error("Failed to update system settings:", error.message);
    return sendJson(res, 400, { error: "Nu am putut salva setarile sistemului." });
  }
}

async function deletePartnerHandler(req, res) {
  try {
    const body = getBody(req);
    const reassignTo = body.reassignTo || (req.query && req.query.reassignTo) || null;
    const result = await deletePartner(req.params.id, {
      reassignTo,
      changedBy: getActorLabel(req),
      changeReason: body.changeReason || "Stergere partener din nomenclator"
    });

    if (result.status === "not-found") {
      return sendJson(res, 404, { error: "Partenerul nu a fost gasit." });
    }
    if (result.status === "has-references") {
      return sendJson(res, 409, {
        error: "Partenerul are referinte. Alege un partener pentru reatribuire.",
        references: result.references
      });
    }
    return sendJson(res, 200, { ok: true, reassignedTo: result.reassignedTo });
  } catch (error) {
    console.error("Failed to delete partner:", error.message);
    return sendJson(res, 400, { error: error.message || "Nu am putut sterge partenerul." });
  }
}

module.exports = {
  createConfigEntryHandler,
  deletePartnerHandler,
  getConfigHandler,
  updateConfigEntryHandler,
  updateSystemSettingsHandler
};
