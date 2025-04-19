import React, { useState, useEffect } from "react";
import { XCircle } from "lucide-react";

const AddAffiliationsModal = ({ isOpen, onClose, onSave }) => {
  const [affiliationInput, setAffiliationInput] = useState("");
  const [positionInput, setPositionInput] = useState("");
  const [errors, setErrors] = useState({ affiliation: "", position: "" });
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setAffiliationInput("");
      setPositionInput("");
      setErrors({ affiliation: "", position: "" });
      setSuggestions([]);
      setShowSuggestions(false);
      setLoading(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (affiliationInput.trim().length >= 1) {
        fetchOrgSuggestions(affiliationInput.trim());
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [affiliationInput]);

  const fetchOrgSuggestions = async (query) => {
    setLoading(true);
    try {
      const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
      const url = `${API_BASE_URL}/get-org?q=${encodeURIComponent(query)}&limit=5`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch suggestions");

      const data = await response.json();
      setSuggestions(data || []);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Error fetching org suggestions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setAffiliationInput(suggestion);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleSave = () => {
    const newErrors = {
      affiliation: affiliationInput.trim() ? "" : "This field is required.",
      position: positionInput.trim() ? "" : "This field is required.",
    };

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
          <XCircle
            size={24}
            className="cursor-pointer text-white bg-error rounded-full hover:bg-red-800"
            onClick={onClose}
          />
        </div>

        <div className="flex flex-col gap-4 mt-4 relative">
          {/* Organization input with suggestions */}
          <div className="flex flex-col relative">
            <label className="text-black font-satoshi-medium">
              Name of organization <span className="text-error">*</span>
            </label>
            <input
              type="text"
              value={affiliationInput}
              onChange={(e) => setAffiliationInput(e.target.value)}
              onFocus={() => setShowSuggestions(suggestions.length > 0)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              className={`w-full border-2 px-4 py-3 rounded-2xl font-satoshi-medium text-lg sm:text-sm ${
                errors.affiliation ? "border-error" : "border-disabled"
              }`}
              placeholder="Enter organization name..."
            />
            {errors.affiliation && <p className="text-error text-sm mt-1">{errors.affiliation}</p>}

            {/* Suggestions dropdown */}
            {showSuggestions && (
              <div className="absolute top-full mt-2 w-full bg-white border border-disabled rounded-xl shadow z-20 max-h-48 overflow-auto">
                <div className="px-4 py-2 border-b border-disabled text-sm text-primary font-satoshi-bold">
                  Suggestions
                </div>
                {loading ? (
                  <div className="px-4 py-2 text-sm text-gray-500">Loading suggestions...</div>
                ) : suggestions.length === 0 ? (
                  <div className="px-4 py-2 text-sm text-gray-500">No matches found</div>
                ) : (
                  suggestions.map((sugg, index) => (
                    <div
                      key={index}
                      onClick={() => handleSuggestionClick(sugg)}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm font-satoshi-medium"
                    >
                      {sugg}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Position input */}
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

        {/* Save Button */}
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
