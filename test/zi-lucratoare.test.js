const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const { ziLucratoare } = require("../src/local-storage");

// Marfa intra si simbata, si duminica. Furnizorul ajunge la contabilitate LUNI, iar
// documentul se perfecteaza atunci. Regula muta data de pe HIRTIE, nu faptul: receptia
// ramine inregistrata la ziua ei reala.

const ZI = (iso) => ["dum", "lun", "mar", "mie", "joi", "vin", "sim"][
  new Date(`${iso}T12:00:00`).getDay()
];

test("weekendul se muta pe lunea urmatoare", () => {
  // 10 oct. 2026 = simbata, 11 = duminica, 12 = luni.
  assert.equal(ziLucratoare("2026-10-10"), "2026-10-12");
  assert.equal(ziLucratoare("2026-10-11"), "2026-10-12");
});

test("zilele lucratoare raman neatinse", () => {
  for (const z of ["2026-10-12", "2026-10-13", "2026-10-14", "2026-10-15", "2026-10-16"]) {
    assert.equal(ziLucratoare(z), z, `${z} e ${ZI(z)}`);
  }
});

test("la granita de LUNA se merge inapoi, nu inainte", () => {
  // Altfel o receptie de simbata 31 oct. ar primi act pe 2 noiembrie: in 1C documentul si
  // impozitul retinut intra pe noiembrie, in timp ce receptia, stocul si registrul raman pe
  // octombrie. Doua luni fiscale pentru aceeasi marfa.
  assert.equal(ziLucratoare("2026-10-31"), "2026-10-30", "simbata 31 oct -> vineri 30 oct");
  assert.equal(ziLucratoare("2026-05-30"), "2026-05-29", "simbata 30 mai (31 e duminica)");
  assert.equal(ziLucratoare("2026-05-31"), "2026-05-29", "duminica 31 mai");
  assert.equal(ziLucratoare("2026-01-31"), "2026-01-30", "simbata 31 ian");
  // Si la granita de AN.
  assert.equal(ziLucratoare("2026-02-28"), "2026-02-27", "simbata 28 feb, an nebisect");

  // Luna rezultata e mereu aceeasi cu cea de intrare — invarianta care conteaza la inchidere.
  for (let an = 2025; an <= 2030; an += 1) {
    for (let luna = 1; luna <= 12; luna += 1) {
      const ultima = new Date(an, luna, 0).getDate();
      for (let zi = ultima - 3; zi <= ultima; zi += 1) {
        const iso = `${an}-${String(luna).padStart(2, "0")}-${String(zi).padStart(2, "0")}`;
        const out = ziLucratoare(iso);
        assert.equal(out.slice(0, 7), iso.slice(0, 7), `${iso} a sarit in alta luna: ${out}`);
        assert.ok(!["sim", "dum"].includes(ZI(out)), `${iso} -> ${out} cade in weekend`);
      }
    }
  }
});

test("rezultatul nu cade NICIODATA in weekend", () => {
  const d = new Date(2026, 0, 1);
  for (let i = 0; i < 400; i += 1) {
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    assert.ok(!["sim", "dum"].includes(ZI(ziLucratoare(iso))), `${iso} -> ${ziLucratoare(iso)}`);
    d.setDate(d.getDate() + 1);
  }
});

test("intrarile care nu sint date se intorc neschimbate, fara exceptie", () => {
  for (const rau of ["", null, undefined, "maine", "azi", {}, [], 7, "x".repeat(5000)]) {
    assert.doesNotThrow(() => ziLucratoare(rau));
  }
  assert.equal(ziLucratoare(""), "");
  assert.equal(ziLucratoare("maine"), "maine");
});

test("ora se taie: documentul poarta ziua, nu momentul", () => {
  assert.equal(ziLucratoare("2026-10-10T07:30:00.000Z"), "2026-10-12");
  assert.equal(ziLucratoare("2026-10-12T23:59:59.000Z"), "2026-10-12");
});

// ---------------------------------------------------------------------------
// OGLINDA. Regula e scrisa de doua ori — in magazie (actul, exportul 1C) si in frontend
// (ordinul de plata tiparit). Precedentul `deliveryReceivableTonnePrice` din CLAUDE.md:
// doua copii fara test de divergenta se despart la prima editare facuta intr-un singur loc.
// ---------------------------------------------------------------------------

function extrageFunctia(cale) {
  const sursa = fs.readFileSync(path.join(__dirname, "..", cale), "utf8");
  const m = sursa.match(/function ziLucratoare\(valoare\) \{[\s\S]*?\n\}/);
  assert.ok(m, `ziLucratoare nu a fost gasita in ${cale}`);
  return m[0];
}

test("oglinda din frontend e IDENTICA cu cea din magazie", () => {
  const spate = extrageFunctia("src/local-storage.js");
  const fata = extrageFunctia("public/app.js");
  assert.equal(
    fata.replace(/\r\n/g, "\n"),
    spate.replace(/\r\n/g, "\n"),
    "cele doua copii ale regulii au divergat — se schimba in AMBELE locuri"
  );
});

test("oglinda chiar CALCULEAZA la fel, nu doar arata la fel", () => {
  // Compararea textului prinde o editare uitata; asta prinde si cazul in care cineva
  // rescrie una dintre copii altfel, dar cu acelasi efect aparent.
  const oglinda = new Function(`${extrageFunctia("public/app.js")}; return ziLucratoare;`)();
  const d = new Date(2025, 0, 1);
  for (let i = 0; i < 1200; i += 1) {
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    assert.equal(oglinda(iso), ziLucratoare(iso), `divergenta pe ${iso}`);
    d.setDate(d.getDate() + 1);
  }
});
