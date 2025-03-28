import React, { useState } from "react";
import SearchBar from "../../components/searchbar";
import { X, ChevronDown, Calendar, Search } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";
import "./datepicker.css";
import YearPicker from "../../components/datepicker";
import { motion } from "framer-motion";

function AlumniSearch() {
  const [selectedBatchYear, setSelectedBatchYear] = useState(null); // Separate state for Batch Year
  const [selectedGraduationYear, setSelectedGraduationYear] = useState(null); // Separate state for Graduation Year
  
  const [isBatchExpanded, setIsBatchExpanded] = useState(false);
  const [isGraduateExpanded, setIsGraduateExpanded] = useState(false);
  const [isCareerExpanded, setIsCareerExpanded] = useState(false);

  const [careerList, setCareerList] = useState([]); // State for career list
  const [careerInput, setCareerInput] = useState(""); // State for storing current input

  const [careerSearchInput, setCareerSearchInput] = useState("");

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


  const jobs = [
    "Frontend Developer",
    "Backend Developer",
    "Data Scientist",
    "Professor",
    "Instructor",
    "Information Technology"
  ]

  // Filter jobs based on user input
  const filteredJobs = jobs.filter(job => job.toLowerCase().includes(careerInput.toLowerCase()));

  return (
    <div className="flex flex-col">
      {/* Search bar */}
      <div className="flex flex-col w-full mt-28 shadow-md pb-8 items-center rounded-full">
        <SearchBar />
      </div>

      {/* Filter Bar and Alumni Cards */}
      <div className="flex flex-row pl-10 pt-10">
        {/* Filter Bar */}
        <div className="w-1/3 flex flex-col pr-6 border-r-2 border-gray-300">
          <div className="flex flex-row">
            <h1 className="font-satoshi-bold text-4xl flex-4/12">Filters</h1>
            <button className="mr-6 underline font-satoshi-medium mt-4 cursor-pointer hover:text-primary">
              Reset All
            </button>
            <button className="mt-4 cursor-pointer hover:text-primary">
              <X size={24} />
            </button>
          </div>

          {/* Alumni Batch Filter */}
          <div className="flex flex-col shadow mt-14 rounded-lg gap-3">
            <div className="flex flex-row px-5 py-3" onClick={() => setIsBatchExpanded(!isBatchExpanded)}>
              <motion.h1
                className="flex-1/2 font-satoshi-medium"
                initial={{ fontWeight: 500, fontSize: "1.00rem" }}
                animate={{
                  fontWeight: isBatchExpanded ? 600 : 500, // Bold when expanded
                  fontSize: isBatchExpanded ? "1.25rem" : "1.00rem", // lg: 1.25rem, sm: 0.875rem
                }}
                transition={{ duration: 0.2 }}
              >
                Batch of Alumni
              </motion.h1>

              <motion.button
                className="cursor-pointer hover:text-primary"
                animate={{ rotate: isBatchExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={30} />
              </motion.button>
            </div>

            {/* Year Picker for Batch */}
            <motion.div
              className="overflow-hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: isBatchExpanded ? "auto" : 0, opacity: isBatchExpanded ? 1 : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="px-5 pb-5 flex items-center justify-center flex-row gap-2">
                <Calendar className="text-primary" />
                <YearPicker
                  selectedYear={selectedBatchYear} // Using separate state for Batch Year
                  setSelectedYear={setSelectedBatchYear}
                />
              </div>
            </motion.div>
          </div>

          {/* Alumni Graduate Filter */}
          <div className="flex flex-col shadow mt-5 rounded-lg gap-3">
            <div className="flex flex-row px-5 py-3" onClick={() => setIsGraduateExpanded(!isGraduateExpanded)}>
              <motion.h1
                className="flex-1/2 font-satoshi-medium"
                initial={{ fontWeight: 500, fontSize: "1.00rem" }}
                animate={{
                  fontWeight: isGraduateExpanded ? 600 : 500, // Bold when expanded
                  fontSize: isGraduateExpanded ? "1.25rem" : "1.00rem", // lg: 1.25rem, sm: 0.875rem
                }}
                transition={{ duration: 0.2 }}
              >
                Year Alumni Graduated
              </motion.h1>

              <motion.button
                className="cursor-pointer hover:text-primary"
                animate={{ rotate: isGraduateExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={30} />
              </motion.button>
            </div>

            {/* Year Picker for Graduation */}
            <motion.div
              className="overflow-hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: isGraduateExpanded ? "auto" : 0, opacity: isGraduateExpanded ? 1 : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="px-5 pb-5 flex items-center justify-center flex-row gap-2">
                <Calendar className="text-primary" />
                <YearPicker
                  selectedYear={selectedGraduationYear} 
                  setSelectedYear={setSelectedGraduationYear}
                />
              </div>
            </motion.div>
          </div>

          {/* Alumni Career Filter */}
          <div className="flex flex-col shadow mt-5 rounded-lg">
            <div className="flex flex-row px-5 py-3" onClick={() => setIsCareerExpanded(!isCareerExpanded)}>
              <motion.h1
                className="flex-1/2 font-satoshi-medium"
                initial={{ fontWeight: 500, fontSize: "1.00rem" }}
                animate={{
                  fontWeight: isCareerExpanded ? 600 : 500, // Bold when expanded
                  fontSize: isCareerExpanded ? "1.25rem" : "1.00rem", // lg: 1.25rem, sm: 0.875rem
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

            {/* Alumni Career*/}
            <motion.div
              className="overflow-hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: isCareerExpanded ? "auto" : 0, opacity: isCareerExpanded ? 1 : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="px-5 pb-5 flex items-center justify-center flex-row gap-2">
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

              <div className="flex flex-row flex-wrap pl-10 mb-4 gap-2 items-center">
                {careerList.map((career, index) => (
                  <div key={index} className="flex flex-row bg-primary rounded-full h-auto items-center px-2">
                    <h1 className="text-white font-satoshi-light truncate text-sm">{career}</h1>
                    <button onClick={() => removeCareer(index)}>
                      <X className="text-white ml-2" size={20} />
                    </button>
                  </div>
                ))}
              </div>


              <ul>
                {careerInput === "" ? (
                  jobs.slice(0, 4).map((job, index) => (
                    !careerList.includes(job) && ( // Check if job is not already in careerList
                      <div key={index} className="cursor-pointer py-2 bg-gray-100 mb-3 mx-12 rounded-full h-10 ">
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
                        <div key={index} className="cursor-pointer py-2 bg-gray-100 mb-3 mx-12 rounded-full h-10 ">
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
        </div>

        {/* Alumni Cards */}
        <div className="w-2/3 flex flex-col pl-10">
          {/* Render career list here */}
          <ul>
            {careerList.map((career, index) => (
              <li key={index}>{career}</li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}

export default AlumniSearch;
