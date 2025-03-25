import React, { useState } from "react";
import { LogOut, Menu } from "lucide-react";
import SidebarItem from "./sidebaritem";
import IcsStarLogo from "../icsstar_logo"; // Ensure correct import path

function Sidebar({ selected, setSelected, sidebarItems }) {
  const [isOpen, setIsOpen] = useState(false); // Manage mobile menu state

  return (
    <>
      {/* Top Bar for Small Screens */}
      <div className={`${isOpen ? "hidden" : ""}bg-white w-full flex lg:hidden items-center justify-between px-4 py-3 shadow-md`}>
        {/* Menu Button */}
        <button onClick={() => setIsOpen(true)} className="text-gray-700">
          <Menu size={28} />
        </button>
        {/* Placeholder for alignment */}
        <div className="w-7"></div>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-lg transition-transform duration-300 z-50 ${
          isOpen ? "translate-x-0 w-3/4 sm:w-1/2" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:flex lg:flex-col lg:w-2/12 lg:h-screen px-4 pt-4`}
      >
        {/* ICS-STAR Logo */}
        <div className="mb-10">
          <IcsStarLogo />
        </div>

        {/* Sidebar items */}
        {sidebarItems.map((item) => (
          <SidebarItem
            key={item.id}
            title={item.title}
            icon={item.icon}
            isSelected={selected === item.id}
            onClick={() => {
              setSelected(item.id);
              setIsOpen(false); // Close menu on mobile when selecting an item
            }}
          />
        ))}

        {/* Log out */}
        <div className="flex flex-row p-2 rounded-r-3xl items-center ml-2 mt-16 cursor-pointer">
          <span className="mr-3">
            <LogOut />
          </span>
          <p className="text-lg font-satoshi-medium">Log out</p>
        </div>
      </div>

      {/* Overlay (Backdrop) - Click to Close Sidebar */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-90 lg:hidden z-40"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
}

export default Sidebar;
