import React, { useState, useEffect } from 'react'
import AdminCareerCard from '../../../components/AdminComponents/AdminCareerCard'
import { ChevronLeft, ChevronRight, Filter, List, LayoutGrid, MoveRight, MoveLeft } from 'lucide-react'
import JobTable from '../../../components/AdminComponents/jobtable';
import AdminModal from '../../../components/AdminComponents/AdminModal';
import axios from 'axios'
import CircularLoading from "../../../components/LoadingComponents/circularloading"
import SkeletonLoading from "../../../components/LoadingComponents/skeletonloading"
import PaginationComponent from "../../../components/AdminComponents/PaginationComponent"
import SortModal from "../../../components/AdminComponents/sortmodal"
import OrderToggle from "../../../components/AdminComponents/ordertoggle"
import CareerFilterModal from '../../../components/AdminComponents/CareerFilter';
function AdminCareer() {

  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL

  const [index, setIndex] = useState(0);

  const [jobType, setJobType] = useState('open')
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [topJobs, setTopJobs] = useState([])
  const [topLoading, setTopLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const sorters = [
    { label: 'Date posted', value: 'date' },
    { label: 'Interested', value: 'count' },
  ];
  const [sortBy, setSortBy] = useState(sorters[0].value);
  const [sortDirection, setSortDirection] = useState('desc');
  const [orderBy, setOrderBy] = useState('date_desc');
  
  const [openCount, setOpenCount] = useState(0)
  const [closedCount, setClosedCount] = useState(0)
  const [reportedCount, setReportedCount] = useState(0)
  
  const total = topJobs.length;
  const prev = () => setIndex((index - 1 + total) % total);
  const next = () => setIndex((index + 1) % total);

  const filters = [
    {label: 'Creator', value:'creator'}
  ]
  const [creatorValue, setCreatorValue] = useState('')


  const handleSortFieldChange = (field) => {
    setSortBy(field);
    const newParam = `${field}_${sortDirection}`;
    setOrderBy(newParam);
  };

  const handleDirectionToggle = (newDirection) => {
    setSortDirection(newDirection);
    const newParam = `${sortBy}_${newDirection}`;
    setOrderBy(newParam);
  };

  async function fetchJobs(type) {
    let endpoint = '';

    const params = new URLSearchParams();
    if (orderBy) {
      params.append('order_by', orderBy);
    }
    if (creatorValue && creatorValue.length > 0){
      params.append('creator', creatorValue)
    }else{
      params.delete('creator')
    }

    const queryString = params.toString();

    if (type === 'open') {
      endpoint = `${API_BASE_URL}/admin/job-postings/open?page=${page}&${queryString}`;
    } else if (type === 'closed') {
      endpoint = `${API_BASE_URL}/admin/job-postings/closed?page=${page}&${queryString}`;
    } else if (type === 'reported') {
      endpoint = `${API_BASE_URL}/admin/job-postings/reported?page=${page}&${queryString}`;
    }
    
    console.log(endpoint)
    try {
      const response = await axios.get(endpoint);
      console.log(response)
      setTotalPages(response.data.meta.total_pages)
      setJobs(response.data.items);
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
  }, [jobType, page, sortBy, sortDirection, creatorValue]);
  

  return (
    <div className='flex flex-col h-screen p-6 items-center w-full bg-gray-100'>
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
      <div className='mb-3 flex gap-1 mt-4'>
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
          <button className={`px-3 py-3 cursor-pointer border-b-3 w-1/4 lg:w-auto ${jobType === 'open' ? 'border-primary' : 'border-transparent'}`} onClick={() => setJobType('open')}>
            <p className='text-black font-satoshi-medium text-sm'> Open ({openCount}) </p>
          </button>
          {/* Closed button */}
          <button className={`px-3 py-3 cursor-pointer border-b-3 w-1/4 lg:w-auto ${jobType === 'closed' ? ' border-primary' : 'border-transparent'}`} onClick={() => setJobType('closed')}>
            <p className='text-black font-satoshi-medium text-sm'> Closed ({closedCount}) </p>
          </button>
            {/* Reported button */}
          <button className={`px-3 py-3 cursor-pointer border-b-3 w-1/4 lg:w-auto ${jobType === 'reported' ? ' border-primary' : 'border-transparent'}`} onClick={() => setJobType('reported')}>
              <p className='text-black font-satoshi-medium text-sm'> Reported ({reportedCount}) </p>
          </button>
        </div>
        {/* Sort by */}
        <div className='flex gap-2'>
          {/* TODO: Add function to change sort */}
          <SortModal
            filters={sorters}
            selectedFilter={sortBy}
            onSelect={handleSortFieldChange}
          />
          {/* Order toggle */}
          <OrderToggle
            direction={sortDirection}
            onToggle={handleDirectionToggle}
          />
          {/* Filter */}
          {/* <button className='border border-disabled rounded-3xl px-5 py-2 flex gap-2 items-center cursor-pointer'>
            <Filter className='text-primary'/>
            <p className='text-primary fsont-satoshi-medium text-sm'> Filter</p>
          </button> */}
          <CareerFilterModal 
              filters = {filters}
              setterFunction = {setCreatorValue}
          />
          {/* Page */}
          <PaginationComponent
            page={page}
            setPage={setPage}
            totalPages={totalPages}
          />
        </div>
      </div>
      {/* Table for desktop*/}
      <div className='border border-gray-300 rounded-xl p-6 flex-1 hidden lg:block overflow-auto w-full bg-white'>
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
