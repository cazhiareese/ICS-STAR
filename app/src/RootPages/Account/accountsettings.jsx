// AccountSettings.jsx

import React from "react";

export default function AccountSettings() {
  const email = "cyrus gello par@gmail.com";

  return (
    <div className="w-full flex justify-center items-center px-4">
      <div className="w-full max-w-[1100px] mt-6 bg-white shadow-md rounded-xl p-6">
        <h1 className="text-2xl font-semibold mb-4">Account Settings</h1>
        <p className="text-gray-600 mb-8">Manage your profile, privacy, and preferences here.</p>

        <div className="flex flex-col gap-8">
          {/* Email Row */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b pb-6 gap-4">
            <div className="md:w-1/3">
              <h2 className="text-lg font-semibold">Email Address</h2>
              <p className="text-sm text-gray-500">The email address connected with your account</p>
            </div>
            <div className="md:w-1/3 font-medium text-gray-800">{email}</div>
            <div className="md:w-1/3 text-right">
              <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition">
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
    </div>
  );
}
