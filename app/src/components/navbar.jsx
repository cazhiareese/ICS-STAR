import React from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, User, Globe } from "lucide-react"; // Icons
import logo from "../assets/Subtract.png";

function Navbar({ user }) {
  const navigate = useNavigate();

  function handleLogout() {
    sessionStorage.removeItem("User");
    localStorage.removeItem("token");
    navigate("/");
  }

  function handleProfileClick() {
    navigate("/profile"); 
  }

  return (
    <nav className="bg-white text-black px-6 py-4 shadow-md flex justify-between items-center border-b border-gray-300 h-20">
      {/* Logo + Title */}
      <div className="text-xl font-bold flex items-center">
        <img src={logo} alt="Logo" className="h-6 mr-2" /> 
        <span className="font-sans text-primary tracking-wide">ICS - STAR</span> {/* Custom Font & Color */}
      </div>

      {/* Navigation Links */}
      <div className="flex gap-6 font-medium">
        <button className="hover:text-primary transition font-satoshi-bold">Events</button>
        <button className="hover:text-primary transition font-satoshi-bold">Newsletters</button>
        <button className="hover:text-primary transition font-satoshi-bold">Career</button>
        <button className="hover:text-primary transition font-satoshi-bold">Alumni Search</button>
        <button className="hover:text-primary transition font-satoshi-bold">Donations</button>
      </div>

      {/* Icons */}
      <div className="flex items-center gap-4">
        <User className="cursor-pointer hover:text-primary transition" size={20} onClick={handleProfileClick} />
        <Globe className="cursor-pointer hover:text-primary transition" size={20} />
        <LogOut 
          className="cursor-pointer hover:text-red-500 transition" 
          size={20} 
          onClick={handleLogout} 
        />
      </div>
    </nav>
  );
}

export default Navbar;
