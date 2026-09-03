# Audit de performanță — AgroProfit+ (Soft Elevator)

**Data:** 19 august 2026
**Ramura:** `dev` — commit `80f87e5`
**Metodă:** audit complet al codului existent (arbore curat, nu diff), cu **măsurători reale** pe o stare sintetică realistă: 20.000 recepții / 16.000 livrări / 30.000 tranzacții / 8.000 procesări / 80.000 intrări audit (≈ 3 ani de exploatare).
**Context:** producția pornește cu date reale. Baza fiind acum goală, problemele de mai jos **nu se văd empiric** — sunt deduse din cod și confirmate prin măsurare.

---

## Rezumat executiv

Algoritmica din handlere **nu** e problema (CPU server: `getStats()` 29 ms, `getStockSummary()` 25 ms la 20.000 recepții).
Problema e **I/O-ul blobului unic** și **dimensiunea payload-urilor**.

### Volumul blobului `receipts` (măsurat)

| Volum | Blob total | din care `auditLogs` | `JSON.parse` | `JSON.stringify` |
|---|---|---|---|---|
| 1 sezon (4.000 recepții) | **12,2 MB** | 4,4 MB | 25 ms | 18 ms |
| 3 ani (20.000 recepții) | **60,9 MB** | 21,8 MB | 123 ms | 90 ms |

RSS după o singură parsare a blobului de 61 MB: **307 MB**.

### Sinteza severităților

| Severitate | Nr. | Esența |
|---|---|---|
| **Critical** | 5 | Egress Supabase necontrolat, pierdere de date la scrieri concurente, blob care atinge limitele platformei |
| **High** | 5 | Lipsă totală de paginare, randări O(n×m) în frontend |
| **Medium** | 10 | Recalculări duble, sortări ineficiente, caching static |
| **Low** | 5 | Loguri, payload-uri secundare |

> ⚠️ **C1–C5 și H1–H5 nu se manifestă gradual. Se vor manifesta TOATE SIMULTAN, în vârful primului sezon de recoltă.**

---

# CRITICAL

## C1. `reloadFromKv` descarcă TOT blobul la FIECARE cerere `/api/*`

**Unde:** `api/index.js:36-42` → `src/local-storage.js:478-486`

Wrapper-ul rulează `reloadFromKv()` înainte de orice rută, necondiționat, fără cache/TTL. Fiecare cerere = 2 `loadKv` (`receipts` + `config`) → întreg blobul trece prin rețea și prin `JSON.parse` **la fiecare click**.

Se aplică inclusiv la rute care nu ating starea: `/api/health` (`src/server.js:119`), `/api/auth/login` (`:120`), `/api/photos` (`:178`).

**Efect măsurat pe fluxul real:**
- `loadDashboard()` (`public/app.js:4823-4837`) lansează **13 cereri paralele** → 13 × blob
  - 1 sezon: **~158 MB egress pentru O SINGURĂ autentificare**
  - 3 ani: **~790 MB per autentificare**
- `refreshViewData()` (`public/app.js:7292-7331`) — 2-4 cereri la fiecare schimbare de tab
- După fiecare mutație se reîncarcă 5-6 liste (`public/app.js:8691`, `:9010`, `:7853`)

**Prag:** dureros de la ~2.000 recepții. La 3 operatori × ~40 salvări/zi, egress-ul depășește **cota Pro de 250 GB/lună în 2-3 săptămâni**.

**Soluție:**
1. Adaugă verificare de versiune: `select("updated_at").eq("key","receipts")` (câțiva octeți) înainte de a descărca `value`. Dacă e identic cu cel din cache → nu descărca. **Taie 90%+ din egress**, fără schimbarea modelului de consistență.
2. Listă de excludere în `api/index.js` pentru `/api/health`, `/api/photos`, `/api/auth/logout`.
3. Reîncarcă `config` separat de `receipts` (configul se schimbă de câteva ori pe an).

---

## C2. `/api/photos` reîncarcă tot blobul pentru fiecare miniatură

**Unde:** `src/server.js:178-190`, generat din `public/app.js:645-653` (`photosMini`)

Fiecare `<img src="/api/photos?path=...">` trece prin `reloadFromKv` doar ca să facă un redirect 302 către Supabase Storage. Tabelul de recepții pune până la 3 miniaturi pe rând.

**Efect:** un tabel cu 30 de rânduri cu poze = 90 cereri × 61 MB = **~5,5 GB egress pentru niște thumbnail-uri**.

**Prag:** imediat ce operatorii încarcă poze la recepție (funcționalitatea există deja).

**Soluție:** exclude `/api/photos` din `reloadFromKv` — nu atinge starea deloc (`src/photo-store.js:123-142`). **3 linii în `api/index.js`.**

---

## C3. Jurnalul de audit crește nelimitat ÎN ACELAȘI blob

**Unde:** `src/local-storage.js:36-46` (`auditLogs: []`), `:1099-1125` (`createAuditEntry`/`appendAuditLog`)

Fiecare mutație împinge o intrare cu `oldValue`/`newValue` (snapshot-uri complete) în `state.auditLogs`, parte din blobul `receipts`. Fără trunchiere, arhivare sau rotație.

**Măsurat:** la 20.000 recepții, `auditLogs` = **21,8 MB din 60,9 MB (36%)**. O treime din costul fiecărei citiri și scrieri e jurnal pe care nimeni nu-l citește — `renderAuditLogs` afișează **20 de rânduri** (`public/app.js:2925-2941`).

**Agravant:** `createAuditEntry` folosește `nextId(state.auditLogs)` (`:1105` → `:678-690`) — scanare liniară a TOATEI liste la fiecare intrare nouă (80.000 iterații la anul 3).

**Prag:** peste ~15.000 intrări de audit (≈ 4.000 recepții = un sezon).

**Soluție:** mută `auditLogs` sub cheie KV proprie (`audit-logs`, ideal `audit-YYYY-MM`), încărcată **lazy** doar în `listAuditLogs()`/`appendAuditLog()`, niciodată în `reloadFromKv`. Contorul de id → `state.documentSequences.audit`. **−36% din blobul fierbinte.**

---

## C4. Lost update: read-modify-write pe blob întreg, fără control de concurență

**Unde:** `src/supabase-state-kv.js:39-51` (`saveKv` = `upsert` necondiționat), `src/local-storage.js:488-508`

Secvență garantată să se întâmple în sezon, cu cântarul și contabilitatea lucrând simultan:

```
Operator A (instanța 1): reloadFromKv → v1 ; adaugă recepția #501 ; upsert(v1+A)
Contabil B (instanța 2): reloadFromKv → v1 ; adaugă plata #300  ; upsert(v1+B)   ← recepția #501 DISPARE
```

Nu există ETag, versiune, `WHERE updated_at = ...` sau lock. Ultimul care scrie suprascrie **tot** blobul.

**Agravant** pe Vercel Fluid Compute (implicit pentru Node): o instanță poate procesa cereri concurent. `reloadFromKv` înlocuiește `receiptsCache` global (`:484`) în timp ce alt handler ține deja referință la vechile array-uri prin `readReceiptsState()` (`:490`, spread superficial) → pierdere de scriere chiar în aceeași instanță.

**Prag:** de la 2 utilizatori simultani. **Cu date reale = pierdere de documente contabile.**

**Soluție:** coloană `version bigint` în `kv_storage`; în `saveKv`: `update ... where key = $1 and version = $2` cu `version+1`. La 0 rânduri afectate → re-citește, reaplică mutația, reîncearcă (2-3 ori). Handler-ele fiind funcții pure „citește state → mută → scrie", retry-ul se încapsulează în `writeReceiptsState`.

---

## C5. Blobul de 61 MB atinge limitele platformei

**Unde:** `vercel.json:4-6` (`maxDuration: 30`)

- **Memorie:** 307 MB RSS măsurat pentru o copie parsată. În `reloadFromKv` coexistă: textul răspunsului HTTP + obiectul nou parsat + cache-ul vechi → **2,5-3×, adică 700-900 MB**. Configurația implicită Vercel (1024 MB) e depășită. La 4-5 ani → **OOM sigur**.
- **Timp:** citire 61 MB + parse (123 ms) + serializare (90 ms) + upload 61 MB. Sub 30 s, dar cu marjă mică între regiuni.
- **Corpul cererii** la `upsert` de 61 MB prin gateway-ul Supabase → risc de respingere/timeout la scriere = **imposibilitatea de a mai salva ceva**.

**Prag:** ~8.000-10.000 recepții pentru degradare vizibilă; ~20.000 pentru risc real de eșec.

**Soluție:** C3 taie 36% imediat. Pe termen mediu — partiționare pe sezon: `receipts-2026`, `receipts-2027`, cu blobul „curent" mereu încărcat și cele istorice doar la cerere din rapoarte. Nu schimbă modelul KV.

---

# HIGH

## H1. Nicio rută de listare nu are paginare sau filtrare pe server

**Unde:** `src/server.js:304` (`/api/receipts`), `:393` (`/api/processings`), `:412` (`/api/transfers`), `:513` (`/api/transactions`), `:545` (`/api/deliveries`), `:591` (`/api/complaints`), `:643` (`/api/audit-logs`)

Payload-uri măsurate la 20.000 recepții:

| Rută | Payload |
|---|---|
| `/api/receipts` | **4,3 MB** |
| `/api/audit-logs` | **4,3 MB** |
| `/api/transactions` | 1,8 MB |
| `/api/deliveries` | 1,7 MB |

Frontend-ul filtrează după dată **local**, după ce a descărcat tot (`public/app.js:1828`, `:2476`, `:2660`). Filtrele implicite („de la 1 ale lunii", `:4805-4812`) reduc doar ce se DESENEAZĂ, nu ce se transferă.

**Prag:** peste ~3.000 înregistrări pe 4G rural se simte clar; peste 10.000 e inutilizabil pe tabletă.

**Soluție:** acceptă `?from=&to=&limit=` și aplică `filterByDateRange` (există deja: `src/local-storage.js:1278-1289`) pe server. Frontend-ul trimite deja aceste valori în filtre — trebuie doar puse în URL.

---

## H2. `loadAuditLogs()` descarcă tot jurnalul ca să afișeze 20 de rânduri

**Unde:** `public/app.js:4668-4680` → `renderAuditLogs` la `:2925-2927` (`.slice(0, 20)`)

**4,3 MB transferați pentru 20 de rânduri.** Apelat la login (`:4832`), la fiecare deschidere de tab „Acasă"/„Audit" (`:7341`, `:7343`) și după aproape fiecare mutație (`:7853`, `:8280`, `:8691`, `:8757`, `:9010`, `:9032`, `:9058`, `:9078`, `:9098`, `:9201`, `:9261`, `:9277`, `:9304`, `:9324`, `:9347`).

`renderDashFeed` folosește doar `.slice(0, 6)` (`:988`); `renderUserActivity` are nevoie de agregate, nu de rânduri brute.

**Soluție:** `/api/audit-logs?limit=200` (implicit) + endpoint separat de agregat pentru „Activitate utilizatori" (logica există deja într-un singur pass la `public/app.js:1349-1360` — se mută 1:1 în backend).

---

## H3. `renderOpenJournal` desenează TOATE recepțiile și TOATE livrările

**Unde:** `public/app.js:2858-2923`

Singurele filtre: statut de plată și partener — ambele goale implicit. **Fără limită de rânduri, fără filtru de perioadă** (spre deosebire de tabelul principal). Apelată din `loadReceipts()` (`:4434`) — deci **după fiecare salvare de recepție, procesare, plată, livrare**.

**Efect la 20.000 recepții:** ~100.000 noduri DOM construite ca un singur string `innerHTML` de ~5 MB. **Blocare de fir principal de ordinul secundelor, la fiecare salvare.**

**Prag:** peste ~2.000 rânduri (sute de ms); peste 8.000 = blocaj vizibil.

**Soluție:** aplică `withinDateRange` cu filtrele existente + limită la primele ~300 cu „arată mai multe".

---

## H4. O(n×m) în tabelul Financiar: `find` liniar pentru fiecare rând

**Unde:** `public/app.js:2440-2457` (`transactionReferenceStanding`), apelat la `:2501` în `.map()` din `renderTransactions`

```js
const r = (receiptsCache || []).find((x) => Number(x.id) === Number(item.receiptId));
```

Scanare liniară a întregului cache pentru fiecare rând, plus buclă imbricată peste `openingDocumentsCache` (`:2451-2454`).

**Măsurat** (doar lookup-ul, fără DOM), cu 20.000 recepții în cache:

| Rânduri randate | Timp |
|---|---|
| 300 (o lună) | **37 ms** |
| 3.000 (un an) | **321 ms** |
| 30.000 (tot) | **894 ms** |

**Soluție:** construiește o dată, la începutul `renderTransactions`, `new Map(receiptsCache.map(r=>[Number(r.id),r]))` și echivalentul pentru livrări; pasează-le la `transactionReferenceStanding`. **Exact tiparul deja folosit corect** la `buildReceiptHumidityIndex` (`:2596-2610`) și `renderUserActivity` (`:1349`).

---

## H5. `/api/receipts` calculează starea de două ori și agregă tot istoricul

**Unde:** `src/receipt-handlers.js:148`

```js
const [receipts, stats] = await Promise.all([listReceipts(), getStats()]);
```

`getStats()` (`src/local-storage.js:3899-3922`) apelează el însuși `listReceipts()` → alocarea FIFO plată-per-partener (`:1519-1557`, cu sortare per partener) rulează **de două ori**. Plus `listProcessings`, `listTransactions`, `listDeliveries`, `listComplaints`, **`listAuditLogs`**, `listPartnerAdvances`, `listTransfers` și `createStockSummary` peste tot istoricul — doar pentru cardurile de KPI din header.

**Soluție:** pasează `receipts` deja calculate în `getStats(receipts)`; scoate `listAuditLogs()` din `getStats` (folosită doar pentru `totalAuditLogs`/`recentAuditLogs`, calculabile cu un singur pass fără sortare).

---

# MEDIUM

## M1. Sortare cu `new Date()` în comparator — 2 alocări de obiect per comparație
`src/local-storage.js:1861, 1866, 1871, 1876, 1881, 1573, 1578, 3935`

`createdAt` e ISO 8601 → **comparabil lexicografic direct**.
**Măsurat pe 80.000 intrări:** `new Date()` = **28 ms** vs comparație de string = **2 ms** (14× mai lent). Cum `getStats()` sortează toate colecțiile → ~56 ms pierduți per cerere `/api/receipts`, degeaba.

**Soluție:** `(a, b) => (a.createdAt < b.createdAt ? 1 : a.createdAt > b.createdAt ? -1 : 0)`

## M2. `createStockSummary`: `filter().sort()` per livrare în ramura de rezervă
`src/local-storage.js:1000-1011`

Când locația primară nu acoperă cantitatea (normal după transferuri/procesări), se face `filter().sort()` pentru **fiecare** livrare.
**Măsurat** (16 locații × 5 produse): 16.000 livrări → 23 ms bun / **68 ms rău**; 50.000 → 70 ms / **192 ms**.

**Soluție:** pre-grupează `byLocation` într-un `Map<produs, rând[]>` și sortează o dată pe grup.

## M3. `getStockSummary()` recalculează listele deja calculate de apelant
`src/local-storage.js:4244-4251` (`getDailyReport`), `:4266-4273` (`getPeriodReport`), `:4646-4657` (`getDashboardSnapshot`)

Toate trei apelează în `Promise.all` atât `listReceipts()`/`listDeliveries()`/`listProcessings()` cât și `getStockSummary()` — care le reapelează intern (`:3924-3931`). Dublare completă, inclusiv alocarea FIFO și sortările din M1.

**Soluție:** folosește funcția pură cu argumente `createStockSummary(receipts, deliveries, ...)` (există deja la `:846`).

## M4. Cold start citește blobul de două ori
`src/local-storage.js:411-433` (`initStorage` din bootstrap, `src/server.js:667-671`), apoi imediat `api/index.js:36-42`. Plus `initAutomationState()` (`src/server.js:673-680`) = a treia rundă KV.
La 61 MB → **~122 MB descărcați înainte de prima cerere servită**.

**Soluție:** flag `lastLoadedAt` — `reloadFromKv` sare peste încărcare dacă `initStorage` tocmai a rulat în aceeași invocare.

## M5. `no-cache` pe fișiere statice de 500 KB
`vercel.json:14-33`

`app.js` (439 KB), `styles.css` (68 KB), `index.html` (122 KB), `i18n-ru.js` (13 KB) au toate `Cache-Control: no-cache`. Permite revalidare prin ETag (octeții nu se re-descarcă), dar impune **4 dus-întors condiționale la fiecare încărcare** — pe 4G rural, **400-1200 ms de latență pură** înainte de pornirea aplicației.

**Soluție:** `no-cache` **doar** pe `/` și `/index.html`; parametru de versiune în `public/index.html:2515-2516` (`/app.js?v=<hash-commit>`) + `Cache-Control: public, max-age=31536000, immutable` pe restul. Se păstrează garanția „aceleași date de oriunde" (motivul commit-ului `80f87e5`) fără costul de revalidare.

## M6. Combobox-ul de furnizori reconstruiește toată lista la fiecare tastă
`public/app.js:3245-3270`, atașat la `input` la `:7423-7432`

Ramura fără interogare taie la 50 (`:3250`), dar ramura **cu** interogare nu are limită. `normalizeComboText` (`:3214-3220`) rulează pe fiecare partener, la fiecare tastă.
**Măsurat cu 3.000 parteneri, interogare „a":** 2,2 ms filtrare + **285 KB HTML / 3.000 `<li>` reconstruite per tastă**. Pe tableta de la cântar → lag vizibil.

**Soluție:** pre-calculează `s._norm` o dată la `loadConfig()`; adaugă `.slice(0, 50)` și pe ramura filtrată.

## M7. Muncă „fire-and-forget" după trimiterea răspunsului, pe serverless
`src/critical-alerts.js:359-363`, apelat din `src/receipt-handlers.js:262, 288, 312, 330`

`triggerCriticalManagementAlert` pornește o promisiune **după** `sendJson`. Pe Vercel, `api/index.js:44-62` se rezolvă la `res.on("finish")` și instanța îngheață → munca e abandonată la mijloc (posibil în timpul unui `appendAuditLog`, `src/critical-alerts.js:204`).

**Atenuant:** pe Vercel `startBot` nu se apelează (`src/server.js:699-707`), deci `isBotReady()` iese devreme. **Dar** în procesul bot (`npm start`), unde botul E gata, `loadManagementSnapshot` (`:126-145`) rulează `getDailyReport` + `listReceipts` + `listDeliveries` + `listComplaints` + `listAuditLogs` la **fiecare creare/schimbare de status de recepție**.

**Soluție:** mută `isBotReady()` în `triggerCriticalManagementAlert` înainte de orice `await`; adaugă throttle (max o dată pe minut).

## M8. `exportResourceAsCsv` construiește tot CSV-ul ca un singur string
`src/local-storage.js:4714-4739` — `rows.map(...).join("\n")` peste toate înregistrările. La 20.000 recepții → ~3 MB string + array intermediar de 20.000 string-uri, **peste cele 307 MB deja ocupate de blob**. Pe `audit-logs` (80.000 rânduri) e mai rău.

**Soluție:** `res.write` pe bucăți de 1.000 rânduri, nu `res.end(csv)` la final.

## M9. Telegraf este încărcat în bundle-ul web
`src/server.js:7` (`require("./bot")`) → `src/bot.js:1` (`require("telegraf")`)

Botul nu pornește niciodată pe Vercel, dar modulul și dependențele lui sunt evaluate la fiecare cold start. Se importă doar pentru `isBotReady`/`sendTelegramMessagesToAudience`.

**Soluție:** `require("telegraf")` leneș, în interiorul lui `startBot()`.

## M10. `buildReceiptHumidityIndex()` construit de două ori per randare de livrări
`public/app.js:2669` (în `renderDeliveries`) și `:2757` (în `renderDeliveryTotals`, apelat din `renderDeliveries` la `:2736`). Un pass complet peste `receiptsCache`, dublat.

**Soluție:** pasează `waterIdx` ca argument la `renderDeliveryTotals`.

---

# LOW

- **L1.** `api/index.js:1` și `:20` — `console.log` la încărcarea modulului (enumerează cheile de mediu) și la fiecare invocare. Volum de loguri Vercel proporțional cu traficul.
- **L2.** `public/m/mini.js:485-492` — mini-app-ul Telegram descarcă 7 colecții la pornire: **~12 MB la anul 3, pe telefon, pe date mobile**. Beneficiază automat de H1.
- **L3.** `src/local-storage.js:4194-4204` — `getConfig()` trimite tot nomenclatorul (parteneri, vehicule, `labReports`, câmpuri). La 3.000 parteneri + istoric de buletine, payload > 1 MB, retransmis la fiecare `loadConfig()`.
- **L4.** `src/photo-store.js:77-85` — `ensureBucket` apelează `createBucket` o dată per instanță rece; un apel Supabase în plus după fiecare cold start.
- **L5.** `src/local-storage.js:1152` — `allocateDocumentNumber` face `find` liniar pe `state.transactions` la fiecare tipărire de ordin de plată. ~1 ms, acceptabil.

---

# ✅ Zone care sunt ÎN REGULĂ (verificate explicit)

- **Debounce-ul + `flushAndWait` funcționează corect.** `queueSave` (`src/supabase-state-kv.js:57-61`) folosește un `Map` pe cheie → N apeluri `writeReceiptsState` într-o cerere produc **o singură** scriere KV. `flushPendingWrites` (`api/index.js:65-71`) golește înainte de îngheț. **Nicio scriere în buclă.**
- **`reassignPartnerReferences`** (`src/local-storage.js:3662-3768`) — fiecare colecție parcursă o dată, o singură scriere la final. Corect.
- **Nicio citire duplicată de blob într-o cerere.** `readReceiptsState()`/`readConfigState()` lucrează pe cache-ul din memorie.
- **`readConfigState()` nu re-persistă la citiri repetate** — verificat empiric (200 apeluri `getConfig()` = 6 ms total). Normalizările din `:510-620` sunt idempotente.
- **Autentificarea e stateless** (HMAC, `src/auth.js:166-190`, `:338-363`) — zero citiri de stare per cerere. Corect pentru serverless.
- **Frontend-ul folosește delegare de evenimente**, nu listeners per rând. **Nicio scurgere de listeners la re-randare.**
- **`listReceipts()`** (`src/local-storage.js:1511-1573`) folosește `Map`-uri pentru FIFO — O(n log n), nu O(n²). Bine scrisă.
- **`renderUserActivity`** (`public/app.js:1349-1360`) — un singur pass peste jurnal. Tiparul corect, de replicat în H4.
- **CPU-ul serverului nu e strangularea.** La 20.000 recepții: `getStats()` 29 ms, `getStockSummary()` 25 ms, `getDailyReport()` 25 ms, `getSupplierStatement()` 2 ms.
- **Botul și planificatoarele nu pornesc pe Vercel** (`src/server.js:699-707`, sub `require.main === module`). Corect.
- **`app.get("*")`** (`src/server.js:661`) nu se atinge pe Vercel — `vercel.json:10` rutează doar `/api/:match*`.

---

# 🎯 Ordinea recomandată de atac, ÎNAINTE de producție

| # | Problemă | Efort | Câștig |
|---|---|---|---|
| 1 | **C2** — exclude `/api/photos` + `/api/health` din `reloadFromKv` | 3 linii | Elimină cel mai mare risc de cost |
| 2 | **C1** — verificare `updated_at` înainte de a descărca `value` | mic | **−90% egress** |
| 3 | **C4** — versiune optimistă + retry pe `saveKv` | mediu | **Previne pierderea de date** |
| 4 | **C3** — `auditLogs` sub cheie proprie | mediu | **−36% blob fierbinte** |
| 5 | **H1 + H2** — paginare/interval pe listări; limită pe `/api/audit-logs` | mediu | −95% payload |
| 6 | **H3 + H4** — limită în `renderOpenJournal`; `Map` în `renderTransactions` | mic | Elimină blocajele de UI |

> **C4 nu e o problemă de performanță, ci de integritate a datelor.** De la 2 utilizatori simultani se pot pierde documente contabile. Are prioritate peste orice optimizare de viteză.
