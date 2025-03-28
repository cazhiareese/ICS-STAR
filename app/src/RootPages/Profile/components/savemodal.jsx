import React from "react";
import { Check, XCircle } from "lucide-react";

function SaveConfirmationModal({ isOpen, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 px-4 sm:px-0">
              <div className="absolute inset-0 bg-gray-500 opacity-40 pointer-events-none"></div>
      {/* Modal Container */}
      <div
        className="bg-white p-6 rounded-2xl relative shadow-lg text-center w-[350px] sm:w-[400px] md:w-[450px] border"
      >
        {/* Confirmation Text */}
        <p className="text-lg font-medium text-gray-900">Are you sure you want to save your changes?</p>

        {/* Action Buttons */}
        <div className="mt-4 flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="px-5 py-2 bg-red-600 text-white rounded-full text-sm font-medium hover:bg-red-700 flex items-center gap-2 transition"
          >
            <XCircle size={18} /> Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 bg-green-600 text-white rounded-full text-sm font-medium hover:bg-green-700 flex items-center gap-2 transition"
          >
            <Check size={18} /> Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default SaveConfirmationModal;
