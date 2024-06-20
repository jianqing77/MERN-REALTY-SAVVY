import React from 'react';
import Autocomplete from '@oz_dev/react-google-autocomplete';

const LocationInput = () => {
    const handlePlaceSelected = (place) => {
        console.log(place); // This will log the selected place object
    };

    const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    return (
        <Autocomplete
            apiKey={GOOGLE_MAPS_API_KEY}
            onPlaceSelected={handlePlaceSelected}
            style={{ width: '100%' }} // Custom styling
            options={{
                types: ['(cities)'], // Specify type of places in autocomplete
            }}
        />
    );
};

export default LocationInput;
