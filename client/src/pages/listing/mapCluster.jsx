import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const containerStyle = {
    width: '100%', // Takes the full width of the parent container
    height: '100vh', // Takes 50% of the viewport height
};

const defaultCenter = {
    lat: -3.745,
    lng: -38.523,
};

const MapComponent = ({ listings }) => {
    const center = useMemo(() => {
        let validListings = listings.filter((l) => l.coordinates);
        if (validListings.length === 0) return defaultCenter;

        let totalLat = 0;
        let totalLng = 0;

        validListings.forEach((listing) => {
            totalLat += listing.coordinates.lat;
            totalLng += listing.coordinates.lng;
        });

        return {
            lat: totalLat / validListings.length,
            lng: totalLng / validListings.length,
        };
    }, [listings]);

    return (
        <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
            <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10}>
                {listings.map(
                    (listing) =>
                        listing.coordinates && (
                            <Marker
                                key={listing.id}
                                position={{
                                    lat: listing.coordinates.lat,
                                    lng: listing.coordinates.lng,
                                }}
                            />
                        )
                )}
            </GoogleMap>
        </LoadScript>
    );
};

MapComponent.propTypes = {
    listings: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            coordinates: PropTypes.shape({
                lat: PropTypes.number.isRequired,
                lng: PropTypes.number.isRequired,
            }),
        })
    ).isRequired,
};

export default MapComponent;
