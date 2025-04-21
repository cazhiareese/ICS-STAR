import React, { useState } from 'react'
import AdminCareerCard from '../../../components/AdminComponents/admincareercard'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const jobPostings = [
  {
    title: 'Software Engineer',
    org: 'Institute of Computer Science, UPLB',
    location: 'Los Baños, Laguna',
    interested: 128,
    date: 'January 1, 2025',
    poster: 'John Doe',
  },
  {
    title: 'Frontend Developer',
    org: 'Tech Inc.',
    location: 'Taguig, Metro Manila',
    interested: 90,
    date: 'February 5, 2025',
    poster: 'Jane Smith',
  },
  {
    title: 'Backend Engineer',
    org: 'Code Lab',
    location: 'Quezon City',
    interested: 76,
    date: 'March 3, 2025',
    poster: 'Mark Dela Cruz',
  },
];

function AdminCareer() {
  const [index, setIndex] = useState(0);
  const total = jobPostings.length;

  const prev = () => setIndex((index - 1 + total) % total);
  const next = () => setIndex((index + 1) % total);

  return (
    <div className='flex flex-col h-screen p-6 items-center'>
      <h1 className='text-primary font-satoshi-bold text-5xl mb-4 self-start'>Career</h1>

      <div className='flex items-center gap-4 w-full justify-center'>
        {/* <button className='cursor-pointer' onClick={prev}>
          <ChevronLeft className='w-6 h-6 text-gray-500 hover:text-primary' />
        </button> */}

        <AdminCareerCard job={jobPostings[index]} onPrev={prev} onNext={next} />

        {/* <button className='cursor-pointer' onClick={next}>
          <ChevronRight className='w-6 h-6 text-gray-500 hover:text-primary' />
        </button> */}
      </div>

      {/* Dots */}
      <div className='flex gap-1 mt-4'>
        {jobPostings.map((_, i) => (
          <span
            key={i}
            className={`w-2 h-2 rounded-full ${i === index ? 'bg-primary' : 'bg-gray-300'}`}
          />
        ))}
      </div>
    </div>
  );
}

export default AdminCareer;
