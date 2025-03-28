import React, { useState } from "react";
import { Search } from "lucide-react";

const SearchBar = () => {
    const [searchInput, setSearchInput] = useState("");

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

    // Filter countries based on search input
    const filteredAlumni = searchInput
        ? alumni.filter((alumnus) =>
              alumnus.name.toLowerCase().includes(searchInput.toLowerCase())
          )
        : [];

    return (
        <div className="w-full max-w-lg relative">
            {/* Search Bar */}
            <div className="flex flex-row items-center relative h-14">
                <input
                    type="search"
                    className="bg-gray-100 font-satoshi-medium text-lg w-full h-full px-4 py-2 rounded-2xl text-gray-400 border border-gray-300 focus:border-primary focus:outline-none focus:ring-0"
                    placeholder="Enter Alumni Name"
                    onChange={handleChange}
                    value={searchInput}
                />
                <button className="absolute h-full right-0 top-1/2 -translate-y-1/2 bg-primary text-white p-3 rounded-2xl hover:brightness-125 flex items-center justify-center w-1/6 cursor-pointer">
                    <Search size={20} />
                </button>
            </div>

            {/* Dropdown */}
            {filteredAlumni.length > 0 && (
                <ul className="absolute w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto z-10">
                    {filteredAlumni.map((alumnus, index) => (
                        <li
                            key={index}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => setSearchInput(alumnus.name)}
                        >
                            {alumnus.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchBar;
