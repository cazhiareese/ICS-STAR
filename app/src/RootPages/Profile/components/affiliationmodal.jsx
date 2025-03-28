import React, { useState, useEffect } from "react";
import { XCircle } from "lucide-react";

const AddAffiliationsModal = ({ isOpen, onClose, onSave }) => {
  const [affiliationInput, setAffiliationInput] = useState("");
  const [positionInput, setPositionInput] = useState("");
  const [errors, setErrors] = useState({ affiliation: "", position: "" });

  useEffect(() => {
    if (!isOpen) {
      setAffiliationInput("");
      setPositionInput("");
      setErrors({ affiliation: "", position: "" }); // Reset errors
    }
  }, [isOpen]);

  const handleSave = () => {
    let newErrors = { affiliation: "", position: "" };

    if (!affiliationInput.trim()) newErrors.affiliation = "This field is required.";
    if (!positionInput.trim()) newErrors.position = "This field is required.";

    setErrors(newErrors);

    if (!newErrors.affiliation && !newErrors.position) {
      onSave({ affiliation: affiliationInput, role: positionInput });
      setAffiliationInput("");
      setPositionInput("");
      onClose();
    }
  };

  if (!isOpen) return null; // Hide modal when not open

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 px-4 sm:px-0">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-gray-500 opacity-40 pointer-events-none"></div>

      {/* Modal Container */}
      <div className="bg-white border border-disabled p-6 relative z-10 flex flex-col w-full max-w-[650px] rounded-2xl shadow-lg sm:w-11/12 max-h-screen">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="text-lg font-semibold sm:text-base">Add affiliations</h2>
          <XCircle size={24} className="cursor-pointer text-error" onClick={onClose} />
        </div>

        {/* Input Fields */}
        <div className="flex flex-col gap-4 mt-4">
          {/* Affiliation Name */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium">
              Name of organization <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={affiliationInput}
              onChange={(e) => setAffiliationInput(e.target.value)}
              className={`w-full border px-4 py-3 rounded-2xl text-lg sm:text-sm ${
                errors.affiliation ? "border-red-500" : "border-gray-400"
              }`}
              placeholder="Enter organization name..."
            />
            {errors.affiliation && <p className="text-red-500 text-sm mt-1">{errors.affiliation}</p>}
          </div>

          {/* Position */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium">
              Position <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={positionInput}
              onChange={(e) => setPositionInput(e.target.value)}
              className={`w-full border px-4 py-3 rounded-2xl text-lg sm:text-sm ${
                errors.position ? "border-red-500" : "border-gray-400"
              }`}
              placeholder="Enter your position..."
            />
            {errors.position && <p className="text-red-500 text-sm mt-1">{errors.position}</p>}
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <button
            className="px-5 py-3 bg-blue-700 text-white rounded-full text-sm font-medium hover:bg-blue-800 transition"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAffiliationsModal;
