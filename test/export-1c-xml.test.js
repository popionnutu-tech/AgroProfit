const test = require("node:test");
const assert = require("node:assert/strict");

const { withIsolatedWorkspace } = require("../test-support/isolated-runtime");
const { computeReceiptEstimate } = require("../src/receipt-handlers");
const { construiesteXmlFurnizori, esc, curataControl, dataLocala1c } =
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

test("XML: cheia e perechea cod fiscal + denumire, cum o cere 1C", () => {
  const xml = construiesteXmlFurnizori(
    [{ cod: "2000000000001", denumire: "Furnizor Testov", persoanaFizica: true }],
    { acum: ACUM }
  );
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
  const xml = construiesteXmlFurnizori(
    [{ cod: "1003600000000", denumire: "Agro SRL", persoanaFizica: false }],
    { acum: ACUM }
  );
  assert.match(xml, /<Значение>Организация<\/Значение>/);
  assert.ok(!xml.includes("ЮридическоеЛицо"), "valoarea inexistenta in 1C nu are ce cauta aici");
});

test("XML: caracterele speciale dintr-o denumire nu rup fisierul", () => {
  const nume = 'Ion & Fiii <SRL> "Agro" \'test\'';
  const xml = construiesteXmlFurnizori(
    [{ cod: "1003600000001", denumire: nume, persoanaFizica: false }],
    { acum: ACUM }
  );
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
  const xml = construiesteXmlFurnizori(
    [{ cod: "2000000000002", denumire: `Ana${String.fromCharCode(1)}Maria`, persoanaFizica: true }],
    { acum: ACUM }
  );
  parseaza(xml);
  assert.equal(cheiDinXml(xml)[0][1], "AnaMaria");
  assert.ok(!/&#\d+;/.test(xml), "nicio referinta numerica de caracter de control");
});

test("XML: fara cod fiscal sau fara denumire, furnizorul NU se exporta", () => {
  // Fara cod, 1C nu l-ar putea lega de nimic: ar intra ca furnizor nou, nepotrivit cu
  // niciun act. Fara denumire, cheia e incompleta. Aceeasi regula ca la CSV.
  const xml = construiesteXmlFurnizori([
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

test("XML: data e LOCALA, nu UTC", () => {
  // `toISOString()` ar da UTC: in Moldova un export de la 01:00 ar cadea in ziua precedenta.
  assert.equal(dataLocala1c(new Date(2026, 0, 2, 1, 5, 9)), "2026-01-02T01:05:09");
  const xml = construiesteXmlFurnizori(
    [{ cod: "2000000000005", denumire: "X", persoanaFizica: true }],
    { acum: new Date(2026, 0, 2, 1, 5, 9) }
  );
  assert.match(xml, /ДатаВыгрузки="2026-01-02T01:05:09"/);
});

test("XML: fisierul poarta regulile de conversie, cu acelasi Id ca in antet", () => {
  // Fara reguli, 1C nu stie sa interpreteze obiectele; cu alt Id, refuza fisierul.
  const xml = construiesteXmlFurnizori(
    [{ cod: "2000000000006", denumire: "X", persoanaFizica: true }],
    { acum: ACUM }
  );
  const idAntet = xml.match(/ИдПравилКонвертации="([^"]+)"/)[1];
  const idReguli = xml.match(/<ПравилаОбмена>[\s\S]*?<Ид>([^<]+)<\/Ид>/)[1];
  assert.equal(idAntet, idReguli);
  assert.ok(idAntet.length > 10, "Id-ul regulilor nu poate fi gol");
  assert.match(xml, /<ПравилаКонвертацииОбъектов>/);
});

test("XML: BOM si radacina, ca in exportul real al lui 1C", () => {
  const xml = construiesteXmlFurnizori(
    [{ cod: "2000000000007", denumire: "X", persoanaFizica: true }],
    { acum: ACUM }
  );
  assert.equal(xml.charCodeAt(0), 0xfeff, "fara BOM, unele versiuni citesc fisierul ca ANSI");
  assert.match(xml, /^﻿<\?xml version="1\.0" encoding="UTF-8"\?>/);
  assert.match(xml, /<ФайлОбмена ВерсияФормата="2\.0"/);
  assert.match(xml, /<\/ФайлОбмена>\n$/);
});

test("XML: o lista goala da un fisier valid, nu o eroare", () => {
  const xml = construiesteXmlFurnizori([], { acum: ACUM });
  parseaza(xml);
  assert.deepEqual(cheiDinXml(xml), []);
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
