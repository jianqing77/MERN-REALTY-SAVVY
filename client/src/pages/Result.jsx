import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import {
    fetchRentalsThunk,
    fetchSalesThunk,
} from '../services/apartmentAPI/apartment-api-thunk.js';
import ListingStack from './listing/listingStack.jsx';
import ListingCard from './listing/listingCard.jsx';
import { setCurrentPage } from '../reducers/apartmentAPI-reducer.js';

const ResultPage = () => {
    const searchLocation = useLocation();
    const { state } = searchLocation;

    const [location, setLocation] = useState('');
    const [category, setCategory] = useState('for-sale');

    useEffect(() => {
        if (state) {
            setLocation(state.location);
            setCategory(state.category);
        }
    }, [state]);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { listings, totalRecords, currentPage, resultsPerPage, loading, error } =
        useSelector((state) => state.apartments);

    // Pagination
    const [page, setPage] = useState(currentPage || 1);

    // Calculate total pages
    const totalPages = Math.ceil(totalRecords / resultsPerPage);

    const fetchPageData = (pageNum) => {
        console.log('fetchPageData is called');
        console.log(location);
        console.log(pageNum);
        const action = category === 'for-sale' ? fetchSalesThunk : fetchRentalsThunk;
        dispatch(action({ location, page: pageNum }));
        navigate('/results', { state: { location, category } });
    };

    const handleNextPage = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        dispatch(setCurrentPage(nextPage));
        fetchPageData(nextPage);
    };

    const handlePreviousPage = () => {
        if (page > 1) {
            const prevPage = page - 1;
            setPage(prevPage);
        }
    };

    // Search Bar
    const locationChangeHandler = (event) => {
        setLocation(event.target.value);
    };

    const categoryChangeHandler = (event) => {
        setCategory(event.target.value);
    };

    const searchBtnHandler = () => {
        setPage(1); // Reset to page 1 on new search
        dispatch(
            category === 'for-sale'
                ? fetchSalesThunk({ location, currentPage: 1 })
                : fetchRentalsThunk({ location, currentPage: 1 })
        );
    };

    // useEffect(() => {
    //     const fetchThunk = category === 'for-sale' ? fetchSalesThunk : fetchRentalsThunk;
    //     dispatch(fetchThunk({ location, currentPage: page }));
    // }, [page, dispatch, category, location, searchLocation]);

    return (
        <div className="grid grid-cols-6">
            <div className="col-span-3"></div>
            <div className="col-span-3 pe-24">
                {/* Search Bar */}
                <div className="sm:flex items-center bg-white rounded-lg overflow-hidden py-4 justify-between">
                    <input
                        className="text-base text-gray-400 flex-grow outline-none border-3 ms-3 border-dark-100 rounded-lg focus:ring-primary-200 focus:ring-2 focus:border-none"
                        type="text"
                        placeholder="Enter location (e.g., New York, Los Angeles)"
                        value={location}
                        onChange={locationChangeHandler}
                    />
                    <div className="flex items-center px-2 rounded-lg space-x-4 mx-auto">
                        <select
                            className="text-base text-gray-800 outline-none border-3 border-dark-100 px-4 py-2 rounded-lg focus:ring-primary-200 focus:ring-2 focus:border-none"
                            value={category}
                            onChange={categoryChangeHandler}>
                            <option value="for-sale">For Sale</option>
                            <option value="for-rent">For Rent</option>
                        </select>
                        <button
                            className="bg-dark-200 text-white text-base rounded-lg px-4 py-2"
                            onClick={searchBtnHandler}>
                            Search
                        </button>
                    </div>
                </div>
                {/* Result List */}
                <div className="mx-auto shadow-lg bg-white ms-3">
                    <ul role="list" className="divide-y divide-gray-100">
                        {listings.map((listing) => (
                            <ListingCard key={listing.id} listing={listing} />
                        ))}
                    </ul>
                </div>
                <div>
                    <button onClick={handlePreviousPage} disabled={page <= 1}>
                        Previous
                    </button>
                    <span>
                        Page {page} of {totalPages}
                    </span>
                    <button onClick={handleNextPage} disabled={page >= totalPages}>
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResultPage;
