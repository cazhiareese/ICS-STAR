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

const AddSkillsModal = ({ isOpen, onClose, onSave }) => {
  const [skillInput, setSkillInput] = useState(""); // Track input text
  const [selectedSkills, setSelectedSkills] = useState([]); // Skills list

  useEffect(() => {
    if (!isOpen) {
      setSkillInput(""); // Reset input when modal closes
    }
  }, [isOpen]);

  const toggleSkill = (skill) => {
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill]); // Add skill
    }
  };

  const handleInputChange = (e) => {
    setSkillInput(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && skillInput.trim() !== "") {
      setSelectedSkills([...selectedSkills, skillInput.trim()]); // Add input
      setSkillInput(""); // Clear input field
    }
  };

  const handleSave = () => {
    onSave(selectedSkills); // Save skills
    setSelectedSkills([]); // Clear selected skills
    setSkillInput(""); // Reset input field
    onClose(); // Close modal
  };

  if (!isOpen) return null; // Hide modal when not open

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 p-3">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-gray-500 opacity-40 pointer-events-none"></div>

      {/* Modal Box */}
      <div
        className="bg-white border border-gray-300 p-4 relative z-10 flex flex-col gap-3 w-full max-w-[90%] sm:max-w-[500px] md:max-w-[600px] rounded-xl shadow-lg"
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="text-base sm:text-lg font-semibold">Add Skills and Interests</h2>
          <XCircle size={20} className="cursor-pointer text-red-500" onClick={onClose} />
        </div>

        {/* Skill Input Section */}
        <div className="flex flex-col gap-1">
          <h3 className="text-gray-700 font-medium text-sm sm:text-base">Skills and Interests</h3>
          <input
            type="text"
            value={skillInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown} // Detect Enter key
            className="w-full border border-gray-400 px-3 py-2 rounded-lg text-sm sm:text-base"
            placeholder="Enter skills..."
          />

          {/* Selected Skills List */}
          <div className="flex flex-wrap gap-2">
            {selectedSkills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 border border-blue-700 text-blue-700 rounded-full text-xs sm:text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Suggested Skills Section */}
        <div className="flex flex-col gap-2">
          <h3 className="text-gray-600 text-sm sm:text-base">Suggestions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {suggestedSkills.map((skill, index) => (
              <button
                key={index}
                className={`px-2 py-1 border rounded-full text-xs sm:text-sm flex items-center justify-center ${
                  selectedSkills.includes(skill)
                    ? "bg-blue-700 text-white"
                    : "border-blue-700 text-blue-700 hover:bg-blue-50"
                }`}
                onClick={() => toggleSkill(skill)}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            className="px-4 py-2 bg-blue-700 text-white rounded-full text-xs sm:text-sm font-medium hover:bg-blue-800 transition"
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
