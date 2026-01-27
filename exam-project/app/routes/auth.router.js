const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../config/db.js');
const { hashPassword, passwordIsValid } = require('../utils/password.util');

const router = express.Router();

// POST /api/auth/signup
router.post('/signup', async (req, res, next) => {
  try {
    const { username, password, name, surname } = req.body || {};
    if (!username || !password || !name || !surname) {
      return res.status(400).json({ error: 'Missing required field(s).' });
    }

    await db.connect();
    const users = db.client.db('exam-project').collection('users');

    await users.createIndex({ username: 1 }, { unique: true });

    if (await users.findOne({ username })) {
      return res.status(409).json({ error: 'User already exists.' });
    }

    const { salt, hash, iters, algo } = hashPassword(password);

    await users.insertOne({
      username,
      name,
      surname,
      salt,
      hashed_psw: hash,
      iters,
      algo,
      createdAt: new Date()
    });

    return res.status(201).json({ username, name, surname });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({ error: 'User already exists.' });
    }
    next(err);
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
      .db('exam-project')
      .collection('users')
      .findOne(
        { username },
        { projection: { _id: 0, username: 1, salt: 1, hashed_psw: 1, iters: 1 } }
      );

    if (!user || !passwordIsValid(password, user.salt, user.hashed_psw, user.iters)) {
      return res.status(400).json({ error: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1d', algorithm: 'HS256' }
    );

    return res.status(200).json({ token, username: user.username });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
