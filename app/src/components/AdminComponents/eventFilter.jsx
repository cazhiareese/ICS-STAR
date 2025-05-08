import React, { useState, useEffect } from "react";
import CareerModal from "./CareerModalSelection";
import DatePickerModal from "./YearPickerModal";
import AffiliationModal from "./AffiliationModal";
import EmploymentStatusModal from "./EmploymentStatusModal";
const EventFilterDropdown = ({ setCareerList, setDateList, setAffiliationList, setEmployment, disabled }) => {
  const [isCareerModalOpen, setIsCareerModalOpen] = useState(false);
  const [isDatePickerModalOpen, setIsDatePickerModalOpen] = useState(false);
  const [isAffiliationModalOpen, setIsAffliationModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);


  const [filterBy, setFilterBy] = useState("");
  const [careerList, setCareerListState] = useState([]); // Local state for career list
  const [dateList, setDateListState] = useState([]); // Local state for date list
  const [affiliationList, setAffiliationListState] = useState([])
  const [employment, setEmploymentState] = useState('')

  const handleSelectChange = (e) => {
    const selected = e.target.value;
    setFilterBy(selected);

    if (selected === "Job Fields") {
      setIsCareerModalOpen(true);
    } else if (selected === "Batch") {
      setIsDatePickerModalOpen(true);
    }else if (selected === "Affiliation"){
        setIsAffliationModalOpen(true)
    }else if (selected === "Employment Status"){
        setIsStatusModalOpen(true)
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

  const updateAffiliationList = (updatedAffiliationList) => {
    setAffiliationListState(updatedAffiliationList);
    setAffiliationList(updatedAffiliationList)
  }

  const updateEmploymentStatus = (updatedEmploymentStatus) => {
    setEmploymentState(updatedEmploymentStatus);
    setEmployment(updatedEmploymentStatus)
  }

  // Effect to clear lists when disabled is true
  useEffect(() => {
    if (disabled) {
      setCareerListState([]); // Clear career list
      setDateListState([]); // Clear date list
      setCareerList([]); // Clear parent career list
      setDateList([]); // Clear parent date list
      setAffiliationList([])
      setEmployment('')
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
        <option value="Affiliation">Affiliation</option>
        <option value="Employment Status">Employment Status</option>


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

      {affiliationList.length > 0 && (
        <div className="mt-4">
          <strong>Selected Affiliation:</strong>
          <div className="flex gap-1 mt-2">
            {affiliationList.map((affiliation, index) => (
              <span
                key={index}
                className="bg-green-100 text-green-600 text-xs font-medium px-2 py-1 rounded-full"
              >
                {affiliation}
              </span>
            ))}
          </div>
        </div>
      )}

    {employment.length > 0 && (
        <div className="mt-4">
          <strong>Selected Employment Status:</strong>
          <div className="flex gap-1 mt-2">
            
              <span
                className="bg-green-100 text-green-600 text-xs font-medium px-2 py-1 rounded-full"
              >
                {employment}
              </span>
            
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

    {isAffiliationModalOpen && (
        <AffiliationModal
          setIsAffiliationModalOpen={setIsAffliationModalOpen}
          setAffiliationList={updateAffiliationList}
        />
      )}

             {/* Modal for Employment Status */}
      {isStatusModalOpen && (
        <EmploymentStatusModal
          setIsStatusModalOpen={setIsStatusModalOpen}
          setEmployment={updateEmploymentStatus}
          employment={employment} // Pass current employment value
        />
      )}

    </div>
  );
};

export default EventFilterDropdown;
