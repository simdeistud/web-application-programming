const express = require("express");
const authenticate = require("../middleware/auth.middleware.js");
const router = express.Router();

//  GET  /api/matches/:id  Match details
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const match = await db.client
            .db("calcetto")
            .collection("matches")
            .findOne({ id: id });
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
        const { id } = req.params;
        const { results } = req.body;

        if (results === undefined) {
            return res.status(400).json({ error: "Missing results" });
        }

        const match = await db.client
            .db("calcetto")
            .collection("matches")
            .findOne({ match_id: id });

        if (!match) {
            return res.status(404).json({ error: "Match not found" });
        }

        await db.client
            .db("calcetto")
            .collection("matches")
            .updateOne(
                { match_id: id },
                { $set: { "details.results": results } },
                { $set: { "details.status": "played" } }
            );

        return res.status(200).json({ message: "Match result updated successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
