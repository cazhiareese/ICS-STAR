import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, User, Globe, Menu, X } from "lucide-react"; // Icons
import logo from "../assets/Subtract.png";

function Navbar({ tokentype }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    sessionStorage.removeItem("User");
    localStorage.removeItem("token");
    window.location.href = "/login";
  }

  console.log("Token type in navbar:", tokentype);
  function handleProfileClick() {
    navigate(`/${tokentype}/profile`);
  }

  return (
    <nav className="bg-white text-black px-6 py-4 shadow-md flex justify-between items-center border-b border-gray-300 h-20 relative">
      {/* Logo + Title */}
      <div className="text-xl font-bold flex items-center">
        <img src={logo} alt="Logo" className="h-6 mr-2" />
        <span className="font-sans text-primary tracking-wide">ICS - STAR</span>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex gap-6 font-medium">
        <button className="hover:text-primary transition font-satoshi-bold">Events</button>
        <button className="hover:text-primary transition font-satoshi-bold">Newsletters</button>
        <button className="hover:text-primary transition font-satoshi-bold">Career</button>
        <button className="hover:text-primary transition font-satoshi-bold">Alumni Search</button>
        <button className="hover:text-primary transition font-satoshi-bold">Donations</button>
      </div>

      {/* Icons and Mobile Menu Button */}
      <div className="flex items-center gap-4">
        <User className="cursor-pointer hover:text-primary transition" size={20} onClick={handleProfileClick} />
        <Globe className="cursor-pointer hover:text-primary transition" size={20} />
        <LogOut className="cursor-pointer hover:text-red-500 transition" size={20} onClick={handleLogout} />
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="absolute top-20 left-0 w-full bg-white shadow-md flex flex-col items-center gap-4 py-4 md:hidden">
          <button className="hover:text-primary transition font-satoshi-bold">Events</button>
          <button className="hover:text-primary transition font-satoshi-bold">Newsletters</button>
          <button className="hover:text-primary transition font-satoshi-bold">Career</button>
          <button className="hover:text-primary transition font-satoshi-bold">Alumni Search</button>
          <button className="hover:text-primary transition font-satoshi-bold">Donations</button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
