import React, {useEffect, useState} from 'react'
import { Plus, MoveLeft, MoveRight, Dot } from 'lucide-react'
import AdminEventCard from '../../../components/AdminComponents/AdminEventCard'
import axios from 'axios'
import EventsTable from '../../../components/AdminComponents/EventsTable'
import CircularLoading from "../../../components/LoadingComponents/circularloading" 
import { Navigate, useNavigate } from 'react-router-dom'

function AdminEvents() {
  const navigate = useNavigate()
  const [eventType, setEventType] = useState('active')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(48)
  const [loading, setLoading] = useState(false)
  const [events, setEvents] = useState([])

  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL

  async function fetchEvents(type, token) {
    setLoading(true)
    try {
      let endpoint = "";
      if (type === 'active') {
        endpoint = "/api/admin/events/all-open-events";
      } else if (type === 'finished') {
        endpoint = "/api/admin/events/all-concluded-events";
      }
  
      const response = await axios.get(`${API_BASE_URL}${endpoint}`, {headers: {Authorization: `Bearer ${token}`}});
      setEvents(response.data.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const token = localStorage.get("token")
    fetchEvents(eventType, token)
  }, [eventType])

  return (
    <div className='h-screen w-full p-6 flex flex-col bg-white'>
      {/* Events header and new event button */}
      <div className='flex flex-row justify-between mb-10'>
        <h1 className='font-satoshi-bold text-5xl text-primary'>Events</h1>
        <button className='flex flex-row items-center justify-center gap-2 font-satoshi-regular text-white bg-primary px-6 py-3 rounded-2xl hover:bg-hover cursor-pointer' onClick={() => {navigate("/admin/events/create-event")}}> 
          <Plus/> New Event
        </button>
      </div>
      {/* Alumni or student */}
      <div className='flex flex-col w-full lg:w-auto lg:flex-row items-center lg:justify-between lg:ml-5 gap-2 lg:gap-0'>
        <div className='w-full lg:w-auto  min-w-xs'>
          {/* Alumni button */}
          <button className={`px-12 py-3 cursor-pointer border-b-3 w-1/2 lg:w-auto ${eventType === 'active' ? 'border-primary' : 'border-transparent'}`} onClick={() => setEventType('active')}>
            <p className='text-black font-satoshi-medium text-md'> Active </p>
          </button>
          {/* Student button */}
          <button className={`px-12 py-3 cursor-pointer border-b-3 w-1/2 lg:w-auto ${eventType === 'finished' ? ' border-primary' : 'border-transparent'}`} onClick={() => setEventType('finished')}>
            <p className='text-black font-satoshi-medium text-md'> Finished </p>
          </button>
        </div>
        {/* Page */}
        <div className='items-center gap-2 text-md font-satoshi-regular hidden lg:flex'>
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
          </div>
        </div>
        {
          loading ? (
            <div className="flex justify-center items-center h-screen">
              <CircularLoading size={90} />
            </div>
          ) : eventType === 'active' ? (
          <div className="pt-4 w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-auto mx-auto">
            {events.map((event, index) => (
              <AdminEventCard key={index} event={event} />
            ))}
          </div>
          ) : eventType === 'finished' ? (
            <div className="border border-gray-400 rounded-xl p-6 flex-1 hidden lg:block overflow-auto">
              {events.length == 0 ? (
                <div className='h-full w-full flex flex-row items-center justify-center'>
                  <h1 className='font-satoshi-regular text-3xl text-primary'>No events to show</h1>
                </div>
              ) : (
                <EventsTable data={events}/>
              )}
            </div>
          ) : null
        }
    </div>
  )
}

export default AdminEvents
