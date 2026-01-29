const express = require("express");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const {
  setAuthCookie,
  clearAuthCookie
} = require("../middleware/auth.middleware.js");

const { getDb } = require("../config/db.js");
const { hashPassword, passwordIsValid } = require("../utils/password.util");

const router = express.Router();
const ACCESS_TTL = 15 * 60 * 1000; // 15 minutes

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
  try {
    const { username, password, name, surname } = req.body || {};
    if (!username || !password || !name || !surname) {
      return res.status(400).json({ error: "Missing required field(s)." });
    }

    const users = getDb().collection("users");

    if (await users.findOne({ username })) {
      return res.status(409).json({ error: "User already exists." });
    }

    const { salt, hash, iters, algo } = hashPassword(password);

    const result = await users.insertOne({
      username,
      name,
      surname,
      salt,
      hashed_psw: hash,
      iters,
      algo,
      createdAt: new Date()
    });
    console.log(`User "${username}" created.`);
    return res.status(201).json({ username, name, surname });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({ error: "User already exists." });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/auth/signin
router.post("/signin", async (req, res) => {
  try {api/whoami
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ error: "Missing required field(s)." });
    }
    const user = await getDb().collection("users").findOne({ username });
    if (!user || !passwordIsValid(password, user.salt, user.hashed_psw, user.iters)) {
      return res.status(400).json({ error: "Invalid credentials." });
    }
    const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, {
      algorithm: "HS256",
      expiresIn: "15m"
    });

    setAuthCookie(res, token, ACCESS_TTL);
    console.log(`User "${user.username}" logged in.`);
    return res.status(200).json({ username: user.username });
  } catch {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/auth/logout
router.post("/logout", (req, res) => {
  clearAuthCookie(res);
  console.log(`User "${req.user.username}" logged out.`);
  return res.sendStatus(204);
});

module.exports = router;