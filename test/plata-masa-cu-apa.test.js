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

test("pragul intelegerii: peste 4 p.p. bifa nu se aplica", () => {
  // +6 p.p. umiditate: nu mai e toleranta, ar fi grau platit ca apa.
  const ud = { ...BASE, humidity: 20 };
  const e = computeReceiptEstimate({ ...ud, payOnGrossQuantity: true });
  assert.strictEqual(e.payOnGrossQuantity, false, "serverul refuza, nu accepta tacut");
  assert.ok(Math.abs(e.payableQuantity - e.provisionalNetQuantity) < 1e-9);
  assert.ok(e.dryingServiceTotal > 0, "uscarea ramane taxata cand bifa nu se aplica");
});

test("la limita exacta de 4 p.p. bifa inca se aplica", () => {
  const e = computeReceiptEstimate({ ...BASE, humidity: 18, payOnGrossQuantity: true });
  assert.strictEqual(e.payOnGrossQuantity, true);
  assert.ok(Math.abs(e.payableQuantity - 100) < 1e-9);
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
