import { ArrowLeft } from 'lucide-react';

const EventCardsMainSkeleton = () => {
    return (
        <div className='bg-[#F8F9FB] animate-pulse'>
          <div className='mx-auto sm:max-w-250 sm:w-[80%] h-full flex flex-col items-center justify-center'>
      
            {/* Go Back Label */}
            <label className="flex flex-row cursor-default sm:pt-0 mt-8 my-5 sm:mb-7 sm:space-x-7 ml-auto w-full font-satoshi-bold text-gray-300">
              
            </label>
      
            {/* Skeleton Card */}
            <div className="min-h-215 rounded-4xl mb-10 overflow-hidden sm:shadow-xl bg-white mt-4 w-full sm:border-gray-200 p-10">
              
              {/* Image Placeholder */}
              <div className="h-80 bg-gray-300 rounded-2xl"></div>
      
              <div className="flex flex-col sm:flex-row justify-between items-start mt-4 gap-4">
      
                {/* Main Content Skeleton */}
                <div className="flex-1 py-4 space-y-5">
                  {/* RSVP Status */}
                  <div className="w-32 h-6 bg-gray-300 rounded-md"></div>
      
                  {/* Title */}
                  <div className="h-10 bg-gray-300 rounded-md w-3/4"></div>
      
                  {/* Subtitle */}
                  <div className="h-5 bg-gray-300 rounded-md w-1/3"></div>
      
                  {/* Location */}
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
                    <div className="h-4 bg-gray-300 rounded-md w-1/3"></div>
                  </div>
      
                  {/* Date */}
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
                    <div className="h-4 bg-gray-300 rounded-md w-2/5"></div>
                  </div>
      
                  {/* Description */}
                  <div className="flex flex-col space-y-2 mt-5">
                    <div className="h-4 bg-gray-300 rounded-md w-full"></div>
                    <div className="h-4 bg-gray-300 rounded-md w-5/6"></div>
                    <div className="h-4 bg-gray-300 rounded-md w-2/3"></div>
                  </div>
      
                  {/* Links */}
                  <div className="flex flex-col mt-5 space-y-2">
                    <div className="h-4 bg-gray-300 rounded-md w-1/4"></div>
                    <div className="h-4 bg-gray-300 rounded-md w-3/5"></div>
                  </div>
      
                  {/* Tags */}
                  <div className="flex flex-row gap-2 mt-5 overflow-x-scroll">
                    <div className="h-6 bg-gray-300 rounded-full w-16"></div>
                    <div className="h-6 bg-gray-300 rounded-full w-20"></div>
                    <div className="h-6 bg-gray-300 rounded-full w-12"></div>
                  </div>
                </div>
      
                {/* RSVP Button + Count */}
                <div className="sm:flex flex-col items-end ml-4 space-y-3">
                  {/* Button Placeholder */}
                  <div className="hidden sm:flex items-center px-6 py-3 z-10 rounded-full bg-gray-300 w-40 h-10"></div>
      
                  {/* Count Placeholder */}
                  <div className="flex flex-row items-center text-primary space-x-2 mt-2">
                    <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
                    <div className="h-4 bg-gray-300 w-32 rounded-md"></div>
                  </div>
                </div>
      
              </div>
            </div>
          </div>
        </div>
      );      
};

export default EventCardsMainSkeleton;