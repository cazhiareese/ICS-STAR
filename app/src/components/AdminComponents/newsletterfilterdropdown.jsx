import React, { useState } from "react";
import CareerModal from "./CareerModal"; // Assuming the CareerModal component is imported

const FilterDropdown = () => {
  const [isCareerModalOpen, setIsCareerModalOpen] = useState(false);
  const [filterBy, setFilterBy] = useState("");
  const [careerList, setCareerList] = useState([]);

  const handleOptionClick = (option) => {
    if (option === "Location") {
      setIsCareerModalOpen(true);  // Open CareerModal when "Location" is selected
    } else {
      setFilterBy(option);  // Update filterBy if another option is selected
    }
  };

  const updateCareerList = (updatedCareerList) => {
    setCareerList(updatedCareerList);  // Update the career list in the parent
  };

  return (
    <div className="relative">
      {/* Dropdown Select */}
      <select
        className="w-full border border-gray-300 rounded-2xl p-2 outline-none"
        value={filterBy}
        onChange={(e) => setFilterBy(e.target.value)}
      >
        <option value="">Filter by</option>
        <option value="Batch">Batch</option>
        <option value="Location" onClick={() => handleOptionClick("Location")}>
          Location
        </option>
        <option value="Program">Program</option>
      </select>

      {/* Modal trigger for Location */}
      {isCareerModalOpen && (
        <CareerModal
          setIsCareerModalOpen={setIsCareerModalOpen}  // To close the modal
          careerList={careerList}  // Pass current career list to CareerModal
          setCareerList={updateCareerList}  // Pass function to update career list from the modal
        />
      )}
    </div>
  );
};

export default FilterDropdown;
