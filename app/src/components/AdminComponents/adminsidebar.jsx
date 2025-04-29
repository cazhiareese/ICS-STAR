import React, { useState } from "react";
import { LogOut, Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import SidebarItem from "./sidebaritem.jsx";
import IcsStarLogo from "../icsstar_logo";

function Sidebar({ sidebarItems }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation(); 

  function handleLogout() {
    sessionStorage.removeItem("User");
    localStorage.removeItem("token");
    window.location.href = "/login";
  }

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="bg-white top-0 w-full flex lg:hidden items-center justify-between px-4 py-3 shadow-md">
        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700">
          <Menu size={28} />
        </button>
        <div className="w-7"></div>
      </div>

      {/* Overlay when sidebar is open */}
      {isOpen && (
        <div className="fixed inset-0 bg-black opacity-90 lg:hidden z-50" onClick={() => setIsOpen(false)}></div>
      )}

      {/* Sidebar - Sliding Drawer */}
      <div
        className={`bg-white fixed min-w-3xs z-50 top-0 h-screen w-3/4 lg:w-2/12 shadow-lg lg:static px-4 pt-4 
          ${isOpen ? "translate-x-0 transition-transform duration-300 ease-in-out" : "-translate-x-full transition-transform duration-300 ease-in-out"} lg:translate-x-0 lg:transition-none`}
      >
        <div className="mb-10 lg:block">
          <IcsStarLogo />
        </div>

        {/* Sidebar Items */}
        {sidebarItems.map((item) => (
          <SidebarItem
            key={item.id}
            title={item.title}
            icon={item.icon}
            path={item.path}
            isSelected={location.pathname.startsWith(`/admin/${item.path}`)}
            childrenItems={item.children}
            onClick={() => setIsOpen(false)}
          />
        ))}

        {/* Log Out */}
        <div className="flex flex-row p-2 rounded-r-3xl items-center ml-2 mt-16 cursor-pointer" onClick={handleLogout}>
          <span className="mr-3">
            <LogOut />
          </span>
          <p className="text-lg font-satoshi-medium">Log out</p>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
