import React from "react";

function Navbar({ user }) {
  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md flex justify-between items-center">
      {/* Logo */}
      <div className="text-xl font-bold">MyApp</div>

      {/* Navigation Links */}
      <div className="flex gap-4">
        <button className="px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-700 transition">Home</button>
        <button className="px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-700 transition">About</button>
        <button className="px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-700 transition">Services</button>
        <button className="px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-700 transition">Contact</button>
      </div>
    </nav>
  );
}

export default Navbar;
