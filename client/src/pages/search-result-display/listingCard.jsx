import React from 'react';
import PropTypes from 'prop-types';
import HeartIcon from '../../components/HeartIcon';
import {
    formatPrice,
    formatSquareFeet,
    formatPropertyType,
    formatListingType,
    getAbbreviation,
} from '../../utils/formatUtils';

const ListingCard = ({ listing }) => {
    const {
        id,
        title,
        price,
        propertyType,
        features,
        location,
        media,
        listingType,
        contactInfo,
    } = listing;

    const displayAgentInfo = listingType === 'for_sale';

    return (
        <div className="grid grid-cols-10 rounded overflow-hidden shadow-lg bg-white py-2 border-0">
            <div
                className="col-span-3 w-40 h-32 bg-cover bg-center rounded-xl ms-12"
                style={{ backgroundImage: `url(${media.imageUrls[0]})` }}></div>
            <div className="col-span-6 ms-6">
                <div className="pe-1">
                    <div className="text-xl font-bold mb-1">{formatPrice(price)}</div>
                    <p className="text-base text-gray-600">
                        Beds: {features.bedrooms} | Baths: {features.bathrooms} |{' '}
                        {formatSquareFeet(features.squareFootage)} sqft
                    </p>
                    <p className="text-base text-gray-600">
                        {location.address}, {location.city},{' '}
                        {getAbbreviation(location.state)}, {location.zipCode}
                    </p>
                    <p className="text-base text-gray-600">
                        {formatPropertyType(propertyType)}{' '}
                        {formatListingType(listingType)}
                    </p>
                    {displayAgentInfo ? (
                        <p className="text-xs text-gray-500 uppercase">
                            {contactInfo.agentCompany} | {contactInfo.agentName}
                        </p>
                    ) : (
                        <p className="text-xs text-gray-500">{contactInfo.agentName}</p>
                    )}
                    {/* <p>{media.refUrl}</p> */}
                </div>
            </div>
            <div className="col-span-1 flex items-top justify-around">
                <a
                    href={media.refUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Details">
                    <i className="fa fa-ellipsis-h" aria-hidden="true"></i>
                </a>
                <div>
                    <HeartIcon listingId={id} type="external" />
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
            agentCompany: PropTypes.string,
            agentName: PropTypes.string,
            email: PropTypes.string,
        }),
        media: PropTypes.shape({
            imageUrls: PropTypes.arrayOf(PropTypes.string).isRequired,
            refUrl: PropTypes.string,
        }).isRequired,
        metadata: PropTypes.object,
        coordinates: PropTypes.shape({
            latitude: PropTypes.number,
            longitude: PropTypes.number,
        }),
    }).isRequired,
};

export default ListingCard;
