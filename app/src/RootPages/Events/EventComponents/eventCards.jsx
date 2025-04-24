import {useState} from 'react';
import { MapPinned, Calendar, Star } from 'lucide-react';
import { useNavigate } from "react-router-dom";
const EventCards = ({event}) => {

    const [status, setStatus] = useState()
    const navigate = useNavigate();
    const parseTime = (isoTimestamp) => {
        // Parse the timestamp into a Date object (in UTC)
        const date = new Date(isoTimestamp);

        // Subtract 15 days
        // date.setUTCDate(date.getUTCDate() - 15);

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

    
    const openEventDetails = (eventId) => {
        // if (reservations && reservations.some(reservation => reservation.id === eventId)) {
        //     alert("You have already RSVP'd for this event.");
        // } else {
        //     alert("You have not RSVP'd for this event yet.");
        // }
        console.log("RSVP clicked for event ID:", eventId);
        navigate(`/alumni/events/${eventId}`);
    }
    const truncateDescription = (description, maxLines = 2) => {
        const lines = description.split('\n');
        return lines.slice(0, maxLines).join('\n') + (lines.length > maxLines ? '...' : '');
    };

    const truncatedDescription = truncateDescription(event.description, 2);
    return (
        <div className="w-90 h-110 rounded-2xl overflow-hidden shadow-xl bg-white relative border-gray-200 border-1"
        onClick={() => {openEventDetails(event.event_id)}} 
        >
            <div className="h-40 bg-gray-300">
                {event.image && (
                        <img
                            src={event.image}
                            alt="Event"
                            className="w-full h-full object-cover"
                        />
                )}
            </div>
            
            
            <div className="p-4">
                <h1 className="text-xl font-bold text-blue-900 pt-10">{event.title}</h1>
                <p className="text-gray-600 pt-2 h-15 flex items-center">{truncatedDescription}</p>
                
                
                <div className="flex items-center mt-4 text-gray-600 space-x-3">
                    <MapPinned/>
                    <label>{event.location}</label>
                </div>
                <div className="flex items-center mt-2 text-gray-600 space-x-3">
                    <Calendar />
                    <div className="flex flex-col w-1/2 overflow-y-scroll max-h-32">
                            {event.dates.map((datetime, index) => (
                                <label key={index}>{parseTime(datetime)}</label>
                            ))}
                    </div>
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