import React from 'react'
import { Briefcase, GraduationCap, MapIcon, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import defaultimage from "../../assets/defaultimage.jpg";

function AlumniSearchCard({
    full_name,
    graduation_year,
    job_title,
    skills,
    location,
    email,
    picture,
    user_id
  }) {

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/alumni/profile/${user_id}`);
  };

  return (
    <div onClick={handleClick} className='flex flex-col shadow-md w-full items-center rounded-lg py-6'>
      {picture ? (<img src={picture} alt="Avatar" className="w-24 h-24 rounded-full border border-gray-300 shadow-sm" />)
      :(<img src={defaultimage} alt="Avatar" className="w-24 h-24 rounded-full border border-gray-300 shadow-sm" />)
      }
      
      <h1 className='text-xl font-satoshi-bold pt-3'>{full_name}</h1>
      <h2 className='text-sm font-satoshi-medium pt-1'>{email}</h2>

      {/* Further Details */}
      <div className="flex flex-col items-start w-max pt-4 gap-y-1">
        {/* Job Title */}
        <div className='flex items-center gap-x-2'>
          <Briefcase size={18} />
          <h1 className='font-satoshi-regular text-sm'>{job_title}</h1>
        </div>

        {/* Graduation Year */}
        <div className='flex items-center gap-x-2'>
          <GraduationCap size={18} />
          <h1 className='font-satoshi-regular text-sm'>Graduated in {graduation_year}</h1>
        </div>

        {/* Location */}
        <div className='flex items-center gap-x-2'>
          <MapPin size={18} />
          <h1 className='font-satoshi-regular text-sm'>Based in {location}</h1>
        </div>
      </div>
    </div>

    
  )
}

export default AlumniSearchCard