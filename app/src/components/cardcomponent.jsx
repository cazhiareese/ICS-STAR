import React from "react";

function CardComponent({ icon: Icon, text }) {
  return (
    <div className="flex items-center gap-4 p-4 border rounded-lg shadow-md bg-white">
      <Icon className="w-6 h-6 text-blue-500" />
      <span className="text-lg font-medium">{text}</span>
    </div>
  );
}

export default CardComponent;
