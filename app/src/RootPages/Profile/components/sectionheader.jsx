import React from "react";
import { PlusCircle } from "lucide-react";

function SectionHeader({ title, buttonText, onButtonClick }) {
  return (
    <div className="w-full">
      {/* Title & Button Container */}
      <div className="flex justify-between items-center">
        <h2 className="font-satoshi-bold text-[20px] sm:text-[22px] md:text-[24px] leading-tight tracking-[-0.02em] text-gray-800 uppercase">
          {title}
        </h2>

        {/* Button (Responsive: Full on Desktop, Icon Only on Mobile) */}
        {onButtonClick && (
          <button
            className="flex items-center gap-2 px-1 py-1 sm:px-3 sm:py-1.8 bg-primary text-white rounded-full text-[14px] font-medium hover:bg-hover transition"
            onClick={onButtonClick}
          >
            <PlusCircle size={20} />

            {/* Show Button Text Only on Larger Screens */}
            <span className="hidden sm:inline">{buttonText}</span>
          </button>
        )}
      </div>

      {/* Divider (Ensure Proper Spacing) */}
      <div className="w-full border-t border-disabled mt-1"></div>
    </div>
  );
}

export default SectionHeader;
