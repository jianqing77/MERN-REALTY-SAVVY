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

const ResultPage = () => {
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
        <div className="max-w-xl mx-auto shadow-lg bg-white">
            <ul role="list" className="divide-y divide-gray-100">
                {listings.map((listing) => (
                    <ListingStack key={listing.id} listing={listing} />
                ))}
            </ul>
        </div>
    );
};

export default ResultPage;
