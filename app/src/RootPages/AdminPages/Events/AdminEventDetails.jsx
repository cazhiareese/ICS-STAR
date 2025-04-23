import React, { useEffect, useState } from 'react'
import { MoveLeft, Pencil, Trash2, MousePointerClick, SquareArrowOutUpRight, Mail } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import CircularLoading from '../../../components/LoadingComponents/circularloading'
import RsvpListTable from '../../../components/AdminComponents/RsvpListTable'

function AdminEventDetails() {
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL
  const navigate = useNavigate()
  const {eventid} = useParams()
  const [eventDetails, setEventDetails] = useState()
  const [rsvpDetails, setRsvpDetails] = useState()
  const [rsvpList, setRsvpList] = useState(null)
  const [loading, setLoading] = useState(true)
  const [viewStyle, setViewStyle] = useState('rsvpList')

  async function fetchEventDetails () {
      const response = await axios.get(`${API_BASE_URL}/one-event/${eventid}`)
      console.log(response)
      setEventDetails(response.data)
  }

  async function fetchRSVPClicks() {
    const response = await axios.get(`${API_BASE_URL}/api/admin/events/rsvp-clicks-count/${eventid}`)
    console.log(response.data)
    setRsvpDetails(response.data)
  }
  
  async function fetchRSVPList() {
    const response = await axios.get(`${API_BASE_URL}api/admin/events/getRSVPs/${eventid}`)
    console.log(response.data)
    setRsvpList(response.data.data)
  }

  useEffect(() => {
    async function fetchInitialInformation() {
      setLoading(true)
      try {
        await fetchEventDetails()
        await fetchRSVPClicks()
        await fetchRSVPList()
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
  
    fetchInitialInformation()
  }, [eventid])

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
      {/* RSVP Details */}
      <div className='flex flex-row items-center border border-gray-400 rounded-3xl h-24 px-12 py-6'>
        <div className='flex flex-1 items-center gap-12'>
          <h2 className='font-satoshi-bold text-primary text-3xl flex items-center'>{rsvpDetails.rsvp_count} RSVPs</h2>
          <div className='flex flex-row items-center gap-2'>
            <MousePointerClick className='text-primary'/>
            <div className='flex flex-col h-fit justify-center'>
              <h2 className='font-satoshi-bold text-primary text-2xl -mb-2'>{rsvpDetails.user_clicks}</h2>
              <h2 className='font-satoshi-light text-black'>User Clicks</h2>
            </div>
          </div>
        </div>
        <div className='flex-1 flex justify-end'>
          <button className='flex flex-row items-center gap-2 text-primary font-satoshi-regular cursor-pointer hover:text-hover'>
            View Demographics
            <SquareArrowOutUpRight size={20} className='stroke-2'/> 
          </button>
        </div>
      </div>
       {/* Send email button and list/details toggle */}
      <div className='flex flex-row justify-between mt-3 font-satoshi-regular'>
        {/* Send email invites button */}
        <button className='bg-primary h-fit w-fit flex flex-row items-center justify-center text-white rounded-2xl px-6 py-3 mb-2 gap-2 cursor-pointer'>
          <Mail/>
          Send Email Invites
        </button>
        <div className='flex flex-row h-fit w-fit mr-5 self-end'>
          <button 
            className={`${viewStyle == 'rsvpList' ? 'bg-primary text-white' : ''} border-x border-t border-primary rounded-tl-2xl py-1 px-8 cursor-pointer`} 
            onClick={() => {setViewStyle('rsvpList')}}> 
            RSVP List
          </button>
          <button 
            className={`${viewStyle == 'eventDetails' ? 'bg-primary text-white' : ''} border-x border-t border-primary rounded-tr-2xl py-1 px-6 cursor-pointer`} 
            onClick={() => {setViewStyle('eventDetails')}}> 
            Event Details
          </button>
        </div>
      </div>
      {/* RSVP List table / Event Details */}
      <div className='flex items-center justify-center w-full h-full border border-gray-400 rounded-2xl'>
        {viewStyle == 'rsvpList' ? (
          rsvpList == null ? (
            <p> No RSVP yet :(</p>
          ) : (
            <RsvpListTable data={rsvpList}/>
          )
        ) : (
          <></>
        )}
      </div>
    </div>
    )
  )
}

export default AdminEventDetails
