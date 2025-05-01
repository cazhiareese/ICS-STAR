import React, { useState } from "react";

export default function AccountSettings() {
  const email = "cyrus gello par@gmail.com";
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="w-full flex justify-center items-center px-4">
      <div className="w-full max-w-[1100px] mt-6 bg-white shadow-md rounded-xl p-6">
        <h1 className="text-2xl font-semibold mb-4">Account Settings</h1>
        <p className="text-gray-600 mb-8">Manage your profile, privacy, and preferences here.</p>

        <div className="flex flex-col gap-8 px-15">
          {/* Email Row */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 gap-4">
            <div className="md:w-1/3">
              <h2 className="text-lg font-semibold">Email Address</h2>
              <p className="text-sm text-gray-500">The email address connected with your account</p>
            </div>
            <div className="md:w-1/3 font-medium text-gray-800">{email}</div>
            <div className="md:w-1/3 text-right">
              <button
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition"
                onClick={() => setShowModal(true)}
              >
                Change Email
              </button>
            </div>
          </div>

          {/* Password Row */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="md:w-1/3">
              <h2 className="text-lg font-semibold">Password</h2>
              <p className="text-sm text-gray-500">The password connected to your account</p>
            </div>

            <div className="md:w-1/3 text-right">
              <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition">
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
    <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
      <h2 className="text-xl font-semibold mb-4">Change Email</h2>

      <div className="mb-2">
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

      <div className="flex justify-center mt-6 gap-4">
        <button
          className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
          onClick={() => setShowModal(false)}
        >
          Cancel
        </button>
        <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
          Save
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
