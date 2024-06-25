import React, { useEffect, useRef, useState } from 'react';
import { PhotoIcon } from '@heroicons/react/24/solid';
import Datepicker from 'tailwind-datepicker-react';
import { createListingThunk } from '../../../services/internal-listing/internal-listing-thunk.js';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useFormData from './useFormData.jsx';
import useImageHandler from './useImageHandler.jsx';
import LeaseForm from './LeaseForm.jsx';
import SaleForm from './SaleForm.jsx';
import DropDownSingle from '../../../components/DropDownSingle.jsx';
import SpecialFormComponent from './SpecialFormComponent.jsx';

export default function CreateNewListingPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const categoryOptions = [
        { label: 'Lease', value: 'for-rent' },
        { label: 'Sale', value: 'for-sale' },
    ];

    const propertyTypeOptions = [
        { label: 'Apartment', value: 'apartment' },
        { label: 'Single-family Home', value: 'single-family-home' },
        { label: 'Multi-family Home', value: 'multi-family-home' },
        { label: 'Condo', value: 'condo' },
        { label: 'Townhouse', value: 'townhouse' },
        { label: 'Other', value: 'other' },
    ];

    const categoryChangeHandler = (value) => {
        formChangeHandler({ target: { name: 'listingType', value } });
    };

    const propertyTypeChangeHandler = (value) => {
        formChangeHandler({ target: { name: 'propertyType', value } });
    };

    // Image Handling
    const imageFileRef = useRef(null);
    const {
        imagePreviews,
        fileCountError,
        fileChangeHandler,
        handleImageFileUpload,
        removeImageHandler,
    } = useImageHandler();

    // Form Data Handling
    const { formData, formErrors, setFormErrors, formChangeHandler, validateForm } =
        useFormData();

    // Data Picker
    const datePickerRef = useRef(null);

    useEffect(() => {
        if (datePickerRef.current) {
            new Datepicker(datePickerRef.current, {
                autoHide: true,
            });
        }
    }, []);

    const cancelHandler = () => {
        navigate('/profile/listings');
    };

    const submitHandler = (e) => {
        e.preventDefault();
        console.log('in submit handler:' + formData.petPolicy);

        // Check if any of the required fields are empty
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return; // Stop the submission if there are errors
        }

        // Clear previous errors if all required fields are filled
        setFormErrors({});

        // Convert availableDate from string to Date object
        const formattedDate = new Date(formData.availableDate);

        // Extract URLs from imagePreviews if the upload was successful
        const imageUrls = imagePreviews
            .filter((preview) => preview.status === 'success')
            .map((preview) => preview.url);

        const listingData = {
            ...formData,
            price: formData.price,
            listingType: formData.listingType,
            availableDate: formattedDate,
            petPolicy: formData.petPolicy,
            location: {
                address: formData.address,
                aptOrSuite: formData.aptOrSuite,
                city: formData.city,
                state: formData.state,
                zipCode: formData.zipCode,
            },
            features: {
                bedrooms: formData.bedrooms,
                bathrooms: formData.bathrooms,
                sqft: formData.sqft,
            },
            contactInfo: {
                agentCompany: formData.agentCompany,
                agentName: formData.agentName,
                agentPhone: formData.agentPhone,
                email: formData.email,
            },
            media: {
                imageUrls: imageUrls,
                refUrl: formData.refUrl,
            },
        };
        // dispatch(createListingThunk({ listingData }));
        dispatch(createListingThunk({ listingData }))
            .then(() => navigate('/profile/listings'))
            .catch((error) => {
                console.error('Error during listing creation:', error);
            });
    };

    return (
        <form
            onSubmit={submitHandler}
            className="max-w-9xl  gap-x-8 gap-y-10 px-4 pt-16 pb-10 sm:px-6 lg:px-8">
            <div className="space-y-12">
                <div className="grid grid-cols-1 gap-x-8 gap-y-2 border-b border-gray-900/10 pb-8 md:grid-cols-1 font-bold">
                    <h2 className="text-lg font-semibold leading-7 text-gray-900">
                        Create New Listings
                    </h2>
                </div>
                {/* listing type: first choice*/}
                <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
                    <div>
                        <h2 className="text-base font-semibold leading-7 text-gray-900">
                            Listing Type
                        </h2>
                        <p className="mt-1 text-sm leading-6 text-gray-600">
                            Please provide the listing type.
                        </p>
                    </div>
                    <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
                        <div className="sm:col-span-3">
                            <label
                                htmlFor="listingType"
                                className="block text-sm font-medium leading-6 text-gray-900">
                                Listing Type
                                <span className="text-gray-900">*</span>
                            </label>
                            <DropDownSingle
                                label="listingType"
                                initialValue="for-rent"
                                options={categoryOptions}
                                onSelectionChange={categoryChangeHandler}
                                labelClassName="text-sm"
                            />
                        </div>
                    </div>
                </div>
                {/* General Information*/}
                <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
                    <div>
                        <h2 className="text-base font-semibold leading-7 text-gray-900">
                            General Information
                        </h2>
                        <p className="mt-1 text-sm leading-6 text-gray-600">
                            Please provide the general information about the new listing.
                        </p>
                    </div>
                    <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
                        {/* title */}
                        <div className="sm:col-span-4">
                            <label
                                htmlFor="title"
                                className="block text-sm font-medium leading-6 text-gray-900">
                                Property Title
                                <span className="text-gray-900">*</span>
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
                                        placeholder="Realty Savvy Apartment"
                                        value={formData.title}
                                        onChange={formChangeHandler}
                                    />
                                </div>
                                <p>
                                    {formErrors.title && (
                                        <p className="text-red-500 text-xs mt-1 ml-1">
                                            {formErrors.title}
                                        </p>
                                    )}
                                </p>
                            </div>
                        </div>
                        {/* description */}
                        <div className="col-span-full">
                            <label
                                htmlFor="description"
                                className="block text-sm font-medium leading-6 text-gray-900">
                                Description
                            </label>
                            <div className="mt-2">
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
                        {/* Building Type */}
                        <div className="sm:col-span-3">
                            <label
                                htmlFor="building-type"
                                className="block text-sm font-medium leading-6 text-gray-900">
                                Building Type
                                <span className="text-gray-900">*</span>
                            </label>
                            <div className="mt-2">
                                <DropDownSingle
                                    label="Property Type"
                                    initialValue="apartment"
                                    options={propertyTypeOptions}
                                    onSelectionChange={propertyTypeChangeHandler}
                                    labelClassName="text-sm"
                                />
                            </div>
                        </div>
                        {/* Available date */}
                        <div className="sm:col-span-3">
                            <label
                                htmlFor="availableDate"
                                className="block text-sm font-medium leading-6 text-gray-900">
                                Available Date
                                <span className="text-gray-900">*</span>
                            </label>
                            <div className="mt-2">
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
                        {/* Price */}
                        <div className="sm:col-span-3">
                            <label
                                htmlFor="price"
                                className="block text-sm font-medium leading-6 text-gray-900">
                                Price
                                <span className="text-gray-900">*</span>
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
                        {/* Photos */}
                        <div className="col-span-full">
                            <label
                                htmlFor="property-photos"
                                className="block text-sm font-medium leading-6 text-gray-900">
                                Photos
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                {/* COLUMN LEFT: Allow user to upload photos */}
                                <div className="flex justify-center rounded-lg border border-dashed border-gray-700 px-6 py-10">
                                    <div className="text-center">
                                        <PhotoIcon
                                            className="mx-auto h-12 w-12 text-gray-300"
                                            aria-hidden="true"
                                        />
                                        <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                            <label
                                                htmlFor="file-upload"
                                                className="relative cursor-pointer rounded-md bg-white font-semibold text-primary-200 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                                                <span>Upload Image Files</span>
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
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs leading-5 text-gray-600">
                                            PNG, JPG, JPEG up to 3MB
                                        </p>
                                    </div>
                                </div>
                                {/* COLUMN RIGHT: Allow user to preview photos and manage their upload */}
                                <div className="flex flex-col gap-2 overflow-y-auto max-h-60">
                                    {imagePreviews.length > 0 ? (
                                        imagePreviews.map((preview, index) => (
                                            <div key={index} className="relative">
                                                {preview.url &&
                                                preview.status !== 'error' ? (
                                                    <img
                                                        src={preview.url}
                                                        alt="Preview"
                                                        className="h-10 w-10 rounded-lg bg-gray-800 object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full rounded-lg bg-red-500 flex items-center justify-center text-white text-sm">
                                                        {preview.message}
                                                    </div>
                                                )}
                                                {preview.status !== 'error' && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeImageHandler(index)
                                                        }
                                                        className="absolute top-0 right-0 bg-red-600 text-white p-1 rounded-full"
                                                        aria-label="Delete image">
                                                        &times;
                                                    </button>
                                                )}
                                                {/* display progress bars */}
                                                {preview.progress > 0 &&
                                                    preview.status === 'uploading' && (
                                                        <div
                                                            style={{
                                                                width: `${preview.progress}%`,
                                                            }}
                                                            className="bg-blue-500 h-1"></div>
                                                    )}
                                            </div>
                                        ))
                                    ) : (
                                        <div>No images chosen</div>
                                    )}
                                    {fileCountError && (
                                        <span className="text-red-500">
                                            {fileCountError}
                                        </span>
                                    )}
                                    {imagePreviews.some(
                                        (p) => p.status === 'pending'
                                    ) && (
                                        <button
                                            className="bg-dark-200 text-yellow-400 rounded-lg py-1 mt-2 mb-4"
                                            onClick={() =>
                                                handleImageFileUpload(
                                                    imagePreviews.filter(
                                                        (p) =>
                                                            p.status === 'pending' &&
                                                            p.file
                                                    )
                                                )
                                            }>
                                            Upload
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Location */}
                <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
                    <div>
                        <h2 className="text-base font-semibold leading-7 text-gray-900">
                            Location
                        </h2>
                        <p className="mt-1 text-sm leading-6 text-gray-600">
                            Please provide the location of the property
                        </p>
                    </div>

                    <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
                        {/* City */}
                        <div className="sm:col-span-2 sm:col-start-1">
                            <label
                                htmlFor="city"
                                className="block text-sm font-medium leading-6 text-gray-900">
                                City
                                <span className="text-gray-900">*</span>
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="city"
                                    id="city"
                                    value={formData.city}
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
                        {/* State */}
                        <div className="sm:col-span-2">
                            <label
                                htmlFor="state"
                                className="block text-sm font-medium leading-6 text-gray-900">
                                State
                                <span className="text-gray-900">*</span>
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="state"
                                    id="state"
                                    value={formData.state}
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
                        {/* zipcode */}
                        <div className="sm:col-span-2">
                            <label
                                htmlFor="zipCode"
                                className="block text-sm font-medium leading-6 text-gray-900">
                                Zip Code
                                <span className="text-gray-900">*</span>
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="zipCode"
                                    id="zipCode"
                                    value={formData.zipCode}
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
                        {/* address */}
                        <div className="col-span-full">
                            <label
                                htmlFor="address"
                                className="block text-sm font-medium leading-6 text-gray-900">
                                Street Address
                                <span className="text-gray-900">*</span>
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="address"
                                    id="address"
                                    value={formData.address}
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
                        {/* apt or suite */}
                        <div className="col-span-full">
                            <label
                                htmlFor="aptOrSuite"
                                className="block text-sm font-medium leading-6 text-gray-900">
                                Apt, Suite Number (Optional)
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="aptOrSuite"
                                    id="aptOrSuite"
                                    value={formData.aptOrSuite}
                                    onChange={formChangeHandler}
                                    autoComplete="address-line2"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-200 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                {/* Features */}
                <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
                    <div>
                        <h2 className="text-base font-semibold leading-7 text-gray-900">
                            Features
                        </h2>
                        <p className="mt-1 text-sm leading-6 text-gray-600">
                            Please provide the features of the properties
                        </p>
                    </div>
                    <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
                        {/* bedrooms */}
                        <div className="sm:col-span-3">
                            <label
                                htmlFor="bedrooms"
                                className="block text-sm font-medium leading-6 text-gray-900">
                                Bedrooms
                            </label>
                            <div className="mt-2">
                                <input
                                    type="number"
                                    name="bedrooms"
                                    id="bedrooms"
                                    value={formData.bedrooms}
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
                            </p>
                        </div>
                        {/* bathrooms */}
                        <div className="sm:col-span-3">
                            <label
                                htmlFor="bathrooms"
                                className="block text-sm font-medium leading-6 text-gray-900">
                                Bathrooms
                            </label>
                            <div className="mt-2">
                                <input
                                    type="number"
                                    name="bathrooms"
                                    id="bathrooms"
                                    value={formData.bathrooms}
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
                        {/* Square Footage */}
                        <div className="sm:col-span-3">
                            <label
                                htmlFor="sqft"
                                className="block text-sm font-medium leading-6 text-gray-900">
                                Square Footage
                            </label>
                            <div className="mt-2">
                                <input
                                    type="number"
                                    name="sqft"
                                    id="sqft"
                                    value={formData.sqft}
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
                        <div className="sm:col-span-2">
                            <SpecialFormComponent
                                formData={formData}
                                formChangeHandler={formChangeHandler}
                            />
                        </div>
                    </div>
                </div>
                {/* Contact Info */}
                <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
                    <div>
                        <h2 className="text-base font-semibold leading-7 text-gray-900">
                            Contact Information
                        </h2>
                        <p className="mt-1 text-sm leading-6 text-gray-600">
                            Use a permanent address where you can receive mail.
                        </p>
                    </div>
                    <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
                        {/* agent name */}
                        <div className="sm:col-span-4">
                            <label
                                htmlFor="agentName"
                                className="block text-sm font-medium leading-6 text-gray-900">
                                Contact Name
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="agentName"
                                    id="agentName"
                                    value={formData.agentName}
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
                        {/* agency name */}
                        <div className="sm:col-span-4">
                            <label
                                htmlFor="agentCompany"
                                className="block text-sm font-medium leading-6 ">
                                Agency
                            </label>
                            <div className="relative mt-2 rounded-md shadow-sm">
                                <input
                                    type="text"
                                    name="agentCompany"
                                    id="agentCompany"
                                    value={formData.agentCompany}
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
                        {/* phone number */}
                        <div className="col-span-4">
                            <label
                                htmlFor="agentPhone"
                                className="block text-sm font-medium leading-6 ">
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
                                    value={formData.agentPhone}
                                    onChange={formChangeHandler}
                                    className="block w-full rounded-md border-0 py-1.5 pl-24 text-gray-900 ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-200 sm:text-sm sm:leading-6"
                                    // onChange={generalInfoChangeHandler}
                                />
                            </div>
                        </div>
                        {/* email */}
                        <div className="sm:col-span-4">
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium leading-6 text-gray-900">
                                Email address
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
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

            <div className="mt-6 flex items-center justify-end gap-x-6">
                <button
                    type="button"
                    onClick={cancelHandler}
                    className="text-sm font-semibold leading-6 text-gray-900">
                    Cancel
                </button>
                <button
                    type="submit"
                    className="rounded-md bg-dark-100 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-dark-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
                    Save
                </button>
            </div>
        </form>
    );
}
