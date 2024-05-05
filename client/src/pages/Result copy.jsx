import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchApartmentsThunk,
    fetchRentalsThunk,
} from '../services/apartmentAPI/apartment-api-thunk.js';
import { setPage } from '../reducers/apartmentAPI-reducer.js';
import ListingCard from './listing/listingCard.jsx';
import ListingStack from './listing/listingStack.jsx';
import WelcomePic from '../assets/auth-2.jpg';

const Result = () => {
    const dispatch = useDispatch();
    const { listings, loading, error, currentPage, totalCount, limit } = useSelector(
        (state) => state.apartments
    );

    const handlePrevPage = () => {
        if (currentPage > 1) {
            const newPage = currentPage - 1;
            dispatch(setPage(newPage));
            dispatch(fetchApartmentsThunk());
        }
    };

    const handleNextPage = () => {
        const maxPages = Math.ceil(totalCount / limit);
        if (currentPage < maxPages) {
            const newPage = currentPage + 1;
            dispatch(setPage(newPage));
            dispatch(fetchApartmentsThunk());
        }
    };

    if (loading) {
        return <div>Loading apartments...</div>;
    }

    if (error) {
        return <div>An error occurred: {error}</div>;
    }

    return (
        // <div>
        //     <div className="px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        //         {listings.map((listing) => (
        //             <ListingCard key={listing.id} listing={listing} />
        //         ))}
        //     </div>
        //     <div className="pagination-controls">
        //         <button onClick={handlePrevPage} disabled={currentPage <= 1}>
        //             Previous
        //         </button>
        //         <span>
        //             Page {currentPage} of {Math.ceil(totalCount / limit)}
        //         </span>
        //         <button
        //             onClick={handleNextPage}
        //             disabled={currentPage >= Math.ceil(totalCount / limit)}>
        //             Next
        //         </button>
        //     </div>
        // </div>

        <div>
            {/* Background image */}
            <div
                style={{
                    backgroundImage: `url(${WelcomePic})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'absolute', // Ensures the background covers the whole div
                    width: '100%', // Cover the full width
                    height: '100%', // Cover the full height
                    zIndex: 1, // Lower z-index so that content is above
                }}
            />

            {/* Transparent black overlay */}
            <div
                style={{
                    position: 'absolute', // Overlay must cover the background image
                    width: '100%', // Cover the full width
                    height: '100%', // Cover the full height
                    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Black with 30% opacity
                    zIndex: 2, // Lower z-index so that content is above
                }}
            />

            {/* Content */}
            <div className="min-h-screen flex justify-center items-center z-10">
                <div className="container mx-auto bg-dark-100 rounded-lg p-14">
                    <form>
                        <h1 className="text-center font-bold text-white text-4xl">
                            Search Real Estate Listings
                        </h1>
                        <p className="mx-auto font-normal text-sm my-6 max-w-lg">
                            Enter the location you are interested in and select whether
                            you are looking for properties to buy or rent.
                        </p>
                        <div className="sm:flex items-center bg-white rounded-lg overflow-hidden px-2 py-1 justify-between">
                            <input
                                className="text-base text-gray-400 flex-grow outline-none px-2"
                                type="text"
                                placeholder="Enter location (e.g., New York, Los Angeles)"
                            />
                            <div className="flex items-center px-2 rounded-lg space-x-4 mx-auto">
                                <select className="text-base text-gray-800 outline-none border-2 px-4 py-2 rounded-lg">
                                    <option value="for-sale">For Sale</option>
                                    <option value="for-rent">For Rent</option>
                                </select>
                                <button className="bg-indigo-500 text-white text-base rounded-lg px-4 py-2 font-thin">
                                    Search
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div className="max-w-xl mx-auto shadow-lg bg-white">
                <ul role="list" className="divide-y divide-gray-100">
                    {listings.map((listing) => (
                        <ListingStack key={listing.id} listing={listing} />
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Result;
