import React, { useState, useEffect } from "react";
import { PlusCircle } from "lucide-react";

function SectionHeader({ title, buttonText, onButtonClick, onToggleChange }) {
  const [selectedDonationType, setSelectedDonationType] = useState("Monetary");

  useEffect(() => {
    // Return selected donation type when component mounts or changes
    if (title === "DONATIONS" && onToggleChange) {
      onToggleChange(selectedDonationType);
    }
  }, [selectedDonationType]);

  const handleToggle = (type) => {
    setSelectedDonationType(type);
    if (onToggleChange) {
      onToggleChange(type);
    }
  };

  return (
    <div className="w-full">
      {/* Title & Button Container */}
      <div className="flex justify-between items-center">
        <h2 className="font-satoshi-bold text-[20px] sm:text-[22px] md:text-[24px] leading-tight tracking-[-0.02em] text-gray-800 uppercase">
          {title}
        </h2>

        {/* If Donations, show toggle instead of regular button */}
        {title === "DONATIONS" ? (
          <div className="flex gap-2 bg-gray-200 rounded-full p-1">
            {["Monetary", "In-Kind"].map((type) => (
              <button
                key={type}
                className={`px-3 py-1 text-sm rounded-full transition font-medium ${
                  selectedDonationType === type
                    ? "bg-primary text-white"
                    : "text-gray-700 hover:text-primary"
                }`}
                onClick={() => handleToggle(type)}
              >
                {type}
              </button>
            ))}
          </div>
        ) : (
          onButtonClick && (
            <button
              className="flex items-center gap-2 px-1 py-1 sm:px-3 sm:py-1.8 bg-primary text-white rounded-full text-[14px] font-medium hover:bg-hover transition"
              onClick={onButtonClick}
            >
              <PlusCircle size={20} />
              <span className="hidden sm:inline">{buttonText}</span>
            </button>
          )
        )}
      </div>

      {/* Divider */}
      <div className="w-full border-t border-disabled mt-1"></div>
    </div>
  );
}

export default SectionHeader;
