import React, { useEffect, useState } from "react";
import SectionHeader from "../components/sectionheader";
import axios from "axios";

function DonationHistoryUser({ userDetails }) {
  const [donationHistory, setDonationHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");

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

        setDonationHistory(response.data.data);
      } catch (err) {
        console.error("Error fetching donation history:", err);
        setError(err.response?.data?.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchDonationHistory();
  }, [token]);

  return (
    <div className="w-full max-w-[1100px] mt-6">
      {/* Section Header */}
      <SectionHeader title="DONATIONS" />
<div className="mt-1  rounded-xl px-4 py-2">
      <div className="flex font-semibold text-primary">
            <div className="w-1/3">Date</div>
            <div className="w-1/3">Donation</div>
            <div className="w-1/3 text-right">Amount</div>
          </div>
          </div>

      {loading && <p className="mt-4">Loading...</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}

      {!loading && !error && donationHistory.length === 0 && (
        <p className="mt-4 text-gray-500">No donation history found.</p>
      )}

      {!loading && !error && donationHistory.length > 0 && (
        <div className="px-4">

          {/* Donation Rows */}
          {donationHistory.map((donation) => {
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
                className="border-b py-2 flex justify-between items-center"
              >
                <div className="w-1/3 text-gray-800">{formattedDate}</div>
                <div className="w-1/3 text-gray-700">{donation.donation_drive_title}</div>
                <div className="w-1/3 text-right text-gray-900">{formattedAmount}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default DonationHistoryUser;
