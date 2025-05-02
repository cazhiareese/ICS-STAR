import React from "react";
import { X, Trash2 } from "lucide-react";

function JobModal({ jobId, setShowModal, onCancel, options }) {
    console.log("Job ID:", jobId);
  const handleConfirm = () => {
    if (options?.type === "delete") {
      console.log("Deleting Job ID:", jobId);
      // TODO: Call your delete function here
    }
    setShowModal(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
      <div className="flex flex-col border items-center bg-white p-6 rounded-3xl shadow-lg max-w-md w-full">
        {/* Modal Header */}
        <div className="flex justify-between w-full items-center pb-2">
          <h2 className="text-2xl font-satoshi-medium">
            {options?.type === "delete" ? "Delete Job Post" : "Confirm Action"}
          </h2>
          <button
            className="rounded-full h-fit p-1 cursor-pointer hover:bg-gray-100"
            onClick={onCancel}
          >
            <X className="w-7 h-7 text-error" />
          </button>
        </div>

        {/* Modal Body */}
        <p className="text-gray-600 mt-4 text-center">
          {options?.type === "delete"
            ? "Are you sure you want to delete this job post? This action cannot be undone."
            : "Are you sure you want to proceed?"}
        </p>

        {/* Modal Actions */}
        <div className="flex justify-end gap-4 w-full mt-6">
          <button
            className="bg-gray-300 text-black px-4 py-2 rounded-3xl hover:bg-gray-400"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="bg-error text-white px-4 py-2 rounded-3xl hover:bg-red-600 flex items-center gap-2"
            onClick={handleConfirm}
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default JobModal;
