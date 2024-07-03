import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    deleteListingThunk,
    findListingByIdThunk,
} from '../../../services/internal-listing/internal-listing-thunk';
import {
    formatDate,
    formatListingTypeInternal,
    formatPetsString,
    formatPrice,
    formatPropertyTypeInternal,
    formatSquareFeet,
} from '../../../utils/formatUtils';
import { Button } from '@mui/material';
import ConfirmDialog from '../../../components/DeleteConfirmDialog';
import ImageSlider from '../../../components/ImageSlider';

export default function ShowListing({ listingId, onEdit }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');

    const currentListing = useSelector(
        (state) => state['internal-listings'].currentListing
    );

    useEffect(() => {
        dispatch(findListingByIdThunk(listingId));
    }, [listingId, dispatch]);

    // Check if currentListing was still loading before getting the img urls
    if (!currentListing) {
        return <div>Loading...</div>;
    }

    // Button to back to the listing list
    const backToAllListingHandler = () => {
        navigate('/profile/listings');
    };

    const deleteCancelHandler = () => {
        setDeleteConfirmOpen(false);
    };

    const deleteConfirmHandler = async () => {
        setDeleteConfirmOpen(false);
        try {
            const result = await dispatch(deleteListingThunk(listingId)).unwrap();
            setStatusMessage('Listing deleted successfully');
            setTimeout(() => {
                navigate('/profile/listings');
            }, 3000); // Wait for 3 seconds then navigate
        } catch (error) {
            setStatusMessage('Failed to delete listing');
            setTimeout(() => {
                navigate('/profile/listings');
            }, 3000);
        }
    };

    return (
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

                <div className="mt-4 sm:ml-16 flex items-center space-x-4">
                    <button
                        type="button"
                        onClick={backToAllListingHandler}
                        className="sm:w-32 block rounded-md bg-dark-100 px-2 sm:px-3 py-2 text-center text-xs sm:text-sm font-semibold text-primary-100 shadow-sm hover:bg-yellow-500 hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dark-200">
                        Back
                    </button>
                    <button
                        onClick={onEdit}
                        className="sm:w-32 rounded-md bg-dark-100 px-2 sm:px-3 py-2 text-center text-xs sm:text-sm font-semibold text-primary-100 shadow-sm hover:bg-yellow-500 hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dark-200">
                        Edit
                    </button>
                </div>
            </div>
            <div className="mt-8 flow-root">
                {/* Image Display */}
                <ImageSlider currentListing={currentListing} />
                {/* Section 1: General Information */}
                <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
                    <div className="grid md:col-span-1">
                        <h2 className="text-base font-semibold leading-7 text-gray-900">
                            General Information
                        </h2>
                    </div>
                    <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-9 md:col-span-2 text-sm">
                        {/* Title */}
                        <div className="sm:col-span-3">
                            <label
                                htmlFor="title"
                                className="block font-semibold leading-6 text-gray-900">
                                Property Title
                            </label>
                            <div className="mt-2">
                                <p>{currentListing.title}</p>
                            </div>
                        </div>
                        {/* Listing Type */}
                        <div className="sm:col-span-3">
                            <label
                                htmlFor="building-type"
                                className="block text-sm font-semibold leading-6 text-gray-900">
                                Listing Type
                            </label>
                            <div className="mt-2">
                                <p>
                                    {formatListingTypeInternal(
                                        currentListing.listingType
                                    )}
                                </p>
                            </div>
                        </div>
                        {/* Building Type */}
                        <div className="sm:col-span-3">
                            <label
                                htmlFor="building-type"
                                className="block text-sm font-semibold leading-6 text-gray-900">
                                Building Type
                            </label>
                            <div className="mt-2">
                                <p>
                                    {formatPropertyTypeInternal(
                                        currentListing.propertyType
                                    )}
                                </p>
                            </div>
                        </div>
                        {/* Available date */}
                        <div className="sm:col-span-3">
                            <label
                                htmlFor="availableDate"
                                className="block text-sm font-semibold leading-6 text-gray-900">
                                Available Date
                            </label>
                            <div className="mt-2">
                                <div className="relative max-w-sm">
                                    <p>{formatDate(currentListing.availableDate)}</p>
                                </div>
                            </div>
                        </div>
                        {/* Price */}
                        <div className="sm:col-span-3">
                            <label
                                htmlFor="price"
                                className="block text-sm font-semibold leading-6 text-gray-900">
                                Price
                            </label>
                            <div className="mt-2">
                                <p>{formatPrice(currentListing.price)}</p>
                            </div>
                        </div>
                        {/* Description */}
                        <div className="col-span-full">
                            <label
                                htmlFor="description"
                                className="block text-sm font-semibold leading-6 text-gray-900">
                                Description
                            </label>
                            <div className="mt-2">
                                {currentListing.description
                                    ? currentListing.description
                                    : 'Not Provided'}{' '}
                            </div>
                        </div>
                    </div>
                </div>
                {/* Section 2: Location */}
                <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
                    <div className="grid md:col-span-1">
                        <h2 className="text-base font-semibold leading-7 text-gray-900">
                            Location
                        </h2>
                    </div>
                    <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-9 md:col-span-2 text-sm">
                        {/* City */}
                        <div className="sm:col-span-3">
                            <label
                                htmlFor="city"
                                className="block text-sm font-semibold leading-6 text-gray-900">
                                City
                            </label>
                            <div className="mt-2">
                                <p> {currentListing.location.city}</p>
                            </div>
                        </div>
                        {/* State*/}
                        <div className="sm:col-span-4">
                            <label
                                htmlFor="state"
                                className="block text-sm font-semibold leading-6 text-gray-900">
                                State
                            </label>
                            <div className="mt-2">
                                <p> {currentListing.location.state}</p>
                            </div>
                        </div>
                        {/* Address */}
                        <div className="sm:col-span-3">
                            <label
                                htmlFor="address"
                                className="block font-semibold leading-6 text-gray-900">
                                Street Address
                            </label>
                            <div className="mt-2">
                                <span>{currentListing.location.address} </span>
                            </div>
                        </div>
                        <div className="sm:col-span-3">
                            <label
                                htmlFor="aptOrSuite"
                                className="block font-semibold leading-6 text-gray-900">
                                Apt, Suite Number
                            </label>
                            <div className="mt-2">
                                {currentListing.location.aptOrSuite
                                    ? currentListing.location.aptOrSuite
                                    : 'Not Provided'}{' '}
                            </div>
                        </div>
                        {/* zip code */}
                        <div className="sm:col-span-3">
                            <label
                                htmlFor="zipCode"
                                className="block text-sm font-semibold leading-6 text-gray-900">
                                Zip Code
                            </label>
                            <div className="mt-2">
                                <div className="relative max-w-sm">
                                    <p> {currentListing.location.zipCode}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Section 3: Features */}
                <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
                    <div className="grid md:col-span-1">
                        <h2 className="text-base font-semibold leading-7 text-gray-900">
                            Features
                        </h2>
                    </div>
                    <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-9 md:col-span-2 text-sm">
                        {/* Bedrooms */}
                        <div className="sm:col-span-3">
                            <label
                                htmlFor="bedrooms"
                                className="block text-sm font-semibold leading-6 text-gray-900">
                                Bedrooms
                            </label>
                            <div className="mt-2">{currentListing.features.bedrooms}</div>
                        </div>
                        {/* State*/}
                        <div className="sm:col-span-4">
                            <label
                                htmlFor="bathrooms"
                                className="block text-sm font-semibold leading-6 text-gray-900">
                                Bathrooms
                            </label>
                            <div className="mt-2">
                                <p> {currentListing.features.bathrooms}</p>
                            </div>
                        </div>
                        {/*  Square Footage */}
                        <div className="sm:col-span-3">
                            <label
                                htmlFor="sqft"
                                className="block font-semibold leading-6 text-gray-900">
                                Square Footage
                            </label>
                            <div className="mt-2">
                                <span>{currentListing.features.sqft} </span>
                            </div>
                        </div>
                        {/* Specific Features */}
                        {currentListing.listingType === 'for-rent' ? (
                            <div className="sm:col-span-3">
                                <label
                                    htmlFor="petPolicy"
                                    className="block font-semibold leading-6 text-gray-900">
                                    Pets
                                </label>
                                <div className="mt-2">
                                    <span>
                                        {formatPetsString(currentListing.petPolicy)}{' '}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="sm:col-span-3">
                                <label
                                    htmlFor="homeAge"
                                    className="block font-medium leading-6 text-gray-900">
                                    Home Age{' '}
                                </label>
                                <div className="mt-2">
                                    <span>{currentListing.homeAge} </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                {/* Section 4: Agent Contact Info */}
                <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
                    <div className="grid md:col-span-1">
                        <h2 className="text-base font-semibold leading-7 text-gray-900">
                            Contact Information
                        </h2>
                    </div>
                    <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-9 md:col-span-2 text-sm">
                        {/* Agent Company */}
                        <div className="sm:col-span-3">
                            <label
                                htmlFor="agentCompany"
                                className="block text-sm font-semibold leading-6 text-gray-900">
                                Agent Company
                            </label>
                            <div className="mt-2">
                                <p> {currentListing.contactInfo.agentCompany}</p>
                            </div>
                        </div>
                        {/* Agent Name */}
                        <div className="sm:col-span-3">
                            <label
                                htmlFor="agentName"
                                className="block text-sm font-semibold leading-6 text-gray-900">
                                Agent Name
                            </label>
                            <div className="mt-2">
                                <p> {currentListing.contactInfo.agentName}</p>
                            </div>
                        </div>
                        {/* Agent Phone */}
                        <div className="sm:col-span-3">
                            <label
                                htmlFor="agentPhone"
                                className="block text-sm font-semibold leading-6 text-gray-900">
                                Phone Number
                            </label>
                            <div className="mt-2">
                                {currentListing.contactInfo.agentPhone
                                    ? currentListing.contactInfo.agentPhone
                                    : 'Not Provided'}{' '}
                            </div>
                        </div>
                        {/* Agent Email */}
                        <div className="sm:col-span-3">
                            <label
                                htmlFor="agentEmail"
                                className="block text-sm font-semibold leading-6 text-gray-900">
                                Email
                            </label>
                            <div className="mt-2">
                                <p> {currentListing.contactInfo.email}</p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Section 5: Creation Information */}
                <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
                    <div className="grid md:col-span-1">
                        <h2 className="text-base font-semibold leading-7 text-gray-900">
                            Others
                        </h2>
                    </div>
                    <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-9 md:col-span-2 text-sm">
                        {/* Created At */}
                        <div className="sm:col-span-3">
                            <label
                                htmlFor="createdAt"
                                className="block text-sm font-semibold leading-6 text-gray-900">
                                Creation Date
                            </label>
                            <div className="mt-2">
                                {formatDate(currentListing.createdAt)}
                            </div>
                        </div>
                        <div className="sm:col-span-3">
                            <label
                                htmlFor="createdAt"
                                className="block text-sm font-semibold leading-6 text-gray-900">
                                Last Update
                            </label>
                            <div className="mt-2">
                                {formatDate(currentListing.updatedAt)}
                            </div>
                        </div>
                    </div>
                </div>
                {/* Bottom Buttons */}
                <div className="flex justify-center items-center ">
                    <button
                        type="button"
                        onClick={() => setDeleteConfirmOpen(true)}
                        className="my-12 w-40 rounded-md bg-dark-100 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
                        Delete Listing
                    </button>
                    {statusMessage && (
                        <div className="block mt-6 text-center font-semibold">
                            {statusMessage}
                        </div>
                    )}
                </div>
                <ConfirmDialog
                    open={deleteConfirmOpen}
                    onClose={deleteCancelHandler}
                    onConfirm={deleteConfirmHandler}
                />
            </div>
        </div>
    );
}

ShowListing.propTypes = {
    listingId: PropTypes.string.isRequired,
    onEdit: PropTypes.func.isRequired,
};
