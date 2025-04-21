import React from "react";
import { XCircle } from "lucide-react";

const DonationDetailsModal = ({ isOpen, onClose, donation }) => {
  if (!isOpen || !donation) return null;

  const formattedDate = new Date(donation.date_donated).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const isInKind = donation.type === "In-Kind";
  const statusText = donation.is_acknowledged ? "Acknowledged" : "Pending Acknowledgement";

  const displayAmount = isInKind
    ? donation.amount
    : new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
        minimumFractionDigits: 2,
      }).format(parseFloat(donation.amount));

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 px-4 sm:px-0">
      {/* Overlay */}
      <div className="absolute inset-0 bg-gray-500 opacity-40 pointer-events-none"></div>

      {/* Modal Container */}
      <div className="bg-white p-6 relative z-10 w-full max-w-[600px] rounded-2xl shadow-lg sm:w-11/12 max-h-screen">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="text-lg font-satoshi-bold sm:text-2xl">Donation Details</h2>
          <XCircle
            size={24}
            className="cursor-pointer text-white bg-error rounded-full hover:bg-red-800"
            onClick={onClose}
          />
        </div>

        {/* Donation Info */}
        <div className="mt-6 space-y-3 text-sm sm:text-base">
          {[
            { label: "Donation Drive", value: donation.donation_drive_title },
            { label: "Date", value: formattedDate },
            { label: "Type", value: donation.type },
            { label: "Status", value: <span className="text-primary font-semibold">{statusText}</span> },
            {
              label: isInKind ? "Details" : "Amount",
              value: displayAmount,
            },
          ].map(({ label, value }, index) => (
            <div key={index} className="flex gap-4">
              <div className="w-[40%] text-black font-satoshi-medium">{label}</div>
              <div className="w-[60%] text-black font-satoshi-black">{value}</div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={onClose}
            className="bg-primary text-white px-6 py-2 rounded-full font-medium hover:bg-hover transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default DonationDetailsModal;
