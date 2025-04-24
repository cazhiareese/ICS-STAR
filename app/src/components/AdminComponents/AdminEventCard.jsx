import React from 'react'
import { useNavigate } from 'react-router-dom';

function AdminEventCard({event}) {
  const navigate = useNavigate()

  function formatDate(datetimeStr) {
    if (datetimeStr == null){
      return
    }
    const date = new Date(datetimeStr.replace(" ", "T"));
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).replace(",", "");
  }

  return (
    <button className='h-72 border border-gray-300 rounded-2xl flex flex-col cursor-pointer'  onClick={() => {navigate(`/admin/events/event-details/${event.event_id}`)}}>
    {/* Image placeholder */}
    <div className='bg-primary h-24 w-full rounded-t-2xl'>
      <img src="" alt="" className='h-full object-cover'/>
    </div>
      <div className='flex flex-col flex-1 p-3 text-left'>
        <div className='flex-1'>
          <h2 className='font-satoshi-bold text-2xl'>{event.title}</h2>
          {/* Location */}
          <div className='flex flex-row justify-between'>
            <p className='font-satoshi-regular text-lg'>Location</p>
            <p className='font-satoshi-regular text-primary text-lg'>{event.location}</p>
          </div>
          {/* Date */}
          <div className='flex flex-row justify-between'>
            <p className='font-satoshi-regular text-lg'>Date</p>
            <p className='font-satoshi-regular text-primary text-lg'>{formatDate(event.datetime[0])}</p>
          </div>
        </div>
        {/* Count attendees */}
        <div className='flex flex-row items-center justify-center px-3 py-1 bg-green-50 rounded-3xl font-satoshi-light text-2xl text-green-600 gap-2 w-fit self-end'>
          <div className='rounded-full h-2 w-2 bg-green-600'></div>
          <p><span className='font-satoshi-medium'>{event.attendees}</span> attendees</p>
        </div>
      </div>
    </button>
  )
}

export default AdminEventCard
