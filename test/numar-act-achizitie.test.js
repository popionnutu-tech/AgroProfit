const test = require("node:test");
const assert = require("node:assert/strict");

const { withIsolatedWorkspace } = require("../test-support/isolated-runtime");

// Actele de DINAINTE de 02.10.2026 rămân nenumerotate (au numere scrise de mana pe hartie).
// Sirul porneste de la 914 — actul lui Cojocari Ana — si creste cu 1.
const START = 914;

async function receptie(storage, nume) {
  return storage.createReceipt({
    supplier: nume, supplierId: 1, product: "Floarea soarelui", productId: 1,
    quantity: 2.907, grossQuantity: 2.907, provisionalNetQuantity: 2.907,
    unit: "tone", price: 6.15, location: "Cilindru 1", locationId: 1
  });
}
const PF = { isNaturalPerson: true, series: "AP", actorRole: "admin", changedBy: "admin" };

test("primul act emis primeste 914, urmatorul 915", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const a = await receptie(storage, "Cojocari Ana");
    const b = await receptie(storage, "Alt furnizor");

    const unu = await storage.assignActNumber(a.id, PF);
    assert.equal(unu.actNumber, START);
    assert.equal(unu.actSeries, "AP");

    const doi = await storage.assignActNumber(b.id, PF);
    assert.equal(doi.actNumber, START + 1);
  });
});

test("reimprimarea da ACELASI numar, nu unul nou", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const a = await receptie(storage, "Cojocari Ana");
    const prima = await storage.assignActNumber(a.id, PF);
    for (let i = 0; i < 5; i += 1) {
      const iar = await storage.assignActNumber(a.id, PF);
      assert.equal(iar.actNumber, prima.actNumber, "numarul s-a schimbat la reimprimare");
    }
    // Un singur numar consumat: urmatorul act ia 915, nu 919.
    const b = await receptie(storage, "Alt furnizor");
    assert.equal((await storage.assignActNumber(b.id, PF)).actNumber, START + 1);
  });
});

test("numerele nu se repeta niciodata", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const numere = [];
    for (let i = 0; i < 12; i += 1) {
      const r = await receptie(storage, `Furnizor ${i}`);
      numere.push((await storage.assignActNumber(r.id, PF)).actNumber);
    }
    assert.equal(new Set(numere).size, numere.length, "un numar s-a repetat");
    assert.deepEqual(numere, numere.slice().sort((x, y) => x - y), "sirul nu e crescator");
    assert.equal(numere[0], START);
  });
});

test("achizitia de la FIRMA nu consuma numar", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const firma = await receptie(storage, "Agro SRL");
    await assert.rejects(
      () => storage.assignActNumber(firma.id, { ...PF, isNaturalPerson: false }),
      /persoane fizice/i
    );
    // Sirul rămâne neatins: prima persoana fizica ia tot 914.
    const pf = await receptie(storage, "Cojocari Ana");
    assert.equal((await storage.assignActNumber(pf.id, PF)).actNumber, START);
  });
});

test("doar contabilul si adminul emit acte", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const r = await receptie(storage, "Cojocari Ana");
    for (const rol of ["operator", "manager", "control"]) {
      await assert.rejects(
        () => storage.assignActNumber(r.id, { ...PF, actorRole: rol }),
        /contabilul sau administratorul/i,
        `rolul ${rol} nu trebuia sa poata`
      );
    }
    for (const rol of ["accountant", "accountant-sef", "admin"]) {
      const curat = await receptie(storage, `F ${rol}`);
      assert.ok((await storage.assignActNumber(curat.id, { ...PF, actorRole: rol })).actNumber > 0);
    }
  });
});

test("emiterea lasa urma in audit", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const r = await receptie(storage, "Cojocari Ana");
    await storage.assignActNumber(r.id, PF);
    const logs = await storage.listAuditLogs();
    const intrare = logs.find((l) => l.action === "receipt-act-number");
    assert.ok(intrare, "lipseste intrarea de audit");
    assert.equal(intrare.newValue.actNumber, START);
    assert.equal(intrare.newValue.actSeries, "AP");
  });
});

test("nu se emite act pe o receptie care nu e in stoc", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const proiect = await storage.createReceipt({
      supplier: "Cojocari Ana", supplierId: 1, product: "Floarea soarelui", productId: 1,
      quantity: 2.907, unit: "tone", price: 6.15, location: "Cilindru 1", locationId: 1,
      isDraft: true, actorRole: "accountant"
    });
    await assert.rejects(() => storage.assignActNumber(proiect.id, PF), /nu e in stoc/i);
  });
});
