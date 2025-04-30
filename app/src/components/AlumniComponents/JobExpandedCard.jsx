import {
    Banknote,
    BriefcaseBusiness,
    Ellipsis,
    FileText,
    MoveLeft,
    Pencil,
    SquareArrowOutUpRight,
    Star,
    Trash2,
    Flag,
  } from 'lucide-react';
  import React, { useState, useEffect, useRef } from 'react';
  import { useNavigate } from 'react-router-dom';
  import { motion } from 'framer-motion';
  
  function JobExpandedCard({ job, currentUserID, mobileExpanded, setMobileExpanded }) {
    const [showOptions, setShowOptions] = useState(false);
    const modalRef = useRef(null);
    const ellipsisRef = useRef(null);
  
    const jobId = job.post_id;
    const navigate = useNavigate();
  
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          modalRef.current &&
          !modalRef.current.contains(event.target) &&
          !ellipsisRef.current.contains(event.target)
        ) {
          setShowOptions(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
  
    return (
      <div>
        {/* WEBSITE VIEW */}
        <div className="hidden md:flex flex-col w-full px-4 gap-5 items-center">
          <div className="flex w-full max-w-[1300px] gap-4">
            {/* MAIN CARD */}
            <div className="flex flex-col outline-1 outline-neutral-300 rounded-2xl px-6 pt-4 pb-8 flex-grow">
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
                      <button className="flex items-center gap-2 text-red-600 px-4 py-2 w-full hover:bg-red-50">
                        <Trash2 size={16} />
                        Delete Post
                      </button>
                      <button
                        className="flex items-center gap-2 text-black px-4 py-2 w-full hover:bg-gray-100"
                        onClick={() => navigate(`/alumni/jobPosting/edit/${jobId}`)}
                      >
                        <Pencil size={16} />
                        Edit Post
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  className="ml-auto flex items-center gap-2 text-sm text-red-600 hover:underline"
                  onClick={() => navigate(`/alumni/jobPosting/report/${jobId}`)}
                >
                  <Flag size={16} />
                  Report Post
                </button>
              )}
  
              <h1 className="font-satoshi-bold text-3xl pt-5">{job.title}</h1>
              <div className="flex items-center gap-2 pt-2">
                <h1 className="font-satoshi-bold text-lg">{job.company}</h1>
                <button
                  className="cursor-pointer"
                  onClick={() =>
                    window.open(job.link.startsWith('http') ? job.link : `https://${job.link}`, '_blank')
                  }
                >
                  <SquareArrowOutUpRight size={20} />
                </button>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <h1 className="font-satoshi-medium text-sm">Posted by</h1>
                <h1 className="cursor-pointer font-satoshi-bold">{job.user_name}</h1>
              </div>
  
              <img src={job.image} className="w-full rounded-2xl my-3 h-39 object-cover" />
  
              <div className="flex items-center gap-4 pt-2 flex-wrap">
                <button className="rounded-2xl bg-primary font-satoshi-medium text-white text-md w-32 h-12">
                  Apply Here
                </button>
                <button className="flex rounded-2xl items-center justify-center bg-primary text-white w-12 h-12">
                  <Star size={24} />
                </button>
                <div className="flex items-center gap-1 pt-2">
                <button
      onClick={() => navigate(`/alumni/jobPosting/interested/${jobId}`)}
      className="text-lg text-primary font-satoshi-bold underline hover:text-hover cursor-pointer"
    >
      {job.interested_count} are interested
    </button>
                </div>
              </div>
            </div>
  
            {/* JOB DETAILS CARD */}
            <div className="flex flex-col outline-1 outline-neutral-300 rounded-2xl px-6 pt-8 pb-8 w-[35%] min-w-[300px]">
              <h1 className="font-satoshi-bold text-2xl">Job Details</h1>
  
              {/* Salary */}
              <div className="pt-5">
                <div className="flex items-center gap-2">
                  <Banknote />
                  <h1 className="font-satoshi-bold text-lg">Pay</h1>
                </div>
                <div className="bg-primary text-white px-3 py-1 rounded-full text-xs mt-2 w-fit">
                  PHP {job.salary}
                </div>
              </div>
  
              {/* Employment */}
              <div className="pt-3">
                <div className="flex items-center gap-2">
                  <BriefcaseBusiness />
                  <h1 className="font-satoshi-bold text-lg">Employment</h1>
                </div>
                <div className="flex gap-2 mt-2 flex-wrap">
                  <div className="bg-primary text-white px-3 py-1 rounded-full text-xs">
                    {job.employment_type}
                  </div>
                  <div className="bg-primary text-white px-3 py-1 rounded-full text-xs">
                    {job.mode}
                  </div>
                </div>
              </div>
  
              {/* Tags */}
              <div className="pt-3">
                <div className="flex items-center gap-2">
                  <FileText />
                  <h1 className="font-satoshi-bold text-lg">Tags</h1>
                </div>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {job.tags?.map((tag, index) => (
                    <div
                      key={index}
                      className="bg-primary text-white px-3 py-1 rounded-full text-xs"
                    >
                      {tag}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
  
          {/* DESCRIPTION CARD */}
          <div className="w-full max-w-[1300px] outline-1 outline-neutral-300 rounded-2xl px-6 pt-8 pb-8">
            <h1 className="font-satoshi-bold text-2xl">Description</h1>
            <p className="font-satoshi-regular text-md pt-4 text-justify max-h-40 overflow-y-auto">
              {job.description}
            </p>
          </div>
        </div>
  
        {/* MOBILE VIEW (unchanged) */}
        <motion.div
          className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[90%] bg-gray-50 z-50 p-5 shadow-lg rounded-t-2xl md:hidden overflow-y-auto flex flex-col gap-5"
          style={{ maxHeight: '100vh', height: '100%' }}
          initial={{ y: '100vh' }}
          animate={{ y: mobileExpanded ? '0vh' : '100vh' }}
          exit={{ y: '100vh' }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          {/* Mobile content remains unchanged */}
          {/* ... */}
        </motion.div>
      </div>
    );
  }
  
  export default JobExpandedCard;
  