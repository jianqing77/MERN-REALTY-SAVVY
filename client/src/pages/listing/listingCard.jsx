import React from 'react';
import PropTypes from 'prop-types';

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
        <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white m-4">
            <div
                className="w-1/2 h-32 bg-cover bg-center"
                style={{ backgroundImage: `url(${media.imageUrls[0]})` }}></div>
            <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">{title}</div>
                <p className="text-gray-700 text-base">
                    Price:
                    <span className="font-semibold">${price.toLocaleString()}</span>
                </p>
                <p className="text-gray-600 text-sm">Status: {listingType}</p>
                <p className="text-gray-600 text-sm">Property Type: {propertyType}</p>
                <p className="text-gray-600 text-sm">
                    {location.address}, {location.city}, {location.state}
                    {location.zipCode}
                </p>
                <p className="text-gray-600 text-sm">
                    Beds: {features.bedrooms} | Baths: {features.bathrooms} | Sqft:{' '}
                    {features.squareFootage}
                </p>
            </div>
            <div className="px-6 py-4">
                <p className="text-gray-800 text-sm font-semibold">Contact:</p>
                <p className="text-gray-800 text-sm">{contactInfo.agentName}</p>
                <p className="text-gray-800 text-sm">Email: {contactInfo.email}</p>
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
        price: PropTypes.number.isRequired,
        propertyType: PropTypes.string.isRequired,
        location: PropTypes.shape({
            address: PropTypes.string.isRequired,
            city: PropTypes.string.isRequired,
            state: PropTypes.string.isRequired,
            zipCode: PropTypes.string.isRequired,
        }).isRequired,
        features: PropTypes.shape({
            bedrooms: PropTypes.number.isRequired,
            bathrooms: PropTypes.number.isRequired,
            squareFootage: PropTypes.number.isRequired,
            lotSize: PropTypes.number,
        }).isRequired,
        contactInfo: PropTypes.shape({
            agentName: PropTypes.string,
            email: PropTypes.string,
        }),
        media: PropTypes.shape({
            imageUrls: PropTypes.string.isRequired,
        }).isRequired,
        metadata: PropTypes.object,
    }).isRequired,
};

export default ListingCard;
