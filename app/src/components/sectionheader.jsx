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

        {/* Button (Optional) */}
        {buttonText && onButtonClick && (
          <button
            className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-full text-[14px] font-medium hover:bg-blue-800 transition"
            onClick={onButtonClick}
          >
            <PlusCircle size={16} />
            {buttonText}
          </button>
        )}
      </div>

      {/* Divider (Make Sure It's Closer) */}
      <div className="w-full border-t border-gray-300 mt-1"></div>
    </div>
  );
}

export default SectionHeader;
