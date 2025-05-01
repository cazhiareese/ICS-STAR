import { useState } from "react";
import { useOnboardingContext } from "../AuthContext/onboardingcontext";
import axios from "axios";
import Unauthorized from "../Unauthorized";
import CircularLoading from "../../components/LoadingComponents/circularloading";

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
      const payload =
          userType === "student"
            ? {
                standing: userData.standing ?? "",
                scholarships: userData.scholarshipList ?? [],
                affiliations: userData.affiliationList ?? [],
                roles: userData.roleList ?? [],
                skills: userData.skillsInterests ?? [],
              }
            : {
                scholarships: userData.scholarshipList ?? [],
                affiliations: userData.affiliationList ?? [],
                roles: userData.roleList ?? [],
                skills: userData.skillsInterests ?? [],
                industry: userData.employmentType === "employed" ? userData.industrySector ?? "" : "",
                company_name: userData.employmentType === "employed" ? userData.companyName ?? "" : "",
                job_title: userData.employmentType === "employed" ? userData.jobTitle ?? "" : "",
                country: userData.employmentType === "employed" ? userData.workCountry ?? "" : "",
                city: userData.employmentType === "employed" ? userData.workCity ?? "" : "",
                work_mode: userData.employmentType === "employed" ? (userData.remote ? "remote" : "f2f") : "",
                employer_class: userData.employmentType === "employed" ? userData.employerclass ?? "" : "",
                tenured_status: userData.employmentType === "employed" ? userData.tenureStatus ?? "" : "",
                salary_grade: userData.employmentType === "employed" ? userData.salaryRange ?? "" : "",
                reasons: userData.employmentType === "unemployed" ? userData.reason ?? [] : [],
                employment_status: userData.employmentType ?? "",
              };


      console.log("Payload being sent:", payload);
      console.log(userType)
      await axios.post(endpoint, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Onboarding information submitted successfully.");
      setCurrentSection(5);
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
          onClick={submitStep4}
          >
            <label className="font-satoshi-bold cursor-pointer">Proceed</label>
          </div>
        )

        }
        
      </div>
    </div>
  );
}
