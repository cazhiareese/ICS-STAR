import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, User, Globe, Menu, X } from "lucide-react";
import logo from "../assets/Subtract.png";

function Navbar({ tokentype, verified, banned }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const id = "0ed168b4-344b-4760-bb68-0b7c5c3a9252";


  function handleLogout() {
    sessionStorage.removeItem("User");
    localStorage.removeItem("token");
    window.location.href = "/login";
  }

  function handleInterested() {
    navigate(`${tokentype}/jobPosting/interested/${id}`);
  }

  function handleSearch() {
    window.location.href = `/${tokentype}/alumnisearch`;
  }

  function handleProfileClick() {
    window.location.href = `/${tokentype}/profile`;
  }

  function handleDonation() {
    window.location.href = `/${tokentype}/donations`;
  }

  function handleCareer() {
    window.location.href = `/${tokentype}/jobPosting`;
  }

  function handleEvents() {
    window.location.href = `/${tokentype}/events`;
  }

  function handleNewsletter() {
    window.location.href = `/${tokentype}/newsletter`;
  };

  console.log("Token type in navbar:", tokentype);

  return (
<>
  <nav className="bg-white text-black px-6 py-4 shadow-md flex justify-between items-center border-b border-gray-300 h-20 sticky top-0 z-50">
    {/* Logo + Title */}
    <div className="text-xl font-bold flex items-center">
      <img src={logo} alt="Logo" className="h-6 mr-2" />
      <span className="font-sans text-primary tracking-wide">ICS - STAR</span>
    </div>

    {/* Desktop Navigation */}
    <div className="hidden md:flex gap-6 font-medium">
      <button className="hover:text-primary transition font-satoshi-bold" onClick={handleEvents}>
        Events
      </button>
      <button className="hover:text-primary transition font-satoshi-bold"onClick={handleNewsletter}>Newsletters</button>
      <button className="hover:text-primary transition font-satoshi-bold "onClick={handleCareer}>Career</button>
      <button className="hover:text-primary transition font-satoshi-bold" onClick={handleSearch}>
        Alumni Search
      </button>
      {tokentype !== "student" && (
  <button className="hover:text-primary transition font-satoshi-bold" onClick={handleDonation}>
    Donations
  </button>
)}

    </div>

    {/* Icons and Mobile Menu Button */}
    <div className="flex items-center gap-4">
      <User className="cursor-pointer hover:text-primary transition" size={20} onClick={handleProfileClick} />
      <Globe className="cursor-pointer hover:text-primary transition" size={20} onClick={handleInterested} />
      <LogOut className="cursor-pointer hover:text-red-500 transition" size={20} onClick={handleLogout} />
      <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
    </div>
  </nav>

  {/* Mobile Navigation (Separate from nav) */}
  {menuOpen && (
    <div className="bg-white shadow-md flex flex-col items-center gap-4 py-4 md:hidden sticky top-20 z-40">
      <button className="hover:text-primary transition font-satoshi-bold" onClick={handleEvents}>
        Events
      </button>
      <button className="hover:text-primary transition font-satoshi-bold"onClick={handleNewsletter}>Newsletters</button>
      <button className="hover:text-primary transition font-satoshi-bold" onClick={handleCareer}>Career</button>
      <button className="hover:text-primary transition font-satoshi-bold" onClick={handleSearch}>
        Alumni Search
      </button>
      {tokentype !== "student" && (
  <button className="hover:text-primary transition font-satoshi-bold" onClick={handleDonation}>
    Donations
  </button>
)}

    </div>
  )}
</>

  );
}

export default Navbar;