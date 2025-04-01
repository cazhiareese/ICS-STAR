import { motion } from "framer-motion";
import { ChevronDown, Search, X } from "lucide-react"; // Assuming you're using React Feather for icons

const AlumniCareerFilter = ({
  isCareerExpanded,
  setIsCareerExpanded,
  careerInput,
  setCareerInput,
  careerList,
  setCareerList,
}) => {

    const jobs = [
        "Frontend Developer",
        "Backend Developer",
        "Data Scientist",
        "Professor",
        "Instructor",
        "Information Technology"
    ]

    // Handle the enter key press
  const handleCareerSearch = (e) => {
    if (e.key === "Enter" && careerInput.trim()) {
      setCareerList([...careerList, careerInput]); // Add the input to careerList
      setCareerInput(""); // Clear the input field after submitting
    }
  };

  const removeCareer = (index) => {
    // Create a new array excluding the career at the given index
    const updatedCareerList = careerList.filter((_, i) => i !== index);
    
    // Update the state with the new list
    setCareerList(updatedCareerList);
  };

  // Filter jobs based on user input
  const filteredJobs = jobs.filter(job => job.toLowerCase().includes(careerInput.toLowerCase()));

  return (

    

    <div className="flex flex-col shadow mt-5 rounded-lg">
      <div className="flex flex-row px-5 py-3" onClick={() => setIsCareerExpanded(!isCareerExpanded)}>
        <motion.h1
          className="flex-1/2 font-satoshi-medium"
          initial={{ fontWeight: 500, fontSize: "1.00rem" }}
          animate={{
            fontWeight: isCareerExpanded ? 600 : 500, // Bold when expanded
            fontSize: isCareerExpanded ? "1.50rem" : "1.25rem", // lg: 1.25rem, sm: 0.875rem
          }}
          transition={{ duration: 0.2 }}
        >
          Alumni Career
        </motion.h1>

        <motion.button
          className="cursor-pointer hover:text-primary"
          animate={{ rotate: isCareerExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={30} />
        </motion.button>
      </div>

      {/* Alumni Career */}
      <motion.div
        className="overflow-hidden"
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: isCareerExpanded ? "auto" : 0, opacity: isCareerExpanded ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="px-5 flex items-center justify-center flex-row gap-2">
          <div className="relative w-full justify-center items-center flex">
            <input
              type="search"
              className="bg-white text-black border h-12 border-gray-300 focus:border-primary focus:outline-none rounded-2xl w-11/12 pl-10 pr-4 py-2"
              placeholder="Enter type of career"
              value={careerInput}
              onChange={(e) => setCareerInput(e.target.value)} // Update input value
              onKeyDown={handleCareerSearch} // Handle enter key press
            />
            <span className="absolute left-8 top-1/2 transform -translate-y-1/2 text-primary">
              <Search size={18} strokeWidth={2} />
            </span>
          </div>
        </div>

        {/* Career Tags */}
        {careerList.length > 0 && (
          <div className="flex flex-row flex-wrap mt-5 pl-10 mb-4 gap-2 items-center">
            {careerList.map((career, index) => (
              <div key={index} className="flex flex-row bg-primary rounded-full h-auto items-center px-2">
                <h1 className="text-white font-satoshi-light truncate text-sm">{career}</h1>
                <button onClick={() => removeCareer(index)}>
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

        {/* Job Suggestions */}
        <ul>
          {careerInput === "" ? (
            jobs.slice(0, 4).map((job, index) => (
              !careerList.includes(job) && ( // Check if job is not already in careerList
                <div key={index} className="cursor-pointer py-2 bg-gray-100 mb-3 mx-12 rounded-full h-10">
                  <button
                    className="pl-5 font-satoshi-medium w-full h-full text-left cursor-pointer"
                    onClick={() => setCareerList([...careerList, job])}
                  >
                    {job}
                  </button>
                </div>
              )
            ))
          ) : (
            filteredJobs.map((job, index) => (
              !careerList.includes(job) && ( // Check if job is not already in careerList
                <div key={index} className="cursor-pointer py-2 bg-gray-100 mb-3 mx-12 rounded-full h-10">
                  <button
                    className="pl-5 font-satoshi-medium w-full h-full text-left cursor-pointer"
                    onClick={() => setCareerList([...careerList, job])}
                  >
                    {job}
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

export default AlumniCareerFilter;
