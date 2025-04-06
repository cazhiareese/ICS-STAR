// ImageUploadModal.js
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
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-[300px] sm:w-[400px]">
        <h2 className="text-xl font-semibold text-center mb-4">Upload Profile Picture</h2>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="block w-full mb-4"
        />
        {image && <img src={image} alt="Preview" className="mb-4 w-full rounded-md" />}
        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-black rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-primary text-white rounded-md"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
}

export default ImageUploadModal;
