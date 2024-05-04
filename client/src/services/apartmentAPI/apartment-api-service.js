import axios from 'axios';

const SERVER_API_URL = import.meta.env.VITE_SERVER_API_URL;
const APARTMENT_API_URL = `${SERVER_API_URL}/apartments`;
const api = axios.create({ withCredentials: true });

export const findAllApartments = async () => {
    try {
        const server_res = await api.get(APARTMENT_API_URL);
        const listings = server_res.data;
        return {
            success: true,
            listings: listings,
            totalCount: listings.length,
            error: null,
        };
    } catch (error) {
        console.error('Error fetching listings:', error);
        return {
            success: false,
            listings: [],
            totalCount: 0,
            error: error.response?.data || error.message,
        };
    }
};

export const findRentals = async ({ location, resultsPerPage, page }) => {
    try {
        const response = await api.get(`${APARTMENT_API_URL}/rentals`, {
            params: {
                location,
                resultsPerPage,
                page,
            },
        });
        // console.log(JSON.stringify(response));
        const listings = response.data;
        return listings;
    } catch (error) {
        console.error('Error fetching rental listings:', error);
    }
};
