import { ArrowLeft } from 'lucide-react';

const EventCardsMainSkeleton = () => {
    return (
        <div className='w-full h-full pt-3 flex flex-col items-center justify-center space-y-5 animate-pulse'>

            {/* Go Back Label */}
            <label className="flex flex-row my-5 mb-7 space-x-7 ml-auto w-full pl-20 font-satoshi-bold text-gray-400">
                <ArrowLeft />
                <span>Go Back</span>
            </label>

            {/* Skeleton Card */}
            <div className="max-w-180 w-[80%] h-190 rounded-4xl overflow-hidden shadow-xl bg-white relative border-gray-200 border-1">
                {/* Image Placeholder */}
                <div className="h-60 bg-gray-300 mt-10 mx-10 rounded-2xl"></div>

                {/* Star Button Placeholder */}
                <div
                    className="z-10 flex flex-row space-x-3 absolute right-10 top-80 px-4 py-2 rounded-full shadow-md bg-gray-300 text-white"
                >
                    <div className="w-5 h-5 bg-gray-400 rounded-full"></div>
                </div>

                {/* Content Placeholder */}
                <div className="p-4 mx-5 flex flex-col space-y-4">
                    {/* Title Placeholder */}
                    <div className="h-6 bg-gray-300 rounded-md w-3/4"></div>

                    {/* Subtitle Placeholder */}
                    <div className="h-4 bg-gray-300 rounded-md w-1/2"></div>

                    {/* Location Placeholder */}
                    <div className="flex items-center mt-2 text-gray-600 space-x-3">
                        <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
                        <div className="h-4 bg-gray-300 rounded-md w-1/3"></div>
                    </div>

                    {/* Date Placeholder */}
                    <div className="flex items-center mt-2 text-gray-600 space-x-3">
                        <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
                        <div className="h-4 bg-gray-300 rounded-md w-1/3"></div>
                    </div>

                    {/* Description Placeholder */}
                    <div className="flex flex-col mt-5 h-50 overflow-y-scroll space-y-2">
                        <div className="h-4 bg-gray-300 rounded-md w-full"></div>
                        <div className="h-4 bg-gray-300 rounded-md w-5/6"></div>
                        <div className="h-4 bg-gray-300 rounded-md w-4/6"></div>
                    </div>

                    {/* Tags Placeholder */}
                    <div className="flex flex-row gap-2 mt-7 overflow-x-scroll">
                        <div className="h-6 bg-gray-300 rounded-full w-16"></div>
                        <div className="h-6 bg-gray-300 rounded-full w-20"></div>
                        <div className="h-6 bg-gray-300 rounded-full w-12"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventCardsMainSkeleton;