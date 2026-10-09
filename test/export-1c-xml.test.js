const test = require("node:test");
const assert = require("node:assert/strict");

const { withIsolatedWorkspace } = require("../test-support/isolated-runtime");
const { computeReceiptEstimate } = require("../src/receipt-handlers");
const { construiesteXmlFurnizori, MAX_FURNIZORI_XML, esc, curataControl, dataLocala1c } =
  require("../src/export-1c-xml");

// Un parser minimal, cat sa putem CITI inapoi ce am scris. Nu validam schema 1C (n-avem cum
// fara 1C), dar verificam ca fisierul e XML bine format si ca valorile se intorc intacte —
// exact erorile care trec neobservate la citire si se vad abia la import.
function parseaza(xml) {
  const corp = xml.replace(/^﻿/, "");
  // Bine format: fiecare eticheta deschisa se inchide, in ordine.
  const stiva = [];
  const re = /<(\/?)([^\s/>]+)([^>]*?)(\/?)>/g;
  let m;
  while ((m = re.exec(corp))) {
    const [, inchidere, nume, , autoinchis] = m;
    if (nume.startsWith("?") || nume.startsWith("!")) continue;
    if (autoinchis) continue;
    if (inchidere) {
      assert.equal(stiva.pop(), nume, `eticheta inchisa gresit: ${nume}`);
    } else {
      stiva.push(nume);
    }
  }
  assert.equal(stiva.length, 0, `etichete ramase deschise: ${stiva.join(", ")}`);
  return corp;
}

// Cheia unui obiect: perechea dupa care 1C potriveste contragentul.
function cheiDinXml(xml) {
  return [...xml.matchAll(/<Ссылка[^>]*>([\s\S]*?)<\/Ссылка>/g)].map((m) => {
    const v = [...m[1].matchAll(/<Значение>([\s\S]*?)<\/Значение>/g)].map((x) => x[1]);
    return v;
  });
}

const ACUM = new Date(2026, 9, 9, 14, 30, 0);

// Constructorul intoarce `{ xml, scrise, sarite }`. Testele de mai jos verifica forma
// fisierului; cele care verifica numaratoarea folosesc rezultatul intreg.
function xmlDin(randuri, optiuni = { acum: ACUM }) {
  return construiesteXmlFurnizori(randuri, optiuni).xml;
}

test("XML: cheia e perechea cod fiscal + denumire, cum o cere 1C", () => {
  const xml = xmlDin(
    [{ cod: "2000000000001", denumire: "Furnizor Testov", persoanaFizica: true }], { acum: ACUM });
  parseaza(xml);
  assert.deepEqual(cheiDinXml(xml), [["2000000000001", "Furnizor Testov"]]);
  // Regula din 1C: ce exista deja acolo NU se suprascrie.
  assert.match(xml, /НеЗамещать="true"/);
  // Si tipul de contraparte, cu valoarea pe care o scrie 1C insusi.
  assert.match(xml, /<Значение>ЧастноеЛицо<\/Значение>/);
});

test("XML: o firma primeste Организация, nu ЮридическоеЛицо", () => {
  // Valoarea gresita nu da eroare la import — contraparte ramane doar neclasificata, deci
  // greseala se vede abia in 1C, dupa ce marfa a intrat.
  const xml = xmlDin(
    [{ cod: "1003600000000", denumire: "Agro SRL", persoanaFizica: false }], { acum: ACUM });
  assert.match(xml, /<Значение>Организация<\/Значение>/);
  assert.ok(!xml.includes("ЮридическоеЛицо"), "valoarea inexistenta in 1C nu are ce cauta aici");
});

test("XML: caracterele speciale dintr-o denumire nu rup fisierul", () => {
  const nume = 'Ion & Fiii <SRL> "Agro" \'test\'';
  const xml = xmlDin(
    [{ cod: "1003600000001", denumire: nume, persoanaFizica: false }], { acum: ACUM });
  parseaza(xml);
  // Escapat la scriere...
  assert.match(xml, /Ion &amp; Fiii &lt;SRL&gt;/);
  // ...si identic la citire. Asta e tot ce conteaza: 1C vede exact denumirea noastra.
  const dez = (t) => t.replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, "&");
  assert.equal(dez(cheiDinXml(xml)[0][1]), nume);
});

test("XML: caracterele de control sint SCOASE, nu escapate", () => {
  // `&#1;` nu e valid in XML 1.0 nici escapat: un parser strict refuza fisierul INTREG,
  // iar 1C nu spune pe ce rand. Se curata la sursa.
  const xml = xmlDin(
    [{ cod: "2000000000002", denumire: `Ana${String.fromCharCode(1)}Maria`, persoanaFizica: true }], { acum: ACUM });
  parseaza(xml);
  assert.equal(cheiDinXml(xml)[0][1], "AnaMaria");
  assert.ok(!/&#\d+;/.test(xml), "nicio referinta numerica de caracter de control");
});

test("XML: U+FFFE, U+FFFF si surogatele orfane nu rup fisierul; emoji-ul valid ramane", () => {
  // Gasit de verificarea de securitate. Nu e un caz teoretic: astea apar din copy-paste
  // dintr-un fisier stricat sau din taierea unui sir la mijlocul unei perechi de surogate.
  // Escaparea NU ajuta — `&#xFFFF;` e la fel de invalid ca octetul brut — iar parserul
  // respinge FISIERUL INTREG, nu randul. 1C nu spune pe ce pozitie.
  const C = (n) => String.fromCharCode(n);
  const cazuri = [
    ["Ana" + C(0xfffe) + "Maria" + C(0xffff), "AnaMaria"],
    ["Ion" + C(0xd800) + "Pop", "IonPop"],                 // surogat de sus, orfan
    ["Ion" + C(0xdc00) + "Pop", "IonPop"],                 // surogat de jos, orfan
    ["Agro " + String.fromCodePoint(0x1f33e) + " SRL",
     "Agro " + String.fromCodePoint(0x1f33e) + " SRL"],    // pereche VALIDA: se pastreaza
    ["A" + C(1) + C(27) + "B", "AB"],
    ["A" + C(9) + "B", "A" + C(9) + "B"]                   // TAB e admis de XML
  ];
  const xml = construiesteXmlFurnizori(
    cazuri.map(([intrare], i) => ({
      cod: "200000000000" + i, denumire: intrare, persoanaFizica: true
    })),
    { acum: ACUM }
  );
  parseaza(xml);
  assert.deepEqual(
    cheiDinXml(xml).map((k) => k[1]),
    cazuri.map(([, asteptat]) => asteptat)
  );
});

test("XML: fara cod fiscal sau fara denumire, furnizorul NU se exporta", () => {
  // Fara cod, 1C nu l-ar putea lega de nimic: ar intra ca furnizor nou, nepotrivit cu
  // niciun act. Fara denumire, cheia e incompleta. Aceeasi regula ca la CSV.
  const xml = xmlDin([
    { cod: "", denumire: "Fara cod", persoanaFizica: true },
    { cod: "   ", denumire: "Doar spatii", persoanaFizica: true },
    { cod: "2000000000003", denumire: "", persoanaFizica: true },
    { cod: "2000000000004", denumire: "Bun", persoanaFizica: true }
  ], { acum: ACUM });
  parseaza(xml);
  assert.deepEqual(cheiDinXml(xml), [["2000000000004", "Bun"]]);
  // Numerotarea ramane densa: 1 pentru singurul exportat, nu 4.
  assert.match(xml, /<Объект Нпп="1"/);
  assert.ok(!xml.includes('Нпп="2"'), "numerele nu sar peste randurile sarite");
});

test("XML: un fisier prea mare e REFUZAT cu mesaj, nu lasat sa cada pe platforma", () => {
  // Masurat: ~3.400 octeti per furnizor, deci plafonul de 4,5 MB al raspunsului serverless
  // se atinge pe la 1.330. Pe calea normala `MAX_IDS_1C` tine, dar `GET ?all=1&format=xml`
  // o ocoleste. Eroarea platformei e opaca; asta spune ce sa faci.
  const prea = Array.from({ length: MAX_FURNIZORI_XML + 1 }, (_, i) => ({
    cod: String(2000000000000 + i), denumire: `F${i}`, persoanaFizica: true
  }));
  assert.throws(() => construiesteXmlFurnizori(prea, { acum: ACUM }), /Prea multi furnizori/);
  // Exact la plafon trece.
  const laLimita = prea.slice(0, MAX_FURNIZORI_XML);
  const xml = construiesteXmlFurnizori(laLimita, { acum: ACUM });
  parseaza(xml);
  assert.equal(cheiDinXml(xml).length, MAX_FURNIZORI_XML);
});

test("XML: numele si tipurile de proprietati raman intacte dupa ce nu mai sint escapate", () => {
  // Escaparea a fost scoasa de pe LITERALI (41% din timpul de constructie). Daca cineva pune
  // vreodata acolo o valoare din date, testul asta nu-l prinde — dar prinde o stricare
  // accidentala a numelor, care ar face fisierul de necitit pentru 1C.
  const xml = xmlDin(
    [{ cod: "2000000000001", denumire: "X", persoanaFizica: true }], { acum: ACUM });
  for (const nume of ["ФискКод", "Наименование", "ВидКонтрагента", "ЮрАдрес", "Телефоны"]) {
    assert.ok(xml.includes(`Имя="${nume}"`), `lipseste proprietatea ${nume}`);
  }
  assert.ok(!xml.includes("&amp;quot;"), "numele nu trebuie sa fie dublu-escapate");
});

test("XML: data e LOCALA, nu UTC", () => {
  // `toISOString()` ar da UTC: in Moldova un export de la 01:00 ar cadea in ziua precedenta.
  assert.equal(dataLocala1c(new Date(2026, 0, 2, 1, 5, 9)), "2026-01-02T01:05:09");
  const xml = xmlDin(
    [{ cod: "2000000000005", denumire: "X", persoanaFizica: true }], { acum: new Date(2026, 0, 2, 1, 5, 9) });
  assert.match(xml, /ДатаВыгрузки="2026-01-02T01:05:09"/);
});

test("XML: fisierul poarta regulile de conversie, cu acelasi Id ca in antet", () => {
  // Fara reguli, 1C nu stie sa interpreteze obiectele; cu alt Id, refuza fisierul.
  const xml = xmlDin(
    [{ cod: "2000000000006", denumire: "X", persoanaFizica: true }], { acum: ACUM });
  const idAntet = xml.match(/ИдПравилКонвертации="([^"]+)"/)[1];
  const idReguli = xml.match(/<ПравилаОбмена>[\s\S]*?<Ид>([^<]+)<\/Ид>/)[1];
  assert.equal(idAntet, idReguli);
  assert.ok(idAntet.length > 10, "Id-ul regulilor nu poate fi gol");
  assert.match(xml, /<ПравилаКонвертацииОбъектов>/);
});

test("XML: BOM si radacina, ca in exportul real al lui 1C", () => {
  const xml = xmlDin(
    [{ cod: "2000000000007", denumire: "X", persoanaFizica: true }], { acum: ACUM });
  assert.equal(xml.charCodeAt(0), 0xfeff, "fara BOM, unele versiuni citesc fisierul ca ANSI");
  assert.match(xml, /^﻿<\?xml version="1\.0" encoding="UTF-8"\?>/);
  assert.match(xml, /<ФайлОбмена ВерсияФормата="2\.0"/);
  assert.match(xml, /<\/ФайлОбмена>\n$/);
});

test("XML: o lista goala da un fisier valid, nu o eroare", () => {
  // Lista goala = „nu e nimic de incarcat", caz normal. Diferit de „am cerut 10 si n-a
  // iesit niciunul", care e invarianta de mai jos.
  const { xml, scrise, sarite } = construiesteXmlFurnizori([], { acum: ACUM });
  parseaza(xml);
  assert.deepEqual(cheiDinXml(xml), []);
  assert.equal(scrise, 0);
  assert.equal(sarite, 0);
});

test("XML: un fisier VALID SI GOL e refuzat — e rezultatul cel mai periculos", () => {
  // 1C il importa fara sa se planga (n-are ce importa), omul apasa „Am incarcat in 1C",
  // iar furnizorii ies DEFINITIV din coada fara sa fi ajuns vreodata acolo. Actele lor
  // raman apoi fara contraparte. Garda trebuie sa cada ZGOMOTOS.
  assert.throws(
    () => construiesteXmlFurnizori(
      [{ cod: "", denumire: "Fara cod" }, { cod: "2000000000001", denumire: "" }],
      { acum: ACUM }
    ),
    /Niciun furnizor nu a putut fi scris/
  );
});

test("XML: rindurile sarite se NUMARA, nu dispar tacut", () => {
  const r = construiesteXmlFurnizori([
    { cod: "2000000000001", denumire: "Bun", persoanaFizica: true },
    { cod: "", denumire: "Fara cod", persoanaFizica: true },
    { cod: "2000000000002", denumire: "", persoanaFizica: true }
  ], { acum: ACUM });
  assert.equal(r.scrise, 1);
  assert.equal(r.sarite, 2);
});

test("XML: un nume de proprietate care NU e literal e refuzat", () => {
  // Escaparea a fost scoasa de pe `nume`/`tip` din motive de performanta — sint literali.
  // Asertiunea e ce tine locul escaparii: prima proprietate dinamica ar deschide injectie
  // directa in atribut, iar testul asta o prinde la prima rulare.
  const { verificaNumeLiteral } = require("../src/export-1c-xml");
  assert.throws(() => verificaNumeLiteral('x" Имя="EVIL', "Строка"), /invalid pentru XML/);
  assert.throws(() => verificaNumeLiteral("Bun", "<Tip>"), /invalid pentru XML/);
  assert.doesNotThrow(() => verificaNumeLiteral("ФискКод", "Строка"));
});

test("XML: intrari invalide nu arunca", () => {
  // Apelantul e un handler: o exceptie acolo devine 400 fara explicatie utila.
  for (const rau of [null, undefined, "text", 7, {}]) {
    assert.doesNotThrow(() => construiesteXmlFurnizori(rau, { acum: ACUM }));
  }
  assert.doesNotThrow(() => construiesteXmlFurnizori([null, undefined, {}], { acum: ACUM }));
});

test("escaparea acopera toate cele cinci caractere XML", () => {
  assert.equal(esc(`&<>"'`), "&amp;&lt;&gt;&quot;&apos;");
  // Ordinea conteaza: ampersandul PRIMUL, altfel `&lt;` ar deveni `&amp;lt;`.
  assert.equal(esc("<"), "&lt;");
  assert.equal(esc(null), "");
  assert.equal(curataControl(null), "");
});

// ---------------------------------------------------------------------------
// Capatul de sus: exportul real, prin magazie, in ambele formate.
// ---------------------------------------------------------------------------

const TARIFFS = [{ service: "Uscare", value: 10, active: true }];
const PF = {
  isNaturalPerson: true, series: "AP", companyId: 1, actorRole: "admin", changedBy: "admin",
  supplier: { name: "Furnizor Testov", idno: "2000000000001", address: "s. Testeni" },
  company: { name: "AgroProfit SRL", idno: "1003600000000" }
};

async function receptieEmisa(storage) {
  await storage.updateConfigEntry("partners", 1, {
    name: "Furnizor Testov", idno: "2000000000001", address: "s. Testeni",
    role: "furnizor", fiscalProfile: "Persoana fizica",
    changeReason: "test", changedBy: "admin"
  });
  await storage.updateConfigEntry("fiscalProfiles", 1, {
    name: "Persoana fizica", withholdingPercent: 6, vat: false, active: true,
    changeReason: "test", changedBy: "admin"
  });
  const est = computeReceiptEstimate({
    quantity: 2.907, price: 6.15, humidity: 14, impurity: 2,
    product: { humidityNorm: 14, impurityNorm: 2 },
    tariffs: TARIFFS, fiscalProfile: { withholdingPercent: 6 }
  });
  const r = await storage.createReceipt({
    supplier: "Furnizor Testov", supplierId: 1, product: "Floarea soarelui", productId: 1,
    quantity: 2.907, grossQuantity: 2.907, unit: "tone", price: 6.15,
    location: "Cilindru 1", locationId: 1, ...est
  });
  await storage.assignActNumber([r.id], PF);
  return r;
}

test("XML si CSV scot ACELASI continut, in forme diferite", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    await receptieEmisa(storage);
    const { rows } = await storage.exportSuppliersFor1c({});
    assert.equal(rows.length, 1);
    // Bugul reparat: 1C foloseste „Организация", nu „ЮридическоеЛицо".
    assert.equal(rows[0]["Tip contraparte"], "ЧастноеЛицо");

    const xml = construiesteXmlFurnizori(
      rows.map((r) => ({
        cod: r["Cod fiscal / IDNP"],
        denumire: r.Denumire,
        persoanaFizica: r["Tip contraparte"] === "ЧастноеЛицо",
        adresa: r["Adresa juridica"],
        telefon: r.Telefon
      })),
      { acum: ACUM }
    );
    parseaza(xml);
    assert.deepEqual(cheiDinXml(xml), [["2000000000001", "Furnizor Testov"]]);
    assert.match(xml, /<Значение>s\. Testeni<\/Значение>/);
  });
});
