const polyline = require("polyline");
const axios = require("axios");
const Route = require("../models/Route");
const Trip = require("../models/Trip");

require("dotenv").config();

const TOLLGURU_URL = "https://apis.tollguru.com/toll/v2/complete-polyline-from-mapping-service";
const TOLLGURU_HEADER = {
    "x-api-key" : process.env.TOLLGURU_API_KEY,
    "Content-Type": "application/json"
}

exports.createPolyline = (req,res) => {
    
    const {coordinates} = req.body;

    if(!coordinates){
        return res.status(404).json({
            success : false,
            error : "MISSING COORDINATES"
        })
    }

    const Polyline = polyline.encode(coordinates);

    return res.status(200).json({

        success : true,
        data : Polyline,

    });
}


exports.tollCalculator = async(req,res) => {
    
    try{

        const {polyline} = req.body;

        //TODO : STARTTIME AND ENDTIME

        if(!polyline){
            return res.status(404).json({
                success : false,
                error : "MISSING POLYLINE DATA"
            });
        }

        const payload = {
            source: "here",
            polyline : polyline
        }

        const TOLLGURU_RESPONSE = await axios.post(TOLLGURU_URL , payload , {headers : TOLLGURU_HEADER});

        if(TOLLGURU_RESPONSE.data.route.costs.cash > 0){

            
        // let trip = new Trip({

        //     vehicleType : TOLLGURU_RESPONSE.data.summary.vehicleType , 
        //     cashCost : TOLLGURU_RESPONSE.data.route.costs.cash , 
        //     tagCost : TOLLGURU_RESPONSE.data.route.costs?.tag , 
        //     polyline : polyline,
        //     routes : []

        // });

        // console.log(TOLLGURU_RESPONSE.data);    

        // await Promise.all(
        //     TOLLGURU_RESPONSE.data.route.tolls.map( async(toll, index) => {
        //         const route = await Route.create({
        //             name : toll.name , 
        //             road : toll.road , 
        //             state : toll.state , 
        //             lat : toll.lat , 
        //             lng : toll.lng , 
        //             cashCost : toll.cashCost , 
        //             tagCost : toll?.tagCost
        //         });
    
        //         trip.routes  = [...trip.routes , route._id];
            
        //     })
        // );

        // const savedTrip = await trip.save();
        
        // req.user.trips = [...req.user.trips , savedTrip];
        // await req.user.save();
        
        // const populatedTrip = await Trip.findById(savedTrip._id).populate('routes').exec();

        // return res.status(200).json({
        //     success : true,
        //     tolls : populatedTrip            
        // });
            

        }

        let trip = new Trip({

            vehicleType : TOLLGURU_RESPONSE.data.summary.vehicleType , 
            cashCost : TOLLGURU_RESPONSE.data.route.costs.cash , 
            tagCost : TOLLGURU_RESPONSE.data.route.costs?.tag , 
            polyline : polyline,
            routes : []

        });

        console.log(TOLLGURU_RESPONSE.data);    

        await Promise.all(
            TOLLGURU_RESPONSE.data.route.tolls.map( async(toll, index) => {
                const route = await Route.create({
                    name : toll.name , 
                    road : toll.road , 
                    state : toll.state , 
                    lat : toll.lat , 
                    lng : toll.lng , 
                    cashCost : toll.cashCost , 
                    tagCost : toll?.tagCost
                });
    
                trip.routes  = [...trip.routes , route._id];
            
            })
        );

        const savedTrip = await trip.save();
        
        req.user.trips = [...req.user.trips , savedTrip];
        await req.user.save();
        
        const populatedTrip = await Trip.findById(savedTrip._id).populate('routes').exec();

        return res.status(200).json({
            success : true,
            tolls : populatedTrip            
        });

    

    }catch(err){
        return res.status(500).json({
            success : false,
            error : err.message,
            mssg : "SOMETHING WENT WRONG"
        });
    }

}
