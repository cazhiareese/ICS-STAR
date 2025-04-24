import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import SearchBar from '../../../components/AlumniComponents/searchbar'
import JobSearchBar from '../../../components/AlumniComponents/jobsearchbar';
import { BriefcaseBusiness, Plus, PlusCircle } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import JobCard from '../../../components/AlumniComponents/JobCard';
import JobExpandedCard from '../../../components/AlumniComponents/JobExpandedCard';
import CircularLoading from '../../../components/LoadingComponents/circularloading';

function JobPostingLanding() {
    const [searchInput, setSearchInput] = useState("");
    const [selectedJobId, setSelectedJobId] = useState(""); //the job id will be stored here
    const [selectedJob, setSelectedJob] = useState({});
    const [jobList, setJobList] = useState([]);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const token = localStorage.getItem('token'); 
        if (token) {
            try {
            const decoded = jwtDecode(token);
            console.log("Decoded JWT:", decoded);
            setUserId(decoded.sub); 
            // console.log(decoded.sub)
            } catch (error) {
            console.error("Invalid token", error);
            }
        }
    }, []);

    // For Dummy testing only
    // useEffect(() => {
    //     // Job Dummy Data
    //     // const job = {
    //     //     title: "Data Scientist",
    //     //     company: "Google Alphabet",
    //     //     description: "Lorem ipsum dolor sit amet consectetur. Risus tellus odio sit vel ut nibh natoque id. Eu facilisis augue neque non enim a duis. Odio tortor vestibulum gravida nullam quis sed enim ipsum ullamcorper. Venenatis nulla vulputate et ut ut rhoncu...",
    //     //     salary: 20000,
    //     //     tags: ["Software Engineering", "UI/UX"],
    //     //     employment_type: "Full-time",
    //     //     link: "LinkedIn.com",
    //     //     image: "https://www.computersciencedegreehub.com/wp-content/uploads/2020/05/What-is-a-Software-Engineer-scaled.jpg",
    //     //     alumni: "Roche Quejada" //Tentative
    //     // }

    //     const job = {
    //         title: "Data Scientist",
    //         company: "Google Alphabet",
    //         description: "Lorem ipsum dolor sit amet consectetur. Risus tellus odio sit vel ut nibh natoque id. Eu facilisis augue neque non enim a duis. Odio tortor vestibulum gravida nullam quis sed enim ipsum ullamcorper. Venenatis nulla vulputate et ut ut rhoncu...",
    //         user_name: "Roche Quejada",
    //         tags: ["Software Engineering", "UI/UX","Software Engineering", "UI/UX","Software Engineering", "UI/UX"],
    //         interested_count: 5
    //     }
        
    //     const jobs = [job,job,job, job, job, job, job];
    //     setJobList(jobs);
        
    // }, []);




    // useEffect(() => {
    //     // Job Dummy Data
    //     const job = {
    //         title: "Data Scientist",
    //         company: "Google Alphabet",
    //         description: "Lorem ipsum dolor sit amet consectetur. Risus tellus odio sit vel ut nibh natoque id. Eu facilisis augue neque non enim a duis. Odio tortor vestibulum gravida nullam quis sed enim ipsum ullamcorper. Venenatis nulla vulputate et ut ut rhoncu...",
    //         salary: 20000,
    //         tags: ["Software Engineering", "UI/UX","Software Engineering", "UI/UX","Software Engineering", "UI/UX"],
    //         employment_type: "Full-time",
    //         mode: "On-site",
    //         link: "LinkedIn.com",
    //         image: "https://www.computersciencedegreehub.com/wp-content/uploads/2020/05/What-is-a-Software-Engineer-scaled.jpg",
    //         user_name: "Roche Quejada", //Tentative
    //         interested_count: 5,
    //         user_id: "2543d5a7-f7f3-4a90-92f7-d0a8595db26b"
    //     }

    //     setSelectedJob(job);
        
    // }, []);

    // BASE URL ENV
    const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
    // Get all jobs
    useEffect(() => {
        const fetchJobs = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/job-postings`);
            if (!response.ok) {
            throw new Error('Failed to fetch jobs');
            }
            const data = await response.json();
            console.log(data)
            setJobList(data);
        } catch (err) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
        };

        fetchJobs();
    }, []);

    // Get job by id
    useEffect(() => {
        const fetchJobs = async () => {
        
        try {
            const response = await fetch(`${API_BASE_URL}/job-postings/${selectedJobId}`);
            if (!response.ok) {
            throw new Error('Failed to fetch job using id');
            }
            const data = await response.json();
            console.log(data)
            // Set selected job
            setSelectedJob(data)
        } catch (err) {
            setError(err.message || 'Something went wrong');
        } //finally {
        //     setLoading(false);
        // }
        };

        fetchJobs();
    }, [selectedJobId]);

    // Navigation to create job post
    const navigate = useNavigate();
    const navToCreateJobPost = () => {
        navigate('createJobPosting', { relative: 'path' });
    };

    

    return (
        <div className='flex flex-col mb-16'>
            <div className="flex flex-row w-full mt-8 shadow-md pb-8  rounded-full px-8">
                {/* Centered Search Bar */}
                <div className="flex-1 flex justify-center ml-50">
                    <JobSearchBar 
                    searchInput={searchInput}
                    setSearchInput={setSearchInput}
                    setLoading={setLoading}
                    setJobList={setJobList}
                    />
                </div>

                {/* Button aligned to the right */}
                <button  
                    onClick={navToCreateJobPost}
                    className="flex items-center gap-2 w-56 h-14 ml-6 bg-primary text-white font-satoshi-medium text-md rounded-3xl justify-center cursor-pointer"
                >
                    <PlusCircle />
                    Create Job Posting
                </button>
            </div>

            <div className='flex flex-row mt-16 mx-30 gap-5 justify-center'>
                {/* Scrollable wrapper */}
                <div className='h-[1000px] overflow-y-scroll overflow-x-hidden pt-1 scrollbar-left w-xl outline-0'>
                    {!loading ? (
                        <div className='flex flex-col gap-5 mx-10'>
                        {jobList.map((job, index) => (
                            <JobCard
                            key={index}
                            job={job}
                            selectedJobId={selectedJobId}
                            setSelectedJobId={setSelectedJobId}
                            />
                        ))}
                        </div>
                    ) : (
                        <div className='flex flex-row justify-center h-full gap-5'>
                            <h1 className='text-xl font-satoshi-bold text-gray-400'> Loading Jobs</h1>
                            <CircularLoading />
                        </div>
                    )}
                </div>



                {/* Job Preview */} 
                
                {!selectedJob || !selectedJob.tags ? (
                    <div className="flex flex-col items-center justify-center w-lg mr-10 outline-0">
                        <h1 className='text-primary opacity-50'><BriefcaseBusiness size={200}/></h1>
                        <h1 className='text-primary opacity-50 text-3xl font-satoshi-bold'>Select Job Posting</h1>
                    </div>
                ) : (
                    <JobExpandedCard job={selectedJob} currentUserID={userId} />
                )}
                
            </div>
                
        </div>
    )
}

export default JobPostingLanding