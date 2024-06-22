import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { findListingById } from '../../../services/internal-listing/internal-listing-service';
import { findListingByIdThunk } from '../../../services/internal-listing/internal-listing-thunk';
import { formatDate, formatPrice, formatSquareFeet } from '../../../utils/formatUtils';

export default function ListingDetailsPage() {
    const { listingId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const currentListing = useSelector(
        (state) => state['internal-listings'].currentListing
    );

    useEffect(() => {
        if (listingId) {
            dispatch(findListingByIdThunk(listingId));
        }
    }, [listingId, dispatch]);

    // button to back to the listing list
    const backToAllListingHandler = () => {
        navigate('/profile/listings');
    };

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const imageUrls = currentListing.media.imageUrls;

    const nextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageUrls.length);
    };

    const prevImage = () => {
        setCurrentImageIndex(
            (prevIndex) => (prevIndex - 1 + imageUrls.length) % imageUrls.length
        );
    };

    return (
        // <p>{listingId}</p>
        <div className="max-w-9xl gap-x-8 gap-y-10 px-4 pt-16 pb-10 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center">
                <div className="flex-auto">
                    <h1 className="text-base font-semibold leading-6 text-gray-900">
                        Details of {listingId}
                    </h1>
                    <p className="mt-2 hidden text-sm text-gray-400 sm:block">
                        A list of all the listings you have created.
                    </p>
                </div>
                <div className="mt-4 sm:ml-16">
                    <button
                        type="button"
                        onClick={backToAllListingHandler}
                        className="block rounded-md bg-dark-100 px-3 py-2 text-center text-sm font-semibold text-primary-100 shadow-sm hover:bg-yellow-500 hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dark-200">
                        Back To All Listings
                    </button>
                </div>
            </div>
            <div className="mt-8 flow-root">
                {/* Image Display */}
                <div className="relative w-full">
                    <div className="relative h-36 overflow-hidden rounded-lg md:h-72 mb-2">
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
                    {/* Buttons for slider */}
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
                <p>Title: {currentListing.title}</p>
                <p>Description: {currentListing.description}</p>
                <p>Listing Type: {currentListing.propertyType}</p>
                <p>
                    {currentListing.listingType === 'for-rent'
                        ? `Pet Policy: ${currentListing.petPolicy}`
                        : `Home Age: ${currentListing.homeAge}`}
                </p>

                <p>Address: {currentListing.location.address}</p>
                <p>City: {currentListing.location.city}</p>
                <p>State: {currentListing.location.state}</p>
                <p>Zip Code: {currentListing.location.zipCode}</p>
                <p>Price: {formatPrice(currentListing.price)}</p>
                <p>Bedrooms: {currentListing.features.bedrooms}</p>
                <p>Bathrooms: {currentListing.features.bathrooms}</p>
                <p>Created At: {formatDate(currentListing.createdAt)}</p>
                <p>Last Update: {formatDate(currentListing.updatedAt)}</p>
                <p>Agent Company: {currentListing.contactInfo.agentCompany}</p>
                <p>Agent Name: {currentListing.contactInfo.agentName}</p>
                <p>
                    Agent Phone:{' '}
                    {currentListing.contactInfo.agentPhone
                        ? currentListing.contactInfo.agentPhone
                        : 'Not Provided'}
                </p>
                <p>Agent Email:{currentListing.contactInfo.email}</p>
            </div>
        </div>
    );
}
