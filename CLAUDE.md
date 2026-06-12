# CLAUDE.md — AgroProfit+ (Soft Elevator)

Instrucțiuni pentru Claude Code. Citește-le înainte de ORICE modificare.

## Ce este
ERP pentru o stație de cereale (elevator): recepție marfă, procesare (uscare/curățare),
stoc pe locații și cilindri, livrări + facturare, financiar (achitări/încasări),
reclamații, rapoarte. Are interfață web + bot Telegram.

## Stack
- Node.js + Express (backend) + Telegraf (bot Telegram)
- Frontend „vanilla" (fără framework): `public/index.html`, `public/app.js` (~5000+ linii), `public/styles.css`
- Persistență: Supabase (KV) în producție; fișiere JSON local
- Hosting: Vercel (serverless) → https://agroprofit-plus.vercel.app

## Pornire locală
```bash
npm install
# pune fișierul .env în rădăcină (primit privat) — NU îl comite NICIODATĂ
npm run dev          # aplicația WEB pe http://localhost:3000
```
- `npm start` pornește **doar botul de Telegram** (`src/bot-only.js`), nu aplicația web.
- `npm run start:server` = serverul web fără watch.
- `npm test` = testele (`node --test`).

## Structura
- `src/server.js` — serverul web + rutele API.
- `src/*-handlers.js` — logica pe module: `receipt`, `delivery`, `processing`, `complaint`,
  `transaction`, `opening`, `report`, `stock`, `user`, `config`, `audit`, `security`, `automation`.
- `src/local-storage.js` — magazia de date în memorie + starea implicită (`defaultReceiptsState`) + `nextId()`.
- `src/supabase-state-kv.js`, `src/supabase-storage.js`, `src/storage.js` — persistența.
- `src/auth.js`, `src/security.js`, `src/permissions.js` — autentificare (parole scrypt), roluri, drepturi.
- `public/app.js` — tot frontend-ul (randare tabele, formulare, calcule afișate).

## Stocare (important)
- Toată starea „primară" e un singur blob JSON sub cheia KV `receipts`; nomenclatorul sub cheia `config`.
- În memorie sunt cache-uri care se reîncarcă din KV la fiecare cerere (`reloadFromKv`) — după ce scrii în KV, modificarea se vede imediat, fără redeploy.
- `STORAGE_DRIVER=supabase` → baza REALĂ. `STORAGE_DRIVER=local` → fișiere locale (pentru teste fără să atingi datele reale).

## ⚠️ Reguli de business care se sparg ușor (OBLIGATORIU de citit)

### 1. Unități: TONE intern, KG la formular
- Stocul / cilindrii / procesarea se țin intern în **TONE**.
- Formularele (recepție/livrare/procesare) primesc **KG**; frontend-ul împarte la 1000.

### 2. Prețul la facturare e DUAL, după monedă
- **MDL** → `priceLei` = **lei / KG**. Total = `kg × priceLei`.
- **Valută (EUR/USD/RON)** → `priceForeign` = **valută / TONĂ**. Total valută = `tone × priceForeign`; total lei = `× exchangeRate`.
- **Sursa unică de calcul: `deliveryInvoiceTotals()` din `public/app.js`.** Aceeași formulă e duplicată intenționat în `updateBillingPriceLei` (formularul live) și în backend la `createComplaint`. Dacă schimbi formula, schimb-o în TOATE.
- NU trata `priceLei` în valută ca lei/kg — a cauzat un bug de **1000×** (92 de milioane în loc de 92 de mii).

### 3. `contractPrice` e PER TONĂ
- Drum de bani SEPARAT (Achitări/Încasări + raport de management): `contractPrice × cantitate(tone)`.
- Nu adăuga `×1000` și nu-l atinge când repari matematica facturii.

### 4. Plată parțială / avans (Financiar)
- Backend-ul ține deja cumulativ + status automat: `paidAmount/paymentStatus` (recepții),
  `collectedAmount/collectionStatus` (livrări), `settledAmount/status` (datorii inițiale),
  `partnerAdvances` (plată în plus = avans). Când restul ajunge la 0 → „Achitat integral" automat.

### 5. „Sold inițial" (opening) — împărțit pe drepturi
- `opening` = ecran de scriere → **doar admin**.
- `opening-read` = citire solduri în Achitări/Încasări → manager + contabili + admin. Nu le reuni.

## Deploy
- **Push pe `main` → Vercel publică automat** pe agroprofit-plus.vercel.app (integrare Git activă).
- Lucrează pe o **ramură separată**, testează pe preview, apoi fă merge în `main`.
- NU comite `.env`.

## Înainte să spui „gata"
1. `npm test` trece.
2. `node --check` pe fișierele atinse.
3. Verifică impactul pe **fluxul de business** (mai ales regulile de mai sus): o schimbare la o
   formulă atinge tabelul, factura, financiarul și reclamațiile deodată.
4. Producția pornește în curând cu **date reale** — atenție la `STORAGE_DRIVER=supabase`.
