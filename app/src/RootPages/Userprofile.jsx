import React from 'react';
import { MapPin, Phone, IdCard, GraduationCap } from "lucide-react";
import SectionHeader from '../components/sectionheader';

function UserProfile() {
  return (
    <div className="flex flex-col items-center relative min-h-screen mt-10 gap-y-4">
      <div className="w-[1100px] h-[226px] border border-gray-300 rounded-[10px] bg-white not-only-of-type:shadow-md p-4 flex items-center justify-center">
        Profile Container
      </div>
      <div className="w-[1100px] h-[45px] border border-gray-300 rounded-[10px] bg-white shadow-md p-2 flex items-center justify-center mt-4">
        Another Container
      </div>

      {/* Personal Information Section */}
      <div className="w-[1100px] mt-6 relative">
        <SectionHeader title="PERSONAL INFORMATION" />
      </div>
      <div className="w-[1100px] mt-6 relative">
        <SectionHeader title="SKILLS AND INTEREST" />
      </div>
      <div className="w-[1100px] mt-6 relative">
        <SectionHeader title="AFFILIATIONS" />
      </div>
      <div className="w-[1100px] mt-6 relative">
        <SectionHeader title="SCHOLARSHIPS" />
      </div>
    </div>
  );
}

export default UserProfile;