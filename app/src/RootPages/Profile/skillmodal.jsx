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
  const [selectedSkills, setSelectedSkills] = useState([]); // Skills in the input field

  useEffect(() => {
    if (!isOpen) {
      setSkillInput(""); // Reset text input when modal closes
    }
  }, [isOpen]);

  const toggleSkill = (skill) => {
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill]); // Add skill if not in the list
    }
  };

  const handleInputChange = (e) => {
    setSkillInput(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && skillInput.trim() !== "") {
      setSelectedSkills([...selectedSkills, skillInput.trim()]); // Add typed skill
      setSkillInput(""); // Clear input field for next input
    }
  };

  const handleSave = () => {
    onSave(selectedSkills); // Save all selected skills
    setSelectedSkills([]); // Clear skills after saving
    setSkillInput(""); // Reset input field
    onClose(); // Close modal
  };

  if (!isOpen) return null; // Hide modal when not open

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      {/* Background Overlay - Slight Gray Transparency */}
      <div className="absolute inset-0 bg-gray-500 opacity-40 pointer-events-none"></div>

      {/* Modal Box */}
      <div
        className="bg-white border border-gray-300 p-6 relative z-10"
        style={{
          width: "650px",
          height: "434px",
          borderRadius: "20px",
          boxShadow: "0px 4px 4px 0px #00000040",
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="text-lg font-semibold">Add skills and interests</h2>
          <XCircle size={24} className="cursor-pointer text-red-500" onClick={onClose} />
        </div>

        {/* New Header Above Input Field */}
        <h3 className="text-gray-700 font-medium mt-4 mb-1">Skills and Interests</h3>

        {/* Input Field */}
        <div className="mt-2">
          <input
            type="text"
            value={skillInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown} // Detect Enter key
            className="w-full border border-gray-400 p-4 rounded-2xl text-lg"
            placeholder="Enter skills..."
            style={{ height: "50px" }}
          />
        </div>

        {/* Display Selected Skills */}
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedSkills.map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1 border border-blue-700 text-blue-700 rounded-full text-sm"
            >
              {skill}
            </span>
          ))}
        </div>

        {/* Suggested Skills */}
        <div className="mt-5">
          <h3 className="text-gray-600 mb-2">Suggestions</h3>
          <div className="grid grid-cols-3 gap-2">
            {suggestedSkills.map((skill, index) => (
              <button
                key={index}
                className={`px-3 border rounded-full text-sm transition flex items-center justify-center ${
                  selectedSkills.includes(skill)
                    ? "bg-blue-700 text-white"
                    : "border-blue-700 text-blue-700 hover:bg-blue-50"
                }`}
                style={{ height: "40px" }}
                onClick={() => toggleSkill(skill)}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <button
            className="px-4 py-2 bg-blue-700 text-white rounded-full text-sm font-medium hover:bg-blue-800 transition"
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
