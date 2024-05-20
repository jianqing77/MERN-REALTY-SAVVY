import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const Modal = ({ onClose, onConfirm }) => {
    return (
        <div className="modal">
            <div className="modal-content">
                <h4>Allow Location Access</h4>
                <p>To enhance your experience, allow access to your location.</p>
                <button onClick={onConfirm}>Allow</button>
                <button onClick={onClose}>Deny</button>
            </div>
        </div>
    );
};

Modal.propTypes = {
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
};

const LocationPromptWithModal = () => {
    const [location, setLocation] = useState({ lat: null, lng: null });
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        // Handling Already Granted Permissions
        navigator.permissions.query({ name: 'geolocation' }).then((result) => {
            if (result.state === 'granted') {
                navigator.geolocation.getCurrentPosition((position) => {
                    setLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                });
            } else if (result.state === 'prompt') {
                setShowModal(true);
            }
        });
    }, []);

    const handleConfirm = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
                setShowModal(false);
            },
            () => {
                alert('Error accessing location.');
                setShowModal(false);
            }
        );
    };

    return (
        <div>
            <button onClick={() => setShowModal(true)}>Browse</button>
            {showModal && (
                <Modal onClose={() => setShowModal(false)} onConfirm={handleConfirm} />
            )}
            {location.lat && location.lng && (
                <p>
                    Latitude: {location.lat}, Longitude: {location.lng}
                </p>
            )}
        </div>
    );
};

export default LocationPromptWithModal;
