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
