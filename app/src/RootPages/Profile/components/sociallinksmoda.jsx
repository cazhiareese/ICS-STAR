import React, { useState, useEffect } from "react";
import { XCircle } from "lucide-react";

function SocialLinksEditModal({ isOpen, onClose, onSaveLinks, userDetails }) {
  const [facebook, setFacebook] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");

  useEffect(() => {
    if (isOpen) {
      // Populate the fields with the current user details when modal opens
      setFacebook(userDetails?.facebook || "");
      setLinkedin(userDetails?.linkedin || "");
      setGithub(userDetails?.github || "");
    } else {
      // Reset the fields when modal is closed
      setFacebook("");
      setLinkedin("");
      setGithub("");
    }
  }, [isOpen, userDetails]); // Re-run when userDetails or isOpen changes

  const handleSave = async () => {
    await onSaveLinks({ facebook, linkedin, github });
    onClose(); // Close modal after saving
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 px-4 sm:px-0">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-gray-500 opacity-40 pointer-events-none"></div>

      {/* Modal Container */}
      <div className="bg-white border border-disabled p-6 relative z-10 flex flex-col w-full max-w-[650px] rounded-2xl shadow-lg sm:w-11/12 max-h-screen">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="text-lg font-satoshi-bold sm:text-[24px]">Edit Social Links</h2>
          <XCircle
            size={24}
            className="cursor-pointer text-white bg-error rounded-full hover:bg-red-800"
            onClick={onClose}
          />
        </div>

        {/* Input Fields */}
        <div className="flex flex-col gap-4 mt-4">
          <div className="flex flex-col">
            <label className="text-black font-satoshi-medium">Facebook</label>
            <input
              type="text"
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
              className="w-full border-2 px-4 py-3 rounded-2xl text-lg font-satoshi-medium sm:text-sm border-gray-400"
              placeholder="Enter Facebook URL..."
            />
          </div>

          <div className="flex flex-col">
            <label className="text-black font-satoshi-medium">LinkedIn</label>
            <input
              type="text"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              className="w-full border-2 px-4 py-3 rounded-2xl text-lg font-satoshi-medium sm:text-sm border-gray-400"
              placeholder="Enter LinkedIn URL..."
            />
          </div>

          <div className="flex flex-col">
            <label className="text-black font-satoshi-medium">GitHub</label>
            <input
              type="text"
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              className="w-full border-2 px-4 py-3 rounded-2xl text-lg font-satoshi-medium sm:text-sm border-gray-400"
              placeholder="Enter GitHub URL..."
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <button
            className="px-5 py-3 bg-primary text-white rounded-full text-sm font-satoshi hover:bg-hover transition"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default SocialLinksEditModal;
