import PropTypes from 'prop-types';
import React from 'react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const SearchBarLocation = ({ location, onLocationChange }) => {
    return (
        <div className="sm:flex items-center rounded-lg overflow-hidden py-4 justify-between">
            <input
                className="mt-1 mx-1 text-base text-gray-400 flex-grow outline-none border border-dark-100 rounded-lg focus:ring-primary-200 focus:ring-2 focus:border-none"
                type="text"
                placeholder="Enter location (e.g., New York, Los Angeles)"
                value={location}
                onChange={onLocationChange}
            />
        </div>
    );
};

SearchBarLocation.propTypes = {
    location: PropTypes.string.isRequired,
    onLocationChange: PropTypes.func.isRequired,
};

export default SearchBarLocation;
