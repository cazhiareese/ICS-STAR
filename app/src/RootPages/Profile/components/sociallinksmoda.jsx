import React from "react";
import { X } from "lucide-react";

function SocialLinksEditModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold text-primary mb-4">Edit Social Links</h2>

        {/* Placeholder content - update with your actual form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Facebook</label>
            <input
              type="url"
              className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
              placeholder="https://facebook.com/your-profile"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">GitHub</label>
            <input
              type="url"
              className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
              placeholder="https://github.com/your-username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">LinkedIn</label>
            <input
              type="url"
              className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
              placeholder="https://linkedin.com/in/your-profile"
            />
          </div>
        </div>

        <div className="flex justify-end mt-6 gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border text-sm text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button className="px-4 py-2 rounded-lg bg-primary text-white text-sm hover:bg-primary-dark">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default SocialLinksEditModal;
