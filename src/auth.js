const crypto = require("crypto");
const { getRoleName, getRolePermissions, normalizeRoleCode } = require("./permissions");

const SESSION_COOKIE_NAME = "agro_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 12;
const SESSION_INACTIVITY_MS = 1000 * 60 * 30;
const LOGIN_WINDOW_MS = 1000 * 60 * 15;
const LOGIN_MAX_ATTEMPTS = 5;
const LOGIN_BLOCK_MS = 1000 * 60 * 15;

const sessions = new Map();
const loginAttemptsByIp = new Map();
const loginAttemptsByUsername = new Map();

const PASSWORD_BLACKLIST = new Set([
  "agro2026!",
  "password",
  "parola",
  "123456",
  "12345678",
  "admin",
  "operator",
  "manager",
  "qwerty",
  "contabil"
]);

function validatePasswordPolicy(password, options = {}) {
  const mode = options.mode === "lenient" ? "lenient" : "strict";
  const normalized = String(password || "");

  if (!normalized) {
    throw new Error("Parola este obligatorie.");
  }

  if (mode === "lenient") {
    if (normalized.length < 6) {
      throw new Error("Parola trebuie sa aiba minim 6 caractere.");
    }
    return true;
  }

  if (PASSWORD_BLACKLIST.has(normalized.toLowerCase())) {
    throw new Error("Parola este prea comuna. Alege o parola mai complexa.");
  }

  if (normalized.length < 10) {
    throw new Error("Parola trebuie sa aiba minim 10 caractere.");
  }

  const hasLetter = /[a-zA-Z]/.test(normalized);
  const hasDigit = /[0-9]/.test(normalized);
  if (!hasLetter || !hasDigit) {
    throw new Error("Parola trebuie sa contina cel putin o litera si o cifra.");
  }

  return true;
}

function createPasswordRecord(password, options = {}) {
  const normalizedPassword = String(password || "").trim();
  if (!normalizedPassword) {
    throw new Error("Parola este obligatorie.");
  }

  validatePasswordPolicy(normalizedPassword, options);

  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(normalizedPassword, salt, 64).toString("hex");

  return { salt, hash };
}

function verifyPassword(password, salt, hash) {
  const normalizedPassword = String(password || "");
  if (!normalizedPassword || !salt || !hash) {
    return false;
  }

  const calculatedHash = crypto.scryptSync(normalizedPassword, salt, 64);
  const storedHash = Buffer.from(String(hash), "hex");

  if (calculatedHash.length !== storedHash.length) {
    return false;
  }

  return crypto.timingSafeEqual(calculatedHash, storedHash);
}

function sanitizeUserForSession(user) {
  if (!user) {
    return null;
  }

  const roleCode = normalizeRoleCode(user.roleCode);
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    roleCode,
    roleName: getRoleName(roleCode),
    permissions: getRolePermissions(roleCode),
    channel: user.channel,
    active: user.active !== false,
    requirePasswordChange: user.requirePasswordChange === true
  };
}

function parseCookies(cookieHeader = "") {
  return String(cookieHeader || "")
    .split(";")
    .map((item) => item.trim())
    .filter(Boolean)
    .reduce((acc, item) => {
      const separatorIndex = item.indexOf("=");
      if (separatorIndex < 0) {
        return acc;
      }

      const key = item.slice(0, separatorIndex).trim();
      const value = item.slice(separatorIndex + 1).trim();
      acc[key] = decodeURIComponent(value);
      return acc;
    }, {});
}

function cleanupExpiredSessions() {
  const now = Date.now();
  for (const [token, session] of sessions.entries()) {
    if (!session || session.expiresAt <= now) {
      sessions.delete(token);
      continue;
    }
    if (session.lastActivityAt && now - session.lastActivityAt > SESSION_INACTIVITY_MS) {
      sessions.delete(token);
    }
  }
}

function buildCookie(token, req, maxAgeMs = SESSION_TTL_MS) {
  const forwardedProto = String(req.headers["x-forwarded-proto"] || "").toLowerCase();
  const isSecure = Boolean(req.secure || forwardedProto === "https" || process.env.NODE_ENV === "production");
  const attributes = [
    `${SESSION_COOKIE_NAME}=${encodeURIComponent(token)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Strict",
    `Max-Age=${Math.floor(maxAgeMs / 1000)}`
  ];

  if (isSecure) {
    attributes.push("Secure");
  }

  return attributes.join("; ");
}

function setSessionCookie(res, req, token) {
  res.setHeader("Set-Cookie", buildCookie(token, req));
}

function clearSessionCookie(res, req) {
  res.setHeader("Set-Cookie", buildCookie("", req, 0));
}

const SESSION_SECRET = process.env.SESSION_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "agroprofit-dev-secret";

function signToken(payload) {
  const json = JSON.stringify(payload);
  const b64 = Buffer.from(json, "utf8").toString("base64url");
  const sig = crypto.createHmac("sha256", SESSION_SECRET).update(b64).digest("base64url");
  return `${b64}.${sig}`;
}

function verifyToken(token) {
  if (!token || typeof token !== "string") return null;
  const dot = token.indexOf(".");
  if (dot < 0) return null;
  const b64 = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expectedSig = crypto.createHmac("sha256", SESSION_SECRET).update(b64).digest("base64url");
  if (sig.length !== expectedSig.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))) return null;
  try {
    return JSON.parse(Buffer.from(b64, "base64url").toString("utf8"));
  } catch {
    return null;
  }
}

function createSession(user) {
  const now = Date.now();
  return signToken({
    user: sanitizeUserForSession(user),
    createdAt: now,
    expiresAt: now + SESSION_TTL_MS,
    lastActivityAt: now
  });
}

function destroySession(_token) {
  // Stateless tokens — destroy is handled by clearing the cookie on the client.
}

function updateSessionUser(_userId, _patch) {
  // Stateless tokens — user data in the token reflects login moment.
  // After password change / role update, user gets new token on next login.
}

function getClientIp(req) {
  const forwardedFor = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim();
  return forwardedFor || req.socket?.remoteAddress || "unknown";
}

function getAttemptState(store, key) {
  const normalizedKey = String(key || "").trim().toLowerCase();
  if (!normalizedKey) {
    return null;
  }

  return {
    store,
    normalizedKey,
    current:
      store.get(normalizedKey) || {
        count: 0,
        firstAttemptAt: Date.now(),
        blockedUntil: 0
      }
  };
}

function registerFailedAttempt(store, key) {
  const attemptState = getAttemptState(store, key);
  if (!attemptState) {
    return null;
  }

  const now = Date.now();
  const current = attemptState.current;

  if (current.blockedUntil > now) {
    return current;
  }

  if (now - current.firstAttemptAt > LOGIN_WINDOW_MS) {
    current.count = 0;
    current.firstAttemptAt = now;
  }

  current.count += 1;

  if (current.count >= LOGIN_MAX_ATTEMPTS) {
    current.blockedUntil = now + LOGIN_BLOCK_MS;
    current.count = 0;
    current.firstAttemptAt = now;
  }

  attemptState.store.set(attemptState.normalizedKey, current);
  return current;
}

function registerFailedLogin(ip) {
  return registerFailedAttempt(loginAttemptsByIp, ip);
}

function registerFailedLoginForUsername(username) {
  return registerFailedAttempt(loginAttemptsByUsername, username);
}

function clearFailedAttempt(store, key) {
  const normalizedKey = String(key || "").trim().toLowerCase();
  if (!normalizedKey) {
    return;
  }

  store.delete(normalizedKey);
}

function clearFailedLogins(ip) {
  clearFailedAttempt(loginAttemptsByIp, ip);
}

function clearFailedLoginsForUsername(username) {
  clearFailedAttempt(loginAttemptsByUsername, username);
}

function isBlocked(store, key) {
  const normalizedKey = String(key || "").trim().toLowerCase();
  if (!normalizedKey) {
    return { blocked: false, retryAfterMs: 0 };
  }

  const current = store.get(normalizedKey);
  if (!current) {
    return { blocked: false, retryAfterMs: 0 };
  }

  if (current.blockedUntil > Date.now()) {
    return {
      blocked: true,
      retryAfterMs: current.blockedUntil - Date.now()
    };
  }

  return { blocked: false, retryAfterMs: 0 };
}

function isLoginBlocked(ip) {
  return isBlocked(loginAttemptsByIp, ip);
}

function isUsernameBlocked(username) {
  return isBlocked(loginAttemptsByUsername, username);
}

function listUsernameLockouts() {
  const now = Date.now();
  const lockouts = [];

  for (const [username, state] of loginAttemptsByUsername.entries()) {
    if (state?.blockedUntil > now) {
      lockouts.push({
        username,
        retryAfterMs: state.blockedUntil - now,
        blockedUntil: new Date(state.blockedUntil).toISOString()
      });
    }
  }

  return lockouts.sort((a, b) => a.username.localeCompare(b.username, "ro"));
}

function unlockUsername(username) {
  clearFailedAttempt(loginAttemptsByUsername, username);
}

function attachCurrentUser(req, _res, next) {
  const cookies = parseCookies(req.headers.cookie);
  let token = cookies[SESSION_COOKIE_NAME];

  // Fallback: accept Bearer token via Authorization header
  // (used by Telegram Mini App where cookies can be blocked by WebView).
  if (!token) {
    const auth = String(req.headers["authorization"] || "");
    if (auth.startsWith("Bearer ")) {
      token = auth.slice(7).trim();
    }
  }

  req.sessionToken = token || "";
  req.currentUser = null;

  if (token) {
    const payload = verifyToken(token);
    const now = Date.now();
    if (payload && payload.expiresAt > now) {
      req.currentUser = payload.user;
    }
  }

  next();
}

function requireAuth(req, res, next) {
  if (req.currentUser) {
    return next();
  }

  return res.status(401).json({ error: "Autentificare necesara." });
}

function requireRoles(allowedRoles = []) {
  const normalizedRoles = allowedRoles.map((item) => normalizeRoleCode(item)).filter(Boolean);

  return (req, res, next) => {
    if (!req.currentUser) {
      return res.status(401).json({ error: "Autentificare necesara." });
    }

    if (normalizedRoles.includes(normalizeRoleCode(req.currentUser.roleCode))) {
      return next();
    }

    return res.status(403).json({ error: "Nu ai drepturi pentru aceasta operatiune." });
  };
}

function getActorLabel(req) {
  return req.currentUser?.name || req.currentUser?.username || "sistem";
}

module.exports = {
  SESSION_COOKIE_NAME,
  SESSION_INACTIVITY_MS,
  attachCurrentUser,
  clearFailedLogins,
  clearFailedLoginsForUsername,
  clearSessionCookie,
  createPasswordRecord,
  createSession,
  destroySession,
  getActorLabel,
  getClientIp,
  isLoginBlocked,
  isUsernameBlocked,
  listUsernameLockouts,
  registerFailedLogin,
  registerFailedLoginForUsername,
  requireAuth,
  requireRoles,
  sanitizeUserForSession,
  setSessionCookie,
  unlockUsername,
  updateSessionUser,
  validatePasswordPolicy,
  verifyPassword
};
