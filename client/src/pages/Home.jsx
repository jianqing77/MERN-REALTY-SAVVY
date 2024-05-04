import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchApartmentsThunk,
    fetchRentalsThunk,
} from '../services/apartmentAPI/apartment-api-thunk.js';
import { setPage } from '../reducers/apartmentAPI-reducer';
import ListingCard from './listing/listingCard.jsx';

const Home = () => {
    const dispatch = useDispatch();
    const { listings, loading, error, currentPage, totalCount, limit } = useSelector(
        (state) => state.apartments
    );

    useEffect(() => {
        dispatch(
            fetchRentalsThunk({ location: 'New York', resultsPerPage: 10, page: 1 })
        );
    }, [dispatch]);

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
        <div>
            <div className="px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                {listings.map((listing) => (
                    <ListingCard key={listing.id} listing={listing} />
                ))}
            </div>
            <div className="pagination-controls">
                <button onClick={handlePrevPage} disabled={currentPage <= 1}>
                    Previous
                </button>
                <span>
                    Page {currentPage} of {Math.ceil(totalCount / limit)}
                </span>
                <button
                    onClick={handleNextPage}
                    disabled={currentPage >= Math.ceil(totalCount / limit)}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default Home;
