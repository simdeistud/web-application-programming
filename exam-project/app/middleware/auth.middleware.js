const jwt = require('jsonwebtoken');

const COOKIE_NAME = "auth_token";
const SECURE = process.env.NODE_ENV === "dev";
const JWT_SECRET = process.env.JWT_SECRET || "exam-project"

function authenticate(req, res, next) {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return res.sendStatus(401);

  try {
    const payload = jwt.verify(token, JWT_SECRET, {
      algorithms: ["HS256"]
    });
    req.user = { sub: payload.sub, username: payload.username };
    next();
  } catch {
    return res.sendStatus(401);
  }
}

function setAuthCookie(res, token, maxAgeMs) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: SECURE,
    sameSite: "Strict",
    path: "/",
    maxAge: maxAgeMs
  });
}

function clearAuthCookie(res) {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: SECURE,
    sameSite: "Strict",
    path: "/"
  });
}

module.exports = {
  authenticate,
  setAuthCookie,
  clearAuthCookie,
  COOKIE_NAME
};