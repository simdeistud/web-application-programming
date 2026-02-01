const express = require("express");
const { authenticate } = require('../middleware/auth.middleware.js');
const { getDb, idFromString } = require("../config/db.js");
const router = express.Router();

//  GET  /api/matches/:id  Match details
router.get("/:id", async (req, res) => {
    try {
        const match_id = idFromString(req.params.id);
        const match = await getDb()
            .collection("matches")
            .findOne({ id: match_id });
        if (!match) {
            return res.status(404).json({ error: "Match not found" });
        }
        return res.status(200).json({ match });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
});

// PUT  /api/matches/:id/result  Enter match result
router.put("/:id/result", authenticate, async (req, res) => {
    try {
        const match_id = idFromString(req.params.id);
        const { scores } = req.body;

        if (scores === undefined) {
            return res.status(400).json({ error: "Missing scores" });
        }

        const match = await getDb()
            .collection("matches")
            .findOne({ _id: match_id });

        if (!match) {
            return res.status(404).json({ error: "Match not found" });
        }

        if (match.status === "played") {
            return res.status(400).json({ error: "Match result already recorded" });
        }

        const updRes = await getDb()
            .collection("matches")
            .updateOne(
                { _id: match_id },
                { $set: { scores, status: "played" } }
            );
            

        return res.status(200).json({ message: "Match result added successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
