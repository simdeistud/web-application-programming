// auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const db = require('../data/db.js');

const router = express.Router();

// --- Password hashing helpers (PBKDF2-SHA512). Consider Argon2/bcrypt in prod.
const PBKDF2_ITERS = 100000; // raise as needed
const SALT_BYTES = 16;

const hashPassword = (password) => {
  const salt = crypto.randomBytes(SALT_BYTES).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, PBKDF2_ITERS, 64, 'sha512').toString('hex');
  return { salt, hash, iters: PBKDF2_ITERS, algo: 'sha512' };
};

const passwordIsValid = (password, salt, storedHash, iters = PBKDF2_ITERS) => {
  const hash = crypto.pbkdf2Sync(password, salt, iters, 64, 'sha512').toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(storedHash, 'hex'));
};

// --- Auth middleware: reads Bearer token, sets req.user
const authenticate = (req, res, next) => {
  const hdr = req.headers.authorization;
  if (!hdr?.startsWith('Bearer ')) return res.sendStatus(401);
  const token = hdr.slice(7);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    // payload expected: { username, iat, exp, ... }
    req.user = { username: payload.username };
    next();
  } catch {
    return res.sendStatus(401);
  }
};

// POST /api/auth/signup
router.post('/signup', async (req, res, next) => {
  try {
    const { username, password, name, surname } = req.body || {};
    if (!username || !password || !name || !surname) {
      return res.status(400).json({ error: 'Missing required field(s).' });
    }
    if (typeof username !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ error: 'Invalid field type(s).' });
    }

    await db.connect();

    const users = db.client.db('calcetto').collection('users');
    // Ensure unique index exists (idempotent)
    await users.createIndex({ username: 1 }, { unique: true });

    const existing = await users.findOne({ username });
    if (existing) return res.status(409).json({ error: 'User already exists.' });

    const { salt, hash, iters, algo } = hashPassword(password);
    const userDoc = {
      username,
      name,
      surname,
      salt,
      hashed_psw: hash,
      iters,
      algo,
      createdAt: new Date()
    };

    await users.insertOne(userDoc);

    // Do NOT return secrets
    return res.status(201).json({ username, name, surname });
  } catch (err) {
    // Handle duplicate key race (E11000)
    if (err?.code === 11000) {
      return res.status(409).json({ error: 'User already exists.' });
    }
    return next(err);
  }
});

// POST /api/auth/signin
router.post('/signin', async (req, res, next) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ error: 'Missing required field(s).' });
    }

    await db.connect();

    const user = await db.client
      .db('calcetto')
      .collection('users')
      .findOne({ username }, { projection: { _id: 0, username: 1, salt: 1, hashed_psw: 1, iters: 1 } });

    if (!user || !passwordIsValid(password, user.salt, user.hashed_psw, user.iters)) {
      // Do not reveal which part failed
      return res.status(400).json({ error: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { username: user.username },
      process.env.JWT_SECRET,        // <— match authenticate
      { expiresIn: '1d', algorithm: 'HS256' }
    );

    return res.status(200).json({ token, username: user.username });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
module.exports.authenticate = authenticate;