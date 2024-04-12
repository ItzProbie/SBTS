import React, { useState } from "react";
import Image from "../assets/image.png";
import Logo from "../assets/logo.png";
import { FaEye } from "react-icons/fa6";
import { FaEyeSlash } from "react-icons/fa6";
import { toast } from "react-toastify"
import axios from "axios";
import { useNavigate } from "react-router-dom"
import "../styles/login.css"
import Loader from "./Loader";


const Login = () => {
    const [ showPassword, setShowPassword ] = useState(false);
    const [email , setEmail] = useState('');
    const [password , setPassword] = useState('');
    const [loading , setLoading] = useState(false);
    const navigate = useNavigate();

    const changePasswordHandler = (e) => {
        setPassword(e.target.value);
    }

    const changeEmailHandler = (e) => {
        setEmail(e.target.value);
    }

    function inputValidation(){
        if (email === "") {
            toast.error("email is required!", {
                position: "top-center"
            });
            return false;
        } else if (!email.includes("@")) {
            toast.error("includes @ in your email!", {
                position: "top-center"
            });
            return false;
        } else if (password === "") {
            toast.error("password is required!", {
                position: "top-center"
            });
            return false;
        } else if (password.length < 6) {
            toast.error("password must be 6 char!", {
                position: "top-center"
            });
            return false;
        }
        return true;
    }

    const onSubmitHandler = async(e) => {

        e.preventDefault();

        if(inputValidation()){

            setLoading(true);

           try{

                const data = await axios.post(`${process.env.REACT_APP_BASE_URL}/auth/login` , {
                    email , password
                });

                if(data.data.success){
                    toast.success("Logged in successfully");
                    localStorage.setItem('userToken' , data.data.token);
                    localStorage.setItem('userName' , data.data.name);
                    localStorage.setItem('userEmail' , email);
                    localStorage.setItem('userImage' , data.data.dp);
                    navigate("/home");
                }
                else if(data.status === 404){
                    toast.error("User not registered \n Please SignUp first");
                }
                else if(data.status === 401){
                    toast.error("Incorrect Login Credentials");
                }

           }catch(err){
                if(err.message.includes('404')){
                    toast.error("User not registered \n Please SignUp first");
                }
                else if(err.message.includes('401')){
                    toast.error("Incorrect Login Credentials");
                }
                else{
                    toast.error("Something went wrong please try again later");
                }
           }
           finally{
            setLoading(false);
           }

        }




    }

  return (
    <>
    {
        loading ? (<Loader/>) : (
            
    <div className="login-main text-4xl">
    <div className="login-left">
      <img src={Image} alt="" />
    </div>
    <div className="login-right">
      <div className="login-right-container">
        <div className="login-logo">
          <img src={Logo} alt="" />
        </div>
        <div className="login-center">
          <h2>Welcome back!</h2>
          <p>Please enter your details</p>
          <form>
            <input type="email" placeholder="Email" name="email" value={email}  onChange={(e) => changeEmailHandler(e)}/>
            <div className="pass-input-div">
              <input type={showPassword ? "text" : "password"} placeholder="Password" name="password" value={password} onChange={(e) => changePasswordHandler(e)} />
              {showPassword ? <FaEyeSlash onClick={() => {setShowPassword(!showPassword)}} /> : <FaEye onClick={() => {setShowPassword(!showPassword)}} />}
              
            </div>

            <div className="login-center-buttons">
              <button type="button" onClick={onSubmitHandler}>Log In</button>
            </div>
          </form>
        </div>

        {/* <p className="login-bottom-p">
          Don't have an account? <a href="#">Sign Up</a>
        </p> */}
      </div>
    </div>
  </div>

        )
    }
    </>
  );
};

export default Login;
