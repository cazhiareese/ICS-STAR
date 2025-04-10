import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

export default function DonationCard({driveId}) {
  console.log("malupey");
  console.log(driveId.driveid);
  const navigate = useNavigate();
  // Sample data — you can replace these values or pass them as props.
  
  // const percentageFunded = Math.round((currentRaised / goalAmount) * 100);

  const [goalAmount, setGoalAmount] = useState(0)
  const [currentRaised, setCurrentRaised] = useState(0)
  const [numberOfDonations, setNumberOfDonations] = useState(0)
  const [percentageFunded, setPercentageFunded] = useState(driveId.percentageFunded)
  const [driveDetails, setDriveDetails] = useState(null);

  const handledonationform = () => {
    navigate(`/alumni/donationforms/${driveId.driveid}`);
    //window.location.href = `/alumni/donationforms/${driveId.driveid}`;
  }

  useEffect(() => {
          const token = localStorage.getItem("token"); // if required
      
          fetch(`https://ics-star-api.vercel.app/one-donation-drive/${driveId.driveid}`, {
            headers: {
              Authorization: `Bearer ${token}`, // only if the API requires auth
            },
          })
            .then((res) => res.json())
            .then((data) => {
              setDriveDetails(data);
              // setPercentageFunded(driveDetails.fund_percentage)
              // setNumberOfDonations(driveDetails.donation_count)
              // setCurrentRaised(driveDetails.total_amount_donated)
              // setGoalAmount(driveDetails.target_cost)
              console.log("Drive details:", data);
            })
            .catch((err) => {
              console.error("Error fetching drive details:", err);
            });
        }, [driveId]);
      
  if (!driveDetails) return <p>Loading drive...</p>;
  return (
    <div className="max-w-sm border h-100 border-gray-300 rounded-2xl p-4 font-sans px-10 ">
      {/* Top Row: Percentage Funded and Status Pill */}
      
      <div className="flex items-center justify-center w-30 h-10 mt-2  font-satoshi-black bg-green-100 text-green-600 text-md rounded-full px-5 ml-auto">
          Open
      </div>
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
      <div className="relative my-2 h-2 text-primary rounded font-satoshi-light">
        <div
          className="bg-blue-900 h-full rounded transition-all duration-300"
          style={{ width: `${driveDetails.fund_percentage}%` }}
        ></div>
      </div>

      {/* Donation Count */}
      <p className="text-sm text-primary mb-4 ml-auto w-25">
        {driveDetails.donation_count} Donations
      </p>

      {/* Info Section */}
      <div className="flex items-start gap-2 mb-4">
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
