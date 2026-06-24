// Stocare fotografii (dovada informativa la receptii/livrari).
// Doua backend-uri, pe modelul STORAGE_DRIVER:
//   - local:    fisiere in .runtime-data/photos/<shard>/<uuid>.<ext>
//   - supabase: bucket privat "agro-photos" (Supabase Storage), URL semnat la citire
// In inregistrari (receipt/delivery) se salveaza DOAR calea (storedPath), niciodata binarul.
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

// Citit la TIMPUL APELULUI (nu la incarcarea modulului) si cu .trim() — la fel ca
// local-storage.js:19 — fiindca pe Vercel STORAGE_DRIVER poate avea spatii/newline,
// altfel photo-store ar cadea pe disc local (read-only pe serverless) -> ENOENT.
function useSupabase() {
  return (process.env.STORAGE_DRIVER || "").trim().toLowerCase() === "supabase";
}
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

// Detecteaza tipul REAL al imaginii din primii octeti (magic bytes) — nu ne bazam
// pe Content-Type-ul declarat de client, care poate fi falsificat.
function sniffImageMime(buffer) {
  if (!Buffer.isBuffer(buffer) || buffer.length < 12) return null;
  const b = buffer;
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "image/jpeg";
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return "image/png";
  if (
    b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 &&
    b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50
  ) return "image/webp";
  // HEIC/HEIF: box "ftyp" la offset 4, brand heic/heix/heif/hevc/mif1 la 8..12
  if (b[4] === 0x66 && b[5] === 0x74 && b[6] === 0x79 && b[7] === 0x70) {
    const brand = b.toString("ascii", 8, 12).toLowerCase();
    if (/heic|heix|hevc|heif|mif1|msf1/.test(brand)) return "image/heic";
  }
  return null;
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
  // Validam CONTINUTUL real (magic bytes), nu Content-Type-ul declarat de client.
  const realMime = sniffImageMime(buffer);
  if (!realMime) {
    throw new Error("Fisierul nu este o imagine valida.");
  }
  const ext = MIME_EXT[realMime];
  const id = crypto.randomUUID();
  const shard = id.slice(0, 2);
  const storedPath = `${shard}/${id}.${ext}`;

  if (useSupabase()) {
    const client = getClient();
    await ensureBucket(client);
    const { error } = await client.storage
      .from(BUCKET)
      .upload(storedPath, buffer, { contentType: realMime, upsert: false });
    if (error) {
      console.error("Supabase Storage upload:", error.message);
      throw new Error("Nu am putut incarca poza.");
    }
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
  if (useSupabase()) {
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
