import React from "react";

function DonationCard({ drive }) {
  console.log(drive);

const token = localStorage.getItem("token");
console.log(token);
  const progress = Math.min(
    (drive.total_amount_donated / drive.target_cost) * 100,
    100
  );

  const handleClick = () => {
    console.log(`Card clicked! ${drive.drive_id}`);
  }
  return (
    <div onClick={handleClick} className="w-full md:w-[38%] rounded-xl border-disabled overflow-hidden shadow border bg-white">
      <div className="h-28 bg-primary flex items-center justify-center">
        {drive.image_url ? (
          <img
            src={drive.image_url}
            alt={drive.drive_id}
            className="h-full w-full object-cover"
          />
        ) : null}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-satoshi-black text-gray-800">
          {drive.title}
        </h3>
        <p className="text-sm text-black font-satoshi-medium line-clamp-2">
          {drive.description}
        </p>

        {/* Progress bar */}
        <div className="mt-4">
          <p className="text-sm text-black font-satoshi-medium">
            ₱{drive.total_amount_donated.toLocaleString()} of ₱
            {drive.target_cost.toLocaleString()} funded
          </p>
          <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
            <div
              className="h-full bg-primary rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-4 flex justify-between text-sm text-black font-satoshi-medium">
          <p>{new Date(drive.created_at).toLocaleDateString()}</p>
          <p className="text-primary font-satoshi-medium">
            {drive.donation_count} Donations
          </p>
        </div>
      </div>
    </div>
  );
}

export default DonationCard;
