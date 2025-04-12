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
  const displayAmount = isInKind
    ? donation.details
    : new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
        minimumFractionDigits: 2,
      }).format(parseFloat(donation.details));

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 px-4 sm:px-0">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-gray-500 opacity-40 pointer-events-none"></div>

      {/* Modal Container */}
      <div className="bg-white border border-disabled p-6 relative z-10 flex flex-col w-full max-w-[650px] rounded-2xl shadow-lg sm:w-11/12 max-h-screen">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="text-lg font-satoshi-bold sm:text-[24px]">Donation Details</h2>
          <XCircle
            size={24}
            className="cursor-pointer text-white bg-error rounded-full hover:bg-red-800"
            onClick={onClose}
          />
        </div>

        {/* Donation Info */}
        <div className="flex flex-col gap-4 mt-4 text-[15px] sm:text-[14px]">
          <div>
            <span className="font-satoshi-medium text-black">Date Donated:</span>
            <p className="text-gray-700">{formattedDate}</p>
          </div>

          <div>
            <span className="font-satoshi-medium text-black">Donation Drive:</span>
            <p className="text-gray-700">{donation.donation_drive_title}</p>
          </div>

          <div>
            <span className="font-satoshi-medium text-black">
              {isInKind ? "In-Kind Details:" : "Amount:"}
            </span>
            <p className="text-gray-700">{displayAmount}</p>
          </div>

          {donation.notes && (
            <div>
              <span className="font-satoshi-medium text-black">Notes:</span>
              <p className="text-gray-700">{donation.notes}</p>
            </div>
          )}
        </div>

        {/* Close Button */}
        <div className="mt-6 flex justify-end">
          <button
            className="px-5 py-3 bg-primary text-white rounded-full text-sm font-satoshi hover:bg-hover transition"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DonationDetailsModal;
