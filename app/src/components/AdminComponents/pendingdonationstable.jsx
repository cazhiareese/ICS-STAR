import React from 'react'
import { useNavigate } from 'react-router-dom'

function PendingDonationsTable({ data }) {
  const navigate = useNavigate()

  return (
    <table className="w-full ">
        {/* Table Header */}
        <thead>
            <tr className="text-left text-xs text-primary font-satoshi-regular">
            <th className="py-2 px-4">Date</th>
            <th className="py-2 px-4">Donor</th>
            <th className="py-2 px-4">Details</th>
            </tr>
        </thead>

        {/* Table Body */}
        <tbody className="font-satoshi-regular text-sm">
            {data.map((donation, index) => (
                <tr
                key={index}
                className="hover:bg-gray-100 cursor-pointer"
                // onClick={() => navigate(`/admin/donations/${donation.donation_id}`)}
                >
                <td className="py-3 px-4 flex items-center">{donation.date}</td>
                <td className="py-3 px-4">{donation.donor}</td>
                <td className="py-3 px-4">{donation.details}</td>
            </tr>
            ))}
        </tbody>
    </table>
  )
}

export default PendingDonationsTable
