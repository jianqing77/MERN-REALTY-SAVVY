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
import { formatRange, formatPets, formatPetsString } from '../../utils/formatUtils.jsx';
import Pagination from '../../components/Pagination.jsx';
import SearchBarLocation from '../search-bar/searchBarLocation.jsx';
import SearchBarRentals from '../search-bar/searchBarRentals.jsx';
import SearchBarSales from '../search-bar/searchBarSales.jsx';
import {
    findInternalRentalListingsThunk,
    findInternalSaleListingsThunk,
} from '../../services/internal-listing/internal-listing-thunk.js';

const ResultPage = () => {
    const searchLocation = useLocation();
    const { state } = searchLocation;

    const [location, setLocation] = useState('');
    const [category, setCategory] = useState('for-sale');

    const [priceRange, setPriceRange] = useState('');
    const [minPrice, setMinPrice] = useState(null);
    const [maxPrice, setMaxPrice] = useState(null);

    const [sizeRange, setSizeRange] = useState('');
    const [minSize, setMinSize] = useState(null);
    const [maxSize, setMaxSize] = useState(null);

    const [homeAgeRange, setHomeAgeRange] = useState('');
    const [minHomeAge, setMinHomeAge] = useState(null);
    const [maxHomeAge, setMaxHomeAge] = useState(null);

    const [selectedBeds, setSelectedBeds] = useState('');
    const [selectedBaths, setSelectedBaths] = useState('');

    const [selectedPets, setSelectedPets] = useState([]);
    const [internalListingsToShow, setInternalListingsToShow] = useState([]);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { listings, totalRecords, currentPage, resultsPerPage } = useSelector(
        (state) => state.apartments
    );

    const foundListings = useSelector(
        (state) => state['internal-listings'].foundListings
    );

    useEffect(() => {
        if (state) {
            setLocation(state.location);
            setCategory(state.category);
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

    const fetchSalePublicListing = (pageNum) => {
        let params = { location, page: pageNum };
        // filters for the public listings
        params = {
            ...params,
            prices: priceRange,
            homeSize: sizeRange,
            homeAge: homeAgeRange,
            bedrooms: selectedBeds,
            bathrooms: selectedBaths,
        };
        dispatch(fetchSalesThunk(params)); // Dispatching the first thunk for sales
    };

    const fetchRentalPublicListing = (pageNum) => {
        let params = { location, page: pageNum };
        // for public listings
        params = {
            ...params,
            prices: priceRange,
            homeSize: sizeRange,
            bedrooms: selectedBeds,
            bathrooms: selectedBaths,
            pets: formatPets(selectedPets),
        };
        dispatch(fetchRentalsThunk(params)); // Dispatching the first thunk for rentals
    };

    const fetchSaleInternalListing = async () => {
        let filters = { location };
        // filters for the internal listings
        filters = {
            ...filters,
            minPrice,
            maxPrice,
            minSize,
            maxSize,
            minHomeAge,
            maxHomeAge,
            minBeds: Number(selectedBeds),
            minBaths: Number(selectedBaths),
        };
        await dispatch(findInternalSaleListingsThunk(filters)); // Dispatching the second thunk for sales
    };

    const fetchRentalInternalListing = async () => {
        let filters = { location };
        filters = {
            ...filters,
            minPrice,
            maxPrice,
            minSize,
            maxSize,
            minBeds: Number(selectedBeds),
            minBaths: Number(selectedBaths),
            petPolicy: formatPetsString(selectedPets),
        };
        await dispatch(findInternalRentalListingsThunk(filters)); // Dispatching the second thunk for rentals
    };
    const fetchPageData = async (pageNum) => {
        const totalPublicPages = Math.ceil(totalRecords / resultsPerPage);
        console.log('totalPublicPages: ' + totalPublicPages);
        if (category === 'for-sale') {
            await fetchSalePublicListing(pageNum);
            if (pageNum <= totalPublicPages) {
                if (pageNum === totalPublicPages) {
                    // Calculate remaining slots in the last page of public listings
                    const remainingSlots =
                        resultsPerPage - (totalRecords % resultsPerPage);
                    console.log('remaining slots: ' + remainingSlots);
                    if (remainingSlots > 0 && remainingSlots < resultsPerPage) {
                        // Fetch internal listings to fill remaining slots
                        await fetchSaleInternalListing();
                        if (foundListings.length <= remainingSlots) {
                            setInternalListingsToShow(
                                foundListings.slice(0, remainingSlots)
                            );
                        }
                    }
                }
            } else {
                const offset =
                    totalRecords % resultsPerPage === 0
                        ? 0
                        : resultsPerPage - (totalRecords % resultsPerPage);
                const startIndex =
                    (pageNum - totalPublicPages - 1) * resultsPerPage + offset;
                const endIndex = startIndex + resultsPerPage;
                setInternalListingsToShow(foundListings.slice(startIndex, endIndex));
            }
        } else if (category === 'for-rent') {
            if (pageNum <= totalPublicPages) {
                await fetchRentalPublicListing(pageNum);
                if (pageNum <= totalPublicPages) {
                    if (pageNum === totalPublicPages) {
                        // Calculate remaining slots in the last page of public listings
                        const remainingSlots =
                            resultsPerPage - (totalRecords % resultsPerPage);
                        if (remainingSlots > 0 && remainingSlots < resultsPerPage) {
                            console.log('START FINDING INTERNAL: ' + remainingSlots);
                            // Fetch internal listings to fill remaining slots
                            await fetchRentalInternalListing();
                            console.log(
                                'foundListings: ' + JSON.stringify(foundListings)
                            );
                            if (foundListings.length <= remainingSlots) {
                                console.log(
                                    'FoundListings length is shorter than the remaining slots'
                                );
                                setInternalListingsToShow(foundListings);
                            }
                        }
                    }
                } else {
                    const offset =
                        totalRecords % resultsPerPage === 0
                            ? 0
                            : resultsPerPage - (totalRecords % resultsPerPage);
                    const startIndex =
                        (pageNum - totalPublicPages - 1) * resultsPerPage + offset;
                    const endIndex = startIndex + resultsPerPage;
                    setInternalListingsToShow(foundListings.slice(startIndex, endIndex));
                }
            }
        }
        navigate('/results', { state: { location, category } });
    };

    // Search Bar Handling
    const locationChangeHandler = (event) => {
        setLocation(event.target.value);
    };

    const categoryChangeHandler = (value) => {
        console.log('categoryChangeHandler before:' + category);
        setCategory(value);
        console.log('categoryChangeHandler after: ' + category);
    };

    const bedroomsChangeHandler = (value) => {
        setSelectedBeds(value);
    };

    const bathroomsChangeHandler = (value) => {
        setSelectedBaths(value);
    };

    const priceRangeChangeHandler = (range) => {
        const formattedPriceRange = formatRange(range); // Use the utility function to format the price range
        setPriceRange(formattedPriceRange); // Update the state with the new formatted price range
        // internal listings
        setMinPrice(Number(range.min));
        setMaxPrice(Number(range.max));
    };

    const sizeRangeChangeHandler = (range) => {
        const formattedSizeRange = formatRange(range);
        setSizeRange(formattedSizeRange);
        // internal listings
        setMinSize(Number(range.min));
        setMaxSize(Number(range.max));
    };

    const homeAgeRangeChangeHandler = (range) => {
        const formattedHomeAgeRange = formatRange(range);
        setHomeAgeRange(formattedHomeAgeRange);
        // internal listings
        setMinHomeAge(Number(range.min));
        setMaxHomeAge(Number(range.max));
    };

    const petChangeHandler = (selectedOptions) => {
        setSelectedPets(selectedOptions);
    };

    const searchBtnHandler = () => {
        setPage(1);
        fetchPageData(page);
    };

    // ================== Pagination ==================
    const [page, setPage] = useState(currentPage || 1);

    // calculate total pages
    const totalRecordsCombined = totalRecords + foundListings.length;

    const totalPages = Math.ceil(totalRecordsCombined / resultsPerPage);

    const pageChangeHandler = (newPage) => {
        setPage(newPage);
        setInternalListingsToShow([]);
        dispatch(setCurrentPage(newPage));
        fetchPageData(newPage);
    };

    return (
        <div className="grid grid-cols-6">
            <div className="col-span-3 ms-14">
                {/* Search Bar Location Input */}
                <SearchBarLocation
                    location={location}
                    onLocationChange={locationChangeHandler}
                />
                {/* Map Component */}
                <div className="mx-1">
                    <MapComponent
                        listings={listings.filter((listing) => listing.coordinates)}
                    />
                </div>
            </div>
            <div className="col-span-3 pe-12 ms-3">
                {/* Conditional Rendering of Search Bars based on Category */}
                {category === 'for-rent' ? (
                    <SearchBarRentals
                        initialCategory={category}
                        onCategoryChange={categoryChangeHandler}
                        onPriceRangeChange={priceRangeChangeHandler}
                        onSizeRangeChange={sizeRangeChangeHandler}
                        onBedroomsChange={bedroomsChangeHandler}
                        onBathroomsChange={bathroomsChangeHandler}
                        onPetsChange={petChangeHandler}
                        onSearch={searchBtnHandler}
                    />
                ) : (
                    <SearchBarSales
                        initialCategory={category}
                        onCategoryChange={categoryChangeHandler}
                        onPriceRangeChange={priceRangeChangeHandler}
                        onHomeAgeRangeChange={homeAgeRangeChangeHandler}
                        onSizeRangeChange={sizeRangeChangeHandler}
                        onBedroomsChange={bedroomsChangeHandler}
                        onBathroomsChange={bathroomsChangeHandler}
                        onSearch={searchBtnHandler}
                    />
                )}
                {/* Result List */}
                <div className="max-h-[90vh] overflow-y-auto mx-auto shadow-lg bg-white ms-3 mt-5">
                    <ul role="list" className="divide-y divide-gray-100">
                        {listings.map((listing) => (
                            <ListingCard
                                key={listing.id}
                                listing={listing}
                                type="external"
                            />
                        ))}
                        {internalListingsToShow &&
                            internalListingsToShow.map((listing) => (
                                <ListingCard
                                    key={listing._id}
                                    listing={{
                                        ...listing,
                                        price: listing.price.toString(),
                                        bedrooms: listing.features.bedrooms.toString(),
                                        bathrooms: listing.features.bathrooms.toString(),
                                        sqft: String(listing.features.sqft),
                                    }}
                                    type="internal"
                                />
                            ))}
                    </ul>
                </div>
                <div>
                    <Pagination
                        page={page}
                        totalPages={totalPages}
                        onPageChange={pageChangeHandler}
                    />
                </div>
            </div>
        </div>
    );
};

export default ResultPage;
