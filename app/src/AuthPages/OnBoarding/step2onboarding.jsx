import { useState, useEffect } from "react";
import "../../index.css";
import peersIcon from "../../assets/onBoardingAssets/peersIcon.png";
import { Plus, ChevronLeft } from "lucide-react";
import { useOnboardingContext } from "../AuthContext/onboardingcontext";
import Unathorized from "../Unauthorized";
import Loading from "../../components/LoadingComponents/circularloading"
import { CustomDropdownStanding } from "./dropdown";
import ModalTemplate from "../modaltemplate";
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
    const standingOptions = [
        { label: "Freshman", value: "freshman" },
        { label: "Old Freshman", value: "old freshman" },
        { label: "Sophomore", value: "sophomore" },
        { label: "Junior", value: "junior" },
        { label: "Senior", value: "senior" },
        { label: "Graduating", value: "graduating" },
      ];
      
      // Find the selected option object from userData.standing
      const selectedStanding = standingOptions.find(opt => opt.value === userData.standing);

    return (
        <>
            {!secondStep && userType === "student" && standingStep === true ? (
            <div className="flex flex-col justify-center pt-10 md:mx-30 mx-10">
                
                <label className="font-satoshi-black lg:text-4xl md:text-3xl sm:text-2xl text-xl pb-10">
                        What’s your current standing?
                </label>
                <CustomDropdownStanding
                    options={standingOptions}
                    value="Freshman"  // Not just "freshman" — the whole object
                    onChange={(selectedOption) => updateUserData("standing", selectedOption.value)}
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
                <div className="flex flex-col md:mx-30 mx-10 min-h-screen">
                    <img src={peersIcon} className="lg:h-12 lg:w-12 h-10 w-10 sm:mt-10 mb-5" alt="Peers Icon" />
                    <label className="font-satoshi-bold lg:text-4xl sm:text-3xl text-2xl ">Did you have Affiliations or Scholarships?</label>
                    <label className="font-satoshi-light lg:text-2xl text-md">
                        Please select if you had any of the following during your time at college
                    </label>

                    <div className="flex flex-col md:flex-row mt-10 gap-3 md:gap-5 items-center justify-center">
                        <button
                            type="button"
                            className={`flex flex-col md:w-70 w-full border border-neutral-300 h-30 md:h-60 pt-5 md:pt-10 rounded-2xl px-5 hover:bg-secondary cursor-pointer ${
                                affiliations ? "bg-secondary border-primary" : "bg-neutral-100"
                            }`}
                            onClick={() => setAffiliations(!affiliations)}
                            >
                            <span className="font-satoshi-black md:text-xl text-lg text-left">Affiliations</span>
                            <span className="font-satoshi-light md:text-lg text-sm text-left pt-3">
                                If you were part of any organizations, societies, or associations.
                            </span>
                        </button>

                        <div className="xl:flex flex-col lg:w-[10%] text-justify justify-center rounded-2xl px-10 hidden"></div>

                        <button
                            type="button"
                            className={`flex flex-col md:w-70 w-full border border-neutral-300 h-30 md:h-60 pt-5 md:pt-10 rounded-2xl px-5 hover:bg-secondary cursor-pointer ${
                                scholarships ? "bg-secondary border-primary" : "bg-neutral-100"
                            }`}
                            onClick={() => setScholarships(!scholarships)}
                            >
                            <span className="font-satoshi-black md:text-xl text-lg text-left">Scholarships</span>
                            <span className="font-satoshi-light md:text-lg text-sm text-left pt-3">
                                If you were granted any scholarships.
                            </span>
                        </button>
                    </div>
                    
                    {/* Bottom Previous and Proceed Buttons */}
                    <div className="flex flex-row items-center justify-between mt-10 w-full sticky bottom-0 mb-10">
                        <button
                            type="button"
                            className="flex flex-row items-center justify-center hover:text-hover cursor-pointer group"
                            onClick={() => {
                                if (userType=="student"){
                                    setStandingStep(true)
                                } else {
                                    setCurrentSection(1)
                                }
                                
                                confirmData()
                                }
                            }
                        >
                            <ChevronLeft className="text-primary group-hover:text-hover"/>
                            <span className="font-satoshi-bold text-primary flex items-center w-20 p-2 text-md group-hover:text-hover">
                                Previous
                            </span>
                        </ button>

                        {/* <div className="md:w-[70%] md:block hidden"></div> */}

                        <button
                            type="button"
                            className="font-satoshi-bold text-white text-sm bg-primary flex items-center justify-center w-20 md:w-40 pl-15 pr-15 pt-3 pb-3 rounded-2xl md:order-2 hover:bg-hover cursor-pointer"
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
                            Proceed
                        </button>
                    </div>
                </div>
                    
                ) : (
                    <div className="flex flex-col justify-center lg:pt-10 md:mx-30 mx-10">
                        <label className="font-satoshi-light lg:text-2xl text-xl pb-10">
                            Please select at most 5 each
                        </label>
                        {/* Scholarships Section */}
                        {scholarships === true && (
                            <>
                                <label className="font-satoshi-black lg:text-4xl md:text-3xl sm:text-2xl text-xl pt-10">
                                    Scholarships
                                </label>
                                <div className="flex flex-row pt-5 space-x-3 items-center">
                                    <input
                                        type="text"
                                        className="border border-neutral-300 md:w-110 sm:w-100 w-70 h-15 rounded-3xl text-xl pl-5 pr-5 bg-neutral-100"
                                        placeholder="Name of scholarship"
                                        value={scholarshipInput}
                                        onChange={handleScholarshipChange}
                                    />
                                    <button onClick={addScholarship} className="flex items-center justify-center rounded-full bg-primary w-8 h-8 md:w-10 md:h-10 hover:bg-hover cursor-pointer flex-shrink-0">
                                        <Plus className="h-5 w-5 md:h-7 md:w-7 cursor-pointer text-white stroke-3" />
                                    </button>
                                </div>
                                <div className="flex flex-wrap flex-row mt-4 gap-3">
                
                                    {userData.scholarshipList.map((item) => (
                                        <div
                                            key={item}
                                            className="flex justify-between items-center bg-primary text-white rounded-full px-4 py-2 w-full max-w-md"
                                        >
                                            <div className="flex flex-col text-xs font-medium">
                                            <span className="whitespace-normal break-words">{item}</span>
                                            </div>
                                            <button
                                            type="button"
                                            className="ml-4 text-white hover:text-gray-200 focus:outline-none"
                                            onClick={() => {
                                                removeScholarship(item);
                                            }}
                                            aria-label={`Remove ${item}`}
                                            >
                                            ✖
                                            </button>
                                        </div>
                                    ))}  
                                </div>
                            </>
                        )}
                        {/* Affiliations Section */}
                        {affiliations === true && (
                            <>
                                <label className="font-satoshi-black lg:text-4xl md:text-3xl sm:text-2xl text-xl lg:pt-10 pt-5">
                                    Affiliations
                                </label>
                                <div className="flex flex-row items-center justify-center pt-5 gap-3">
                                    <div className="flex flex-col gap-3 lg:flex-row items-center w-full">
                                        <div className="relative lg:w-120 w-full">
                                            <input
                                                type="text"
                                                className="border border-neutral-300 focus:outline-none focus:border-primary w-full max-w-full h-15 rounded-2xl text-xl pl-5 pr-5 bg-neutral-100"
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
                                        <div className="w-full lg:w-90">
                                            <input
                                                type="text"
                                                className="border border-neutral-300 focus:outline-none focus:border-primary w-full max-w-full h-15 rounded-2xl text-xl pl-5 pr-5 bg-neutral-100"
                                                placeholder="Role"
                                                value={roleInput}
                                                onChange={handleRoleChange}
                                            />
                                        </div>
                                        
                                    </div>
                                    <button onClick={addAffiliation} className="flex items-center justify-center rounded-full bg-primary w-8 h-8 md:w-10 md:h-10 hover:bg-hover cursor-pointer flex-shrink-0">
                                        <Plus className="h-5 w-5 md:h-7 md:w-7 cursor-pointer text-white stroke-3" />
                                    </button>
                                </div>
                                <div className="flex flex-wrap flex-row mt-4 gap-3">
                
                                    {userData.affiliationList.map((item, index) => (
                                        <div
                                            key={item}
                                            className="flex justify-between items-center bg-primary text-white rounded-full px-4 py-2 w-full max-w-md"
                                        >
                                            <div className="flex flex-col text-xs font-medium">
                                            <span className="whitespace-normal break-words">{item}</span>
                                            <span className="text-white/80">{userData.roleList[index]}</span>
                                            </div>
                                            <button
                                            type="button"
                                            className="ml-4 text-white hover:text-gray-200 focus:outline-none"
                                            onClick={() => {
                                                removeAffiliation(item);
                                                removeRole(userData.roleList[index]);
                                            }}
                                            aria-label={`Remove ${item}`}
                                            >
                                            ✖
                                            </button>
                                        </div>
                                    ))}  
                                </div>
                               
                            </>
                        )}
                        {/* Bottom Previous and Proceed Buttons */}
                        <div className="flex flex-row items-center justify-between mt-10 w-full sticky bottom-0 mb-10">
                            <button
                                type="button"
                                className="flex flex-row items-center justify-center hover:text-hover cursor-pointer group"
                                onClick={() => {
                                    setSecondStep(false)
                                    setStandingStep(true)
                                    }
                                }
                            >
                                <ChevronLeft className="text-primary group-hover:text-hover"/>
                                <span className="font-satoshi-bold text-primary flex items-center w-20 p-2 text-md group-hover:text-hover">
                                    Previous
                                </span>
                            </ button>

                            <button
                                type="button"
                                className="font-satoshi-bold text-white text-sm bg-primary flex items-center justify-center w-20 md:w-40 pl-15 pr-15 pt-3 pb-3 rounded-2xl md:order-2 hover:bg-hover cursor-pointer"
                                onClick={() => {
                                    submitStep2();
                                    confirmData();
                                }}
                            >
                                Proceed
                            </button>
                        </div>
                    </div>
                )
            )}
        </>
    );
}

export default Step2Onboarding;
