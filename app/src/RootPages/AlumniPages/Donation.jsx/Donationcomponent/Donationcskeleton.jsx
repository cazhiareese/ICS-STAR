import React from 'react';

export default function DonationCSkeleton() {
  return (
    <div className="md:w-[115%] md:mt-0 my-10 max-w-sm  h-100  rounded-2xl p-4 font-sans px-10 bg-disabled animate-pulse">

      {/* Top Row: Percentage Funded and Status Pill */}
      <div className="flex items-center justify-center w-30 h-10 mt-2 font-satoshi-black bg-gray-400 text-gray-600 text-md rounded-full px-5 ml-auto">
        <div className="h-4 bg-gray-400 animate-pulse w-[60%] rounded-full"></div>
      </div>

      {/* Fund Percentage Skeleton */}
      <div className="flex justify-between items-center mb-2 pt-5">
        <div className="h-6 bg-gray-400 animate-pulse w-[40%] rounded-lg"></div>
      </div>

      {/* Raised Amount Skeleton */}
      <p className="font-medium text-primary font-satoshi-light">
        <div className="h-4 bg-gray-400 animate-pulse w-[70%] rounded-lg mb-2"></div>
      </p>

      {/* Progress Bar Skeleton */}
      <div className="relative my-2 h-2 bg-gray-200 rounded font-satoshi-light w-full">
        <div className="h-full bg-gray-400 animate-pulse rounded-full w-[100%]" />
      </div>

      {/* Donation Count Skeleton */}
      <p className="text-sm text-primary mb-4 ml-auto w-25">
        <div className="h-4 bg-gray-400 animate-pulse w-[40%] rounded-lg"></div>
      </p>

      {/* Info Section Skeleton */}
      <div className="flex items-start gap-2 mb-10 mt-7">
        <div className="w-6 h-6 bg-gray-400 rounded-full flex justify-center items-center font-bold cursor-pointer">
          <div className="h-4 bg-gray-400 animate-pulse w-3/4 rounded-full"></div>
        </div>
        <p className="text-sm text-gray-600">
          <div className="h-4 bg-gray-400 animate-pulse w-[80%] rounded-lg"></div>
        </p>
      </div>

      {/* Donation Button Skeleton */}
      <button className="w-full bg-gray-400 text-white text-base py-3 rounded-lg cursor-pointer">
        <div className="h-4 bg-gray-400 animate-pulse w-[80%] rounded-lg mx-auto"></div>
      </button>
    </div>
  );
}
