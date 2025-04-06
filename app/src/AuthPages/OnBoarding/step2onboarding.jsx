import { useState } from "react";
import "../../index.css";
import peersIcon from "../../assets/onBoardingAssets/peersIcon.png";
import { CirclePlus } from "lucide-react";
import { useOnboardingContext } from "../AuthContext/onboardingcontext";

function Step2Onboarding() {
    const [scholarships, setScholarships] = useState(false);
    const [affiliations, setAffiliations] = useState(false);
    const [secondStep, setSecondStep] = useState(false);

    const { currentSection, setCurrentSection } = useOnboardingContext();

    // State for input fields
    const [scholarshipInput, setScholarshipInput] = useState("");
    const [affiliationInput, setAffiliationInput] = useState("");

    // State for storing added items
    const [scholarshipList, setScholarshipList] = useState([]);
    const [affiliationList, setAffiliationList] = useState([]);

    // Handle input changes
    const handleScholarshipChange = (e) => setScholarshipInput(e.target.value);
    const handleAffiliationChange = (e) => setAffiliationInput(e.target.value);

    // Add scholarship when "+" is clicked
    const addScholarship = () => {
        if (scholarshipInput.trim() !== "" && !scholarshipList.includes(scholarshipInput)) {
            setScholarshipList([...scholarshipList, scholarshipInput]);
            setScholarshipInput(""); // Clear input field
        }
    };

    // Add affiliation when "+" is clicked
    const addAffiliation = () => {
        if (affiliationInput.trim() !== "" && !affiliationList.includes(affiliationInput)) {
            setAffiliationList([...affiliationList, affiliationInput]);
            setAffiliationInput(""); // Clear input field
        }
    };

    // Remove scholarship from the list
    const removeScholarship = (item) => {
        setScholarshipList(scholarshipList.filter((scholarship) => scholarship !== item));
    };

    // Remove affiliation from the list
    const removeAffiliation = (item) => {
        setAffiliationList(affiliationList.filter((affiliation) => affiliation !== item));
    };

    return (
        <>
            {!secondStep ? (
                <div className="flex flex-col justify-center md:mx-30 mx-10">
                    <img src={peersIcon} className="lg:h-15 lg:w-15 h-10 w-10 mt-10 mb-5" alt="Peers Icon" />
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
                                setCurrentSection(3)
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
                    <img src={peersIcon} className="lg:h-20 lg:w-20 h-10 w-10 mt-10 mb-5 mr-auto" alt="Peers Icon" />
                    
                    {/* Scholarships Section */}
                    {scholarships &&<>
                    
                      <label className="font-satoshi-black lg:text-4xl md:text-3xl sm:text-2xl text-xl ">Scholarships</label>

                      <div className="flex flex-row pt-10 space-x-6">
                          <input
                              type="text"
                              className="border md:w-110 sm:w-100 w-70 h-15 rounded-3xl text-2xl pl-5"
                              value={scholarshipInput}
                              onChange={handleScholarshipChange}
                          />
                          <button onClick={addScholarship}>
                              <CirclePlus className="md:h-15 md:w-15 cursor-pointer" />
                          </button>
                      </div>
                      {/* Display added scholarships */}
                      <div className="flex flex-wrap mt-4 gap-3">
                          {scholarshipList.map((item) => (
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
                            className="border md:w-110 sm:w-100 w-70 h-15 rounded-3xl text-2xl pl-5"
                            value={affiliationInput}
                            onChange={handleAffiliationChange}
                        />
                        <button onClick={addAffiliation}>
                            <CirclePlus className="md:h-15 md:w-15 cursor-pointer" />
                        </button>
                    </div>

                    {/* Display added affiliations */}
                    <div className="flex flex-wrap mt-4 gap-3">
                        {affiliationList.map((item) => (
                            <span
                                key={item}
                                className="px-4 py-2 bg-primary text-white rounded-full text-sm font-medium cursor-pointer"
                                onClick={() => removeAffiliation(item)}
                            >
                                {item} ✖
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
                            onClick={()=>setCurrentSection(3)}
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
