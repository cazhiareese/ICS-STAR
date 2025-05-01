import { motion } from "framer-motion";
import { ChevronDown, Search, X } from "lucide-react"; // Assuming you're using React Feather for icons
import axios from 'axios';
import React, {useState, useEffect, useRef } from 'react';

const AlumniSkillsFilter = ({
  isSkillsExpanded,
  setIsSkillsExpanded,
  skillsInput,
  setSkillsInput,
  skillsList,
  setSkillsList,
  setIsLocationExpanded,
  setIsSeeAllSkillOpen
}) => {
  // BASE URL ENV
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const [skills, setSkills] = useState([]); 
  // cache reference
  const cache = useRef({});

  //Search Suggestions
  useEffect(() => {
    const fetchData = async () => {
      // Check if the input is empty, and use the cached data for top skills if available
      if (!skillsInput) {
        if (cache.current["top-skills"]) {
          setSkills(cache.current["top-skills"]);
          console.log("Using cached top skills:", cache.current["top-skills"]);
          return; // Skip the API call if we have cached data
        }

        try {
          const response = await axios.get(`${API_BASE_URL}/suggestions/top-skills`);
          setSkills(response.data);
          cache.current["top-skills"] = response.data; // Cache the response
          console.log("Fetched top skills:", response.data);
        } catch (error) {
          console.error("Error fetching skills data:", error);
        }
      } else {
        const query = skillsInput.trim().toLowerCase();
        
        if (cache.current[query]) {
          setSkills(cache.current[query]); // Use the cached result if available
          console.log("Using cached skills for input:", query, cache.current[query]);
          return;
        }

        try {
          const response = await axios.get(`${API_BASE_URL}/autocomplete/skills?q=${encodeURIComponent(query)}&limit=5`);
          setSkills(response.data);
          cache.current[query] = response.data; // Cache the result for future use
          console.log("Fetched skills for input:", query, response.data);
        } catch (error) {
          console.error("Error fetching skills data:", error);
        }
      }
    };

    fetchData();
  }, [skillsInput]);
  
    // Handle the enter key press
  const handleSkillsSearch = (e) => {
    if (e.key === "Enter" && skillsInput.trim()) {
      setSkillsList([...skillsList, skillsInput]); // Add the input to careerList
      setSkillsInput(""); // Clear the input field after submitting
    }
  };

  const removeSkill = (index) => {
    // Create a new array excluding the career at the given index
    const updatedSkillList = skillsList.filter((_, i) => i !== index);
    
    // Update the state with the new list
    setSkillsList(updatedSkillList);
  };

  // Filter jobs based on user input
  // const filteredSkills = skills.filter(skill => skill.toLowerCase().includes(skillsInput.toLowerCase()));

  return (

    

    <div className="flex flex-col shadow-md mt-5 rounded-lg bg-white lg:bg-transparent">
      <div className="flex flex-row px-5 py-3" onClick={() => setIsSkillsExpanded(!isSkillsExpanded)}>
        <motion.h1
          className="flex-1/2 font-satoshi-medium"
          initial={{ fontWeight: 500, fontSize: "1.00rem" }}
          animate={{
            fontWeight: isSkillsExpanded ? 600 : 500, // Bold when expanded
            fontSize: isSkillsExpanded ? "1.50rem" : "1.25rem", // lg: 1.25rem, sm: 0.875rem
          }}
          transition={{ duration: 0.2 }}
        >
          Skills and Interests
        </motion.h1>

        <motion.button
          className="cursor-pointer hover:text-primary"
          animate={{ rotate: isSkillsExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={30} />
        </motion.button>
      </div>

      {/* Alumni Career */}
      <motion.div
        className="overflow-hidden"
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: isSkillsExpanded ? "auto" : 0, opacity: isSkillsExpanded ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="px-5 flex items-center justify-center flex-row gap-2">
          <div className="relative w-full justify-center items-center flex">
            <input
              type="search"
              className="bg-white text-black border h-12 border-gray-300 focus:border-primary focus:outline-none rounded-2xl w-11/12 pl-10 pr-4 py-2"
              placeholder="Enter type of career"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)} // Update input value
              onKeyDown={handleSkillsSearch} // Handle enter key press
            />
            <span className="absolute left-8 top-1/2 transform -translate-y-1/2 text-primary">
              <Search size={18} strokeWidth={2} />
            </span>
          </div>
        </div>

        {/* Career Tags */}
        {skillsList.length > 0 && (
          <div className="flex flex-row flex-wrap mt-5 pl-10 mb-4 gap-2 items-center">
            {skillsList.map((skill, index) => (
              <div key={index} className="flex flex-row bg-primary rounded-full h-auto items-center px-2">
                <h1 className="text-white font-satoshi-light truncate text-sm">{skill}</h1>
                <button onClick={() => removeSkill(index)}>
                  <X className="text-white ml-2" size={20} />
                </button>
              </div>
            ))}
          </div>
        )}


        <div className="flex flex-row px-12 pb-3 pt-5">
          <h1 className="flex-1 text-gray-400">Suggestions</h1>
          <button onClick={() => setIsSeeAllSkillOpen(true)}>
            <h1 className="underline text-primary hover:text-blue-700 cursor-pointer">See all</h1>
          </button>
        </div>

        {/* Job Suggestions */}
        <ul>
          {skillsInput === "" ? (
            skills.slice(0, 4).map((skill, index) => (
              !skillsList.includes(skill) && ( // Check if job is not already in careerList
                <div key={index} className="cursor-pointer py-2 bg-gray-100 mb-3 mx-12 rounded-full h-10">
                  <button
                    className="pl-5 font-satoshi-medium w-full h-full text-left cursor-pointer"
                    onClick={() => setSkillsList([...skillsList, skill])}
                  >
                    {skill}
                  </button>
                </div>
              )
            ))
          ) : (
            skills.map((skill, index) => (
              !skillsList.includes(skill) && ( // Check if job is not already in careerList
                <div key={index} className="cursor-pointer py-2 bg-gray-100 mb-3 mx-12 rounded-full h-10">
                  <button
                    className="pl-5 font-satoshi-medium w-full h-full text-left cursor-pointer"
                    onClick={() => setSkillsList([...skillsList, skill])}
                  >
                    {skill}
                  </button>
                </div>
              )
            ))
          )}
        </ul>

        {/* Buttons for skip and next for mobile*/}
        <div className="flex lg:hidden justify-between px-5 pb-3">
          <button
            onClick={() => {setSkillsList([]); 
              setIsSkillsExpanded(false);}}
            className="text-black px-4 py-2 rounded-lg underline font-satoshi-medium cursor-pointer hover:text-gray-500"
          >
            Skip
          </button>

          <button onClick={() => {
           setIsSkillsExpanded(false);
          }} className="bg-primary text-white px-4 py-2 rounded-2xl hover:bg-primary-dark hover:bg-blue-950 cursor-pointer">
            Next
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AlumniSkillsFilter;
