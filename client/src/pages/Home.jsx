import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import WelcomePic from '../assets/auth-2.jpg';
import { Link, useNavigate } from 'react-router-dom';
import { useLoadScript, Autocomplete } from '@react-google-maps/api';

import {
    fetchRentalsThunk,
    fetchSalesThunk,
} from '../services/apartmentAPI/apartment-api-thunk.js';

const libraries = ['places'];
const GOOGLE_MAPS_API_KEY = import.meta.env.GOOGLE_MAPS_API_KEY;

const Home = () => {
    const [category, setCategory] = useState('for-sale'); // Default category
    const [location, setLocation] = useState('');
    const { loading, error, dataFetched } = useSelector((state) => state.apartments);

    const navigate = useNavigate(); // to navigate to result page
    const dispatch = useDispatch();

    const locationChangeHandler = (event) => {
        setLocation(event.target.value);
    };

    const categoryChangeHandler = (event) => {
        setCategory(event.target.value);
    };

    const searchHandler = async (event) => {
        event.preventDefault();
        const action = category === 'for-sale' ? fetchSalesThunk : fetchRentalsThunk;
        dispatch(action({ location: location, currentPage: 1 }));
    };

    useEffect(() => {
        if (dataFetched) {
            navigate('/results', { state: { location, category } });
        }
    }, [dataFetched, navigate, location, category]);

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
            <div className="absolute inset-0 bg-dark-200 bg-opacity-30 z-20"></div>
            <div
                className="min-h-screen flex justify-center items-center"
                style={{ zIndex: 30, position: 'relative' }}>
                <div className="container mx-auto bg-dark-100 rounded-lg p-14">
                    <form onSubmit={searchHandler}>
                        <h1 className="text-center font-bold text-yellow-100 text-4xl">
                            Discover Your New Home
                        </h1>
                        <p className="mx-auto font-normal text-sm my-6 text-yellow-100 text-center">
                            Enter the location you are interested in and select whether
                            you are looking for properties to buy or rent.
                        </p>
                        <div className="sm:flex items-center bg-white rounded-lg overflow-hidden px-2 py-1 justify-between">
                            <input
                                className="text-base text-gray-400 flex-grow outline-none px-2 border-none focus:ring-0"
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
                                <button className="bg-dark-200 text-white text-base rounded-lg px-4 py-2">
                                    Search
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Home;
