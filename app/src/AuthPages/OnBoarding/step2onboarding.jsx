import { useState, useEffect } from "react";
import "../../index.css";
import peersIcon from "../../assets/onBoardingAssets/peersIcon.png";
import { CirclePlus } from "lucide-react";
import { useOnboardingContext } from "../AuthContext/onboardingcontext";
import Unathorized from "../Unauthorized";
import Loading from "../../components/LoadingComponents/circularloading"
import { CustomDropdownStanding } from "./dropdown";
function Step2Onboarding() {
    const baseURL = import.meta.env.VITE_BACKEND_URL;

    const [loadingOrgs, setLoadingOrgs] = useState(false);

    


    const [secondStep, setSecondStep] = useState(false);

    const [orgSuggestions, setOrgSuggestions] = useState([]);

    const { currentSection, setCurrentSection, userType, updateUserData, userData, scholarships, setScholarships, affiliations, setAffiliations } = useOnboardingContext();

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
    const handleAffiliationChange = async (e) => {
        const query = e.target.value;
        setAffiliationInput(query);
    
        if (query.trim() === "") {
            setOrgSuggestions([]);
            return;
        }
    
        setLoadingOrgs(true);  // <-- Start loading
    
        try {
            const response = await fetch(`${baseURL}/get-org?q=${encodeURIComponent(query)}&limit=5`);
            
            const data = await response.json();
            setOrgSuggestions(data);
        } catch (error) {
            console.error("Error fetching org suggestions:", error);
            setOrgSuggestions([]);
        } finally {
            setLoadingOrgs(false);  // <-- Stop loading
        }
    };


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

    const confirmData = () => {
        if (!affiliations) {
            updateUserData("affiliationList", []);
            updateUserData("roleList", []);
        }

        if (userData.affiliationList.length === 0){
            setAffiliations(false)
        }
        if (!scholarships) {
            updateUserData("scholarshipList", []);
        }

        if (userData.scholarshipList.length === 0){
            setScholarships(false)
        }

    };
    

    const submitStep2 = () => {
        setCurrentSection(userType === "student" ? 4 : 3);
        confirmData()
    };

    
    const [standingStep, setStandingStep] = useState(true);
    
    return (
        <>
            {!secondStep && userType === "student" && standingStep === true ? (
            <div className="flex flex-col justify-center pt-10 md:mx-30 mx-10">
                
                <label className="font-satoshi-black lg:text-4xl md:text-3xl sm:text-2xl text-xl pb-10">
                        What’s your current standing?
                </label>
                <CustomDropdownStanding
                    options={[
                        { label: "Freshman", value: "freshman" },
                        { label: "Sophomore", value: "sophomore" },
                        { label: "Junior", value: "junior" },
                        { label: "Senior", value: "senior" },
                    ]}
                    value={userData.standing}
                    onChange={(value) => updateUserData("standing", value)}
                />
                <div className="flex flex-row items-center justify-center my-20 md:space-x-20 sm:space-x-10 w-full sm:text-2xl text-xl">
                    <div
                        className="md:w-70 h-20 text-primary flex items-center justify-center rounded-3xl"
                        onClick={() => setCurrentSection(1)}
                    >
                        <label className="font-satoshi-italic w-40">
                            &lt; Previous
                        </label>
                    </div>
                    <div className="md:w-[70%]"></div>
                    <div
                        className="md:w-70 sm:h-17 w-40 h-14 bg-primary text-white flex items-center justify-center rounded-3xl cursor-pointer"
                        onClick={() => {
                            setStandingStep(false);
                        }}
                    >
                        <label className="font-satoshi-bold cursor-pointer">
                            Proceed
                        </label>
                    </div>
                </div>
            </div>
            ) : (
                !secondStep ? (
                    <div className="flex flex-col justify-center md:mx-30 mx-10">
                    <img src={peersIcon} className="lg:h-12 lg:w-12 h-10 w-10 sm:mt-10 mb-5" alt="Peers Icon" />
                    <label className="font-satoshi-black lg:text-4xl sm:text-3xl text-2xl ">Did you have Affiliations or Scholarships?</label>
                    <label className="font-satoshi-light lg:text-2xl text-xl">
                        Please select if you had any of the following during your time at college
                    </label>

                    <div className="flex flex-row flex-wrap lg:space-x-10 items-center justify-center">
                        <div
                            className={`flex flex-col mt-10 lg:w-70 w-[100%] border lg:h-70 h-30 justify-center rounded-2xl px-10 ${
                                affiliations ? "bg-secondary" : "bg-white"
                            }`}
                            onClick={() => {
                                if (affiliations == true){
                                    setAffiliations(false)
                                } else{
                                    setAffiliations(true)
                                }
                                
                            }}
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
                            onClick={() => {
                                if (scholarships == true){
                                    setScholarships(false)
                                } else{
                                    setScholarships(true)
                                }
                            }}
                        >
                            <label className="font-satoshi-black md:text-2xl text:xl">Scholarships</label>
                            <label className="font-satoshi-light md:text-xl text-md">If you were granted any scholarships.</label>
                        </div>
                    </div>

                    <div className="flex flex-row items-center justify-center my-10 lg:space-x-20 space-x-5 w-full">
                        <div className="w-70 h-20 text-primary flex items-center justify-center rounded-3xl text-2xl" onClick={() => {
                            if (userType=="student"){
                                setStandingStep(true)
                            } else {
                                setCurrentSection(1)
                            }
                            
                            confirmData()
                        }
                            }>
                            <label className="font-satoshi-italic md:text-2xl text-lg">&lt; Previous</label>
                        </div>

                        <div className="md:w-[70%] md:block hidden"></div>

                        <div
                            className="w-70 h-17 bg-primary text-white flex items-center justify-center rounded-3xl text-2xl cursor-pointer"
                            onClick={() => {if (scholarships == false && affiliations == false) {
                                if (userType == "student"){
                                    console.log(userType)
                                    confirmData()
                                    setCurrentSection(4)
                                } else {
                                    console.log(userType)
                                    confirmData()

                                    setCurrentSection(3)
                                }
                            
                            } else {
                                
                                setSecondStep(true)
                            }

                            console.log(affiliations)
                            console.log(scholarships)
                        
                            }}
                        >
                            <label className="font-satoshi-bold cursor-pointer md:text-2xl text-lg">Proceed</label>
                        </div>
                    </div>
                </div>
                    
                ) : (
                    <div className="flex flex-col justify-center pt-10 md:mx-30 mx-10">
                        <label className="font-satoshi-light lg:text-3xl text-xl pb-10">
                            Please select at most 5 each
                        </label>
                        {/* Scholarships Section */}
                        {scholarships === true && (
                            <>
                                <label className="font-satoshi-black lg:text-4xl md:text-3xl sm:text-2xl text-xl">
                                    Scholarships
                                </label>
                                <div className="flex flex-row pt-10 space-x-6">
                                    <input
                                        type="text"
                                        className="border md:w-110 sm:w-100 w-70 h-15 rounded-3xl text-xl pl-5"
                                        placeholder="Scholarships"
                                        value={scholarshipInput}
                                        onChange={handleScholarshipChange}
                                    />
                                    <button onClick={addScholarship}>
                                        <CirclePlus className="md:h-10 md:w-10 cursor-pointer" />
                                    </button>
                                </div>
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
                        )}
                        {/* Affiliations Section */}
                        {affiliations === true && (
                            <>
                                <label className="font-satoshi-black lg:text-4xl md:text-3xl sm:text-2xl text-xl pt-10">
                                    Affiliations
                                </label>
                                <div className="flex flex-row pt-10 space-x-6">
                                    <div className="relative md:w-95 sm:w-50 w-35">
                                        <input
                                            type="text"
                                            className="border w-full h-15 rounded-2xl text-xl pl-5"
                                            placeholder="Org Name"
                                            value={affiliationInput}
                                            onChange={handleAffiliationChange}
                                        />
                                        {(orgSuggestions.length > 0 || loadingOrgs) && (
                                            <div className="absolute left-0 top-full bg-white border border-gray-300 rounded-md shadow-md w-full max-h-40 overflow-y-auto z-20 mt-1">
                                                {loadingOrgs ? (
                                                    <div className="px-4 py-2 text-gray-500 flex justify-center items-center">
                                                        <Loading size={20} />{" "}
                                                        <span className="ml-2 text-sm">Loading...</span>
                                                    </div>
                                                ) : (
                                                    orgSuggestions.map((org, index) => (
                                                        <div
                                                            key={index}
                                                            className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-lg"
                                                            onClick={() => {
                                                                setAffiliationInput(org);
                                                                setOrgSuggestions([]);
                                                            }}
                                                        >
                                                            {org}
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        type="text"
                                        className="border md:w-65 sm:w-50 w-35 h-15 rounded-2xl text-xl pl-5"
                                        placeholder="Role"
                                        value={roleInput}
                                        onChange={handleRoleChange}
                                    />
                                    <button onClick={addAffiliation}>
                                        <CirclePlus className="md:h-10 md:w-10 cursor-pointer" />
                                    </button>
                                </div>
                                <div className="flex flex-wrap mt-4 gap-3">
                                    {userData.affiliationList.map((item, index) => (
                                        <span
                                            key={item}
                                            className="px-4 py-2 bg-primary text-white rounded-full text-sm font-medium cursor-pointer"
                                            onClick={() => (
                                                removeAffiliation(item),
                                                removeRole(userData.roleList[index])
                                            )}
                                        >
                                            <span>{item}</span>
                                            <span className="text-xs text-white/80">
                                                ({userData.roleList[index]})
                                            </span>
                                            <span className="ml-2">✖</span>
                                        </span>
                                    ))}
                                </div>
                            </>
                        )}
                        <div className="flex flex-row items-center justify-center my-20 md:space-x-20 sm:space-x-10 w-full sm:text-2xl text-xl">
                            <div
                                className="md:w-70 h-20 text-primary flex items-center justify-center rounded-3xl"
                                onClick={() => {
                                    setSecondStep(false)
                                    setStandingStep(true)
                                }}
                            >
                                <label className="font-satoshi-italic w-40">
                                    &lt; Previous
                                </label>
                            </div>
                            <div className="md:w-[70%]"></div>
                            <div
                                className="md:w-70 sm:h-17 w-40 h-14 bg-primary text-white flex items-center justify-center rounded-3xl cursor-pointer"
                                onClick={() => {
                                    submitStep2();
                                    confirmData();
                                }}
                            >
                                <label className="font-satoshi-bold cursor-pointer">
                                    Proceed
                                </label>
                            </div>
                        </div>
                    </div>
                )
            )}
        </>
    );
}

export default Step2Onboarding;
