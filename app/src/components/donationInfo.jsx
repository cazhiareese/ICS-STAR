import React, { useState, useEffect } from "react";
import DonationCard from "./donationDonateView";
import DonationMainView from "./donationMainView";
import { useParams } from "react-router-dom";
import NewLoading from "./LoadingComponents/cyruscircular";

function DonationInfo({generalDrive, general }) {
    const idUser = useParams(); // <- destructure directly if param is named 'driveid'
    const driveid = idUser.driveid; 
    const [driveDetails, setDriveDetails] = useState(null);
    const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
    useEffect(() => {
        const token = localStorage.getItem("token");
        console.log(`${API_BASE_URL}/${driveid}`)
        console.log(driveid)
        // console.log("SDFDSF")
        fetch(`${API_BASE_URL}/one-donation-drive/${driveid}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setDriveDetails(data);
                console.log("Drive details:", data);
            })
            .catch((err) => {
                console.error("Error fetching drive details:", err);
            });
    }, []);

    if (!driveDetails) {
        return (
          <NewLoading
            size={32}
            text={general ? "Fetching General ICS Donation Drive" : "Fetching Donation Drive Details"}
          />
        );
      }

    return (
        <div className="flex lg:flex-row flex-col justify-center lg:items-start items-center overflow-y-auto lg:pt-20 pt-10 lg:space-x-20 sm:mx-0 mx-5">
            <div className="flex flex-col lg:w-[45%] md:w-[90%] w-[95%] md:h-180 sm:h-120 border border-gray-300 rounded-2xl overflow-y-auto mb-5">
                {
                    generalDrive==null ? (<DonationMainView driveDetails={driveDetails} driveId = {driveid} landing={false}/>):(<DonationMainView driveDetails={generalDrive} driveId = {generalDrive.drive_id}/>)
                }
            </div>
            <div className="lg:w-[30%]">
            {generalDrive==null ? (<DonationCard driveDetails={driveDetails} driveId = {driveid}/>):(<DonationCard driveDetails={generalDrive} driveId = {generalDrive.drive_id}/>)}
       
            </div>
                
             </div>
    );
}

export default DonationInfo;
