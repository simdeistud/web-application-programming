const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const db = require("./db.js");
const { deepStrictEqual } = require("assert");

const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");
  return { salt, hash };
};

const passwordIsValid = (password, salt, storedHash) => {
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");
  return hash === storedHash;
};

const authenticate = (req, res, next) => {
    const auth = req.headers.authorization;
    if (!auth?.startsWith("Bearer ")) return res.sendStatus(401);
    const token = auth.split(" ")[1];
    try {
        req.body.username = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch {
        return res.sendStatus(401);
    }
}


// POST  /api/auth/signup  Register a new user
router.post("/signup", (req, res) => {
  if (!req.body.password || !req.body.username || !req.body.name || !req.body.surname) {
    res.status(400).json({ error: "Missing required field(s)." });
    return;
  }

  db.connect();

  if (db.client.db("calcetto").collection("users").findOne({ username: req.body.username })) {
    res.status(409).json({ error: "User already exists." });
    return;
  }

  const user = {
    username: req.body.username,
    name: req.body.name,
    surname: req.body.surname,
  };

  user.hashed_psw, user.salt = hashPassword(req.body.password);
  if (!user.hashed_psw || !user.salt) {
    res.status(500).json({ error: "An error occurred while processing your credentials." });
    return;
  }

  db.client.db("calcetto").collection("users").insertOne(user);
  if (!db.client.db("calcetto").collection("users").findOne(user)) {
    res.status(500).json({ error: "An error occurred creating your account." });
    return;
  }

  res.status(201).json(user);
});

// POST  /api/auth/signin  User login
router.post("/signin", async (req, res) => { 
  if (!req.body.password || !req.body.username) {
    res.status(400).json({ error: "Missing required field(s)." });
    return;
  }

  db.connect();

  const user = await db.client
    .db("calcetto")
    .collection("users")
    .findOne({ username: req.body.username });

  if (!user || !passwordIsValid(req.body.password, user.salt, user.hashed_psw)) {
    res.status(400).json({ error: "Invalid credentials." });
    return;
  }

  const token = jwt.sign(
    { username: user.username },
    "calcetto",
    { expiresIn: 86400 }
  );

  res.status(200);
  res.cookie("token", token, { httpOnly: true });
  res.json({ username: user.username });
});


module.exports = router;
