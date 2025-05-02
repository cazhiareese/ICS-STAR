import React, { useState } from "react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
const token = localStorage.getItem("token");

export default function ChangeModal({ type, onClose, setEmail, email }) {
  const [newEmail, setNewEmail] = useState(email || "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false); // Track success state
  const [showPassword, setShowPassword] = useState(false);
  console.log(email);

  const handleSave = async () => {
    setError("");
    setSuccess(false);
    setLoading(true);
  
    if (type === "email") {
      if (!newEmail.trim()) {
        setError("Email is required");
        setLoading(false);
        return;
      }
      if (newEmail.trim() === email.trim()) {
        setError("The new email is the same as the current email");
        setLoading(false);
        return;
      }
  
      try {
        const availabilityRes = await axios.post(
          `${API_BASE_URL}/get-email`,
          { email: newEmail.trim() }, 
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
      
        console.log("Availability response:", availabilityRes.data);
      
        if (!availabilityRes.data) {
          setError("This email is already taken.");
          setLoading(false);
          return;
        }
      } catch (checkErr) {
        console.error("Email check failed:", checkErr);
        setError("Email already registered");
        setLoading(false);
        return;
      }
      
      
    } else if (type === "password") {
      if (!oldPassword.trim() || !newPassword.trim()) {
        setError("Both old and new passwords are required");
        setLoading(false);
        return;
      }
    }
  
    try {
      if (type === "password") {
        const formData = new FormData();
        formData.append("old_password", oldPassword);
        formData.append("new_password", newPassword);
  
        await axios.put(`${API_BASE_URL}/profile/change-password`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        });
  
        setSuccess(true);
        setOldPassword("");
        setNewPassword("");
      } else {
        const formData = new FormData();
        formData.append("email", newEmail.trim());
  
        await axios.put(`${API_BASE_URL}/update-email`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        });
  
        setSuccess(true);
        setEmail(newEmail.trim());
      }
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
        {/* Success State */}
        {success ? (
          <div className="text-center">
            <h2 className="text-xl font-semibold text-green-600 mb-4">
              {type === "email" ? "Email Updated Successfully" : "Password Updated Successfully"}
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Your {type === "email" ? "email" : "password"} has been updated successfully.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              Continue
            </button>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-semibold mb-5">
              {type === "email" ? "Edit Email Address" : "Change Password"}
            </h2>

            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

            {type === "email" ? (
              <div className="mb-4">
                <label
                  htmlFor="new-email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  New Email Address
                </label>
                <input
                  id="new-email"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Enter new email"
                  className="w-full border border-gray-300 rounded-2xl pl-4 pr-10 py-2 focus:outline-none focus:ring-0.5 focus:ring-primary focus:border-primary"
                />
              </div>
            ) : (
              <>
                <div className="mb-4 relative">
                  <label
                    htmlFor="old-password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Old Password
                  </label>
                  <input
                    id="old-password"
                    type={showPassword ? "text" : "password"}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Enter old password"
                    className="w-full border border-gray-300 rounded-2xl pl-4 pr-10 py-2 focus:outline-none focus:ring-0.5 focus:ring-primary focus:border-primary"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-9 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="new-password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    New Password
                  </label>
                  <input
                    id="new-password"
                    type="password"
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full border border-gray-300 rounded-2xl pl-4 pr-10 py-2 focus:outline-none focus:ring-0.5 focus:ring-primary focus:border-primary"
                  />
                </div>
              </>
            )}

            <div className="flex justify-center mt-14 gap-4">
              <button
                className="bg-white text-primary px-4 py-2 rounded-3xl w-25 outline outline-1 outline-primary cursor-pointer"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="bg-success text-white px-4 py-2 rounded-3xl w-25 cursor-pointer"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
