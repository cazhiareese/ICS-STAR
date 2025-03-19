import React from "react";
import { Link, useNavigate } from "react-router-dom"

function Navbar({ user }) {

    function handleLogout() {
        sessionStorage.removeItem("User");
        localStorage.removeItem("token");
        window.location.replace("/");
      }
  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md flex justify-between items-center">
      {/* Logo */}
      <div className="text-xl font-bold">MyApp</div>

      {/* Navigation Links */}
      <div className="flex gap-4">
        <button className="px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-700 transition">Home</button>
        <button className="px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-700 transition">About</button>
        <button className="px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-700 transition">Services</button>
        <button className="px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-700 transition" onClick={handleLogout}>Contact</button>
      </div>
    </nav>
  );
}

export default Navbar;
