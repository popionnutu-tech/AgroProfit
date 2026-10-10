const { construiesteXmlFurnizori, reguliSchimb } = require("./export-1c-xml");
const { construiesteXmlActe, construiesteXmlOrdinePlata } = require("./export-1c-acte");

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
  // Se sterg TOATE campurile interne (prefix `_`), nu doar `_id`: rindurile poarta acum si
  // chei structurale pentru exportul XML, care n-au ce cauta in fisierul contabilului.
  rows = rows.map((r) => {
    const copie = {};
    for (const [k, v] of Object.entries(r)) if (!k.startsWith("_")) copie[k] = v;
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
    res.setHeader("X-Content-Type-Options", "nosniff");
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
    res.setHeader("X-Content-Type-Options", "nosniff");
  }
  if (typeof res.status === "function") res.status(200);
  else res.statusCode = 200;
  // BOM-ul e pus de constructor, ca in exportul real al lui 1C.
  res.end(xml);
}

// `?format=xml` -> formatul nativ 1C; orice altceva -> CSV.
// CSV-ul ramane IMPLICIT deliberat: e verificat pe import real, XML-ul e optiunea noua.
//
// `suportaXml` spune daca RUTA stie sa scoata XML. Garda e AICI, pe server, nu doar in
// interfata: altfel `?format=xml` pe acte sau plati intorcea 200 cu CSV inauntru si extensia
// `.xml` pe fisier — iar contabilul ar fi dus in 1C un fisier care nu se poate importa,
// convins ca e XML. Ceruta explicit si nesuportata => eroare, nu tacere.
function formatCerut(req, suportaXml) {
  const cerut = String((req.query || {}).format || "").trim().toLowerCase();
  if (!cerut || cerut === "csv") return "csv";
  if (cerut === "xml" && suportaXml) return "xml";
  const e = new Error(
    cerut === "xml"
      ? "Formatul XML e disponibil deocamdata doar pentru furnizori. Pentru acte si plati, foloseste CSV."
      : `Format necunoscut: ${cerut}. Foloseste csv sau xml.`
  );
  e.statusCode = 400;
  throw e;
}

async function exportPurchaseActs1cHandler(req, res) {
  try {
    const q = req.query || {};
    const { columns, rows } = await exportPurchaseActsFor1c({
      from: q.from,
      to: q.to,
      // `?includeUnissued=1` -> si receptiile fara act emis din aplicatie (perioada veche,
      // unde numerele sint scrise de mina si 1C numeroteaza singur).
      includeUnissued: ["1", "true"].includes(String(q.includeUnissued || "").toLowerCase()),
      onlyNew: !["1", "true"].includes(String(q.includeExported || "").toLowerCase()),
      receiptIds: idsDinCerere(req)
    });
    const zi = new Date().toISOString().slice(0, 10);
    if (formatCerut(req, true) === "xml") {
      // Randurile CSV sint PER RECEPTIE; un act poate acoperi mai multe. Se grupeaza dupa
      // receptia PURTATOARE (`_id`), ca actul sa plece cu toate randurile lui — altfel in 1C
      // ar intra tot atitea acte cite receptii, fiecare cu totalul intreg.
      const peAct = new Map();
      for (const r of rows) {
        const cheie = Number(r._id);
        if (!peAct.has(cheie)) {
          peAct.set(cheie, {
            receiptId: cheie,
            numar: Number(r._numar || 0),
            serie: r._serie,
            data: r._data,
            companyId: r._companyId,
            furnizor: r._furnizor,
            codFiscal: r._codFiscal,
            // Numarul recepției in „Temei": 1C arata rubrica asta in lista de documente,
            // deci actul se poate confrunta cu recepția dintr-o privire.
            temeiuri: [],
            total: 0,
            net: 0,
            randuri: []
          });
        }
        const act = peAct.get(cheie);
        act.temeiuri.push(`Recepția #${r["Nr. recepție"]} · ${r.Produs || ""}`.trim());
        act.total += Number(r._valoare || 0);
        act.net += Number(r._net || 0);
        act.randuri.push({
          guidProdus: r._guidProdus,
          cantitateKg: Number(r._kg || 0),
          suma: Number(r._valoare || 0)
        });
      }
      const acte = [...peAct.values()].map((a) => ({
        ...a,
        temei: a.temeiuri.join("; ").slice(0, 200),
        // `Сумма` e BRUTUL, `СуммаПН` impozitul retinut din el — ca in exportul real al 1C.
        impozit: Math.max(a.total - a.net, 0)
      }));
      const r = construiesteXmlActe(acte, { reguli: reguliSchimb() });
      if (typeof res.setHeader === "function") {
        res.setHeader("X-Export-Scrise", String(r.scrise));
        res.setHeader("X-Export-Sarite", String(r.sarite));
        if (r.motive.length) {
          res.setHeader("X-Export-Motiv", encodeURIComponent(r.motive[0].slice(0, 300)));
        }
      }
      return trimiteXml1c(res, r.xml, `acte-achizitie-1c-${zi}.xml`);
    }
    trimiteCsv1c(res, columns, rows, `acte-achizitie-1c-${zi}.csv`);
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
    const zi = new Date().toISOString().slice(0, 10);
    if (formatCerut(req, true) === "xml") {
      const r = construiesteXmlOrdinePlata(
        rows.map((x) => ({
          id: x._id,
          data: x._data,
          companyId: x._companyId,
          furnizor: x._furnizor,
          codFiscal: x._codFiscal,
          temei: x._temei,
          // Goale cind reconstituirea NU e sigura (cote de retinere diferite): atunci plata
          // se sare, cu motiv, in loc sa plece cu un impozit inventat.
          brut: x._brut,
          impozit: x._impozit
        })),
        { reguli: reguliSchimb() }
      );
      if (typeof res.setHeader === "function") {
        res.setHeader("X-Export-Scrise", String(r.scrise));
        res.setHeader("X-Export-Sarite", String(r.sarite));
        if (r.motive.length) {
          res.setHeader("X-Export-Motiv", encodeURIComponent(r.motive[0].slice(0, 300)));
        }
      }
      return trimiteXml1c(res, r.xml, `ordine-plata-1c-${zi}.xml`);
    }
    trimiteCsv1c(res, columns, rows, `ordine-plata-1c-${zi}.csv`);
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
    if (formatCerut(req, true) === "xml") {
      // Se citesc CHEILE STRUCTURALE (`_cod`, `_denumire`, `_persoanaFizica`), nu etichetele
      // de coloana. Legat pe etichete, o redenumire facea exportul sa scoata un fisier valid
      // si GOL, iar marcajul „am incarcat in 1C" scotea furnizorii definitiv din coada.
      const { xml, scrise, sarite } = construiesteXmlFurnizori(
        rows.map((r) => ({
          cod: r._cod,
          denumire: r._denumire,
          persoanaFizica: r._persoanaFizica === true,
          adresa: r["Adresa juridica"],
          telefon: r.Telefon,
          // IBAN-ul pleaca intr-un obiect SEPARAT (`РасчетныеСчета`), emis imediat dupa
          // contraparte. Fara linia asta, functia exista dar nu primea niciodata nimic.
          iban: r.IBAN
        }))
      );
      // Cati au intrat efectiv in fisier — citit de interfata, ca hint-ul sa nu raporteze
      // selectia in locul rezultatului.
      if (typeof res.setHeader === "function") {
        res.setHeader("X-Export-Scrise", String(scrise));
        res.setHeader("X-Export-Sarite", String(sarite));
      }
      return trimiteXml1c(res, xml, `furnizori-1c-${zi}.xml`);
    }
    trimiteCsv1c(res, columns, rows, `furnizori-1c-${zi}.csv`);
  } catch (error) {
    console.error("Failed to export suppliers for 1C:", error.message);
    // Lipsa fisierului de reguli e o eroare de SERVER, nu de cerere, iar `error.message`
    // contine calea absoluta de pe server. Calea ramane in log, nu pleaca la client.
    if (error && error.code === "ENOENT") {
      return sendJson(res, 500, {
        error: "Regulile de conversie 1C lipsesc de pe server. Anunta administratorul."
      });
    }
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
      includeUnissued: ["1", "true"].includes(String(q.includeUnissued || "").toLowerCase()),
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
