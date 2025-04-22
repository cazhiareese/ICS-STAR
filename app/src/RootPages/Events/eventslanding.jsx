import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import EventCards from '../../components/EventComponents/eventCards';
import EventCardsSkeleton from '../../components/EventComponents/eventCardsSkeleton'
const EventsLanding = () => {


    const [reservations, setReservations] = useState(null);
    const [allEvents, setAllEvents] = useState(null);
    const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
    const token = localStorage.getItem("token");
    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/events/confirmed`, {
                    headers: {
                      Authorization: `Bearer ${token}`
                    }
                  });
                  setReservations(response.data);
                  console.log("SDFDF")
                  console.log(reservations.length)
                  console.log("SF")
                
            } catch (error) {
                console.error('Error fetching reservations:', error);
            }
        };

        fetchReservations();
    }, []);

    useEffect(() => {
        const fetchAllEvents = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/events-visible-to`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setAllEvents(response.data);
                console.log(allEvents)

            } catch (error) {
                console.error('Error fetching all events:', error);
                console.log(allEvents)
            }
        };

        fetchAllEvents();
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
        is_closed: false,
    };


    return (
        <>
            <div className="flex flex-col mx-15">
                <div className="flex justify-center p-6 shadow-xl rounded-2xl">
                    <input
                        type="text"
                        placeholder="Search donation drives..."
                        className="w-full lg:w-1/2 max-w-[600px] px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
    
                <div className="flex flex-col mt-12 mb-8 w-full ">
                    <div className="flex flex-row items-end space-x-5">
                        <label className="text-3xl text-primary font-satoshi-bold">Your Reservations</label>
                        <label className="text-xl text-primary font-satoshi-light">({reservations == null ? "0": reservations.length})</label>
                    </div>
    
                    <div className="flex flex-row mt-5 gap-5 overflow-scroll">
                        {reservations != null ? (
                            reservations.length > 0 ? (
                                reservations.map((reservation, index) => (
                                    <div key={index} className="flex">
                                        <EventCards event={reservation} />
                                    </div>
                                ))):

                               <div className="font-satoshi-light text-primary">You do not have any reservations yet.</div>
                        ) : (
                            <div className="flex gap-5">
                                <EventCardsSkeleton />
                                <EventCardsSkeleton />
                                <EventCardsSkeleton />
                                <EventCardsSkeleton />
                                <EventCards event={sampleEvent} />
                            </div>
                        )}
                    </div>
                </div>
    
                <div cslassName="flex flex-col mt-10 w-full">
                    <div className="flex flex-row items-end space-x-5">
                        <label className="text-4xl text-primary font-satoshi-bold">Explore Events</label>
                    </div>
    
                    <div className="flex flex-wrap mt-10 gap-5">
                        {allEvents != null ? (
                            allEvents.map((events, index) => (
                                <div key={index} className="flex">
                                    <EventCards event={events} />
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-wrap gap-5">
                                <EventCardsSkeleton />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
    
};

export default EventsLanding;