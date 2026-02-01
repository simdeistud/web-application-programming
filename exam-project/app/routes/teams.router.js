const express = require("express");
const { authenticate } = require('../middleware/auth.middleware.js');
const { getDb } = require("../config/db.js");
const router = express.Router();


// POST  /api/teams  Create team
router.post("", authenticate, async (req, res) => {
    try {
        const {name, players} = req.body;
        if (!name || !Array.isArray(players)) {
            return res.status(400).json({ error: "Missing or invalid team name or players" });
        }

        const existingTeam = await getDb()
            .collection("teams")
            .findOne({ name: name });
        if (existingTeam) {
            return res.status(409).json({ error: "Team with this name already exists" });
        }

        const result = await getDb()
            .collection("teams")
            .insertOne({ name, players, creator: req.user.username });

        return res.status(201).json({ teamId: result.insertedId, team: { name, players } });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
});

// GET /api/teams?q=query  List teams (searchable) <-- NOT IN THE SPEC BUT DOESN'T CHANGE DEFAULT BEHAVIOR
router.get("", async (req, res) => {

    try {
        const q = req.query.q || "";
        const teams = await getDb()
            .collection("teams")
            .find({ $text: { $search: q } })
            .toArray();
        return res.status(200).json({ teams });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
});

// GET /api/teams/my  List user's teams
router.get("/my", authenticate, async (req, res) => {
    try {
        const teams = await getDb()
            .collection("teams")
            .find({ creator: req.user.username })
            .toArray();
        return res.status(200).json({ teams });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
});

//  GET  /api/teams/:name  Team details
router.get("/:name", async (req, res) => {
    try {
        const { name } = req.params;
        const team = await getDb()
            .collection("teams")
            .findOne({ name: name });
        if (!team) {
            return res.status(404).json({ error: "Team not found" });
        }
        return res.status(200).json({ team });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
});

// DELETE  /api/teams/:name  Delete team
router.delete("/:name", authenticate, async (req, res) => {
    try {
        const { name } = req.params;
        const result = await getDb()
            .collection("teams")
            .deleteOne({ name: name, creator: req.user.username });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Team not found or not owned by user" });
        }
        return res.status(200).json({ message: "Team deleted successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
