import React from 'react'
import { useNavigate } from 'react-router-dom'

function JobTable({ data }) {
  const navigate = useNavigate()

  return (
    <table className="w-full">
        {/* Table Header */}
        <thead>
            <tr className="text-left text-xs text-primary font-satoshi-regular">
            <th className="py-2 px-4">Date Posted</th>
            <th className="py-2 px-4">Job Title</th>
            <th className="py-2 px-4">Creator</th>
            <th className="py-2 px-4">Interested #</th>
            <th className="py-2 px-4">Card</th>
            </tr>
        </thead>

        {/* Table Body */}
        <tbody className="font-satoshi-regular text-md">
            {data.map((job, index) => (
                <tr
                key={index}
                >
                <td className="py-3 px-4 flex items-center gap-2 font-satoshi-bold">{job.date_posted}</td>
                <td className="py-3 px-4">{job.job_title}</td>
                <td className="py-3 px-4">{job.creator}</td>
                <td className="py-3 px-4">{job.interested}</td>
                <td className="py-3 px-4">View</td>
            </tr>
            ))}
        </tbody>
    </table>
  )
}

export default JobTable
