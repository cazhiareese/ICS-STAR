import React from 'react';
import { useNavigate } from 'react-router-dom';

function DonationsTable({ data, loading = false }) {
  const navigate = useNavigate();

  // Define the number of skeleton rows (matches max rows of 10)
  const skeletonRows = Array.from({ length: 10 });

  return (
    <table className="w-full">
      {/* Table Header */}
      <thead>
        <tr className="text-left text-sm text-primary font-satoshi-bold border-b border-gray-200 h-10">
          <th className="py-2 px-4">Donation Title</th>
          <th className="py-2 px-4">Date Created</th>
          <th className="py-2 px-4">Donation Count</th>
          <th className="py-2 px-4">% Funded</th>
          <th className="py-2 px-4">Amount Raised</th>
        </tr>
      </thead>

      {/* Table Body */}
      <tbody className="font-satoshi-regular text-md">
        {loading ? (
          // Skeleton Rows
          skeletonRows.map((_, index) => (
            <tr key={`skeleton-${index}`} className="hover:bg-secondary cursor-pointer">
              <td className="py-3 px-4">
                <div className="h-6 bg-gray-200 rounded animate-pulse w-48"></div>
              </td>
              <td className="py-3 px-4">
                <div className="h-6 bg-gray-200 rounded animate-pulse w-24"></div>
              </td>
              <td className="py-3 px-4">
                <div className="h-6 bg-gray-200 rounded animate-pulse w-16"></div>
              </td>
              <td className="py-3 px-4">
                <div className="h-6 bg-gray-200 rounded animate-pulse w-16"></div>
              </td>
              <td className="py-3 px-4">
                <div className="h-6 bg-gray-200 rounded animate-pulse w-20"></div>
              </td>
            </tr>
          ))
        ) : (
          // Actual Data
          data.map((donation, index) => (
            <tr
              key={index}
              className="hover:bg-secondary cursor-pointer border-b border-gray-200 h-10 text-sm"
              onClick={() => navigate(`/admin/donations/${donation.drive_id}`)}
            >
              <td className="py-3 px-4 flex items-center gap-2 font-satoshi-regular">{donation.title}</td>
              <td className="py-3 px-4">{donation.created_at}</td>
              <td className="py-3 px-4">{donation.donation_count}</td>
              <td className="py-3 px-4">{donation.percent_funded}</td>
              <td className="py-3 px-4">{donation.amount_raised}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

export default DonationsTable;