import { useState } from "react";
import { useOnboardingContext } from "../AuthContext/onboardingcontext";

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

  const [selectedSkills, setSelectedSkills] = useState([]);
  const [inputValue, setInputValue] = useState([]);
  const [customSkills, setCustomSkills] = useState([]); // Store only manually added skills

  const {setCurrentSection} = useOnboardingContext();

  // Toggle suggestion skills (only highlight, don't create a bubble)
  const toggleSuggestion = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  // Add a custom skill when pressing Enter
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      const newSkill = inputValue.trim();

      if (!customSkills.includes(newSkill)) {
        setCustomSkills([...customSkills, newSkill]); // Add to custom skills list
      }
      
      setInputValue(""); // Clear input
    }
  };

  // Remove a custom skill when clicked
  const removeCustomSkill = (skill) => {
    setCustomSkills(customSkills.filter((s) => s !== skill));
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h2 className="text-2xl font-semibold mb-3">Skills and Interests</h2>

      {/* Search Bar - Add new skill when pressing Enter */}
      <input
        type="text"
        placeholder="Ex. Machine Learning, Artificial Intelligence"
        className="w-96 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary mb-4"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      <h3 className="text-2xl font-satoshi-black my-10">Suggestions</h3>
      <div className="flex flex-wrap gap-3 w-[50%] items-center justify-center">
        {suggestions.map((skill) => (
          <button
            key={skill}
            className={`px-4 py-2 border-2 rounded-full text-sm font-medium transition-all ${
              selectedSkills.includes(skill)
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
              className="px-4 py-2 bg-primary text-white rounded-full text-sm font-medium"
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
          onClick={() => setCurrentSection(5)}>
          <label className="font-satoshi-bold cursor-pointer">Proceed</label>
        </div>
      </div>
    </div>
  );
}
