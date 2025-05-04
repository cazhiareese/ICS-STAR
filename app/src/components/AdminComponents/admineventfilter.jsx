import React, { useState } from "react";
import MultiDatePicker from "./MultiDatePicker";
import { X } from "lucide-react";

function FilterSidebar({ activeFilter, onClose }) {
  const [batchDates, setBatchDates] = useState([]);
  const [affiliation, setAffiliation] = useState("");
  const [employmentStatus, setEmploymentStatus] = useState("");
  const [jobField, setJobField] = useState("");

  const renderFilterContent = () => {
    switch (activeFilter) {
      case "Batch":
        return (
          <>
            <h2 className="font-semibold text-lg px-4 pt-4">Batch of Alumni</h2>
            <MultiDatePickerModal
              selectedDates={batchDates}
              onChange={setBatchDates}
            />
            <ul className="p-4 space-y-1 text-sm">
              {batchDates.map((date, idx) => (
                <li key={idx} className="border p-2 rounded bg-muted">{date}</li>
              ))}
            </ul>
          </>
        );

      case "Affiliation":
        return (
          <>
            <h2 className="font-semibold text-lg px-4 pt-4">Affiliations</h2>
            <input
              type="text"
              placeholder="Enter affiliation"
              className="m-4 p-2 border rounded w-[90%]"
              value={affiliation}
              onChange={(e) => setAffiliation(e.target.value)}
            />
            {affiliation && (
              <ul className="px-4 text-sm">
                <li className="border p-2 rounded bg-muted">{affiliation}</li>
              </ul>
            )}
          </>
        );

      case "Employment Status":
        return (
          <>
            <h2 className="font-semibold text-lg px-4 pt-4">Employment Status</h2>
            <select
              className="m-4 p-2 border rounded w-[90%]"
              value={employmentStatus}
              onChange={(e) => setEmploymentStatus(e.target.value)}
            >
              <option value="">Select status</option>
              <option value="Employed">Employed</option>
              <option value="Unemployed">Unemployed</option>
              <option value="Self-Employed">Self-Employed</option>
              <option value="Freelancer">Freelancer</option>
            </select>
            {employmentStatus && (
              <ul className="px-4 text-sm">
                <li className="border p-2 rounded bg-muted">{employmentStatus}</li>
              </ul>
            )}
          </>
        );

      case "Job Fields":
        return (
          <>
            <h2 className="font-semibold text-lg px-4 pt-4">Job Fields</h2>
            <input
              type="text"
              placeholder="Enter job field"
              className="m-4 p-2 border rounded w-[90%]"
              value={jobField}
              onChange={(e) => setJobField(e.target.value)}
            />
            {jobField && (
              <ul className="px-4 text-sm">
                <li className="border p-2 rounded bg-muted">{jobField}</li>
              </ul>
            )}
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="absolute left-full top-0 ml-2 w-60 h-full bg-white border shadow-lg rounded-2xl z-50">
      <div className="flex justify-end p-2">
        <button onClick={onClose}>
          <X size={18} className="text-gray-600 hover:text-black" />
        </button>
      </div>
      {renderFilterContent()}
    </div>
  );
}

export default FilterSidebar;
