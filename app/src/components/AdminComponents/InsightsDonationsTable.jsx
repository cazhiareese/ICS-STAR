import React from 'react'
import { useNavigate } from 'react-router-dom'

function InsightsDonationsTable({ data }) {
  const navigate = useNavigate()

  return (
    <table className="w-full">
        {/* Table Header */}
        <thead>
            <tr className="text-left text-xs text-primary font-satoshi-regular">
            <th className="py-2 px-4">Date Donated</th>
            <th className="py-2 px-4">Donation Drive</th>
            <th className="py-2 px-4">Name</th>
            <th className="py-2 px-4">Donation Type</th>
            <th className="py-2 px-4">Donation Details</th>
            </tr>
        </thead>

        {/* Table Body */}
        <tbody className="font-satoshi-regular text-md">
            {data.map((donation, index) => (
                <tr
                key={index}
                className="hover:bg-secondary cursor-pointer"
                onClick={() => navigate(`/admin/donations/${donation.drive_id}`)}
                >
                <td className="py-3 px-4 flex items-center gap-2 font-satoshi-bold">{donation.date_donated}</td>
                <td className="py-3 px-4">{donation.donation_drive}</td>
                <td className="py-3 px-4">{donation.name}</td>
                <td className="py-3 px-4">{donation.donation_type}</td>
                <td className="py-3 px-4">{donation.donation_details}</td>
            </tr>
            ))}
        </tbody>
    </table>
  )
}

export default InsightsDonationsTable
