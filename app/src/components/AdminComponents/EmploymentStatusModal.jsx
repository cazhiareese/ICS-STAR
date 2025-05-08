import React, { useState, useEffect } from "react";
import { XCircle } from "lucide-react";

const EmploymentStatusModal = ({ setEmployment, setIsStatusModalOpen, employment }) => {
  const [selectedStatus, setSelectedStatus] = useState(employment || "");

  const statusOptions = [
    "employed",
    "unemployed",
    "self-employed",
    "unemployed_no_experience"
  ];

  useEffect(() => {
    console.log("EmploymentStatusModal opened with employment:", employment);
    setSelectedStatus(employment || ""); // Sync with parent employment state
  }, [employment]);

  const handleSubmit = () => {
    console.log("Submitting employment status:", selectedStatus);
    setEmployment(selectedStatus); // Update parent employment state
    setIsStatusModalOpen(false); // Close the modal
  };

  const handleCloseModal = () => {
    console.log("Closing EmploymentStatusModal without saving");
    setIsStatusModalOpen(false); // Close the modal without saving
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-gray-500 opacity-40 pointer-events-none"></div>
      <div className="bg-white border border-disabled p-6 relative z-10 flex flex-col w-full max-w-[650px] rounded-2xl shadow-lg sm:w-11/12 max-h-screen overflow-auto">
        <div className="flex justify-between items-center pb-2">
          <h2 className="text-lg font-satoshi-bold sm:text-[24px]">
            Employment Status
          </h2>
          <XCircle
            size={24}
            className="cursor-pointer text-white bg-error rounded-full hover:bg-red-800"
            onClick={handleCloseModal}
          />
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-2">
            Select one employment status
          </p>
          <div className="space-y-2">
            {statusOptions.map((status) => (
              <label
                key={status}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="employmentStatus"
                  value={status}
                  checked={selectedStatus === status}
                  onChange={(e) => {
                    console.log("Selected status:", e.target.value);
                    setSelectedStatus(e.target.value);
                  }}
                  className="h-4 w-4 text-primary focus:ring-primary"
                />
                <span className="text-sm">{status}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-full text-white bg-primary hover:bg-primary-dark"
            type="button"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmploymentStatusModal;