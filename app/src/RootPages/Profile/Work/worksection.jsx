import React, { useState } from "react";
import { ChevronDown, ChevronUp, Check } from "lucide-react"; 
import SectionHeader from "../components/sectionheader"; 
import SaveWorkModal from "../components/saveworkmodal";

function WorkSection({ userDetails, handleChange, isVerified }) {
  const [showMore, setShowMore] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
const [saveSuccess, setSaveSuccess] = useState(false);

  const workModes = ["Remote", "Onsite", "Hybrid"];
  const employerClasses = ["Government", "NGO", "Private Sector"];
  const tenuredStatuses = [
    "Permanent",
    "Temporary",
    "Contractual",
    "Probationary",
  ];

  const handleToggleMore = () => {
    setShowMore(!showMore);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setShowMore(true); // Activate "View More" when entering edit mode
    }
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

  const saveEmployment = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("User not authenticated");
        return;
      }
  
      const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
  
      const [city, country] = userDetails.work_location
        ? userDetails.work_location.split(",").map((s) => s.trim())
        : ["", ""];
  
      const currentEmploymentData = {
        industry: userDetails.industry || "",
        employment_status: userDetails.employment_status || "",
        company_name: userDetails.company_name || "",
        job_title: userDetails.job_title || "",
        city: city || "",
        country: country || "",
        work_mode: userDetails.work_mode || "",
        employer_class: userDetails.employer_class || "",
        tenured_status: userDetails.tenured_status || "",
        salary_grade: userDetails.salary_grade || "",
      };
  
      const urlEncodedData = new URLSearchParams(currentEmploymentData).toString();
  
      const response = await fetch(`${API_BASE_URL}/update-employment`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${token}`,
        },
        body: urlEncodedData,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update employment info");
      }
  
      const result = await response.json();
      console.log("✅", result.message);
      setSaveSuccess(true);
  
      setTimeout(() => {
        setIsEditing(false);
        setShowSaveModal(false);
        setSaveSuccess(false);
      }, 1500);
    } catch (err) {
      console.error("❌", err);
    }
  };
  

  return (
    <div className="w-full max-w-[1100px] mt-6">
      {/* Section Header */}
      <SectionHeader
        title="Current Work"
        buttonText={isEditing ? "Save Work" : "Edit Work"}
        onButtonClick={isEditing ? () => setShowSaveModal(true) : handleEditToggle}
        isVerified={isVerified}
      />

      {/* Work Experience Card */}
      <div className="w-full py-2">
        {/* First Row: Job Title & Date */}
        <div className="flex justify-between items-center">
          <div
            className={`flex gap-2 sm:gap-4 ${
              isEditing ? "flex-col sm:flex-row items-start" : "items-center"
            }`}
          >
            {isEditing ? (
              <input
                type="text"
                value={userDetails.job_title || ""}
                onChange={(e) => handleChange(e, "job_title")}
                className="w-[250px] h-[30px] py-1 text-[23px] font-satoshi-black text-primary bg-white border border-gray-300 rounded-[12px] px-2"
              />
            ) : (
              <h3 className="text-[23px] text-primary font-satoshi-black">
                {userDetails.job_title || "Not Available"}
              </h3>
            )}

            {isEditing ? (
              <div className="flex gap-2">
                {workModes.map((mode) => (
                  <button
                    key={mode}
                    className={`text-white w-[81px] h-[26px] text-[14px] px-2 py-1 rounded-full flex items-center justify-center font-satoshi-medium transition-all ${
                      userDetails.work_mode === mode ? "bg-primary" : "bg-hover"
                    }`}
                    onClick={() =>
                      handleChange({ target: { value: mode } }, "work_mode")
                    }
                  >
                    {mode}
                  </button>
                ))}
              </div>
            ) : (
              <span className="bg-blue-800 text-white w-[81px] h-[26px] text-[14px] px-2 py-1 rounded-full flex items-center justify-center font-satoshi-medium">
                {userDetails.work_mode || "Not Available"}
              </span>
            )}
          </div>


        </div>

        {/* Second Row: Company Name */}
        {isEditing ? (
          <input
            type="text"
            value={userDetails.company_name || ""}
            onChange={(e) => handleChange(e, "company_name")}
            className="text-black text-[20px] font-satoshi-medium bg-white border border-gray-300 rounded-[12px] px-2 w-[200px] h-[30px] py-1 mt-1 sm:w-[250px]"
          />
        ) : (
          <p className="text-black text-[20px] font-satoshi-medium">
            {userDetails.company_name || "Not Available"}
          </p>
        )}

        {/* Third Row: Work Location & Button */}
        <div className="flex justify-between items-center">
          {isEditing ? (
            <input
              type="text"
              value={userDetails.work_location || ""}
              onChange={(e) => handleChange(e, "work_location")}
              className="text-black font-satoshi-medium text-[20px] bg-white border border-gray-300 rounded-[12px] px-2 w-[200px] h-[30px] py-1 mt-1 sm:w-[250px]"
            />
          ) : (
            <p className="text-black font-satoshi-medium text-[20px]">
              {userDetails.work_location || "Not Available"}
            </p>
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
                <select
                  value={userDetails.employer_class || ""}
                  onChange={(e) => handleChange(e, "employer_class")}
                  className="text-primary font-satoshi-bold bg-white border border-gray-300 rounded-[12px] px-2 w-[200px] h-[30px] sm:w-[250px]"
                >
                  <option value="">Select Employer Class</option>
                  {employerClasses.map((status) => (
                    <option
                      className="text-[15px] sm:text-[20px]"
                      key={status}
                      value={status}
                    >
                      {status}
                    </option>
                  ))}
                </select>
              ) : (
                <span className="text-primary font-satoshi-bold">
                  {userDetails.employer_class || "Not Available"}
                </span>
              )}
            </div>

            <div className="flex flex-col items-start text-left">
              <span className="font-satoshi-medium">Tenured Status:</span>
              {isEditing ? (
                <select
                  value={userDetails.tenured_status || ""}
                  onChange={(e) => handleChange(e, "tenured_status")}
                  className="text-primary font-satoshi-bold bg-white border border-gray-300 rounded-[12px] px-2 w-[200px] h-[30px] sm:w-[250px]"
                >
                  <option value="">Select Tenured Status</option>
                  {tenuredStatuses.map((status) => (
                    <option
                      className="text-[15px] sm:text-[20px]"
                      key={status}
                      value={status}
                    >
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

            {/* Salary Range */}
            <div className="flex flex-col items-start text-left">
              <span className="font-satoshi-medium">Salary Range:</span>
              {isEditing ? (
                <select
                  value={userDetails.salary_grade || ""}
                  onChange={(e) => handleChange(e, "salary_grade")}
                  className="text-primary font-satoshi-bold bg-white border text-[20px] border-gray-300 rounded-[12px] px-2 w-[200px] h-[30px] sm:w-[250px] sm:text-[20px]"
                >
                  <option value="">Select Salary Range</option>
                  {Object.entries(salaryRanges).map(([key, value]) => (
                    <option
                      className="text-[15px] sm:text-[20px]"
                      key={key}
                      value={key}
                    >
                      {value}
                    </option>
                  ))}
                </select>
              ) : (
                <span className="text-primary font-satoshi-bold">
                  {salaryRanges[userDetails.salary_grade] || "Not Available"}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
      <SaveWorkModal
  isOpen={showSaveModal}
  isSuccess={saveSuccess}
  onClose={(action) => {
    if (action === "confirm") {
      saveEmployment();
    } else {
      setShowSaveModal(false);
    }
  }}
/>

    </div>
  );
}

export default WorkSection;