import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const JobPostSummary = ({ 
    isOpen, 
    setIsOpen,
    job,
}) => {
    if (!isOpen) return null;
    

    const closeModal = () => {
        setIsOpen(false);
    };

    // Navigate back
    const navigate = useNavigate();
    const navToJobPostLanding= () => {
        navigate('..', { relative: 'path' });
    }

    return (
        <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-100 h-auto">
            <motion.div
                className="bg-white md:w-xl md:max-w-3/5 max-w-4/5 rounded-3xl shadow-lg overflow-y-auto h-9/12"
                initial={{ opacity: 0, y: -100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
                transition={{ duration: 0.3 }}
            >
                
                <div className="flex flex-col justify-between p-10">
                    <button className="ml-auto outline-1 outline-gray-400 rounded-full p-2 cursor-pointer" onClick={closeModal}>
                        <X onClick={navToJobPostLanding} size={20} />
                    </button>
                    <img src={job.image} className='w-full rounded-4xl my-3 h-50 object-cover'/>
                    
                    <div className='flex flex-col gap-3 pt-5'>
                        {/* Job Title */}
                        <div className='flex md:flex-row flex-col gap-5 flex-wrap md:text-left text-center'>
                            
                            <h1 className='font-satoshi-bold text-md text-black md:text-left text-center'>Job Title:</h1>
                            <h1 className='font-satoshi-regular text-md text-black md:ml-auto'>{job.title}</h1>
                        </div>

                        {/* Job Company */}
                        <div className='flex md:flex-row flex-col gap-5 flex-wrap md:text-left text-center'>
                            <h1 className='font-satoshi-bold text-md text-black '>Company/Agency/Institution:</h1>
                            <h1 className='font-satoshi-regular text-md text-black md:ml-auto'>{job.company}</h1>
                        </div>

                        {/* Job Link */}
                        <div className='flex md:flex-row flex-col gap-5 flex-wrap md:text-left text-center'>
                            <h1 className='font-satoshi-bold text-md text-black'>Application Link:</h1>
                            <h1 className='font-satoshi-regular text-md text-black md:ml-auto'>{job.link}</h1>
                        </div>

                        {/* Job tags */}
                        {job.tags && job.tags.length > 0 && (
                        <div className='flex flex-row gap-5'>
                            <h1 className='font-satoshi-bold text-md text-black'>Tags:</h1>
                            <div className='flex flex-wrap gap-2 ml-auto'>
                            {job.tags.map((tag, index) => (
                                <span
                                key={index}
                                className="bg-primary text-white text-sm px-3 py-1 rounded-xl w-fit"
                                >
                                {tag}
                                </span>
                            ))}
                            </div>
                        </div>
                        )}


                        {/* Salary */}
                        <div className='flex md:flex-row flex-col gap-5 flex-wrap md:text-left text-center'>
                            <h1 className='font-satoshi-bold text-md text-black'>Salary/Compensation:</h1>
                            <h1 className='font-satoshi-regular text-md text-black md:ml-auto'>PHP {job.salary}</h1>
                        </div>

                        {/* description */}
                        <div className='flex flex-col md:text-left text-center'>
                            <h1 className='font-satoshi-bold text-md text-black pb-5'>Description/Hiring Process:</h1>
                            <div className='bg-gray-200 p-5 rounded-xl overflow-y-auto max-h-72'>
                                <p className='font-satoshi-regular text-sm text-black italic text-justify'>
                                    {job.description}
                                </p>
                            </div>

                        </div>
                    </div>
                </div>

                
                
            </motion.div>
        </div>
    );
};

export default JobPostSummary;
