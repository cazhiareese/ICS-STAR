import {useState, useEffect} from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { MapPinned, Calendar, Star } from 'lucide-react';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';
import EventCardsMainSkeleton from './eventCardsMainSkeleton';
import RsvpStatus from './EventComponents/rsvpstatusbig';
import PersonOutline from "../../assets/personoutline.png"
import { Paperclip } from 'lucide-react';
import CircularLoading from '../../components/LoadingComponents/circularloading';
import ModalTemplate from '../../AuthPages/modaltemplate';

const EventCardsMain = () => {
    const [isSticky, setIsSticky] = useState(false);
    
    const [reservations, setReservations] = useState([]);
    const [allEvents, setAllEvents] = useState(null);
    const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
    const token = localStorage.getItem("token");
    const [reservationSignal, setReservationSignal] = useState(false);

    const [showModalCancel, setshowModalCancel] = useState(false);
    const [showModalAdd, setshowModalAdd] = useState(false);

    const [userId, setUserId] = useState(null);
    const [event, setEvent] = useState(null);
    
    const navigate = useNavigate();
    const [isGoing, setIsGoing] = useState(null);
    const [user, setUser] = useState(null);
    const id = useParams(); // Get the drive_id from the URL params
    const event_id = id.eventid; // Extract the drive_id from the params

    const [isloading, setisloading]= useState(false)

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
        setisloading(true)
        
        if (isGoing) {  
            
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
                setIsGoing (false)
            })
            .catch(error => {
                console.error("Error canceling RSVP:", error);
            }).finally(() => {
                setisloading(false);   
            });
            setshowModalCancel(false)

        } else {    
            console.log("User ID being sent:", userId);
            axios.post(`${API_BASE_URL}/events/${eventId}/confirm-rsvp`, {
                user_id: userId
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(response => {
                console.log("RSVP confirmed:", response.data);
                setIsGoing (true)
                
                
            }).catch(error => {
                console.error("Error confirming RSVP:", error);
            }).finally(() => {
                setisloading(false);   
            });;
            setshowModalAdd(false)
            
            
        }
        
        // window.location.reload();
    }

    if (!event && isGoing===null) {
        return <div><EventCardsMainSkeleton/></div>; // Show a loading state while fetching the event
    }
    return (
        <div className='w-full h-full pt-0 flex flex-col items-center justify-center space-y-5'>
            
            <label className="flex flex-row  sm:pt-0 mt-13 my-5 sm:mb-7 sm:space-x-7 ml-auto  w-full sm:pl-20  pl-10 font-satoshi-bold text-primary" onClick={()=>{navigate("/alumni/events")}}><ArrowLeft/> <label>Go Back</label></label>
            {user?.role !== "student" && event.rsvp_closed==false && (

                isloading ?
                <button
                    className={`sm:hidden z-10 flex flex-row space-x-3 absolute right-10 top-30 px-4 py-2 rounded-full shadow-md hover:cursor-pointer ${
                    isGoing ? 'bg-primary text-white' : 'bg-primary text-white'
                    } hover:scale-115 transform transition-transform duration-200`}
                    onClick={() => {
                        if (!isGoing) {
                          // show modal here
                          setshowModalAdd(true);  // Example
                        } else {
                            setshowModalCancel(true); 
                        }
                      }}
                    >
                    
                            <label>{isGoing ? <Star className='fill-white'/> : <Star/>}</label>
                            <label>{isGoing ? 'Reserve my Spot' : 'Cancel Reservations'}</label>
                    
                </button>:
                <div className='sm:hidden z-10 flex flex-row space-x-3 absolute right-10 top-30 px-4 py-2 rounded-full shadow-md hover:cursor-pointer'>
                <CircularLoading/>
                </div> 

            )}

            
            
            <div className="sm:max-w-180 sm:w-[80%] w-[90%] min-h-180 rounded-4xl mb-10 overflow-hidden sm:shadow-xl bg-white relative sm:border-gray-200 sm:border-1 ">

            <div className='hidden sm:flex z-10 flex-row absolute right-10 top-90 px-4 py-2 rounded-full '>
                        <div className='flex flex-row ml-auto space-x-2 items-center'>
                        <img 
                            src={PersonOutline}
                            alt="Sample Image" 
                            className='h-4 w-4'
                        /> 
                        <label className='flex flex-row text-primary'>
                            {event.going_count} are Going
                        </label>
                        </div>
                    </div>
                <div className="h-60 sm:w-auto w-[90%] bg-primary mt-10 sm:mx-10 mx-5 rounded-2xl overflow-hidden">
                    {event.image && (
                        <img
                            src={event.image}
                            alt="Event"
                            className="w-full h-full object-cover"
                        />
                    )}
                </div>
                <div className='pt-5 mx-10'>
                  <RsvpStatus event={event} />
                </div>
                {user?.role !== "student" && (
                    <>
                        {!event.rsvp_closed ? (
                        !isloading ? (
                            <button
                            className={`hidden sm:flex z-10 flex-row space-x-2.5 absolute right-10 top-80 px-3.5 py-2 rounded-full shadow-lg hover:cursor-pointer ${
                                isGoing ? 'bg-primary text-white' : 'bg-primary text-white'
                            } hover:scale-110 transform transition-transform duration-200`}
                            onClick={() => {
                                if (!isGoing) {
                                setshowModalAdd(true);
                                } else {
                                setshowModalCancel(true);
                                }
                            }}
                            >
                            <label className="flex items-center">
                                {isGoing ? <Star className="fill-white w-4 h-4" /> : <Star className="w-4 h-4" />}
                            </label>
                            <label className={`text-[15px] ${!isGoing ? 'font-satoshi-regular' : 'font-satoshi-bold'}`}>
                                {isGoing ? 'Cancel Reservations' : 'Reserve my Spot'}
                            </label>
                            </button>
                        ) : (
                            <div
                            className={`hidden sm:flex z-10 flex-row space-x-3 absolute right-10 top-80 px-4 py-2 rounded-full shadow-md hover:cursor-pointer bg-white text-primary hover:scale-115 transform transition-transform duration-200`}
                            >
                            <CircularLoading />
                            </div>
                        )
                        ) : (
                        // SHOW this when RSVP is closed
                        <button
                            disabled
                            className={`hidden sm:flex z-10 flex-row space-x-2.5 absolute right-10 top-80 px-3.5 py-2 rounded-full bg-gray-300 text-gray-700 shadow-xl cursor-not-allowed`}
                        >
                            <label className="flex items-center">
                            <Star className="w-4 h-4 text-gray-500" />
                            </label>
                            <label className={`text-[15px] font-satoshi-regular`}>
                            Reserve my Spot
                            </label>
                        </button>
                        )}
                    </>
                    )}
                <div className="p-4 mx-5 flex flex-col">
                    <h1 className="sm:text-3xl text-2xl font-satoshi-bold text-blue-900">{event.title}</h1>
                    
                    <label className='text-gray-400 pt-8'>Event Details</label>
                    
                    <div className="flex items-center mt-2 text-gray-600 space-x-3">
                        <MapPinned/>
                        <label>{event.location}</label>
                    </div>
                    <div className="flex w-full overflow-x-auto items-center mt-2 text-gray-600 space-x-3">
                        <Calendar />
                        
                            {event.datetimes.map((datetime, index) => (
                                <div className="flex flex-row overflow-x-scroll max-h-32 flex-shrink-0">
                                <label key={index} className='pr-5'>{parseTime(datetime)}</label>
                                </div>
                            ))}
                        
                    </div>
                    <div className='flex flex-col mt-5 '>
                        <label className='text-gray-400'>Event Description</label>
                        <label className="text-gray-600 pt-2 min-h-25">{event.description} 



                        </label>
                    {event.links.length >0 &&
                    <>
                    <label className='text-gray-400 pt-5 pb-1'>Relevant Links</label>
                        <ul className="space-y-2">
                        {event.links.map((link, index) => (
                            <li key={index} className="flex items-center space-x-2">
                            <Paperclip size={16} className="text-blue-40 flex-shrink-0" />
                            <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline break-all">
                                {link}
                            </a>
                            </li>
                        ))}
                        </ul>
                    </>

                    }
                        
                    </div>
                    
                    <div className="flex flex-row gap-2 mt-5 overflow-x-auto items-center thin-scrollbar">
                        {event.tags.map((tag, index) => (
                            <span
                            key={index}
                            className="bg-secondary text-primary text-xs font-satoshi-regular px-3 py-1.5 rounded-lg whitespace-nowrap"
                            >
                            {tag}
                            </span>
                        ))}
                    </div>


                    <div className='flex flex-row w-full mt-5 sm:hidden'>
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
        {showModalCancel && (
            <ModalTemplate
                onClose={() => setshowModalCancel(false)}
                choiceclose="Close"
                onContinue={()=>handleRSVPClick(event.event_id)}
                choicecontinue="Cancel RSVP"
                information="This will remove your attendance from the event."
                header="Cancel RSVP?"
                color="bg-red-700"
            >
            </ModalTemplate>
        )}

        {showModalAdd && (
            <ModalTemplate
                onClose={() => setshowModalAdd(false)}
                choiceclose="Close"
                onContinue={()=>handleRSVPClick(event.event_id)}
                choicecontinue="Confirm"
                information="You're about to RSVP for this event. We'll reserve a spot for you."
                header="Confirm Your RSVP"
                
            >
            </ModalTemplate>
        )}
            
        </div>
        
    );


};

export default EventCardsMain;