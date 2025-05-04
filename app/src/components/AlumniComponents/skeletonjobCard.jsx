import React from 'react';

function SkeletonJobCard() {
    return (
        <div className="flex flex-col outline-1 outline-neutral-300 xl:w-[400px] lg:w-[300px] md:w-[220px] w-[300px] rounded-2xl p-8 animate-pulse bg-white">
            {/* Title and Company */}
            <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>

            {/* Description */}
            <div className="space-y-2 mb-4">
                <div className="h-3 bg-gray-300 rounded w-full"></div>
                <div className="h-3 bg-gray-300 rounded w-5/6"></div>
                <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                <div className="h-3 bg-gray-300 rounded w-4/5"></div>
            </div>

            {/* Username and Interested Count */}
            <div className="flex flex-row justify-between items-center mb-4">
                <div className="h-4 bg-gray-300 rounded w-24"></div>
                <div className="h-4 bg-gray-300 rounded w-32"></div>
            </div>

            {/* Tags */}
            <div className="flex gap-2 overflow-x-auto">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-gray-300 rounded-full px-4 py-2 w-16 h-6"></div>
                ))}
            </div>
        </div>
    );
}

export default SkeletonJobCard;
