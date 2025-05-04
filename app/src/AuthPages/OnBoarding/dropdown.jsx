import React, { useEffect, useState, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

const CustomDropdown = ({ options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value ||'');
  const containerRef = useRef(null);

  useEffect(() => {
    setSearchTerm(value || '');
  }, [value]);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (selectedValue) => {
    onChange(selectedValue);
    setSearchTerm(selectedValue);
    setIsOpen(false);
  };

  const handleBlur = () => {
    const matchedOption = options.find(
      (option) => option.label.toLowerCase() === searchTerm.toLowerCase()
    );

    if (matchedOption) {
      onChange(matchedOption.label);
    } else {
      setSearchTerm(value || ''); // Revert to last valid value
    }

    setIsOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        handleBlur();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchTerm, value]);

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Selected value display with arrow */}
      <div className="w-full relative">
        <input
            type="text"
            className="w-full p-3 border border-neutral-300 bg-neutral-100 rounded-lg focus:outline-primary mt-1"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsOpen(true);
            }}
            onClick={() => setIsOpen(true)}
          />
        <ChevronDown
          className={`w-4 h-4 ml-2 text-gray-500 absolute right-4 top-1/2 transform -translate-y-1/2 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </div>

      {/* Dropdown options */}
      {isOpen && filteredOptions.length > 0 && (
        <div
          className="absolute w-full mt-1 max-h-50 overflow-y-auto bg-white border border-neutral-300 rounded-lg shadow-lg z-10"
          style={{ maxHeight: '200px' }}
        >
          {filteredOptions.map((country) => (
            <div
              key={country.value}
              className="p-4 cursor-pointer hover:bg-gray-200"
              onMouseDown={() => handleSelect(country.label)}
            >
              {country.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const CustomDropdownNoSearch = ({ options, value, onChange, placeholder }) => {

  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (selectedValue) => {
    onChange(selectedValue);
    setIsOpen(false);
  };

  const selectedOption = options.find((item) => item.value === value);
  const displayText = selectedOption ? selectedOption.label : placeholder;

  return (
    <div className="relative w-full">
      {/* Selected value display with arrow */}
      <div
        className="w-full p-3 mt-1 border border-neutral-300 bg-neutral-100 rounded-lg cursor-pointer flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{displayText}</span>
        <ChevronDown
          className={`w-4 h-4 ml-2 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </div>

      {/* Dropdown options */}
      {isOpen && (
        <div
          className="absolute w-full mt-1 max-h-50 overflow-y-auto bg-white border border-neutral-300 rounded-lg shadow-lg z-10"
          style={{ maxHeight: '200px' }}
        >
          {options.map((item) => (
            <div
              key={item.value}
              className="p-4 cursor-pointer hover:bg-gray-200"
              onMouseDown={() => handleSelect(item.value)}
            >
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );

}



export const CustomDropdownStanding = ({ options, value, onChange }) => {
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
