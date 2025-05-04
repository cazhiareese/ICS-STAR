import React, { useState, useEffect } from "react";
import { XCircle } from "lucide-react";

const suggestedSkills = [
  "Artificial Intelligence",
  "Cybersecurity",
  "Web Development",
  "Game Development",
  "Machine Learning",
  "UI/UX Designing",
  "Mobile Development",
  "Frontend Developing",
  "Cloud Computing",
];

const AddSkillsModal = ({ isOpen, onClose, onSave, existingSkills }) => {
  const [skillInput, setSkillInput] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [warning, setWarning] = useState("");


  useEffect(() => {
    if (!isOpen) {
      setSkillInput("");
      setSelectedSkills([]);
    }
  }, [isOpen]);

  const toggleSkill = (skill) => {
    const normalizedSkill = skill.toLowerCase();
    const exists = selectedSkills.some(
      (s) => s.toLowerCase() === normalizedSkill
    );
  
    if (!exists) {
      setSelectedSkills([...selectedSkills, skill]);
      setWarning("");
    } else {
      setWarning("Skill already added.");
    }
  };
  

  const handleInputChange = (e) => {
    setSkillInput(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && skillInput.trim() !== "") {
      const trimmedSkill = skillInput.trim();
      const normalizedInput = trimmedSkill.toLowerCase();
  
      const existsInSelected = selectedSkills.some(
        (s) => s.toLowerCase() === normalizedInput
      );
  
      const existsInExisting = existingSkills.some(
        (s) => s.toLowerCase() === normalizedInput
      );
  
      if (!existsInSelected && !existsInExisting) {
        setSelectedSkills([...selectedSkills, trimmedSkill]);
        setSkillInput("");
        setWarning("");
      } else {
        setWarning("Skill already added.");
        setSkillInput(""); // clear the input as requested
      }
    }
  };
  
  
  

  const handleSave = () => {
    onSave(selectedSkills);
    setSelectedSkills([]);
    setSkillInput("");
    setWarning("");
    onClose();
  };

  if (!isOpen) return null;
  console.log("Existing Skills:", existingSkills);

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 px-4 sm:px-0">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-gray-500 opacity-40 pointer-events-none"></div>

      {/* Modal Container */}
      <div
        className="bg-white border border-disabled p-6 relative z-10 flex flex-col 
        w-full max-w-[650px] rounded-2xl shadow-lg 
        sm:w-11/12 max-h-screen"
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="text-lg font-satoshi-bold  text-black sm:text-[24px] ">
            Add Skills and Interests
          </h2>
          <XCircle
            size={24}
            className="cursor-pointer text-white bg-error rounded-full hover:bg-red-800"
            onClick={() => {
              setWarning("");
              onClose();
            }}
            
          />
        </div>

        {/* Content Wrapper (Flex Height) */}
        <div className="flex flex-col gap-4 flex-grow overflow-y-auto">
          {/* Skill Input Section */}
          <div className="flex flex-col gap-2 mt-4">
            <h3 className="text-black font-satoshi-medium ">
              Skills and Interests
            </h3>
            <input
              type="text"
              value={skillInput}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="w-full border-2 border-disabled px-4 py-3 rounded-2xl text-lg sm:text-sm"
              placeholder="Enter skills..."
              style={{ height: "50px" }}
            />
{warning && (
  <p className="text-sm text-error font-satoshi-medium">{warning}</p>
)}

            {/* Selected Skills */}
            <div className="flex flex-wrap gap-2">
              {selectedSkills.map((skill, index) => (
                <span
                  key={index}
                  className="px-4 py-2 border-2 border-primary text-primary font-satoshi-medium rounded-full text-sm sm:text-xs"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Suggested Skills */}
          <div className="flex flex-col gap-2">
            <h3 className="text-black font-satoshi-medium">Suggestions</h3>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-3">
              {suggestedSkills
                .filter((skill) => !existingSkills.includes(skill))
                .map((skill, index) => (
                  <button
                    key={index}
                    className={`px-3 py-2 border rounded-full font-medium flex items-center justify-center 
                  transition ${
                    selectedSkills.includes(skill)
                      ? "bg-primary text-white hover:bg-hover"
                      : "border-primary text-primary hover:bg-hover hover:text-white transition"
                  }sm:text-xs px-3 py-2 sm:px-2 sm:py-1`}
                    onClick={() => toggleSkill(skill)}
                  >
                    {skill}
                  </button>
                ))}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-4 flex justify-end">
          <button
            className="px-5 py-3 bg-primary text-white rounded-full text-sm font-medium hover:bg-hover transition"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSkillsModal;
