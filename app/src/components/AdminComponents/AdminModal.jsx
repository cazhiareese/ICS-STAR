import React from 'react';
import { X } from 'lucide-react';

const AdminModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white shadow-lg w-full max-w-lg relative rounded-2xl h-4/5">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 hover:text-gray-100 cursor-pointer"
        >
          <X className='text-white'/>
        </button>
        {children}
      </div>
    </div>
  );
};

export default AdminModal;
