import React, { useState } from "react";
import { Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SearchBar = () => {
    const [searchInput, setSearchInput] = useState("");

    //Dummy alumni list
    const alumni = [
        { name: "Janry Mendoza" },
        { name: "Redd Villanueva" },
        { name: "Elijah Thompson" },
        { name: "Sophia Ramirez" },
        { name: "Liam Anderson" },
        { name: "Olivia Carter" },
        { name: "Noah Bennett" },
        { name: "Emma Robinson" },
        { name: "Aiden Hughes" },
        { name: "Isabella Flores" },
        { name: "Lucas Mitchell" },
        { name: "Mia Peterson" },
        { name: "Ethan Simmons" },
        { name: "Charlotte Hayes" },
        { name: "Mason Cooper" },
        { name: "Amelia Scott" },
        { name: "Logan Brooks" },
        { name: "Harper Ward" },
        { name: "James Reed" },
        { name: "Evelyn Murphy" },
        { name: "Benjamin Torres" },
        { name: "Abigail Richardson" }
    ];
    
    const handleChange = (e) => {
        setSearchInput(e.target.value);
    };

    const filteredAlumni = searchInput
        ? alumni.filter((alumnus) =>
              alumnus.name.toLowerCase().includes(searchInput.toLowerCase())
          )
        : [];

    return (
        <div className="md:w-full w-4/5 max-w-lg relative">
            {/* Search Textbox */}
            <div className="flex flex-row items-center relative h-14">
                <input
                    type="search"
                    className="bg-gray-100 font-satoshi-medium text-lg w-full h-full px-4 py-2 rounded-2xl text-black border border-gray-300 focus:border-primary focus:outline-none focus:ring-0"
                    placeholder="Enter Alumni Name"
                    onChange={handleChange}
                    value={searchInput}
                />
                <button className="absolute h-full right-0 top-1/2 -translate-y-1/2 bg-primary text-white p-3 rounded-2xl hover:brightness-125 flex items-center justify-center w-1/6 cursor-pointer">
                    <Search size={20} />
                </button>
            </div>

            {/* Dropdown with animation */}
            <AnimatePresence>
                {filteredAlumni.length > 0 && (
                    <motion.ul
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto z-10"
                    >
                        {filteredAlumni.map((alumnus, index) => (
                            <motion.li
                                key={index}
                                className="px-4 py-2 cursor-pointer"
                                onClick={() => setSearchInput(alumnus.name)}
                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e5e7eb")}
                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                            >
                                {alumnus.name}
                            </motion.li>
                        ))}
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SearchBar;
