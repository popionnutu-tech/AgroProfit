const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

// Regulile de totalizare traiesc in frontend, dar deciziile lor sint pur functionale:
// se extrag si se verifica aici. Fara asta, singura verificare ar fi privitul pe ecran.
const SRC = fs.readFileSync(path.join(__dirname, "..", "public", "app.js"), "utf8");

function bucata(nume) {
  const start = SRC.indexOf(`function ${nume}(`);
  assert.ok(start >= 0, `${nume} nu exista in app.js`);
  return SRC.slice(start, SRC.indexOf("\n}", start) + 2);
}

const lista = SRC.slice(
  SRC.indexOf("const COLOANE_FARA_TOTAL"),
  SRC.indexOf("];", SRC.indexOf("const COLOANE_FARA_TOTAL")) + 2
);

const { coloanaSeAduna, numarDinCelula } = new Function(
  `${lista}
   ${bucata("faraDiacritice")}
   ${bucata("coloanaSeAduna")}
   ${bucata("numarDinCelula")}
   return { coloanaSeAduna, numarDinCelula };`
)();

test("se aduna cantitatile si sumele", () => {
  for (const antet of [
    "Cantitate (kg)", "Masă brută (kg)", "Suma", "Sumă factură", "Valoare",
    "Stoc final (kg)", "Rest de plată", "Tone", "Suprafață", "Total acțiuni"
  ]) {
    assert.equal(coloanaSeAduna(antet), true, `„${antet}" trebuia adunata`);
  }
});

test("NU se aduna preturi unitare, procente si numere de document", () => {
  // Totalul coloanei „Pret lei/kg" e un numar fara inteles, iar pe un ecran financiar
  // induce in eroare mai rau decat lipsa lui.
  for (const antet of [
    "Pret", "Preț (lei/kg)", "Cota impozit (%)", "Umiditate", "Impurități",
    "Act nr.", "Nr. recepție", "ID", "Data", "Status", "Utilizator", "Invoice",
    "Randament", "Norma"
  ]) {
    assert.equal(coloanaSeAduna(antet), false, `„${antet}" NU trebuia adunata`);
  }
});

test("numerele se citesc in format romanesc", () => {
  // Pe ecran apar ca `1.234,56` — punctul separa miile, virgula zecimalele.
  assert.equal(numarDinCelula("1.234,56"), 1234.56);
  assert.equal(numarDinCelula("12.345.678,90"), 12345678.9);
  assert.equal(numarDinCelula("-1.000,50"), -1000.5);
  assert.equal(numarDinCelula("2.907"), 2907);
  // Unitatile se ignora: coloana poate scrie „5.640,00 lei".
  assert.equal(numarDinCelula("5.640,00 lei"), 5640);
  assert.equal(numarDinCelula("2 907 kg"), 2907);
});

test("ce nu e numar NU se aduna din greseala", () => {
  // Altfel o coloana de text cu cifre pe ici pe colo ar produce un total inventat.
  for (const text of ["", "—", "Grau", "AP 914", "#1247", "2026-10-12", "Achitat", "da"]) {
    assert.equal(numarDinCelula(text), null, `„${text}" nu e numar`);
  }
});

test("mecanismul se aplica singur, nu prin 33 de apeluri", () => {
  // Scris de mana in fiecare randare, s-ar fi dezlipit la prima functie noua.
  assert.match(SRC, /new MutationObserver/, "lipseste observatorul");
  assert.match(SRC, /data-auto-total/, "lipseste marcajul de total automat");
  // Tabelele care isi scriu singure totalul nu se ating.
  assert.match(SRC, /totalPropriu/, "lipseste garda pentru totalurile scrise de mana");
});
