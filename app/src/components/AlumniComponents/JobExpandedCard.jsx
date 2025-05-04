import { Banknote, BriefcaseBusiness, Ellipsis, FileText, MoveLeft, Pencil, SquareArrowOutUpRight, Star, Trash2, StarOff, Flag } from 'lucide-react'
import { React, useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import axios from 'axios';
import CircularLoading from '../LoadingComponents/circularloading';
import JobModal from '../../RootPages/AlumniPages/job-posting/jobcomponent/jobmodal';
import { jwtDecode } from 'jwt-decode';



function JobExpandedCard({ job, currentUserID, mobileExpanded, setMobileExpanded, setJob, setSelectedJobId, setDependencyTrigger }) {
    const [showOptions, setShowOptions] = useState(false);
    const [isInterested, setIsInterested] = useState(false);
    const [starLoading, setStarLoading] = useState(false);
    const modalRef = useRef(null);
    const ellipsisRef = useRef(null);

//cy
const [showModal, setShowModal] = useState(false);//

    const jobId = job.post_id || job.id;
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

    //cy
    const handleNavigate = () => {
        const token = localStorage.getItem("token");
        const decoded = jwtDecode(token);
        const tokentype = decoded.role;
        const userId = decoded.sub;
        
        // Check if the user is navigating to their own profile
        if (userId === job.user_id) {
            navigate(`/${tokentype}/profile`);
        } else {
            // Navigate to the other user's profile
            navigate(`/${tokentype}/profile/${job.user_id}`);
        }
        };//

    const fetchJobs = async () => {
        try {
            const jobRes = await axios.get(`${API_BASE_URL}/job-postings/${jobId}`);
            // console.log("Job Data:", jobRes.data);
            setJob(jobRes.data);
        } catch (err) {
            console.error(err.response?.data?.message || err.message || 'Something went wrong');
        }
    };

    async function addUserInterested() {
        setStarLoading(true);
        try {
            const url = `${API_BASE_URL}/job/add-user-interested/${jobId}`;
            const response = await axios.post(url, null, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('Success:', response.data);
            await fetchJobs();
            setDependencyTrigger(prev => !prev);
            setIsInterested(true);
            setStarLoading(false);
            return response.data;
        } catch (error) {
            console.error('Error adding user interest:', error);
            setStarLoading(false);
            throw error;
        }
    }

    async function removeUserInterested() {
        setStarLoading(true);
        try {
            const url = `${API_BASE_URL}/job/remove-user-interested/${jobId}`;
            const response = await axios.delete(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    user_id: currentUserID
                }
            });
            console.log('Success:', response.data);
            await fetchJobs();
            setDependencyTrigger(prev => !prev);
            setIsInterested(false);
            setStarLoading(false);
            return response.data;
        } catch (error) {
            console.error('Error removing user interest:', error);
            setStarLoading(false);
            throw error;
        }
    }

    useEffect(() => {
        const fetchInterest = async () => {
            try {
                const interestRes = await axios.get(`${API_BASE_URL}/job/check-user-interested/${jobId}?user_id=${currentUserID}`);
                setIsInterested(interestRes.data);
                setStarLoading(false);
                console.log(interestRes.data);
            } catch (err) {
                console.error(err.response?.data?.message || err.message || 'Something went wrong');
            }
        }
        fetchInterest();
    }, [jobId, currentUserID]);

    const navToEditJobPost = () => {
        navigate(`/alumni/jobPosting/edit/${jobId}`);
    }

    const handleReport = async () => {
        navigate(`/alumni/jobPosting/report/${jobId}`);
    }


    const handleModalBack = () => {
        setMobileExpanded(false)
        setSelectedJobId("");
    }

    return (
        <div className='flex flex-col items-center'>
            {/* WEBSITE VIEW */}
            <div className="md:flex flex-col xl:w-[800px] lg:w-[600px] md:w-[400px] outline-0 gap-5 hidden">
                <div className='flex xl:flex-row flex-col gap-2'>
                    {/* Main Card */}
                    <div className='flex flex-col outline-1 outline-neutral-300 xl:w-7/12 w-full rounded-2xl px-8 pt-4 pb-8 cursor'>
                        {job.user_id === currentUserID ? (
                            <div className="relative ml-auto" ref={ellipsisRef}>
                                <button className='cursor-pointer' onClick={() => setShowOptions(!showOptions)}>
                                <Ellipsis size={30} />
                                </button>
                                {showOptions && (
                                <div
                                    ref={modalRef}
                                    className="absolute right-0 mt-2 w-40 bg-white rounded-2xl shadow-lg border border-gray-200 z-50"
                                >
                                    <button className="flex items-center gap-2 text-red-600 px-4 py-2 w-full hover:bg-red-50 cursor-pointer" onClick={() => setShowModal(true)}>
                                    <Trash2 size={16} />
                                    Delete Post
                                    </button>
                                    <button
                                    className="flex items-center gap-2 text-black px-4 py-2 w-full hover:bg-gray-100 cursor-pointer"
                                    onClick={() => navToEditJobPost()}
                                    >
                                    <Pencil size={16} />
                                    Edit Post
                                    </button>
                                </div>
                                )}
                            </div>
                            ) : (
                            <button
                                className="ml-auto text-red-500 hover:text-red-700 transition flex items-center gap-1 font-satoshi-bold"
                                onClick={() => handleReport(job.id)} // create this function as needed
                            >
                                <Flag size={20} />
                                Report
                            </button>
                            )}
                        <h1 className='font-satoshi-bold text-3xl pt-5 break-words'>{job.title}</h1>
                        <div className="flex items-center gap-2 pt-2">
                            <h1 className='font-satoshi-bold text-lg break-words'>{job.company}</h1>
                        </div>
                        <div className="flex items-center gap-2 pt-1">
                            <h1 className='font-satoshi-medium text-sm'>Posted by</h1>
                            <button 
                            onClick={handleNavigate} 
                            className="cursor-pointer font-satoshi-bold text-left text-primary underline"
                            >
                            {job.user_name}
                            </button>
                        </div>
                        {job.image ? (
                            <img src={job.image} className='w-full rounded-4xl my-3 h-39 object-cover' />
                        ) : (
                            <div className='w-full rounded-4xl my-3 h-39 object-cover bg-primary' />
                        )}
                        <div className="flex items-center gap-4 pt-2">
                            <button
                                onClick={() => {
                                    const url = job.link.startsWith('http') ? job.link : `https://${job.link}`;
                                    window.open(url, '_blank');
                                }}
                                className="rounded-2xl justify-center bg-primary font-satoshi-medium text-white text-md w-32 h-12 cursor-pointer"
                            >
                                Apply Here
                            </button>
                            {starLoading ? (
                                <button
                                    className="flex rounded-2xl justify-center items-center bg-primary text-white w-12 h-12 cursor-pointer"
                                    disabled
                                >
                                    <CircularLoading size={24} />
                                </button>
                            ) : isInterested ? (
                                <button
                                    onClick={removeUserInterested}
                                    className="flex rounded-2xl justify-center items-center bg-primary font-satoshi-medium text-white text-md w-12 h-12 cursor-pointer"
                                >
                                    <Star fill="white" size={24} />
                                </button>
                            ) : (
                                <button
                                    onClick={addUserInterested}
                                    className="flex rounded-2xl bg-primary justify-center items-center border-2 border-primary text-white font-satoshi-medium text-md w-12 h-12 cursor-pointer"
                                >
                                    <Star size={24} />
                                </button>
                            )}
                            <div className="flex items-center gap-1 pt-2 cursor-pointer">
                                {job.user_id === currentUserID ? (
                                    <button
                                        onClick={() => navigate(`/alumni/jobPosting/interested/${jobId}`)}
                                        className="text-lg text-primary font-satoshi-bold hover:hover cursor-pointer"
                                    >
                                        {job.interested_count ?? job.interested_in} are interested
                                    </button>
                                ) : (
                                    <span className="text-lg text-primary font-satoshi-bold">
                                        {job.interested_count ?? job.interested_in} are interested
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* Job Details Card */}
                    <div className='flex flex-col outline-1 outline-neutral-300 xl:w-5/12 w-full rounded-2xl px-8 pt-8 pb-8 cursor'>
                        <h1 className='font-satoshi-bold text-2xl'>Job Details</h1>
                        <div className='flex flex-col gap-2 pt-5'>
                            <div className="flex items-center gap-2 pt-2">
                                <Banknote />
                                <h1 className='font-satoshi-bold text-lg'>Pay</h1>
                            </div>
                            <div
                                className="bg-primary text-white px-3 py-1 rounded-full whitespace-nowrap text-xs font-satoshi-regular w-fit"
                            >
                                PHP {job.salary}
                            </div>
                        </div>
                        <div className='flex flex-col gap-2 pt-3'>
                            <div className="flex items-center gap-2 pt-2">
                                <BriefcaseBusiness />
                                <h1 className='font-satoshi-bold text-lg'>Employment</h1>
                            </div>
                            <div className='flex flex-row gap-2'>
                                <div
                                    className="bg-primary text-white px-3 py-1 rounded-full whitespace-nowrap text-xs font-satoshi-regular w-fit"
                                >
                                    <h1>{job.employment_type}</h1>
                                </div>
                                <div
                                    className="bg-primary text-white px-3 py-1 rounded-full whitespace-nowrap text-xs font-satoshi-regular w-fit"
                                >
                                    <h1>{job.mode}</h1>
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-col gap-2 pt-3'>
                            <div className="flex items-center gap-2 pt-2">
                                <FileText />
                                <h1 className='font-satoshi-bold text-lg'>Tags</h1>
                            </div>
                            <div className="flex flex-row gap-2 overflow-x-auto whitespace-nowrap py-2">
                                {job.tags && job.tags.map((tag, index) => (
                                    <div
                                        key={index}
                                        className="bg-primary text-white px-3 py-1 rounded-full text-xs font-satoshi-regular inline-block"
                                    >
                                        <h1>{tag}</h1>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex flex-col outline-1 outline-neutral-300 w-full rounded-2xl px-8 pt-8 pb-8 cursor'>
                    <h1 className='font-satoshi-bold text-2xl'>Description</h1>
                    <p className='font-satoshi-regular text-md pt-4 text-justify max-h-40 overflow-y-auto'>{job.description}</p>
                </div>
            </div>
            {/* MOBILE VIEW */}
                <div className="fixed inset-0 flex justify-center md:hidden z-50">
                    <motion.div
                        className="w-screen bg-gray-50 p-4 shadow-lg rounded-t-2xl overflow-y-auto flex flex-col gap-4"
                        style={{ maxHeight: "100vh", height: "100%" }}
                        initial={{ y: "100vh" }}
                        animate={{ y: mobileExpanded ? "0vh" : "100vh" }}
                        exit={{ y: "100vh" }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col outline-1 outline-neutral-300 w-full rounded-2xl px-6 pt-4 pb-6">
                                <div className="flex items-center mb-4 cursor-pointer" onClick={handleModalBack}>
                                    <MoveLeft className="text-primary" size={24} />
                                    <p className="text-primary font-satoshi-medium text-base ml-2">Back</p>
                                </div>
                                {job.user_id === currentUserID ? (
                                <div className="relative ml-auto" ref={ellipsisRef}>
                                    <button className="cursor-pointer" onClick={() => setShowOptions(!showOptions)}>
                                    <Ellipsis size={30} />
                                    </button>
                                    {showOptions && (
                                    <div
                                        ref={modalRef}
                                        className="absolute right-0 mt-2 w-40 bg-white rounded-2xl shadow-lg border border-gray-200 z-50"
                                    >
                                        <button className="flex items-center gap-2 text-red-600 px-4 py-2 w-full hover:bg-red-50 cursor-pointer" onClick={() => setShowModal(true)}>
                                        <Trash2 size={16} />
                                        Delete Post
                                        </button>
                                        <button
                                        className="flex items-center gap-2 text-black px-4 py-2 w-full hover:bg-gray-100 cursor-pointer"
                                        onClick={() => navToEditJobPost()}
                                        >
                                        <Pencil size={16} />
                                        Edit Post
                                        </button>
                                    </div>
                                    )}
                                </div>
                                ) : (
                                <button
                                    className="ml-auto text-red-500 hover:text-red-700 transition flex items-center gap-1 font-satoshi-bold"
                                    onClick={() => handleReport()} // Implement handleReport
                                >
                                    <Flag size={20} />
                                    Report
                                </button>
                                )}
                                <h1 className="font-satoshi-bold text-2xl pt-3">{job.title}</h1>
                                <div className="flex items-center gap-2 pt-2">
                                    <h1 className="font-satoshi-bold text-base">{job.company}</h1>
                                    
                                </div>
                                <div className="flex items-center gap-2 pt-1">
                                    <h1 className="font-satoshi-medium text-xs">Posted by</h1>
                                    <h1 
                                    className="cursor-pointer font-satoshi-bold text-primary underline" 
                                    onClick={handleNavigate}
                                    >
                                    {job.user_name}
                                    </h1> 
                                </div>
                                {job.image ? (
                                    <img src={job.image} className="w-full rounded-2xl my-3 h-32 object-cover" alt="Job image" />
                                ) : (
                                    <div className="w-full rounded-2xl my-3 h-32 bg-primary" />
                                )}
                                <div className="flex items-center gap-3 pt-2 flex-wrap">
                                    <button
                                        onClick={() => {
                                            const url = job.link.startsWith('http') ? job.link : `https://${job.link}`;
                                            window.open(url, '_blank');
                                        }}
                                        className="rounded-2xl bg-primary font-satoshi-medium text-white text-sm w-28 h-10 cursor-pointer"
                                        aria-label="Apply for job"
                                    >
                                        Apply Here
                                    </button>
                                    {starLoading ? (
                                        <button
                                            className="flex rounded-2xl justify-center items-center bg-primary text-white w-10 h-10 cursor-pointer"
                                            disabled
                                        >
                                            <CircularLoading size={24} />
                                        </button>
                                    ) : isInterested ? (
                                        <button
                                            onClick={removeUserInterested}
                                            className="flex rounded-2xl justify-center items-center bg-primary text-white w-10 h-10 cursor-pointer"
                                            aria-label="Remove interest"
                                        >
                                            <Star fill="white" size={20} />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={addUserInterested}
                                            className="flex rounded-2xl bg-primary justify-center items-center border-2 border-primary text-white w-10 h-10 cursor-pointer"
                                            aria-label="Mark as interested"
                                        >
                                            <Star size={20} />
                                        </button>
                                    )}
                                    <div className="flex items-center gap-1 cursor-pointer">
                                        {job.user_id === currentUserID ? (
                                            <button
                                                onClick={() => navigate(`/alumni/jobPosting/interested/${jobId}`)}
                                                className="text-sm text-primary font-satoshi-bold hover:underline cursor-pointer"
                                                aria-label="View interested users"
                                            >
                                                {job.interested_count ?? job.interested_in} are interested
                                            </button>
                                        ) : (
                                            <span className="text-sm text-primary font-satoshi-bold">
                                                {job.interested_count ?? job.interested_in} are interested
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col outline outline-1 outline-neutral-300 w-full rounded-2xl px-6 pt-6 pb-6">
                                <h1 className="font-satoshi-bold text-xl">Job Details</h1>
                                <div className="flex flex-col gap-2 pt-4">
                                    <div className="flex items-center gap-2">
                                        <Banknote size={18} />
                                        <h1 className="font-satoshi-bold text-base">Pay</h1>
                                    </div>
                                    <div className="bg-primary text-white px-3 py-1 rounded-full text-xs font-satoshi-regular w-fit">
                                        PHP {job.salary}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2 pt-3">
                                    <div className="flex items-center gap-2">
                                        <BriefcaseBusiness size={18} />
                                        <h1 className="font-satoshi-bold text-base">Employment</h1>
                                    </div>
                                    <div className="flex flex-row gap-2 flex-wrap">
                                        <div className="bg-primary text-white px-3 py-1 rounded-full text-xs font-satoshi-regular w-fit">
                                            {job.employment_type}
                                        </div>
                                        <div className="bg-primary text-white px-3 py-1 rounded-full text-xs font-satoshi-regular w-fit">
                                            {job.mode}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2 pt-3">
                                    <div className="flex items-center gap-2">
                                        <FileText size={18} />
                                        <h1 className="font-satoshi-bold text-base">Tags</h1>
                                    </div>
                                    <div className="flex flex-row gap-2 overflow-x-auto whitespace-nowrap py-2">
                                        {job.tags &&
                                            job.tags.map((tag, index) => (
                                                <div
                                                    key={index}
                                                    className="bg-primary text-white px-3 py-1 rounded-full text-xs font-satoshi-regular"
                                                >
                                                    {tag}
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col outline outline-1 outline-neutral-300 w-full rounded-2xl px-6 pt-6 pb-6">
                                <h1 className="font-satoshi-bold text-xl">Description</h1>
                                <p className="font-satoshi-regular text-sm pt-3 text-justify max-h-32 overflow-y-auto">{job.description}</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
          
            {showModal && (
            <JobModal
                jobId={jobId}
                setShowModal={setShowModal}
                onCancel={() => setShowModal(false)}
                options={{ type: "delete" }}
                setDependencyTrigger={setDependencyTrigger}
            />
            )}
                    </div>
                );
            }

export default JobExpandedCard