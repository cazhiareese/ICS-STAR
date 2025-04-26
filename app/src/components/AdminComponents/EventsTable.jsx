import React from 'react'
import { useNavigate } from 'react-router-dom'

function formatDateTime(datetimeStr) {
  if (datetimeStr == null){
      return
  }
  const date = new Date(datetimeStr.replace(" ", "T"))
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

function EventsTable({ data }) {
  const navigate = useNavigate()

  return (
    <table className="w-full">
      <thead>
        <tr className="text-left text-xs text-primary font-satoshi-regular">
          <th className="py-2 px-4">Date Concluded</th>
          <th className="py-2 px-4">Event Title</th>
          <th className="py-2 px-4">RSVP Count</th>
          <th className="py-2 px-4">Event Date</th>
          <th className="py-2 px-4">Event Tags</th>
        </tr>
      </thead>

      <tbody className="font-satoshi-regular text-md">
        {data.map((event, index) => {
          const sortedDates = [...event.datetime].sort()
          const startDate = formatDateTime(sortedDates[0])
          const endDate = formatDateTime(sortedDates[sortedDates.length - 1])
          const uniqueTags = [...new Set(event.tags)].join(", ")

          return (
            <tr
              key={index}
              className="hover:bg-secondary cursor-pointer"
              onClick={() => navigate(`/admin/events/${event.event_id}`)}
            >
              <td className="py-3 px-4">{endDate}</td>
              <td className="py-3 px-4 font-satoshi-bold">{event.title}</td>
              <td className="py-3 px-4">{event.attendees}</td>
              <td className="py-3 px-4">{startDate}</td>
              <td className="py-3 px-4">{uniqueTags}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default EventsTable
