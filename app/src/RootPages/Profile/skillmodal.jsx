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
      <div className="absolute inset-0 bg-gray-500 opacity-50 pointer-events-none"></div>

      {/* Modal Box */}
      <div className="bg-white shadow-lg border border-gray-300 rounded-lg p-6 w-[400px] relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="text-lg font-semibold">Add skills and interests</h2>
          <XCircle size={20} className="cursor-pointer text-red-500" onClick={onClose} />
        </div>

        {/* Input Field */}
        <div className="mt-4">
          <input
            type="text"
            value={selectedSkills.join(", ")}
            className="w-full border p-2 rounded-md"
            placeholder="Enter skills..."
            readOnly
          />
        </div>

        {/* Suggested Skills */}
        <div className="mt-4">
          <h3 className="text-gray-600 mb-2">Suggestions</h3>
          <div className="flex flex-wrap gap-2">
            {suggestedSkills.map((skill, index) => (
              <button
                key={index}
                className={`px-3 py-1 border rounded-full text-sm transition ${
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
        <div className="mt-4 flex justify-end">
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
