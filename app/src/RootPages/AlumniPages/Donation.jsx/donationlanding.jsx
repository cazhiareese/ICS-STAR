import React, { useEffect, useState } from "react";
import DonationCard from "./Donationcomponent/Donationcard"; // Adjust the import path as necessary

function DonationLanding() {
  const [donationData, setDonationData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [generalDrive, setGeneralDrive] = useState(null);
  console.log(generalDrive);


  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");


  useEffect(() => {
    const fetchGeneralDrive = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/gen-donation-drive`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          throw new Error("Failed to fetch general donation drive");
        }
  
        const data = await response.json();
        setGeneralDrive(data);
      } catch (err) {
        console.error("Error fetching general donation drive:", err);
        // optionally set an error state or silently fail
      }
    };
  
    if (token) {
      fetchGeneralDrive();
    }

    const fetchDonationDrives = async () => {
      if (!token) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/donationdrive`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            setError("Unauthorized access. Please log in.");
          } else {
            throw new Error("Failed to fetch donation drives");
          }
        }

        const data = await response.json();
        if (Array.isArray(data)) {
          setDonationData(data);
          setFilteredData(data);
        } else {
          throw new Error("Unexpected response format");
        }
      } catch (err) {
        console.error("Error fetching donation drives:", err);
        setError(err.message || "Failed to fetch donation drives.");
      } finally {
        setLoading(false);
      }
    };

    fetchDonationDrives();
  }, [token]);

  useEffect(() => {
    const filtered = donationData.filter((drive) =>
      drive.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchQuery, donationData]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="flex flex-col p-4 space-y-4">
      {/* Search bar */}
      <div className="flex justify-center p-4">
        <input
          type="text"
          placeholder="Search donation drives..."
          className="w-full lg:w-1/2 max-w-[600px] px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Layout: Announcements and Donations */}
      <div className="flex flex-col lg:flex-row gap-4 justify-center">
        {/* Left column: Donation cards */}
        <div className="order-2 lg:order-1 flex-1 lg:max-w-[900px] flex flex-wrap gap-4">
          {filteredData.length > 0 ? (
            filteredData.map((drive, index) => (
              <DonationCard key={index} drive={drive} /> 
            ))
          ) : (
            <p className="w-full text-center text-gray-500">
              No donation drives available at the moment.
            </p>
          )}
        </div>

        {/* Right column: Announcements */}
        <div className="order-1 lg:order-2 lg:basis-[900px] bg-gray-100 p-4 rounded-xl shadow text-center h-fit">
  <h2 className="text-xl font-semibold mb-2">DONATE TO ICS</h2>
  {generalDrive ? (
    <DonationCard drive={generalDrive} />
  ) : (
    <p className="text-sm text-gray-600">
      No general donation drive is currently available.
    </p>
  )}
</div>

      </div>
    </div>
  );
}

export default DonationLanding;
