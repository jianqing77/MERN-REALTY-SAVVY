import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

function DropdownMultiple({ options, buttonLabel, onSelectionChange, buttonClassName }) {
    const [isOpen, setIsOpen] = useState(false);
    const [checkedState, setCheckedState] = useState(
        new Array(options.length).fill(false)
    );
    const [tempCheckedState, setTempCheckedState] = useState(
        new Array(options.length).fill(false)
    );

    const dropdownRef = useRef(null);

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

    const handleCheckboxChange = (position) => {
        const updatedTempCheckedState = [...tempCheckedState];
        updatedTempCheckedState[position] = !updatedTempCheckedState[position];

        // Special rules for "No Pets Allowed"
        if (position === options.indexOf('No Pets Allowed')) {
            if (updatedTempCheckedState[position]) {
                updatedTempCheckedState.fill(false);
                updatedTempCheckedState[position] = true;
            }
        } else {
            updatedTempCheckedState[options.indexOf('No Pets Allowed')] = false;
        }

        setTempCheckedState(updatedTempCheckedState);
    };

    const applySelection = () => {
        setCheckedState(tempCheckedState);
        console.log('checked state after clicking apply: ' + checkedState);
        onSelectionChange(options.filter((_, index) => tempCheckedState[index]));
        setIsOpen(false); // Close the dropdown
    };

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            // Reinitialize tempCheckedState from checkedState when opening
            setTempCheckedState([...checkedState]);
        }
    };

    return (
        <div ref={dropdownRef} className="mt-1">
            <button
                onClick={toggleDropdown}
                className={`text-gray-800 bg-white outline-none border border-dark-100 focus:ring-2 focus:border-none focus:ring-primary-200 font-medium rounded-lg text-base px-5 py-2 text-center inline-flex items-center ${buttonClassName}`}
                type="button"
                aria-haspopup="true"
                aria-expanded={isOpen}>
                {buttonLabel}
                <svg className="w-2.5 h-2.5 ml-3" fill="none" viewBox="0 0 10 6">
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
                <div className="absolute z-50 mt-1 w-60 bg-white rounded-lg shadow border-2">
                    <ul className="p-3 space-y-1 text-sm text-gray-800 ">
                        {options.map((label, index) => (
                            <li key={index}>
                                <div className="flex items-center p-2 rounded hover:bg-gray-100">
                                    <input
                                        id={`checkbox-item-${index}`}
                                        type="checkbox"
                                        checked={checkedState[index]}
                                        onChange={() => handleCheckboxChange(index)}
                                        className="w-4 h-4 text-primary-200 bg-gray-100 border-gray-300 rounded focus:ring-primary-200  focus:ring-2"
                                    />
                                    <label
                                        htmlFor={`checkbox-item-${index}`}
                                        className="ml-2 text-sm font-medium text-gray-900 ">
                                        {label}
                                    </label>
                                </div>
                            </li>
                        ))}
                        <li className="px-2">
                            <button
                                onClick={applySelection}
                                className="w-full px-4 py-2 text-sm text-center text-white rounded bg-dark-100 hover:bg-dark-200">
                                Apply
                            </button>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
}

// Define prop types
DropdownMultiple.propTypes = {
    options: PropTypes.arrayOf(PropTypes.string).isRequired,
    buttonLabel: PropTypes.string.isRequired,
    onSelectionChange: PropTypes.func.isRequired,
    buttonClassName: PropTypes.string,
};

export default DropdownMultiple;
