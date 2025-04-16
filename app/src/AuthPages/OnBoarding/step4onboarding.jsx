import { useState } from "react";
import { useOnboardingContext } from "../AuthContext/onboardingcontext";
import axios from "axios";

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

  // const [selectedSkills, setSelectedSkills] = useState([]);
  const [inputValue, setInputValue] = useState([]);
  const [customSkills, setCustomSkills] = useState([]); // Store only manually added skills

  const {setCurrentSection, userData, updateUserData, userType} = useOnboardingContext();

  // Toggle suggestion skills (only highlight, don't create a bubble)
  const toggleSuggestion = (skill) => {
    if (userData.skillsInterests.includes(skill)) {
      updateUserData("skillsInterests", userData.skillsInterests.filter((s) => s !== skill));
      // console.log("SDFDSF")
    } else {
      updateUserData("skillsInterests", [...userData.skillsInterests, skill])
    }
  };

  // Add a custom skill when pressing Enter
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      const newSkill = inputValue.trim();

      if (!customSkills.includes(newSkill)) {
        // setCustomSkills([...customSkills, newSkill]); // Add to custom skills list
        updateUserData("skillsInterests", [...userData.skillsInterests, newSkill])
      }
      
      setInputValue(""); // Clear input
    }
  };

  // Remove a custom skill when clicked
  const removeCustomSkill = (skill) => {
    // console.log("SDFDSFFD")
    // setCustomSkills(customSkills.filter((s) => s !== skill));
    updateUserData("skillsInterests",userData.skillsInterests.filter((s) => s !== skill));
  };
  const submitStep4 = () => {
    submitOnboardingInfo();
    // setCurrentSection(5)
};
  const baseURL = "https://ics-star-api.vercel.app";
  const token = localStorage.getItem("token"); // or however you're storing it
    const submitOnboardingInfo = async () => {
        try {
            
            const endpoint = userType === "student"
              ? `${baseURL}/onboarding-info-student`
              : `${baseURL}/onboarding-info-alum`;
            const payload = userType === "student" 
              ? {
              standing: userData.standing,
              ...(userData.scholarshipList.length > 0 && { scholarships: userData.scholarshipList }),
              ...(userData.affiliationList.length > 0 && { affiliations: userData.affiliationList }),
              ...(userData.roleList.length > 0 && { roles: userData.roleList }),
              ...(userData.skillsInterests.length > 0 && { skills: userData.skillsInterests }),
              }
              : {
              ...(userData.scholarshipList.length > 0 && { scholarships: userData.scholarshipList }),
              ...(userData.affiliationList.length > 0 && { affiliations: userData.affiliationList }),
              ...(userData.roleList.length > 0 && { roles: userData.roleList }),
              ...(userData.skillsInterests.length > 0 && { skills: userData.skillsInterests }),
              ...(userData.employmentType === "employed" && { 
              industry: userData.industrySector,
              ...(userData.companyName && { company_name: userData.companyName }),
              job_title: userData.jobTitle,
              country: userData.workCountry,
              city: userData.workCity,
              work_mode: userData.workType,
              employer_class: userData.workType,          // Employer_class
              tenured_status: userData.tenureStatus,
              salary_grade: userData.salaryRange,
              }),
              ...(userData.employmentType === "unemployed" && { reasons: userData.reason }),
              employment_status: userData.employmentType,
              };
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
    <div className="flex flex-col items-center p-6 px-15 w-[50%] m-auto">
      <h2 className="text-4xl font-semibold mb-3">Skills and Interests</h2>

      {/* Search Bar - Add new skill when pressing Enter */}
      <input
        type="text"
        placeholder="Ex. Machine Learning, Artificial Intelligence"
        className="w-[100%] p-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary mt-5"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      

      <h3 className="text-xl font-satoshi-bold mb-6 mt-4 mr-auto ">Suggestions</h3>
      <div className="flex flex-wrap gap-3 w-[80%] mr-auto">
        {userData.suggestions.map((skill) => (
          <button
            key={skill}
            className={`px-4 py-2 border-2 rounded-full text-lg font-medium transition-all ${
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

      {/* Show only manually added skills as bubbles */}
      {customSkills.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-3">
          {customSkills.map((skill) => (
            <button
              key={skill}
              className="px-4 py-2 bg-primary text-white rounded-full text-lg font-medium"
              onClick={() => removeCustomSkill(skill)}
            >
              {skill} ✖
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-row items-center justify-center my-10 space-x-20 w-full">
        <div className="w-70 h-20 text-primary flex items-center justify-center rounded-3xl text-2xl"
          onClick={() => setCurrentSection(3)}>
          <label className="font-satoshi-italic"> &lt; Previous </label>
        </div> 

        <div className="w-[70%]"></div> 

        <div className="w-70 h-17 bg-primary text-white flex items-center justify-center rounded-3xl text-2xl cursor-pointer"
          onClick={submitStep4}
          >
          <label className="font-satoshi-bold cursor-pointer">Proceed</label>
        </div>
      </div>
    </div>
  );
}
