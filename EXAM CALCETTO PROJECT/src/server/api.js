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
router.get("/whoami", auth.authenticate, async (req, res, next) => {
  const user_info = await db.client
      .db("calcetto")
      .collection("users")
      .findOne({ username: req.body.username });
  return res.status(201).json({
    username: user_info.username,
    name: user_info.name,
    surname: user_info.surname
  });
});

module.exports = router;
