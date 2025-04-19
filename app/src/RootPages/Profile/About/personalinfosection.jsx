import React from "react";
import { MapPin, Phone, IdCard, GraduationCap, Heart } from "lucide-react";
import SectionHeader from "../components/sectionheader";

const semester = ["1st Semester", "2nd Semester", "Mid Semester"];
const years = Array.from({ length: 2025 - 1990 + 1 }, (_, i) => 1990 + i);
const maritalstat = ["Single", "Maried", "Divorced", "Widowed"];
const standings = ["Freshman", "Sophomore", "Junior", "Senior"];
import CircularLoading from "../../../components/LoadingComponents/circularloading";
import SkeletonLoading from "../../../components/LoadingComponents/skeletonloading";

const PersonalInfoSection = ({ editMode, userDetails, handleChange }) => {

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
      <input
        type="text"
        value={userDetails.location}
        onChange={(e) => handleChange(e, "location")}
        className="text-primary font-satoshi-bold bg-white border border-disabled rounded-[12px] px-2 py-1 w-full"
      />
    ) : (
      <span className="text-primary font-satoshi-bold">
        {userDetails.location || <CircularLoading />}
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
          {editMode ? (
            <input
              type="text"
              value={userDetails.student_number}
              onChange={(e) => handleChange(e, "student_number")}
              className="text-primary font-satoshi-bold bg-white border border-disabled rounded-[12px] px-2 py-1 w-full"
            />
          ) : (
            <span className="text-primary font-satoshi-bold">
              {userDetails.student_number || <CircularLoading />}
            </span>
          )}
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
                <>
                  <select
                    value={userDetails.graduation_year}
                    onChange={(e) => handleChange(e, "graduation_year")}
                    className="text-primary text-sm font-satoshi-bold bg-white border border-disabled rounded-[12px] px-2 py-1 w-[80px] sm:w-[50x] h-[32px]"
                  >
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                  <select
                    value={userDetails.graduation_semester}
                    onChange={(e) => handleChange(e, "graduation_semester")}
                    className="text-primary text-sm font-satoshi-bold bg-white border border-disabled rounded-[12px] px-2 py-1 min-w-[128px] sm:w-[80px] h-[32px]"
                  >
                    {semester.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </>
              ) : (
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
