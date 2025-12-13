const express = require("express");
const auth = require("./auth.js");
const fields = require("./fields.js");
const tournaments = require("./tournaments.js");
const matches = require("./matches.js");
const router = express.Router();

router.use("/auth", auth);
router.use("/fields", fields);
router.use("/tournaments", tournaments);
router.use("/matches", matches);

// GET  /api/whoami  If authenticated, returns information about the current user
router.get("/whoami", (req, res, next) => {
  if ("user is authenticated") {
    res.header(200).json({ user });
    res.end();
    return;
  }
  res.header(401).json({ error: "Not authenticated" });
  res.end();
});

module.exports = router;
