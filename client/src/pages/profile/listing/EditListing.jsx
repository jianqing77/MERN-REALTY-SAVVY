import PropTypes from 'prop-types';
import useFormData from './useFormData';
import { useDispatch, useSelector } from 'react-redux';
import { findListingByIdThunk } from '../../../services/internal-listing/internal-listing-thunk';
import { useEffect, useRef, useState } from 'react';
import DropDownSingle from '../../../components/DropDownSingle';
import Datepicker from 'tailwind-datepicker-react';
import SpecialFormComponent from './SpecialFormComponent';
import useImageHandler from './useImageHandler';
import ImageSlider from '../../../components/ImageSlider';
import { PhotoIcon, XCircleIcon } from '@heroicons/react/24/solid';

export default function EditListing({ listingId, onSave, onCancel }) {
    const dispatch = useDispatch();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const currentListing = useSelector(
        (state) => state['internal-listings'].currentListing
    );

    // Form Data Handling -- Always call hooks at the top level
    const {
        formData,
        setFormData,
        formErrors,
        setFormErrors,
        formChangeHandler,
        validateForm,
    } = useFormData(currentListing);

    // Image Handling
    const imageUrls = currentListing ? currentListing.media.imageUrls : [];

    const imageFileRef = useRef(null);
    const {
        images,
        fileCountError,
        fileChangeHandler,
        handleImageFileUpload,
        removeImageHandler,
    } = useImageHandler(imageUrls);

    // Date Picker
    const datePickerRef = useRef(null);

    useEffect(() => {
        if (datePickerRef.current) {
            new Datepicker(datePickerRef.current, {
                autoHide: true,
            });
        }
    }, []);

    useEffect(() => {
        dispatch(findListingByIdThunk(listingId));
    }, [listingId, dispatch]);

    // check if currentListing was still loading before getting the img urls
    if (!currentListing) {
        return <div>Loading...</div>;
    }

    const saveBtnHandler = () => {
        const updatedImgUrls = images
            .filter((preview) => preview.status === 'success')
            .map((preview) => preview.url);
        const updatedFormData = {
            ...formData,
            media: {
                ...formData.media,
                imageUrls: updatedImgUrls,
            },
        };
        setFormData(updatedFormData);
        onSave(updatedFormData);
    };

    const propertyTypeChangeHandler = (value) => {
        formChangeHandler({ target: { name: 'propertyType', value } });
    };
    const propertyTypeOptions = [
        { label: 'Single-family Home', value: 'single-family-home' },
        { label: 'Multi-family Home', value: 'multi-family-home' },
        { label: 'Condo', value: 'condo' },
        { label: 'Townhouse', value: 'townhouse' },
        { label: 'Apartment', value: 'apartment' },
        { label: 'Other', value: 'other' },
    ];

    return (
        <div className="max-w-9xl gap-x-8 gap-y-10 px-4 pt-16 pb-10 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center">
                <div className="flex-auto">
                    <h1 className="text-base font-semibold leading-6 text-gray-900">
                        Editing
                    </h1>
                    <p className="mt-2 hidden text-sm text-gray-400 sm:block">
                        Please note the listing type is not changeable.
                    </p>
                </div>
            </div>

            <div className="mt-8 flow-root">
                {/* Image Modification */}
                <div className="relative w-full">
                    <div className="md:h-72 grid grid-cols-3">
                        <div className="col-span-1">
                            <h2 className="text-base font-semibold leading-7 text-gray-900">
                                Current Listing Images
                            </h2>
                        </div>
                        <div className="flex flex-col items-left justify-start gap-y-4 col-span-2 ms-2">
                            <div className="flex overflow-x-auto py-2 max-w-md min-w-full">
                                {images.length > 0 ? (
                                    images.map((preview, index) => (
                                        <div
                                            key={index}
                                            className="relative mr-4 flex-shrink-0">
                                            <img
                                                src={preview.url}
                                                className="block w-20 h-20 object-cover rounded-lg"
                                                alt={`Image ${index + 1}`}
                                            />
                                            {preview.status !== 'error' && (
                                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full cursor-pointer transition duration-150 ease-in-out transform hover:scale-110 flex justify-center items-center">
                                                    <XCircleIcon
                                                        className="w-12 h-12 text-red-500 hover:text-red-600"
                                                        onClick={() =>
                                                            removeImageHandler(index)
                                                        }
                                                        aria-label="Delete image"
                                                    />
                                                </div>
                                            )}
                                            {preview.progress > 0 &&
                                                preview.status === 'uploading' && (
                                                    <div
                                                        style={{
                                                            width: `${preview.progress}%`,
                                                        }}
                                                        className="bg-primary-200 h-1"></div>
                                                )}
                                        </div>
                                    ))
                                ) : (
                                    <div>No images chosen</div>
                                )}
                                {fileCountError && (
                                    <span className="text-red-500">{fileCountError}</span>
                                )}
                            </div>
                            {/* section below: upload new images */}
                            <div className="flex justify-center rounded-lg border border-dashed border-gray-700 px-6 py-4">
                                <div className="text-center w-full">
                                    <PhotoIcon
                                        className="mx-auto h-6 w-6 text-gray-300"
                                        aria-hidden="true"
                                    />
                                    <div className="mt-3 flex justify-center items-center text-sm leading-6 text-gray-600">
                                        <label
                                            htmlFor="file-upload"
                                            className="relative cursor-pointer rounded-md bg-white font-semibold text-primary-200 focus-within:outline-none  hover:text-indigo-500 inline-block w-full text-center">
                                            <span>Add Image Files</span>
                                            <input
                                                id="file-upload"
                                                ref={imageFileRef}
                                                type="file"
                                                className="sr-only"
                                                accept="image/*"
                                                multiple
                                                onChange={fileChangeHandler}
                                            />
                                        </label>
                                    </div>
                                    <p className="text-xs leading-5 text-gray-600">
                                        PNG, JPG, JPEG up to 3MB
                                    </p>
                                </div>
                            </div>
                            {images.some((p) => p.status === 'pending') && (
                                <button
                                    className="bg-dark-200 text-yellow-400 rounded-lg py-1 mt-2 mb-4"
                                    onClick={handleImageFileUpload}>
                                    Save
                                </button>
                            )}
                        </div>
                    </div>
                </div>
                {/* Section 1: General Information */}
                <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
                    <div className="grid md:col-span-1">
                        <h2 className="text-base font-semibold leading-7 text-gray-900">
                            General Information
                        </h2>
                    </div>
                    <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-9 md:col-span-2 text-sm">
                        {/* Title */}
                        <div className="sm:col-span-4">
                            <label
                                htmlFor="title"
                                className="block font-semibold leading-6 text-gray-900">
                                Property Title
                            </label>
                            <div className="mt-2">
                                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                    <input
                                        type="text"
                                        name="title"
                                        id="title"
                                        className={`block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-200 sm:text-sm sm:leading-6 ${
                                            formErrors.title ? 'ring-2 ring-red-500' : ''
                                        }`}
                                        value={formData.title}
                                        onChange={formChangeHandler}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="sm:col-span-2"></div>
                        {/* Listing Type */}
                        <div className="sm:col-span-3">
                            <label
                                htmlFor="building-type"
                                className="block text-sm font-semibold leading-6 text-gray-900">
                                Listing Type
                            </label>
                            <div className="mt-2">
                                <p>{currentListing.listingType}</p>
                            </div>
                        </div>
                        {/* Building Type */}
                        <div className="sm:col-span-5">
                            <label
                                htmlFor="building-type"
                                className="block text-sm font-semibold leading-6 text-gray-900">
                                Building Type
                            </label>
                            <div className="mt-2">
                                <DropDownSingle
                                    label="Property Type"
                                    initialValue={currentListing.propertyType}
                                    options={propertyTypeOptions}
                                    onSelectionChange={propertyTypeChangeHandler}
                                    labelClassName="text-sm"
                                />
                            </div>
                        </div>
                        {/* Available date */}
                        <div className="sm:col-span-5">
                            <label
                                htmlFor="availableDate"
                                className="block text-sm font-semibold leading-6 text-gray-900">
                                Available Date
                            </label>
                            <div className="mt-2">
                                <div className="relative max-w-sm">
                                    {/* <p>{formatDate(currentListing.availableDate)}</p> */}
                                    <div className="relative max-w-sm">
                                        <input
                                            ref={datePickerRef}
                                            type="date"
                                            id="availableDate"
                                            name="availableDate"
                                            value={formData.availableDate}
                                            onChange={formChangeHandler}
                                            className="p-2.5 block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-200 sm:text-sm sm:leading-6"
                                            placeholder="Select date"
                                        />
                                    </div>
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
                                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                    <input
                                        type="number"
                                        name="price"
                                        id="price"
                                        value={formData.price}
                                        onChange={formChangeHandler}
                                        className={`block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-200 sm:text-sm sm:leading-6 ${
                                            formErrors.price ? 'ring-2 ring-red-500' : ''
                                        }`}
                                    />
                                </div>
                                <p>
                                    {formErrors.price && (
                                        <p className="text-red-500 text-xs mt-1 ml-1">
                                            {formErrors.price}
                                        </p>
                                    )}
                                </p>
                            </div>
                        </div>
                        {/* Description */}
                        <div className="col-span-full">
                            <label
                                htmlFor="description"
                                className="block text-sm font-semibold leading-6 text-gray-900">
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                rows={3}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-200 sm:text-sm sm:leading-6"
                                placeholder="Write a few sentences to describe the new listing..."
                                value={formData.description}
                                onChange={formChangeHandler}
                            />
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
                                <input
                                    type="text"
                                    name="city"
                                    id="city"
                                    value={formData.location.city}
                                    onChange={formChangeHandler}
                                    autoComplete="address-level2"
                                    className={`block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-200 sm:text-sm sm:leading-6 ${
                                        formErrors.city ? 'ring-2 ring-red-500' : ''
                                    }`}
                                />
                            </div>
                            <p>
                                {formErrors.city && (
                                    <p className="text-red-500 text-xs mt-1 ml-1">
                                        {formErrors.city}
                                    </p>
                                )}
                            </p>
                        </div>
                        {/* State*/}
                        <div className="sm:col-span-3">
                            <label
                                htmlFor="state"
                                className="block text-sm font-semibold leading-6 text-gray-900">
                                State
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="state"
                                    id="state"
                                    value={formData.location.state}
                                    onChange={formChangeHandler}
                                    autoComplete="address-level1"
                                    className={`block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-200 sm:text-sm sm:leading-6 ${
                                        formErrors.state ? 'ring-2 ring-red-500' : ''
                                    }`}
                                />
                            </div>
                            <p>
                                {formErrors.state && (
                                    <p className="text-red-500 text-xs mt-1 ml-1">
                                        {formErrors.state}
                                    </p>
                                )}
                            </p>
                        </div>
                        {/* zip code */}
                        <div className="sm:col-span-3">
                            <label
                                htmlFor="zipCode"
                                className="block text-sm font-semibold leading-6 text-gray-900">
                                Zip Code
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="zipCode"
                                    id="zipCode"
                                    value={formData.location.zipCode}
                                    onChange={formChangeHandler}
                                    autoComplete="postal-code"
                                    className={`block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-200 sm:text-sm sm:leading-6 ${
                                        formErrors.zipCode ? 'ring-2 ring-red-500' : ''
                                    }`}
                                />
                            </div>
                            <p>
                                {formErrors.zipCode && (
                                    <p className="text-red-500 text-xs mt-1 ml-1">
                                        {formErrors.zipCode}
                                    </p>
                                )}
                            </p>
                        </div>
                        {/* Address */}
                        <div className="sm:col-span-5">
                            <label
                                htmlFor="address"
                                className="block font-semibold leading-6 text-gray-900">
                                Street Address
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="address"
                                    id="address"
                                    value={formData.location.address}
                                    onChange={formChangeHandler}
                                    autoComplete="address-line1"
                                    className={`block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-200 sm:text-sm sm:leading-6 ${
                                        formErrors.address ? 'ring-2 ring-red-500' : ''
                                    }`}
                                />
                            </div>
                            <p>
                                {formErrors.address && (
                                    <p className="text-red-500 text-xs mt-1 ml-1">
                                        {formErrors.address}
                                    </p>
                                )}
                            </p>
                        </div>
                        {/* Apt or suite number */}
                        <div className="sm:col-span-5">
                            <label
                                htmlFor="aptOrSuite"
                                className="block font-semibold leading-6 text-gray-900">
                                Apt, Suite Number
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="aptOrSuite"
                                    id="aptOrSuite"
                                    value={formData.location.aptOrSuite}
                                    onChange={formChangeHandler}
                                    autoComplete="address-line2"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-200 sm:text-sm sm:leading-6"
                                />
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
                        <div className="sm:col-span-4">
                            <label
                                htmlFor="bedrooms"
                                className="block text-sm font-semibold leading-6 text-gray-900">
                                Bedrooms
                            </label>
                            <div className="mt-2">
                                <input
                                    type="number"
                                    name="bedrooms"
                                    id="bedrooms"
                                    value={formData.features.bedrooms}
                                    onChange={formChangeHandler}
                                    className={`block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-200 sm:text-sm sm:leading-6 ${
                                        formErrors.bedrooms ? 'ring-2 ring-red-500' : ''
                                    }`}
                                />
                            </div>
                            <p>
                                {formErrors.bedrooms && (
                                    <p className="text-red-500 text-xs mt-1 ml-1">
                                        {formErrors.bedrooms}
                                    </p>
                                )}
                            </p>{' '}
                        </div>
                        {/* Bathrooms*/}
                        <div className="sm:col-span-4">
                            <label
                                htmlFor="bathrooms"
                                className="block text-sm font-semibold leading-6 text-gray-900">
                                Bathrooms
                            </label>
                            <div className="mt-2">
                                <input
                                    type="number"
                                    name="bathrooms"
                                    id="bathrooms"
                                    value={formData.features.bathrooms}
                                    onChange={formChangeHandler}
                                    className={`block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-200 sm:text-sm sm:leading-6 ${
                                        formErrors.bathrooms ? 'ring-2 ring-red-500' : ''
                                    }`}
                                />
                            </div>
                            <p>
                                {formErrors.bathrooms && (
                                    <p className="text-red-500 text-xs mt-1 ml-1">
                                        {formErrors.bathrooms}
                                    </p>
                                )}
                            </p>
                        </div>
                        {/*  Square Footage */}
                        <div className="sm:col-span-4">
                            <label
                                htmlFor="sqft"
                                className="block font-semibold leading-6 text-gray-900">
                                Square Footage
                            </label>
                            <div className="mt-2">
                                <input
                                    type="number"
                                    name="sqft"
                                    id="sqft"
                                    value={formData.features.sqft}
                                    onChange={formChangeHandler}
                                    className={`block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-200 sm:text-sm sm:leading-6 ${
                                        formErrors.sqft ? 'ring-2 ring-red-500' : ''
                                    }`}
                                />
                            </div>
                            <p>
                                {formErrors.sqft && (
                                    <p className="text-red-500 text-xs mt-1 ml-1">
                                        {formErrors.sqft}
                                    </p>
                                )}
                            </p>
                        </div>
                        {/* Specific Features */}
                        <div className="col-span-3">
                            <SpecialFormComponent
                                formData={formData}
                                formChangeHandler={formChangeHandler}
                            />
                        </div>
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
                        <div className="sm:col-span-5">
                            <label
                                htmlFor="agentCompany"
                                className="block text-sm font-semibold leading-6 text-gray-900">
                                Agent Company
                            </label>
                            <div className="relative mt-2 rounded-md shadow-sm">
                                <input
                                    type="text"
                                    name="agentCompany"
                                    id="agentCompany"
                                    value={formData.contactInfo.agentCompany}
                                    onChange={formChangeHandler}
                                    className={`block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-200 sm:text-sm sm:leading-6 ${
                                        formErrors.agentCompany
                                            ? 'ring-2 ring-red-500'
                                            : ''
                                    }`}
                                />
                            </div>
                            <p>
                                {formErrors.agentCompany && (
                                    <p className="text-red-500 text-xs mt-1 ml-1">
                                        {formErrors.agentCompany}
                                    </p>
                                )}
                            </p>
                        </div>
                        {/* Agent Name */}
                        <div className="sm:col-span-5">
                            <label
                                htmlFor="agentName"
                                className="block text-sm font-semibold leading-6 text-gray-900">
                                Agent Name
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="agentName"
                                    id="agentName"
                                    value={formData.contactInfo.agentName}
                                    onChange={formChangeHandler}
                                    className={`block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-200 sm:text-sm sm:leading-6 ${
                                        formErrors.agentName ? 'ring-2 ring-red-500' : ''
                                    }`}
                                />
                            </div>
                            <p>
                                {formErrors.agentName && (
                                    <p className="text-red-500 text-xs mt-1 ml-1">
                                        {formErrors.agentName}
                                    </p>
                                )}
                            </p>
                        </div>
                        {/* Agent Phone */}
                        <div className="sm:col-span-5">
                            <label
                                htmlFor="agentPhone"
                                className="block text-sm font-semibold leading-6 text-gray-900">
                                Phone Number
                            </label>
                            <div className="relative mt-2 rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 flex items-center">
                                    <label htmlFor="country" className="sr-only">
                                        Country
                                    </label>
                                    <select
                                        id="country"
                                        name="country"
                                        autoComplete="country"
                                        className="h-full rounded-md border-0 bg-transparent py-0 pl-3 pr-7 text-gray-900 focus:ring-2 focus:ring-inset focus:ring-primary-200 sm:text-sm">
                                        <option>US +1</option>
                                    </select>
                                </div>
                                <input
                                    type="text"
                                    name="agentPhone"
                                    id="agentPhone"
                                    value={formData.contactInfo.agentPhone}
                                    onChange={formChangeHandler}
                                    className="block w-full rounded-md border-0 py-1.5 pl-24 text-gray-900 ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-200 sm:text-sm sm:leading-6"
                                    // onChange={generalInfoChangeHandler}
                                />
                            </div>
                        </div>
                        {/* Agent Email */}
                        <div className="sm:col-span-5">
                            <label
                                htmlFor="agentEmail"
                                className="block text-sm font-semibold leading-6 text-gray-900">
                                Email
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.contactInfo.email}
                                    onChange={formChangeHandler}
                                    autoComplete="email"
                                    className={`block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-200 sm:text-sm sm:leading-6 ${
                                        formErrors.email ? 'ring-2 ring-red-500' : ''
                                    }`}
                                />
                            </div>
                            <p>
                                {formErrors.email && (
                                    <p className="text-red-500 text-xs mt-1 ml-1">
                                        {formErrors.email}
                                    </p>
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            {/* Bottom Buttons */}
            <div className="mt-6 flex items-center justify-end gap-x-6">
                <button
                    type="button"
                    onClick={onCancel}
                    className="text-sm font-semibold leading-6 text-gray-900">
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={saveBtnHandler}
                    className="rounded-md bg-dark-100 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-dark-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
                    Save
                </button>
            </div>
        </div>
    );
}

EditListing.propTypes = {
    listingId: PropTypes.string.isRequired,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};
