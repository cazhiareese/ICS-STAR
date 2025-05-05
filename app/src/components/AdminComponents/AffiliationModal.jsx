import React, { useState, useEffect } from "react";
import { Search, XCircle, X } from "lucide-react";
import axios from "axios";

const AffiliationModal = ({ setAffiliationList, setIsAffiliationModalOpen }) => {
  const [affiliationInput, setAffiliationInput] = useState("");
  const [orgs, setOrgs] = useState([]);
  const [affiliationList, internalSetAffiliationList] = useState([]);

  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching organizations...");
        if (!affiliationInput.trim()) {
          // Clear suggestions when input is empty
          setOrgs([]);
        } else {
          const query = affiliationInput.trim();
          const response = await axios.get(
            `${API_BASE_URL}/get-org?q=${encodeURIComponent(query)}&limit=5`
          );
          setOrgs(response.data);
        }
      } catch (error) {
        console.error("Error fetching organizations:", error);
      }
    };

    fetchData();
  }, [affiliationInput]);

  const handleAffiliationSearch = (e) => {
    if (e.key === "Enter" && affiliationInput.trim()) {
      const newAffiliation = affiliationInput.trim();
      // Only add if the input exactly matches one of the suggested organizations
      if (orgs.includes(newAffiliation) && !affiliationList.includes(newAffiliation)) {
        const updatedList = [...affiliationList, newAffiliation];
        internalSetAffiliationList(updatedList);
        setAffiliationList(updatedList);
        setAffiliationInput("");
      }
    }
  };

  const addAffiliation = (org) => {
    if (!affiliationList.includes(org)) {
      const updatedList = [...affiliationList, org];
      internalSetAffiliationList(updatedList);
      setAffiliationList(updatedList);
    }
  };

  const removeAffiliation = (index) => {
    const updatedList = affiliationList.filter((_, i) => i !== index);
    internalSetAffiliationList(updatedList);
    setAffiliationList(updatedList);
  };

  const filteredOrgs = orgs.filter((org) =>
    org.toLowerCase().includes(affiliationInput.toLowerCase())
  );

  const handleSubmit = () => {
    setAffiliationList(affiliationList);
    setIsAffiliationModalOpen(false);
  };

  const handleCloseModal = () => {
    internalSetAffiliationList([]); // Clear the affiliation list
    setAffiliationList([]); // Ensure the parent component's state is also cleared
    setIsAffiliationModalOpen(false); // Close the modal
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-gray-500 opacity-40 pointer-events-none"></div>
      <div className="bg-white border border-disabled p-6 relative z-10 flex flex-col w-full max-w-[650px] rounded-2xl shadow-lg sm:w-11/12 max-h-screen overflow-auto">
        <div className="flex justify-between items-center pb-2">
          <h2 className="text-lg font-satoshi-bold sm:text-[24px]">
            Alumni Affiliations
          </h2>
          <XCircle
            size={24}
            className="cursor-pointer text-white bg-error rounded-full hover:bg-red-800"
            onClick={handleCloseModal} // Close modal and clear affiliation list
          />
        </div>

        <div className="relative mb-4">
          <input
            type="search"
            className="w-full border border-gray-300 rounded-2xl pl-10 pr-4 py-2 outline-none"
            placeholder="Enter organization name"
            value={affiliationInput}
            onChange={(e) => setAffiliationInput(e.target.value)}
            onKeyDown={handleAffiliationSearch}
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary">
            <Search size={18} />
          </span>
        </div>

        {affiliationList.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {affiliationList.map((affiliation, index) => (
              <div
                key={index}
                className="flex items-center bg-primary text-white px-3 py-1 rounded-full text-sm"
              >
                {affiliation}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeAffiliation(index);
                  }}
                  className="ml-2"
                  type="button"
                >
                  <X size={18} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="text-sm text-gray-500 mb-2">Suggestions</div>
        <div className="space-y-2 max-h-40 overflow-y-auto scrollbar-blue">
          {(affiliationInput ? filteredOrgs : orgs.slice(0, 4)).map((org, index) =>
            !affiliationList.includes(org) ? (
              <div
                key={index}
                className="bg-gray-100 rounded-full py-2 px-4 cursor-pointer hover:bg-gray-200"
                onClick={() => addAffiliation(org)}
              >
                {org}
              </div>
            ) : null
          )}
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-primary text-white px-4 py-2 rounded-full hover:bg-primary-dark"
            type="button"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default AffiliationModal;