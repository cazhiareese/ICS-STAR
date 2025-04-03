import { useState, useEffect } from "react";
import "../../index.css";
import Constellation from "../../assets/SignupAssets/constellationMain.png"
import { useOnboardingContext } from "../AuthContext/onboardingcontext";
// import
function OnBoarding() {
    const {currentSection, setCurrentSection} = useOnboardingContext();
    return (
    <>
        <div className="flex flex-col bg-white items-center justify-start font-satoshi-regular text-3xl space-y-6 -mt-20 overflow-hidden">

        <div className="bg-secondary flex flex-col items-center justify-end sm:w-[4000px] sm:h-[4000px] border rounded-full relative sm:-mt-930 md:ml-0 h-[800px] w-[800px] -mt-140 overflow-hidden">
            <img src={Constellation} className="rotate-270 w-100 h-340 -mb-120"/>
            <label className="font-satoshi-light pb-13 sm:text-4xl text-3xl sm:pb-8">
                Welcome back, <label className="font-satoshi-bold ">Kiefer!</label>
            </label>
        </div>
                    
            
            <div className="sm:w-[50%] w-[80%] text-justify flex items-center justify-center pt-19">
                <label className="text-2xl">
                    Your account has been successfully verified. 
                    We'd love to catch up and hear how you've been.
                </label>
            </div>

            <div className="w-80 h-20 bg-primary text-white flex items-center justify-center rounded-3xl text-2xl my-30"
                onClick={()=>setCurrentSection(1)}>
                <label className="font-satoshi-bold">Let's Get Started!</label>
            </div>
        </div>
        
    </>
    
  );
}

export default OnBoarding;


