import React, { useState } from "react";
import DatePicker from "react-multi-date-picker";

const DatePickerModal = ({ setIsDatePickerModalOpen, setCareerList }) => {
  const [dates, setDates] = useState([]);

  const handleSave = () => {
    const years = dates.map(date => date.year);
    setCareerList(years);
    setIsDatePickerModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white p-6 rounded-xl shadow-lg w-[300px]">
        <h2 className="font-bold text-lg mb-4">Select Years</h2>

        <DatePicker
          multiple
          value={dates}
          onChange={setDates}
          onlyYearPicker
          format="YYYY"
          className="w-full"
        />

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={() => setIsDatePickerModalOpen(false)}
            className="px-4 py-2 rounded-md bg-gray-300 text-black"
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
