require("dotenv").config();

const express = require("express");
const path = require("path");
const multer = require("multer");
const photoStore = require("./photo-store");
const { startBot } = require("./bot");
const {
  getCriticalAlertsStatusHandler,
  getCloseOfDayStatusHandler,
  runCriticalAlertsCheckHandler,
  runCloseOfDayHandler
} = require("./automation-handlers");
const { startCloseOfDayScheduler } = require("./close-of-day");
const { startCriticalAlertMonitor } = require("./critical-alerts");
const { attachCurrentUser, getActorLabel, requireAuth, requireRoles } = require("./auth");
const {
  changePasswordHandler,
  loginHandler,
  logoutHandler,
  meHandler,
  telegramLoginHandler
} = require("./auth-handlers");
const {
  createConfigEntryHandler,
  deletePartnerHandler,
  getConfigHandler,
  updateConfigEntryHandler,
  updateSystemSettingsHandler
} = require("./config-handlers");
const {
  createUserHandler,
  listUsersHandler,
  updateUserHandler
} = require("./user-handlers");
const {
  closeReceiptHandler,
  completeWeighingHandler,
  createReceiptHandler,
  healthHandler,
  listReceiptsHandler,
  reopenReceiptHandler,
  updateReceiptStatusHandler
} = require("./receipt-handlers");
const {
  createProcessingHandler,
  listProcessingsHandler,
  updateProcessingHandler
} = require("./processing-handlers");
const { getStockSummaryHandler } = require("./stock-handlers");
const {
  applyAdvanceHandler,
  createTransactionHandler,
  listPartnerAdvancesHandler,
  listTransactionsHandler,
  updateTransactionHandler
} = require("./transaction-handlers");
const { getDailyReportHandler } = require("./report-handlers");
const {
  createDeliveryHandler,
  listDeliveriesHandler,
  transitionDeliveryHandler,
  updateDeliveryHandler
} = require("./delivery-handlers");
const {
  createComplaintHandler,
  listComplaintsHandler,
  updateComplaintHandler
} = require("./complaint-handlers");
const { listAuditLogsHandler } = require("./audit-handlers");
const { listLockoutsHandler, unlockUsernameHandler } = require("./security-handlers");
const {
  createOpeningDocumentHandler,
  listOpeningDocumentsHandler
} = require("./opening-handlers");
const {
  exportResourceHandler,
  getDashboardHandler,
  getDeliveryDefaultsHandler,
  getReceiptDefaultsHandler
} = require("./report-extensions-handlers");
const storage = require("./storage");

const app = express();
const port = Number(process.env.PORT || 3000);

app.disable("x-powered-by");

app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  res.setHeader(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' https://telegram.org",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https:",
      "connect-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self' https://web.telegram.org https://t.me"
    ].join("; ")
  );
  next();
});

app.use(express.json({ limit: "1mb" }));
app.use("/api", attachCurrentUser);
app.use(express.static(path.join(process.cwd(), "public")));

app.get("/api/health", healthHandler);
app.post("/api/auth/login", loginHandler);
app.post("/api/auth/telegram", telegramLoginHandler);
app.post("/api/auth/logout", logoutHandler);
app.get("/api/auth/me", meHandler);
app.post("/api/auth/change-password", requireAuth, changePasswordHandler);

app.use("/api", requireAuth);

// --- Fotografii (dovada informativa la receptii/livrari) ---
// Upload multipart separat de express.json; doar imagini, max 8MB/poza, max 8 poze.
const photoUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024, files: 8 },
  fileFilter: (req, file, cb) => cb(null, photoStore.isImageMime(file.mimetype))
});

app.post(
  "/api/uploads",
  requireRoles(["operator", "manager", "admin"]),
  (req, res, next) => {
    photoUpload.array("photos", 8)(req, res, (err) => {
      if (err) {
        const msg =
          err.code === "LIMIT_FILE_SIZE"
            ? "Imagine prea mare (max 8MB)."
            : err.code === "LIMIT_FILE_COUNT"
              ? "Prea multe imagini (max 8)."
              : "Incarcare esuata.";
        return res.status(400).json({ error: msg });
      }
      next();
    });
  },
  async (req, res) => {
    try {
      const files = Array.isArray(req.files) ? req.files : [];
      if (!files.length) {
        return res.status(400).json({ error: "Nicio imagine primita." });
      }
      const paths = [];
      for (const file of files) {
        paths.push(await photoStore.savePhoto(file.buffer, file.mimetype));
      }
      return res.status(201).json({ paths });
    } catch (error) {
      console.error("Upload poze esuat:", error.message);
      return res.status(500).json({ error: error.message || "Incarcare esuata." });
    }
  }
);

// Servire poza (auth pe sesiune/Bearer). Supabase -> redirect la URL semnat; local -> fisier.
app.get("/api/photos", async (req, res) => {
  try {
    const resolved = await photoStore.resolvePhoto(String(req.query.path || ""));
    if (resolved.redirectUrl) {
      res.setHeader("Cache-Control", "private, max-age=3000");
      return res.redirect(302, resolved.redirectUrl);
    }
    res.setHeader("Cache-Control", "private, max-age=3600");
    return res.sendFile(resolved.filePath);
  } catch (error) {
    return res.status(400).json({ error: error.message || "Cale invalida." });
  }
});

// Citire solduri inițiale: rolurile cu finanțe le văd în Achitări/Încasări.
app.get(
  "/api/opening-documents",
  requireRoles(["manager", "accountant", "accountant-sef", "admin"]),
  listOpeningDocumentsHandler
);

// Introducerea/ștergerea „Sold inițial" rămâne strict la admin (Task 5.1).
app.post(
  "/api/opening-documents",
  requireRoles(["admin"]),
  createOpeningDocumentHandler
);

app.delete(
  "/api/opening-documents/:id",
  requireRoles(["admin"]),
  async (req, res) => {
    try {
      const removed = await storage.deleteOpeningDocument(req.params.id, {
        changedBy: req.currentUser?.name || req.currentUser?.username || "admin"
      });
      if (!removed) {
        return res.status(404).json({ error: "Documentul nu a fost gasit." });
      }
      return res.status(200).json({ ok: true });
    } catch (error) {
      console.error("Failed to delete opening document:", error.message);
      return res.status(400).json({ error: error.message || "Nu am putut sterge documentul." });
    }
  }
);

app.get("/api/config", getConfigHandler);

// Whitelist of entities that contabil / contabil-sef can create (read-only nomenclator)
const NOMENCLATOR_CREATE_ALLOWED = new Set(["partners", "products", "storageLocations", "tariffs", "vehicles", "labReports"]);

app.post("/api/config/:entity", async (req, res, next) => {
  const role = req.currentUser && req.currentUser.roleCode;
  if (role === "admin") return next();
  if ((role === "accountant" || role === "accountant-sef") && NOMENCLATOR_CREATE_ALLOWED.has(req.params.entity)) {
    return next();
  }
  if (!req.currentUser) return res.status(401).json({ error: "Autentificare necesara." });
  return res.status(403).json({ error: "Nu ai drepturi pentru aceasta operatiune." });
}, async (req, res) => {
  return createConfigEntryHandler(req, res, req.params.entity);
});

// Contabilul poate completa/valida furnizorii (parteneri) in nomenclator.
// Trebuie inregistrata INAINTE de ruta generica de mai jos.
app.patch(
  "/api/config/partners/:id",
  requireRoles(["accountant", "accountant-sef", "manager", "admin"]),
  async (req, res) => {
    return updateConfigEntryHandler(req, res, "partners", req.params.id);
  }
);

// Stergere partener cu reatribuire optionala a referintelor (merge duplicat) — doar admin.
// Inregistrata INAINTE de rutele generice de config.
app.delete(
  "/api/config/partners/:id",
  requireRoles(["admin"]),
  deletePartnerHandler
);

// PATCH/UPDATE remains admin-only
app.patch("/api/config/:entity/:id", requireRoles(["admin"]), async (req, res) => {
  return updateConfigEntryHandler(req, res, req.params.entity, req.params.id);
});

// Furnizor temporar adaugat rapid de operator la receptie (doar numele).
app.post(
  "/api/partners/quick-supplier",
  requireRoles(["operator", "manager", "admin"]),
  async (req, res) => {
    try {
      const partner = await storage.createQuickSupplier(req.body && req.body.name, getActorLabel(req));
      return res.status(201).json(partner);
    } catch (error) {
      console.error("Failed to create quick supplier:", error.message);
      return res.status(400).json({ error: error.message || "Nu am putut adauga furnizorul." });
    }
  }
);

app.patch("/api/system-settings", requireRoles(["admin"]), updateSystemSettingsHandler);

// Act de verificare pe furnizor (doar admin) — Etapa 7
app.get("/api/reports/supplier-statement", requireRoles(["admin"]), async (req, res) => {
  try {
    const { partnerId, from, to } = req.query;
    if (!partnerId) {
      return res.status(400).json({ error: "Selecteaza un furnizor." });
    }
    const statement = await storage.getSupplierStatement(partnerId, from, to);
    return res.status(200).json(statement);
  } catch (error) {
    console.error("Failed to build supplier statement:", error.message);
    return res.status(400).json({ error: error.message || "Nu am putut genera actul de verificare." });
  }
});

app.get("/api/users", requireRoles(["admin"]), listUsersHandler);
app.post("/api/users", requireRoles(["admin"]), createUserHandler);
app.patch("/api/users/:id", requireRoles(["admin"]), async (req, res) => {
  return updateUserHandler(req, res, req.params.id);
});

app.get(
  "/api/receipts",
  requireRoles(["operator", "manager", "accountant", "accountant-sef", "admin", "control"]),
  listReceiptsHandler
);

app.post("/api/receipts", requireRoles(["operator", "manager", "admin"]), createReceiptHandler);

app.patch("/api/receipts/:id/status", requireRoles(["operator", "manager", "admin"]), async (req, res) => {
  return updateReceiptStatusHandler(req, res, req.params.id);
});

// Contabilul corecteaza DOAR furnizorul unei receptii (restul ramane blocat).
app.patch(
  "/api/receipts/:id/supplier",
  requireRoles(["accountant", "accountant-sef", "manager", "admin"]),
  async (req, res) => {
    try {
      const receipt = await storage.updateReceiptSupplier(
        req.params.id,
        req.body && req.body.supplierId,
        getActorLabel(req)
      );
      return res.status(200).json(receipt);
    } catch (error) {
      console.error("Failed to change receipt supplier:", error.message);
      return res.status(400).json({ error: error.message || "Nu am putut schimba furnizorul." });
    }
  }
);

// Cantar in 2 pasi: a doua cantarire (tara) finalizeaza receptia "In descarcare".
app.patch(
  "/api/receipts/:id/complete-weighing",
  requireRoles(["operator", "manager", "admin"]),
  async (req, res) => {
    return completeWeighingHandler(req, res, req.params.id);
  }
);

app.post("/api/receipts/:id/close", requireRoles(["manager", "admin"]), async (req, res) => {
  return closeReceiptHandler(req, res, req.params.id);
});

app.post("/api/receipts/:id/reopen", requireRoles(["manager", "admin"]), async (req, res) => {
  return reopenReceiptHandler(req, res, req.params.id);
});

app.get(
  "/api/processings",
  requireRoles(["operator", "manager", "accountant", "accountant-sef", "admin", "control"]),
  listProcessingsHandler
);

app.post("/api/processings", requireRoles(["operator", "manager", "admin"]), createProcessingHandler);

app.patch("/api/processings/:id", requireRoles(["operator", "manager", "admin"]), async (req, res) => {
  return updateProcessingHandler(req, res, req.params.id);
});

app.get(
  "/api/stocks",
  requireRoles(["operator", "manager", "accountant", "accountant-sef", "admin", "control"]),
  getStockSummaryHandler
);

// Transfer de produs intre cilindri (mutare stoc).
app.get(
  "/api/transfers",
  requireRoles(["operator", "manager", "accountant", "accountant-sef", "admin", "control"]),
  async (_req, res) => {
    try {
      const transfers = await storage.listTransfers();
      return res.status(200).json({ transfers });
    } catch (error) {
      console.error("Failed to list transfers:", error.message);
      return res.status(500).json({ error: "Nu am putut incarca transferurile." });
    }
  }
);

app.post(
  "/api/transfers",
  requireRoles(["operator", "manager", "admin"]),
  async (req, res) => {
    try {
      const transfer = await storage.createTransfer({
        ...req.body,
        operator: req.body && req.body.operator ? req.body.operator : getActorLabel(req),
        createdBy: getActorLabel(req)
      });
      return res.status(201).json(transfer);
    } catch (error) {
      console.error("Failed to create transfer:", error.message);
      return res.status(400).json({ error: error.message || "Nu am putut salva transferul." });
    }
  }
);

// Anulare transfer (admin/manager) — ramane in lista ca „Anulat", fara miscare de stoc.
app.post(
  "/api/transfers/:id/cancel",
  requireRoles(["manager", "admin"]),
  async (req, res) => {
    try {
      const transfer = await storage.cancelTransfer(req.params.id, {
        reason: req.body && req.body.reason,
        currentUser: req.currentUser || {},
        changedBy: getActorLabel(req)
      });
      if (!transfer) {
        return res.status(404).json({ error: "Transferul nu a fost gasit." });
      }
      return res.status(200).json(transfer);
    } catch (error) {
      console.error("Failed to cancel transfer:", error.message);
      return res.status(400).json({ error: error.message || "Nu am putut anula transferul." });
    }
  }
);

// Anulare receptie (admin/manager) — ramane in lista ca „Anulat", exclusa din stoc.
app.post(
  "/api/receipts/:id/cancel",
  requireRoles(["manager", "admin"]),
  async (req, res) => {
    try {
      const receipt = await storage.cancelReceipt(req.params.id, {
        reason: req.body && req.body.reason,
        currentUser: req.currentUser || {},
        changedBy: getActorLabel(req)
      });
      if (!receipt) {
        return res.status(404).json({ error: "Receptia nu a fost gasita." });
      }
      return res.status(200).json(receipt);
    } catch (error) {
      console.error("Failed to cancel receipt:", error.message);
      return res.status(400).json({ error: error.message || "Nu am putut anula receptia." });
    }
  }
);

// Editare comentariu pe un document (doar admin) — ex.: data reala a operatiei.
app.patch(
  "/api/documents/:entity/:id/note",
  requireRoles(["admin"]),
  async (req, res) => {
    try {
      const item = await storage.updateEntityNote(
        String(req.params.entity || ""),
        req.params.id,
        (req.body && req.body.note) || "",
        { currentUser: req.currentUser || {}, changedBy: getActorLabel(req) }
      );
      if (!item) {
        return res.status(404).json({ error: "Documentul nu a fost gasit." });
      }
      return res.status(200).json(item);
    } catch (error) {
      console.error("Failed to update note:", error.message);
      return res.status(400).json({ error: error.message || "Nu am putut salva comentariul." });
    }
  }
);

app.get(
  "/api/transactions",
  requireRoles(["manager", "accountant", "accountant-sef", "admin", "control"]),
  listTransactionsHandler
);

app.post(
  "/api/transactions",
  requireRoles(["manager", "accountant", "accountant-sef", "admin"]),
  createTransactionHandler
);

app.post(
  "/api/transactions/apply-advance",
  requireRoles(["manager", "accountant", "accountant-sef", "admin"]),
  applyAdvanceHandler
);

app.get(
  "/api/partner-advances",
  requireRoles(["manager", "accountant", "accountant-sef", "admin", "control"]),
  listPartnerAdvancesHandler
);

app.patch(
  "/api/transactions/:id",
  requireRoles(["manager", "accountant", "accountant-sef", "admin"]),
  async (req, res) => {
    return updateTransactionHandler(req, res, req.params.id);
  }
);

app.get(
  "/api/deliveries",
  requireRoles(["operator", "manager", "accountant", "accountant-sef", "admin", "control"]),
  listDeliveriesHandler
);

app.post("/api/deliveries", requireRoles(["operator", "manager", "admin"]), createDeliveryHandler);

app.patch("/api/deliveries/:id", requireRoles(["operator", "manager", "admin", "accountant", "accountant-sef"]), async (req, res) => {
  return updateDeliveryHandler(req, res, req.params.id);
});

app.post("/api/deliveries/:id/confirm", requireRoles(["operator", "manager", "admin"]), async (req, res) => {
  return transitionDeliveryHandler(req, res, req.params.id, "Confirmat");
});

app.post("/api/deliveries/:id/deliver", requireRoles(["operator", "manager", "admin"]), async (req, res) => {
  return transitionDeliveryHandler(req, res, req.params.id, "Livrat");
});

app.post("/api/deliveries/:id/close", requireRoles(["manager", "admin"]), async (req, res) => {
  return transitionDeliveryHandler(req, res, req.params.id, "Inchis");
});

app.post("/api/deliveries/:id/cancel", requireRoles(["manager", "admin"]), async (req, res) => {
  // Override admin/manager: anuleaza din orice status (inclusiv „Livrat"), cu motiv obligatoriu.
  try {
    const delivery = await storage.cancelDelivery(req.params.id, {
      reason: req.body && req.body.reason,
      currentUser: req.currentUser || {},
      changedBy: getActorLabel(req)
    });
    if (!delivery) {
      return res.status(404).json({ error: "Livrarea nu a fost gasita." });
    }
    return res.status(200).json(delivery);
  } catch (error) {
    console.error("Failed to cancel delivery:", error.message);
    return res.status(400).json({ error: error.message || "Nu am putut anula livrarea." });
  }
});

app.post("/api/deliveries/:id/reopen", requireRoles(["manager", "admin"]), async (req, res) => {
  return transitionDeliveryHandler(req, res, req.params.id, "Redeschis");
});

app.get(
  "/api/complaints",
  requireRoles(["manager", "accountant", "accountant-sef", "admin", "control"]),
  listComplaintsHandler
);

app.post(
  "/api/complaints",
  requireRoles(["manager", "accountant", "accountant-sef", "admin"]),
  createComplaintHandler
);

app.patch(
  "/api/complaints/:id",
  requireRoles(["accountant-sef", "accountant", "manager", "admin"]),
  async (req, res) => {
    return updateComplaintHandler(req, res, req.params.id);
  }
);

app.get(
  "/api/defaults/receipts",
  requireRoles(["operator", "manager", "admin"]),
  getReceiptDefaultsHandler
);

app.get(
  "/api/defaults/deliveries",
  requireRoles(["operator", "manager", "admin"]),
  getDeliveryDefaultsHandler
);

app.get(
  "/api/reports/dashboard",
  requireRoles(["manager", "accountant", "accountant-sef", "admin", "control"]),
  getDashboardHandler
);

app.get(
  "/api/exports/:resource",
  requireRoles(["manager", "accountant", "accountant-sef", "admin", "control"]),
  async (req, res) => {
    return exportResourceHandler(req, res, req.params.resource);
  }
);

app.get(
  "/api/reports/daily",
  requireRoles(["manager", "accountant", "accountant-sef", "admin", "control"]),
  getDailyReportHandler
);

app.get("/api/audit-logs", requireRoles(["manager", "admin"]), listAuditLogsHandler);
app.get("/api/security/lockouts", requireRoles(["admin"]), listLockoutsHandler);
app.post("/api/security/lockouts/:username/unlock", requireRoles(["admin"]), async (req, res) => {
  return unlockUsernameHandler(req, res, req.params.username);
});
app.get("/api/automation/close-of-day/status", requireRoles(["admin"]), getCloseOfDayStatusHandler);
app.post("/api/automation/close-of-day/run", requireRoles(["admin"]), runCloseOfDayHandler);
app.get("/api/automation/critical-alerts/status", requireRoles(["admin"]), getCriticalAlertsStatusHandler);
app.post("/api/automation/critical-alerts/check", requireRoles(["admin"]), runCriticalAlertsCheckHandler);

// Telegram Mini App SPA — serve its own index.html for any /m/* path
app.get("/m", (_req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "m", "index.html"));
});
app.get("/m/*", (_req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "m", "index.html"));
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "index.html"));
});

async function bootstrap() {
  console.log("[bootstrap] start. STORAGE_DRIVER=", process.env.STORAGE_DRIVER, "SUPABASE_URL set?", !!process.env.SUPABASE_URL);
  if (typeof storage.initStorage === "function") {
    const t0 = Date.now();
    await storage.initStorage();
    console.log(`[bootstrap] Storage initialized (driver: ${storage.storageDriver}) in ${Date.now() - t0}ms.`);
  }

  try {
    const { initAutomationState } = require("./automation-state");
    const t0 = Date.now();
    await initAutomationState();
    console.log(`[bootstrap] Automation state init OK in ${Date.now() - t0}ms.`);
  } catch (error) {
    console.error("[bootstrap] Automation state init failed:", error.message);
  }

  if (typeof storage.runMigrationIfNeeded === "function") {
    try {
      const result = storage.runMigrationIfNeeded();
      if (result?.migrated) {
        console.log(`Migrare aplicata: ${result.version}`);
      }
    } catch (error) {
      console.error("Migration error at boot:", error.message);
    }
  }
}

const bootstrapPromise = bootstrap().catch((error) => {
  console.error("Bootstrap failed:", error && error.stack ? error.stack : error);
  throw error;
});

if (require.main === module) {
  bootstrapPromise.then(() => {
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
      startBot(process.env.TELEGRAM_BOT_TOKEN);
      startCloseOfDayScheduler();
      startCriticalAlertMonitor();
    });
  });
}

module.exports = app;
module.exports.bootstrapPromise = bootstrapPromise;
