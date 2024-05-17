import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import {
    fetchRentalsThunk,
    fetchSalesThunk,
    fetchCoordinatesThunk, // Make sure you import this thunk
} from '../../services/apartmentAPI/apartment-api-thunk.js';
import ListingCard from './listingCard.jsx';
import { setCurrentPage } from '../../reducers/apartmentAPI-reducer.js';
import MapComponent from './mapCluster.jsx';
import DropdownMultiple from '../../components/DropDownMultiple.jsx';
import DropdownSingle from '../../components/DropDownSingle.jsx';
import { formatRange, formatPets } from './formatUtils.jsx';
import DropdownRange from '../../components/DropDownRange.jsx';

const ResultPage = () => {
    const searchLocation = useLocation();
    const { state } = searchLocation;

    const [location, setLocation] = useState('');
    const [category, setCategory] = useState('for-sale');
    const [priceRange, setPriceRange] = useState('');
    const [sizeRange, setSizeRange] = useState('');
    const [selectedBeds, setSelectedBeds] = useState('');
    const [selectedBaths, setSelectedBaths] = useState('');
    const [selectedPets, setSelectedPets] = useState([]);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { listings, totalRecords, currentPage, resultsPerPage } = useSelector(
        (state) => state.apartments
    );

    // Pagination
    const [page, setPage] = useState(currentPage || 1);
    // calculate total pages
    const totalPages = Math.ceil(totalRecords / resultsPerPage);

    useEffect(() => {
        if (state) {
            setLocation(state.location);
            setCategory(state.category);
            console.log(state.category);
        }
    }, [state]);

    useEffect(() => {
        if (listings.length > 0) {
            listings.forEach((listing) => {
                if (!listing.coordinates) {
                    const fullAddress = `${listing.location.address}, ${listing.location.city}, ${listing.location.state}, ${listing.location.zipCode}`;
                    dispatch(fetchCoordinatesThunk({ address: fullAddress }));
                }
            });
        }
    }, [listings, dispatch]);

    const fetchPageData = (pageNum) => {
        let params = { location, page: pageNum };

        if (category === 'for-sale') {
            params = { ...params };
        } else if (category === 'for-rent') {
            // format the pets
            const formattedPets = formatPets(selectedPets);
            params = {
                ...params,
                prices: priceRange,
                homeSize: sizeRange,
                bedrooms: selectedBeds,
                bathrooms: selectedBaths,
                pets: formattedPets,
            };
            console.log('category: ' + category);
            console.log('params: ' + JSON.stringify(params));
        }

        const action = category === 'for-sale' ? fetchSalesThunk : fetchRentalsThunk;
        dispatch(action(params));
        navigate('/results', { state: { location, category } });
    };

    // Search Bar Handling
    const locationChangeHandler = (event) => {
        setLocation(event.target.value);
    };

    const categoryOptions = [
        { label: 'For Rent', value: 'for-rent' },
        { label: 'For Sale', value: 'for-sale' },
    ];

    const bedroomsOptions = [
        { label: '0+', value: '0' },
        { label: '1+', value: '1' },
        { label: '2+', value: '2' },
        { label: '3+', value: '3' },
        { label: '4+', value: '4' },
        { label: '5+', value: '5' },
    ];

    const bathroomsOptions = [
        { label: '0+', value: '0' },
        { label: '1+', value: '1' },
        { label: '2+', value: '2' },
        { label: '3+', value: '3' },
        { label: '4+', value: '4' },
        { label: '5+', value: '5' },
    ];

    const categoryChangeHandler = (value) => {
        console.log('categoryChangeHandler before:' + category);
        setCategory(value);
        console.log('categoryChangeHandler after: ' + category);
    };

    const bedroomsChangeHandler = (value) => {
        console.log('bedsChangeHandler before:' + selectedBeds);
        setSelectedBeds(value);
        console.log('bedsChangeHandler after:' + selectedBeds);
    };

    const bathroomsChangeHandler = (value) => {
        console.log('bedsChangeHandler before:' + selectedBaths);
        setSelectedBaths(value);
        console.log('bedsChangeHandler after:' + selectedBaths);
    };

    const priceRangeChangeHandler = (range) => {
        const formattedPriceRange = formatRange(range); // Use the utility function to format the price range
        setPriceRange(formattedPriceRange); // Update the state with the new formatted price range
        console.log('Updated Price Range:', formattedPriceRange);
    };

    const sizeRangeChangeHandler = (range) => {
        const formattedSizeRange = formatRange(range);
        setSizeRange(formattedSizeRange);
        console.log('Updated size Range:', formattedSizeRange);
    };

    const petChangeHandler = (selectedOptions) => {
        console.log('selectedOptions: ' + JSON.stringify(selectedOptions));
        setSelectedPets(selectedOptions);
    };

    const nextBtnHandler = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        dispatch(setCurrentPage(nextPage));
        fetchPageData(nextPage);
    };

    const prevBtnHandler = () => {
        if (page > 1) {
            const prevPage = page - 1;
            setPage(prevPage);
        }
    };

    const searchBtnHandler = () => {
        setPage(1);
        fetchPageData(page);
    };
    return (
        <div className="grid grid-cols-6">
            <div className="col-span-6  ps-10 pe-20">
                {/* Search Bar */}
                <div className=" sm:flex items-center bg-white rounded-lg overflow-hidden py-4 justify-between">
                    <input
                        className="text-base text-gray-400 flex-grow outline-none border-3 ms-3 border-dark-100 rounded-lg focus:ring-primary-200 focus:ring-2 focus:border-none"
                        type="text"
                        placeholder="Enter location (e.g., New York, Los Angeles)"
                        value={location}
                        onChange={locationChangeHandler}
                    />
                    <div className="flex items-center px-2 rounded-lg space-x-4 mx-auto">
                        <DropdownSingle
                            label="Category"
                            initialValue={state.category}
                            options={categoryOptions}
                            onSelectionChange={categoryChangeHandler}
                        />
                        <DropdownRange
                            buttonLabel="Price"
                            onRangeChange={priceRangeChangeHandler}
                        />
                        <DropdownRange
                            buttonLabel="Size"
                            onRangeChange={sizeRangeChangeHandler}
                        />
                        <DropdownSingle
                            label="Bedrooms"
                            options={bedroomsOptions}
                            onSelectionChange={bedroomsChangeHandler}
                        />
                        <DropdownSingle
                            label="Bathrooms"
                            options={bathroomsOptions}
                            onSelectionChange={bathroomsChangeHandler}
                        />
                        <DropdownMultiple
                            options={['Dog', 'Cat', 'No Pets Allowed']}
                            buttonLabel="Pet"
                            onSelectionChange={petChangeHandler}
                        />
                        <button
                            className="bg-dark-200 text-white text-base rounded-lg px-4 py-2"
                            onClick={searchBtnHandler}>
                            Search
                        </button>
                    </div>
                </div>
            </div>
            <div className="col-span-3">
                <MapComponent
                    listings={listings.filter((listing) => listing.coordinates)}
                />
            </div>
            <div className="col-span-3 pe-20">
                {/* Result List */}
                <div className="max-h-[90vh] overflow-y-auto mx-auto shadow-lg bg-white ms-3">
                    <ul role="list" className="divide-y divide-gray-100">
                        {listings.map((listing) => (
                            <ListingCard key={listing.id} listing={listing} />
                        ))}
                    </ul>
                </div>
                <div>
                    <button onClick={prevBtnHandler} disabled={page <= 1}>
                        Previous
                    </button>
                    <span>
                        Page {page} of {totalPages}
                    </span>
                    <button onClick={nextBtnHandler} disabled={page >= totalPages}>
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResultPage;
