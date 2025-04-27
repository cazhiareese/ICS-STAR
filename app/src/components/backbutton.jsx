// components/common/BackButton.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

function BackButton({ label = "Back" }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="flex items-center gap-2 text-primary hover:underline font-satoshi-medium mb-2"
    >
      <ChevronLeft className="w-5 h-5" />
      <span>{label}</span>
    </button>
  );
}

export default BackButton;
