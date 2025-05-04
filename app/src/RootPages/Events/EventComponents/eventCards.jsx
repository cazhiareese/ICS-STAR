import {useState} from 'react';
import { MapPinned, Calendar, Star } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode"; // Import jwtDecode for decoding JWT tokens
import PersonOutline from "../../../assets/personoutline.png"

import RsvpStatus from './rsvpstatus';
const EventCards = ({event, reservationExclusiveWidth}) => {

        //cyrus was here
    console.log("SDFSD", reservationExclusiveWidth)
    const User = localStorage.getItem("token");
    let tokentype = "guest";
    let userid = true;
    
    
    if (User) {
      try {
        const decoded = jwtDecode(User);
        tokentype = decoded.role;
        userid = decoded.sub;
        console.log("Decoded token:", decoded);
        console.log("User ID:", userid);
        console.log("Token type:", tokentype);
      } catch (error) {
        console.error("Invalid token:", error);
      }
    } else {
      console.log("No token found, defaulting to guest.");
    }

    const [status, setStatus] = useState()
    const navigate = useNavigate();
    const parseTime = (isoTimestamp) => {
      // console.log("SDFSD",{reservationExclusiveWidth})
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

        console.log("RSVP clicked for event ID:", eventId);
        navigate(`/${tokentype}/events/${eventId}`);
    }
    
    const truncateDescription = (description, maxLines = 2) => {
        if (description===null) return null;
        const lines = description.split('\n');
        console.log(event)
        return lines.slice(0, maxLines).join('\n') + (lines.length > maxLines ? '...' : '...');
    };

    const truncatedDescription = truncateDescription(event.description, 2);
    return (
        <div className={`max-w-130  ${reservationExclusiveWidth==true? "md:min-w-110  w-80 sm:w-full" :"xl:min-w-70 lg:min-w-120 md:min-w-70 sm:w-full  w-90 "}} h-130 rounded-3xl overflow-hidden shadow-xl bg-white relative border-gray-200 border-1`}
        onClick={() => {openEventDetails(event.event_id)}} 
        >
<div className="h-40 w-full">
  {event.image ? (
    <img
      src={event.image}
      alt="Event"
      className="w-full h-full object-cover"
    />
  ) : (
    <div className="w-full h-full bg-primary" />
  )}
</div>

            
            
            <div className="p-4  h-full relative">
                <div>
                  <RsvpStatus event={event} />
                </div>
                <h1 className="text-xl font-bold text-blue-900 mt-3 h-15 w-full line-clamp-2">{event.title}</h1>
                <p className="text-gray-600 pt-2 h-15 flex line-clamp-2 w-full">{truncatedDescription}</p>
                
                
                <div className="flex items-center mt-4 text-gray-600 space-x-3 w-full">
                    <MapPinned />
                    <div className="w-full  overflow-x-auto thin-scrollbar">
                        <label className="flex-shrink-0 whitespace-nowrap">{event.location}</label>
                    </div>
                </div>
                <div className="flex items-center mt-2 text-gray-600 space-x-3">
                    <Calendar />
                    <div className="flex w-full overflow-x-scroll max-h-8 space-x-5 thin-scrollbar">
                            {event.dates.map((datetime, index) => (
                              <div className='flex-shrink-0'>

                                  <label key={index}>{parseTime(datetime)}</label>
                              </div>
                            ))}

                    </div>
                </div>
                <div className="flex flex-row gap-2 mt-4 overflow-x-scroll w-full h-10 items-center thin-scrollbar">
                    {event.tags.map((tag, index) => (
                        <span
                            key={index}
                            className="bg-secondary text-primary text-xs font-satoshi-regular px-3 py-1.5 rounded-lg h-8 whitespace-nowrap"
                        >
                            {tag}
                        </span>
                    ))}
                    
                    
                </div>

                <div className='flex flex-row w-full mt-2'>
                  <div className='flex flex-row ml-auto space-x-5'>
                    <img 
                            src= {PersonOutline}
                            alt="Sample Image" 
                            className='mt-auto ml-auto'
                    /> 
                    <label className='flex flex-row text-primary ml-auto '>
                    {event.going_count} Going</label>
                  </div>
                    
                </div>
            </div>
            
        </div>
    );
};

export default EventCards;