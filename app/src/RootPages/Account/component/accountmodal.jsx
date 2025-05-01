// ChangeModal.jsx
import React from "react";

export default function ChangeModal({ type, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {type === "email" ? "Change Email" : "Change Password"}
        </h2>

        {type === "email" ? (
          <>
            <div className="mb-4">
              <label htmlFor="new-email" className="block text-sm font-medium text-gray-700 mb-1">
                New Email Address
              </label>
              <input
                id="new-email"
                type="email"
                placeholder="Enter new email"
                className="w-full border border-gray-300 rounded-lg p-2"
              />
            </div>
          </>
        ) : (
          <>
            <div className="mb-4">
              <label htmlFor="old-password" className="block text-sm font-medium text-gray-700 mb-1">
                Old Password
              </label>
              <input
                id="old-password"
                type="password"
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
          >
            Cancel
          </button>
          <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
