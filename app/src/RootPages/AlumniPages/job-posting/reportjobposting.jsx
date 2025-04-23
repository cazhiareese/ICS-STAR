// ReportJobPosting.jsx
import React from "react";

const ReportJobPosting = () => {
  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-2xl">
      <h2 className="text-xl font-bold mb-4">Report Job Posting</h2>
      <p className="text-sm text-gray-600 mb-2">
        If you believe this job posting violates our guidelines, please report it.
      </p>
      <textarea
        className="w-full p-2 border border-gray-300 rounded-md mb-4"
        placeholder="Explain the issue..."
        rows={4}
        disabled
      />
      <button className="bg-red-500 text-white px-4 py-2 rounded-lg cursor-not-allowed" disabled>
        Submit Report (Demo)
      </button>
    </div>
  );
};

export default ReportJobPosting;
