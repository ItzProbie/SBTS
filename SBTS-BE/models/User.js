const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    accountType : {
        type : String,
        enum:["Admin" , "User"],
        default : "User"
    },
    image : {
        type : String,
        required : true
    },
    trips : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Trip"
        }
    ]

});

module.exports = mongoose.model("User" , userSchema);