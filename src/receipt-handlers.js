const {
  closeReceipt,
  completeReceiptWeighing,
  createReceipt,
  getConfig,
  getStats,
  listReceipts,
  reopenReceipt,
  storageDriver,
  updateReceiptStatusWithAudit
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

function computeReceiptEstimate({ quantity, price, humidity, impurity, product, tariffs, fiscalProfile }) {
  const grossQuantity = Number(quantity);
  const unitPrice = Number(price);
  const humidityNorm = Number(product.humidityNorm || 0);
  const impurityNorm = Number(product.impurityNorm || 0);
  const actualHumidity = Number(humidity || 0);
  const actualImpurity = Number(impurity || 0);
  const excessHumidity = Math.max(actualHumidity - humidityNorm, 0);
  const excessImpurity = Math.max(actualImpurity - impurityNorm, 0);
  const estimatedWaterLoss = grossQuantity * (excessHumidity / 100);
  const estimatedImpurityLoss = grossQuantity * (excessImpurity / 100);
  const provisionalNetQuantity = Math.max(
    grossQuantity - estimatedWaterLoss - estimatedImpurityLoss,
    0
  );

  const cleaningTariff =
    tariffs.find((item) => item.service.toLowerCase() === "curatire" && item.active)?.value || 0;
  const dryingTariff =
    tariffs.find((item) => item.service.toLowerCase() === "uscare" && item.active)?.value || 0;

  const cleaningServiceTotal = grossQuantity * Number(cleaningTariff || 0);
  const dryingServiceTotal = grossQuantity * excessHumidity * Number(dryingTariff || 0);
  const preliminaryServicesTotal = cleaningServiceTotal + dryingServiceTotal;
  const preliminaryMerchandiseValue = provisionalNetQuantity * unitPrice;
  const preliminaryBeforeWithholding = Math.max(
    preliminaryMerchandiseValue - preliminaryServicesTotal,
    0
  );
  const withholdingPercent = Number(fiscalProfile?.withholdingPercent || 0);
  const withholdingAmount = preliminaryBeforeWithholding * (withholdingPercent / 100);
  const preliminaryPayableAmount = Math.max(
    preliminaryBeforeWithholding - withholdingAmount,
    0
  );

  return {
    grossQuantity,
    humidity: actualHumidity,
    impurity: actualImpurity,
    humidityNorm,
    impurityNorm,
    excessHumidity,
    excessImpurity,
    estimatedWaterLoss,
    estimatedImpurityLoss,
    provisionalNetQuantity,
    cleaningServiceTotal,
    dryingServiceTotal,
    preliminaryServicesTotal,
    preliminaryMerchandiseValue,
    withholdingPercent,
    withholdingAmount,
    preliminaryPayableAmount
  };
}

async function healthHandler(_req, res) {
  return sendJson(res, 200, { ok: true, storage: storageDriver });
}

// Campuri financiare pe receptie — vizibile DOAR rolurilor cu capabilitatea "finance".
// Operatorul / control nu trebuie sa primeasca aceste date nici prin API (nu doar ascunse in UI).
const FINANCIAL_RECEIPT_FIELDS = [
  "price",
  "preliminaryMerchandiseValue",
  "preliminaryServicesTotal",
  "cleaningServiceTotal",
  "dryingServiceTotal",
  "withholdingPercent",
  "withholdingAmount",
  "preliminaryPayableAmount",
  "amountToPay",
  "paidAmount",
  "soldRestant",
  "paymentStatus",
  "lastPaymentDate"
];

function stripReceiptFinancials(receipt) {
  const clone = { ...receipt };
  for (const field of FINANCIAL_RECEIPT_FIELDS) {
    delete clone[field];
  }
  return clone;
}

// Agregatele financiare din `stats` nu trebuie livrate rolurilor fara "finance".
function stripFinancialStats(stats) {
  if (!stats || typeof stats !== "object") {
    return stats;
  }
  const clone = { ...stats };
  delete clone.finance;
  delete clone.advances;
  delete clone.opening;
  delete clone.totalValue;
  return clone;
}

// Capabilitatea "finance" din sesiune. Fail-closed: daca nu o putem confirma → fara finance.
function requestCanSeeFinance(req) {
  const permissions =
    req && req.currentUser && Array.isArray(req.currentUser.permissions)
      ? req.currentUser.permissions
      : [];
  return permissions.includes("finance");
}

// Aplica filtrarea financiara pe o recepție intoarsa de orice handler, dupa capabilitate.
function receiptForRequest(req, receipt) {
  return requestCanSeeFinance(req) ? receipt : stripReceiptFinancials(receipt);
}

async function listReceiptsHandler(req, res) {
  try {
    const [receipts, stats] = await Promise.all([listReceipts(), getStats()]);
    const canSeeFinance = requestCanSeeFinance(req);

    return sendJson(res, 200, {
      receipts: canSeeFinance ? receipts : receipts.map(stripReceiptFinancials),
      stats: canSeeFinance ? stats : stripFinancialStats(stats)
    });
  } catch (error) {
    console.error("Failed to load receipts:", error.message);
    return sendJson(res, 500, { error: "Nu am putut incarca receptiile." });
  }
}

async function createReceiptHandler(req, res) {
  const body = getBody(req);
  const actor = getActorLabel(req);
  const { quantity, price, humidity, impurity } = body;
  // Cantar in 2 pasi: la intrare se salveaza doar masa bruta (status "In descarcare");
  // cantitatea (net) ramane necunoscuta pana la a doua cantarire (tara).
  const isPendingWeighing = body.status === "In descarcare";

  if (!body.productId) {
    return sendJson(res, 400, { error: "Campul productId este obligatoriu." });
  }
  if (!isPendingWeighing && (quantity === undefined || quantity === "")) {
    return sendJson(res, 400, {
      error: "Campurile productId si quantity sunt obligatorii."
    });
  }

  try {
    const config = await getConfig();
    const partner = body.supplierId
      ? config.partners.find((item) => item.id === Number(body.supplierId))
      : null;
    const product = config.products.find((item) => item.id === Number(body.productId));
    const location = body.locationId
      ? config.storageLocations.find((item) => item.id === Number(body.locationId))
      : null;
    const fiscalProfile = config.fiscalProfiles.find(
      (item) => item.name === partner?.fiscalProfile
    );

    if (body.supplierId && !partner) {
      return sendJson(res, 400, { error: "Furnizorul selectat nu exista." });
    }

    if (!product) {
      return sendJson(res, 400, { error: "Produsul selectat nu exista." });
    }

    if (location === null && body.locationId) {
      return sendJson(res, 400, { error: "Locatia selectata nu exista." });
    }

    const normalizedQuantity = isPendingWeighing ? 0 : Number(quantity);
    const normalizedPrice =
      price === undefined || price === null || price === "" ? 0 : Number(price);
    const normalizedHumidity =
      humidity === undefined || humidity === null || humidity === ""
        ? Number(product.humidityNorm || 0)
        : Number(humidity);
    const normalizedImpurity =
      impurity === undefined || impurity === null || impurity === ""
        ? Number(product.impurityNorm || 0)
        : Number(impurity);

    if (isPendingWeighing) {
      if (!(Number(body.grossWeight) > 0)) {
        return sendJson(res, 400, { error: "Introdu masa bruta (camion plin)." });
      }
    } else if (!Number.isFinite(normalizedQuantity) || normalizedQuantity <= 0) {
      return sendJson(res, 400, { error: "Cantitatea trebuie sa fie mai mare ca zero." });
    }

    if (!Number.isFinite(normalizedPrice) || normalizedPrice < 0) {
      return sendJson(res, 400, { error: "Pretul nu poate fi negativ." });
    }

    if (!Number.isFinite(normalizedHumidity) || normalizedHumidity < 0) {
      return sendJson(res, 400, { error: "Umiditatea trebuie sa fie o valoare valida." });
    }

    if (!Number.isFinite(normalizedImpurity) || normalizedImpurity < 0) {
      return sendJson(res, 400, { error: "Impuritatile trebuie sa fie o valoare valida." });
    }

    const estimate = computeReceiptEstimate({
      quantity: normalizedQuantity,
      price: normalizedPrice,
      humidity: normalizedHumidity,
      impurity: normalizedImpurity,
      product,
      tariffs: config.tariffs,
      fiscalProfile
    });

    const receipt = await createReceipt({
      ...body,
      quantity: normalizedQuantity,
      price: normalizedPrice,
      supplier: partner ? partner.name : "",
      product: product.name,
      unit: product.unit,
      location: location?.name || "",
      ...estimate,
      createdBy: actor,
      source: body.source || "dashboard",
      status: body.status || "Draft"
    });

    const response = sendJson(res, 201, receipt);
    triggerCriticalManagementAlert({
      trigger: "receipt-created",
      actor
    });
    return response;
  } catch (error) {
    console.error("Failed to create receipt:", error.message);
    return sendJson(res, 400, { error: error.message || "Nu am putut salva receptia." });
  }
}

async function updateReceiptStatusHandler(req, res, id) {
  const body = getBody(req);

  try {
    const receipt = await updateReceiptStatusWithAudit(id, body.status, {
      ...body,
      changedBy: getActorLabel(req)
    });

    if (!receipt) {
      return sendJson(res, 404, { error: "Receptia nu a fost gasita." });
    }

    const response = sendJson(res, 200, receipt);
    triggerCriticalManagementAlert({
      trigger: "receipt-status-updated",
      actor: getActorLabel(req)
    });
    return response;
  } catch (error) {
    console.error("Failed to update receipt status:", error.message);
    return sendJson(res, 500, { error: "Nu am putut actualiza statusul." });
  }
}

async function closeReceiptHandler(req, res, id) {
  try {
    const receipt = await closeReceipt(id, {
      ...getBody(req),
      changedBy: getActorLabel(req),
      currentUser: req.currentUser || {}
    });
    if (!receipt) {
      return sendJson(res, 404, { error: "Receptia nu a fost gasita." });
    }
    triggerCriticalManagementAlert({ trigger: "receipt-closed", actor: getActorLabel(req) });
    return sendJson(res, 200, receipt);
  } catch (error) {
    console.error("Failed to close receipt:", error.message);
    return sendJson(res, 400, { error: error.message || "Nu am putut inchide receptia." });
  }
}

async function reopenReceiptHandler(req, res, id) {
  try {
    const receipt = await reopenReceipt(id, {
      ...getBody(req),
      changedBy: getActorLabel(req),
      currentUser: req.currentUser || {}
    });
    if (!receipt) {
      return sendJson(res, 404, { error: "Receptia nu a fost gasita." });
    }
    triggerCriticalManagementAlert({ trigger: "receipt-reopened", actor: getActorLabel(req) });
    return sendJson(res, 200, receipt);
  } catch (error) {
    console.error("Failed to reopen receipt:", error.message);
    return sendJson(res, 400, { error: error.message || "Nu am putut redeschide receptia." });
  }
}

async function completeWeighingHandler(req, res, id) {
  const body = getBody(req);
  const tareWeight = Number(body.tareWeight);
  try {
    const receipts = await listReceipts();
    const receipt = (receipts || []).find((item) => item.id === Number(id));
    if (!receipt) {
      return sendJson(res, 404, { error: "Receptia nu a fost gasita." });
    }
    if (receipt.status !== "In descarcare") {
      return sendJson(res, 400, { error: "Receptia nu este in descarcare." });
    }
    const grossWeight = Number(receipt.grossWeight || 0);
    if (!Number.isFinite(tareWeight) || tareWeight <= 0 || tareWeight >= grossWeight) {
      return sendJson(res, 400, { error: "Tara trebuie sa fie mai mica decat masa bruta." });
    }
    const netWeightKg = Math.max(grossWeight - tareWeight, 0);
    const quantityTons = netWeightKg / 1000;

    const config = await getConfig();
    const product = config.products.find(
      (item) => item.id === Number(receipt.productId) || item.name === receipt.product
    );
    const partner = config.partners.find((item) => item.id === Number(receipt.supplierId));
    const fiscalProfile = config.fiscalProfiles.find((item) => item.name === partner?.fiscalProfile);

    const estimate = computeReceiptEstimate({
      quantity: quantityTons,
      price: Number(receipt.price || 0),
      humidity: Number(receipt.humidity || 0),
      impurity: Number(receipt.impurity || 0),
      product: product || { humidityNorm: 0, impurityNorm: 0 },
      tariffs: config.tariffs,
      fiscalProfile
    });

    const updated = await completeReceiptWeighing(id, {
      tareWeight,
      netWeight: netWeightKg,
      quantity: quantityTons,
      ...estimate,
      photos: body.photos,
      changedBy: getActorLabel(req)
    });
    return sendJson(res, 200, updated);
  } catch (error) {
    console.error("Failed to complete receipt weighing:", error.message);
    return sendJson(res, 400, { error: error.message || "Nu am putut finaliza cantarirea." });
  }
}

module.exports = {
  closeReceiptHandler,
  completeWeighingHandler,
  createReceiptHandler,
  healthHandler,
  listReceiptsHandler,
  reopenReceiptHandler,
  updateReceiptStatusHandler,
  // expuse pentru teste (filtrare financiara dupa capabilitate)
  stripReceiptFinancials,
  stripFinancialStats
};
