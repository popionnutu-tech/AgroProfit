const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");

const { withIsolatedWorkspace } = require("../test-support/isolated-runtime");

async function seedReceipt(storage, overrides = {}) {
  return storage.createReceipt({
    supplier: "Agro Nord",
    supplierId: 1,
    product: "Grau",
    productId: 1,
    quantity: 100,
    grossQuantity: 100,
    unit: "tone",
    price: 3000,
    humidity: 14,
    impurity: 2,
    provisionalNetQuantity: 100,
    finalNetQuantity: 100,
    preliminaryPayableAmount: 300000,
    // Locatia sursa e obligatorie la livrare (regula stoc pe locatii/cilindri).
    // O recepție reală are mereu „Locație inițială"; fixture-ul vechi o omitea.
    location: "Siloz 1",
    createdBy: "test",
    ...overrides
  });
}

test("A#3 validatePasswordPolicy blocks weak passwords and allows strong", () => {
  const { validatePasswordPolicy } = require("../src/auth");

  assert.throws(() => validatePasswordPolicy("prea"), /minim 10/);
  assert.throws(() => validatePasswordPolicy("doarliterespatiu"), /litera si o cifra/);
  assert.throws(() => validatePasswordPolicy("Agro2026!"), /prea comuna/);
  assert.doesNotThrow(() => validatePasswordPolicy("Noua2026Secure"));
  assert.doesNotThrow(() => validatePasswordPolicy("scurt6", { mode: "lenient" }));
});

test("A#6 maskSensitiveFields masks passwords in audit entries", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");

    const entry = await storage.appendAuditLog({
      entityType: "users",
      entityId: 2,
      action: "test-mask",
      reason: "verificare mascare",
      user: "test",
      newValue: { username: "demo", passwordHash: "real-hash", passwordSalt: "real-salt", token: "abc" }
    });

    assert.equal(entry.newValue.passwordHash, "***");
    assert.equal(entry.newValue.passwordSalt, "***");
    assert.equal(entry.newValue.token, "***");
    assert.equal(entry.newValue.username, "demo");
  });
});

test("A#2 createConfigEntry emits audit with changeReason", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");

    const entry = await storage.createConfigEntry("partners", {
      name: "Partener Test",
      idno: "999",
      address: "Adresa",
      phone: "+37370000000",
      role: "furnizor",
      fiscalProfile: "Persoana fizica",
      changeReason: "adaugare partener test",
      changedBy: "admin-test"
    });
    assert.equal(entry.name, "Partener Test");

    const logs = await storage.listAuditLogs();
    const createLog = logs.find((item) => item.action === "config-create" && item.entityType === "partners");
    assert.ok(createLog, "audit entry config-create should exist");
    assert.equal(createLog.reason, "adaugare partener test");
    assert.equal(createLog.user, "admin-test");
  });
});

test("A#2 createConfigEntry fara changeReason intoarce eroare", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    await assert.rejects(
      storage.createConfigEntry("partners", {
        name: "Partener Fara Reason",
        role: "furnizor",
        fiscalProfile: "Persoana fizica"
      }),
      /Mentiunea modificarii/
    );
  });
});

test("Q1 livrare imediată: creare → Livrat, scade stocul recepției", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const receipt = await seedReceipt(storage);

    // Model nou: livrarea se creează direct în „Livrat" (scade stocul pe loc),
    // nu mai trece prin Proiect → Confirmat → Livrat.
    const delivery = await storage.createDelivery({
      receiptId: receipt.id,
      customerId: 2,
      customer: "Export Grain",
      plannedQuantity: 30,
      createdBy: "operator"
    });
    assert.equal(delivery.status, "Livrat");
    assert.equal(delivery.deliveredQuantity, 30);

    // Recepția reflectă livrarea: din 100 t, 30 livrate → 70 disponibile, „Livrat partial".
    const receipts1 = await storage.listReceipts();
    const receipt1 = receipts1.find((r) => r.id === receipt.id);
    assert.equal(receipt1.deliveredQuantity, 30);
    assert.equal(receipt1.availableQuantity, 70);
    assert.equal(receipt1.deliveryStatus, "Livrat partial");

    // Nu se poate livra peste stocul disponibil al recepției (mai rămân 70 t).
    await assert.rejects(
      storage.createDelivery({
        receiptId: receipt.id,
        customerId: 2,
        customer: "Export Grain",
        plannedQuantity: 80,
        createdBy: "operator"
      }),
      /depaseste stocul disponibil/i
    );

    // Greutatea netă se calculează din brut − tara la creare (recepție nouă, unități curate).
    const receiptB = await seedReceipt(storage);
    const deliveryB = await storage.createDelivery({
      receiptId: receiptB.id,
      customerId: 2,
      customer: "Export Grain",
      plannedQuantity: 27,
      grossWeight: 30000,
      tareWeight: 3000,
      createdBy: "operator"
    });
    assert.equal(deliveryB.status, "Livrat");
    assert.equal(deliveryB.netWeight, 27000);
  });
});

test("Q1 transitionDelivery refuza tranzitie invalida", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const receipt = await seedReceipt(storage);
    const delivery = await storage.createDelivery({
      receiptId: receipt.id,
      customerId: 2,
      customer: "Export Grain",
      plannedQuantity: 10,
      createdBy: "op"
    });
    await assert.rejects(
      storage.transitionDelivery(delivery.id, "Livrat", {
        grossWeight: 1000,
        tareWeight: 100,
        changeReason: "skip confirm",
        currentUser: {}
      }),
      /Tranzitie invalida/
    );
  });
});

test("Q2 closeReceipt blochează cu reclamație deschisă, permite după acceptare", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const receipt = await seedReceipt(storage, { status: "Procesata" });
    const delivery = await storage.createDelivery({
      receiptId: receipt.id,
      customerId: 2,
      customer: "Export Grain",
      plannedQuantity: 5,
      createdBy: "op"
    });
    // Model nou: livrarea e deja „Livrat" la creare — nu mai trec prin Confirmat/Livrat.
    const complaint = await storage.createComplaint({
      deliveryId: delivery.id,
      complaintType: "Calitate",
      contestedQuantity: 1,
      createdBy: "accountant-sef"
    });

    await assert.rejects(
      storage.closeReceipt(receipt.id, { changeReason: "inchidere", changedBy: "manager" }),
      /reclamatie|Reclamatie/i
    );

    await storage.updateComplaint(complaint.id, {
      status: "Acceptata",
      changeReason: "rezolvat",
      currentUser: { name: "Șef", roleCode: "accountant-sef" }
    });

    const closed = await storage.closeReceipt(receipt.id, {
      changeReason: "inchidere dupa rezolvare",
      changedBy: "manager"
    });
    assert.equal(closed.status, "Inchis");

    await assert.rejects(
      storage.createDelivery({
        receiptId: receipt.id,
        customerId: 2,
        customer: "Export Grain",
        plannedQuantity: 1,
        createdBy: "op"
      }),
      /inchisa/i
    );

    const reopened = await storage.reopenReceipt(receipt.id, {
      changeReason: "redeschidere test",
      changedBy: "admin"
    });
    assert.equal(reopened.status, "Redeschis");
  });
});

test("Q3 supra-plata creeaza avans si applyAdvance consuma FIFO", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const receipt = await seedReceipt(storage, { preliminaryPayableAmount: 1000 });

    const tx = await storage.createTransaction({
      referenceType: "receipt",
      receiptId: receipt.id,
      partnerId: 1,
      partner: "Agro Nord",
      direction: "payment",
      amount: 1500,
      createdBy: "contabil"
    });
    assert.equal(tx.appliedAmount, 1000);
    assert.equal(tx.advanceAmount, 500);

    const advances = await storage.listPartnerAdvances();
    assert.equal(advances.length, 1);
    assert.equal(advances[0].remainingAmount, 500);

    const receipt2 = await seedReceipt(storage, { preliminaryPayableAmount: 300 });
    const result = await storage.applyAdvanceCredit({
      partnerId: 1,
      targetReceiptId: receipt2.id,
      amount: 300,
      createdBy: "contabil",
      currentUser: { name: "Contabil" }
    });
    assert.equal(result.transaction.appliedAmount, 300);
    assert.equal(result.transaction.source, "advance-applied");

    const advances2 = await storage.listPartnerAdvances();
    assert.equal(advances2[0].remainingAmount, 200);
  });
});

test("Q3 applyAdvance refuza daca avans insuficient", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const receipt = await seedReceipt(storage, { preliminaryPayableAmount: 500 });
    await assert.rejects(
      storage.applyAdvanceCredit({
        partnerId: 1,
        targetReceiptId: receipt.id,
        amount: 100,
        currentUser: {}
      }),
      /insuficient/i
    );
  });
});

test("Q4 complaint stockCorrection blocat pentru accountant, permis pentru accountant-sef", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const receipt = await seedReceipt(storage);
    // Model nou: livrarea e deja „Livrat" la creare, cu deliveredQuantity = plannedQuantity (10 t).
    const delivery = await storage.createDelivery({
      receiptId: receipt.id,
      customerId: 2,
      customer: "Export Grain",
      plannedQuantity: 10,
      createdBy: "op"
    });
    const complaint = await storage.createComplaint({
      deliveryId: delivery.id,
      complaintType: "Lipsa cantitate",
      contestedQuantity: 2,
      createdBy: "op"
    });

    await assert.rejects(
      storage.updateComplaint(complaint.id, {
        status: "Acceptata",
        stockCorrection: { deliveryId: delivery.id, deltaQuantity: -2, note: "lipsa" },
        changeReason: "ajustare",
        currentUser: { name: "Contabil", roleCode: "accountant" }
      }),
      /drepturi pentru corectie de stoc/i
    );

    const updated = await storage.updateComplaint(complaint.id, {
      status: "Acceptata",
      stockCorrection: { deliveryId: delivery.id, deltaQuantity: -2, note: "lipsa" },
      changeReason: "ajustare stoc",
      currentUser: { name: "Șef Contabil", roleCode: "accountant-sef" }
    });
    assert.equal(updated.status, "Acceptata");
    assert.equal(updated.stockCorrection.deltaQuantity, -2);

    const deliveries = await storage.listDeliveries();
    const current = deliveries.find((d) => d.id === delivery.id);
    assert.equal(current.deliveredQuantity, 8);
  });
});

test("Q4 complaint invoiceAdjustment creeaza tranzactie compensatorie", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const receipt = await seedReceipt(storage);
    const delivery = await storage.createDelivery({
      receiptId: receipt.id,
      customerId: 2,
      customer: "Export Grain",
      plannedQuantity: 5,
      createdBy: "op"
    });
    // Model nou: livrarea e deja „Livrat" la creare.
    const complaint = await storage.createComplaint({
      deliveryId: delivery.id,
      complaintType: "Pret",
      contestedQuantity: 0,
      createdBy: "op"
    });

    const updated = await storage.updateComplaint(complaint.id, {
      status: "Acceptata",
      invoiceAdjustment: { type: "adjust", amount: -200, note: "reducere pret" },
      changeReason: "ajustare factura",
      currentUser: { name: "Contabil", roleCode: "accountant" }
    });
    assert.equal(updated.invoiceAdjustment.amount, -200);
    assert.ok(updated.invoiceAdjustment.compensatoryTransactionId);

    const txs = await storage.listTransactions();
    const compensatory = txs.find((item) => item.source === "complaint-adjustment");
    assert.ok(compensatory, "tranzactie compensatorie nu exista");
    assert.equal(compensatory.amount, -200);
  });
});

test("SEC receptiile fara finance nu expun campuri financiare", () => {
  const handlers = require("../src/receipt-handlers");

  const receipt = {
    id: 1,
    supplier: "Agro Nord",
    product: "Grau",
    quantity: 100,
    location: "Siloz 1",
    note: "obs operator",
    price: 3000,
    preliminaryPayableAmount: 300000,
    amountToPay: 300000,
    paidAmount: 500,
    soldRestant: 299500,
    paymentStatus: "Partial",
    lastPaymentDate: "2026-06-25"
  };
  const stripped = handlers.stripReceiptFinancials(receipt);
  // financiarele dispar
  ["price", "preliminaryPayableAmount", "amountToPay", "paidAmount", "soldRestant", "paymentStatus", "lastPaymentDate"]
    .forEach((f) => assert.equal(stripped[f], undefined, `${f} ar trebui ascuns`));
  // operationalele raman
  assert.equal(stripped.product, "Grau");
  assert.equal(stripped.quantity, 100);
  assert.equal(stripped.location, "Siloz 1");
  assert.equal(stripped.note, "obs operator");

  const stats = { totalReceipts: 5, totalQuantity: 500, byStatus: {}, totalValue: 999, finance: { totalPayments: 1 }, advances: [{}], opening: {} };
  const sStats = handlers.stripFinancialStats(stats);
  ["totalValue", "finance", "advances", "opening"].forEach((k) =>
    assert.equal(sStats[k], undefined, `stats.${k} ar trebui ascuns`));
  assert.equal(sStats.totalReceipts, 5);
  assert.equal(sStats.totalQuantity, 500);
});

test("Q4b livrare pe-produs: plafon pe stocul locatiei sursa", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    // Stoc: o receptie de 100 t Grau in „Siloz 1".
    await seedReceipt(storage, { status: "Procesata", location: "Siloz 1" });

    // Peste stocul disponibil → respins.
    await assert.rejects(
      storage.createDelivery({
        product: "Grau",
        productId: 1,
        sourceLocation: "Siloz 1",
        customerId: 2,
        customer: "Export Grain",
        plannedQuantity: 150,
        createdBy: "op"
      }),
      /Stoc insuficient/i
    );

    // In limita stocului → acceptat, direct „Livrat" (model livrare imediata).
    const ok = await storage.createDelivery({
      product: "Grau",
      productId: 1,
      sourceLocation: "Siloz 1",
      customerId: 2,
      customer: "Export Grain",
      plannedQuantity: 40,
      createdBy: "op"
    });
    assert.equal(ok.status, "Livrat");
    assert.equal(ok.deliveredQuantity, 40);
  });
});

test("Anulare livrare: status Anulat + marfa revine in stoc", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const receipt = await seedReceipt(storage);
    const delivery = await storage.createDelivery({
      receiptId: receipt.id,
      customerId: 2,
      customer: "Export Grain",
      plannedQuantity: 30,
      createdBy: "op"
    });
    let r = (await storage.listReceipts()).find((x) => x.id === receipt.id);
    assert.equal(r.availableQuantity, 70); // 100 - 30 livrate

    const canceled = await storage.cancelDelivery(delivery.id, {
      reason: "duplicat",
      currentUser: { name: "Admin", roleCode: "admin" }
    });
    assert.equal(canceled.status, "Anulat");
    assert.equal(canceled.cancelReason, "duplicat");
    assert.equal(canceled.canceledByRole, "admin");

    // Marfa revine: disponibil 100 din nou.
    r = (await storage.listReceipts()).find((x) => x.id === receipt.id);
    assert.equal(r.availableQuantity, 100);
  });
});

test("Anulare: motivul e obligatoriu", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const receipt = await seedReceipt(storage);
    const delivery = await storage.createDelivery({
      receiptId: receipt.id, customerId: 2, customer: "X", plannedQuantity: 5, createdBy: "op"
    });
    await assert.rejects(
      storage.cancelDelivery(delivery.id, { reason: "", currentUser: { roleCode: "admin" } }),
      /Motivul/i
    );
  });
});

test("Anulare receptie: blocata daca are livrari active", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const receipt = await seedReceipt(storage);
    await storage.createDelivery({
      receiptId: receipt.id, customerId: 2, customer: "X", plannedQuantity: 10, createdBy: "op"
    });
    await assert.rejects(
      storage.cancelReceipt(receipt.id, { reason: "gresit", currentUser: { roleCode: "admin" } }),
      /livrari active/i
    );
  });
});

test("Anulare livrare: exclusa din KPI livrat (getStats)", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const receipt = await seedReceipt(storage);
    const d = await storage.createDelivery({
      receiptId: receipt.id, customerId: 2, customer: "X", plannedQuantity: 20, createdBy: "op"
    });
    let stats = await storage.getStats();
    assert.equal(stats.deliveries.totalDeliveredQuantity, 20);

    await storage.cancelDelivery(d.id, { reason: "test", currentUser: { roleCode: "admin" } });
    stats = await storage.getStats();
    assert.equal(stats.deliveries.totalDeliveredQuantity, 0); // anulata nu mai conteaza
  });
});

test("filterCanceledForRole: admin vede toate, operator nu vede anulatele, manager doar ale lui", () => {
  const { filterCanceledForRole } = require("../src/permissions");
  const docs = [
    { id: 1, status: "Livrat" },
    { id: 2, status: "Anulat", canceledByRole: "manager" },
    { id: 3, status: "Anulat", canceledByRole: "admin" }
  ];
  assert.equal(filterCanceledForRole(docs, "admin").length, 3);
  assert.equal(filterCanceledForRole(docs, "operator").length, 1); // doar Livrat
  const mgr = filterCanceledForRole(docs, "manager");
  assert.equal(mgr.length, 2); // Livrat + anulata de manager
  assert.ok(mgr.find((d) => d.id === 2));
  assert.ok(!mgr.find((d) => d.id === 3));
});

test("A#1 atomic writes: writeJsonAtomic creeaza .tmp apoi rename", async () => {
  await withIsolatedWorkspace(async ({ tempWorkspace, load }) => {
    const { writeJsonAtomic } = require("../src/atomic-write");
    const target = path.join(tempWorkspace, "test.json");
    writeJsonAtomic(target, { hello: "world" });
    assert.ok(fs.existsSync(target));
    assert.equal(fs.existsSync(`${target}.tmp`), false);
    assert.deepEqual(JSON.parse(fs.readFileSync(target, "utf8")), { hello: "world" });
  });
});

test("A#5 requirePasswordChange: user seed necesita schimbare, dupa change-password = false", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const user = await storage.findUserByUsername("admin");
    assert.equal(user.requirePasswordChange, true);

    await storage.updateUserPasswordById(user.id, "NoiParole2026");
    const after = await storage.findUserByUsername("admin");
    assert.equal(after.requirePasswordChange, false);
  });
});

test("runMigrationIfNeeded ruleaza o singura data (idempotent)", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const first = storage.runMigrationIfNeeded();
    assert.equal(first.migrated, true);
    const second = storage.runMigrationIfNeeded();
    assert.equal(second.migrated, false);
    assert.equal(second.version, first.version);
  });
});

// ── Anulare/status: doar admin / manager+admin (regula globala) ───────────────
test("PERM receptie confirmata: operatorul nu poate schimba statutul, managerul da", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const receipt = await seedReceipt(storage, { status: "Confirmat" });
    // operatorul nu poate schimba statutul unui document confirmat
    await assert.rejects(
      storage.updateReceiptStatusWithAudit(receipt.id, "Inchis", { changeReason: "x", actorRole: "operator" }),
      /confirmat/i
    );
    // operatorul nu poate anula (Anulat = doar admin)
    await assert.rejects(
      storage.updateReceiptStatusWithAudit(receipt.id, "Anulat", { changeReason: "x", actorRole: "operator" }),
      /administratorul/i
    );
    // managerul poate schimba statutul confirmat
    const r1 = await storage.updateReceiptStatusWithAudit(receipt.id, "Inchis", { changeReason: "ok", actorRole: "manager" });
    assert.equal(r1.status, "Inchis");
    // dar managerul NU poate anula
    await assert.rejects(
      storage.updateReceiptStatusWithAudit(receipt.id, "Anulat", { changeReason: "x", actorRole: "manager" }),
      /administratorul/i
    );
    // adminul poate anula
    const r2 = await storage.updateReceiptStatusWithAudit(receipt.id, "Anulat", { changeReason: "gresit", actorRole: "admin" });
    assert.equal(r2.status, "Anulat");
  });
});

test("PERM receptie neconfirmata: operatorul poate confirma (flux normal)", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const receipt = await seedReceipt(storage, { status: "Draft" });
    const r = await storage.updateReceiptStatusWithAudit(receipt.id, "Confirmat", { changeReason: "ok", actorRole: "operator" });
    assert.equal(r.status, "Confirmat");
  });
});

test("PERM procesare: operatorul finalizeaza dar nu anuleaza; manager/admin schimba statutul", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    await seedReceipt(storage, { status: "Confirmat", location: "Siloz 1" });
    // procesare „in lucru" — operatorul o poate FINALIZA (In lucru -> Confirmat)
    const wip = await storage.createProcessing({
      product: "Grau", sourceLocation: "Siloz 1", processingType: "Pastrare",
      processedQuantity: 10, status: "In lucru", createdBy: "op"
    });
    const fin = await storage.updateProcessing(wip.id, {
      status: "Confirmat", destLocation: "Siloz 1", changeReason: "Finalizare", actorRole: "operator"
    });
    assert.equal(fin.status, "Confirmat");
    // dupa confirmare, operatorul NU mai poate schimba statutul, nici anula
    await assert.rejects(
      storage.updateProcessing(wip.id, { status: "Inchis", changeReason: "x", actorRole: "operator" }),
      /confirmat/i
    );
    await assert.rejects(
      storage.updateProcessing(wip.id, { status: "Anulat", changeReason: "x", actorRole: "operator" }),
      /administratorul/i
    );
    // managerul schimba statutul confirmat, dar nu anuleaza
    const mgr = await storage.updateProcessing(wip.id, { status: "Inchis", changeReason: "ok", actorRole: "manager" });
    assert.equal(mgr.status, "Inchis");
    await assert.rejects(
      storage.updateProcessing(wip.id, { status: "Anulat", changeReason: "x", actorRole: "manager" }),
      /administratorul/i
    );
    // adminul anuleaza
    const adm = await storage.updateProcessing(wip.id, { status: "Anulat", changeReason: "gresit", actorRole: "admin" });
    assert.equal(adm.status, "Anulat");
  });
});

test("PERM livrare confirmata: operatorul nu poate schimba statutul, managerul da", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const receipt = await seedReceipt(storage);
    const delivery = await storage.createDelivery({
      receiptId: receipt.id, customerId: 2, customer: "X", plannedQuantity: 10, createdBy: "op"
    });
    // livrarea se creeaza „Livrat" (confirmata) → operatorul nu o poate inchide
    await assert.rejects(
      storage.transitionDelivery(delivery.id, "Inchis", { changeReason: "x", currentUser: { roleCode: "operator" } }),
      /confirmat/i
    );
    // managerul poate
    const d = await storage.transitionDelivery(delivery.id, "Inchis", { changeReason: "ok", currentUser: { roleCode: "manager" } });
    assert.equal(d.status, "Inchis");
  });
});

test("STOC: summary expune openingByProduct (sold initial vizibil indiferent de rol)", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    await storage.createOpeningDocument({
      documentDate: "2026-06-01",
      stockItems: [
        { product: "Grau", location: "Siloz 1", quantity: 50, unit: "tone" },
        { product: "Grau", location: "Siloz 2", quantity: 20, unit: "tone" }
      ],
      createdBy: "admin"
    });
    const summary = await storage.getStockSummary();
    // openingByProduct agregat pe produs (50 + 20 = 70 t Grau)
    assert.equal(summary.openingByProduct.Grau, 70);
    // openingByLocation pe locatie::produs
    assert.equal(summary.openingByLocation["Siloz 1::Grau"], 50);
    assert.equal(summary.openingByLocation["Siloz 2::Grau"], 20);
    // soldul initial e inclus si in stocul pe locatie (byLocation)
    const s1 = summary.byLocation.find((i) => i.location === "Siloz 1" && i.product === "Grau");
    assert.equal(s1.quantity, 50);
  });
});

test("NUM: sanitizeNumber accepta virgula zecimala (pret livrare 4,09 -> 4.09)", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const receipt = await seedReceipt(storage);
    const delivery = await storage.createDelivery({
      receiptId: receipt.id, customerId: 2, customer: "X", plannedQuantity: 10, createdBy: "op"
    });
    const updated = await storage.updateDelivery(delivery.id, {
      priceForeign: "4,09", changeReason: "Completare date factura"
    });
    assert.equal(updated.priceForeign, 4.09);
  });
});

test("FIN PERM: statutul platii doar admin + contabil-sef; anulat marcheaza rolul", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const receipt = await seedReceipt(storage, { preliminaryPayableAmount: 1000 });
    const tx = await storage.createTransaction({
      referenceType: "receipt", receiptId: receipt.id, partnerId: 1, partner: "Agro Nord",
      direction: "payment", amount: 500, createdBy: "contabil"
    });
    // contabilul simplu NU poate schimba statutul
    await assert.rejects(
      storage.updateTransaction(tx.id, { status: "Inchis", changeReason: "x", actorRole: "accountant" }),
      /contabil/i
    );
    // managerul NU poate (are finance dar nu e admin/contabil-sef)
    await assert.rejects(
      storage.updateTransaction(tx.id, { status: "Inchis", changeReason: "x", actorRole: "manager" }),
      /contabil/i
    );
    // contabilul-sef poate
    const t1 = await storage.updateTransaction(tx.id, { status: "Inchis", changeReason: "ok", actorRole: "accountant-sef" });
    assert.equal(t1.status, "Inchis");
    // adminul anuleaza -> se marcheaza canceledByRole
    const t2 = await storage.updateTransaction(tx.id, { status: "Anulat", changeReason: "gresit", actorRole: "admin" });
    assert.equal(t2.status, "Anulat");
    assert.equal(t2.canceledByRole, "admin");
  });
});

test("FIN VIZ: tranzactiile anulate vizibile doar contabil-sef + admin", () => {
  const { filterCanceledTransactionsForRole } = require("../src/permissions");
  const docs = [
    { id: 1, status: "Confirmat" },
    { id: 2, status: "Anulat", canceledByRole: "admin" }
  ];
  assert.equal(filterCanceledTransactionsForRole(docs, "admin").length, 2);
  assert.equal(filterCanceledTransactionsForRole(docs, "accountant-sef").length, 2);
  assert.equal(filterCanceledTransactionsForRole(docs, "accountant").length, 1);
  assert.equal(filterCanceledTransactionsForRole(docs, "manager").length, 1);
  assert.equal(filterCanceledTransactionsForRole(docs, "control").length, 1);
});

test("FIN KPI: tranzactia anulata e exclusa din totalul financiar (getStats)", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const receipt = await seedReceipt(storage, { preliminaryPayableAmount: 1000 });
    const tx = await storage.createTransaction({
      referenceType: "receipt", receiptId: receipt.id, partnerId: 1, partner: "Agro Nord",
      direction: "payment", amount: 400, createdBy: "contabil"
    });
    let stats = await storage.getStats();
    assert.equal(stats.finance.totalPayments, 400);
    await storage.updateTransaction(tx.id, { status: "Anulat", changeReason: "gresit", actorRole: "admin" });
    stats = await storage.getStats();
    assert.equal(stats.finance.totalPayments, 0); // anulata nu mai conteaza
  });
});

test("STORNO: anularea platii redeschide datoria receptiei; redeschiderea o reaplica", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const receipt = await seedReceipt(storage, { preliminaryPayableAmount: 1000 });
    const tx = await storage.createTransaction({
      referenceType: "receipt", receiptId: receipt.id, partnerId: 1, partner: "Agro Nord",
      direction: "payment", amount: 400, createdBy: "contabil"
    });
    let r = (await storage.listReceipts()).find((x) => x.id === receipt.id);
    assert.equal(r.paidAmount, 400);
    assert.equal(r.soldRestant, 600);
    assert.equal(r.paymentStatus, "Partial");
    // anulare plata (admin) -> storno: datoria revine la 1000
    await storage.updateTransaction(tx.id, { status: "Anulat", changeReason: "gresit", actorRole: "admin" });
    r = (await storage.listReceipts()).find((x) => x.id === receipt.id);
    assert.equal(r.paidAmount, 0);
    assert.equal(r.soldRestant, 1000);
    assert.equal(r.paymentStatus, "Neachitat");
    // redeschidere -> plata se reaplica
    await storage.updateTransaction(tx.id, { status: "Confirmat", changeReason: "revin", actorRole: "admin" });
    r = (await storage.listReceipts()).find((x) => x.id === receipt.id);
    assert.equal(r.paidAmount, 400);
    assert.equal(r.paymentStatus, "Partial");
  });
});

test("Act de verificare furnizor: receptii + plati + sold, storno exclus", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const receipt = await seedReceipt(storage, { preliminaryPayableAmount: 1000 });
    const pay = await storage.createTransaction({
      referenceType: "receipt", receiptId: receipt.id, partnerId: 1, partner: "Agro Nord",
      direction: "payment", amount: 600, createdBy: "contabil"
    });

    let st = await storage.getSupplierStatement(1);
    assert.equal(st.receipts.length, 1);
    assert.equal(st.totals.totalReceipts, 1000);
    assert.equal(st.payments.length, 1);
    assert.equal(st.totals.totalPaid, 600);
    assert.equal(st.totals.balance, 400); // datorie ramasa catre furnizor

    // storno: plata anulata nu mai intra in extras -> soldul = datoria intreaga
    await storage.updateTransaction(pay.id, { status: "Anulat", changeReason: "storno", actorRole: "admin" });
    st = await storage.getSupplierStatement(1);
    assert.equal(st.payments.length, 0);
    assert.equal(st.totals.totalPaid, 0);
    assert.equal(st.totals.balance, 1000);
  });
});

test("Contabil ajusteaza valoarea receptiei (suma) + se reflecta in actul de verificare", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const receipt = await seedReceipt(storage, { preliminaryPayableAmount: 0, provisionalNetQuantity: 2, price: 0 });

    // initial: valoare 0 -> actul de verificare arata 0
    let st = await storage.getSupplierStatement(1);
    assert.equal(st.totals.totalReceipts, 0);

    // contabilul ajusteaza valoarea la 14340 (comentariu obligatoriu)
    const updated = await storage.updateReceiptAmount(receipt.id, 14340, "contabil", "diferenta la achitare +43.02");
    assert.equal(updated.preliminaryPayableAmount, 14340);
    assert.equal(updated.price, 7.17); // 14340 / (2 t × 1000) = lei/kg
    assert.equal(updated.amountNote, "diferenta la achitare +43.02");
    assert.equal(updated.amountCorrections.length, 1);

    // actul de verificare reflecta noua valoare
    st = await storage.getSupplierStatement(1);
    assert.equal(st.totals.totalReceipts, 14340);
    assert.equal(st.totals.balance, 14340); // nicio plata inca

    // refuza valoare negativa
    await assert.rejects(storage.updateReceiptAmount(receipt.id, -5, "contabil", "x"), /pozitiv/i);
    // refuza fara comentariu
    await assert.rejects(storage.updateReceiptAmount(receipt.id, 100, "contabil"), /Comentariul/i);
  });
});

test("Valoare receptie derivata din pret × cantitate cand suma nu a fost salvata", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    // receptie cu pret completat (lei/kg) dar preliminaryPayableAmount 0 (cazul vechi: valoarea nu se trimitea)
    await seedReceipt(storage, { preliminaryPayableAmount: 0, price: 3, provisionalNetQuantity: 100 });
    const r = (await storage.listReceipts())[0];
    assert.equal(r.amountToPay, 300000); // 100 t = 100000 kg × 3 lei/kg -> derivat
    assert.equal(r.paymentStatus, "Neachitat");
    // actul de verificare reflecta valoarea derivata
    const st = await storage.getSupplierStatement(1);
    assert.equal(st.totals.totalReceipts, 300000);
  });
});

test("Valoare = kg × lei/kg (cazul Lupu Diana: 800 kg × 6 = 4800)", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    // 800 kg = 0,8 t net, pret 6 lei/kg, fara valoare salvata
    await seedReceipt(storage, { quantity: 0.8, provisionalNetQuantity: 0, price: 6, preliminaryPayableAmount: 0 });
    const r = (await storage.listReceipts())[0];
    assert.equal(r.amountToPay, 4800); // 800 kg × 6 lei/kg, NU 4,8
    const st = await storage.getSupplierStatement(1);
    assert.equal(st.totals.totalReceipts, 4800);
  });
});

test("computeReceiptEstimate: pret lei/kg -> valoare = kg × pret (800 kg × 6 = 4800)", () => {
  const { computeReceiptEstimate } = require("../src/receipt-handlers");
  // 0,8 t = 800 kg, pret 6 lei/kg, fara umiditate/impuritati peste norma, fara servicii/retinere
  const est = computeReceiptEstimate({
    quantity: 0.8, price: 6, humidity: 0, impurity: 0,
    product: { humidityNorm: 0, impurityNorm: 0 }, tariffs: [], fiscalProfile: null
  });
  assert.equal(est.preliminaryMerchandiseValue, 4800); // NU 4,8
  assert.equal(est.preliminaryPayableAmount, 4800);
});

test("Tipul de plata Servicii (barter) exista in nomenclator", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const config = await storage.getConfig();
    const names = (config.paymentTypes || []).map((t) => t.name);
    assert.ok(names.includes("Servicii"), "Servicii trebuie sa fie tip de plata disponibil");
  });
});

test("Plata Servicii (barter) stinge datoria furnizorului + apare in actul de verificare cu comentariu", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const receipt = await seedReceipt(storage, { preliminaryPayableAmount: 4800 });
    // barter: se retine contravaloarea serviciilor ca plata de tip „Servicii"
    await storage.createTransaction({
      referenceType: "receipt", receiptId: receipt.id, partnerId: 1, partner: "Agro Nord",
      direction: "payment", amount: 1800, paymentType: "Servicii",
      note: "uscare 1000 + recoltare 800", createdBy: "contabil"
    });
    const r = (await storage.listReceipts()).find((x) => x.id === receipt.id);
    assert.equal(r.paidAmount, 1800);
    assert.equal(r.soldRestant, 3000); // 4800 - 1800
    assert.equal(r.paymentStatus, "Partial");
    // actul de verificare: plata Servicii cu comentariul barter
    const st = await storage.getSupplierStatement(1);
    const pay = st.payments.find((p) => p.paymentType === "Servicii");
    assert.ok(pay, "plata Servicii trebuie sa apara in extras");
    assert.equal(pay.amount, 1800);
    assert.equal(pay.note, "uscare 1000 + recoltare 800");
    assert.equal(st.totals.balance, 3000);
  });
});

test("computeReceiptEstimate: datoria = marfa integrala (fara scadere servicii/retinere)", () => {
  const { computeReceiptEstimate } = require("../src/receipt-handlers");
  // umiditate peste norma -> exista servicii uscare, DAR valoarea de plata ramane marfa integrala
  const est = computeReceiptEstimate({
    quantity: 10, price: 5, humidity: 20, impurity: 5,
    product: { humidityNorm: 14, impurityNorm: 2 },
    tariffs: [{ service: "Uscare", value: 250, active: true }, { service: "Curatire", value: 120, active: true }],
    fiscalProfile: { withholdingPercent: 7 }
  });
  // marfa = provisionalNetQuantity(t) × 1000 × 5 ; payable trebuie sa fie EGAL cu marfa (fara deduceri)
  assert.equal(est.preliminaryPayableAmount, est.preliminaryMerchandiseValue);
  assert.ok(est.preliminaryServicesTotal > 0, "serviciile se estimeaza (informativ)");
});

test("Act de verificare universal: latura cumparator (livrari + incasari + sold net)", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const receipt = await seedReceipt(storage); // stoc pentru livrare
    const delivery = await storage.createDelivery({
      receiptId: receipt.id, customerId: 2, customer: "Export Grain",
      plannedQuantity: 10, contractPrice: 5000, createdBy: "op"
    });
    await storage.createTransaction({
      referenceType: "delivery", deliveryId: delivery.id, partnerId: 2, partner: "Export Grain",
      direction: "collection", amount: 20000, paymentType: "Transfer", createdBy: "contabil"
    });
    const st = await storage.getSupplierStatement(2); // Export Grain = cumparator
    assert.equal(st.deliveries.length, 1);
    assert.equal(st.totals.totalDeliveries, 50000); // 10 t × 5000 lei/t
    assert.equal(st.totals.totalCollected, 20000);
    assert.equal(st.totals.customerBalance, 30000); // 50000 - 20000 el ne datoreaza
    assert.equal(st.totals.supplierBalance, 0); // nu e furnizor
    assert.equal(st.totals.balance, -30000); // net: el ne datoreaza
  });
});

test("Auto-FIFO: o plata integrala catre furnizor stinge toate receptiile (cazul Reaboi Vitalie)", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    // 2 receptii pentru acelasi furnizor (partner 1)
    const r1 = await seedReceipt(storage, { preliminaryPayableAmount: 5000 });
    const r2 = await seedReceipt(storage, { preliminaryPayableAmount: 3000 });
    // O SINGURA plata integrala (8000), inregistrata pe prima receptie
    await storage.createTransaction({
      referenceType: "receipt", receiptId: r1.id, partnerId: 1, partner: "Agro Nord",
      direction: "payment", amount: 8000, createdBy: "contabil"
    });
    const list = await storage.listReceipts();
    const a = list.find((x) => x.id === r1.id);
    const b = list.find((x) => x.id === r2.id);
    // ambele achitate (FIFO: 5000 la prima, 3000 la a doua)
    assert.equal(a.paidAmount, 5000);
    assert.equal(a.paymentStatus, "Achitat");
    assert.equal(b.paidAmount, 3000);
    assert.equal(b.paymentStatus, "Achitat");
    assert.equal(a.soldRestant + b.soldRestant, 0);
  });
});

test("Auto-FIFO: plata partiala se aplica pe cea mai veche receptie intai", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const r1 = await seedReceipt(storage, { preliminaryPayableAmount: 5000 });
    const r2 = await seedReceipt(storage, { preliminaryPayableAmount: 3000 });
    // plata partiala 6000 -> prima integral (5000), a doua partial (1000)
    await storage.createTransaction({
      referenceType: "receipt", receiptId: r2.id, partnerId: 1, partner: "Agro Nord",
      direction: "payment", amount: 6000, createdBy: "contabil"
    });
    const list = await storage.listReceipts();
    const a = list.find((x) => x.id === r1.id);
    const b = list.find((x) => x.id === r2.id);
    assert.equal(a.paidAmount, 5000);
    assert.equal(a.paymentStatus, "Achitat");
    assert.equal(b.paidAmount, 1000);
    assert.equal(b.paymentStatus, "Partial");
  });
});

test("DOC: allocateDocumentNumber e crescator per tip si idempotent per document", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const r1 = await seedReceipt(storage, { preliminaryPayableAmount: 1000 });
    const r2 = await seedReceipt(storage, { preliminaryPayableAmount: 2000 });

    // Prima alocare pentru fiecare receptie -> 1, 2 (crescator).
    const a1 = storage.allocateDocumentNumber("purchaseAct", r1.id, "contabil");
    const a2 = storage.allocateDocumentNumber("purchaseAct", r2.id, "contabil");
    assert.equal(a1.number, 1);
    assert.equal(a1.allocated, true);
    assert.equal(a2.number, 2);

    // Re-tiparire acelasi document -> ACELASI numar, fara sa incrementeze.
    const a1again = storage.allocateDocumentNumber("purchaseAct", r1.id, "contabil");
    assert.equal(a1again.number, 1);
    assert.equal(a1again.allocated, false);

    // Ordinul de plata are secventa PROPRIE (incepe de la 1).
    const tx = await storage.createTransaction({
      referenceType: "receipt",
      receiptId: r1.id,
      partnerId: 1,
      partner: "Agro Nord",
      direction: "payment",
      amount: 500,
      createdBy: "contabil"
    });
    const p1 = storage.allocateDocumentNumber("paymentOrder", tx.id, "contabil");
    assert.equal(p1.number, 1);
    const p1again = storage.allocateDocumentNumber("paymentOrder", tx.id, "contabil");
    assert.equal(p1again.number, 1);

    // Tip necunoscut / referinta lipsa -> eroare.
    assert.throws(() => storage.allocateDocumentNumber("altceva", r1.id, "contabil"));
    assert.throws(() => storage.allocateDocumentNumber("purchaseAct", 999999, "contabil"));
  });
});
