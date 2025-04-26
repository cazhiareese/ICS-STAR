import React, { useState } from "react";
import CareerModal from "./CareerModalSelection";
import DatePickerModal from "./YearPickerModal";

const FilterDropdown = ({ setCareerList, setDateList }) => {
  const [isCareerModalOpen, setIsCareerModalOpen] = useState(false);
  const [isDatePickerModalOpen, setIsDatePickerModalOpen] = useState(false);
  const [filterBy, setFilterBy] = useState("");

  const handleSelectChange = (e) => {
    const selected = e.target.value;
    setFilterBy(selected);

    if (selected === "Location") {
      setIsCareerModalOpen(true);
    } else if (selected === "Batch") {
      setIsDatePickerModalOpen(true);
    }
  };

  const updateCareerList = (updatedCareerList) => {
    setCareerList(updatedCareerList);
  };

  const updateDateList = (updatedDateList) => {
    setDateList(updatedDateList);
  };

  return (
    <div className="relative">
      <select
        className="w-full border border-gray-300 rounded-2xl p-2 outline-none"
        value={filterBy}
        onChange={handleSelectChange}
      >
        <option value="">Filter by</option>
        <option value="Batch">Batch</option>
        <option value="Location">Location</option>
        <option value="Program">Program</option>
      </select>

      {isCareerModalOpen && (
        <CareerModal
          setIsCareerModalOpen={setIsCareerModalOpen}
          setCareerList={updateCareerList}
        />
      )}

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
