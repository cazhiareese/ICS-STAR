import React from "react";

const tabs = ["About", "Work", "Job Posted", "Donation History"];

function UserProfileTabs({ userDetails, editMode, activeTab, setActiveTab }) {
  return (
    <div
  className={`w-full max-w-[1100px] border border-disabled rounded-[10px] ${userDetails.is_verified ? 'bg-whitey' : 'bg-white'} p-2 flex flex-wrap justify-center sm:justify-start gap-4  sm:gap-7 mt-4 px-6`}
>
{tabs.map((tab) => (
  <span
    key={tab}
    onClick={() => {
      if (!editMode && userDetails.is_verified) {
        setActiveTab(tab);
      }
    }}
    className={`relative font-satoshi-medium text-[17px] sm:text-[20px] leading-[30px] tracking-[-0.02em] transition cursor-pointer
      ${
        editMode || !userDetails.is_verified
          ? "pointer-events-none text-gray-400 opacity-50"
          : activeTab === tab
          ? "text-primary font-bold "
          : "text-gray-700 hover:text-primary"
      }`}
  >
    {tab}
  </span>
))}

    </div>
  );
}

export default UserProfileTabs;
