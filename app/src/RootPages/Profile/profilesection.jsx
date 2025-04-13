import React, { useState, useEffect } from "react";
import {
  Camera,
  Facebook,
  Github,
  Linkedin,
  Pencil,
  Check,
} from "lucide-react";
import SaveConfirmationModal from "./components/savemodal";

import defaultimage from "../../assets/defaultimage.jpg";
import ImageUploadModal from "./components/imageuploadmodal";
import CircularLoading from "../../components/LoadingComponents/circularloading";

function ProfileSection({
  activeTab,
  editMode,
  userDetails,
  setEditMode,
  handleChange,
}) {
  const [showModal, setShowModal] = useState(false);
  const [originalEmail, setOriginalEmail] = useState(userDetails.email);
  const [profilePicture, setProfilePicture] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  //fetch user profile picture, can be removed since it can easily be accessed from the userdetails
  useEffect(() => {
    console.log("Fetching profile picture...");
    fetchProfilePicture();
    setProfilePicture(userDetails.profile_picture);
  }, []);

  const fetchProfilePicture = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("User not authenticated");
        return;
      }

      const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

      const response = await fetch(`${API_BASE_URL}/profile-picture`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        setProfilePicture(result.profile_picture || defaultimage);
      } else {
        console.error("Failed to fetch profile picture");
      }
    } catch (err) {
      console.error("Error while fetching profile picture:", err);
    }
  };

  const handleSave = () => {
    setShowModal(false);
    setEditMode(false);
    setOriginalEmail(userDetails.email);
    saveProfile();
  };

  const saveProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("User not authenticated");
        return;
      }

      const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

      const currentFormData = {
        first_name: userDetails.first_name || "",
        last_name: userDetails.last_name || "",
        email: userDetails.email || "",
        mobile_number: userDetails.mobile_number || "",
        city: userDetails.city || "",
        state: userDetails.state || "",
        country: userDetails.country || "",
        marital_status: userDetails.marital_status || "",
        facebook: userDetails.facebook || "",
        linkedin: userDetails.linkedin || "",
        github: userDetails.github || "",
      };

      const urlEncodedData = new URLSearchParams(currentFormData).toString();

      console.log("🔍 Final Request Body:", urlEncodedData);
      

      const response = await fetch(`${API_BASE_URL}/profile/edit`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${token}`,
        },
        body: urlEncodedData,
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const result = await response.json();
      console.log(result.message);
      setEditMode(false);
    } catch (err) {
      console.error(err);
      setError("Failed to update profile");
    }
  };

  const handleUpload = (imageUrl) => {
    setProfilePicture(imageUrl);
    console.log("Profile picture updated:", imageUrl);
    fetchProfilePicture();
  };

  return (
    <div className="relative w-full max-w-[1100px] border border-disabled rounded-[10px] bg-whitey p-6 flex flex-col sm:flex-row items-center sm:justify-between">
      {/* Edit / Save Profile Button - only visible on "About" tab */}
      {activeTab === "About" && (
  <button
    onClick={() => {
      if (userDetails?.is_verified) {
        if (editMode) {
          setShowModal(true);
        } else {
          setEditMode(true);
        }
      }
    }}
    disabled={!userDetails?.is_verified}
    className={`absolute top-4 right-4 z-10 inline-flex items-center gap-2 rounded-full px-4 py-2 text-[14px] sm:text-[16px] font-medium transition cursor-pointer w-auto h-auto
      ${userDetails?.is_verified ? "bg-primary text-white hover:bg-hover" : "bg-bg-disabled text-neutral-c cursor-not-allowed"}`}
  >
    {editMode ? (
      <Check size={18} className={`${userDetails?.is_verified ? "text-white" : "text-neutral"} pointer-events-none`} />
    ) : (
      <Pencil size={18} className={`${userDetails?.is_verified ? "" : "text-neutral"} pointer-events-none`} />
    )}
    <span className="hidden sm:inline pointer-events-none text-neutral">
      {editMode ? "Save Profile" : "Edit Profile"}
    </span>
  </button>
)}


      {/* Profile Section */}
      <div className="relative flex flex-row items-center gap-4 sm:gap-6 w-full">
        {/* Profile Image */}
        <span className="relative">
          <span className="w-[140px] h-[140px] sm:w-[160px] sm:h-[160px] rounded-full border border-black flex items-center justify-center overflow-hidden">
            <img
              src={profilePicture || defaultimage}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </span>
          <Camera
            size={32}
            className="absolute bottom-6 right-0 transform translate-x-1 text-white bg-black w-8 h-8 rounded-full p-[4px] cursor-pointer hover:bg-hover border-2 border-white z-10"
            onClick={() => setShowUploadModal(true)}
          />
        </span>

        {/* Name, Email, and Social Icons */}
        <div className="flex flex-col items-start gap-1 text-left">
          {editMode ? (
            <>
              <input
                type="text"
                value={userDetails.first_name}
                onChange={(e) => handleChange(e, "first_name")}
                className="w-full text-[24px] sm:text-[32px] font-bold text-primary bg-white border border-disabled rounded-[12px] px-2 py-1"
              />
              <input
                type="text"
                value={userDetails.last_name}
                onChange={(e) => handleChange(e, "last_name")}
                className="w-full text-[24px] sm:text-[32px] font-bold text-primary bg-white border border-disabled rounded-[12px] px-2 py-1"
              />
              <input
                type="email"
                value={userDetails.email}
                onChange={(e) => handleChange(e, "email")}
                className="w-full text-[16px] sm:text-[20px] text-black bg-white border border-disabled rounded-[12px] px-2 py-1"
              />
            </>
          ) : (
            <>
              {userDetails.first_name && userDetails.last_name ? (
                <h2 className="font-bold text-[24px] sm:text-[32px] text-primary leading-tight">
                  {userDetails.first_name} {userDetails.last_name}
                </h2>
              ) : (
                <CircularLoading />
              )}

              <p className="text-[16px] sm:text-[20px] text-black">
                {userDetails.email}
              </p>
            </>
          )}

{/* Social Icons */}
{userDetails?.is_verified && (
  <div className="flex gap-3 mt-1">
    <span className="w-7 h-7 flex items-center justify-center bg-black rounded-full cursor-pointer hover:bg-hover transition">
      <Facebook size={20} className="text-white" />
    </span>
    <span className="w-7 h-7 flex items-center justify-center bg-black rounded-full cursor-pointer hover:bg-hover transition">
      <Github size={20} className="text-white" />
    </span>
    <span className="w-7 h-7 flex items-center justify-center bg-black rounded-full cursor-pointer hover:bg-hover transition">
      <Linkedin size={20} className="text-white" />
    </span>
  </div>
)}


        </div>
      </div>

      {/* Modal Component */}
      <SaveConfirmationModal
        isOpen={showModal}
        onConfirm={handleSave}
        onCancel={() => setShowModal(false)}
        emailChanged={userDetails.email !== originalEmail}
      />

      <ImageUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleUpload}
      />
    </div>
  );
}

export default ProfileSection;
