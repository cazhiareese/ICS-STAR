import React from "react";
import { X } from "lucide-react";

const ReportUserModal = ({ isOpen, onClose, userId }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <X size={20} />
        </button>
        <h2 className="text-xl font-bold mb-4">Report User</h2>
        <p className="mb-4">You are about to report this user (ID: {userId}). Please confirm or cancel this action.</p>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
          <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Confirm</button>
        </div>
      </div>
    </div>
  );
};

export default ReportUserModal;
