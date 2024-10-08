import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Outlet } from 'react-router-dom';
import { findListingByCurrentUserThunk } from '../../../services/internal-listing/internal-listing-thunk';
import {
    formatDate,
    formatListingType,
    formatListingTypeInternal,
    formatPrice,
    formatPropertyTypeInternal,
} from '../../../utils/formatUtils.jsx';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function Listings() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const addNewListingHandler = () => {
        navigate('new');
    };

    const viewDetailsHandler = (listingId) => {
        navigate(`details/${listingId}`);
    };

    const userListings = useSelector((state) => state['internal-listings'].userListings);
    // console.log('user listings: ' + userListings);
    useEffect(() => {
        dispatch(findListingByCurrentUserThunk());
    }, [dispatch]);

    return (
        <div className="max-w-9xl gap-x-8 gap-y-10 px-4 pt-16 pb-10 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center">
                <div className="flex-auto">
                    <h1 className="text-base font-semibold leading-6 text-gray-900">
                        My Listings
                    </h1>
                    <p className="mt-2 hidden text-sm text-gray-400 sm:block">
                        A list of all the listings you have created.
                    </p>
                </div>
                <div className="mt-4 sm:ml-16">
                    <button
                        type="button"
                        onClick={addNewListingHandler}
                        className="block rounded-md bg-dark-100 px-3 py-2 text-center text-sm font-semibold text-primary-100 shadow-sm hover:bg-yellow-500 hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dark-200">
                        Add New Listing
                    </button>
                </div>
            </div>
            <div className="mt-8 flow-root">
                {!userListings || userListings.length === 0 ? (
                    <div className="text-center text-sm text-gray-500">
                        No listings created.
                    </div>
                ) : (
                    <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle">
                            <table className="min-w-full border-separate border-spacing-0">
                                <thead>
                                    <tr>
                                        <th
                                            scope="col"
                                            className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8 ">
                                            Title
                                        </th>
                                        <th
                                            scope="col"
                                            className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-center text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter">
                                            Listing Type
                                        </th>
                                        <th
                                            scope="col"
                                            className="sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-center text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell">
                                            Property Type
                                        </th>
                                        <th
                                            scope="col"
                                            className="sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-center text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell">
                                            Price
                                        </th>
                                        <th
                                            scope="col"
                                            className="sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-center text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell">
                                            Date Created
                                        </th>
                                        <th
                                            scope="col"
                                            className="sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-center text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter lg:table-cell">
                                            Last Modified
                                        </th>
                                        {/* Save space for the view details column */}
                                        <th
                                            scope="col"
                                            className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-3 pr-4 backdrop-blur backdrop-filter sm:pr-6 lg:pr-8">
                                            <span className="sr-only"></span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {userListings.map((listing, idx) => (
                                        <tr key={listing._id}>
                                            <td
                                                className={classNames(
                                                    idx !== userListings.length - 1
                                                        ? 'border-b border-gray-200'
                                                        : '',
                                                    'whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8 text-center'
                                                )}>
                                                {listing.title}
                                            </td>
                                            <td
                                                className={classNames(
                                                    idx !== userListings.length - 1
                                                        ? 'border-b border-gray-200'
                                                        : '',
                                                    'whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center'
                                                )}>
                                                {formatListingTypeInternal(
                                                    listing.listingType
                                                )}
                                            </td>
                                            <td
                                                className={classNames(
                                                    idx !== userListings.length - 1
                                                        ? 'border-b border-gray-200'
                                                        : '',
                                                    'whitespace-nowrap hidden px-3 py-4 text-sm text-gray-500 sm:table-cell text-center'
                                                )}>
                                                {formatPropertyTypeInternal(
                                                    listing.propertyType
                                                )}
                                            </td>
                                            <td
                                                className={classNames(
                                                    idx !== userListings.length - 1
                                                        ? 'border-b border-gray-200'
                                                        : '',
                                                    'whitespace-nowrap hidden px-3 py-4 text-sm text-gray-500 sm:table-cell text-center'
                                                )}>
                                                {formatPrice(listing.price)}
                                            </td>
                                            <td
                                                className={classNames(
                                                    idx !== userListings.length - 1
                                                        ? 'border-b border-gray-200'
                                                        : '',
                                                    'whitespace-nowrap hidden px-3 py-4 text-sm text-gray-500 sm:table-cell text-center'
                                                )}>
                                                {formatDate(listing.createdAt)}
                                            </td>
                                            <td
                                                className={classNames(
                                                    idx !== userListings.length - 1
                                                        ? 'border-b border-gray-200'
                                                        : '',
                                                    'whitespace-nowrap hidden px-3 py-4 text-sm text-gray-500 lg:table-cell text-center'
                                                )}>
                                                {formatDate(listing.updatedAt)}
                                            </td>
                                            <td
                                                className={classNames(
                                                    idx !== userListings.length - 1
                                                        ? 'border-b border-gray-200'
                                                        : '',
                                                    'relative whitespace-nowrap py-4 pr-4 pl-3 text-right text-sm font-medium sm:pr-8 lg:pr-8'
                                                )}>
                                                {/* add () => to avoid immediate function call */}
                                                <button
                                                    onClick={() =>
                                                        viewDetailsHandler(listing._id)
                                                    }
                                                    className="text-dark-100 hover:text-primary-200">
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
