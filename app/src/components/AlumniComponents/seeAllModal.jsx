import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import axios from 'axios';

const SeeAllAffiliationModal = ({ isOpen, setIsOpen, setAffiliationList, affiliationList  }) => {
    if (!isOpen) return null;
    const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
    const [affiliations, setAffiliations] = useState([]);
    const [pickedAffiliations, setPickedAffiliations] = useState([]);
    const [subAffiliationList, setsubAffiliationList] = useState(affiliationList);
    const [affiliationInput, setAffiliationInput] = useState("");

    const closeModal = () => {
        setIsOpen(false);
    };

    // cache reference
    const cache = useRef({});

    const handleAffiliationSearch = (e) => {
        if (e.key === "Enter" && affiliationInput.trim()) {
            setsubAffiliationList([...subAffiliationList, affiliationInput]); // Add the input to subAffiliationList
            setAffiliationInput(""); // Clear the input field after submitting
        }
    };
    
    const removeAffiliation = (index) => {
        // Create a new array excluding the Affiliation at the given index
        const updatedAffiliationList = subAffiliationList.filter((_, i) => i !== index);
        
        // Update the state with the new list
        setsubAffiliationList(updatedAffiliationList);
    };

    // useEffect(() => {
    //     const fetchData = async () => {
    //         const query = affiliationInput.trim().toLowerCase();
    
    //         if (query === "") {
    //             if (cache.current["all-affiliations"]) {
    //                 setAffiliations(cache.current["all-affiliations"]);
    //                 console.log("Using cached affiliations:", cache.current["all-affiliations"]);
    //                 return;
    //             }
    
    //             try {
    //                 const response = await axios.get(`${API_BASE_URL}/suggestions/all-affiliations`);
    //                 setAffiliations(response.data);
    //                 cache.current["all-affiliations"] = response.data;
    //                 console.log("Fetched all affiliations:", response.data);
    //             } catch (error) {
    //                 console.error("Error fetching affiliations data:", error);
    //             }
    //         } else {
    //             if (cache.current[query]) {
    //                 setAffiliations(cache.current[query]);
    //                 console.log("Using cached affiliations for input:", query, cache.current[query]);
    //                 return;
    //             }
    
    //             try {
    //                 const response = await axios.get(
    //                     `${API_BASE_URL}/autocomplete/affiliations?q=${encodeURIComponent(query)}&limit=5`
    //                 );
    //                 setAffiliations(response.data);
    //                 cache.current[query] = response.data;
    //                 console.log("Fetched affiliations for input:", query, response.data);
    //             } catch (error) {
    //                 console.error("Error fetching affiliations data:", error);
    //             }
    //         }
    //     };
    
    //     fetchData();
    // }, [affiliationInput]);
    
    // Without caching
    useEffect(() => {
        const fetchData = async () => {            
            try {
                const response = await axios.get(`${API_BASE_URL}/suggestions/all-affiliations`);
                setAffiliations(response.data);
                console.log("Fetched all affiliations:", response.data);
            } catch (error) {
                console.error("Error fetching affiliations data:", error);
            }
            
        };
    
        fetchData();
    }, [affiliationInput]);
    

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
                            className="bg-white text-black border h-12 border-gray-300 focus:border-primary focus:outline-none rounded-2xl w-full pl-10 pr-4 py-2"
                            placeholder="Enter type of Affiliation"
                            value={affiliationInput}
                            onChange={(e) => setAffiliationInput(e.target.value)}
                            onKeyDown={handleAffiliationSearch}
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary">
                            <Search size={18} strokeWidth={2} />
                        </span>
                        </div>

                    </div>

                    {/* Affiliation Tags */}
                    {subAffiliationList.length > 0 && (
                        <div className="flex flex-row flex-wrap mt-5 pl-10 mb-4 gap-2 items-center">
                        {subAffiliationList.map((Affiliation, index) => (
                            <div key={index} className="flex flex-row bg-primary rounded-full h-auto items-center px-2">
                            <h1 className="text-white font-satoshi-light truncate text-sm">{Affiliation}</h1>
                            <button className='cursor-pointer' onClick={() => removeAffiliation(index)}>
                                <X className="text-white ml-2 cursor-pointer" size={20} />
                            </button>
                            </div>
                        ))}
                        </div>
                    )}

                    {/* affiliations Suggestions (Scrollable) */}
                    <div className="flex my-5 max-h-100 overflow-y-auto pr-2 px-10 items-center justify-center">
                        <div className="grid md:grid-cols-2 grid-cols-1 gap-2">
                            {affiliationInput === "" ? (
                                affiliations.map((affiliation, index) => (
                                    !subAffiliationList.includes(affiliation) && (
                                        <div key={index} className="cursor-pointer py-2 bg-gray-100 mb-3 rounded-full h-10">
                                            <button
                                                className="pl-5 font-satoshi-medium w-full h-full text-left cursor-pointer truncate max-w-full"
                                                onClick={() => setsubAffiliationList([...subAffiliationList, affiliation])}
                                            >
                                                {affiliation}
                                            </button>
                                        </div>
                                    )
                                ))
                            ) : (
                                affiliations
                                    .filter((affiliation) =>
                                        affiliation.toLowerCase().includes(affiliationInput.toLowerCase())
                                    )
                                    .map((affiliation, index) => (
                                        !subAffiliationList.includes(affiliation) && (
                                            <div key={index} className="cursor-pointer py-2 bg-gray-100 mb-3 rounded-full h-10">
                                                <button
                                                    className="pl-5 font-satoshi-medium w-full h-full text-left cursor-pointer truncate max-w-full"
                                                    onClick={() => setsubAffiliationList([...subAffiliationList, affiliation])}
                                                >
                                                    {affiliation}
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
                            setAffiliationList(subAffiliationList);
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

export default SeeAllAffiliationModal;
