// src/components/DonationCard.jsx
import React from "react";

function DonationCard({ drive }) {
  return (
    <div className="w-full md:w-[48%] p-4 border rounded-xl shadow bg-white">
      <h3 className="text-lg font-bold text-gray-800">{drive.title}</h3>
      <p className="text-gray-600">{drive.description}</p>
      <p className="text-sm text-gray-500 mt-2">
        🎯 Target: ₱{drive.target_cost}
      </p>
      <p className="text-sm text-gray-500">💸 Donated: ₱{drive.total_amount_donated}</p>
      <p className="text-sm text-gray-500">🙌 Donations: {drive.donation_count}</p>
      <p className="text-xs text-gray-400 mt-1">
        📅 {new Date(drive.created_at).toLocaleDateString()}
      </p>
    </div>
  );
}

export default DonationCard;
