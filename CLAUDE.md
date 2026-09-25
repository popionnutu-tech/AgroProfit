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

### 6. Retur / descărcare livrare (`Returnat`) — excepție DELIBERATĂ de drepturi
Cumpărătorul refuză marfa după ce camionul a fost încărcat și livrarea formată; marfa se
descarcă înapoi în locația de plecare (`returnDelivery`, buton „Descărcare" pe rândul livrării).
- Returul **scade `deliveredQuantity` + `netWeight`** — stocul se întoarce automat, pentru că
  `createStockSummary` scade exact `deliveredQuantity`. Nu adăuga o mișcare separată de stoc:
  ai dubla cantitatea. Același precedent ca `complaint.stockCorrection`.
- Retur integral → status `Returnat`; retur parțial → rămâne `Livrat`, cu cantitatea micșorată.
- `Returnat` **rămâne vizibil pentru toate rolurile**, spre deosebire de `Anulat`, care e ascuns
  prin `filterCanceledForRole`. Un retur e un eveniment real de business, nu o eroare de operare.
- **Excepția de drepturi:** returul e permis **operatorului** (el descarcă fizic camionul), deși
  regula generală din `assertStatusChangePermission` rezervă schimbarea statutului unui document
  confirmat („Livrat" ∈ `STATUS_CONFIRMED_PLUS`) managerului/adminului. E o decizie asumată —
  nu o „repara" ca pe un bug. Compensațiile: motiv obligatoriu, audit (`action: "return"`),
  document vizibil tuturor și listat în „Operațiuni anulate și retururi".
- Livrare **FACTURATĂ** → returul îl poate face doar **contabilul** (`CAN_RETURN_INVOICED_ROLES`),
  fiindcă rescrie aceeași factură la o sumă mai mică, cu același număr; el emite și storno-ul.
  Factura tipărită afișează un avertisment de retur. Operatorul și managerul nu pot.
- Livrare **NEFACTURATĂ** → invers: e descărcare fizică, deci o face operatorul/managerul.
  Contabilul e refuzat (`WAREHOUSE_ONLY_RETURN_ROLES`) — nu are `delivery-write`.
- Câmpurile de facturare se scriu doar cu `CAN_EDIT_BILLING_ROLES`. **Nu relaxa asta:** dacă
  operatorul poate goli `invoiceNumber`, ocolește în două cereri garda de mai sus.
- O livrare cu retur (total sau parțial) **nu mai poate fi anulată** — anularea i-ar ascunde
  urma pe rol și ar scoate mișcarea din raportul zilei în care s-a făcut.
- Livrare cu **ÎNCASĂRI active** → retur BLOCAT pentru toți. Nu e o regulă de drepturi, ci de
  corectitudine: cu `deliveredQuantity = 0` ținta devine 0, iar `recomputeReferenceSettlement`
  ar marca livrarea „Incasat" — banii primiți pe marfă întoarsă ar dispărea din Achitări/Încasări.
  Ordinea corectă: storno încasare întâi, retur după.
- `quantityAtDelivery` = marfa efectiv încărcată în camion; NU se atinge la retur. E citit de
  bonul de cântar, ca brut − tară = net să rămână adevărat pe documentul tipărit.
- **Istoricul nu se rescrie.** Rapoartele NU citesc `deliveredQuantity` direct (e micșorat de
  retur, deci ar schimba retroactiv ziua livrării). Folosesc `getDeliveryGrossQuantity()` =
  cât a ieșit efectiv atunci, iar returul intră ca mișcare separată la data lui, prin
  `listReturnMovements()`. Regula: **ziua livrării păstrează ieșirea brută; ziua descărcării
  primește intrarea.** Livrarea `Anulat` face excepție — n-a existat, deci zero pe ambele.

### 7. „Proiect" — documentul pregătit de contabil
Contabilul are nevoie de document înainte ca operatorul (care e la cântar) să apuce să-l
introducă. Îl creează în status **`Proiect`**.
- Regimul NU se ia din body: îl decide **rolul din sesiune** (`CAN_CREATE_DRAFT_ROLES`).
  Capabilitatea de interfață e `document-draft` — NU e drept de scriere pe stoc.
- Un proiect **nu intră în stoc, nu creează datorie, nu intră în KPI și nu e livrabil**.
  Sursa unică: `isReceiptInStock()` / `RECEIPT_STATUSES_OUT_OF_STOCK`. Folosește-o oriunde
  filtrai doar pe `"Anulat"` la recepții — altfel marfa nedescărcată apare ca fiind în depozit.
- **Regula care ține totul:** ce nu e în stoc nu se poate livra. `getReceiptAvailableQuantity`
  întoarce 0 pentru astfel de recepții, iar `createDelivery` dă eroare explicită. Fără asta,
  scăderea ar fi consumat marfa ALTOR recepții din aceeași locație (istoric: și din alte locații,
  prin cascada eliminată — vezi regula 8).
- `Proiect` se setează **doar la creare**. Un document existent nu se întoarce în proiect —
  altfel oricine cu drept de status ar scoate marfă din stoc lăsând documentul să pară în regulă.
- Livrarea-proiect are `deliveredQuantity = 0` **și `netWeight = 0`** (doar rezervare). Nu pune
  cantitate în `netWeight`: toate fallback-urile de tip `deliveredQuantity || netWeight` (facturi,
  creanțe, totaluri) ar reactiva-o și proiectul ar apărea ca marfă livrată.
- Operatorul o confirmă la cântar prin `Proiect → Livrat`, **direct**. `Proiect → Confirmat` e
  interzis intenționat: scotea documentul din verificarea de stoc și îl bloca pentru operator.
- **Verificarea de stoc se leagă de STAREA documentului, nu de tranziție.** Se compară cât mai
  iese acum (`netWeight − deliveredQuantity`) cu disponibilul. Dacă o legi de `currentStatus`,
  orice pas intermediar devine o poartă deschisă — exact așa s-a redeschis gaura o dată.
- `isDeliveryPendingStockExit()` e perechea lui `isReceiptInStock()` pentru livrări. Folosește-le
  peste tot unde numeri cantități sau bani; lipsa predicatului pentru livrări a fost cauza
  găurii, nu o scăpare punctuală.

### 8. Stoc negativ și corecția de inventar
- Stocul **NU se plafonează la zero**. Un minus înseamnă că s-a scos dintr-o locație mai mult
  decât a intrat vreodată. Plafonarea a ascuns luni la rând o diferență reală: „Stoc pe locație"
  arăta mai mult decât „Mișcarea stocului", fără ca cineva să poată spune de ce. **Nu o reintroduce.**
- În aceeași ordine de idei, scăderea unei livrări care nu încape în stoc **nu se aruncă** —
  se scade oricum, pe minus. Așa cele două ecrane coincid prin construcție.
- `stockCorrections` = adminul a NUMĂRAT fizic cilindrul și așază stocul la realitate
  (`createStockCorrection`). Diferența e o pierdere **recunoscută**: apare pe coloana
  „Corecții inventar" **în ambele ecrane** (raportul de pierderi ȘI „Mișcarea stocului pe
  perioadă") și intră în formulele lor. Motiv obligatoriu, urmă în audit, doar admin.
- **Orice ecran care numără stocul trebuie să numere și corecțiile.** Dacă adaugi un calcul
  nou și îl uiți, cele două ecrane încep să arate cifre diferite — exact ce interzice regula
  de mai sus. De aceea `createStockSummary` **aruncă** dacă nu primește `stockCorrections`:
  un apelant uitat trebuie să cadă zgomotos, nu să piardă tăcut datele.
- Corecția e **o pierdere recunoscută la o dată**, nu o „setare" permanentă. `delta` se
  calculează o singură dată, la creare, și rămâne un offset constant. Dacă introduci ulterior
  un document RETROACTIV pentru aceeași locație (o livrare uitată, o anulare, o editare de
  cantitate), pierderea se numără de două ori — corecția nu „se mută" sub el. În acel caz se
  face o a doua corecție, care se calculează față de stocul de atunci.
- Corecția nu inventează stoc: perechea locație+produs trebuie să existe deja, cantitatea
  numărată nu poate depăși capacitatea locației, iar o valoare lipsă sau invalidă e RESPINSĂ
  (nu tratată ca zero — zero înseamnă „golește cilindrul" și trebuie să fie o intenție).
- `delta` **nu se rotunjește**. Corecția trebuie să așeze stocul FIX pe cantitatea numărată.
  Rotunjirea la kg lăsa un rest (0,6 kg în cilindru, admin pune 0 → rămâneau −0,4 kg), adică
  un deficit fantomă, roșu pe ecran, exact pe instrumentul făcut ca să închidă deficite.
- Cantitățile din stoc se rotunjesc la **KILOGRAM**, la sursă (`createStockSummary`), nu la
  gram. Cântarul lucrează în kg și ambele ecrane afișează kg: dacă stocul păstrează fracțiuni,
  „Mișcarea stocului" (care rotunjește la afișare) arată −1 kg acolo unde „Stoc pe locații"
  arată −0,6 — aceeași realitate, două numere. Rotunjind la sursă, un rest sub jumătate de
  kilogram devine **zero curat** (inclusiv `-0`, normalizat cu `+ 0`), iar restul e identic
  în ambele tabele.
- **Fiecare locație își are cantitatea ei — fără „cascadă".** O livrare se scade DOAR din
  locația ei (`createStockSummary`), iar verificarea de stoc la livrare (inclusiv cea legată de
  o recepție) e tot pe acea locație. Cascada veche („dacă nu ajunge, ia din celelalte locații
  ale produsului") muta marfă între locații fără document și fără dată: returul livrării
  Nr. 47 din Cilindru 2 a făcut ca recepțiile de soia din gropile de primire (sept. 2026) să
  apară în Cilindru 2. Marfa se mută între locații **doar** prin transfer sau procesare.
  **Nu reintroduce cascada.**
- **Nu ascunde un rând negativ.** Se afișează tot ce nu e zero. Un minus ascuns rămâne fără
  butonul „Corectează" — vizibil în „Mișcarea stocului", imposibil de închis din „Stoc".

### 9. Plata pe masa cu umiditate (`payOnGrossQuantity`)
Când umiditatea depășește norma, înțelegerea poate fi ca furnizorul să fie plătit pe marfa
**cu apă**, la prețul convenit, iar uscarea să nu se taxeze. Marfa fizică rămâne aceeași:
apa tot se evaporă.
- **Stocul NU se atinge.** `provisionalNetQuantity` (masa fără apă) intră în cilindru exact ca
  înainte. Flagul schimbă DOAR banii. Dacă vreodată îl legi de stoc, ai inventat marfă care
  nu există — cântarul de la ieșire o va contrazice.
- Se pune la loc **doar apa**, nu și impuritățile: `payableQuantity =
  provisionalNetQuantity + estimatedWaterLoss`. **Nu folosi `grossQuantity`** — brutul
  conține și gunoiul peste normă, iar nimeni n-a convenit să plătească pământ ca marfă.
  Când impuritățile sunt în normă cele două formule coincid, deci greșeala nu se vede la
  primul test; se vede pe marfa murdară.
- `dryingServiceTotal` devine **0**. Merge împreună cu cele de mai sus: dacă plătești apa
  ca marfă, nu mai încasezi și uscarea ei.
- **Nu există prag de umiditate.** Bifa ESTE regula: dacă e pusă, se plătește marfa cu tot
  cu apă, oricât ar fi excesul; dacă nu e pusă, apa se scoate din calcul. Decizia e a omului,
  nu a unei constante. (A existat un prag de 4 p.p. — a fost scos deliberat, nu uitat.)
- Fiindcă nu există prag care să oprească o greșeală, apărarea e **confirmarea explicită**:
  la bifare aplicația arată excesul de umiditate și kilogramele de apă plătite ca marfă, iar
  omul trebuie să apese OK. Refuzul debifează. Debifarea nu cere confirmare — întoarcerea la
  regula obișnuită nu e o decizie de bani. Fereastra conține **doar ce e specific acestei
  decizii**: că în stoc intră masa fără apă e o regulă permanentă, nu ceva ce schimbă bifa,
  deci nu se repetă acolo.
- Textele din fereastră se traduc prin `bi()` pe **textul exact afișat, cu diacritice**.
  „Umiditate peste norma" și „Umiditate peste normă" sunt chei diferite în `i18n-ru.js` —
  o nepotrivire nu dă eroare, doar lasă textul netradus pentru operator.
- Fără apă în exces flagul **nu se înregistrează** (nu există ce pune înapoi), în backend și
  în frontend deopotrivă. Altfel ar rămâne recepții marcate „plătit cu apă" fără nicio apă.
- **Implicit e NEBIFAT** = comportamentul dinainte (plata pe masa fără apă). Așa o recepție
  veche, sau una unde nimeni n-a atins bifa, dă exact aceeași sumă ca înainte de regula asta.
- Formula e **duplicată** în `getReceiptEstimate` din `public/app.js` (vezi regula 2). Se
  schimbă în AMBELE locuri.
- Cantitatea pe care se calculează banii are o **sursă unică**: `receiptPayableTonnes()` din
  `src/local-storage.js`, folosită de valoarea recepției, de corecția manuală de sumă și de
  extrasul de cont al furnizorului. Oglinda ei în frontend e `actReceiptFigures()`. Când
  fiecare calcula pe cont propriu, actul semnat de furnizor arăta o sumă mai mică decât
  datoria înregistrată, iar pe extras `cantitate × preț ≠ sumă`. Orice loc nou care
  înmulțește cantitate cu preț le folosește.
- Actul de achiziție se tipărește din **trei** locuri, cu **două** buildere:
  `buildPurchaseActHtml` (pagina „Documente tipar" — toate recepțiile unui furnizor dintr-o
  perioadă, un rând per recepție — și butonul de pe rândul recepției, pentru o singură
  recepție) și `buildPurchaseActPrintHtml` (din Livrări). Toate trec prin `actReceiptFigures` —
  al doilea builder a avut o clipă formula copiată inline și cele două acte ale aceleiași
  recepții au arătat cantități și prețuri unitare diferite, deși totalul coincidea. Nu o copia
  a treia oară.
- **„Total de plată" de pe act = datoria ÎNREGISTRATĂ** (`amountToPay` /
  `preliminaryPayableAmount`), nu o recalculare din cota de impozit de azi; reținerea rămâne
  diferența brut − net. Altfel apar două cifre pentru aceeași datorie: după ajustarea manuală
  a sumei (✎) prețul de pe recepție devine **lei/kg NET**, iar actul mai scădea o dată
  impozitul (56.400 lei plătiți, 53.016 lei pe actul semnat de furnizor). În plus, cota se
  poate schimba în nomenclator după recepție, iar reținerea e înghețată pe document.
- Firma emitentă se alege explicit (`select.doc-header-company`, pe Recepții, Livrări și
  „Documente tipar"). Cu mai multe firme în nomenclator, un act tipărit tăcut pe cea implicită
  iese pe persoana juridică greșită.
- Flagul se **persistă pe recepție**, nu se recalculează din context. Peste un an suma trebuie
  să rămână explicabilă; `receiptPayableValue` folosește aceeași bază la fallback.
- La cântarul în 2 pași flagul se citește de pe **recepție**, nu din body-ul celei de-a doua
  cântăriri — ca prețul și umiditatea. Înțelegerea se ia la intrare, nu la ieșirea de sub pod.
  Atenție: `ESTIMATE_FIELDS` din `completeReceiptWeighing` trece totul prin `sanitizeNumber`,
  deci flagul (boolean) **nu se pune în listă**.
- Tot la a doua cântărire, normele se citesc **de pe document** (`receipt.humidityNorm` /
  `impurityNorm`), nu din nomenclatorul de atunci. Sunt înghețate la creare tocmai ca o
  schimbare de normă între cele două cântăriri să nu rescrie retroactiv baza de plată.
- Bifa apare în formular **doar când umiditatea depășește norma** și se debifează singură dacă
  excesul dispare. O bifă fără efect e o invitație la greșeli.
- Rândul recepției poartă badge-ul „plătit cu apă" lângă coloana de apă eliminată: altfel suma
  nu se poate explica din cifrele de pe rând.
- **Bifa se pune la creare**, de cine creează recepția (inclusiv operatorul): el e la cântar,
  el vorbește cu șoferul. Compensația e confirmarea explicită plus auditul. Operatorul NU are
  voie să modifice recepția ulterior: furnizorul și suma sunt rezervate contabilului/managerului,
  închiderea și redeschiderea managerului, anularea adminului, iar corectarea de condiții
  contabililor și adminului.
  Nu-i da operatorului o cale de editare „pentru comoditate" — ar ocoli confirmarea în două cereri.
- **Corectarea ulterioară e a contabilului, a contabilului-șef și a adminului**
  (`CAN_CORRECT_TERMS_ROLES`, `correctReceiptTerms`, rută `PATCH /api/receipts/:id/correct-terms`).
  Aceleași roluri ajustează deja valoarea recepției prin `finance-write` (✎), deci e aceeași
  categorie de operațiune; stocul nu se atinge în niciun caz. Lista se verifică în DOUĂ locuri
  pe server (ruta și magazia, prin aceeași constantă) și e OGLINDITĂ a treia oară în frontend,
  ca să ascundă butonul. Schimb-o în toate trei: altfel ori butonul rămâne vizibil și dă 403,
  ori una dintre gărzile serverului devine mai permisivă decât cealaltă. Înțelegerea se află uneori după ce marfa a fost
  descarcată — furnizorul spune abia la decontare că achiziția a fost cu tot cu apă, sau
  prețul n-a fost completat la cântar.
  - Se corectează **intrările** (bifa, prețul), iar sumele se **recalculează** după aceeași
    formulă ca la creare. Diferență față de `updateReceiptAmount` (✎), care scrie o sumă la
    liber și deduce prețul din ea. Aici documentul rămâne aritmetic închis: cantitate × preț
    = sumă, pe act și pe extras. Nu le confunda și nu le unifica.
  - **Cantitatea și umiditatea nu se ating**, deci stocul nu se mișcă. Garanția nu e o
    presupunere: `correctReceiptTerms` **aruncă** dacă recalculul ar da altă
    `provisionalNetQuantity` decât cea stocată. `RECALCULATED` conține doar câmpuri de bani.
  - **Tot ce s-a înghețat la recepție se citește de pe document**, nu din nomenclatorul de
    acum: normele, **tarifele** (`cleaningTariff`/`dryingTariff`, persistate la creare) și
    **cota de reținere la sursă**. Altfel o corectare de preț rescrie retroactiv o cifră
    fiscală, iar adminul confirmă o sumă în timp ce serverul salvează alta.
  - Previzualizarea din dialog (`rcEstimate`) e a cincea copie a formulei și **trebuie să dea
    exact ce salvează serverul** — confirmarea e singurul control uman al operației. Folosește
    aceleași surse: cantitatea, apa și cota de pe document.
  - Refuzuri: datoria nu poate coborî sub cât s-a achitat deja (storno de plată întâi —
    același precedent ca returul pe livrare cu încasări), plafon de sanitate pe sumă,
    `payOnGrossQuantity` lipsă din body **păstrează** valoarea curentă (altfel un apel care
    voia doar prețul ar scoate tăcut bifa).
  - `termCorrections` e în `FINANCIAL_RECEIPT_FIELDS` — conține prețuri și sume, deci nu
    pleacă prin API către operator și `control`. Pe document se păstrează ultimele 20;
    istoricul complet rămâne în audit.
  - Statutul de plată **nu se scrie** aici: se derivă la citire în `listReceipts` (FIFO pe
    partener). Scris pe document ar fi greșit pentru o recepție stinsă printr-o plată făcută
    pe altă recepție a aceluiași furnizor — și ar intra așa în audit.
  - Motiv obligatoriu; istoricul stă **pe document** în `termCorrections` (bifă veche/nouă,
    preț vechi/nou, sumă veche/nouă, cine, când, de ce) și se vede în „Detalii recepție",
    nu doar în Audit. Rândul poartă badge-ul „corectat".
  - Refuzată pe `Anulat`, pe `Inchis` (se redeschide întâi) și pe `In descarcare`.
  - `paymentStatus` se recitește față de suma nouă — altfel o recepție rămâne „Achitat"
    după ce datoria a crescut.
- Celelalte scrieri pe o recepție existentă: **statusul** (mărginit de
  `assertStatusChangePermission` + `assertReceiptStatusTransition`, cu motiv obligatoriu) și
  **a doua cântărire**, care rulează o singură dată — nu se intră manual în „In descarcare" și
  nu se iese din ea decât spre „Anulat". Dacă adaugi altă rută de editare, reverifică:
  `receiptPayableTonnes` se încrede orbește în flagul stocat.

## Deploy
- **Push pe `main` → Vercel publică automat** pe agroprofit-plus.vercel.app (integrare Git activă).
- Lucrează pe o **ramură separată** (implicit `dev`), testează pe preview, apoi fă merge în `main`.
- NU comite `.env`.

## 🤖 Auto-commit (OBLIGATORIU, automat)
După ORICE modificare de cod, codul se **comite și se face push automat** pe ramura de lucru curentă —
printr-un hook PostToolUse (`.claude/hooks/auto-commit.sh`). Scop: istoric 100% + deploy de **PREVIEW** pe Vercel.
- **NU se operează niciodată pe `main`.** Hook-ul refuză `main`/detached HEAD ca să nu declanșeze deploy în
  PRODUCȚIE peste date reale. Lucrează mereu pe `dev` (`git checkout dev`) — altfel auto-commit-ul stă oprit.
- Fiecare modificare → un commit `auto: modificare cod (timestamp)` + `git push origin <ramură>` → Vercel preview.
- Mesajul hook-ului (additionalContext) confirmă „commit + push OK" sau semnalează dacă push-ul a eșuat.
- Promovarea în producție (merge `dev` → `main`) rămâne **manuală și deliberată**, doar după ce `npm test` trece
  și agenții de verificare nu au lăsat Critical/High. Nu o face fără decizia omului.

## Înainte să spui „gata"
1. `npm test` trece.
2. `node --check` pe fișierele atinse.
3. Verifică impactul pe **fluxul de business** (mai ales regulile de mai sus): o schimbare la o
   formulă atinge tabelul, factura, financiarul și reclamațiile deodată.
4. Producția pornește în curând cu **date reale** — atenție la `STORAGE_DRIVER=supabase`.

## 🛡️ Agenți de verificare (OBLIGATORIU, automat)
După ORICE modificare de cod SAU propunere de modificare (funcție nouă, editare, refactor,
dependență, migrație), rulează AUTOMAT — într-un singur mesaj, în paralel — 3 agenți:
- **architecture-guardian** — arhitectură + flux de business
- **performance-reviewer** — performanță + încărcare (Supabase/Vercel)
- **security-reviewer** — securitate

Nu cere voie — lansează-i. Raportează problemele grupate pe severitate (Critical/High/Medium/Low).
Dacă apar **Critical/High**, NU spune «gata» până nu decide omul.
(Agenții sunt în `.claude/agents/`; un hook din `.claude/settings.json` reamintește automat după fiecare modificare.)
