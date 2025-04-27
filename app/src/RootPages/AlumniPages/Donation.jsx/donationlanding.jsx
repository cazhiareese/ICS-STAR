import React, { useEffect, useState } from "react";
import DonationCard from "./Donationcomponent/Donationcard"; // Adjust the import path as necessary
import DonationInfo from "../../../components/donationInfo";
import NewLoading from "../../../components/LoadingComponents/cyruscircular";

function DonationLanding() {
  const [donationData, setDonationData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generalDriveLoading, setGeneralDriveLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [generalDrive, setGeneralDrive] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchGeneralDrive = async () => {
      setGeneralDriveLoading(true);
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
      } finally {
        setGeneralDriveLoading(false);
      }
    };

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

    if (token) {
      fetchGeneralDrive();
      fetchDonationDrives();
    } else {
      setGeneralDriveLoading(false);
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    const filtered = donationData.filter((drive) =>
      drive.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchQuery, donationData]);

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

      {/* Loading State */}
      {(loading || generalDriveLoading) && (
        <div className="flex justify-center items-center min-h-[200px]">
          <NewLoading size={40} text="Loading Donation Drives..." />
        </div>
      )}

      {/* Layout: Announcements and Donations */}
      {!loading && !generalDriveLoading && (
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
          <div className="order-1 lg:order-2 lg:basis-[900px] px-4 rounded-xl text-center h-fit pb-10">
            {generalDrive ? (
              <div className="-mt-5">
                <DonationInfo generalDrive={generalDrive} />
              </div>
            ) : (
              <p className="text-sm text-gray-600">
                No general donation drive is currently available.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default DonationLanding;