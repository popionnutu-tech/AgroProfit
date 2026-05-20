const crypto = require("crypto");

const INIT_DATA_TTL_SECONDS = 24 * 60 * 60;

function parseInitData(rawInitData) {
  const params = new URLSearchParams(String(rawInitData || ""));
  const fields = {};
  for (const [key, value] of params.entries()) {
    fields[key] = value;
  }
  return fields;
}

function buildDataCheckString(fields) {
  return Object.keys(fields)
    .filter((key) => key !== "hash")
    .sort()
    .map((key) => `${key}=${fields[key]}`)
    .join("\n");
}

function validateInitData(rawInitData, botToken) {
  if (!rawInitData || !botToken) {
    return { valid: false, reason: "missing-input" };
  }

  const fields = parseInitData(rawInitData);
  const providedHash = String(fields.hash || "");
  if (!providedHash) {
    return { valid: false, reason: "missing-hash" };
  }

  const dataCheckString = buildDataCheckString(fields);
  const secretKey = crypto.createHmac("sha256", "WebAppData").update(botToken).digest();
  const computedHash = crypto
    .createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  if (computedHash !== providedHash) {
    return { valid: false, reason: "hash-mismatch" };
  }

  const authDateSeconds = Number(fields.auth_date || 0);
  if (!Number.isFinite(authDateSeconds) || authDateSeconds <= 0) {
    return { valid: false, reason: "missing-auth-date" };
  }

  const nowSeconds = Math.floor(Date.now() / 1000);
  if (nowSeconds - authDateSeconds > INIT_DATA_TTL_SECONDS) {
    return { valid: false, reason: "expired" };
  }

  let user = null;
  if (fields.user) {
    try {
      user = JSON.parse(fields.user);
    } catch {
      return { valid: false, reason: "invalid-user-json" };
    }
  }

  return { valid: true, fields, user };
}

module.exports = {
  validateInitData
};
