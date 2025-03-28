import React from "react";
import { Camera, Facebook, Github, Linkedin, Pencil } from "lucide-react";
import prince from "../../assets/prince boy.jpg";

function ProfileSection({ editMode, userDetails, setEditMode, handleChange }) {
  return (
    <div className="relative w-full max-w-[1100px] border border-gray-300 rounded-[10px] bg-white p-6 flex flex-col sm:flex-row items-center sm:justify-between">
      
      {/* Edit Profile Button - Positioned on Top Right */}
      <button
        onClick={() => setEditMode(!editMode)}
        className="absolute top-4 right-4  flex items-center gap-2 px-4 py-1 bg-blue-700 text-white rounded-full text-[16px] font-small hover:bg-blue-800 transition"
      >
        <Pencil size={15} /> {editMode ? "Done Editing" : "Edit Profile"}
      </button>

      {/* Left Section: Profile Picture */}
      <div className="relative flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto">
        <div className="relative w-[140px] sm:w-[160px] h-[140px] sm:h-[160px] rounded-full border-[1.5px] border-black flex items-center justify-center overflow-hidden mx-4">
          <img src={prince} alt="Profile" className="w-full h-full object-cover" />
          
          {/* Camera Icon Overlay */}
          <div className="absolute bottom-1 right-1 bg-white p-1 rounded-full shadow-md cursor-pointer">
            <Camera size={18} className="text-gray-600" />
          </div>
        </div>

        {/* Name and Email */}
        <div className="flex flex-col items-center sm:items-start gap-2 text-center sm:text-left">
          {editMode ? (
            <>
              <input
                type="text"
                value={userDetails.firstName}
                onChange={(e) => handleChange(e, "firstName")}
                className="text-[24px] sm:text-[32px] font-satoshi-black text-primary bg-white border border-gray-300 rounded-md px-2 py-1 text-center sm:text-left"
              />
              <input
                type="text"
                value={userDetails.lastName}
                onChange={(e) => handleChange(e, "lastName")}
                className="text-[24px] sm:text-[32px] font-satoshi-black text-primary bg-white border border-gray-300 rounded-md px-2 py-1 text-center sm:text-left"
              />
              <input
                type="email"
                value={userDetails.email}
                onChange={(e) => handleChange(e, "email")}
                className="text-[18px] sm:text-[24px] font-satoshi-medium text-black bg-white border border-gray-300 rounded-md px-2 py-1 text-center sm:text-left"
              />
            </>
          ) : (
            <>
              <h2 className="font-satoshi-black text-[24px] sm:text-[32px] leading-[22px] tracking-[-0.02em] text-primary">
                {userDetails.firstName} {userDetails.lastName}
              </h2>
              <p className="font-satoshi-medium text-[18px] sm:text-[24px] leading-[22px] tracking-[-0.02em] text-black">
                {userDetails.email}
              </p>
            </>
          )}

          {/* Social Icons */}
          <div className="flex gap-4">
            <Facebook size={24} className="text-black cursor-pointer hover:text-blue-600" />
            <Github size={24} className="text-black cursor-pointer hover:text-blue-600" />
            <Linkedin size={24} className="text-black cursor-pointer hover:text-blue-600" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileSection;
