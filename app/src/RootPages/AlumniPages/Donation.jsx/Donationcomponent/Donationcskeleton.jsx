import React from 'react';

export default function DonationCSkeleton() {
  return (
    <div className="w-[115%] sm:w-[115%] md:w-[115%] md:mt-0 my-10 max-w-sm h-100 rounded-2xl p-6 font-satoshi px-10 border border-disabled animate-pulse">

      {/* Top Row: Percentage Funded and Status Pill */}
      <div className="flex items-center justify-center w-30 h-10 mt-2 font-satoshi-black bg-gray-300 text-gray-500 text-md rounded-full px-5 ml-auto">
        <div className="h-4 bg-gray-300 w-[60%] rounded-full"></div>
      </div>

      {/* Fund Percentage Skeleton */}
      <div className="flex justify-between items-center mb-2 pt-5">
        <div className="h-6 bg-gray-300 w-[40%] rounded-lg"></div>
      </div>

      {/* Raised Amount Skeleton */}
      <p className="font-medium text-gray-500 font-satoshi-light">
        <span className="block h-4 bg-gray-300 w-[70%] rounded-lg mb-2"></span>
      </p>

      {/* Progress Bar Skeleton */}
      <div className="relative my-2 h-2 bg-gray-200 rounded font-satoshi-light w-full">
        <div className="h-full bg-gray-300 rounded-full w-[100%]" />
      </div>

      {/* Donation Count Skeleton */}
      <p className="text-sm text-gray-500 mb-4 ml-auto w-25">
        <span className="block h-4 bg-gray-300 w-[40%] rounded-lg"></span>
      </p>

      {/* Info Section Skeleton */}
      <div className="flex items-start gap-2 mb-10 mt-7">
        <div className="w-6 h-6 bg-gray-300 rounded-full flex justify-center items-center">
          <span className="h-4 bg-gray-300 w-3/4 rounded-full"></span>
        </div>
        <p className="text-sm text-gray-500">
          <span className="block h-4 bg-gray-300 w-[80%] rounded-lg"></span>
        </p>
      </div>

      {/* Donation Button Skeleton */}
      <button className="w-full bg-gray-300 text-white text-base py-3 rounded-lg cursor-default">
        <span className="block h-4 bg-gray-300 w-[80%] rounded-lg mx-auto"></span>
      </button>
    </div>
  );
}
