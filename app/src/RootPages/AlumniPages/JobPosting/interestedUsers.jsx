import React from "react";
import { useParams, useNavigate } from "react-router-dom";

function InterestedUsers() {
  const id = useParams();
  console.log(id);
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 py-3 border-b border-gray-200 bg-white rounded-t-2xl">
      <div>
        <h1 className="text-xl sm:text-2xl font-satoshi-bold text-gray-800">Interested Users</h1>
        <p className="text-sm text-gray-500 mt-1 sm:mt-0">
          View the list of users who have shown interest in this donation drive.
        </p>
      </div>
      <div className="mt-3 sm:mt-0">
        {/* Future space for actions like filters or buttons */}
        <button className="bg-primary text-white px-4 py-2 rounded-full text-sm hover:bg-hover transition">
          Export List
        </button>
      </div>
    </div>
  );
}

export default InterestedUsers;
