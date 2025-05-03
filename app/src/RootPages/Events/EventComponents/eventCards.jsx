import {useState} from 'react';
import { MapPinned, Calendar, Star } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode"; // Import jwtDecode for decoding JWT tokens
import PersonOutline from "../../../assets/personoutline.png"
import "../../../index.css";

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

    //const truncatedDescription = truncateDescription(event.description, 2);

    return (
      <div
      className={`max-w-130 ${reservationExclusiveWidth ? "min-w-95 w-100" : "min-w-70 w-full"} h-120 rounded-3xl overflow-hidden shadow-xl bg-white relative border-gray-200 flex flex-col`}
      onClick={() => { openEventDetails(event.event_id) }}
    >
      {/* Image */}
      <div className="h-40 w-full">
        {event.image ? (
          <img src={event.image} alt="Event" className="w-full h-40 object-cover" />
        ) : (
          <div className="w-full h-40 bg-primary" />
        )}
      </div>
    
      {/* Main Content */}
      <div className="flex flex-col flex-grow px-5 pt-3 pb-4">
        <div>
          <RsvpStatus event={event} />
          <h1 className="text-2xl font-bold text-black mt-3">{event.title}</h1>
          <p className="text-gray-600 pt-2 line-clamp-2">{event.description}</p>
        </div>
    
        <div className="mt-auto">
          {/* Location */}
          <div className="flex items-center mt-3 text-gray-600 space-x-3">
            <MapPinned />
            <div className="">
              <label className="whitespace-nowrap">{event.location}</label>
            </div>
          </div>
    
          {/* Dates */}
          <div className="flex items-center mt-1 text-s text-gray-600 space-x-3">
            <Calendar />
            <div className="flex truncate space-x-5">
              {event.dates.map((datetime, index) => (
                <div key={index} className="flex-shrink-0">
                  <label>{parseTime(datetime)}</label>
                </div>
              ))}
            </div>
          </div>
    
          {/* Tags */}
          <div className="flex gap-2 overflow-x-scroll mt-4 items-center scrollbar-hidden">
            {event.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-secondary text-primary text-xs font-satoshi-medium px-3 py-1.5 rounded-xl h-8 whitespace-nowrap"
              >
                {tag}
              </span>
            ))}
          </div>
    
          {/* Going Count */}
          <div className="flex justify-end items-center text-primary font-extrabold pr-2">
            <img src={PersonOutline} alt="Going" className='h-5 mr-2'/>
            <label>{event.going_count} are going</label>
          </div>
        </div>
      </div>
    </div>    
    );
};

export default EventCards;