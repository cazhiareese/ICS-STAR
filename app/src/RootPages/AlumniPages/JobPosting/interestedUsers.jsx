import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function InterestedUsers() {
  // const { id } = useParams();
  const id = "f7a09e35-1e12-4214-9bda-5c87de635416"; // temporary hardcoded ID
  const [interestedUsers, setInterestedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchInterestedUsers = async () => {
      if (!token) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/job/interested_in/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            setError("Unauthorized access. Please log in.");
          } else if (response.status === 404) {
            setError("No users found who are interested in this job posting.");
          } else {
            throw new Error("Failed to fetch interested users");
          }
          return;
        }

        const data = await response.json();
        console.log("Interested Users Data:", data);
        setInterestedUsers(data);
      } catch (err) {
        console.error("Error fetching interested users:", err);
        setError(err.message || "Failed to fetch interested users.");
      } finally {
        setLoading(false);
      }
    };

    fetchInterestedUsers();
  }, [id, token]);

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 py-3 border-b border-gray-200 bg-white rounded-t-2xl">
        <div>
          <h1 className="text-xl sm:text-2xl font-satoshi-bold text-gray-800">Interested Users</h1>
          <p className="text-sm text-gray-500 mt-1 sm:mt-0">
            View the list of users who have shown interest in this donation drive.
          </p>
        </div>
        <div className="mt-3 sm:mt-0">
          <button className="bg-primary text-white px-4 py-2 rounded-full text-sm hover:bg-hover transition">
            Export List
          </button>
        </div>
      </div>

      {/* Content */}
      {loading && <p className="text-gray-500 mt-4">Loading...</p>}
      {error && <p className="text-red-500 mt-4">{error}</p>}

      {!loading && !error && interestedUsers.length > 0 && (
        <div className="overflow-auto mt-4">
  <div className="max-w-[1100px] mx-auto">
    <table className="min-w-full text-sm text-left text-gray-700 border border-gray-200 rounded-xl overflow-hidden">
      <thead className="bg-gray-100 text-xs text-gray-600 uppercase">
        <tr>
          <th className="px-4 py-3">Name</th>
          <th className="px-4 py-3">Batch</th>
          <th className="px-4 py-3">Base Location</th>
          <th className="px-4 py-3">Job Title</th>
          <th className="px-4 py-3">Industry</th>
          <th className="px-4 py-3">Interested On</th>
        </tr>
      </thead>
      <tbody>
  {interestedUsers.map((user, idx) => (
    <tr key={idx} className="border-t hover:bg-gray-50">
      <td className="px-4 py-3 flex items-center gap-3">
        <img
          src={user.image || "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.name)}
          alt={user.name}
          className="w-8 h-8 rounded-full object-cover border"
        />
        <span className="font-medium text-gray-800">{user.name}</span>
      </td>
      <td className="px-4 py-3">{user.batch}</td>
      <td className="px-4 py-3">{user.location}</td>
      <td className="px-4 py-3">{user.title}</td>
      <td className="px-4 py-3">{user.industry || "—"}</td>
      <td className="px-4 py-3">{user.date_of_interest}</td>
    </tr>
  ))}
</tbody>

    </table>
  </div>
</div>

      )}
    </div>
  );
}

export default InterestedUsers;
