import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";

const SidebarItem = ({ title, icon, isSelected, childrenItems, path, onClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div>
      {/* Main Row */}
      <div
        className={`flex flex-row p-2 rounded-r-3xl items-center border-l-6 ${
          isSelected ? "border-primary bg-blue-100" : "border-transparent hover:bg-gray-100 hover:text-hover"
        }`}
      >
        {/* Clicking on title navigates */}
        <Link 
          to={`/admin/${path}`} 
          className="flex flex-1 items-center" 
          onClick={onClick}
        >
          <span className="mr-3">{icon}</span>
          <p className="text-lg font-satoshi-medium">{title}</p>
        </Link>

        {/* Clicking on dropdown toggles expand/collapse */}
        {childrenItems && childrenItems.length > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent link navigation
              e.preventDefault();  // Prevent link click
              setIsExpanded(!isExpanded);
            }}
            className="ml-2 text-gray-700 cursor-pointer hover:text-hover"
          >
            {isExpanded ? <ChevronUp/> : <ChevronDown/>}
          </button>
        )}
      </div>

      {/* Children Links */}
      {isExpanded && childrenItems && (
        <div className="ml-8 mt-1 flex flex-col space-y-1">
          {childrenItems.map((child, idx) => (
            <Link
              key={idx}
              to={`/admin/${child.path}`}
              className="text-gray-700 text-sm hover:text-primary hover:underline"
              onClick={onClick}
            >
              {child.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SidebarItem;
