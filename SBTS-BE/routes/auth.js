const express = require("express");
const router = express.Router();

const {
    signUp,
    sendOtp,
    login
} = require("../controllers/Auth");

router.post("/signUp" , signUp);
router.post("/sendOtp" , sendOtp);
router.post("/login" , login);

module.exports = router;