const test = require("node:test");
const assert = require("node:assert/strict");

const { withIsolatedWorkspace } = require("../test-support/isolated-runtime");
const {
  deliveryReceivableTonnePrice: oglindaRaport
} = require("../src/management-report");

// Pretul de contract si cel de factura sunt ACELASI pret, in unitati diferite:
// contractPrice = lei/TONA, priceLei = lei/KG, priceForeign = valuta/TONA.

test("pretul pe tona se derivă din datele de facturare, in ambele monede", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const { deliveryReceivableTonnePrice: sursa } = load("src/local-storage.js");
    // MDL: 4 lei/kg = 4000 lei/tona.
    assert.equal(sursa({ currency: "MDL", priceLei: 4, exchangeRate: 1 }), 4000);
    // Valuta: 175 EUR/tona x curs 19,45 = 3403,75 lei/tona.
    assert.equal(sursa({ currency: "EUR", priceForeign: 175, exchangeRate: 19.45 }), 175 * 19.45);
    // Curs lipsa la valuta -> nu se inventeaza un pret.
    assert.equal(sursa({ currency: "EUR", priceForeign: 175, exchangeRate: 0 }), 0);
    // Valoarea stocata are prioritate.
    assert.equal(sursa({ contractPrice: 3800, currency: "MDL", priceLei: 4 }), 3800);
  });
});

test("oglinda din raportul de management nu a divergat de sursa", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const { deliveryReceivableTonnePrice: sursa } = load("src/local-storage.js");
    const cazuri = [
      { currency: "MDL", priceLei: 4, exchangeRate: 1 },
      { currency: "EUR", priceForeign: 175, exchangeRate: 19.45 },
      { currency: "usd", priceForeign: 200, exchangeRate: 18 },
      { contractPrice: 3800, priceLei: 4 },
      { currency: "EUR", priceForeign: 175, exchangeRate: 0 },
      {},
      null
    ];
    for (const c of cazuri) {
      assert.equal(oglindaRaport(c), sursa(c), `divergenta pe ${JSON.stringify(c)}`);
    }
  });
});

async function livrarePregatita(storage) {
  const receipt = await storage.createReceipt({
    supplier: "Agro Nord", supplierId: 1, product: "Grau", productId: 1,
    quantity: 100, grossQuantity: 100, provisionalNetQuantity: 100,
    unit: "tone", price: 5, location: "Cilindru 1", locationId: 1
  });
  return storage.createDelivery({
    receiptId: receipt.id, customerId: 2, customer: "Cumparator SRL",
    product: "Grau", location: "Cilindru 1",
    plannedQuantity: 50, deliveredQuantity: 50, netWeight: 50,
    actorRole: "manager"
  });
}

test("pretul pus de contabil produce creanta (contractPrice se deriva la editare)", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const d = await livrarePregatita(storage);
    // Fara pret, creanta e zero — cauza pentru care „Incasari" arata 0.
    assert.equal(Number(d.contractPrice || 0), 0);

    const cu = await storage.updateDelivery(d.id, {
      currency: "MDL", priceForeign: 4, changeReason: "Completare date factura",
      actorRole: "accountant"
    });
    assert.equal(Number(cu.priceLei), 4, "lei/kg");
    assert.equal(Number(cu.contractPrice), 4000, "lei/tona");
  });
});

test("MDL forteaza cursul la 1 — nu mai rămâne cursul valutar vechi", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const d = await livrarePregatita(storage);
    await storage.updateDelivery(d.id, {
      currency: "EUR", priceForeign: 175, exchangeRate: 19.45,
      changeReason: "factura in euro", actorRole: "accountant"
    });
    // Se comuta pe MDL FARA a goli cursul: inainte dadea priceLei = 4 x 19,45.
    const dupa = await storage.updateDelivery(d.id, {
      currency: "MDL", priceForeign: 4,
      changeReason: "corectie: factura in lei", actorRole: "accountant"
    });
    assert.equal(Number(dupa.exchangeRate), 1);
    assert.equal(Number(dupa.priceLei), 4, "lei/kg, nu 77,8");
    assert.equal(Number(dupa.contractPrice), 4000);
  });
});

test("pretul nu poate cobori datoria sub cat s-a incasat deja", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const d = await livrarePregatita(storage);
    await storage.updateDelivery(d.id, {
      currency: "MDL", priceForeign: 4, changeReason: "pret", actorRole: "accountant"
    });
    // Incasare integrala: 50 t x 4000 lei/t = 200.000 lei.
    await storage.createTransaction({
      referenceType: "delivery", deliveryId: d.id, partnerId: 2, partner: "Cumparator SRL",
      direction: "collection", amount: 200000
    });
    await assert.rejects(
      () => storage.updateDelivery(d.id, {
        currency: "MDL", priceForeign: 1, changeReason: "pret redus", actorRole: "accountant"
      }),
      /[Ss]torneaza incasarea intai/
    );
  });
});

test("operatorul nu poate atinge pretul (drepturile ramân neschimbate)", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const d = await livrarePregatita(storage);
    await assert.rejects(
      () => storage.updateDelivery(d.id, {
        priceForeign: 4, changeReason: "incerc", actorRole: "operator"
      }),
      /contabil/i
    );
  });
});

test("moneda e validata si la CREARE, nu doar la editare", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const receipt = await storage.createReceipt({
      supplier: "Agro Nord", supplierId: 1, product: "Grau", productId: 1,
      quantity: 100, grossQuantity: 100, provisionalNetQuantity: 100,
      unit: "tone", price: 5, location: "Cilindru 1", locationId: 1
    });
    const baza = {
      receiptId: receipt.id, customerId: 2, customer: "Cumparator SRL",
      product: "Grau", location: "Cilindru 1",
      plannedQuantity: 50, deliveredQuantity: 50, netWeight: 50,
      actorRole: "accountant"
    };
    for (const rea of ["<img src=x onerror=alert(1)>", "&#60;SCRIPT&#62;", "XYZ", "__proto__"]) {
      await assert.rejects(
        () => storage.createDelivery({ ...baza, currency: rea, priceForeign: 4 }),
        /nu este permisa/i,
        `moneda "${rea}" nu trebuia acceptata`
      );
    }
    // Monedele reale trec.
    const ok = await storage.createDelivery({ ...baza, currency: "MDL", priceForeign: 4 });
    assert.equal(ok.currency, "MDL");
    // Si pretul de contract se deriva din prima clipa: 4 lei/kg = 4000 lei/tona.
    assert.equal(Number(ok.contractPrice), 4000);
  });
});

test("plafon de sanitate pe creanta si la CREARE", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const receipt = await storage.createReceipt({
      supplier: "Agro Nord", supplierId: 1, product: "Grau", productId: 1,
      quantity: 100, grossQuantity: 100, provisionalNetQuantity: 100,
      unit: "tone", price: 5, location: "Cilindru 1", locationId: 1
    });
    await assert.rejects(
      () => storage.createDelivery({
        receiptId: receipt.id, customerId: 2, customer: "Cumparator SRL",
        product: "Grau", location: "Cilindru 1",
        plannedQuantity: 50, deliveredQuantity: 50, netWeight: 50,
        currency: "EUR", priceForeign: 1e12, exchangeRate: 1e12,
        actorRole: "accountant"
      }),
      /nerealist de mare/i
    );
  });
});

test("golirea pretului nu lasa creanta veche in picioare", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const receipt = await storage.createReceipt({
      supplier: "Agro Nord", supplierId: 1, product: "Grau", productId: 1,
      quantity: 100, grossQuantity: 100, provisionalNetQuantity: 100,
      unit: "tone", price: 5, location: "Cilindru 1", locationId: 1
    });
    const d = await storage.createDelivery({
      receiptId: receipt.id, customerId: 2, customer: "Cumparator SRL",
      product: "Grau", location: "Cilindru 1",
      plannedQuantity: 50, deliveredQuantity: 50, netWeight: 50,
      currency: "MDL", priceForeign: 4, actorRole: "accountant"
    });
    assert.equal(Number(d.contractPrice), 4000);

    // Factura stornata: pretul se goleste.
    const golit = await storage.updateDelivery(d.id, {
      currency: "MDL", priceForeign: 0, changeReason: "storno factura",
      actorRole: "accountant"
    });
    assert.equal(Number(golit.contractPrice), 0, "creanta veche a rămas in picioare");
    assert.equal(golit.collectionStatus, "Neincasat");
  });
});
