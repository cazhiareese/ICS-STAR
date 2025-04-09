import React, { useEffect, useState } from "react";

function DonationLanding() {
  const [donationData, setDonationData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");

  useEffect(() => {
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
    <div className="p-4 space-y-4">
      {/* Search bar */}
      <div className="block lg:block order-2 lg:order-1">
        <input
          type="text"
          placeholder="Search donation drives..."
          className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Donation cards */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 order-3 lg:order-2">
          {filteredData.length > 0 ? (
            filteredData.map((drive, index) => (
              <div key={index} className="p-4 border rounded-xl shadow bg-white">
                <h3 className="text-lg font-bold text-gray-800">{drive.title}</h3>
                <p className="text-gray-600">{drive.description}</p>
                <p className="text-sm text-gray-500 mt-2">
                  🎯 Target: ₱{drive.target_cost}
                </p>
                <p className="text-sm text-gray-500">💸 Donated: ₱{drive.total_amount_donated}</p>
                <p className="text-sm text-gray-500">🙌 Donations: {drive.donation_count}</p>
                <p className="text-xs text-gray-400 mt-1">
                  📅 {new Date(drive.created_at).toLocaleDateString()}
                </p>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              No donation drives available at the moment.
            </p>
          )}
        </div>

        {/* Right: Info/Announcements */}
        <div className="order-1 lg:order-3 bg-gray-100 p-4 rounded-xl shadow text-center h-fit">
          <h2 className="text-xl font-semibold">📢 Announcements</h2>
          <p className="text-sm text-gray-600 mt-2">
            This area can be used for announcements, donation stats, or other info.
          </p>
        </div>
      </div>
    </div>
  );
}

export default DonationLanding;
