import React from 'react';

const NewsletterModal = ({ isOpen, onClose, formData, option }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-gray-500 opacity-40 pointer-events-none"></div>

      {/* Modal */}
      <div className="bg-white p-6 rounded-2xl w-96 max-w-full relative flex flex-col justify-center items-center" style={{ height: '250px' }}>
        
        {(option === "create" || option === "edit") && (
          <>
            {/* Header */}
            <h2 className="font-satoshi-bold text-2xl text-center mb-8">
              {option === "create" ? "Create News Letter" : "Edit News Letter"}
            </h2>

            {/* Buttons */}
            <div className="flex justify-center gap-4">
              <button
                className="bg-white border-[2px] border-primary text-primary px-6 py-2 rounded-3xl"
                onClick={onClose}
              >
                Not Yet
              </button>
              <button
                className="bg-error text-white px-6 py-2 rounded-3xl hover:bg-hover"
                onClick={onClose}
              >
                Confirm
              </button>
            </div>
          </>
        )}

        {option === "delete" && (
          <>
            {/* Delete Header */}
            <h2 className="font-satoshi-bold text-2xl text-center mb-8">
              Are you sure you want to delete the Newsletter?
            </h2>

            {/* Buttons */}
            <div className="flex justify-center gap-4">
              <button
                className="bg-white border-[2px] border-gray-400 text-gray-700 px-6 py-2 rounded-3xl"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="bg-error text-white px-6 py-2 rounded-3xl hover:bg-hover"
                onClick={onClose}
              >
                Confirm
              </button>
            </div>
          </>
        )}
        
      </div>
    </div>
  );
};

export default NewsletterModal;
