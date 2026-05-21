const localStorage = require("./local-storage");

const storageDriver = (process.env.STORAGE_DRIVER || "local").toLowerCase();

// local-storage.js handles both file-based (STORAGE_DRIVER=local) and
// Supabase-backed (STORAGE_DRIVER=supabase) persistence internally —
// using the same in-memory cache + business logic in both cases.
module.exports = {
  ...localStorage,
  storageDriver
};
