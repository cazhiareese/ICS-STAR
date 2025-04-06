import React, { useState } from "react";

function ImageUploadModal({ isOpen, onClose, onUpload }) {
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file)); // Preview the selected image
    }
  };

  const handleSubmit = () => {
    if (image) {
      onUpload(image); // Call the parent function to handle the image upload
      onClose(); // Close the modal after upload
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 px-4 sm:px-0">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Modal Container */}
      <div className="bg-white w-[450px] p-6 relative rounded-2xl border border-gray-300 shadow-lg flex flex-col items-center">
        {/* Modal Title */}
        <p className="text-2xl font-semibold text-gray-900 text-center mb-4">
          Upload Profile Picture
        </p>

        {/* Image Upload Input */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="block w-full mb-4 text-sm cursor-pointer"
        />
        
        {/* Image Preview */}
        {image && <img src={image} alt="Preview" className="mb-4 w-full rounded-md" />}

        {/* Action Buttons */}
        <div className="mt-6 flex justify-between gap-4">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-600 text-white rounded-full text-sm font-medium hover:bg-gray-700 flex items-center gap-2 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 bg-green-600 text-white rounded-full text-sm font-medium hover:bg-green-700 flex items-center gap-2 transition"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
}

export default ImageUploadModal;
