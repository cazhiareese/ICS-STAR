import React from "react";

function SectionHeader({ title }) {
  return (
    <div className="w-full">
      <h2 className="font-satoshi-bold text-[24px] leading-[22px] tracking-[-0.02em] text-gray-800 uppercase">
        {title}
      </h2>
      <div className="w-full border-t border-disabled mt-2"></div> 
    </div>
  );
}

export default SectionHeader;
