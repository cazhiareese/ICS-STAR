import React, { useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
const token = localStorage.getItem("token");

export default function ChangeModal({ type, onClose }) {
  const [newEmail, setNewEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSave = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (type === "password") {
        const formData = new FormData();
        formData.append("old_password", oldPassword);
        formData.append("new_password", newPassword);

        const response = await axios.put(`${API_BASE_URL}/profile/change-password`, formData, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        setSuccess("Password updated successfully");
        setOldPassword("");
        setNewPassword("");
      }

      // You can add email update logic here later
    } catch (err) {
      const message = err.response?.data?.detail || "An error occurred";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {type === "email" ? "Change Email" : "Change Password"}
        </h2>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        {success && <p className="text-green-600 text-sm mb-3">{success}</p>}

        {type === "email" ? (
          <div className="mb-4">
            <label htmlFor="new-email" className="block text-sm font-medium text-gray-700 mb-1">
              New Email Address
            </label>
            <input
              id="new-email"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Enter new email"
              className="w-full border border-gray-300 rounded-lg p-2"
            />
          </div>
        ) : (
          <>
            <div className="mb-4">
              <label htmlFor="old-password" className="block text-sm font-medium text-gray-700 mb-1">
                Old Password
              </label>
              <input
                id="old-password"
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Enter old password"
                className="w-full border border-gray-300 rounded-lg p-2"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full border border-gray-300 rounded-lg p-2"
              />
            </div>
          </>
        )}

        <div className="flex justify-center mt-6 gap-4">
          <button
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
