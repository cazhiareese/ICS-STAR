import React from "react";

const tabs = ["About", "Work", "Job Posted", "Donation History"];

function UserProfileTabs({ activeTab, setActiveTab }) {
  return (
    <div className="w-full max-w-[1100px] border border-gray-300 rounded-[10px] bg-white p-2 flex flex-wrap justify-center sm:justify-start gap-7 sm:gap-7 mt-4 px-6">
      {tabs.map((tab) => (
        <span
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`relative font-satoshi text-[18px] sm:text-[20px] leading-[30px] tracking-[-0.02em] cursor-pointer transition 
            ${
              activeTab === tab
                ? "text-blue-600 font-bold after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-blue-600"
                : "text-gray-700 hover:text-blue-600"
            }`}
        >
          {tab}
        </span>
      ))}
    </div>
  );
}

export default UserProfileTabs;
