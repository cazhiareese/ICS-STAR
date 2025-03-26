import React from "react";

function SectionHeader({ title }) {
  return (
    <div className="w-full">
      <h2 className="text-lg font-bold text-gray-800">{title}</h2>
      <div className="w-full border-t border-disabled mt-1"></div>
    </div>
  );
}

export default SectionHeader;
