import React, { useEffect, useState } from "react";
import { X, Flag, CheckCircle } from "lucide-react";
import {jwtDecode} from "jwt-decode";
import axios from "axios";

const ReportUserModal = ({ isOpen, onClose, userId, name }) => {
  const [confirmed, setConfirmed] = useState(false);
  const [reporterId, setReporterId] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setReporterId(decoded.sub);
      } catch (err) {
        console.error("Failed to decode token:", err);
      }
    }
  }, []);

  useEffect(() => {
    if (confirmed && reporterId && userId && reason.trim() !== "") {
      const reportUser = async () => {
        try {
          setSubmitting(true);
          const response = await axios.patch(
            `${import.meta.env.VITE_BACKEND_URL}/reports/users`,
            {
              reporter_id: reporterId,
              reported_user_id: userId,
              reason: reason.trim(),
            }
          );
          console.log("Report submitted:", response.data);
          setSuccess(true);
        } catch (error) {
          console.error("Error reporting user:", error);
        } finally {
          setSubmitting(false);
          setConfirmed(false);
        }
      };

      reportUser();
    }
  }, [confirmed, reporterId, userId, reason]);

  const handleConfirm = () => {
    if (reason.trim() !== "") {
      setConfirmed(true);
    }
  };

  const handleClose = () => {
    setReason("");
    setSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
      <div className="flex flex-col border items-center bg-white p-6 rounded-3xl shadow-lg max-w-md w-full">
        {/* Modal Header */}
        <div className="flex justify-between w-full items-center pb-2">
          <h2 className="text-2xl font-satoshi-bold">
            {success ? "Report Submitted" : "Report User"}
          </h2>
          <button
            className="rounded-full h-fit p-1 cursor-pointer hover:bg-gray-100"
            onClick={handleClose}
            disabled={submitting}
          >
            <X className="w-7 h-7 text-error" />
          </button>
        </div>

        {/* Modal Body */}
        {success ? (
          <div className="text-center mt-4">
            <CheckCircle className="text-green-500 w-12 h-12 mx-auto mb-2" />
            <p className="text-gray-700 font-satoshi-medium">
              The user has been successfully reported. Thank you for helping keep the community safe.
            </p>
          </div>
        ) : (
          <>
            <p className="text-gray-600 mt-2 text-center font-satoshi-medium">
              Please provide a reason for reporting this user (ID: <strong>{name}</strong>):
            </p>
            <textarea
              className="w-full mt-4 p-3 border rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-error"
              rows={4}
              placeholder="Type your reason here..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={submitting}
            />

            {/* Modal Actions */}
            <div className="flex justify-center gap-4 w-full mt-6">
              <button
                className="bg-gray-300 text-black px-4 py-2 rounded-3xl font-satoshi-medium hover:bg-gray-400"
                onClick={handleClose}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                className={`px-4 py-2 rounded-3xl flex items-center gap-2 font-satoshi-medium ${
                  reason.trim() === "" || submitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-error text-white hover:bg-red-600"
                }`}
                onClick={handleConfirm}
                disabled={reason.trim() === "" || submitting}
              >
                <Flag size={16} />
                {submitting ? "Reporting..." : "Confirm Report"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReportUserModal;
