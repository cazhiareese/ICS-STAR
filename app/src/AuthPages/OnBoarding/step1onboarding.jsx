import { useState, useEffect } from "react";
import "../../index.css";
import {User}  from 'lucide-react'
import Camera from "../../assets/onBoardingAssets/camera.png";
import { useOnboardingContext } from "../AuthContext/onboardingcontext";
function Step1Onboarding() {

  const [file, setFile] = useState(null);
  const [userImage, setUserImage] = useState("")
  const [image, setImage] = useState(null);
  const {currentSection, setCurrentSection} = useOnboardingContext()

    const processFile = (selectedFile) => {
      if (selectedFile) {
          const fileSize = (selectedFile.size / (1024 * 1024)).toFixed(2) + " MB"

          setFile(selectedFile)
          const reader = new FileReader();
          reader.onloadend = () => {
            setUserImage(reader.result);
          };
          reader.readAsDataURL(file);
          console.log("SJDFDS")

      }
    };

    const handleFileChange = (event) => {
      const file = event.target.files[0];
      if (!file) return; // Prevents errors if no file is selected
      setFile(file)
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserImage(reader.result);
      };
      reader.readAsDataURL(file);
    };

    return (
    <>

      <div className="flex flex-col space-y-3 items-center pt-15 sm:mx-30 mx-10">
        <label className="font-satoshi-bold md:text-5xl sm:text-3xl text-2xl text-left w-full">1. Update your profile</label>
        <label className="font-satoshi-light md:text-2xl sm:text-xl text-lg text-left w-full">Add a profile picture</label>
        <div className="flex flex-row md:h-50 mt-20 border border-gray-300 rounded-4xl md:w-175 sm:w-150 w-95 h-40">
            <div className="flex items-center justify-center rounded-full bg-white md:w-55 w-40 md:h-55 h-40 border-2 border-primary md:-mt-3 mt-0">
              {userImage=="" ? 
              (<User className="md:w-40 w-20 md:h-40 h-20 text-gray-300 rounded-full"/>):
              <img src={userImage} alt="Profile" className="md:w-55 w-20 md:h-55 h-20 rounded-full" />
              }
              <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden"
                  id="fileInput"
                  onChange={handleFileChange}
              />

              <label htmlFor="fileInput" className= "absolute pt-35 pl-45 w-55 cursor-pointer">
                <img src={Camera} />
              </label>

            </div>
           
            <div className="flex flex-col items-center justify-center flex-1">
              <label className="font-satoshi-bold md:text-3xl sm:text-2xl text-xl text-center ">Kiefer L. Tayawa</label>
              <label className="font-satoshi-light text-lg">kltayawa@up.edu.ph</label>
            </div>
        </div>
        <div className="flex flex-row items-center justify-center my-20 md:space-x-20 w-full sm:text-2xl text-xl">
          
          
          
          <div className="md:w-70 h-20 text-primary flex items-center justify-center rounded-3xl "
            onClick={()=>setCurrentSection(2)}
          >
                  <label className="font-satoshi-italic w-40">Skip for now</label>
          </div> 

          <div className="md:w-[70%]">

          </div> 
          <div className="w-70 sm:h-17 h-14 bg-primary text-white flex items-center justify-center rounded-3xl cursor-pointer"
              onClick={()=>setCurrentSection(2)}
          >
                  <label className="font-satoshi-bold cursor-pointer">Proceed</label>
          
          
          </div>
          
        </div>
          
        
      </div>
    </>
    
  );
}

export default Step1Onboarding;


