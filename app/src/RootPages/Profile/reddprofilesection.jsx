import React, { useState, useEffect } from "react";
import { updateSocialLinks } from "./UserProfileAPI/userProfileApi";
import {
  Camera,
  Facebook,
  Github,
  Linkedin,
  Pencil,
  Check,
  X,
  ShieldAlert
} from "lucide-react";
import SaveConfirmationModal from "./components/savemodal";
import CancelEditingModal from "./components/cancelmoda";
import { useNavigate } from "react-router-dom";

import defaultimage from "../../assets/defaultimage.jpg";
import ImageUploadModal from "./components/imageuploadmodal";
import CircularLoading from "../../components/LoadingComponents/circularloading";
import SocialLinksEditModal from "./components/sociallinksmoda";
import axios from "axios";
import ReportModal from "../../components/AdminComponents/ReportModal";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;


function AdminProfileSection({
  activeTab,
  editMode,
  userDetails,
  setEditMode,
  handleChange,
  share,
  userId,
}) {
  
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [originalEmail, setOriginalEmail] = useState(userDetails.email);
  const [profilePicture, setProfilePicture] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showSocialModal, setShowSocialModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);  // New state to control cancel modal visibility
  //console.log("ProfileSection userId:", userId);

    const [limitAccessLoading, setLimitAccessLoading] = useState(false);
    const [showReportsModal, setShowReportsModal] = useState(false);


    const [reports, setReports] = useState([]);
    const [limitAccessComplete, setLimitAccessComplete] = useState(false);
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile picture
  useEffect(() => {
    if (userId) {
      console.log("Fetching profile picture for:", userId);
      fetchProfilePicture();
    }
  }, [userId]); // ← re-run when userId is available
  

  const handleSocialLinksSave = async (links) => {
    console.log("Saving social links:", links);
    try {
      await updateSocialLinks(links);
      console.log("Social links updated");
    } catch (err) {
      console.error("Error updating links:", err);
    }
  };

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      if (!token) {
        setError("Authentication required");
        setLoading(false);
        navigate("/admin/login");
        return;
      }

      if (!userId) {
        setError("No user ID provided");
        setLoading(false);
        return;
      }

      try {

        const response = await axios.get(`${API_BASE_URL}/admin/report-logs/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const reportsData = response.data || [];
        setReports(reportsData);
        console.log("Reports data:", reportsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.response?.data?.message || "Failed to load user profile");
      } finally {
        setLoading(false);
      }
      };

      if (token) {
        fetchData();
      }

  }, [userId, token, navigate]);


  const fetchProfilePicture = async () => {
    if (!userId) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("User not authenticated");
        return;
      }

      const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

      const response = await fetch(`${API_BASE_URL}/profile-picture/${userId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        console.log(response);
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

  // Handle cancel edit
  const handleCancel = () => {
    setShowCancelModal(true); // Show cancel modal when user clicks "Cancel Edit"
  };

  const handleCancelConfirm = () => {
    setEditMode(false);  // Set edit mode to false
    setShowCancelModal(false);  // Close the cancel modal
  };

  const handleCancelClose = () => {
    setShowCancelModal(false);  // Close the cancel modal without any changes
  };



  async function limitAccountAccess() {
    setLimitAccessLoading(true);
    try {
      await axios.put(`${API_BASE_URL}/admin/ban/${userId}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      handleChange({ target: { value: true } }, 'is_banned');
    } catch (error) {
      console.error("Error limiting account access:", error);
      setError("Failed to limit account access");
    } finally {
      setLimitAccessLoading(false);
      setShowReportsModal(false);
    }
  }

  return (
    <div
      className={`relative w-full max-w-[1100px] border border-disabled rounded-[10px] p-6 flex flex-col sm:flex-row items-center sm:justify-between ${
        userDetails?.is_verified ? "bg-whitey" : "bg-white"
      }`}
    >
      {/* Edit / Save / Cancel Buttons */}
      {activeTab === "About" && userDetails?.is_verified && (
  <div className="absolute top-4 right-4 z-10 flex flex-col-reverse sm:flex-row-reverse sm:gap-2 gap-1">
    {share ? (
      // New button shown only when viewing shared profile
      <button
      className="hidden lg:flex flex-row gap-2 ml-auto text-error font-satoshi-medium cursor-pointer"
      onClick={() => setShowReportsModal(true)}
    >
      <p className="hidden lg:block">View Report Logs</p>
      <ShieldAlert />
    </button>
    ) : editMode ? (
      <>
        {/* Save Button */}
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[14px] sm:text-[16px] font-medium bg-primary text-white hover:bg-hover transition"
        >
          <Check size={18} className="text-white" />
          <span className="hidden sm:inline text-neutral">Save Profile</span>
        </button>

        {/* Cancel Button */}
        <button
          onClick={handleCancel}
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[14px] sm:text-[16px] font-medium bg-bg-disabled text-black border border-primary hover:bg-disabled transition"
        >
          <X size={18} className="text-error" />
          <span className="hidden sm:inline">Cancel Edit</span>
        </button>
      </>
    ) : (
      <button
        onClick={() => setEditMode(true)}
        className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[14px] sm:text-[16px] font-medium bg-primary text-white hover:bg-hover transition"
      >
        <Pencil size={18} />
        <span className="hidden sm:inline text-neutral">Edit Profile</span>
      </button>
    )}
  </div>
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
          {!share && userDetails?.is_verified && (
            <Camera
              size={32}
              className="absolute bottom-6 right-0 transform translate-x-1 text-white bg-black w-8 h-8 rounded-full p-[4px] cursor-pointer hover:bg-hover border-2 border-white z-10"
              onClick={() => setShowUploadModal(true)}
            />
          )}
        </span>

        {/* Name, Email, and Social Icons */}
        <div className="flex flex-col items-start gap-1 text-left">
          {editMode ? (
            <>
              <input
                type="text"
                value={userDetails.first_name || ""}
                onChange={(e) => handleChange(e, "first_name")}
                className="w-full text-[24px] sm:text-[32px] font-bold text-primary bg-white border border-disabled rounded-[12px] px-2 py-1"
              />
              <input
                type="text"
                value={userDetails.last_name || ""}
                onChange={(e) => handleChange(e, "last_name")}
                className="w-full text-[24px] sm:text-[32px] font-bold text-primary bg-white border border-disabled rounded-[12px] px-2 py-1"
              />
              {userDetails.email ? (
                <p className="text-[16px] sm:text-[20px] text-black font-satoshi-regular">
                  {userDetails.email}
                </p>
              ) : (
                <div className="w-[150px] h-[20px] sm:w-[200px] sm:h-[24px] bg-disabled animate-pulse rounded-[12px]" />
              )}

            </>
          ) : (
            <>
              {userDetails.first_name && userDetails.last_name ? (
                <h2 className="font-bold text-[24px] sm:text-[32px] text-primary leading-tight">
                  {userDetails.first_name} {userDetails.last_name}
                </h2>
              ) : (
                <div className="w-[200px] h-[32px] sm:w-[300px] sm:h-[40px] bg-disabled animate-pulse rounded-[12px]" />
              )}
              {userDetails.email ? (
                <p className="text-[16px] sm:text-[20px] text-black">
                  {userDetails.email}
                </p>
              ) : (
                <div className="w-[150px] h-[20px] sm:w-[200px] sm:h-[24px] bg-disabled animate-pulse rounded-[12px]" />
              )}
            </>
          )}

          {/* Social Media */}
          {userDetails?.is_verified && (
            <div
              className={
                editMode
                  ? "bg-white border border-disabled rounded-[12px] px-2 py-1 mt-2 group cursor-pointer hover:bg-hover transition"
                  : "mt-2"
              }
              onClick={editMode ? () => setShowSocialModal(true) : undefined}
            >
              <div
                className={`flex gap-3 mt-1 ${
                  editMode ? "pointer-events-none" : ""
                }`}
              >
                {userDetails.facebook && (
                  <a
                    href={userDetails.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="w-7 h-7 flex items-center justify-center bg-black rounded-full hover:bg-hover transition">
                      <Facebook size={20} className="text-white" />
                    </span>
                  </a>
                )}
                {userDetails.github && (
                  <a
                    href={userDetails.github}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="w-7 h-7 flex items-center justify-center bg-black rounded-full hover:bg-hover transition">
                      <Github size={20} className="text-white" />
                    </span>
                  </a>
                )}
                {userDetails.linkedin && (
                  <a
                    href={userDetails.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="w-7 h-7 flex items-center justify-center bg-black rounded-full hover:bg-hover transition">
                      <Linkedin size={20} className="text-white" />
                    </span>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <SaveConfirmationModal
        isOpen={showModal}
        onConfirm={handleSave}
        onCancel={() => setShowModal(false)}
        emailChanged={userDetails.email !== originalEmail}
        text={"save"}
      />

      <ImageUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleUpload}
      />

      <SocialLinksEditModal
        isOpen={showSocialModal}
        onClose={() => setShowSocialModal(false)}
        onSaveLinks={handleSocialLinksSave}
        userDetails={userDetails}
      />

      {/* Cancel Editing Modal */}
      <CancelEditingModal
        isOpen={showCancelModal}
        onConfirm={handleCancelConfirm}
        onCancel={handleCancelClose}
      />

<ReportModal
        isOpen={showReportsModal}
        onClose={() => {
          setShowReportsModal(false);
          setLimitAccessComplete(false);
        }}
        reports={reports}
        onLimitAccess={limitAccountAccess}
        isLoading={limitAccessLoading}
        isComplete={limitAccessComplete}
        isBanned={userDetails?.is_banned}
      />


    </div>
  );
}

export default AdminProfileSection;
