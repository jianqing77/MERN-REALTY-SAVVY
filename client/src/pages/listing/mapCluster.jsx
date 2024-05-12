import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import svgMarker from '../../assets/map-marker.svg';

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
    console.log('LoadScript Mounted');

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
        // <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
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
                            icon={{
                                url: svgMarker,
                            }}
                            onClick={() => setSelected(listing)}
                        />
                    )
            )}
            {/* {selected && (
                    <InfoWindow
                        position={selected.coordinates}
                        onCloseClick={() => setSelected(null)}>
                        <div>
                            <h2>{selected.title}</h2>
                            <p>{selected.description}</p>
                        </div>
                    </InfoWindow>
                )} */}
            {/* <InfoWindow
                    position={selected.coordinates}
                    onCloseClick={() => setSelected(null)}>
                    <div style={{ width: '200px', fontSize: '14px' }}>
                        <h1 style={{ color: 'blue', fontSize: '16px' }}>
                            {selected.title}
                        </h1>
                        <img
                            src={selected.imageUrl}
                            alt={selected.title}
                            style={{ width: '100%' }}
                        />
                        <p>{selected.description}</p>
                        <button onClick={() => console.log('Info button clicked!')}>
                            More Info
                        </button>
                    </div>
                </InfoWindow> */}
        </GoogleMap>
        // </LoadScript>
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
