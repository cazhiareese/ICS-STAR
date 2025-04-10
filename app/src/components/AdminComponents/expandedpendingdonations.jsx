import React from 'react'
import { useNavigate } from 'react-router-dom'

function ExpandedPendingDonations({ data }) {

  return (
    <table className="w-full ">
        {/* Table Header */}
        <thead>
            <tr className="text-left text-xs text-primary font-satoshi-regular">
            <th className="py-2 px-4">Date and time</th>
            <th className="py-2 px-4">Donor</th>
            <th className="py-2 px-4">Donation Type</th>
            <th className="py-2 px-4">Amount/Description</th>
            <th className="py-2 px-4">Verify</th>
            </tr>
        </thead>

        {/* Table Body */}
        <tbody className="font-satoshi-regular text-sm">
            {data.map((donation, index) => (
                <tr
                key={index}
                className="hover:bg-secondary cursor-pointer"
                // onClick={() => navigate(`/admin/donations/${donation.donation_id}`)}
                >
                <td className="py-3 px-4 flex items-center">{donation.date_donated}</td>
                <td className="py-3 px-4">{donation.name}</td>
                <td className="py-3 px-4">{donation.donation_type}</td>
                <td className="py-3 px-4">{donation.donation_amount}</td>
                <td className="py-3 px-4">
                    <button className='w-full h-full py-1 rounded-2xl bg-primary cursor-pointer hover:bg-hover'>
                        <p className='font-satoshi-regular text-white text-lg'>Review</p>
                    </button>
                </td>
            </tr>
            ))}
        </tbody>
    </table>
  )
}

export default ExpandedPendingDonations
