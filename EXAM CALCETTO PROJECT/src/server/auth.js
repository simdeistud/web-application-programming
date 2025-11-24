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

const verifyPassword = (password, salt, storedHash) => {
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");
  return hash === storedHash;
};

const authenticate = (username, password) => {
  // turn this into a middleware
  db.connect();
  // Retrieve user from database
  const user = null; // Retrieve from DB
  if (!user) return false;
  return verifyPassword(password, user.salt, user.hashed_psw);
};

// POST  /api/auth/signup  Register a new user
router.post("/signup", (req, res) => {
  if (!req.body.password || !req.body.username || !req.body.full_name) {
    res.header(400).json({ error: "Missing required field(s)" });
    res.end();
    return;
  }
  db.connect();
  if (db.client.db("calcetto").collection("users").findOne({ username: req.body.username })) {
    res.header(409).json({ error: "User already exists" });
    res.end();
    return;
  }
  const user = {
    username: req.body.username,
    full_name: req.body.full_name,
  };
  user.hashed_psw, user.salt = hashPassword(req.body.password);
  if (!user.hashed_psw || !user.salt) {
    res.header(500).json({ error: "Error hashing password" });
    res.end();
    return;
  }
  db.client.db("calcetto").collection("users").insertOne(user);
  if (!db.client.db("calcetto").collection("users").findOne(user)) {
    res.header(500).json({ error: "Error inserting new user into database" });
    res.end();
    return;
  }
  res.header(201);
  res.json(user);
  res.end();
});

// POST  /api/auth/signin  User login
router.post("/signin", (req, res) => {
  const user = {
    username: req.body.username,
    password: req.body.password,
  };
  res.header(401);
  
  if ("user found and password correct") {
    const token = jwt.sign({ username: user.username }, "calcetto", {
      expiresIn: 86400,
    });
    res.header(200);
    res.cookie("token", token, { httpOnly: true });
  }
  res.json({ username: user.username });
  res.end();
});

module.exports = router;
