const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

    exports.auth = async(req,res,next) => {

        try{

            // const token = req.cookies.token || req.body.token;
            var Token = req.headers['authorization'];

            if(!Token){
                return res.status(401).json({
                    success : false,
                    message : "Token not found"
                });
            }

            const token = (Token.split(' '))[1];

            try{

                const decode = jwt.verify(token , process.env.JWT_SECRET);
                console.log(decode);
                req.user = decode;

            }catch(err){
                return res.status(401).json({
                    success : false,
                    message : "Token invlaid"
                });
            }
            next();

        }catch(err){
            console.log(err);
            return res.status(401).json({
                success : false,
                message : "Token validation failed",
                error : err.message
            });
        }

    }

exports.isAdmin = async(req,res,next) => {

    try{

        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success : false,
                message : "This is a protected route for Admin only"
            });
        }

    }catch(err){
        return res.status(500).json({
            success : false,
            message : "User role verification failed , plz try again later",
            error : err.message
        });
    }

}

exports.deviceAuth = async(req,res,next) => {

    try{

        const id = req.body.userId;
        const user = await User.findById(id);

        if(!user){
            return res.status(401).json({
                success : false,
                message : "Device id invalid"
            });
        }

        req.user = user;
        next();

    }catch(err){
        return res.status(500).json({
            success : false,
            message : "Error in deviceAuth",
            error : err.message
        });
    }

}