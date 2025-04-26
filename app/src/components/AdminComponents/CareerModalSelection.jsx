import { motion } from "framer-motion";
import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import axios from "axios";

const CareerModal = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [careerInput, setCareerInput] = useState("");
  const [careerList, setCareerList] = useState([]);
  const [jobs, setJobs] = useState([]);

  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const cache = useRef({});

  useEffect(() => {
    const fetchData = async () => {
      if (!careerInput) {
        if (cache.current["top-job-titles"]) {
          setJobs(cache.current["top-job-titles"]);
          return;
        }

        try {
          const response = await axios.get(`${API_BASE_URL}/suggestions/top-job-titles`);
          setJobs(response.data);
          cache.current["top-job-titles"] = response.data;
        } catch (error) {
          console.error("Error fetching job titles:", error);
        }
      } else {
        const query = careerInput.trim().toLowerCase();

        if (cache.current[query]) {
          setJobs(cache.current[query]);
          return;
        }

        try {
          const response = await axios.get(`${API_BASE_URL}/autocomplete/job-titles?q=${encodeURIComponent(query)}&limit=5`);
          setJobs(response.data);
          cache.current[query] = response.data;
        } catch (error) {
          console.error("Error fetching job titles:", error);
        }
      }
    };

    fetchData();
  }, [careerInput]);

  const handleCareerSearch = (e) => {
    if (e.key === "Enter" && careerInput.trim()) {
      setCareerList([...careerList, careerInput.trim()]);
      setCareerInput("");
    }
  };

  const removeCareer = (index) => {
    setCareerList(careerList.filter((_, i) => i !== index));
  };

  const filteredJobs = jobs.filter((job) =>
    job.toLowerCase().includes(careerInput.toLowerCase())
  );

  return (
    <div className="fixed top-1/2 left-1/2 w-[90vw] max-w-md transform -translate-x-1/2 -translate-y-1/2 bg-white shadow-lg rounded-xl p-5 z-50">
      <motion.h1
        className="text-lg font-satoshi-medium mb-3"
        animate={{
          fontWeight: isExpanded ? 600 : 500,
          fontSize: isExpanded ? "1.25rem" : "1rem",
        }}
        transition={{ duration: 0.2 }}
      >
        Alumni Career
      </motion.h1>

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
            <div key={index} className="flex items-center bg-primary text-white rounded-full px-3 py-1 text-sm">
              {career}
              <button onClick={() => removeCareer(index)}>
                <X size={16} className="ml-2" />
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
              onClick={() => setCareerList([...careerList, job])}
            >
              {job}
            </div>
          ) : null
        )}
      </div>
    </div>
  );
};

export default CareerModal;
