import React, { useContext, useState } from "react";
import { Paperclip } from 'lucide-react';
import DonationMainView from "./donationMainView";
import DonationCard from "./donationDonateView";

function DonationInfo() {

    const [image, setImage] = useState("null")

    return (
        <div className="flex flex-row justify-center overflow-y-auto pt-20 space-x-20">
            
            <DonationMainView/>
            <DonationCard/>
        </div>
    );
}

export default DonationInfo;