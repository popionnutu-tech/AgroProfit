const test = require("node:test");
const assert = require("node:assert/strict");

const { withIsolatedWorkspace } = require("../test-support/isolated-runtime");
const { computeReceiptEstimate } = require("../src/receipt-handlers");

// Prin HANDLER, nu prin magazie.
//
// Testele de alocare cheama `storage.createTransaction` direct, deci ar trece si daca ruta
// nu transmite `receiptIds` — exact ce s-a si intamplat: functionalitatea era scrisa in
// magazie si netrimisa de handler, iar suita trecea verde. Aici se verifica drumul intreg.

const TARIFFS = [{ service: "Uscare", value: 10, active: true }];

async function furnizorCu(storage, cite) {
  await storage.updateConfigEntry("partners", 1, {
    name: "Furnizor Testov", idno: "2000000000001", address: "s. Testeni",
    role: "furnizor", fiscalProfile: "Persoana fizica",
    changeReason: "test", changedBy: "admin"
  });
  await storage.updateConfigEntry("fiscalProfiles", 1, {
    name: "Persoana fizica", withholdingPercent: 6, vat: false, active: true,
    changeReason: "test", changedBy: "admin"
  });
  const out = [];
  for (let i = 0; i < cite; i += 1) {
    const est = computeReceiptEstimate({
      quantity: 1, price: 6, humidity: 14, impurity: 2,
      product: { humidityNorm: 14, impurityNorm: 2 },
      tariffs: TARIFFS, fiscalProfile: { withholdingPercent: 6 }
    });
    out.push(await storage.createReceipt({
      supplier: "Furnizor Testov", supplierId: 1, product: "Grau", productId: 1,
      quantity: 1, grossQuantity: 1, unit: "tone", price: 6,
      location: "Cilindru 1", locationId: 1, ...est
    }));
  }
  return out;
}

function raspunsFals() {
  const antete = {};
  return {
    antete,
    statusCode: 0,
    corp: "",
    setHeader(k, v) { antete[k] = String(v); },
    status(c) { this.statusCode = c; return this; },
    json(p) { this.corp = JSON.stringify(p); return this; },
    end(text) { this.corp = text == null ? "" : String(text); }
  };
}

const cerere = (body) => ({
  body,
  query: {},
  currentUser: { roleCode: "admin", name: "admin" }
});

test("ruta TRANSMITE bifele pana in document", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const [r1, r2, r3] = await furnizorCu(storage, 3);
    const handlers = load("src/transaction-handlers.js");
    const lista = await storage.listReceipts();
    const datorie = Number(lista.find((x) => x.id === r2.id).amountToPay);

    const res = raspunsFals();
    await handlers.createTransactionHandler(
      cerere({
        referenceType: "receipt", receiptId: r2.id, receiptIds: [r2.id, r3.id],
        direction: "payment", amount: datorie * 2, paymentType: "Numerar"
      }),
      res
    );
    assert.equal(res.statusCode, 201, `ruta a raspuns ${res.statusCode}: ${res.corp}`);

    // Bifele au ajuns pe document...
    const t = (await storage.listTransactions()).find((x) => Number(x.amount) === datorie * 2);
    assert.deepEqual(t.receiptIds, [r2.id, r3.id], "ruta nu a transmis acoperirea");

    // ...si au efect: receptia 1, cea mai VECHE, ramane neachitata.
    const st = Object.fromEntries(
      (await storage.listReceipts()).map((r) => [r.id, r.paymentStatus])
    );
    assert.equal(st[r1.id], "Neachitat", "cea mai veche nu era bifata");
    assert.equal(st[r2.id], "Achitat");
    assert.equal(st[r3.id], "Achitat");
  });
});

test("fara bife, ruta nu scrie campul deloc (blobul nu se ingroasa degeaba)", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const [r1] = await furnizorCu(storage, 2);
    const handlers = load("src/transaction-handlers.js");

    const res = raspunsFals();
    await handlers.createTransactionHandler(
      cerere({
        referenceType: "receipt", receiptId: r1.id,
        direction: "payment", amount: 100, paymentType: "Numerar"
      }),
      res
    );
    assert.equal(res.statusCode, 201);
    const t = (await storage.listTransactions())[0];
    assert.ok(
      !Object.prototype.hasOwnProperty.call(t, "receiptIds"),
      "`receiptIds: []` pe fiecare tranzactie insemna greutate moarta in blobul fierbinte"
    );
  });
});

test("ruta REFUZA o bifa pe receptia altui furnizor", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const [r1] = await furnizorCu(storage, 1);
    await storage.updateConfigEntry("partners", 2, {
      name: "Alt furnizor", idno: "2000000000009", role: "furnizor",
      fiscalProfile: "Persoana fizica", changeReason: "test", changedBy: "admin"
    });
    const est = computeReceiptEstimate({
      quantity: 1, price: 6, humidity: 14, impurity: 2,
      product: { humidityNorm: 14, impurityNorm: 2 },
      tariffs: TARIFFS, fiscalProfile: { withholdingPercent: 6 }
    });
    const strain = await storage.createReceipt({
      supplier: "Alt furnizor", supplierId: 2, product: "Grau", productId: 1,
      quantity: 1, grossQuantity: 1, unit: "tone", price: 6,
      location: "Cilindru 1", locationId: 1, ...est
    });

    const handlers = load("src/transaction-handlers.js");
    const res = raspunsFals();
    await handlers.createTransactionHandler(
      cerere({
        referenceType: "receipt", receiptId: r1.id, receiptIds: [r1.id, strain.id],
        direction: "payment", amount: 100, paymentType: "Numerar"
      }),
      res
    );
    assert.equal(res.statusCode, 400);
    assert.match(res.corp, /altui furnizor/);
    assert.equal((await storage.listTransactions()).length, 0, "nimic nu s-a inregistrat");
  });
});

test("ruta REFUZA cand receptia de referinta lipseste din bife", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const [r1, r2] = await furnizorCu(storage, 2);
    const handlers = load("src/transaction-handlers.js");
    const res = raspunsFals();
    // Ordinul de plata tiparit numeste receptia de referinta: daca banii n-o ating,
    // hirtia spune altceva decat evidenta.
    await handlers.createTransactionHandler(
      cerere({
        referenceType: "receipt", receiptId: r1.id, receiptIds: [r2.id],
        direction: "payment", amount: 100, paymentType: "Numerar"
      }),
      res
    );
    assert.equal(res.statusCode, 400);
    assert.match(res.corp, /lipseste din lista acoperita/);
  });
});

test("un `receiptIds` care nu e lista nu trece si nu arunca 500", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const [r1] = await furnizorCu(storage, 1);
    const handlers = load("src/transaction-handlers.js");
    for (const rau of ["1,2", { 0: 1 }, 7, true]) {
      const res = raspunsFals();
      await handlers.createTransactionHandler(
        cerere({
          referenceType: "receipt", receiptId: r1.id, receiptIds: rau,
          direction: "payment", amount: 100, paymentType: "Numerar"
        }),
        res
      );
      // Ce nu e array se ignora (ca si cum n-ar fi bifat nimic) — nu 500.
      assert.ok([201, 400].includes(res.statusCode), `${JSON.stringify(rau)} -> ${res.statusCode}`);
    }
  });
});
