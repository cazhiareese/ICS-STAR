import React, { useState, useEffect } from 'react'
import AdminCareerCard from '../../../components/AdminComponents/admincareercard'
import { ChevronLeft, ChevronRight, Filter, List, LayoutGrid, MoveRight, MoveLeft } from 'lucide-react'
import JobTable from '../../../components/AdminComponents/JobTable';
import AdminModal from '../../../components/AdminComponents/adminmodal';
import axios from 'axios'
import CircularLoading from "../../../components/LoadingComponents/circularloading"
import SkeletonLoading from "../../../components/LoadingComponents/skeletonloading"

function AdminCareer() {

  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL

  const [index, setIndex] = useState(0);
  const [viewStyle, setViewStyle] = useState('List')
  const [jobType, setJobType] = useState('open')
  const [page, setPage] = useState()
  const [totalPages, setTotalPages] = useState()
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [topJobs, setTopJobs] = useState([])
  const [topLoading, setTopLoading] = useState(false)
  const [loading, setLoading] = useState(false)

  const [openCount, setOpenCount] = useState(0)
  const [closedCount, setClosedCount] = useState(0)
  const [reportedCount, setReportedCount] = useState(0)
  
  const total = topJobs.length;
  const prev = () => setIndex((index - 1 + total) % total);
  const next = () => setIndex((index + 1) % total);

  async function fetchJobs(type) {
    let endpoint = '';
    if (type === 'open') {
      endpoint = `${API_BASE_URL}/admin/job-postings/open`;
    } else if (type === 'closed') {
      endpoint = `${API_BASE_URL}/admin/job-postings/closed`;
    } else if (type === 'reported') {
      endpoint = `${API_BASE_URL}/admin/job-postings/reported`;
    }
  
    try {
      const response = await axios.get(endpoint);
      console.log(response)
      setJobs(response.data);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    }
  }
``

  async function fetchJobCounts() {
    const openResponse = await axios.get(`${API_BASE_URL}/admin/job-postings/open/count`)
    console.log(openResponse.data)
    setOpenCount(openResponse.data.open_job_postings_count)

    const closedResponse = await axios.get(`${API_BASE_URL}/admin/job-postings/closed/count`)
    console.log(closedResponse.data)
    setClosedCount(closedResponse.data.closed_job_postings_count)

    const reportedResponse = await axios.get(`${API_BASE_URL}/admin/job-postings/reported/count`)
    console.log(reportedResponse.data)
    setReportedCount(reportedResponse.data.reported_job_postings_count)
  }

  useEffect(() => {
    async function fetchTopJobs() {
      setTopLoading(true)
      try {
        const response = await axios.get(`${API_BASE_URL}/admin/job-postings/top-4-interested`)
        console.log(response)
        setTopJobs(response.data)
      } catch (error) {
        console.log(error)
      } finally {
        setTopLoading(false)
      }
    }
    fetchTopJobs()
  }, [])
  
  useEffect(() => {
    async function fetchAllJobs () {
      setLoading(true);
      try {
        await fetchJobCounts()
        await fetchJobs(jobType);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchAllJobs();
  }, [jobType]);
  

  return (
    <div className='flex flex-col h-screen p-6 items-center w-full'>
      <h1 className='text-primary font-satoshi-bold text-5xl mb-4 self-start'>Career</h1>
      {/* Card Carousel */}
      {topLoading ? (
        <div className='flex items-center gap-4 w-full justify-center'>
          <div className='flex flex-row justify-between items-center w-full cursor-pointer' onClick={() => {}}>
            {/* Role, Location */}
            <div className='flex flex-col'>
              <SkeletonLoading/>
            </div>

            {/* Interested, Date, Person */}
            <div className='flex flex-col'>
              <div className='flex flex-row gap-2'>
                <SkeletonLoading/>
              </div>
              <div className='flex flex-row gap-2'>
                <SkeletonLoading/>
              </div>
            </div>
          </div>
        </div>
      ) : topJobs.length > 0 ? (
        <div className='flex items-center gap-4 w-full justify-center' onClick={() => setSelectedJob(topJobs[index])}>
          <AdminCareerCard job={topJobs[index]} onPrev={prev} onNext={next} />
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-8">No jobs available.</p>
      )}



      {/* Dots */}
      <div className='flex gap-1 mt-4'>
        {topLoading ? (
          <></>
        ) : (
          topJobs.map((_, i) => (
            <span
            key={i}
            className={`w-2 h-2 rounded-full ${i === index ? 'bg-primary' : 'bg-gray-300'}`}
            />
          ))
        )}
      </div>
      {/* Buttons and filters */}
      <div className='flex flex-col w-full lg:flex-row items-center lg:justify-between gap-2 lg:gap-0'>
        {/* Buttons */}
        <div className='w-full lg:w-auto min-w-xs ml-5'>
          {/* Open button */}
          <button className={`px-12 py-3 cursor-pointer border-b-3 w-1/2 lg:w-auto ${jobType === 'open' ? 'border-primary' : 'border-transparent'}`} onClick={() => setJobType('open')}>
            <p className='text-black font-satoshi-medium text-md'> Open ({openCount}) </p>
          </button>
          {/* Closed button */}
          <button className={`px-12 py-3 cursor-pointer border-b-3 w-1/2 lg:w-auto ${jobType === 'closed' ? ' border-primary' : 'border-transparent'}`} onClick={() => setJobType('closed')}>
            <p className='text-black font-satoshi-medium text-md'> Closed ({closedCount}) </p>
          </button>
            {/* Reported button */}
          <button className={`px-12 py-3 cursor-pointer border-b-3 w-1/2 lg:w-auto ${jobType === 'reported' ? ' border-primary' : 'border-transparent'}`} onClick={() => setJobType('reported')}>
              <p className='text-black font-satoshi-medium text-md'> Reported ({reportedCount}) </p>
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
        {loading ? (
          <div className='flex flex-row items-center justify-center h-full'>
            <CircularLoading/>
          </div>
        ) : (
          <JobTable data={jobs} jobType={jobType} />
        )}
      </div>
    </div>
  );
}

export default AdminCareer;
