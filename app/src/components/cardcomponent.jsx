import React from "react";

function CardComponent({ icon: Icon, text }) {
  return (
    <div className="w-[184px] h-[211px] flex flex-col items-center justify-center gap-2 p-4 border rounded-lg shadow-md bg-white">
      <span className="text-lg font-medium text-center font-satoshi-medium">{text}</span> {/* Inter font applied here */}
      <Icon className="w-10 h-10 text-blue-500" /> {/* Icon below text */}
    </div>
  );
}

export default CardComponent;
