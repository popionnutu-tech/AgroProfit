const test = require("node:test");
const assert = require("node:assert/strict");
const { withIsolatedWorkspace } = require("../test-support/isolated-runtime");
const { computeReceiptEstimate } = require("../src/receipt-handlers");

// Trecerea la seria AA: sirul reporneste de la 1, fara sa atinga numerele deja tiparite
// pe seria veche AP (1-913 pe hirtie, 914+ din aplicatie).

const TARIFFS = [{ service: "Uscare", value: 10, active: true }];
const BAZA = { isNaturalPerson: true, companyId: 1, actorRole: "admin", changedBy: "admin",
  supplier: { name: "Furnizor Testov", idno: "2000000000001" },
  company: { name: "Firma SRL", idno: "1003600000000" } };

async function receptie(storage, nume) {
  await storage.updateConfigEntry("partners", 1, {
    name: nume, idno: "2000000000001", role: "furnizor", fiscalProfile: "Persoana fizica",
    changeReason: "t", changedBy: "admin" });
  await storage.updateConfigEntry("fiscalProfiles", 1, {
    name: "Persoana fizica", withholdingPercent: 6, vat: false, active: true,
    changeReason: "t", changedBy: "admin" });
  const est = computeReceiptEstimate({ quantity: 1, price: 6, humidity: 14, impurity: 2,
    product: { humidityNorm: 14, impurityNorm: 2 }, tariffs: TARIFFS,
    fiscalProfile: { withholdingPercent: 6 } });
  return storage.createReceipt({ supplier: nume, supplierId: 1, product: "Grau", productId: 1,
    quantity: 1, grossQuantity: 1, unit: "tone", price: 6,
    location: "Cilindru 1", locationId: 1, ...est });
}

test("seria NOUA porneste de la 1, seria veche isi pastreaza sirul", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const AP = { ...BAZA, series: "AP" };
    const AA = { ...BAZA, series: "AA" };

    const r1 = await receptie(storage, "F1");
    const r2 = await receptie(storage, "F2");
    const r3 = await receptie(storage, "F3");
    const r4 = await receptie(storage, "F4");

    // Seria istorica: 1-913 sint pe hirtie, deci aplicatia continua de la 914.
    assert.equal((await storage.assignActNumber([r1.id], AP)).actNumber, 914);
    assert.equal((await storage.assignActNumber([r2.id], AP)).actNumber, 915);

    // Trecerea la AA: sir NOU, de la 1. Nu continua de la 916.
    assert.equal((await storage.assignActNumber([r3.id], AA)).actNumber, 1);
    assert.equal((await storage.assignActNumber([r4.id], AA)).actNumber, 2);
  });
});

test("intoarcerea la seria veche continua de unde a ramas, fara gaura", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const AP = { ...BAZA, series: "AP" };
    const AA = { ...BAZA, series: "AA" };
    const r = [];
    for (let i = 0; i < 4; i += 1) r.push(await receptie(storage, `F${i}`));

    assert.equal((await storage.assignActNumber([r[0].id], AP)).actNumber, 914);
    assert.equal((await storage.assignActNumber([r[1].id], AA)).actNumber, 1);
    assert.equal((await storage.assignActNumber([r[2].id], AA)).actNumber, 2);
    // Inapoi pe AP: 915, nu 3 si nu 916.
    assert.equal((await storage.assignActNumber([r[3].id], AP)).actNumber, 915);
  });
});

test("seria se compara fara sa conteze majusculele sau spatiile", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const r1 = await receptie(storage, "F1");
    const r2 = await receptie(storage, "F2");
    // „aa" si „ AA " sint aceeasi serie: altfel o scriere neglijenta in nomenclator ar
    // deschide un al doilea sir, iar pe hirtie ar aparea doua acte „AA 1".
    assert.equal((await storage.assignActNumber([r1.id], { ...BAZA, series: " aa " })).actNumber, 1);
    assert.equal((await storage.assignActNumber([r2.id], { ...BAZA, series: "AA" })).actNumber, 2);
  });
});
