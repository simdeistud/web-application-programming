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
	
router.get("/whoami", (req, res, next) => { 
    res.writeHead(401);
    res.end("ERROR: LOGIN FIRST TO SEE YOUR INFORMATION");
  });
 
module.exports = router;