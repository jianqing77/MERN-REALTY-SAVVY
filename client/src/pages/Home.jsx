import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import WelcomePic from '../assets/auth-2.jpg';
import { Link, useNavigate } from 'react-router-dom';
import { useLoadScript, Autocomplete } from '@react-google-maps/api';
import ImageTiles from '../components/ImageTiles.jsx';

import {
    fetchRentalsThunk,
    fetchSalesThunk,
} from '../services/apartmentAPI/apartment-api-thunk.js';
import { resetFetchState } from '../reducers/apartmentAPI-reducer.js';
import { fetchUserProfileThunk } from '../services/user/user-thunk.js';

const Home = () => {
    const [category, setCategory] = useState('for-rent'); // Default category
    const [location, setLocation] = useState('');
    const { loading, error, dataFetched } = useSelector((state) => state.apartments);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    // update the profile attributes in user reducer
    useEffect(() => {
        dispatch(fetchUserProfileThunk());
    }, [dispatch]);

    const locationChangeHandler = (event) => {
        setLocation(event.target.value);
    };

    const categoryChangeHandler = (event) => {
        setCategory(event.target.value);
    };

    const topOfHomeRef = useRef(null);

    const scrollToTopOfHome = () => {
        if (topOfHomeRef.current) {
            topOfHomeRef.current.scrollIntoView();
            // topOfHomeRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const searchHandler = async (event) => {
        event.preventDefault();
        const action = category === 'for-sell' ? fetchSalesThunk : fetchRentalsThunk;
        dispatch(action({ location: location, currentPage: 1 }));
    };

    // Navigation Effect
    useEffect(() => {
        if (dataFetched && location) {
            navigate('/results', { state: { location, category } });
        }
    }, [dataFetched, navigate, location, category]);

    // State Reset Effect
    useEffect(() => {
        dispatch(resetFetchState());
    }, [dispatch]);

    if (loading) return <div>Loading apartments...</div>;
    if (error) return <div>An error occurred: {error}</div>;

    return (
        <div style={{ height: '100vh', position: 'relative' }}>
            <div
                style={{
                    backgroundImage: `url(${WelcomePic})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    zIndex: 1,
                }}
            />
            <div
                ref={topOfHomeRef}
                className="absolute inset-0 bg-dark-200 bg-opacity-30 z-20"></div>
            <div
                className="min-h-screen flex justify-center items-center"
                style={{ zIndex: 30, position: 'relative' }}>
                <div className="container mx-auto bg-dark-100 rounded-lg p-14">
                    <form onSubmit={searchHandler}>
                        <h1 className="text-center font-bold text-yellow-100 text-2xl sm:text-4xl">
                            Discover Your New Home
                        </h1>
                        <p className="mx-auto font-normal text-sm my-6 text-yellow-100 text-center">
                            Enter the location you are interested in and select whether
                            you are looking for properties to buy or rent.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center bg-white rounded-lg overflow-hidden sm:px-2 py-2 justify-between">
                            <input
                                className="border-none text-base text-gray-400 flex-grow flex-auto outline-none focus:ring-0"
                                type="text"
                                placeholder="Enter location (e.g., New York)"
                                value={location}
                                onChange={locationChangeHandler}
                            />
                            <div className="flex items-center px-2 rounded-lg space-x-4 mx-auto mt-2 sm:mt-0">
                                <select
                                    className="text-base text-gray-800 outline-none border-3 border-dark-100 px-4 py-2 rounded-lg focus:ring-primary-200 focus:ring-2 focus:border-none"
                                    value={category}
                                    onChange={categoryChangeHandler}>
                                    <option value="for-sale">For Sale</option>
                                    <option value="for-rent">For Rent</option>
                                </select>
                                <button className="bg-dark-200 text-white text-base rounded-lg px-4 py-2">
                                    Search
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <ImageTiles
                onCategoryChange={categoryChangeHandler}
                scrollToTopOfHome={scrollToTopOfHome}
            />
        </div>
    );
};

export default Home;
