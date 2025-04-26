import React from 'react';

const NewsletterModal = ({ isOpen, onClose, formData }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center  ">
        <div className="absolute inset-0 bg-gray-500 opacity-40 pointer-events-none"></div>
      <div className="bg-white p-6 rounded-lg w-96 max-w-full relative">
        <h2 className="font-satoshi-bold text-xl mb-4">Newsletter Preview</h2>
        
        {/* Title */}
        <div className="mb-4">
          <strong>Title:</strong>
          <p>{formData.title}</p>
        </div>

        {/* Content */}
        <div className="mb-4">
          <strong>Content:</strong>
          <p>{formData.content}</p>
        </div>

        {/* Links */}
        <div className="mb-4">
          <strong>Links:</strong>
          <ul>
            {formData.linklist.length === 0 ? (
              <p>No links added</p>
            ) : (
              formData.linklist.map((link, index) => (
                <li key={index}>{link}</li>
              ))
            )}
          </ul>
        </div>

        {/* Tags */}
        <div className="mb-4">
          <strong>Tags:</strong>
          <p>{formData.selectedTags.length === 0 ? 'No tags selected' : formData.selectedTags.join(', ')}</p>
        </div>

        {/* All Alumni */}
        <div className="mb-4">
          <strong>Send to All Alumni:</strong>
          <p>{formData.allAlumni ? 'Yes' : 'No'}</p>
        </div>

        {/* Image */}
        <div className="mb-4">
          <strong>Image:</strong>
          {formData.image ? (
            <img src={formData.image} alt="Preview" className="w-32 h-32 object-cover" />
          ) : (
            <p>No image uploaded</p>
          )}
        </div>

        {/* Career List */}
        <div className="mb-4">
          <strong>Career List:</strong>
          <ul>
            {formData.careerList.length === 0 ? (
              <p>No careers selected</p>
            ) : (
              formData.careerList.map((career, index) => (
                <li key={index}>{career}</li>
              ))
            )}
          </ul>
        </div>

        {/* Date List */}
        <div className="mb-4">
          <strong>Date List:</strong>
          <ul>
            {formData.dateList.length === 0 ? (
              <p>No dates selected</p>
            ) : (
              formData.dateList.map((date, index) => (
                <li key={index}>{date}</li>
              ))
            )}
          </ul>
        </div>

        <div className="text-right">
          <button
            className="bg-primary text-white px-6 py-2 rounded-lg"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewsletterModal;
