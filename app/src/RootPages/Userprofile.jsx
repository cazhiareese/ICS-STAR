import React from 'react';
import { MapPin, Phone, IdCard, GraduationCap } from "lucide-react";

function UserProfile() {
  return (
    <div className="flex flex-col items-center relative min-h-screen justify-center">
      <div>Profile</div>
      <div className="w-[1100px] h-[226px] border border-gray-300 rounded-[10px] bg-gray-200 shadow-md p-4 flex items-center justify-center">
        Profile Container
      </div>
      <div className="w-[1100px] h-[45px] border border-gray-300 rounded-[10px] bg-gray-200 shadow-md p-2 flex items-center justify-center mt-4">
        Another Container
      </div>
      <div>nav</div>
      
      {/* Personal Information Section */}
      <div className="w-[1100px] mt-6 relative">
        <h2 className="text-lg font-bold text-gray-800 ">PERSONAL INFORMATION</h2>
        <div className="w-full border-t border-gray-300 "></div> 
        <div className="flex justify-between mt-4 text-gray-700">
          <div className="flex items-center gap-2">
            <MapPin size={18} />
            <span>Location</span>
            <a href="#" className="text-blue-600 font-semibold">Manila, PH</a>
          </div>
          <div className="flex items-center gap-2">
            <Phone size={18} />
            <span>Mobile Number</span>
            <a href="#" className="text-blue-600 font-semibold">09123456789</a>
          </div>
          <div className="flex items-center gap-2">
            <IdCard size={18} />
            <span>Student Number</span>
            <a href="#" className="text-blue-600 font-semibold">1234-56789</a>
          </div>
          <div className="flex items-center gap-2">
            <GraduationCap size={18} />
            <span>Graduating Class</span>
            <a href="#" className="text-blue-600 font-semibold">2022 - 1st Semester</a>
          </div>
        </div>
      </div>
      
      <div>Skills and Interest</div>
      <div>Affiliations</div>
      <div>Scholarships</div>
    </div>
  );
}

export default UserProfile;