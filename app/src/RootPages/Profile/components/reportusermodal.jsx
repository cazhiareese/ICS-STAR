import React, { useEffect, useState } from "react";
import { X, Flag } from "lucide-react";

const ReportUserModal = ({ isOpen, onClose, userId }) => {
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (confirmed) {
      console.log("Reporting user with ID:", userId);
      // TODO: Replace this with actual report handling logic
      // e.g. await reportUser(userId)

      onClose(); // Close modal after confirmation
      setConfirmed(false); // Reset state
    }
  }, [confirmed, userId, onClose]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    setConfirmed(true);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
      <div className="flex flex-col border items-center bg-white p-6 rounded-3xl shadow-lg max-w-md w-full">
        {/* Modal Header */}
        <div className="flex justify-between w-full items-center pb-2">
          <h2 className="text-2xl font-satoshi-bold">Report User</h2>
          <button
            className="rounded-full h-fit p-1 cursor-pointer hover:bg-gray-100"
            onClick={onClose}
          >
            <X className="w-7 h-7 text-error" />
          </button>
        </div>

        {/* Modal Body */}
        <p className="text-gray-600 mt-4 text-center font-satoshi-medium">
          You are about to report this user (ID: <strong>{userId}</strong>). Please confirm to proceed.
        </p>

        {/* Modal Actions */}
        <div className="flex justify-center gap-4 w-full mt-6">
          <button
            className="bg-gray-300 text-black px-4 py-2 rounded-3xl font-satoshi-medium hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-error text-white px-4 py-2 rounded-3xl font-satoshi-medium flex items-center gap-2 hover:bg-red-600"
            onClick={handleConfirm}
          >
            <Flag size={16} />
            Confirm Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportUserModal;
