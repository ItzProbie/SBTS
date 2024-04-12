const express = require("express");
const router = express.Router();

const { auth } = require("../middlewares/auth");
const { getTrips } = require("../controllers/User");

router.get("/getTrips" , auth , getTrips );

module.exports = router;