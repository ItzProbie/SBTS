const mongoose = require("mongoose");

const routeSchema = new mongoose.Schema({

    name : {
        type : String,
        required : true
    },
    road : {
        type : String,
        required : true
    },
    state : {
        type : String,
        required : true
    },
    lat : {
        type : Number,
        required : true
    },
    lng : {
        type : Number,
        required : true
    },
    cashCost : {
        type : Number,
        required : true
    },
    tagCost : {
        type : Number,
    },


});

module.exports = mongoose.model("Route" , routeSchema);