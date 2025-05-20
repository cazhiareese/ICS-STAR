import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { MapPinned, Calendar, Star, Search, Filter } from 'lucide-react';
import axios from 'axios';
import EventCards from './EventComponents/eventCards';
import EventCardsSkeleton from './EventComponents/eventCardsSkeleton'
import "../../index.css";
import { samp } from 'framer-motion/client';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { jwtDecode } from "jwt-decode";
import ModalTemplate from '../../AuthPages/modaltemplate';
import { set } from 'date-fns';

const EventsLanding = () => {


    const [showCalendar, setShowCalendar] = useState(false);
    const [pickedDate, setPickedDate] = useState(null);
    const [showModal, setshowModal] = useState(false);

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
    

    const [skeleton, setSkeleton] = useState(true);
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
    setUserId(userid);
    setUser(userid);
    setUserType(tokentype);     
},[])



    //cyrus was here


    const fetchAllEvents = async (dateFilter = null) => {
        setSkeleton(true);
        try {
          const config = {
            headers: tokentype === "guest" ? {} : { Authorization: `Bearer ${token}` },
            withCredentials: true,
            params: dateFilter ? { date_filter: dateFilter } : {}
          };
      
          const response = await axios.get(`${API_BASE_URL}/events-visible-to`, config);
          setAllEvents(response.data);
          setSuggestions("none"); // Reset suggestions
          if (dateFilter&&response.data.length== 0) {
            setSuggestions("zero");
          }
        } catch (error) {
          console.error("Error fetching events:", error);
        }
        setSkeleton(false);
      };
    useEffect(() => {
        console.log("SDFSDD")
        console.log(API_BASE_URL)

        const fetchReservations = async () => {
            try {
              const config = tokentype === "guest"
                ? {}
                : { headers: { Authorization: `Bearer ${token}` }, withCredentials: true };
          
              const response = await axios.get(`${API_BASE_URL}/events/confirmed`, config);
              setReservations(response.data);
              console.log(reservations.length);
            } catch (error) {
              console.error("Error fetching reservations:", error);
            }
          };
          
          fetchReservations();
          setReservationSignal(false);
          console.log("RESERVATION SIGNAL");
          
          fetchAllEvents();
          
        // setAllEvents([sampleEvent1, sampleEvent2, sampleEvent3, sampleEvent4]);
        
        console.log("RESERVATION SIGNALasdfasdf")
    }, []);

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
                window.location.reload();
            })
            .catch(error => {
                console.error("Error canceling RSVP:", error);
            });
            
            
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
            
        }
    }

    if (user === null) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-2xl font-bold">Loading...</h1>
            </div>
        );
    }
    return (
        <>
        <div className="flex flex-col items-center bg-[#F8F9FB]">
        <div className="flex flex-col w-full bg-whitey shadow-md  items-center rounded-b-[35px] bg-white">
        <div className={`w-full z-40 transition-all duration-800 ease-in-out flex justify-center ${isSticky ? 'fixed top-0 shadow-md' : 'relative'}`}>
        <div className="flex items-center justify-center w-full max-w-[1200px] px-4 py-4 mt-2">
    <div className="relative flex w-full max-w-[350px] sm:max-w-[600px]">
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search Available Events"
        className="bg-gray-100 font-satoshi-medium text-lg w-full px-4 py-3 pr-14 rounded-2xl text-black border border-gray-300 focus:border-primary focus:outline-none focus:ring-0"
        onChange={async (e) => {
            setSkeleton(true);
            const value = e.target.value;
            setSearchInput(value);
          
            if (value.trim() === "") {
              setSuggestions("none");
              return;
            }
          
            try {
              const response = await axios.get(`${API_BASE_URL}/search-event`, {
                params: { q: value },
              });
          
              const eventNames = response.data;
              const matchedEvents = allEvents?.filter(event =>
                eventNames.includes(event.title)
              );
          
              if (!matchedEvents || matchedEvents.length === 0) {
                setSuggestions("zero");
              } else {
                setSuggestions(matchedEvents);
              }
            } catch (error) {
              console.error("Error fetching search suggestions:", error);
              setSuggestions("zero");
            }
            setSkeleton(false);
          }}
          
        value={searchInput}
      />

      {/* Search Button */}
      <div className="absolute right-0 top-0 h-full bg-primary text-white p-3 rounded-2xl hover:brightness-125 flex items-center justify-center w-20 cursor-pointer">
        <Search size={20} />
      </div>
    </div>
  </div>
</div>
</div>

{/* Spacer to prevent layout shift */}
<div className="h-28"></div>

                
                <div className="flex flex-col -mt-20 mb-8 w-full sm:px-15 sm:items-start items-center">
                {tokentype !== "student" && User !== null && (
  <div className="flex flex-row items-end space-x-5">
    <label className="text-3xl text-primary font-satoshi-bold">Your Reservations</label>
    <label className="text-xl text-primary font-satoshi-light">
      ({reservations == null ? "0" : reservations.length})
    </label>
  </div>
)}

                    {userType === "alumni" && (
                        <div className="flex flex-row mt-5 sm:mr-10  sm:ml-0 sm:mx-0 mx-auto gap-5 overflow-x-scroll sm:w-full w-[90%] px-2 py-5">
                        {reservations != null ? (
                            reservations.length > 0 ? (
                                reservations.map((reservation, index) => (
                                    <div key={index} className="flex relative ">
                                        <EventCards event={reservation} reservationExclusiveWidth={true}/>
                                        
                                        <button
                                            className="z-10 flex flex-row space-x-3 absolute right-5 top-35 px-4 py-2 rounded-full shadow-md hover:cursor-pointer bg-green-500 text-whitey"
                                            onClick={() => setshowModal(true)}
                                        >
                                            <Star className="fill-white" />
                                            <label>Going</label>
                                        </button>
                                        {showModal && (
                                            <ModalTemplate
                                                isOpen={showModal}
                                                onClose={() => setshowModal(false)}
                                                choiceclose="Close"
                                                onContinue={()=>handleRSVPClick(reservation.event_id, reservation)}
                                                choicecontinue="Cancel RSVP"
                                                information="This will remove your attendance from the event."
                                                header="Cancel RSVP?"
                                                color="bg-red-700"
                                            >
                                            </ModalTemplate>
                                        )}
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

                <div className="flex flex-col mt-10 w-full mb-10 sm:px-15">
                    <div className="flex md:flex-row flex-col wrap items-center sm:justify-start justify-center space-x-5">
                        <label ref={exploreRef} className="text-3xl text-primary font-satoshi-bold lg:text-4xl">
                            Explore Events
                        </label>
                        <div className="flex flex-row  space-x-3 md:ml-auto md:pt-0 pt-5">
                        <button
                            className={`px-2 lg:px-4 py-2 rounded-full border ${filterPress=== "Today" ? 'border-gray-300 text-white bg-primary': 'border-gray-300 text-gray-700 hover:bg-gray-100 bg-white'} `}
                            onClick={() => {
                                if (filterPress === "Today") {
                                  setFilterPress("None");
                                  fetchAllEvents(); // reset to all
                                } else {
                                  setFilterPress("Today");
                                  fetchAllEvents("today");
                                }
                              }}
                        >
                            Today
                        </button>
                        <button
                            className={`px-2 lg:px-4 py-2 rounded-full border ${filterPress=== "Tomorrow" ? 'border-gray-300 text-white bg-primary': 'border-gray-300 text-gray-700 hover:bg-gray-100 bg-white'} `}
                            onClick={() => {
                                if (filterPress === "Tomorrow") {
                                  setFilterPress("None");
                                  fetchAllEvents(); // reset to all
                                } else {
                                  setFilterPress("Tomorrow");
                                  fetchAllEvents("tomorrow");
                                }
                              }}
                        >
                            Tomorrow
                        </button>
                        <button
                            className={`px-2 lg:px-4 py-2 rounded-full border ${filterPress=== "This Weekend" ? 'border-gray-300 text-white bg-primary': 'border-gray-300 text-gray-700 hover:bg-gray-100 bg-white'} `}
                            onClick={() => {
                                if (filterPress === "This Weekend") {
                                  setFilterPress("None");
                                  fetchAllEvents(); // reset to all
                                } else {
                                  setFilterPress("This Weekend");
                                  fetchAllEvents("this_weekend");
                                }
                              }}
                        >
                            This Weekend
                        </button>
                        <button
                        className={`px-2 lg:px-4 py-2 rounded-full border ${
                            filterPress === "Choose Date"
                            ? "border-gray-300 text-white bg-primary"
                            : "border-gray-300 text-gray-700 hover:bg-gray-100 bg-white"
                        }`}
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
                            <div className="absolute m-auto z-50 w-65 h-100 right-10 pt-20 ">
                                <DatePicker
                            selected={pickedDate}
                            onChange={(date) => {
                                setPickedDate(date);
                                setShowCalendar(false);

                                setFilterPress("Choose Date");
                                const formattedDate = date.toISOString().split("T")[0];
                                fetchAllEvents(formattedDate);
                            }}
                            inline          /* renders as a small calendar */
                            minDate={new Date()}           /* optional: no past dates */
                            className="shadow-lg rounded-xl p-2 bg-white"
                        />
                                </div>
                        
                        )}
                        </div>
                    </div>

                    

                    <div className="grid 2xl:grid-cols-4 xl:grid-cols-3 md:grid-cols-2 mt-10 gap-5 h-10/12 overflow-auto justify-start sm:mx-0 mx-10 sm:justify-start">
                        
                        {skeleton ? (
                            <>
                            <EventCardsSkeleton />
                            <EventCardsSkeleton />
                            <EventCardsSkeleton />
                            <EventCardsSkeleton />
                            </>
                        ) : suggestions!= "none" && suggestions!="zero" ? (
                            
                        // <div className="absolute top-full mt-5 bg-white w-full max-w-[600px] border-gray-400 border-2 z-20 rounded-2xl">
                            suggestions.map((event, index) => {
                            const isGoing = reservations && reservations.some(reservation => reservation.event_id === event.event_id);
                            return !isGoing && (
                                <div key={index} className="flex relative ">
                                <EventCards event={event} reservationExclusiveWidth={true}/>
                                </div>
                            );
                            })
                        // </div>
                        ) 
                        : suggestions==="zero" ? (<div>
                            <label className="font-satoshi-light text-primary text-4xl overflow">No events found.</label>
                        </div>
                        
                    
                        ) 
                        : allEvents != null ? (
                        allEvents.map((event, index) => {
                            const isGoing = reservations && reservations.some(reservation => reservation.event_id === event.event_id);
                            return !isGoing && (
                            <div key={index} className="flex relative ">
                                <EventCards event={event} />

                            </div>
                            );
                        })
                        ) : (
                            <>
                            <EventCardsSkeleton />
                            <EventCardsSkeleton />
                            <EventCardsSkeleton />
                            <EventCardsSkeleton />
                            </>
                        
                        )}
                    </div>
                </div>
            </div>
            
        </>
    );
};

export default EventsLanding;