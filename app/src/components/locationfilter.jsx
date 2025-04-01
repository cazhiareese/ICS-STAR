import { motion } from "framer-motion";
import { ChevronDown, Search, X } from "lucide-react"; // Assuming you're using React Feather for icons

const AlumniLocationFilter = ({
  isLocationExpanded,
  setIsLocationExpanded,
  locationInput,
  setLocationInput,
  location,
  setLocation,
}) => {

    const locations = [
        "Manila",
        "Laguna",
        "Davao",
        "Camarines Sur"
    ]

    // Handle the enter key press
  const handleLocationSearch = (e) => {
    if (e.key === "Enter" && locationInput.trim()) {
      setLocation([locationInput]); // Add the input to LocationList
      setLocationInput(""); // Clear the input field after submitting
      setIsLocationExpanded(false);
    }
  };

  

  // Filter locations based on user input
  const filteredlocations = locations.filter(location => location.toLowerCase().includes(locationInput.toLowerCase()));

  return (

    

    <div className="flex flex-col shadow mt-5 rounded-lg bg-white lg:bg-transparent">
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
                location !== loc && ( // Check if location is not already in LocationList
                    <div key={index} className="cursor-pointer py-2 bg-gray-100 mb-3 mx-12 rounded-full h-10">
                    <button
                        className="pl-5 font-satoshi-medium w-full h-full text-left cursor-pointer"
                        onClick={() => {
                            setLocation([loc]); 
                            setIsLocationExpanded(false); // Close the filter after selecting a location
                            setLocationInput(loc);
                        }}
                    >
                        {loc}
                    </button>
                    </div>
                )
            ))
          ) : (
            filteredlocations.map((loc, index) => (
                location !== loc && ( // Check if location is not already in LocationList
                    <div key={index} className="cursor-pointer py-2 bg-gray-100 mb-3 mx-12 rounded-full h-10">
                    <button
                        className="pl-5 font-satoshi-medium w-full h-full text-left cursor-pointer"
                        onClick={() => {
                            setLocation([loc]); 
                            setIsLocationExpanded(false); // Close the filter after selecting a location
                            setLocationInput(loc);
                        }}
                    >
                        {loc}
                    </button>
                    </div>
                )
            ))
          )}
        </ul>

        
    
      </motion.div>
    </div>
  );
};

export default AlumniLocationFilter;
