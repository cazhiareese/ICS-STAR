import React from "react";
import { XCircle } from "lucide-react";

function CancelEditingModal({ isOpen, onConfirm, cancelEditing }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 px-4 sm:px-0">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-gray-500 opacity-40"></div>

      {/* Modal Container */}
      <div className="bg-white w-[450px] h-[250px] p-6 relative rounded-2xl border border-gray-300 shadow-lg flex flex-col justify-center items-center">
        {/* Confirmation Message */}
        <p className="text-2xl font-medium text-gray-900 text-center">
          Are you sure you want to cancel editing?
        </p>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={cancelEditing}
            className="px-5 py-2 bg-red-600 text-white rounded-full text-sm font-medium hover:bg-red-700 flex items-center gap-2 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full text-sm font-medium flex items-center gap-2 transition"
          >
            Yes, Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default CancelEditingModal;
