import React from 'react'
import { Briefcase, GraduationCap, MapIcon, MapPin } from 'lucide-react';

function AlumniSearchCard({
    full_name,
    graduation_year,
    job_title,
    skills,
    location,
    email,
    image
  }) {
  return (
    <div className='flex flex-col shadow-lg md:w-5/12 w-full items-center rounded-2xl py-10 min-w-80'>
        <img src={"https://i.pinimg.com/originals/09/f3/3e/09f33ecb3753807c45c29a3155aa1773.jpg"} alt="Avatar" class="w-32 h-32 rounded-full border-2 border-gray-300 shadow-md"/>
        <h1 className='text-2xl font-satoshi-bold pt-5'>{full_name}</h1>
        <h2 className='text-md font-satoshi-medium pt-2'>{email}</h2>
        {/* Further Details */}
        <div className="flex flex-col items-start w-max pt-5">
            {/* Job Title */}
            <div className='flex items-center gap-x-2'>
                <Briefcase size={20}/>
                <h1 className='font-satoshi-regular'>{job_title}</h1>
            </div>

            {/* Graduation Year */}
            <div className='flex items-center gap-x-2 pt-2'>
                <GraduationCap size={20}/>
                <h1 className='font-satoshi-regular'>Graduated in {graduation_year}</h1>
            </div>

            {/* Location */}
            <div className='flex items-center gap-x-2 pt-2'>
                <MapPin size={20}/>
                <h1 className='font-satoshi-regular'>Currently based in {location}</h1>
            </div>
        </div>
    </div>
    
  )
}

export default AlumniSearchCard