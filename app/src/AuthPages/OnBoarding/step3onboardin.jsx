import { useState, useEffect } from "react";
import "../../index.css";
import peersIcon from "../../assets/onBoardingAssets/peersIcon.png"
import { CirclePlus, ImageOff, ChevronLeft } from 'lucide-react';
import Employed from "../../assets/onBoardingAssets/Employed.png"
import Unemployed from "../../assets/onBoardingAssets/Unemployed.png"
import SelfEmployed from "../../assets/onBoardingAssets/SelfEmployed.png"
import Cloud from "../../assets/onBoardingAssets/Cloud.png"
import Location from "../../assets/onBoardingAssets/location.png"
import { MapPin } from "lucide-react";
import { useOnboardingContext } from "../AuthContext/onboardingcontext";
import ErrorBox from "../errorbox";
import Unauthorized from "../Unauthorized";
import countryList from 'react-select-country-list';
import CustomDropdown from "./dropdown";
import { CustomDropdownNoSearch } from "./dropdown";
import Loading from "../../components/LoadingComponents/circularloading"

function Step3Onboarding() {

  const baseURL = import.meta.env.VITE_BACKEND_URL;

    const[employed, setEmployed] = useState(true);
    const [typeEmployed, setTypeEmployed] = useState("No")
    const[selfEmployed, setSelfemployed] = useState(false);
    const[unemployed, setUnemployed] = useState(false);
    const [step, setStep]= useState(1);
    const[unemployedWorkExperience, setUnemployedWorkExperience]= useState(false)
    const [selectedOptions, setSelectedOptions] = useState([]);

  // Provider
    const {setCurrentSection, updateUserData, userData} = useOnboardingContext()
    
    const options = [
      { label: 'Undergoing professional training', value: 'training' },
      { label: 'Currently pursuing academic studies', value: 'academics' },
      { label: 'Still seeking work', value: 'seek' },
      { label: 'Other', value: 'other' },
      { label: 'Cannot start working at present (e.g. having illness, raising children)', value: 'cannot_start' },
    ];

    const countries = countryList().getData();
    
    const employer_class = [
      { label: 'NGO', value: 'NGO' },
      { label: 'Government', value: 'Government' },
      { label: 'Private Sector', value: 'Private Sector' },
      { label: 'Others', value: 'Others' },
    ]

    const tenure_status = [
      { label: 'Permanent', value: 'Permanent' },
      { label: 'Temporary', value: 'Temporary' },
      { label: 'Internship', value: 'Internship' },
    ]

    const sal_range = [
      { label: 'Less than ₱9,100', value: '1' },
      { label: '₱9,100 to ₱18,199', value: '2' },
      { label: '₱18,200 to ₱36,399', value: '3' },
      { label: '₱63,700 to ₱109,199', value: '4' },
      { label: '₱63,700 to ₱109,199', value: '5' },
      { label: '₱109,200 to ₱181,999', value: '6' },
      { label: 'At least ₱182,000 and up', value: '7' },
    ]

    const handleEmployedClick =()=>{
      setEmployed(true)
      setUnemployed(false)
      setSelfemployed(false)
      updateUserData("employmentType", "employed")
      setTypeEmployed("employed")
    }
    const handleUnemployedClick =()=>{
      setEmployed(false)
      setUnemployed(true)
      setSelfemployed(false)
      if (setUnemployedWorkExperience == true){
        setTypeEmployed("unemployed_no_exp")
        updateUserData("employmentType", "unemployed_no_exp")
      }
      else {
        setTypeEmployed("unemployed")
        updateUserData("employmentType", "unemployed")
      }
      
    }

    const [industryInput, setIndustryInput] = useState(userData.industrySector || "");
    const [industrySuggestions, setIndustrySuggestions] = useState([]);
    const [loadingIndustries, setLoadingIndustries] = useState(false);


  const handleIndustryChange = async (e) => {
    const query = e.target.value;
    setIndustryInput(query);
    updateUserData("industrySector", query);

    if (query.trim() === "") {
      setIndustrySuggestions([]);
      return;
    }

    setLoadingIndustries(true);

    try {
      const response = await fetch(`${baseURL}/admin/stats/industry/count`);
      const result = await response.json();

      if (response.ok && result.data) {
        const industries = result.data.map((item) => item.industry);
        // Filter industries matching the query (case-insensitive), limit 5
        const filtered = industries
          .filter((industry) => industry.toLowerCase().includes(query.toLowerCase()))
          .slice(0, 5);
        setIndustrySuggestions(filtered);
      } else {
        setIndustrySuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching industry suggestions:", error);
      setIndustrySuggestions([]);
    } finally {
      setLoadingIndustries(false);
    }
  };

    const customStyles = {
      control: (provided) => ({
        ...provided,
        padding: 2,
        minHeight: '36px',   // Smaller height of select box
      }),
      option: (provided, state) => ({
        ...provided,
        paddingTop: 4,       // Smaller padding
        paddingBottom: 4,
        fontSize: '14px',
      }),
      menu: (provided) => ({
        ...provided,
        zIndex: 9999, // prevent overlap issues
      }),
    };


    const handleSelfemployedClick =()=>{
      setEmployed(false)
      setUnemployed(false)
      setSelfemployed(true)
      setTypeEmployed("self_employed")
      updateUserData("employmentType", "self_employed")
    }

  const handleCheckboxChange = (value) => {
    if (selectedOptions.includes(value)) {
      setSelectedOptions(selectedOptions.filter((option) => option !== value));
    } else {
      setSelectedOptions([...selectedOptions, value]);
    }
  };
  
  const updateEmploymentEmployed = () => {

    if (userData.jobTitle == ""){
      setJobTitleError(true);
      // return;
    } else {
      setJobTitleError(false);
    }

    if (userData.industrySector == ""){
      setIndustryError(true);
      // return;
    } else {
      setIndustryError(false);
    }
    
    if (userData.workCountry == "" && userData.workCity == ""){
      setWorkLocationError(true);
      // return;
    } else {
      setWorkLocationError(false);
    }

    if (jobtitleerror || industryerror || worklocationerror){
      return;
    } else {
      setJobTitleError(false);
      setIndustryError(false);
      setWorkLocationError(false);
      setCurrentSection(4)
    }
    
  };

  
  const [reasonError, setReasonError] = useState(false);
  const [countryError, setCountryError] = useState(false);
  const [cityError, setCityError] = useState(false);
  const [worklocationerror, setWorkLocationError] = useState(false);
  const [jobtitleerror, setJobTitleError] = useState(false);
  const [industryerror, setIndustryError] = useState(false);



  const updateEmploymentUnemployed = () => {
    if (selectedOptions.length === 0) {
      setReasonError(true);
      return;
    }
    updateUserData("reason", selectedOptions)
    setCurrentSection(4)
  };

  const employedBaseCheck = () => {

    if (userData.baseCountry == ""){
      setCountryError(true);
    }

    if (userData.baseCity == ""){
      setCityError(true);
    }

    if (userData.baseCountry == "" || userData.baseCity == ""){
      return;
    } else {
      setCountryError(false);
      setCityError(false);
      setStep(3)
    }
  }




  useEffect(() => {
    if (userData.sameWorkBase){
      updateUserData("workCity", userData.baseCity)
      updateUserData("workCountry", userData.baseCountry)
    } else {
    }
  }, [userData.sameWorkBase])

    return (
    <>
      {step==1 ? (<div className="flex flex-col justify-center md:mx-30 mx-10">
        {/* Step 1 check employment type */}
        <img src={peersIcon} className="lg:h-12 lg:w-12 h-10 w-10 xl:mt-0 mb-5 "></img>
        <label className="font-satoshi-bold lg:text-4xl md:text-3xl sm:text-2xl text-xl"> Employment Status</label>
        <label className="font-satoshi-light lg:text-2xl md:text-xl sm:text-lg text-md"> Select the option that best describes your current situation.</label>

        <div className="flex flex-col flex-wrap items-center justify-center">
            <div className={`flex flex-row space-x-5 items-center mt-10 md:w-100 w-[100%] border h-25 pl-10 rounded-2xl border border-neutral-300 hover:bg-secondary ${userData.employmentType=="employed" ? "bg-secondary border-primary": "bg-neutral-100"}`}
            onClick={handleEmployedClick}>
              <img className="w-10 h-10" src={Employed}/>
              <label className="font-satoshi-black text-2xl text">Employed</label>
            </div>
            <div className={`flex flex-row space-x-5 items-center mt-5 md:w-100 w-[100%] border h-25 pl-10 rounded-2xl border border-neutral-300 hover:bg-secondary ${userData.employmentType=="self_employed" ? "bg-secondary border-primary": "bg-neutral-100"}`}
            
            onClick={handleSelfemployedClick}>
              <img className="w-10 h-10" src={SelfEmployed}/>
              <label className="font-satoshi-black text-2xl text">Self-Employed</label>
            </div>


            <div className="flex flex-row items-center justify-center flex-wrap w-[100%]">
              <div className={`flex flex-row items-center space-x-5 mt-5 md:w-100 w-[100%] border h-25  rounded-2xl px-10 border border border-neutral-300 hover:bg-secondary ${userData.employmentType=="unemployed" || userData.employmentType=="unemployed_no_exp" ? "bg-secondary border-primary": "bg-neutral-100"}`}
                    onClick={handleUnemployedClick}>
                <img className="w-10 h-10 " src={Unemployed}/>
                <label className="font-satoshi-black text-2xl text">Unemployed</label>
                
              </div>

              {/* {console.log(userData.employmentType)} */}
              {(userData.employmentType == "unemployed" || userData.employmentType == "unemployed_no_exp") && (
                <div className="relative flex flex-col items-center bg-secondary px-6 lg:py-6 py-3 rounded-2xl shadow-md mt-5 lg:w-[30%] w-[100%] lg:ml-10">
                  {/* Speech bubble arrow */}
                  <div className="hidden lg:block absolute top-0 -left-6 w-0 h-0 border-t-[20px] border-t-transparent border-r-[30px] border-r-secondary border-b-[20px] border-b-transparent"></div>
                  
                  {/* Question */}
                  <label className="font-satoshi-medium text-lg text-primary ">Do you have previous work experience?</label>

                  {/* Buttons */}
                  <div className="flex flex-row space-x-5 mt-4">

                    <button className={`bg-white border  text-primary px-6 py-2 rounded-lg text-lg font-satoshi-medium cursor-pointer ${unemployedWorkExperience ? "border-primary bg-secondary": "border-gray-300"}`}
                    
                            onClick={()=>{
                              updateUserData('employmentType', "unemployed");
                              setUnemployedWorkExperience(true)

                            }}>Yes</button>

                    <button className={`bg-white border text-primary px-6 py-2 rounded-lg text-lg font-satoshi-medium cursor-pointer ${unemployedWorkExperience ? "border-gray-300": "border-primary bg-secondary"}`}
                    
                            onClick={()=>{
                              updateUserData('employmentType', "unemployed_no_exp");
                              setUnemployedWorkExperience(false)
                            }}>No</button>
                  </div>
                </div>
              )}
            </div>
        </div>
        <div className="flex flex-row items-center justify-between mt-10 w-full sticky bottom-0 mb-10">
                        <button
                            type="button"
                            className="flex flex-row items-center justify-center hover:text-hover cursor-pointer group"
                            onClick={() => setCurrentSection(2)}
                        >
                            <ChevronLeft className="text-primary group-hover:text-hover"/>
                            <span className="font-satoshi-bold text-primary flex items-center w-20 p-2 text-md group-hover:text-hover">
                                Previous
                            </span>
                        </ button>

                        <button
                            type="button"
                            className="font-satoshi-bold text-white text-sm bg-primary flex items-center justify-center w-20 md:w-40 pl-15 pr-15 pt-3 pb-3 rounded-2xl md:order-2 hover:bg-hover cursor-pointer"
                            onClick={() => setStep(2)}
                        >
                            Proceed
                        </button>
                    </div>
        
      </div>
      
    
    ) : (
          userData.employmentType == "unemployed" || userData.employmentType == "unemployed_no_exp" ? 
        // Unemployed Part

        (<div className="flex flex-col justify-center pt-10 md:mx-30 mx-10">
          <label className="font-satoshi-bold lg:text-4xl md:text-3xl sm:text-2xl text-xl"> Employment Status</label>
          <label className="font-satoshi-light lg:text-2xl md:text-2xl sm:text-xl text-md pt-4 pb-6"> Can you tell us why you’re currently not employed? Select all that apply.</label>

          <div className="grid md:grid-cols-2 gap-3 md:pt-7 ">
            {options.map((option) => (
              <label
                key={option.value}
                className="flex items-center border font-satoshi-regular md:text-xl border-gray-300 md:p-6 p-3 rounded rounded-2xl bg-neutral-100"
              >
                <input
                  type="checkbox"
                  value={option.value}
                  className="mr-5 w-5 h-5"
                  checked={selectedOptions.includes(option.value)}
                  onChange={() => handleCheckboxChange(option.value)}
                />
                {option.label}
              </label>
              
            ))}
            
          </div>


          <div className={`pt-10 ${reasonError ? "block" : "hidden"}`}>
            <ErrorBox message="Please select atleast one input"/>
          </div>
          
          <div className="flex flex-row items-center justify-between mt-10 w-full sticky bottom-0 mb-10">
                        <button
                            type="button"
                            className="flex flex-row items-center justify-center hover:text-hover cursor-pointer group"
                            onClick={() => setStep(1)}
                        >
                            <ChevronLeft className="text-primary group-hover:text-hover"/>
                            <span className="font-satoshi-bold text-primary flex items-center w-20 p-2 text-md group-hover:text-hover">
                                Previous
                            </span>
                        </ button>

                        <button
                            type="button"
                            className="font-satoshi-bold text-white text-sm bg-primary flex items-center justify-center w-20 md:w-40 pl-15 pr-15 pt-3 pb-3 rounded-2xl md:order-2 hover:bg-hover cursor-pointer"
                            onClick={() => (updateEmploymentUnemployed())}
                        >
                            Proceed
                        </button>
                    </div>

            
            
          </div>) : 
          
      // Employed Part


      (step!=3 ?  (<> <div className="flex flex-col items-center p-15">
          {/* Icon and Title */}
          <div className="flex flex-col space-x-2 mb-4 mr-auto">
            <img src={Location} className="md:w-12 md:h-12 h-8 w-8" alt="" />
            <h2 className="md:text-4xl text-xl font-semibold pb-10 pt-5">Where are you currently based?</h2>
          </div>
    
          {/* Input Fields */}
          <div className="flex flex-col w-full max-w-2xl space-y-6">
          <div>
            <label className="text-gray-700 font-satoshi-medium text-lg">Country</label>
            <CustomDropdown
              options={countries}
              value={userData.baseCountry}
              onChange={(value) => updateUserData('baseCountry', value)}
              placeholder="Select your country"
            />
            <div className={` mt-3 ${countryError ? "block" : "hidden"}`}>
              <ErrorBox message="Please enter your country"/>
            </div>
          </div>
          

            <div>
              <label className="text-gray-700 font-satoshi-medium text-lg">City/State</label>
              <input
                type="text"
                name="cityState"
                value={userData.baseCity}
                onChange={(e) => updateUserData("baseCity", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg bg-neutral-100 focus:outline-primary mt-1"
                placeholder="Enter your city/state"
              />
            </div>

            <div className={` -mt-4 ${cityError ? "block" : "hidden"}`}>
              <ErrorBox message="Please enter your city"/>
            </div>
          </div>

          <div className="flex flex-row items-center justify-between mt-10 w-full sticky bottom-0 mb-10">
                        <button
                            type="button"
                            className="flex flex-row items-center justify-center hover:text-hover cursor-pointer group"
                            onClick={() => setStep(1)}
                        >
                            <ChevronLeft className="text-primary group-hover:text-hover"/>
                            <span className="font-satoshi-bold text-primary flex items-center w-20 p-2 text-md group-hover:text-hover">
                                Previous
                            </span>
                        </ button>

                        <button
                            type="button"
                            className="font-satoshi-bold text-white text-sm bg-primary flex items-center justify-center w-20 md:w-40 pl-15 pr-15 pt-3 pb-3 rounded-2xl md:order-2 hover:bg-hover cursor-pointer"
                            onClick={employedBaseCheck}
                        >
                            Proceed
                        </button>
                    </div>

        </div>
      </>) : 
      
      // For third employed Step 
      (<>
      
        <div className="flex flex-col p-6 w-full md:px-20 px-10 sm:h-auto h-160">
        {/* Header */}
        <h2 className="md:text-4xl text-2xl font-semibold mr-auto">Current Work Details</h2>
        <p className="text-gray-500 mb-4 md:text-md text-sm">We'd love to know what path you have taken.</p>

        {/* Grid Layout */}
        <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
          {/* Job Title */}
          <div>
            <label className="text-gray-700 font-satoshi-medium md:text-md text-sm">Job Title</label>
            
            <input
              type="text"
              name="jobTitle"
              value={userData.jobTitle}
              onChange={(e)=>updateUserData( "jobTitle", e.target.value)}
              className="w-full md:p-3 p-2 border border-neutral-300 bg-neutral-100 rounded-lg focus:outline-primary mt-1"
            />
            <div className={`${jobtitleerror ? "block" : "hidden"}`}>
              <ErrorBox/>
            </div>
          </div>
          

          {/* Industry Sector */}
          <div className="relative">
            <label className="text-gray-700 font-satoshi-medium md:text-md text-sm">Industry Sector</label>
            <input
              type="text"
              name="industrySector"
              value={industryInput}
              onChange={handleIndustryChange}
              className="w-full md:p-3 p-2 border border-neutral-300 bg-neutral-100 rounded-lg focus:outline-primary mt-1"
            />
            {industryerror && <ErrorBox />}

            {(industrySuggestions.length > 0 || loadingIndustries) && (
              <div className="absolute left-0 top-full bg-white border border-gray-300 rounded-md shadow-md w-full max-h-40 overflow-y-auto z-20 mt-1">
                {loadingIndustries ? (
                  <div className="px-4 py-2 text-gray-500 flex justify-center items-center">
                    <Loading size={20} /> <span className="ml-2 text-sm">Loading...</span>
                  </div>
                ) : (
                  industrySuggestions.map((industry, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-lg"
                      onClick={() => {
                        setIndustryInput(industry);
                        updateUserData("industrySector", industry);
                        setIndustrySuggestions([]);
                      }}
                    >
                      {industry}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Company Name */}
          <div>
            <label className="text-gray-700 font-satoshi-medium md:text-md text-sm">Company Name (optional)</label>
            <input
              type="text"
              name="companyName"
              value={userData.companyName}
              onChange={(e)=>updateUserData( "companyName", e.target.value)}
              className="w-full md:p-3 p-2 border border-neutral-300 bg-neutral-100 rounded-lg focus:outline-primary mt-1"
            />
            
            

          </div>
          <div className="flex items-center">
              <input
                type="checkbox"
                name="remote"
                value={userData.remote}
                onChange={()=>updateUserData( "remote", !userData.remote)}
                className="mr-2 md:mt-5 w-6 h-6 border-1 rounded-lg border-neutral-300 bg-neutral-100 accent-primary rounded focus:outline-primary"
              />
              <label className="text-gray-600 md:mt-5 md:text-md text-sm">I work remotely</label>
          </div>
  
          <div className="grid md:grid-cols-2 grid-cols-2 gap-4">

          
            {/* Employment Type */}
            <div className="md:pt-10">
              <label className="text-gray-700 font-satoshi-medium md:text-md text-sm">Employer Classification</label>
              {/* <select
                name="employmentType"
                value={userData.employerclass}
                onChange={(e)=>updateUserData("employerclass", e.target.value)}
                className="w-full md:p-3 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mt-1"
              >
                <option>NGO</option>
                <option>Government</option>
                <option>Private Sector</option>
                <option>Others</option>
              </select> */}

              {/* <CustomDropdown
              options={employer_class}
              value={userData.employerclass}
              onChange={(value) => updateUserData('employerclass', value)}
              /> */}

              <CustomDropdownNoSearch
              options={employer_class}
              value={userData.employerclass}
              onChange={(value) => updateUserData('employerclass', value)}
              placeholder="Select your employer class"
              />

            </div>

            {/* Tenure Status */}
            <div className="md:pt-10">
              <label className="text-gray-700 font-satoshi-medium md:text-md text-sm">Tenure Status</label>
              {/* <select
                name="tenureStatus"
                value={userData.tenureStatus}
                onChange={(e)=>updateUserData( "tenureStatus", e.target.value)}
                className="w-full md:p-3 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mt-1"
              >
                <option>Permanent</option>
                <option>Temporary</option>
                <option>Internship</option>
              </select> */}

              <CustomDropdownNoSearch
              options={tenure_status}
              value={userData.tenureStatus}
              onChange={(value) => updateUserData('tenureStatus', value)}
              placeholder="Select your tenure status"
              />
            
            </div>

          </div>

          {/* Work Location */}
          <div className="md:pt-10">
            <label className="text-gray-700 font-satoshi-medium md:text-md text-sm">Work Location</label>
            <div className="flex gap-3">
              <input
                type="text"
                name="country"
                value={userData.workCountry}
                onChange={(e)=>updateUserData("workCountry", e.target.value)}
                placeholder="Country"
                className={`w-1/2 md:p-3 p-2 border bg-neutral-100 border-gray-300 rounded-lg focus:outline-primary mt-1 ${userData.sameWorkBase ? "bg-neutral-300 text-gray-500" : ""}`}
                disabled = {userData.sameWorkBase}
              />
              <input
                type="text"
                name="city"
                value={userData.workCity}
                onChange={(e)=>updateUserData("workCity", e.target.value)}
                placeholder="City"
                className={`w-1/2 md:p-3 p-2 border bg-neutral-100 border-gray-300 rounded-lg focus:outline-primary mt-1 ${userData.sameWorkBase ? "bg-neutral-300 text-gray-500" : ""}`}
                disabled={userData.sameWorkBase}
              />
            </div>
            <div className={`${worklocationerror ? "block" : "hidden"}`}>
              <ErrorBox/>
            </div>
            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                name="sameAsBase"
                checked={userData.sameWorkBase}
                onChange={()=>updateUserData("sameWorkBase", !userData.sameWorkBase)}
                className="mr-2"
              />
              <label className="text-gray-600 md:text-md text-sm">Same as base</label>
            </div>
          </div>

          {/* Salary Range */}
          <div className="">
            {/* <label className="text-gray-700 font-satoshi-medium">Salary Range (optional)</label> */}
            <div>
                <label className="text-gray-700 font-satoshi-medium md:text-md text-sm">Salary Range</label>
                {/* <select
                  name="tenureStatus"
                  value={userData.salaryRange}
                  onChange={(e)=>updateUserData( "salaryRange", e.target.value)}
                  className="w-full md:p-3 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mt-1"
                >
                  <option value ="1">Less than ₱9,100</option>
                  <option value ="2">₱9,100 to ₱18,199</option>
                  <option value ="3">₱18,200 to ₱36,399</option>
                  <option value="4">₱63,700 to ₱109,199</option>
                  <option value = "5">₱63,700 to ₱109,199</option>
                  <option value="6">₱109,200 to ₱181,999</option>
                  <option value="7">At least ₱182,000 and up</option>
                </select> */}

                <CustomDropdownNoSearch
                options={sal_range}
                value={userData.salaryRange}
                onChange={(value) => updateUserData('salaryRange', value)}
                placeholder="Select your salary range"
                />
              </div>
          </div>
        </div>

        <div className="flex flex-row items-center justify-between mt-10 w-full md:sticky bottom-0 mb-10">
                        <button
                            type="button"
                            className="flex flex-row items-center justify-center hover:text-hover cursor-pointer group"
                            onClick={() => setStep(2)}
                        >
                            <ChevronLeft className="text-primary group-hover:text-hover"/>
                            <span className="font-satoshi-bold text-primary flex items-center w-20 p-2 text-md group-hover:text-hover">
                                Previous
                            </span>
                        </ button>

                        <button
                            type="button"
                            className="font-satoshi-bold text-white text-sm bg-primary flex items-center justify-center w-20 md:w-40 pl-15 pr-15 pt-3 pb-3 rounded-2xl md:order-2 hover:bg-hover cursor-pointer"
                            onClick={()=>{updateEmploymentEmployed()}}
                        >
                            Proceed
                        </button>
                    </div>
      </div>
      
      </>))
        
      )
      }



    </>
    
  );
}

export default Step3Onboarding;


