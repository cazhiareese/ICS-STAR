import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import axios from 'axios';

const SeeAllLocationModal = ({ isOpen, setIsOpen, setLocationList, locationList }) => {
    if (!isOpen) return null;
    const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
    const [locations, setLocations] = useState([]);
    const [subLocationList, setsubLocationList] = useState(locationList);
    const [locationInput, setLocationInput] = useState("");

    const closeModal = () => {
        setIsOpen(false);
    };

    const handleLocationSearch = (e) => {
        if (e.key === "Enter" && locationInput.trim()) {
            setsubLocationList([...subLocationList, locationInput]); 
            setLocationInput(""); // Clear the input field after submitting
        }
    };
    
    const removeLocation = (index) => {
        // Create a new array excluding the Affiliation at the given index
        const updatedLocationList = subLocationList.filter((_, i) => i !== index);
        
        // Update the state with the new list
        setsubLocationList(updatedLocationList);
    };

    
    // Without caching
    useEffect(() => {
        const fetchData = async () => {            
            try {
                const response = await axios.get(`${API_BASE_URL}/suggestions/all-cities`);
                setLocations(response.data);
                console.log("Fetched all cities:", response.data);
            } catch (error) {
                console.error("Error fetching cities data:", error);
            }
            
        };
    
        fetchData();
    }, [locationInput]);
    

    return (
        <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50 h-auto">
            <motion.div
                className="bg-white w-11/12 md:w-auto rounded-lg shadow-lg overflow-hidden"
                initial={{ opacity: 0, y: -100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
                transition={{ duration: 0.3 }}
            >
                <div className="flex justify-between items-center p-4">
                    <button className="ml-auto outline-1 outline-gray-400 rounded-full p-2 cursor-pointer" onClick={closeModal}>
                        <X size={26} />
                    </button>
                </div>

                <div className="p-4 max-h-[100vh]">
                    <div className="px-5 flex items-center justify-center flex-row gap-2">
                    <div className="relative w-full flex items-center justify-center">
                        <input
                            type="search"
                            className="bg-white text-black border h-12 border-gray-300 focus:border-primary focus:outline-none rounded-2xl w-11/12 pl-10 pr-4 py-2"
                            placeholder="Enter Location"
                            value={locationInput}
                            onChange={(e) => setLocationInput(e.target.value)} 
                            onKeyDown={handleLocationSearch} 
                        />
                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-primary">
                            <Search size={18} strokeWidth={2} />
                        </span>
                    </div>

                    </div>

                    {/* Location Tags */}
                    {subLocationList.length > 0 && (
                        <div className="flex flex-row flex-wrap mt-5 pl-10 mb-4 gap-2 items-center">
                        {subLocationList.map((location, index) => (
                            <div key={index} className="flex flex-row bg-primary rounded-full h-auto items-center px-2">
                            <h1 className="text-white font-satoshi-light truncate text-sm">{location}</h1>
                            <button className='cursor-pointer' onClick={() => removeLocation(index)}>
                                <X className="text-white ml-2 cursor-pointer" size={20} />
                            </button>
                            </div>
                        ))}
                        </div>
                    )}

                    {/* Locations Suggestions (Scrollable) */}
                    <div className="flex my-5 max-h-100 overflow-y-auto px-10 items-center justify-center">
                        <div className="grid md:grid-cols-2 grid-cols-1 gap-2">
                            {locationInput === "" ? (
                                locations.map((location, index) => (
                                    !subLocationList.includes(location) && (
                                        <div key={index} className="cursor-pointer py-2 bg-gray-200 mb-3 rounded-full h-10">
                                            <button
                                                className="px-5 font-satoshi-medium w-full h-full text-left cursor-pointer truncate max-w-full"
                                                onClick={() => setsubLocationList([...subLocationList, location])}
                                            >
                                                {location}
                                            </button>
                                        </div>
                                    )
                                ))
                            ) : (
                                locations
                                    .filter((location) =>
                                        location.toLowerCase().includes(locationInput.toLowerCase())
                                    )
                                    .map((location, index) => (
                                        !subLocationList.includes(location) && (
                                            <div key={index} className="cursor-pointer py-2 bg-gray-100 mb-3 rounded-full h-10">
                                                <button
                                                    className="pl-5 font-satoshi-medium w-full h-full text-left cursor-pointer truncate max-w-full"
                                                    onClick={() => setsubLocationList([...subLocationList, location])}
                                                >
                                                    {location}
                                                </button>
                                            </div>
                                        )
                                    ))
                            )}
                        </div>
                    </div>


                    {/* Buttons for clear and confirm */}
                    <div className="flex items-center justify-center px-5">
                        {/* Confirm */}
                        <button onClick={() => {
                            setLocationList(subLocationList);
                            setIsOpen(false);
                        }} className="bg-primary text-white px-4 py-2 rounded-2xl hover:bg-primary-dark hover:bg-blue-950 cursor-pointer shadow-2xl">
                            Confirm
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default SeeAllLocationModal;
