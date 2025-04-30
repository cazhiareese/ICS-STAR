import React, { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from 'axios';

const JobSearchBar = 
({
    searchInput,
    setSearchInput,
    setLoading,
    setJobList,
    selectedWorkTypes,
    selectedRemoteOption,
    salaryRange
  })=> {
    // BASE URL ENV
    const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
    const [filteredAlumni, setFilteredAlumni] = useState([]); 
    // cache reference
    const cache = useRef({});
    
    // const handleChange = (e) => {
    //     setSearchInput(e.target.value);
    // };

    //creates an object for url making
    const search = () => {
        let filters = {};
        if (searchInput != ""){
            filters.creator_name = searchInput;
        }
        if (Array.isArray(selectedWorkTypes) && selectedWorkTypes.length > 0) {
            filters.job_title = careerList;
        }
    }

    
    const fetchJobs = async () => {
        setLoading(true);
        console.log(`${API_BASE_URL}/admin/job/search?creator_name=${searchInput}`);
        try {
            const response = await axios.get(`${API_BASE_URL}/admin/job/search?creator_name=${searchInput}`);
            console.log(response.data);
            setJobList(response.data);
        } catch (err) {
            console.error(err); 
            alert('Job not found');
        } finally {
            setLoading(false);
        }
    };
    

    


    return (
        <div className="w-full max-w-lg relative">
            {/* Search Textbox */}
            <div className="flex flex-row items-center relative h-14 w-full">
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
        </div>
    );
};

export default JobSearchBar;
