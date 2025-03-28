import React, { useState } from "react";
import SearchBar from "../../components/searchbar";
import AlumniCareerFilter from "../../components/careerfilter";
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
  const [isAffiliationExpanded, setIsAffiliationExpanded] = useState(false);

  const [careerList, setCareerList] = useState([]); // State for career list
  const [careerInput, setCareerInput] = useState(""); // State for storing current input

  const [affiliationList, setAffiliationList] = useState([]); // State for career list
  const [affiliationInput, setAffiliationInput] = useState(""); // State for storing current input

  const [careerSearchInput, setCareerSearchInput] = useState("");
  const [affiliationSearchInput, setAffiliationSearchInput] = useState("");

  


  

  const affiliations = [
    "Young Software Engineers' Society",
    "Computer Science Society",
    "Alliance of Computer SCience Student",
    "Mathematical Society",
    "El Gamma Penumbra"
  ]

  
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

          <AlumniCareerFilter
            isCareerExpanded={isCareerExpanded}
            setIsCareerExpanded={setIsCareerExpanded}
            careerInput={careerInput}
            setCareerInput={setCareerInput}
            careerList={careerList}
            setCareerList={setCareerList}
          />
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
