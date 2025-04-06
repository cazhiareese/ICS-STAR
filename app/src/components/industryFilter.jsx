import { motion } from "framer-motion";
import { ChevronDown, Search, X } from "lucide-react"; 
import axios from 'axios';
import React, {useState, useEffect, useRef} from 'react';

const AlumniIndustryFilter = ({
  isIndustryExpanded,
  setIsIndustryExpanded,
  industryInput,
  setIndustryInput,
  industryList,
  setIndustryList,
  setIsSkillsExpanded,
  setIsAlumniProfessionExpanded
}) => {

  const [industries, setIndustries] = useState([]); 
   const cache = useRef({}); //cache reference
  useEffect(() => {
    const fetchData = async () => {
      if (!industryInput) {
        // Check cache for top industries
        if (cache.current["top-industries"]) {
          setIndustries(cache.current["top-industries"]);
          console.log("Using cached top industries:", cache.current["top-industries"]);
          return; // Skip API call if cached data exists
        }

        try {
          const response = await axios.get("https://ics-star-api.vercel.app/suggestions/top-industries");
          setIndustries(response.data);
          cache.current["top-industries"] = response.data; // Cache the result
          console.log("Fetched top industries:", response.data);
        } catch (error) {
          console.error("Error fetching industry data:", error);
        }
      } else {
        const query = industryInput.trim().toLowerCase();
        
        // Check cache for industries based on user input
        if (cache.current[query]) {
          setIndustries(cache.current[query]); // Use cached data if it exists
          console.log("Using cached industries for input:", query, cache.current[query]);
          return;
        }

        try {
          const response = await axios.get(`https://ics-star-api.vercel.app/autocomplete/industries?q=${encodeURIComponent(query)}&limit=5`);
          setIndustries(response.data);
          cache.current[query] = response.data; // Cache the result for future use
          console.log("Fetched industries for input:", query, response.data);
        } catch (error) {
          console.error("Error fetching industry data:", error);
        }
      }
    };

    fetchData();
  }, [industryInput]);
  

  // Handle the enter key press
  const handleIndustrySearch = (e) => {
    if (e.key === "Enter" && industryInput.trim()) {
      setIndustryList([...industryList, industryInput]); // Add the input to IndustryList
      setIndustryInput(""); // Clear the input field after submitting
    }
  };

  const removeIndustry = (index) => {
    // Create a new array excluding the Industry at the given index
    const updatedIndustryList = industryList.filter((_, i) => i !== index);
    
    // Update the state with the new list
    setIndustryList(updatedIndustryList);
  };

  // Filter industrys based on user input
  // const filteredIndustries = industries.filter(industry => industry.toLowerCase().includes(industryInput.toLowerCase()));

  return (

    

    <div className="flex flex-col shadow-md mt-5 rounded-lg bg-white lg:bg-transparent">
      <div className="flex flex-row px-5 py-3" onClick={() => setIsIndustryExpanded(!isIndustryExpanded)}>
        <motion.h1
          className="flex-1/2 font-satoshi-medium"
          initial={{ fontWeight: 500, fontSize: "1.00rem" }}
          animate={{
            fontWeight: isIndustryExpanded ? 600 : 500, // Bold when expanded
            fontSize: isIndustryExpanded ? "1.50rem" : "1.25rem", // lg: 1.25rem, sm: 0.875rem
          }}
          transition={{ duration: 0.2 }}
        >
          Alumni Industry
        </motion.h1>

        <motion.button
          className="cursor-pointer hover:text-primary"
          animate={{ rotate: isIndustryExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={30} />
        </motion.button>
      </div>

      {/* Alumni Industry */}
      <motion.div
        className="overflow-hidden"
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: isIndustryExpanded ? "auto" : 0, opacity: isIndustryExpanded ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="px-5 flex items-center justify-center flex-row gap-2">
          <div className="relative w-full justify-center items-center flex">
            <input
              type="search"
              className="bg-white text-black border h-12 border-gray-300 focus:border-primary focus:outline-none rounded-2xl w-11/12 pl-10 pr-4 py-2"
              placeholder="Enter type of Industry"
              value={industryInput}
              onChange={(e) => setIndustryInput(e.target.value)} // Update input value
              onKeyDown={handleIndustrySearch} // Handle enter key press
            />
            <span className="absolute left-8 top-1/2 transform -translate-y-1/2 text-primary">
              <Search size={18} strokeWidth={2} />
            </span>
          </div>
        </div>

        {/* Industry Tags */}
        {industryList.length > 0 && (
          <div className="flex flex-row flex-wrap mt-5 pl-10 mb-4 gap-2 items-center">
            {industryList.map((Industry, index) => (
              <div key={index} className="flex flex-row bg-primary rounded-full h-auto items-center px-2">
                <h1 className="text-white font-satoshi-light truncate text-sm">{Industry}</h1>
                <button onClick={() => removeIndustry(index)}>
                  <X className="text-white ml-2" size={20} />
                </button>
              </div>
            ))}
          </div>
        )}


        <div className="flex flex-row px-12 pb-3 pt-5">
          <h1 className="flex-1 text-gray-400">Suggestions</h1>
          <button>
            <h1 className="underline text-primary">See all</h1>
          </button>
        </div>

        {/* industry Suggestions */}
        <ul>
          {industryInput === "" ? (
            industries.slice(0, 4).map((industry, index) => (
              !industryList.includes(industry) && ( // Check if industry is not already in IndustryList
                <div key={index} className="cursor-pointer py-2 bg-gray-100 mb-3 mx-12 rounded-full h-10">
                  <button
                    className="pl-5 font-satoshi-medium w-full h-full text-left cursor-pointer truncate max-w-full"
                    onClick={() => setIndustryList([...industryList, industry])}
                  >
                    {industry}
                  </button>
                </div>
              )
            ))
          ) : (
            industries.map((industry, index) => (
              !industryList.includes(industry) && ( // Check if industry is not already in IndustryList
                <div key={index} className="cursor-pointer py-2 bg-gray-100 mb-3 mx-12 rounded-full h-10">
                  <button
                    className="pl-5 font-satoshi-medium w-full h-full text-left cursor-pointer truncate max-w-full"
                    onClick={() => setIndustryList([...industryList, industry])}
                  >
                    {industry}
                  </button>
                </div>
              )
            ))
          )}
        </ul>

        {/* Buttons for skip and next for mobile*/}
        <div className="flex lg:hidden justify-between px-5 pb-3">
          <button
            onClick={() => {setIndustryList([]); 
              setIsAlumniProfessionExpanded(false);
              setIsSkillsExpanded(true);
              setIsIndustryExpanded(false);}}
            className="text-black px-4 py-2 rounded-lg underline font-satoshi-medium cursor-pointer hover:text-gray-500"
          >
            Skip
          </button>

          <button onClick={() => {
            setIsAlumniProfessionExpanded(false);
            setIsSkillsExpanded(true);
            setIsIndustryExpanded(false);
          }} className="bg-primary text-white px-4 py-2 rounded-2xl hover:bg-primary-dark hover:bg-blue-950 cursor-pointer">
            Next
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AlumniIndustryFilter;
