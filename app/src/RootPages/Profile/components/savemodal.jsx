import React from "react";
import { Check, XCircle } from "lucide-react";

function SaveConfirmationModal({ isOpen, onConfirm, onCancel, text }) {
  if (!isOpen) return null;

  const message =
    text === "cancel"
      ? "Are you sure you want to cancel editing?"
      : "Are you sure you want to save your changes?";

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 px-4 sm:px-0">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-gray-500 opacity-40"></div>

      {/* Modal Container */}
      <div className="bg-white w-[450px] h-[250px] p-6 relative rounded-2xl border border-gray-300 shadow-lg flex flex-col justify-center items-center">
        {/* Confirmation Message */}
        <p className="text-2xl font-medium text-gray-900 text-center">
          {message}
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
  onClick={text === "cancel" ? onCancel : onConfirm}
  className={`px-5 py-2 ${
    text === "cancel" ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
  } text-white rounded-full text-sm font-medium flex items-center gap-2 transition`}
>
  {text === "cancel" ? "Yes, Cancel" : "Save"}
</button>

        </div>
      </div>
    </div>
  );
}

export default SaveConfirmationModal;
