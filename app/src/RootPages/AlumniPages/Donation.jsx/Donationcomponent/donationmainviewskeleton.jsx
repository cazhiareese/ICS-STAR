import React from 'react';

function DonationMainViewSkeleton() {
  return (
    <div className="flex flex-col w-full rounded-2xl items-center overflow-y-auto h-full justify-center p-4">
      
      {/* Image Skeleton */}
      <div className="w-[90%] h-50 max-h-85 border mx-auto rounded-4xl bg-gray-300 animate-pulse"></div>

      {/* Title Skeleton */}
      <div className="lg:w-[95%] w-[90%] pt-15">
        <div className="h-6 bg-gray-300 animate-pulse w-[60%] rounded-lg"></div>
      </div>

      {/* Date Skeleton */}
      <div className="lg:w-[95%] w-[90%] font-satoshi-regular">
        <div className="h-4 bg-gray-300 animate-pulse w-[40%] rounded-lg"></div>
      </div>

      {/* Fund Percentage Skeleton (Monetary) */}
      <div className="flex justify-between items-center mb-2 pt-5 mr-auto pl-3">
        <div className="h-6 bg-gray-300 animate-pulse w-[30%] rounded-lg"></div>
      </div>

      {/* Raised Amount Skeleton */}
      <div className="font-medium text-primary font-satoshi-light mr-auto pl-3">
        <div className="h-4 bg-gray-300 animate-pulse w-[60%] rounded-lg"></div>
      </div>

      {/* Progress Bar Skeleton */}
      <div className="relative my-2 h-2 bg-gray-200 rounded font-satoshi-light w-full">
        <div className="h-full bg-gray-300 animate-pulse rounded-full w-[100%]" />
      </div>

      {/* Donation Count Skeleton */}
      <div className="text-sm text-primary mb-4 ml-auto w-25">
        <div className="h-4 bg-gray-300 animate-pulse w-[40%] rounded-lg"></div>
      </div>

      {/* Description Skeleton */}
      <div className="lg:w-[95%] w-[90%] pt-5 font-satoshi-light text-gray-400">
        <div className="h-4 bg-gray-300 animate-pulse w-[20%] rounded-lg"></div>
      </div>

      <div className="flex flex-wrap lg:w-[95%] w-[90%] pt-2 text-black font-satoshi-regular">
        <div className="h-4 bg-gray-300 animate-pulse w-[80%] rounded-lg mb-2"></div>
        <div className="h-4 bg-gray-300 animate-pulse w-[90%] rounded-lg"></div>
      </div>

      {/* Relevant Links Skeleton */}
      <div className="lg:w-[95%] w-[90%] font-satoshi-bold pt-10">
        <div className="h-4 bg-gray-300 animate-pulse w-[30%] rounded-lg"></div>
      </div>

      {/* Links List Skeleton */}
      <div className="w-[80%] border border-gray-300 mb-5">
        <div className="h-6 bg-gray-300 animate-pulse w-[50%] rounded-lg"></div>
        <div className="h-6 bg-gray-300 animate-pulse w-[50%] rounded-lg mt-2"></div>
      </div>

      {/* If no links */}
      <div className="flex space-y-3 items-center flex-col mx-auto lg:w-[60%] md:60 font-satoshi-regular text-primary mb-10">
        <div className="h-4 bg-gray-300 animate-pulse w-[40%] rounded-lg"></div>
      </div>

    </div>
  );
}

export default DonationMainViewSkeleton;
