import React, { useState, useEffect } from "react";
import { PlusCircle } from "lucide-react";

function SectionHeader({ title, buttonText, onButtonClick, onToggleChange, isVerified, share, joblength }) {
  const [selectedDonationType, setSelectedDonationType] = useState("Monetary");
  console.log("cyyyy",joblength)

  useEffect(() => {
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

        {!share && title === "DONATIONS" ? (
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
          !share && onButtonClick && (
            <button
              onClick={isVerified ? onButtonClick : undefined}
              disabled={!isVerified}
              className={`flex items-center gap-2 px-1 py-1 sm:px-3 sm:py-1.8 rounded-full text-[14px] font-medium transition
                ${isVerified
                  ? "bg-primary text-white hover:bg-hover"
                  : "bg-bg-disabled text-neutral-c cursor-not-allowed"}
              `}
            >
              <PlusCircle
                size={20}
                className={`${isVerified ? "text-white" : "text-neutral-c"}`}
              />
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
