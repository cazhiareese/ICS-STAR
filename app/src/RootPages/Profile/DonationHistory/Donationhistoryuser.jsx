import React, { useEffect, useState } from "react";
import SectionHeader from "../components/sectionheader";
import axios from "axios";
import { ChevronDown, ChevronUp } from "lucide-react";
import DonationDetailsModal from "../components/donationmodal";

function DonationHistoryUser({ userDetails }) {
  const [donationHistory, setDonationHistory] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
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
        const response = await axios.get(`${API_BASE_URL}/donation-history`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const sortedByLatest = response.data.data.sort(
          (a, b) => new Date(b.date_donated) - new Date(a.date_donated)
        );

        setDonationHistory(sortedByLatest);
        setSortedData(sortedByLatest);
        setSortConfig({ key: "date_donated", direction: "desc" });
      } catch (err) {
        console.error("Error fetching donation history:", err);
        setError(err.response?.data?.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchDonationHistory();
  }, [token]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sorted = [...donationHistory].sort((a, b) => {
      let aValue = a[key];
      let bValue = b[key];

      if (key === "date_donated") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (key === "details") {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      }

      if (aValue < bValue) return direction === "asc" ? -1 : 1;
      if (aValue > bValue) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setSortedData(sorted);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <ChevronDown className="inline text-primary w-4 h-4" />;
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="inline text-primary w-4 h-4" />
    ) : (
      <ChevronDown className="inline text-primary w-4 h-4" />
    );
  };

  return (
    <div className="w-full max-w-[1100px] mt-6">
      {/* Section Header */}
      <SectionHeader title="DONATIONS" />

      {/* Table Header */}
      <div className="mt-1 rounded-xl py-2 font-satoshi-bold">
        <div className="flex font-semibold text-primary">
          <div
            className="w-1/3 cursor-pointer flex items-center gap-1"
            onClick={() => handleSort("date_donated")}
          >
            Date {getSortIcon("date_donated")}
          </div>
          <div className="w-1/3">Donation</div>
          <div
            className="w-1/3 text-right cursor-pointer flex justify-end items-center gap-1"
            onClick={() => handleSort("details")}
          >
            Amount {getSortIcon("details")}
          </div>
        </div>
      </div>

      {loading && <p className="mt-4">Loading...</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}

      {!loading && !error && sortedData.length === 0 && (
        <p className="mt-4 text-gray-500">No donation history found.</p>
      )}

      {/* Scrollable Donation List */}
      {!loading && !error && sortedData.length > 0 && (
        <div className="font-satoshi-medium text-[16px] text-black max-h-[525px] overflow-y-auto sm:max-h-[400px] scrollbar-blue">
          {sortedData.map((donation) => {
            const formattedDate = new Date(donation.date_donated).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            });

            const formattedAmount = new Intl.NumberFormat("en-PH", {
              style: "currency",
              currency: "PHP",
              minimumFractionDigits: 2,
            }).format(donation.details);

            return (
              <div
                key={donation.donation_id}
                onClick ={() => openModal(donation)}
                className="border-b py-2 flex justify-between items-center cursor-pointer hover:bg-hover"
                
              >
                <div className="w-1/3">{formattedDate}</div>
                <div className="w-1/3">{donation.donation_drive_title}</div>
                <div className="w-1/3 text-right">{formattedAmount}</div>
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
