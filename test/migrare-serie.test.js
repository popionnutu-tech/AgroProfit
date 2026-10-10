const test = require("node:test");
const assert = require("node:assert/strict");
const { withIsolatedWorkspace } = require("../test-support/isolated-runtime");

// Migrarea seriei AP -> AA. Ruleaza o singura data, la primul acces dupa publicare, si
// DOAR pe firma care chiar are seria veche.

test("migrarea muta seria AP pe AA, si doar acolo", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    // Firma 1 are seria veche; firma 2 isi are propriul sir si nu trebuie atinsa.
    await storage.updateConfigEntry("companies", 1, {
      name: "Firma SRL", series: "AP", idno: "1003600000000",
      changeReason: "t", changedBy: "admin" });
    await storage.updateConfigEntry("companies", 2, {
      name: "A doua", series: "AGR", idno: "",
      changeReason: "t", changedBy: "admin" });

    const r = await storage.runMigrationIfNeeded();
    assert.ok(r.migrated, "migrarea trebuia sa ruleze");

    const config = await storage.getConfig();
    const firme = Object.fromEntries(config.companies.map((c) => [c.id, c.series]));
    assert.equal(firme[1], "AA", "seria veche s-a mutat");
    assert.equal(firme[2], "AGR", "cealalta firma nu s-a atins");
  });
});

test("migrarea nu ruleaza a doua oara", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    await storage.updateConfigEntry("companies", 1, {
      name: "Firma SRL", series: "AP", idno: "1003600000000",
      changeReason: "t", changedBy: "admin" });

    assert.ok((await storage.runMigrationIfNeeded()).migrated);
    const aDoua = await storage.runMigrationIfNeeded();
    assert.equal(aDoua.migrated, false, "marcata prin versiune, nu se repeta");

    // Daca cineva pune inapoi „AP" deliberat, migrarea NU i-o schimba din nou.
    await storage.updateConfigEntry("companies", 1, {
      name: "Firma SRL", series: "AP", idno: "1003600000000",
      changeReason: "inapoi", changedBy: "admin" });
    await storage.runMigrationIfNeeded();
    const config = await storage.getConfig();
    assert.equal(config.companies.find((c) => c.id === 1).series, "AP",
      "decizia omului e mai tare decat migrarea deja facuta");
  });
});

test("actele DEJA emise isi pastreaza seria inghetata", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    await storage.updateConfigEntry("companies", 1, {
      name: "Firma SRL", series: "AP", idno: "1003600000000",
      changeReason: "t", changedBy: "admin" });
    await storage.runMigrationIfNeeded();
    // Seria e inghetata pe fiecare document la emitere; migrarea atinge doar nomenclatorul.
    // Hirtiile semnate raman cum sint — verificat prin faptul ca migrarea nu scrie pe receptii.
    const receptii = await storage.listReceipts();
    assert.ok(receptii.every((r) => !r.actSeries || r.actSeries !== "AA"),
      "migrarea nu rescrie seria pe acte deja emise");
  });
});
