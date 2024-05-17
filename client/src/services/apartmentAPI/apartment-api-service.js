import axios from 'axios';

const SERVER_API_URL = import.meta.env.VITE_SERVER_API_URL;
const APARTMENT_API_URL = `${SERVER_API_URL}/apartments`;
const api = axios.create({ withCredentials: true });
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export const fetchRentals = async ({
    location,
    page,
    prices,
    homeSize,
    bedrooms,
    bathrooms,
    moveInDate,
    pets,
}) => {
    try {
        const params = {
            location,
            page,
            prices, // other parameters as optional
            homeSize,
            bedrooms,
            bathrooms,
            moveInDate,
            pets,
        };
        // filter out undefined or null parameters from the params object
        Object.keys(params).forEach(
            (key) => params[key] === undefined && delete params[key]
        );

        const response = await api.get(`${APARTMENT_API_URL}/rentals`, { params });
        const result = {
            searchLocation: response.data.searchLocation,
            resultsPerPage: response.data.resultsPerPage,
            currentPage: response.data.currentPage,
            totalRecords: response.data.totalRecords,
            listings: response.data.listings,
        };
        return result;
    } catch (error) {
        console.error('Error fetching rental listings:', error);
        throw error;
    }
};

export const fetchSales = async ({ location, page }) => {
    try {
        const response = await api.get(`${APARTMENT_API_URL}/sales`, {
            params: {
                location,
                page,
            },
        });
        const result = {
            searchLocation: response.data.searchLocation,
            resultsPerPage: response.data.resultsPerPage,
            currentPage: response.data.currentPage, // Current page number
            totalRecords: response.data.totalRecords, // Total number of pages
            listings: response.data.listings, // Array of listings
        };
        return result;
    } catch (error) {
        console.error('Error fetching sales listings:', error);
    }
};

export const fetchCoordinates = async (address) => {
    // console.log('Fetching coordinates in service:', address);
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
    )}&key=${GOOGLE_MAPS_API_KEY}`;
    // console.log('Requesting URL:', url);
    const response = await fetch(url);
    const data = await response.json();
    // console.log('API Response:', data);
    if (data.status === 'OK') {
        // console.log(data.results[0].geometry.location);
        return data.results[0].geometry.location;
    } else {
        throw new Error('Geocoding failed: ' + data.status);
    }
};
