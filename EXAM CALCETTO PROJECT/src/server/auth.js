const express = require("express");
const router = express.Router();

// POST  /api/auth/signup  Register a new user
router.post("/signup", (req, res) => {
    /* handle signup */
    res.header(200);
    res.end("<insert successfully inserted credentials here>");
  });
  
// POST  /api/auth/signin  User login
router.post("/signin", (req, res) => {
    /* handle signin */
    res.header(200);
    res.end("<insert successfully inserted credentials here + insert session token here>");
  });

module.exports = router;