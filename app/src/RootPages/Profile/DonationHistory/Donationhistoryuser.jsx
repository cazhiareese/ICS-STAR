import React, { useEffect, useState } from "react";
import SectionHeader from "../components/sectionheader";
import axios from "axios";
import { ChevronDown, ChevronUp } from "lucide-react";
import DonationDetailsModal from "./component/donationmodal";
import ReactLoading from "react-loading";
import CircularLoading from "../../../components/LoadingComponents/circularloading";
import NewLoading from "../../../components/LoadingComponents/cyruscircular";

function DonationHistoryUser({ user_id }) {
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
  const [filterLoading, setFilterLoading] = useState(false);


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
          axios.get(`${API_BASE_URL}/donation-history/monetary-donations/${user_id}`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }),
          axios.get(`${API_BASE_URL}/donation-history/in-kind-donations/${user_id}`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }),
        ]);
        

        const monetary = monetaryRes.data.data.map((d) => ({
          ...d,
          type: "Monetary",
          is_acknowledged: d.is_acknowledged ?? false,
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
  }, []);

  const handleSort = (key, type) => {
    setFilterLoading(true);
  
    setTimeout(() => {
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
          aValue = aValue === null ? 0 : aValue ? 1 : -1;
          bValue = bValue === null ? 0 : bValue ? 1 : -1;
        }
  
        if (aValue < bValue) return direction === "asc" ? -1 : 1;
        if (aValue > bValue) return direction === "asc" ? 1 : -1;
        return 0;
      });
  
      setSortedData(sorted);
      setFilterLoading(false);
    }, 1000); // 1 second delay
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

      {/* Inline DonationTableHeader */}
      <div className="mt-1 rounded-xl py-2 font-satoshi-bold">
        <div className="flex font-semibold text-primary">
          <div
            className={
              selectedType === "Monetary"
                ? "w-1/4 cursor-pointer flex items-center gap-1 text-left"
                : "w-1/4 cursor-pointer flex items-center gap-1 text-left"
            }
            onClick={() => handleSort("date_donated", selectedType)}
          >
            Date {getSortIcon("date_donated", selectedType)}
          </div>
          <div
            className={
              selectedType === "Monetary"
                ? "w-1/3 text-left px-2 sm:px-6"
                : "w-1/2 text-left px-2 sm:px-6"
            }
          >
            Donation Drive
          </div>
          {selectedType === "Monetary" ? (
            <>
              <div
                className="w-1/4 cursor-pointer flex items-center gap-1 text-left px-2 sm:px-3"
                onClick={() => handleSort("amount", selectedType)}
              >
                Amount {getSortIcon("amount", selectedType)}
              </div>
              <div
                className="w-1/4 cursor-pointer flex justify-center sm:justify-start items-center gap-1 text-left"

              >
                Status 
              </div>
            </>
          ) : (
            <div
              className="w-1/4 cursor-pointer flex justify-center sm:justify-start items-center gap-1 text-left"

            >
              Status 
            </div>
          )}
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center p-40"><NewLoading size={50} text={"Please Wait as we fetch your Data"} ts={12}/></div>


      )}
      {error && <p className="mt-4 text-red-500">{error}</p>}

      {!loading && !error && currentSortedData.length === 0 && (
        <p className="mt-4 text-gray-500">No donation history found.</p>
      )}
{filterLoading && (
  <div className="flex justify-center items-center p-20">
    <NewLoading size={40} text={"Sorting..."} ts={12} />
  </div>
)}

{!loading && !error && !filterLoading && currentSortedData.length > 0 && (
        <div className="font-satoshi-medium text-[16px] text-black max-h-[525px] overflow-y-auto sm:max-h-[400px] scrollbar-blue">
          {currentSortedData.map((donation) => {
            const formattedDate = new Date(donation.date_donated).toLocaleDateString(
              "en-US",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            );

            const formattedAmount = new Intl.NumberFormat("en-PH", {
              style: "currency",
              currency: "PHP",
              minimumFractionDigits: 2,
            }).format(donation.amount);

            return (
              <div
                key={donation.donation_id}
                onClick={() => openModal(donation)}
                className="border-b border-disabled py-2 flex justify-between items-center cursor-pointer hover:bg-disabled"
              >
                <div
                  className={selectedType === "Monetary" ? "w-1/4" : "w-1/4"}
                >
                  {formattedDate}
                </div>
                <div
                  className={
                    selectedType === "Monetary"
                      ? "w-1/3 px-2 sm:px-6"
                      : "w-1/2 px-2 sm:px-6"
                  }
                >
                  {donation.donation_drive_title}
                </div>
                {selectedType === "Monetary" ? (
                  <>
                    <div className="w-1/4 px-2 sm:px-3 text-left">
                      {formattedAmount}
                    </div>
                    <div className="w-1/4 flex justify-center sm:justify-start items-center">
                      {/* Text for larger screens (hidden at sm and below) */}
                      <span className="hidden sm:inline">
                        {donation.is_acknowledged === null
                          ? "Pending Acknowledgement"
                          : donation.is_acknowledged
                          ? "Acknowledged"
                          : "Disapproved"}
                      </span>
                      {/* Circle for small screens (visible at sm and below) */}
                      <div
                        className={`inline-block sm:hidden w-4 h-4 rounded-full ${
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
                  <div className="w-1/4 flex justify-center sm:justify-start items-center">
                    {/* Text for larger screens (hidden at sm and below) */}
                    <span className="hidden sm:inline">
                      {donation.is_acknowledged === null
                        ? "Pending Acknowledgement"
                        : donation.is_acknowledged
                        ? "Acknowledged"
                        : "Disapproved"}
                    </span>
                    {/* Circle for small screens (visible at sm and below) */}
                    <div
                      className={`inline-block sm:hidden w-4 h-4 rounded-full ${
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