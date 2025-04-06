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
    <div className="flex sm:flex-row flex-col h-screen">

        {/* Placeholder */}
        <div className="flex items-center pt-20 flex-col sm:w-1/4 sm:max-w-85 sm:min-w-50 bg-teal-50 sm:h-full h-50 sm:mb-0  sm:z-20 z-60 sm:pb-0 pb-10 w-full overflow-clip" >
        </div>
        <div className="flex items-center pt-20 flex-col sm:w-1/4 sm:max-w-85 sm:min-w-50 bg-secondary sm:h-full h-50 sm:mb-0  sm:z-20 z-60 sm:pb-0 pb-10  fixed w-full overflow-clip" >
            <img src={Logo} className="w-[80%] min-w-40 max-w-80 z-20"/>
            <img src={Constellation} className="hidden w-full ml-50 mt-0 -rotate-90 sm:-rotate-39 overflow-hidden sm:block"/>
            <img src={Constellation} className="w-[100%] min-w-40 max-w-80 z-10 rotate-90 -m-130 mr-20 h-[800px] sm:hidden block"/>
        </div>
        
        {/* <div className="z-20 flex justify-center items-center flex-1 sm:w-auto w-full mt-40 bg-white"> */}
        <Start/>
        {/* </div> */}
        
        <div className=" h-10 right-15 top-7 inline text-right z-70 fixed">
            <label className="">
                <label className="hidden sm:block">Already have an account?</label><label><button className="text-primary font-satoshi-bold" onClick={goToLogin}>Login here</button></label>
            </label>    
        </div>

    </div>
    
  );
}

export default SignupPage;


