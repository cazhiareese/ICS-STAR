import React from 'react';
import { useNavigate } from 'react-router-dom';

function DonationsTable({ data, loading = false }) {
  const navigate = useNavigate();
  const rowsPerPage = 10;

  const renderRows = () => {
    const dataRows = data.slice(0, rowsPerPage).map((donation, index) => (
      <tr
        key={`data-${index}`}
        className="hover:bg-secondary cursor-pointer border-b border-gray-200"
        style={{ minHeight: '48px' }}
        onClick={() => navigate(`/admin/donations/${donation.drive_id}`)}
      >
        <td className="py-3 px-4 flex items-center gap-2 font-satoshi-bold">
          {donation.title || 'N/A'}
        </td>
        <td className="py-3 px-4">{donation.created_at || 'N/A'}</td>
        <td className="py-3 px-4">{donation.donation_count || 'N/A'}</td>
        <td className="py-3 px-4">{donation.percent_funded || 'N/A'}</td>
        <td className="py-3 px-4">{donation.amount_raised || 'N/A'}</td>
      </tr>
    ));

    const emptyRows = Array.from({ length: rowsPerPage - dataRows.length }).map((_, index) => (
      <tr
        key={`empty-${index}`}
        className="border-b border-gray-200"
        style={{ minHeight: '48px' }}
      >
        <td className="py-3 px-4 flex items-center gap-2 font-satoshi-bold"></td>
        <td className="py-3 px-4">&nbsp;</td>
        <td className="py-3 px-4"></td>
        <td className="py-3 px-4"></td>
        <td className="py-3 px-4"></td>
      </tr>
    ));

    return [...dataRows, ...emptyRows];
  };

  return (
    <table className="w-full table-fixed">
      <thead>
        <tr className="text-left text-sm text-primary font-satoshi-bold border-b border-gray-200 h-1">
          <th className="py-2 px-4 w-2/10">Donation Title</th>
          <th className="py-2 px-4 w-1/10">Date Created</th>
          <th className="py-2 px-4 w-1/10">Donation Count</th>
          <th className="py-2 px-4 w-1/10">% Funded</th>
          <th className="py-2 px-4 w-1/10">Amount Raised</th>
        </tr>
      </thead>
      <tbody className="font-satoshi-regular text-md">
        {loading
          ? Array.from({ length: rowsPerPage }).map((_, index) => (
              <tr
                key={`skeleton-${index}`}
                className="border-b border-gray-200"
                style={{ minHeight: '48px' }}
              >
                <td className="py-3 px-4">
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4"></div>
                </td>
                <td className="py-3 px-4">
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-2/3"></div>
                </td>
                <td className="py-3 px-4">
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2"></div>
                </td>
                <td className="py-3 px-4">
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2"></div>
                </td>
                <td className="py-3 px-4">
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-2/3"></div>
                </td>
              </tr>
            ))
          : renderRows()}
      </tbody>
    </table>
  );
}

export default DonationsTable;