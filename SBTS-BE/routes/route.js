const express = require("express");
const router = express.Router();

const { deviceAuth } = require('../middlewares/auth');
const { createPolyline , tollCalculator } = require("../controllers/Map");

router.post("/createPolyline" , createPolyline);
// router.post("/tollCalculator" , deviceAuth , tollCalculator);

router.post("/tollCalculator" ,deviceAuth ,  tollCalculator);


module.exports = router;