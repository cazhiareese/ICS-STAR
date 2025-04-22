import React from "react";

function JobOverviewCard({ overview }) {
  return (
    <div className="bg-white rounded-2xl shadow p-6 mb-6 max-w-[1100px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-satoshi-bold text-gray-800">{overview.title}</h2>
          <p className="text-sm text-gray-500 mt-1">{overview.company}</p>
        </div>
        <div className="mt-3 sm:mt-0 text-sm text-gray-500">
          Posted on <span className="font-satoshi-medium text-gray-700">{overview.created_at}</span>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700 font-satoshi-medium">
        <p><strong>Posted By:</strong> {overview.posted_by}</p>
        <p><strong>Location:</strong> {overview.poster_location || "—"}</p>
        <p><strong>Total Interested:</strong> {overview.total_interested}</p>
      </div>
    </div>
  );
}

export default JobOverviewCard;
