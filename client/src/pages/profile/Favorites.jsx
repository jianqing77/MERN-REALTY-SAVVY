import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAPIListingByIdThunk } from '../../services/apartmentAPI/apartment-api-thunk';
import { fetchLikedExternalListingsThunk } from '../../services/user/user-thunk';
import { formatPrice } from '../listing/formatUtils';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function Favorites() {
    const dispatch = useDispatch();
    // const { currentUser } = useSelector((state) => state.auth);
    const { profile, likedExternalListings } = useSelector((state) => state.user);

    console.log(JSON.stringify(profile));
    useEffect(() => {
        if (profile && profile._id) {
            dispatch(fetchLikedExternalListingsThunk({ userId: profile._id }));
        }
    }, [profile, dispatch]);

    // console.log('likedExternalListings: ' + JSON.stringify(likedExternalListings));

    return (
        <div className="max-w-9xl gap-x-8 gap-y-10 px-4 pt-16 pb-10 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-base font-semibold leading-6 text-gray-900">
                        My Listings
                    </h1>
                    <p className="mt-2 text-sm text-gray-400">
                        A list of all the listings you liked.
                    </p>
                </div>
            </div>
            <div className="mt-8 flow-root">
                {!likedExternalListings || likedExternalListings.length === 0 ? (
                    <div className="text-center text-sm text-gray-500">
                        No Liked External Listings.
                    </div>
                ) : (
                    <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle">
                            <table className="min-w-full border-separate border-spacing-0">
                                <thead>
                                    <tr>
                                        <th
                                            scope="col"
                                            className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8 ">
                                            Title
                                        </th>
                                        <th
                                            scope="col"
                                            className="sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-center text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell ">
                                            Listing Type
                                        </th>
                                        <th
                                            scope="col"
                                            className="sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-center text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell">
                                            Property Type
                                        </th>
                                        <th
                                            scope="col"
                                            className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-center text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter">
                                            Price
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {likedExternalListings.map((listing, idx) => (
                                        <tr key={listing.id}>
                                            <td
                                                className={classNames(
                                                    idx !==
                                                        likedExternalListings.length - 1
                                                        ? 'border-b border-gray-200'
                                                        : '',
                                                    'whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8 text-left'
                                                )}>
                                                {listing.title}
                                            </td>
                                            <td
                                                className={classNames(
                                                    idx !==
                                                        likedExternalListings.length - 1
                                                        ? 'border-b border-gray-200'
                                                        : '',
                                                    'whitespace-nowrap hidden px-3 py-4 text-sm text-gray-500 lg:table-cell text-center'
                                                )}>
                                                {listing.listingType}
                                            </td>
                                            <td
                                                className={classNames(
                                                    idx !==
                                                        likedExternalListings.length - 1
                                                        ? 'border-b border-gray-200'
                                                        : '',
                                                    'whitespace-nowrap hidden px-3 py-4 text-sm text-gray-500 lg:table-cell text-center'
                                                )}>
                                                {listing.propertyType}
                                            </td>
                                            <td
                                                className={classNames(
                                                    idx !==
                                                        likedExternalListings.length - 1
                                                        ? 'border-b border-gray-200'
                                                        : '',
                                                    'whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center'
                                                )}>
                                                {formatPrice(listing.price)}
                                            </td>

                                            <td
                                                className={classNames(
                                                    idx !==
                                                        likedExternalListings.length - 1
                                                        ? 'border-b border-gray-200'
                                                        : '',
                                                    'relative whitespace-nowrap py-4 pr-4 pl-3 text-right text-sm font-medium sm:pr-8 lg:pr-8'
                                                )}>
                                                <a
                                                    href="#"
                                                    className="text-dark-100 hover:text-primary-200">
                                                    View Details
                                                    <span className="sr-only">
                                                        , {listing.title}
                                                    </span>
                                                </a>
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
