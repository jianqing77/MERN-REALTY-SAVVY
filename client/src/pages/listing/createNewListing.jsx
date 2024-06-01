import React, { useEffect, useRef, useState } from 'react';
import { CalendarIcon, PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import Datepicker from 'tailwind-datepicker-react';
import { createListingThunk } from '../../services/internal-listing/internal-listing-thunk';
import { useDispatch } from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import FirebaseApp from '../../config/firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CreateNewListing() {
    const datePickerRef = useRef(null);

    useEffect(() => {
        if (datePickerRef.current) {
            new Datepicker(datePickerRef.current, {
                autoHide: true,
            });
        }
    }, []);

    // image handling
    const imageFileRef = useRef(null);
    const [imgFiles, setImgFiles] = useState([]); // To handle multiple files
    const [imagePreviews, setImagePreviews] = useState([]);
    const [uploadProgress, setUploadProgress] = useState({}); // To track progress for multiple files    const [imgFileError, setImgFileError] = useState(false);

    const maxFileSize = 1024 * 1024 * 2; // 1MB
    const maxFileCount = 15;

    const removeImageHandler = (index) => {
        const filteredPreviews = imagePreviews.filter((_, idx) => idx !== index);
        setImagePreviews(filteredPreviews);
        console.log('imagePreviews: ' + JSON.stringify(imagePreviews));
        console.log('filteredPreviews: ' + JSON.stringify(filteredPreviews));
        console.log('imgFiles: ' + JSON.stringify(imgFiles));
        const filteredFiles = imgFiles.filter((_, idx) => idx !== index);
        setImgFiles(filteredFiles);

        // Clean up the URL to prevent memory leaks
        URL.revokeObjectURL(imagePreviews[index].url);
    };

    const fileChangeHandler = (event) => {
        const newFiles = Array.from(event.target.files);
        console.log('newFiles:', newFiles);

        const updatedPreviews = newFiles.map((file) => {
            if (
                file.size > maxFileSize ||
                (file.type !== 'image/jpeg' && file.type !== 'image/png')
            ) {
                return {
                    status: 'error',
                    message: 'Invalid format or size',
                };
            } else {
                console.log('file in the fileChangeHandler: ' + file);
                return {
                    url: URL.createObjectURL(file),
                    file,
                    status: 'pending',
                    progress: 0,
                };
            }
        });
        setImagePreviews((prev) => [...prev, ...updatedPreviews]);
    };

    const handleImageFileUpload = (imgFiles) => {
        const storage = getStorage(FirebaseApp);
        console.log('image files:', imgFiles); // Log without JSON.stringify for better clarity
        imgFiles.forEach((imgFileObj, index) => {
            if (!imgFileObj.file) {
                console.error('No file to upload for index', index);
                return; // Skip this iteration if no file object is present
            }
            const imgFile = imgFileObj.file; // Access the actual file object
            const imgFileName = `${new Date().getTime()}_${imgFile.name}`;

            const storageRef = ref(storage, imgFileName);
            const uploadTask = uploadBytesResumable(storageRef, imgFile);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    // Update progress in the state for each file
                    setImagePreviews((prev) =>
                        prev.map((item, idx) =>
                            idx === index
                                ? { ...item, progress, status: 'uploading' }
                                : item
                        )
                    );
                },
                (error) => {
                    console.error('Upload error: ', error);
                    setImagePreviews((prev) =>
                        prev.map((item, idx) =>
                            idx === index
                                ? { ...item, status: 'error', message: 'Upload failed' }
                                : item
                        )
                    );
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        // Update success status and add URL in the state for each file
                        setImagePreviews((prev) =>
                            prev.map((item, idx) =>
                                idx === index
                                    ? {
                                          ...item,
                                          status: 'success',
                                          message: 'Upload successful',
                                          url: downloadURL,
                                      }
                                    : item
                            )
                        );
                    });
                }
            );
        });
    };

    useEffect(() => {
        return () => {
            imagePreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
        };
    }, [imagePreviews]);

    const [formData, setFormData] = useState({
        title: '',
        listingType: 'Lease',
        description: '',
        availableDate: '',
        price: '',
        propertyType: 'Apartment',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        bedrooms: '',
        bathrooms: '',
        sqft: '',
        agentCompany: '',
        agentName: '',
        agentPhone: '',
        imageUrls: [],
        refUrl: '',
        email: '',
    });

    const dispatch = useDispatch();

    const formChangeHandler = (e) => {
        const { name, value } = e.target;
        console.log('form change handler is called. Name: ' + name + 'Value: ' + value);
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const submitHandler = (e) => {
        e.preventDefault();

        // Convert availableDate from string to Date object
        const formattedDate = new Date(formData.availableDate);

        // Extract URLs from imagePreviews if the upload was successful
        const imageUrls = imagePreviews
            .filter((preview) => preview.status === 'success')
            .map((preview) => preview.url);

        const listingData = {
            ...formData,
            listingType: formData.listingType,
            availableDate: formattedDate,
            location: {
                address: formData.address,
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
        dispatch(createListingThunk({ listingData }));
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
                            </label>
                            <div className="mt-2">
                                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                    <input
                                        type="text"
                                        name="title"
                                        id="title"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-200 sm:text-sm sm:leading-6"
                                        placeholder="Realty Savvy Apartment"
                                        value={formData.title}
                                        onChange={formChangeHandler}
                                    />
                                </div>
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
                        {/* listing type */}
                        <div className="sm:col-span-3">
                            <label
                                htmlFor="listingType"
                                className="block text-sm font-medium leading-6 text-gray-900">
                                Listing Type
                            </label>
                            <div className="mt-2">
                                <select
                                    id="listingType"
                                    name="listingType"
                                    value={formData.listingType}
                                    onChange={formChangeHandler}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-200 sm:text-sm sm:leading-6">
                                    <option>Lease</option>
                                    <option>Sell</option>
                                </select>
                            </div>
                        </div>
                        {/* Building Type */}
                        <div className="sm:col-span-3">
                            <label
                                htmlFor="building-type"
                                className="block text-sm font-medium leading-6 text-gray-900">
                                Building Type
                            </label>
                            <div className="mt-2">
                                <select
                                    id="building-type"
                                    name="propertyType"
                                    value={formData.propertyType}
                                    onChange={formChangeHandler}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-200 sm:text-sm sm:leading-6">
                                    <option>Single-family Home</option>
                                    <option>Multi-family Home</option>
                                    <option>Condo</option>
                                    <option>Townhouse</option>
                                    <option>Apartment</option>
                                    <option>Other</option>
                                </select>
                            </div>
                        </div>
                        {/* Available date */}
                        <div className="sm:col-span-3">
                            <label
                                htmlFor="availableDate"
                                className="block text-sm font-medium leading-6 text-gray-900">
                                Available Date
                            </label>
                            <div className="mt-2">
                                <div className="relative max-w-sm">
                                    {/* <div className="absolute inset-y-0 start0 flex items-center pl-3 pointer-events-none ">
                                        <svg
                                            className="w-4 h-4 text-gray-500 dark:text-gray-400"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="currentColor"
                                            viewBox="0 0 20 20">
                                            <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                                        </svg>
                                    </div> */}
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
                            </label>
                            <div className="mt-2">
                                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                    <input
                                        type="text"
                                        name="price"
                                        id="price"
                                        value={formData.price}
                                        onChange={formChangeHandler}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-200 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                        </div>
                        {/* photos */}
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
                                            PNG, JPG, GIF up to 10MB
                                        </p>
                                    </div>
                                </div>
                                {/* COLUMN RIGHT: Allow user to preview photos and manage their upload */}
                                {/* <div className="flex flex-col gap-2 overflow-y-auto max-h-60">
                                    {imagePreviews.map((preview, index) => (
                                        <div key={index} className="relative">
                                            <img
                                                src={preview.url}
                                                alt="Preview"
                                                className="h-10 w-10 rounded-lg bg-gray-800 object-cover"
                                            />
                                            {preview.status === 'uploading' && (
                                                <div className="absolute bottom-0 left-0 right-0 bg-gray-900 text-white text-center">
                                                    {preview.progress}%
                                                </div>
                                            )}
                                            {preview.status === 'error' && (
                                                <div className="absolute bottom-0 left-0 right-0 bg-red-600 text-white text-center">
                                                    {preview.message}
                                                </div>
                                            )}
                                            {preview.status === 'success' && (
                                                <div className="absolute bottom-0 left-0 right-0 bg-green-500 text-white text-center">
                                                    {preview.message}
                                                </div>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => removeImageHandler(index)}
                                                className="absolute top-0 right-0 bg-red-600 text-white p-1 rounded-full"
                                                aria-label="Delete image">
                                                &times;
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        className="bg-dark-100 text-primary-200"
                                        onClick={() =>
                                            handleImageFileUpload(
                                                imagePreviews.filter(
                                                    (p) => p.status === 'pending'
                                                )
                                            )
                                        }>
                                        Upload
                                    </button>
                                </div> */}
                                <div className="flex flex-col gap-2 overflow-y-auto max-h-60">
                                    {imagePreviews.length > 0 ? (
                                        imagePreviews.map((preview, index) => (
                                            <div key={index} className="relative">
                                                {preview.url && (
                                                    <img
                                                        src={preview.url}
                                                        alt="Preview"
                                                        className="h-10 w-10 rounded-lg bg-gray-800 object-cover"
                                                    />
                                                )}
                                                {/* Display progress, error, and success indicators here */}
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeImageHandler(index)
                                                    }
                                                    className="absolute top-0 right-0 bg-red-600 text-white p-1 rounded-full"
                                                    aria-label="Delete image">
                                                    &times;
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <div>No images chosen</div>
                                    )}
                                    {imagePreviews.some(
                                        (p) => p.status === 'pending'
                                    ) && (
                                        <button
                                            className="bg-dark-100 text-primary-200"
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
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="city"
                                    id="city"
                                    value={formData.city}
                                    onChange={formChangeHandler}
                                    autoComplete="address-level2"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-200 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                        {/* State */}
                        <div className="sm:col-span-2">
                            <label
                                htmlFor="state"
                                className="block text-sm font-medium leading-6 text-gray-900">
                                State
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="state"
                                    id="state"
                                    value={formData.state}
                                    onChange={formChangeHandler}
                                    autoComplete="address-level1"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-200 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                        {/* zipcode */}
                        <div className="sm:col-span-2">
                            <label
                                htmlFor="zipCode"
                                className="block text-sm font-medium leading-6 text-gray-900">
                                ZIP
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="zipCode"
                                    id="zipCode"
                                    value={formData.zipCode}
                                    onChange={formChangeHandler}
                                    autoComplete="postal-code"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-200 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                        {/* address */}
                        <div className="col-span-full">
                            <label
                                htmlFor="address"
                                className="block text-sm font-medium leading-6 text-gray-900">
                                Street address
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="address"
                                    id="address"
                                    value={formData.address}
                                    onChange={formChangeHandler}
                                    autoComplete="street-address"
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
                                    type="text"
                                    name="bedrooms"
                                    id="bedrooms"
                                    value={formData.bedrooms}
                                    onChange={formChangeHandler}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-200 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                        {/* bathrooms */}
                        <div className="sm:col-span-3">
                            <label
                                htmlFor="bedrooms"
                                className="block text-sm font-medium leading-6 text-gray-900">
                                Bathrooms
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="bathrooms"
                                    id="bathrooms"
                                    value={formData.bathrooms}
                                    onChange={formChangeHandler}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-200 sm:text-sm sm:leading-6"
                                />
                            </div>
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
                                    type="text"
                                    name="sqft"
                                    id="sqft"
                                    value={formData.sqft}
                                    onChange={formChangeHandler}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-200 sm:text-sm sm:leading-6"
                                />
                            </div>
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
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-200 sm:text-sm sm:leading-6"
                                />
                            </div>
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
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-200 sm:text-sm sm:leading-6"
                                />
                            </div>
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
                            {/* <label
                                htmlFor="phoneNumber"
                                className="block text-sm font-medium leading-6 ">
                                Phone Number
                            </label>
                            <div className="relative mt-2 rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 flex items-center">
                                    <label htmlFor="country" className="sr-only border-0">
                                        Country
                                    </label>
                                    <select
                                        id="country"
                                        name="country"
                                        autoComplete="country"
                                        className="h-full rounded-md border-0 bg-transparent py-0 pl-3 pr-1 text-gray-900 focus:ring-2 focus:ring-inset focus:ring-primary-200 sm:text-sm">
                                        <option>US</option>
                                    </select>
                                </div>
                                <input
                                    type="text"
                                    name="phoneNumber"
                                    id="phoneNumber"
                                    className="block w-full rounded-md border-0 py-1.5 pl-16 text-gray-900 ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-200 sm:text-sm sm:leading-6"
                                />
                            </div> */}
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
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-200 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-x-6">
                <button
                    type="button"
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
