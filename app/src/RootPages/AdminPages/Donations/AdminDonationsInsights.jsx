import React, { useEffect, useState } from 'react'
import { ChevronsUpDown, Filter } from 'lucide-react'
import axios from 'axios'
import CircularLoading from '../../../components/LoadingComponents/circularloading'
import SortModal from '../../../components/AdminComponents/sortmodal'
import OrderToggle from '../../../components/AdminComponents/ordertoggle'
import PaginationComponent from '../../../components/AdminComponents/PaginationComponent'
import InsightsDonationsTable from '../../../components/AdminComponents/InsightsDonationsTable'
import DatePicker from 'react-multi-date-picker'
import SearchComponent from '../../../components//AdminComponents/SearchComponent'

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
  const filters = ["last_30_days", "last_7_days", "Custom"];
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(null)
  const [selectedYear, setSelectedYear] = useState(null)
  const [customStartDate, setCustomStartDate] = useState(null)
  const [customEndDate, setCustomEndDate] = useState(null)
  const [isAcknowledged, setIsAcknowledged] = useState(true)
  const [donations, setDonations] = useState([])
  const [donationPage, setDonationPage] = useState(1)
  const [totalDonationPage, setTotalDonationPage] = useState(1)
  const [donationLoading, setDonationLoading] = useState(false)
  const formatFilter = (filter) => filter.replaceAll("_", " ");

  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;


  async function fetchDonations() {
    setDonationLoading(true)
    try{
      let queryParams = `time_filter=${timeFilter}`
      if (timeFilter === "monthly" && selectedMonth !== null && selectedYear !== null) {
        queryParams += `&month=${selectedMonth}&year=${selectedYear}`;
      }
      queryParams += `&isAcknowledged=${isAcknowledged}&page=${donationPage}`
      console.log(queryParams)
      const donationResponse = await axios.get(`${API_BASE_URL}/admin/donations?${queryParams}`,{headers: {Authorization: `Bearer ${token}`}})
      console.log(donationResponse)
      setDonations(donationResponse.data.data)
      setTotalDonationPage(donationResponse.data.total_pages)
    } catch (error) {
      console.log(error)
    } finally {
      setDonationLoading(false)
    }
  }

  async function fetchInitialData() {
    setLoading(true);
    try {
      // Build query params
      let queryParams = `time_filter=${timeFilter}`;
      if (timeFilter === "monthly" && selectedMonth !== null && selectedYear !== null) {
        queryParams += `&month=${selectedMonth}&year=${selectedYear}`;
      }

      console.log(queryParams)
  
    // Fetch top performing drives
    const topDrivesResponse = await axios.get(
      `${API_BASE_URL}/admin/donations/top-performing-drives?${queryParams}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log(topDrivesResponse.data);

    // Check if it's an array or an error message
    if (Array.isArray(topDrivesResponse.data)) {
      setTopPerformingDrives(topDrivesResponse.data);
    } else {
      setTopPerformingDrives([]); // Empty array if no data
    }

    // Fetch drives with goals reached
    const driveGoalsReachedResponse = await axios.get(
      `${API_BASE_URL}/admin/donations/top-drives-with-goals-reached?${queryParams}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log(driveGoalsReachedResponse);

    if (Array.isArray(driveGoalsReachedResponse.data)) {
      setDrivesWithGoalsReached(driveGoalsReachedResponse.data);
    } else {
      setDrivesWithGoalsReached([]);
    }

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setDonationPage(1)
    setTotalDonationPage(1)
    fetchDonations()
  }, [isAcknowledged, donationPage])
  

  useEffect(() => {
    setToken(localStorage.getItem("token"))
    fetchInitialData()
    fetchDonations()
  }, [timeFilter])

  return (
    loading ? (
      <div className="flex justify-center items-center min-h-screen w-full">
        <CircularLoading/>
      </div>
    ) : (
      <div className='flex flex-col p-6 h-screen w-full overflow-auto'>
      <div className="flex flex-row relative justify-between">
          {/* header */}
        <h1 className='text-primary text-5xl font-satoshi-bold mb-3'>General Insights</h1>
        {/* Filter */}
          <button
            className="flex flex-row items-center border border-gray-300 w-fit h-fit place-self-end px-3 py-1 rounded-md bg-white cursor-pointer"
            onClick={() => setFilterOpen(!filterOpen)}
          >
            <p className="mr-2">{formatFilter(timeFilter)}</p>
            <ChevronsUpDown size={16} />
          </button>

          {filterOpen && (
            <div className="absolute top-15 right-0 w-64 bg-white border place-self-end border-gray-300 rounded-md shadow-lg p-4 z-10">
              <p className="font-satoshi-medium mb-2">Filter:</p>
              <div className="flex flex-col gap-2">
                {filters.map((filter) => (
                  <label key={filter} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="timeFilter"
                      value={filter}
                      checked={timeFilter === filter}
                      onChange={() => {
                        if (filter === "Custom") {
                          setTimeFilter(filter);
                        } else {
                          setTimeFilter(filter);
                          setFilterOpen(false);
                          // fetchInitialData();
                        }
                      }}
                    />
                    <span>{formatFilter(filter)}</span>
                  </label>
                ))}

                {/* Show date pickers if Custom is selected */}
                {timeFilter === "Custom" && (
                  <div className="flex flex-col gap-2 mt-4">
                    <div className="flex flex-col">
                      <label className="text-xs text-gray-500 mb-1">Start Date:</label>
                      <DatePicker
                        value={customStartDate}
                        onChange={setCustomStartDate}
                        className="border rounded-md"
                        containerClassName="w-full"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-xs text-gray-500 mb-1">End Date:</label>
                      <DatePicker
                        value={customEndDate}
                        onChange={setCustomEndDate}
                        className="border rounded-md"
                        containerClassName="w-full"
                      />
                    </div>

                    {/* Submit button */}
                    <button
                      className="mt-2 bg-primary text-white py-1 px-2 rounded-md hover:bg-hover cursor-primary font-satoshi-regular"
                      onClick={() => {
                        if (!customStartDate || !customEndDate) {
                          return;
                        }
                        setFilterOpen(false);
                        fetchInitialData(); // Now fetch after both dates are selected
                      }}
                    >
                      Apply Filter
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
        {/* Top performing drives and drives with goals reached */}
        <div className='flex flex-row gap-4 h-1/3 mt-2'>
          {/* Top performing drives */}
          <div className='flex flex-col flex-1 border border-gray-300 p-3 rounded-2xl bg-white'>
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
          <div className='flex flex-col flex-1 border border-gray-300 p-3 rounded-2xl bg-white'>
            <h2 className='font-satoshi-medium text-2xl'>Drives with Goals Reached</h2>
            {drivesWithGoalsReached.length === 0 ? (
              <div className='flex justify-center items-center h-full'>
                <p> No drives with goals reached :( </p>
              </div>
            ) : (
              drivesWithGoalsReached.map((drive, index) => (
                <div key={drive.drive_id} className="flex flex-row justify-between h-full items-center">
                  <div className='flex flex-row flex-1 gap-2'>
                  <h2 className='font-satoshi-bold text-primary'>#{index+1} </h2>
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
            <button className={`px-12 py-3 cursor-pointer border-b-3 w-1/2 lg:w-auto ${isAcknowledged === true ? 'border-primary font-satoshi-medium' : 'border-transparent font-satoshi-light'}`} onClick={() => setIsAcknowledged(true)}>
               Verified
            </button>
            {/* Unverified button */}
            <button className={`px-12 py-3 cursor-pointer border-b-3 w-1/2 lg:w-auto ${isAcknowledged === false ? ' border-primary font-satoshi-medium' : 'border-transparent font-satoshi-light'}`} onClick={() => setIsAcknowledged(false)}>
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
            <SearchComponent
            />
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
            <PaginationComponent
              page={donationPage}
              setPage={setDonationPage}
              totalPages={totalDonationPage}
            />
          </div>
        </div>
        {/* Table of donations */}
        <div className='flex-1 border border-gray-300 rounded-3xl bg-white overflow-clip'>
          <InsightsDonationsTable data={donations} loading={donationLoading}/>
        </div>
      </div>
    )
  )
}

export default AdminDonationsInsights
