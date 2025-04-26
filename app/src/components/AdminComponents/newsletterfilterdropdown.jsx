import React, { useState, useEffect } from "react";
import CareerModal from "./CareerModalSelection";
import DatePickerModal from "./YearPickerModal";

const FilterDropdown = ({ setCareerList, setDateList, disabled }) => {
  const [isCareerModalOpen, setIsCareerModalOpen] = useState(false);
  const [isDatePickerModalOpen, setIsDatePickerModalOpen] = useState(false);
  const [filterBy, setFilterBy] = useState("");
  const [careerList, setCareerListState] = useState([]); // Local state for career list
  const [dateList, setDateListState] = useState([]); // Local state for date list

  const handleSelectChange = (e) => {
    const selected = e.target.value;
    setFilterBy(selected);

    if (selected === "Job Fields") {
      setIsCareerModalOpen(true);
    } else if (selected === "Batch") {
      setIsDatePickerModalOpen(true);
    }
  };

  const updateCareerList = (updatedCareerList) => {
    setCareerListState(updatedCareerList); // Update local state for career list
    setCareerList(updatedCareerList); // Pass updated career list to parent
  };

  const updateDateList = (updatedDateList) => {
    setDateListState(updatedDateList); // Update local state for date list
    setDateList(updatedDateList); // Pass updated date list to parent
  };

  // Effect to clear lists when disabled is true
  useEffect(() => {
    if (disabled) {
      setCareerListState([]); // Clear career list
      setDateListState([]); // Clear date list
      setCareerList([]); // Clear parent career list
      setDateList([]); // Clear parent date list
    }
  }, [disabled, setCareerList, setDateList]);

  return (
    <div className="relative font-satoshi-regular">
      <select
        className={`w-full border ${disabled ? "border-neutral-c text-neutral-c" : "border-disabled text-black"} rounded-2xl p-2 outline-none`} 
        value={filterBy}
        onChange={handleSelectChange}
        disabled={disabled}
      >
        <option value="Batch">Batch</option>
        <option value="Job Fields">Job Fields</option>
      </select>

      {/* Display Career List Horizontally */}
      {careerList.length > 0 && (
        <div className="mt-4">
          <strong>Selected Job Fields:</strong>
          <div className="flex gap-1 mt-2">
            {careerList.map((career, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-600 text-xs font-medium px-2 py-1 rounded-full"
              >
                {career}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Display Date List Horizontally */}
      {dateList.length > 0 && (
        <div className="mt-4">
          <strong>Selected Batches:</strong>
          <div className="flex gap-1 mt-2">
            {dateList.map((date, index) => (
              <span
                key={index}
                className="bg-green-100 text-green-600 text-xs font-medium px-2 py-1 rounded-full"
              >
                {date}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Modal for Career Fields */}
      {isCareerModalOpen && (
        <CareerModal
          setIsCareerModalOpen={setIsCareerModalOpen}
          setCareerList={updateCareerList}
        />
      )}

      {/* Modal for Date Picker */}
      {isDatePickerModalOpen && (
        <DatePickerModal
          setIsDatePickerModalOpen={setIsDatePickerModalOpen}
          setDateList={updateDateList}
        />
      )}
    </div>
  );
};

export default FilterDropdown;
