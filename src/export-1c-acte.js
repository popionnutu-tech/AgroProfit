"use strict";

// ============================================================================
// ACTUL DE ACHIZITIE in formatul nativ 1C (`ФайлОбмена` 2.0)
//
// DE CE PRIN SABLON, nu construit cimp cu cimp
// Documentul are ~90 de proprietati, dintre care 15 sint referinte catre obiecte 1C
// identificate prin GUID: conturi contabile, taxe, firma, utilizator, cota TVA, cont bancar.
// Scrise de mina, fiecare e o sansa de greseala care nu se vede la citire — 1C refuza
// fisierul fara sa spuna pe ce rind, sau, mai rau, il importa cu un cont gresit.
//
// `src/1c/sablon-act.xml` e documentul REAL al utilizatorului, cu datele lui scoase si
// locurile variabile marcate. Tot ce nu variaza ramine byte-identic cu ce produce 1C.
// Verificat la generare: in sablon nu a ramas niciun cod fiscal si niciun nume.
//
// CE VARIAZA: numarul si seria actului, datele, furnizorul (cod fiscal + denumire), temeiul,
// totalurile, si cite un rind per receptie (produs, cantitate, suma).
//
// ⚠️ PRODUSUL se leaga prin GUID (`products[].guid1c` din nomenclator). Fara el actul NU se
// exporta: un GUID inventat ar CREA un produs nou in 1C la fiecare import — exact dublura
// pe care exportul o evita. Se raporteaza ca rind sarit, nu se trece tacit.
//
// CIFRELE sint cele INGHETATE la emitere (`actFigures`), ca peste tot (regula 10): fisierul
// pentru 1C nu are voie sa contrazica hirtia semnata.
// ============================================================================

const fs = require("node:fs");
const path = require("node:path");

const CALE_SABLON = path.join(__dirname, "1c", "sablon-act.xml");
const CALE_ID = path.join(__dirname, "1c", "identificatori.json");

// Plafoane masurate, nu alese din burta: vezi comentariul din `construiesteXmlActe`.
const MAX_ACTE_XML = 120;
const MAX_RANDURI_XML = 300;

let sablonCache = null;

function sablon() {
  if (sablonCache === null) {
    const text = fs.readFileSync(CALE_SABLON, "utf8");
    const rand = text.match(/<!--RAND-->\n([\s\S]*?)\n<!--\/RAND-->/);
    const doc = text.match(/<!--DOC-->\n([\s\S]*?)\n<!--\/DOC-->/);
    if (!rand || !doc) {
      throw new Error("Sablonul actului de achizitie 1C e stricat (lipsesc marcajele RAND/DOC).");
    }
    sablonCache = { rand: rand[1], doc: doc[1] };
  }
  return sablonCache;
}

let idCache = null;
function identificatori() {
  if (idCache === null) idCache = JSON.parse(fs.readFileSync(CALE_ID, "utf8"));
  return idCache;
}

// Totul ce vine din date trece pe aici: sablonul se completeaza prin inlocuire de siruri,
// deci o denumire cu `<` sau `&` ar rupe fisierul.
function esc(valoare) {
  return String(valoare === null || valoare === undefined ? "" : valoare)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Caracterele pe care XML 1.0 nu le admite se SCOT, nu se escapeaza: `&#1;` e la fel de
// invalid ca octetul brut, iar parserul respinge FISIERUL INTREG. Aceeasi regula ca in
// `src/export-1c-xml.js` — surogatele nepereche incluse, perechile valide pastrate.
function curat(valoare) {
  return String(valoare === null || valoare === undefined ? "" : valoare)
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\uFFFE\uFFFF]/g, "")
    .replace(/[\uD800-\uDBFF](?![\uDC00-\uDFFF])/g, "")
    .replace(/(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g, "");
}

const txt = (v) => esc(curat(v).trim());

// Inlocuire prin FUNCTIE, nu prin sir.
//
// `String.replace` cu un sir interpreteaza `$&`, `` $` ``, `$'`, `$1` din INLOCUITOR. Un
// furnizor numit `` $` `` umfla fisierul (masurat: 16x pe un singur act), iar `$&` scrie
// literal marcajul nesubstituit in document. Escaparea XML nu are cum sa prinda asta,
// fiindca `$` e un caracter XML perfect legal.
// Cu o functie, textul se pune asa cum e.
function pune(text, marcaj, valoare, peste_tot = false) {
  const v = String(valoare);
  return peste_tot
    ? text.split(marcaj).join(v)
    : text.replace(marcaj, () => v);
}

// GUID DETERMINIST pentru document, derivat din firma + serie + numar.
//
// `РасходныйКассовый` si `ПрихНалоговаяНакладная` se potrivesc in 1C dupa identificator
// (`СинхронизироватьПоИдентификатору`). Un GUID aleator ar crea un document NOU la fiecare
// import al aceluiasi act; unul derivat face reimportul idempotent — 1C recunoaste documentul
// si il actualizeaza in loc sa-l dubleze.
//
// Nu e un UUID criptografic si nu trebuie sa fie: conteaza doar sa fie STABIL pentru acelasi
// act si diferit intre acte. Se marcheaza ca versiunea 4, varianta RFC, ca 1C sa-l accepte.
function guidDocument(prefix, companyId, serie, numar) {
  const samanta = `${prefix}|${Number(companyId) || 0}|${String(serie || "").toUpperCase()}|${Number(numar) || 0}`;
  let h1 = 0x811c9dc5;
  let h2 = 0x01000193;
  for (let i = 0; i < samanta.length; i += 1) {
    const c = samanta.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 0x01000193) >>> 0;
    h2 = Math.imul(h2 + c + i, 0x85ebca6b) >>> 0;
  }
  const hex = (n, lung) => (n >>> 0).toString(16).padStart(8, "0").slice(0, lung);
  const a = hex(h1, 8);
  const b = hex(h2, 4);
  const c = `4${hex(Math.imul(h1 ^ h2, 0xc2b2ae35), 3)}`;      // versiunea 4
  const d = `${"89ab"[(h2 >>> 30) & 3]}${hex(Math.imul(h2 ^ 0x9e3779b9, 0x27d4eb2f), 3)}`;
  const e = `${hex(Math.imul(h1 + h2, 0x165667b1), 8)}${hex(Math.imul(h1 ^ 0x5bf03635, 0x9e3779b1), 4)}`;
  return `${a}-${b}-${c}-${d}-${e}`;
}

function nr(valoare, zecimale = 2) {
  const n = Number(valoare);
  return Number.isFinite(n) ? n.toFixed(zecimale) : "0.00";
}

function dataLocala(d) {
  const z = (x) => String(x).padStart(2, "0");
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}T${z(d.getHours())}:${z(d.getMinutes())}:${z(d.getSeconds())}`;
}

/**
 * Un act -> un bloc `<Объект>`.
 *
 * @param {Object} act  { numar, serie, data, companyId, furnizor, codFiscal, temei,
 *                        total, impozit, randuri: [{ guidProdus, cantitateKg, suma }] }
 */
function obiectAct(act) {
  const { rand, doc } = sablon();

  const randuri = act.randuri
    .map((r) => {
      let t = rand;
      t = pune(t, "{{CANTITATE}}", nr(r.cantitateKg, 3));
      t = pune(t, "{{SUMA}}", nr(r.suma), true);
      t = pune(t, "{{GUID_PRODUS}}", txt(r.guidProdus));
      return t;
    })
    .join("\n");

  const zi = String(act.data || "").slice(0, 10);
  let t = doc;
  t = pune(t, "{{GUID_DOC}}", guidDocument("act", act.companyId, act.serie, act.numar));
  t = pune(t, "{{DATA_ORA}}", `${zi}T12:00:00`);
  t = pune(t, "{{DATA}}", zi);
  t = pune(t, "{{NUMAR}}", txt(act.numar));
  t = pune(t, "{{SERIE}}", txt(act.serie));
  t = pune(t, "{{TEMEI}}", txt(act.temei));
  t = pune(t, "{{FURNIZOR}}", txt(act.furnizor), true);
  t = pune(t, "{{COD_FISCAL}}", txt(act.codFiscal));
  t = pune(t, "{{TOTAL}}", nr(act.total), true);
  t = pune(t, "{{IMPOZIT}}", nr(act.impozit));
  // RANDURILE la final: ele contin deja valori substituite, deci nu mai pot fi atinse.
  t = pune(t, "{{RANDURI}}", randuri);
  return t;
}

/**
 * Fisierul de schimb cu actele de achizitie.
 *
 * @returns {{xml: string, scrise: number, sarite: number, motive: string[]}}
 */
function construiesteXmlActe(acte, optiuni = {}) {
  const lista = Array.isArray(acte) ? acte : [];

  // PLAFON DUBLU, verificat INAINTE de constructie.
  //
  // Masurat: 190.995 octeti (reguli + antet, o data) + 14.967 per act + 3.462 per rind.
  // Plafonul de 4,5 MB al raspunsului serverless se atinge la ~244 de acte cu un rind sau
  // ~140 cu cinci. `MAX_IDS_1C = 500` NU acopera cazul: 500 de receptii pot fi 500 de acte
  // separate (fluxul normal — un furnizor, o receptie) = 9,4 MB.
  //
  // Un plafon doar pe ACTE e insuficient (120 x 50 de rinduri = 20,8 MB); unul doar pe
  // RINDURI, la fel. Ambele: 190.995 + 14.967x120 + 3.462x300 = 2,89 MB, adica 64% din
  // limita in cel mai rau caz admis.
  //
  // XML-ul e de ~109x mai mare decat CSV-ul pe cazul normal, de-asta plafonul difera atit
  // de mult fata de cel de la furnizori.
  const randuriTotal = lista.reduce(
    (s, a) => s + (Array.isArray((a || {}).randuri) ? a.randuri.length : 0), 0
  );
  const preaMult = (mesaj) => {
    const e = new Error(`${mesaj} Descarca in transe mai mici sau foloseste formatul CSV.`);
    e.statusCode = 400;
    throw e;
  };
  if (lista.length > MAX_ACTE_XML) {
    preaMult(`Prea multe acte intr-un singur fisier XML (${lista.length}, maxim ${MAX_ACTE_XML}).`);
  }
  if (randuriTotal > MAX_RANDURI_XML) {
    preaMult(
      `Prea multe rinduri de marfa intr-un singur fisier XML ` +
      `(${randuriTotal}, maxim ${MAX_RANDURI_XML}).`
    );
  }
  const acum = optiuni.acum instanceof Date ? optiuni.acum : new Date();
  const reguli = String(optiuni.reguli || "").trim();
  const stampila = dataLocala(acum);

  const obiecte = [];
  const motive = [];
  for (const act of lista) {
    if (!act || !(Number(act.numar) > 0)) {
      motive.push("act fara numar emis");
      continue;
    }
    const randuri = Array.isArray(act.randuri) ? act.randuri.filter((r) => r && r.guidProdus) : [];
    if (!randuri.length) {
      // Fara GUID de produs n-avem ce exporta: 1C ar crea un produs nou la fiecare import.
      // Se raporteaza, nu se trece tacit.
      motive.push(
        `actul ${act.serie || ""} ${act.numar}: produsul nu e legat de nomenclatorul 1C ` +
        "(completeaza identificatorul 1C pe produs, in nomenclator)"
      );
      continue;
    }
    obiecte.push(obiectAct({ ...act, randuri }));
  }

  // Aceeasi invarianta ca la furnizori: un fisier VALID SI GOL e cel mai periculos rezultat —
  // 1C il importa fara sa se planga, omul apasa „Am incarcat in 1C", iar actele ies definitiv
  // din coada fara sa fi ajuns acolo.
  if (lista.length > 0 && obiecte.length === 0) {
    throw new Error(
      `Niciun act nu a putut fi scris in fisier, desi au fost cerute ${lista.length}. ` +
      (motive[0] || "Verifica nomenclatorul de produse.")
    );
  }

  const idReguli = (reguli.match(/<Ид>([^<]+)<\/Ид>/) || [])[1] || "";
  const antet =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<ФайлОбмена ВерсияФормата="2.0" ДатаВыгрузки="${esc(stampila)}" ` +
    `НачалоПериодаВыгрузки="${esc(stampila)}" ОкончаниеПериодаВыгрузки="${esc(stampila)}" ` +
    `ИмяКонфигурацииИсточника="БухгалтерияДляМолдовы" ` +
    `ИмяКонфигурацииПриемника="БухгалтерияДляМолдовы" ` +
    `ИдПравилКонвертации="${esc(idReguli)}" Комментарий="AgroProfit+">\n`;

  const xml =
    "﻿" + antet + reguli + "\n" + obiecte.join("\n") + "\n</ФайлОбмена>\n";

  return { xml, scrise: obiecte.length, sarite: lista.length - obiecte.length, motive };
}

module.exports = {
  construiesteXmlActe,
  MAX_ACTE_XML,
  MAX_RANDURI_XML,
  identificatori,
  // exportate pentru teste
  guidDocument,
  esc,
  curat
};
