import React from "react";
import { X, CheckCircle } from "lucide-react";

const SaveWorkModal = ({ isOpen, isSuccess, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
      <div className="flex flex-col border items-center bg-white p-6 rounded-3xl shadow-lg max-w-md w-full">
        {/* Header */}
        <div className="flex justify-between w-full items-center pb-2">
          <h2 className="text-2xl font-satoshi-bold">
            {isSuccess ? "Saved Successfully" : "Save Changes?"}
          </h2>
          <button
            className="rounded-full h-fit p-1 cursor-pointer hover:bg-gray-100"
            onClick={onClose}
          >
            <X className="w-7 h-7 text-error" />
          </button>
        </div>

        {/* Body */}
        {isSuccess ? (
          <div className="text-center mt-4">
            <CheckCircle className="text-green-500 w-12 h-12 mx-auto mb-2" />
            <p className="text-gray-700 font-satoshi-medium">
              Your work information has been successfully updated.
            </p>
          </div>
        ) : (
          <>
            <p className="text-gray-600 mt-2 text-center font-satoshi-medium">
              Are you sure you want to save your changes to employment details?
            </p>

            {/* Actions */}
            <div className="flex justify-center gap-4 w-full mt-6">
              <button
                className="bg-gray-300 text-black px-4 py-2 rounded-3xl font-satoshi-medium hover:bg-gray-400"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="bg-primary text-white px-4 py-2 rounded-3xl font-satoshi-medium hover:bg-blue-700"
                onClick={() => onClose("confirm")}
              >
                Yes, Save
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SaveWorkModal;
