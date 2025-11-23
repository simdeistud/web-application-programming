const express = require("express");
const router = express.Router();

    
router.post("/signup", (req, res) => {
    /* handle signup */
    res.header(200);
    res.end("USER REGISTERED");
  });

router.post("/signin", (req, res) => {
    /* handle signin */
    res.header(200);
    res.end("USER LOGGED IN");
  });

module.exports = router;