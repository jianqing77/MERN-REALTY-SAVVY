import axios from 'axios';

const SERVER_API_URL = import.meta.env.VITE_SERVER_API_URL;
const LISTING_URL = `${SERVER_API_URL}/listing`; // configure axios to support cookies for passing credentials
const api = axios.create({ withCredentials: true });

export const findAllListings = async () => {
    try {
        const server_res = await api.get(LISTING_URL);
        return {
            success: true,
            listings: server_res.data.data,
            results: server_res.data.results,
        };
    } catch (error) {
        console.error('Error fetching listings:', error);
        return {
            success: false,
            listings: [],
            error: error.response?.data || error.message,
        };
    }
};

export const findListingById = async (listingId) => {
    try {
        const server_res = await api.get(`${LISTING_URL}/${listingId}`);
        const foundedListing = server_res.data;
        return foundedListing;
    } catch (error) {
        console.error('Error fetching listing by ID:', error);
        throw error;
    }
};

export const findListingByCurrentUser = async () => {
    try {
        // console.log('findListingByCurrentUser is called in service');
        // const server_res = await api.get(`${LISTING_URL}/current-user`);
        const server_res = await api.get(LISTING_URL);
        // console.log(
        //     'server response in service of findListingByCurrentUser: ' +
        //         JSON.stringify(server_res)
        // );
        const foundedListing = server_res.data;
        console.log('Found listing by current user in the service:', foundedListing);
        return foundedListing;
    } catch (error) {
        console.error('Error fetching listing by user ID:', error);
        throw error;
    }
};

export const createListing = async (listingData) => {
    try {
        console.log('Creating listing: listingData => ' + JSON.stringify(listingData));
        const server_res = await api.post(LISTING_URL, listingData);
        console.log('server_res => ' + JSON.stringify(server_res.data));
        const createdListing = server_res.data;
        return createdListing;
    } catch (error) {
        console.error('Error creating listing', error);
        throw error;
    }
};

export const updateListing = async ({ tarId, updatedData }) => {
    try {
        const server_res = await api.put(`${LISTING_URL}/${tarId}`, updatedData);
        const updatedListing = server_res.data;
        return updatedListing;
    } catch (error) {
        console.error('Error updating listing:', error);
        throw error;
    }
};

export const deleteListing = async (tarId) => {
    try {
        const server_res = await api.delete(`${LISTING_URL}/${tarId}`);
        const deletedListing = server_res.data;
        return deletedListing;
    } catch (error) {
        console.error('Error deleting listing:', error);
        throw error;
    }
};
