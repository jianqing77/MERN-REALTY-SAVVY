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
        <div className="grid grid-cols-10 rounded overflow-hidden shadow-lg bg-white py-2 border-0">
            <div
                className="col-span-3 w-40 h-32 bg-cover bg-center rounded-xl ms-16"
                style={{ backgroundImage: `url(${media.imageUrls[0]})` }}></div>
            <div className="col-span-4">
                <div className="pe-4">
                    <div className="font-bold text-xl mb-2">{title}</div>
                    <p className="text-gray-700 text-sm">
                        Price:
                        <span className="font-semibold"> ${price.toLocaleString()}</span>
                    </p>
                    <p className="text-gray-600 text-sm">
                        {location.address}, {location.city}, {location.state}{' '}
                    </p>
                    <p className="text-gray-600 text-sm">
                        Beds: {features.bedrooms} | Baths: {features.bathrooms} | Sqft:{' '}
                        {features.squareFootage}
                    </p>
                </div>
            </div>
            <div className="col-span-3">
                <p className="text-gray-600 text-sm">Property Type: {propertyType}</p>
                <p className="text-gray-600 text-sm">Status: {listingType}</p>
                <p className="text-gray-600 text-sm">Zip Code: {location.zipCode}</p>
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
        price: PropTypes.string.isRequired,
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
