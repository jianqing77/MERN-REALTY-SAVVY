import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

function DropdownRange({ buttonLabel, onRangeChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const [minValue, setMinValue] = useState('');
    const [maxValue, setMaxValue] = useState('');

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

    const applyRange = () => {
        onRangeChange({ min: minValue, max: maxValue });
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
                {buttonLabel}
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
                <div className="absolute z-50 mt-1 px-1 bg-white rounded-lg shadow border-2 w-80 max-h-52 overflow-y-auto">
                    <div className="grid grid-cols-5 p-3 text-sm text-gray-800">
                        <div className="col-span-2">
                            <label
                                htmlFor="min-input"
                                className="block text-sm font-medium text-gray-700">
                                Minimum
                            </label>
                            <input
                                id="min-input"
                                type="text"
                                value={minValue}
                                onChange={(e) => setMinValue(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-200 focus:ring focus:border-none focus:ring-primary-200 focus:ring-opacity-50"
                            />
                        </div>
                        <div className="col-span-1 flex items-center justify-center">
                            <p className="mt-3">-</p>
                        </div>
                        <div className="col-span-2">
                            <label
                                htmlFor="max-input"
                                className="block text-sm font-medium text-gray-700">
                                Maximum
                            </label>
                            <input
                                id="max-input"
                                type="text"
                                value={maxValue}
                                onChange={(e) => setMaxValue(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-200 focus:ring focus:border-none focus:ring-primary-200 focus:ring-opacity-50"
                            />
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <button
                            className="w-full bg-dark-200 text-white p-2 rounded-b-lg hover:bg-dark-100 "
                            onClick={applyRange}>
                            Save
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// Define prop types
DropdownRange.propTypes = {
    buttonLabel: PropTypes.string.isRequired,
    onRangeChange: PropTypes.func.isRequired,
};

export default DropdownRange;
