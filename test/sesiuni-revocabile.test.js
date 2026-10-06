const test = require("node:test");
const assert = require("node:assert/strict");

const { withIsolatedWorkspace } = require("../test-support/isolated-runtime");

// Tokenul dovedeste doar ca omul s-a autentificat CANDVA. Rolul si starea contului se citesc
// de pe CONT la fiecare cerere — altfel un utilizator dezactivat sau retrogradat pastra
// drepturile vechi pana la expirarea tokenului (12 ore).
function cerere(token) {
  return { headers: { authorization: `Bearer ${token}` } };
}

async function ruleazaMiddleware(auth, token) {
  const req = cerere(token);
  await new Promise((resolve) => auth.attachCurrentUser(req, {}, resolve));
  return req.currentUser;
}

test("contul dezactivat pierde accesul imediat, fara sa expire tokenul", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const auth = load("src/auth.js");
    auth.setUserLookup((u) => storage.findUserByUsername(u));

    const user = await storage.createUser({
      name: "Test", username: "testop", roleCode: "operator",
      password: "Parola123!", changeReason: "test", changedBy: "admin"
    });
    const token = auth.createSession({ ...user, active: true });
    assert.ok(await ruleazaMiddleware(auth, token), "sesiunea trebuia sa fie valida");

    await storage.updateUserById(user.id, {
      ...user, active: false, changeReason: "demis", changedBy: "admin"
    });
    assert.equal(await ruleazaMiddleware(auth, token), null, "contul dezactivat mai avea acces");
  });
});

test("rolul se citeste de pe CONT, nu din token", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const auth = load("src/auth.js");
    auth.setUserLookup((u) => storage.findUserByUsername(u));

    const user = await storage.createUser({
      name: "Test", username: "testadm", roleCode: "admin",
      password: "Parola123!", changeReason: "test", changedBy: "admin"
    });
    const token = auth.createSession(user);
    assert.equal((await ruleazaMiddleware(auth, token)).roleCode, "admin");

    // Retrogradat la operator: tokenul spune „admin", contul spune „operator".
    await new Promise((r) => setTimeout(r, 5)); // ca `sessionsRevokedAt` sa fie ulterior
    await storage.updateUserById(user.id, {
      ...user, roleCode: "operator", changeReason: "retrogradat", changedBy: "admin"
    });
    const dupa = await ruleazaMiddleware(auth, token);
    // Schimbarea de rol taie si sesiunile: tokenul vechi nu mai e valabil deloc.
    assert.equal(dupa, null, "tokenul vechi mai era acceptat dupa schimbarea rolului");
  });
});

test("schimbarea parolei invalideaza sesiunile emise inainte", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const storage = load("src/local-storage.js");
    const auth = load("src/auth.js");
    auth.setUserLookup((u) => storage.findUserByUsername(u));

    const user = await storage.createUser({
      name: "Test", username: "testpwd", roleCode: "manager",
      password: "Parola123!", changeReason: "test", changedBy: "admin"
    });
    const token = auth.createSession(user);
    assert.ok(await ruleazaMiddleware(auth, token));

    await new Promise((r) => setTimeout(r, 5)); // ca `sessionsRevokedAt` sa fie ulterior
    await storage.updateUserPasswordById(user.id, "AltaParola456!");
    assert.equal(await ruleazaMiddleware(auth, token), null, "tokenul vechi mai functiona");

    // O sesiune NOUA, de dupa schimbare, e valabila.
    const proaspat = await storage.findUserByUsername("testpwd");
    assert.ok(await ruleazaMiddleware(auth, auth.createSession(proaspat)));
  });
});

test("fara cautare injectata se cade pe token (compatibilitate), nu se blocheaza", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const auth = load("src/auth.js");
    auth.setUserLookup(null);
    const token = auth.createSession({
      id: 1, name: "X", username: "x", roleCode: "admin", active: true
    });
    assert.ok(await ruleazaMiddleware(auth, token));
  });
});

test("o eroare la citirea contului NU acorda acces (fail-closed)", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const auth = load("src/auth.js");
    auth.setUserLookup(() => {
      throw new Error("baza nu raspunde");
    });
    const token = auth.createSession({
      id: 1, name: "X", username: "x", roleCode: "admin", active: true
    });
    assert.equal(await ruleazaMiddleware(auth, token), null);
  });
});
