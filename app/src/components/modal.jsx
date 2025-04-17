import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

const Modal = ({ isOpen, closeModal, content, onSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <motion.div
        className="bg-white w-11/12 md:w-1/3 rounded-lg shadow-lg overflow-hidden"
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">All Affiliations</h2>
          <button onClick={closeModal}>
            <X size={20} />
          </button>
        </div>
        <div className="p-4 max-h-[60vh] overflow-y-auto">
          <ul>
            {content.map((item, index) => (
              <li
                key={index}
                className="cursor-pointer py-2 hover:bg-gray-200 rounded-lg"
                onClick={() => onSelect(item)}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

export default Modal;
