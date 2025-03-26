import React from 'react';
import { MapPin, Phone, IdCard, GraduationCap } from "lucide-react";
import SectionHeader from '../components/sectionheader';

function UserProfile() {
  return (
    <div className="flex flex-col items-center relative min-h-screen mt-10 gap-y-4">
        {/* Profile section */}
      <div className="w-[1100px] h-[226px] border border-disabled rounded-[10px] bg-[#FFFF] p-4 flex items-center justify-center">
        Profile Container
      </div>

{/* Nav Section */}
<div className="w-[1100px] h-[45px] border border-gray-300 rounded-[10px] bg--[#FFFF] p-2 flex items-center justify-start gap-7 mt-4 px-6 shadow-none">

  <span className="font-satoshi  text-[20px] leading-[30px] tracking-[-0.02em] text-gray-700 cursor-pointer hover:text-blue-600 transition">
    About
  </span>
  <span className="font-satoshi  text-[20px] leading-[30px] tracking-[-0.02em] text-gray-700 cursor-pointer hover:text-blue-600 transition">
    Work
  </span>
  <span className="font-satoshi  text-[20px] leading-[30px] tracking-[-0.02em] text-gray-700 cursor-pointer hover:text-blue-600 transition">
    Job Posted
  </span>
  <span className="font-satoshi text-[20px] leading-[30px] tracking-[-0.02em] text-gray-700 cursor-pointer hover:text-blue-600 transition">
    Donation History
  </span>
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