import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

function DropdownSingle({ label, options, onSelectionChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [selectedOption, setSelectedOption] = useState(options[0]); // Default to the first option

    const dropdownRef = useRef(null);

    const toggleDropdown = () => setIsOpen(!isOpen);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSelectionChange = (option) => {
        setSelectedOption(option);
        onSelectionChange(option.value); // Pass the value to the handler
        // setIsOpen(false);
    };

    const applySelection = () => {
        if (selectedIndex !== null) {
            onSelectionChange(options[selectedIndex]);
        }
        setIsOpen(false);
    };

    return (
        <div ref={dropdownRef} className="mt-1">
            <button
                onClick={toggleDropdown}
                className="text-gray-800 bg-white outline-none border border-dark-100 focus:ring-2 focus:border-none focus:ring-primary-200 font-medium rounded-lg text-base px-5 py-2 text-center inline-flex items-center"
                type="button"
                aria-haspopup="true"
                aria-expanded={isOpen}>
                {selectedOption.label}
                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 10 6">
                    <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 4 4 4-4"
                    />
                </svg>
            </button>
            {isOpen && (
                <div className="absolute z-50 mt-1 bg-white rounded-lg shadow border-2 w-72 max-h-48 overflow-y-auto">
                    <div className="p-3 border-b">
                        <p className="text-sm font-semibold">{label}</p>
                    </div>
                    <ul className="p-3 space-y-1 text-sm text-gray-800 ">
                        {options.map((option, index) => (
                            <li
                                key={index}
                                className="flex items-center p-2 hover:bg-gray-100">
                                <input
                                    id={`radio-item-${index}`}
                                    type="radio"
                                    name="dropdown-radio-group"
                                    checked={selectedOption.value === option.value}
                                    onChange={() => handleSelectionChange(option)}
                                    className="w-4 h-4 text-primary-200 bg-gray-100 border-gray-300 rounded focus:ring-primary-200 focus:ring-2"
                                />
                                <label
                                    htmlFor={`radio-item-${index}`}
                                    className="ml-2 text-sm font-medium text-gray-900 ">
                                    {option.label}
                                </label>
                            </li>
                        ))}
                    </ul>
                    <button
                        className="w-full bg-dark-200 text-white p-2 rounded-b-lg hover:bg-dark-100"
                        onClick={applySelection}>
                        Apply
                    </button>
                </div>
            )}
        </div>
    );
}

// Define prop types
DropdownSingle.propTypes = {
    label: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.string).isRequired,
    onSelectionChange: PropTypes.func.isRequired,
};

export default DropdownSingle;
