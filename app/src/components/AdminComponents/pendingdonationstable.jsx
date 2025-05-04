import React from 'react';

function PendingDonationsTable({ data, loading = false }) {

  // Define the number of skeleton rows (matches page_size from fetchNextPendingPage)
  const skeletonRows = Array.from({ length: 5 });

  return (
    <table className="w-full">
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
        {loading ? (
          // Skeleton Rows
          skeletonRows.map((_, index) => (
            <tr key={`skeleton-${index}`} className="hover:bg-secondary cursor-pointer">
              <td className="py-2 px-4">
                <div className="h-5 bg-gray-200 rounded animate-pulse w-24"></div>
              </td>
              <td className="py-2 px-4">
                <div className="h-5 bg-gray-200 rounded animate-pulse w-32"></div>
              </td>
              <td className="py-2 px-4">
                <div className="h-5 bg-gray-200 rounded animate-pulse w-40"></div>
              </td>
            </tr>
          ))
        ) : (
          // Actual Data
          data.map((donation, index) => (
            <tr
              key={index}
              className="hover:bg-secondary cursor-pointer"
              // onClick={() => navigate(`/admin/donations/${donation.donation_id}`)}
            >
              <td className="py-2 px-4 flex items-center">{donation.donation_date}</td>
              <td className="py-2 px-4">{donation.name}</td>
              <td className="py-2 px-4">{donation.donation_details}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

export default PendingDonationsTable;