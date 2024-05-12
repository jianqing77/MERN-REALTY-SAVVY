import React from 'react';
import PropTypes from 'prop-types';
import states from 'states-us';

// Function to format price
function formatPrice(value) {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
    return formatter.format(value);
}

function formatSquareFeet(value) {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'decimal', // Use "decimal" for non-currency numbers
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
    return formatter.format(value);
}

function formatPropertyType(type) {
    const typeMap = {
        condos: 'Condo',
        co_op: 'Co-op',
        cond_op: 'Cond-op',
        townhome: 'Town home',
        single_family: 'Single-Family',
        multi_family: 'Multi-Family',
        mobile_mfd: 'Mobile/Mfd',
        farm_ranch: 'Farm Ranch',
        land: 'Land',
    };

    return typeMap[type] || type; // Return original type if no match found
}

function formatListingType(type) {
    const typeMap = {
        for_sale: 'for sale',
        for_rent: 'for rent',
    };

    return typeMap[type] || type; // Return original type if no match found
}

// Function to format the state to an abbreviation
function getAbbreviation(stateName) {
    const state = states.find(
        (state) => state.name.toLowerCase() === stateName.toLowerCase()
    );
    return state ? state.abbreviation : null;
}

const ListingCard = ({ listing }) => {
    const {
        title,
        price,
        propertyType,
        features,
        location,
        media,
        listingType,
        contactInfo,
    } = listing;

    return (
        <div className="grid grid-cols-10 rounded overflow-hidden shadow-lg bg-white py-2 border-0">
            <div
                className="col-span-3 w-40 h-32 bg-cover bg-center rounded-xl ms-12"
                style={{ backgroundImage: `url(${media.imageUrls[0]})` }}></div>
            <div className="col-span-7 ms-6">
                <div className="pe-1">
                    <div className="text-xl font-bold mb-1">{formatPrice(price)}</div>
                    <p className="text-base text-gray-600">
                        Beds: {features.bedrooms} | Baths: {features.bathrooms} |{' '}
                        {formatSquareFeet(features.squareFootage)} sqft
                    </p>
                    <p className="text-base text-gray-600">
                        {formatPropertyType(propertyType)}{' '}
                        {formatListingType(listingType)}
                    </p>
                    <p className="text-base text-gray-600">
                        {location.address}, {location.city},{' '}
                        {getAbbreviation(location.state)}, {location.zipCode}
                    </p>
                    <p className="text-xs text-gray-500 uppercase">
                        {contactInfo.agentCompany} | {contactInfo.agentName}{' '}
                    </p>
                </div>
            </div>
        </div>
    );
};

// Update the prop types for ListingCard according to the new data structure
ListingCard.propTypes = {
    listing: PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        listingType: PropTypes.string.isRequired,
        description: PropTypes.string,
        listingDate: PropTypes.string,
        price: PropTypes.string.isRequired, // Updated to expect a number
        propertyType: PropTypes.string.isRequired,
        location: PropTypes.shape({
            address: PropTypes.string.isRequired,
            city: PropTypes.string.isRequired,
            state: PropTypes.string.isRequired,
            zipCode: PropTypes.string.isRequired,
        }).isRequired,
        features: PropTypes.shape({
            bedrooms: PropTypes.string.isRequired,
            bathrooms: PropTypes.string.isRequired,
            squareFootage: PropTypes.string.isRequired,
            lotSize: PropTypes.string,
        }).isRequired,
        contactInfo: PropTypes.shape({
            agentCompany: PropTypes.string,
            agentName: PropTypes.string,
            email: PropTypes.string,
        }),
        media: PropTypes.shape({
            imageUrls: PropTypes.arrayOf(PropTypes.string).isRequired,
        }).isRequired,
        metadata: PropTypes.object,
        coordinates: PropTypes.shape({
            latitude: PropTypes.number,
            longitude: PropTypes.number,
        }),
    }).isRequired,
};

export default ListingCard;
