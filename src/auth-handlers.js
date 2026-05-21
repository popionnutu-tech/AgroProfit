const {
  appendAuditLog,
  createUser,
  findUserByUsername,
  updateUserById,
  updateUserPasswordById
} = require("./storage");
const {
  clearFailedLogins,
  clearFailedLoginsForUsername,
  clearSessionCookie,
  createSession,
  destroySession,
  getClientIp,
  isLoginBlocked,
  isUsernameBlocked,
  registerFailedLogin,
  registerFailedLoginForUsername,
  sanitizeUserForSession,
  setSessionCookie,
  updateSessionUser,
  validatePasswordPolicy,
  verifyPassword
} = require("./auth");
const { validateInitData } = require("./telegram-webapp-auth");
const { linkTelegramUser } = require("./automation-state");

function sendJson(res, statusCode, payload) {
  if (typeof res.status === "function" && typeof res.json === "function") {
    return res.status(statusCode).json(payload);
  }

  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
}

function getBody(req) {
  return req.body || {};
}

async function loginHandler(req, res) {
  const ip = getClientIp(req);
  const body = getBody(req);
  const username = String(body.username || "").trim();
  const password = String(body.password || "");

  if (!username || !password) {
    return sendJson(res, 400, { error: "Utilizatorul si parola sunt obligatorii." });
  }

  const usernameRateLimitState = isUsernameBlocked(username);
  if (usernameRateLimitState.blocked) {
    return sendJson(res, 429, {
      error: `Contul este blocat temporar. Reincearca peste ${Math.ceil(
        usernameRateLimitState.retryAfterMs / 60000
      )} minute sau solicita administratorului de sistem deblocarea manuala.`
    });
  }

  try {
    const user = await findUserByUsername(username);

    if (!user || user.active === false) {
      const rateLimitState = isLoginBlocked(ip);
      if (rateLimitState.blocked) {
        return sendJson(res, 429, {
          error: `Prea multe incercari esuate. Reincearca peste ${Math.ceil(
            rateLimitState.retryAfterMs / 60000
          )} minute.`
        });
      }

      registerFailedLogin(ip);
      await appendAuditLog({
        entityType: "auth",
        entityId: null,
        action: "login-failed",
        reason: `Autentificare esuata pentru ${username}`,
        user: username || "necunoscut",
        newValue: { username, ip }
      });
      return sendJson(res, 401, { error: "Date de autentificare invalide." });
    }

    const passwordIsValid = verifyPassword(password, user.passwordSalt, user.passwordHash);
    if (!passwordIsValid) {
      registerFailedLogin(ip);
      registerFailedLoginForUsername(user.username || username);
      await appendAuditLog({
        entityType: "auth",
        entityId: user.id,
        action: "login-failed",
        reason: "Parola invalida",
        user: user.username || username,
        newValue: { username: user.username, ip }
      });
      return sendJson(res, 401, { error: "Date de autentificare invalide." });
    }

    clearFailedLogins(ip);
    clearFailedLoginsForUsername(user.username || username);
    const token = createSession(user);
    setSessionCookie(res, req, token);
    await appendAuditLog({
      entityType: "auth",
      entityId: user.id,
      action: "login-success",
      reason: "Autentificare reusita",
      user: user.name || user.username,
      newValue: { username: user.username, ip }
    });

    return sendJson(res, 200, {
      ok: true,
      user: sanitizeUserForSession(user),
      token
    });
  } catch (error) {
    console.error("Failed to login:", error.message);
    return sendJson(res, 500, { error: "Nu am putut procesa autentificarea." });
  }
}

async function logoutHandler(req, res) {
  if (req.currentUser) {
    await appendAuditLog({
      entityType: "auth",
      entityId: req.currentUser.id,
      action: "logout",
      reason: "Iesire din sistem",
      user: req.currentUser.name || req.currentUser.username,
      newValue: { username: req.currentUser.username, ip: getClientIp(req) }
    });
  }

  destroySession(req.sessionToken);
  clearSessionCookie(res, req);
  return sendJson(res, 200, { ok: true });
}

async function meHandler(req, res) {
  if (!req.currentUser) {
    return sendJson(res, 401, { error: "Autentificare necesara." });
  }

  return sendJson(res, 200, {
    ok: true,
    user: sanitizeUserForSession(req.currentUser)
  });
}

async function changePasswordHandler(req, res) {
  if (!req.currentUser) {
    return sendJson(res, 401, { error: "Autentificare necesara." });
  }

  const body = getBody(req);
  const currentPassword = String(body.currentPassword || "");
  const newPassword = String(body.newPassword || "");
  const confirmPassword = String(body.confirmPassword || "");

  if (!currentPassword || !newPassword || !confirmPassword) {
    return sendJson(res, 400, { error: "Toate campurile parolei sunt obligatorii." });
  }

  if (newPassword !== confirmPassword) {
    return sendJson(res, 400, { error: "Confirmarea parolei nu corespunde." });
  }

  try {
    validatePasswordPolicy(newPassword, { mode: "strict" });
  } catch (policyError) {
    return sendJson(res, 400, { error: policyError.message });
  }

  try {
    const fullUser = await findUserByUsername(req.currentUser.username);
    if (!fullUser) {
      return sendJson(res, 404, { error: "Utilizatorul nu a fost gasit." });
    }

    const currentPasswordValid = verifyPassword(
      currentPassword,
      fullUser.passwordSalt,
      fullUser.passwordHash
    );

    if (!currentPasswordValid) {
      await appendAuditLog({
        entityType: "auth",
        entityId: fullUser.id,
        action: "change-password-failed",
        reason: "Parola curenta invalida",
        user: fullUser.name || fullUser.username,
        newValue: { username: fullUser.username, ip: getClientIp(req) }
      });
      return sendJson(res, 400, { error: "Parola curenta este invalida." });
    }

    const updatedUser = await updateUserPasswordById(fullUser.id, newPassword);
    updateSessionUser(fullUser.id, { requirePasswordChange: false });
    await appendAuditLog({
      entityType: "auth",
      entityId: fullUser.id,
      action: "change-password",
      reason: "Parola schimbata de utilizator",
      user: fullUser.name || fullUser.username,
      newValue: { username: fullUser.username, ip: getClientIp(req) }
    });

    return sendJson(res, 200, {
      ok: true,
      user: updatedUser
    });
  } catch (error) {
    console.error("Failed to change password:", error.message);
    return sendJson(res, 500, { error: "Nu am putut schimba parola." });
  }
}

function buildTelegramUsername(tgUser) {
  const handle = String(tgUser?.username || "").trim().toLowerCase();
  if (handle) return handle;
  if (tgUser?.id) return `tg${tgUser.id}`;
  return "";
}

function buildTelegramDisplayName(tgUser) {
  const first = String(tgUser?.first_name || "").trim();
  const last = String(tgUser?.last_name || "").trim();
  const combined = [first, last].filter(Boolean).join(" ");
  return combined || tgUser?.username || `Telegram ${tgUser?.id || ""}`;
}

async function telegramLoginHandler(req, res) {
  const body = getBody(req);
  const initData = String(body.initData || "");
  const botToken = process.env.TELEGRAM_BOT_TOKEN;

  if (!initData) {
    return sendJson(res, 400, { error: "initData lipseste." });
  }

  if (!botToken || botToken === "replace_me") {
    return sendJson(res, 503, { error: "Telegram bot nu este configurat." });
  }

  const validation = validateInitData(initData, botToken);
  if (!validation.valid) {
    return sendJson(res, 401, { error: `initData invalid (${validation.reason}).` });
  }

  const tgUser = validation.user;
  const internalUsername = buildTelegramUsername(tgUser);
  if (!internalUsername) {
    return sendJson(res, 400, { error: "Telegram user nu contine identificator." });
  }

  try {
    let user = await findUserByUsername(internalUsername);

    if (!user) {
      user = await createUser({
        name: buildTelegramDisplayName(tgUser),
        username: internalUsername,
        roleCode: "operator",
        channel: "telegram",
        active: true,
        changeReason: "Auto-provisioned din Telegram Mini App",
        changedBy: "telegram"
      });
    } else if (!String(user.channel || "").includes("telegram")) {
      try {
        user = await updateUserById(user.id, {
          channel: user.channel ? `${user.channel}+telegram` : "telegram",
          changeReason: "Adaugat canal Telegram din Mini App",
          changedBy: "telegram"
        });
      } catch {
        // ignore if update fails (e.g. user inactive) — fallthrough handled below
      }
    }

    if (!user || user.active === false) {
      return sendJson(res, 403, { error: "Contul tau este dezactivat." });
    }

    if (tgUser?.id) {
      try {
        linkTelegramUser(user.username, {
          chatId: tgUser.id,
          telegramUsername: String(tgUser.username || "").trim().toLowerCase(),
          firstName: tgUser.first_name || ""
        });
      } catch (linkError) {
        console.error("Failed to link Telegram chat:", linkError.message);
      }
    }

    const token = createSession(user);
    setSessionCookie(res, req, token);

    await appendAuditLog({
      entityType: "auth",
      entityId: user.id,
      action: "telegram-login",
      reason: "Autentificare prin Telegram Mini App",
      user: user.name || user.username,
      newValue: {
        username: user.username,
        telegramUserId: tgUser?.id || null,
        telegramUsername: tgUser?.username || null
      }
    });

    return sendJson(res, 200, {
      ok: true,
      user: sanitizeUserForSession(user),
      token
    });
  } catch (error) {
    console.error("Telegram login failed:", error.message);
    return sendJson(res, 500, { error: "Nu am putut procesa autentificarea Telegram." });
  }
}

module.exports = {
  changePasswordHandler,
  loginHandler,
  logoutHandler,
  meHandler,
  telegramLoginHandler
};
