import {useState} from 'react';
import { MapPinned, Calendar, Star } from 'lucide-react';

const EventCards = ({event}) => {

    const [status, setStatus] = useState()
    const parseTime = (isoTimestamp) => {
        // Parse the timestamp into a Date object (in UTC)
        const date = new Date(isoTimestamp);

        // Subtract 15 days
        date.setUTCDate(date.getUTCDate() - 15);

        // Set the time to 3:00 PM (15:00 in 24-hour time)
        date.setUTCHours(15, 0, 0, 0);

        // Format the date to "11 April 3:00 PM"
        const day = date.getUTCDate();
        const month = date.toLocaleString('en-US', { month: 'long', timeZone: 'UTC' });
        let hours = date.getUTCHours();
        const minutes = date.getUTCMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12; // Convert to 12-hour format

        const formatted = `${day} ${month} ${hours}:${minutes} ${ampm}`;

        return formatted
    }
    
    const handleRSVPClick = () =>{

    }
    const truncateDescription = (description, maxLines = 2) => {
        const lines = description.split('\n');
        return lines.slice(0, maxLines).join('\n') + (lines.length > maxLines ? '...' : '');
    };

    const truncatedDescription = truncateDescription(event.description, 2);
    return (
        <div className="w-110 h-100 rounded-2xl overflow-hidden shadow-xl bg-white relative border-gray-200 border-1">
            <div className="h-40 bg-gray-300"></div>
            <button className="flex flex-row space-x-3 absolute right-3 top-35 bg-primary text-white px-4 py-2 rounded-full shadow-md hover:cursor-pointer"
                onClick={handleRSVPClick}
            >
                    <Star/>
                    <label>RSVP</label>
            </button>
            <div className="p-4">
                <h1 className="text-xl font-bold text-blue-900">{event.title}</h1>
                <p className="text-gray-600 pt-2">{truncatedDescription}</p>
                
                
                <div className="flex items-center mt-4 text-gray-600 space-x-3">
                    <MapPinned/>
                    <label>{event.location}</label>
                </div>
                <div className="flex items-center mt-2 text-gray-600 space-x-3">
                    <Calendar />
                    <label>{parseTime(event.dates)}</label>
                </div>
                <div className="flex flex-row gap-2 mt-4 overflow-x-scroll">
                    {event.tags.map((tag, index) => (
                        <span
                            key={index}
                            className="bg-blue-100 text-primary text-xs font-satoshi-regular px-3 py-1.5 rounded-lg"
                        >
                            {tag}
                        </span>
                    ))}
                    
                    
                </div>
            </div>
            
        </div>
    );
};

export default EventCards;