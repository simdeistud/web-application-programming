const express = require("express");
const router = express.Router();

// GET  /api/tournaments/:id/standings  Tournament standings
router.get("", (req, res) => {});

// GET  /api/tournaments?q=query  List of tournaments
router.get("", (req, res) => {});

// GET  /api/tournaments/:id/matches  List matches
router.get("", (req, res) => {});

// GET  /api/tournaments/:id  Tournament details
router.get("", (req, res) => {});

// POST  /api/tournaments  Create a new tournament (authenticated)
router.post("", (req, res) => {});

// POST  /api/tournaments/:id/matches/generate  Generate match schedule
router.post("", (req, res) => {});

// PUT  /api/tournaments/:id  Edit tournament data
router.put("", (req, res) => {});

// DELETE  /api/tournaments/:id  Delete the tournament (creator only)
router.delete("", (req, res) => {});

module.exports = router;
