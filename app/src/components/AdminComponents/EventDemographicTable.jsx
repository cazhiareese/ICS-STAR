import React from 'react'

function EventDemographicTable({data}) {
  return (
    <table className="w-full bg-zinc-50">
      <thead className='border-b border-gray-300'>
        <tr className="text-left text-md text-primary font-satoshi-regular">
          <th className="py-2 px-4">Batch</th>
          <th className="py-2 px-4">RSVP Count</th>
        </tr>
      </thead>

      <tbody className="font-satoshi-regular text-md">
        {data.map((pair, index) => {
          return (
            <tr
              key={index}
              className="hover:bg-gray-100 border-b border-gray-300"
            >
              <td className="py-3 px-4">{pair.batch}</td>
              <td className="py-3 px-4 font-satoshi-bold">{pair.rsvp_count}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default EventDemographicTable
