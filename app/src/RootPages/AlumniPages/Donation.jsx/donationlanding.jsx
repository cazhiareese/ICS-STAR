import React, { useEffect, useState } from "react";
import DonationCards from "./Donationcomponent/Donationcard"; // Adjust the import path as necessary
import DonationInfo from "../../../components/donationInfo";
import NewLoading from "../../../components/LoadingComponents/cyruscircular";
import DonationMainView from "../../../components/donationMainView";
import DonationCard from "../../../components/donationDonateView";

function DonationLanding() {
  const [donationData, setDonationData] = useState(null); // Initialize as null
  const [filteredData, setFilteredData] = useState(null); // Initialize as null
  const [generalDrive, setGeneralDrive] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const dummy = {
          
            drive_id: "basbdjabaskckasc",
            title: "ICS Student Scholarship Fund",
            description: "Provide financial assistance to deserving ICS students who demonstrate academic excellence and need.",
            target_cost: 300000,
            image_url: "ics_scholarship.jpg",
            total_amount_donated: 20841.42,
            donation_count: 10,
            created_at: "2025-04-08T13:51:01.554485Z"
          
        }
        // Fetch both APIs concurrently
        // const [donationResponse, generalResponse] = await Promise.all([
        //   fetch(`${API_BASE_URL}/donationdrive`, {
        //     method: "GET",
        //     headers: {
        //       Authorization: `Bearer ${token}`,
        //     },
        //   }),
        //   fetch(`${API_BASE_URL}/gen-donation-drive`, {
        //     headers: {
        //       Authorization: `Bearer ${token}`,
        //     },
        //   }),
        // ]);

        // // Process donation drives
        // let donationDataResult = [];
        // if (donationResponse.ok) {
        //   const data = await donationResponse.json();
        //   if (!Array.isArray(data)) {
        //     throw new Error("Unexpected response format for donation drives");
        //   }
        //   donationDataResult = data;
        // } else {
        //   if (donationResponse.status === 401) {
        //     throw new Error("Unauthorized access. Please log in.");
        //   }
        //   throw new Error("Failed to fetch donation drives");
        // }

        // // Process general drive
        // let generalDriveResult = null;
        // if (generalResponse.ok) {
        //   generalDriveResult = await generalResponse.json();
        // } else {
        //   console.warn("General donation drive fetch failed, continuing without it.");
        // }

        // Update all states at once to prevent partial renders
        setDonationData([dummy,dummy,dummy,dummy,dummy,dummy, dummy, dummy,dummy,dummy, dummy, dummy]); // Use the dummy data for now
        setFilteredData([dummy,dummy,dummy,dummy,dummy,dummy, dummy, dummy,dummy,dummy, dummy, dummy]); // Use the dummy data for now
        //setDonationData(donationDataResult);
        //setFilteredData(donationDataResult);
        //setGeneralDrive(generalDriveResult);
        setGeneralDrive(dummy);
        console.log("Donation Data:", donationData);
        console.log("General Drive:", generalDrive);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message || "Failed to fetch data.");
        setDonationData([]);
        setFilteredData([]);
        setGeneralDrive(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (donationData) {
      const filtered = donationData.filter((drive) =>
        drive.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [searchQuery, donationData]);

  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="flex flex-col p-4 space-y-5 h-[100px] ">
      {/* Search bar */}
      <div className="flex justify-center p-5">
        <input
          type="text"
          placeholder="Search donation drives..."
          className="w-full lg:w-1/2 max-w-[600px] px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Loading State */}
      {loading || donationData === null || generalDrive === null ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <NewLoading size={40} text="Loading Donation Drives..." />
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-4 justify-center">
          {/* Left column: Donation cards */}
          <div
  className="order-2 lg:order-1 flex-1 lg:max-w-[600px] flex flex-wrap gap-4 overflow-y-auto scrollbar-blue"
  style={{ maxHeight: "calc(100vh - 200px)" }}
>
            {filteredData.length > 0 ? (
              filteredData.map((drive, index) => (
                <DonationCards key={index} drive={drive} />
              ))
            ) : (
              <p className="w-full text-center text-gray-500">
                No donation drives available at the moment.
              </p>
            )}
          </div>

{/* Right column: Announcements */}
<div className="order-1 lg:order-2 lg:basis-[900px] px-4 rounded-xl text-center h-fit ">
  {generalDrive ? (
    <div className="-mt-5 flex flex-col sm:flex-row gap-4 justify-center">
      {/* Container for DonationMainView */}
      <div className="bg-whitey border border-disabled rounded-xl p-4">
        <DonationMainView driveDetails={generalDrive} driveId={generalDrive.drive_id} />
      </div>
      {/* DonationCard */}
      <DonationCard driveDetails={generalDrive} driveId={generalDrive.drive_id} />
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