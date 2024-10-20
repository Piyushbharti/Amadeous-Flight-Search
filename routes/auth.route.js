const express = require("express");
const router = express.Router();
const flightSearch = require("../controller/auth.controller"); 
const authorizationMiddleWare = require("../middleware/auth.middleware");

router.post("/flight-search", authorizationMiddleWare, flightSearch);

module.exports = router;
