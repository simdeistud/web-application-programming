const express = require("express");
const { SPORT_TYPES } = require("../config/constants.js");
const { authenticate } = require('../middleware/auth.middleware.js');
const { getDb, idFromString } = require("../config/db.js");
const { generateMatchSchedule, getStandings } = require("../utils/tournament.util.js");
const router = express.Router();

// GET  /api/tournaments/:id/standings  Tournament standings
router.get("/:id/standings", async (req, res) => {
    try {
        const tournament_id = idFromString(req.params.id);
        const tournament = await getDb()
            .collection("tournaments")
            .findOne({ _id: tournament_id });
        if (!tournament) {
            return res.status(404).json({ error: "Tournament not found" });
        }
        const matches = await getDb()
            .collection("matches")
            .find({ tournament_id: tournament._id, status: "played" })
            .toArray();
        const standings = getStandings(matches, tournament.sport_type);
        return res.status(200).json({ standings });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
});

// GET  /api/tournaments?q=query  List of tournaments
router.get("", async (req, res) => {
    try {
        const q = req.query.q || "";
        const filter = q
            ? { $text: { $search: q } }   // text search when non-empty
            : {};
        const tournaments = await getDb()
            .collection("tournaments")
            .find(filter)
            .toArray();
        return res.status(200).json({ tournaments });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
});

// GET /api/tournaments/my  List of user's tournaments
router.get("/my", authenticate, async (req, res) => {
    try {
        const username = req.user.username;
        const tournaments = await getDb()
            .collection("tournaments")
            .find({ creator: username })
            .toArray();
        return res.status(200).json({ tournaments });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
});

// GET  /api/tournaments/:id/matches  List matches
router.get("/:id/matches", async (req, res) => {
    try {
        const tournament_id = idFromString(req.params.id);
        const tournament = await getDb()
            .collection("tournaments")
            .findOne({ _id: tournament_id });
        if (!tournament) {
            return res.status(404).json({ error: "Tournament  not found" });
        }
        const matches = await getDb()
            .collection("matches")
            .find({ tournament_id: tournament._id })
            .toArray();
        return res.status(200).json({ matches });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
});

// GET  /api/tournaments/:id  Tournament details
router.get("/:id", async (req, res) => {
    try {
        const tournament_id = idFromString(req.params.id);
        const tournament = await getDb()
            .collection("tournaments")
            .findOne({ tournament_id: tournament_id });
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
router.post("", authenticate, async (req, res) => {
    try {
        const { name, sport_type, start_date, max_teams } = req.body;
        const creator = req.user.username;
        if (!name || !sport_type || !start_date || !max_teams) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        if (!SPORT_TYPES.includes(sport_type)){
            return res.status(400).json({ error: "Invalid sport type." });
        }
        const newTournament = {
            name,
            sport_type,
            start_date: new Date(start_date),
            max_teams,
            creator: creator,
        };
        const result = await getDb()
            .collection("tournaments")
            .insertOne(newTournament);
        return res.status(201).json({ tournament: result });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
});

// POST  /api/tournaments/:id/matches/generate  Generate match schedule
router.post("/:id/matches/generate", authenticate, async (req, res) => {
    try {
        const tournament_id = idFromString(req.params.id);
        const tournament = await getDb()
            .collection("tournaments")
            .findOne({ _id: tournament_id });
        if (!tournament) {
            return res.status(404).json({ error: "Tournament not found" });
        }
        if (tournament.creator !== req.user.username) {
            return res.status(403).json({ error: "Forbidden: only the creator can generate matches" });
        }
        const matches = generateMatchSchedule(tournament);
        if (matches.length === 0) {
            return res.status(400).json({ error: "Not enough teams to generate matches" });
        }
        const result = await getDb()
            .collection("matches")
            .insertMany(matches);
        return res.status(201).json({ matches });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
});

// PUT  /api/tournaments/:id  Edit tournament data
router.put("/:id", authenticate, async (req, res) => {
    try {
        const tournament_id = idFromString(req.params.id);
        const updates = req.body ?? {};
        const creator = req.user.username;

        // Load tournament
        const tournaments = getDb().collection("tournaments");
        const tournament = await tournaments.findOne({ _id: tournament_id });
        if (!tournament) {
            return res.status(404).json({ error: "Tournament not found" });
        }
        if (tournament.creator !== creator) {
            return res.status(403).json({ error: "Forbidden: only the creator can edit the tournament" });
        }

        // Normalize incoming values
        const incomingTeams = updates?.details?.teams;              // may be undefined
        const incomingMaxTeams = updates?.max_teams;                // may be undefined
        const currentTeams = tournament?.details?.teams || [];      // default empty array
        const currentMaxTeams = tournament?.max_teams;              // may be undefined

        // ===== Validation rules =====
        // Case A: both new teams and new max_teams provided
        if (Array.isArray(incomingTeams) && typeof incomingMaxTeams !== "undefined") {
            if (incomingTeams.length > incomingMaxTeams) {
                return res.status(400).json({ error: "Number of teams exceeds max_teams limit" });
            }
        }

        // Case B: only new max_teams provided
        if (typeof incomingMaxTeams !== "undefined" && !Array.isArray(incomingTeams)) {
            if (currentTeams.length > incomingMaxTeams) {
                return res.status(400).json({ error: "max_teams cannot be less than the number of teams in the tournament" });
            }
        }

        // Case C: only new teams provided
        if (Array.isArray(incomingTeams) && typeof incomingMaxTeams === "undefined") {
            if (typeof currentMaxTeams !== "undefined" && incomingTeams.length > currentMaxTeams) {
                return res.status(400).json({ error: "Number of teams exceeds max_teams limit" });
            }
        }

        // ===== Build update document defensively =====
        const $set = {};

        // Update only when explicitly provided
        if (Array.isArray(incomingTeams)) {
            // This creates details if missing and sets the array
            $set["details.teams"] = incomingTeams;
        }
        if (typeof incomingMaxTeams !== "undefined") {
            $set.max_teams = incomingMaxTeams;
        }

        if (Object.keys($set).length === 0) {
            // Nothing to update; return 204 No Content or 400 depending on your API design
            return res.status(400).json({ error: "No valid fields to update" });
        }

        // IMPORTANT: match by _id (consistent with findOne) and optionally creator
        const result = await tournaments.updateOne(
            { _id: tournament_id, creator },
            { $set }
        );

        if (result.matchedCount === 0) {
            // Shouldn’t happen given the earlier findOne/creator check, but keep for safety
            return res.status(404).json({ error: "Tournament not found" });
        }

        return res.status(200).json({ message: "Tournament updated successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
});

// DELETE  /api/tournaments/:id  Delete the tournament (creator only)
router.delete("/:id", authenticate, async (req, res) => {
    try {
        const tournament_id = idFromString(req.params.id);
        const creator = req.user.username;
        const result = await getDb()
            .collection("tournaments")
            .deleteOne({ _id: tournament_id, creator: creator });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Tournament not found or not owned by user" });
        }
        return res.status(200).json({ message: "Tournament deleted successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
});
module.exports = router;
