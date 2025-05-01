import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const CustomDropdown = ({ options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (selectedValue) => {
    onChange(selectedValue);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full">
      {/* Selected value display with arrow */}
      <div
        className="w-full p-4 border border-gray-300 rounded-lg cursor-pointer flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{value ? value : 'Select your country'}</span>
        <ChevronDown
          className={`w-4 h-4 ml-2 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </div>

      {/* Dropdown options */}
      {isOpen && (
        <div
          className="absolute w-full mt-1 max-h-50 overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-lg z-10"
          style={{ maxHeight: '200px' }}
        >
          {options.map((country) => (
            <div
              key={country.value}
              className="p-4 cursor-pointer hover:bg-gray-200"
              onClick={() => handleSelect(country.label)}
            >
              {country.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
