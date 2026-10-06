const test = require("node:test");
const assert = require("node:assert");

const { computeReceiptEstimate } = require("../src/receipt-handlers");

// Griu cu umiditate peste norma: 100 t brut, norma 14%, real 17% -> 3 p.p. in exces.
const BASE = {
  quantity: 100,
  price: 5, // lei/kg
  humidity: 17,
  impurity: 2,
  product: { humidityNorm: 14, impurityNorm: 2 },
  tariffs: [
    { service: "Uscare", value: 10, active: true },
    { service: "Curatire", value: 0, active: true }
  ],
  fiscalProfile: { withholdingPercent: 0 }
};

test("implicit: plata pe masa FARA apa (comportamentul de pana acum)", () => {
  const e = computeReceiptEstimate(BASE);
  assert.strictEqual(e.payOnGrossQuantity, false);
  assert.ok(Math.abs(e.provisionalNetQuantity - 97) < 1e-9);
  assert.ok(Math.abs(e.payableQuantity - 97) < 1e-9);
  assert.ok(Math.abs(e.preliminaryMerchandiseValue - 97 * 1000 * 5) < 1e-6);
  assert.ok(e.dryingServiceTotal > 0, "uscarea se taxeaza cand se scade apa");
});

test("bifat: plata pe masa CU apa, uscarea nu se taxeaza, stocul ramane fara apa", () => {
  const e = computeReceiptEstimate({ ...BASE, payOnGrossQuantity: true });
  assert.strictEqual(e.payOnGrossQuantity, true);
  // Stocul NU se schimba: in cilindru intra tot echivalentul uscat.
  assert.ok(Math.abs(e.provisionalNetQuantity - 97) < 1e-9);
  // Plata se face pe brut.
  assert.ok(Math.abs(e.payableQuantity - 100) < 1e-9);
  assert.ok(Math.abs(e.preliminaryMerchandiseValue - 100 * 1000 * 5) < 1e-6);
  assert.strictEqual(e.dryingServiceTotal, 0);
});

test("apa ramane inregistrata pe document indiferent de baza de plata", () => {
  for (const flag of [false, true]) {
    const e = computeReceiptEstimate({ ...BASE, payOnGrossQuantity: flag });
    assert.strictEqual(e.humidity, 17);
    assert.strictEqual(e.excessHumidity, 3);
    assert.ok(Math.abs(e.estimatedWaterLoss - 3) < 1e-9);
  }
});

test("retinerea la sursa se aplica pe noua baza", () => {
  const e = computeReceiptEstimate({
    ...BASE,
    payOnGrossQuantity: true,
    fiscalProfile: { withholdingPercent: 6 }
  });
  const gross = 100 * 1000 * 5;
  assert.ok(Math.abs(e.withholdingAmount - gross * 0.06) < 1e-6);
  assert.ok(Math.abs(e.preliminaryPayableAmount - gross * 0.94) < 1e-6);
});

test("fara umiditate in exces bifa nu schimba nimic", () => {
  const dry = { ...BASE, humidity: 14 };
  const a = computeReceiptEstimate(dry);
  const b = computeReceiptEstimate({ ...dry, payOnGrossQuantity: true });
  assert.strictEqual(a.preliminaryPayableAmount, b.preliminaryPayableAmount);
  assert.strictEqual(b.dryingServiceTotal, 0);
});

// --- Regresii semnalate de agentii de verificare ---

test("se pune la loc DOAR apa: impuritatile peste norma raman scazute", () => {
  // 100 t brut, umiditate 17% (norma 14% -> 3 t apa), impuritati 5% (norma 2% -> 3 t gunoi).
  const murdar = { ...BASE, impurity: 5, product: { humidityNorm: 14, impurityNorm: 2 } };
  const e = computeReceiptEstimate({ ...murdar, payOnGrossQuantity: true });
  assert.ok(Math.abs(e.provisionalNetQuantity - 94) < 1e-9, "stocul: 100 - 3 apa - 3 gunoi");
  // Se plateste 97 t (94 + apa), NU 100 t: gunoiul nu e marfa.
  assert.ok(Math.abs(e.payableQuantity - 97) < 1e-9);
  assert.ok(e.payableQuantity < 100, "nu se plateste niciodata brutul intreg");
});

test("flag fara umiditate in exces nu poate plati impuritatile (gaura inchisa)", () => {
  const curat = {
    ...BASE,
    humidity: 14, // exact la norma -> apa = 0
    impurity: 5,
    product: { humidityNorm: 14, impurityNorm: 2 }
  };
  const fara = computeReceiptEstimate(curat);
  const cu = computeReceiptEstimate({ ...curat, payOnGrossQuantity: true });
  assert.strictEqual(cu.payableQuantity, fara.payableQuantity);
  assert.strictEqual(cu.preliminaryPayableAmount, fara.preliminaryPayableAmount);
});

test("cantitatea platita = cea de pe actul tiparit si din extrasul de cont", () => {
  // Oglinda lui receiptPayableTonnes (src/local-storage.js) si actReceiptFigures (app.js):
  // toate trei trebuie sa porneasca de la net + apa.
  const e = computeReceiptEstimate({ ...BASE, impurity: 5, payOnGrossQuantity: true });
  const dinDocument = e.provisionalNetQuantity + e.estimatedWaterLoss;
  assert.ok(Math.abs(e.payableQuantity - dinDocument) < 1e-9);
  assert.ok(
    Math.abs(e.preliminaryMerchandiseValue - dinDocument * 1000 * BASE.price) < 1e-6,
    "cantitate x pret = suma, ca extrasul semnat de furnizor sa se inchida"
  );
});

// Bifa E regula: nu exista prag de umiditate care sa o limiteze. Decizia e a omului,
// iar aplicatia ii cere o confirmare explicita inainte de a o accepta (in frontend).
test("bifa se aplica la orice umiditate in exces, fara prag", () => {
  for (const humidity of [15, 18, 20, 26]) {
    const e = computeReceiptEstimate({ ...BASE, humidity, payOnGrossQuantity: true });
    const exces = humidity - 14;
    assert.strictEqual(e.payOnGrossQuantity, true, `refuzata la +${exces} p.p.`);
    assert.strictEqual(e.dryingServiceTotal, 0);
    // Se plateste tot ce a intrat pe cantar, mai putin impuritatile (aici sunt in norma).
    assert.ok(Math.abs(e.payableQuantity - 100) < 1e-9, `baza gresita la +${exces} p.p.`);
  }
});

test("fara apa in exces flagul nu se inregistreaza (nu exista ce pune inapoi)", () => {
  const e = computeReceiptEstimate({ ...BASE, humidity: 14, payOnGrossQuantity: true });
  assert.strictEqual(e.payOnGrossQuantity, false);
  assert.ok(Math.abs(e.payableQuantity - e.provisionalNetQuantity) < 1e-9);
});

// Cerealele se socotesc in KILOGRAME INTREGI: cantarul lucreaza in kg, deci pierderile se
// rotunjesc la kg inainte de scadere. Fara asta, in stoc rămân cozi de 0,6 kg care apar ca
// „−1 kg" intr-un ecran si „0" in altul, pe aceeasi realitate.
test("pierderile se rotunjesc la kilogram intreg", () => {
  const e = computeReceiptEstimate({
    quantity: 2.907, price: 6.15, humidity: 17, impurity: 3.5,
    product: { humidityNorm: 14, impurityNorm: 2 }, tariffs: BASE.tariffs,
    fiscalProfile: { withholdingPercent: 6 }
  });
  // 2907 kg x 3% = 87,21 kg -> 87 kg;  2907 kg x 1,5% = 43,605 kg -> 44 kg.
  assert.equal(Math.round(e.estimatedWaterLoss * 1000), 87);
  assert.equal(Math.round(e.estimatedImpurityLoss * 1000), 44);
  assert.equal(Math.round(e.provisionalNetQuantity * 1000), 2907 - 87 - 44);
});

test("cantitatea neta e INTREAGA in kg pe orice combinatie", () => {
  for (let kgBrut = 1; kgBrut <= 3000; kgBrut += 13) {
    for (const h of [14, 14.3, 16.7, 20.9]) {
      for (const i of [2, 2.4, 5, 7.1]) {
        const e = computeReceiptEstimate({
          quantity: kgBrut / 1000, price: 6, humidity: h, impurity: i,
          product: { humidityNorm: 14, impurityNorm: 2 }, tariffs: BASE.tariffs,
          fiscalProfile: { withholdingPercent: 6 }
        });
        const netKg = e.provisionalNetQuantity * 1000;
        assert.ok(
          Math.abs(netKg - Math.round(netKg)) < 1e-6,
          `fractiune de kg la brut ${kgBrut}, umiditate ${h}, impuritati ${i}: ${netKg}`
        );
      }
    }
  }
});

test("si cantitatea PLATITA e intreaga pe masa cu umiditate", () => {
  for (let kgBrut = 1; kgBrut <= 3000; kgBrut += 29) {
    const e = computeReceiptEstimate({
      quantity: kgBrut / 1000, price: 6, humidity: 17, impurity: 3.5,
      product: { humidityNorm: 14, impurityNorm: 2 }, tariffs: BASE.tariffs,
      fiscalProfile: { withholdingPercent: 6 }, payOnGrossQuantity: true
    });
    const platitKg = e.payableQuantity * 1000;
    assert.ok(
      Math.abs(platitKg - Math.round(platitKg)) < 1e-6,
      `fractiune la plata, brut ${kgBrut}: ${platitKg}`
    );
  }
});

// Serviciile se taxeaza DOAR pe procentul peste norma — ca uscarea. Backend-ul ignora complet
// excesul de impuritati si taxa toata cantitatea: la 100 t, tarif 10 si 3% exces, ecranul
// arata 3.000 lei iar documentul salva 1.000.
test("curatirea se taxeaza doar pe excesul de impuritati", () => {
  const cu = computeReceiptEstimate({
    quantity: 100, price: 5, humidity: 14, impurity: 5,
    product: { humidityNorm: 14, impurityNorm: 2 },
    tariffs: [{ service: "Curatire", value: 10, active: true }],
    fiscalProfile: { withholdingPercent: 0 }
  });
  // 100 t x 3% exces x 10 = 3.000 lei (nu 100 x 10 = 1.000).
  assert.equal(Number(cu.cleaningServiceTotal.toFixed(2)), 3000);
});

test("impuritatile SUB norma nu se taxeaza deloc", () => {
  const sub = computeReceiptEstimate({
    quantity: 100, price: 5, humidity: 14, impurity: 1,
    product: { humidityNorm: 14, impurityNorm: 2 },
    tariffs: [{ service: "Curatire", value: 10, active: true }],
    fiscalProfile: { withholdingPercent: 0 }
  });
  assert.equal(sub.cleaningServiceTotal, 0);
  assert.equal(sub.estimatedImpurityLoss, 0);
});
