import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { MapPinned, Calendar, Star, Search, Filter } from 'lucide-react';
import axios from 'axios';
import EventCards from './EventComponents/eventCards';
import EventCardsSkeleton from './EventComponents/eventCardsSkeleton'
import { samp } from 'framer-motion/client';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";

const EventsLanding = () => {


    const [showCalendar, setShowCalendar] = useState(false);
    const [pickedDate, setPickedDate] = useState(null);


    const [isSticky, setIsSticky] = useState(false);

    const [reservations, setReservations] = useState([]);
    const [allEvents, setAllEvents] = useState(null);
    const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
    const token = localStorage.getItem("token");
    const [reservationSignal, setReservationSignal] = useState(false);
    const [userId, setUserId] = useState(null);
    
    const [searchInput, setSearchInput] = useState('');
    const [suggestions, setSuggestions] = useState("none");

    const [filterPress, setFilterPress] = useState("None");

    const navigate = useNavigate();

    const exploreRef = useRef(null);

    const [user, setUser] = useState(null);
    const [userType, setUserType] = useState(null);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            setIsSticky(scrollTop > 100); // adjust the trigger point here
        };
    
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        // if (!token) throw new Error("User not authenticated");

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
                setUserId(result.data.user_id);
                setUser(result.data);
                setUserType(result.data.user_type);
            } catch (error) {
                console.error("Error fetching profile:", error.message);
            }
        };
        fetchUserId();        
    },[])


    useEffect(() => {
        console.log("SDFSDD")
        console.log(API_BASE_URL)

        const fetchReservations = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/events/confirmed`, {
                    headers: {
                      Authorization: `Bearer ${token}`
                    }
                  });
                  setReservations(response.data);
                  console.log(reservations.length)
                
            } catch (error) {
                
                console.error('Error fetching reservations:', error);
            }
        };

        fetchReservations();
        setReservationSignal(false);
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
                console.log(allEvents)

            } catch (error) {
                console.error('Error fetching all events:', error);
                console.log(allEvents)
            }
        };

        fetchAllEvents();
        // setAllEvents([sampleEvent1, sampleEvent2, sampleEvent3, sampleEvent4]);
        
        console.log("RESERVATION SIGNALasdfasdf")
    }, []);

    const sampleEvent1 = {
        event_id: 1,
        title: "Community Clean-Up Drive",
        description: "Join us for a community clean-up event to make our neighborhood cleaner and greener.",
        dates: "2023-12-15T08:00:00Z", // UTC time format
        location: "Central Park, Main Street",
        organizer: "Green Earth Organization",
        image: "https://example.com/clean-up-drive.jpg",
        tags: ["Community", "Environment", "Volunteer"],
        is_closed: false,
    };

    const sampleEvent2 = {
        event_id: 2,
        title: "Charity Fun Run",
        description: "Participate in a fun run to raise funds for local charities.",
        dates: "2023-12-20T06:00:00Z", // UTC time format
        location: "Riverside Park, Elm Street",
        organizer: "Helping Hands Foundation",
        image: "https://example.com/fun-run.jpg",
        tags: ["Charity", "Fitness", "Community"],
        is_closed: false,
    };

    const sampleEvent3 = {
        event_id: 3,
        title: "Art Workshop for Beginners",
        description: "Learn the basics of painting and drawing in this beginner-friendly workshop.",
        dates: "2023-12-18T10:00:00Z", // UTC time format
        location: "Art Center, Maple Avenue",
        organizer: "Creative Minds Studio",
        image: "https://example.com/art-workshop.jpg",
        tags: ["Art", "Workshop", "Creativity"],
        is_closed: false,
    };
    
    const sampleEvent4 = {
        event_id: 4,
        title: "Tech Talk: Future of AI",
        description: "Explore the latest advancements in AI technology with industry experts.",
        dates: "2023-12-22T14:00:00Z", // UTC time format
        location: "Tech Hub, Silicon Street",
        organizer: "Innovators Network",
        image: "https://example.com/tech-talk.jpg",
        tags: ["Technology", "AI", "Education"],
        is_closed: false,
    };

    const handleRSVPClick = (eventId, event) => {
        // setReservations([])
        

        if (reservations.some(reservation => reservation.event_id === event.event_id)) {
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
            setReservations(currReservations=>currReservations.filter(reservation => reservation !== event)); 
            
            // setReservationSignal(true);
        } else {
            console.log("User ID being sent:", eventId);
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
            // alert("You have not RSVP'd for this event yet.");
            
            // console.log(isAlreadyRSVPd)
            // setReservationSignal(true);
            setReservations(currReservations => [
                ...currReservations, event // Add event (or sampleEvent) to reservations
            ]);    
        }
    }
    // if (user === null) {
    //     return (
    //         <div className="flex flex-col items-center justify-center h-screen">
    //             <h1 className="text-2xl font-bold">Loading...</h1>
    //         </div>
    //     );
    // }
    return (
        <>
            <div className="flex flex-col sm:items-center ">
                <div className={`w-full z-40 transition-all duration-800 ease-in-out sm:items-center sm:justify-center flex ${isSticky ? 'fixed top-0 bg-white shadow-md' : 'relative'}`}>

                    <div className="flex overflow-y-hidden items-center bg-white justify-center p-5 shadow-xl rounded-2xl w-full mx-auto h-25">
                        
                        <div className='flex flex-row  z-10 w-full lg:w-1/2 h-16 max-w-[600px] px-4  border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'>
                            <input
                                type="text"
                                placeholder="Search donation drives..."
                                className="w-full h-full max-w-[600px] font-satoshi-regular text-xl"  
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setSearchInput(value);
                                    
                                    if (value.trim() === '') {
                                      setSuggestions("none");
                                      return;
                                    }
                                  
                                    const matches = allEvents
                                      ?.filter(event =>
                                        event.title.toLowerCase().includes(value.toLowerCase())
                                      )
                                      .slice(0, 5); // limit to 5
                                  
                                    setSuggestions(matches || []);
                                  
                                    // Scroll to explore events section
                                    if (exploreRef.current) {
                                        const yOffset = -130; // increase if you want more spacing above
                                        const y = exploreRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
                                        window.scrollTo({ top: y, behavior: 'smooth' });
                                      }
                                  }}                    >

                                
                            </input>
                            <div className='flex items-center justify-center w-25 h-full bg-primary ml-auto rounded-xl -mr-4'>
                                <Search className='text-white w-7 h-7'/>
                            </div>
                        </div>

                        
                        
                    </div>
                    {/* <div className={`w-1/3 h-80 relative  border-2 z-30 rounded-2xl`}> */}
                    {/* </div> */}
                </div>
                <div className='h-30'>

                </div>
                
                <div className="flex flex-col -mt-20 mb-8 sm:w-full sm:px-15  px-10 sm:items-start items-center">
                    <div className="flex flex-row items-end space-x-5">
                        <label className="text-3xl text-primary font-satoshi-bold">Your Reservations</label>
                        <label className="text-xl text-primary font-satoshi-light">({reservations == null ? "0" : reservations.length})</label>
                    </div>
                    {userType === "alumni" && (
                        <div className="flex flex-row mt-5 mr-10  gap-5 overflow-scroll w-full">
                        {reservations != null ? (
                            reservations.length > 0 ? (
                                reservations.map((reservation, index) => (
                                    <div key={index} className="flex relative">
                                        <EventCards event={reservation} />
                                        
                                        <button
                                            className="z-10 flex flex-row space-x-3 absolute right-5 top-35 px-4 py-2 rounded-full shadow-md hover:cursor-pointer bg-green-500 text-whitey
                                            hover:scale-110 transform transition-transform duration-200"
                                            onClick={() => handleRSVPClick(reservation.event_id, reservation)}
                                        >
                                            <Star className="fill-white" />
                                            <label>Going</label>
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="font-satoshi-light text-primary">You do not have any reservations yet.</div>
                            )
                        ) : (
                            <div className="flex gap-5">
                                <EventCardsSkeleton />
                                <EventCardsSkeleton />
                                <EventCardsSkeleton />
                                <EventCardsSkeleton />
                            </div>
                        )}
                    </div>


                    )
                    
                    }
                    
                </div>

                <div className="flex flex-col mt-10 w-full mb-10 sm:px-15 px-10">
                    <div className="flex md:flex-row flex-col wrap items-center sm:justify-start justify-center space-x-5">
                        <label ref={exploreRef} className="text-3xl text-primary font-satoshi-bold lg:text-4xl">
                            Explore Events
                        </label>
                        <div className="flex flex-row  space-x-3 md:ml-auto md:pt-0 pt-5">
                        <button
                            className={`px-2 lg:px-4 py-2 rounded-full border ${filterPress=== "Today" ? 'border-gray-300 text-white bg-primary': 'border-gray-300 text-gray-700 hover:bg-gray-100 bg-white'} 
                            hover:scale-105 transform transition-transform duration-200`}
                            onClick={() => {
                                
                                // console.log("Today: ", filteredEvents)
                                if (filterPress=== "Today") {
                                    setFilterPress("None")
                                    setSuggestions("none");  
                                }
                                else{
                                    setFilterPress("Today")
                                    const today = new Date();
                                    const filteredEvents = allEvents.filter(event => {
                                        const eventDate = new Date(event.dates);
                                        return eventDate.toDateString() === today.toDateString();
                                    });
                                    setSuggestions(filteredEvents);

                                }
                                
                            }}
                        >
                            Today
                        </button>
                        <button
                            className={`px-2 lg:px-4 py-2 rounded-full border ${filterPress=== "Tomorrow" ? 'border-gray-300 text-white bg-primary': 'border-gray-300 text-gray-700 hover:bg-gray-100 bg-white'} 
                            hover:scale-105 transform transition-transform duration-200`}
                            onClick={() => {
                                

                                if (filterPress=== "Tomorrow") {
                                    setFilterPress("None")
                                    setSuggestions("none");  
                                }
                                else{
                                    setFilterPress("Tomorrow")
                                    const tomorrow = new Date();
                                    tomorrow.setDate(tomorrow.getDate() + 1);
                                    const filteredEvents = allEvents.filter(event => {
                                        const eventDate = new Date(event.dates);
                                        return eventDate.toDateString() === tomorrow.toDateString();
                                    });
                                    setSuggestions(filteredEvents);
                                }
                            }}
                        >
                            Tomorrow
                        </button>
                        <button
                            className={`px-2 lg:px-4 py-2 rounded-full border ${filterPress=== "This Weekend" ? 'border-gray-300 text-white bg-primary': 'border-gray-300 text-gray-700 hover:bg-gray-100 bg-white'} hover:scale-105 transform transition-transform duration-200`}
                            onClick={() => {
                                
                                
                                if (filterPress=== "This Weekend") {
                                    setFilterPress("None")
                                    setSuggestions("none");  
                                }
                                else{
                                    setFilterPress("This Weekend")
                                    const today = new Date();
                                    const weekendStart = new Date(today.setDate(today.getDate() + (6 - today.getDay())));
                                    const weekendEnd = new Date(weekendStart);
                                    weekendEnd.setDate(weekendStart.getDate() + 1);
                                    const filteredEvents = allEvents.filter(event => {
                                        const eventDate = new Date(event.dates);
                                        return eventDate >= weekendStart && eventDate <= weekendEnd;
                                    });
                                    setSuggestions(filteredEvents);

                                }
                            }}
                        >
                            This Weekend
                        </button>
                        <button
                        className={`px-2 lg:px-4 py-2 rounded-full border ${
                            filterPress === "Choose Date"
                            ? "border-gray-300 text-primary bg-primary"
                            : "border-gray-300 text-gray-700 hover:bg-gray-100 bg-white"
                        }hover:scale-105 transform transition-transform duration-200`}
                        onClick={() => {
                            if (filterPress === "Choose Date") {
                            // toggle off
                            setFilterPress("None");
                            setShowCalendar(false);
                            setSuggestions("none");          // clear filter
                            } else {
                            // toggle on
                            setFilterPress("Choose Date");
                            setShowCalendar(true);
                            }
                        }}
                        >
                        Choose Date
                        </button>

                        {/* Calendar pop‑up */}
                        {showCalendar && (
                            <div className="absolute m-auto mt-20 ml-30 z-50 w-70 h-full
                            hover:scale-105 transform transition-transform duration-200`">
                                <DatePicker
                            selected={pickedDate}
                            onChange={(date) => {
                            setPickedDate(date);
                            setShowCalendar(false);

                            // filter events
                            const filtered = allEvents.filter(ev => {
                                const evDate = new Date(ev.dates).toDateString();
                                return evDate === date.toDateString();
                            });
                            setSuggestions(filtered);
                            }}
                            inline          /* renders as a small calendar */
                            minDate={new Date()}           /* optional: no past dates */
                            className="shadow-lg rounded-xl p-2 bg-white"
                        />
                                </div>
                        
                        )}
                        </div>
                    </div>

                    

                    <div className="flex flex-wrap mt-10 gap-5 h-10/12 overflow-auto items-center sm:justify-normal justify-center">
                        {suggestions!= "none" ? (
                            
                        // <div className="absolute top-full mt-5 bg-white w-full max-w-[600px] border-gray-400 border-2 z-20 rounded-2xl">
                            suggestions.map((event, index) => {

                            
                            const isGoing = reservations && reservations.some(reservation => reservation.event_id === event.event_id);
                            return !isGoing && (
                                
                                <div key={index} className="flex relative">
                                <EventCards event={event} />
                                {userType === "alumni" && (
                                    <button
                                    className={`z-10 flex flex-row space-x-3 absolute right-5 top-35 px-4 py-2 rounded-full shadow-md hover:cursor-pointer ${
                                        !event.is_closed ? (isGoing ? 'bg-green-500 text-white' : 'bg-primary text-white') :'text-white bg-red-800'
                                    } hover:scale-105 transform transition-transform duration-200`}
                                    onClick={() => handleRSVPClick(event.event_id, event)}
                                >
                                    <label>{!event.is_closed ? isGoing ? <Star className='fill-white'/> : <Star/> : <></>}</label>
                                    <label>{!event.is_closed ? (isGoing ? 'Going' : 'RSVP'): 'Closed'}</label>
                                    </button>
                                    )
                                }
                                </div>
                            );
                            })
                        // </div>
                        ) : allEvents != null ? (
                        allEvents.map((event, index) => {
                            const isGoing = reservations && reservations.some(reservation => reservation.event_id === event.event_id);
                            return !isGoing && (
                            <div key={index} className="flex relative">
                                <EventCards event={event} />
                                {userType === "alumni" && (
                                    <button
                                    className={`z-10 flex flex-row space-x-3 absolute right-5 top-35 px-4 py-2 rounded-full shadow-md hover:cursor-pointer ${
                                        isGoing ? 'bg-green-500 text-white' : 'bg-primary text-white'
                                    } hover:scale-105 transform transition-transform duration-200`}
                                    onClick={() => handleRSVPClick(event.event_id, event)}
                                >
                                    <label>{isGoing ? <Star className='fill-white'/> : <Star/>}</label>
                                    <label>{isGoing ? 'Going' : 'RSVP'}</label>
                                    </button>
                                    )
                                }
                            </div>
                            );
                        })
                        ) : (
                        <div className="flex flex-wrap gap-5">
                            <EventCardsSkeleton />
                            <EventCardsSkeleton />
                            <EventCardsSkeleton />
                            {/* <EventCards event={sampleEvent}/> */}
                            
                        </div>
                        )}
                    </div>
                </div>

            </div>
        </>
    );
    
};

export default EventsLanding;