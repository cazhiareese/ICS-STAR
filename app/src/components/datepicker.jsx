import React from "react";
import DatePicker from "react-datepicker";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";

const YearPicker = ({ selectedYear, setSelectedYear }) => {
  return (
    <DatePicker
      selected={selectedYear}
      onChange={(date) => setSelectedYear(date)}
      showYearPicker
      dateFormat="yyyy"
      className="border border-gray-300 rounded-xl px-3 py-2 w-xs text-left focus:border-primary focus:outline-none focus:ring-0"
      placeholderText="Enter Year"
      calendarClassName="p-4 w-sm"
      renderCustomHeader={({ decreaseYear, increaseYear }) => (
        <div className="flex justify-between items-center px-4 py-2">
          <button onClick={decreaseYear} className="p-2 rounded-full hover:bg-gray-200 text-blue-950">
            <ChevronLeft size={30} />
          </button>
          <span className="font-satoshi-medium text-gray-400">Select Year</span>
          <button onClick={increaseYear} className="p-2 rounded-full hover:bg-gray-200 text-blue-950">
            <ChevronRight size={30} />
          </button>
        </div>
      )}
    />
  );
};

export default YearPicker;
