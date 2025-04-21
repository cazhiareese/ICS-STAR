import React, { useState, useEffect } from 'react'
import AdminCareerCard from '../../../components/AdminComponents/admincareercard'
import { ChevronLeft, ChevronRight, Filter, List, LayoutGrid, MoveRight, MoveLeft } from 'lucide-react'
import JobTable from '../../../components/AdminComponents/JobTable';
import AdminModal from '../../../components/AdminComponents/adminmodal';

const jobPostings = [
  {
    job_title: 'Software Engineer',
    org: 'Institute of Computer Science, UPLB',
    location: 'Los Baños, Laguna',
    interested: 128,
    date: 'January 1, 2025',
    creator: 'John Doe',
  },
  {
    title: 'Frontend Developer',
    org: 'Tech Inc.',
    location: 'Taguig, Metro Manila',
    interested: 90,
    date_posted: 'February 5, 2025',
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
  const [viewStyle, setViewStyle] = useState('List')
  const [jobType, setJobType] = useState('open')
  const [page, setPage] = useState()
  const [totalPages, setTotalPages] = useState()
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  const prev = () => setIndex((index - 1 + total) % total);
  const next = () => setIndex((index + 1) % total);

  useEffect(() => {
    const fetchJobs = () => {
      setJobs([
        {
          date_posted: '01/25/2025',
          job_title: 'Software Developer',
          creator: 'John Doe',
          interested: 25,
        },
        {
          date_posted: '01/25/2025',
          job_title: 'Software Developer',
          creator: 'John Doe',
          interested: 15,
        },
      ]);
    };

    fetchJobs();
  }, []);

  return (
    <div className='flex flex-col h-screen p-6 items-center w-full'>
      <h1 className='text-primary font-satoshi-bold text-5xl mb-4 self-start'>Career</h1>
      {/* Card Carousel */}
      <div className='flex items-center gap-4 w-full justify-center' onClick={() => setSelectedJob(jobPostings[index])}>
      <AdminCareerCard job={jobPostings[index]} onPrev={prev} onNext={next} />
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
      {/* Buttons and filters */}
      <div className='flex flex-col w-full lg:flex-row items-center lg:justify-between gap-2 lg:gap-0'>
        {/* Buttons */}
        <div className='w-full lg:w-auto min-w-xs ml-5'>
          {/* Open button */}
          <button className={`px-12 py-3 cursor-pointer border-b-3 w-1/2 lg:w-auto ${jobType === 'open' ? 'border-primary' : 'border-transparent'}`} onClick={() => setJobType('open')}>
            <p className='text-black font-satoshi-medium text-md'> Open </p>
          </button>
            {/* Closed button */}
          <button className={`px-12 py-3 cursor-pointer border-b-3 w-1/2 lg:w-auto ${jobType === 'closed' ? ' border-primary' : 'border-transparent'}`} onClick={() => setJobType('closed')}>
            <p className='text-black font-satoshi-medium text-md'> Closed </p>
          </button>
            {/* Reported button */}
          <button className={`px-12 py-3 cursor-pointer border-b-3 w-1/2 lg:w-auto ${jobType === 'reported' ? ' border-primary' : 'border-transparent'}`} onClick={() => setJobType('reported')}>
              <p className='text-black font-satoshi-medium text-md'> Reported </p>
          </button>
        </div>
        {/* Sort by */}
        <div className='flex gap-2'>
          <button className='border border-disabled rounded-3xl px-5 py-2 cursor-pointer flex items-center gap-1'>
            <p className='text-black font-satoshi-light text-sm hidden lg:block'> Sort by </p>
            <p className='font-satoshi-medium text-primary block'>Name</p>
          </button>
          {/* Filter */}
          <button className='border border-disabled rounded-3xl px-5 py-2 flex gap-2 items-center cursor-pointer'>
            <Filter className='text-primary'/>
            <p className='text-primary fsont-satoshi-medium text-sm'> Filter</p>
          </button>
          {/* View changer */}
          <div className="flex items-center border border-disabled rounded-3xl overflow-hidden">
            {/* List View Button */}
            <button className="px-5 py-2 flex gap-2 cursor-pointer text-primary" onClick={() => {setViewStyle('List')}}>
              <List className={`${viewStyle === 'List' ? 'text-primary' : 'text-disabled'}`} />
            </button>
            <div className="h-6 w-px bg-disabled"></div>
            {/* Grid View Button */}
            <button className="px-5 py-2 flex gap-2 cursor-pointer text-disabled" onClick={() => {setViewStyle('Grid')}}>
              <LayoutGrid className={`${viewStyle === 'Grid' ? 'text-primary' : 'text-disabled'}`} />
            </button>
          </div>
          {/* Page */}
          {/* <div className='items-center gap-2 text-md font-satoshi-regular hidden lg:flex'>
            <MoveLeft className='cursor-pointer' onClick={() => {}}/>
              <p> Page </p>
            <input
              type="text"
              value={page}
              onChange={() => {}}
              className="w-9 text-center border border-disabled rounded-md outline-none text-primary font-satoshi-bold"
            />
            <p>of {totalPages}</p>
            <MoveRight className='cursor-pointer' onClick={() => {}}/>
          </div> */}
        </div>
      </div>
      {/* Table for desktop*/}
      <div className='border border-gray-400 rounded-xl p-6 flex-1 hidden lg:block overflow-auto w-full'>
        <JobTable data={jobs}/>
      </div>
        <AdminModal isOpen={!!selectedJob} onClose={() => setSelectedJob(null)}>
        {selectedJob && (
          <>
            <div className='h-1/3 w-full bg-primary font-satoshi-regular rounded-t-2xl'></div>
            <div className='p-6'>
                <h2 className="text-4xl font-satoshi-bold mb-2">{selectedJob.job_title}</h2>
                <p className="text-2xl font-satoshi-regular">
                {selectedJob.org || 'Institute of Computer Science, UPLB'}
                </p>
                <p className='font-satoshi-regular'>
                    Posted by: <span className="text-primary">{selectedJob.creator}</span>
                </p>
                <p className='font-satoshi-regular'>
                    Date: {selectedJob.date_posted}
                </p>

                <h3 className="font-satoshi-medium mb-1 text-lg">Details</h3>
                <p className='font-satoshi-regular text-sm'>Details here</p>

                <h3 className="font-satoshi-medium mb-1 text-lg">Description</h3>
                <p className="font-satoshi-regular text-sm">
                This is a placeholder description. Replace with actual data or enrich the job object!
                </p>
            </div>
          </>
        )}
      </AdminModal>
    </div>
  );
}

export default AdminCareer;
