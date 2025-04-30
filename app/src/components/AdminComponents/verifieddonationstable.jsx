import React from 'react'

function VerifiedDonationsTable({ data, loading }) {

  return (
    <table className="w-full">
        {/* Table Header */}
        <thead>
            <tr className="text-left text-xs text-primary font-satoshi-regular">
            <th className="py-2 px-4">Date Donated</th>
            <th className="py-2 px-4">Name</th>
            <th className="py-2 px-4">Donation Type</th>
            <th className="py-2 px-4">Donation Details</th>
            </tr>
        </thead>

        {/* Table Body */}
        <tbody className="font-satoshi-regular text-md">
          {loading ? (
            // Skeleton Rows
            Array.from({ length: 8 }).map((_, index) => (
              <tr key={`skeleton-${index}`} className="border-b border-gray-200">
                <td className="py-3 px-4">
                  <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4"></div>
                </td>
                <td className="py-3 px-4">
                  <div className="h-5 bg-gray-200 rounded animate-pulse w-1/2"></div>
                </td>
                <td className="py-3 px-4">
                  <div className="h-5 bg-gray-200 rounded animate-pulse w-1/3"></div>
                </td>
                <td className="py-3 px-4">
                  <div className="h-5 bg-gray-200 rounded animate-pulse w-2/3"></div>
                </td>
              </tr>
            ))
          ) : (
            // Actual Data
            data.map((donation, index) => (
              <tr key={index} className="hover:bg-secondary cursor-pointer">
                <td className="py-3 px-4 flex items-center">{donation.date_donated}</td>
                <td className="py-3 px-4">{donation.name}</td>
                <td className="py-3 px-4">{donation.donation_type}</td>
                <td className="py-3 px-4">{donation.donation_details}</td>
              </tr>
            ))
          )}
        </tbody>
    </table>
  )
}

export default VerifiedDonationsTable
