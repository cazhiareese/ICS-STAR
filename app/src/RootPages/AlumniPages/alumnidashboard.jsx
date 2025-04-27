import React, { use, useState } from "react";
import { Calendar, BookOpen, Briefcase, Users, HelpingHand } from "lucide-react"; // Import Lucide icons
import CardComponent from "../../components/cardcomponent" // Import the card component
import star from "../../assets/star.png";
import wave from "../../assets/wave.png";
// import OnBoarding from "../../AuthPages/OnBoarding/onboardinglanding";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {fetchPublicProfileById as apiFetchPublicProfile} from "../Profile/UserProfileAPI/userProfileApi"

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


function AlumniLanding() {

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
      } catch (err) {
        console.error("Error fetching data: ", err);
        setError("Failed to load profile data. Please try again.");
      }
    };
    
    fetchName(); // runs once
    

    
  }, []);

  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      

      {/* Wave Image */}
      <img src={wave} alt="Wave" className="absolute top-0 left-0 w-full h-auto z-0" />

      {/* Rotating Stars */}
      {window.innerWidth >= 250 &&
        stars.map((s, index) => (
          <img
            key={s.id}
            src={star}
            alt="Star"
            className={`absolute opacity-80 ${s.size} z-10 hidden md:block`} // Hide by default, show on md+
            style={{
              top: s.top,
              left: s.left,
              animation: `rotateStar ${10}s linear infinite`,
            }}
          />
        ))}

      {/* Main header */}
      <div className="flex flex-col items-center justify-center pt-32 relative z-20">
        <h1 className="text-center font-satoshi-medium sm:text-6xl text-4xl text-black ">Bridging Alumni</h1>
        <h1 className="text-center font-satoshi-variable font-extrabold text-primary sm:text-6xl text-4xl">
          Across the Cosmos
        </h1>
        <h1 className="text-center font-satoshi text-black sm:text-2xl text-lg pt-10">What do you want to view?</h1>

        {/* Cards Section */}
        <div className="flex flex-wrap flex-row gap-5 font-satoshi-regular mt-10 items-center justify-center">
          <CardComponent icon={Calendar} text="Look for events to attend" />
          <CardComponent icon={BookOpen} text="Catch up with ICS" />
          <CardComponent icon={Briefcase} text="Browse job opportunities" />
          <CardComponent icon={Users} text="Connect with Alumni" />
          <CardComponent icon={HelpingHand} text="Give ICS a helping hand" />
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

export default AlumniLanding;