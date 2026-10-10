const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

// Pragurile de serie sint scrise in DOUA locuri: in JS (folosit cand migrarea nu e aplicata)
// si in SQL (folosit cand e). Divergenta lor nu da eroare — doar aloca un numar gresit pe un
// document fiscal. Precedentul `deliveryReceivableTonnePrice` din CLAUDE.md.

const RAD = path.join(__dirname, "..");

test("pragurile de serie coincid intre JS si SQL", () => {
  const js = fs.readFileSync(path.join(RAD, "src", "local-storage.js"), "utf8");
  const sql = fs.readFileSync(
    path.join(RAD, "migrations", "001-numerotare-atomica-acte.sql"), "utf8"
  );

  const bloc = js.match(/const PRAGURI_SERIE = [^;]+;/)[0];
  const serii = [...bloc.matchAll(/(\w+):\s*(\d+)/g)].map((m) => [m[1].toUpperCase(), Number(m[2])]);
  assert.ok(serii.length >= 1, "nicio serie in PRAGURI_SERIE");

  const linie = sql.match(/v_prag integer := case when v_series in \(([^)]*)\) then (\d+)/);
  assert.ok(linie, "pragul din SQL nu s-a gasit in forma asteptata");
  const seriiSql = [...linie[1].matchAll(/'([^']+)'/g)].map((m) => m[1].toUpperCase());
  const pragSql = Number(linie[2]);

  for (const [serie, prag] of serii) {
    assert.ok(seriiSql.includes(serie), `seria ${serie} are prag in JS dar NU in SQL`);
    assert.equal(prag, pragSql, `pragul seriei ${serie} difera: JS ${prag}, SQL ${pragSql}`);
  }
  for (const serie of seriiSql) {
    assert.ok(
      serii.some(([s]) => s === serie),
      `seria ${serie} are prag in SQL dar NU in JS`
    );
  }
});

test("seria noua AA nu are prag in niciunul din locuri", () => {
  // Daca ar capata unul, actele noi ar porni de la 914 in loc de 1.
  const js = fs.readFileSync(path.join(RAD, "src", "local-storage.js"), "utf8");
  const sql = fs.readFileSync(
    path.join(RAD, "migrations", "001-numerotare-atomica-acte.sql"), "utf8"
  );
  assert.ok(!/PRAGURI_SERIE[^;]*\bAA\b/.test(js), "AA are prag in JS");
  assert.ok(!/v_prag[^;]*'AA'/.test(sql), "AA are prag in SQL");
});
