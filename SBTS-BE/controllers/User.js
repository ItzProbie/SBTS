const User = require("../models/User");


exports.getTrips = async(req,res) => {

    try{

        const user = await User.findById(req.user.id).populate({
            path: 'trips',
            populate: {
                path: 'routes'
            }
        }).exec();

        return res.status(200).json({
            success : true,
            data : user.trips
        });

    }catch(err){
        return res.status(500).json({
            success : false,
            error : err.message,
            data : "Trip details cant be fetched , plz try again later"
        });
    }

}