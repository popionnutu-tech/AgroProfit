const test = require("node:test");
const assert = require("node:assert/strict");

const {
  createMockResponse,
  withIsolatedWorkspace
} = require("../test-support/isolated-runtime");

// Parola initiala NU mai e o constanta in cod (repo public): daca `DEFAULT_USER_PASSWORD`
// nu e setata, se genereaza una aleatoare. Testul o fixeaza explicit.
const PAROLA_INITIALA = "Test-Initial-2026!";

test("login handler authenticates valid default user and sets session cookie", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    process.env.DEFAULT_USER_PASSWORD = PAROLA_INITIALA;
    const { loginHandler } = load("src/auth-handlers.js");

    const req = {
      body: {
        username: "admin",
        password: PAROLA_INITIALA
      },
      headers: {},
      socket: {
        remoteAddress: "127.0.0.1"
      },
      secure: false
    };
    const res = createMockResponse();

    await loginHandler(req, res);

    assert.equal(res.statusCode, 200);
    assert.equal(res.body.ok, true);
    assert.equal(res.body.user.username, "admin");
    assert.match(String(res.headers["Set-Cookie"] || ""), /agro_session=/);
  });
});

test("login handler rejects invalid password", async () => {
  await withIsolatedWorkspace(async ({ load }) => {
    const { loginHandler } = load("src/auth-handlers.js");

    const req = {
      body: {
        username: "admin",
        password: "gresit"
      },
      headers: {},
      socket: {
        remoteAddress: "127.0.0.1"
      },
      secure: false
    };
    const res = createMockResponse();

    await loginHandler(req, res);

    assert.equal(res.statusCode, 401);
    assert.equal(res.body.error, "Date de autentificare invalide.");
  });
});
