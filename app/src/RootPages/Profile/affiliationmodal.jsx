import React, { useState, useEffect } from "react";
import { XCircle } from "lucide-react";

const AddAffiliationsModal = ({ isOpen, onClose, onSave }) => {
  const [affiliationInput, setAffiliationInput] = useState("");
  const [positionInput, setPositionInput] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setAffiliationInput("");
      setPositionInput("");
    }
  }, [isOpen]);

  const handleSave = () => {
    if (affiliationInput.trim() && positionInput.trim()) {
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
      <div className="bg-white border border-gray-300 p-6 relative z-10 flex flex-col w-full max-w-[650px] rounded-2xl shadow-lg sm:w-11/12 max-h-screen">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="text-lg font-semibold sm:text-base">Add affiliations</h2>
          <XCircle size={24} className="cursor-pointer text-red-500" onClick={onClose} />
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
              className="w-full border border-gray-400 px-4 py-3 rounded-2xl text-lg sm:text-sm"
              placeholder="Enter organization name..."
            />
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
              className="w-full border border-gray-400 px-4 py-3 rounded-2xl text-lg sm:text-sm"
              placeholder="Enter your position..."
            />
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
