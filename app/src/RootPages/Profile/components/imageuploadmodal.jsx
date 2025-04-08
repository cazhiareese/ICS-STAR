import React, { useState } from "react";

function ImageUploadModal({ isOpen, onClose, onUpload }) {
  const [image, setImage] = useState(null); 
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    console.log("File selected:", file); // Debugging: log the selected file
    if (file) {
      setImage(file); 
      setImagePreview(URL.createObjectURL(file)); 
      console.log("Image URL created:", URL.createObjectURL(file)); 
    }
  };

  const handleSubmit = async () => {
    if (!image) {
      setError("No image selected");
      console.log("Error: No image selected"); 
      return;
    }

    setLoading(true);
    setError(null);
    console.log("Uploading image...");

    const token = localStorage.getItem("token"); 
    console.log("Token retrieved:", token); 
    if (!token) {
      setError("User not authenticated");
      console.log("Error: User not authenticated"); 
      setLoading(false);
      return;
    }

    // Prepare form data
    const formData = new FormData();
    formData.append("file", image); 
    console.log("FormData created:", formData); 

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
      console.log("Response from backend:", result); 

      // Pass the uploaded image URL or path back to the parent component
      onUpload(result.imageUrl); 

      onClose(); 
    } catch (err) {
      console.error("Error during upload:", err); 
      setError(err.message || "An error occurred during upload");
    } finally {
      setLoading(false);
      console.log("Upload process finished."); 
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
        {imagePreview && (
  <div className="w-[300px] h-[300px] mb-4 rounded-md overflow-hidden border border-gray-300">
    <img
      src={imagePreview}
      alt="Preview"
      className="w-full h-full object-cover"
    />
  </div>
)}


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
