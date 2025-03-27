import { useState, useEffect } from "react";
import "../index.css";
import Start from "./SignupSteps/mainpanel.jsx"
import Logo from "../assets/SignupAssets/logo.png"
import Constellation from "../assets/SignupAssets/constellationMain.png"
import { useNavigate } from "react-router-dom";
function SignupPage() {

    const navigate = useNavigate();

    const goToLogin = () => {
        navigate("/login");  // Redirects to the Login page
    };

    return (
    <div className="flex  flex-row h-screen overflow-hidden">

        <div className="hidden sm:flex items-center pt-20 flex-col w-1/4 max-w-85 min-w-50 bg-secondary">
            <img src={Logo} className="w-[80%] max-w-80"/>
            <img src={Constellation} className="h-300 ml-30 md:ml-80 -rotate-20 md:-rotate-39 overflow-hidden"/>
        </div>
        <Start/>
        <div className="absolute h-10 right-15 top-7 inline text-right ">
            <label className="">
                <label className="hidden sm:block">Already have an account?</label><label><button className="text-primary font-satoshi-bold" onClick={goToLogin}>Login here</button></label>
            </label>    
        </div>

    </div>
    
  );
}

export default SignupPage;


