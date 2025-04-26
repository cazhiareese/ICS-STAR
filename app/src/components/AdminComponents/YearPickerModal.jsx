import React, { useState } from "react";
import DatePicker from "react-multi-date-picker";
import { X } from "lucide-react";

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
      <div className="bg-white rounded-2xl shadow-xl p-6 w-[360px]">
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
          <DatePicker
            multiple
            value={selectedDates}
            onChange={setSelectedDates}
            onlyYearPicker
            format="YYYY"
            sort
            className="w-full"
            inputClass="w-full border border-gray-300 rounded-xl py-2 px-2 text-sm focus:outline-none"
            containerClassName="w-full"
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
