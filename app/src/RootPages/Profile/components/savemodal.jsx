import React from "react";
import { Check, XCircle } from "lucide-react";

function SaveConfirmationModal({ isOpen, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center w-[350px]">
        <p className="text-lg font-semibold mb-4">Are you sure you want to save your changes?</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 flex items-center gap-2"
          >
            <XCircle size={18} /> Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center gap-2"
          >
            <Check size={18} /> Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default SaveConfirmationModal;
