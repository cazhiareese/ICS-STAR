import React from "react";
import { MapPin, Phone, IdCard, GraduationCap } from "lucide-react";
import SectionHeader from "../components/sectionheader";

const PersonalInfoSection = ({ editMode, userDetails, handleChange }) => {
  return (
    <div className="w-full max-w-[1100px] mt-6">
      <SectionHeader title="PERSONAL INFORMATION" />

      {/* Responsive Grid Layout */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-black text-[16px] font-satoshi-medium">
        {/* Location */}
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
            <span className="text-primary font-satoshi-bold">{userDetails.location}</span>
          )}
        </div>

        {/* Mobile Number */}
        <div className="flex flex-col items-start text-left">
          <div className="flex items-center gap-2">
            <Phone size={20} className="text-black" />
            <span>Mobile Number</span>
          </div>
          {editMode ? (
            <input
              type="text"
              value={userDetails.mobile}
              onChange={(e) => handleChange(e, "mobile")}
              className="text-primary font-satoshi-bold bg-white border border-disabled rounded-[12px] px-2 py-1 w-full"
            />
          ) : (
            <span className="text-primary font-satoshi-bold">{userDetails.mobile}</span>
          )}
        </div>

        {/* Student Number */}
        <div className="flex flex-col items-start text-left">
          <div className="flex items-center gap-2">
            <IdCard size={20} className="text-black" />
            <span>Student Number</span>
          </div>
          {editMode ? (
            <input
              type="text"
              value={userDetails.studentNumber}
              onChange={(e) => handleChange(e, "studentNumber")}
              className="text-primary font-satoshi-bold bg-white border border-disabled rounded-[12px] px-2 py-1 w-full"
            />
          ) : (
            <span className="text-primary font-satoshi-bold">{userDetails.studentNumber}</span>
          )}
        </div>

        {/* Graduating Class */}
        <div className="flex flex-col items-start text-left">
          <div className="flex items-center gap-2">
            <GraduationCap size={20} className="text-black" />
            <span>Graduating Class</span>
          </div>
          {editMode ? (
            <input
              type="text"
              value={userDetails.graduatingClass}
              onChange={(e) => handleChange(e, "graduatingClass")}
              className="text-primary font-satoshi-bold bg-white border border-disabled rounded-[12px] px-2 py-1 w-full"
            />
          ) : (
            <span className="text-primary font-satoshi-bold">{userDetails.graduatingClass}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoSection;
