import React, { useState, useRef, useEffect } from "react";
import CareerModal from "./CareerModalSelection";

const FilterDropdown = ({setCareerList}) => {
  const [isCareerModalOpen, setIsCareerModalOpen] = useState(false);
  const [filterBy, setFilterBy] = useState("");

  const handleSelectChange = (e) => {
    const selected = e.target.value;
    setFilterBy(selected);

    // Open modal only after render completes to avoid select quirks
    if (selected === "Location") {
        setIsCareerModalOpen(true);
    }
  };

  const updateCareerList = (updatedCareerList) => {
    setCareerList(updatedCareerList);
  };

  return (
    <div className="relative">
      {/* Dropdown Select */}
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

      {/* Modal for Location */}
      {isCareerModalOpen && (
        <CareerModal
          setIsCareerModalOpen={setIsCareerModalOpen}
          setCareerList={updateCareerList}
        />
      )}
    </div>
  );
};

export default FilterDropdown;
