import React, { useEffect, useRef, useState } from 'react';
import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import Datepicker from 'flowbite-datepicker/Datepicker';

export default function CreateNewListing() {
    const datePickerRef = useRef(null); // Create a ref that we can assign to the input element

    useEffect(() => {
        if (datePickerRef.current) {
            new Datepicker(datePickerRef.current, {
                autoHide: true,
            });
        }
    }, []);

    return (
        <form className="max-w-9xl  gap-x-8 gap-y-10 px-4 pt-16 pb-10 sm:px-6 lg:px-8">
            <div className="space-y-12">
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
                                />
                            </div>
                        </div>
                        {/* listing type */}
                        <div className="sm:col-span-3">
                            <label
                                htmlFor="listing-type"
                                className="block text-sm font-medium leading-6 text-gray-900">
                                Listing Type
                            </label>
                            <div className="mt-2">
                                <select
                                    id="listing-type"
                                    name="listing-type"
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
                                    name="building-type"
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
                        {/* Year built */}
                        <div className="sm:col-span-3">
                            <label
                                htmlFor="year-built"
                                className="block text-sm font-medium leading-6 text-gray-900">
                                Year Built
                            </label>
                            <div className="mt-2">
                                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                    <input
                                        type="number"
                                        name="year-built"
                                        id="year-built"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-200 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                        </div>
                        {/* listing date */}
                        <div className="sm:col-span-3">
                            <label
                                htmlFor="available-date"
                                className="block text-sm font-medium leading-6 text-gray-900">
                                Available Date
                            </label>
                            <div className="mt-2">
                                <div className="relative max-w-sm">
                                    <div className="absolute inset-y-0 start0 flex items-center pl-3 pointer-events-none ">
                                        <svg
                                            className="w-4 h-4 text-gray-500 dark:text-gray-400"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="currentColor"
                                            viewBox="0 0 20 20">
                                            <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                                        </svg>
                                    </div>
                                    <input
                                        ref={datePickerRef}
                                        type="text"
                                        id="available-date"
                                        className="pl-10 p-2.5 block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-200 sm:text-sm sm:leading-6"
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
                                        type="number"
                                        name="price"
                                        id="price"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-200 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                        </div>
                        {/* listingStatus */}
                        <div className="sm:col-span-3">
                            <label
                                htmlFor="listing-status"
                                className="block text-sm font-medium leading-6 text-gray-900">
                                Listing Status
                            </label>
                            <div className="mt-2">
                                <select
                                    id="listing-status"
                                    name="listing-status"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-200 sm:text-sm sm:leading-6">
                                    <option>Active</option>
                                    <option>Pending</option>
                                    <option>Off Market</option>
                                </select>
                            </div>
                        </div>

                        {/* photos */}
                        <div className="col-span-full">
                            <label
                                htmlFor="property-photos"
                                className="block text-sm font-medium leading-6 text-gray-900">
                                Photos
                            </label>
                            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-700 px-6 py-10">
                                <div className="text-center">
                                    <PhotoIcon
                                        className="mx-auto h-12 w-12 text-gray-300"
                                        aria-hidden="true"
                                    />
                                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                        <label
                                            htmlFor="file-upload"
                                            className="relative cursor-pointer rounded-md bg-white font-semibold text-primary-200 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                                            <span>Upload a file</span>
                                            <input
                                                id="file-upload"
                                                name="file-upload"
                                                type="file"
                                                className="sr-only"
                                            />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs leading-5 text-gray-600">
                                        PNG, JPG, GIF up to 10MB
                                    </p>
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
                                    autoComplete="address-level2"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-200 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                        {/* State */}
                        <div className="sm:col-span-2">
                            <label
                                htmlFor="region"
                                className="block text-sm font-medium leading-6 text-gray-900">
                                State
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="region"
                                    id="region"
                                    autoComplete="address-level1"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-200 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                        {/* zipcode */}
                        <div className="sm:col-span-2">
                            <label
                                htmlFor="postal-code"
                                className="block text-sm font-medium leading-6 text-gray-900">
                                ZIP
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="postal-code"
                                    id="postal-code"
                                    autoComplete="postal-code"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-200 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                        {/* address */}
                        <div className="col-span-full">
                            <label
                                htmlFor="street-address"
                                className="block text-sm font-medium leading-6 text-gray-900">
                                Street address
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="street-address"
                                    id="street-address"
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
                                    type="Number"
                                    name="bedrooms"
                                    id="bedrooms"
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
                                    type="Number"
                                    name="bathrooms"
                                    id="bathrooms"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-200 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                        {/* Square Footage */}
                        <div className="sm:col-span-3">
                            <label
                                htmlFor="sqrt"
                                className="block text-sm font-medium leading-6 text-gray-900">
                                Square Footage
                            </label>
                            <div className="mt-2">
                                <input
                                    type="Number"
                                    name="sqrt"
                                    id="sqrt"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-200 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                        {/* Lot Size */}
                        <div className="sm:col-span-3">
                            <label
                                htmlFor="sqrt"
                                className="block text-sm font-medium leading-6 text-gray-900">
                                Lot Size
                            </label>
                            <div className="mt-2">
                                <input
                                    type="Number"
                                    name="sqrt"
                                    id="sqrt"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-200 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                        {/* Parking */}
                        <div className="sm:col-span-3">
                            <label
                                htmlFor="parking"
                                className="block text-sm font-medium leading-6 text-gray-900">
                                Parking
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="parking"
                                    id="parking"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-200 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                        {/* Heat & cooling */}
                        <div className="sm:col-span-3">
                            <label
                                htmlFor="heat-cooling"
                                className="block text-sm font-medium leading-6 text-gray-900">
                                Heat & Cooling
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="heat-cooling"
                                    id="heat-cooling"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-200 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                -{/* Contact Info */}
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
                        {/* first name */}
                        <div className="sm:col-span-3">
                            <label
                                htmlFor="first-name"
                                className="block text-sm font-medium leading-6 text-gray-900">
                                First Name
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="first-name"
                                    id="first-name"
                                    autoComplete="given-name"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-200 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                        {/* last name */}
                        <div className="sm:col-span-3">
                            <label
                                htmlFor="last-name"
                                className="block text-sm font-medium leading-6 text-gray-900">
                                Last Name
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="last-name"
                                    id="last-name"
                                    autoComplete="family-name"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-200 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                        {/* agency name */}
                        <div className="sm:col-span-4">
                            <label
                                htmlFor="agency-name"
                                className="block text-sm font-medium leading-6 ">
                                Agency
                            </label>
                            <div className="relative mt-2 rounded-md shadow-sm">
                                <input
                                    type="text"
                                    name="agency-name"
                                    id="agency-name"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-200 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                        {/* phone number */}
                        <div className="sm:col-span-4">
                            <label
                                htmlFor="phoneNumber"
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
                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                    Save
                </button>
            </div>
        </form>
    );
}
