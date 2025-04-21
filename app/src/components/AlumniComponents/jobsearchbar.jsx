import React, { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from 'axios';

const JobSearchBar = 
({
    searchInput,
    setSearchInput
  })=> {
    // BASE URL ENV
    const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
    const [filteredAlumni, setFilteredAlumni] = useState([]); 
    // cache reference
    const cache = useRef({});

    //Use effect for search suggestions
    // useEffect(() => {
    //     const fetchData = async () => {
    //         const query = searchInput.trim().toLowerCase();

    //         if (!searchInput) {
    //         setFilteredAlumni([]);
    //         return;
    //         }

    //         // Check if the data for this query is already cached
    //         if (cache.current[query]) {
    //         setFilteredAlumni(cache.current[query]); // Use cached data
    //         console.log("Using cached alumni data for:", query, cache.current[query]);
    //         return;
    //         }

    //         try {
    //         const response = await axios.get(`${API_BASE_URL}/autocomplete/names?q=${encodeURIComponent(searchInput)}&limit=5`);
    //         setFilteredAlumni(response.data);
    //         cache.current[query] = response.data; // Cache the result for future use
    //         console.log("Fetched alumni data for:", query, response.data);
    //         } catch (error) {
    //         console.error("Error fetching alumni data:", error);
    //         }
    //     };

    //     fetchData();  // Fetch data when dependencies change (searchInput)
    // }, [searchInput]);

    
    const handleChange = (e) => {
        setSearchInput(e.target.value);
    };

    //creates an object for url making
    // const search = () => {
    //     let filters = {}; // Initialize filter object
    //     if (searchInput != ""){
    //         filters.name = searchInput;
    //     }
    //     if (selectedBatchYear != "") {
    //         filters.batch = selectedBatchYear;
    //     }
    //     if (selectedGraduationYear !== "") {
    //         filters.graduation_year = selectedGraduationYear;
    //     }
    //     if (Array.isArray(careerList) && careerList.length > 0) {
    //         filters.job_title = careerList;
    //     }
    //     if (Array.isArray(affiliationList) && affiliationList.length > 0) {
    //         filters.affiliation = affiliationList;
    //     }
    //     if (Array.isArray(skillsList) && skillsList.length > 0) {
    //         filters.skill = skillsList;
    //     }
    //     if (Array.isArray(industryList) && industryList.length > 0) {
    //         filters.industry = industryList;
    //     }
    //     if (Array.isArray(location) && location.length > 0) {
    //         filters.city = location;
    //     }
    
    //     if (Object.keys(filters).length > 0){
    //         // Pass filters to buildSearchUrl and make API call
    //         let apiUrl = buildSearchUrl(filters);
    //         console.log(apiUrl);
    //         return apiUrl;
    //     }
    // };

    //Function for getting the data of alumni based on filters
    // const fetchData = async () => {
    //     let searchAPIURL = search();  // Get API URL based on the filters
    //     console.log("Triggered fetchData()", searchAPIURL);
    //     setLoading(true); 
    //     try {
    //         const response = await axios.get(searchAPIURL);
    //         setAlumniList((prevList) => {
    //             if (JSON.stringify(prevList) !== JSON.stringify(response.data)) {
    //                 return response.data;
    //             }
    //             return prevList;
    //         });
    //         console.log(response.data);
    //     } catch (error) {
    //         console.error("Error fetching alumni data:", error);
    //         setAlumniList([]);
    //     }
    //     finally {
    //       setLoading(false);  // Hide loading modal
    //     }
    // };
    
    //Builds URL using object
    // function buildSearchUrl(filters) {
    //     let baseUrl = `${API_BASE_URL}/alumni/search`;
    //     let queryParams = new URLSearchParams(filters).toString();
    //     return queryParams ? `${baseUrl}?${queryParams}` : baseUrl;
    // }
    

    


    return (
        <div className="md:w-full w-3/5 max-w-lg relative">
            {/* Search Textbox */}
            <div className="flex flex-row items-center relative h-14">
                <input
                    type="search"
                    className="bg-gray-100 font-satoshi-medium text-lg w-full h-full px-4 py-2 rounded-2xl text-black border border-gray-300 focus:border-primary focus:outline-none focus:ring-0"
                    placeholder="Enter Alumni Name"
                    onChange={handleChange}
                    // onKeyDown={(e) => {
                    //     if (e.key === "Enter") {
                    //         fetchData(); // Call your search function
                    //     }
                    // }}
                    value={searchInput}
                />
                <button className="lg:flex hidden absolute h-full right-0 top-1/2 -translate-y-1/2 bg-primary text-white p-3 rounded-2xl hover:brightness-125 items-center justify-center w-1/6 cursor-pointer">
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
