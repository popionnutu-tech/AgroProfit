const { construiesteXmlFurnizori } = require("./export-1c-xml");

const {
  exportPaymentsFor1c,
  listPending1c,
  markSuppliersByFiscalCodes,
  setExported1c,
  exportPurchaseActsFor1c,
  exportSuppliersFor1c,
  exportResourceAsCsv,
  getDashboardSnapshot,
  getDeliveryDefaults,
  getReceiptDefaults
} = require("./storage");
const { getActorLabel } = require("./auth");

function sendJson(res, statusCode, payload) {
  if (typeof res.status === "function" && typeof res.json === "function") {
    return res.status(statusCode).json(payload);
  }
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
}

async function getReceiptDefaultsHandler(req, res) {
  try {
    const { supplierId, productId } = req.query || {};
    const defaults = await getReceiptDefaults(supplierId, productId);
    return sendJson(res, 200, { defaults });
  } catch (error) {
    console.error("Failed to load receipt defaults:", error.message);
    return sendJson(res, 500, { error: "Nu am putut incarca valorile implicite." });
  }
}

async function getDeliveryDefaultsHandler(req, res) {
  try {
    const { customerId } = req.query || {};
    const defaults = await getDeliveryDefaults(customerId);
    return sendJson(res, 200, { defaults });
  } catch (error) {
    console.error("Failed to load delivery defaults:", error.message);
    return sendJson(res, 500, { error: "Nu am putut incarca valorile implicite." });
  }
}

async function getDashboardHandler(req, res) {
  try {
    const date = String(req.query?.date || new Date().toISOString().slice(0, 10));
    const dashboard = await getDashboardSnapshot(date);
    return sendJson(res, 200, dashboard);
  } catch (error) {
    console.error("Failed to load dashboard:", error.message);
    return sendJson(res, 500, { error: "Nu am putut incarca dashboard-ul." });
  }
}

// Export pentru 1C: acte de achizitie pe o perioada.
// `;` ca separator si BOM UTF-8: asa se deschide corect in Excel pe setarile ro/ru, fara
// „toate coloanele intr-una". Zecimala e PUNCT, ca 1C sa nu confunde separatorul de coloana
// cu cel zecimal.
// Acelasi plafon ca la marcare (`idUri1c`): altfel se descarca 600, se importa 600, iar
// marcarea cade cu „prea multe documente" -> re-descarcare -> DUBLU import in 1C.
const MAX_IDS_1C = 500;

// Ids-urile vin din CORPUL cererii (POST) sau din query (GET, pentru compatibilitate).
// In URL, „bifeaza tot" pe mii de documente depasea limita de antet a platformei si
// descarcarea cadea cu 414/431 — exact cand omul avea nevoie de ea.
function idsDinCerere(req) {
  const dinCorp = (req.body || {}).ids;
  const brute = Array.isArray(dinCorp)
    ? dinCorp
    : String((req.query || {}).ids || "").split(",").filter((x) => x !== "");
  return idUri1cStrict(brute);
}

// Elementele invalide se RESPING, nu se arunca tacut.
//
// Varianta veche (`.map(Number).filter(Boolean)`) lasa sa treaca `[[7]]` ca 7, elimina `0`
// si inghitea `"7abc"` ca NaN. Nu era escaladare de drepturi — poti cere doar documente pe
// care rolul ti le da oricum — dar era PIERDERE: contabilul bifa N documente, descarca N-k,
// apoi apasa „Am incarcat in 1C" pe lista intreaga, iar cele k lipsa nu mai apareau
// niciodata in export. CLAUDE.md regula 10 cere lista tipizata in AMBELE straturi; al doilea
// strat (`idUri1c` din magazie) face exact asta, aici lipsea.
function idUri1cStrict(brute) {
  const arr = Array.isArray(brute) ? brute : [];
  if (!arr.length) return [];
  // Plafonul PRIMUL, inainte de orice lucru pe lista.
  if (arr.length > MAX_IDS_1C) {
    const e = new Error(
      `Prea multe documente intr-o singura descarcare (max ${MAX_IDS_1C}). Restrange selectia.`
    );
    e.statusCode = 400;
    throw e;
  }
  const invalid = () => {
    const e = new Error("Lista de documente e invalida.");
    e.statusCode = 400;
    return e;
  };
  if (arr.some((v) => typeof v !== "number" && typeof v !== "string")) throw invalid();
  const idUri = [...new Set(arr.map((v) => Number(String(v).trim())))];
  if (idUri.some((n) => !Number.isInteger(n) || n <= 0)) throw invalid();
  return idUri;
}

function trimiteCsv1c(res, columns, rows, numeFisier) {
  // Antetul `X-Document-Ids` a fost SCOS: nimeni nu il citea (interfata are deja id-urile pe
  // care le-a trimis), se repeta per RAND la actele multi-linie, si neplafonat putea depasi
  // limita de antet a platformei — rupand descarcarea cu un 500 greu de explicat.
  rows = rows.map((r) => {
    const copie = { ...r };
    delete copie._id;
    return copie;
  });
  // INJECTIE DE FORMULE: o celula care incepe cu `= + - @`, TAB sau CR e interpretata de
  // Excel ca FORMULA, iar ghilimelele nu protejeaza. Fisierul e construit explicit pentru
  // Excel (BOM + `;`), deci va fi deschis acolo.
  // Nota receptiei e scrisa de OPERATOR si ajunge in coloana „Temei" — adica privilegiul cel
  // mai mic din sistem ar putea executa ceva pe statia contabilului
  // (`=cmd|' /C calc'!A0`, `=WEBSERVICE(...)` pentru exfiltrare).
  // Se neutralizeaza DOAR ce nu e numar: altfel s-ar strica valorile negative pe care 1C
  // le citeste ca numere.
  const celula = (v) => {
    const t = String(v === null || v === undefined ? "" : v);
    if (!t) return t;
    // AMBELE teste pe valoarea trimuita: altfel „ =1+1" nu era nici numar, nici periculos,
    // si scapa neneutralizat.
    const curat = t.trim();
    const esteNumar = /^-?\d+(?:[.,]\d+)?$/.test(curat);
    const periculos = /^[=+\-@\t\r]/.test(curat);
    const sigur = !esteNumar && periculos ? `'${t}` : t;
    return /[";\n\r]/.test(sigur) ? `"${sigur.replace(/"/g, '""')}"` : sigur;
  };
  const linie = (valori) => valori.map(celula).join(";");
  const csv = [linie(columns), ...rows.map((r) => linie(columns.map((c) => r[c])))].join("\r\n");
  if (typeof res.setHeader === "function") {
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="${numeFisier}"`);
    // ACELEASI date personale ca in XML — IDNP-uri, adrese, telefoane, IBAN-uri si sume
    // pentru persoane fizice. Fara asta, fisierul ramane in cache-ul de disc al browserului
    // de pe statia contabilului, mult dupa ce a fost sters din Descarcari.
    res.setHeader("Cache-Control", "no-store");
  }
  if (typeof res.status === "function") res.status(200);
  else res.statusCode = 200;
  res.end("\ufeff" + csv);
}

// Formatul NATIV de schimb al lui 1C. Se incarca direct, fara potrivire de coloane.
// Acelasi drum ca `trimiteCsv1c` — difera doar tipul de continut si corpul.
function trimiteXml1c(res, xml, numeFisier) {
  if (typeof res.setHeader === "function") {
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="${numeFisier}"`);
    // Fisierul contine IDNP-uri, adrese si telefoane. Fara asta ramane in cache-ul de disc
    // al browserului de pe statia contabilului.
    res.setHeader("Cache-Control", "no-store");
  }
  if (typeof res.status === "function") res.status(200);
  else res.statusCode = 200;
  // BOM-ul e pus de constructor, ca in exportul real al lui 1C.
  res.end(xml);
}

// `?format=xml` -> formatul nativ 1C; orice altceva -> CSV.
// CSV-ul ramane IMPLICIT deliberat: e verificat pe import real, XML-ul e optiunea noua.
function formatCerut(req) {
  return String((req.query || {}).format || "").trim().toLowerCase() === "xml" ? "xml" : "csv";
}

async function exportPurchaseActs1cHandler(req, res) {
  try {
    const q = req.query || {};
    const { columns, rows } = await exportPurchaseActsFor1c({
      from: q.from,
      to: q.to,
      onlyNew: !["1", "true"].includes(String(q.includeExported || "").toLowerCase()),
      receiptIds: idsDinCerere(req)
    });
    trimiteCsv1c(res, columns, rows, `acte-achizitie-1c-${new Date().toISOString().slice(0, 10)}.csv`);
  } catch (error) {
    console.error("Failed to export purchase acts for 1C:", error.message);
    return sendJson(res, error.statusCode || 400, {
      error: error.message || "Nu am putut exporta actele."
    });
  }
}

// Ordine de plata pe perioada. Se incarca in 1C DUPA acte: plata se leaga de furnizor si de
// contul contabil, iar actul justifica datoria.
async function exportPayments1cHandler(req, res) {
  try {
    const q = req.query || {};
    const { columns, rows } = await exportPaymentsFor1c({
      from: q.from,
      to: q.to,
      onlyNew: !["1", "true"].includes(String(q.includeExported || "").toLowerCase()),
      transactionIds: idsDinCerere(req)
    });
    trimiteCsv1c(res, columns, rows, `ordine-plata-1c-${new Date().toISOString().slice(0, 10)}.csv`);
  } catch (error) {
    console.error("Failed to export payments for 1C:", error.message);
    return sendJson(res, error.statusCode || 400, {
      error: error.message || "Nu am putut exporta platile."
    });
  }
}

// Furnizorii de pe actele din perioada. Se incarca in 1C INAINTEA actelor.
async function exportSuppliers1cHandler(req, res) {
  try {
    const { columns, rows } = await exportSuppliersFor1c({
      from: req.query && req.query.from,
      to: req.query && req.query.to,
      // `?all=1` -> toti furnizorii cu cod fiscal, nu doar cei din perioada.
      onlyFromActs: !["1", "true"].includes(String((req.query || {}).all || "").toLowerCase()),
      // `?includeExported=1` -> si cei deja marcati (pentru reincarcare, daca importul a cazut).
      onlyNew: !["1", "true"].includes(String((req.query || {}).includeExported || "").toLowerCase()),
      partnerIds: idsDinCerere(req)
    });
    const zi = new Date().toISOString().slice(0, 10);
    if (formatCerut(req) === "xml") {
      // Coloanele CSV sint denumiri pentru OM; constructorul XML vrea campuri. Traducerea
      // se face AICI, nu in magazie: exportul ramane o singura sursa de date, iar cele doua
      // formate nu pot diverge pe continut.
      const xml = construiesteXmlFurnizori(
        rows.map((r) => ({
          cod: r["Cod fiscal / IDNP"],
          denumire: r.Denumire,
          persoanaFizica: r["Tip contraparte"] === "ЧастноеЛицо",
          adresa: r["Adresa juridica"],
          telefon: r.Telefon
        }))
      );
      return trimiteXml1c(res, xml, `furnizori-1c-${zi}.xml`);
    }
    trimiteCsv1c(res, columns, rows, `furnizori-1c-${zi}.csv`);
  } catch (error) {
    console.error("Failed to export suppliers for 1C:", error.message);
    return sendJson(res, error.statusCode || 400, {
      error: error.message || "Nu am putut exporta furnizorii."
    });
  }
}

async function exportResourceHandler(req, res, resource) {
  try {
    const csv = await exportResourceAsCsv(resource, req.currentUser && req.currentUser.roleCode);
    const filename = `${resource}-${new Date().toISOString().slice(0, 10)}.csv`;
    if (typeof res.setHeader === "function") {
      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    }
    if (typeof res.status === "function") {
      res.status(200);
    } else {
      res.statusCode = 200;
    }
    res.end(csv);
  } catch (error) {
    console.error(`Failed to export ${resource}:`, error.message);
    return sendJson(res, 400, { error: error.message || "Nu am putut exporta." });
  }
}

// Ce e de incarcat in 1C, pentru bifare in interfata.
async function listPending1cHandler(req, res) {
  try {
    const q = req.query || {};
    const toate = await listPending1c({
      kind: q.kind,
      from: q.from,
      to: q.to,
      includeExported: ["1", "true"].includes(String(q.includeExported || "").toLowerCase())
    });
    // PLAFON PE SERVER, nu doar la randare. Descarcarea si marcarea accepta oricum maximum
    // `MAX_IDS_1C` documente, iar interfata randeaza tot atatea — deci la 3 ani de date
    // ~98% din raspuns nu era folosit niciodata (3,2 MB de JSON pentru 500 de randuri utile),
    // si crestea nelimitat cu istoricul.
    // `total` ramane, ca omul sa stie cate mai sunt dincolo de transa curenta.
    const items = toate.slice(0, MAX_IDS_1C);
    return sendJson(res, 200, { ok: true, items, total: toate.length });
  } catch (error) {
    console.error("Failed to list pending 1C documents:", error.message);
    return sendJson(res, 400, { error: error.message || "Nu am putut citi lista." });
  }
}

// Marcheaza / ANULEAZA marcajul „incarcat in 1C". Anularea e pentru reincarcarea unui
// document corectat — actiune deliberata, nu efect secundar.
async function setExported1cHandler(req, res) {
  try {
    const body = req.body || {};
    const rezultat = await setExported1c({
      kind: body.kind,
      ids: body.ids,
      reset: body.reset === true,
      currentUser: req.currentUser || {},
      changedBy: getActorLabel(req)
    });
    return sendJson(res, 200, { ok: true, ...rezultat });
  } catch (error) {
    console.error("Failed to set 1C export mark:", error.message);
    return sendJson(res, error.statusCode || 400, {
      error: error.message || "Nu am putut marca documentele."
    });
  }
}

// Potrivirea de PORNIRE cu lista de furnizori descarcata din 1C.
async function matchSuppliers1cHandler(req, res) {
  try {
    const rezultat = await markSuppliersByFiscalCodes({
      fiscalCodes: (req.body || {}).fiscalCodes,
      currentUser: req.currentUser || {},
      changedBy: getActorLabel(req)
    });
    return sendJson(res, 200, { ok: true, ...rezultat });
  } catch (error) {
    console.error("Failed to match suppliers with 1C list:", error.message);
    return sendJson(res, error.statusCode || 400, {
      error: error.message || "Nu am putut potrivi furnizorii."
    });
  }
}

module.exports = {
  listPending1cHandler,
  matchSuppliers1cHandler,
  setExported1cHandler,
  exportPayments1cHandler,
  exportPurchaseActs1cHandler,
  exportSuppliers1cHandler,
  trimiteCsv1c,
  trimiteXml1c,
  exportResourceHandler,
  getDashboardHandler,
  getDeliveryDefaultsHandler,
  getReceiptDefaultsHandler
};
