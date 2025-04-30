import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import SearchBar from '../../../components/AlumniComponents/searchbar'
import JobSearchBar from '../../../components/AlumniComponents/jobsearchbar';
import { BriefcaseBusiness, PlusCircle, Filter, ChevronDown } from 'lucide-react';
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
    const [loading, setLoading] = useState(true);

    const [showFilterModal, setShowFilterModal] = useState(false);

    const [showWorkTypeDropdown, setShowWorkTypeDropdown] = useState(false);
    const [selectedWorkTypes, setSelectedWorkTypes] = useState([]);

    const [showRemoteOptionDropdown, setShowRemoteDropdown] = useState(false);
    const [selectedRemoteOption, setSelectedRemoteOption] = useState([]); 

    const [showSalaryRangeDropdown, setShowSalaryRangeDropdown] = useState(false);
    const [salaryRange, setSalaryRange] = useState({ min: 0, max: 500000 });

    const [mobileExpanded, setMobileExpanded] = useState(false);

    const toggleWorkType = (workType) => {
        setSelectedWorkTypes((prev) =>
            prev.includes(workType)
            ? prev.filter((type) => type !== workType)
            : [...prev, workType]
        );
        console.log(selectedWorkTypes);
    };

    const toggleRemoteType = (remoteType) => {
        setSelectedRemoteOption((prev) =>
            prev.includes(remoteType)
            ? prev.filter((type) => type !== remoteType)
            : [...prev, remoteType]
        );
        console.log(selectedRemoteOption)
    };

    const handleSalaryChange = (e) => {
        const { name, value } = e.target;
        setSalaryRange((prev) => ({
            ...prev,
            [name]: value,
        }));
        console.log(salaryRange);
    };
    

    const workTypeOptions = [
        "All",
        "Full time",
        "Part time",
        "Contractual",
        "Freelance",
        "Internship",
        "Apprenticeship",
    ];

    const remoteOptions = [
        "All",
        "Onsite",
        "Remote",
        "Hybrid"
    ];

    const [usertype, setUserType] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token'); 
        if (token) {
            try {
            const decoded = jwtDecode(token);
            console.log("Decoded JWT:", decoded);
            setUserId(decoded.sub); 
            setUserType(decoded.role); //cyrus was here
            // console.log(decoded.sub)
            } catch (error) {
            console.error("Invalid token", error);
            }
        }
    }, []);

    
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

    // Get company by id
    useEffect(() => {
        const fetchJobs = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/get-company-by-id/${userId}`);
            if (!response.ok) {
            throw new Error('Failed to fetch company');
            }
            const data = await response.json();
            console.log(data)
            
        } catch (err) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
        };

        fetchJobs();
    }, []);
    

    return (
        <div className='flex flex-col mb-16'>
            <div className="flex flex-row w-full mt-8 shadow-md pb-8  rounded-full md:px-8 px-4">
                {/* Filter Button aligned to the left */}
                <button  
                    onClick={() => setShowFilterModal(!showFilterModal)}
                    className="flex items-center gap-2 md:w-32 w-12 md:h-14 h-12  text-primary border-primary border-1 font-satoshi-medium text-md rounded-3xl justify-center cursor-pointer"
                >
                    <Filter />
                    <h1 className='hidden md:block'>Filters</h1>
                    

                </button>

                {/* Filters */}
                {showFilterModal && (
                    <div className="absolute mt-20 md:ml-6 flex flex-col md:flex-row gap-4 bg-white shadow-md rounded-3xl py-4 px-6 w-[90vw] max-w-5xl z-50">
                        {/* Dropdown 1 */}
                        <button 
                        onClick={() => setShowWorkTypeDropdown((prev) => !prev)}
                        className="border border-gray-300 rounded-2xl px-4 py-2 w-full md:min-w-[180px] text-center font-satoshi-medium text-gray-700 cursor-pointer">
                            <div className="flex flex-row items-center">
                                <span className="truncate">
                                    {selectedWorkTypes.length > 0
                                    ? selectedWorkTypes.slice(0, 5).join(", ") + (selectedWorkTypes.length > 2 ? "..." : "")
                                    : "Work Type"}
                                </span>
                                <h1 className="ml-auto"><ChevronDown size={30} /></h1>
                            </div>

                            
                            {/* dropDown for work type */}
                            {showWorkTypeDropdown && (
                            <div onClick={(e) => e.stopPropagation()} className="absolute top-16 bg-white rounded-2xl shadow-md p-4 w-[80vw] md:w-60">
                                {workTypeOptions.map((type) => (
                                    <label
                                    key={type}
                                    className="flex items-center gap-3 py-2 cursor-pointer hover:bg-gray-50 rounded-lg px-2"
                                    >
                                    <input
                                        type="checkbox"
                                        checked={selectedWorkTypes.includes(type)}
                                        onChange={() => toggleWorkType(type)}
                                        className="w-5 h-5 text-blue-600 accent-primary"
                                    />
                                    <span className="text-gray-700 font-satoshi-medium">
                                        {type}
                                    </span>
                                    </label>
                                ))}
                            </div>
                            )}
                        </button>

                        {/* Dropdown 2 */}
                        <button 
                        onClick={() => setShowRemoteDropdown((prev) => !prev)}
                        className="border border-gray-300 rounded-2xl px-4 py-2 w-full md:min-w-[180px] text-center font-satoshi-medium text-gray-700 cursor-pointer">
                            <div className="flex flex-row items-center">
                                <span className="truncate">
                                    {remoteOptions.length > 0
                                    ? remoteOptions.slice(0, 5).join(", ") + (remoteOptions.length > 2 ? "..." : "")
                                    : "Work Type"}
                                </span>
                                <h1 className="ml-auto"><ChevronDown size={30} /></h1>
                            </div>
                            {showRemoteOptionDropdown && (
                            <div onClick={(e) => e.stopPropagation()} className="absolute md:top-16 top-30 bg-white rounded-2xl shadow-md p-4 w-[80vw] md:w-60">
                                {remoteOptions.map((type) => (
                                    <label
                                    key={type}
                                    className="flex items-center gap-3 py-2 cursor-pointer hover:bg-gray-50 rounded-lg px-2"
                                    >
                                    <input
                                        type="checkbox"
                                        checked={selectedRemoteOption.includes(type)}
                                        onChange={() => toggleRemoteType(type)}
                                        className="w-5 h-5 text-blue-600 accent-primary"
                                    />
                                    <span className="text-gray-700 font-satoshi-medium">
                                        {type}
                                    </span>
                                    </label>
                                ))}
                            </div>
                            )}
                        </button>

                        {/* Dropdown 3 */}
                        <button 
                        onClick={() => setShowSalaryRangeDropdown((prev) => !prev)}
                        className="border border-gray-300 rounded-2xl px-4 py-2 w-full md:min-w-[180px] text-center font-satoshi-medium text-gray-700 cursor-pointer">
                            <div className='flex flex-row'>
                                PHP {salaryRange.min} - PHP {salaryRange.max}
                                <h1 className='ml-auto'><ChevronDown size={30} /></h1>
                            </div>
                            
                            {showSalaryRangeDropdown && (
                                <div onClick={(e) => e.stopPropagation()} className="absolute md:top-16 top-46 bg-white rounded-2xl shadow-md p-4 w-[80vw] md:w-60">
                                    <div className="flex flex-col">
                                        <label className="text-left font-satoshi-medium text-gray-600 text-sm mb-1">Minimum Salary</label>
                                        <input
                                            type="number"
                                            name="min"
                                            value={salaryRange.min}
                                            onChange={handleSalaryChange}
                                            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                            min="0"
                                        />
                                    </div>
                                    
                                    <div className="flex flex-col">
                                        <label className="text-left font-satoshi-medium text-gray-600 text-sm mb-1">Maximum Salary</label>
                                        <input
                                            type="number"
                                            name="max"
                                            value={salaryRange.max}
                                            onChange={handleSalaryChange}
                                            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                            min={salaryRange.min}
                                        />
                                    </div>
                                </div>
                            )}
                        </button>

                        

                    
                        
                    </div>
                )}
                {/* Centered Search Bar */}
                <div className="flex-1 flex justify-center md:ml-30 ml-8">
                    <JobSearchBar 
                    searchInput={searchInput}
                    setSearchInput={setSearchInput}
                    setLoading={setLoading}
                    setJobList={setJobList}
                    />
                </div>

                {/* Button aligned to the right */}

{usertype !== "student" && (
                <button  
                    onClick={navToCreateJobPost}
                    className="flex items-center gap-2 md:w-56 w-12 md:h-14 h-12 ml-6 bg-primary text-white font-satoshi-medium text-md rounded-3xl justify-center cursor-pointer"
                >
                    <PlusCircle />
                    <h1 className='md:block hidden'>Create Job Posting</h1>
                </button>
)}

            </div>

            <div className='flex flex-row mt-16 gap-2 justify-center'>
                {/* Scrollable wrapper */}
                <div className='h-[660px] overflow-y-scroll overflow-x-hidden pt-1 scrollbar-left w-xl outline-0'>
                    {!loading ? (
                        <div className='flex flex-col gap-5 items-center '>
                            {jobList.map((job, index) => (
                                <JobCard
                                key={index}
                                job={job}
                                selectedJobId={selectedJobId}
                                setSelectedJobId={setSelectedJobId}
                                setMobileExpanded={setMobileExpanded}
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
                    <div className="md:flex flex-col items-center justify-center w-[800px] outline-0  hidden">
                        <h1 className='text-primary opacity-50'><BriefcaseBusiness size={200}/></h1>
                        <h1 className='text-primary opacity-50 text-3xl font-satoshi-bold'>Select Job Posting</h1>
                    </div>
                ) : (
                    <JobExpandedCard job={selectedJob} currentUserID={userId} mobileExpanded={mobileExpanded} setMobileExpanded={setMobileExpanded} />
                )}
                
            </div>
                
        </div>
    )
}

export default JobPostingLanding