const { createClient } = require("@supabase/supabase-js");

let supabaseClient = null;

function getSupabase() {
  if (supabaseClient) return supabaseClient;

  const url = (process.env.SUPABASE_URL || "").trim();
  const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();

  if (!url || !key || key === "replace_me") {
    throw new Error(
      "Supabase KV storage requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars."
    );
  }

  supabaseClient = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
  return supabaseClient;
}

async function loadKv(key, defaultValue) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("kv_storage")
    .select("value")
    .eq("key", key)
    .maybeSingle();

  if (error) {
    console.error(`KV load failed for "${key}":`, error.message);
    throw error;
  }

  return data?.value ?? defaultValue;
}

async function saveKv(key, value) {
  const supabase = getSupabase();
  const { error } = await supabase.from("kv_storage").upsert({
    key,
    value,
    updated_at: new Date().toISOString()
  });

  if (error) {
    console.error(`KV save failed for "${key}":`, error.message);
    throw error;
  }
}

let pendingSaves = new Map();
let saveTimer = null;
const SAVE_DEBOUNCE_MS = 250;

function queueSave(key, value) {
  pendingSaves.set(key, value);
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(flushSaves, SAVE_DEBOUNCE_MS);
}

async function flushSaves() {
  if (pendingSaves.size === 0) return;
  const entries = Array.from(pendingSaves.entries());
  pendingSaves = new Map();
  saveTimer = null;

  for (const [key, value] of entries) {
    try {
      await saveKv(key, value);
    } catch (error) {
      console.error(`Failed to flush KV save for "${key}":`, error.message);
    }
  }
}

async function flushAndWait() {
  if (saveTimer) {
    clearTimeout(saveTimer);
    saveTimer = null;
  }
  await flushSaves();
}

module.exports = {
  loadKv,
  saveKv,
  queueSave,
  flushAndWait
};
