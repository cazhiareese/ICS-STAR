import React from "react";
import star from "../../assets/star.png";
import wave from "../../assets/wave.png"; // Add wave image

function AlumniLanding() {
  // Define fixed star positions (top, left)
  const stars = [
    { id: 1, top: "16%", left: "15%", size: "w-7" },
    { id: 2, top: "50%", left: "10%", size: "w-10" },
    { id: 3, top: "30%", left: "25%", size: "w-10" },
    { id: 4, top: "5%", left: "40%", size: "w-9" },
    { id: 5, top: "15%", left: "67%", size: "w-8" },
    { id: 6, top: "45%", left: "80%", size: "w-6" },
    { id: 7, top: "8%", left: "88%", size: "w-4" },
  ];

  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      {/* Wave Image at the back */}
      <img
        src={wave}
        alt="Wave"
        className="absolute top-0 left-0 w-full h-auto z-0"
      />

      {/* Manually positioned stars */}
      {stars.map((s) => (
        <img
          key={s.id}
          src={star}
          alt="Star"
          className={`absolute opacity-80 ${s.size} z-10`}
          style={{ 
            top: s.top, left: s.left ,
            animation: `rotateStar ${s.duration} linear infinite`,
          }}
        />
      ))}

      {/* Main header */}
      <div className="flex flex-col items-center justify-center pt-32 relative z-20">
        <h1 className="text-center font-satoshi-medium text-6xl text-black">
          Bridging Alumni
        </h1>
        <h1 className="text-center font-satoshi-variable font-extrabold text-primary text-6xl">
          Across the Cosmos
        </h1>
        <h1 className="text-center font-satoshi text-black text-2xl pt-10">
          What do you want to view?
        </h1>

        {/* Cards */}
        <div className="flex flex-row gap-5 font-satoshi-regular">
          <div className="w-40 h-52 bg-white rounded-2xl shadow-md flex flex-col items-center justify-center p-4 mt-7">
            <p className="text-center text-black text-sm font-medium">
              Look for events to attend
            </p>
            {/* ADD ICON */}
          </div>

          <div className="w-40 h-52 bg-white rounded-2xl shadow-md flex flex-col items-center justify-center p-4 mt-7">
            <p className="text-center text-black text-sm font-medium">
              Catch up with ICS
            </p>
            {/* ADD ICON */}
          </div>

          <div className="w-40 h-52 bg-white rounded-2xl shadow-md flex flex-col items-center justify-center p-4 mt-7">
            <p className="text-center text-black text-sm font-medium">
              Browse job opportunities
            </p>
            {/* ADD ICON */}
          </div>

          <div className="w-40 h-52 bg-white rounded-2xl shadow-md flex flex-col items-center justify-center p-4 mt-7">
            <p className="text-center text-black text-sm font-medium">
              Look for events to attend
            </p>
            {/* ADD ICON */}
          </div>
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
