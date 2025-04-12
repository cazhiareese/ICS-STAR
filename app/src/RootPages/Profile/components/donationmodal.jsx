import React from "react";
import { X } from "lucide-react";

const DonationDetailsModal = ({ isOpen, onClose, donation }) => {
  if (!isOpen || !donation) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md relative shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <X />
        </button>

        <h2 className="text-xl font-semibold mb-4 text-primary">Donation Details</h2>

        <div className="space-y-2 text-[15px]">
          <p><strong>Date:</strong> {new Date(donation.date_donated).toLocaleDateString()}</p>
          <p><strong>Drive:</strong> {donation.donation_drive_title}</p>
          <p><strong>Amount:</strong> ₱{parseFloat(donation.details).toFixed(2)}</p>
          {donation.notes && <p><strong>Notes:</strong> {donation.notes}</p>}
          {/* Add more fields if needed */}
        </div>
      </div>
    </div>
  );
};

export default DonationDetailsModal;
