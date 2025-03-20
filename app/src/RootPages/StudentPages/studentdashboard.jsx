import React from "react";
import { Newspaper, Calendar, Briefcase, User, Handshake } from "lucide-react";
import CardComponent from "../../components/cardcomponent";
import star from "../../assets/star.png";
import wave from "../../assets/wave.png";

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

function StudentLanding() {
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
          <CardComponent icon={Briefcase} text="Browse job opportunities" />
          <CardComponent icon={User} text="Connect with Alumni" />
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
