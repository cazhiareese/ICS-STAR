import {useState, useEffect} from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { MapPinned, Calendar, Star } from 'lucide-react';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';
import EventCardsMainSkeleton from './eventCardsMainSkeleton';
import RsvpStatus from './EventComponents/rsvpstatusbig';
import PersonOutline from "../../assets/personoutline.png"

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
    const [isGoing, setIsGoing] = useState(null);
    const [user, setUser] = useState(null);
    const id = useParams(); // Get the drive_id from the URL params
    const event_id = id.eventid; // Extract the drive_id from the params



    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/one-event/${event_id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setEvent(response.data);
                console.log("Event data:", response.data);
            } catch (error) {
                console.error('Error fetching event:', error);
            }
        };
        fetchEvent();
        console.log("Event data:", event);
        
    },[]);

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

    
    useEffect(() => {
        if (event && reservations.length > 0) {
            const going = reservations.some(reservation => reservation.event_id === event.event_id);
            setIsGoing(going);
            console.log("isGoing computed:", going);
        }
    }, [event, reservations]);

    useEffect(() => {

        const fetchReservations = async () => {

            try {
                const response = await axios.get(`${API_BASE_URL}/events/confirmed`, {
                    headers: {
                      Authorization: `Bearer ${token}`
                    }
                  });
                  setReservations(response.data);
                  console.log(reservations.length);
                  console.log(reservations);
                  
            } catch (error) {
                
                console.error('Error fetching reservations:', error);
            }
            
        };


        
        console.log("RESERVATION SIGNAL")
        

        const fetchAllEvents = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/events-visible-to`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setAllEvents(response.data);
                console.log(allEvents)
                fetchReservations();

            } catch (error) {
                console.error('Error fetching all events:', error);
                console.log(allEvents)
            }
        };

        fetchAllEvents();
        // setEvent(sampleEvent)
        console.log("Event data:", event);

    }, []);

    const sampleEvent = {
        id: 1,
        title: "Community Clean-Up Drive",
        description: "Join us for a community clean-up event to make our neighborhood cleaner and greener.",
        date: "2023-12-15T08:00:00Z", // UTC time format
        location: "Central Park, Main Street",
        organizer: "Green Earth Organization",
        image: "https://example.com/event-image.jpg",
        tags: ["Community", "Environment", "Volunteer"],
        links: [
            "https://example.com/event-details",
            "https://example.com/registration-form"
        ],
        rsvp_closed: false,
    };

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
        
        
        if (isGoing) {  
            setIsGoing (false)
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
            setIsGoing (true)
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

    {/*Show a loading state while fetching the event*/}
    if (!event && isGoing===null) {
        return <div><EventCardsMainSkeleton/></div>;
    }
    return (
        <div className='bg-[#F8F9FB]'>
          <div className='mx-auto sm:max-w-250 sm:w-[80%] h-full flex flex-col items-center justify-center'>
            {/* Back Button */}
            <label 
              className="flex flex-row cursor-pointer sm:pt-0 mt-8 my-5 sm:mb-7 sm:space-x-7 ml-auto w-full font-satoshi-bold text-primary" 
              onClick={() => navigate("/alumni/events")}
            >
              <ArrowLeft />
              <label className='cursor-pointer'>Go Back</label>
            </label>
      
            {/* Mobile RSVP Button (Absolute positioned) */}
            {user?.role !== "student" && !event.rsvp_closed && (
              <button
                className={`sm:hidden z-10 flex flex-row space-x-3 absolute right-10 top-30 rounded-full shadow-md hover:cursor-pointer ${
                  isGoing ? 'bg-green-500 text-white' : 'bg-primary text-white'
                } hover:scale-115 transform transition-transform duration-200`}
                onClick={() => handleRSVPClick(event.event_id)}
              >
                <label>{isGoing ? <Star className='fill-white' /> : <Star />}</label>
                <label>{isGoing ? 'Going' : 'Reserve My Spot'}</label>
              </button>
            )}
      
            {/* Event Card */}
            <div className="relative min-h-215 rounded-4xl mb-10 overflow-hidden sm:shadow-xl bg-whitey w-full sm:border-gray-200 p-10">
              {/* Image */}
              <div className="h-80 bg-primary rounded-2xl overflow-hidden">
                {event.image && (
                  <img
                    src={event.image}
                    alt="Event"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
      
              {/* Desktop RSVP Elements (Positioned absolutely relative to card) */}
              {user?.role !== "student" && !event.rsvp_closed && (
                <div className="hidden sm:flex flex-col items-end absolute right-10 mt-3 top-[360px]">
                  <button
                    className={`items-center px-6 py-3 flex flex-row rounded-full shadow-md hover:cursor-pointer ${
                      isGoing ? 'bg-green-500 text-white' : 'bg-primary text-white font-bold'
                    } hover:scale-105 transform transition-transform duration-200`}
                    onClick={() => handleRSVPClick(event.event_id)}
                  >
                    <label>{isGoing ? <Star className="fill-white" /> : <Star />}</label>
                    <label className="text-l font-extrabold">{isGoing ? 'Going' : 'Reserve My Spot'}</label>
                  </button>
      
                  <div className="flex flex-row text-lg items-center text-primary mt-2 font-bold px-4 py-2">
                    <img src={PersonOutline} className="mr-3" />
                    <label>{event.going_count} are going</label>
                  </div>
                </div>
              )}
      
              {/* Main Content */}
              <div className="pt-5">
                <RsvpStatus event={event} />
              </div>
      
              <div className="block py-4 flex flex-col">
                <h1 className="sm:text-4xl text-2xl font-satoshi-black text-blue-900">{event.title}</h1>
                <label className='text-gray-400 pt-4'>Event Details</label>
      
                {/* Location */}
                <div className="flex items-center mt-2 text-gray-600 space-x-3">
                  <MapPinned />
                  <label>{event.location}</label>
                </div>
      
                {/* Date */}
                <div className="flex w-full items-center mt-2 text-gray-600 space-x-3">
                  <Calendar />
                  {event.datetimes.map((datetime, index) => (
                    <div key={index} className="flex flex-row max-h-32 flex-shrink-0">
                      <label className='pr-5'>{parseTime(datetime)}</label>
                    </div>
                  ))}
                </div>
      
                {/* Description */}
                <div className='flex flex-col mt-5'>
                  <label className='text-gray-400'>Event Description</label>
                  <label className="text-gray-600 pt-2">{event.description}</label>
      
                  {/* Relevant Links */}
                  <label className='text-gray-400 pt-5 pb-1'>Relevant Links</label>
                  {event.links.map((link, index) => (
                    <li key={index}>
                      <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        {link}
                      </a>
                    </li>
                  ))}
                </div>
      
                {/* Tags */}
                <div className="flex flex-row gap-2 mt-5 overflow-x-scroll">
                  {event.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-primary/80 text-s font-satoshi-medium px-3 py-1.5 rounded-xl"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
      
};

export default EventCardsMain;