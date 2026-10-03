const test = require("node:test");
const assert = require("node:assert/strict");

const { withIsolatedWorkspace } = require("../test-support/isolated-runtime");

// Actele de DINAINTE de 02.10.2026 rămân nenumerotate (au numere scrise de mana pe hartie).
// Sirul porneste de la 914 — actul lui Cojocari Ana — si creste cu 1.
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
    const a = await receptie(storage, "Cojocari Ana");
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
    const a = await receptie(storage, "Cojocari Ana");
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
    const pf = await receptie(storage, "Cojocari Ana");
    assert.equal((await storage.assignActNumber([pf.id], PF)).actNumber, START);
  });
});

test("doar contabilul si adminul emit acte", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const r = await receptie(storage, "Cojocari Ana");
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
    const r = await receptie(storage, "Cojocari Ana");
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
      supplier: "Cojocari Ana", supplierId: 1, product: "Floarea soarelui", productId: 1,
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
    const r = await receptie(storage, "Cojocari Ana");
    await assert.rejects(
      () => storage.assignActNumber([r.id], { ...PF, companyId: null }),
      /[Ff]irma emitenta/
    );
  });
});

test("receptia cu act emis nu se poate anula", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const r = await receptie(storage, "Cojocari Ana");
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
    const a = await receptie(storage, "Cojocari Ana");
    const b = await receptie(storage, "Cojocari Ana");
    const c = await receptie(storage, "Cojocari Ana");

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
    const r = await receptie(storage, "Cojocari Ana");
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
    const a = await receptie(storage, "Cojocari Ana");
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
    const r = await receptie(storage, "Cojocari Ana");
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
    const a = await receptie(storage, "Cojocari Ana");
    const b = await receptie(storage, "Cojocari Ana");
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
    const a = await receptie(storage, "Cojocari Ana");
    const b = await receptie(storage, "Cojocari Ana");
    const c = await receptie(storage, "Cojocari Ana");
    const emis = await storage.assignActNumber([a.id, b.id, c.id], PF);

    // Cifrele stau pe TOATE, nu doar pe purtator: altfel tiparirea individuala a lui b
    // cadea pe recalcul si scotea aceeasi serie+numar cu alte cifre.
    const toate = (await storage.listReceipts()).filter((r) => [a.id, b.id, c.id].includes(r.id));
    for (const r of toate) {
      assert.ok(r.actFigures, `receptia #${r.id} nu are cifrele actului`);
      assert.equal(r.actFigures.rows.length, 3, `actul de pe #${r.id} nu are 3 randuri`);
      assert.equal(r.actFigures.value, emis.actFigures.value);
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
    const a = await receptie(storage, "Cojocari Ana");
    const b = await receptie(storage, "Cojocari Ana");
    await storage.assignActNumber([a.id, b.id], PF);

    const noua = await receptie(storage, "Cojocari Ana");
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
    const r = await receptie(storage, "Cojocari Ana");
    const emis = await storage.assignActNumber([r.id], PF);
    assert.ok(emis.actFigures.rows[0].date, "lipseste data pe randul inghetat");
    assert.equal(emis.actFigures.supplierName, "Cojocari Ana");
    assert.equal(emis.actFigures.companyId, 1);
    assert.equal(emis.actFigures.series, "AP");
  });
});

test("furnizorul nu se mai poate schimba dupa emiterea actului", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const r = await receptie(storage, "Cojocari Ana");
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
    const r = await receptie(storage, "Cojocari Ana");
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
    const r = await receptie(storage, "Cojocari Ana");
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
