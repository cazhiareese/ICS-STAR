import { useState, useEffect, useRef } from "react";
import "../../index.css";
import { User } from 'lucide-react'
import Camera from "../../assets/onBoardingAssets/camera.png";
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
      <div className="flex flex-col space-y-3 items-center pt-15 sm:mx-30 mx-10">
        <label className="font-satoshi-bold md:text-5xl sm:text-3xl text-3xl text-left w-full">1. Update your profile</label>
        <label className="font-satoshi-light md:text-2xl sm:text-xl text-lg text-left w-full">Add a profile picture</label>
        <div className="flex flex-row md:h-50 mt-20 border border-gray-300 rounded-4xl md:w-155 sm:w-120 w-90 h-40">
          <div className="relative flex items-center justify-center rounded-full md:w-55 w-40 md:h-55 h-40 border-2 border-primary md:-mt-3 mt-0 ">
            <div className="w-full h-full flex justify-center items-center">
              <label htmlFor="fileInput" className="absolute bottom-0 left-0 md:pl-40 pl-30 w-55 cursor-pointer">
                <img src={Camera} />
              </label>
              {userData.profilePicture == null ? 
                (<User className="md:w-40 w-20 md:h-40 h-20 text-gray-300 rounded-full"/>) : 
                (<img src={userData.profilePicture} alt="Profile" className="md:w-55 w-40 md:h-55 h-40 rounded-full" />)
              }
              <input 
                type="file" 
                accept="image/*" 
                className="hidden"
                id="fileInput"
                onChange={handleFileChange}
              />
            </div>
          </div>
          <div className="flex flex-col items-center justify-center flex-1">
            <label className="font-satoshi-bold md:text-3xl sm:text-2xl text-xl text-center ">{name}</label>
            <label className="font-satoshi-light text-lg">{email}</label>
          </div>
        </div>
        <div className="flex flex-row items-center justify-center my-20 md:space-x-20 w-full sm:text-2xl text-xl">
          <div className="md:w-70 h-20 text-primary flex items-center justify-center rounded-3xl "
            onClick={() => setCurrentSection(2)}
          >
            <label className="font-satoshi-italic w-40">Skip for now</label>
          </div>
          <div className="w-70 sm:h-17 h-14 bg-primary text-white flex items-center justify-center rounded-3xl cursor-pointer"
            onClick={() => { 
              if (file != null) {
                submitStep1(); // Submit the profile picture
              } else {
                setCurrentSection(2); // Skip to next section if no image selected
              }
            }}
          >
            <label className="font-satoshi-bold cursor-pointer">Proceed</label>
          </div>
        </div>
      </div>
    </>
  );
}

export default Step1Onboarding;
