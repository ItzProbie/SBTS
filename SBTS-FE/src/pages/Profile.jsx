
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const navigate = useNavigate();

    const buttonHandler = () => {
        localStorage.clear();
        navigate("/");
    };

    return (
        <div className="flex flex-col justify-center items-center p-7 m-7">
            <div className="flex flex-col items-center justify-center border-2 border-gray-500 rounded-lg p-14 text-3xl font-semibold bg-slate-100 min-h-[80vh] shadow-[5px_5px_rgba(0,_98,_90,_0.4),_10px_10px_rgba(0,_98,_90,_0.3),_15px_15px_rgba(0,_98,_90,_0.2),_20px_20px_rgba(0,_98,_90,_0.1),_25px_25px_rgba(0,_98,_90,_0.05)]">
                <div className="flex justify-center items-center bg-black h-48 w-48 p-3 rounded-full mb-7 ">
                    <img
                        src={localStorage.getItem("userImage")}
                        alt="DP"
                        className=" h-40 w-40 rounded-full"
                    />
                </div>
                <p className="mb-4 flex flex-col justify-center items-center">
                    <span className="font-bold">Name:</span>{" "}
                    {localStorage.getItem("userName")}
                </p>
                <p className="mb-4 flex flex-col justify-center items-center">
                    <span className="font-bold">Email:</span>{" "}
                    {localStorage.getItem("userEmail")}
                </p>
                <button
                    type="button"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                    onClick={buttonHandler}
                >
                    Signout
                </button>
            </div>
        </div>
    );
};

export default Profile;
