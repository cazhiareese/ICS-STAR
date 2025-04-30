import React from 'react';
import { useNavigate } from 'react-router-dom';

function PendingUsersTable({ pendingUsers = [], loading = false }) {
  const navigate = useNavigate();

  const rowsToRender = loading ? Array.from({ length: 10 }) : [...pendingUsers];
  const emptyRows = loading ? 0 : Math.max(0, 10 - pendingUsers.length);

  // Define fixed column widths
  const columnWidths = {
    col1: '5%',  // Empty (for image placeholder)
    col2: '20%', // Name
    col3: '20%', // Email
    col4: '15%', // Student Number
    col5: '25%', // Graduating Class
    col6: '15%', // Date of Registration
  };

  return (
    <table className="w-full table-fixed">
      {/* Table Header */}
      <thead>
        <tr className="text-left text-xs text-primary font-satoshi-regular">
          <th className="py-2 px-4" style={{ width: columnWidths.col1 }}></th>
          <th className="py-2 px-4" style={{ width: columnWidths.col2 }}>NAME</th>
          <th className="py-2 px-4" style={{ width: columnWidths.col3 }}>EMAIL</th>
          <th className="py-2 px-4" style={{ width: columnWidths.col4 }}>STUDENT NUMBER</th>
          <th className="py-2 px-4" style={{ width: columnWidths.col5 }}>GRADUATING CLASS</th>
          <th className="py-2 px-4" style={{ width: columnWidths.col6 }}>DATE OF REGISTRATION</th>
        </tr>
      </thead>

      {/* Table Body */}
      <tbody className="font-satoshi-regular text-md">
        {loading ? (
          // Skeleton Rows (10 rows)
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
            </tr>
          ))
        ) : (
          <>
            {/* Actual Data */}
            {rowsToRender.map((user, index) => (
              <tr
                key={user.user_id || `data-${index}`}
                className="border-b border-gray-200 h-10 hover:bg-gray-100 cursor-pointer"
                onClick={() => navigate(`/admin/records/verification-confirmation/${user.user_id}`)}
              >
                <td className="py-3 px-4" style={{ width: columnWidths.col1 }}></td>
                <td className="py-3 px-4 flex items-center gap-2 font-satoshi-bold whitespace-nowrap" style={{ width: columnWidths.col2 }}>
                  {user.name}
                </td>
                <td className="py-3 px-4 whitespace-nowrap overflow-hidden text-ellipsis" style={{ width: columnWidths.col3 }}>
                  {user.email}
                </td>
                <td className="py-3 px-4 whitespace-nowrap overflow-hidden text-ellipsis" style={{ width: columnWidths.col4 }}>
                  {user.student_number}
                </td>
                <td className="py-3 px-4 whitespace-nowrap overflow-hidden text-ellipsis" style={{ width: columnWidths.col5 }}>
                  {user.grad_class}
                </td>
                <td className="py-3 px-4 whitespace-nowrap overflow-hidden text-ellipsis" style={{ width: columnWidths.col6 }}>
                  {user.date_of_reg}
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
              </tr>
            ))}
          </>
        )}
      </tbody>
    </table>
  );
}

export default PendingUsersTable;