import React, { useEffect, useState } from "react";
import SectionHeader from "../components/sectionheader";
import axios from "axios";
import { ChevronDown, ChevronUp } from "lucide-react";
import DonationDetailsModal from "./component/donationmodal";
import DonationTableHeader from "./component/donationheader";

function DonationHistoryUser({ userDetails }) {
  const [monetaryDonations, setMonetaryDonations] = useState([]);
  const [inKindDonations, setInKindDonations] = useState([]);
  const [sortedDataMonetary, setSortedDataMonetary] = useState([]);
  const [sortedDataInKind, setSortedDataInKind] = useState([]);
  const [sortConfigMonetary, setSortConfigMonetary] = useState({ key: null, direction: "asc" });
  const [sortConfigInKind, setSortConfigInKind] = useState({ key: null, direction: "asc" });
  const [selectedType, setSelectedType] = useState("Monetary");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");

  const openModal = (donation) => {
    setSelectedDonation(donation);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedDonation(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchDonationHistory = async () => {
      if (!token) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      try {
        const [monetaryRes, inKindRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/donation-history/monetary-donations`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_BASE_URL}/donation-history/in-kind-donations`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const monetary = monetaryRes.data.data.map((d) => ({
          ...d,
          type: "Monetary",
          is_acknowledged: d.is_acknowledged ?? false, // Fallback if status is missing
        }));
        console.log(monetary);

        const inKind = inKindRes.data.data.map((d) => ({
          ...d,
          type: "In-Kind",
          amount: 0,
        }));
        console.log(inKind);

        const sortedMonetary = [...monetary].sort((a, b) => new Date(b.date_donated) - new Date(a.date_donated));
        const sortedInKind = [...inKind].sort((a, b) => new Date(b.date_donated) - new Date(a.date_donated));

        setMonetaryDonations(monetary);
        setInKindDonations(inKind);
        setSortedDataMonetary(sortedMonetary);
        setSortedDataInKind(sortedInKind);
        setSortConfigMonetary({ key: "date_donated", direction: "desc" });
        setSortConfigInKind({ key: "date_donated", direction: "desc" });
      } catch (err) {
        console.error("Error fetching donation history:", err);
        setError(err.response?.data?.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchDonationHistory();
  }, [token]);

  const handleSort = (key, type) => {
    const currentSortConfig = type === "Monetary" ? sortConfigMonetary : sortConfigInKind;
    const setSortConfig = type === "Monetary" ? setSortConfigMonetary : setSortConfigInKind;
    const dataToSort = type === "Monetary" ? [...monetaryDonations] : [...inKindDonations];
    const setSortedData = type === "Monetary" ? setSortedDataMonetary : setSortedDataInKind;

    let direction = "asc";
    if (currentSortConfig.key === key && currentSortConfig.direction === "asc") {
      direction = "desc";
    }

    setSortConfig({ key, direction });

    const sorted = dataToSort.sort((a, b) => {
      let aValue = a[key];
      let bValue = b[key];

      if (key === "date_donated") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else if (key === "amount") {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      } else if (key === "is_acknowledged") {
        aValue = aValue ? 1 : 0; // Convert boolean to 1/0 for sorting
        bValue = bValue ? 1 : 0;
      }

      if (aValue < bValue) return direction === "asc" ? -1 : 1;
      if (aValue > bValue) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setSortedData(sorted);
  };

  const getSortIcon = (key, type) => {
    const config = type === "Monetary" ? sortConfigMonetary : sortConfigInKind;
    if (config.key !== key)
      return <ChevronDown className="inline text-primary w-4 h-4" />;
    return config.direction === "asc" ? (
      <ChevronUp className="inline text-primary w-4 h-4" />
    ) : (
      <ChevronDown className="inline text-primary w-4 h-4" />
    );
  };

  const currentSortedData = selectedType === "Monetary" ? sortedDataMonetary : sortedDataInKind;

  return (
    <div className="w-full max-w-[1100px] mt-6">
      <SectionHeader
        title="DONATIONS"
        onToggleChange={(type) => {
          setSelectedType(type);
        }}
      />

      <DonationTableHeader
        onSort={handleSort}
        getSortIcon={getSortIcon}
        selectedType={selectedType}
      />

      {loading && <p className="mt-4">Loading...</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}

      {!loading && !error && currentSortedData.length === 0 && (
        <p className="mt-4 text-gray-500">No donation history found.</p>
      )}

      {!loading && !error && currentSortedData.length > 0 && (
        <div className="font-satoshi-medium text-[16px] text-black max-h-[525px] overflow-y-auto sm:max-h-[400px] scrollbar-blue">
          {currentSortedData.map((donation) => {
            const formattedDate = new Date(
              donation.date_donated
            ).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            });

            const formattedAmount = new Intl.NumberFormat("en-PH", {
              style: "currency",
              currency: "PHP",
              minimumFractionDigits: 2,
            }).format(donation.amount);

            return (
              <div
                key={donation.donation_id}
                onClick={() => openModal(donation)}
                className="border-b py-2 flex justify-between items-center cursor-pointer hover:bg-disabled"
              >
                <div className={selectedType === "Monetary" ? "w-1/4" : "w-1/3"}>
                  {formattedDate}
                </div>
                <div className={selectedType === "Monetary" ? "w-1/4 " : "w-1/3"}>
                  {donation.donation_drive_title}
                </div>
                {selectedType === "Monetary" ? (
  <>
    <div className="w-1/4 text-left">{formattedAmount}</div>
    <div className="w-1/4 text-left">
      {/* Text display for larger screens */}
      <span className="sm:inline hidden">
        {donation.is_acknowledged ? "Acknowledged" : "Not Acknowledged"}
      </span>
      {/* Circle display for small screens */}
      <div
        className={`sm:hidden inline-block w-4 h-4 rounded-full ${
          donation.is_acknowledged === null
            ? "bg-yellow-500"
            : donation.is_acknowledged
            ? "bg-green-500"
            : "bg-red-500"
        }`}
      ></div>
    </div>
  </>
) : (
  <div className="w-1/3 text-left">
    {/* Text display for larger screens */}
    <span className="sm:inline hidden">
      {donation.is_acknowledged ? "Acknowledged" : "Not Acknowledged"}
    </span>
    {/* Circle display for small screens */}
    <div
      className={`sm:hidden inline-block w-4 h-4 rounded-full ${
        donation.is_acknowledged === null
          ? "bg-yellow-500"
          : donation.is_acknowledged
          ? "bg-green-500"
          : "bg-red-500"
      }`}
    ></div>
  </div>
)}
              </div>
            );
          })}
        </div>
      )}

      <DonationDetailsModal
        isOpen={isModalOpen}
        onClose={closeModal}
        donation={selectedDonation}
      />
    </div>
  );
}

export default DonationHistoryUser;