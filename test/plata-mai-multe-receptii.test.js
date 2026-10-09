const test = require("node:test");
const assert = require("node:assert/strict");

const { withIsolatedWorkspace } = require("../test-support/isolated-runtime");
const { computeReceiptEstimate } = require("../src/receipt-handlers");

// O plata poate acoperi mai multe receptii ale ACELUIASI furnizor, iar contabilul alege
// CARE. Pina acum banii se imprastiau FIFO pe tot partenerul: corect ca sold, dar imposibil
// de spus „plata asta acopera receptiile 1, 2 si 4, nu si 3" — exact ce scrie pe ordinul de
// plata si ce se discuta cu furnizorul.

const TARIFFS = [{ service: "Uscare", value: 10, active: true }];

async function furnizorCu(storage, cantitati) {
  await storage.updateConfigEntry("partners", 1, {
    name: "Furnizor Testov", idno: "2000000000001", address: "s. Testeni",
    role: "furnizor", fiscalProfile: "Persoana fizica",
    changeReason: "test", changedBy: "admin"
  });
  await storage.updateConfigEntry("fiscalProfiles", 1, {
    name: "Persoana fizica", withholdingPercent: 6, vat: false, active: true,
    changeReason: "test", changedBy: "admin"
  });
  const create = [];
  for (const kg of cantitati) {
    const est = computeReceiptEstimate({
      quantity: kg / 1000, price: 6, humidity: 14, impurity: 2,
      product: { humidityNorm: 14, impurityNorm: 2 },
      tariffs: TARIFFS, fiscalProfile: { withholdingPercent: 6 }
    });
    create.push(await storage.createReceipt({
      supplier: "Furnizor Testov", supplierId: 1, product: "Grau", productId: 1,
      quantity: kg / 1000, grossQuantity: kg / 1000, unit: "tone", price: 6,
      location: "Cilindru 1", locationId: 1, ...est
    }));
  }
  return create;
}

const statusuri = (lista) =>
  Object.fromEntries(lista.map((r) => [r.id, r.paymentStatus]));

test("plata acopera DOAR receptiile bifate, nu pe cele mai vechi", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const [r1, r2, r3, r4] = await furnizorCu(storage, [1000, 1000, 1000, 1000]);

    const initiale = await storage.listReceipts();
    const datorie = Number(initiale.find((x) => x.id === r2.id).amountToPay);

    // Se platesc EXACT receptiile 2, 3 si 4 — a treia parte din bani ar fi mers, FIFO, pe
    // receptia 1, care e cea mai veche. Bifa trebuie sa invinga ordinea cronologica.
    await storage.createTransaction({
      referenceType: "receipt", receiptId: r2.id, receiptIds: [r2.id, r3.id, r4.id],
      partnerId: 1, supplierId: 1, partner: "Furnizor Testov",
      direction: "payment", amount: datorie * 3, paymentType: "Numerar"
    });

    const st = statusuri(await storage.listReceipts());
    assert.equal(st[r1.id], "Neachitat", "receptia cea mai veche NU era bifata");
    assert.equal(st[r2.id], "Achitat");
    assert.equal(st[r3.id], "Achitat");
    assert.equal(st[r4.id], "Achitat");
  });
});

test("3 din 4 acum, a patra la plata urmatoare", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const [r1, r2, r3, r4] = await furnizorCu(storage, [1000, 1000, 1000, 1000]);
    const initiale = await storage.listReceipts();
    const datorie = Number(initiale.find((x) => x.id === r1.id).amountToPay);
    const comun = {
      referenceType: "receipt", partnerId: 1, supplierId: 1,
      partner: "Furnizor Testov", direction: "payment", paymentType: "Numerar"
    };

    await storage.createTransaction({
      ...comun, receiptId: r1.id, receiptIds: [r1.id, r2.id, r3.id], amount: datorie * 3
    });
    let st = statusuri(await storage.listReceipts());
    assert.equal(st[r4.id], "Neachitat", "a patra ramine de platit");

    await storage.createTransaction({
      ...comun, receiptId: r4.id, receiptIds: [r4.id], amount: datorie
    });
    st = statusuri(await storage.listReceipts());
    assert.deepEqual(
      [st[r1.id], st[r2.id], st[r3.id], st[r4.id]],
      ["Achitat", "Achitat", "Achitat", "Achitat"]
    );
  });
});

test("o plata pentru TOATA cantitatea, cu toate receptiile bifate", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const toate = await furnizorCu(storage, [1500, 2300, 900]);
    const initiale = await storage.listReceipts();
    const total = initiale.reduce((s, r) => s + Number(r.amountToPay || 0), 0);

    await storage.createTransaction({
      referenceType: "receipt", receiptId: toate[0].id,
      receiptIds: toate.map((r) => r.id),
      partnerId: 1, supplierId: 1, partner: "Furnizor Testov",
      direction: "payment", amount: total, paymentType: "Numerar"
    });

    const st = statusuri(await storage.listReceipts());
    for (const r of toate) assert.equal(st[r.id], "Achitat", `receptia ${r.id}`);
  });
});

test("banii nu dispar: surplusul peste receptiile bifate trece pe celelalte", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const [r1, r2] = await furnizorCu(storage, [1000, 1000]);
    const initiale = await storage.listReceipts();
    const datorie = Number(initiale.find((x) => x.id === r2.id).amountToPay);

    // Se bifeaza DOAR receptia 2, dar se platesc banii pentru amindoua. Surplusul nu are voie
    // sa se evapore — ramine in soldul partenerului si stinge si receptia 1.
    await storage.createTransaction({
      referenceType: "receipt", receiptId: r2.id, receiptIds: [r2.id],
      partnerId: 1, supplierId: 1, partner: "Furnizor Testov",
      direction: "payment", amount: datorie * 2, paymentType: "Numerar"
    });

    const st = statusuri(await storage.listReceipts());
    assert.equal(st[r2.id], "Achitat", "receptia bifata se stinge prima");
    assert.equal(st[r1.id], "Achitat", "surplusul a mers pe cealalta, nu s-a pierdut");
  });
});

test("o plata partiala pe selectie stinge in ordine, nu putin peste tot", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const [r1, r2, r3] = await furnizorCu(storage, [1000, 1000, 1000]);
    const initiale = await storage.listReceipts();
    const datorie = Number(initiale.find((x) => x.id === r1.id).amountToPay);

    // Bani cit pentru o receptie si jumatate, bifate trei.
    await storage.createTransaction({
      referenceType: "receipt", receiptId: r1.id, receiptIds: [r1.id, r2.id, r3.id],
      partnerId: 1, supplierId: 1, partner: "Furnizor Testov",
      direction: "payment", amount: datorie * 1.5, paymentType: "Numerar"
    });

    const st = statusuri(await storage.listReceipts());
    assert.equal(st[r1.id], "Achitat", "cea mai veche din selectie se stinge intai");
    assert.equal(st[r2.id], "Partial");
    assert.equal(st[r3.id], "Neachitat");
  });
});

test("fara bifa, comportamentul vechi ramine NEATINS (FIFO pe tot partenerul)", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const [r1, r2, r3] = await furnizorCu(storage, [1000, 1000, 1000]);
    const initiale = await storage.listReceipts();
    const datorie = Number(initiale.find((x) => x.id === r1.id).amountToPay);

    // Platile vechi nu au campul deloc. Inregistrata pe receptia 3, trebuie sa stinga tot
    // de la cea mai veche — exact ca pina acum.
    await storage.createTransaction({
      referenceType: "receipt", receiptId: r3.id,
      partnerId: 1, supplierId: 1, partner: "Furnizor Testov",
      direction: "payment", amount: datorie * 2, paymentType: "Numerar"
    });

    const st = statusuri(await storage.listReceipts());
    assert.equal(st[r1.id], "Achitat");
    assert.equal(st[r2.id], "Achitat");
    assert.equal(st[r3.id], "Neachitat", "FIFO, desi plata e inregistrata pe ea");
  });
});

test("lista de receptii acoperite e TIPIZATA, nu se inghite ce nu e numar", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const [r1] = await furnizorCu(storage, [1000]);
    const comun = {
      referenceType: "receipt", receiptId: r1.id, partnerId: 1, supplierId: 1,
      partner: "Furnizor Testov", direction: "payment", amount: 100, paymentType: "Numerar"
    };
    // `Number([7])` e 7 si `Number(true)` e 1: fara verificare de tip, un boolean ar bifa
    // o receptie la intimplare.
    for (const rea of [[true], [{}], [-1], [0], ["abc"], [1.5]]) {
      await assert.rejects(
        () => storage.createTransaction({ ...comun, receiptIds: rea }),
        /invalida/i,
        `lista ${JSON.stringify(rea)} trebuia respinsa`
      );
    }
    await assert.rejects(
      () => storage.createTransaction({
        ...comun, receiptIds: Array.from({ length: 201 }, (_, i) => i + 1)
      }),
      /Prea multe receptii/
    );
  });
});

test("bifele pe receptiile ALTUI furnizor sint RESPINSE, nu inghitite tacit", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const [r1] = await furnizorCu(storage, [1000]);
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
    const initiale = await storage.listReceipts();
    const datorie = Number(initiale.find((x) => x.id === r1.id).amountToPay);

    // Plata e a furnizorului 1; bifa pe receptia furnizorului 2 se REFUZA la scriere.
    // Ignorata tacit, contabilul primea 201 si credea ca a acoperit-o, iar banii plecau
    // FIFO in alta parte — pentru o operatie cu efect financiar, tacerea e mai rea decit
    // un refuz.
    await assert.rejects(
      () => storage.createTransaction({
        referenceType: "receipt", receiptId: r1.id, receiptIds: [r1.id, strain.id],
        partnerId: 1, supplierId: 1, partner: "Furnizor Testov",
        direction: "payment", amount: datorie, paymentType: "Numerar"
      }),
      /altui furnizor/
    );

    // Nimic nu s-a inregistrat.
    const st = statusuri(await storage.listReceipts());
    assert.equal(st[r1.id], "Neachitat");
    assert.equal(st[strain.id], "Neachitat", "banii unui furnizor nu sting datoria altuia");
  });
});
