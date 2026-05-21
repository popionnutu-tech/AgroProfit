require("dotenv").config();

const { startBot } = require("./bot");
const { startCloseOfDayScheduler } = require("./close-of-day");
const { startCriticalAlertMonitor } = require("./critical-alerts");
const storage = require("./storage");
const http = require("http");

const port = Number(process.env.PORT || 3000);

async function main() {
  if (typeof storage.initStorage === "function") {
    await storage.initStorage();
    console.log(`Storage initialized (driver: ${storage.storageDriver}).`);
  }

  try {
    const { initAutomationState } = require("./automation-state");
    await initAutomationState();
  } catch (error) {
    console.error("Automation state init failed:", error.message);
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

  startBot(process.env.TELEGRAM_BOT_TOKEN);
  startCloseOfDayScheduler();
  startCriticalAlertMonitor();

  // Minimal HTTP server so Railway healthcheck passes and the service stays alive
  const server = http.createServer((req, res) => {
    if (req.url === "/health" || req.url === "/api/health") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: true, role: "telegram-bot", storage: storage.storageDriver }));
      return;
    }
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("This Railway service runs only the Telegram bot. Dashboard lives on Vercel.");
  });

  server.listen(port, () => {
    console.log(`Bot service listening on port ${port} (Telegram polling active).`);
  });
}

main().catch((error) => {
  console.error("Bot service failed to start:", error);
  process.exit(1);
});
