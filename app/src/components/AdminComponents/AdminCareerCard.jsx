import React from 'react'
import { Heart, Calendar, User } from 'lucide-react'

function AdminCareerCard() {
  return (
    <div className='border border-gray-300 rounded-2xl shadow-lg min-h-44 py-6 px-12 flex flex-row justify-between items-center'>
      {/* Role, Location */}
      <div className='flex flex-col'>
        <h2 className='text-3xl text-primary font-satoshi-bold'>Software Engineer</h2>
        <p className='font-satoshi-regular'>Institute of Computer Science, UPLB</p>
        <p className='font-satoshi-regular'>Los Baños, Laguna</p>
      </div>
      {/* Interested, Date, Person */}
      <div className='flex flex-col'>
        <div className='flex flex-row gap-2'>
          <Heart className='text-primary'/>
          <p className='font-satoshi-regular'><span className='text-primary font-satoshi-medium'>128 people</span> are interested</p>
        </div>
        <div className='flex flex-row gap-2'>
          <Calendar className='text-primary'/>
          <p className='font-satoshi-regular'>
          January 1, 2025</p>
        </div>
        <div className='flex flex-row gap-2'>
          <User className='text-primary'/>
          <p className='font-satoshi-regular'>John Doe </p>
        </div>
      </div>
    
    </div>
  )
}

export default AdminCareerCard
