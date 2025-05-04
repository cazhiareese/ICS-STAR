import React from 'react';

function SkeletonAlumniCard() {
  return (
    <div className='flex flex-col shadow-md w-full items-center rounded-lg py-6 animate-pulse'>
      {/* Avatar Placeholder */}
      <div className="w-24 h-24 rounded-full bg-gray-300 border border-gray-300 shadow-sm" />

      {/* Name & Email */}
      <div className='w-3/4 h-4 bg-gray-300 mt-4 rounded' />
      <div className='w-1/2 h-3 bg-gray-300 mt-2 rounded' />

      {/* Details Section */}
      <div className="flex flex-col items-start w-max pt-4 gap-y-2">
        {/* Job Title */}
        <div className='flex items-center gap-x-2'>
          <div className="w-4 h-4 bg-gray-300 rounded" />
          <div className='w-32 h-3 bg-gray-300 rounded' />
        </div>

        {/* Graduation Year */}
        <div className='flex items-center gap-x-2'>
          <div className="w-4 h-4 bg-gray-300 rounded" />
          <div className='w-40 h-3 bg-gray-300 rounded' />
        </div>

        {/* Location */}
        <div className='flex items-center gap-x-2'>
          <div className="w-4 h-4 bg-gray-300 rounded" />
          <div className='w-36 h-3 bg-gray-300 rounded' />
        </div>
      </div>
    </div>
  );
}

export default SkeletonAlumniCard;
