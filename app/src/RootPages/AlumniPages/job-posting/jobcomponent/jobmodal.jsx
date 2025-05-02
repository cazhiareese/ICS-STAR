import React from "react";

const JobModal = ({ jobId, setShowModal, onCancel, options }) => {
  const handleConfirm = () => {
    if (options?.type === "delete") {
      console.log("Confirmed delete for Job ID:", jobId);
      // Add your actual delete logic here if needed
    }
    setShowModal(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full text-center">
        <h2 className="text-lg font-semibold mb-4">
          {options?.type === "delete" ? "Confirm Deletion" : "Confirm Action"}
        </h2>
        <p className="text-gray-600 mb-6">
          {options?.type === "delete"
            ? "Are you sure you want to delete this post?"
            : "Are you sure you want to proceed?"}
        </p>
        <div className="flex justify-center gap-4">
          <button
            className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-black"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
            onClick={handleConfirm}
          >
            {options?.type === "delete" ? "Delete" : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobModal;
