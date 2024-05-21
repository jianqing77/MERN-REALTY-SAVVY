import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { InfoWindow } from '@react-google-maps/api';
import { formatPrice, formatSquareFeet } from './formatUtils';
import HeartIcon from '../../components/HeartIcon';

const InfoWindowComponent = ({ selected, onClose }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const imageUrls = selected.media.imageUrls;

    const nextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageUrls.length);
    };

    const prevImage = () => {
        setCurrentImageIndex(
            (prevIndex) => (prevIndex - 1 + imageUrls.length) % imageUrls.length
        );
    };

    return (
        <InfoWindow position={selected.coordinates} onCloseClick={onClose}>
            <div className="w-full max-w-xs text-sm font-sans">
                {/* Carousel Implementation */}
                <div className="relative w-full">
                    <div className="relative h-20 overflow-hidden rounded-lg md:h-36 mb-2">
                        {imageUrls.map((url, index) => (
                            <div
                                key={index}
                                className={`absolute w-full h-full transition duration-700 ease-in-out ${
                                    index === currentImageIndex ? 'block' : 'hidden'
                                }`}>
                                <img
                                    src={url}
                                    className="absolute block w-full h-full object-cover -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
                                    alt={`Slide ${index + 1}`}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="absolute z-30 flex space-x-3 -translate-x-1/2 bottom-1 left-1/2">
                        {imageUrls.map((_, index) => (
                            <button
                                key={index}
                                className={`w-2 h-2 rounded-full ${
                                    index === currentImageIndex
                                        ? 'bg-primary-200'
                                        : 'bg-white'
                                }`}
                                aria-label={`Slide ${index + 1}`}
                                onClick={() => setCurrentImageIndex(index)}></button>
                        ))}
                    </div>
                    {/* Arrows */}
                    <div className="absolute inset-0 flex items-center justify-between px-4">
                        <button
                            type="button"
                            className="z-30 flex items-center justify-center cursor-pointer group focus:outline-none"
                            onClick={prevImage}
                            data-carousel-prev>
                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary-200  group-hover:bg-white/50 group-focus:ring-2 group-focus:ring-white  group-focus:outline-none">
                                <svg
                                    className="w-3 h-3 text-white dark:text-gray-800"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 6 10">
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M5 1 1 5l4 4"
                                    />
                                </svg>
                                <span className="sr-only">Previous</span>
                            </span>
                        </button>
                        <button
                            type="button"
                            className="z-30 flex items-center justify-center cursor-pointer group focus:outline-none"
                            onClick={nextImage}
                            data-carousel-next>
                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary-200  group-hover:bg-white/50 group-focus:ring-2 group-focus:ring-white  group-focus:outline-none">
                                <svg
                                    className="w-3 h-3 text-white dark:text-gray-800"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 6 10">
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="m1 9 4-4-4-4"
                                    />
                                </svg>
                                <span className="sr-only">Next</span>
                            </span>
                        </button>
                    </div>
                </div>
                {/* Other Information */}
                <h1 className="text-black text-base font-semibold">{selected.title}</h1>
                <p>{selected.description}</p>
                <p className="text-base text-gray-600">
                    <span className="font-semibold">Price:</span>{' '}
                    {formatPrice(selected.price)}
                </p>
                <p className="text-base text-gray-600">
                    <span className="font-semibold">Bed:</span>{' '}
                    {selected.features.bedrooms} |{' '}
                    <span className="font-semibold">Bath:</span>{' '}
                    {selected.features.bathrooms} |{' '}
                    {formatSquareFeet(selected.features.squareFootage)} sqft
                </p>
                <div>
                    <span>
                        <a
                            href={selected.media.refUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Details">
                            <i className="fa fa-ellipsis-h" aria-hidden="true"></i>
                        </a>
                    </span>
                    <span className="ms-3">
                        <HeartIcon />
                    </span>
                </div>
            </div>
        </InfoWindow>
    );
};

InfoWindowComponent.propTypes = {
    selected: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string,
        price: PropTypes.number.isRequired,
        media: PropTypes.shape({
            imageUrls: PropTypes.arrayOf(PropTypes.string).isRequired,
            refUrl: PropTypes.string,
        }).isRequired,
        coordinates: PropTypes.shape({
            lat: PropTypes.number.isRequired,
            lng: PropTypes.number.isRequired,
        }).isRequired,
        features: PropTypes.shape({
            bedrooms: PropTypes.number,
            bathrooms: PropTypes.number,
            squareFootage: PropTypes.number,
        }).isRequired,
    }).isRequired,
    onClose: PropTypes.func.isRequired,
};

export default InfoWindowComponent;
