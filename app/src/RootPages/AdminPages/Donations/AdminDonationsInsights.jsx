import React, { useEffect, useState } from 'react'
import axios from 'axios'
import CircularLoading from '../../../components/LoadingComponents/circularloading'

function AdminDonationsInsights() {
  const [token, setToken] = useState(null)
  const {timeFilter, setTimeFilter} = useState('last_7_days')
  const [topPerformingDrives, setTopPerformingDrives] = useState([])
  const [drivesWithGoalsReached, setDrivesWithGoalsReached] = useState([])
  const [loading, setLoading] = useState(true)
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
      <div className='p-6 h-screen w-full overflow-auto'>
          {/* header */}
        <h1 className='text-primary text-5xl font-satoshi-bold'>General Insights</h1>
        {/* Filter */}
        {/* Top performing drives and drives with goals reached */}
        <div className='flex flex-row gap-4 h-1/3'>
          {/* Top performing drives */}
          <div className='flex flex-col flex-1 border border-gray-300 p-3 rounded-2xl'>
            <h2 className='font-satoshi-medium text-2xl'>Top Performing Drives</h2>
            {topPerformingDrives.map((drive) => (
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
            ))}
          </div>
          {/* Drives with goals reached */}
          <div className='flex flex-col flex-1 border border-gray-300 p-3 rounded-2xl'>
            <h2 className='font-satoshi-medium text-2xl'>Drives with Goals Reached</h2>
            {drivesWithGoalsReached.map((drive) => (
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
            ))}
          </div>
        </div>
      </div>
    )
  )
}

export default AdminDonationsInsights
