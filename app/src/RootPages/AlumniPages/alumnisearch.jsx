import React, { useState } from "react";
import SearchBar from "../../components/searchbar";
import { X, ChevronUp, ChevronLeft, ChevronRight } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./datepicker.css";
import YearPicker from "../../components/datepicker";
import { motion } from "framer-motion";

function AlumniSearch() {
  const [selectedYear, setSelectedYear] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

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
          <div className="flex flex-col shadow mt-14 rounded-lg">
            <div className="flex flex-row px-5 py-3" onClick={() => setIsExpanded(!isExpanded)}>
              <motion.h1
                className="flex-1/2 font-satoshi-medium"
                animate={{ 
                  fontWeight: isExpanded ? 700 : 500, // Bold when expanded
                  fontSize: isExpanded ? "1.25rem" : "1.00rem", // lg: 1.25rem, sm: 0.875rem
                }}
                transition={{ duration: 0.2 }}
              >
                Batch of Alumni
              </motion.h1>

              <motion.button
                className="cursor-pointer hover:text-primary"
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronUp size={30} />
              </motion.button>
            </div>
            
            {/* 🎯 Year Picker */}
            <motion.div
              className="overflow-hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: isExpanded ? "auto" : 0, opacity: isExpanded ? 1 : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="px-5 pb-5 flex items-center justify-center">
                <YearPicker selectedYear={selectedYear} setSelectedYear={setSelectedYear} />
              </div>
            </motion.div>
          </div>
         </div>

        {/* Alumni Cards */}
        <div className="w-2/3 flex flex-col pl-10">SAMPLE</div>
      </div>
    </div>

    
  );
}

export default AlumniSearch;
