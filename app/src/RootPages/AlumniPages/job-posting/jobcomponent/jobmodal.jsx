import React, { useEffect, useState } from "react";
import { X, Trash2, Flag } from "lucide-react";

function JobModal({ jobId, setShowModal, onCancel, options, formData }) {
  const [confirmed, setConfirmed] = useState(false);
  console.log(formData) //eto form data sa report


  //eljohn you know what to do
  useEffect(() => {
    if (confirmed) {
      if (options?.type === "delete") {
        console.log("Deleting Job ID via useEffect:", jobId);
        // TODO: Replace this with actual delete handler
        // e.g. await deleteJob(jobId)
      } else if (options?.type === "report") {
        console.log("Reporting Job ID via useEffect:", jobId);
        // TODO: Replace this with actual report handler
        // e.g. await reportJob(jobId)
      }
      setShowModal(false);
      setConfirmed(false); // reset state
    }
  }, [confirmed, jobId, options?.type, setShowModal]);

  const handleConfirm = () => {
    setConfirmed(true); // triggers the useEffect
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
      <div className="flex flex-col border items-center bg-white p-6 rounded-3xl shadow-lg max-w-md w-full">
        {/* Modal Header */}
        <div className="flex justify-between w-full items-center pb-2">
          <h2 className="text-2xl font-satoshi-bold">
            {options?.type === "delete" ? "Delete Job Post" : "Report Job Post"}
          </h2>
          <button
            className="rounded-full h-fit p-1 cursor-pointer hover:bg-gray-100"
            onClick={onCancel}
          >
            <X className="w-7 h-7 text-error" />
          </button>
        </div>

        {/* Modal Body */}
        <p className="text-gray-600 mt-4 text-center font-satoshi-medium ">
          {options?.type === "delete"
            ? "Are you sure you want to delete this job post? This action cannot be undone."
            : "Are you sure you want to report this job post for review?"}
        </p>

        {/* Modal Actions */}
        <div className="flex justify-center gap-4 w-full mt-6">
          <button
            className="bg-gray-300 text-black px-4 py-2 rounded-3xl font-satoshi-medium hover:bg-gray-400"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className={`px-4 py-2 rounded-3xl flex items-center gap-2 ${
              options?.type === "delete"
                ? "bg-error text-white font-satoshi-medium  hover:bg-red-600"
                : "bg-error text-white font-satoshi-medium  hover:bg-red-600"
            }`}
            onClick={handleConfirm}
          >
            {options?.type === "delete" ? (
              <>
                <Trash2 size={16} />
                Delete
              </>
            ) : (
              <>
                <Flag size={16} />
                Confirm Report
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default JobModal;
