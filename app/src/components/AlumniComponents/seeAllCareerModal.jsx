import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import axios from 'axios';
import CircularLoading from '../LoadingComponents/circularloading';

const SeeAllCareerModal = ({ isOpen, setIsOpen, setCareerList, CareerList  }) => {
    if (!isOpen) return null;
    const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
    const [careers, setCareers] = useState([]);
    const [subCareerList, setsubCareerList] = useState(CareerList);
    const [careerInput, setCareerInput] = useState("");
    const [loading, setLoading] = useState(false);

    const closeModal = () => {
        setIsOpen(false);
    };

    // cache reference
    const cache = useRef({});

    const handleCareerSearch = (e) => {
        if (e.key === "Enter" && careerInput.trim()) {
            setsubCareerList([...subCareerList, careerInput]); // Add the input to subAffiliationList
            setCareerInput(""); // Clear the input field after submitting
        }
    };
    
    const removeCareer = (index) => {
        // Create a new array excluding the Affiliation at the given index
        const updatedCareerList = subCareerList.filter((_, i) => i !== index);
        
        // Update the state with the new list
        setsubCareerList(updatedCareerList);
    };
    
    // Without caching
    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {            
            try {
                const response = await axios.get(`${API_BASE_URL}/suggestions/all-job-titles`);
                setCareers(response.data);
                console.log("Fetched all jobs:", response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching jobs data:", error);
                setLoading(false);
            }
            
        };
    
        fetchData();
    }, []);
    

    return (
        <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-100 h-auto">
            <motion.div
                className="bg-white md:w-xl rounded-lg shadow-lg overflow-hidden md:max-w-3/5 max-w-4/5"
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
                            placeholder="Enter type of career"
                            value={careerInput}
                            onChange={(e) => setCareerInput(e.target.value)}
                            onKeyDown={handleCareerSearch}
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary">
                            <Search size={18} strokeWidth={2} />
                        </span>
                        </div>

                    </div>

                    {/* Career Tags */}
                    {subCareerList.length > 0 && (
                        <div className="flex flex-row flex-wrap mt-5 pl-10 mb-4 gap-2 items-center">
                        {subCareerList.map((career, index) => (
                            <div key={index} className="flex flex-row bg-primary rounded-full h-auto items-center px-2">
                            <h1 className="text-white font-satoshi-light truncate text-sm">{career}</h1>
                            <button className='cursor-pointer' onClick={() => removeCareer(index)}>
                                <X className="text-white ml-2 cursor-pointer" size={20} />
                            </button>
                            </div>
                        ))}
                        </div>
                    )}

                    {/* Career Suggestions (Scrollable) */}
                    <div className="flex my-5 max-h-100 overflow-y-auto px-10 items-center justify-center">
                        <div className="grid md:grid-cols-2 grid-cols-1 gap-2">
                            {careerInput === "" ? (
                                careers.map((career, index) => (
                                    !subCareerList.includes(career) && (
                                        <div key={index} className="cursor-pointer py-2 bg-gray-100 mb-3 rounded-full h-10">
                                            <button
                                                className="px-3 font-satoshi-medium w-full h-full text-left cursor-pointer truncate max-w-full"
                                                onClick={() => setsubCareerList([...subCareerList, career])}
                                            >
                                                {career}
                                            </button>
                                        </div>
                                    )
                                ))
                            ) : (
                                careers
                                    .filter((career) =>
                                        career.toLowerCase().includes(careerInput.toLowerCase())
                                    )
                                    .map((career, index) => (
                                        !subCareerList.includes(career) && (
                                            <div key={index} className="cursor-pointer py-2 bg-gray-100 mb-3 rounded-full h-10">
                                                <button
                                                    className="pl-5 font-satoshi-medium w-full h-full text-left cursor-pointer truncate max-w-full"
                                                    onClick={() => setsubCareerList([...subCareerList, career])}
                                                >
                                                    {career}
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
                            setCareerList(subCareerList);
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

export default SeeAllCareerModal;
