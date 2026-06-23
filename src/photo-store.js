// Stocare fotografii (dovada informativa la receptii/livrari).
// Doua backend-uri, pe modelul STORAGE_DRIVER:
//   - local:    fisiere in .runtime-data/photos/<shard>/<uuid>.<ext>
//   - supabase: bucket privat "agro-photos" (Supabase Storage), URL semnat la citire
// In inregistrari (receipt/delivery) se salveaza DOAR calea (storedPath), niciodata binarul.
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const DRIVER = (process.env.STORAGE_DRIVER || "local").toLowerCase();
const USE_SUPABASE = DRIVER === "supabase";
const BUCKET = (process.env.SUPABASE_PHOTO_BUCKET || "agro-photos").trim();
const localDir = path.join(process.cwd(), ".runtime-data", "photos");
const SIGNED_URL_TTL = 3600; // secunde

const MIME_EXT = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/heic": "heic",
  "image/heif": "heif"
};

// Forma exacta a cailor pe care le generam noi: "<2 hex>/<uuid>.<ext>".
// Orice altceva (../, cai absolute etc.) e respins -> anti path-traversal.
const SAFE_PATH_RE = /^[0-9a-f]{2}\/[0-9a-f-]{36}\.(jpg|jpeg|png|webp|heic|heif)$/i;

function isImageMime(mime) {
  return typeof mime === "string" && Object.prototype.hasOwnProperty.call(MIME_EXT, mime.toLowerCase());
}

function isSafeStoredPath(p) {
  return typeof p === "string" && SAFE_PATH_RE.test(p);
}

let supabaseClient = null;
let bucketReady = false;

function getClient() {
  if (supabaseClient) return supabaseClient;
  const { createClient } = require("@supabase/supabase-js");
  const url = (process.env.SUPABASE_URL || "").trim();
  const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();
  if (!url || !key || key === "replace_me") {
    throw new Error("Supabase Storage necesita SUPABASE_URL si SUPABASE_SERVICE_ROLE_KEY.");
  }
  supabaseClient = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
  return supabaseClient;
}

async function ensureBucket(client) {
  if (bucketReady) return;
  // Idempotent: incercam sa-l cream; daca exista deja, ignoram eroarea.
  const { error } = await client.storage.createBucket(BUCKET, { public: false });
  if (error && !/exist|already/i.test(String(error.message || ""))) {
    console.warn(`createBucket("${BUCKET}"):`, error.message);
  }
  bucketReady = true;
}

// Salveaza un buffer de imagine. Intoarce storedPath (relativ, sigur).
async function savePhoto(buffer, mime) {
  if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
    throw new Error("Fisier gol.");
  }
  const normMime = String(mime || "").toLowerCase();
  if (!isImageMime(normMime)) {
    throw new Error("Se accepta doar imagini.");
  }
  const ext = MIME_EXT[normMime];
  const id = crypto.randomUUID();
  const shard = id.slice(0, 2);
  const storedPath = `${shard}/${id}.${ext}`;

  if (USE_SUPABASE) {
    const client = getClient();
    await ensureBucket(client);
    const { error } = await client.storage
      .from(BUCKET)
      .upload(storedPath, buffer, { contentType: normMime, upsert: false });
    if (error) throw new Error("Incarcare esuata: " + error.message);
  } else {
    const dir = path.join(localDir, shard);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(localDir, storedPath), buffer);
  }
  return storedPath;
}

// Rezolva o cale pentru afisare.
//   supabase -> { redirectUrl } (URL semnat, temporar)
//   local    -> { filePath } (cale absoluta pe disc)
async function resolvePhoto(storedPath) {
  if (!isSafeStoredPath(storedPath)) {
    throw new Error("Cale invalida.");
  }
  if (USE_SUPABASE) {
    const client = getClient();
    const { data, error } = await client.storage
      .from(BUCKET)
      .createSignedUrl(storedPath, SIGNED_URL_TTL);
    if (error || !data || !data.signedUrl) {
      throw new Error("Nu am putut genera URL-ul pozei.");
    }
    return { redirectUrl: data.signedUrl };
  }
  const filePath = path.join(localDir, storedPath);
  if (!fs.existsSync(filePath)) {
    throw new Error("Poza nu exista.");
  }
  return { filePath };
}

module.exports = { savePhoto, resolvePhoto, isSafeStoredPath, isImageMime };
