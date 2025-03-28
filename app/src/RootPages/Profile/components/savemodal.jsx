import React, { useState } from "react";
import { Check, XCircle } from "lucide-react";

function SaveConfirmationModal({ isOpen, onConfirm, onCancel, emailChanged }) {
  const [step, setStep] = useState(1); // Step 1: General Save Confirmation, Step 2: Email Change Confirmation

  if (!isOpen) return null;

  const handleProceed = () => {
    setStep(1);
    onConfirm(); // Finalize the save
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 px-4 sm:px-0">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-gray-500 opacity-40"></div>

      {/* Modal Container */}
      <div className="bg-white w-[450px] h-[250px] p-6 relative rounded-2xl border border-gray-300 shadow-lg flex flex-col justify-center items-center">
        {/* Step 1: Save Confirmation */}
        {step === 1 && (
          <>
            <p className="text-2xl font-medium text-gray-900 text-center">
              Are you sure you want to save <br /> your changes?
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={onCancel}
                className="px-5 py-2 bg-red-600 text-white rounded-full text-sm font-medium hover:bg-red-700 flex items-center gap-2 transition"
              >
                <XCircle size={18} /> Cancel
              </button>
              <button
                onClick={() => {
                  if (emailChanged) {
                    setStep(2); // Go to Email Confirmation Step
                  } else {
                    onConfirm();
                  }
                }}
                className="px-5 py-2 bg-green-600 text-white rounded-full text-sm font-medium hover:bg-green-700 flex items-center gap-2 transition"
              >
                <Check size={18} /> Save
              </button>
            </div>
          </>
        )}

        {/* Step 2: Email Change Confirmation */}
        {step === 2 && (
          <>
            <p className="text-2xl font-medium text-gray-900 text-center">
              Your email has been changed. <br /> Would you like to proceed?
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={() => setStep(1)} // Go back to the first step
                className="px-5 py-2 bg-red-600 text-white rounded-full text-sm font-medium hover:bg-red-700 flex items-center gap-2 transition"
              >
                <XCircle size={18} /> Cancel
              </button>
              <button
                onClick={handleProceed} // Finalize Save
                className="px-5 py-2 bg-green-600 text-white rounded-full text-sm font-medium hover:bg-green-700 flex items-center gap-2 transition"
              >
                <Check size={18} /> Proceed
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SaveConfirmationModal;
