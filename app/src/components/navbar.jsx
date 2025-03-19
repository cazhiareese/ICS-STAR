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

  return (
    <nav className="bg-white text-black px-6 py-4 shadow-md flex justify-between items-center">
      {/* Logo */}
      <div className="text-xl font-bold flex items-center">
        <img src={logo} alt="Logo" className="h-6 mr-2" /> {/* Add your logo */}
        ICS - STAR
      </div>

      {/* Navigation Links */}
      <div className="flex gap-6 font-medium">
        <button className="hover:text-blue-600 transition">Events</button>
        <button className="hover:text-blue-600 transition">Newsletters</button>
        <button className="hover:text-blue-600 transition">Career</button>
        <button className="hover:text-blue-600 transition">Alumni Search</button>
        <button className="hover:text-blue-600 transition">Donations</button>
      </div>

      {/* Icons */}
      <div className="flex items-center gap-4">
        <User className="cursor-pointer hover:text-blue-600 transition" size={20} />
        <Globe className="cursor-pointer hover:text-blue-600 transition" size={20} />
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
