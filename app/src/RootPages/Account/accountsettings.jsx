import React, { useState } from "react";
import ChangeModal from "./component/accountmodal";

export default function AccountSettings() {
  const email = "cyrus gello par@gmail.com";

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null); // 'email' or 'password'
  const [toast, setToast] = useState({ message: "", type: "" }); // For managing toast messages

  // Show toast notification
  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => {
      setToast({ message: "", type: "" }); // Clear toast message after 2 seconds
    }, 2000); // Toast will disappear after 2 seconds
  };

  return (
    <div className="w-full flex justify-center items-center px-4">
      <div className="w-full max-w-[1100px] mt-6 bg-white shadow-md rounded-xl p-6">
        <h1 className="text-2xl font-semibold mb-4">Account Settings</h1>
        <p className="text-gray-600 mb-8">Manage your profile, privacy, and preferences here.</p>

        <div className="flex flex-col gap-8 px-2">
          {/* Email Row */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 gap-4">
            <div className="md:w-1/3">
              <h2 className="text-lg font-semibold">Email Address</h2>
              <p className="text-sm text-gray-500">The email address connected with your account</p>
            </div>
            <div className="md:w-1/3 font-medium text-gray-800">{email}</div>
            <div className="md:w-1/3 text-right">
              <button
                onClick={() => {
                  setModalType("email");
                  setShowModal(true);
                }}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition"
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
            <div className="md:w-1/3 font-medium text-gray-800">••••••••</div>
            <div className="md:w-1/3 text-right">
              <button
                onClick={() => {
                  setModalType("password");
                  setShowModal(true);
                }}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <ChangeModal
          type={modalType}
          onClose={() => setShowModal(false)}
          showToast={showToast} // Pass the showToast function to the modal
        />
      )}

      {/* Toast Notification */}
      {toast.message && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-md text-white shadow-lg ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          } transition-opacity duration-300 ease-in-out`}
          style={{ opacity: toast.message ? 1 : 0 }}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}
