import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

export default function DonationCard({driveDetails, driveId}) {
  console.log("malupey");
  console.log(driveDetails)
  // const  driveId  = useParams();

  // console.log(driveId.driveid);
  const navigate = useNavigate();

  const handledonationform = () => {
    navigate(`/alumni/donationforms/${driveId}`);
    //window.location.href = `/alumni/donationforms/${driveId.driveid}`;
  }

  return (
    <div className="md:w-[45%] md:mt-0 my-10 max-w-sm border h-100 border-gray-300 rounded-2xl p-4 font-sans px-10 ">
      {/* Top Row: Percentage Funded and Status Pill */}
      
      <div className="flex items-center justify-center w-30 h-10 mt-2  font-satoshi-black bg-green-100 text-green-600 text-md rounded-full px-5 ml-auto">
          Open
      </div>

      {/* TO be Modified */}
      {driveDetails.fund_percentage != null ? (<>
        <div className="flex justify-between items-center mb-2 pt-5">
        <h2 className="text-2xl font-satoshi-black text-primary">
          {driveDetails.fund_percentage}% Funded
        </h2>
        
      </div>

      {/* Raised Amount */}
      <p className="font-medium text-primary font-satoshi-light">
        ₱{driveDetails.total_amount_donated.toLocaleString()} raised of <label className="text-gray-500">₱{driveDetails.target_cost.toLocaleString()}</label>
      </p>

      {/* Progress Bar */}
      <div className="relative my-2 h-2 bg-gray-200 rounded font-satoshi-light">
        <div
          className="bg-blue-900 h-full rounded-full transition-all duration-300 "
          style={{ width: `${driveDetails.fund_percentage}%` }}
        ></div>
      </div>

      {/* Donation Count */}
      <p className="text-sm text-primary mb-4 ml-auto w-25">
        {driveDetails.donation_count} Donations
      </p>
      </>): (<>
      <div className="flex flex-col justify-between mb-2 pt-5">
        <h2 className="text-3xl font-satoshi-black text-primary">
        ₱{driveDetails.total_amount_donated.toLocaleString()} <label className="text-black">raised</label>
        </h2>
        <h2 className="text-3xl font-satoshi-black text-primary">
        {driveDetails.in_kind_count.toLocaleString()} in-kind<label className="text-black"> goods</label>
        </h2>
        
      </div>

      </>)}
      

      {/* Info Section */}
      <div className="flex items-start gap-2 mb-10 mt-7">
        <div
          className="w-6 h-6 bg-gray-200 rounded-full flex justify-center items-center font-bold cursor-pointer"
          title="You can support this drive by donating money to help fund our initiatives or by offering in-kind donations (goods or services)."
        >
          i
        </div>
        <p className="text-sm text-gray-600">
          You can support this drive by donating money or by offering in-kind
          donations (goods or services).
        </p>
      </div>

      {/* Donation Button */}
      <button onClick={handledonationform} className="w-full bg-blue-900 text-white text-base py-3 rounded-lg cursor-pointer">
        Make a donation
      </button>
    </div>
  );
}
