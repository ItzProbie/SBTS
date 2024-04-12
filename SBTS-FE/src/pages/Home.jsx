import { useEffect , useState } from "react";
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { toast } from "react-toastify"
import React from "react";
import { ImUser } from "react-icons/im";
import { FaMapPin } from "react-icons/fa";
import Loader from "./Loader";
import "../styles/home.css";



const Home = () => {

    const navigate = useNavigate();
    const [loading , setLoading] = useState(false);
    const [info , setInfo] = useState([]);

    useEffect(() => {

        setLoading(true);
        const token = localStorage.getItem('userToken');

        if(!token || token.length<5){
            navigate("/");
            return null;
        }

        const getData = async() => {

            try{



                const data = await axios.get(`${process.env.REACT_APP_BASE_URL}/user/getTrips` , {headers : {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}`
                }});

                setInfo(data.data.data);

            }catch(err){

                if(err.message.includes('401')){
                    navigate('/');
                    return null;
                }
                toast.error('Something went wrong');
                
            }
            finally{
                setLoading(false);
            }

        }

        getData();

    },[]);

    useEffect(() => {

    },[info]);

    const dateFormat = (timestamp) => {
        const date = new Date(timestamp);

        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
        const year = date.getFullYear();

        const formattedDate = `${day}/${month}/${year}`;
        return formattedDate;

    }


    return (

        <div>
            {loading ? (
            <Loader/>
          ) : (
            <div className=" flex flex-col justify-center items-center m-11 p-1">
            {/* <ImUser className="fixed top-5 left-5 h-14 w-14 rounded-full"/> */}
            <ImUser className="h-16 w-16 rounded-full bg-indigo-200 cursor-pointer 
            hover:scale-125 transition-all duration-300 ease-in-out" onClick={() => navigate("/profile")}/>
            <div class='Main'>
                <div class="bungee-spice-regular">

            

                    {
                        info.map((trips) => (
                            
                            <div className="flex flex-col justify-center items-center m-7 p-7 bg-black flex-wrap 
                            shadow-[rgba(6,_24,_44,_0.4)_0px_0px_0px_2px,_rgba(6,_24,_44,_0.65)_4px_8px_6px_-1px,_rgba(255,_255,_255,_0.08)_0px_1px_0px_inset]
                             hover:bg-opacity-10 transition-all duration-300 ease-in-out">
                                <div className="flex flex-row justify-center items-center flex-wrap">
                                    {/* <h2 className=" flex flex-row justify-center items-center font-bold p-7" >Trip</h2> */}
                                    
                                    <div className="flex flex-col justify-center items-start p-7">
                                        <p>{`Vehicle Type`}</p>
                                        <p>{`${trips?.vehicleType}`}</p>
                                    </div>
                                    <div className="flex flex-col justify-center items-start p-7">
                                        <p>{`Cash Cost`}</p>
                                        <p>{`${trips?.cashCost}`}</p>
                                    </div>
                                    <div className="flex flex-col justify-center items-start p-7">
                                        <p>{`Tag Cost`}</p>
                                        <p>{`${trips?.tagCost}`}</p>
                                    </div>
                                </div>

                                <div className=" -m-1">
                                <span>{`Date : ${dateFormat(trips.createdAt)}`}</span>
                                </div>

                                <div className=" p-12 flex flex-row justify-start items-center flex-wrap"> 
                                {trips.routes.length > 0 && 
                                    trips.routes.map((route) => (
                                        <div className="flex flex-col justify-center items-start p-8 ">
                                        <span className="flex flex-row justify-start items-center gap-2">{`Name : ${route.name}`} <a href={`https://www.google.com/maps?q=${route.lat},${route.lng}`} target="_blank"><FaMapPin color="purple"/></a></span>
                                        <span>{`Road : ${route.road}`}</span>
                                        <span>{`cashCost : ${route.cashCost}`}</span>
                                        <span>{`tagCost : ${route.tagCost}`}</span>
                                        <span>{`State : ${route.state}`}</span>
                                        </div>
                                    ) )
                                }
                                </div>

                            </div>
                        ))
                    }

                </div>
            </div>
            </div>
          )}
        </div>

    );
}

export default Home