const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const { receiptPayableTonnes } = require("../src/local-storage");

// `public/app.js` e script de browser, nu modul — se extrag functiile dupa nume. Daca una e
// redenumita sau stearsa, testul cade ZGOMOTOS: exact ce trebuie pentru o oglinda pe care
// CLAUDE.md cere sa fie schimbata „in AMBELE locuri".
function extrageFunctii(nume) {
  const sursa = fs.readFileSync(path.join(__dirname, "..", "public", "app.js"), "utf8");
  const bucati = nume.map((n) => {
    const start = sursa.indexOf(`function ${n}(`);
    assert.ok(start >= 0, `functia ${n} nu mai exista in public/app.js`);
    // Se taie pana la acolada de inchidere din coloana 0 (stilul fisierului).
    const sfarsit = sursa.indexOf("\n}", start);
    assert.ok(sfarsit > start, `nu am putut delimita ${n}`);
    return sursa.slice(start, sfarsit + 2);
  });
  return new Function(`${bucati.join("\n")}\nreturn { ${nume.join(", ")} };`)();
}

const { actReceiptFigures, actPriceDecimals, actDerivePrice } = extrageFunctii([
  "actReceiptFigures",
  "actPriceDecimals",
  "actDerivePrice"
]);

// „5 = 3 x 4" e tiparit in capul de tabel al formularului tipizat: cantitate x pret = valoare.
function inchideAritmetic(fig) {
  const dec = actPriceDecimals(fig.price, fig.netKg, fig.value);
  const pretTiparit = Number(fig.price.toFixed(dec));
  return Math.abs(fig.netKg * pretTiparit - fig.value) < 0.01;
}

test("actul se inchide aritmetic: cantitate x pret = valoare", () => {
  const cazuri = [
    { nume: "pret rotund", r: { provisionalNetQuantity: 28.74, price: 6.15, preliminaryMerchandiseValue: 176751 } },
    { nume: "pers. juridica", r: { provisionalNetQuantity: 22.5, price: 5.4, preliminaryMerchandiseValue: 121500 } },
    // Dupa ajustarea manuala a sumei (✎) pretul are 4 zecimale — cazul care rupea relatia.
    { nume: "pret cu 4 zecimale", r: { provisionalNetQuantity: 0.83616, price: 6.1234, preliminaryMerchandiseValue: 5120.16 } },
    { nume: "cantitate mica", r: { provisionalNetQuantity: 0.1235, price: 7.77, preliminaryMerchandiseValue: 959.6 } }
  ];
  for (const c of cazuri) {
    const fig = actReceiptFigures(c.r);
    assert.ok(
      inchideAritmetic(fig),
      `${c.nume}: ${fig.netKg} kg x ${fig.price} != ${fig.value}`
    );
  }
});

test("un pret rotund nu se tipareste cu zerouri in plus", () => {
  // 1000 kg x 6,15 = 6150 se inchide din 2 zecimale.
  assert.equal(actPriceDecimals(6.15, 1000, 6150), 2);
  assert.equal(actPriceDecimals(5.4, 1000, 5400), 2);
  // Cazul real care rupea relatia: are nevoie de 5 zecimale ca sa iasa.
  assert.equal(actPriceDecimals(6.12342, 836.16, 5120.16), 5);
  // Fara cantitate/valoare nu exista relatie de inchis: pretul se afiseaza cum e.
  assert.equal(actPriceDecimals(6.15, 0, 0), 2);
});

test("cantitatea de pe act = cantitatea PLATITA din backend (oglinda)", () => {
  const cazuri = [
    { provisionalNetQuantity: 97, quantity: 100, estimatedWaterLoss: 3, payOnGrossQuantity: false },
    { provisionalNetQuantity: 97, quantity: 100, estimatedWaterLoss: 3, payOnGrossQuantity: true },
    // Marfa murdara: apa se pune inapoi, impuritatile NU.
    { provisionalNetQuantity: 94, quantity: 100, estimatedWaterLoss: 3, payOnGrossQuantity: true },
    { quantity: 50 }
  ];
  for (const r of cazuri) {
    const fig = actReceiptFigures(r);
    assert.equal(
      Math.round(fig.netKg),
      Math.round(receiptPayableTonnes(r) * 1000),
      `oglinda a divergat pe ${JSON.stringify(r)}`
    );
  }
});

test("pe masa cu umiditate se adauga DOAR apa", () => {
  const murdar = { provisionalNetQuantity: 94, quantity: 100, estimatedWaterLoss: 3, payOnGrossQuantity: true };
  // 94 t net + 3 t apa = 97 t; NU 100 t (cele 3 t de impuritati nu se platesc).
  assert.equal(Math.round(actReceiptFigures(murdar).netKg), 97000);
});
