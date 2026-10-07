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
