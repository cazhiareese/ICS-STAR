import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LockOpenIcon, Lock } from 'lucide-react'; 


function formatDateTime(datetimeStr) {
  if (datetimeStr == null) {
    return;
  }
  const date = new Date(datetimeStr.replace(" ", "T"));
  return date
    .toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .replace(",", "");
}

function AdminEventCard({ event, loading = false }) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="h-72 border border-gray-300 rounded-2xl flex flex-col bg-white animate-pulse">
        {/* Image placeholder */}
        <div className="bg-gray-200 h-24 w-full rounded-t-2xl"></div>
        <div className="flex flex-col flex-1 p-3 text-left bg-white rounded-b-3xl">
          <div className="flex-1">
            {/* Title */}
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
            {/* Location */}
            <div className="flex flex-row justify-between mb-2">
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            </div>
            {/* Date */}
            <div className="flex flex-row justify-between">
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
          {/* Attendees badge */}
          <div className="flex flex-row items-center justify-center px-3 py-1 bg-gray-200 rounded-3xl w-32 self-end">
            <div className="h-2 w-2 bg-gray-300 rounded-full mr-2"></div>
            <div className="h-6 bg-gray-300 rounded w-16"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      className="h-72 border border-gray-300 rounded-2xl flex flex-col cursor-pointer bg-white"
      onClick={() => navigate(`/admin/events/event-details/${event.event_id}`)}
    >
      {/* Image placeholder */}
      <div className="bg-primary h-24 w-full rounded-t-2xl">
        <img src={event.image} alt="" className="h-full w-full object-cover rounded-t-2xl" />
      </div>
      <div className="flex flex-col flex-1 p-3 text-left bg-white rounded-b-3xl">
        <div className="flex-1">
          <h2 className="font-satoshi-bold text-2xl text-ellipsis whitespace-nowrap overflow-hidden">
            {event.title}
          </h2>
          {/* Location */}
          <div className="flex flex-row justify-between">
            <p className="font-satoshi-regular text-lg flex-1">Location</p>
            <p className="font-satoshi-regular text-primary text-lg text-right flex-1 text-ellipsis overflow-hidden whitespace-nowrap">
              {event.location}
            </p>
          </div>
          {/* Date */}
          <div className="flex flex-row justify-between">
            <p className="font-satoshi-regular text-lg">Date</p>
            <p className="font-satoshi-regular text-primary text-lg">
              {formatDateTime(event.datetime[0])}
            </p>
          </div>
        </div>
        {/* Count attendees */}
        <div className={`flex flex-row items-center justify-center px-3 py-1 rounded-3xl font-satoshi-light text-2xl gap-2 w-fit self-end ${event.is_closed ? 'bg-blue-50 text-blue-600' : 'bg-[#E0F0E8] text-success'}`}>
          {event.is_closed ? <Lock size={16} /> : <LockOpenIcon size={16} />}
          {/* <div className={`rounded-full h-2 w-2 ${event.is_closed ? 'bg-blue-600' : 'bg-green-600'}`}></div> */}
          <p>
            <span className="font-satoshi-medium">{event.attendees}</span> attendees
          </p>
        </div>
      </div>
    </button>
  );
}

export default AdminEventCard;