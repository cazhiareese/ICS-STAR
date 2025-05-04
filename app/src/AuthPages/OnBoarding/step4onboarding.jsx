import { useState } from "react";
import { useOnboardingContext } from "../AuthContext/onboardingcontext";
import axios from "axios";
import Unauthorized from "../Unauthorized";
import CircularLoading from "../../components/LoadingComponents/circularloading";
import ModalTemplate from "../modaltemplate";



export default function Step4Onboarding() {
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

  const [inputValue, setInputValue] = useState([]);
  const [customSkills, setCustomSkills] = useState([]);
  const [errorMessage, setErrorMessage] = useState(""); // State for error message

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [loading, setLoading] = useState(false);

  const { setCurrentSection, userData, updateUserData, userType } = useOnboardingContext();

  const toggleSuggestion = (skill) => {
    if (userData.skillsInterests.includes(skill)) {
      updateUserData("skillsInterests", userData.skillsInterests.filter((s) => s !== skill));
    } else {
      updateUserData("skillsInterests", [...userData.skillsInterests, skill]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      const newSkill = inputValue.trim();

      if (!customSkills.includes(newSkill)) {
        setCustomSkills(prev => [...prev, newSkill]);   
        updateUserData("skillsInterests", [...userData.skillsInterests, newSkill]);
      }

      setInputValue("");
    }
  };

  const removeCustomSkill = (skill) => {
    updateUserData("skillsInterests", userData.skillsInterests.filter((s) => s !== skill));
  };

  const submitStep4 = () => {
    
    if (userData.skillsInterests.length === 0) {
      setErrorMessage("At least one skill or interest must be added.");
      return;
    } else {
      setLoading(true);
    }
    setErrorMessage(""); // Clear error message if validation passes
    submitOnboardingInfo();
  };

  const baseURL = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");

  const submitOnboardingInfo = async () => {
    try {
      const endpoint =
        userType === "student"
          ? `${baseURL}/onboarding-info-student`
          : `${baseURL}/onboarding-info-alum`;

          const employmentEnum= (employment) =>{
            if (employment === "employed") {
              return "employed";
            } else if (employment === "self-employed") {
              return "self_employed";
            } else if (employment === "unemployed") {
              return "unemployed";
            } else if (employment === "unemployed_no_exp") {
              return "unemployed_no_exp";
            } else {
              return "";
            }
          } 

          const reasonsEnum = (reasons) => {
            return reasons.map((reason) => {
              if (reason === "training") {
              return "Undergoing professional training";
              } else if (reason === "academics") {
              return "Currently pursuing academic studies";
              } else if (reason === "seek") {
              return "Still seeking work";
              } else if (reason === "cannot_start") {
              return "Cannot start working at present";
              } else if (reason === "other") {
              return "Other";
              } else {
              return "";
              }
            });
            };
            const alumPayload = {
            ...(userData.scholarshipList?.length > 0 && { scholarships: userData.scholarshipList }),
            ...(userData.affiliationList?.length > 0 && { affiliations: userData.affiliationList }),
            ...(userData.roleList?.length > 0 && { roles: userData.roleList }),
            ...(userData.employmentType === "employed" && userData.industry && { industry: userData.industrySector }),
            ...(userData.employmentType && { employment_status: employmentEnum(userData.employmentType) }),
            ...(userData.employmentType === "unemployed" && userData.reason?.length > 0 && { reasons: reasonsEnum(userData.reason) }),
            ...(userData.employmentType === "employed" && userData.companyName && { company_name: userData.companyName }),
            ...(userData.employmentType === "employed" && userData.jobTitle && { job_title: userData.jobTitle }),
            ...(userData.employmentType === "employed" && userData.workCountry && { country: userData.workCountry }),
            ...(userData.employmentType === "employed" && userData.workCity && { city: userData.workCity }),
            ...(userData.employmentType === "employed" && { work_mode: userData.remote ? "Remote" : "Onsite" }),
            ...(userData.employmentType === "employed" && userData.employerclass && { employer_class: userData.employerclass }),
            ...(userData.employmentType === "employed" && userData.tenureStatus && { tenured_status: userData.tenureStatus }),
            ...(userData.employmentType === "employed" && userData.salaryRange && { salary_grade: userData.salaryRange }),
            // skills:null
            ...(userData.skillsInterests?.length > 0 && { skills: userData.skillsInterests }),
            };

            const studentPayload = {
              ...(userData.standing && { standing: userData.standing }),
              ...(userData.scholarshipList?.length > 0 && { scholarships: userData.scholarshipList }),
              ...(userData.affiliationList?.length > 0 && { affiliations: userData.affiliationList }),
              ...(userData.roleList?.length > 0 && { roles: userData.roleList }),
              ...(userData.skillsInterests?.length > 0 && { skills: userData.skillsInterests }),
            };

          function objectToFormData(obj) {
            const formData = new FormData();
          
            Object.entries(obj).forEach(([key, value]) => {
              if (Array.isArray(value)) {
                // Append each array element individually
                value.forEach((item) => {
                  formData.append(`${key}`, item);
                });
              } else if (value !== undefined && value !== null) {
                formData.append(key, value);
              }
              // skip undefined/null values entirely
            });
          
            return formData;
          }
          
          const alumFormData = objectToFormData(alumPayload);
          const studentFormData = objectToFormData(studentPayload);

          
          const payload = userType === "student" ? studentFormData : alumFormData;


      console.log("Payload being sent:", payload);
      console.log(userType)
      try {
        const response = await axios.post(endpoint, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Accessing the response data
        console.log("Response data:", response.data);
      
        console.log("TOKEN UPDATED",response.data.updated_token)
      
        // Proceed with handling the response (e.g., navigate to next section)
        setCurrentSection(5);
        updateUserData("userUpdatedToken", response.data.updated_token)
      } catch (error) {
        console.error("Error submitting onboarding information:", error);
      }


      console.log("Onboarding information submitted successfully.");
      // setCurrentSection(5);
    } catch (error) {
      console.error("Error submitting onboarding information:", error);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 xl:px-15 px-10 xl:w-[90%] m-auto">
      <h2 className="text-4xl font-semibold mb-3 mr-auto">Skills and Interests</h2>

      <input
        type="text"
        placeholder="Ex. Machine Learning, Artificial Intelligence"
        className="w-[100%] p-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary mt-5"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      <h3 className="text-xl font-satoshi-bold mb-6 mt-4 mr-auto ">Suggestions</h3>
      <div className="flex flex-wrap gap-3 w-[100%] mr-auto pb-3">
        {userData.suggestions.map((skill) => (
          <button
            key={skill}
            className={`px-4 py-2 border-2 rounded-full xl:text-lg md:text-md sm:text-sm text-xs font-medium transition-all ${
              userData.skillsInterests.includes(skill)
                ? "bg-primary text-white border-primary"
                : "text-primary border-primary hover:bg-primary hover:text-white"
            }`}
            onClick={() => toggleSuggestion(skill)}
          >
            {skill}
          </button>
        ))}
      </div>

      {customSkills.length > 0 && (
        <div className="flex flex-wrap gap-3 md:w-[80%] w-[100%] mr-auto">
          {customSkills.map((skill) => (
            <button
              key={skill}
              className={`px-4 py-2 border-2 rounded-full xl:text-lg md:text-md sm:text-sm text-xs font-medium transition-all ${
                userData.skillsInterests.includes(skill)
                  ? "bg-primary text-white border-primary"
                  : "text-primary border-primary hover:bg-primary hover:text-white"
              }`}
              onClick={() => removeCustomSkill(skill)}
            >
              {skill} ✖
            </button>
          ))}
        </div>
      )}

      

      {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}

      <div className="flex flex-row items-center justify-center md:my-10 my-5 md:space-x-20 w-full">
        
        <div
          className="w-70 h-20 text-primary flex items-center justify-center rounded-3xl md:text-2xl text-xl "
          onClick={() => {
            if (userType === "student"){
              setCurrentSection(2)
            } else {
              setCurrentSection(3)
            }
          }}
        > 
          <label className="font-satoshi-italic"> &lt; Previous </label>
        </div>

        <div className="w-[70%]"></div>

        { loading ? (
          <CircularLoading />
        ) : (
          <div
          className="w-70 md:h-17 h-10 bg-primary text-white flex items-center justify-center rounded-3xl md:text-2xl text-xl  cursor-pointer"
          onClick={()=>setShowSuccessModal(true)}
          >
            
            <label className="font-satoshi-bold cursor-pointer">Proceed</label>
          </div>
        )

        }

        
      </div>

      {showSuccessModal && (
          <ModalTemplate
              onClose={() => setShowSuccessModal(false)}
              onContinue={() => {
                  setShowSuccessModal(false);
                  submitStep4();
              }}
              choiceclose="Close"
              choicecontinue="Proceed"
              header="Final"
              information="Please proceed if your entries are final. You may still change them in the profile section afterwards."
          />
      )}
    </div>
  );
}
