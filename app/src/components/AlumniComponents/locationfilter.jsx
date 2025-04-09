import { motion } from "framer-motion";
import { ChevronDown, Search, X } from "lucide-react"; // Assuming you're using React Feather for icons
import axios from 'axios';
import React, {useState, useEffect, useRef} from 'react';

const AlumniLocationFilter = ({
  isLocationExpanded,
  setIsLocationExpanded,
  locationInput,
  setLocationInput,
  location,
  setLocation,
  setIsAlumniProfessionExpanded,
  setIsCareerExpanded,
  setIsAlumniInfoExpanded
}) => {
  const [locations, setLocations] = useState([]); 
  // cache reference
  const cache = useRef({});
  
  useEffect(() => {
    const fetchData = async () => {
      if (!locationInput) {
        // Check cache for top cities
        if (cache.current["top-cities"]) {
          setLocations(cache.current["top-cities"]);
          console.log("Using cached top cities:", cache.current["top-cities"]);
          return; // Skip API call if cached data exists
        }

        try {
          const response = await axios.get("https://ics-star-api.vercel.app/suggestions/top-cities");
          setLocations(response.data);
          cache.current["top-cities"] = response.data; // Cache the result
          console.log("Fetched top cities:", response.data);
        } catch (error) {
          console.error("Error fetching cities data:", error);
        }
      } else {
        const query = locationInput.trim().toLowerCase();
        
        // Check cache for cities based on user input
        if (cache.current[query]) {
          setLocations(cache.current[query]); // Use cached data if it exists
          console.log("Using cached cities for input:", query, cache.current[query]);
          return;
        }

        try {
          const response = await axios.get(`https://ics-star-api.vercel.app/autocomplete/cities?q=${encodeURIComponent(query)}&limit=5`);
          setLocations(response.data);
          cache.current[query] = response.data; // Cache the result for future use
          console.log("Fetched cities for input:", query, response.data);
        } catch (error) {
          console.error("Error fetching cities data:", error);
        }
      }
    };

    fetchData();
  }, [locationInput]);

    // Handle the enter key press
  const handleLocationSearch = (e) => {
    if (e.key === "Enter" && locationInput.trim()) {     
      setLocation([...location, locationInput]); // Add the input to careerList
      setLocationInput(""); 
    }
  };

  const removeLocation = (index) => {
    // Create a new array excluding the career at the given index
    const updatedLocationList = location.filter((_, i) => i !== index);
    
    // Update the state with the new list
    setLocation(updatedLocationList);
  };

  

  // Filter locations based on user input
  const filteredlocations = locations.filter(location => location.toLowerCase().includes(locationInput.toLowerCase()));

  return (
    <div className="flex flex-col shadow-md mt-5 rounded-lg bg-white lg:bg-transparent">
      <div className="flex flex-row px-5 py-3" onClick={() => setIsLocationExpanded(!isLocationExpanded)}>
        <motion.h1
          className="flex-1/2 font-satoshi-medium"
          initial={{ fontWeight: 500, fontSize: "1.00rem" }}
          animate={{
            fontWeight: isLocationExpanded ? 600 : 500, // Bold when expanded
            fontSize: isLocationExpanded ? "1.50rem" : "1.25rem", // lg: 1.25rem, sm: 0.875rem
          }}
          transition={{ duration: 0.2 }}
        >
          Alumni Location
        </motion.h1>

        <motion.button
          className="cursor-pointer hover:text-primary"
          animate={{ rotate: isLocationExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={30} />
        </motion.button>
      </div>

      {/* Alumni Location */}
      <motion.div
        className="overflow-hidden"
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: isLocationExpanded ? "auto" : 0, opacity: isLocationExpanded ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="px-5 flex items-center justify-center flex-row gap-2">
          <div className="relative w-full justify-center items-center flex">
            <input
              type="search"
              className="bg-white text-black border h-12 border-gray-300 focus:border-primary focus:outline-none rounded-2xl w-11/12 pl-10 pr-4 py-2"
              placeholder="Enter type of Location"
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)} // Update input value
              onKeyDown={handleLocationSearch} // Handle enter key press
            />
            <span className="absolute left-8 top-1/2 transform -translate-y-1/2 text-primary">
              <Search size={18} strokeWidth={2} />
            </span>
          </div>
        </div>

        {/* Career Tags */}
        {location.length > 0 && (
          <div className="flex flex-row flex-wrap mt-5 pl-10 mb-4 gap-2 items-center">
            {location.map((loc, index) => (
              <div key={index} className="flex flex-row bg-primary rounded-full h-auto items-center px-2">
                <h1 className="text-white font-satoshi-light truncate text-sm">{loc}</h1>
                <button onClick={() => removeLocation(index)}>
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

        {/* location Suggestions */}
        <ul>
          {locationInput === "" ? (
            locations.slice(0, 4).map((loc, index) => (
                !location.includes(loc) && ( // Check if location is not already in LocationList
                    <div key={index} className="cursor-pointer py-2 bg-gray-100 mb-3 mx-12 rounded-full h-10">
                    <button
                        className="pl-5 font-satoshi-medium w-full h-full text-left cursor-pointer"
                        onClick={() => {
                            setLocation([...location, loc]); // Add the input to careerList
                            setLocationInput("");
                        }}
                    >
                        {loc}
                    </button>
                    </div>
                )
            ))
          ) : (
            filteredlocations.map((loc, index) => (
              !location.includes(loc) && ( // Check if location is not already in LocationList
                    <div key={index} className="cursor-pointer py-2 bg-gray-100 mb-3 mx-12 rounded-full h-10">
                    <button
                        className="pl-5 font-satoshi-medium w-full h-full text-left cursor-pointer"
                        onClick={() => {
                          setLocation([...location, loc]); // Add the input to careerList
                          setLocationInput("");
                        }}
                    >
                        {loc}
                    </button>
                    </div>
                )
            ))
          )}
        </ul>
        {/* Buttons for skip and next for mobile*/}
        <div className="flex lg:hidden justify-between px-5 pb-3">
          <button
            onClick={() => {setLocation([]); 
              setIsCareerExpanded(true);
              setIsAlumniProfessionExpanded(true);
              setIsAlumniInfoExpanded(false);
              setIsLocationExpanded(false);}}
            className="text-black px-4 py-2 rounded-lg underline font-satoshi-medium cursor-pointer hover:text-gray-500"
          >
            Skip
          </button>

          <button onClick={() => {
            setIsCareerExpanded(true);
            setIsAlumniProfessionExpanded(true);
            setIsAlumniInfoExpanded(false);
            setIsLocationExpanded(false);
          }} className="bg-primary text-white px-4 py-2 rounded-2xl hover:bg-primary-dark hover:bg-blue-950 cursor-pointer">
            Next
          </button>
        </div>
          
    
      </motion.div>
    </div>
  );
};

export default AlumniLocationFilter;
