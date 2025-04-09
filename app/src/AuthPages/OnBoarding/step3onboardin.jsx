import { useState, useEffect } from "react";
import "../../index.css";
import peersIcon from "../../assets/onBoardingAssets/peersIcon.png"
import { CirclePlus } from 'lucide-react';
import Employed from "../../assets/onBoardingAssets/Employed.png"
import Unemployed from "../../assets/onBoardingAssets/Unemployed.png"
import SelfEmployed from "../../assets/onBoardingAssets/SelfEmployed.png"
import Cloud from "../../assets/onBoardingAssets/Cloud.png"
import { MapPin } from "lucide-react";
import { useOnboardingContext } from "../AuthContext/onboardingcontext";

function Step3Onboarding() {
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

  const suggestions = [
    "Artificial Intelligence",
    "Cybersecurity",
    "Web Development",
    "Game Development",
    "Machine Learning",
    "UI/UX Designing",
    "Mobile Development",
    "Frontend Developing",
  ];


  const [workDetails, setWorkDetails] = useState({
    jobTitle: "",
    companyName: "",
    industrySector: "",
    workType: "NGO",
    employmentType: "Part-Time",
    tenureStatus: "Permanent",
    workLocation: { country: "", city: "" },
    sameAsBase: false,
    salaryRange: [9100, 182000],
    remote: false,
  });

  

  const [selectedSkills, setSelectedSkills] = useState([]);

  const toggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const updateEmployment = async () => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      console.error("No token found. Please log in.");
      return;
    }
  
    const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
  
    // Create FormData instance
    const formData = new FormData();
    formData.append("industry", "Technology");
    formData.append("employment_status", userData.typeEmployed || "employed");
    formData.append("company_name", userData.companyName ||"OpenAI");
    formData.append("job_title", userData.jobTitle || "Software Engineer");
    formData.append("country", userData.workCountry || "USA");
    formData.append("city", userData.workCity || "San Francisco");
    formData.append("work_mode", userData.workType || "remote");
    formData.append("employer_class", userData.employmentType || "private");
    formData.append("tenured_status", userData.tenureStatus || "permanent");
    formData.append("salary_grade", userData.salaryRange || "1");
  
    // Append reasons (array of strings)
    if (selectedOptions && Array.isArray(selectedOptions)) {
      selectedOptions.forEach(reason => {
        formData.append("reasons", reason); // Backend must accept multiple "reasons"
      });
    }
  
    try {
      const response = await fetch(`https://ics-star-api.vercel.app/update-employment`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          // Do NOT set "Content-Type", browser will set it to multipart/form-data with boundary
        },
        body: formData,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error updating employment:", errorData);
        return;
      }
  
      const result = await response.json();
      console.log("Employment updated:", result.message);
      setCurrentSection(4)
  
    } catch (err) {
      console.error("Failed to update employment:", err);
    }
  };

  useEffect(() => {
    if (userData.sameWorkBase){
      updateUserData("workCity", userData.baseCity)
      updateUserData("workCountry", userData.baseCountry)
    } else {
      updateUserData("workCity", "")
      updateUserData("workCountry", "")
    }
  }, [userData.sameWorkBase])

  

    return (
    <>
      {step==1 ? (<div className="flex flex-col justify-center md:mx-30 mx-10">
        {/* Step 1 check employment type */}
        <img src={peersIcon} className="lg:h-20 lg:w-20 h-10 w-10 xl:mt-0 mb-5 "></img>
        <label className="font-satoshi-black lg:text-5xl md:text-4xl sm:text-3xl text-2xl"> Employment Status</label>
        <label className="font-satoshi-light lg:text-3xl md:text-2xl sm:text-xl text-lg"> Select the option that best describes your current situation.</label>

        <div className="flex flex-col flex-wrap lg:pt-15 items-center justify-center">
            <div className={`flex flex-row space-x-5 items-center mt-10 md:w-100 w-[100%] border h-25 pl-10 rounded-2xl ${userData.employmentType=="employed" ? "bg-secondary": "bg-white"}`}
            onClick={handleEmployedClick}>
              <img className="w-10 h-10" src={Employed}/>
              <label className="font-satoshi-black text-2xl text">Employed</label>
            </div>
            <div className={`flex flex-row space-x-5 items-center mt-5 md:w-100 w-[100%] border h-25 pl-10 rounded-2xl ${userData.employmentType=="self_employed" ? "bg-secondary": "bg-white"}`}
            
            onClick={handleSelfemployedClick}>
              <img className="w-10 h-10" src={SelfEmployed}/>
              <label className="font-satoshi-black text-2xl text">Self-Employed</label>
            </div>


            <div className="flex flex-row items-center justify-center flex-wrap w-[100%]">
              <div className={`flex flex-row items-center space-x-5 mt-5 md:w-100 w-[100%] border h-25  rounded-2xl px-10  ${userData.employmentType=="unemployed" || userData.employmentType=="unemployed_no_exp" ? "bg-secondary": "bg-white"}`}
                    onClick={handleUnemployedClick}>
                <img className="w-10 h-10 " src={Unemployed}/>
                <label className="font-satoshi-black text-2xl text">Unemployed</label>
                
              </div>

              {/* {console.log(userData.employmentType)} */}
              {userData.employmentType == "unemployed" | userData.employmentType == "unemployed_no_exp" && (
                <div className="relative flex flex-col items-center bg-secondary px-6 lg:py-6 py-3 rounded-2xl shadow-md mt-5 lg:w-[30%] w-[100%] lg:ml-10">
                  {/* Speech bubble arrow */}
                  <div className="hidden lg:block absolute top-0 -left-6 w-0 h-0 border-t-[20px] border-t-transparent border-r-[30px] border-r-secondary border-b-[20px] border-b-transparent"></div>
                  
                  {/* Question */}
                  <label className="font-satoshi-medium text-lg text-primary ">Do you have previous work experience?</label>

                  {/* Buttons */}
                  <div className="flex flex-row space-x-5 mt-4">

                    <button className={`bg-white border  text-primary px-6 py-2 rounded-lg text-lg font-medium cursor-pointer ${unemployedWorkExperience ? "border-primary": "border-gray-300"}`}
                    
                            onClick={()=>setUnemployedWorkExperience(true)}>Yes</button>

                    <button className={`bg-white border text-primary px-6 py-2 rounded-lg text-lg font-medium cursor-pointer ${unemployedWorkExperience ? "border-gray-300 bg-red-500": "border-primary"}`}
                    
                            onClick={()=>{setUnemployedWorkExperience(false)}}>No</button>
                  </div>
                </div>
              )}
            </div>
        </div>

        <div className="flex flex-row items-center justify-center my-10 lg:space-x-20 w-full">
          
          <div className="w-70 h-20 text-primary flex items-center justify-center rounded-3xl text-2xl"
            onClick = {()=>setCurrentSection(2)}
          >
                  <label className="font-satoshi-italic "> &lt; Previous </label>
          </div> 

          <div className="w-[70%]">

          </div> 
          <div className="w-70 h-17 bg-primary text-white flex items-center justify-center rounded-3xl text-2xl cursor-pointer"
              onClick={()=>{setStep(2)}}
          >
                  <label className="font-satoshi-bold cursor-pointer">Proceed</label>
          </div>
          
        </div>
        
      </div>):

        
        (
          userData.employmentType == "unemployed" || userData.employmentType == "unemployed_no_exp" ? 
        // Unemployed Part

        (<div className="flex flex-col justify-center pt-10 md:mx-30 mx-10">
          <label className="font-satoshi-black lg:text-5xl md:text-3xl sm:text-2xl text-xl"> Employment Status</label>
          <label className="font-satoshi-light lg:text-3xl md:text-2xl sm:text-xl text-lg py-8"> Can you tell us why you’re currently not employed? Select all that apply.</label>

          <div className="grid md:grid-cols-2 gap-8 pt-10 ">
            {options.map((option) => (
              <label
                key={option.value}
                className="flex items-center border font-satoshi-regular text-xl border-gray-300 p-6 rounded rounded-2xl"
              >
                <input
                  type="checkbox"
                  value={option.value}
                  className="mr-2 l"
                  checked={selectedOptions.includes(option.value)}
                  onChange={() => handleCheckboxChange(option.value)}
                />
                {option.label}
              </label>
            ))}
          </div>

          <div className="flex flex-row items-center justify-center my-10 md:space-x-20 w-full">
        
              <div className="w-70 h-20 text-primary flex items-center justify-center rounded-3xl text-2xl"
                    onClick={()=>setStep(1)}
              >
                      <label className="font-satoshi-italic" > &lt; Previous </label>
              </div> 

              <div className="w-[70%]">

              </div> 
              <div className="w-70 h-17 bg-primary text-white flex items-center justify-center rounded-3xl text-2xl cursor-pointer"
                  onClick={()=>(updateEmployment())}
              >
                      <label className="font-satoshi-bold cursor-pointer">Proceed</label>
              </div>
        
          </div>

            
            
          </div>) : 
          
      // Employed Part


      (step!=3 ?  (<> <div className="flex flex-col items-center p-10">
        {/* Icon and Title */}
        <div className="flex items-center space-x-2 mb-4">
          <MapPin className="text-blue-500 w-6 h-6" />
          <h2 className="text-2xl font-semibold">Where are you currently based?</h2>
        </div>
  
        {/* Input Fields */}
        <div className="flex flex-col w-96 space-y-4">
          <div>
            <label className="text-gray-700 font-medium">Country</label>
            <input
              type="text"
              name="country"
              value={userData.baseCountry}
              onChange={(e) => updateUserData("baseCountry", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
              placeholder="Enter your country"
            />
          </div>
  
          <div>
            <label className="text-gray-700 font-medium">City/State</label>
            <input
              type="text"
              name="cityState"
              value={userData.baseCity}
              onChange={(e) => updateUserData("baseCity", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
              placeholder="Enter your city/state"
            />
          </div>
        </div>

        <div className="flex flex-row items-center justify-center my-10 space-x-20 w-full">
        
              <div className="w-70 h-20 text-primary flex items-center justify-center rounded-3xl text-2xl"
                    onClick={()=>setStep(1)}
              >
                      <label className="font-satoshi-italic"> &lt; Previous </label>
              </div> 

              <div className="w-[70%]">

              </div> 
              <div className="w-70 h-17 bg-primary text-white flex items-center justify-center rounded-3xl text-2xl cursor-pointer"
                  onClick={()=>setStep(3)}
              >
                      <label className="font-satoshi-bold cursor-pointer">Proceed</label>
              </div>
        
          </div>
        </div>
      </>) : 
      
      // For third employed Step
      (<>
      
        <div className="flex flex-col p-6 w-full max-w-3xl mx-auto">
      {/* Header */}
      <h2 className="text-2xl font-semibold">Current Work Details</h2>
      <p className="text-gray-500 mb-4">We'd love to know what path you have taken.</p>

      {/* Grid Layout */}
      <div className="grid grid-cols-2 gap-4">
        {/* Job Title */}
        <div>
          <label className="text-gray-700 font-medium">Job Title</label>
          
          <input
            type="text"
            name="jobTitle"
            value={userData.jobTitle}
            onChange={(e)=>updateUserData( "jobTitle", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mt-1"
          />
        </div>

        {/* Industry Sector */}
        <div>
          <label className="text-gray-700 font-medium">Industry Sector</label>
          <input
            type="text"
            name="industrySector"
            value={userData.industrySector}
            onChange={(e)=>updateUserData( "industrySector", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mt-1"
          />
        </div>

        {/* Company Name */}
        <div>
          <label className="text-gray-700 font-medium">Company Name (optional)</label>
          <input
            type="text"
            name="companyName"
            value={userData.companyName}
            onChange={(e)=>updateUserData( "companyName", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mt-1"
          />
          
          <div className="flex items-center mt-2">
            <input
              type="checkbox"
              name="remote"
              value={userData.remote}
              onChange={()=>updateUserData( "remote", !userData.remote)}
              className="mr-2"
            />
            <label className="text-gray-600">I work remotely</label>
          </div>

        </div>

        {/* Work Type */}
        <div>
          <label className="text-gray-700 font-medium">Work Type</label>
          <select
            name="workType"
            value={userData.workType}
            onChange={(e)=>updateUserData( "workType", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mt-1"
          >
            <option>NGO</option>
            <option>Corporate</option>
            <option>Startup</option>
            <option>Freelance</option>
          </select>
        </div>

        {/* Employment Type */}
        <div>
          <label className="text-gray-700 font-medium">Employment Type</label>
          <select
            name="employmentType"
            value={userData.employmentType}
            onChange={(e)=>updateUserData("employmentType", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mt-1"
          >
            <option>Full-Time</option>
            <option>Part-Time</option>
            <option>Contract</option>
          </select>
        </div>

        {/* Tenure Status */}
        <div>
          <label className="text-gray-700 font-medium">Tenure Status</label>
          <select
            name="tenureStatus"
            value={userData.tenureStatus}
            onChange={(e)=>updateUserData( "tenureStatus", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mt-1"
          >
            <option>Permanent</option>
            <option>Temporary</option>
            <option>Internship</option>
          </select>
        </div>

        {/* Work Location */}
        <div className="col-span-2">
          <label className="text-gray-700 font-medium">Work Location</label>
          <div className="flex gap-3">
            <input
              type="text"
              name="country"
              value={userData.workCountry}
              onChange={(e)=>updateUserData("workCountry", e.target.value)}
              placeholder="Country"
              className="w-1/2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mt-1"
            />
            <input
              type="text"
              name="city"
              value={userData.workCity}
              onChange={(e)=>updateUserData("workCity", e.target.value)}
              placeholder="City"
              className="w-1/2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mt-1"
            />
          </div>
          <div className="flex items-center mt-2">
            <input
              type="checkbox"
              name="sameAsBase"
              checked={userData.sameWorkBase}
              onChange={()=>updateUserData("sameWorkBase", !userData.sameWorkBase)}
              className="mr-2"
            />
            <label className="text-gray-600">Same as base</label>
          </div>
        </div>

        {/* Salary Range */}
        <div className="col-span-2">
          {/* <label className="text-gray-700 font-medium">Salary Range (optional)</label> */}
          <div>
              <label className="text-gray-700 font-medium">Tenure Status</label>
              <select
                name="tenureStatus"
                value={userData.salaryRange}
                onChange={(e)=>updateUserData( "salaryRange", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mt-1"
              >
                <option value ="1">Less than ₱9,100</option>
                <option value ="2">₱9,100 to ₱18,199</option>
                <option value ="3">₱18,200 to ₱36,399</option>
                <option value="4">₱63,700 to ₱109,199</option>
                <option value = "5">₱63,700 to ₱109,199</option>
                <option value="6">₱109,200 to ₱181,999</option>
                <option value="7">At least ₱182,000 and up</option>
              </select>
            </div>
        </div>
      </div>

      <div className="flex flex-row items-center justify-center my-10 space-x-20 w-full">
        
              <div className="w-70 h-20 text-primary flex items-center justify-center rounded-3xl text-2xl"
                    onClick={()=>setStep(2)}
              >
                      <label className="font-satoshi-italic " > &lt; Previous </label>
              </div> 

              <div className="w-[70%]">

              </div> 
              <div className="w-70 h-17 bg-primary text-white flex items-center justify-center rounded-3xl text-2xl cursor-pointer"
                  onClick = {()=>{updateEmployment()}}
              >
                      <label className="font-satoshi-bold cursor-pointer">Proceed</label>
              </div>
        
      </div>
    </div>
      
      </>))
        
      )
      }



    </>
    
  );
}

export default Step3Onboarding;


