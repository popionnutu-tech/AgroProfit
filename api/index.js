console.log("[wrapper] api/[...path].js module loading. env keys:", Object.keys(process.env).filter(k => k.startsWith("SUPABASE") || k === "STORAGE_DRIVER" || k === "TELEGRAM_BOT_TOKEN").sort());

let app;
let bootstrapPromise;
let storage = null;

try {
  app = require("../src/server");
  bootstrapPromise = app.bootstrapPromise || Promise.resolve();
  storage = require("../src/storage");
  console.log("[wrapper] server module loaded.");
} catch (loadError) {
  console.error("[wrapper] FAILED to require server:", loadError && loadError.stack ? loadError.stack : loadError);
  app = null;
}

module.exports = async (req, res) => {
  console.log(`[wrapper] handler invoked for ${req.method} ${req.url}`);
  if (!app) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    return res.end(JSON.stringify({ error: "server module failed to load" }));
  }
  try {
    await bootstrapPromise;
  } catch (bootError) {
    console.error("[wrapper] bootstrap rejected:", bootError && bootError.stack ? bootError.stack : bootError);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    return res.end(JSON.stringify({ error: "bootstrap failed", details: String(bootError && bootError.message || bootError) }));
  }
  // Lasam Express sa trateze cererea, apoi asteptam finalul raspunsului.
  await new Promise((resolve) => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      resolve();
    };
    res.on("finish", finish);
    res.on("close", finish);
    try {
      app(req, res);
    } catch (handlerError) {
      console.error("[wrapper] app threw:", handlerError && handlerError.stack ? handlerError.stack : handlerError);
      if (!res.headersSent) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: "internal error" }));
      }
      finish();
    }
  });

  // CRITIC pe serverless: golim salvarile in asteptare in Supabase KV inainte ca
  // instanta sa fie inghetata, altfel scrierile (receptii/config) se pot pierde.
  if (storage && typeof storage.flushPendingWrites === "function") {
    try {
      await storage.flushPendingWrites();
    } catch (flushError) {
      console.error("[wrapper] flushPendingWrites failed:", flushError && flushError.message);
    }
  }
};
