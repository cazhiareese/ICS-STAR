import React, { useState, useEffect } from "react";
import { Search, XCircle, X } from "lucide-react";
import axios from "axios";

const CareerModal = ({ setCareerList, setIsCareerModalOpen }) => {
  const [careerInput, setCareerInput] = useState("");
  const [jobs, setJobs] = useState([]);
  const [careerList, internalSetCareerList] = useState([]);

  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching jobs...");
        if (!careerInput) {
          const response = await axios.get(`${API_BASE_URL}/suggestions/top-job-titles`);
          setJobs(response.data);
        } else {
          const query = careerInput.trim().toLowerCase();
          const response = await axios.get(`${API_BASE_URL}/autocomplete/job-titles?q=${encodeURIComponent(query)}&limit=5`);
          setJobs(response.data);
        }
      } catch (error) {
        console.error("Error fetching job titles:", error);
      }
    };

    fetchData();
  }, [careerInput]);

  const handleCareerSearch = (e) => {
    if (e.key === "Enter" && careerInput.trim()) {
      const newCareer = careerInput.trim();
      if (!careerList.includes(newCareer)) {
        const updatedList = [...careerList, newCareer];
        internalSetCareerList(updatedList);
        setCareerList(updatedList);
      }
      setCareerInput("");
    }
  };

  const addCareer = (career) => {
    if (!careerList.includes(career)) {
      const updatedList = [...careerList, career];
      internalSetCareerList(updatedList);
      setCareerList(updatedList);
    }
  };

  const removeCareer = (index) => {
    const updatedList = careerList.filter((_, i) => i !== index);
    internalSetCareerList(updatedList);
    setCareerList(updatedList);
  };

  const filteredJobs = jobs.filter((job) =>
    job.toLowerCase().includes(careerInput.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-white border border-disabled p-6 relative z-10 flex flex-col w-full max-w-[650px] rounded-2xl shadow-lg sm:w-11/12 max-h-screen">
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="text-lg font-satoshi-bold sm:text-[24px]">Add Affiliations</h2>
          <XCircle
            size={24}
            className="cursor-pointer text-white bg-error rounded-full hover:bg-red-800"
            onClick={() => setIsCareerModalOpen(false)} // Close modal on click
          />
        </div>

        <div className="relative mb-4">
          <input
            type="search"
            className="w-full border border-gray-300 rounded-2xl pl-10 pr-4 py-2 outline-none"
            placeholder="Enter type of career"
            value={careerInput}
            onChange={(e) => setCareerInput(e.target.value)}
            onKeyDown={handleCareerSearch}
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary">
            <Search size={18} />
          </span>
        </div>

        {careerList.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {careerList.map((career, index) => (
              <div key={index} className="flex items-center bg-primary text-white px-3 py-1 rounded-full text-sm">
                {career}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering any unintended event listeners
                    removeCareer(index);
                  }}
                  className="ml-2"
                  type="button" // Prevent form submission behavior
                >
                  <X size={18} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="text-sm text-gray-500 mb-2">Suggestions</div>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {(careerInput ? filteredJobs : jobs.slice(0, 4)).map((job, index) =>
            !careerList.includes(job) ? (
              <div
                key={index}
                className="bg-gray-100 rounded-full py-2 px-4 cursor-pointer hover:bg-gray-200"
                onClick={() => addCareer(job)}
              >
                {job}
              </div>
            ) : null
          )}
        </div>
      </div>
    </div>
  );
};

export default CareerModal;
