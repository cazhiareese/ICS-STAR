import React, { useEffect, useState } from "react";
import { X, Trash2, Flag } from "lucide-react";
import { useNavigate } from "react-router-dom";

function JobModal({ jobId, setShowModal, onCancel, options, formData }) {
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (confirmed) {
      if (options?.type === "delete") {
        const deleteJob = async () => {
          setLoading(true);
          try {
            const response = await fetch(
              `${import.meta.env.VITE_BACKEND_URL}/delete-job-postings/${jobId}`,
              {
                method: "DELETE",
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );

            if (!response.ok) {
              throw new Error("Failed to delete job posting");
            }

            console.log("Deleting Job ID via useEffect:", jobId);
            setSuccess(true);
            setTimeout(() => {
              navigate("/alumni/jobPosting");
              setShowModal(false);
            }, 2000); // Redirect after 2 seconds
          } catch (err) {
            console.error("Delete Job Error:", err);
          } finally {
            setLoading(false);
          }
        };

        deleteJob();
      } else if (options?.type === "report") {
        const reportJob = async () => {
          setLoading(true);
          const formDataToSend = new FormData();
          formDataToSend.append("post_id", jobId);
          formDataToSend.append("reason", formData.details);
          if (formData.files.length > 0) {
            formData.files.forEach((file) => {
              formDataToSend.append("attachment", file);
            });
          }

          try {
            const response = await fetch(
              `${import.meta.env.VITE_BACKEND_URL}/reports/report-job-post`,
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: formDataToSend,
              }
            );

            if (!response.ok) {
              throw new Error("Failed to submit report");
            }

            console.log("Reporting Job ID via useEffect:", jobId);
            setSuccess(true);
            setTimeout(() => {
              navigate("/alumni/jobPosting");
              setShowModal(false);
            }, 2000); // Redirect after 2 seconds
          } catch (err) {
            console.error("Report Submission Error:", err);
          } finally {
            setLoading(false);
          }
        };

        reportJob();
      }
    }
  }, [confirmed, jobId, options?.type, setShowModal, formData, navigate]);

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
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="w-8 h-8 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
          </div>
        ) : success ? (
          <p className="text-green-600 mt-4 text-center font-satoshi-medium">
            {options?.type === "delete"
              ? "Job post deleted successfully! Redirecting..."
              : "Report submitted successfully! Redirecting..."}
          </p>
        ) : (
          <>
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
                    ? "bg-error text-white font-satoshi-medium hover:bg-red-600"
                    : "bg-error text-white font-satoshi-medium hover:bg-red-600"
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
          </>
        )}
      </div>
    </div>
  );
}

export default JobModal;