console.log("[wrapper] api/[...path].js module loading. env keys:", Object.keys(process.env).filter(k => k.startsWith("SUPABASE") || k === "STORAGE_DRIVER" || k === "TELEGRAM_BOT_TOKEN").sort());

let app;
let bootstrapPromise;

try {
  app = require("../src/server");
  bootstrapPromise = app.bootstrapPromise || Promise.resolve();
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
  return app(req, res);
};
