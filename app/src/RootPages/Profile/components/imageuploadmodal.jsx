import React, { useState } from "react";

function ImageUploadModal({ isOpen, onClose, onUpload }) {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!image) {
      setError("No image selected");
      return;
    }

    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", image);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/upload-profile-picture`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload profile picture");
      }

      const result = await response.json();
      onUpload(result.imageUrl);
      onClose();
    } catch (err) {
      setError(err.message || "An error occurred during upload");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 px-4 sm:px-0">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Modal Container */}
      <div className="bg-white w-[450px] p-6 relative rounded-2xl border border-gray-300 shadow-lg flex flex-col items-center">
        <p className="text-2xl font-satoshi-bold text-gray-900 text-center mb-4">
          Upload Profile Picture
        </p>

        {/* Custom File Upload */}
        <label
          htmlFor="profile-image-upload"
          className="w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer flex items-center justify-center mb-4 hover:border-green-500 transition-colors"
        >
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-full object-cover rounded-xl"
            />
          ) : (
            <div className="text-center text-gray-500">
              <p className="font-satoshi-medium text-base">Click to upload image</p>
              <p className="text-sm font-satoshi-regular">Only image files are allowed</p>
            </div>
          )}
        </label>

        <input
          id="profile-image-upload"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* Action Buttons */}
        <div className="mt-6 flex justify-between gap-4">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-600 text-white rounded-full text-sm font-satoshi-medium hover:bg-gray-700 flex items-center gap-2 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2 bg-green-600 text-white rounded-full text-sm font-satoshi-medium hover:bg-green-700 flex items-center gap-2 transition"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ImageUploadModal;
