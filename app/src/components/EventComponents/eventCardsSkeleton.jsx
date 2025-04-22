import React from 'react';
import { MapPinned, Calendar } from 'lucide-react';

const EventCardsSkeleton = () => {

    return (
        <div className=" mb-10 w-110 h-100 rounded-2xl overflow-hidden shadow-xl bg-white relative border-gray-200 border-1 animate-pulse">
            <div className="h-40 bg-gray-300"></div>
            <button className="absolute right-3 top-35 bg-gray-400 text-white px-4 py-2 rounded-full shadow-md hover:bg-blue-700 w-20 h-7">

            </button>
            <div className="p-4">
                <h1 className="text-xl font-bold text-blue-900"></h1>
                <p className="text-gray-600"></p>
                
                
                <div className="flex items-center mt-4 text-gray-600 space-x-3">
                    <MapPinned/>
                    {/* <label>{event.location}</label> */}
                </div>
                <div className="flex items-center mt-2 text-gray-600 space-x-3">
                    <Calendar />
                    {/* <label>{parseTime(event.dates)}</label> */}
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                    <span
                            // key={index}
                            className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded h-4 w-15"
                        >
                            {/* {tag} */}
                    </span>
                    <span
                            // key={index}
                            className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded h-4 w-15"
                        >
                            {/* {tag} */}
                    </span>
                    <span
                            // key={index}
                            className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded h-4 w-15"
                        >
                            {/* {tag} */}
                    </span>
                </div>
            </div>
            
        </div>
    );
};

export default EventCardsSkeleton;