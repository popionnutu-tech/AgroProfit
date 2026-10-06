const test = require("node:test");
const assert = require("node:assert/strict");

const { withIsolatedWorkspace } = require("../test-support/isolated-runtime");

const ADMIN = { currentUser: { roleCode: "admin" }, changedBy: "admin" };

// Praful: resturi de cateva kg din rotunjiri si din documente retroactive. Se asaza la ZERO
// prin aceeasi corectie de inventar ca manual — cu urma in audit, nu prin scriere directa.
async function stocCuPraf(storage) {
  // Trei receptii mici in trei locatii, apoi livrari care lasa resturi.
  const r1 = await storage.createReceipt({
    supplier: "F", supplierId: 1, product: "Rapita", productId: 1,
    quantity: 0.003, grossQuantity: 0.003, provisionalNetQuantity: 0.003,
    unit: "tone", price: 6, location: "Cilindru 1", locationId: 1
  });
  const r2 = await storage.createReceipt({
    supplier: "F", supplierId: 1, product: "Grau", productId: 2,
    quantity: 50, grossQuantity: 50, provisionalNetQuantity: 50,
    unit: "tone", price: 5, location: "Cilindru 2", locationId: 2
  });
  return { r1, r2 };
}

test("curata doar resturile sub prag, nu stocul real", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    await stocCuPraf(storage);

    const inainte = await storage.getStockSummary();
    const rapita = inainte.byLocation.find((l) => l.product === "Rapita");
    const grau = inainte.byLocation.find((l) => l.product === "Grau");
    assert.equal(Math.round(rapita.quantity * 1000), 3, "rapita trebuia sa fie 3 kg");
    assert.equal(Math.round(grau.quantity * 1000), 50000);

    const rez = await storage.clearStockDust({ ...ADMIN, changeReason: "curatare resturi" });
    assert.equal(rez.cleared.length, 1, "trebuia curatat exact un rand");
    assert.equal(rez.cleared[0].product, "Rapita");

    const dupa = await storage.getStockSummary();
    assert.ok(
      !dupa.byLocation.some((l) => l.product === "Rapita" && Number(l.quantity) !== 0),
      "rapita nu s-a asezat la zero"
    );
    // Stocul real e NEATINS.
    const grauDupa = dupa.byLocation.find((l) => l.product === "Grau");
    assert.equal(Math.round(grauDupa.quantity * 1000), 50000);
  });
});

test("fiecare rand curatat lasa o corectie de inventar cu motiv si urma in audit", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    await stocCuPraf(storage);
    await storage.clearStockDust({ ...ADMIN, changeReason: "curatare resturi" });

    const corectii = await storage.listStockCorrections();
    assert.equal(corectii.length, 1);
    assert.match(corectii[0].changeReason || corectii[0].reason || "", /curatare resturi/i);
    assert.match(corectii[0].changeReason || corectii[0].reason || "", /sub 5 kg/);

    const logs = await storage.listAuditLogs();
    assert.ok(
      logs.some((l) => String(l.entityType || "").includes("stock")),
      "lipseste urma in audit"
    );
  });
});

test("doar adminul poate curata", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    await stocCuPraf(storage);
    for (const rol of ["operator", "manager", "accountant", undefined]) {
      await assert.rejects(
        () => storage.clearStockDust({
          currentUser: { roleCode: rol }, changeReason: "incerc", changedBy: "x"
        }),
        /administratorul/i,
        `rolul ${rol} nu trebuia sa poata`
      );
    }
  });
});

test("motivul e obligatoriu, pragul e marginit", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    await stocCuPraf(storage);
    await assert.rejects(() => storage.clearStockDust({ ...ADMIN, changeReason: "  " }), /[Mm]otivul/);
    for (const prag of [0, -1, 51, NaN, "abc"]) {
      await assert.rejects(
        () => storage.clearStockDust({ ...ADMIN, thresholdKg: prag, changeReason: "x" }),
        /[Pp]ragul/,
        `pragul ${prag} nu trebuia acceptat`
      );
    }
  });
});

test("fara praf nu se face nicio corectie", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    await storage.createReceipt({
      supplier: "F", supplierId: 1, product: "Grau", productId: 2,
      quantity: 50, grossQuantity: 50, provisionalNetQuantity: 50,
      unit: "tone", price: 5, location: "Cilindru 2", locationId: 2
    });
    const rez = await storage.clearStockDust({ ...ADMIN, changeReason: "x" });
    assert.equal(rez.cleared.length, 0);
    assert.equal((await storage.listStockCorrections()).length, 0);
  });
});
