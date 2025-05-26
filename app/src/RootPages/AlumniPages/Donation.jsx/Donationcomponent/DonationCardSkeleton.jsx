// DonationCardSkeleton.js
import React from "react";

function DonationCardSkeleton() {
  return (
    <div
      className="w-full max-w-[400px] sm:w-[45%] md:w-[45%] mx-[2px] rounded-[20px] border-disabled overflow-hidden shadow border  animate-pulse"
    >
      <div className="h-28 bg-gray-300"></div>

      <div className="p-4">
        <div className="w-32 h-6 bg-gray-300 mb-2"></div> {/* Title skeleton */}
        <div className="w-full h-4 bg-gray-300 mb-2"></div> {/* Description skeleton */}

        {/* Progress bar skeleton */}
        <div className="mt-4">
          <div className="w-3/4 h-2 bg-gray-300 rounded-full mt-1"></div>
        </div>

        {/* Footer skeleton */}
        <div className="mt-4 flex justify-between text-sm text-black font-satoshi-medium">
          <div className="w-24 h-4 bg-gray-300"></div>
          <div className="w-24 h-4 bg-gray-300"></div>
        </div>
      </div>
    </div>
  );
}

export default DonationCardSkeleton;
