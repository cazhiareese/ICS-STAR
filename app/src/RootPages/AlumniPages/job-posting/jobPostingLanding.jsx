import React, { useState, useEffect } from 'react'
import SearchBar from '../../../components/AlumniComponents/searchbar'
import JobSearchBar from '../../../components/AlumniComponents/jobsearchbar';
import { Plus, PlusCircle } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import JobCard from '../../../components/AlumniComponents/JobCard';

function JobPostingLanding() {
    const [searchInput, setSearchInput] = useState("");
    const [jobList, setJobList] = useState([]);
    const [userId, setUserId] = useState(null);


    // For Dummy testing only
    useEffect(() => {
        // Job Dummy Data
        // const job = {
        //     title: "Data Scientist",
        //     company: "Google Alphabet",
        //     description: "Lorem ipsum dolor sit amet consectetur. Risus tellus odio sit vel ut nibh natoque id. Eu facilisis augue neque non enim a duis. Odio tortor vestibulum gravida nullam quis sed enim ipsum ullamcorper. Venenatis nulla vulputate et ut ut rhoncu...",
        //     salary: 20000,
        //     tags: ["Software Engineering", "UI/UX"],
        //     employment_type: "Full-time",
        //     link: "LinkedIn.com",
        //     image: "https://www.computersciencedegreehub.com/wp-content/uploads/2020/05/What-is-a-Software-Engineer-scaled.jpg",
        //     alumni: "Roche Quejada" //Tentative
        // }

        const job = {
            title: "Data Scientist",
            company: "Google Alphabet",
            description: "Lorem ipsum dolor sit amet consectetur. Risus tellus odio sit vel ut nibh natoque id. Eu facilisis augue neque non enim a duis. Odio tortor vestibulum gravida nullam quis sed enim ipsum ullamcorper. Venenatis nulla vulputate et ut ut rhoncu...",
            user_name: "Roche Quejada",
            tags: ["Software Engineering", "UI/UX","Software Engineering", "UI/UX","Software Engineering", "UI/UX"],
            interested_count: 5
        }
        
        const jobs = [job,job,job];
        setJobList(jobs);
        
    }, []);

    

    return (
        <div className='flex flex-col mb-16'>
            <div className="flex flex-row w-full mt-16 shadow-md pb-8  rounded-full px-8">
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

            <div className='flex flex-row mt-16 mx-30'>
                {/* Scrollable wrapper */}
                <div className='h-[600px] overflow-y-scroll overflow-x-hidden pt-1 scrollbar-left'>
                    <div className='flex flex-col gap-5 mx-10'>
                        {jobList.map((job, index) => (
                            <JobCard key={index} job={job} />
                        ))}
                    </div>
                </div>
            </div>
                
        </div>
    )
}

export default JobPostingLanding