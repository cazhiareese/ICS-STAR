import React, { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from 'axios';

const JobSearchBar = 
({
    searchInput,
    setSearchInput,
    setLoading,
    setJobList
  })=> {
    // BASE URL ENV
    const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
    const [filteredAlumni, setFilteredAlumni] = useState([]); 
    // cache reference
    const cache = useRef({});
    
    // const handleChange = (e) => {
    //     setSearchInput(e.target.value);
    // };

    
    
    const fetchJobs = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/job/search?title=${searchInput}`);
            if (!response.ok) {
            throw new Error('Failed to fetch jobs');
            }
            const data = await response.json();
            console.log(data)
            setJobList(data);
        } catch (err) {
            alert('Job not found');
        } finally {
            setLoading(false);
        }
    };

    


    return (
        <div className="md:w-full w-3/5 max-w-lg relative">
            {/* Search Textbox */}
            <div className="flex flex-row items-center relative h-14">
                <input
                    type="search"
                    className="bg-gray-100 font-satoshi-medium text-lg w-full h-full px-4 py-2 rounded-2xl text-black border border-gray-300 focus:border-primary focus:outline-none focus:ring-0"
                    placeholder="Enter Job"
                    
                    // onKeyDown={(e) => {
                    //     if (e.key === "Enter") {
                    //         fetchData(); // Call your search function
                    //     }
                    // }}
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                />
                <button onClick={fetchJobs} className="lg:flex hidden absolute h-full right-0 top-1/2 -translate-y-1/2 bg-primary text-white p-3 rounded-2xl hover:brightness-125 items-center justify-center w-1/6 cursor-pointer">
                    <Search size={20} />
                </button>
            </div>

            {/* Dropdown with animation */}
            {/* <AnimatePresence>
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
                                onClick={() => setSearchInput(alumnus)}
                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e5e7eb")}
                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                            >
                                {alumnus}
                            </motion.li>
                        ))}
                    </motion.ul>
                )}
            </AnimatePresence> */}
        </div>
    );
};

export default JobSearchBar;
