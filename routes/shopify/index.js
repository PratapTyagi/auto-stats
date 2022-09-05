const express = require("express");
const router = express.Router();

router.post("/authenticate", require("./authentication"));
router.post("/customers", require("./customers"));
router.post("/orders", require("./orders"));

module.exports = router;
