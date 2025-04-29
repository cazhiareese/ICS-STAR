import React from "react";
import { Check, XCircle } from "lucide-react";

function SaveConfirmationModal({ isOpen, onConfirm, onCancel, text }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 px-4 sm:px-0">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-gray-500 opacity-40"></div>

      {/* Modal Container */}
      <div className="bg-white w-[450px] h-[250px] p-6 relative rounded-2xl border border-gray-300 shadow-lg flex flex-col justify-center items-center">
        {/* Save Confirmation */}
        <p className="text-2xl font-medium text-gray-900 text-center">
          Are you sure you want to save <br /> your changes?
        </p>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="px-5 py-2 bg-red-600 text-white rounded-full text-sm font-medium hover:bg-red-700 flex items-center gap-2 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 bg-green-600 text-white rounded-full text-sm font-medium hover:bg-green-700 flex items-center gap-2 transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default SaveConfirmationModal;
