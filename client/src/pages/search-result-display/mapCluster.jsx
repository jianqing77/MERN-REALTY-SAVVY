import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { GoogleMap, Marker } from '@react-google-maps/api';
import svgMarker from '../../assets/map-marker.svg';
import InfoWindowComponent from './infoWindow.jsx';

const containerStyle = {
    width: '100%', // Takes the full width of the parent container
    height: '100vh', // Takes 50% of the viewport height
};

const defaultCenter = {
    lat: -3.745,
    lng: -38.523,
};

const MapComponent = ({ listings }) => {
    // console.log('LoadScript Mounted');

    const [selected, setSelected] = useState(null);
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
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={11}>
            {listings.map(
                (listing) =>
                    listing.coordinates && (
                        <Marker
                            key={listing.id}
                            position={{
                                lat: listing.coordinates.lat,
                                lng: listing.coordinates.lng,
                            }}
                            icon={{
                                url: svgMarker,
                            }}
                            onClick={() => setSelected(listing)}
                        />
                    )
            )}
            {selected && (
                <InfoWindowComponent
                    selected={selected}
                    onClose={() => setSelected(null)}
                />
            )}
        </GoogleMap>
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
