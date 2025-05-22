import React from "react";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

function DonationCards({ drive, loading }) {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const User = localStorage.getItem("token");
  let tokentype = "guest";
  let userid = true;
  
  
  if (User) {
    try {
      const decoded = jwtDecode(User);
      tokentype = decoded.role;
      userid = decoded.sub;
      console.log("Decoded token:", decoded);
      console.log("User ID:", userid);
      console.log("Token type:", tokentype);
    } catch (error) {
      console.error("Invalid token:", error);
    }
  } else {
    console.log("No token found, defaulting to guest.");
  }
  console.log(token);
  const progress = Math.min(
    (drive.total_amount_donated / drive.target_cost) * 100,
    100
  );

  const handleClick = () => {
    console.log(`Card clicked! ${drive.drive_id}`);
    //window.location.href = `/alumni/donations/${drive.drive_id}`; 
    navigate(`/${tokentype}/donations/${drive.drive_id}`);
    //window.location.href = `/alumni/donationforms/${drive.drive_id}`; mar to janry
  }
  return (
    <div
  onClick={handleClick}
  className="w-full max-w-[400px] sm:w-[45%] md:w-full mx-[2px] rounded-[20px] border-disabled overflow-hidden shadow border bg-white h-80"
>
      <div className="h-28 bg-primary flex items-center justify-center">
        {drive.image_url ? (
          <img
            src={drive.image_url}
            alt="&nbsp;"
            className="h-full w-full object-cover"
          />
        ) : null}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-satoshi-black text-gray-800 h-15">
          {drive.title}
        </h3>
        <p className="text-sm text-black font-satoshi-medium line-clamp-2 h-10">
          {drive.description}
        </p>

        {/* Progress bar */}
        <div className="mt-3">
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
        <div className="mt-3 flex justify-between text-sm text-black font-satoshi-medium mb-auto">
          <p>{new Date(drive.created_at).toLocaleDateString()}</p>

          <p className="text-primary font-satoshi-medium">
            {drive.donation_count} Donations
          </p>
        </div>
      </div>
    </div>
  );
}

export default DonationCards;
