import React, { useState, useEffect } from "react";
import ChangeModal from "./component/accountmodal";
import axios from "axios";
import { Mail, LockIcon } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

export default function AccountSettings() {
  const token = localStorage.getItem("token");

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null); // 'email' or 'password'
  const [email, setEmail] = useState(null);

  // Fetch user info function (used on mount & after update)
  const fetchUserInfo = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/email-name/me`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      setEmail(response.data.data.email);
      console.log("User Info:", response.data.data.email);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUserInfo();
    }
  }, []);

  return (
    <div className="font-satoshi-medium w-full flex justify-center items-center px-4 select-none">
      <div className="w-full max-w-[1100px] mt-6 bg-white shadow-md rounded-xl p-14">
        <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
        <div className="flex flex-col gap-4 px-4">
          {/* Email Row */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 gap-4">
            <div className="md:w-1/2">
              <h2 className="text-lg font-bold">Email Address</h2>
              <p className="text-base text-gray-500">The email address connected with your account</p>
            </div>
            <div className="font-bold text-gray-800">{email}</div>
            <div className="md:w-1/3 text-right">
              <button
                onClick={() => {
                  setModalType("email");
                  setShowModal(true);
                }}
                className="bg-primary text-white px-4 py-2 rounded-2xl hover:bg-[#437BE4] transition cursor-pointer inline-flex items-center gap-2"
              >
                <Mail size={18} />
                Change Email
              </button>
            </div>
          </div>

          {/* Password Row */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="md:w-1/3">
              <h2 className="text-lg font-semibold">Password</h2>
              <p className="text-base text-gray-500">The password connected to your account</p>
            </div>
            <div className="md:w-1/3 text-right">
              <button
                onClick={() => {
                  setModalType("password");
                  setShowModal(true);
                }}
                className="bg-primary text-white px-4 py-2 rounded-2xl hover:bg-[#437BE4] transition cursor-pointer inline-flex items-center gap-2"
              >
                <LockIcon size={18} />
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
          setEmail={setEmail} // 👈 pass callback
          email={email}
        />
      )}
    </div>
  );
}
