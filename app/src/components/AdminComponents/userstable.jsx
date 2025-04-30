import React from 'react';
import { useNavigate } from 'react-router-dom';

function UsersTable({ data, loading=null }) {
  const navigate = useNavigate();

  return (
    <table className="w-full h-full">
      {/* Table Header */}
      <thead>
        <tr className="text-left text-xs text-primary font-satoshi-regular">
          <th className="py-2 px-4"></th>
          <th className="py-2 px-4">NAME</th>
          <th className="py-2 px-4">BATCH</th>
          <th className="py-2 px-4">BASE LOCATION</th>
          <th className="py-2 px-4">JOB TITLE</th>
          <th className="py-2 px-4">LAST UPDATE</th>
          <th className="py-2 px-4"></th>
        </tr>
      </thead>

      {/* Table Body */}
      <tbody className="font-satoshi-regular text-md">
        {loading ? (
          // Skeleton Rows
          Array.from({ length: 8 }).map((_, index) => (
            <tr key={`skeleton-${index}`} className="border-b border-gray-200">
              <td className="py-3 px-4"></td>
              <td className="py-3 px-4">
                <div className="h-5 bg-gray-200 rounded animate-pulse w-1/2"></div>
              </td>
              <td className="py-3 px-4">
                <div className="h-5 bg-gray-200 rounded animate-pulse w-1/4"></div>
              </td>
              <td className="py-3 px-4">
                <div className="h-5 bg-gray-200 rounded animate-pulse w-1/3"></div>
              </td>
              <td className="py-3 px-4">
                <div className="h-5 bg-gray-200 rounded animate-pulse w-2/3"></div>
              </td>
              <td className="py-3 px-4">
                <div className="h-5 bg-gray-200 rounded animate-pulse w-1/3"></div>
              </td>
              <td className="py-3 px-4">
                <div className="h-5 bg-gray-200 rounded animate-pulse w-1/4"></div>
              </td>
              <td className="py-3 px-4">
                <div className="h-5 bg-gray-200 rounded animate-pulse w-1/4"></div>
              </td>
              <td className="py-3 px-4">
                <div className="h-5 bg-gray-200 rounded animate-pulse w-1/4"></div>
              </td>
              <td className="py-3 px-4">
                <div className="h-5 bg-gray-200 rounded animate-pulse w-1/4"></div>
              </td>
            </tr>
          ))
        ) : (
          // Actual Data
          data.map((user, index) => (
            <tr
              key={index}
              className="hover:bg-secondary cursor-pointer"
              onClick={() => navigate(`/admin/records/${user.user_id}`)}
            >
              <td></td>
              <td className="py-3 px-4 flex items-center gap-2 font-satoshi-bold">{user.name}</td>
              <td className="py-3 px-4">{user.batch}</td>
              <td className="py-3 px-4">{user.location_base}</td>
              <td className="py-3 px-4">{user.job_title}</td>
              <td className="py-3 px-4">{user.last_updated}</td>
              <td>
                {user.status && (
                  <span className="bg-gray-200 px-4 py-1 rounded-2xl text-black font-satoshi-bold text-sm">
                    {user.status}
                  </span>
                )}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

export default UsersTable;