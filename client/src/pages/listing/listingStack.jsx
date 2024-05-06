import React from 'react';
import PropTypes from 'prop-types';

const ListingStack = ({ listing }) => {
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
        <li className="flex justify-between gap-x-6 py-5 m-7">
            <div className="flex min-w-0 gap-x-4">
                <div className="grid grid-cols-6 min-w-0 flex-auto">
                    <img
                        src={media.imageUrls[0]}
                        alt=""
                        className="col-span-3 h-24 w-24 flex-none rounded-full bg-gray-50"
                    />
                    <div className="col-span-3">
                        <p className="mt-1 truncate text-base leading-5 text-gray-500">
                            {title}
                        </p>
                        <p className="text-gray-700 text-base">
                            Price:
                            <span className="font-semibold">
                                ${price.toLocaleString()}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
            <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                <p className="text-base leading-6 text-gray-900">Type: {propertyType}</p>
                <p className="mt-1 text-base leading-5 text-gray-900">
                    Beds: {features.bedrooms}
                </p>
                <p className="mt-1 text-base leading-5 text-gray-900">
                    Baths: {features.bathrooms}
                </p>
                <p className="mt-1 text-base leading-5 text-gray-900">
                    Sqft: {features.squareFootage}
                </p>
            </div>
            {/* <div className="px-6 py-4">
                    <p className="text-gray-800 text-sm font-semibold">Contact:</p>
                    <p className="text-gray-800 text-sm">{contactInfo.agentName}</p>
                    <p className="text-gray-800 text-sm">Email: {contactInfo.email}</p>
                </div> */}
        </li>
    );
};

// Update the prop types for ListingCard according to the new data structure
ListingStack.propTypes = {
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
            imageUrls: PropTypes.string.isRequired,
        }).isRequired,
        metadata: PropTypes.object,
    }).isRequired,
};

export default ListingStack;
