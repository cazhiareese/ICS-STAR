import { useState, useEffect, useRef } from "react";
import "../../index.css";
import { User, Camera } from 'lucide-react'
// import Camera from "../../assets/onBoardingAssets/camera.png";
import { useOnboardingContext } from "../AuthContext/onboardingcontext";
import Unathorized from "../Unauthorized";

function Step1Onboarding() {
  const [file, setFile] = useState(null);
  const { currentSection, setCurrentSection, name, email, userData, updateUserData } = useOnboardingContext();
  const [selectPicture, setSelectPicture] = useState(false);

  const token = localStorage.getItem("token");

  // Handle file input change to update the profile picture directly
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return; // Prevents errors if no file is selected
    setFile(file);
    setSelectPicture(true);

    const reader = new FileReader();
    reader.onloadend = () => {
      // Directly update the user's profile picture and file in the user data
      updateUserData("profilePicture", reader.result);
      updateUserData("profilePictureFile", file);
    };
    reader.readAsDataURL(file);
  };

  // Submit the profile picture
  const submitStep1 = async (e) => {
    try {
      const formData = new FormData();
      formData.append("file", userData.profilePictureFile);

      const baseURL = import.meta.env.VITE_BACKEND_URL;

      const response = await fetch(`${baseURL}upload-profile-picture`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        alert("Profile Submission Successful!");
        setCurrentSection(2);
      } else {
        alert(data.message || JSON.stringify(data) || "Registration failed!");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <>
      <div className="flex flex-col space-y-3 items-center pt-15 sm:mx-30 mx-10 bg-white">
        <label className="font-satoshi-bold md:text-5xl text-3xl text-center md:text-left w-full">Update your profile</label>
        <label className="font-satoshi-light md:text-2xl text-xl text-center md:text-left w-full">Add a profile picture</label>
        <div className="relative flex flex-row items-center justify-center md:h-45 mt-20 border border-gray-300 rounded-4xl md:w-155 sm:w-120 w-90 h-30 bg-neutral-100">
          <div className="absolute -left-1 md:-left-8 flex items-center justify-center rounded-full md:w-55 w-40 md:h-55 h-40 border-2 border-primary md:-mt-3 mt-0 bg-white drop-shadow-lg">
            <div className="relative inline-block">
              {userData.profilePicture == null ? 
                (<User className="md:w-40 w-20 md:h-40 h-20 text-gray-300 rounded-full"/>) : 
                (<img src={userData.profilePicture} alt="Profile" className="md:w-55 w-40 md:h-55 h-40 rounded-full" />)
              }
              <button
                type="button"
                className="absolute -bottom-8 -right-7 w-10 h-10 md:w-16 md:h-16 flex items-center justify-center bg-primary rounded-full cursor-pointer"
                onClick={() => document.getElementById('fileInput').click()}
              >
                <Camera className="text-white w-5 h-5 md:w-8 md:h-8"/>
              </button>
              <input 
                type="file" 
                accept="image/*" 
                className="hidden"
                id="fileInput"
                onChange={handleFileChange}
              />
            </div>
          </div>
          <div className="w-30 sm:w-40 md:w-45 h-full"></div>
          <div className="flex flex-col items-center justify-center flex-1">
            <label className="font-satoshi-bold md:text-3xl sm:text-2xl text-xl text-center ">{name}</label>
            <label className="font-satoshi-light text-lg">{email}</label>
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:justify-between items-center justify-center my-20 w-full">
          <button
            type="button"
            className="font-satoshi-bold text-white text-sm bg-primary flex items-center justify-center w-40 pl-15 pr-15 pt-3 pb-3 rounded-2xl md:order-2 hover:bg-hover cursor-pointer"
            onClick={() => { 
              if (file != null) {
                submitStep1(); // Submit the profile picture
              } else {
                setCurrentSection(2); // Skip to next section if no image selected
              }
            }}
          >
            Proceed
          </button>
          <button
            type="button"
            className="font-satoshi-italic text-primary flex items-center justify-center w-40 p-5 text-sm underline md:order-1 flex-nowrap hover:text-hover cursor-pointer"
            onClick={() => setCurrentSection(2)}
             >
              Skip for now
          </ button>
        </div>
      </div>
    </>
  );
}

export default Step1Onboarding;
