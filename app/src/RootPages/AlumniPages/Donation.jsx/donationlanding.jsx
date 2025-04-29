import React, { useEffect, useState } from "react";
import DonationCards from "./Donationcomponent/Donationcard"; // Adjust the import path as necessary
import DonationInfo from "../../../components/donationInfo";
import NewLoading from "../../../components/LoadingComponents/cyruscircular";
import DonationMainView from "../../../components/donationMainView";
import DonationCard from "../../../components/donationDonateView";
import DonationCardSkeleton from "./Donationcomponent/DonationCardSkeleton";
import DonationMainViewSkeleton from "./Donationcomponent/donationmainviewskeleton";
import DonationCSkeleton from "./Donationcomponent/Donationcskeleton";
import { Filter, Search } from "lucide-react";

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
        //Fetch both APIs concurrently
        const [donationResponse, generalResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/donationdrive`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch(`${API_BASE_URL}/gen-donation-drive`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        // Process donation drives
        let donationDataResult = [];
        if (donationResponse.ok) {
          const data = await donationResponse.json();
          if (!Array.isArray(data)) {
            throw new Error("Unexpected response format for donation drives");
          }
          donationDataResult = data;
        } else {
          if (donationResponse.status === 401) {
            throw new Error("Unauthorized access. Please log in.");
          }
          throw new Error("Failed to fetch donation drives");
        }

        // Process general drive
        let generalDriveResult = null;
        if (generalResponse.ok) {
          generalDriveResult = await generalResponse.json();
        } else {
          console.warn("General donation drive fetch failed, continuing without it.");
        }

        // Update all states at once to prevent partial renders
        //setDonationData([dummy,dummy,dummy,dummy,dummy,dummy, dummy, dummy,dummy,dummy, dummy, dummy]); // Use the dummy data for now
        //setFilteredData([dummy,dummy,dummy,dummy,dummy,dummy, dummy, dummy,dummy,dummy, dummy, dummy]); // Use the dummy data for now
        setDonationData(donationDataResult);
        setFilteredData(donationDataResult);
        setGeneralDrive(generalDriveResult);
        //setGeneralDrive(dummy);
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
    <div className="flex flex-col   space-y-5 h-[100px]">
      {/* Search bar */}
      <div className="flex flex-col w-full shadow-md pb-8 items-center rounded-b-[35px] bg-white">
      <div className="relative flex flex-col w-full max-w-[350px] sm:max-w-[600px] mt-6">
  {/* The Search Bar */}
  <input
    type="text"
    placeholder="Search donation drives..."
    className="bg-gray-100 font-satoshi-medium text-lg w-full px-4 py-3 pr-14 rounded-2xl text-black border border-gray-300 focus:border-primary focus:outline-none focus:ring-0"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
  />
  
  {/* Search Button */}
  <button className="absolute right-0 top-0 h-full bg-primary text-white p-3 rounded-2xl hover:brightness-125 flex items-center justify-center w-12 cursor-pointer">
    <Search size={20} />
  </button>
</div>

</div>



  
      {/* Static Donation Drives Header */}
      <div className="hidden sm:flex justify-start items-start pl-[180px] font-satoshi-bold text-[32px] text-primary">
        Donation Drives
      </div>
  
      {/* Wrap everything else inside loading */}
      {loading || donationData === null || generalDrive === null ? (
<div className="flex flex-col lg:flex-row gap-4 justify-center">
  {/* Left column placeholder */}
  <div className="order-2 lg:order-1 flex-1 lg:max-w-[600px] flex flex-col">
    {/* Small device header (only shown on small screens) */}
    <div className="flex justify-center items-center sm:hidden font-satoshi-bold text-[28px] text-primary mb-4">
      Donation Drives
    </div>
<div className="flex flex-col gap-4 sm:flex-row justify-center items-center">
    <DonationCardSkeleton  />
    <DonationCardSkeleton  />
  </div>
  <div className="flex flex-col gap-4 mt-4 sm:flex-row justify-center items-center">
    <DonationCardSkeleton  />
    <DonationCardSkeleton  />
  </div>

  </div>

  {/* Right column placeholder */}
  <div className="order-1 lg:order-2 lg:basis-[950px] px-8 rounded-xl text-center h-fit">
  <div className="flex flex-col sm:flex-row gap-4 justify-center sm:justify-center w-full">
    {/* Container for DonationMainView */}
    <div className="bg-disabled border border-disabled rounded-xl p-4 w-full sm:w-[650px]">
    <DonationMainViewSkeleton />
    </div>

    {/* DonationCard */}
    <div className="items-center justify-center sm:justify-start sm:items-start flex flex-col sm:flex-row gap-4 w-full sm:w-[300px]">
      <DonationCSkeleton />
    </div>
  </div>
</div>

</div>

      ) : (
        <div className="flex flex-col lg:flex-row gap-4 justify-center h-[2100px] sm:h-[680px] mt-6 sm:mt-1">
          {/* Left column: Donation cards */}
          <div className="order-2 lg:order-1 flex-1 lg:max-w-[600px] flex flex-col">
            {/* Small device header */}
            <div className="flex justify-center items-center sm:hidden font-satoshi-bold text-[28px] text-primary mb-4">
              Donation Drives
            </div>
  
            {/* Scrollable Cards */}
            <div
              className="overflow-y-auto scrollbar-blue"
              style={{ maxHeight: "calc(100vh - 200px)", direction: "rtl" }}
            >
              <div className="flex flex-wrap gap-4 justify-center items-center" style={{ direction: "ltr" }}>
                {filteredData.length > 0 ? (
                  filteredData.map((drive, index) => (
                    <DonationCards key={index} drive={drive} loading={true} />
                
                  ))
                ) : (
                  <p className="w-full text-center text-gray-500">
                    No donation drives available at the moment.
                  </p>
                )}
              </div>
            </div>
          </div>
  
          {/* Right column: Announcements */}
          <div className="order-1 lg:order-2 lg:basis-[950px] px-4 rounded-xl text-center h-fit">
            {generalDrive ? (
              <div className="-mt-5 flex flex-col sm:flex-row gap-4 justify-center sm:justify-center">
                {/* Container for DonationMainView */}
                <div className="bg-whitey border border-disabled rounded-xl p-4">
                  <DonationMainView driveDetails={generalDrive} driveId={generalDrive.drive_id} landing={true} />
                </div>
                {/* DonationCard */}
                <div className="items-center justify-center sm:justify-start sm:items-start flex flex-col sm:flex-row gap-4">
                  <DonationCard driveDetails={generalDrive} driveId={generalDrive.drive_id} />
                </div>
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