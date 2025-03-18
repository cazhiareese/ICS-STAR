import React from "react";

const SidebarItem = ({ title, icon, isSelected, onClick }) => {
  return (
    <div
      className={`flex flex-row p-2 rounded-r-3xl items-center border-l-6 ${
        isSelected ? "border-primary bg-blue-100" : "border-transparent hover:bg-gray-100"
      } cursor-pointer`}
      onClick={onClick}
    >
      <span className="mr-3">{icon}</span>
      <p className="text-lg font-satoshi-medium">{title}</p>
    </div>
  );
};

export default SidebarItem;
