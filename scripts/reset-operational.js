#!/usr/bin/env node
// Reset operațional AgroProfit+
// Golește cheia KV `receipts` (toate tranzacțiile operaționale) la starea implicită,
// cu lastId=0. NU atinge `config` (nomenclator/utilizatori) și nici `automation-state`
// (legături Telegram + flag-uri de raportare).
//
// Întâi face BACKUP la toate cheile KV, abia apoi (cu --apply) scrie.
//
//   node scripts/reset-operational.js                       # DRY-RUN: backup + arată ce s-ar șterge
//   node scripts/reset-operational.js --apply --confirm=<ref>  # chiar golește `receipts`

require("dotenv").config();
const fs = require("fs");
const path = require("path");

const APPLY = process.argv.includes("--apply");
const confirmArg = (process.argv.find((a) => a.startsWith("--confirm=")) || "").split("=")[1];

const driver = (process.env.STORAGE_DRIVER || "local").trim().toLowerCase();
if (driver !== "supabase") {
  console.error(
    `STORAGE_DRIVER="${driver}" — acest reset țintește baza Supabase reală.\n` +
      `Setează STORAGE_DRIVER=supabase în .env și rulează din nou.`
  );
  process.exit(1);
}

// Ref-ul proiectului din SUPABASE_URL (https://<ref>.supabase.co) — folosit drept
// token de confirmare, ca să nu poți goli din greșeală baza greșită.
const projectRef = ((process.env.SUPABASE_URL || "").match(/https:\/\/([^.]+)\./) || [])[1] || "";

if (APPLY && confirmArg !== projectRef) {
  console.error(
    `\nConfirmare lipsă/greșită. Ținta este Supabase ref: "${projectRef}".\n` +
      `Ca să golești cheia 'receipts' pe ACEASTĂ bază, rulează:\n` +
      `   node scripts/reset-operational.js --apply --confirm=${projectRef}\n`
  );
  process.exit(1);
}

const { loadKv, saveKv, flushAndWait } = require("../src/supabase-state-kv");
const { defaultReceiptsState } = require("../src/local-storage");

const OPERATIONAL_BUCKETS = [
  ["openingDocuments", "solduri inițiale"],
  ["receipts", "recepții"],
  ["processings", "procesări"],
  ["transactions", "financiar/transferuri"],
  ["deliveries", "livrări"],
  ["complaints", "reclamații"],
  ["auditLogs", "audit"],
  ["partnerAdvances", "avansuri parteneri"]
];

function counts(state) {
  if (!state || typeof state !== "object") return {};
  const out = {};
  for (const [key, label] of OPERATIONAL_BUCKETS) {
    out[label] = Array.isArray(state[key]) ? state[key].length : 0;
  }
  out["lastId"] = state.lastId ?? 0;
  return out;
}

async function main() {
  console.log(`\nAgroProfit+ reset operațional  (${APPLY ? "APPLY" : "DRY-RUN"})`);
  console.log(`Supabase: ${process.env.SUPABASE_URL}\n`);

  // 1) Citește toate cheile KV
  const [receipts, config, automation] = await Promise.all([
    loadKv("receipts", null),
    loadKv("config", null),
    loadKv("automation-state", null)
  ]);

  // 2) BACKUP (mereu, chiar și la dry-run)
  const ts = new Date().toISOString().replace(/[:.]/g, "-");
  const backupDir = path.join(__dirname, "..", ".runtime-data-backups");
  fs.mkdirSync(backupDir, { recursive: true });
  const backupFile = path.join(backupDir, `kv-backup-before-reset-${ts}.json`);
  // mod 0o600: backup-ul conține și `config` (hash-uri de parole) — doar owner.
  fs.writeFileSync(
    backupFile,
    JSON.stringify({ receipts, config, "automation-state": automation }, null, 2),
    { mode: 0o600 }
  );

  // Validează backup-ul ÎNAINTE de scrierea distructivă: trebuie să existe, să fie
  // JSON valid și să conțină `receipts` real (nu null dintr-o citire eșuată).
  const verified = JSON.parse(fs.readFileSync(backupFile, "utf8"));
  if (!verified.receipts || typeof verified.receipts !== "object") {
    console.error(
      `\nBackup invalid sau citire 'receipts' eșuată (a venit null).\n` +
        `Nu continui — baza nu se atinge. Verifică conexiunea Supabase și reia.\n`
    );
    process.exit(1);
  }
  console.log(`Backup salvat → ${backupFile}\n`);

  // 3) Arată ce conține `receipts` acum (ce s-ar șterge)
  console.log("Conținut actual `receipts` (se golește):");
  const before = counts(receipts);
  for (const [label, n] of Object.entries(before)) {
    console.log(`   ${label.padEnd(22)} ${n}`);
  }

  console.log("\nNeatins:");
  console.log(
    `   config (nomenclator/utilizatori): ${config ? "păstrat" : "lipsă (nimic de păstrat)"}`
  );
  console.log(
    `   automation-state (Telegram/rapoarte): ${automation ? "păstrat" : "lipsă"}`
  );

  if (!APPLY) {
    console.log("\nDRY-RUN — nu s-a scris nimic. Rulează cu --apply pentru a goli `receipts`.\n");
    return;
  }

  // 4) APPLY: scrie starea implicită goală în `receipts`
  const fresh = JSON.parse(JSON.stringify(defaultReceiptsState));
  await saveKv("receipts", fresh);
  await flushAndWait();

  // 5) Verificare: recitește
  const after = await loadKv("receipts", null);
  console.log("\n✓ APLICAT. `receipts` după reset:");
  for (const [label, n] of Object.entries(counts(after))) {
    console.log(`   ${label.padEnd(22)} ${n}`);
  }
  console.log("\nStocul pornește de la 0. config și automation-state rămân neatinse.\n");
}

main().catch((err) => {
  console.error("\nEȘUAT:", err.message);
  process.exit(1);
});
