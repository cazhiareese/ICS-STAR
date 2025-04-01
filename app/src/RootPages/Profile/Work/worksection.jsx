import React from "react";
import SectionHeader from "../components/sectionheader"; // Adjust the path based on your project structure

function WorkSection({ userDetails }) {
  const handleEditWork = () => {
    console.log("Edit Work Clicked");
  };

  return (
    <div className="w-full max-w-[1100px] mt-6">
      {/* Section Header */}
      <SectionHeader title="Current Work" buttonText="Edit Work" onButtonClick={handleEditWork} />

      {/* Work Experience Card */}
      <div className="w-full py-2">
        {/* First Row: Job Title & Date */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-primary">{userDetails.job_title}</h3>
            {userDetails.work_mode.toLowerCase() === "remote" && (
              <span className="bg-blue-800 text-white text-xs px-2 py-1 rounded-full">Remote</span>
            )}
          </div>
          <p className="text-blue-800 text-sm">2022 - Present</p>
        </div>

        {/* Second Row: Company Name */}
        <p className="text-gray-700">{userDetails.company_name}</p>

        {/* Third Row: Work Location & Button */}
        <div className="flex justify-between items-center mt-1">
          <p className="text-gray-600">{userDetails.work_location}</p>
          <button
            className="text-gray-600 text-sm hover:underline flex items-center"
            onClick={handleEditWork}
          >
            View More ▼
          </button>
        </div>
      </div>
    </div>
  );
}

export default WorkSection;
