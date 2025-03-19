import React from "react";

function CardComponent({ icon: Icon, text }) {
  return (
    <div className="w-[184px] h-[211px] flex flex-col items-center justify-center gap-4 p-4 border rounded-lg shadow-md bg-white">
      <Icon className="w-10 h-10 text-blue-500" /> {/* Adjust icon size */}
      <span className="text-lg font-medium text-center">{text}</span>
    </div>
  );
}

export default CardComponent;
