import { Star } from 'lucide-react'
import React from 'react'

function JobCard({job, selectedJobId, setSelectedJobId}) {
    const handleJobClick = () => {
        // store the card's post id to selected post_id
        setSelectedJobId(job.post_id);
        console.log(job.post_id + " selected!");
    }
    
    return (
        <div onClick={handleJobClick} className='flex flex-col outline-1 outline-neutral-300 w-lg rounded-2xl p-8 cursor cursor-pointer'>
            {/* Title and Company */}
            <h1 className='font-satoshi-bold text-3xl'>{job.title}</h1>
            <h1 className='font-satoshi-bold text-lg pt-2'>{job.company}</h1>
            <p className='font-satoshi-regular text-md mt-4 text-justify max-h-40 overflow-y-auto'>{job.description}</p>
            
            {/* user name and interested count */}
            <div className="flex justify-between items-center">
                <h1 className="font-satoshi-bold text-sm pt-2">{job.user_name}</h1>
                <div className="flex items-center gap-1 pt-2">
                    <span className="text-lg text-primary font-satoshi-bold">
                    {job.interested_count} are interested
                    </span>
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