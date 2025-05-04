import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import axios from 'axios';
import CircularLoading from '../LoadingComponents/circularloading';

const SeeAllIndustryModal = ({ isOpen, setIsOpen, setIndustryList, IndustryList  }) => {
    if (!isOpen) return null;
    const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
    const [industries, setIndustries] = useState([]);
    const [subIndustryList, setsubIndustryList] = useState(IndustryList);
    const [industryInput, setIndustryInput] = useState("");
    const [loading, setLoading] = useState(false);

    const closeModal = () => {
        setIsOpen(false);
    };

    // cache reference
    const cache = useRef({});

    const handleIndustrySearch = (e) => {
        if (e.key === "Enter" && industryInput.trim()) {
            setsubIndustryList([...subIndustryList, industryInput]); // Add the input to subAffiliationList
            setIndustryInput(""); // Clear the input field after submitting
        }
    };
    
    const removeIndustry = (index) => {
        // Create a new array excluding the Affiliation at the given index
        const updatedIndustryList = subIndustryList.filter((_, i) => i !== index);
        
        // Update the state with the new list
        setsubIndustryList(updatedIndustryList);
    };
    
    // Without caching
    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {            
            try {
                const response = await axios.get(`${API_BASE_URL}/suggestions/all-industries`);
                setIndustries(response.data);
                console.log("Fetched all industries:", response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching industries data:", error);
                setLoading(false);
            }
            
        };
    
        fetchData();
    }, []);
    

    return (
        <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-100 h-auto">
            <motion.div
                className="bg-white md:w-xl md:max-w-3/5 max-w-4/5 rounded-lg shadow-lg overflow-hidden"
                initial={{ opacity: 0, y: -100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
                transition={{ duration: 0.3 }}
            >
                <div className="flex justify-between items-center p-4">
                    <button className="ml-auto outline-1 outline-gray-400 rounded-full p-2 cursor-pointer" onClick={closeModal}>
                        <X size={16} />
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-96 md:w-xl w-xs bg-white">
                        <CircularLoading /> 
                    </div>
                ) : (
                <div className="p-4 max-h-[100vh]">
                    <div className="px-5 flex items-center justify-center flex-row gap-2 border-b-1 border-gray-300 pb-5">
                        <div className="relative w-full flex items-center justify-center">
                            <input
                                type="search"
                                className="bg-white text-black border h-12 border-gray-300 focus:border-primary focus:outline-none rounded-2xl w-full pl-10 pr-4 py-2"
                                placeholder="Enter type of industry"
                                value={industryInput}
                                onChange={(e) => setIndustryInput(e.target.value)}
                                onKeyDown={handleIndustrySearch}
                            />
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary">
                                <Search size={18} strokeWidth={2} />
                            </span>
                        </div>

                    </div>

                    {/* Industry Tags */}
                    {subIndustryList.length > 0 && (
                        <div className="flex flex-row flex-wrap mt-5 pl-10 mb-4 gap-2 items-center">
                        {subIndustryList.map((industry, index) => (
                            <div key={index} className="flex flex-row bg-primary rounded-full h-auto items-center px-2">
                            <h1 className="text-white font-satoshi-light truncate text-sm">{industry}</h1>
                            <button className='cursor-pointer' onClick={() => removeIndustry(index)}>
                                <X className="text-white ml-2 cursor-pointer" size={20} />
                            </button>
                            </div>
                        ))}
                        </div>
                    )}

                    {/* Industry Suggestions (Scrollable) */}
                    <div className="flex my-5 max-h-100 overflow-y-auto px-10 items-center justify-center">
                        <div className="grid md:grid-cols-2 grid-cols-1 gap-2">
                            {industryInput === "" ? (
                                industries.map((industry, index) => (
                                    !subIndustryList.includes(industry) && (
                                        <div key={index} className="cursor-pointer py-2 bg-gray-100 mb-3 rounded-full h-10">
                                            <button
                                                className="px-3 font-satoshi-medium w-full h-full text-left cursor-pointer truncate max-w-full"
                                                onClick={() => setsubIndustryList([...subIndustryList, industry])}
                                            >
                                                {industry}
                                            </button>
                                        </div>
                                    )
                                ))
                            ) : (
                                industries
                                    .filter((industry) =>
                                        industry.toLowerCase().includes(industryInput.toLowerCase())
                                    )
                                    .map((industry, index) => (
                                        !subIndustryList.includes(industry) && (
                                            <div key={index} className="cursor-pointer py-2 bg-gray-100 mb-3 rounded-full h-10">
                                                <button
                                                    className="pl-5 font-satoshi-medium w-full h-full text-left cursor-pointer truncate max-w-full"
                                                    onClick={() => setsubIndustryList([...subIndustryList, industry])}
                                                >
                                                    {industry}
                                                </button>
                                            </div>
                                        )
                                    ))
                            )}
                        </div>
                    </div>


                    {/* Buttons for clear and confirm */}
                    <div className="flex items-center justify-center px-5 border-t-1 border-gray-300 pt-5">
                        {/* Confirm */}
                        <button onClick={() => {
                            setIndustryList(subIndustryList);
                            setIsOpen(false);
                        }} className="bg-primary text-white px-4 py-2 rounded-2xl hover:bg-primary-dark hover:bg-blue-950 cursor-pointer shadow-2xl">
                            Confirm
                        </button>
                    </div>
                </div>)}
            </motion.div>
        </div>
    );
};

export default SeeAllIndustryModal;
