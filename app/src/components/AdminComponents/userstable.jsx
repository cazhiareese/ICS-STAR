import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, UserCircle2 } from 'lucide-react';

function UsersTable({ data, loading = null, userType }) {
  const navigate = useNavigate();

  // Ensure we always render 10 rows (data + empty rows if needed)
  const rowsToRender = loading ? Array.from({ length: 10 }) : [...data];
  const emptyRows = loading ? 0 : Math.max(0, 10 - data.length); // Calculate empty rows needed

  const columnWidths = {
    col1: '5%',  // Empty
    col2: '20%', // Name
    col3: '8%',  // Batch
    col4: '25%', // Base Location && student number
    col5: '15%', // Job Title && graduating class
    col6: '10%', // Last Update
    col7: '5%',  // Status
  };

  return (
    <table className="w-full table-fixed">
      {/* Table Header */}
      <thead>
        <tr className="text-left text-xs text-primary font-satoshi-regular">
          <th className="py-2 px-4" style={{ width: columnWidths.col1 }}></th>
          <th className="py-2 px-4" style={{ width: columnWidths.col2 }}>NAME</th>
          <th className="py-2 px-4" style={{ width: columnWidths.col3 }}>BATCH</th>
          <th className="py-2 px-4" style={{ width: columnWidths.col4 }}>{userType === 'alum' ? 'BASE LOCATION' : 'STUDENT NUMBER'}</th>
          <th className="py-2 px-4" style={{ width: columnWidths.col5 }}>{userType === 'alum' ? 'JOB TITLE' : 'GRADUATING CLASS'}</th>
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
              {/* Image */}
              <td className="py-3 px-4" style={{ width: columnWidths.col1 }}>
                <div className="rounded-full h-8 w-8 bg-gray-200 animate-pulse"></div>
              </td>
              {/* Name */}
              <td className="py-3 px-4 gap-2 font-satoshi-bold" style={{ width: columnWidths.col2 }}>
                <div className="flex flex-row items-center gap-2">
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4"></div>
                </div>
              </td>
              {/* Batch */}
              <td className="py-3 px-4 whitespace-nowrap overflow-hidden text-ellipsis" style={{ width: columnWidths.col3 }}>
                <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2"></div>
              </td>
              {/* Base Location */}
              <td className="py-3 px-4 whitespace-nowrap overflow-hidden text-ellipsis" style={{ width: columnWidths.col4 }}>
                <div className="h-6 bg-gray-200 rounded animate-pulse w-5/6"></div>
              </td>
              {/* Job Title */}
              <td className="py-3 px-4 whitespace-nowrap overflow-hidden text-ellipsis" style={{ width: columnWidths.col5 }}>
                <div className="h-6 bg-gray-200 rounded animate-pulse w-2/3"></div>
              </td>
              {/* Last Update */}
              <td className="py-3 px-4 whitespace-nowrap overflow-hidden text-ellipsis" style={{ width: columnWidths.col6 }}>
                <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4"></div>
              </td>
              {/* Status */}
              <td className="py-3 px-4 whitespace-nowrap overflow-hidden text-ellipsis" style={{ width: columnWidths.col7 }}>
                <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2"></div>
              </td>
            </tr>
          ))
        ) : (
          <>
            {/* Actual Data */}
            {rowsToRender.map((user) => (
              <tr
                key={user.user_id}
                className="border-b border-gray-200 h-10 hover:bg-secondary cursor-pointer"
                onClick={() => navigate(`/admin/records/${user.user_id}`)}
              >
                {/* Image */}
                <td className="py-3 px-4" style={{ width: columnWidths.col1 }}>
                  {user.image == null ? (
                    <UserCircle2 className='h-8 w-8 stroke-2'/>
                  ) : (
                    <img
                    src={user.image}
                    alt=""
                    className="rounded-full h-8 w-8 not-last:overflow-hidden object-cover"
                    />
                  )}
                </td>
                {/* Name */}
                <td className="py-3 px-4 gap-2 font-satoshi-bold" style={{ width: columnWidths.col2 }}>
                  <div className="flex flex-row items-center gap-2">
                    <span className="">{user.name}</span>
                    {user.is_reported && (
                      <ShieldAlert size={16} className="text-error flex-shrink-0" />
                    )}
                  </div>
                </td>
                {/* Batch */}
                <td className="py-3 px-4 whitespace-nowrap text-ellipsis" style={{ width: columnWidths.col3 }}>
                  {user.batch}
                </td>
                {/* Base Location && Student Number */}
                <td className="py-3 px-4 whitespace-nowrap overflow-hidden text-ellipsis" style={{ width: columnWidths.col4 }}>
                  {userType === 'alum' ? user.location_base : user.student_number}
                </td>
                {/* Job Title && Graduating Class*/}
                <td className="py-3 px-4 whitespace-nowrap overflow-hidden text-ellipsis" style={{ width: columnWidths.col5 }}>
                  {userType === 'alum' ? user.job_title : user.standing}
                </td>
                {/* Last Update */}
                <td className="py-3 px-4 whitespace-nowrap overflow-hidden text-ellipsis" style={{ width: columnWidths.col6 }}>
                  {user.last_updated}
                </td>
                {/* Is Inactive */}
                <td className="py-3 px-4 whitespace-nowrap overflow-hidden text-ellipsis" style={{ width: columnWidths.col7 }}>
                  {user.is_inactive && <p>inactive</p>}
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