import React, { useEffect, useState } from 'react'
import { MoveLeft, Pencil, Trash2, Dot } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import CircularLoading from '../../../components/LoadingComponents/circularloading'

function AdminEventDetails() {
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL
  const navigate = useNavigate()
  const {eventid} = useParams()
  const [eventDetails, setEventDetails] = useState()
  const [loading, setLoading] = useState()

  async function fetchEventDetails () {
    setLoading(true)
    try {
      const response = await axios.get(`${API_BASE_URL}/one-event/${eventid}`)
      console.log(response)
      setEventDetails(response.data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    fetchEventDetails()
  },[])

  return (
    loading ? (
    <div className='h-screen w-full flex items-center justify-center'>
      <CircularLoading/>
    </div>
    ) : (
    <div className='p-6 h-screen w-full flex flex-col'>
      {/* Back */}
      <button className="flex gap-2 mb-3 flex-row items-center cursor-pointer" onClick={() => navigate(-1)}>
        <MoveLeft className='text-primary' /> 
        <p className='text-primary font-satoshi-medium text-lg'>Back to events</p>
      </button>
      <div className='flex flex-row justify-between mb-3 items-center'>
        {/* Event title and accepting rsvp */}
        <div className='flex flex-row gap-2'>
          <h1 className='font-satoshi-bold text-4xl'>{eventDetails.title}</h1>
          {/* Accepting RSVP or closed */}
          {eventDetails.is_closed ? (
            <div className='flex flex-row items-center justify-center gap-2 bg-red-400 text-red-700 rounded-3xl h-fit self-end px-2 py-1'>
              <div className='bg-red-400 h-2 w-2 rounded-full'></div>
              <p className='font-satoshi-medium'>Closed</p>
            </div>
          ) : (
            <div className='flex flex-row items-center justify-center gap-2 bg-green-50 text-green-700 rounded-3xl h-fit self-end px-2 py-1'>
              <div className='bg-green-700 h-2 w-2 rounded-full'></div>
              <p className='font-satoshi-medium text-sm'>Accepting RSVPs</p>
            </div>
          )}
        </div>
        {/* Edit Event and Delete Event */}
        <div className='flex flex-row gap-2'>
          {/* Edit event */}
          <button className='bg-primary rounded-3xl px-6 py-2 flex flex-row items-center gap-2 justify-center text-white shadow-lg cursor-pointer'>
            <Pencil/>
            <p className='font-satoshi-regular text-lg'>Edit Event</p>
          </button>
          {/* Delete event */}
          <button className='bg-red-700 rounded-3xl px-6 py-2 flex flex-row items-center gap-2 justify-center text-white shadow-lg cursor-pointer'>
            <Trash2/>
            <p className='font-satoshi-regular text-lg'>Delete Event</p>
          </button>
        </div>
      </div>
      <div className='border border-gray-400 rounded-3xl h-36'>

      </div>
    </div>
    )
  )
}

export default AdminEventDetails
