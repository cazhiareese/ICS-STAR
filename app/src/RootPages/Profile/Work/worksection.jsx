import React, { useState } from "react";
import SectionHeader from "../components/sectionheader"; // Adjust the path based on your project structure

function WorkSection({ userDetails }) {
  const [showMore, setShowMore] = useState(false);

  const handleToggleMore = () => {
    setShowMore(!showMore);
  };

  return (
    <div className="w-full max-w-[1100px] mt-6">
      {/* Section Header */}
      <SectionHeader title="Current Work" buttonText="Edit Work" onButtonClick={() => console.log("Edit Work Clicked")} />

      {/* Work Experience Card */}
      <div className="w-full py-2">
        {/* First Row: Job Title & Date */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h3 className="text-[23px] font-satoshi-medium text-primary font-satoshi-bold">{userDetails.job_title}</h3>
            {userDetails.work_mode.toLowerCase() === "remote" && (
              <span className="bg-blue-800 text-white text-xs px-2 py-1 rounded-full">Remote</span>
            )}
          </div>
          <p className="text-blue-800 text-sm">{userDetails.work_start_date} - Present</p>
        </div>

        {/* Second Row: Company Name */}
        <p className="text-gray-700 text-[20px]">{userDetails.company_name}</p>

        {/* Third Row: Work Location & Button */}
        <div className="flex justify-between items-center mt-1">
          <p className="text-black font-satoshi-medium text-[20px]">{userDetails.work_location}</p>
          <button
            className="text-black text-sm hover:underline flex items-center"
            onClick={handleToggleMore}
          >
            {showMore ? "View Less ▲" : "View More ▼"}
          </button>
        </div>

        {/* Expandable Details */}
        {showMore && (
          <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-4 text-black text-[20px] font-satoshi-medium">
            {/* Employer Class */}
            <div className="flex flex-col items-start text-left">
              <span className="font-satoshi-medium">Employer Class:</span>
              <span className="text-primary font-satoshi-bold">{userDetails.employer_class}</span>
            </div>

            {/* Tenured Status */}
            <div className="flex flex-col items-start text-left">
              <span className="font-satoshi-medium">Tenured Status:</span>
              <span className="text-primary font-satoshi-bold">{userDetails.tenured_status}</span>
            </div>

            {/* Salary Grade */}
            <div className="flex flex-col items-start text-left">
              <span className="font-satoshi-medium">Salary Grade:</span>
              <span className="text-primary font-satoshi-bold">{userDetails.salary_grade}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default WorkSection;
