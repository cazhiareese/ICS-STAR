import React, { useEffect, useState } from "react";

function DonationLanding() {
  // State to hold the donation drive data
  const [donationData, setDonationData] = useState([]);
  const [loading, setLoading] = useState(true);  // To track loading state
  const [error, setError] = useState(null); // To track error state
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");
  console.log("Token:", token); // Debugging line to check the token

  useEffect(() => {
    // Fetch data when the component mounts
    const fetchDonationDrives = async () => {
      if (!token) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      try {
        // Make the fetch request to your backend API
        const response = await fetch(`${API_BASE_URL}/donationdrive`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          },
        });

        // Check if the response is successful
        if (!response.ok) {
          if (response.status === 401) {
            setError("Unauthorized access. Please log in.");
            // Optionally, you can redirect to the login page here.
            // window.location.href = "/login"; // Uncomment if you want to redirect
          } else {
            throw new Error("Failed to fetch donation drives");
          }
        }

        const data = await response.json();  // Parse the JSON data
        if (Array.isArray(data)) {
          setDonationData(data);  // Set the fetched data if it's an array
        } else {
          throw new Error("Unexpected response format");
        }
      } catch (err) {
        console.error("Error fetching donation drives:", err);
        setError(err.message || "Failed to fetch donation drives.");
      } finally {
        setLoading(false);  // Stop loading
      }
    };

    fetchDonationDrives();
  }, [token]); 

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Donation Drives</h1>
      {donationData.length > 0 ? (
        <ul>
          {donationData.map((drive, index) => (
            <li key={index}>
              <h3>{drive.title}</h3>
              <p>{drive.description}</p>
              <p>{drive.target_cost}</p>
              <p>{drive.image_url}</p>
              <p>{drive.total_amount_donated}</p>                           
              <p>{drive.donation_count}</p>
              <p>{drive.created_at}</p>  
            </li>
          ))}
        </ul>
      ) : (
        <p>No donation drives available at the moment.</p>
      )}
    </div>
  );
}

export default DonationLanding;
