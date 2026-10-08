const test = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");

const { qrMatrix, qrSvg } = require("../public/qr.js");

// Amprenta unei matrice, ca sa putem ingheta rezultatul. Generatorul e scris de mana: doua
// erori (polinom generator inversat, informatie de format transpusa) dau un cod care ARATA
// bine, dar nu se scaneaza — deci nu se vad la citirea codului, doar cu telefonul in mana.
// Vectorii de mai jos au fost verificati cu un decodor independent (jsQR) si comparati modul
// cu modul cu un generator de referinta, pe toate cele 8 masti.
function amprenta(matrix) {
  const biti = matrix.map((rand) => rand.map((v) => (v ? "1" : "0")).join("")).join("");
  return crypto.createHash("sha256").update(biti).digest("hex").slice(0, 16);
}

const VECTORI = [
  { text: "TEST", latura: 21, amprenta: "05ca4983ad956b0e" },
  { text: "AgroProfit+ SRL", latura: 25, amprenta: "45aafd5010eecf2c" },
  { text: "x".repeat(213), latura: 57, amprenta: "f673820bb5ccd3f0" }
];

test("codul QR nu se schimba la refactor (vectori verificati cu un decodor independent)", () => {
  for (const v of VECTORI) {
    const m = qrMatrix(v.text);
    assert.ok(m, `textul de ${v.text.length} octeti trebuie sa incapa`);
    assert.equal(m.length, v.latura, `latura pentru ${v.text.length} octeti`);
    assert.equal(amprenta(m), v.amprenta, `matricea pentru ${JSON.stringify(v.text.slice(0, 12))}`);
  }
});

test("modelele fixe stau unde le cere standardul", () => {
  const m = qrMatrix("AgroProfit+");
  const n = m.length;
  for (const [r0, c0] of [[0, 0], [0, n - 7], [n - 7, 0]]) {
    for (let i = 0; i < 7; i += 1) {
      assert.equal(m[r0][c0 + i], true, "latura de sus a modelului de cautare");
      assert.equal(m[r0 + 6][c0 + i], true, "latura de jos");
      assert.equal(m[r0 + i][c0], true, "latura din stanga");
      assert.equal(m[r0 + i][c0 + 6], true, "latura din dreapta");
    }
    assert.equal(m[r0 + 1][c0 + 1], false, "inelul alb");
    assert.equal(m[r0 + 3][c0 + 3], true, "miezul negru");
  }
  // Randul si coloana de sincronizare alterneaza, incepand cu negru.
  for (let i = 8; i < n - 8; i += 1) {
    assert.equal(m[6][i], i % 2 === 0, `sincronizare pe rand, coloana ${i}`);
    assert.equal(m[i][6], i % 2 === 0, `sincronizare pe coloana, randul ${i}`);
  }
  assert.equal(m[n - 8][8], true, "modulul intunecat");
});

test("capacitatea: 213 octeti incap, 214 nu — apelantul primeste null, nu o exceptie", () => {
  assert.ok(qrMatrix("a".repeat(213)), "213 octeti trebuie sa incapa (versiunea 10)");
  assert.equal(qrMatrix("a".repeat(214)), null, "peste capacitate intoarce null");
  // Diacriticele ocupa doi octeti: limita e in OCTETI, nu in caractere.
  assert.equal(qrMatrix("ă".repeat(107)), null, "107 diacritice = 214 octeti");
});

test("versiunea creste cu textul, nu sare peste", () => {
  const laturi = [10, 30, 60, 100, 140, 180, 213].map((n) => qrMatrix("a".repeat(n)).length);
  for (let i = 1; i < laturi.length; i += 1) {
    assert.ok(laturi[i] >= laturi[i - 1], "latura nu scade cand textul creste");
  }
  assert.equal(laturi[0], 21, "un text scurt ramane pe versiunea 1");
  assert.equal(laturi.at(-1), 57, "213 octeti = versiunea 10");
});

test("SVG-ul are zona linistita si doar continut numeric", () => {
  const m = qrMatrix("AgroProfit+");
  const svg = qrSvg(m, 96);
  assert.match(svg, /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" viewBox="0 0 \d+ \d+"/);
  assert.match(svg, new RegExp(`viewBox="0 0 ${m.length + 8} ${m.length + 8}"`), "zona linistita de 4 module");
  // Textul utilizatorului devine biti, nu markup: nimic din el nu poate ajunge in SVG.
  const periculos = qrSvg(qrMatrix('"/><script>alert(1)</script>'), 96);
  assert.ok(!periculos.includes("script"), "niciun fragment de text in markup");
  assert.equal(qrSvg(null, 96), "", "fara matrice, fara SVG");
});
