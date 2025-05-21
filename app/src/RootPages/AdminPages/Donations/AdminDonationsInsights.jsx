import React, { useEffect, useState } from 'react'
import { ChevronsUpDown, Filter } from 'lucide-react'
import axios from 'axios'
import CircularLoading from '../../../components/LoadingComponents/circularloading'
import SortModal from '../../../components/AdminComponents/sortmodal'
import OrderToggle from '../../../components/AdminComponents/ordertoggle'
import PaginationComponent from '../../../components/AdminComponents/PaginationComponent'
import InsightsDonationsTable from '../../../components/AdminComponents/InsightsDonationsTable'
import DatePicker from 'react-multi-date-picker'
import SearchComponent from '../../../components/AdminComponents/SearchComponent'

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

  async function fetchDonations(token) {
    setDonationLoading(true)
    try {
      let queryParams = `time_filter=${timeFilter}`
      if (timeFilter === "monthly" && selectedMonth !== null && selectedYear !== null) {
        queryParams += `&month=${selectedMonth}&year=${selectedYear}`;
      }
      queryParams += `&isAcknowledged=${isAcknowledged}&page=${donationPage}`
      const donationResponse = await axios.get(`${API_BASE_URL}/admin/donations?${queryParams}`, { headers: { Authorization: `Bearer ${token}` } })
      setDonations(donationResponse.data.data)
      setTotalDonationPage(donationResponse.data.total_pages)
    } catch (error) {
      console.log(error)
    } finally {
      setDonationLoading(false)
    }
  }

  async function fetchInitialData(token) {
    setLoading(true);
    try {
      let queryParams = `time_filter=${timeFilter}`;
      if (timeFilter === "monthly" && selectedMonth !== null && selectedYear !== null) {
        queryParams += `&month=${selectedMonth}&year=${selectedYear}`;
      }

      const [topDrivesResponse, driveGoalsReachedResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/admin/donations/top-performing-drives?${queryParams}`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_BASE_URL}/admin/donations/top-drives-with-goals-reached?${queryParams}`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      setTopPerformingDrives(Array.isArray(topDrivesResponse.data) ? topDrivesResponse.data : []);
      setDrivesWithGoalsReached(Array.isArray(driveGoalsReachedResponse.data) ? driveGoalsReachedResponse.data : []);
    } catch (error) {
      console.log(error);
      setTopPerformingDrives([]);
      setDrivesWithGoalsReached([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setDonationPage(1)
    setTotalDonationPage(1)
    fetchDonations(token)
  }, [isAcknowledged, donationPage])

  useEffect(() => {
    const tokenStored = localStorage.getItem('token');
    setToken(tokenStored)
    fetchInitialData(tokenStored)
    fetchDonations(tokenStored)
  }, [timeFilter])

  // Skeleton components
  const SkeletonHeader = () => (
    <div className="h-12 w-1/3 bg-gray-200 rounded-md animate-pulse mb-3"></div>
  );

  const SkeletonFilterButton = () => (
    <div className="h-8 w-24 bg-gray-200 rounded-md animate-pulse"></div>
  );

  const SkeletonDriveCard = () => (
    <div className="flex flex-col flex-1 border border-gray-300 p-3 rounded-2xl bg-white animate-pulse">
      <div className="h-6 w-1/3 bg-gray-200 rounded mb-3"></div>
      {[...Array(3)].map((_, index) => (
        <div key={index} className="flex flex-row justify-between h-12 items-center">
          <div className="flex flex-row flex-1 gap-2">
            <div className="h-4 w-8 bg-gray-200 rounded"></div>
            <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="h-4 w-12 bg-gray-200 rounded"></div>
            <div className="h-3 w-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );

  const SkeletonTable = () => (
    <div className="flex-1 border border-gray-300 rounded-3xl bg-white overflow-clip animate-pulse">
      <div className="p-4">
        <div className="h-6 w-1/4 bg-gray-200 rounded mb-4"></div>
        {[...Array(5)].map((_, index) => (
          <div key={index} className="h-10 w-full bg-gray-200 rounded mb-2"></div>
        ))}
      </div>
    </div>
  );

  const SkeletonControls = () => (
    <div className="flex flex-col w-full lg:flex-row items-center lg:justify-between lg:ml-5 gap-2 lg:gap-0 animate-pulse">
      <div className="w-full lg:w-auto min-w-xs flex gap-2">
        <div className="h-10 w-1/4 bg-gray-200 rounded-md"></div>
        <div className="h-10 w-1/4 bg-gray-200 rounded-md"></div>
      </div>
      <div className="flex gap-2">
        <div className="h-10 w-48 bg-gray-200 rounded-md"></div>
        <div className="h-10 w-24 bg-gray-200 rounded-md"></div>
      </div>
    </div>
  );

  return (
    loading ? (
      <div className="flex flex-col p-6 h-screen w-full overflow-auto">
        <div className="flex flex-row relative justify-between">
          <SkeletonHeader />
          <SkeletonFilterButton />
        </div>
        <div className="flex flex-row gap-4 h-1/3 mt-2">
          <SkeletonDriveCard />
          <SkeletonDriveCard />
        </div>
        <SkeletonHeader />
        <SkeletonControls />
        <SkeletonTable />
      </div>
    ) : (
      <div className="flex flex-col p-6 h-screen w-full overflow-auto">
        <div className="flex flex-row relative justify-between">
          <h1 className="text-primary text-5xl font-satoshi-bold mb-3">General Insights</h1>
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
                        }
                      }}
                    />
                    <span>{formatFilter(filter)}</span>
                  </label>
                ))}
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
                    <button
                      className="mt-2 bg-primary text-white py-1 px-2 rounded-md hover:bg-hover cursor-primary font-satoshi-regular"
                      onClick={() => {
                        if (!customStartDate || !customEndDate) {
                          return;
                        }
                        setFilterOpen(false);
                        fetchInitialData();
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
        <div className="flex flex-row gap-4 h-1/3 mt-2">
          <div className="flex flex-col flex-1 border border-gray-300 p-3 rounded-2xl bg-white">
            <h2 className="font-satoshi-medium text-2xl">Top Performing Drives</h2>
            {topPerformingDrives.length === 0 ? (
              <div className="flex justify-center items-center h-full">
                <p> No top performing drives :( </p>
              </div>
            ) : (
              topPerformingDrives.map((drive) => (
                <div key={drive.drive_id} className="flex flex-row justify-between h-full items-center">
                  <div className="flex flex-row flex-1 gap-2">
                    <h2 className="font-satoshi-bold text-primary">#{drive.rank} </h2>
                    <h2 className="font-satoshi-bold text-left"> {drive.title} </h2>
                  </div>
                  <div className="flex flex-col items-end">
                    <h2 className="text-primary font-satoshi-bold text-lg">{drive.percent_increase}%</h2>
                    <p className="font-satoshi-light text-xs text-black">increase during time period</p>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="flex flex-col flex-1 border border-gray-300 p-3 rounded-2xl bg-white">
            <h2 className="font-satoshi-medium text-2xl">Drives with Goals Reached</h2>
            {drivesWithGoalsReached.length === 0 ? (
              <div className="flex justify-center items-center h-full">
                <p> No drives with goals reached :( </p>
              </div>
            ) : (
              drivesWithGoalsReached.map((drive, index) => (
                <div key={drive.drive_id} className="flex flex-row justify-between h-full items-center">
                  <div className="flex flex-row flex-1 gap-2">
                    <h2 className="font-satoshi-bold text-primary">#{index + 1} </h2>
                    <h2 className="font-satoshi-bold text-left "> {drive.title} </h2>
                  </div>
                  <div className="flex flex-col items-end">
                    <h2 className="text-primary font-satoshi-bold text-lg">{drive.percent_funded}%</h2>
                    <p className="font-satoshi-light text-xs text-black">of goal reached</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <h1 className="text-5xl text-primary font-satoshi-bold mt-6">Donations</h1>
        {donationLoading ? (
          <>
            <SkeletonControls />
            <SkeletonTable />
          </>
        ) : (
          <>
            <div className="flex flex-col w-full lg:w-auto lg:flex-row items-center lg:justify-between lg:ml-5 gap-2 lg:gap-0">
              <div className="w-full lg:w-auto min-w-xs">
                <button
                  className={`px-12 py-3 cursor-pointer border-b-3 w-1/2 lg:w-auto ${isAcknowledged === true ? 'border-primary font-satoshi-medium' : 'border-transparent font-satoshi-light'}`}
                  onClick={() => setIsAcknowledged(true)}
                >
                  Verified
                </button>
                <button
                  className={`px-12 py-3 cursor-pointer border-b-3 w-1/2 lg:w-auto ${isAcknowledged === false ? ' border-primary font-satoshi-medium' : 'border-transparent font-satoshi-light'}`}
                  onClick={() => setIsAcknowledged(false)}
                >
                  Unverified
                </button>
              </div>
              <div className="flex gap-2">
                <div className="relative flex items-center justify-end flex-1">
                  <SearchComponent />
                </div>
                <PaginationComponent
                  page={donationPage}
                  setPage={setDonationPage}
                  totalPages={totalDonationPage}
                />
              </div>
            </div>
            <div className="flex-1 border border-gray-300 rounded-3xl bg-white overflow-clip">
              <InsightsDonationsTable data={donations} loading={donationLoading} />
            </div>
          </>
        )}
      </div>
    )
  )
}

export default AdminDonationsInsights