import "../../index.css";
import Step3 from "../../assets/SignupAssets/step3.png"
import { useAppContext } from "../AuthContext/signupcontext";

function Success(){

    const {currentSection, setCurrentSection} = useAppContext();

    return(
        <div className="flex flex-col w-full items-center ">
            <div className = "flex flex-row z-20 space-x-8 mt-20">
                        <button className = "w-15 h-15" onClick={()=>setCurrentSection(1)}></button>
                        <button className = "w-15 h-15 " onClick={()=>setCurrentSection(2)}></button>

                        {/*  Placeholder buttons do not work, only for debugging and better placement of the 2 buttons above*/}
                        <button className = "w-15 h-15 " ></button>
                        <button className = "w-15 h-15 "/> 
            </div>
            <img src={Step3} className="-mt-12"/>

            <label className="font-satoshi-bold text-center text-3xl text-black pt-20 pb-8 w-80">Account Created Successfully!</label>
            
            <div className = "flex flex-col lg:w-150 md:w-100 w-70 h-full text-xl text-justify pt-15">
                    <label className="font-satoshi-regular text-primary inline">
                            Your account is currently awaiting verification by our admin team,&nbsp;
                            <label className="font-satoshi-regular text-black inline ">
                                but in the meantime, feel free to explore the website. We'll let you know as soon as your 
                                verification is complete.
                            </label>
                    </label>

                    <label className="font-satoshi-italic text-gray-600 pt-15">
                                Please note: Some features may be temporarily unavailable until your account is fully verified.
                    </label>
                    
            </div>

            <div class=" flex flex-col items-end lg:w-150 md:w-100 w-70 pt-10">
                        <button
                            className="bg-primary text-white py-3 rounded-2xl text-lg w-40 font-bold hover:bg-blue-700 transition mt-0"
                            // onClick = {()=>}
                        >
                            Continue

                        </button>
                    </div>
        </div>
    );
}
import { LucideImport } from "lucide-react";

export default Success