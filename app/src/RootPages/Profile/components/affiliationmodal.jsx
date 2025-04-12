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
      setErrors({ affiliation: "", position: "" });
    }
  }, [isOpen]);

  // Debounce timer
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (affiliationInput.trim().length >= 1) {
        fetchOrgSuggestions(affiliationInput.trim());
      }
    }, 400); // wait 400ms after user stops typing

    return () => clearTimeout(delayDebounceFn);
  }, [affiliationInput]);

  const fetchOrgSuggestions = async (query) => {
    try {
      const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
      const url = `${API_BASE_URL}/get-org?q=${encodeURIComponent(query)}&limit=5`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch suggestions");

      const data = await response.json();
      console.log("🔍 Organization suggestions:", data);
    } catch (error) {
      console.error("Error fetching org suggestions:", error);
    }
  };

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 px-4 sm:px-0">
      <div className="absolute inset-0 bg-gray-500 opacity-40 pointer-events-none"></div>

      <div className="bg-white border border-disabled p-6 relative z-10 flex flex-col w-full max-w-[650px] rounded-2xl shadow-lg sm:w-11/12 max-h-screen">
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="text-lg font-satoshi-bold sm:text-[24px]">Add affiliations</h2>
          <XCircle size={24} className="cursor-pointer text-white bg-error rounded-full hover:bg-red-800" onClick={onClose} />
        </div>

        <div className="flex flex-col gap-4 mt-4">
          <div className="flex flex-col">
            <label className="text-black font-satoshi-medium">
              Name of organization <span className="text-error">*</span>
            </label>
            <input
              type="text"
              value={affiliationInput}
              onChange={(e) => setAffiliationInput(e.target.value)}
              className={`w-full border-2 px-4 py-3 rounded-2xl font-satoshi-medium text-lg sm:text-sm ${
                errors.affiliation ? "border-error" : "border-disabled"
              }`}
              placeholder="Enter organization name..."
            />
            {errors.affiliation && <p className="text-error text-sm mt-1">{errors.affiliation}</p>}
          </div>

          <div className="flex flex-col">
            <label className="text-black font-satoshi-medium">
              Position <span className="text-error">*</span>
            </label>
            <input
              type="text"
              value={positionInput}
              onChange={(e) => setPositionInput(e.target.value)}
              className={`w-full border-2 px-4 py-3 rounded-2xl font-satoshi-medium text-lg sm:text-sm ${
                errors.position ? "border-error" : "border-disabled"
              }`}
              placeholder="Enter your position..."
            />
            {errors.position && <p className="text-error text-sm mt-1">{errors.position}</p>}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            className="px-5 py-3 bg-primary text-white rounded-full text-sm font-satoshi-medium hover:bg-hover transition"
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
