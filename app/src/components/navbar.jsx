import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { LogOut, User, Globe, Menu, X, Settings } from "lucide-react";
import logo from "../assets/Subtract.png";

function Navbar({ tokentype, verified, banned }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const id = "0ed168b4-344b-4760-bb68-0b7c5c3a9252";
  console.log(verified);
  function handleLogout() {
    sessionStorage.removeItem("User");
    localStorage.removeItem("token");
    window.location.href = "/login";
  }

  function handleAccount() {
    navigate(`/${tokentype}/account/settings`);
  }

  function handleSearch() {
    navigate(`/${tokentype}/alumnisearch`);
  }

  function handleProfileClick() {
    navigate(`/${tokentype}/profile`);
  }

  function handleDonation() {
    navigate(`/${tokentype}/donations`);
  }

  function handleCareer() {
    navigate(`/${tokentype}/jobPosting`);
  }

  function handleEvents() {
    navigate(`/${tokentype}/events`);
  }

  function handleNewsletter() {
    navigate(`/${tokentype}/newsletter`);
  }

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <>
      <nav className="bg-white text-black px-6 py-4 shadow-md flex justify-between items-center border-b border-gray-300 h-20 sticky top-0 z-50">
        {/* Logo + Title */}
        <Link to={`/${tokentype}/dashboard`} className="text-xl font-bold flex items-center">
          <img src={logo} alt="Logo" className="h-6 mr-2" />
          <span className="font-satoshi-black text-primary text-3xl pl-2 tracking-wide">ICS - STAR</span>
        </Link>

<div className="hidden md:block absolute left-1/2 transform -translate-x-1/2">
  <div className="flex items-center justify-center gap-6 font-satoshi-bold font-medium text-xl text-center">
    <button
      className={`${isActive(`/${tokentype}/events`) ? "text-primary font-satoshi-bold" : "hover:text-primary"} transition`}
      onClick={handleEvents}
    >
      Events
    </button>
    <button
      className={`${isActive(`/${tokentype}/newsletter`) ? "text-primary font-satoshi-bold" : "hover:text-primary"} transition`}
      onClick={handleNewsletter}
    >
      Newsletters
    </button>
        {tokentype !== "student" && verified === true && banned === false && (
          <button
            className={`${isActive(`/${tokentype}/donations`) ? "text-primary font-satoshi-bold" : "hover:text-primary"} transition`}
            onClick={handleDonation}
          >
            Donations
          </button>
        )}

    {tokentype !== "guest" && verified === true && banned === false && (
      <>
        <button
          className={`${isActive(`/${tokentype}/jobPosting`) ? "text-primary font-satoshi-bold" : "hover:text-primary"} transition`}
          onClick={handleCareer}
        >
          Career
        </button>
        <button
          className={`${isActive(`/${tokentype}/alumnisearch`) ? "text-primary font-satoshi-bold" : "hover:text-primary"} transition`}
          onClick={handleSearch}
        >
          Alumni Search
        </button>

      </>
    )}
  </div>
</div>



        {/* Icons and Mobile Menu Button */}
        <div className="flex items-center gap-4">
        {tokentype !== "guest" && (
  <>
    <User className="cursor-pointer hover:text-primary transition" size={20} onClick={handleProfileClick} />
    <Settings className="cursor-pointer hover:text-primary transition" size={20} onClick={handleAccount} />
  </>
)}

{tokentype === "guest" ? (
  <button
    onClick={() => navigate("/login")}
    className="text-lg font-satoshi-bold text-primary hover:underline transition cursor-pointer"
  >
    Log In
  </button>
) : (
  <LogOut
    className="cursor-pointer hover:text-red-500 transition"
    size={20}
    onClick={handleLogout}
  />
)}

          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="bg-white shadow-md flex flex-col items-center gap-4 py-4 md:hidden sticky top-20 z-40">
          <button
            className={`${isActive(`/${tokentype}/events`) ? "text-primary font-satoshi-bold" : "hover:text-primary"} transition`}
            onClick={() => {
              handleEvents();
              setMenuOpen(false);
            }}
          >
            Events
          </button>
          <button
            className={`${isActive(`/${tokentype}/newsletter`) ? "text-primary font-satoshi-bold" : "hover:text-primary"} transition`}
            onClick={() => {
              handleNewsletter();
              setMenuOpen(false);
            }}
          >
            Newsletters
          </button>

          {tokentype !== "guest" && verified === true && banned === false && (
            <>
              <button
                className={`${isActive(`/${tokentype}/jobPosting`) ? "text-primary font-satoshi-bold" : "hover:text-primary"} transition`}
                onClick={() => {
                  handleCareer();
                  setMenuOpen(false);
                }}
              >
                Career
              </button>
              <button
                className={`${isActive(`/${tokentype}/alumnisearch`) ? "text-primary font-satoshi-bold" : "hover:text-primary"} transition`}
                onClick={() => {
                  handleSearch();
                  setMenuOpen(false);
                }}
              >
                Alumni Search
              </button>
              {tokentype !== "student" && verified === true && banned === false && (
                <button
                  className={`${isActive(`/${tokentype}/donations`) ? "text-primary font-satoshi-bold" : "hover:text-primary"} transition`}
                  onClick={() => {
                    handleDonation();
                    setMenuOpen(false);
                  }}
                >
                  Donations
                </button>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
}

export default Navbar;
