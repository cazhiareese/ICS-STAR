// components/AdminComponents/admincareercard.jsx
import React from 'react'
import { Heart, Calendar, User, ChevronLeft, ChevronRight } from 'lucide-react'

function AdminCareerCard({ job, onPrev, onNext }) {
  return (
    <div className='relative border border-gray-300 rounded-2xl shadow-lg min-h-44 py-6 px-16 w-full bg-white items-center flex flex-row justify-between'>
        {/* Arrows (inside the card) */}
        <button
          onClick={onPrev}
          className='absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full hover:bg-gray-100 cursor-pointer transition z-10'
        >
          <ChevronLeft className='w-5 h-5 text-primary' />
        </button>
        <button
          onClick={onNext}
          className='absolute right-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full cursor-pointer hover:bg-gray-100 transition z-10'
          >
          <ChevronRight className='w-5 h-5 text-primary' />
        </button>

        {/* Content wrapper */}
        <div className='flex flex-row justify-between items-center w-full cursor-pointer' onClick={() => {}}>
          {/* Role, Location */}
          <div className='flex flex-col'>
            <h2 className='text-3xl text-primary font-satoshi-bold'>{job.job_title}</h2>
            <p className='font-satoshi-regular'>{job.org}</p>
            <p className='font-satoshi-regular'>{job.location}</p>
          </div>

          {/* Interested, Date, Person */}
          <div className='flex flex-col'>
            <div className='flex flex-row gap-2'>
              <Heart className='text-primary' />
              <p className='font-satoshi-regular'>
                <span className='text-primary font-satoshi-medium'>{job.interested} people</span> are interested
              </p>
            </div>
            <div className='flex flex-row gap-2'>
              <Calendar className='text-primary' />
              <p className='font-satoshi-regular'>{job.date}</p>
            </div>
            <div className='flex flex-row gap-2'>
              <User className='text-primary' />
              <p className='font-satoshi-regular'>{job.creator}</p>
            </div>
          </div>
        </div>
    </div>
  )
}

export default AdminCareerCard
