import { useState } from "react";
import "../../index.css";
import peersIcon from "../../assets/onBoardingAssets/peersIcon.png";
import { CirclePlus } from "lucide-react";
import { useOnboardingContext } from "../AuthContext/onboardingcontext";
import Unathorized from "../Unauthorized";

function Step2Onboarding() {
    const [scholarships, setScholarships] = useState(false);
    const [affiliations, setAffiliations] = useState(false);
    const [secondStep, setSecondStep] = useState(false);

    const { currentSection, setCurrentSection, userType, updateUserData, userData } = useOnboardingContext();

    // State for input fields
    const [scholarshipInput, setScholarshipInput] = useState("");
    const [affiliationInput, setAffiliationInput] = useState("");
    const [roleInput, setRoleInput] = useState("");

    // State for storing added items
    const [scholarshipList, setScholarshipList] = useState([]);
    const [affiliationList, setAffiliationList] = useState([]);

    // Handle input changes
    const handleScholarshipChange = (e) => setScholarshipInput(e.target.value);
    const handleRoleChange = (e) => setRoleInput(e.target.value);
    const handleAffiliationChange = (e) => setAffiliationInput(e.target.value);


    // Add scholarship when "+" is clicked
    const addScholarship = () => {
        if (scholarshipInput.trim() !== "" && !scholarshipList.includes(scholarshipInput)) {
            // setScholarshipList([...scholarshipList, scholarshipInput]);
            updateUserData("scholarshipList",[...userData.scholarshipList, scholarshipInput]);

            setScholarshipInput(""); // Clear input field
        }
    };

    // Add affiliation when "+" is clicked
    const addAffiliation = () => {
        if (affiliationInput.trim() !== "" && !affiliationList.includes(affiliationInput)) {
            updateUserData("affiliationList", [...userData.affiliationList, affiliationInput])
            updateUserData("roleList", [...userData.roleList, roleInput])
            
            // setAffiliationList([...affiliationList, affiliationInput]);
            setAffiliationInput(""); // Clear input field
            setRoleInput("")
        }
    };

    // Remove scholarship from the list
    const removeScholarship = (item) => {
        updateUserData("scholarshipList", userData.scholarshipList.filter((scholarship) => scholarship !== item));
    };

    // Remove affiliation from the list
    const removeAffiliation = (item) => {
        updateUserData("affiliationList", userData.affiliationList.filter((affiliation) => affiliation !== item));
    };

    const removeRole = (item) => {
        updateUserData("roleList", userData.roleList.filter((role) => role !== item));
    };

    const submitStep2 = () => {
        setCurrentSection(userType === "student" ? 4 : 3);
        // try {
        //     const baseURL = "https://ics-star-api.vercel.app/"
        //     const token = localStorage.getItem("token");
            

        //             // Build query string for affiliations + roles
        //     if (affiliations === true && userData.affiliationList.length > 0 && userData.roleList.length > 0) {
        //         const affiliationParams = new URLSearchParams();
        //         userData.affiliationList.forEach(item => affiliationParams.append("affiliations", item));
        //         userData.roleList.forEach(item => affiliationParams.append("roles", item));

        //         const response = await fetch(`${baseURL}add-affiliations?${affiliationParams.toString()}`, {
        //             method: "POST",
        //             headers: {
        //                 Authorization: `Bearer ${token}`,
        //             },
        //         });

        //         const data = await response.json();
        //         console.log("Affiliations response:", data);

        //         if (!response.ok) {
        //             alert(data.message || JSON.stringify(data) || "Affiliation submission failed!");
        //             return;
        //         }
        //     }

        //     // Build query string for scholarships
        //     if (scholarships === true && userData.scholarshipList.length > 0) {
        //         const scholarshipParams = new URLSearchParams();
        //         userData.scholarshipList.forEach(item => scholarshipParams.append("scholarships", item));

        //         const response = await fetch(`${baseURL}add-scholarships?${scholarshipParams.toString()}`, {
        //             method: "POST",
        //             headers: {
        //                 Authorization: `Bearer ${token}`,
        //             },
        //         });

        //         const data = await response.json();
        //         console.log("Scholarships response:", data);

        //         if (response.ok) {
        //             alert("Submission Successful!");
                    
        //         } else {
        //             alert(data.message || JSON.stringify(data) || "Scholarship submission failed!");
        //         }
        //     }

           
            
        // } catch (error) {
        //     console.error("Error:", error);
        //     alert("Something went wrong!");
        // }
    };

    return (
        <>
            {!secondStep ? (
                <div className="flex flex-col justify-center md:mx-30 mx-10">
                    <img src={peersIcon} className="lg:h-15 lg:w-15 h-10 w-10 sm:mt-10 mb-5" alt="Peers Icon" />
                    <label className="font-satoshi-black lg:text-5xl sm:text-3xl text-2xl ">Did you have Affiliations or Scholarships?</label>
                    <label className="font-satoshi-light lg:text-3xl text-xl">
                        Please select if you had any of the following during your time at college
                    </label>

                    <div className="flex flex-row flex-wrap lg:space-x-10 items-center justify-center">
                        <div
                            className={`flex flex-col mt-10 lg:w-70 w-[100%] border lg:h-70 h-30 justify-center rounded-2xl px-10 ${
                                affiliations ? "bg-secondary" : "bg-white"
                            }`}
                            onClick={() => setAffiliations(!affiliations)}
                        >
                            <label className="font-satoshi-black md:text-2xl text:xl">Affiliations</label>
                            <label className="font-satoshi-light md:text-xl text-md">
                                If you were part of any organizations, societies, or associations.
                            </label>
                        </div>

                        <div className="xl:flex flex-col lg:w-[10%] text-justify justify-center rounded-2xl px-10 hidden"></div>

                        <div
                            className={`flex flex-col mt-10 lg:w-70 w-[100%] border lg:h-70 h-30 justify-center rounded-2xl px-10 ${
                                scholarships ? "bg-secondary" : "bg-white"
                            }`}
                            onClick={() => setScholarships(!scholarships)}
                        >
                            <label className="font-satoshi-black md:text-2xl text:xl">Scholarships</label>
                            <label className="font-satoshi-light md:text-xl text-md">If you were granted any scholarships.</label>
                        </div>
                    </div>

                    <div className="flex flex-row items-center justify-center my-10 lg:space-x-20 space-x-5 w-full">
                        <div className="w-70 h-20 text-primary flex items-center justify-center rounded-3xl text-2xl" onClick={() => setCurrentSection(1)}>
                            <label className="font-satoshi-italic md:text-2xl text-lg">&lt; Previous</label>
                        </div>

                        <div className="md:w-[70%] md:block hidden"></div>

                        <div
                            className="w-70 h-17 bg-primary text-white flex items-center justify-center rounded-3xl text-2xl cursor-pointer"
                            onClick={() => {if (!scholarships && !affiliations) {
                                if (userType == "student"){
                                    console.log(userType)
                                    setCurrentSection(4)
                                } else {
                                    console.log(userType)

                                    setCurrentSection(3)
                                }
                            
                            } else {
                                setSecondStep(true)
                            }
                        
                            }}
                        >
                            <label className="font-satoshi-bold cursor-pointer md:text-2xl text-lg">Proceed</label>
                        </div>
                    </div>
                </div>
            ) : (   
                <div className="flex flex-col justify-center pt-10 md:mx-30 mx-10">
                    {/* <img src={peersIcon} className="lg:h-20 lg:w-20 h-10 w-10 mt-10 mb-5 mr-auto" alt="Peers Icon" /> */}
                    <label className="font-satoshi-light lg:text-3xl text-xl pb-10">
                        Please select atmost 5 each
                    </label>
                    {/* Scholarships Section */}
                    {scholarships &&<>
                    
                      <label className="font-satoshi-black lg:text-4xl md:text-3xl sm:text-2xl text-xl ">Scholarships</label>

                      <div className="flex flex-row pt-10 space-x-6">
                          <input
                              type="text"
                              className="border md:w-110 sm:w-100 w-70 h-15 rounded-3xl text-2xl pl-5"
                              placeholder="Scholarships"
                              value={scholarshipInput}
                              onChange={handleScholarshipChange}
                          />
                          <button onClick={addScholarship}>
                              <CirclePlus className="md:h-10 md:w-10 cursor-pointer" />
                          </button>
                      </div>
                      {/* Display added scholarships */}
                      <div className="flex flex-wrap mt-4 gap-3">
                          {userData.scholarshipList.map((item) => (
                              <span
                                  key={item}
                                  className="px-4 py-2 bg-primary text-white rounded-full text-sm font-medium cursor-pointer"
                                  onClick={() => removeScholarship(item)}
                              >
                                  {item} ✖
                              </span>
                          ))}
                      </div>
                      </>
                    }
                    

                    {/* Affiliations Section */}
                    
                    {affiliations && <>
                    <label className="font-satoshi-black lg:text-4xl md:text-3xl sm:text-2xl text-xl pt-10">Affiliations</label>

                    <div className="flex flex-row pt-10 space-x-6">
                        <input
                            type="text"
                            className="border md:w-65 sm:w-50 w-35 h-15 rounded-2xl text-2xl pl-5"
                            placeholder="Org Name"
                            value={affiliationInput}
                            onChange={handleAffiliationChange}
                        />
                        <input
                            type="text"
                            className="border md:w-65 sm:w-50 w-35 h-15 rounded-2xl text-2xl pl-5"
                            placeholder="Role"
                            value={roleInput}
                            onChange={handleRoleChange}
                        />
                        <button onClick={addAffiliation}>
                            <CirclePlus className="md:h-10 md:w-10 cursor-pointer" />
                        </button>
                    </div>

                    {/* Display added affiliations */}
                    <div className="flex flex-wrap mt-4 gap-3">
                        {userData.affiliationList.map((item, index) => (
                            <span
                                key={item}
                                className="px-4 py-2 bg-primary text-white rounded-full text-sm font-medium cursor-pointer"
                                onClick={() => (
                                    removeAffiliation(item),
                                    removeRole(userData.roleList[index]),
                                    console.log("SDFDS")
                                )
                                }
                            >
                                <span>{item}</span> 
                                <span className="text-xs text-white/80">({userData.roleList[index]})</span>
                                <span className="ml-2">✖</span>
                            </span>

                            
                        ))}
                    </div>
                    </>}

                    <div className="flex flex-row items-center justify-center my-20 md:space-x-20 sm:space-x-10 w-full sm:text-2xl text-xl">
          
          
          
                        <div className="md:w-70 h-20 text-primary flex items-center justify-center rounded-3xl "
                            onClick={()=>setCurrentSection(1)}
                        >
                                <label className="font-satoshi-italic w-40">&lt; Previous</label>
                        </div> 

                        <div className="md:w-[70%]">

                        </div> 
                        <div className="md:w-70 sm:h-17 w-40 h-14 bg-primary text-white flex items-center justify-center rounded-3xl cursor-pointer"
                            onClick={submitStep2}
                        >
                                <label className="font-satoshi-bold cursor-pointer">Proceed</label>
                        
                        
                        </div>
                        
                    </div>
                    
                </div>
            )}
        </>
    );
}

export default Step2Onboarding;
