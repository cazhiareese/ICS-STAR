import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle } from 'lucide-react';
import CircularLoading from '../LoadingComponents/circularloading';
import { useNavigate } from 'react-router-dom';

const NewsletterModal = ({ isOpen, onClose, formData, option, id, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    // Reset states when modal opens
    setLoading(false);
    setSuccess(false);
    setError('');
  }, [isOpen]);

  // Move the early return after all hooks are called
  if (!isOpen) return null;

  const handleConfirm = async () => {
    setLoading(true);
    setError('');

    try {
      if (option === "create" || option === "edit") {
        // Create/Edit logic will be handled by the parent (AdminEditNewsletter)
        console.log(`${option === "create" ? "Creating" : "Editing"} newsletter with data:`, formData);
        onClose(); // Let parent handle the actual API call
      } else if (option === "delete") {
        // Handle delete logic here
        const token = localStorage.getItem('token');
        const response = await axios.delete(
          `${import.meta.env.VITE_BACKEND_URL}/api/admin/newsletter/delete/${id}`,
          {headers: {Authorization: `Bearer ${token}`}}
        );

        if (response.data.message === "success") {
          setSuccess(true);
          showToast("Newsletter deleted successfully!", "success");
          if (onSuccess) onSuccess(); // Notify parent of successful deletion
        } else {
          throw new Error('Unexpected response from server');
          showToast("Failed to delete newsletter", "error");
        }
      }
    } catch (err) {
      const errorMsg = err.response?.status === 404
        ? 'Newsletter not found'
        : err.response?.status === 500
        ? 'Server error: Unable to delete newsletter'
        : 'Failed to delete newsletter';
      console.error('Error:', err.message, err.response?.data);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    if (success) {
      setSuccess(false);
      onClose();
      navigate('/admin/newsletter'); // Redirect to the newsletter list page
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-gray-500 opacity-40 pointer-events-none"></div>

      {/* Modal */}
      <div className="bg-white p-6 rounded-2xl w-96 max-w-full relative flex flex-col justify-center items-center" style={{ height: '250px' }}>
        {loading ? (
          <div className="h-full">
            <CircularLoading />
          </div>
        ) : success ? (
          <>
            <div className="text-success">
              <CheckCircle size={48} />
            </div>
            <p className="text-xl font-satoshi-medium mt-4 text-center">
              Successfully deleted newsletter!
            </p>
            <button
              className="bg-success text-white px-6 py-2 rounded-3xl mt-6"
              onClick={handleClose}
            >
              Close
            </button>
          </>
        ) : (
          <>
            {/* Error Message */}
            {error && (
              <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-lg text-center">
                {error}
              </div>
            )}

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
                    onClick={handleClose}
                  >
                    Not Yet
                  </button>
                  <button
                    className="bg-error text-white px-6 py-2 rounded-3xl hover:bg-hover"
                    onClick={handleConfirm}
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
                    onClick={handleClose}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-error text-white px-6 py-2 rounded-3xl hover:bg-hover"
                    onClick={handleConfirm}
                  >
                    Confirm
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NewsletterModal;