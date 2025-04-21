import { Ellipsis, SquareArrowOutUpRight, Star } from 'lucide-react'
import React from 'react'

function JobExpandedCard({job}) {
    return (
        <div className="flex flex-col w-lg mr-10 outline-">
            <div className='flex flex-col outline-1 outline-neutral-300 w-full rounded-2xl px-8 pt-4 pb-8 cursor'>
                {/* Ellipsis button for edit and delete job */}
                <button className='ml-auto'><Ellipsis size={30} /></button>
                {/* Title and Company */}
                <h1 className='font-satoshi-bold text-3xl'>{job.title}</h1>
                <div className="flex items-center gap-2 pt-2">
                    <h1 className='font-satoshi-bold text-lg'>{job.company}</h1>
                    {/* TODO: Add onclick */}
                    <button className='cursor-pointer'><SquareArrowOutUpRight size={20} /></button> 
                </div>
                <div className="flex items-center gap-2 pt-1">
                    <h1 className='font-satoshi-medium text-sm'>Posted by</h1>
                    <h1 className='cursor-pointer font-satoshi-bold'>{job.user_name}</h1> 
                </div>

                {/* Job Image */}
                <img src={job.image} className='w-full rounded-4xl my-3 h-50 object-cover'/>
                
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
                        <span className="text-lg text-primary font-satoshi-bold underline hover:text-blue-700">
                            {job.interested_count} are interested
                        </span>
                    </div>
                </div>
                
            </div>
        </div>
    )
}

export default JobExpandedCard