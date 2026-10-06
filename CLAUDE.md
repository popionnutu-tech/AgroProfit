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
- `src/auth.js`, `src/permissions.js` — autentificare (parole scrypt), roluri, drepturi.
  (`src/security.js` a fost ȘTERS: cod mort, cu o parolă implicită în clar și o a doua
  implementare de sesiuni care putea fi recablată din greșeală.)
- `public/app.js` — tot frontend-ul (randare tabele, formulare, calcule afișate).
- `public/qr.js` — generator de coduri QR, fără dependențe (vezi regula 10).

## Stocare (important)
- Toată starea „primară" e un singur blob JSON sub cheia KV `receipts`; nomenclatorul sub cheia `config`.
- În memorie sunt cache-uri care se reîncarcă din KV la fiecare cerere (`reloadFromKv`) — după ce scrii în KV, modificarea se vede imediat, fără redeploy.
- `STORAGE_DRIVER=supabase` → baza REALĂ. `STORAGE_DRIVER=local` → fișiere locale (pentru teste fără să atingi datele reale).

## ⚠️ Reguli de business care se sparg ușor (OBLIGATORIU de citit)

### 1. Unități: TONE intern, KG la formular — și KILOGRAME ÎNTREGI
- Stocul / cilindrii / procesarea se țin intern în **TONE**.
- Formularele (recepție/livrare/procesare) primesc **KG**; frontend-ul împarte la 1000.
- **Cerealele se socotesc în kilograme ÎNTREGI.** Cântarul lucrează în kg, deci masa brută e
  mereu un număr întreg de kg. Pierderile (apă, impurități) se **rotunjesc la kg în
  `computeReceiptEstimate`, înainte de scăderea din brut** — astfel cantitatea netă, cea care
  intră în cilindru și cea pe care se calculează banii, iese întreagă. Fără asta rămâneau cozi
  de 0,6 kg care apăreau ca „−1 kg" într-un ecran și „0" în altul, pe aceeași realitate.
  Formula e oglindită în `getReceiptEstimate` din `public/app.js` — se schimbă în AMBELE locuri.
- Regula **nu repară retroactiv** datele existente: fracțiunile deja intrate în stoc se închid
  cu o corecție de inventar (regula 8).

### 2. Prețul la facturare e DUAL, după monedă
- **MDL** → `priceLei` = **lei / KG**. Total = `kg × priceLei`.
- **Valută (EUR/USD/RON)** → `priceForeign` = **valută / TONĂ**. Total valută = `tone × priceForeign`; total lei = `× exchangeRate`.
- **Sursa unică de calcul: `deliveryInvoiceTotals()` din `public/app.js`.** Aceeași formulă e duplicată intenționat în `updateBillingPriceLei` (formularul live) și în backend la `createComplaint`. Dacă schimbi formula, schimb-o în TOATE.
- NU trata `priceLei` în valută ca lei/kg — a cauzat un bug de **1000×** (92 de milioane în loc de 92 de mii).

### 3. `contractPrice` e PER TONĂ — și e ACELAȘI preț ca pe factură
La livrare există **un singur preț**. Contabilul îl pune din „Date factură"; contractul e doar
formular de tipar, nu face calcule. `contractPrice` nu e un al doilea preț — e același preț
exprimat în **lei/TONĂ**, pe lângă `priceLei` (lei/KG) și `priceForeign` (valută/TONĂ).
- Drum de bani SEPARAT de factură (Achitări/Încasări + raport de management):
  `contractPrice × cantitate(tone)`. Nu adăuga `×1000`.
- **Sursă unică: `deliveryReceivableTonnePrice()`** din `src/local-storage.js` — folosită de
  Încasări, extrasul de cont, raportul de management și tabelul de livrări. Oglindită în
  `public/app.js` (aceeași denumire) și în `src/management-report.js` (modul intenționat pur,
  fără require-uri, ca `isVoidedDelivery`). Se schimbă în TOATE TREI; există test care verifică
  că oglinzile nu au divergat.
- Se **derivă** din datele de facturare (`deliveryTonnePriceFromBilling`) și se scrie pe
  document la editare. Fallback-ul la citire vindecă livrările vechi, la care `contractPrice`
  a rămas 0 fiindcă **nu exista niciun câmp în interfață prin care să fie introdus** — deci
  ținta de încasat a fiecărei livrări era zero. Fără migrare, fără rescrierea istoricului.
- **`priceLei` înseamnă lei/KG la MDL, dar lei/TONĂ la valută** (vezi recalculul din
  `updateDelivery`). Totalurile facturii sunt corecte fiindcă `deliveryInvoiceTotals` ramifică
  pe monedă și nu-l citește acolo. Dar cine îl citește ca lei/kg greșește de **1000×** —
  derivarea ocolește deliberat câmpul și pornește din `priceForeign` + `exchangeRate`.
- La **MDL cursul e forțat la 1**. Cine punea EUR + curs, apoi comuta pe MDL fără să golească
  cursul, obținea `priceLei = preț × curs_vechi` — un preț/kg de zeci de ori mai mare, tăcut.
- Prețul **nu poate coborî ținta sub cât s-a încasat deja**: restul ar deveni 0, livrarea ar
  apărea „Încasat", iar banii primiți ar dispărea din evidență. Storno de încasare întâi —
  același precedent ca la retur (regula 6).
- **Drepturile nu se relaxează.** Prețul e câmp de facturare: `CAN_EDIT_BILLING_ROLES`, la
  creare și la editare. Operatorul nu-l atinge. Motivul documentat al gărzii e `invoiceNumber`
  (prin el se ocolea regula de retur pe livrare facturată) — nu-l scoate din listă.
- Dialogul arată contabilului **creanța rezultată** lângă totalul facturii: până acum punea
  prețul și nu vedea nicăieri că din el iese suma datorată de cumpărător.

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
- **Praful** (resturi sub 5 kg, pozitive sau negative, din rotunjiri și din documente
  retroactive) se poate așeza la zero în bloc, din butonul „Curăță resturile" din Stoc.
  Fiecare rând trece prin **aceeași** `createStockCorrection` ca manual — deci motiv
  obligatoriu, urmă în audit și intrare în coloana „Corecții inventar" în ambele ecrane.
  **Nu scrie direct în stoc:** orice pierdere e recunoscută. Corecțiile se fac **secvențial**
  — în paralel, ultima scriere ar șterge celelalte. Butonul apare doar când există ce curățat,
  doar pentru admin. Un prag `0` trimis explicit e RESPINS (nu cade pe valoarea implicită).
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
- **„Total de plată" de pe act = datoria ÎNREGISTRATĂ** (`amountToPay ?? preliminaryPayableAmount`),
  nu o recalculare din cota de impozit de azi; reținerea e diferența brut − net, iar procentul
  tipărit e cel EFECTIV (reținere ÷ valoare). Altfel apăreau două cifre pentru aceeași datorie:
  actul mai scădea o dată impozitul (56.400 lei plătiți, 53.016 lei pe actul semnat de furnizor),
  iar pe recepțiile vechi, fără reținere înregistrată, eticheta „(6%)" stătea lângă „0,00".
- **Ajustarea manuală a sumei (✎, `updateReceiptAmount`) scrie un document COERENT**, nu doar
  suma: valoarea introdusă e cea DE PLATĂ (netă), din ea se derivă brutul cu **cota înghețată
  pe document** (`withholdingPercent`), apoi `withholdingAmount` și `price` (lei/kg **brut**,
  informativ). Înainte rămâneau vechi `preliminaryMerchandiseValue` și `withholdingAmount`, iar
  `price` devenea net/kg — de aici actul cu „Rețineri: 0,00" pe o recepție cu impozit reținut.
- **Valoarea brută de pe act vine de pe document** (`preliminaryMerchandiseValue`), iar prețul
  unitar tipărit se DERIVĂ din ea (valoare ÷ cantitate), ca „cantitate × preț = valoare" să fie
  adevărat pe hârtie după rotunjirea la 4 zecimale. Ambele buildere folosesc aceeași bază și
  același lanț pentru datorie — altfel aceeași recepție iese cu două seturi de cifre.
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

### 10. Formularele de tipar (acte oficiale)
- **Actul de achiziție are UN singur builder**, `buildPurchaseActHtml` (`public/app.js`), folosit
  și de meniul „Tipar" de pe rândul recepției, și de pagina „Documente tipar", și de butonul din
  Livrări. A existat o a doua machetă; aceeași cumpărare ieșea pe două hârtii diferite. Macheta
  urmează formularul tipizat bilingv (RO/RU) primit de la proprietar — nu o „înfrumuseța".
- **Meniul „Tipar" de pe recepție** e al contabilului, contabilului-șef și adminului
  (`CONTABILI_SI_ADMIN` în `renderReceipts`). Conține contractul și actul.
  - **Contractul** e document de PARTENER: se poate tipări și pe o recepție în „Proiect"
    (contabilul îl pregătește înainte), dar nu pe una anulată.
  - **Actul** cere marfă în stoc (`isReceiptInStock`) — altfel e o hârtie fără acoperire.
- **Ordinul de plată NU se emite de pe recepție.** Iese din Financiar, dintr-o PLATĂ
  înregistrată (`printAccountingDocument("paymentOrder")`). Sintetizat din restul de plată, ar
  fi o dispoziție de casă fără corespondent în registru, retipăribilă oricând pe aceeași datorie.
- **Toate cele trei intrări ale actului se deschid cu `openOfficialDocWindow`.** Clasele `of-*`
  (chenare, linii de completat, legende bilingve, margini) există DOAR acolo. Trimis în
  fereastra obișnuită, actul iese fără chenare și cu subsol „Generat de AgroProfit+" pe un
  formular de stat — vezi lista `officialDocs` din `printDeliveryDocument`.
- **Codul QR** (`public/qr.js`, fără dependențe) poartă datele actului ca text ASCII: firma și
  IDNO, seria/nr. și data actului (plus recepțiile din el), furnizorul, marfa, valoarea,
  reținerea și suma de plată. **IDNP-ul furnizorului NU intră în cod** (decizia proprietarului,
  25.09.2026): pe hârtie apare întreg, fiindcă formularul îl cere, dar în QR ar fi extractibil
  automat din orice fotografie a actului.
  - Generatorul e local **intenționat**: unul extern ar primi datele actului la fiecare tipărire.
  - Capacitatea e 213 octeți (versiunile 1-10, corecție M). `actQrPayload` scurtează în ordine:
    întâi numele firmei, apoi detaliul mărfii. Identificarea părților și suma rămân mereu.
  - Textul întors de `actQrPayload` **nu e escapat pentru HTML**. Ajunge doar în encoder; dacă
    îl afișezi vreodată pe pagină, treci-l prin `escapeComboHtml`.
  - QR-ul **nu e semnat**: e comoditate de citire, nu dovadă de autenticitate. Nu construi
    peste el un flux de tip „scanez și validez documentul".
  - Orice modificare în `qr.js` se verifică decodând rezultatul cu un decodor independent;
    trei erori (polinom inversat, format transpus, aliniere sărită) au trecut neobservate la
    citire și au ieșit doar așa.

### 10. Numărul actului de achiziție (`actNumber`)
Actul de achiziție e document fiscal: numărul lui ajunge în dosarul de hârtie, semnat.
- Se atribuie **o singură dată**, la prima tipărire, și se **persistă pe recepție**
  (`actNumber`, `actSeries`, `actIssuedAt`). Orice reimprimare dă **același** număr.
  Dacă îl calculezi la afișare, reimprimarea produce alt număr decât cel din dosar.
- **Șir SEPARAT pe firmă emitentă** (`actCompanyId`). Seria e per firmă, deci un șir global
  lăsa găuri în registrul fiecăreia: „PAT 915", „AGR 916", „PAT 917" — în dosarul PAT lipsește
  916. Firma e **obligatorie**, nu se ghicește: un fallback „prima firmă activă" îngheța tăcit
  seria altei firme decât cea pe care omul credea că emite, fără cale de corecție.
- **Alocare ATOMICĂ în PostgreSQL**, când migrarea `migrations/001-numerotare-atomica-acte.sql`
  e aplicată: advisory lock pe firmă + cheie primară `(company_id, number)` în tabelul
  `purchase_act_numbers`. Duplicatul devine **imposibil**, nu doar detectat. `allocateActNumber`
  din `src/supabase-state-kv.js` întoarce `null` dacă funcția nu există (migrarea nu e rulată),
  iar codul **cade pe derivarea din blob** — deci aplicația merge și înainte de migrare.
  Mecanismul folosit se consemnează pe document (`actNumberSource`) și în audit (`numberSource`):
  „postgres" sau „blob". Orice ALTĂ eroare de alocare se propagă — o alocare eșuată nu are voie
  să cadă tăcut pe metoda mai slabă.
- ⚠️ **Fără migrare, unicitatea nu e garantată de cod, doar verificată.** Persistența e un blob JSON unic
  scris cu upsert necondiționat (fără versiune, fără compare-and-set) și cu debounce: o
  scriere concurentă poate reîncărca blobul de DINAINTE de atribuire și îl poate suprascrie —
  hârtia iese cu 914, datele nu mai știu de el, actul următor ia din nou 914. De aceea
  `assignActNumber` forțează scrierea, **recitește din KV și verifică** că numărul e persistat
  exact o dată; altfel aruncă. Mitigare, nu soluție: **soluția reală e alocare atomică în
  bază** (rând dedicat + RPC `n = n + 1`, sau index unic pe (firmă, număr)).
- O recepție cu act emis **nu se mai poate anula** — hârtia semnată ar rămâne cu numărul
  orfan și o gaură în șir, imposibil de explicat la control. Se stornează actul întâi.
- `actNumber`/`actSeries`/`actIssuedAt`/`actCompanyId` sunt în `FINANCIAL_RECEIPT_FIELDS`:
  nu sunt sume, dar sunt metadate ale unui document fiscal pe care doar contabilii îl emit.
- `purchaseAct` a fost **scos** din `allocateDocumentNumber`: era un al doilea mecanism de
  numerotare pe același document, printr-o rută deschisă și managerului, care ștampila un
  număr invizibil pe aceeași recepție. `paymentOrder` rămâne acolo.
- `nextActNumber()` = `max(atribuite pe firmă) + 1`, cu plafon inferior `ACT_NUMBER_START = 914`
  (actul lui Cojocari Ana din 02.10.2026, numerotat pe hârtie). **Derivat din date, nu
  dintr-un contor separat** — un contor se desincronizează la restaurare din backup sau la
  o scriere pierdută, iar un număr refolosit înseamnă două acte cu același număr în dosar.
- Actele de **dinainte** de 02.10.2026 rămân nenumerotate în aplicație: au deja numere
  scrise de mână și nu se rescrie nimic semnat (decizia utilizatorului, 03.10.2026).
- **Doar achizițiile de la persoane fizice** consumă numere — acolo se întocmește actul,
  fiindcă acolo se reține impozitul la sursă. „Persoană fizică" se decide pe SERVER, din
  profilul fiscal al partenerului (`withholdingPercent > 0`), nu din body: altfel apelantul
  ar consuma numere pe achiziții de la firme și ar lăsa găuri în șir.
- Doar `CAN_ISSUE_ACTS_ROLES` (contabil, contabil-șef, admin) emit acte. Urmă în audit
  (`receipt-act-number`). Refuzat pe o recepție care nu e în stoc — ar fi hârtie fără marfă.
- Un act care acoperă **mai multe recepții** consumă UN număr, dar **îl primesc toate**.
  Marcat doar pe cea mai veche, una dintre celelalte tipărită ulterior individual apărea
  nenumerotată și **ardea un număr nou** pentru marfă deja acoperită de hârtia 914 — dublă
  invizibilă. Reemiterea pe oricare dintre ele întoarce același număr. Un act acoperă
  recepțiile **unui singur furnizor** (verificat în handler pe `supplierId`).
- **Cifrele actului se îngheață la emitere** (`actFigures`: kg, valoare, reținere, net, pe
  purtător) — **și rândurile, nu doar totalurile** (`actFigures.rows`: id, produs, kg,
  valoare, net). Fără asta, o corecție ulterioară de preț sau de bifă făcea ca retipărirea
  ACELUIAȘI număr să arate alte cifre decât hârtia semnată — exact riscul de care actul se
  apăra deja pe cota de impozit. Îngheţând doar totalurile, actul se contrazicea **pe aceeași
  hârtie**: rând 35.756,10 sub un total de 17.878,05, pe un formular care afirmă „5 = 3 × 4".
  Denumirea produsului intră și ea în captură: nomenclatorul se poate redenumi după emitere. Se păstrează primitivele; prețul se derivă din ele la
  tipărire, ca să nu existe a doua regulă de rotunjire. **Codul QR poartă aceleași cifre**
  înghețate: altfel codul scanat ar contrazice hârtia de lângă el. Un act cu alte cifre
  cere număr nou.
- Captura stă **o singură dată, pe purtător**; celelalte recepții ale actului primesc doar
  `actCarrierId`. Scrisă pe toate, un act de 50 de recepții îngroșa blobul cu **364 KB** —
  iar blobul se descarcă la fiecare cerere. Ținută doar pe purtător **fără referință**,
  tipărirea individuală a oricăreia dintre celelalte cădea pe recalcul și scotea aceeași
  serie și același număr cu alte cifre. Referința închide ambele: tipărirea rezolvă captura
  prin purtător (din selecție sau din `receiptsCache`) și dă actul **întreg**.
- În audit se păstrează doar **totalurile** + `receiptIds`, nu captura întreagă: altfel mai
  era o copie completă în `auditLogs`, în același blob.
- Captura îngheață și **datele** (rubrica „din / от" intră și în QR), **firma emitentă** și
  **numele furnizorului**: firma se reselectează în „Documente tipar" (antetul firmei B cu
  seria firmei A), iar furnizorul se putea schimba după emitere. De aceea
  `updateReceiptSupplier` refuză pe o recepție cu act emis.
- **Emiterea amestecată e refuzată**: dacă o parte din selecție e deja pe un act și restul nu,
  cererea cade cu mesaj explicit. Altfel actul vechi se reactiva cu alt conținut sub același
  număr, iar marfa nouă rămânea pe niciun act.
- O reîncercare după o scriere parțială **repară** marcajele lipsă pe toate recepțiile actului;
  nu le ignoră, altfel cele nemarcate ardeau un număr nou mai târziu.
- Garda „act emis" e o **sursă unică** (`assertNoIssuedAct`), apelată din `cancelReceipt`,
  din `updateReceiptStatusWithAudit` (statusul „Anulat" o ocolea) și din
  `updateReceiptSupplier`.
- `actFigures` e în `FINANCIAL_RECEIPT_FIELDS`: conține valoarea, reținerea și netul, pe
  fiecare rând — exact datele pentru care se șterg `price` și `preliminaryMerchandiseValue`.
- Lista de recepții e **tipizată** (doar numere/șiruri numerice, întregi pozitivi) și plafonată
  la 50, în ambele straturi: `Number(true)` e 1 și `Number([7])` e 7, deci fără verificarea de
  tip un boolean marchează o recepție la întâmplare.
- Rândul recepției arată coloana **„Act nr."** (serie + număr, cu data emiterii în tooltip),
  ca registrul din aplicație să poată fi confruntat cu dosarul de hârtie.
- Seria e **per firmă** (`companies[].series`), nu globală — firma vine din cerere, seria se
  rezolvă pe server.
- La tipărire, fereastra se deschide **înainte** de `await` (cererea numărului). După un
  `await`, `window.open` e blocat de blocatorul de pop-up și contabilul rămâne fără document.
  Orice ieșire devreme trebuie să închidă fereastra deja deschisă.

### 10b. Corecțiile de după emiterea actului se MARCHEAZĂ, nu se blochează
Cifrele actului sunt îngheţate, deci hârtia rămâne valabilă — dar atunci **registrul pleacă de
sub ea**: reținerea la sursă declarată pe act nu mai e cea din evidență. Decizia utilizatorului
(06.10.2026): **avertisment, nu blocare** — contabilul trebuie să poată corecta.
- `marcheazaDivergentaAct()` scrie în `receipt.actDivergences` ce s-a schimbat, când, de ce și
  cifrele care sunt pe hârtie. Apelată din `updateReceiptAmount` și din `correctReceiptTerms`.
- **Se și VEDE**, altfel decizia „avertisment, nu blocare" rămâne fără compensație: badge
  `≠ registru` lângă numărul actului în tabelul Recepții, plus un rând în „Detalii recepție"
  cu cifrele de pe hârtie și motivul. Scrisă dar nerandată, marcarea nu ajuta pe nimeni.
- Ultimele 20 pe document; istoricul complet rămâne în audit. `actDivergences` e în
  `FINANCIAL_RECEIPT_FIELDS` — conține sume.

### 11. Serviciile se taxează DOAR pe procentul peste normă
`cleaningServiceTotal = brut × excesImpurități × tarif`, `dryingServiceTotal = brut ×
excesUmiditate × tarif`. Dacă marfa e în normă, serviciul e **0**.
- Backend-ul ignora complet `excessImpurity` și taxa toată cantitatea: la 100 t, tarif 10 și
  3% exces, ecranul arăta **3.000** lei, iar documentul salva **1.000**. Mai rău, taxa
  curățarea și când impuritățile erau SUB normă. Reparat 06.10.2026.
- Formula e oglindită în `getReceiptEstimate` din `public/app.js`. AMBELE locuri.

### 12. Sesiunea se verifică pe CONT, nu doar pe token
Tokenul dovedește că omul s-a autentificat **cândva**. Rolul, drepturile și starea „activ" se
citesc de pe cont la **fiecare cerere** (`attachCurrentUser`).
- Înainte, un cont dezactivat sau retrogradat păstra drepturile vechi până la expirarea
  tokenului — până la 12 ore — iar o parolă schimbată nu tăia sesiunile existente.
- `auth.js` NU poate cere `local-storage` (acela îl cere pe el). Căutarea contului se
  **injectează** din `server.js` prin `setUserLookup`. Fără ea se cade pe token, ca înainte;
  o eroare la citirea contului **nu** acordă acces (fail-closed).
- `sessionsRevokedAt` pe cont invalidează tokenurile emise înainte. Se setează la schimbarea
  parolei, la dezactivare și la schimbarea rolului. Ieșirea de pe un dispozitiv rămâne
  per-dispozitiv (ștergerea cookie-ului) — nu te scoate și din birou.
- **Parola inițială nu e o constantă în cod.** Repo-ul e public: o valoare scrisă acolo e
  cunoscută de oricine și funcționează pe orice cont care nu și-a schimbat parola.
  - În mediu **publicat** (`STORAGE_DRIVER=supabase`), `DEFAULT_USER_PASSWORD` e
    **obligatorie** — se cade zgomotos, ca la `SESSION_SECRET`. Nu se generează și nu se
    loghează nimic: parola ar ajunge în logurile platformei, cu retenție.
  - **Local**, se generează una aleatoare și se scrie în consolă, cu o **cifră garantată**:
    politica strictă cere una, iar din 12 caractere base64url una din opt parole nu avea
    niciuna — și pornirea cădea exact pe calea de recuperare.
  - Adminul de pornire se creează cu `requirePasswordChange: true`. Fără asta,
    `ensureUserSecurityState` îl lăsa pe `false` la următoarea citire (hash-ul exista deja),
    deci credențialul rămânea valabil nelimitat.
- **Schimbarea parolei re-emite tokenul.** Revocarea taie sesiunile emise înainte, inclusiv
  cea curentă: fără token nou, omul primea 401 imediat după ce își schimba parola — iar pe un
  cont cu `requirePasswordChange` asta se întâmpla la FIECARE primă intrare.

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
