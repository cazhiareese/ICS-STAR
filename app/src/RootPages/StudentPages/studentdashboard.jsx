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
  const navigate = useNavigate();
  const [userId, setid]= useState(null);
  const [error, setError] = useState(null); // State to handle errors
  const [skills, setSkills] = useState([]); // State to manage skills
  useEffect(() => {
    const fetchName = async () => {
      try {
        const token = localStorage.getItem("token");
    
        if (!token) {
          setError("No token found. Please log in.");
          return;
        }
    
        const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
        const response = await fetch(`https://ics-star-api.vercel.app/users/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    
        if (!response.ok) {
          if (response.status === 401) {
            setError("Unauthorized access. Please log in again.");
            return;
          }
          throw new Error("Network response was not ok");
        }
    
        const text = await response.text();
    
        let result;
        try {
          result = JSON.parse(text);
        } catch (jsonError) {
          setError("Failed to parse the server response.");
          console.error("JSON parsing error: ", jsonError);
          return;
        }
    
        const id = result.user_id;
        setid(id); // still set state if needed elsewhere
        await fetchSkills(id); // pass directly
      } catch (err) {
        console.error("Error fetching data: ", err);
        setError("Failed to load profile data. Please try again.");
      }
    };
    
    const fetchSkills = async (id) => {
      try {
        console.log({ id });
        const data = await apiFetchPublicProfile({ userId: id });
        setSkills(data.skills || []);
    
        if (!data.skills || data.skills.length === 0) {
          navigate("/setup");
        }
    
        console.log(data.skills);
      } catch (err) {
        setError("Failed to load profile");
        console.log("SDFDSF Reached here:");
      }
    };
    
    fetchName(); // runs once
    

    
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
  <CardComponent icon={Calendar} text="Look for events to attend" />
  <CardComponent icon={Newspaper} text="Catch up with ICS" />
  
  {!banned && verified && (
    <>
      <CardComponent icon={Briefcase} text="Browse job opportunities" />
      <CardComponent icon={User} text="Connect with Alumni" />
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
