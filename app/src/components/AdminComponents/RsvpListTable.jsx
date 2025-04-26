import React from 'react'

function RsvpListTable({ data }) {

  return (
    <table className="w-full">
        {/* Table Header */}
        <thead>
            <tr className="text-left text-xs text-primary font-satoshi-regular">
            <th className="py-2 px-4">Name</th>
            <th className="py-2 px-4">Email</th>
            <th className="py-2 px-4">Batch</th>
            </tr>
        </thead>

        {/* Table Body */}
        <tbody className="font-satoshi-regular text-md">
            {data.map((event, index) => (
                <tr
                key={index}
                className="hover:bg-secondary cursor-pointer"
                >
                <td className="py-3 px-4 flex items-center gap-2 font-satoshi-bold">{event.name}</td>
                <td className="py-3 px-4">{event.email}</td>
                <td className="py-3 px-4">{event.batch}</td>
            </tr>
            ))}
        </tbody>
    </table>
  )
}

export default RsvpListTable
