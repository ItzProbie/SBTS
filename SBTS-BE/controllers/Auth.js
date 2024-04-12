const User = require("../models/User");
const otpGenerator = require("otp-generator");
const OTP = require("../models/OTP");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signUp = async(req,res) => {
    try{

        const {
            name,
            email,
            password,
            confirmPassword,
            otp
        } = req.body;

        if(!name || !email || !password || !confirmPassword || !otp){
            
            return res.status(404).json({
                success : false,
                mssg : "ALL FIELDS ARE MANDATORY"
            });

        }
        
        if(password !== confirmPassword){

            return res.status(400).json({
                success : false,
                mssg : "Password and confirm password does not match"
            });

        }

        const existingUser = await User.findOne({email});
        if(existingUser){

            return res.status(400).json({
                success : false,
                mssg : "User already registered please login"
            });

        }

        const otpDB = await OTP.find({email}).sort({createdAt : -1}).limit(1);
        if(otpDB.length === 0){

            return res.status(400).json({
                success : false,
                mssg : "INVALID OTP"
            });

        }
        else if(otp !== otpDB[0].otp){

            return res.status(400).json({
                success : false,
                mssg : "INVALID OTP"
            });

        }
        
        const hashedPassword = await bcrypt.hash(password , 10);

        const user = await User.create({
            name,
            email,
            password : hashedPassword,
            image : `https://api.dicebear.com/5.x/initials/svg?seed=${name}`,
        });

        return res.status(200).json({
            success : true,
            user 
        });

    }catch(err){
        return res.status(500).json({
            success : false,
            error : err.message,
            mssg : "Cant sign up plz try again later"
        });
    }
};

exports.sendOtp = async(req,res) => {

    try{

        const {email} = req.body;
        
        const checkUserPresent = await User.findOne({email});
        if(checkUserPresent){

            return res.status(401).json({
                success : false,
                message : "User already registered"
            });

        }

        var otp = otpGenerator.generate(6 , {
            upperCaseAlphabets : false,
            lowerCaseAlphabets : false,
            specialChars : false
        });

        let result = await OTP.findOne({otp});
        while(result){
            otp = otpGenerator.generate({
                upperCaseAlphabets : false,
                lowerCaseAlphabets : false,
                specialChars : false
            });
            result = await OTP.findOne({otp});
        }

        const otpBody = await OTP.create({
            email ,
            otp
        })

        res.status(200).json({
            success : true,
            message : "OTP SENT SUCCESSFULLY",
            otp
        });

    }catch(err){
        return res.status(500).json({
            success : false,
            mssg : err.message
        });
    }

};

exports.login = async(req,res) => {

    try{

        const {email,password} = req.body;

        if(!email || !password){
            return res.status(403).json({
                success : false,
                message : "Missing login credentials"
            });
        }

        const user = await User.findOne({ email })
        .populate({
            path: 'trips',
            populate: {
                path: 'routes',
            },
        })
        .exec();
        
        if(!user){
            return res.status(404).json({
                success : false,
                message : "User not registered"
            });
        }

        if(await bcrypt.compare(password , user.password)){

            const payload = {
                email : user.email,
                id : user._id,
                accountType : user.accountType
            }
            const token = jwt.sign(payload , process.env.JWT_SECRET , {
                expiresIn : "2h"
            })


            res.status(200).json({
                success : true,
                token , 
                name : user.name,
                dp : user.image,
                message : "Logged in successfully"
            });

        }
        else{
            return res.status(401).json({
                success : false,
                message : "Password is incorrect"
            });
        }

    }catch(err){
        return res.status(500).json({
            success : false, 
            error : err.message,
            message : "Something went wrong while login plz try again later"
        });
    }

};