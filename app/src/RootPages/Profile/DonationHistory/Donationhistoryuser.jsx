import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Check } from "lucide-react"; 
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

        setDonationHistory(response.data);
      } catch (err) {
        console.error("Error fetching donation history:", err);
        setError(err.response?.data?.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchDonationHistory();
  }, [token]);

  console.log("Donation History:", donationHistory);

  return (
    <div className="w-full max-w-[1100px] mt-6">
      {/* Section Header */}
      <SectionHeader title="DONATIONS" />

      {loading && <p className="mt-4">Loading...</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}

      {!loading && !error && donationHistory.length === 0 && (
        <p className="mt-4 text-gray-500">No donation history found.</p>
      )}

      {!loading && !error && donationHistory.length > 0 && (
        <div className="mt-4 space-y-4">
          {donationHistory.map((donation) => (
            <div
              key={donation.donation_id}
              className="border p-4 rounded-xl shadow-sm bg-white"
            >
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold text-gray-800">{donation.drive_title}</p>
                  <p className="text-sm text-gray-600">
                    Donated ₱{donation.amount.toLocaleString()} on{" "}
                    {new Date(donation.created_at).toLocaleDateString()}
                  </p>
                </div>
                <Check className="text-green-600" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DonationHistoryUser;
