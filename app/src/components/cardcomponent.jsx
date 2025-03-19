import React from "react";

function CardComponent({ icon: Icon, text }) {
  return (
    <div 
      className="w-[184px] h-[211px] flex flex-col items-center justify-center gap-2 p-4 rounded-[20px] border border-[#D9DDEBF2] 
                 bg-[#F9F9FB] shadow-[0px_3px_4px_0px_rgba(52,53,103,0.15)] transition-all duration-300 
                 hover:scale-105 hover:shadow-lg cursor-pointer"
      style={{
        transition: "background 0.5s ease-in-out",
      }}
      onMouseEnter={(e) => e.currentTarget.style.background = "linear-gradient(140.48deg, #A8C4F9 46.89%, #637493 101.84%)"}
      onMouseLeave={(e) => e.currentTarget.style.background = "#F9F9FB"}
    >
      <span className="text-lg font-medium text-center font-satoshi-medium min-h-1/3">
        {text}
      </span> 
      <Icon className="w-[140px] h-[139.42px] text-primary" />
    </div>
  );
}

export default CardComponent;
