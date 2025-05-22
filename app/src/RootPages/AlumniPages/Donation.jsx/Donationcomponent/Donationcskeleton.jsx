import React from 'react';

export default function DonationCSkeleton() {
  return (
    <div className="w-full h-110 rounded-2xl m-auto max-w-100 min-w-70 border border-gray-200 shadow-md p-5 animate-pulse">
      {/* Status pill */}
      <div className="flex justify-end mb-4">
        <div className="h-4 bg-gray-300 w-24 rounded-full"></div>
      </div>

      {/* Fund percentage */}
      <div className="h-6 bg-gray-300 w-2/5 rounded-lg mb-3"></div>

      {/* Raised amount */}
      <div className="h-4 bg-gray-300 w-3/4 rounded-lg mb-2"></div>

      {/* Progress bar */}
      <div className="relative my-2 h-2 bg-gray-200 rounded">
        <div className="h-full bg-gray-300 rounded-full w-full" />
      </div>

      {/* Donation count */}
      <div className="h-4 bg-gray-300 w-1/3 rounded-lg mb-4 ml-auto"></div>

      {/* Info row */}
      <div className="flex items-start gap-2 mt-7 mb-10">
        <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
        <div className="h-4 bg-gray-300 w-4/5 rounded-lg"></div>
      </div>

      {/* Donate button */}
      <div className="w-full bg-gray-300 h-10 rounded-lg"></div>
    </div>
  );
}
