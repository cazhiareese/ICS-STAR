import React, { useState, useEffect } from "react";
import { XCircle } from "lucide-react";

const AddScholarshipModal = ({ isOpen, onClose, onSave }) => {
  const [scholarshipInput, setScholarshipInput] = useState("");
  const [error, setError] = useState(""); // Track error state

  useEffect(() => {
    if (!isOpen) {
      setScholarshipInput("");
      setError(""); // Reset error message when modal is closed
    }
  }, [isOpen]);

  const handleSave = () => {
    if (!scholarshipInput.trim()) {
      setError("This field is required."); // Show error if input is empty
      return;
    }

    onSave(scholarshipInput);
    setScholarshipInput("");
    setError(""); // Clear error on successful save
    onClose();
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
          <h2 className="text-lg font-semibold sm:text-base">Add scholarship</h2>
          <XCircle size={24} className="cursor-pointer text-red-500" onClick={onClose} />
        </div>

        {/* Input Field */}
        <div className="flex flex-col gap-4 mt-4">
          {/* Scholarship Name */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium">
              Name of scholarship <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={scholarshipInput}
              onChange={(e) => setScholarshipInput(e.target.value)}
              className={`w-full border px-4 py-3 rounded-2xl text-lg sm:text-sm ${
                error ? "border-red-500" : "border-gray-400"
              }`}
              placeholder="Enter scholarship name..."
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
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

export default AddScholarshipModal;
