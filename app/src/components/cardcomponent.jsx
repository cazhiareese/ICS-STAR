import React from "react";

function CardComponent({ icon: Icon, text }) {
  return (
    <div 
      className="w-[184px] h-[211px] flex flex-col items-center justify-center gap-2 p-4 rounded-[20px] 
                 border border-[#D9DDEB] bg-[#F9F9FB] shadow-[0px_3px_4px_0px_rgba(52,53,103,0.15)] 
                 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-[2px] hover:border-primary 
                 cursor-pointer group"
      style={{
        transition: "background 0.5s ease-in-out",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 
          "linear-gradient(135deg, rgba(255,255,255,0.5) 30%, rgba(99,116,147,0.2) 100%)";
      }}
      onMouseLeave={(e) => e.currentTarget.style.background = "#F9F9FB"}
    >
      {/* Display text with bold effect on hover */}
      <span className="text-lg font-medium text-center font-satoshi-medium min-h-1/3 group-hover:font-bold">
        {text}
      </span> 

      {/* Icon enlarges slightly on hover */}
      <Icon className="w-[140px] h-[139.42px] text-primary transition-transform duration-300 group-hover:scale-110" />
    </div>
  );
}

export default CardComponent;
