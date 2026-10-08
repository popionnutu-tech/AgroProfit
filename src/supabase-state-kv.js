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

// Alocarea ATOMICA a numarului de act de achizitie, in PostgreSQL.
//
// Pana aici, numarul se deriva din blobul JSON (`max + 1`) si se scria cu upsert
// necondiționat — deci o scriere concurenta putea pierde incrementul si doua acte semnate
// ajungeau cu acelasi numar in dosarul fiscal. Verificarea de dupa scriere prindea cazul,
// dar nu il facea imposibil.
//
// Functia `allocate_purchase_act_number` ia un advisory lock pe firma, calculeaza urmatorul
// numar si il INSEREAZA intr-un tabel cu cheie primara (firma, numar). Lacatul serializeaza
// alocarile, iar cheia primara face duplicatul imposibil chiar daca lacatul ar fi ocolit.
//
// Intoarce `null` daca migrarea NU a fost aplicata inca — apelantul cade pe derivarea din
// blob, deci aplicatia merge si inainte de migrare.
async function allocateActNumber(companyId, series, receiptIds) {
  const supabase = getSupabase();
  const { data, error } = await supabase.rpc("allocate_purchase_act_number", {
    p_company_id: Number(companyId),
    p_series: String(series || ""),
    p_receipt_ids: Array.isArray(receiptIds) ? receiptIds.map(Number) : []
  });

  if (error) {
    // `42883` = functia nu exista (migrarea nu e aplicata). `PGRST202` = acelasi lucru, vazut
    // prin PostgREST. Orice ALTA eroare se propaga: o alocare esuata nu are voie sa cada
    // tacit pe metoda veche, mai slaba.
    const cod = String(error.code || "");
    const mesaj = String(error.message || "");
    if (cod === "42883" || cod === "PGRST202" || /could not find the function/i.test(mesaj)) {
      return null;
    }
    throw new Error(`Alocarea numarului de act a esuat: ${mesaj}`);
  }
  const numar = Number(data);
  return Number.isInteger(numar) && numar > 0 ? numar : null;
}

module.exports = {
  allocateActNumber,
  loadKv,
  saveKv,
  queueSave,
  flushAndWait
};
