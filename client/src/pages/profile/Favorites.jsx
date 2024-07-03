import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { fetchAPIListingByIdThunk } from '../../services/apartmentAPI/apartment-api-thunk';
import {
    fetchLikedExternalListingsThunk,
    fetchLikedInternalListingsThunk,
} from '../../services/user/user-thunk';
import {
    formatDate,
    formatListingType,
    formatListingTypeInternal,
    formatPrice,
    formatPropertyType,
} from '../../utils/formatUtils';
import HeartIcon from '../../components/HeartIcon';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function Favorites() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { currentUser } = useSelector((state) => state.auth);

    const { likedExternalListings } = useSelector((state) => state.user);
    const { likedInternalListings } = useSelector((state) => state.user);

    // console.log(
    //     'FAVORITES -- likedExternalListings: ' + JSON.stringify(likedExternalListings)
    // );

    // console.log(
    //     'FAVORITES -- likedInternalListings: ' + JSON.stringify(likedInternalListings)
    // );

    useEffect(() => {
        if (currentUser && currentUser._id) {
            dispatch(fetchLikedExternalListingsThunk({ userId: currentUser._id }));
            dispatch(fetchLikedInternalListingsThunk({ userId: currentUser._id }));
        }
    }, [currentUser, dispatch]);

    const combinedListings = [...likedExternalListings, ...likedInternalListings]
        .map((listing) => ({
            ...listing,
            id: String(listing._id || listing.id), // Use '_id' if available, otherwise use 'id'
            category: listing._id ? 'internal' : 'external', // Add 'category' based on presence of '_id'
            price: String(listing.price),
            bedrooms: String(listing.features?.bedrooms || listing.features?.bedrooms),
            bathrooms: String(listing.features?.bathrooms || listing.features?.bathrooms),
            sqft: String(listing.features?.sqft || listing.features?.squareFootage),
            likedAt: new Date(listing.likedAt),
        }))
        .sort((a, b) => b.likedat - a.likedat); // Sort by likedAt in descending order

    const listingLinkHandler = (listing) => {
        console.log('In the listingLinkHandler:' + JSON.stringify(listing));
        if (listing.category === 'external') {
            window.open(listing.media.refUrl, '_blank', 'noopener,noreferrer');
        } else {
            navigate(`/profile/favorites/details/${listing.id}`);
        }
    };

    return (
        <div className="max-w-9xl gap-x-8 gap-y-10 px-4 pt-16 pb-10 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-base font-semibold leading-6 text-gray-900">
                        Favorite Listings
                    </h1>
                    <p className="mt-2 text-sm text-gray-400">
                        A list of all the listings you liked.
                    </p>
                </div>
            </div>
            <div className="mt-8 flow-root">
                {!combinedListings || combinedListings.length === 0 ? (
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
                                            className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8 ">
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
                                        <th
                                            scope="col"
                                            className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-center text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter">
                                            Available Date
                                        </th>
                                        {/* Save space for the view details column */}
                                        <th
                                            scope="col"
                                            className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-center text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {combinedListings.map((listing, idx) => (
                                        <tr key={listing.id}>
                                            <td
                                                className={classNames(
                                                    idx !== combinedListings.length - 1
                                                        ? 'border-b border-gray-200'
                                                        : '',
                                                    'whitespace-nowrap py-4 pl-4 pr-3 text-sm text-center font-medium text-gray-900 sm:pl-6 lg:pl-8'
                                                )}>
                                                {listing.title}
                                            </td>
                                            <td
                                                className={classNames(
                                                    idx !== combinedListings.length - 1
                                                        ? 'border-b border-gray-200'
                                                        : '',
                                                    'whitespace-nowrap hidden px-3 py-4 text-sm text-gray-500 lg:table-cell text-center'
                                                )}>
                                                {listing.category === 'internal'
                                                    ? formatListingTypeInternal(
                                                          listing.listingType
                                                      )
                                                    : formatListingType(
                                                          listing.listingType
                                                      )}
                                            </td>
                                            <td
                                                className={classNames(
                                                    idx !== combinedListings.length - 1
                                                        ? 'border-b border-gray-200'
                                                        : '',
                                                    'whitespace-nowrap hidden px-3 py-4 text-sm text-gray-500 lg:table-cell text-center'
                                                )}>
                                                {formatPropertyType(listing.propertyType)}
                                            </td>
                                            <td
                                                className={classNames(
                                                    idx !== combinedListings.length - 1
                                                        ? 'border-b border-gray-200'
                                                        : '',
                                                    'whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center'
                                                )}>
                                                {formatPrice(listing.price)}
                                            </td>
                                            <td
                                                className={classNames(
                                                    idx !== combinedListings.length - 1
                                                        ? 'border-b border-gray-200'
                                                        : '',
                                                    'whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center'
                                                )}>
                                                {formatDate(listing.availableDate)}
                                            </td>
                                            <td
                                                className={classNames(
                                                    idx !== combinedListings.length - 1
                                                        ? 'border-b border-gray-200'
                                                        : '',
                                                    'whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center'
                                                )}>
                                                <HeartIcon
                                                    listingId={listing.id}
                                                    type={listing.category}
                                                />
                                                <button
                                                    onClick={() =>
                                                        listingLinkHandler(listing)
                                                    }
                                                    aria-label="Details">
                                                    <i
                                                        className="fa fa-ellipsis-h ms-5"
                                                        aria-hidden="true"></i>
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
