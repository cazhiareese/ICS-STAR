import { Banknote, BriefcaseBusiness, Ellipsis, FileText, MoveLeft, Pencil, SquareArrowOutUpRight, Star, Trash2 } from 'lucide-react'
import {React, useState, useEffect, useRef} from 'react'
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";

function JobExpandedCard({job, currentUserID, mobileExpanded, setMobileExpanded}) {
    const [showOptions, setShowOptions] = useState(false);
    const modalRef = useRef(null);
    const ellipsisRef = useRef(null);

    console.log(job);
    const jobId = job.post_id || job.id; 
    const navigate = useNavigate();

    // const navToEditJobPost = () => {
    //     console.log("Edit Job Posting clicked");
    //     console.log(jobId);
    //     navigate(`/alumni/editjobPosting/${jobId}`);
    // };

    // Close modal on outside click
    // useEffect(() => {
    //     const handleClickOutside = (event) => {
    //         if (
    //             modalRef.current &&
    //             !modalRef.current.contains(event.target) &&
    //             !ellipsisRef.current.contains(event.target)
    //         ) {
    //             setShowOptions(false);
    //         }
    //     };
    //     document.addEventListener('mousedown', handleClickOutside);
    //     return () => {
    //         document.removeEventListener('mousedown', handleClickOutside);
    //     };
    // }, []);

    return (

        <div>
            {/* WEBSITE VIEW */}
            <div className="md:flex flex-col lg:w-[800px] w-[500px] outline-0 gap-5 hidden">
                <div className='flex lg:flex-row flex-col gap-2'>
                    {/* Main Card */}
                    <div className='flex flex-col outline-1 outline-neutral-300 lg:w-7/12 w-full rounded-2xl px-8 pt-4 pb-8 cursor'>
                        {/* Ellipsis & Modal */}
                        {job.user_id === currentUserID && (
                            <div className="relative ml-auto" ref={ellipsisRef}>
                                <button className='cursor-pointer' onClick={() => setShowOptions(!showOptions)}>
                                    <Ellipsis size={30} />
                                </button>
                                {showOptions && (
                                    <div
                                        ref={modalRef}
                                        className="absolute right-0 mt-2 w-40 bg-white rounded-2xl shadow-lg border border-gray-200 z-50"
                                    >
                                        <button className="flex items-center gap-2 text-red-600 px-4 py-2 w-full hover:bg-red-50 cursor-pointer">
                                            <Trash2 size={16} />
                                            Delete Post
                                        </button>
                                        <button className="flex items-center gap-2 text-black px-4 py-2 w-full hover:bg-gray-100 cursor-pointer"
                                        onClick={()=>navToEditJobPost()}>
                                            <Pencil size={16} 
                                            
                                            />
                                            Edit Post
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                        {/* Title and Company */}
                        <h1 className='font-satoshi-bold text-3xl pt-5'>{job.title}</h1>
                        <div className="flex items-center gap-2 pt-2">
                            <h1 className='font-satoshi-bold text-lg'>{job.company}</h1>
                            {/* TODO: Add onclick */}
                            {/* <button className='cursor-pointer'
                            onClick={() => {
                                const url = job.link.startsWith('http') ? job.link : `https://${job.link}`;
                                window.open(url, '_blank');
                            }}
                            >
                                <SquareArrowOutUpRight size={20} />
                            </button>  */}
                        </div>
                        <div className="flex items-center gap-2 pt-1">
                            <h1 className='font-satoshi-medium text-sm'>Posted by</h1>
                            <h1 className='cursor-pointer font-satoshi-bold'>{job.user_name}</h1> 
                        </div>  

                        {/* Job Image */}
                        <img src={job.image} className='w-sm rounded-4xl my-3 h-39 object-cover'/>
                        
                        <div className="flex items-center gap-4 pt-2">
                            {/* Apply Button TODO: Add onclick */}
                            <button 
                            onClick={() => {
                                const url = job.link.startsWith('http') ? job.link : `https://${job.link}`;
                                window.open(url, '_blank');
                            }} 
                            className=" rounded-2xl justify-center bg-primary font-satoshi-medium text-white text-md w-32 h-12 cursor-pointer"
                            >
                                Apply Here
                            </button>

                            {/* favorite Button TODO: Add onclick */}
                            <button  
                            className="flex rounded-2xl justify-center items-center bg-primary font-satoshi-medium text-white text-md w-12 h-12 cursor-pointer"
                            >
                                <Star size={24}/>
                            </button>

                            {/* Interested count TODO: Add onclick */}
                            <div className="flex items-center gap-1 pt-2 cursor-pointer">
                                {job.user_id === currentUserID ? (
                                    <button
                                        onClick={() => navigate(`/alumni/jobPosting/interested/${jobId}`)}
                                        className="text-lg text-primary font-satoshi-bold hover:hover cursor-pointer"
                                    >
                                        {job.interested_count} are interested
                                    </button>
                                    ) : (
                                    <span className="text-lg text-primary font-satoshi-bold">
                                        {job.interested_count} are interested
                                    </span>
                                    )}
                            </div>
                        </div>
                        
                    </div>

                    {/* Job Details Card */}
                    <div className='flex flex-col outline-1 outline-neutral-300 lg:w-5/12 w-full rounded-2xl px-8 pt-8 pb-8 cursor'>
                        {/* Job Details */}
                        <h1 className='font-satoshi-bold text-2xl'>Job Details</h1>
                        {/* Salary */}
                        <div className='flex flex-col gap-2 pt-5'>
                            <div className="flex items-center gap-2 pt-2">
                                <Banknote />
                                <h1 className='font-satoshi-bold text-lg'>Pay</h1>
                            </div>
                            {/* Actual Value TODO: edit */}
                            <div
                                className="bg-primary text-white px-3 py-1 rounded-full whitespace-nowrap text-xs font-satoshi-regular w-fit"
                            >
                                PHP {job.salary}
                            </div>
                        </div>

                        {/* Employment */}
                        <div className='flex flex-col gap-2 pt-3'>
                            <div className="flex items-center gap-2 pt-2">
                                <BriefcaseBusiness />
                                <h1 className='font-satoshi-bold text-lg'>Employment</h1>
                            </div>
                            {/* Actual Value TODO: edit */}
                            <div className='flex flex-row gap-2'>
                                {/* Employment type */}
                                <div
                                    className="bg-primary text-white px-3 py-1 rounded-full whitespace-nowrap text-xs font-satoshi-regular w-fit"
                                >   
                                    <h1>{job.employment_type}</h1>
                                </div>

                                {/* job mode */}
                                <div
                                    className="bg-primary text-white px-3 py-1 rounded-full whitespace-nowrap text-xs font-satoshi-regular w-fit"
                                >   
                                    <h1>{job.mode}</h1>
                                </div>
                                
                            </div>
                        </div>


                        {/* Tags*/}
                        <div className='flex flex-col gap-2 pt-3'>
                            <div className="flex items-center gap-2 pt-2">
                                <FileText /> 
                                <h1 className='font-satoshi-bold text-lg'>Tags</h1>
                            </div>
                            {/* Actual Value TODO: edit */}
                            <div className="flex flex-row gap-2 overflow-x-auto whitespace-nowrap py-2">
                            {/* Job Tags */}
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

                {/* Description Card */}
                <div className='flex flex-col outline-1 outline-neutral-300 w-full rounded-2xl px-8 pt-8 pb-8 cursor'>
                    {/* Description */}
                    <h1 className='font-satoshi-bold text-2xl'>Description</h1>
                    <p className='font-satoshi-regular text-md pt-4 text-justify max-h-40 overflow-y-auto'>{job.description}</p>
                </div>
            </div>


            {/* MOBILE VIEW */}
            <motion.div
            className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[90%] bg-gray-50 z-50 p-5 shadow-lg rounded-t-2xl md:hidden overflow-y-auto flex flex-col gap-5"
            style={{ maxHeight: "100vh", height: "100%" }}
            initial={{ y: "100vh" }}
            animate={{ y: mobileExpanded ? "0vh" : "100vh" }}
            exit={{ y: "100vh" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            >
                
                <div className='flex md:flex-row flex-col gap-5 '>
                    {/* Main Card */}
                    <div className='flex flex-col outline-1 outline-neutral-300 w-full rounded-2xl px-8 pt-4 pb-8 cursor'>
                        <div className="flex items-center mb-6 cursor-pointer" onClick={() => setMobileExpanded(false)}>
                            <MoveLeft className="text-primary" />
                            <p className="text-primary font-satoshi-medium text-lg ml-2 ">Back</p>
                        </div>
                        {/* Ellipsis & Modal */}
                        {job.user_id === currentUserID && (
                            <div className="relative ml-auto" ref={ellipsisRef}>
                                <button className='cursor-pointer' onClick={() => setShowOptions(!showOptions)}>
                                    <Ellipsis size={30} />
                                    
                                </button>
                                {showOptions && (
                                    <div
                                        ref={modalRef}
                                        className="absolute right-0 mt-2 w-40 bg-white rounded-2xl shadow-lg border border-gray-200 z-50"
                                    >
                                        <button className="flex items-center gap-2 text-red-600 px-4 py-2 w-full hover:bg-red-50 cursor-pointer">
                                            <Trash2 size={16} />
                                            Delete Post
                                        </button>
                                        <button className="flex items-center gap-2 text-black px-4 py-2 w-full hover:bg-gray-100 cursor-pointer"
                                        onClick={()=>navToEditJobPost()}>
                                            <Pencil size={16} 
                                            
                                            />
                                            Edit Post
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                        {/* Title and Company */}
                        <h1 className='font-satoshi-bold text-3xl pt-5'>{job.title}</h1>
                        <div className="flex items-center gap-2 pt-2">
                            
                            <h1 className='font-satoshi-bold text-lg'>{job.company}</h1>
                            {/* TODO: Add onclick */}
                            <button className='cursor-pointer'
                            onClick={() => {
                                const url = job.link.startsWith('http') ? job.link : `https://${job.link}`;
                                window.open(url, '_blank');
                            }}
                            >
                                <SquareArrowOutUpRight size={20} />
                            </button> 
                        </div>
                        <div className="flex items-center gap-2 pt-1">
                            <h1 className='font-satoshi-medium text-sm'>Posted by</h1>
                            <h1 className='cursor-pointer font-satoshi-bold'>{job.user_name}</h1> 
                        </div>  

                        {/* Job Image */}
                        <img src={job.image} className='w-sm rounded-4xl my-3 h-39 object-cover'/>
                        
                        <div className="flex items-center gap-4 pt-2">
                            {/* Apply Button TODO: Add onclick */}
                            <button  
                            className=" rounded-2xl justify-center bg-primary font-satoshi-medium text-white text-md w-32 h-12 cursor-pointer"
                            >
                                Apply Here
                            </button>

                            {/* favorite Button TODO: Add onclick */}
                            <button  
                            className="flex rounded-2xl justify-center items-center bg-primary font-satoshi-medium text-white text-md w-12 h-12 cursor-pointer"
                            >
                                <Star size={24}/>
                            </button>

                            {/* Interested count TODO: Add onclick */}
                            <div className="flex items-center gap-1 pt-2 cursor-pointer">
                                {job.user_id === currentUserID ? (
                                    <button
                                        onClick={() => navigate(`/alumni/jobPosting/interested/${jobId}`)}
                                        className="text-lg text-primary font-satoshi-bold hover:hover cursor-pointer"
                                    >
                                        {job.interested_count} are interested
                                    </button>
                                    ) : (
                                    <span className="text-lg text-primary font-satoshi-bold">
                                        {job.interested_count} are interested
                                    </span>
                                )}

                            </div>
                        </div>
                        
                    </div>

                    {/* Job Details Card */}
                    <div className='flex flex-col outline-1 outline-neutral-300 w-full rounded-2xl px-8 pt-8 pb-8 cursor'>
                        {/* Job Details */}
                        <h1 className='font-satoshi-bold text-2xl'>Job Details</h1>
                        {/* Salary */}
                        <div className='flex flex-col gap-2 pt-5'>
                            <div className="flex items-center gap-2 pt-2">
                                <Banknote />
                                <h1 className='font-satoshi-bold text-lg'>Pay</h1>
                            </div>
                            {/* Actual Value TODO: edit */}
                            <div
                                className="bg-primary text-white px-3 py-1 rounded-full whitespace-nowrap text-xs font-satoshi-regular w-fit"
                            >
                                PHP {job.salary}
                            </div>
                        </div>

                        {/* Employment */}
                        <div className='flex flex-col gap-2 pt-3'>
                            <div className="flex items-center gap-2 pt-2">
                                <BriefcaseBusiness />
                                <h1 className='font-satoshi-bold text-lg'>Employment</h1>
                            </div>
                            {/* Actual Value TODO: edit */}
                            <div className='flex flex-row gap-2'>
                                {/* Employment type */}
                                <div
                                    className="bg-primary text-white px-3 py-1 rounded-full whitespace-nowrap text-xs font-satoshi-regular w-fit"
                                >   
                                    <h1>{job.employment_type}</h1>
                                </div>

                                {/* job mode */}
                                <div
                                    className="bg-primary text-white px-3 py-1 rounded-full whitespace-nowrap text-xs font-satoshi-regular w-fit"
                                >   
                                    <h1>{job.mode}</h1>
                                </div>
                                
                            </div>
                        </div>

                        {/* Tags*/}
                        <div className='flex flex-col gap-2 pt-3'>
                            <div className="flex items-center gap-2 pt-2">
                                <FileText /> 
                                <h1 className='font-satoshi-bold text-lg'>Tags</h1>
                            </div>
                            {/* Actual Value TODO: edit */}
                            <div className="flex flex-row gap-2 overflow-x-auto whitespace-nowrap py-2">
                            {/* Job Tags */}
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
                

                {/* Description Card */}
                <div className='flex flex-col outline-1 outline-neutral-300 w-full rounded-2xl px-8 pt-8 pb-8 cursor'>
                    {/* Description */}
                    <h1 className='font-satoshi-bold text-2xl'>Description</h1>
                    <p className='font-satoshi-regular text-md pt-4 text-justify max-h-40 overflow-y-auto'>{job.description}</p>
                    
                </div>
            </motion.div>
        </div>
    )
}

export default JobExpandedCard