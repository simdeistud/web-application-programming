const express = require("express");
const router = express.Router();

// GET  /api/tournaments/:id/standings  Tournament standings
router.get("", (req, res) => {});

// GET  /api/tournaments?q=query  List of tournaments
router.get("", async (req, res) => {
    try {
        const q = req.query.q || "";
        const tournaments = await db.client
            .db("calcetto")
            .collection("tournaments")
            .find({
                name: { $regex: q, $options: "i" } // "i" stands for case insensitive match
            })
            .toArray();
        return res.status(200).json({ tournaments });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
});

// GET  /api/tournaments/:id/matches  List matches
router.get("", (req, res) => {});

// GET  /api/tournaments/:id  Tournament details
router.get("", async (req, res) => {
    try {
        const { id } = req.params;
        const tournament = await db.client
            .db("calcetto")
            .collection("tournaments")
            .findOne({ id: id });
        if (!tournament) {
            return res.status(404).json({ error: "Tournament not found" });
        }
        return res.status(200).json({ tournament });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
});

// POST  /api/tournaments  Create a new tournament (authenticated)
router.post("", (req, res) => {});

// POST  /api/tournaments/:id/matches/generate  Generate match schedule
router.post("", (req, res) => {});

// PUT  /api/tournaments/:id  Edit tournament data
router.put("", async (req, res) => {
    
});

// DELETE  /api/tournaments/:id  Delete the tournament (creator only)
router.delete("", (req, res) => {});

module.exports = router;
