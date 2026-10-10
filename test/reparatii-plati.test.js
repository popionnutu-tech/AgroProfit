const test = require("node:test");
const assert = require("node:assert/strict");
const { withIsolatedWorkspace } = require("../test-support/isolated-runtime");
const { computeReceiptEstimate } = require("../src/receipt-handlers");

// Reparatiile dupa revizia de arhitectura. Fiecare test tine exact o gaura masurata de agent,
// toate in zona in care o greseala nu da eroare — doar cifre care nu se potrivesc.

const TARIFFS = [{ service: "Uscare", value: 10, active: true }];

async function furnizor(storage, cote) {
  await storage.updateConfigEntry("partners", 1, {
    name: "F", idno: "2000000000001", role: "furnizor", fiscalProfile: "Persoana fizica",
    changeReason: "t", changedBy: "admin" });
  const out = [];
  for (const cota of cote) {
    const est = computeReceiptEstimate({ quantity: 1, price: 6, humidity: 14, impurity: 2,
      product: { humidityNorm: 14, impurityNorm: 2 }, tariffs: TARIFFS,
      fiscalProfile: { withholdingPercent: cota } });
    out.push(await storage.createReceipt({ supplier: "F", supplierId: 1, product: "Grau",
      productId: 1, quantity: 1, grossQuantity: 1, unit: "tone", price: 6,
      location: "Cilindru 1", locationId: 1, ...est }));
  }
  return out;
}

const plata = (extra) => ({
  referenceType: "receipt", partnerId: 1, supplierId: 1, partner: "F",
  direction: "payment", paymentType: "Numerar", ...extra
});

test("fiecare leu primit e ori alocat, ori pus ca avans — niciodata amindoua", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const r = await furnizor(storage, [6, 6]);
    const lista = await storage.listReceipts();
    const datorie = Number(lista.find((x) => x.id === r[0].id).amountToPay);

    // Se bifeaza DOAR a doua, dar se platesc banii pentru amindoua. Surplusul se revarsa pe
    // prima — deci NU mai are voie sa fie si avans. Masurat inainte: 11.280 alocati PLUS
    // 5.640 lei de avans disponibil, aceiasi bani de doua ori.
    await storage.createTransaction(plata({
      receiptId: r[1].id, receiptIds: [r[1].id], amount: datorie * 2
    }));

    const dupa = await storage.listReceipts();
    const alocat = dupa.reduce((s, x) => s + Number(x.paidAmount || 0), 0);
    const avans = (await storage.listPartnerAdvances())
      .reduce((s, a) => s + Number(a.remainingAmount || 0), 0);
    assert.ok(Math.abs(alocat + avans - datorie * 2) < 0.01,
      `${alocat} alocati + ${avans} avans != ${datorie * 2} platiti`);
    assert.equal(avans, 0, "nu exista avans cand partenerul mai avea datorii");
  });
});

test("banii peste TOATA datoria partenerului devin avans, nu dispar", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const r = await furnizor(storage, [6]);
    const lista = await storage.listReceipts();
    const datorie = Number(lista.find((x) => x.id === r[0].id).amountToPay);

    const t = await storage.createTransaction(plata({ receiptId: r[0].id, amount: datorie + 5000 }));
    assert.ok(Math.abs(Number(t.appliedAmount) - datorie) < 0.01);
    assert.ok(Math.abs(Number(t.advanceAmount) - 5000) < 0.01);
    const avans = (await storage.listPartnerAdvances())
      .reduce((s, a) => s + Number(a.remainingAmount || 0), 0);
    assert.ok(Math.abs(avans - 5000) < 0.01, "surplusul trebuie sa existe ca avans");
  });
});

test("exportul 1C NU inventeaza impozit cand cotele difera", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const r = await furnizor(storage, [6, 12]);
    const lista = await storage.listReceipts();
    const total = r.reduce((s, x) => s + Number(lista.find((y) => y.id === x.id).amountToPay), 0);

    await storage.createTransaction(plata({
      receiptId: r[0].id, receiptIds: r.map((x) => x.id), amount: total
    }));

    const rand = (await storage.exportPaymentsFor1c({})).rows[0];
    // Cifra asta ajunge in `Нал05` si de acolo in declaratie: mai bine goala decat gresita.
    assert.equal(rand["Suma bruta (lei)"], "", "brutul nu se poate reconstitui din doua cote");
    assert.equal(rand["Impozit retinut (lei)"], "");
    assert.match(rand["Observatii export"], /cote de retinere DIFERITE/);
  });
});

test("exportul 1C reconstituie corect cand cota e comuna", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const r = await furnizor(storage, [6, 6]);
    const lista = await storage.listReceipts();
    const total = r.reduce((s, x) => s + Number(lista.find((y) => y.id === x.id).amountToPay), 0);

    await storage.createTransaction(plata({
      receiptId: r[0].id, receiptIds: r.map((x) => x.id), amount: total
    }));

    const rand = (await storage.exportPaymentsFor1c({})).rows[0];
    const brut = Number(rand["Suma bruta (lei)"]);
    const imp = Number(rand["Impozit retinut (lei)"]);
    assert.ok(brut > 0, "cu o cota comuna brutul se poate reconstitui");
    assert.ok(Math.abs(brut - imp - total) < 0.02, "brut - impozit = suma platita");
    assert.ok(Math.abs(imp - brut * 0.06) < 0.02, "impozitul e 6% din brut");
  });
});

test("data ordinului de plata se INGHEATA, nu se recalculeaza la fiecare tipărire", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const r = await furnizor(storage, [6]);
    const t = await storage.createTransaction(plata({ receiptId: r[0].id, amount: 100 }));
    // Documentul isi poarta propria data, scrisa o data. Derivata la citire, orice schimbare
    // viitoare a regulii ar rescrie hirtii deja semnate si deja incarcate in 1C.
    assert.match(String(t.documentDate || ""), /^\d{4}-\d{2}-\d{2}$/);
    const rand = (await storage.exportPaymentsFor1c({})).rows[0];
    assert.equal(rand.Data, t.documentDate, "exportul citeste data inghetata de pe document");
  });
});
