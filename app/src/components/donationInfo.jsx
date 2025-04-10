import React, { useContext, useState, useEffect } from "react";
// import { Paperclip } from 'lucide-react';
import DonationMainView from "./donationMainView";
import DonationCard from "./donationDonateView";
import { useParams } from "react-router-dom";

function DonationInfo() {

  const drive_id = useParams();
  console.log(drive_id);

  const [donationID, setDonationID] = useState(drive_id)

  console.log(donationID);
//   console.log()
    return (

        <div className="flex flex-row justify-center overflow-y-auto pt-20 space-x-20">
            
            <DonationMainView driveId={donationID}/>
            <DonationCard driveId = {donationID}/>
            
        </div>
    );
}

export default DonationInfo;