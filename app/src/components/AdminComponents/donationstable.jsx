import React from 'react'
import { useNavigate } from 'react-router-dom'

function DonationsTable({ data }) {
  const navigate = useNavigate()

  return (
    <table className="w-full">
        {/* Table Header */}
        <thead>
            <tr className="text-left text-xs text-primary font-satoshi-regular">
            <th className="py-2 px-4">Donation Title</th>
            <th className="py-2 px-4">Date Created</th>
            <th className="py-2 px-4">Donation Count</th>
            <th className="py-2 px-4">% Funded</th>
            <th className="py-2 px-4">Amount Raised</th>
            </tr>
        </thead>

        {/* Table Body */}
        <tbody className="font-satoshi-regular text-md">
            {data.map((donation, index) => (
                <tr
                key={index}
                className="hover:bg-gray-100 cursor-pointer"
                // onClick={() => navigate(`/admin/records/${donation.donation_id}`)}
                >
                <td className="py-3 px-4 flex items-center gap-2 font-satoshi-bold">{donation.title}</td>
                <td className="py-3 px-4">{donation.date_created}</td>
                <td className="py-3 px-4">{donation.donationCount}</td>
                <td className="py-3 px-4">{donation.percentFunded}</td>
                <td className="py-3 px-4">{donation.amountRaised}</td>
            </tr>
            ))}
        </tbody>
    </table>
  )
}

export default DonationsTable
