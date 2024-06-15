import PropTypes from 'prop-types';
import React from 'react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// const Component = () => (
//   <div>
//     <GooglePlacesAutocomplete
//       apiKey="****"
//     />
//   </div>
// );

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

// import React from 'react';
// import PropTypes from 'prop-types';
// import GooglePlacesAutocomplete, {
//     geocodeByPlaceId,
// } from 'react-google-places-autocomplete';

// const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// const SearchBarLocation = ({ location, onLocationChange }) => {
//     // Function to handle selection from autocomplete
//     const handleSelect = (value) => {
//         const placeId = value.value.place_id;
//         geocodeByPlaceId(placeId)
//             .then((results) => {
//                 onLocationChange({
//                     target: {
//                         value: results[0].formatted_address, // Gets full address
//                     },
//                 });
//             })
//             .catch((error) => console.error(error));
//     };

//     return (
//         <div className="sm:flex items-center rounded-lg overflow-hidden py-4 justify-between">
//             <GooglePlacesAutocomplete
//                 apiKey={GOOGLE_MAPS_API_KEY}
//                 selectProps={{
//                     value: location,
//                     onChange: handleSelect,
//                     placeholder: 'Enter location (e.g., New York, Los Angeles)',
//                     styles: {
//                         input: (base) => ({
//                             ...base,
//                             color: '#4B5563', // text-gray-600
//                             padding: '0.5rem 1rem', // p-2
//                             borderColor: '#D1D5DB', // border-gray-300
//                             '&:focus': {
//                                 outline: 'none',
//                                 borderColor: '#BFDBFE', // border-blue-300
//                                 ring: '2px',
//                                 ringColor: '#BFDBFE', // ring-blue-300
//                             },
//                         }),
//                         option: (provided) => ({
//                             ...provided,
//                             color: 'black',
//                             backgroundColor: '#FFFFFF', // bg-white
//                             '&:hover': {
//                                 backgroundColor: '#F9FAFB', // bg-gray-50
//                             },
//                         }),
//                         control: (base, state) => ({
//                             ...base,
//                             border: '1px solid #D1D5DB', // border-gray-300
//                             boxShadow: state.isFocused ? '0 0 0 2px #BFDBFE' : 'none', // focus:ring-blue-300
//                             '&:hover': {
//                                 borderColor: '#D1D5DB', // border-gray-300
//                             },
//                         }),
//                     },
//                 }}
//             />
//         </div>
//     );
// };

// SearchBarLocation.propTypes = {
//     location: PropTypes.shape({
//         label: PropTypes.string,
//         value: PropTypes.shape({
//             description: PropTypes.string,
//             place_id: PropTypes.string,
//         }),
//     }),
//     onLocationChange: PropTypes.func.isRequired,
// };

// export default SearchBarLocation;
