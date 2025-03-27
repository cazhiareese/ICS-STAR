import React from "react";
import { MapPin, Phone, IdCard, GraduationCap } from "lucide-react";
import SectionHeader from "../../../components/sectionheader";

const PersonalInfoSection = ({ editMode, userDetails, handleChange }) => {
  return (
    <div className="w-full max-w-[1100px] mt-6">
      <SectionHeader title="PERSONAL INFORMATION" />

      <div className="flex flex-wrap justify-between items-center mt-4 text-gray-700 text-[16px]">
        {/* Location */}
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
          <div className="flex items-center gap-2">
            <MapPin size={20} className="text-gray-600" />
            <span>Location</span>
          </div>
          {editMode ? (
            <input
              type="text"
              value={userDetails.location}
              onChange={(e) => handleChange(e, "location")}
              className="text-blue-700 font-medium bg-white border border-gray-300 rounded-md px-2 py-1"
            />
          ) : (
            <span className="text-blue-700 font-medium">{userDetails.location}</span>
          )}
        </div>

        {/* Mobile Number */}
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
          <div className="flex items-center gap-2">
            <Phone size={20} className="text-gray-600" />
            <span>Mobile Number</span>
          </div>
          {editMode ? (
            <input
              type="text"
              value={userDetails.mobile}
              onChange={(e) => handleChange(e, "mobile")}
              className="text-blue-700 font-medium bg-white border border-gray-300 rounded-md px-2 py-1"
            />
          ) : (
            <span className="text-blue-700 font-medium">{userDetails.mobile}</span>
          )}
        </div>

        {/* Student Number */}
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
          <div className="flex items-center gap-2">
            <IdCard size={20} className="text-gray-600" />
            <span>Student Number</span>
          </div>
          {editMode ? (
            <input
              type="text"
              value={userDetails.studentNumber}
              onChange={(e) => handleChange(e, "studentNumber")}
              className="text-blue-700 font-medium bg-white border border-gray-300 rounded-md px-2 py-1"
            />
          ) : (
            <span className="text-blue-700 font-medium">{userDetails.studentNumber}</span>
          )}
        </div>

        {/* Graduating Class */}
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
          <div className="flex items-center gap-2">
            <GraduationCap size={20} className="text-gray-600" />
            <span>Graduating Class</span>
          </div>
          {editMode ? (
            <input
              type="text"
              value={userDetails.graduatingClass}
              onChange={(e) => handleChange(e, "graduatingClass")}
              className="text-blue-700 font-medium bg-white border border-gray-300 rounded-md px-2 py-1"
            />
          ) : (
            <span className="text-blue-700 font-medium">{userDetails.graduatingClass}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoSection;
