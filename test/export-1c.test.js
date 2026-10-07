const test = require("node:test");
const assert = require("node:assert/strict");

const { withIsolatedWorkspace } = require("../test-support/isolated-runtime");
const { computeReceiptEstimate } = require("../src/receipt-handlers");

const TARIFFS = [{ service: "Uscare", value: 10, active: true }];
const PF = {
  isNaturalPerson: true, series: "AP", companyId: 1, actorRole: "admin", changedBy: "admin",
  supplier: { name: "Anghelus Ruslan", idno: "0960612543420", address: "s. Briceni" },
  company: { name: "AgroProfit SRL", idno: "1003600000000" }
};

async function receptieEmisa(storage, { kg = 2907, pret = 6.15 } = {}) {
  // Partenerul din nomenclator e cel pe care il citeste exportul de furnizori: trebuie sa
  // fie acelasi cu cel de pe act, altfel 1C n-ar putea lega actul de furnizor.
  await storage.updateConfigEntry("partners", 1, {
    name: "Anghelus Ruslan", idno: "0960612543420", address: "s. Briceni",
    role: "furnizor", fiscalProfile: "Persoana fizica",
    changeReason: "test", changedBy: "admin"
  });
  // Cota din nomenclator = cea folosita la estimare (6%), ca actul si plata sa coincida.
  await storage.updateConfigEntry("fiscalProfiles", 1, {
    name: "Persoana fizica", withholdingPercent: 6, vat: false, active: true,
    changeReason: "test", changedBy: "admin"
  });
  const est = computeReceiptEstimate({
    quantity: kg / 1000, price: pret, humidity: 14, impurity: 2,
    product: { humidityNorm: 14, impurityNorm: 2 },
    tariffs: TARIFFS, fiscalProfile: { withholdingPercent: 6 }
  });
  const r = await storage.createReceipt({
    supplier: "Anghelus Ruslan", supplierId: 1, product: "Floarea soarelui", productId: 1,
    quantity: kg / 1000, grossQuantity: kg / 1000, unit: "tone", price: pret,
    location: "Cilindru 1", locationId: 1, ...est
  });
  await storage.assignActNumber([r.id], PF);
  return r;
}

test("exportul pentru 1C se inchide aritmetic pe fiecare rand", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    await receptieEmisa(storage);

    const { columns, rows } = await storage.exportPurchaseActsFor1c({});
    assert.equal(rows.length, 1);
    const r = rows[0];

    // Cantitate x pret = valoare (relatia afirmata pe act).
    const kg = Number(r["Cantitate (kg)"]);
    const pret = Number(r["Pret (lei/kg)"]);
    const valoare = Number(r["Valoare (lei)"]);
    assert.ok(Math.abs(kg * pret - valoare) < 0.01, `${kg} x ${pret} != ${valoare}`);

    // Valoare - impozit = spre plata.
    const impozit = Number(r["Impozit retinut (lei)"]);
    const plata = Number(r["Spre plata (lei)"]);
    assert.ok(Math.abs(valoare - impozit - plata) < 0.01, "valoare - impozit != spre plata");

    // Impozitul e 6% din valoare, ca in ordinul de plata real (8090,43 x 6% = 485,43).
    assert.ok(Math.abs(impozit - valoare * 0.06) < 0.01);

    // Identificarea furnizorului: 1C potriveste dupa cod fiscal.
    assert.equal(r.Furnizor, "Anghelus Ruslan");
    assert.equal(r["Cod fiscal / IDNP"], "0960612543420");
    assert.equal(r["Seria act"], "AP");
    assert.equal(Number(r["Nr. act"]), 914);
    assert.equal(r.Unitate, "kg");
    assert.ok(columns.includes("Nr. recepție"));
  });
});

test("se exporta DOAR actele emise, si doar o data per act", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    // Act pe DOUA receptii: un singur act, doua randuri, nu doua acte.
    const est = computeReceiptEstimate({
      quantity: 1, price: 6, humidity: 14, impurity: 2,
      product: { humidityNorm: 14, impurityNorm: 2 },
      tariffs: TARIFFS, fiscalProfile: { withholdingPercent: 6 }
    });
    const comun = {
      supplier: "Anghelus Ruslan", supplierId: 1, product: "Grau", productId: 1,
      quantity: 1, grossQuantity: 1, unit: "tone", price: 6,
      location: "Cilindru 1", locationId: 1, ...est
    };
    const a = await storage.createReceipt(comun);
    const b = await storage.createReceipt(comun);
    await storage.assignActNumber([a.id, b.id], PF);

    // O receptie FARA act emis: nu are ce caută in contabilitate.
    await storage.createReceipt(comun);

    const { rows } = await storage.exportPurchaseActsFor1c({});
    assert.equal(rows.length, 2, "actul de doua receptii trebuie sa dea doua randuri");
    assert.equal(new Set(rows.map((r) => r["Nr. act"])).size, 1, "acelasi numar de act");
  });
});

test("cifrele exportate sunt cele INGHEȚATE, nu recalculul de acum", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const r = await receptieEmisa(storage);
    const inainte = (await storage.exportPurchaseActsFor1c({})).rows[0];

    // Contabilul corecteaza suma DUPA emiterea actului.
    await storage.updateReceiptAmount(r.id, Number(inainte["Valoare (lei)"]) * 2, "admin", "corectie");

    const dupa = (await storage.exportPurchaseActsFor1c({})).rows[0];
    assert.equal(
      dupa["Valoare (lei)"], inainte["Valoare (lei)"],
      "exportul a plecat de sub hartia semnata"
    );
  });
});

test("filtrarea pe perioada", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    await receptieEmisa(storage);
    const azi = new Date().toISOString().slice(0, 10);
    assert.equal((await storage.exportPurchaseActsFor1c({ from: azi, to: azi })).rows.length, 1);
    assert.equal((await storage.exportPurchaseActsFor1c({ from: "2020-01-01", to: "2020-12-31" })).rows.length, 0);
  });
});

test("exportul de furnizori scoate doar cei NOI, dupa marcare nu mai apar", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const CONT = { currentUser: { roleCode: "accountant" }, changedBy: "contabil" };
    await receptieEmisa(storage);

    // Prima descarcare: furnizorul e nou.
    let r = await storage.exportSuppliersFor1c({});
    assert.equal(r.rows.length, 1);
    assert.equal(r.rows[0]["Cod fiscal / IDNP"], "0960612543420");
    assert.equal(r.rows[0]["Tip contraparte"], "ЧастноеЛицо");

    // Marcat ca incarcat in 1C -> nu mai apare.
    const m = await storage.markSuppliersExported1c({ ...CONT, partnerIds: [r.rows[0]._id] });
    assert.equal(m.marked.length, 1);
    assert.equal((await storage.exportSuppliersFor1c({})).rows.length, 0);

    // Dar se poate reincarca explicit, daca importul in 1C a cazut.
    assert.equal((await storage.exportSuppliersFor1c({ onlyNew: false })).rows.length, 1);
  });
});

test("furnizorul fara cod fiscal nu se exporta", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const est = computeReceiptEstimate({
      quantity: 1, price: 6, humidity: 14, impurity: 2,
      product: { humidityNorm: 14, impurityNorm: 2 },
      tariffs: TARIFFS, fiscalProfile: { withholdingPercent: 6 }
    });
    const r = await storage.createReceipt({
      supplier: "Fara cod", supplierId: 1, product: "Grau", productId: 1,
      quantity: 1, grossQuantity: 1, unit: "tone", price: 6,
      location: "Cilindru 1", locationId: 1, ...est
    });
    // Furnizor fara IDNO in nomenclator.
    await storage.updateConfigEntry("partners", 1, {
      name: "Fara cod", idno: "", role: "furnizor", fiscalProfile: "Persoana fizica",
      changeReason: "test", changedBy: "admin"
    });
    await storage.assignActNumber([r.id], { ...PF, supplier: { name: "Fara cod", idno: "" } });

    const out = await storage.exportSuppliersFor1c({});
    assert.equal(out.rows.length, 0, "un furnizor fara cod fiscal nu are cum sa fie potrivit in 1C");
  });
});

test("marcarea cere drept financiar si lista valida", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    await receptieEmisa(storage);
    for (const rol of ["operator", "control", undefined]) {
      await assert.rejects(
        () => storage.markSuppliersExported1c({
          currentUser: { roleCode: rol }, partnerIds: [1], changedBy: "x"
        }),
        /contabilul/i,
        `rolul ${rol} nu trebuia sa poata`
      );
    }
    const CONT = { currentUser: { roleCode: "accountant" }, changedBy: "contabil" };
    for (const rea of [[], [true], [0], [-1]]) {
      await assert.rejects(
        () => storage.markSuppliersExported1c({ ...CONT, partnerIds: rea }),
        /invalida/i
      );
    }
  });
});

test("codul fiscal schimbat dupa emitere e SEMNALAT in export", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    await receptieEmisa(storage);

    // Codul fiscal se corecteaza in nomenclator DUPA emiterea actului.
    await storage.updateConfigEntry("partners", 1, {
      name: "Anghelus Ruslan", idno: "0960612543999", address: "s. Briceni",
      role: "furnizor", fiscalProfile: "Persoana fizica",
      changeReason: "corectie IDNP", changedBy: "admin"
    });

    const r = (await storage.exportPurchaseActsFor1c({})).rows[0];
    // Se exporta codul CURENT (cu care furnizorul intra in 1C), ca actul sa se lege.
    assert.equal(r["Cod fiscal / IDNP"], "0960612543999");
    // Si se spune explicit ca hartia semnata are alt cod.
    assert.match(r["Observatii export"], /pe actul semnat codul fiscal e 0960612543420/);
  });
});

test("ordinul de plata: suma e BRUTA, impozitul se retine din ea", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    await receptieEmisa(storage);
    const r = (await storage.listReceipts())[0];

    // Plata efectiva = suma neta din registru (ce iese din casa).
    const net = Number(r.amountToPay ?? r.preliminaryPayableAmount);
    await storage.createTransaction({
      referenceType: "receipt", receiptId: r.id, partnerId: 1, supplierId: 1,
      partner: "Anghelus Ruslan", direction: "payment", amount: net, note: "plata cereale"
    });

    const out = await storage.exportPaymentsFor1c({});
    assert.equal(out.rows.length, 1);
    const p = out.rows[0];

    const brut = Number(p["Suma bruta (lei)"]);
    const impozit = Number(p["Impozit retinut (lei)"]);
    const numerar = Number(p["De plata in numerar (lei)"]);

    // Ca in ordinul de plata real: brut − impozit = numerar, iar impozitul e 6% din brut.
    assert.ok(Math.abs(brut - impozit - numerar) < 0.02, `${brut} - ${impozit} != ${numerar}`);
    assert.ok(Math.abs(impozit - brut * 0.06) < 0.02, "impozitul nu e 6% din brut");
    assert.equal(numerar.toFixed(2), net.toFixed(2));

    // Conturile citite din exportul real.
    assert.equal(p["Cont casa"], "241.1");
    assert.equal(p["Cont furnizor"], "544.32");
    assert.equal(p["Cont impozit"], "534.3");
    // Actul care justifica datoria.
    assert.equal(p["Acte acoperite"], "AP 914");
    assert.equal(p["Cod fiscal / IDNP"], "0960612543420");
  });
});

test("storno si realocarea de avans NU intra in export", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    await receptieEmisa(storage);
    const r = (await storage.listReceipts())[0];
    const comun = {
      referenceType: "receipt", receiptId: r.id, partnerId: 1, supplierId: 1,
      partner: "Anghelus Ruslan", direction: "payment", amount: 1000
    };
    const t = await storage.createTransaction(comun);
    // Realocare de avans: nu sunt bani noi, ar dubla plata in contabilitate.
    await storage.createTransaction({ ...comun, source: "advance-applied" });
    assert.equal((await storage.exportPaymentsFor1c({})).rows.length, 1);

    // Storno: plata anulata nu mai e plata.
    await storage.updateTransaction(t.id, {
      status: "Anulat", changeReason: "storno", changedBy: "admin"
    });
    assert.equal((await storage.exportPaymentsFor1c({})).rows.length, 0);
  });
});

test("conturile se iau din setari, nu din cod", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    await storage.updateSystemSettings({
      account1cCash: "242.1", account1cSupplier: "521.1", account1cTax: "534.9",
      changeReason: "alt plan de conturi", changedBy: "admin"
    });
    await receptieEmisa(storage);
    const r = (await storage.listReceipts())[0];
    await storage.createTransaction({
      referenceType: "receipt", receiptId: r.id, partnerId: 1, supplierId: 1,
      partner: "Anghelus Ruslan", direction: "payment", amount: 100
    });
    const p = (await storage.exportPaymentsFor1c({})).rows[0];
    assert.equal(p["Cont casa"], "242.1");
    assert.equal(p["Cont furnizor"], "521.1");
    assert.equal(p["Cont impozit"], "534.9");

    // O salvare care nu menționează conturile nu are voie sa le piarda.
    await storage.updateSystemSettings({ closeOfDayHour: 18, changeReason: "alt camp", changedBy: "admin" });
    assert.equal((await storage.getConfig()).systemSettings.account1cCash, "242.1");
  });
});

test("cota se ia de pe RECEPTIE, nu din nomenclatorul de acum", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    await receptieEmisa(storage);
    const r = (await storage.listReceipts())[0];
    const net = Number(r.amountToPay);
    await storage.createTransaction({
      referenceType: "receipt", receiptId: r.id, partnerId: 1, supplierId: 1,
      partner: "Anghelus Ruslan", direction: "payment", amount: net
    });

    // Cota se SCHIMBA in nomenclator DUPA ce marfa a intrat si s-a plătit.
    await storage.updateConfigEntry("fiscalProfiles", 1, {
      name: "Persoana fizica", withholdingPercent: 12, vat: false, active: true,
      changeReason: "cota noua", changedBy: "admin"
    });

    const p = (await storage.exportPaymentsFor1c({})).rows[0];
    // Se foloseste cota de pe receptie (6%), nu cea noua (12%): altfel impozitul din
    // ordinul de plata n-ar coincide cu cel de pe actul semnat.
    assert.equal(p["Cota impozit (%)"], "6");
    const brut = Number(p["Suma bruta (lei)"]);
    assert.ok(Math.abs(brut - Number(r.preliminaryMerchandiseValue)) < 0.02,
      "brutul din plata nu coincide cu valoarea de pe act");
    // Si divergenta se semnaleaza, ca sa nu treaca neobservata.
    assert.match(p["Observatii export"], /cota de pe receptie e 6%, in nomenclator e 12%/);
  });
});

// Scenariul descris de utilizator: s-a incarcat ziua de azi, apoi depozitarul a mai facut
// receptii dupa ora 17. A doua zi trebuie sa apara DOAR cele neincarcate — fara dubluri si
// fara sa rămână ceva pe dinafara.
test("documentele facute dupa incarcare apar la urmatorul export, fara dubluri", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const CONT = { currentUser: { roleCode: "accountant" }, changedBy: "contabil" };

    await receptieEmisa(storage);
    let deIncarcat = await storage.listPending1c({ kind: "receipts" });
    assert.equal(deIncarcat.length, 1, "primul act trebuie sa apara");

    // Contabilul il incarca in 1C si marcheaza.
    await storage.setExported1c({ ...CONT, kind: "receipts", ids: [deIncarcat[0].id] });
    assert.equal((await storage.listPending1c({ kind: "receipts" })).length, 0);
    assert.equal((await storage.exportPurchaseActsFor1c({})).rows.length, 0,
      "un act deja incarcat nu are voie sa reapara");

    // Depozitarul face o receptie DUPA incarcare, in ACEEASI zi.
    const est = computeReceiptEstimate({
      quantity: 1, price: 6, humidity: 14, impurity: 2,
      product: { humidityNorm: 14, impurityNorm: 2 },
      tariffs: TARIFFS, fiscalProfile: { withholdingPercent: 6 }
    });
    const tarziu = await storage.createReceipt({
      supplier: "Anghelus Ruslan", supplierId: 1, product: "Grau", productId: 1,
      quantity: 1, grossQuantity: 1, unit: "tone", price: 6,
      location: "Cilindru 2", locationId: 2, ...est
    });
    await storage.assignActNumber([tarziu.id], PF);

    // A doua zi: apare DOAR actul nou, desi e din aceeasi zi calendaristica.
    deIncarcat = await storage.listPending1c({ kind: "receipts" });
    assert.equal(deIncarcat.length, 1);
    assert.equal(deIncarcat[0].id, tarziu.id);
    const out = await storage.exportPurchaseActsFor1c({});
    assert.equal(out.rows.length, 1);
    assert.equal(Number(out.rows[0]["Nr. act"]), 915);
  });
});

test("se pot alege DOAR documentele dorite", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    await receptieEmisa(storage);
    const est = computeReceiptEstimate({
      quantity: 1, price: 6, humidity: 14, impurity: 2,
      product: { humidityNorm: 14, impurityNorm: 2 },
      tariffs: TARIFFS, fiscalProfile: { withholdingPercent: 6 }
    });
    for (let i = 0; i < 2; i += 1) {
      // Locatii distincte: o locatie = un singur produs (regula de business).
      const r = await storage.createReceipt({
        supplier: "Anghelus Ruslan", supplierId: 1, product: `Grau ${i}`, productId: 2 + i,
        quantity: 1, grossQuantity: 1, unit: "tone", price: 6,
        location: `Cilindru ${2 + i}`, locationId: 2 + i, ...est
      });
      await storage.assignActNumber([r.id], PF);
    }
    const toate = await storage.listPending1c({ kind: "receipts" });
    assert.equal(toate.length, 3);

    // Doar al doilea.
    const alese = [toate[1].id];
    const out = await storage.exportPurchaseActsFor1c({ receiptIds: alese });
    assert.equal(out.rows.length, 1);
    assert.equal(out.rows[0]._id, alese[0]);
  });
});

test("marcajul se poate ANULA, pentru reincarcarea unui document corectat", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const CONT = { currentUser: { roleCode: "accountant" }, changedBy: "contabil" };
    await receptieEmisa(storage);
    const id = (await storage.listPending1c({ kind: "receipts" }))[0].id;

    await storage.setExported1c({ ...CONT, kind: "receipts", ids: [id] });
    assert.equal((await storage.listPending1c({ kind: "receipts" })).length, 0);

    // Anularea marcajului: documentul revine in export.
    const r = await storage.setExported1c({ ...CONT, kind: "receipts", ids: [id], reset: true });
    assert.equal(r.changed.length, 1);
    assert.equal((await storage.listPending1c({ kind: "receipts" })).length, 1);

    // Si urma in audit, pe ambele.
    const logs = await storage.listAuditLogs();
    assert.ok(logs.some((l) => l.action === "marked-1c"));
    assert.ok(logs.some((l) => l.action === "unmarked-1c"));
  });
});

test("potrivirea de pornire cu lista din 1C marcheaza doar ce exista acolo", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const CONT = { currentUser: { roleCode: "accountant" }, changedBy: "contabil" };
    await receptieEmisa(storage); // furnizor 1: 0960612543420
    await storage.createConfigEntry("partners", {
      name: "Furnizor nou", idno: "2009999999999", role: "furnizor",
      fiscalProfile: "Persoana fizica", changeReason: "t", changedBy: "admin"
    });

    // Lista din 1C are istoric: mai multi furnizori decat aplicatia, inclusiv unii
    // care nu sunt la noi. Potrivirea e 1C -> aplicatie, pe cod fiscal.
    const r = await storage.markSuppliersByFiscalCodes({
      ...CONT,
      fiscalCodes: ["0960612543420", "1111111111111", "2222222222222"]
    });
    assert.equal(r.matched.length, 1, "doar furnizorul care exista in 1C");
    assert.equal(r.matched[0].idno, "0960612543420");
    // Si ne spune ce NU e in 1C — exact ce trebuie incarcat la primul export.
    assert.equal(r.missing.length, 1);
    assert.equal(r.missing[0].idno, "2009999999999");

    // Exportul scoate acum doar furnizorul care lipseste din 1C.
    const out = await storage.exportSuppliersFor1c({ onlyFromActs: false });
    assert.equal(out.rows.length, 1);
    assert.equal(out.rows[0]["Cod fiscal / IDNP"], "2009999999999");
  });
});
