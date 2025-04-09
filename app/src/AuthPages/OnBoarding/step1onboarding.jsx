import { useState, useEffect, useRef } from "react";
import "../../index.css";
import {User}  from 'lucide-react'
import Camera from "../../assets/onBoardingAssets/camera.png";
import { useOnboardingContext } from "../AuthContext/onboardingcontext";
function Step1Onboarding() {
  const canvasRef = useRef(null);
  const [file, setFile] = useState(null);
  const [userImage, setUserImage] = useState("")
  const {currentSection, setCurrentSection, name, email, userData, updateUserData} = useOnboardingContext()
  const [selectPicture, setSelectPicture] = useState(false)
  



  // For Editing of userProfile
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const imageRef = useRef(null);
  const containerRef = useRef(null);
  const [zoom, setZoom] = useState(1); // zoom scale 1 = 100%
  const [brightness, setBrightness] = useState(100); // 100% means no change
  const [contrast, setContrast] = useState(100); // 100% means no change
  const [saturation, setSaturation] = useState(100); // 100% means no change
  const [imageLoaded, setImageLoaded] = useState(false);
  const [editImage, setEditImage] = useState(null);  // This will store the ongoing edits


  const token = localStorage.getItem("token");
  console.log(token)

  const [editType, setEditType] = useState("Crop");

    // Handle dragging
    const handleMouseDown = (e) => {
      e.preventDefault();
      setIsDragging(true);
      imageRef.current.startX = e.clientX - position.x;
      imageRef.current.startY = e.clientY - position.y;
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const x = e.clientX - imageRef.current.startX;
      const y = e.clientY - imageRef.current.startY;

      setPosition({ x, y });
      // updateEditImage(canvasRef.current);
    };
    const handleImageLoad = () => {
      setImageLoaded(true); // Set imageLoaded state to true when the image is loaded
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };
  
    useEffect(() => {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }, [isDragging]);
    

    const captureImage = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!canvas || !imageRef.current || !containerRef.current || !imageLoaded) return;

      const image = imageRef.current;
      const container = containerRef.current;
      const containerWidth = container.offsetWidth;
      const containerHeight = container.offsetHeight;

      const L = containerWidth * 0.6;
      canvas.width = L;
      canvas.height = L;

      const naturalWidth = image.naturalWidth;
      const naturalHeight = image.naturalHeight;

      // Scale factor for fitting image inside container (initial render scale)
      const scaleFit = Math.min(containerWidth / naturalWidth, containerHeight / naturalHeight);

      // Final rendered size after initial fit and zoom
      const renderedWidth = naturalWidth * scaleFit * zoom;
      const renderedHeight = naturalHeight * scaleFit * zoom;

      // Top-left of image inside container
      const imageX = (containerWidth - renderedWidth) / 2 + position.x;
      const imageY = (containerHeight - renderedHeight) / 2 + position.y;

      // Crop circle center
      const cropCenterX = containerWidth / 2;
      const cropCenterY = containerHeight / 2;

      // Find where the crop circle maps to in the natural image
      const L_natural = L / (scaleFit * zoom);
      const srcX = (cropCenterX - imageX) / (scaleFit * zoom) - L_natural / 2;
      const srcY = (cropCenterY - imageY) / (scaleFit * zoom) - L_natural / 2;

      ctx.clearRect(0, 0, L, L);
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;

      ctx.drawImage(
        image,
        srcX, srcY, L_natural, L_natural,
        0, 0, L, L
      );

      const croppedImageData = canvas.toDataURL("image/png");
      setEditImage(croppedImageData);
    };


    

    const handleFileChange = (event) => {
      const file = event.target.files[0];
      if (!file) return; // Prevents errors if no file is selected
      setFile(file)
      setSelectPicture(true)

      const reader = new FileReader();
      reader.onloadend = () => {
        updateUserData("profilePicture", reader.result);
        updateUserData("profilePictureFile", file)
        setImageLoaded(true);
      };
      reader.readAsDataURL(file);
    };

    const handleSave = () => {
      updateUserData("profilePicture", editImage);// Save the edited image to userImage
      setSelectPicture(false);
    };


    const submitStep1 = async (e) => {
      try {
          const formData = new FormData();
          formData.append("file", userData.profilePictureFile);
  
          const baseURL = "https://ics-star-api.vercel.app/"

          
          const response = await fetch(`${baseURL}upload-profile-picture`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
              },
              body: formData, // Send formData directly
          });
  
          const data = await response.json();
          
          if (response.ok) {
              alert("Profile Submission Successful!");
              setCurrentSection(2)
          } else {
              console.log("SFDSDF")
              alert(data.message || JSON.stringify(data) || "Registration failed!");
          }
      } catch (error) {
          console.error("Error:", error);
          alert("Something went wrong!");
      }
  };

    useEffect(() => {
      if (imageLoaded) {
        captureImage();
      }
    }, [zoom, position, imageLoaded, contrast, brightness, saturation]);

    return (
    <>

      <div className="flex flex-col space-y-3 items-center pt-15 sm:mx-30 mx-10">
        <label className="font-satoshi-bold md:text-5xl sm:text-3xl text-2xl text-left w-full">1. Update your profile</label>
        <label className="font-satoshi-light md:text-2xl sm:text-xl text-lg text-left w-full">Add a profile picture</label>
        <div className="flex flex-row md:h-50 mt-20 border border-gray-300 rounded-4xl md:w-175 sm:w-150 w-95 h-40">
            <div className="flex items-center justify-center rounded-full bg-white md:w-55 w-40 md:h-55 h-40 border-2 border-primary md:-mt-3 mt-0">
              <div className="relative w-full h-full flex justify-center items-center">
                {userData.profilePicture==null ? 
                (<User className="md:w-40 w-20 md:h-40 h-20 text-gray-300 rounded-full"/>):
                <img src={userData.profilePicture} alt="Profile" className="md:w-55 w-40 md:h-55 h-40 rounded-full" />
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
              

            </div>
           
            <div className="flex flex-col items-center justify-center flex-1">
              <label className="font-satoshi-bold md:text-3xl sm:text-2xl text-xl text-center ">{name}</label>
              <label className="font-satoshi-light text-lg">{email}</label>
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
              onClick={submitStep1}
          >
                  <label className="font-satoshi-bold cursor-pointer">Proceed</label>
          
          
          </div>
          
        </div>
          
        
      </div>

      {/* Select Picture */}
      {selectPicture &&
      <div className="flex items-center justify-center ">
          <div className="bg-black h-screen w-screen absolute top-0 opacity-80 left-0">
            
          </div>

          <div className="absolute flex flex-col items-center pt-10 h-[90%] w-[80%] bg-white z-30 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl overflow-y-scroll">
              <label className="font-satoshi-bold text-3xl">Edit Profile Picture</label>
              
              <div className="md:hidden flex flex-row mt-10  items-center justify-center z-20">
                  <label className={`font-satoshi-bold sm:text-lg text-sm h-10 sm:px-3 sm:p-1 p-2.5 ${editType == "Crop" ? 'rounded-2xl text-white bg-primary':'text-black'}`} onClick={()=>{setEditType("Crop")}}>Crop</label>
                  <label className={`font-satoshi-bold sm:text-lg text-sm h-10 sm:px-3 sm:p-1 p-2.5 ${editType == "Brightness" ? 'rounded-2xl text-white bg-primary':'text-black'}`} onClick={()=>{setEditType("Brightness")}}>Brightness</label>
                  <label className={`font-satoshi-bold sm:text-lg text-sm h-10 sm:px-3 sm:p-1 p-2.5 ${editType == "Contrast" ? 'rounded-2xl text-white bg-primary':'text-black'}`} onClick={()=>{setEditType("Contrast")}}>Contrast</label>
                  <label className={`font-satoshi-bold sm:text-lg text-sm h-10 sm:px-3 sm:p-1 p-2.5 ${editType == "Saturation" ? 'rounded-2xl text-white bg-primary':'text-black'}`} onClick={()=>{setEditType("Saturation")}}>Saturation</label>
              </div>
              {/* Orientation */}
              <div className="flex md:flex-row w-full h-full items-center justify-center flex-col ">

              
                {/* Picture container */}
                <div className="relative flex flex-col items-center justify-center w-[50%] h-[100%] md:h-[80%] md:max-h-100 max-h-50  rounded-4xl overflow-hidden  bg-black picture-holder"
                  ref={containerRef}
                >

                  
        
                  {/* Image with zoom effect */}
                  <img
                    ref={imageRef}
                    src={userData.profilePicture}
                    alt="Profile Preview"
                    onMouseDown={handleMouseDown}
                    onLoad={handleImageLoad}
                    style={{
                      objectFit: 'contain',
                      transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                      transition: isDragging ? "none" : "transform 0.2s ease",
                      cursor: isDragging ? "grabbing" : "grab",
                      filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`,
                      
                    }}
                    className="w-full h-full"
                    draggable={false}
                  />

                  {/* Dark overlay with transparent circle center */}
                  <div className="absolute inset-0 pointer-events-none">
                    <canvas ref={canvasRef} style={{ display: "none" }} />
                    <div className="w-full h-full">
                      <div
                        className="w-[50%] aspect-[1/1] rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                        style={{
                          boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.5)",
                          background: "transparent",
                        }}
                      />
                    </div>
                  </div>
                  
                </div>
                {/* Slider below the picture holder */}
                {/* Edit Functions */}

                {/* Mobile Version */}

                <div className="flex md:hidden flex-row items-center justify-center md:w-1/3 w-3/4 mt-10">
                  
                  { editType === "Crop" &&
                  <div className="flex flex-col items-center">
                    <label className=" text-black font-satoshi-bold text-xl pt-2">Crop</label>
                    <div className=" space-x-5 flex flex-row items-center justify-center w-[80%]  z-20">
                        <label className=" text-black font-satoshi-bold text-3xl pb-2">-</label>
                        <input
                          type="range"
                          min="0.1"
                          max="3"
                          step="0.01"
                          value={zoom}
                          onChange={(e) => setZoom(e.target.value)}
                          className="w-1/2 z-40"
                        />
                        <label className="text-black font-satoshi-bold text-3xl pb-2">+</label>
                    </div>
                  </div>  
                  }
                  
                  { editType == "Brightness" &&
                  <div className="flex flex-col items-center">
                    {/* Brightness Slider */}
                    <label className=" text-black font-satoshi-bold text-xl pt-2">Brightness</label>
                    <div className=" space-x-5 flex flex-row items-center justify-center w-[80%]  z-20">
                        <label className=" text-black font-satoshi-bold text-3xl pb-2">-</label>
                        <input
                          type="range"
                          min="0"
                          max="200"
                          value={brightness}
                          onChange={(e) => setBrightness(e.target.value)}
                          className="w-1/2 z-40"
                        />
                        <label className="text-black font-satoshi-bold text-3xl pb-2">+</label>
                    </div>
                  </div>

                  }
                  
                  { editType === "Contrast" &&
                  <div className="flex flex-col items-center">
                    {/* Contrast Slider */}
                    <label className=" text-black font-satoshi-bold text-xl pt-2">Contrast</label>
                    <div className=" space-x-5 flex flex-row items-center justify-center w-[80%]  z-20">
                        <label className=" text-black font-satoshi-bold text-3xl pb-2">-</label>
                        <input
                          type="range"
                          min="0"
                          max="200"
                          value={contrast}
                          onChange={(e) => setContrast(e.target.value)}
                          className="w-1/2 z-40"
                        />
                        <label className="text-black font-satoshi-bold text-3xl pb-2">+</label>
                    </div>
                  </div>
                  }

                  {/* Saturation */}
                  { editType === "Saturation" &&
                  <div className="flex flex-col items-center">
                    <label className=" text-black font-satoshi-bold text-xl pt-2">Saturation</label>
                    <div className=" space-x-5 flex flex-row items-center justify-center w-[80%]  z-20">
                        <label className=" text-black font-satoshi-bold text-3xl pb-2">-</label>
                        <input
                          type="range"
                          min="0"
                          max="200"
                          value={saturation}
                          onChange={(e) => setSaturation(e.target.value)}
                          className="w-1/2 z-40"
                        />
                        <label className="text-black font-satoshi-bold text-3xl pb-2">+</label>
                    </div>
                  </div>
                  }

                </div>

                

                {/* Laptop Version */}
                <div className="hidden md:flex flex-col items-center justify-center md:w-1/3 w-3/4">
                    
                  <label className=" text-black font-satoshi-bold text-xl pt-2">Crop</label>
                  <div className=" space-x-5 flex flex-row items-center justify-center w-[80%]  z-20">
                      <label className=" text-black font-satoshi-bold text-3xl pb-2">-</label>
                      <input
                        type="range"
                        min="0.1"
                        max="3"
                        step="0.01"
                        value={zoom}
                        onChange={(e) => setZoom(e.target.value)}
                        className="w-1/2 z-40"
                      />
                      <label className="text-black font-satoshi-bold text-3xl pb-2">+</label>
                  </div>

                  {/* Brightness Slider */}
                  <label className=" text-black font-satoshi-bold text-xl pt-2">Brightness</label>
                  <div className=" space-x-5 flex flex-row items-center justify-center w-[80%]  z-20">
                      <label className=" text-black font-satoshi-bold text-3xl pb-2">-</label>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={brightness}
                        onChange={(e) => setBrightness(e.target.value)}
                        className="w-1/2 z-40"
                      />
                      <label className="text-black font-satoshi-bold text-3xl pb-2">+</label>
                  </div>

                  {/* Contrast Slider */}
                  <label className=" text-black font-satoshi-bold text-xl pt-2">Contrast</label>
                  <div className=" space-x-5 flex flex-row items-center justify-center w-[80%]  z-20">
                      <label className=" text-black font-satoshi-bold text-3xl pb-2">-</label>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={contrast}
                        onChange={(e) => setContrast(e.target.value)}
                        className="w-1/2 z-40"
                      />
                      <label className="text-black font-satoshi-bold text-3xl pb-2">+</label>
                  </div>
                  {/* Saturation */}
                  <label className=" text-black font-satoshi-bold text-xl pt-2">Saturation</label>
                  <div className=" space-x-5 flex flex-row items-center justify-center w-[80%]  z-20">
                      <label className=" text-black font-satoshi-bold text-3xl pb-2">-</label>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={saturation}
                        onChange={(e) => setSaturation(e.target.value)}
                        className="w-1/2 z-40"
                      />
                      <label className="text-black font-satoshi-bold text-3xl pb-2">+</label>
                  </div>

                
                </div>

              </div>

              

              <img src={editImage} alt="Profile" className="md:w-55 w-40 md:h-55 h-40 rounded-full" />
              <div className="flex flex-row justify-between items-center w-full md:px-30 pb-10 px-10">
                <label className="w-30 h-15 bg-primary flex items-center justify-center text-white font-satoshi-bold rounded-3xl"
                  onClick={()=>{setSelectPicture(false)}}>
                  Go Back
                </label>
                <label className="w-30 h-15 bg-primary flex items-center justify-center text-white font-satoshi-bold rounded-3xl" 
                  onClick={handleSave}>
                  Save
                </label>
              </div>
              
          </div>
      </div>}
      
    </>
    
  );
}

export default Step1Onboarding;


