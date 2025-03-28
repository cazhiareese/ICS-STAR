import React, { useState } from "react";
import { Camera, Facebook, Github, Linkedin, Pencil, Check } from "lucide-react";
import SaveConfirmationModal from "./components/savemodal";
import prince from "../../assets/prince boy.jpg";

function ProfileSection({ editMode, userDetails, setEditMode, handleChange }) {
  const [showModal, setShowModal] = useState(false);
  const [originalEmail, setOriginalEmail] = useState(userDetails.email);

  const handleSave = () => {
    setShowModal(false);
    setEditMode(false);
    // Save logic can be added here
  };

  return (
    <div className="relative w-full max-w-[1100px] border border-gray-300 rounded-[10px] bg-whitey p-6 flex flex-col sm:flex-row items-center sm:justify-between">
      
      {/* Edit / Save Profile Button */}
      <button
        onClick={() => {
          if (editMode) {
            setShowModal(true); // Show modal when saving
          } else {
            setEditMode(true);
          }
        }}
        className="absolute top-4 right-4 z-10 inline-flex items-center gap-2 rounded-full px-4 py-2 text-[14px] sm:text-[16px] font-medium transition cursor-pointer w-auto h-auto 
        bg-blue-700 text-white hover:bg-blue-800"
      >
        {editMode ? (
          <Check size={18} className="text-white pointer-events-none" />
        ) : (
          <Pencil size={18} className="pointer-events-none" />
        )}
        <span className="hidden sm:inline pointer-events-none">
          {editMode ? "Save Profile" : "Edit Profile"}
        </span>
      </button>

      {/* Profile Section */}
      <div className="relative flex flex-row items-center gap-4 sm:gap-6 w-full">
        {/* Profile Image */}
        <div className="relative w-[140px] h-[140px] sm:w-[160px] sm:h-[160px] rounded-full border border-black flex items-center justify-center overflow-hidden">
          <img src={prince} alt="Profile" className="w-full h-full object-cover" />
          <div className="absolute bottom-1 right-1 bg-white p-[6px] rounded-full shadow-md cursor-pointer">
            <Camera size={16} className="text-gray-600" />
          </div>
        </div>

        {/* Name, Email, and Social Icons */}
        <div className="flex flex-col items-start gap-1 text-left">
          {editMode ? (
            <>
              <input
                type="text"
                value={userDetails.firstName}
                onChange={(e) => handleChange(e, "firstName")}
                className="w-full text-[24px] sm:text-[32px] font-bold text-primary bg-white border border-gray-300 rounded-md px-2 py-1"
              />
              <input
                type="text"
                value={userDetails.lastName}
                onChange={(e) => handleChange(e, "lastName")}
                className="w-full text-[24px] sm:text-[32px] font-bold text-primary bg-white border border-gray-300 rounded-md px-2 py-1"
              />
              <input
                type="email"
                value={userDetails.email}
                onChange={(e) => handleChange(e, "email")}
                className="w-full text-[16px] sm:text-[20px] text-black bg-white border border-gray-300 rounded-md px-2 py-1"
              />
            </>
          ) : (
            <>
              <h2 className="font-bold text-[24px] sm:text-[32px] text-primary leading-tight">
                {userDetails.firstName} {userDetails.lastName}
              </h2>
              <p className="text-[16px] sm:text-[20px] text-black">{userDetails.email}</p>
            </>
          )}

          {/* Social Icons */}
          <div className="flex gap-3 mt-1">
            <Facebook size={22} className="text-black cursor-pointer hover:text-blue-600" />
            <Github size={22} className="text-black cursor-pointer hover:text-blue-600" />
            <Linkedin size={22} className="text-black cursor-pointer hover:text-blue-600" />
          </div>
        </div>
      </div>

      {/* Modal Component */}
      <SaveConfirmationModal
        isOpen={showModal}
        onConfirm={handleSave}
        onCancel={() => setShowModal(false)}
        emailChanged={userDetails.email !== originalEmail}
      />
    </div>
  );
}

export default ProfileSection;
