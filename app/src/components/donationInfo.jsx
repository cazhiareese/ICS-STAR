import React, { useContext, useState, useEffect } from "react";
// import { Paperclip } from 'lucide-react';
import DonationMainView from "./donationMainView";
import DonationCard from "./donationDonateView";
import { useParams } from "react-router-dom";

function DonationInfo({driveID}) {

  const drive_id = useParams();


    // const [donationDrives, setDonationDrives] = useState([]);
  const [loading, setLoading] = useState(true);

  const [donationID, setDonationID] = useState(drive_id)

  
  useEffect(() => {
    // setDonationID("204eab7c-8c62-4669-b8d5-08d68c1fbb3b")
    const token = localStorage.getItem("token"); // or wherever you store it
  
    fetch("https://ics-star-api.vercel.app/donationdrive", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched data:", data[0]);
        // setDonationDrives(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching donation drives:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
//   console.log()
    return (

        <div className="flex flex-row justify-center overflow-y-auto pt-20 space-x-20">
            
            <DonationMainView driveId={donationID}/>
            <DonationCard driveId = {donationID}/>
            
        </div>
    );
}

export default DonationInfo;