import {useState, useEffect} from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { MapPinned, Calendar, Star } from 'lucide-react';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';
import EventCardsMainSkeleton from './eventCardsMainSkeleton';


const EventCardsMain = () => {
    const [isSticky, setIsSticky] = useState(false);
    
    const [reservations, setReservations] = useState([]);
    const [allEvents, setAllEvents] = useState(null);
    const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
    const token = localStorage.getItem("token");
    const [reservationSignal, setReservationSignal] = useState(false);
    const [userId, setUserId] = useState(null);
    const [event, setEvent] = useState(null);
    
    const navigate = useNavigate();
    const [isGoing, setIsGoing] = useState(false);
    const [user, setUser] = useState(null);
    const id = useParams(); // Get the drive_id from the URL params
    const event_id = id.eventid; // Extract the drive_id from the params

        //cyrus was here
    
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



    useEffect(() => {
        const fetchEvent = async () => {
          try {
            const config = tokenType === "guest"
              ? {}
              : { headers: { Authorization: `Bearer ${token}` }, withCredentials: true };
      
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/one-event/${event_id}`, config);
            setEvent(response.data);
            console.log("Event data:", response.data);
          } catch (error) {
            console.error("Error fetching event:", error);
          }
        };
      
        fetchEvent();
        console.log("Event data:", event);
      }, []);
      

        useEffect(() => {
            if (!token) throw new Error("User not authenticated");
    
            const fetchUserId = async () => {
                try {
                    const response = await fetch(`${API_BASE_URL}/profile`, {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });
            
                    if (!response.ok) {
                        if (response.status === 401) throw new Error("Unauthorized access");
                        throw new Error("Failed to fetch profile");
                    }
            
                    const result = await response.json();
                    console.log(result.data.user_id);
                    console.log(result)
                    setUserId(result.data.user_id);
                    setUser(result.data);
                } catch (error) {
                    console.error("Error fetching profile:", error.message);
                }
            };
            fetchUserId();   
            console.log("Event data:", event);     
        },[])




    const parseTime = (isoTimestamp) => {
        console.log("ISO Timestamp:", isoTimestamp);
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

    const handleRSVPClick = (eventId) => {
        // setReservations([])
        
        
        if (!isGoing) {  
            setIsGoing (true)
            console.log(event)
            console.log("Event ID here:", eventId)
            console.log("User ID here: ", userId)

            // alert("You have already RSVP'd for this event.");
            axios.delete(`${API_BASE_URL}/events/${eventId}/cancel-rsvp`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                data: {
                    user_id: userId
                }
            })
            .then(response => {
                console.log("RSVP canceled:", response.data);
            })
            .catch(error => {
                console.error("Error canceling RSVP:", error);
            });
        } else {
            setIsGoing (false)
            console.log("User ID being sent:", userId);
            axios.post(`${API_BASE_URL}/events/${eventId}/confirm-rsvp`, {
                user_id: userId
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(response => {
                console.log("RSVP confirmed:", response.data);
            }).catch(error => {
                console.error("Error confirming RSVP:", error);
            });
        }
    }

    if (!event) {
        return <div><EventCardsMainSkeleton/></div>; // Show a loading state while fetching the event
    }
    return (
        <div className='w-full h-full pt-0 flex flex-col items-center justify-center space-y-5'>

            <label className="flex flex-row  sm:pt-0 mt-13 my-5 sm:mb-7 sm:space-x-7 ml-auto  w-full sm:pl-20  pl-10 font-satoshi-bold text-primary" onClick={()=>{navigate("/alumni/events")}}><ArrowLeft/> <label>Go Back</label></label>
            {user?.role !== "student" && (
                <button
                    className={`sm:hidden z-10 flex flex-row space-x-3 absolute right-10 top-30 px-4 py-2 rounded-full shadow-md hover:cursor-pointer ${
                    !isGoing ? 'bg-green-500 text-white' : 'bg-primary text-white'
                    }`}
                    onClick={() => handleRSVPClick(event.event_id)}
                >
                    <label>{!isGoing ? <Star className='fill-white'/> : <Star/>}</label>
                    <label>{!isGoing ? 'Going' : 'RSVP'}</label>
                </button>
            )}
            <div className="sm:max-w-180 sm:w-[80%] w-[90%] h-185 rounded-4xl overflow-hidden sm:shadow-xl bg-white relative sm:border-gray-200 sm:border-1 ">
                <div className="h-60 sm:w-auto w-[90%] bg-primary mt-10 sm:mx-10 mx-5 rounded-2xl overflow-hidden">
                    {event.image && (
                        <img
                            src={event.image}
                            alt="Event"
                            className="w-full h-full object-cover"
                        />
                    )}
                </div>
                {user?.role !== "student" && (
                    <button
                        className={`hidden sm:flex z-10 flex-row space-x-3 absolute right-10 top-80 px-4 py-2 rounded-full shadow-md hover:cursor-pointer ${
                        !isGoing ? 'bg-green-500 text-white' : 'bg-primary text-white'
                        }`}
                        onClick={() => handleRSVPClick(event.event_id)}
                    >
                        <label>{!isGoing ? <Star className='fill-white'/> : <Star/>}</label>
                        <label>{!isGoing ? 'Going' : 'RSVP'}</label>
                    </button>
                )}
                <div className="p-4 mx-5 flex flex-col">
                    <h1 className="sm:text-3xl text-2xl font-satoshi-bold text-blue-900">{event.title}</h1>
                    
                    <label className='text-gray-400 pt-8'>Event Details</label>
                    
                    <div className="flex items-center mt-2 text-gray-600 space-x-3">
                        <MapPinned/>
                        <label>{event.location}</label>
                    </div>
                    <div className="flex items-center mt-2 text-gray-600 space-x-3">
                        <Calendar />
                        <div className="flex flex-row w-2/3 overflow-y-scroll max-h-32">
                            {event.datetimes.map((datetime, index) => (
                                <label key={index} className='pr-5'>{parseTime(datetime)}/</label>
                            ))}
                        </div>
                    </div>
                    <div className='flex flex-col mt-5 h-50 overflow-y-scroll'>
                        <label className='text-gray-400'>Event Description</label>
                        <label className="text-gray-600 pt-2">{event.description}</label>

                        <label className='text-gray-400 pt-5 pb-1'>Relevant Links</label>
                        {event.links.map((link, index) => (
                                <li key={index}>
                                    <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                        {link}
                                    </a>
                                </li>
                        ))}
                    </div>
                    
                    <div className="flex flex-row gap-2 mt-5 overflow-x-scroll">
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
        </div>
        
    );
};

export default EventCardsMain;