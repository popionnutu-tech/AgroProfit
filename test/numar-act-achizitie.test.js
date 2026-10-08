const test = require("node:test");
const assert = require("node:assert/strict");

const { withIsolatedWorkspace } = require("../test-support/isolated-runtime");

// Actele de DINAINTE de 02.10.2026 rămân nenumerotate (au numere scrise de mana pe hartie).
// Sirul porneste de la 914 — actul lui Furnizor Testov — si creste cu 1.
const START = 914;

async function receptie(storage, nume) {
  return storage.createReceipt({
    supplier: nume, supplierId: 1, product: "Floarea soarelui", productId: 1,
    quantity: 2.907, grossQuantity: 2.907, provisionalNetQuantity: 2.907,
    unit: "tone", price: 6.15, location: "Cilindru 1", locationId: 1
  });
}
const PF = {
  isNaturalPerson: true, series: "AP", companyId: 1, actorRole: "admin", changedBy: "admin"
};

test("primul act emis primeste 914, urmatorul 915", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const a = await receptie(storage, "Furnizor Testov");
    const b = await receptie(storage, "Alt furnizor");

    const unu = await storage.assignActNumber([a.id], PF);
    assert.equal(unu.actNumber, START);
    assert.equal(unu.actSeries, "AP");

    const doi = await storage.assignActNumber([b.id], PF);
    assert.equal(doi.actNumber, START + 1);
  });
});

test("reimprimarea da ACELASI numar, nu unul nou", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const a = await receptie(storage, "Furnizor Testov");
    const prima = await storage.assignActNumber([a.id], PF);
    for (let i = 0; i < 5; i += 1) {
      const iar = await storage.assignActNumber([a.id], PF);
      assert.equal(iar.actNumber, prima.actNumber, "numarul s-a schimbat la reimprimare");
    }
    // Un singur numar consumat: urmatorul act ia 915, nu 919.
    const b = await receptie(storage, "Alt furnizor");
    assert.equal((await storage.assignActNumber([b.id], PF)).actNumber, START + 1);
  });
});

test("numerele nu se repeta niciodata", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const numere = [];
    for (let i = 0; i < 12; i += 1) {
      const r = await receptie(storage, `Furnizor ${i}`);
      numere.push((await storage.assignActNumber([r.id], PF)).actNumber);
    }
    assert.equal(new Set(numere).size, numere.length, "un numar s-a repetat");
    assert.deepEqual(numere, numere.slice().sort((x, y) => x - y), "sirul nu e crescator");
    assert.equal(numere[0], START);
  });
});

test("achizitia de la FIRMA nu consuma numar", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const firma = await receptie(storage, "Agro SRL");
    await assert.rejects(
      () => storage.assignActNumber([firma.id], { ...PF, isNaturalPerson: false }),
      /persoane fizice/i
    );
    // Sirul rămâne neatins: prima persoana fizica ia tot 914.
    const pf = await receptie(storage, "Furnizor Testov");
    assert.equal((await storage.assignActNumber([pf.id], PF)).actNumber, START);
  });
});

test("doar contabilul si adminul emit acte", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const r = await receptie(storage, "Furnizor Testov");
    for (const rol of ["operator", "manager", "control"]) {
      await assert.rejects(
        () => storage.assignActNumber([r.id], { ...PF, actorRole: rol }),
        /contabilul sau administratorul/i,
        `rolul ${rol} nu trebuia sa poata`
      );
    }
    for (const rol of ["accountant", "accountant-sef", "admin"]) {
      const curat = await receptie(storage, `F ${rol}`);
      assert.ok((await storage.assignActNumber([curat.id], { ...PF, actorRole: rol })).actNumber > 0);
    }
  });
});

test("emiterea lasa urma in audit", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const r = await receptie(storage, "Furnizor Testov");
    await storage.assignActNumber([r.id], PF);
    const logs = await storage.listAuditLogs();
    const intrare = logs.find((l) => l.action === "receipt-act-number");
    assert.ok(intrare, "lipseste intrarea de audit");
    assert.equal(intrare.newValue.actNumber, START);
    assert.equal(intrare.newValue.actSeries, "AP");
  });
});

test("nu se emite act pe o receptie care nu e in stoc", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const proiect = await storage.createReceipt({
      supplier: "Furnizor Testov", supplierId: 1, product: "Floarea soarelui", productId: 1,
      quantity: 2.907, unit: "tone", price: 6.15, location: "Cilindru 1", locationId: 1,
      isDraft: true, actorRole: "accountant"
    });
    await assert.rejects(() => storage.assignActNumber([proiect.id], PF), /nu e in stoc/i);
  });
});

test("fiecare firma are propriul sir — fara gauri in registrul niciuneia", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const PAT = { ...PF, companyId: 1, series: "PAT" };
    const AGR = { ...PF, companyId: 2, series: "AGR" };

    const a = await receptie(storage, "F1");
    const b = await receptie(storage, "F2");
    const c = await receptie(storage, "F3");

    assert.equal((await storage.assignActNumber([a.id], PAT)).actNumber, START);
    // Alta firma porneste propriul sir, nu continua pe al primei.
    assert.equal((await storage.assignActNumber([b.id], AGR)).actNumber, START);
    // Prima firma continua de unde a ramas: fara gaura.
    assert.equal((await storage.assignActNumber([c.id], PAT)).actNumber, START + 1);
  });
});

test("firma emitenta e obligatorie", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const r = await receptie(storage, "Furnizor Testov");
    await assert.rejects(
      () => storage.assignActNumber([r.id], { ...PF, companyId: null }),
      /[Ff]irma emitenta/
    );
  });
});

test("receptia cu act emis nu se poate anula", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const r = await receptie(storage, "Furnizor Testov");
    await storage.assignActNumber([r.id], PF);
    await assert.rejects(
      () => storage.cancelReceipt(r.id, {
        reason: "greseala", currentUser: { roleCode: "admin" }, changedBy: "admin"
      }),
      /storneaza actul intai/i
    );
    // Fara act emis, anularea merge ca inainte.
    const curat = await receptie(storage, "Alt furnizor");
    const anulat = await storage.cancelReceipt(curat.id, {
      reason: "greseala", currentUser: { roleCode: "admin" }, changedBy: "admin"
    });
    assert.equal(anulat.status, "Anulat");
  });
});

test("un act pe mai multe receptii consuma UN numar, dar il primesc toate", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const a = await receptie(storage, "Furnizor Testov");
    const b = await receptie(storage, "Furnizor Testov");
    const c = await receptie(storage, "Furnizor Testov");

    const act = await storage.assignActNumber([a.id, b.id, c.id], PF);
    assert.equal(act.actNumber, START);

    // Toate trei purta numarul: una tiparita ulterior individual NU mai arde un numar nou.
    const toate = (await storage.listReceipts()).filter((r) => [a.id, b.id, c.id].includes(r.id));
    assert.equal(toate.length, 3);
    for (const r of toate) assert.equal(Number(r.actNumber), START, `receptia #${r.id} nenumerotata`);

    // Reemiterea pe oricare dintre ele intoarce acelasi numar, nu unul nou.
    assert.equal((await storage.assignActNumber([b.id], PF)).actNumber, START);
    assert.equal((await storage.assignActNumber([c.id], PF)).actNumber, START);

    // Un act nou, pe alta receptie, ia 915 — nu 917.
    const d = await receptie(storage, "Alt furnizor");
    assert.equal((await storage.assignActNumber([d.id], PF)).actNumber, START + 1);
  });
});

test("cifrele actului se ingheata la emitere", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const r = await receptie(storage, "Furnizor Testov");
    const emis = await storage.assignActNumber([r.id], PF);

    const cifre = emis.actFigures;
    assert.ok(cifre, "lipsesc cifrele inghetate");
    assert.equal(cifre.netKg, 2907);
    const valoareLaEmitere = cifre.value;
    const netLaEmitere = cifre.netPay;
    assert.ok(valoareLaEmitere > 0);

    // Contabilul corecteaza suma DUPA emitere.
    await storage.updateReceiptAmount(r.id, valoareLaEmitere * 2, "admin", "corectie");

    // Cifrele actului NU se schimba: hartia semnata rămâne valabila.
    const dupa = (await storage.listReceipts()).find((x) => x.id === r.id);
    assert.equal(dupa.actFigures.value, valoareLaEmitere, "valoarea actului s-a rescris");
    assert.equal(dupa.actFigures.netPay, netLaEmitere, "netul actului s-a rescris");
    assert.equal(Number(dupa.actNumber), START, "numarul s-a schimbat");
  });
});

test("actul acopera un singur furnizor", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const a = await receptie(storage, "Furnizor Testov");
    // Receptie a ALTUI furnizor (alt supplierId).
    const b = await storage.createReceipt({
      supplier: "Alt Om", supplierId: 2, product: "Floarea soarelui", productId: 1,
      quantity: 1, grossQuantity: 1, provisionalNetQuantity: 1,
      unit: "tone", price: 6, location: "Cilindru 1", locationId: 1
    });
    // Un act e al UNUI furnizor: magazia refuza amestecul, nu doar handlerul.
    await assert.rejects(
      () => storage.assignActNumber([a.id, b.id], PF),
      /singur furnizor/i
    );
  });
});

test("si RANDURILE se ingheata: actul nu se contrazice pe aceeasi hartie", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const r = await receptie(storage, "Furnizor Testov");
    const emis = await storage.assignActNumber([r.id], PF);
    const randuri = emis.actFigures.rows;
    assert.ok(Array.isArray(randuri) && randuri.length === 1, "lipsesc randurile inghetate");
    const randLaEmitere = randuri[0];
    assert.equal(randLaEmitere.netKg, 2907);
    assert.equal(randLaEmitere.product, "Floarea soarelui");
    // Suma de pe rand = totalul (o singura receptie).
    assert.equal(randLaEmitere.value, emis.actFigures.value);

    // Contabilul dubleaza suma DUPA emitere.
    await storage.updateReceiptAmount(r.id, emis.actFigures.value * 2, "admin", "corectie");

    const dupa = (await storage.listReceipts()).find((x) => x.id === r.id);
    // Randul si totalul au rămas AMANDOUA pe cifrele de la emitere, deci coincid.
    assert.equal(dupa.actFigures.rows[0].value, randLaEmitere.value, "randul s-a rescris");
    assert.equal(dupa.actFigures.value, randLaEmitere.value, "totalul s-a rescris");
    assert.equal(
      dupa.actFigures.rows.reduce((s, x) => s + x.value, 0),
      dupa.actFigures.value,
      "randurile nu mai dau totalul"
    );
  });
});

test("randurile inghetate dau exact totalul, si pe act multi-receptie", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const a = await receptie(storage, "Furnizor Testov");
    const b = await receptie(storage, "Furnizor Testov");
    const emis = await storage.assignActNumber([a.id, b.id], PF);
    const f = emis.actFigures;
    assert.equal(f.rows.length, 2);
    assert.equal(Number(f.rows.reduce((s, x) => s + x.value, 0).toFixed(2)), f.value);
    assert.equal(Number(f.rows.reduce((s, x) => s + x.netKg, 0).toFixed(3)), f.netKg);
    // Retinerea e diferenta brut - net, consecventa cu randurile.
    assert.equal(f.tax, Number((f.value - f.netPay).toFixed(2)));
  });
});

test("reimprimarea de pe o receptie acoperita da actul INTREG", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const a = await receptie(storage, "Furnizor Testov");
    const b = await receptie(storage, "Furnizor Testov");
    const c = await receptie(storage, "Furnizor Testov");
    const emis = await storage.assignActNumber([a.id, b.id, c.id], PF);

    // Captura sta o SINGURA data, pe purtator (altfel un act de 50 de receptii ingrosa
    // blobul cu 364 KB). Celelalte primesc o REFERINTA: tiparirea individuala rezolva
    // captura prin purtator, deci nu cade pe recalcul.
    const toate = (await storage.listReceipts()).filter((r) => [a.id, b.id, c.id].includes(r.id));
    const purtatori = toate.filter((r) => r.actFigures);
    assert.equal(purtatori.length, 1, "captura trebuie sa fie pe o singura receptie");
    assert.equal(purtatori[0].actFigures.rows.length, 3);
    for (const r of toate.filter((x) => !x.actFigures)) {
      assert.equal(
        Number(r.actCarrierId),
        Number(purtatori[0].id),
        `receptia #${r.id} nu are referinta la purtator`
      );
    }
    // Reimprimarea de pe oricare: acelasi act, intreg.
    const reimprimat = await storage.assignActNumber([b.id], PF);
    assert.equal(reimprimat.actNumber, emis.actNumber);
    assert.equal(reimprimat.actFigures.rows.length, 3);
  });
});

test("emiterea AMESTECATA (acoperit + marfa noua) e refuzata", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const a = await receptie(storage, "Furnizor Testov");
    const b = await receptie(storage, "Furnizor Testov");
    await storage.assignActNumber([a.id, b.id], PF);

    const noua = await receptie(storage, "Furnizor Testov");
    await assert.rejects(
      () => storage.assignActNumber([b.id, noua.id], PF),
      /deja pe actul/i
    );
    // Marfa noua NU a fost atinsa: poate primi propriul act.
    const dupa = (await storage.listReceipts()).find((r) => r.id === noua.id);
    assert.ok(!Number(dupa.actNumber), "marfa noua a fost marcata degeaba");
    assert.equal((await storage.assignActNumber([noua.id], PF)).actNumber, START + 1);
  });
});

test("data si furnizorul se ingheata pe act", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const r = await receptie(storage, "Furnizor Testov");
    const emis = await storage.assignActNumber([r.id], PF);
    assert.ok(emis.actFigures.rows[0].date, "lipseste data pe randul inghetat");
    assert.equal(emis.actFigures.supplierName, "Furnizor Testov");
    assert.equal(emis.actFigures.companyId, 1);
    assert.equal(emis.actFigures.series, "AP");
  });
});

test("furnizorul nu se mai poate schimba dupa emiterea actului", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const r = await receptie(storage, "Furnizor Testov");
    await storage.assignActNumber([r.id], PF);
    await assert.rejects(
      () => storage.updateReceiptSupplier(r.id, 2, "admin"),
      /storneaza actul intai/i
    );
  });
});

test("anularea prin ruta de STATUS e blocata la fel ca `cancelReceipt`", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const r = await receptie(storage, "Furnizor Testov");
    await storage.assignActNumber([r.id], PF);
    await assert.rejects(
      () => storage.updateReceiptStatusWithAudit(r.id, "Anulat", {
        changeReason: "incerc pe alt drum", actorRole: "admin", changedBy: "admin"
      }),
      /storneaza actul intai/i
    );
  });
});

test("lista de receptii e tipizata si plafonata", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const r = await receptie(storage, "Furnizor Testov");
    for (const rea of [[true], [[r.id]], [-1], [0], [1.5], []]) {
      await assert.rejects(() => storage.assignActNumber(rea, PF), /invalida|niciuna/i,
        `intrarea ${JSON.stringify(rea)} nu trebuia acceptata`);
    }
    await assert.rejects(
      () => storage.assignActNumber(Array.from({ length: 51 }, (_, i) => i + 1), PF),
      /50 de receptii/
    );
  });
});

test("numar dublat de o scriere pierduta NU mai trece la reincercare", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const a = await receptie(storage, "Furnizor Testov");
    const b = await receptie(storage, "Alt furnizor");
    await storage.assignActNumber([a.id], PF);
    await storage.assignActNumber([b.id], PF);

    // Simulam cursa: b pierde incrementul si ajunge pe numarul lui a.
    const stare = JSON.parse(JSON.stringify(await storage.exportState?.() || {}));
    // Fara export, modificam prin corectia de suma? Folosim calea directa de fisier:
    const fs = require("fs");
    const path = require("path");
    const file = path.join(process.cwd(), ".runtime-data", "receipts.json");
    const blob = JSON.parse(fs.readFileSync(file, "utf8"));
    const bRec = blob.receipts.find((r) => r.id === b.id);
    bRec.actNumber = START; // duplicat
    bRec.actFigures = { ...bRec.actFigures, receiptIds: [b.id] };
    fs.writeFileSync(file, JSON.stringify(blob));

    const proaspat = load("src/local-storage.js");
    await assert.rejects(
      () => proaspat.assignActNumber([a.id], PF),
      /[Nn]umar dublat/,
      "duplicatul a trecut drept succes"
    );
  });
});

test("identitatea partilor si antetul firmei se ingheata", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const r = await receptie(storage, "Furnizor Testov");
    const emis = await storage.assignActNumber([r.id], {
      ...PF,
      supplier: { name: "Furnizor Testov", idno: "2001234567890", address: "s. Briceni" },
      company: { name: "Firma SRL", idno: "1003600000000", address: "or. Briceni", admin: "Pop Nutu" }
    });
    const f = emis.actFigures;
    assert.equal(f.supplierIdno, "2001234567890");
    assert.equal(f.supplierAddress, "s. Briceni");
    assert.equal(f.company.name, "Firma SRL");
    assert.equal(f.company.idno, "1003600000000");
    assert.equal(f.company.admin, "Pop Nutu");
  });
});

test("fuziunea de parteneri e blocata pe receptii cu act emis", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const r = await receptie(storage, "Furnizor Testov");
    await storage.assignActNumber([r.id], PF);
    assert.throws(
      () => storage.reassignPartnerReferences(1, 2, "admin"),
      /acte de achizitie emise/i
    );
  });
});

// Alocarea ATOMICA e in PostgreSQL; aplicatia trebuie sa functioneze si INAINTE de migrare,
// cazand pe derivarea din blob. Aici verificam contractul de fallback, nu Postgres.
test("fara migrare se cade pe derivarea din blob, fara sa se rupa nimic", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const r = await receptie(storage, "Furnizor Testov");
    const emis = await storage.assignActNumber([r.id], PF);
    assert.equal(emis.actNumber, START);
    // Driverul local nu are alocare atomica -> sursa e „blob", consemnata pe document.
    assert.equal(emis.actNumberSource, "blob");
  });
});

test("sursa numarului intra in audit, ca sa se vada pe ce mecanism s-a emis", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const r = await receptie(storage, "Furnizor Testov");
    await storage.assignActNumber([r.id], PF);
    const logs = await storage.listAuditLogs();
    const intrare = logs.find((l) => l.action === "receipt-act-number");
    assert.ok(intrare, "lipseste intrarea de audit");
    assert.equal(intrare.newValue.numberSource, "blob");
  });
});

test("captura nu se multiplica: o singura copie, restul doar referinta", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const multe = [];
    for (let i = 0; i < 10; i += 1) multe.push(await receptie(storage, "Furnizor Testov"));
    const emis = await storage.assignActNumber(multe.map((r) => r.id), PF);

    const toate = (await storage.listReceipts()).filter((r) =>
      multe.some((m) => m.id === r.id)
    );
    // O capturã, nouă referințe — nu zece capturi cu zece rânduri fiecare.
    assert.equal(toate.filter((r) => r.actFigures).length, 1);
    assert.equal(toate.filter((r) => Number(r.actCarrierId || 0) === Number(emis.id)).length, 9);

    // Captura pastreaza toate cele 10 randuri, deci actul e intreg.
    assert.equal(emis.actFigures.rows.length, 10);

    // Dimensiunea serializata: o captura, nu zece.
    const octeti = toate.reduce(
      (s, r) => s + (r.actFigures ? JSON.stringify(r.actFigures).length : 0),
      0
    );
    assert.equal(octeti, JSON.stringify(emis.actFigures).length);
  });
});

test("auditul emiterii pastreaza totalurile, nu captura intreaga", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const a = await receptie(storage, "Furnizor Testov");
    const b = await receptie(storage, "Furnizor Testov");
    const emis = await storage.assignActNumber([a.id, b.id], PF);

    const logs = await storage.listAuditLogs();
    const intrare = logs.find((l) => l.action === "receipt-act-number");
    assert.ok(!intrare.newValue.figures, "captura intreaga mai e in audit");
    assert.deepEqual(intrare.newValue.totals, {
      netKg: emis.actFigures.netKg,
      value: emis.actFigures.value,
      netPay: emis.actFigures.netPay,
      tax: emis.actFigures.tax
    });
    assert.deepEqual(intrare.newValue.receiptIds, [a.id, b.id]);
  });
});

test("divergenta act-registru se inregistreaza la corectia de suma", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const r = await receptie(storage, "Furnizor Testov");
    const emis = await storage.assignActNumber([r.id], PF);
    const peHartie = emis.actFigures.value;

    await storage.updateReceiptAmount(r.id, peHartie * 2, "admin", "corectie dupa emitere");

    const dupa = (await storage.listReceipts()).find((x) => x.id === r.id);
    assert.equal(dupa.actDivergences.length, 1);
    const d = dupa.actDivergences[0];
    assert.equal(d.actNumber, START);
    assert.equal(d.actValue, peHartie, "nu s-au pastrat cifrele de pe hartie");
    assert.match(d.reason, /corectie dupa emitere/);
    // Cifrele actului NU s-au schimbat.
    assert.equal(dupa.actFigures.value, peHartie);
  });
});

test("fara act emis nu se marcheaza nicio divergenta", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const r = await receptie(storage, "Furnizor Testov");
    await storage.updateReceiptAmount(r.id, 1000, "admin", "corectie");
    const dupa = (await storage.listReceipts()).find((x) => x.id === r.id);
    assert.ok(!dupa.actDivergences, "s-a marcat o divergenta fara act emis");
  });
});
