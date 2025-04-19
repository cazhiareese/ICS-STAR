import React, { useState, useEffect } from "react";
import DonationCard from "./donationDonateView";
import DonationMainView from "./donationMainView";
import { useParams } from "react-router-dom";

function DonationInfo({generalDrive}) {
    const { driveid } = useParams(); // <- destructure directly if param is named 'driveid'
    const [driveDetails, setDriveDetails] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");

        fetch(`https://ics-star-api.vercel.app/one-donation-drive/${driveid}`, {
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
    }, [driveid]);

    if (!driveDetails) return <p>Loading drive...</p>;

    return (
        <div className="flex md:flex-row flex-col justify-center md:items-start items-center overflow-y-auto md:pt-20 pt-10 md:space-x-20">
            <div className="flex flex-col lg:w-[50%] md:w-[40%] w-[95%] md:h-180 h-120 border border-gray-300 rounded-2xl items-center overflow-scroll">
                {
                    generalDrive==null ? (<DonationMainView driveDetails={driveDetails} driveId = {driveid}/>):(<DonationMainView driveDetails={generalDrive} driveId = {generalDrive.drive_id}/>)
                }
            </div>
                
            {generalDrive==null ? (<DonationCard driveDetails={driveDetails} driveId = {driveid}/>):(<DonationCard driveDetails={generalDrive} driveId = {generalDrive.drive_id}/>)}
        </div>
    );
}

export default DonationInfo;
