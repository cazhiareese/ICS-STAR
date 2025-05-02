import { useState, useEffect } from "react";
import "../../index.css";
import Constellation from "../../assets/SignupAssets/constellationMain.png"
import { OnboardingProvider, useOnboardingContext } from "../AuthContext/onboardingcontext";
import { useNavigate } from 'react-router-dom';



function FinalOnboarding() {
    const {userType, } = useOnboardingContext();
    const navigate = useNavigate();

    return (
    <>
        <div className="flex flex-col bg-white items-center justify-start font-satoshi-regular text-3xl space-y-6 -mt-20 overflow-hidden">

        <div className="bg-secondary flex flex-col items-center justify-end sm:w-[4000px] sm:h-[4000px] border rounded-full relative sm:-mt-950 md:ml-0 h-[800px] w-[800px] -mt-160 overflow-hidden">
            <img src={Constellation} className="rotate-270 sm:w-100 sm:h-400  w-40 h-200 -mb-80 sm:-mb-150"/>
            
        </div>
                    
        <label className="font-satoshi-light pb-13 sm:text-4xl text-3xl sm:pb-8">
               <label className="font-satoshi-bold ">You're all set!</label>
            </label>
            <div className="sm:w-[50%] w-[80%] text-justify flex items-center justify-center">
                <label className="text-2xl">
                Thank You for updating your information. We look forward to supporting your continued journey.
                </label>
            </div>
            <div className="w-80 h-20 bg-primary text-white flex items-center justify-center rounded-3xl text-2xl my-30"
            onClick={()=> {
                    window.location.reload(true); 
                    window.location.reload();
                    window.location.href = userType === "alumni" ? "/alumni/dashboard" : "/student/dashboard";
                    
            }}>
                <label className="font-satoshi-bold">Start Exploring!</label>
            </div>
        </div>
        
    </>
    
  );
}

export default FinalOnboarding;


