import React, { useEffect, useState } from 'react'
import { ChevronsUpDown } from 'lucide-react'
import axios from 'axios'
import CircularLoading from '../../../components/LoadingComponents/circularloading'
import SortModal from '../../../components/AdminComponents/sortmodal'
import OrderToggle from '../../../components/AdminComponents/ordertoggle'
import PaginationComponent from '../../../components/AdminComponents/PaginationComponent'
import InsightsDonationsTable from '../../../components/AdminComponents/InsightsDonationsTable'

function AdminDonationsInsights() {
  const [token, setToken] = useState(null)
  const [timeFilter, setTimeFilter] = useState('last_7_days')
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const [topPerformingDrives, setTopPerformingDrives] = useState([])
  const [drivesWithGoalsReached, setDrivesWithGoalsReached] = useState([])
  const [donationType, setDonationType] = useState('verified')
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const filters = ["This_Year", "This_Month", "This_Week", "Last_7_Days", "Custom"];
  const [filterOpen, setFilterOpen] = useState(false);
  const formatFilter = (filter) => filter.replaceAll("_", " ");

  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

  async function fetchInitialData() {
    // Fetch top performing drives
    setLoading(true)
    try {
      const topDrivesResponse = await axios.get(`${API_BASE_URL}/admin/donations/top-performing-drives?time_filter=last_7_days`, {headers: {Authorization: `Bearer ${token}`}})
      console.log(topDrivesResponse.data)
      setTopPerformingDrives(topDrivesResponse.data)

      const driveGoalsReachedResponse = await axios.get(`${API_BASE_URL}/admin/donations/top-drives-with-goals-reached?time_filter=last_7_days`, {headers: {Authorization: `Bearer ${token}`}})
      console.log(driveGoalsReachedResponse.data)
      setDrivesWithGoalsReached(driveGoalsReachedResponse.data)

    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setToken(localStorage.getItem("token"))
    fetchInitialData()
  }, [timeFilter])

  return (
    loading ? (
      <CircularLoading/>
    ) : (
      <div className='flex flex-col p-6 h-screen w-full overflow-auto'>
          {/* header */}
        <h1 className='text-primary text-5xl font-satoshi-bold'>General Insights</h1>
        {/* Filter */}
        <div className="flex flex-row relative justify-end">
          <button
            className="flex flex-row items-center border border-gray-300 w-fit px-3 py-1 rounded-md bg-white cursor-pointer"
            onClick={() => setFilterOpen(!filterOpen)}
          >
            <p className="mr-2">{formatFilter(timeFilter)}</p>
            <ChevronsUpDown size={16} />
          </button>

          {filterOpen && (
            <div className="absolute top-10 w-64 bg-white border border-gray-300 rounded-md shadow-lg p-4 z-10">
              <p className="font-semibold mb-2">Filter:</p>
              <div className="flex flex-col gap-2">
                {filters.map((filter) => (
                  <label key={filter} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="timeFilter"
                      value={filter}
                      checked={timeFilter === filter}
                      onChange={() => {
                        setTimeFilter(filter);
                        setFilterOpen(false);
                      }}
                    />
                    <span>{formatFilter(filter)}</span>
                  </label>
                ))}
                {timeFilter === "Custom" && (
                  <div className="flex items-center gap-2 mt-2">
                    <input type="date" className="border px-2 py-1 rounded-md" />
                    <span>to</span>
                    <input type="date" className="border px-2 py-1 rounded-md" />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        {/* Top performing drives and drives with goals reached */}
        <div className='flex flex-row gap-4 h-1/3 mt-2'>
          {/* Top performing drives */}
          <div className='flex flex-col flex-1 border border-gray-300 p-3 rounded-2xl'>
            <h2 className='font-satoshi-medium text-2xl'>Top Performing Drives</h2>
            {topPerformingDrives.length === 0 ? (
              <div className='flex justify-center items-center h-full'>
                <p> No top performing drives :( </p>
              </div>
            ) : (
            topPerformingDrives.map((drive) => (
              <div key={drive.drive_id} className="flex flex-row justify-between h-full items-center">
                <div className='flex flex-row flex-1 gap-2'>
                  <h2 className='font-satoshi-bold text-primary'>#{drive.rank} </h2>
                  <h2 className='font-satoshi-bold text-left'> {drive.title} </h2>
                </div>
                <div className='flex flex-col items-end'>
                  <h2 className='text-primary font-satoshi-bold text-lg'>{drive.percent_increase}%</h2>
                  <p className='font-satoshi-light text-xs text-black'>increase during time period</p>
                </div>
              </div>
            ))
          )}
          </div>
          {/* Drives with goals reached */}
          <div className='flex flex-col flex-1 border border-gray-300 p-3 rounded-2xl'>
            <h2 className='font-satoshi-medium text-2xl'>Drives with Goals Reached</h2>
            {drivesWithGoalsReached.length === 0 ? (
              <div className='flex justify-center items-center h-full'>
                <p> No drives with goals reached :( </p>
              </div>
            ) : (
              drivesWithGoalsReached.map((drive) => (
                <div key={drive.drive_id} className="flex flex-row justify-between h-full items-center">
                  <div className='flex flex-row flex-1 gap-2'>
                  <h2 className='font-satoshi-bold text-primary'>#{drive.rank} </h2>
                  <h2 className='font-satoshi-bold text-left '> {drive.title} </h2>
                  </div>
                  <div className='flex flex-col items-end'>
                  <h2 className='text-primary font-satoshi-bold text-lg'>{drive.percent_funded}%</h2>
                  <p className='font-satoshi-light text-xs text-black'>of goal reached</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <h1 className='text-5xl text-primary font-satoshi-bold mt-4'>Donations</h1>
        {/* Buttons and filters */}
        <div className='flex flex-col w-full lg:w-auto lg:flex-row items-center lg:justify-between lg:ml-5 gap-2 lg:gap-0'>
          <div className='w-full lg:w-auto  min-w-xs'>
            {/* Verified button */}
            <button className={`px-12 py-3 cursor-pointer border-b-3 w-1/2 lg:w-auto ${donationType === 'verified' ? 'border-primary font-satoshi-medium' : 'border-transparent font-satoshi-light'}`} onClick={() => setDonationType('verified')}>
               Verified
            </button>
            {/* Unverified button */}
            <button className={`px-12 py-3 cursor-pointer border-b-3 w-1/2 lg:w-auto ${donationType === 'unverified' ? ' border-primary font-satoshi-medium' : 'border-transparent font-satoshi-light'}`} onClick={() => setDonationType('unverified')}>
              Unverified
            </button>
          </div>
          {/* Sort by */}
          <div className='flex gap-2'>
            {/* <button className='border border-disabled rounded-3xl px-5 py-2 cursor-pointer flex items-center gap-1'>
              <p className='text-black font-satoshi-light text-sm hidden lg:block'> Sort by </p>
                <p className='font-satoshi-medium text-primary block'>Name</p>
            </button> */}
          <div className='relative flex items-center justify-end flex-1'>
            {/* <input
              type="text"
              placeholder="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              className={`w-full lg:w-xs px-4 py-2 border rounded-3xl focus:outline-none ${focused ? 'border-primary border-2': 'border-gray-400'}`}
            />
            <Search className={`absolute mr-2 ${focused ? 'text-primary' : 'text-gray-400'}`} size={20} /> */}
          </div>
            {/* <SortModal filters={filters} selectedFilter={sortBy} onSelect={setSortBy}/> */}
            {/* Order Toggle */}
            {/* <OrderToggle direction={sortDirection} onToggle={setSortDirection}/> */}
            {/* Filter */}
            {/* <button className='border border-disabled rounded-3xl px-5 py-2 flex gap-2 items-center cursor-pointer'>
              <Filter className='text-primary'/>
              <p className='text-primary font-satoshi-medium text-sm'> Filter</p>
            </button> */}
            {/* Page */}
            {/* <PaginationComponent
              page={page}
              setPage={setPage}
              totalPages={totalPages}
            /> */}
          </div>
        </div>
        {/* Table of donations */}
        <div className='flex-1 border border-gray-300 rounded-3xl'>
          <InsightsDonationsTable data={[]}/>
        </div>
      </div>
    )
  )
}

export default AdminDonationsInsights
