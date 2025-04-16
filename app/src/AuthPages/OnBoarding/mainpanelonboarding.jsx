import { useState, useEffect } from "react";
import "../../index.css";
import Step1Onboarding from "./step1onboarding.jsx";
import Step2Onboarding from "./step2onboarding.jsx";
import Step3Onboarding from "./step3onboardin.jsx";
import Step4Onboarding from "./step4onboarding.jsx";
import FinalOnboarding from "./finalonboarding.jsx";
import OnBoarding from "./onboardinglanding";
import Progressbar1 from "../../assets/onBoardingAssets/progressBar1.png";
import Progressbar2 from "../../assets/onBoardingAssets/progressBar2.png";
import Progressbar3 from "../../assets/onBoardingAssets/progressBar3.png";
import Progressbar4 from "../../assets/onBoardingAssets/progressBar4.png";
import Progressbar5 from "../../assets/onBoardingAssets/progressBar5.png";
import { useOnboardingContext } from "../AuthContext/onboardingcontext.jsx"

function MainPanelOnboarding() {

    const {currentSection, setCurrentSection} = useOnboardingContext()
    // const [currentSection, setCurrentSection] = useState("5")
    const OnboardingComponents = {
        0: <OnBoarding/>,
        1: <Step1Onboarding />,
        2: <Step2Onboarding />,
        3: <Step3Onboarding />,
        4: <Step4Onboarding />,
        5: <FinalOnboarding />
    };

    const ProgressBar = {
        0: <></>,
        1: <img src={Progressbar1}/>,
        2: <img src={Progressbar2}/>,
        3: <img src={Progressbar3}/>,
        4: <img src={Progressbar4}/>,
        5: <img src={Progressbar5}/>
    }


    return (
    <>
        <div className="flex items-center justify-center relative">
            <div className="flex flex-col items-center  z-20 bg-white w-[90%] h-[90%] border overflow-auto rounded-4xl">
                
                {currentSection!=5 && currentSection!=0 && <div className= "my-10">
                    {ProgressBar[currentSection]}
                </div>}
                <div className="w-[100%] rounded-xl max-h-[750px] overflow-y-auto">
                    {OnboardingComponents[currentSection]}
                </div>
            </div>
            
        </div>
        <div className="bg-black w-screen h-full fixed opacity-70 top-0 left-0 z-10">

        </div>

        
        
    </>
    
    );
}

export default MainPanelOnboarding;


