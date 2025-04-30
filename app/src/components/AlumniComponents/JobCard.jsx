import { Star } from 'lucide-react'
import { decode } from 'punycode';
import React from 'react'
import { jwtDecode } from 'jwt-decode';

const token = localStorage.getItem("token");
const decoded = jwtDecode(token);
const currentUserID = decoded.sub;

function JobCard({job, selectedJobId, setSelectedJobId, setMobileExpanded}) {
    const handleJobClick = () => {
        // store the card's post id to selected post_id
        setSelectedJobId(job.post_id);
        console.log(job.post_id + " selected!");
        setMobileExpanded(true);
    }
    
    return (
        <div onClick={handleJobClick} className='flex flex-col outline-1 outline-neutral-300 w-5/6 md:mx-0 rounded-2xl p-8 cursor cursor-pointer'>
            {/* Title and Company */}
            <h1 className='font-satoshi-bold md:text-3xl text-2xl'>{job.title}</h1>
            <h1 className='font-satoshi-bold md:text-lg text-md pt-2'>{job.company}</h1>
            <p className='font-satoshi-regular md:text-md text-sm mt-4 text-justify max-h-40 overflow-y-auto'>{job.description}</p>
            
            {/* user name and interested count */}
            <div className="flex flex-row justify-between items-center">
                <h1 className="font-satoshi-bold md:text-sm text-xs pt-2">{job.user_name || job.posted_by}</h1>
                <div className="flex items-center gap-1 pt-2">
                {job.user_id === currentUserID ? (
  <button
    onClick={() => navigate(`/alumni/jobPosting/interested/${jobId}`)}
    className="md:text-lg text-sm text-primary font-satoshi-bold underline hover:text-hover cursor-pointer"
  >
    {job.interested_count} are interested
  </button>
) : (
  <span className="md:text-lg text-sm text-gray-500 font-satoshi-bold">
    {job.interested_count} are interested
  </span>
)}
s
                    <Star className="w-4 h-4 text-primary" />
                </div>
            </div>
            
            {/* Scrollable tags */}
            <div className="overflow-x-auto pt-4">
                <div className="flex gap-2 w-max">
                    {job.tags.map((tag, index) => (
                        <span
                            key={index}
                            className="bg-primary text-white px-3 py-1 rounded-full whitespace-nowrap text-xs font-satoshi-regular"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default JobCard