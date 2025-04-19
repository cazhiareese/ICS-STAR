import { useState, useEffect } from "react";
import "../../index.css";
import Constellation from "../../assets/SignupAssets/constellationMain.png"
import { useOnboardingContext } from "../AuthContext/onboardingcontext";
import Unathorized from "../Unauthorized";

function OnBoarding() {
    const { currentSection, setCurrentSection, name, setName, setEmail , setUserType} = useOnboardingContext();
    const [first_name, setFirstName] = useState("");
    const [error, setError] = useState(null); // State to handle errors
    

    useEffect(() => {
        const fetchName = async () => {
            try {
                const token = localStorage.getItem("token");

                // Check if token is available
                if (!token) {
                    setError("No token found. Please log in.");
                    return;
                }

                const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
                const response = await fetch(`https://ics-star-api.vercel.app/users/me`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                

                // Check if the response is ok (status 200-299)
                if (!response.ok) {
                    // If the status is 401, handle unauthorized
                    if (response.status === 401) {
                        setError("Unauthorized access. Please log in again.");
                        return;
                    }
                    throw new Error("Network response was not ok");
                }

                // Log the raw response for debugging
                const text = await response.text();
                console.log("Raw response:", text);

                // Try to parse the response as JSON
                let result;
                try {
                    result = JSON.parse(text);
                } catch (jsonError) {
                    setError("Failed to parse the server response.");
                    console.error("JSON parsing error: ", jsonError);
                    return;
                }
                // Correctly access 'data'
                setFirstName(result.first_name); // Set first name from the fetched data
                setName(result.first_name + " " + result.last_name)
                setEmail(result.email)
                setUserType(result.user_type)
            } catch (err) {
                console.error("Error fetching data: ", err);
                setError("Failed to load profile data. Please try again.");
            }
        };
        
        fetchName();
    }, []);
    return (
    <>
        <div className="flex flex-col bg-white items-center justify-start font-satoshi-regular text-3xl space-y-6 -mt-20 overflow-hidden">

        <div className="bg-secondary flex flex-col items-center justify-end sm:w-[4000px] sm:h-[4000px] border rounded-full relative sm:-mt-930 md:ml-0 h-[800px] w-[800px] -mt-140 overflow-hidden">
            <img src={Constellation} className="rotate-270 w-100 h-340 -mb-120"/>
            <label className="font-satoshi-light pb-13 sm:text-4xl text-3xl sm:pb-8">
                Welcome back, <label className="font-satoshi-bold ">{name}</label>
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


