const express = require('express');
const auth = require('./auth.router.js');
const { authenticate } = require('../middleware/auth.middleware.js');
const { getDb } = require("../config/db.js");
const fields = require('./fields.router.js');
const tournaments = require('./tournaments.router.js');
const matches = require('./matches.router.js');
const teams = require('./teams.router.js');

const router = express.Router();

router.use('/auth', auth);
router.use('/fields', fields);
router.use('/tournaments', tournaments);
router.use('/matches', matches);
router.use('/teams', teams);

// GET /api/whoami - returns current user info (authenticated)
router.get('/whoami', authenticate, async (req, res, next) => {
  try {
    const user = await getDb().collection("users").findOne({ username: req.user.username });
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.status(200).json({ username: user.username, name: user.name, surname: user.surname });
  } catch (e) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;