import React from 'react';
import { useNavigate } from 'react-router-dom';

function InsightsDonationsTable({ data, loading = false }) {
  // const navigate = useNavigate();
  const rowsPerPage = 10; // Fixed number of rows per page

  // Generate rows (data + empty) to reach rowsPerPage
  const renderRows = () => {
    const dataCount = Math.min(data.length, rowsPerPage);

    // Data rows
    const dataRows = data.slice(0, rowsPerPage).map((donation, index) => (
      <tr
        key={`data-${index}`}
        className="hover:bg-secondary cursor-pointer border-b border-gray-200"
        // onClick={() => navigate(`/admin/donations/${donation.drive_id}`)}
        style={{ minHeight: '48px' }}
      >
        <td className="py-3 px-4 flex items-center gap-2 font-satoshi-bold">
          {donation['Date Donated'] || 'N/A'}
        </td>
        <td className="py-3 px-4">{donation['Donation Drive'] || 'N/A'}</td>
        <td className="py-3 px-4">{donation['Name'] || 'N/A'}</td>
        <td className="py-3 px-4">{donation['Donation Type'] || 'N/A'}</td>
        <td className="py-3 px-4">{donation['Donation Details'] || 'N/A'}</td>
      </tr>
    ));

    // Empty rows to fill up to rowsPerPage
    const emptyRows = Array.from({ length: rowsPerPage - dataCount }).map((_, index) => (
      <tr
        key={`empty-${index}`}
        className="border-b border-gray-300"
        style={{ minHeight: '48px' }}
      >
        <td className="py-3 px-4 flex items-center gap-2 font-satoshi-bold">N/A</td>
        <td className="py-3 px-4">N/A</td>
        <td className="py-3 px-4">N/A</td>
        <td className="py-3 px-4">N/A</td>
        <td className="py-3 px-4">N/A</td>
      </tr>
    ));

    return [...dataRows, ...emptyRows];
  };

  return (
    <table className="w-full table-fixed">
      {/* Table Header */}
      <thead>
        <tr className="text-left text-xs text-primary font-satoshi-regular">
          <th className="py-2 px-4 w-1/10">Date Donated</th>
          <th className="py-2 px-4 w-3/10">Donation Drive</th>
          <th className="py-2 px-4 w-2/10">Name</th>
          <th className="py-2 px-4 w-2/10">Donation Type</th>
          <th className="py-2 px-4 w-2/10">Donation Details</th>
        </tr>
      </thead>

      {/* Table Body */}
      <tbody className="font-satoshi-regular text-md">
        {loading
          ? // Skeleton Rows (always 10)
            Array.from({ length: rowsPerPage }).map((_, index) => (
              <tr
                key={`skeleton-${index}`}
                className="border-b border-gray-200"
                style={{ minHeight: '48px' }}
              >
                <td className="py-3 px-4">
                  <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4"></div>
                </td>
                <td className="py-3 px-4">
                  <div className="h-5 bg-gray-200 rounded animate-pulse w-2/3"></div>
                </td>
                <td className="py-3 px-4">
                  <div className="h-5 bg-gray-200 rounded animate-pulse w-1/2"></div>
                </td>
                <td className="py-3 px-4">
                  <div className="h-5 bg-gray-200 rounded animate-pulse w-full"></div>
                </td>
                <td className="py-3 px-4">
                  <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4"></div>
                </td>
              </tr>
            ))
          : // Data + Empty Rows
            renderRows()}
      </tbody>
    </table>
  );
}

export default InsightsDonationsTable;