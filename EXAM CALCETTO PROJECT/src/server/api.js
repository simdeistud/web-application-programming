const express = require("express");
const auth = require("./auth.js");
const router = express.Router();

app.use("/auth", auth);
	
router.get("/whoami", (req, res, next) => { 
    res.writeHead(401);
    res.end("ERROR: LOGIN FIRST TO SEE YOUR INFORMATION");
  });
 
module.exports = router;