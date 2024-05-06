import axios from 'axios';

const SERVER_API_URL = import.meta.env.VITE_SERVER_API_URL;
const APARTMENT_API_URL = `${SERVER_API_URL}/apartments`;
const api = axios.create({ withCredentials: true });

export const findRentals = async ({ location, resultsPerPage, page }) => {
    try {
        const response = await api.get(`${APARTMENT_API_URL}/rentals`, {
            params: {
                location,
                resultsPerPage,
                page,
            },
        });
        const listings = response.data;
        return listings;
    } catch (error) {
        console.error('Error fetching rental listings:', error);
    }
};

export const findSales = async ({ location, page }) => {
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
