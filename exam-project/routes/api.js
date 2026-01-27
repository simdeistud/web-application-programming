const express = require('express');
const auth = require('./auth.js');
const db = require('./db.js');
const fields = require('./fields.js');
const tournaments = require('./tournaments.js');
const matches = require('./matches.js');

const router = express.Router();

router.use('/auth', auth);
router.use('/fields', fields);
router.use('/tournaments', tournaments);
router.use('/matches', matches);

// GET /api/whoami - returns current user info (authenticated)
router.get('/whoami', auth.authenticate, async (req, res, next) => {
  try {
    const user = await db.client.db('calcetto').collection('users').findOne(
      { username: req.user.username },
      { projection: { _id: 0, username: 1, name: 1, surname: 1 } }
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.status(200).json(user);
  } catch (e) {
    next(e);
  }
});

module.exports = router;