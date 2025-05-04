import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Newspaper, Calendar, Briefcase, User } from "lucide-react";
import CardComponent from "../../components/cardcomponent";
import star from "../../assets/star.png";
import wave from "../../assets/wave.png";
import { jwtDecode } from "jwt-decode"; // Import jwtDecode for decoding JWT tokens

import { fetchPublicProfileById as apiFetchPublicProfile } from "../Profile/UserProfileAPI/userProfileApi"; // Assuming this is where the function is defined

// Define fixed star positions
const stars = [
  { id: 1, top: "16%", left: "15%", size: "w-7" },
  { id: 2, top: "50%", left: "10%", size: "w-10" },
  { id: 3, top: "30%", left: "25%", size: "w-10" },
  { id: 4, top: "5%", left: "40%", size: "w-9" },
  { id: 5, top: "15%", left: "67%", size: "w-8" },
  { id: 6, top: "45%", left: "80%", size: "w-6" },
  { id: 7, top: "8%", left: "88%", size: "w-4" },
];

const Usera = localStorage.getItem("token");
let tokentype = "guest";
let userid = true;
let banned = false;
let verified = false;


if (Usera) {
  try {
    const decoded = jwtDecode(Usera);
    tokentype = decoded.role;
    userid = decoded.sub;
    
    console.log("Decoded token:", decoded);
    console.log("User ID:", userid);
    console.log("Token type:", tokentype);
    banned = decoded.is_banned;
    console.log("Banned status:", banned);
    verified = decoded.is_verified;
    console.log("Verified status:", verified);
    
  } catch (error) {
    console.error("Invalid token:", error);
  }
} else {
  console.log("No token found, defaulting to guest.");
}

function StudentLanding() {
  
  useEffect(() => {
      function isOnboarded() {
        const User = localStorage.getItem("token");
        //const User = true;
        let tokenType = null;
        if (User) {
          const decoded = jwtDecode(User);
          console.log("Decoded token:", decoded);
          //tokenType = "admin";
          //tokenType = "alumni";
          const onBoarding = decoded.is_onboarded; // Adjust this based on your token structure
          const verified = decoded.is_verified
          console.log("Decoded token type:", tokenType);
    
          console.log
          if (onBoarding && verified){    
            return true
          } else if (!verified){
            return true
          }
            return false
        } else {
          console.warn("⚠️ No token found in sessionStorage");
        }
      }
      if (isOnboarded() == false){

      }
    

    
  }, []);
  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      {/* Wave Image */}
      <img src={wave} alt="Wave" className="absolute top-0 left-0 w-full h-auto z-0" />

      {/* Rotating Stars */}
      {stars.map((s) => (
        <img
          key={s.id}
          src={star}
          alt="Star"
          className={`absolute opacity-80 ${s.size} z-10`}
          style={{
            top: s.top,
            left: s.left,
            animation: `rotateStar ${10}s linear infinite`, // Slow rotation
          }}
        />
      ))}

      {/* Main header */}
      <div className="flex flex-col items-center justify-center pt-32 relative z-20">
        <h1 className="text-center font-satoshi-bold text-[60px] leading-[60px] tracking-[-2%] text-black">
          Bridging Alumni
        </h1>
        <h1 className="text-center font-satoshi-bold text-[60px] leading-[60px] tracking-[-2%] text-primary">
          Across the Cosmos
        </h1>
        <p className="text-center font-satoshi-medium text-[20px] leading-[60px] tracking-[-2%] text-black pt-10">
          What do you want to view?
        </p>

        {/* Cards Section */}
        <div className="flex flex-wrap justify-center gap-4 mt-6">
  <Link to="/student/events"><CardComponent icon={Calendar} text="Look for events to attend" /></Link>
  <Link to="/student/newsletter"><CardComponent icon={Newspaper} text="Catch up with ICS" /></Link>
  
  {!banned && verified && (
    <>
      <Link to="/student/jobPosting"><CardComponent icon={Briefcase} text="Browse job opportunities" /></Link>
      <Link to="/student/alumnisearch"><CardComponent icon={User} text="Connect with Alumni" /></Link>
    </>
  )}
</div>

      </div>

      {/* Add CSS for rotation animation */}
      <style>
        {`
          @keyframes rotateStar {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}

export default StudentLanding;
