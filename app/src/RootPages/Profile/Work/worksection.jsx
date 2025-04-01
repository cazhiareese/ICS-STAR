import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react"; // Import icons
import SectionHeader from "../components/sectionheader"; // Adjust the path based on your project structure

function WorkSection({ userDetails, handleChange }) {
  const [showMore, setShowMore] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const workModes = ["Remote", "Onsite", "Hybrid"];
  //const employerclass = ["Private", "Public", "Non-Government", "Self-Employed"];
  const employerClasses = ["Government", "NGO","Private Sector"];
  const tenuredStatuses = ["Permanent", "Temporary", "Contractual", "Probationary"];




  const handleToggleMore = () => {
    setShowMore(!showMore);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const salaryRanges = {
    1: "Less than ₱9,100",
    2: "₱9,100 to ₱18,199",
    3: "₱18,200 to ₱36,399",
    4: "₱36,400 to ₱63,699",
    5: "₱63,700 to ₱109,199",
    6: "₱109,200 to ₱181,999",
    7: "At least ₱182,000 and up",
  };

  return (
    <div className="w-full max-w-[1100px] mt-6">
      {/* Section Header */}
      <SectionHeader 
        title="Current Work" 
        buttonText={isEditing ? "Save" : "Edit Work"} 
        onButtonClick={handleEditToggle} 
      />

      {/* Work Experience Card */}
      <div className="w-full py-2">
        {/* First Row: Job Title & Date */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {isEditing ? (
              <input
                type="text"
                value={userDetails.job_title}
                onChange={(e) => handleChange(e, "job_title")}
                className="w-[250px] h-[30px] py-1 text-[23px]  font-satoshi-black text-primary bg-white border border-gray-300 rounded-[12px] px-2 "
              />
            ) : (
              <h3 className=" text-[23px] text-primary font-satoshi-black">{userDetails.job_title}</h3>
            )}

{isEditing ? (
              <div className="flex gap-2">
                {workModes.map((mode) => (
                  <button
                    key={mode}
                    className={`text-white w-[81px] h-[26px] text-[14px] px-2 py-1 rounded-full flex items-center justify-center font-satoshi-medium transition-all ${
                      userDetails.work_mode === mode ? "bg-primary" : "bg-hover"
                    }`}
                    onClick={() => handleChange({ target: { value: mode } }, "work_mode")}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            ) : (
              <span className="bg-blue-800 text-white w-[81px] h-[26px] text-[14px] px-2 py-1 rounded-full flex items-center justify-center font-satoshi-medium">
                {userDetails.work_mode}
              </span>
            )}
          </div>

          {isEditing ? (
            <input
              type="text"
              value={userDetails.work_start_date}
              onChange={(e) => handleChange(e, "work_start_date")}
              className="text-primary text-[18px] font-satoshi-medium bg-white border border-gray-300 rounded-md px-2 py-1"
            />
          ) : (
            <p className="text-primary text-[18px] font-satoshi-medium">2022 - Present</p>
          )}
        </div>

        {/* Second Row: Company Name */}
        {isEditing ? (
          <input
            type="text"
            value={userDetails.company_name}
            onChange={(e) => handleChange(e, "company_name")}
            className="w-[250px] h-[30px] py-1 text-black text-[20px] font-satoshi-medium bg-white border border-gray-300 rounded-[12px] px-2 "
          />
        ) : (
          <p className="text-black text-[20px] font-satoshi-medium">{userDetails.company_name}</p>
        )}

        {/* Third Row: Work Location & Button */}
        <div className="flex justify-between items-center">
          {isEditing ? (
            <input
              type="text"
              value={userDetails.work_location}
              onChange={(e) => handleChange(e, "work_location")}
              className="text-black font-satoshi-medium text-[20px] bg-white border border-gray-300 rounded-[12px] px-2 w-[250px] h-[30px] py-1 "
            />
          ) : (
            <p className="text-black font-satoshi-medium text-[20px]">{userDetails.work_location}</p>
          )}

          <button
            className="text-black text-[16px] font-satoshi-medium hover:underline flex items-center gap-1"
            onClick={handleToggleMore}
          >
            {showMore ? "View Less" : "View More"}
            {showMore ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>

        {/* Expandable Details */}
        {showMore && (
          <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-4 text-black text-[20px] font-satoshi-medium">
            {/* Employer Class */}
            <div className="flex flex-col items-start text-left">
              <span className="font-satoshi-medium">Employer Class:</span>
              {isEditing ? (
                <input
                  type="text"
                  value={userDetails.employer_class}
                  onChange={(e) => handleChange(e, "employer_class")}
                  className="text-primary font-satoshi-bold bg-white border border-gray-300 rounded-[12px] px-2 w-[250px] h-[30px] py-1"
                />
              ) : (
                <span className="text-primary font-satoshi-bold">{userDetails.employer_class}</span>
              )}
            </div>

         
                  <div className="flex flex-col items-start text-left">
                    <span className="font-satoshi-medium">Tenured Status:</span>
                    {isEditing ? (
                    <select
                      value={userDetails.tenured_status}
                      onChange={(e) => handleChange(e, "tenured_status")}
                      className="text-primary font-satoshi-bold bg-white border border-gray-300 rounded-[12px] px-2 w-[250px] h-[30px] "
                    >
                      {tenuredStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                      ))}
                    </select>
                    ) : (
                    <span className="text-primary font-satoshi-bold">
                      {userDetails.tenured_status || "Not Available"}
                    </span>
                    )}
                  </div>

                  {/* Salary Range (Instead of Salary Grade) */}
            <div className="flex flex-col items-start text-left">
              <span className="font-satoshi-medium">Salary Range:</span>
              {isEditing ? (
                <select
                  value={userDetails.tenured_status}
                  onChange={(e) => handleChange(e, "tenured_status")}
                  className="text-primary font-satoshi-bold bg-white border border-gray-300 rounded-[12px] px-2 w-[250px] h-[30px] "
                >
                  {Object.entries(salaryRanges).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </select>
              ) : (
                <span className="text-primary font-satoshi-bold">
                  {salaryRanges[userDetails.tenured_status] || "Not Available"}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default WorkSection;
