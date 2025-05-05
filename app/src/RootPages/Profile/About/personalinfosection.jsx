import React from "react";
import { MapPin, Phone, IdCard, GraduationCap, Heart } from "lucide-react";
import SectionHeader from "../components/sectionheader";

const semester = ["1st Semester", "2nd Semester", "Mid Semester"];
const years = Array.from({ length: 2025 - 1909 + 1 }, (_, i) => {
  const year = 1909 + i;
  return year < 2000 ? String(year).slice(-2) : String(year);
});
const maritalstat = ["Single", "Married", "Divorced", "Widowed"];
const standings = ["Freshman", "Sophomore", "Junior", "Senior"];
import CircularLoading from "../../../components/LoadingComponents/circularloading";
import SkeletonLoading from "../../../components/LoadingComponents/skeletonloading";

const PersonalInfoSection = ({ editMode, userDetails, handleChange }) => {
  // Generate options for the last 4 digits (0000–9999)
  const numberOptions = Array.from({ length: 10000 }, (_, i) =>
    String(i).padStart(4, "0")
  );

  // Handle changes for student number parts
  const handleStudentNumberChange = (e, field) => {
    const value = e.target.value;
    const newUserDetails = { ...userDetails, [field]: value };

    // Combine year and suffix to update student_number
    const yearPart = field === "student_number_year" ? value : userDetails.student_number_year || "";
    const numberPart = field === "student_number_suffix" ? value : userDetails.student_number_suffix || "";
    if (yearPart && numberPart) {
      newUserDetails.student_number = `${yearPart}${numberPart}`;
    } else {
      newUserDetails.student_number = "";
    }

    handleChange({ target: { value: newUserDetails.student_number } }, "student_number");
    handleChange({ target: { value } }, field);
  };

  return (
    <div className="w-full max-w-[1100px] mt-6">
      <SectionHeader title="PERSONAL INFORMATION" />

      {/* Responsive Grid Layout */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4 text-black text-[16px] font-satoshi-medium">
        {/* Location */}
        {userDetails.is_verified && (
          <div className="flex flex-col items-start text-left">
            <div className="flex items-center gap-2">
              <MapPin size={20} className="text-black" />
              <span>Location</span>
            </div>
            {editMode ? (
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  value={userDetails.city || ""}
                  onChange={(e) => handleChange(e, "city")}
                  placeholder="City"
                  className="text-primary font-satoshi-bold bg-white border border-disabled rounded-[12px] px-2 py-1 w-full"
                />
                <input
                  type="text"
                  value={userDetails.state || ""}
                  onChange={(e) => handleChange(e, "state")}
                  placeholder="State"
                  className="text-primary font-satoshi-bold bg-white border border-disabled rounded-[12px] px-2 py-1 w-full"
                />
                <input
                  type="text"
                  value={userDetails.country || ""}
                  onChange={(e) => handleChange(e, "country")}
                  placeholder="Country"
                  className="text-primary font-satoshi-bold bg-white border border-disabled rounded-[12px] px-2 py-1 w-full"
                />
              </div>
            ) : (
              <span className="text-primary font-satoshi-bold">
                {userDetails.city && userDetails.state && userDetails.country
                  ? `${userDetails.city}, ${userDetails.state}, ${userDetails.country}`
                  :               <span className="text-primary font-satoshi-bold">
                  {userDetails.marital_status === null ||
                  userDetails.marital_status === "" ? (
                    <span className="text-gray-500 italic">Not Available</span>
                  ) : userDetails.marital_status ? (
                    userDetails.marital_status
                  ) : (
                    <CircularLoading />
                  )}
                </span>}
              </span>
            )}
          </div>
        )}

        {/* Mobile Number */}
        {userDetails.is_verified && (
          <div className="flex flex-col items-start text-left">
            <div className="flex items-center gap-2">
              <Phone size={20} className="text-black" />
              <span>Mobile Number</span>
            </div>
            {editMode ? (
              <input
                type="text"
                value={userDetails.mobile_number}
                onChange={(e) => handleChange(e, "mobile_number")}
                className="text-primary font-satoshi-bold bg-white border border-disabled rounded-[12px] px-2 py-1 w-full"
              />
            ) : (
              <span className="text-primary font-satoshi-bold">
                {userDetails.mobile_number === null ||
                userDetails.mobile_number === "" ? (
                  <span className="text-gray-500 italic">Not Available</span>
                ) : userDetails.mobile_number ? (
                  userDetails.mobile_number
                ) : (
                  <CircularLoading />
                )}
              </span>
            )}
          </div>
        )}

{/* Student Number */}
<div className="flex flex-col items-start text-left">
  <div className="flex items-center gap-2">
    <IdCard size={20} className="text-black" />
    <span>Student Number</span>
  </div>
  <span className="text-primary font-satoshi-bold">
    {userDetails.student_number || (
      <div className="text-primary text-sm font-satoshi-bold bg-disabled border animate-pulse border-disabled rounded-[12px] px-2 py-1 w-[140px] h-[30px]"></div>
    )}
  </span>
</div>


        {/* Graduating Class */}
        {userDetails.user_type === "alumni" && (
  <div className="flex flex-col items-start text-left">
    <div className="flex items-center gap-2">
      <GraduationCap size={20} className="text-black" />
      <span>Graduating Class</span>
    </div>
    <div className="flex flex-row flex-wrap gap-2 w-full sm:w-[300px]">
      {editMode ? (
        // No input fields anymore, just remove them.
        <span className="text-primary font-satoshi-bold">
          {userDetails?.graduation_year &&
          userDetails?.graduation_semester ? (
            `${userDetails.graduation_year} - ${userDetails.graduation_semester}`
          ) : (
            <CircularLoading />
          )}
        </span>
      ) : (
        // Display the graduation year and semester as plain text
        <span className="text-primary font-satoshi-bold">
          {userDetails?.graduation_year &&
          userDetails?.graduation_semester ? (
            `${userDetails.graduation_year} - ${userDetails.graduation_semester}`
          ) : (
            <CircularLoading />
          )}
        </span>
      )}
    </div>
  </div>
)}


        {/* Marital Status */}
        {userDetails.is_verified && (
          <div className="flex flex-col items-start text-left">
            <div className="flex items-center gap-2">
              <Heart size={20} className="text-black" />
              <span>Marital Status</span>
            </div>
            {editMode ? (
              <select
                value={userDetails.marital_status}
                onChange={(e) => handleChange(e, "marital_status")}
                className="text-primary font-satoshi-bold bg-white border border-disabled rounded-[12px] px-2 py-1 w-full"
              >
                {maritalstat.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            ) : (
              <span className="text-primary font-satoshi-bold">
                {userDetails.marital_status === null ||
                userDetails.marital_status === "" ? (
                  <span className="text-gray-500 italic">Not Available</span>
                ) : userDetails.marital_status ? (
                  userDetails.marital_status
                ) : (
                  <CircularLoading />
                )}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalInfoSection;