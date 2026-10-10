const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const {
  construiesteXmlActe, MAX_ACTE_XML, MAX_RANDURI_XML, guidDocument
} = require("../src/export-1c-acte");

const REGULI = fs.readFileSync(
  path.join(__dirname, "..", "src", "1c", "reguli-schimb.xml"), "utf8"
).trim();

const GRAU = "c136b69a-13bf-11ed-811f-2cfda1bbfecf";
const PORUMB = "c4fe64ee-a3fc-11eb-8111-2cfda1bbfecf";

const act = (o = {}) => Object.assign({
  numar: 1, serie: "AA", data: "2026-10-12", companyId: 1,
  furnizor: "Furnizor Testov", codFiscal: "2000000000001", temei: "Grau",
  total: 1000, impozit: 60,
  randuri: [{ guidProdus: GRAU, cantitateKg: 100, suma: 1000 }]
}, o);

const fa = (acte) => construiesteXmlActe(acte, { reguli: REGULI });

// Bine format: fiecare eticheta deschisa se inchide, in ordine.
function parseaza(xml) {
  const stiva = [];
  const re = /<(\/?)([^\s/>]+)([^>]*?)(\/?)>/g;
  let m;
  while ((m = re.exec(xml.replace(/^﻿/, "")))) {
    const [, inchidere, nume, , auto] = m;
    if (nume.startsWith("?") || nume.startsWith("!") || auto) continue;
    if (inchidere) assert.equal(stiva.pop(), nume, `eticheta inchisa gresit: ${nume}`);
    else stiva.push(nume);
  }
  assert.equal(stiva.length, 0, `etichete ramase deschise: ${stiva.join(", ")}`);
}

test("actul poarta seria, numarul si cifrele date", () => {
  const { xml, scrise } = fa([act()]);
  parseaza(xml);
  assert.equal(scrise, 1);
  assert.match(xml, /Имя="СерияСФ"[\s\S]{0,60}<Значение>AA</);
  assert.match(xml, /Имя="НомерСФ"[\s\S]{0,60}<Значение>1</);
  assert.match(xml, /Имя="СуммаДокумента"[\s\S]{0,60}<Значение>1000\.00</);
  // `Сумма` e BRUTUL, `СуммаПН` impozitul retinut din el — ca in exportul real al 1C.
  assert.match(xml, /Имя="СуммаПН"[\s\S]{0,60}<Значение>60\.00</);
});

test("`$` din date NU mai evadeaza din document", () => {
  // `String.replace` cu un SIR interpreteaza `$&`, `` $` ``, `$'`. Masurat inainte de
  // reparatie: un furnizor numit `` $` `` repetat umfla actul de 16 ori si insera markup
  // XML neescapat in interiorul unui `<Значение>`.
  const normal = fa([act()]).xml.length;
  for (const rau of ["$`".repeat(16), "$&$&", "$'", "$1$2"]) {
    const xml = fa([act({ furnizor: rau })]).xml;
    parseaza(xml);
    assert.ok(xml.length < normal * 1.1, `${JSON.stringify(rau)} a umflat fisierul`);
    assert.ok(!/\{\{/.test(xml), "marcaj nesubstituit");
  }
});

test("un marcaj ajuns in date ramane TEXT, nu inlocuieste alt cimp", () => {
  // Doua etape de aparare.
  //
  // Intai: acoladele se neutralizeaza la SURSA. Nota unei receptii e scrisa de OPERATOR, iar
  // inainte un singur `{{TOTAL}}` acolo omora TOT lotul de acte, cu un mesaj care trimitea
  // contabilul sa caute in sablon. Acum textul se vede literal in 1C si nu se mai poate
  // transforma in marcaj.
  for (const rau of ["{{TOTAL}}", "{{NPP+5}}", "{{RANDURI}}"]) {
    const xml = fa([act({ furnizor: rau, temei: rau })]).xml;
    parseaza(xml);
    assert.ok(!/\{\{\w/.test(xml), `„${rau}" a format un marcaj`);
    // Escapate, nu sterse: in 1C nota se vede exact cum a scris-o omul.
    assert.match(xml, /&#123;&#123;/);
  }
});

test("garda finala ramane, pentru derivele sablonului", () => {
  // Daca vreodata sablonul capata un marcaj pe care codul nu-l completeaza, fisierul NU
  // pleaca. E ultima aparare, iar un document fiscal cu marcaje in el n-are voie sa ajunga
  // la contabilitate.
  const sursa = fs.readFileSync(
    path.join(__dirname, "..", "src", "export-1c-acte.js"), "utf8"
  );
  assert.match(sursa, /marcaje necompletate/, "garda finala a disparut");
});

test("data stricata nu rupe fisierul", () => {
  const xml = fa([act({ data: '"><a&z' })]).xml;
  parseaza(xml);
});

test("numerele de ordine sint UNICE pe fisier", () => {
  // In formatul de schimb `Нпп` e numarul obiectului in FISIER si prin el se rezolva
  // referintele. Repetand numerele din sablon, al doilea produs al unui act putea deveni
  // primul — document valid, importabil, gresit.
  const xml = fa([
    act({ numar: 1, randuri: [
      { guidProdus: GRAU, cantitateKg: 10, suma: 500 },
      { guidProdus: PORUMB, cantitateKg: 20, suma: 500 }] }),
    act({ numar: 2, randuri: [
      { guidProdus: PORUMB, cantitateKg: 30, suma: 500 },
      { guidProdus: GRAU, cantitateKg: 40, suma: 500 }] })
  ]).xml;
  parseaza(xml);
  const corp = xml.slice(xml.indexOf("</ПравилаОбмена>"));
  // OBIECTELE trebuie sa aiba numere unice. REFERINTELE se repeta normal — in exportul real
  // al 1C sint 120 de referinte catre 35 de obiecte — fiindca mai multe cimpuri trimit catre
  // acelasi obiect. Nu se verifica unicitatea lor.
  const obiecte = [...corp.matchAll(/<Объект Нпп="(\d+)"/g)].map((m) => Number(m[1]));
  assert.equal(new Set(obiecte).size, obiecte.length, "numere de obiect repetate");
  // Si intervalele a doua acte nu se suprapun: altfel o referinta dintr-un act ar putea
  // nimeri un obiect din celalalt.
  const peAct = corp.split("<Объект ").slice(1)
    .map((b) => [...b.matchAll(/Нпп="(\d+)"/g)].map((m) => Number(m[1])));
  const [a1, a2] = peAct;
  assert.equal(a1.filter((n) => a2.includes(n)).length, 0, "intervalele a doua acte se suprapun");
  // Si fiecare rind isi pastreaza produsul.
  const prod = [...xml.matchAll(/ТМЦ1[\s\S]{0,200}?<Значение>([0-9a-f-]{36})</g)].map((m) => m[1]);
  assert.deepEqual(prod, [GRAU, PORUMB, PORUMB, GRAU]);
});

test("un act cu UN SINGUR produs nelegat se sare INTREG", () => {
  // Filtrand doar randul fara produs, actul pleca cu 2 randuri de 1000 lei sub un total de
  // 3000, iar impozitul calculat pe 3000. Document care se contrazice pe el insusi — exact
  // precedentul regulii 10, de data asta in fisierul care intra in contabilitate.
  const r = fa([act({
    numar: 7,
    total: 3000,
    randuri: [
      { guidProdus: GRAU, cantitateKg: 10, suma: 1000 },
      { guidProdus: "", cantitateKg: 10, suma: 1000 },
      { guidProdus: PORUMB, cantitateKg: 10, suma: 1000 }
    ]
  }), act({ numar: 8 })]);
  assert.equal(r.scrise, 1, "actul incomplet nu are voie sa plece partial");
  assert.equal(r.sarite, 1);
  assert.match(r.motive[0], /nelegate de nomenclatorul 1C/);
});

test("un produs nelegat de 1C sare actul, cu motiv", () => {
  // Un GUID inventat ar CREA un produs nou in 1C la fiecare import.
  const r = fa([act({ numar: 1 }), act({ numar: 2, randuri: [{ guidProdus: "", cantitateKg: 1, suma: 1 }] })]);
  assert.equal(r.scrise, 1);
  assert.equal(r.sarite, 1);
  assert.match(r.motive[0], /nelegate de nomenclatorul 1C/);
});

test("un fisier VALID SI GOL e refuzat", () => {
  // 1C il importa fara sa se planga, omul apasa „Am incarcat in 1C", iar actele ies
  // definitiv din coada fara sa fi ajuns acolo.
  assert.throws(
    () => fa([act({ randuri: [{ guidProdus: "", cantitateKg: 1, suma: 1 }] })]),
    /Niciun act nu a putut fi scris/
  );
});

test("plafoanele sint DUBLE: pe acte si pe randuri", () => {
  // Masurat: ~15 KB per act + ~3,5 KB per rind. Plafonul de 4,5 MB al platformei se atinge
  // la ~140 de acte cu cinci randuri. Un plafon doar pe acte n-ar ajunge.
  const multe = (n, r) => Array.from({ length: n }, (_, i) =>
    act({ numar: i + 1, randuri: Array.from({ length: r }, () => ({ guidProdus: GRAU, cantitateKg: 1, suma: 1 })) }));
  assert.throws(() => fa(multe(MAX_ACTE_XML + 1, 1)), /Prea multe acte/);
  assert.throws(() => fa(multe(10, Math.ceil((MAX_RANDURI_XML + 10) / 10))), /Prea multe rinduri/);
  // La plafon trece, si ramine sub limita platformei.
  const xml = fa(multe(MAX_ACTE_XML, 2)).xml;
  const mb = Buffer.byteLength(xml, "utf8") / 1048576;
  assert.ok(mb < 4.5, `${mb.toFixed(2)} MB depaseste limita platformei`);
});

test("identificatorul documentului e stabil si distinct", () => {
  // 1C potriveste documentele dupa identificator: unul aleator ar crea un document NOU la
  // fiecare reimport al aceluiasi act.
  assert.equal(guidDocument("act", 1, "AA", 1), guidDocument("act", 1, "AA", 1));
  assert.notEqual(guidDocument("act", 1, "AA", 1), guidDocument("act", 1, "AA", 2));
  assert.notEqual(guidDocument("act", 1, "AA", 1), guidDocument("act", 2, "AA", 1));
  assert.notEqual(guidDocument("act", 1, "AA", 1), guidDocument("plata", 1, "AA", 1));
  // Spatiile din serie nu schimba identificatorul: altfel „AA " si „AA" dadeau doua
  // documente in 1C pentru acelasi act.
  assert.equal(guidDocument("act", 1, " AA ", 1), guidDocument("act", 1, "AA", 1));
  assert.equal(guidDocument("act", 1, "aa", 1), guidDocument("act", 1, "AA", 1));
  const v = new Set();
  for (let i = 1; i <= 20000; i += 1) v.add(guidDocument("act", 1, "AA", i));
  assert.equal(v.size, 20000, "coliziune pe 20.000 de acte");
});

test("sablonul e urmarit de git si nu contine date personale", () => {
  // Fara urmarire, modulul cade cu ENOENT in PRODUCTIE, nu la deploy.
  for (const f of ["sablon-act.xml", "sablon-ordin-plata.xml"]) {
    const cale = path.join(__dirname, "..", "src", "1c", f);
    assert.ok(fs.existsSync(cale), `${f} lipseste`);
    const t = fs.readFileSync(cale, "utf8");
    // Un cod fiscal de 13 cifre ramas in sablon ar pleca pe fiecare act generat.
    const cifre = t.match(/(?<![0-9a-f-])\d{13}(?![0-9a-f-])/g);
    assert.equal(cifre, null, `${f} contine ce pare un cod fiscal: ${cifre}`);
  }
});
