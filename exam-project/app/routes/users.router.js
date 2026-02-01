const express = require('express');
const { getDb } = require("../config/db.js");

const router = express.Router();

// GET /api/users - returns all registered users
router.get('/users', async (req, res) => {
  try {
    const q = req.query.q || "";
    const filter = q
            ? { $text: { $search: q } }   // text search when non-empty
            : {};
    const users = await getDb().collection("users").find(filter).toArray();
    if (!users) {
        return res.status(404).json({ error: 'There are no users' });
    } 

    for (const user of users){
        const tournaments = await getDb().collection("tournaments").find({ creator: user.username }).toArray();
        user.tournaments = tournaments;
    }

    return res.status(200).json({ users: users.map(u => { u.username, u.name, u.surname, u.tournaments }) });
  } catch (e) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;