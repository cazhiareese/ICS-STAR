import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Flag } from 'lucide-react';

function UsersTable({ data, loading = null }) {
  const navigate = useNavigate();

  // Ensure we always render 10 rows (data + empty rows if needed)
  const rowsToRender = loading ? Array.from({ length: 10 }) : [...data];
  const emptyRows = loading ? 0 : Math.max(0, 10 - data.length); // Calculate empty rows needed

  // Define column widths
  const columnWidths = {
    col1: '2%',  // Empty
    col2: '20%', // Name
    col3: '10%', // Batch
    col4: '25%', // Base Location
    col5: '22%', // Job Title
    col6: '15%', // Last Update
    col7: '6%', // Status
  };

  return (
    <table className="w-full h-full table-fixed">
      {/* Table Header */}
      <thead>
        <tr className="text-left text-xs text-primary font-satoshi-regular">
          <th className="py-2 px-4" style={{ width: columnWidths.col1 }}></th>
          <th className="py-2 px-4" style={{ width: columnWidths.col2 }}>NAME</th>
          <th className="py-2 px-4" style={{ width: columnWidths.col3 }}>BATCH</th>
          <th className="py-2 px-4" style={{ width: columnWidths.col4 }}>BASE LOCATION</th>
          <th className="py-2 px-4" style={{ width: columnWidths.col5 }}>JOB TITLE</th>
          <th className="py-2 px-4" style={{ width: columnWidths.col6 }}>LAST UPDATE</th>
          <th className="py-2 px-4" style={{ width: columnWidths.col7 }}></th>
        </tr>
      </thead>

      {/* Table Body */}
      <tbody className="font-satoshi-regular text-md">
        {loading ? (
          // Skeleton Rows (10 rows for pagination)
          rowsToRender.map((_, index) => (
            <tr key={`skeleton-${index}`} className="border-b border-gray-200 h-10">
              <td className="py-3 px-4" style={{ width: columnWidths.col1 }}></td>
              <td className="py-3 px-4 whitespace-nowrap overflow-hidden text-ellipsis" style={{ width: columnWidths.col2 }}>
                <div className="h-6 bg-gray-200 rounded animate-pulse w-full"></div>
              </td>
              <td className="py-3 px-4 whitespace-nowrap overflow-hidden text-ellipsis" style={{ width: columnWidths.col3 }}>
                <div className="h-6 bg-gray-200 rounded animate-pulse w-full"></div>
              </td>
              <td className="py-3 px-4 whitespace-nowrap overflow-hidden text-ellipsis" style={{ width: columnWidths.col4 }}>
                <div className="h-6 bg-gray-200 rounded animate-pulse w-full"></div>
              </td>
              <td className="py-3 px-4 whitespace-nowrap overflow-hidden text-ellipsis" style={{ width: columnWidths.col5 }}>
                <div className="h-6 bg-gray-200 rounded animate-pulse w-full"></div>
              </td>
              <td className="py-3 px-4 whitespace-nowrap overflow-hidden text-ellipsis" style={{ width: columnWidths.col6 }}>
                <div className="h-6 bg-gray-200 rounded animate-pulse w-full"></div>
              </td>
              <td className="py-3 px-4 whitespace-nowrap overflow-hidden text-ellipsis" style={{ width: columnWidths.col7 }}>
                <div className="h-6 bg-gray-200 rounded animate-pulse w-full"></div>
              </td>
            </tr>
          ))
        ) : (
          <>
            {/* Actual Data */}
            {rowsToRender.map((user, index) => (
              <tr
                key={user.user_id || `data-${index}`}
                className="border-b border-gray-200 h-10 hover:bg-secondary cursor-pointer"
                onClick={() => navigate(`/admin/records/${user.user_id}`)}
              >
                <td className="py-3 px-4" style={{ width: columnWidths.col1 }}></td>
                <td className="py-3 px-4 flex items-center gap-2 font-satoshi-bold whitespace-nowrap text-ellipsis" style={{ width: columnWidths.col2 }}>
                  {user.name}
                </td>
                <td className="py-3 px-4 whitespace-nowrap text-ellipsis" style={{ width: columnWidths.col3 }}>
                  {user.batch}
                </td>
                <td className="py-3 px-4 whitespace-nowrap overflow-hidden text-ellipsis" style={{ width: columnWidths.col4 }}>
                  {user.location_base}
                </td>
                <td className="py-3 px-4 whitespace-nowrap overflow-hidden text-ellipsis" style={{ width: columnWidths.col5 }}>
                  {user.job_title}
                </td>
                <td className="py-3 px-4 whitespace-nowrap overflow-hidden text-ellipsis" style={{ width: columnWidths.col6 }}>
                  {user.last_updated}
                </td>
                <td className="py-3 px-4 whitespace-nowrap overflow-hidden text-ellipsis" style={{ width: columnWidths.col7 }}>
                  {user.is_reported && (
                      <Flag className='text-error'/>
                  )}
                </td>
              </tr>
            ))}
            {/* Empty Rows to Fill Up to 10 */}
            {Array.from({ length: emptyRows }).map((_, index) => (
              <tr key={`empty-${index}`} className="border-b border-gray-200 h-10">
                <td className="py-3 px-4" style={{ width: columnWidths.col1 }}></td>
                <td className="py-3 px-4" style={{ width: columnWidths.col2 }}></td>
                <td className="py-3 px-4" style={{ width: columnWidths.col3 }}></td>
                <td className="py-3 px-4" style={{ width: columnWidths.col4 }}></td>
                <td className="py-3 px-4" style={{ width: columnWidths.col5 }}></td>
                <td className="py-3 px-4" style={{ width: columnWidths.col6 }}></td>
                <td className="py-3 px-4" style={{ width: columnWidths.col7 }}></td>
              </tr>
            ))}
          </>
        )}
      </tbody>
    </table>
  );
}

export default UsersTable;