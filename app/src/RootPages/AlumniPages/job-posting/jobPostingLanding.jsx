import React, { useState } from 'react'
import SearchBar from '../../../components/AlumniComponents/searchbar'
import JobSearchBar from '../../../components/AlumniComponents/jobsearchbar';
import { Plus, PlusCircle } from 'lucide-react';

function JobPostingLanding() {
    const [searchInput, setSearchInput] = useState("");

    return (
        <div>
            <div className="flex flex-row w-full mt-28 shadow-md pb-8  rounded-full px-8">
                {/* Centered Search Bar */}
                <div className="flex-1 flex justify-center ml-50">
                    <JobSearchBar 
                    searchInput={searchInput}
                    setSearchInput={setSearchInput}
                    />
                </div>

                {/* Button aligned to the right */}
                <button  
                    className="flex items-center gap-2 w-56 h-14 ml-6 bg-primary text-white font-satoshi-medium text-md rounded-3xl justify-center cursor-pointer"
                >
                    <PlusCircle />
                    Create Job Posting
                </button>
                </div>
        </div>
    )
}

export default JobPostingLanding