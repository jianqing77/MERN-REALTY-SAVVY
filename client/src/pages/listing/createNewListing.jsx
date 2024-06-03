import React, { useEffect, useRef, useState } from 'react';
import { CalendarIcon, PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import Datepicker from 'tailwind-datepicker-react';
import { createListingThunk } from '../../services/internal-listing/internal-listing-thunk';
import { useDispatch } from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import FirebaseApp from '../../config/firebase';
import { toast } from 'react-toastify';

export default function CreateNewListing() {
    // Data Picker
    const datePickerRef = useRef(null);

    useEffect(() => {
        if (datePickerRef.current) {
            new Datepicker(datePickerRef.current, {
                autoHide: true,
            });
        }
    }, []);

    // Image Handling
    const imageFileRef = useRef(null);
    const [imgFiles, setImgFiles] = useState([]); // To handle multiple files
    const [imagePreviews, setImagePreviews] = useState([]);

    const maxFileSize = 1024 * 1024 * 3; // 3MB
    const maxFileCount = 15;

    // Handle image counts
    const [fileCountError, setFileCountError] = useState('');
    useEffect(() => {
        if (fileCountError) {
            const timer = setTimeout(() => {
                setFileCountError('');
            }, 3000); // Clear the error message after 3 seconds

            return () => clearTimeout(timer); // Clear the timer if the component unmounts or the error changes
        }
    }, [fileCountError]);

    const removeImageHandler = (index) => {
        const filteredPreviews = imagePreviews.filter((_, idx) => idx !== index);
        setImagePreviews(filteredPreviews);
        const filteredFiles = imgFiles.filter((_, idx) => idx !== index);
        setImgFiles(filteredFiles);

        // Clean up the URL to prevent memory leaks
        URL.revokeObjectURL(imagePreviews[index].url);
    };

    // Handler image error message time out
    const clearErrorMessage = (file) => {
        setImagePreviews((currentPreviews) =>
            currentPreviews.map((preview) => {
                if (preview.file === file) {
                    return { ...preview, message: '' }; // Clear the message
                }
                return preview;
            })
        );
    };

    const fileChangeHandler = (event) => {
        const newFiles = Array.from(event.target.files);
        const totalFileCount = imgFiles.length + newFiles.length;

        if (totalFileCount > maxFileCount) {
            setFileCountError(`You can only upload up to ${maxFileCount} images.`);
            return; // Prevent further execution if the limit is exceeded
        } else {
            setFileCountError(''); // Clear error message if under limit
        }

        const updatedPreviews = newFiles.map((file) => {
            if (
                file.size > maxFileSize ||
                (file.type !== 'image/jpeg' && file.type !== 'image/png')
            ) {
                setTimeout(() => {
                    clearErrorMessage(file);
                }, 3000); // Clear the error message after 3 seconds

                return {
                    file,
                    status: 'error',
                    message: `${file.name} has invalid format or size`,
                };
            } else {
                // console.log('file in the fileChangeHandler: ' + file);
                return {
                    url: URL.createObjectURL(file),
                    file,
                    status: 'pending',
                    progress: 0,
                    isUploading: false,
                };
            }
        });
        // Update state with the new files, adding to the existing files
        setImagePreviews((prev) => [...prev, ...updatedPreviews]);
        setImgFiles((prevFiles) => [...prevFiles, ...newFiles.map((f) => f.file)]);
    };

    // const updateFileUploadStatus = (file, isUploading) => {
    //     setImagePreviews((currentPreviews) =>
    //         currentPreviews.map((preview) => {
    //             if (preview.file === file) {
    //                 return { ...preview, isUploading };
    //             } else {
    //                 return preview;
    //             }
    //         })
    //     );
    // };

    const handleImageFileUpload = (imgFiles) => {
        const storage = getStorage(FirebaseApp);
        // console.log('image files:', imgFiles); // Log without JSON.stringify for better clarity
        imgFiles.forEach((imgFileObj, index) => {
            if (!imgFileObj.file) {
                return; // Skip this iteration if no file object is present
            }
            // updateFileUploadStatus(imgFileObj.file, true); // Set isUploading to true
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
    const [formErrors, setFormErrors] = useState({});
    const dispatch = useDispatch();

    const formChangeHandler = (e) => {
        const { name, value } = e.target;
        console.log('form change handler is called. Name: ' + name + 'Value: ' + value);
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const validateForm = () => {
        const errors = {};
        const requiredFields = {
            title: formData.title,
            listingType: formData.listingType,
            price: formData.price,
            propertyType: formData.propertyType,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            bedrooms: formData.bedrooms,
            bathrooms: formData.bathrooms,
            agentCompany: formData.agentCompany,
            agentName: formData.agentName,
            email: formData.email,
        };

        // Check each field and add to errors if empty
        for (const key in requiredFields) {
            if (!requiredFields[key]) {
                errors[key] = 'This field is required';
            }
        }

        return errors;
    };

    const submitHandler = (e) => {
        e.preventDefault();

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
                                ZipCode
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
                                    type="text"
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
