import React, { useState } from "react";
import DatePicker from "react-multi-date-picker";
import { ChevronLeft, ChevronRight } from "lucide-react";
import colors from "react-multi-date-picker/plugins/colors"
import { X } from "lucide-react";
import "./YearPickerCss.css";

const DatePickerModal = ({ setIsDatePickerModalOpen, setDateList }) => {
  const [selectedDates, setSelectedDates] = useState([]);

  const handleSave = () => {
    const years = selectedDates.map((date) => date.year);

    // Log the years that are being saved
    console.log("Years to save:", years);

    setDateList([...new Set(years)].sort());
    setIsDatePickerModalOpen(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-gray-500 opacity-40 pointer-events-none"></div>
      <div className="relative bg-white rounded-2xl shadow-xl p-6 w-[360px]">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-lg">Select Batch Years</h2>
          <button
            onClick={() => setIsDatePickerModalOpen(false)}
            className="text-gray-600 hover:text-red-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content: Date Picker */}
        <div className="flex flex-col items-center w-full mb-6">
          {/* DatePicker Component */}
          <DatePicker
            multiple
            value={selectedDates}
            onChange={setSelectedDates}  // Use the handleYearChange function
            onlyYearPicker
            format="YYYY"
            sort
            inputClass="border border-gray-300 rounded-xl px-3 h-10 py-2 md:w-4xs w-full text-left focus:border-primary focus:outline-none focus:ring-0 pl-10 pr-10"
            calendarClassName="p-4 w-sm"
            colors={[colors("#FFFFFF")]}
            renderButton={(direction, handleClick) => (
              <button onClick={handleClick}>
                {direction === "right" ? (
                  <ChevronRight size={30} className="text-blue-950" />
                ) : (
                  <ChevronLeft size={30} className="text-blue-950" />
                )}
              </button>
            )}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setIsDatePickerModalOpen(false)}
            className="px-4 py-2 rounded-md bg-gray-200 text-black"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-md bg-primary text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default DatePickerModal;
