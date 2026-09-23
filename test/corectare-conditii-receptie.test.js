const test = require("node:test");
const assert = require("node:assert/strict");

const { withIsolatedWorkspace } = require("../test-support/isolated-runtime");
const { computeReceiptEstimate } = require("../src/receipt-handlers");

const TARIFFS = [
  { service: "Uscare", value: 10, active: true },
  { service: "Curatire", value: 0, active: true }
];
const PRODUS = { humidityNorm: 14, impurityNorm: 2 };

// 100 t brut, umiditate 17 (3 p.p. peste norma), impuritati in norma, 5 lei/kg.
function estimare({ payOnGrossQuantity = false, price = 5 } = {}) {
  return computeReceiptEstimate({
    payOnGrossQuantity,
    quantity: 100,
    price,
    humidity: 17,
    impurity: 2,
    product: PRODUS,
    tariffs: TARIFFS,
    fiscalProfile: { withholdingPercent: 6 }
  });
}

async function receptieInitiala(storage) {
  const est = estimare();
  return storage.createReceipt({
    supplier: "Agro Nord", supplierId: 1,
    product: "Grau", productId: 1,
    quantity: 100, grossQuantity: 100, unit: "tone", price: 5,
    location: "Cilindru 1", locationId: 1,
    ...est
  });
}

test("adminul pune bifa pe o receptie deja intrata; suma creste, stocul nu se misca", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const r = await receptieInitiala(storage);
    const stocInainte = Number(r.provisionalNetQuantity);
    const sumaInainte = Number(r.preliminaryPayableAmount);

    const corectat = await storage.correctReceiptTerms(r.id, {
      estimate: estimare({ payOnGrossQuantity: true }),
      payOnGrossQuantity: true,
      price: 5,
      reason: "Intelegere: achizitie cu tot cu apa",
      actorRole: "admin",
      changedBy: "admin"
    });

    assert.equal(corectat.payOnGrossQuantity, true);
    // Stocul e intangibil: aceeasi cantitate in cilindru.
    assert.equal(Number(corectat.provisionalNetQuantity), stocInainte);
    // Se platesc 100 t in loc de 97 t.
    assert.ok(Number(corectat.preliminaryPayableAmount) > sumaInainte);
    assert.equal(Number(corectat.preliminaryMerchandiseValue), 100 * 1000 * 5);
    assert.equal(Number(corectat.dryingServiceTotal), 0);
  });
});

test("corectarea ramane pe document, cu motiv, autor si cifrele vechi", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const r = await receptieInitiala(storage);
    const sumaInainte = Number(r.preliminaryPayableAmount);

    const corectat = await storage.correctReceiptTerms(r.id, {
      estimate: estimare({ payOnGrossQuantity: true, price: 6 }),
      payOnGrossQuantity: true, price: 6,
      reason: "Pret corectat dupa contract",
      actorRole: "admin", changedBy: "Ion Admin"
    });

    assert.equal(corectat.termCorrections.length, 1);
    const istoric = corectat.termCorrections[0];
    assert.equal(istoric.by, "Ion Admin");
    assert.equal(istoric.reason, "Pret corectat dupa contract");
    assert.equal(istoric.oldPayOnGrossQuantity, false);
    assert.equal(istoric.newPayOnGrossQuantity, true);
    assert.equal(Number(istoric.oldPrice), 5);
    assert.equal(Number(istoric.newPrice), 6);
    assert.equal(Number(istoric.oldAmount), sumaInainte);
    assert.equal(Number(istoric.newAmount), Number(corectat.preliminaryPayableAmount));

    const logs = await storage.listAuditLogs();
    assert.ok(logs.some((l) => l.action === "receipt-correct-terms"));
  });
});

test("doar adminul poate corecta conditiile", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const r = await receptieInitiala(storage);
    for (const rol of ["operator", "manager", "accountant", "accountant-sef", "control"]) {
      await assert.rejects(
        () => storage.correctReceiptTerms(r.id, {
          estimate: estimare({ payOnGrossQuantity: true }),
          payOnGrossQuantity: true, price: 5,
          reason: "incerc", actorRole: rol, changedBy: rol
        }),
        /administratorul/i,
        `rolul ${rol} nu trebuia sa poata`
      );
    }
  });
});

test("motivul e obligatoriu si o corectare goala e respinsa", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const r = await receptieInitiala(storage);
    const comun = { estimate: estimare({ payOnGrossQuantity: true }), payOnGrossQuantity: true, price: 5, actorRole: "admin", changedBy: "admin" };

    await assert.rejects(() => storage.correctReceiptTerms(r.id, { ...comun, reason: "   " }), /[Mm]otivul/);
    // Aceeasi bifa si acelasi pret = nimic de corectat.
    await assert.rejects(
      () => storage.correctReceiptTerms(r.id, {
        estimate: estimare(), payOnGrossQuantity: false, price: 5,
        reason: "fara schimbare", actorRole: "admin", changedBy: "admin"
      }),
      /nu s-a schimbat nimic/i
    );
  });
});

test("statutul de plata se reciteste fata de suma noua", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const r = await receptieInitiala(storage);
    // Plata integrala pe suma veche (97 t x 5 lei x 0,94), prin fluxul real.
    await storage.createTransaction({
      referenceType: "receipt",
      receiptId: r.id,
      partnerId: 1,
      partner: "Agro Nord",
      direction: "payment",
      amount: Number(r.preliminaryPayableAmount)
    });
    const dupaPlata = (await storage.listReceipts()).find((x) => x.id === r.id);
    assert.equal(dupaPlata.paymentStatus, "Achitat");

    const corectat = await storage.correctReceiptTerms(r.id, {
      estimate: estimare({ payOnGrossQuantity: true }),
      payOnGrossQuantity: true, price: 5,
      reason: "achizitie cu tot cu apa", actorRole: "admin", changedBy: "admin"
    });

    // Datoria a crescut, deci nu mai e achitat integral. Statutul se DERIVA la citire
    // (FIFO pe partener), nu se scrie pe document — acolo ar fi gresit pentru o receptie
    // stinsa printr-o plata facuta pe alta receptie a aceluiasi furnizor.
    const dupaCorectare = (await storage.listReceipts()).find((x) => x.id === corectat.id);
    assert.equal(dupaCorectare.paymentStatus, "Partial");
    assert.ok(dupaCorectare.soldRestant > 0);
  });
});

// --- Garzile semnalate de agentii de verificare ---

test("cota de impozit si tarifele se citesc de pe DOCUMENT, nu din nomenclatorul de acum", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const r = await receptieInitiala(storage);
    assert.equal(Number(r.withholdingPercent), 6);
    // Tarifele folosite la receptie raman pe document.
    assert.equal(Number(r.dryingTariff), 10);

    // Chiar daca nomenclatorul s-ar schimba, handlerul foloseste cifrele de pe document.
    const corectat = await storage.correctReceiptTerms(r.id, {
      estimate: estimare({ payOnGrossQuantity: true }),
      payOnGrossQuantity: true, price: 5,
      reason: "cu tot cu apa", actorRole: "admin", changedBy: "admin"
    });
    assert.equal(Number(corectat.withholdingPercent), 6);
    assert.equal(Number(corectat.dryingTariff), 10);
  });
});

test("o corectare care ar muta stocul cade zgomotos", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const r = await receptieInitiala(storage);
    // Estimare calculata pe ALTA cantitate -> alt `provisionalNetQuantity`.
    const gresit = computeReceiptEstimate({
      payOnGrossQuantity: false, quantity: 80, price: 5,
      humidity: 17, impurity: 2, product: PRODUS, tariffs: TARIFFS,
      fiscalProfile: { withholdingPercent: 6 }
    });
    await assert.rejects(
      () => storage.correctReceiptTerms(r.id, {
        estimate: gresit, payOnGrossQuantity: false, price: 5,
        reason: "ar muta stocul", actorRole: "admin", changedBy: "admin"
      }),
      /cantitatea din stoc/i
    );
  });
});

test("datoria nu poate cobori sub cat s-a achitat deja", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const r = await receptieInitiala(storage);
    await storage.createTransaction({
      referenceType: "receipt", receiptId: r.id, partnerId: 1, partner: "Agro Nord",
      direction: "payment", amount: Number(r.preliminaryPayableAmount)
    });
    // Pret redus la jumatate -> datoria ar scadea sub suma achitata.
    await assert.rejects(
      () => storage.correctReceiptTerms(r.id, {
        estimate: estimare({ price: 2.5 }), payOnGrossQuantity: false, price: 2.5,
        reason: "pret gresit", actorRole: "admin", changedBy: "admin"
      }),
      /[Ss]torneaza plata intai/
    );
  });
});

test("plafon de sanitate pe suma rezultata", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const r = await receptieInitiala(storage);
    await assert.rejects(
      () => storage.correctReceiptTerms(r.id, {
        estimate: estimare({ price: 99999999 }), payOnGrossQuantity: false, price: 99999999,
        reason: "tastare gresita", actorRole: "admin", changedBy: "admin"
      }),
      /nerealist de mare/i
    );
  });
});

test("istoricul de pe document nu creste nelimitat (ultimele 20)", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const r = await receptieInitiala(storage);
    let ultim = r;
    for (let i = 0; i < 25; i += 1) {
      const pret = 5 + (i + 1) * 0.01;
      ultim = await storage.correctReceiptTerms(r.id, {
        estimate: estimare({ price: pret }), payOnGrossQuantity: false, price: pret,
        reason: `corectare ${i}`, actorRole: "admin", changedBy: "admin"
      });
    }
    assert.equal(ultim.termCorrections.length, 20);
    // Auditul pastreaza TOATE cele 25.
    const logs = await storage.listAuditLogs();
    assert.equal(logs.filter((l) => l.action === "receipt-correct-terms").length, 25);
  });
});
