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
    <div className="flex sm:flex-row flex-col h-screen bg-white">

        <div className="flex items-center pt-10 flex-col sm:w-1/4 sm:max-w-85 sm:min-w-50 bg-secondary sm:h-screen h-50 sm:mb-0  sm:z-0 z-60 sm:pb-0 pb-10 sm:relative fixed w-full" >
            <img src={Logo} className="w-[80%] min-w-40 max-w-80 z-20 mt-20 sm:mt-0 lg:mt-2"/>
            <img src={Constellation} className="hidden w-full ml-50 lg:ml-80 lg:mt-0 mt-30 -rotate-90 sm:-rotate-39 overflow-hidden sm:block"/>
            <img src={Constellation} className="w-[100%] min-w-40 max-w-80 z-10 rotate-90 -m-130 mr-20 h-[800px] sm:hidden block"/>
        </div>
        {/* <div className="z-20 flex justify-center items-center flex-1 sm:w-auto w-full mt-40 bg-white"> */}
        <Start/>
        {/* </div> */}
        
        <div className="fixed top-[23%] right-4 -translate-y-1/2 sm:top-7 sm:translate-y-0 sm:right-7 z-70 px-4 py-2">
            <span className="font-satoshi-regular text-sm sm:text-base">
                Already have an account?{' '}
                <button 
                    className="text-primary font-satoshi-bold underline cursor-pointer"
                    onClick={goToLogin}
                >
                    Login here
                </button>
            </span>
        </div>


    </div>
    
  );
}

export default SignupPage;


