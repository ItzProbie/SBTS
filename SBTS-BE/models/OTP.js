const mongoose = require("mongoose");
const {mailSender} = require("../utils/mailSender");
const {otpTemplate} = require("../mailTemplates/otpTemplate");

const otpSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true
    },
    otp : {
        type : String,
        required : true
    },
    createdAt : {
        type : Date,
        default : Date.now(),
        expires : 5*60 
    }
});

async function sendVerificationMail(email , otp){
    try{

        await mailSender(email , "Verification Mail" , otpTemplate(otp));        
        console.log("Mail sent successfully");

    }catch(err){
        console.log("Error while sending mail");
        throw err;
    }
}

otpSchema.pre("save" , async function(next){
    
    if(this.isNew){
        await sendVerificationMail(this.email , this.otp);
    }
    next();

});

module.exports = mongoose.model("OTP" , otpSchema);