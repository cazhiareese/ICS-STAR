import React from "react";
import { Calendar, BookOpen, Briefcase, Users, HelpingHand } from "lucide-react"; // Import Lucide icons
import CardComponent from "../../components/cardcomponent" // Import the card component
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

function AlumniLanding() {
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
          className={`absolute opacity-80 ${s.size} animate-spin-slow z-10`}
          style={{ top: s.top, left: s.left }}
        />
      ))}

      {/* Main header */}
      <div className="flex flex-col items-center justify-center pt-32 relative z-20">
        <h1 className="text-center font-satoshi-medium text-6xl text-black">Bridging Alumni</h1>
        <h1 className="text-center font-satoshi-variable font-extrabold text-primary text-6xl">
          Across the Cosmos
        </h1>
        <h1 className="text-center font-satoshi text-black text-2xl pt-10">What do you want to view?</h1>

        {/* Cards Section */}
        <div className="flex flex-row gap-5 font-satoshi-regular mt-10">
          <CardComponent icon={Calendar} text="Look for events to attend" />
          <CardComponent icon={BookOpen} text="Catch up with ICS" />
          <CardComponent icon={Briefcase} text="Browse job opportunities" />
          <CardComponent icon={Users} text="Connect with Alumni" />
          <CardComponent icon={HelpingHand} text="Give ICS a helping hand" />
        </div>
      </div>
    </div>
  );
}

export default AlumniLanding;
