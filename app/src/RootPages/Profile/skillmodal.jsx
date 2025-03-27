import React, { useState } from "react";
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
  const [selectedSkills, setSelectedSkills] = useState([]);

  const toggleSkill = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill)
        ? prev.filter((s) => s !== skill) // Remove if already selected
        : [...prev, skill] // Add if not selected
    );
  };

  const handleSave = () => {
    onSave(selectedSkills);
    onClose(); // Close modal after saving
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
        <h3 className="text-gray-700 font-medium mt-4 mb-1">Skill and Interests</h3>

        {/* Input Field */}
        <div className="mt-2">
  <input
    type="text"
    value={selectedSkills.join(", ")}
    className="w-full border-disabled border p-4 rounded-2xl text-lg"
    placeholder="Enter skills..."
    readOnly
    style={{ height: "50px" }} // Set height to 75px
  />
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
        style={{ height: "40px" }} // Set button height to 40px
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
