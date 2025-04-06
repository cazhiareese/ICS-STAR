import React, { useState } from "react";

function ImageUploadModal({ isOpen, onClose, onUpload }) {
  const [image, setImage] = useState(null); // Will store the actual file
  const [imagePreview, setImagePreview] = useState(null); // Will store the preview URL
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    console.log("File selected:", file); // Debugging: log the selected file
    if (file) {
      setImage(file); // Store the file object
      setImagePreview(URL.createObjectURL(file)); // Store the preview URL for showing the image preview
      console.log("Image URL created:", URL.createObjectURL(file)); // Debugging: log the image preview URL
    }
  };

  const handleSubmit = async () => {
    if (!image) {
      setError("No image selected");
      console.log("Error: No image selected"); // Debugging: log error message
      return;
    }

    setLoading(true);
    setError(null);
    console.log("Uploading image...");

    const token = localStorage.getItem("token"); // Assuming the user is authenticated
    console.log("Token retrieved:", token); // Debugging: log the token
    if (!token) {
      setError("User not authenticated");
      console.log("Error: User not authenticated"); // Debugging: log error message
      setLoading(false);
      return;
    }

    // Prepare form data
    const formData = new FormData();
    formData.append("file", image); // Append the actual file object, not the preview URL
    console.log("FormData created:", formData); // Debugging: log FormData contents

    try {
      console.log("Sending request...");
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
      console.log("Response from backend:", result); // Debugging: log the backend response
      onUpload(result); // Call the parent function to update the profile
      onClose(); // Close the modal after successful upload
    } catch (err) {
      console.error("Error during upload:", err); // Debugging: log the error
      setError(err.message || "An error occurred during upload");
    } finally {
      setLoading(false);
      console.log("Upload process finished."); // Debugging: log when upload finishes
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
        {imagePreview && <img src={imagePreview} alt="Preview" className="mb-4 w-full rounded-md" />}

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm">{error}</p>}

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
            disabled={loading}
            className="px-5 py-2 bg-green-600 text-white rounded-full text-sm font-medium hover:bg-green-700 flex items-center gap-2 transition"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ImageUploadModal;
